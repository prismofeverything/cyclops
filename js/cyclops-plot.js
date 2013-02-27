cyclops.plotFit = function(processing) {
  // display the fit process somehow


  var curve1 = [222, 269.009774222153, 334.520472521623, 416.309200837953, 509.289158898347, 607.107781355733, 704.242300480067, 797.084308980303, 883.812546430562, 963.804457246829, 1037.11223340075, 1104.11127384798, 1165.28397921851, 1221.14190006819, 1272.17959691114, 1318.84192857734, 1361.53810356659, 1400.61418355596, 1436.39608139028, 1469.16238583933, 1499.14699170864, 1526.57431586101, 1551.64150866388, 1574.51231539924, 1595.3376339874, 1614.26309605724, 1631.4120096142, 1646.89018931753, 1660.79586850199, 1673.22538499566, 1684.26333607143, 1693.98446971248, 1702.45627416586, 1709.74240806037, 1715.90306410242, 1720.99270973493, 1725.06056592019, 1728.16573224664, 1730.33537502129, 1731.59296705929, 1732];
  var curve2 = [222, 222.892496096887, 225.765797802711, 230.866453656036, 238.479913529399, 248.994493532663, 262.880155248424, 280.725027162553, 303.270951926107, 331.503042268901, 366.712518738154, 410.607403902727, 465.500560788596, 534.345601865438, 620.526817126154, 726.305727114873, 848.877940419994, 976.998831523202, 1096.50240174367, 1199.72293132527, 1286.07343218252, 1357.90273173987, 1417.92628191278, 1468.47236524925, 1511.32412560337, 1547.87534715554, 1579.17530509009, 1606.04115229074, 1629.1291368507, 1648.94455560582, 1665.89921062633, 1680.34109503214, 1692.55196508449, 1702.76453901882, 1711.17794717117, 1717.96460141158, 1723.27068478366, 1727.22812903545, 1729.95324858381, 1731.50591738137, 1732];
  var curve3 = [222, 225.105825559905, 235.141345088805, 253.445822109007, 281.850820587899, 322.975259332705, 380.771918683575, 461.672693770682, 577.167732042725, 749.04687537087, 976.998831523206, 1147.72340794029, 1276.4619622394, 1369.51185164615, 1437.96205666094, 1489.95206095001, 1530.6271648528, 1563.22153757991, 1589.84243870516, 1611.9097498933, 1630.4102980313, 1646.06417736817, 1659.40102476811, 1670.82018936832, 1680.63360571193, 1689.08801802374, 1696.37971591707, 1702.66745090079, 1708.08150572452, 1712.7305615445, 1716.70587567062, 1720.08442645984, 1722.93173158696, 1725.30390144334, 1727.24960649497, 1728.81100208176, 1730.02770092403, 1730.92908768099, 1731.54018938331, 1731.88873325895, 1732];
  var curve4 = [222, 223.601802568485, 228.723714293796, 237.701435302566, 251.037419781075, 269.29942488266, 293.208110362356, 323.640734966655, 361.712732255973, 408.891693235387, 467.091105792312, 538.912039502879, 627.931537427387, 739.096628983445, 878.85398338285, 1053.08551447373, 1256.10482974698, 1450.54592806711, 1590.74350735858, 1670.73169090322, 1706.44612129688, 1715.20246694209, 1719.32982240876, 1722.13220070121, 1724.22269077466, 1725.85193690833, 1727.15135523732, 1728.20028368357, 1729.05338428073, 1729.74830975201, 1730.31244543212, 1730.76666129453, 1731.127497236, 1731.40853165082, 1731.62129707323, 1731.77593728366, 1731.88314072108, 1731.95084201898, 1731.98591466546, 1731.99830055688, 1732];

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

  var data = normalizeData(curve3);
  var x = numeric.linspace(0, 1, data.length);
  // var x = new Array(data.length);
  // var step = 1.0 / (data.length - 1);
  // for (var i = 0; i < data.length; i++) {
  //   x[i] = i * step;
  // }

  // var data = [0.5, 0.55, 0.7, 0.71, 0.44, 0.42, 0.14, 0.24, 0.46, 0.66];
  var degree = 20;
  var fit = cyclops.generatePoly(data, degree);
  var cubic = cyclops.generateCubic(x, data);
  
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
    processing.size(1600, 800);
  }

  processing.draw = function() {
    var snapshot = fitData(fit, 0.01);
    var spline = fitData(cubic, 0.01);

    // processing.background(Math.random() * 100);
    processing.stroke(0, 250, 0);
    drawData(snapshot);
    processing.stroke(250, 0, 0);
    drawData(spline);
    processing.stroke(0, 0, 250);
    drawData(data);
  };
}

window.onload = function() {
  var canvas = document.getElementById("canvas");
  var processingInstance = new Processing(canvas, cyclops.plotFit);
};
