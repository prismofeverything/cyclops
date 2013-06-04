
function myCurve(phase) {
    var x = [0, 0.02380952380952143, 0.04761904761905, 0.07142857142857144, 0.09523809523809286, 0.11904761904762143, 0.14285714285714288, 0.1666666666666643, 0.19047619047619285, 0.2142857142857143, 0.23809523809523572, 0.2619047619047643, 0.28571428571428575, 0.30952380952380715, 0.33333333333333576, 0.35714285714285715, 0.3809523809523786, 0.40476190476190715, 0.4285714285714286, 0.45238095238095, 0.47619047619047855, 0.5, 0.5238095238095214, 0.5476190476190501, 0.5714285714285715, 0.5952380952380929, 0.6190476190476215, 0.6428571428571429, 0.6666666666666643, 0.6904761904761929, 0.7142857142857143, 0.7380952380952358, 0.7619047619047643, 0.7857142857142858, 0.8095238095238072, 0.8333333333333358, 0.8571428571428572, 0.8809523809523787, 0.9047619047619072, 0.9285714285714287, 0.95238095238095, 0.9761904761904786, 1];
    var yl = [0, 0.0014830024719220312, 0.006271483964877506, 0.014797212486065591, 0.02769392953623761, 0.04574316084159404, 0.07001520557364357, 0.10195927153714728, 0.14369864865425866, 0.1984502883028416, 0.2715237149367115, 0.37253368859281805, 0.5205793158406721, 0.7375917828695508, 0.9104180272737995, 0.9349210105457959, 0.937337652405964, 0.9250355082112339, 0.8651611993467041, 0.8311151899130458, 0.8170843567116794, 0.8131371914261101, 0.8178446989684283, 0.8379705917936261, 0.8879177080356808, 0.9898223241320359, 0.9996345363241633, 0.9777956276588491, 0.9640777300874666, 0.9605040436831844, 0.9634381096117227, 0.9886238495836659, 1, 1, 1, 1, 1, 1, 1, 0.8141537422491126, 0.6121381718811919, 0.4101200478866894, 0.20809926378294383];
    var yr = [0, 0.0014830024719220312, 0.006271483964877506, 0.014797212486065591, 0.02769392953623761, 0.04574316084159404, 0.07001520557364357, 0.10195927153714728, 0.14369864865425866, 0.1984502883028416, 0.2715237149367115, 0.37253368859281805, 0.5205793158406721, 0.7375917828695508, 0.9104180272737995, 0.9349210105457959, 0.937337652405964, 0.9250355082112339, 0.8651611993467041, 0.8311151899130458, 0.8170843567116794, 0.8131371914261101, 0.8178446989684283, 0.8379705917936261, 0.8879177080356808, 0.9898223241320359, 0.9996345363241633, 0.9777956276588491, 0.9640777300874666, 0.9605040436831844, 0.9634381096117227, 0.9886238495836659, 1, 1, 1, 1, 1, 1, 1, 0.8141537422491126, 0.6121381718811919, 0.4101200478866894, 0.20809926378294383];
    var kl = [0.03366816432129513, 0.11952198281960436, 0.2784508839747254, 0.4442649430635907, 0.6437174857625555, 0.8800546066824481, 1.1685448682206916, 1.5289958680752007, 1.9995854876353025, 2.630530293860789, 3.5842516885122095, 4.966971388625602, 7.92886847088395, 9.31487460671156, 3.931310742842477, -0.17663489088006465, 0.16710158733085137, -1.7373447525977674, -2.3119556624074953, -0.8487927033451372, -0.3505556962252283, -0.014212321107480946, 0.5032081050055137, 1.130388347391859, 3.8044376479010564, 2.785179335645486, -0.8688346261321024, -0.8252045867391956, -0.3105046127353629, -0.11151654325327016, 0.6759786058048226, 0.9506976634949852, 0.12802892913837505, -0.0294184275907367, -0.010355218775427924, 0.0708393026924636, -0.27300199199438663, 1.021168665285085, -3.811672669146473, -9.191106465315206, -8.294491812567474, -8.539171774077701, -8.457723511498411];
    var kr = [0.03366816432129513, 0.11952198281960436, 0.2784508839747254, 0.4442649430635907, 0.6437174857625555, 0.8800546066824481, 1.1685448682206916, 1.5289958680752007, 1.9995854876353025, 2.630530293860789, 3.5842516885122095, 4.966971388625602, 7.92886847088395, 9.31487460671156, 3.931310742842477, -0.17663489088006465, 0.16710158733085137, -1.7373447525977674, -2.3119556624074953, -0.8487927033451372, -0.3505556962252283, -0.014212321107480946, 0.5032081050055137, 1.130388347391859, 3.8044376479010564, 2.785179335645486, -0.8688346261321024, -0.8252045867391956, -0.3105046127353629, -0.11151654325327016, 0.6759786058048226, 0.9506976634949852, 0.12802892913837505, -0.0294184275907367, -0.010355218775427924, 0.0708393026924636, -0.27300199199438663, 1.021168665285085, -3.811672669146473, -9.191106465315206, -8.294491812567474, -8.539171774077701, -8.457723511498411];
    var add = function(x, y) {
        return x + y
    };
    var sub = function(x, y) {
        return x - y
    };
    var mul = function(x, y) {
        return x * y
    };
    function _at(x1, p) {
        var x1, a, b, t;
        a = sub(mul(kl[p], x[p + 1] - x[p]), sub(yr[p + 1], yl[p]));
        b = add(mul(kr[p + 1], x[p] - x[p + 1]), sub(yr[p + 1], yl[p]));
        t = (x1 - x[p]) / (x[p + 1] - x[p]);
        var s = t * (1 - t);
        return add(add(add(mul(1 - t, yl[p]), mul(t, yr[p + 1])), mul(a, s * (1 - t))), mul(b, s * t));
    }
    function at(x0) {
        if (typeof x0 === 'number') {
            var n = x.length;
            var p, q, mid, floor = Math.floor, a, b, t;
            p = 0;
            q = n - 1;
            while (q - p > 1) {
                mid = floor((p + q) / 2);
                if (x[mid] <= x0)
                    p = mid;
                else
                    q = mid;
            }
            return _at(x0, p);
        }
        var n = x0.length, i, ret = Array(n);
        for (i = n - 1; i !== -1; --i)
            ret[i] = at(x0[i]);
        return ret;
    }
    return at(phase);
}

function extractFrameValues(framevalues) {
  var xs = [];
  var ys = [];

  for (var i = 0; i < framevalues.values.length; i++) {
    var framevalue = framevalues.values[i];
    xs.push(framevalue.time);
    ys.push(framevalue.value[1]);
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
