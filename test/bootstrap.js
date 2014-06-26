var st = require("../statkit.js")
  , tape = require("tape")

tape("bootstrap", function(t) {

  var lsat = [576, 635, 558, 578, 666, 580, 555, 661, 651, 605, 653, 575, 545, 572, 594];
  var gpa = [3.39, 3.30, 2.81, 3.03, 3.44, 3.07, 3.00, 3.43, 3.36, 3.13, 3.12, 2.74, 2.76, 2.88, 2.96];

  t.ok(Math.abs(st.corr(gpa, lsat) - 0.776) < 1e-3, "corr");

  var ci = st.bootci(100000, st.corr, gpa, lsat);
  t.ok(Math.abs(ci[0] - 0.509) < 1e-2, "lci");
  t.ok(Math.abs(ci[1] - 1.043) < 1e-2, "uci");

  t.end();
})
