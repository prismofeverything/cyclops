var previousTime    = 0;
var tweenTime       = 0;

var tweenDuration   = 0;
var curve;

var currentCurveName = "";


function loadCurve(curveName){

  console.log("loading curve: " + curveName);

  curve = cyclops.loadCurve(keyframeData[curveName].properties);
  tweenDuration = keyframeData[curveName].properties.position.duration;
  
  currentCurveName  = curveName;
  tweenTime = 0;
}


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
  
  var currentCurveProps = keyframeData[currentCurveName].properties;
  try{
  var position    = curve.position.func(t);
  var scale       = curve.scale ? (curve.scale.func(t)[0] * (currentCurveProps["scale"].max[0] - currentCurveProps["scale"].min[0]) + currentCurveProps["scale"].min[0]) : 100;
  var rotation    = curve.rotation ? (curve.rotation.func(t)[0] * (currentCurveProps["rotation"].max[0] - currentCurveProps["rotation"].min[0]) + currentCurveProps["rotation"].min[0]) : 0;

  var x = currentCurveProps["position"].min[0] + (position[0] * (currentCurveProps["position"].max[0] - currentCurveProps["position"].min[0]));
  var y = currentCurveProps["position"].min[1] + (position[1] * (currentCurveProps["position"].max[1] - currentCurveProps["position"].min[1]));
  
  scale = scale / 100;

  document.getElementById("cyclopsSquare").style.webkitTransform = "translate(" + x + "px, " + y + "px) rotate(" + rotation + "deg) scale(" + scale + ", " + scale + ")";
  document.getElementById("cyclopsSquare").style.border = "0px none";
  } catch(e){
    document.getElementById("cyclopsSquare").style.border = "1px solid red";
  }
}

function updateSourcePreview(t) {

  var currentCurveProps = keyframeData[currentCurveName].properties;

  var rawPosition = currentCurveProps["position"].rawFrameData;
  var rawScale    = currentCurveProps["scale"];// ? currentCurveProps["scale"].rawFrameData : 1;
  var rawRotation = currentCurveProps["rotation"];// ? currentCurveProps["rotation"].rawFrameData : 0;


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
    drawGraph( curve[parts[0]].func, parts[0], Number(parts[1]));
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
  ctx.fillRect(0,0,canvas.width, canvas.height);

  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0,yOffset, canvas.width, yScale);

  var rawData = keyframeData[currentCurveName].properties.position.rawFrameData;

  //ctx.beginPath();

  
  for(var i = 0; i < rawData.length; i++){
    var t = rawData[i]["t"] / tweenDuration;
    try{
      ctx.strokeStyle = 'green';
      ctx.beginPath();
      ctx.arc(t * canvas.width, func(t)[valueIndex] * yScale + yOffset , 1, 0, Math.PI * 2);
      ctx.stroke();
    } catch(e){
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.arc(t * canvas.width, yScale + yOffset * 1.5, 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
 // ctx.stroke();

  var prop = keyframeData[currentCurveName].properties[propertyName];
  ctx.beginPath();
   try{
      ctx.moveTo(0, func(0)[valueIndex] * yScale + yOffset);
    } catch(e){
      ctx.moveTo(0,0);
    }
  for(var i = 0; i < rawData.length; i++){
    var frm = rawData[i];
    var t = frm["t"] / tweenDuration;
    var rawVal = (frm["val"][valueIndex] - prop.min[valueIndex]) / (prop.max[valueIndex] - prop.min[valueIndex]);
    ctx.lineTo(t * canvas.width, rawVal * yScale + yOffset);
  }
  ctx.strokeStyle = 'red';
  ctx.stroke();
}
