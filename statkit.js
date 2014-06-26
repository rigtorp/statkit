"use strict"

exports.min = function(a) {
  var n = a.length;
  var s = a[0];
  for (var i = 1; i < n; ++i) {
    if (a[i] < s) {
      s = a[i];
    }
  }
  return s;
};

exports.max = function(a) {
  var n = a.length;
  var s = a[0];
  for (var i = 1; i < n; ++i) {
    if (a[i] > s) {
      s = a[i];
    }
  }
  return s;
};

exports.mean = function(a) {
  var n = a.length;
  var s = 0.0;
  for (var i = 0; i < n; ++i) {
    s += a[i];
  }
  return s / n;
};

exports.gmean = function(a) {
  var n = a.length;
  var s = 0.0;
  for (var i = 0; i < n; ++i) {
    s += Math.log(a[i]);
  }
  return Math.exp(s / n);
};

exports.hmean = function(a) {
  var n = a.length;
  var s = 0.0;
  for (var i = 0; i < n; ++i) {
    s += 1.0 / a[i];
  }
  return n / s;
};

exports.var = function(a, m) {
  var n = a.length;
  var s = 0.0;
  if (m === void 0) {
    m = exports.mean(a);
  }
  for (var i = 0; i < n; ++i) {
    var z = a[i] - m;
    s += z * z;
  }
  return s / n;
};

exports.std = function(a, m) {
  return Math.sqrt(exports.var(a, m));
};

exports.skew = function(a, m) {
  var n = a.length;
  var cm2 = 0.0;
  var cm3 = 0.0;
  if (m === void 0) {
    m = exports.mean(a);
  }
  for (var i = 0; i < n; ++i) {
    var z = a[i] - m;
    var z2 = z * z;
    cm2 += z2;
    cm3 += z2 * z;
  }
  cm2 /= n;
  cm3 /= n;
  return cm3 / Math.sqrt(cm2 * cm2 * cm2);
};

exports.kurt = function(a, m) {
  var n = a.length;
  var cm2 = 0.0;
  var cm4 = 0.0;
  if (m === void 0) {
    m = exports.mean(a);
  }
  for (var i = 0; i < n; ++i) {
    var z = a[i] - m;
    var z2 = z * z;
    cm2 += z2;
    cm4 += z2 * z2;
  }
  cm2 /= n;
  cm4 /= n;
  return (cm4 / (cm2 * cm2)) - 3;
};

exports.corr = function(x, y) {
  var n = x.length;
  var xm = exports.mean(x);
  var ym = exports.mean(y);
  var sxy = 0.0;
  var sx2 = 0.0;
  var sy2 = 0.0;
  for (var i = 0; i < n; ++i) {
    var xz = x[i] - xm;
    var yz = y[i] - ym;
    sxy += xz * yz;
    sx2 += xz * xz;
    sy2 += yz * yz;
  }
  return sxy / Math.sqrt(sx2 * sy2);
};

exports.sample = function(a) {
  var n = a.length;
  var s = a.slice(0);
  for (var i = 0; i < n; ++i) {
    s[i] = a[Math.floor(n * Math.random())];
  }
  return s;
}

exports.boot = function(nboot, bootfun) {
  var data = [];
  for (var i = 2; i < arguments.length; ++i) {
    data[i - 2] = arguments[i];
  }
  var sample = [];
  for (var i = 0; i < data.length; ++i) {
    sample[i] = data[i].slice(0);
  }
  var n = data[0].length;
  var res = Array(nboot);
  for (var i = 0; i < nboot; ++i) {
    for (var j = 0; j < n; ++j) {
      var idx = Math.floor(n * Math.random());
      for (var k = 0; k < sample.length; ++k) {
        sample[k][j] = data[k][idx];
      }
    }
    res[i] = bootfun.apply(null, sample);
  }
  return res;
};

exports.bootci = function(nboot, bootfun) {
  var data = [];
  for (var i = 2; i < arguments.length; ++i) {
    data[i - 2] = arguments[i];
  }
  var v = bootfun.apply(null, data);
  var bootstat = exports.boot.apply(null, [nboot, bootfun].concat(data));
  var s = exports.std(bootstat);
  return [v - 2*s, v + 2*s];
};

// http://picomath.org/javascript/erf.js.html
exports.erf = function(x) {
  // constants
  var a1 =  0.254829592;
  var a2 = -0.284496736;
  var a3 =  1.421413741;
  var a4 = -1.453152027;
  var a5 =  1.061405429;
  var p  =  0.3275911;

  // Save the sign of x
  var sign = 1;
  if (x < 0) {
      sign = -1;
  }
  x = Math.abs(x);

  // A&S formula 7.1.26
  var t = 1.0/(1.0 + p*x);
  var y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);

  return sign*y;
};


exports.normcdf = function(x) {
  return 0.5 * (1.0 + exports.erf(x / Math.sqrt(2)));
}
