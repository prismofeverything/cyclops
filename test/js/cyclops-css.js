var previousTime    = 0;
var tweenTime       = 0;

var tweenDuration   = keyframeData.FunFun.position.duration;
var curve           = cyclops.loadCurve(keyframeData.FunFun);

function update(){

  var now = new Date().getTime();

  tweenTime += (now - previousTime) * 0.001;
  previousTime = now;

  // loop
  if(tweenTime >= tweenDuration){
    tweenTime = 0;
  }

  var t = (document.getElementById("animate").checked) ? (tweenTime / tweenDuration) : Number(document.getElementById("time_value").value);
  
  requestAnimationFrame(update);

  updateSourcePreview(t);
  updateCyclopsPreview(t);
  document.getElementById("time").innerHTML = t;
}


function updateCyclopsPreview(t) {
  var position    = curve.position.func(t);
  var scale       = curve.scale.func(t)[0] * (rawFrameData["scale"].max[0] - rawFrameData["scale"].min[0]) + rawFrameData["scale"].min[0];
  var rotation    = curve.rotation.func(t)[0] * (rawFrameData["rotation"].max[0] - rawFrameData["rotation"].min[0]) + rawFrameData["rotation"].min[0];

  var x = rawFrameData["position"].min[0] + (position[0] * (rawFrameData["position"].max[0] - rawFrameData["position"].min[0]));
  var y = rawFrameData["position"].min[1] + (position[1] * (rawFrameData["position"].max[1] - rawFrameData["position"].min[1]));
  
  scale = scale / 100;


  document.getElementById("cyclopsSquare").style.webkitTransform = "translate(" + x + "px, " + y + "px) rotate(" + rotation + "deg) scale(" + scale + ", " + scale + ")";
}


function updateSourcePreview(t) {
  var seconds = t * tweenDuration;
  var idx = Math.floor(rawFrameData["position"].data.length * t);

  var scale       = rawFrameData["scale"].data[idx].val[0] / 100;
  var rotation    = rawFrameData["rotation"].data[idx].val[0];

  var x = rawFrameData["position"].data[idx].val[0];
  var y = rawFrameData["position"].data[idx].val[1];

  document.getElementById("sourceSquare").style.webkitTransform = "translate(" + x + "px, " + y + "px) rotate(" + rotation + "deg) scale(" + scale + ", " + scale + ")";
}


window.onload = function() {
  update();

  drawGraph(curve["position"].func, "position", 0);

  document.getElementById("property").onchange = function(){
    var property = document.getElementById("property").value;
    var parts = property.split("|");
    drawGraph( curve[parts[0]].func, parts[0], Number(parts[1]));
  }
};


function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}


function drawGraph(func, propertyName, valueIndex) {
  var canvas = document.getElementById("graph");
  var ctx = document.getElementById("graph").getContext("2d");

  var yScale = canvas.height / 2;
  var yOffset = canvas.height / 4;

  ctx.fillStyle = "#c0c0c0";
  ctx.fillRect(0,0,canvas.width, canvas.height);

  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0,yOffset, canvas.width, yScale);



  ctx.beginPath();
  ctx.moveTo(0,func(0)[valueIndex] * yScale + yOffset);
  for(var i = 0; i < rawFrameData[propertyName].data.length; i++){

    var frm = rawFrameData[propertyName].data[i];
    var t = frm["t"] / tweenDuration;
    ctx.lineTo(t * canvas.width, func(t)[valueIndex] * yScale + yOffset);
  }
  ctx.strokeStyle = 'green';
  ctx.stroke();



  ctx.beginPath();
  ctx.moveTo(0, func(0)[valueIndex] * yScale + yOffset);
  for(var i = 0; i < rawFrameData[propertyName].data.length; i++){
    var frm = rawFrameData[propertyName].data[i];
    var t = frm["t"] / tweenDuration;
    var rawVal = (frm["val"][valueIndex] - rawFrameData[propertyName].min[valueIndex]) / (rawFrameData[propertyName].max[valueIndex] - rawFrameData[propertyName].min[valueIndex]);
    ctx.lineTo(t * canvas.width, rawVal * yScale + yOffset);
  }
  ctx.strokeStyle = 'red';
  ctx.stroke();


}