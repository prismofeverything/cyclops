cyclops.plotFit = function(processing) {
  // display the fit process somehow

  var data = [0.5, 0.55, 0.7, 0.71, 0.44, 0.42, 0.14, 0.24, 0.46, 0.66];
  var fit = cyclops.generateFit(data, 5);

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
    processing.size(800, 600);
  }

  processing.draw = function() {
    var snapshot = fitData(fit, 0.01);
    processing.background(Math.random() * 100);
    processing.stroke(0, 0, 250);
    drawData(data);
    processing.stroke(250, 0, 0);
    drawData(snapshot);
  };
}

window.onload = function() {
  var canvas = document.getElementById("canvas");
  var processingInstance = new Processing(canvas, cyclops.plotFit);
};
