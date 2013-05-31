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
    width = 450;
    height = 600;
    processing.size(width, height);
    period = 1000;
    radius = 40;
    start = new Date();
    frames = extractFrameValues(frameData[0]);
    fit = cyclops.generateCubic(normalizeData(frames[0]), normalizeData(frames[1]));
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

function update(){
  TWEEN.update();
  requestAnimationFrame(update);
}

var tween;
var tweenTarget;
var currentVal = 0;

window.onload = function() {

  frames = extractFrameValues(frameData[0]);
  fit = cyclops.generateCubic(normalizeData(frames[0]), normalizeData(frames[1]));

  tweenTarget = document.getElementById("test");

  tweenTarget.onmouseover = function(){
    tween = new TWEEN.Tween( { w: currentVal } )
          .to( { w: 1 }, 1500 )
          .easing( fit )
          .onUpdate( function () {
            currentVal = this.w;
            tweenTarget.style.width = (40 + this.w * 250) + "px";
          } )
          .start();
  };

  tweenTarget.onmouseout = function(){
    tween = new TWEEN.Tween( { w: currentVal } )
          .to( { w: 0 }, 1500 )
          .easing( fit )
          .onUpdate( function () {
            currentVal = this.w;
            tweenTarget.style.width = (40 + this.w * 250) + "px";
          } )
          .start();
  };

  update();
};
