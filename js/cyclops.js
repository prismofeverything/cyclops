var cyclops = function() {
  function interpolate(x0, p, x, y, left, right) {
    var dx, dy, a, b, s, t;
    
    dx = x[p+1] - x[p];
    dy = y[p+1] - y[p];

    t = (x0-x[p]) / dx;
    it = (1 - t);

    xleftp = x[p] + (left[p] * dx);
    xrightp = x[p+1] - (right[p+1] * dx);
    
    var xo = it*it*it*x[p] + 3*it*it*t*xleftp + 3*it*t*t*xrightp + t*t*t*x[p+1];
    var yo = it*it*it*y[p] + 3*it*it*t*y[p] + 3*it*t*t*y[p+1] + t*t*t*y[p+1];

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
        return interpolate(t, p, x, y, left, right);
      }

      var n = t.length, i, ret = Array(n);
      for(i = n-1; i !== -1; --i) {
        ret[i] = at(t[i]);
      }
      return ret;
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
  
  function normalizeData(input){
    var min = 1000000000;
    var max = 0;
    var output = [];

    for(var i = 0; i < input.length; i++){
      if(min > input[i]){
        min = input[i];
      }
      if(max < input[i]){
        max = input[i];
      }
    }

    for(var i = 0; i < input.length; i++){
      output.push( (input[i] - min) / (max - min) );
    }

    return output;
  }

  function extractValues(data) {
    var xs = [];
    var ys = [];
    var left = [];
    var right = [];
    var i,j;

    ylength = data[0].value.length || 1;
    for (j = 0; j < ylength; j++) {
      ys.push([]);
    }

    for (i = 0; i < data.length; i++) {
      var keyframe = data[i];
      xs.push(keyframe.time);
      right.push(keyframe.in.influence * 0.01);
      left.push(keyframe.out.influence * 0.01);

      if (keyframe.value.length) {
        for (j = 0; j < ylength; j++) {
          ys[j].push(keyframe.value[j]);
        }
      } else {
        ys[0].push(keyframe.value);
      }
    }

    for (j = 0; j < ylength; j++) {
      ys[j] = normalizeData(ys[j]);
    }

    return {
      x: normalizeData(xs), 
      y: ys, 
      left: left, 
      right: right
    };
  }

  function dimensionalInterpolation(values, epsilon) {
    var curves = [];
    for (var j = 0; j < values.y.length; j++) {
      var fit = buildCurve(values.x, values.y[j], values.left, values.right);
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

  function loadTween(data) {
    var tween = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var generate = extractProperty(data[key].keys);
        tween[key] = {func: generate};
      }
    }

    return tween;
  }

  return {
    interpolate: interpolate,
    buildCurve: buildCurve,
    findIndex: findIndex,
    normalizeData: normalizeData,
    extractValues: extractValues,
    dimensionalInterpolation: dimensionalInterpolation,
    extractProperty: extractProperty,
    loadTween: loadTween
  }
} ();
