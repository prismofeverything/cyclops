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

  function drawData(data) {
    // draw an arbitrary array of data

    var dx = processing.width / (data.length - 1);
    var xprev = 0.0;
    var yprev = data[0];
    for (d = 1; d < data.length; d++) {
      var x = xprev + dx;
      var y = data[d];
      processing.line(xprev, (1 - yprev) * processing.height, 
                      x, (1 - y) * processing.height);
      xprev = x;
      yprev = y;
    }
  }

  processing.setup = function() {

    frames = extractFrameValues(framevalues);
    fitCode = cyclops.outputSpline(normalizeData(frames[0]), normalizeData(frames[1]));
    fit = new Function("phase", fitCode);

    processing.size(1600, 800);
  }

  processing.draw = function() {
    processing.background(40);

    var snapshot = fitData(fit, 0.005);
    
    processing.strokeWeight(10);
    processing.stroke(100, 100, 100);
    drawData(normalizeData(frames[1]));

    processing.strokeWeight(1);
    processing.stroke(0, 250, 0);
    drawData(snapshot);
    
  };
}

window.onload = function() {
  var canvas = document.getElementById("canvas");
  var processingInstance = new Processing(canvas, cyclops.plotData);
};
