function extractFrameValues(framevalues) {
  var xs = [];
  var ys = [];

  for (var i = 0; i < framevalues.values.length; i++) {
    var framevalue = framevalues.values[i];
    xs.push(framevalue.time);
    ys.push(framevalue.value[0]);
  }

  return [xs, ys];
}

var frames, fit;
var start, now, phase;
var period;
var width, height;
var radius;

function cyclopsMotion(processing) {
  processing.setup = function() {
    width = 1200;
    height = 600;
    processing.size(width, height);
    period = 2000;
    radius = 40;
    start = new Date();
    frames = extractFrameValues(framevalues);
    fitCode = cyclops.outputSpline(normalizeData(frames[0]), normalizeData(frames[1]));
    console.log(fitCode);
    fit = new Function("phase", fitCode);
  }

  processing.draw = function() {
    now = new Date();
    phase = ((now - start) % period) / period;
    curve = fit(phase);
    processing.background(0, 0, 0);
    processing.stroke(250, 250, 250);
    processing.fill(125, 0, 250);
    processing.arc(curve * width, height * 0.5, radius, radius, 0, 2 * Math.PI);
  }
}

window.onload = function() {
  var canvas = document.getElementById("canvas");
  var processingInstance = new Processing(canvas, cyclopsMotion);
};
