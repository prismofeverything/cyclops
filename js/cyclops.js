var cyclops = function() {
  // given a stream of data, generate a polynomial fit to that stream
  // that can be called in its place

  var inverse = function(v) {
    // take the inverse of each component of a vector

    var inv = [];
    var len = v.length;
    for (var o = 0; o < len; o++) {
      inv[o] = (v[o] === 0) ? 0 : 1.0 / v[o];
    }
    return inv;
  };

  var seedPoly = function(data, degree) {
    // given an array of data, build a matrix from that data where
    // each row is a data point and each column is an ascending integral power
    // of that data point.

    var size = data.length;
    if (size > 1) {
      var xStep = 1.0 / (size - 1);
      var M = [];
      for (var j = 0; j < size; j++) {
        var row = [];
        for (var k = 0; k < degree + 1; k++) {
          var x = xStep * j;
          row[k] = Math.pow(x, k);
        }
        M[j] = row;
      }

      return M;
    } else {
      return data;
    }
  }

  var pseudoInverse = function(M) {
    // given a matrix, perform a singular value decomposition and use
    // the result to do a pseudoinverse on that matrix

    // perform the singular value decomposition
    var singular = numeric.svd(M);
    var U = singular.U;
    var V = singular.V;
    var S = singular.S;

    // find the inverse of the singular values
    var Sinverse = inverse(S);

    // construct a new inverse transpose matrix from the inverted singular values
    var dim = numeric.dim(M);
    var Stranspose = numeric.rep([dim[1], dim[0]], 0);

    for (var z = 0; z < S.length; z++) {
      Stranspose[z][z] = Sinverse[z];
    }

    // perform the transformations in reverse and transposed!
    var VS = numeric.dot(V, Stranspose);
    var Minverse = numeric.dotMMsmall(VS, numeric.transpose(U));

    // return the newly constructued pseudoinverse
    return Minverse;
  }

  var polyfit = function(data, degree) {
    // given an array of data and the maximum polynomial degree to seek a fit for,
    // find the coefficients for the fitted polynomial

    var size = data.length;
    if (size > 0) {
      var M = seedPoly(data, degree);
      var Minverse = pseudoInverse(M);
      var result = numeric.dot(Minverse, data);
      return result;
    } else {
      return [];
    }
  };

  var generatePoly = function(data, degree) {
    // given an array of data and the maximal degree to seek a fit for,
    // construct a function that emulates the given data over the range [0..1]

    var poly = polyfit(data, degree);
    return function(t) {
      var sum = 0;
      for (var w = 0; w < poly.length; w++) {
        sum += poly[w] * Math.pow(t, w);
      }
      return sum;
    }
  };

  var generateSpline = function(xs, ys) {
    if (!ys) {
      ys = xs;
      xs = numeric.linspace(0, 1, ys.length);
    }

    var spline = numeric.spline(xs, ys);
    return spline;
  };

  var generateCubic = function(xs, ys) {
    var spline = generateSpline(xs, ys);
    return function(x) {
      return spline.at(x);
    }
  };

  var outputSpline = function(xs, ys) {
    var spline = generateSpline(xs, ys);
    console.log(spline);
    var x = spline.x;
    var y = spline.yl;
    var k = spline.kr;

    var fn = "\
      var x = [" + x + "];\
      var yl = [" + y + "];\
      var yr = [" + y + "];\
      var kl = [" + k + "];\
      var kr = [" + k + "];\
      var add = function(x, y) {return x+y};\
      var sub = function(x, y) {return x-y};\
      var mul = function(x, y) {return x*y};\
\
      function _at(x1,p) {\
        var x1,a,b,t;\
        a = sub(mul(kl[p],x[p+1]-x[p]),sub(yr[p+1],yl[p]));\
        b = add(mul(kr[p+1],x[p]-x[p+1]),sub(yr[p+1],yl[p]));\
        t = (x1-x[p])/(x[p+1]-x[p]);\
        var s = t*(1-t);\
        return add(add(add(mul(1-t,yl[p]),mul(t,yr[p+1])),mul(a,s*(1-t))),mul(b,s*t));\
      }\
\
      function at(x0) {\
        if(typeof x0 === 'number') {\
          var n = x.length;\
          var p,q,mid,floor = Math.floor,a,b,t;\
          p = 0;\
          q = n-1;\
          while(q-p>1) {\
            mid = floor((p+q)/2);\
            if(x[mid] <= x0) p = mid;\
            else q = mid;\
          }\
          return _at(x0,p);\
        }\
        var n = x0.length, i, ret = Array(n);\
        for(i=n-1;i!==-1;--i) ret[i] = at(x0[i]);\
        return ret;\
      }\
\
      return at(phase);"

    return fn;
  };

  return {
    inverse: inverse,
    seedPoly: seedPoly,
    pseudoInverse: pseudoInverse,
    polyfit: polyfit,
    generatePoly: generatePoly,
    generateCubic: generateCubic,
    outputSpline: outputSpline
  };
} ();
