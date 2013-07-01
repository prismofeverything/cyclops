var cyclops = function() {
  function interpolate(x0, p, x, y, left, right, tangentLeft, tangentRight) {
    var dx, dy, a, b, s, t;
    
    dx = x[p+1] - x[p];
    dy = y[p+1] - y[p];
    tanL = tangentLeft[p];
    tanR = tangentRight[p+1];

    t = (x0-x[p]) / dx;
    it = (1 - t);

    xleftp = x[p] + (left[p] * dx);
    xrightp = x[p+1] - (right[p+1] * dx);

    yleftp = (tanL && !isNaN(tanL)) ? y[p] + tanL : y[p];
    yrightp = (tanR && !isNaN(tanR)) ? y[p+1] + tanR : y[p+1];
    
    var xo = it*it*it*x[p] + 3*it*it*t*xleftp + 3*it*t*t*xrightp + t*t*t*x[p+1];
    var yo = it*it*it*y[p] + 3*it*it*t*yleftp + 3*it*t*t*yrightp + t*t*t*y[p+1];

    return [xo, yo];
  }

  function buildCurve(x, y, left, right, tangentLeft, tangentRight) {
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
        return interpolate(t, p, x, y, left, right, tangentLeft, tangentRight);
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
    var xs = [];
    var ys = [];
    var left = [];
    var right = [];
    var tangentLeft = [];
    var tangentRight = [];
    var bounds = [];
    var i, j;

    ylength = data[0].value.length || 1;
    for (j = 0; j < ylength; j++) {
      ys.push([]);
      tangentLeft.push([]);
      tangentRight.push([]);
    }

    for (i = 0; i < data.length; i++) {
      var keyframe = data[i];
      xs.push(keyframe.time);
      left.push(keyframe.out.influence * 0.01);
      right.push(keyframe.in.influence * 0.01);

      if (keyframe.value.length) {
        for (j = 0; j < ylength; j++) {
          ys[j].push(keyframe.value[j]);
          tangentLeft[j].push(keyframe.hasTangents ? keyframe.out.tangent[j] : null);
          tangentRight[j].push(keyframe.hasTangents ? keyframe.in.tangent[j] : null);
        }
      } else {
        ys[0].push(keyframe.value);
        tangentLeft[0].push(keyframe.out.tangent);
        tangentRight[0].push(keyframe.in.tangent);
      }
    }

    for (j = 0; j < ylength; j++) {
      bounds[j] = findBounds(ys[j]);
      ys[j] = boundData(ys[j], bounds[j]);
      tangentLeft[j] = scaleData(tangentLeft[j], bounds[j]);
      tangentRight[j] = scaleData(tangentRight[j], bounds[j]);
    }

    return {
      x: normalizeData(xs), 
      y: ys, 
      left: left, 
      right: right,
      tangentLeft: tangentLeft,
      tangentRight: tangentRight
    };
  }

  function dimensionalInterpolation(values, epsilon) {
    var curves = [];
    for (var j = 0; j < values.y.length; j++) {
      var fit = buildCurve(values.x, values.y[j], values.left, values.right, values.tangentLeft[j], values.tangentRight[j]);
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
        var generate = extractProperty(data[key].keys);
        curve[key] = {func: generate};
      }
    }

    return curve;
  }

  return {
    interpolate: interpolate,
    buildCurve: buildCurve,
    findIndex: findIndex,
    normalizeData: normalizeData,
    extractValues: extractValues,
    dimensionalInterpolation: dimensionalInterpolation,
    extractProperty: extractProperty,
    loadCurve: loadCurve
  }
} ();
