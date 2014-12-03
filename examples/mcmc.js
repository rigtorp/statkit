var sk = require("../statkit.js");

// log-likelihood for the model y ~ N(m*x + b, 1/t)
function lnlike(theta, x, y) {
  var m = theta[0], b = theta[1], t = theta[2];
  var s = 0.0;
  for (var i = 0; i < x.length; i++) {
    var r = y[i] - (m * x[i] + b);
    s += r*r*t - Math.log(t);
  }
  return -0.5*s;
}

// uniform log-prior for m, b, t
function lnprior(theta) {
  var m = theta[0], b = theta[1], t = theta[2];
  if (0.0 < m && m < 1.0 && 0.0 < b && b < 10.0 && 0.0 < t && t < 100.0) {
    return 0.0;
  }
  return -Infinity;
}

// posterior log-probability function
function lnpost(theta, x, y) {
  var lp = lnprior(theta);
  if (!isFinite(lp)) {
    return -Infinity;
  }
  return lp + lnlike(theta, x, y);
}

var x = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];
var y = [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68];

var res = sk.metropolis(function(theta) { return lnpost(theta, x, y); },
  [0.5, 3.0, 1.0], 1000000, 0.1, 50000, 100);

console.log('acceptance rate:', res.accepted)
console.log('posteriors (16/50/84 percentiles):')
console.log('m', sk.quantile(res.chain[0], 0.16),
  sk.median(res.chain[0]), sk.quantile(res.chain[0], 0.84))
console.log('b', sk.quantile(res.chain[1], 0.16),
  sk.median(res.chain[1]), sk.quantile(res.chain[1], 0.84))
console.log('t', sk.quantile(res.chain[2], 0.16),
  sk.median(res.chain[2]), sk.quantile(res.chain[2], 0.84))
