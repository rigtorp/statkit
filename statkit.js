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

function range(a) {
  return max(a) - min(a);
};

function quantile(a, p, sorted) {
  var t = a;
  if (sorted === void 0) {
    t = a.slice(0);
    t.sort(function(a, b){return a-b});
  }
  return t[Math.floor(p * t.length)];
};

function median(a, sorted) {
  var t = a;
  if (sorted === void 0) {
    t = a.slice(0);
    t.sort(function(a, b){return a-b});
  }
  if ((t.length % 2) === 0) {
    var idx = t.length / 2;
    return (t[idx - 1] + t[idx]) / 2;
  }
  return t[(t.length - 1) / 2];
};

function iqr(a, sorted) {
  return quantile(a, 0.75, sorted) - quantile(a, 0.25, sorted);
};

function mean(a) {
  var n = a.length;
  var m = 0.0;
  for (var i = 0; i < n; ++i) {
    m += (a[i] - m) / (i + 1);
  }
  return m;
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
  var v = 0.0;
  if (m === void 0) {
    m = mean(a);
  }
  for (var i = 0; i < n; ++i) {
    var z = a[i] - m;
    v += (z * z - v) / (i + 1);
  }
  return v;
};

function std(a, flag, m) {
  if (flag === true) {
    return Math.sqrt(var_(a, m));
  } else {
    var n = a.length;
    return Math.sqrt(var_(a, m) * n / (n - 1));
  }
};

function skew(a, m, sd) {
  var n = a.length;
  var s = 0.0;
  if (m === void 0) {
    m = mean(a);
  }
  if (sd === void 0) {
    sd = std(a, true);
  }
  for (var i = 0; i < n; ++i) {
    var z = (a[i] - m) / sd;
    s += (z * z * z - s) / (i + 1);
  }
  return s;
};

