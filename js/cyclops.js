var cyclops = function() {
  function plus(a, b) {
    var len = Math.min(a.length, b.length);
    var c = new Array(len);
    for (var l = 0; l < len; l++) {
      c[l] = a[l] + b[l];
    }
    return c;
  }

  function minus(a, b) {
    var len = Math.min(a.length, b.length);
    var c = new Array(len);
    for (var l = 0; l < len; l++) {
      c[l] = a[l] - b[l];
    }
    return c;
  }

  function scale(a, n) {
    var len = a.length;
    var c = new Array(len);
    for (var l = 0; l < len; l++) {
      c[l] = n * a[l];
    }
    return c;
  }

  function magnitude(c) {
    var sum = 0;
    for (var l = 0; l < c.length; l++) {
      sum += c[l] * c[l];
    }
    return Math.sqrt(sum);
  }

  function zeros(n) {
    var zero = new Array(n);
    for (var z = 0; z < n; z++) {
      zero[z] = 0;
    }
    return zero;
  }

  function interpolateLinear(index, left, right) {
    var dx = right.x - left.x;
    var t = (index - left.x) / dx;
    var s = 1 - t;

    var A = scale(left.y, s);
    var D = scale(right.y, t);

    return plus(A, D);
  }

  function interpolateCubic(index, left, right) {
    var dx = right.x - left.x;
    var t = (index - left.x) / dx;
    var s = 1 - t;

    var leftP = plus(left.y, left.tangent);
    var rightP = plus(right.y, right.tangent);

    var A = scale(left.y, s*s*s);
    var B = scale(leftP, 3*s*s*t);
    var C = scale(rightP, 3*s*t*t);
    var D = scale(right.y, t*t*t);

    return plus(A, plus(B, plus(C, D)));
  }

  function interpolateQuartic(index, left, right) {
    var dx = right.x - left.x;
    var t = (index - left.x) / dx;
    var s = 1 - t;

    var leftP = plus(left.y, left.tangent);
    var leftQ = plus(left.y, left.control);
    var rightQ = plus(right.y, right.control);
    var rightP = plus(right.y, right.tangent);

    var A = scale(left.y, s*s*s*s*s);
    var B = scale(leftP, 5*s*s*s*s*t);
    var C = scale(leftQ, 10*s*s*s*t*t);
    var D = scale(rightQ, 10*s*s*t*t*t);
    var E = scale(rightP, 5*s*t*t*t*t);
    var F = scale(right.y, t*t*t*t*t);

    return plus(A, plus(B, plus(C, plus(D, plus(E, F)))));
  }

  function interpolateHermite(index, left, right) {
    var dx = right.x - left.x;
    var t = (index - left.x) / dx;
    var s = 1 - t;
    
    var leftP = plus(left.y, left.tangent);
    var rightP = plus(right.y, right.tangent);

    var A = scale(left.y, s*s*(1 + 2*t));
    var D = scale(right.y, t*t*(1 + 2*s));
    var U = scale(leftP, s*s*t);
    var V = scale(rightP, s*t*t);

    return plus(A, plus(D, minus(U, V)));
  }

  function buildCurve(values) {
    values.position = {left: [], right: []};
    values.speed = {left: [], right: []};
    values.arclength = [];

    for (var p = 0; p < values.x.length - 1; p++) {
      var dx = values.x[p+1] - values.x[p];
      var dy = minus(values.y[p+1], values.y[p]);
      var mag = magnitude(dy);
      // var mag = dy[0];
      var speedL = values.left.speed[p] - dy[0];
      var speedR = -values.right.speed[p+1] + dy[0];
      var tanL = dx * values.left.influence[p] * speedL / mag;
      var tanR = dx * values.right.influence[p+1] * speedR / mag;

      var speedLeft = {
        x: values.x[p],
        y: [values.x[p]],
        tangent: [tanL]
      }
      var speedRight = {
        x: values.x[p+1],
        y: [values.x[p+1]],
        tangent: [tanR]
      }

      var positionLeft = {
        x: values.x[p],
        y: values.y[p],
        tangent: values.left.tangent[p]
      }
      var positionRight = {
        x: values.x[p+1],
        y: values.y[p+1],
        tangent: values.right.tangent[p+1]
      }

      values.position.left.push(positionLeft);
      values.position.right.push(positionRight);

      values.speed.left.push(speedLeft);
      values.speed.right.push(speedRight);
    }

    return function(t) {
      var n = values.x.length;
      var p, q, mid;
      p = 0;
      q = n-1;
      while(q-p>1) {
        mid = Math.floor((p+q)/2);
        if(values.x[mid] <= t) p = mid;
        else q = mid;
      }

      var index = interpolateLinear(t, 
                                    values.speed.left[p], 
                                    values.speed.right[p])[0];

      if (values.left.type[p] == "linear") {
        return interpolateLinear(index, 
                                 values.position.left[p], 
                                 values.position.right[p]);
      } else {
        return interpolateCubic(index, 
                                values.position.left[p], 
                                values.position.right[p]);
      }
    }
  }

  function findBounds(input) {
    var min = 1000000000;
    var max = 0;
    for(var i = 0; i < input.length; i++){
      if(min > input[i]){
        min = input[i];
      }
      if(max < input[i]){
        max = input[i];
      }
    }

    return [min, max];
  }

  function boundData(input, bounds) {
    var output = [];
    var min = bounds[0];
    var max = bounds[1];

    for(var i = 0; i < input.length; i++){
      output.push( (input[i] - min) / (max - min) );
    }

    return output;
  }

  function scaleData(input, bounds) {
    var output = [];
    var scale = 1.0 / (bounds[1] - bounds[0]);

    for(var i = 0; i < input.length; i++){
      output.push(input[i] * scale);
    }

    return output;
  }

  function normalizeData(input) {
    var bounds = findBounds(input);
    return boundData(input, bounds);
  }

  function gatherValues(data) {
    function buildDirectional() {
      return {
        type: [],
        influence: [],
        speed: [],
        tangent: []
      };
    }

    function pushDirectionals(collector, directionals) {
      collector.influence.push(directionals.influence * 0.01);
      collector.type.push(directionals.type);
      collector.speed.push(directionals.speed);
      collector.tangent.push(directionals.tangent);
      return collector;
    }

    var keys = data.keys;
    var xs = [];
    var ys = [];
    var left = buildDirectional();
    var right = buildDirectional();
    var min = data.min;
    var max = data.max;
    var bounds = [min, max];
    var i, j;

    for (i = 0; i < keys.length; i++) {
      var keyframe = keys[i];
      xs.push(keyframe.time);
      ys.push(keyframe.value.length ? keyframe.value : [keyframe.value]);
      pushDirectionals(right, keyframe.in);
      pushDirectionals(left, keyframe.out);
    }

    return {
      x: xs,
      y: ys,
      left: left,
      right: right,
      bounds: bounds,
      start: data.startTime,
      duration: data.duration
    };
  }

  function dimensionalInterpolation(values, epsilon) {
    var curve = buildCurve(values);
    values.original = curve;
    values.func = function(t) {
      var index = t * values.duration + values.start;
      return curve(index);
    }
    return values;
  }

  function gatherProperty(data) {
    var values = gatherValues(data);
    var generate = dimensionalInterpolation(values);
    return generate;
  }

  function loadVectorCurve(data) {
    var curve = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var generate = gatherProperty(data[key]);
        curve[key] = generate;
      }
    }

    return curve;
  }

  return {
    interpolateLinear: interpolateLinear,
    interpolateCubic: interpolateCubic,
    interpolateQuartic: interpolateQuartic,
    interpolateHermite: interpolateHermite,
    buildCurve: buildCurve,
    normalizeData: normalizeData,
    gatherValues: gatherValues,
    gatherProperty: gatherProperty,
    dimensionalInterpolation: dimensionalInterpolation,
    loadVectorCurve: loadVectorCurve
  }
} ();
