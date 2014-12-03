var sk = require("../statkit.js");

// Anscombe's quartet
var x = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];
var y = [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68];

var A = new Array(x.length*2);
for (var i = 0; i < x.length; ++i) {
  A[2*i] = 1;
  A[2*i + 1] = x[i];
}

var b = sk.lstsq(x.length, 2, A, y);

console.log("intercept =", b[0], "slope =", b[1]);
