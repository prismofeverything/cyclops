cyclops.plotFit = function(processing) {
  var curve = cyclops.loadCurve(frameData);
  var position, scale, rotation, opacity;
  console.log(curve);
  
  function fitData(fit, dx) {
    // transform a fitted function into an array of data
    var data = [];
    for (x = 0.0; x <= 1.0; x += dx) {
      var y = fit(x);
      data.push(y);
    }
    return data;
  }

  processing.setup = function() {
    processing.size(1600, 800);
    position = fitData(curve.position.func, 0.01);
    scale = fitData(curve.scale.func, 0.01);
    rotation = fitData(curve.rotation.func, 0.01);
    opacity = fitData(curve.opacity.func, 0.01);
  }

  processing.draw = function() {
    var time = processing.frameCount % 100;

    processing.background(0);
    processing.stroke(250, 0, 0);
    processing.fill(250, 0, 0);

    // position
    processing.rect(position[time][0]*500+50, position[time][1]*100, 100, 100);

    // scale
    processing.rect(50, 250, 100*scale[time][0], 100*scale[time][1]);

    // rotation
    processing.pushMatrix();
    processing.translate(350, 300);
    processing.rotate((rotation[time]*135 - 45) * Math.PI / 180);
    processing.rect(-50, -50, 100, 100);
    processing.popMatrix();

    // opacity
    processing.stroke(250, 0, 0, opacity[time] * 255);
    processing.fill(250, 0, 0, opacity[time] * 255);
    processing.rect(550, 250, 100, 100);

    // combination
    processing.stroke(250, 0, 0, opacity[time] * 255);
    processing.fill(250, 0, 0, opacity[time] * 255);
    processing.translate(100 + position[time][0]*500, 500 + position[time][1]*100);
    processing.rotate((rotation[time]*135 - 45) * Math.PI / 180);
    processing.rect(-50, -50, 100*scale[time][0], 100*scale[time][1]);
  };
}

window.onload = function() {
  var canvas = document.getElementById("canvas");
  var processingInstance = new Processing(canvas, cyclops.plotFit);
};
