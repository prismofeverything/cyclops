var previousTime    = 0;
var tweenTime       = 0;

var tweenDuration   = 0;
var curve;

var currentCurveName = "";


function loadCurve(curveName){

  console.log("loading curve: " + curveName);

  curve = cyclops.loadVectorCurve(keyframeData[curveName].properties);
  tweenDuration = keyframeData[curveName].properties.position.duration;
  
  currentCurveName  = curveName;
  tweenTime = 0;
}

function update(){

  var now = new Date().getTime();

  tweenTime += (now - previousTime) * 0.0002;
  previousTime = now;

  // loop
  if(tweenTime >= tweenDuration){
    tweenTime = 0;
  }

  var t = (document.getElementById("animate").checked) ? (tweenTime / tweenDuration) : Number(document.getElementById("time_value").value);
  
  requestAnimationFrame(update);

  // updateSourcePreview(t);
  updateCyclopsPreview(t);

  document.getElementById("time").innerHTML = t;
}

function updateCyclopsPreview(t) {
  
  var currentCurveProps = keyframeData[currentCurveName].properties;
  try{
    var position    = curve.position.func(t);
    var scale       = curve.scale ? curve.scale.func(t)[0] / 100 : 1;
    var rotation    = curve.rotation ? curve.rotation.func(t)[0] : 0;

    var x = position[0]; 
    var y = position[1];

    document.getElementById("cyclopsSquare").style.webkitTransform = "translate(" + x + "px, " + y + "px) rotate(" + rotation + "deg) scale(" + scale + ", " + scale + ")";
    document.getElementById("cyclopsSquare").style.border = "0px none";
  } catch(e){
    document.getElementById("cyclopsSquare").style.border = "1px solid red";
  }
}

function updateSourcePreview(t) {

  var currentCurveProps = keyframeData[currentCurveName].properties;

  var rawPosition = currentCurveProps["position"].frameData;
  var rawScale    = currentCurveProps["scale"];
  var rawRotation = currentCurveProps["rotation"];

  var seconds = t * tweenDuration;
  var idx = Math.floor(rawPosition.length * t);

  var scale       = rawScale ? (rawScale[idx].val[0] / 100) : 1;
  var rotation    = rawRotation ? (rawRotation[idx].val[0]) : 0;

  var x = rawPosition[idx].val[0];
  var y = rawPosition[idx].val[1];

  document.getElementById("sourceSquare").style.webkitTransform = "translate(" + x + "px, " + y + "px) rotate(" + rotation + "deg) scale(" + scale + ", " + scale + ")";
}

window.onload = function() {

  for(var itm in keyframeData){
    var opt = document.createElement("option");
    opt.value = itm;
    opt.text = itm;
    document.getElementById("curveList").appendChild(opt);
  }

  currentCurveName = document.getElementById("curveList").value;
  // currentCurveName = "lots_of_keys";

  document.getElementById("curveList").onchange = function(){
    loadCurve(document.getElementById("curveList").value);
    updateGraph();
  }

  loadCurve(currentCurveName);

  update();
  updateGraph();

  document.getElementById("property").onchange = function(){
    updateGraph();
  }
};

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function updateGraph(){
  var property = document.getElementById("property").value;
  var parts = property.split("|");
  
  if(keyframeData[currentCurveName].properties[parts[0]]){
    drawGraph(curve[parts[0]].func, parts[0], Number(parts[1]));
    // drawSpeed(curve[parts[0]].normalizedSpeedCurve, parts[0], 1);
  } else {
    drawEmptyGraph(parts[0]);
  }
}

function drawEmptyGraph(propertyName) {
  var canvas = document.getElementById("graph");
  var ctx = document.getElementById("graph").getContext("2d");

  var yScale = canvas.height / 2;
  var yOffset = canvas.height / 4;

  ctx.fillStyle = "#c0c0c0";
  ctx.fillRect(0,0,canvas.width, canvas.height);

  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0,yOffset, canvas.width, yScale);

  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("No data for property: " + propertyName, 20, 40);
}

function drawGraph(func, propertyName, valueIndex) {
  var canvas = document.getElementById("graph");
  var ctx = document.getElementById("graph").getContext("2d");

  var yScale = canvas.height / 2;
  var yOffset = canvas.height / 4;

  ctx.fillStyle = "#c0c0c0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, yOffset, canvas.width, yScale);

  var rawData = keyframeData[currentCurveName].properties.position.frameData;
  var prop = keyframeData[currentCurveName].properties[propertyName];
  function scaleData(v) {
    var bounded = (v - prop.min[valueIndex]) / (prop.max[valueIndex] - prop.min[valueIndex]);
    return canvas.height - ((bounded * yScale) + yOffset);
  }

  ctx.beginPath();
  try{
    ctx.moveTo(0, func(0)[valueIndex] * yScale + yOffset);
  } catch(e){
    ctx.moveTo(0,0);
  }
  for(var i = 0; i < rawData.length; i++) {
    var frm = rawData[i];
    var t = frm["t"] / tweenDuration;
    var rawVal = scaleData(frm["val"][valueIndex]);
    // ctx.lineTo(t * canvas.width, rawVal);
    ctx.arc(t * canvas.width, rawVal, 3, 0, 2 * Math.PI);
  }
  ctx.strokeStyle = "#ee9999";
  ctx.fillStyle = "#ee9999";
  // ctx.lineWidth = 5;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, scaleData(func(0)[valueIndex]));
  for(var t = 0; t < tweenDuration; t+=0.001) {
    // var frm = rawData[i];
    // var t = frm["t"] / tweenDuration;
    var rawVal = scaleData(func(t)[valueIndex]);
    ctx.lineTo(t * canvas.width, rawVal);
  }
  // for(var i = 0; i < rawData.length; i++) {
  //   var frm = rawData[i];
  //   var t = frm["t"] / tweenDuration;
  //   var rawVal = scaleData(func(t)[valueIndex]);
  //   ctx.lineTo(t * canvas.width, rawVal);
  // }
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.stroke();

}

// function drawSpeed(func, propertyName, valueIndex) {
//   var canvas = document.getElementById("speedgraph");
//   var ctx = document.getElementById("speedgraph").getContext("2d");

//   var yScale = canvas.height / 2;
//   var yOffset = canvas.height / 4;

//   ctx.fillStyle = "#c0c0c0";
//   ctx.fillRect(0,0,canvas.width, canvas.height);

//   ctx.fillStyle = "#f0f0f0";
//   ctx.fillRect(0, yOffset, canvas.width, yScale);

//   var rawData = keyframeData[currentCurveName].properties.position.frameData;
//   var prop = keyframeData[currentCurveName].properties[propertyName];

//   ctx.beginPath();
//   ctx.moveTo(0, func(0) * yScale + yOffset);
//   for(var i = 0; i < rawData.length; i++) {
//     var frm = rawData[i];
//     var t = frm["t"] / tweenDuration;
//     var rawVal = canvas.height - (func(t) * yScale + yOffset);
//     ctx.lineTo(t * canvas.width, rawVal);
//   }
//   ctx.strokeStyle = 'green';
//   ctx.stroke();
// }
