var cyclops = function() {
  function interpolateCubic(x0, p, x, y, left, right) {
    var dx, dy, t;
    
    dx = x[p+1] - x[p];
    dy = y[p+1] - y[p];
    tanL = left.tangent[p];
    tanR = right.tangent[p+1];
    speedL = left.speed[p];
    speedR = right.speed[p+1];

    t = (x0-x[p]) / dx;
    it = 1-t;

    xleftp = x[p] + (left.influence[p] * dx) + (speedL * tanL * dx);
    xrightp = x[p+1] - (right.influence[p+1] * dx) + (speedR * tanR * dx);

    // xleftp = x[p] + (left.influence[p] * dx) + (speedL * tanL);
    // xrightp = x[p+1] - (right.influence[p+1] * dx) + (speedR * tanR);

    // xleftp = x[p] + (left.influence[p] * dx) + (speedL * tanL * dx);
    // xrightp = x[p+1] - (right.influence[p+1] * dx) + (speedR * tanR * dx);

    // xleftp = x[p] + (left.influence[p] * dx / speedL);
    // xrightp = x[p+1] - (right.influence[p+1] * dx / speedR);

    yleftp = (tanL && !isNaN(tanL)) ? y[p] + tanL : y[p];
    yrightp = (tanR && !isNaN(tanR)) ? y[p+1] + tanR : y[p+1];
    
    var xo = it*it*it*x[p] + 3*it*it*t*xleftp + 3*it*t*t*xrightp + t*t*t*x[p+1];
    var yo = it*it*it*y[p] + 3*it*it*t*yleftp + 3*it*t*t*yrightp + t*t*t*y[p+1];

    return [xo, yo];
  }

  function interpolateLinear(x0, p, x, y) {
    var dx, dy, t;
    
    dx = x[p+1] - x[p];
    dy = y[p+1] - y[p];
    t = (x0-x[p]) / dx;
    it = 1-t;
    
    var xo = it*x[p] + t*x[p+1];
    var yo = it*y[p] + t*y[p+1];

    return [xo, yo];
  }

  function buildCurve(x, y, left, right) {
    return function(t) {
      if(typeof t === "number") {
        var n = x.length;
        var p, q, mid, a, b;
        p = 0;
        q = n-1;
        while(q-p>1) {
          mid = Math.floor((p+q)/2);
          if(x[mid] <= t) p = mid;
          else q = mid;
        }
        if (left.type[p] == "linear") {
          return interpolateLinear(t, p, x, y);
        } else {
          return interpolateCubic(t, p, x, y, left, right);
        }
      }
    }
  }

  function findIndex(at, x, epsilon) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    epsilon = epsilon ? epsilon : 0.001;

    var guess = x;
    var near = at(guess);
    var index = near[0];
    var diff = x - index;

    while (Math.abs(diff) > epsilon) {
      guess = guess + diff * 0.5;
      near = at(guess);
      index = near[0];
      diff = x - index;
    }

    return guess;
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

  function extractValues(data) {
    var keys = data.keys;
    var xs = [];
    var ys = [];

    var left = {
      type: [],
      influence: [],
      speed: [],
      tangent: []
    };

    var right = {
      type: [],
      influence: [],
      speed: [],
      tangent: []
    };

    var bounds = [];
    var i, j;

    ylength = keys[0].value.length || 1;
    for (j = 0; j < ylength; j++) {
      ys.push([]);
      left.tangent.push([]);
      right.tangent.push([]);
    }

    for (i = 0; i < keys.length; i++) {
      var keyframe = keys[i];
      xs.push(keyframe.time);
      left.influence.push(keyframe.out.influence * 0.01);
      right.influence.push(keyframe.in.influence * 0.01);
      left.type.push(keyframe.out.type);
      right.type.push(keyframe.in.type);
      left.speed.push(keyframe.out.speed);
      right.speed.push(keyframe.in.speed);

      if (keyframe.value.length) {
        for (j = 0; j < ylength; j++) {
          ys[j].push(keyframe.value[j]);
          left.tangent[j].push(keyframe.hasTangents ? keyframe.out.tangent[j] : null);
          right.tangent[j].push(keyframe.hasTangents ? keyframe.in.tangent[j] : null);
        }
      } else {
        ys[0].push(keyframe.value);
        left.tangent[0].push(keyframe.out.tangent);
        right.tangent[0].push(keyframe.in.tangent);
      }
    }

    for (j = 0; j < ylength; j++) {
      if (data.min && data.max) {
        bounds[j] = [data.min[j], data.max[j]];
      } else {
        bounds[j] = findBounds(ys[j]);
      }

      ys[j] = boundData(ys[j], bounds[j]);
      left.tangent[j] = scaleData(left.tangent[j], bounds[j]);
      right.tangent[j] = scaleData(right.tangent[j], bounds[j]);
    }

    left.speed = scaleData(left.speed, bounds[0]);
    right.speed = scaleData(right.speed, bounds[0]);

    return {
      x: normalizeData(xs),
      y: ys,
      left: left,
      right: right,
      bounds: bounds,
      start: data.startTime,
      duration: data.duration
    };
  }

  function dimensionalInterpolation(values, epsilon) {
    var curves = [];
    for (var j = 0; j < values.y.length; j++) {
      var fit = buildCurve(values.x,
                           values.y[j],
                           {type: values.left.type,
                            speed: values.left.speed,
                            influence: values.left.influence,
                            tangent: values.left.tangent[j]},
                           {type: values.right.type,
                            speed: values.right.speed,
                            influence: values.right.influence,
                            tangent: values.right.tangent[j]});
      curves.push(fit);
    }

    return function(x) {
      var vector = [];
      var index = findIndex(curves[0], x, epsilon);
      for (j = 0; j < values.y.length; j++) {
        var value = curves[j](index)[1];
        vector.push(value);
      }

      return vector;
    }
  }

  function extractProperty(data) {
    var values = extractValues(data);
    var generate = dimensionalInterpolation(values);

    return generate;
  }

  function loadCurve(data) {
    var curve = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var generate = extractProperty(data[key]);
        curve[key] = {func: generate};
      }
    }

    return curve;
  }

  return {
    interpolateCubic: interpolateCubic,
    interpolateLinear: interpolateLinear,
    buildCurve: buildCurve,
    findIndex: findIndex,
    normalizeData: normalizeData,
    extractValues: extractValues,
    dimensionalInterpolation: dimensionalInterpolation,
    extractProperty: extractProperty,
    loadCurve: loadCurve
  }
} ();
