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

  var generateCubic = function(xs, ys) {
    // build a cubic spline between the given data points.

    if (!ys) {
      ys = xs;
      xs = numeric.linspace(0, 1, ys.length);
    }

    var spline = numeric.spline(xs, ys);
    return function(x) {
      return spline.at(x);
    }
  };

  return {
    inverse: inverse,
    seedPoly: seedPoly,
    pseudoInverse: pseudoInverse,
    polyfit: polyfit,
    generatePoly: generatePoly,
    generateCubic: generateCubic
  };
} ();
