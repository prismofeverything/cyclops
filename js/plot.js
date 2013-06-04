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
    frames = extractFrameValues(frameData[0]);
    fitCode = cyclops.outputSpline(normalizeData(frames[0]), normalizeData(frames[1]));
    fit = new Function("phase", fitCode);

    processing.size(1600, 800);
  }

  processing.draw = function() {

    var yMin = 30;
    var yMax = processing.height - (yMin*2);

    processing.background(40);
    processing.ellipseMode(processing.CENTER);

    processing.strokeWeight(1);
    processing.stroke(80, 80, 200);
    processing.line(0, yMin, processing.width, yMin);
    processing.line(0, yMax+yMin, processing.width, yMax+yMin);

    var snapshot = fitData(fit, 0.005);
    
    processing.strokeWeight(10);
    processing.stroke(100, 100, 100);
    //drawData(normalizeData(frames[1]));
    drawDataPoints(normalizeData(frames[1]), yMin, yMax);

    processing.strokeWeight(1);
    processing.stroke(0, 250, 0);
    drawData(snapshot, yMin, yMax);
    
  };
}

window.onload = function() {
  var canvas = document.getElementById("canvas");
  var processingInstance = new Processing(canvas, cyclops.plotData);
};