function kurt(a, m, sd) {
  var n = a.length;
  var k = 0.0;
  if (m === void 0) {
    m = mean(a);
  }
  if (sd === void 0) {
    sd = std(a, true);
  }
  for (var i = 0; i < n; ++i) {
    var z = (a[i] - m) / sd;
    k += (z * z * z * z - k) / (i + 1);
  }
  return k - 3.0;
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

/*
  Reference:

    A G Adams,
    Areas Under the Normal Curve,
    Algorithm 39,
    Computer j.,
    Volume 12, pages 197-198, 1969.
*/
function normcdf(x) {
  var a1 = 0.398942280444;
  var a2 = 0.399903438504;
  var a3 = 5.75885480458;
  var a4 = 29.8213557808;
  var a5 = 2.62433121679;
  var a6 = 48.6959930692;
  var a7 = 5.92885724438;
  var b0 = 0.398942280385;
  var b1 = 3.8052E-08;
  var b2 = 1.00000615302;
  var b3 = 3.98064794E-04;
  var b4 = 1.98615381364;
  var b5 = 0.151679116635;
  var b6 = 5.29330324926;
  var b7 = 4.8385912808;
  var b8 = 15.1508972451;
  var b9 = 0.742380924027;
  var b10 = 30.789933034;
  var b11 = 3.99019417011;
  var q;
  var y;
  var absx = Math.abs(x);

  if (absx <= 1.28) {
    y = 0.5 * x * x;
    q = 0.5 - absx * (a1 -
      a2 * y / (y + a3 -
      a4 / (y + a5 +
      a6 / (y + a7))));
  } else if (absx <= 12.7) {
    y = 0.5 * x * x;
    q = Math.exp(-y) * b0 / (absx - b1
      + b2 / (absx + b3
      + b4 / (absx - b5
      + b6 / (absx + b7
      - b8 / (absx + b9
      + b10 / (absx + b11))))));
  } else {
    q = 0.0;
  }

  if (x < 0.0)
  {
    return q;
  }
  return 1.0 - q;
};

/*
  Reference:

    Michael Wichura,
    The Percentage Points of the Normal Distribution,
    Algorithm AS 241,
    Applied Statistics,
    Volume 37, Number 3, pages 477-484, 1988.
*/
function norminv(p) {

  function rateval(a, b, x) {
    var u = a[a.length - 1];
    for (var i = a.length - 1; i > 0; --i) {
      u = x * u + a[i - 1];
    }
    var v = b[b.length - 1];
    for (var j = b.length - 1; j > 0; --j) {
      v = x * v + b[j - 1];
    }
    r = u / v;
    return r;
  };

  var a = [
    3.3871328727963666080,     1.3314166789178437745e+2,
    1.9715909503065514427e+3,  1.3731693765509461125e+4,
    4.5921953931549871457e+4,  6.7265770927008700853e+4,
    3.3430575583588128105e+4,  2.5090809287301226727e+3];
  var b = [
    1.0,                       4.2313330701600911252e+1,
    6.8718700749205790830e+2,  5.3941960214247511077e+3,
    2.1213794301586595867e+4,  3.9307895800092710610e+4,
    2.8729085735721942674e+4,  5.2264952788528545610e+3];
  var c = [
    1.42343711074968357734,     4.63033784615654529590,
    5.76949722146069140550,     3.64784832476320460504,
    1.27045825245236838258,     2.41780725177450611770e-1,
    2.27238449892691845833e-2,  7.74545014278341407640e-4];
  var d = [
    1.0,                        2.05319162663775882187,
    1.67638483018380384940,     6.89767334985100004550e-1,
    1.48103976427480074590e-1,  1.51986665636164571966e-2,
    5.47593808499534494600e-4,  1.05075007164441684324e-9];
  var e = [
    6.65790464350110377720,     5.46378491116411436990,
    1.78482653991729133580,     2.96560571828504891230e-1,
    2.65321895265761230930e-2,  1.24266094738807843860e-3,
    2.71155556874348757815e-5,  2.01033439929228813265e-7];
  var f = [
    1.0,                        5.99832206555887937690e-1,
    1.36929880922735805310e-1,  1.48753612908506148525e-2,
    7.86869131145613259100e-4,  1.84631831751005468180e-5,
    1.42151175831644588870e-7,  2.04426310338993978564e-15];

  if (p <= 0.0) {
    return Number.NEGATIVE_INFINITY;
  }
  if (p >= 1.0) {
    return Number.POSITIVE_INFINITY;
  }

  var q = p - 0.5;
  if (Math.abs(q) <= 0.425) {
    return q * rateval(a, b, 0.180625 - q*q);
  }

  var r = Math.sqrt(-Math.log(q < 0.0 ? p : 1.0 - p));
  var x;
  if (r <= 5.0) {
    x = rateval(c, d, r - 1.6);
  } else {
    x = rateval(e, f, r - 0.5);
  }
  if (p < 0.5) {
    return -x;
  }
  return x;
};

function lufactor(A, n) {
  var signum = 1;
  var p = new Array(n);
  for (var i = 0; i < n; ++i) {
    p[i] = i;
  }

  for (var j = 0; j < n - 1; ++j) {

    // find maximum of the j-th column
    var max = Math.abs(A[n*j + j]);
    var pivot = j;
    for (var i = j + 1; i < n; ++i) {
      var aij = Math.abs(A[n*i + j]);
      if (aij > max) {
        max = aij;
        pivot = i;
      }
    }

    if (pivot != j) {
      // swap rows of A
      for (var i = 0; i < n; ++i) {
        var tmp = A[n*j + i];
        A[n*j + i] = A[n*pivot + i];
        A[n*pivot + i] = tmp;
      }

      // update permutation vector
      p[j] = pivot;

      signum = -signum;
    }

    var ajj = A[n*j + j];
    if (ajj === 0.0) {
      throw "singular matrix";
    }

    for (var i = j + 1; i < n; ++i) {
      var aij = A[n*i + j] / ajj;
      A[n*i + j] = aij;
      for (var k = j + 1; k < n; ++k) {
        var aik = A[n*i + k];
        var ajk = A[n*j + k];
        A[n*i + k] = aik - aij * ajk;
      }
    }
  }
  return [A, p, signum];
};

function lusolve(LU, perm, x) {
  var n = perm.length;

  // permute x
  for (var i = 0; i < n; ++i) {
    var tmp = x[i];
    x[i] = x[perm[i]];
    x[perm[i]] = tmp;
  }

  // forward substitution Ly=Pb
  for (var i = 0; i < n; ++i) {
    var xi = x[i];
    for (var j = 0; j < i; ++j) {
      xi -= LU[n*i + j]*x[j];
    }
    x[i] = xi;
  }

  // backward substitition Ux=y
  for (var i = n - 1; i >= 0; --i) {
    var xi = x[i];
    for (var j = i + 1; j < n; ++j) {
      xi -= LU[n*i + j]*x[j];
    }
    x[i] = xi / LU[n*i + i];
  }
};

exports.min = min;
exports.max = max;
exports.range = range;
exports.quantile = quantile;
exports.median = median;
exports.iqr = iqr;
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
exports.norminv = norminv;
exports.lufactor = lufactor;
exports.lusolve = lusolve;
