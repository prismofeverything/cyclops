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

function extract2dFrameValues(data) {
  var frameValues = data.frameData[0].values;
  var xs = [];
  var ys = [];

  for (var i = 0; i < frameValues.length; i++) {
    var framevalue = frameValues[i];
    xs.push(framevalue.value[0]);
    ys.push(framevalue.value[1]);
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

cyclopsMath.plotData = function(processing) {

  function fitData(fit, dx) {
    var data = [];
    for (var x = 0.0; x <= 1.0; x += dx) {
      var P = fit(x);
      data.push(P);
    }
    return data;
  }

  function transposeNData(data) {
    // turn pairs of [x,y] values into two lists of [xs], [ys]
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

  processing.setup = function() {
    data = spatialData;
    frames = extract2dFrameValues(data);
    keys = cyclops.extractProperty(spatialData.keyframes);
    snapshot = fitData(keys, 0.005);

    // spline = cyclopsMath.generateSpline(normalizeData(frames[0]), normalizeData(frames[1]));
    // snapshot = fitData(spline, 0.005);

    // keys = extractKeyframes(data);
    // keyframeSpline = buildKeyframeSpline(data);
    // keyframeFit = curve(keys[0], keys[1], keys[2], keys[3]);
    // keyframeSnapshot = fitData(keyframeFit, 0.005);

    // binaryFit = buildBinary(keyframeFit, 0.0001);
    // binarySnapshot = fitData(binaryFit, 0.003);

    processing.size(1300, 700);

    controlSnapshot = fitData(function(x) {return [x,x]}, 0.005);

    console.log(frames);
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
    
    // processing.strokeWeight(1);
    // processing.stroke(80, 80, 200);
    // processing.line(0, yMin, processing.width, yMin);
    // processing.line(0, yMax+yMin, processing.width, yMax+yMin);

    // line to match
    // processing.strokeWeight(10);
    // processing.stroke(150, 50, 200);
    // drawNData(snapshot, yMin, yMax);
    
    // points from frames
    processing.strokeWeight(9);
    processing.stroke(150, 150, 150);
    drawArbitraryData(frames[0], frames[1], [xMin, xMax], [yMin, yMax]);

    // keyframe value
    processing.strokeWeight(3);
    processing.stroke(100, 200, 100);
    processing.fill(100, 200, 100);
    drawNData(snapshot, [xMin, xMax], [yMin, yMax]);

    // // keyframe left influence
    // processing.strokeWeight(1);
    // processing.stroke(200, 100, 100);
    // processing.fill(200, 100, 100);
    // drawArbitraryData(keys[0], keys[2], [xMin, xMax], [yMin, yMax]);

    // // keyframe right influence
    // processing.stroke(100, 100, 200);
    // processing.fill(100, 100, 200);
    // drawArbitraryData(keys[0], keys[3], [xMin, xMax], [yMin, yMax]);

    // // matching line
    // processing.strokeWeight(8);
    // processing.stroke(250, 250, 250);
    // drawNData(keyframeSnapshot, [xMin, xMax], [yMin, yMax]);

    // // binary search
    // processing.strokeWeight(2);
    // processing.stroke(10, 170, 130);
    // drawData(binarySnapshot, yMin, yMax);
  };
}

window.onload = function() {
  var canvas = document.getElementById("canvas");
  var processingInstance = new Processing(canvas, cyclopsMath.plotData);
};
