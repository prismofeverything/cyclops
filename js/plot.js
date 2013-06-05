function curve(x, y, left, right) {
  function interpolateOriginal(x0,p) {
    var dx, dy, a, b, s, t;
    
    dx = x[p+1] - x[p];
    dy = y[p+1] - y[p];
    a = (left[p] * dx) - dy;
    b = (right[p+1] * -dx) + dy;

    t = (x0-x[p]) / dx;
    s = t * (1 - t);

    return (1 - t)*y[p] + t*y[p+1] + a*s*(1 - t) + b*s*t;
  }

  function interpolateQuadratic(x0,p) {
    var dx, dy, a, b, s, t;
    
    dx = x[p+1] - x[p];
    dy = y[p+1] - y[p];
    a = (left[p] * dx)
    b = (right[p+1] * dx)

    t = (x0-x[p]) / dx;
    s = t * (1 - t);

    totalp = left[p] + right[p+1];
    leftp = left[p] / totalp;
    rightp = right[p+1] / totalp;

    return (1 - t)*(1 - t)*y[p] + t*t*y[p+1] + 2*t*(1 - t)*y[p];
  }

  function interpolateCubic(x0,p) {
    var dx, dy, a, b, s, t;
    
    dx = x[p+1] - x[p];
    dy = y[p+1] - y[p];

    t = (x0-x[p]) / dx;
    it = 1 - t;
    leftp = left[p]*y[p] + (1 - left[p])*y[p+1];
    rightp = (1 - right[p+1])*y[p] + right[p+1]*y[p+1];

    return it*it*it*y[p] + 3*it*it*t*y[p] + 3*it*t*t*y[p+1] + t*t*t*y[p+1];
  }

  function interpolateRational(x0,p) {
    var dx, dy, a, b, s, t;
    
    dx = x[p+1] - x[p];
    dy = y[p+1] - y[p];

    t = (x0-x[p]) / dx;
    it = 1 - t;
    var leftp = left[p];// - dy;
    var rightp = right[p+1];//+ dy;

    var num = it*it*it*y[p] + 3*it*it*t*y[p]*leftp + 3*it*t*t*y[p+1]*rightp + t*t*t*y[p+1];
    var denom = it*it*it + 3*it*it*t*leftp + 3*it*t*t*rightp + t*t*t;
    return num / denom;
  }

  function interpolate2d(x0,p) {
    var dx, dy, a, b, s, t;
    
    dx = x[p+1] - x[p];
    dy = y[p+1] - y[p];

    t = (x0-x[p]) / dx;
    it = (1 - t);

    xleftp = x[p] + (left[p] * dx);
    xrightp = x[p+1] - (right[p+1] * dx);
    
    var xo = it*it*it*x[p] + 3*it*it*t*xleftp + 3*it*t*t*xrightp + t*t*t*x[p+1];
    var yo = it*it*it*y[p] + 3*it*it*t*y[p] + 3*it*t*t*y[p+1] + t*t*t*y[p+1];

    // console.log("x0: " + x0);
    // console.log("left[p]: " + left[p]);
    // console.log("right[p+1]: " + right[p+1]);
    // console.log("x[p]: " + x[p]);
    // console.log("xleftp: " + xleftp);
    // console.log("xrightp: " + xrightp);
    // console.log("x[p+1]: " + x[p+1]);
    // console.log("y[p]: " + y[p]);
    // console.log("y[p+1]: " + y[p+1]);
    // console.log("xo: " + xo);
    // console.log("yo: " + yo);

    return [xo, yo];
  }

  var interpolate = interpolateCubic;
  var interpolate = interpolateOriginal;
  var interpolate = interpolateRational;
  var interpolate = interpolate2d;

  function at(t) {
    if(typeof t === "number") {
      var n = x.length;
      var p,q,mid,a,b;
      p = 0;
      q = n-1;
      while(q-p>1) {
        mid = Math.floor((p+q)/2);
        if(x[mid] <= t) p = mid;
        else q = mid;
      }
      return interpolate(t,p);
    }

    var n = t.length, i, ret = Array(n);
    for(i = n-1; i !== -1; --i) {
      ret[i] = this.at(t[i]);
    }
    return ret;
  }

  return at;
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

function extractFrameValues(data) {
  var frameValues = data.frameData[0];
  var valueIndex = data.valueIndex;
  var xs = [];
  var ys = [];

  for (var i = 0; i < frameValues.values.length; i++) {
    var framevalue = frameValues.values[i];
    xs.push(framevalue.time);
    ys.push(framevalue.value[valueIndex]);
  }

  return [xs, ys];
}

function extractKeyframes(data) {
  var xs = [];
  var ys = [];
  var left = [];
  var right = [];
  for (var i = 0; i < data.keyframes.length; i++) {
    var keyframe = data.keyframes[i];
    xs.push(keyframe.time);
    ys.push(keyframe.value[data.valueIndex]);
    right.push(keyframe.in.influence * 0.01);
    left.push(keyframe.out.influence * 0.01);
  }

  return [normalizeData(xs), normalizeData(ys), left, right];
}

function buildKeyframeSpline(data) {
  var keys = extractKeyframes(data);
  var spline = new numeric.Spline(keys[0], keys[1], keys[1], keys[2], keys[3]);
  return spline;
}

var frames, fit;
var keys, keyframeSpline, keyframeFit;
var start, now, phase;
var period;
var width, height;
var radius;
var snapshot, keyframeSnapshot, controlSnapshot;

cyclops.plotData = function(processing) {
  
  function fitData(fit, dx) {
    // transform a fitted function into an array of data

    var data = [];
    var index = 0;
    for (x = 0.0; x <= 1.0; x += dx) {
      var y = fit(x);
      data[index] = y;
      index++;
    }
    return data;
  }

  function fitData(fit, dx) {
    var data = [];
    for (var x = 0.0; x <= 1.0; x += dx) {
      var P = fit(x);
      data.push(P);
    }
    return data;
  }

  function transposeNData(data) {
    var output = new Array(data[0].length);
    for (var n = 0; n < data[0].length; n++) {
      output[n] = new Array();
    }

    for (var j = 0; j < data.length; j++) {
      var slice = data[j];
      for (var m = 0; m < slice.length; m++) {
        output[m].push(slice[m]);
      }
    }

    return output;
  }

  function bound(x, bounds) {
    // project the given value to a scaled and transformed space
    return x * bounds[1] + bounds[0];
  }

  function drawArbitraryData(xdata, ydata, xbounds, ybounds) {
    // draw data that is not necessarily regular along the x-axis
    xdata = normalizeData(xdata);
    ydata = normalizeData(ydata);
    var xprev = xdata[0];
    var yprev = ydata[0];
    var len = Math.min(xdata.length, ydata.length);

    for (d = 1; d < len; d++) {
      var x = xdata[d];
      var y = ydata[d];
      // processing.ellipse(bound(x, xbounds), bound(1 - y, ybounds), 10, 10);
      processing.line(bound(xprev, xbounds), bound(1 - yprev, ybounds),
                      bound(x, xbounds), bound(1 - y, ybounds));
      xprev = x;
      yprev = y;
    }
  }

  function drawNData(ndata, xbounds, ybounds) {
    var tdata = transposeNData(ndata);
    drawArbitraryData(tdata[0], tdata[1], xbounds, ybounds);
  }

  function drawData(data, yMin, yMax) {
    // draw an arbitrary array of data

    var dx = processing.width / (data.length - 1);
    var xprev = 0.0;
    var yprev = data[0];

    for (d = 1; d < data.length; d++) {
      var x = xprev + dx;
      var y = data[d];
      processing.line(xprev, (1 - yprev) * yMax + yMin, 
                      x, (1 - y) * yMax + yMin);
      xprev = x;
      yprev = y;
    }
  }

  function drawDataPoints(data, yMin, yMax) {
    // draw an arbitrary array of data

    var dx = processing.width / (data.length - 1);
    var xprev = 0.0;
    var yprev = data[0];

    for (d = 1; d < data.length; d++) {
      var x = xprev + dx;
      var y = data[d];
      processing.ellipse(x, (1 - y) * yMax + yMin, 5, 5);
      xprev = x;
      yprev = y;
    }
  }

  processing.setup = function() {
    data = tims_curve;
    // data = bezierData;
    frames = extractFrameValues(data);
    spline = cyclops.generateSpline(normalizeData(frames[0]), normalizeData(frames[1]));
    fitCode = cyclops.outputSpline(normalizeData(frames[0]), normalizeData(frames[1]));
    fit = new Function("phase", fitCode);
    snapshot = fitData(fit, 0.005);

    keys = extractKeyframes(data);
    keyframeSpline = buildKeyframeSpline(data);
    keyframeFit = curve(keys[0], keys[1], keys[2], keys[3]);
    keyframeSnapshot = fitData(keyframeFit, 0.005);
    processing.size(1300, 700);

    controlSnapshot = fitData(function(x) {return [x,x]}, 0.005);

    console.log(snapshot);
    console.log(keyframeSnapshot);
  }

  processing.draw = function() {

    var xMin = 0;
    var xMax = processing.width;
    var yMin = 0;
    var yMax = processing.height;

    processing.background(40);
    processing.ellipseMode(processing.CENTER);

    processing.strokeWeight(3);
    processing.stroke(200, 150, 50);
    drawNData(controlSnapshot, [xMin, xMax], [yMin, yMax]);
    
    processing.strokeWeight(1);
    processing.stroke(80, 80, 200);
    processing.line(0, yMin, processing.width, yMin);
    processing.line(0, yMax+yMin, processing.width, yMax+yMin);

    // line to match
    processing.strokeWeight(10);
    processing.stroke(150, 50, 200);
    drawData(snapshot, yMin, yMax);
    
    // points from frames
    processing.strokeWeight(9);
    processing.stroke(150, 150, 150);
    drawDataPoints(normalizeData(frames[1]), yMin, yMax);

    // keyframe value
    processing.strokeWeight(3);
    processing.stroke(100, 200, 100);
    processing.fill(100, 200, 100);
    drawArbitraryData(keys[0], keys[1], [xMin, xMax], [yMin, yMax]);

    // keyframe left influence
    processing.strokeWeight(1);
    processing.stroke(200, 100, 100);
    processing.fill(200, 100, 100);
    drawArbitraryData(keys[0], keys[2], [xMin, xMax], [yMin, yMax]);

    // keyframe right influence
    processing.stroke(100, 100, 200);
    processing.fill(100, 100, 200);
    drawArbitraryData(keys[0], keys[3], [xMin, xMax], [yMin, yMax]);

    // matching line
    processing.strokeWeight(3);
    processing.stroke(250, 250, 250);
    drawNData(keyframeSnapshot, [xMin, xMax], [yMin, yMax]);
  };
}

window.onload = function() {
  var canvas = document.getElementById("canvas");
  var processingInstance = new Processing(canvas, cyclops.plotData);
};
