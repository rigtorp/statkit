"use strict";

function min(a) {
  var n = a.length;
  var s = a[0];
  for (var i = 1; i < n; ++i) {
    if (a[i] < s) {
      s = a[i];
    }
  }
  return s;
};

function max(a) {
  var n = a.length;
  var s = a[0];
  for (var i = 1; i < n; ++i) {
    if (a[i] > s) {
      s = a[i];
    }
  }
  return s;
};

function mean(a) {
  var n = a.length;
  var s = 0.0;
  for (var i = 0; i < n; ++i) {
    s += a[i];
  }
  return s / n;
};

function gmean(a) {
  var n = a.length;
  var s = 0.0;
  for (var i = 0; i < n; ++i) {
    s += Math.log(a[i]);
  }
  return Math.exp(s / n);
};

function hmean(a) {
  var n = a.length;
  var s = 0.0;
  for (var i = 0; i < n; ++i) {
    s += 1.0 / a[i];
  }
  return n / s;
};

function var_(a, m) {
  var n = a.length;
  var s = 0.0;
  if (m === void 0) {
    m = mean(a);
  }
  for (var i = 0; i < n; ++i) {
    var z = a[i] - m;
    s += z * z;
  }
  return s / n;
};

function std(a, m) {
  return Math.sqrt(var_(a, m));
};

function skew(a, m) {
  var n = a.length;
  var cm2 = 0.0;
  var cm3 = 0.0;
  if (m === void 0) {
    m = mean(a);
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

function kurt(a, m) {
  var n = a.length;
  var cm2 = 0.0;
  var cm4 = 0.0;
  if (m === void 0) {
    m = mean(a);
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

function corr(x, y) {
  var n = x.length;
  var xm = mean(x);
  var ym = mean(y);
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

function entropy(p) {
  var n = p.length;
  var e = 0.0;
  for (var i = 0; i < n; ++i) {
    e -= p[i] * Math.log(p[i]);
  }
  return e;
};

function kldiv(p, q) {
  var n = p.length;
  var e = 0.0;
  var ce = 0.0;
  for (var i = 0; i < n; ++i) {
    e -= p[i] * Math.log(p[i]);
    ce -= p[i] * Math.log(q[i]);
  }
  return ce - e;
};

// http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(a) {
  var n = a.length;
  for (var i = n - 1; i > 0; i--) {
    var j = Math.random() * i | 0; // 0 ≤ j < i
    var t = array[j];
    array[j] = array[i];
    array[i] = t;
  }
  return a;
};

function sample(a) {
  var n = a.length;
  var s = a.slice(0);
  for (var i = 0; i < n; ++i) {
    s[i] = a[Math.floor(n * Math.random())];
  }
  return s;
};

// Efron, B. Bootstrap Methods: Another Look at the Jackknife.
// The Annals of Statistics 7 (1979), no. 1, 1--26. doi:10.1214/aos/1176344552.
// http://projecteuclid.org/euclid.aos/1176344552.
function boot(nboot, bootfun) {
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

function bootci(nboot, bootfun) {
  var data = [];
  for (var i = 2; i < arguments.length; ++i) {
    data[i - 2] = arguments[i];
  }
  var v = bootfun.apply(null, data);
  var bootstat = boot.apply(null, [nboot, bootfun].concat(data));
  var s = std(bootstat);
  return [v - 2*s, v + 2*s];
};

// http://en.wikipedia.org/wiki/Marsaglia_polar_method
// TODO: implement http://en.wikipedia.org/wiki/Ziggurat_algorithm
function randn() {
  var u, v, s;
  do {
    u = Math.rand() * 2 - 1;
    v = Math.rand() * 2 - 1;
    s = u * u + v * v;
  } while (s >= 1 || s == 0);
  s = Math.sqrt(-2 * Math.log(s) / s);
  return u * s;
};

// http://picomath.org/javascript/erf.js.html
function erf(x) {
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

function normcdf(x) {
  return 0.5 * (1.0 + erf(x / Math.sqrt(2)));
};

exports.min = min;
exports.max = max;
exports.mean = mean;
exports.gmean = gmean;
exports.hmean = hmean;
exports.var = var_;
exports.std = std;
exports.skew = skew;
exports.kurt = kurt;
exports.corr = corr;
exports.entropy = entropy;
exports.kldiv = kldiv;
exports.shuffle = shuffle;
exports.sample = sample;
exports.boot = boot;
exports.bootci = bootci;
exports.randn = randn;
exports.erf = erf;
exports.normcdf = normcdf;
