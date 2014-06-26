var st = require("../statkit.js")
  , tape = require("tape")

tape("stats", function(t) {

  var a = [0.7004371218578347, 0.8441866428504345, 0.6765143359376254,
           0.7278580572480748, 0.9514579574463393, 0.012703197034767633,
           0.41358769878652346, 0.04881279380000003, 0.09992856132121142,
           0.5080663057670065];

  var tol = 1e-16;

  function near(a, b, msg) {
    t.ok(Math.abs(a - b) < tol, msg)
  }

  t.equal(st.min(a), 0.01270319703476763262, "min")
  t.equal(st.max(a), 0.95145795744633931967, "max")
  near(st.mean(a), 0.49835526720498179998, "mean")
  near(st.gmean(a), 0.28557127946531724039, "gmean")
  near(st.hmean(a), 0.08325329480982600339, "hmean")
  near(st.var(a), 0.10541207022165724472, "var")
  near(st.std(a), 0.32467225046446029912, "std")
  near(st.kurt(a), -1.34748749550481905501, "kurt")
  near(st.skew(a), -0.31810224917209384277, "skew")

  t.end()
})
