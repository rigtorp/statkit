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

Functions
=========

* min(a) - Minimum
* max(a) - Maximum
* mean(a) - Mean
* gmean(a) - Geometric mean
* hmean(a) - Harmonic mean
* var(a) - Variance
* std(a) - Standard deviation
* skew(a) - Skewness
* kurt(a) - Kurtosis
* corr(x, y) - Correlation between x and y
* sample(a) - Sample with replacement
* boot(nboot, bootfun, data...) - Bootstrap the bootfun statistic
* bootci(nboot, bootfun, data...) - Calculate bootstrap confidence intervals using the normal model

Credits
=======
(c) 2014 Erik Rigtorp <erik@rigtorp.se>. MIT License
