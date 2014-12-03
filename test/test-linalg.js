var st = require("../statkit.js")
  , tape = require("tape")

tape.Test.prototype.nearequal = function (a, b, tol, msg, extra) {
  var r;
  if (b === 0.0) {
    r = Math.abs(a) < tol;
  } else {
    r = (a - b) / b < tol;
  }
  this._assert(r, {
    message : msg,
    operator : 'near equal',
    actual : a,
    expected : b,
    extra : extra
  });
};

tape("linalg", function(t) {

  function hilbert(n) {
    var A = new Array(n*n);
    for (var i = 0; i < n; ++i) {
      for (var j = 0; j < n; ++j) {
        A[n*i + j] = 1.0/(i+j+1.0);
      }
    }
    return A;
  }

  function vandermonde(n) {
    var A = new Array(n*n);
    for(var i = 0; i < n; ++i) {
      for(var j = 0; j < n; ++j) {
        A[n*i + j] = Math.pow(i + 1.0, n - j - 1.0);
      }
    }
    return A;
  }

  function rhs(n) {
    var b = new Array(n);
    for (var i = 0; i < n; ++i) {
      b[i] = i + 1;
    }
    return b;
  }

  var hilb2 = hilbert(2);
  var hilb3 = hilbert(3);
  var hilb4 = hilbert(4);
  var hilb12 = hilbert(12);

  var hilb2_rhs = rhs(2);
  var hilb3_rhs = rhs(3);
  var hilb4_rhs = rhs(4);
  var hilb12_rhs = rhs(12);

  var hilb2_solution = [-8.0, 18.0];
  var hilb3_solution = [27.0, -192.0, 210.0];
  var hilb4_solution = [-64.0, 900.0, -2520.0, 1820.0];
  var hilb12_solution = [-1728.0, 245388.0, -8528520.0,
                          127026900.0, -1009008000.0, 4768571808.0,
                          -14202796608.0, 27336497760.0, -33921201600.0,
                          26189163000.0, -11437874448.0, 2157916488.0 ];

  var vander2 = vandermonde(2);
  var vander3 = vandermonde(3);
  var vander4 = vandermonde(4);
  var vander12 = vandermonde(12);

  var vander2_rhs = rhs(2);
  var vander3_rhs = rhs(3);
  var vander4_rhs = rhs(4);
  var vander12_rhs = rhs(12);

  var vander2_solution = [1.0, 0.0];
  var vander3_solution = [0.0, 1.0, 0.0];
  var vander4_solution = [0.0, 0.0, 1.0, 0.0];
  var vander12_solution = [0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 0.0, 0.0,
                            0.0, 0.0, 1.0, 0.0];

  var eps = 2.2204460492503131e-16;

  function lu_test(A, b, x, n, tol, msg) {
    Ac = A.slice(0);
    bc = b.slice(0);
    res = st.lufactor(Ac, n);
    st.lusolve(Ac, res[1], bc);
    for (var i = 0; i < n; ++i) {
      t.nearequal(bc[i], x[i], tol, msg + "-" + i);
    }
  }

  lu_test(hilb2, hilb2_rhs, hilb2_solution, 2, 8 * eps, "lu-hilb2");
  lu_test(hilb3, hilb3_rhs, hilb3_solution, 3, 64 * eps, "lu-hilb3");
  lu_test(hilb4, hilb4_rhs, hilb4_solution, 4, 1024 * eps, "lu-hilb4");
  lu_test(hilb12, hilb12_rhs, hilb12_solution, 12, 0.5, "lu-hilb12");

  lu_test(vander2, vander2_rhs, vander2_solution, 2, 8.0 * eps, "lu-vander2");
  lu_test(vander3, vander3_rhs, vander3_solution, 3, 64.0 * eps, "lu-vander3");
  lu_test(vander4, vander4_rhs, vander4_solution, 4, 1024.0 * eps, "lu-vander4");
  lu_test(vander12, vander12_rhs, vander12_solution, 12, 0.05, "lu-vander12");

  function qr_test(A, b, x, n, tol, msg) {
    Ac = A.slice(0);
    bc = b.slice(0);
    tau = st.qrfactor(n, n, Ac);
    st.qrsolve(n, n, Ac, tau, bc);
    for (var i = 0; i < n; ++i) {
      t.nearequal(bc[i], x[i], tol, msg + "-" + i);
    }
  }

  qr_test(hilb2, hilb2_rhs, hilb2_solution, 2, 8 * eps, 'qr-hilb2');
  qr_test(hilb3, hilb3_rhs, hilb3_solution, 3, 64 * eps, 'qr-hilb3');
  qr_test(hilb4, hilb4_rhs, hilb4_solution, 4, 1024 * eps, 'qr-hilb4');
  qr_test(hilb12, hilb12_rhs, hilb12_solution, 12, 0.5, 'qr-hilb12');

  qr_test(vander2, vander2_rhs, vander2_solution, 2, 8.0 * eps, "qr-vander2");
  qr_test(vander3, vander3_rhs, vander3_solution, 3, 64.0 * eps, "qr-vander3");
  qr_test(vander4, vander4_rhs, vander4_solution, 4, 1024.0 * eps, "qr-vander4");
  qr_test(vander12, vander12_rhs, vander12_solution, 12, 0.05, "qr-vander12");

  t.end()
})
