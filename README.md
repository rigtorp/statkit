statkit
=======

A statistics toolkit for javascript.

Usage
=====

Install using [npm](https://npmjs.org):
```
npm install statkit
```

Calculate a confidence interval for a correlation using the bootstrap method:

```javascript
var sk = require("statkit");

var lsat = [576, 635, 558, 578, 666, 580, 555,
            661, 651, 605, 653, 575, 545, 572, 594];
var gpa = [3.39, 3.30, 2.81, 3.03, 3.44, 3.07, 3.00,
           3.43, 3.36, 3.13, 3.12, 2.74, 2.76, 2.88, 2.96];

var corr = sk.corr(gpa, lsat);
var ci = sk.bootci(100000, sk.corr, gpa, lsat);

console.log("corr = ", corr, "ci = ", ci);
```

Perform a linear regression on the first data set in
[Anscombe's quartet](http://en.wikipedia.org/wiki/Anscombe%27s_quartet):

```javascript
var sk = require("statkit");

var x = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];
var y = [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68];

var A = new Array(x.length*2);
for (var i = 0; i < x.length; ++i) {
  A[2*i] = 1;
  A[2*i + 1] = x[i];
}
var b = sk.lstsq(x.length, 2, A, y);

console.log("intercept = ", b[0], "slope = ", b[1]);
```

Functions
=========

* `min(a)` - [Minimum](http://en.wikipedia.org/wiki/Minimum)
* `max(a)` - [Maximum](http://en.wikipedia.org/wiki/Maximum)
* `range(a)` - [Range](http://en.wikipedia.org/wiki/Range_(statistics))
* `quantile(a)` - [Quantile](http://en.wikipedia.org/wiki/Quantile)
* `median(a)` - [Median](http://en.wikipedia.org/wiki/Median)
* `iqr(a)` - [Interquartile range](http://en.wikipedia.org/wiki/Interquartile_range)
* `mean(a)` - [Mean](http://en.wikipedia.org/wiki/Mean)
* `gmean(a)` - [Geometric mean](http://en.wikipedia.org/wiki/Mean)
* `hmean(a)` - [Harmonic mean](http://en.wikipedia.org/wiki/Mean)
* `var(a)` - [Variance](http://en.wikipedia.org/wiki/Variance)
* `std(a)` - [Standard deviation](http://en.wikipedia.org/wiki/Standard_deviation)
* `skew(a)` - [Skewness](http://en.wikipedia.org/wiki/Skewness)
* `kurt(a)` - [Kurtosis](http://en.wikipedia.org/wiki/Kurtosis)
* `corr(x, y)` - [Correlation](http://en.wikipedia.org/wiki/Correlation) between x and y
* `entropy(p)` - [Entropy](http://en.wikipedia.org/wiki/Entropy_(information_theory))
* `kldiv(p, q)` - [Kullback–Leibler divergence](http://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence)
* `shuffle(a)` - [Shuffle](http://en.wikipedia.org/wiki/Random_permutation) using the [Fisher–Yates shuffle](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
* `sample(a)` - [Sample](http://en.wikipedia.org/wiki/Sampling_(statistics)) with replacement
* `boot(nboot, bootfun, data...)` - [Bootstrap](http://en.wikipedia.org/wiki/Bootstrapping_(statistics)) the bootfun statistic
* `bootci(nboot, bootfun, data...)` - Calculate bootstrap confidence intervals using the normal model
* `randn()` - Draw random sample from the [standard normal distribution](http://en.wikipedia.org/wiki/Normal_distribution) using the [Marsaglia polar method](http://en.wikipedia.org/wiki/Marsaglia_polar_method)
* `normcdf(x)` - Normal cumulative distribution function
* `norminv(p)` - Normal inverse cumulative distribution function
* `lufactor(A, n)` - Compute pivoted [LU decomposition](http://en.wikipedia.org/wiki/LU_decomposition)
* `lusolve(LU, p, b)` - Solve `Ax=b` given the LU factorization of `A`
* `qrfactor(m, n, A)` - Compute [QR factorization](http://en.wikipedia.org/wiki/QR_decomposition) of A
* `qrsolve(m, n, QR, tau, b)` - Solve the least squares problem `min ||Ax = b||` using QR factorization `QR` of `A`
* `lstsq(m, n, A, b)` - Solve the [least squares problem](http://en.wikipedia.org/wiki/Least_squares) `min ||Ax = b||`

Credits
=======
(c) 2014 Erik Rigtorp <erik@rigtorp.se>. MIT License
