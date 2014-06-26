import numpy as np
import scipy.stats as st

np.set_printoptions(precision=20)

np.random.seed(666)
a = np.random.rand(10)

print a.tolist()

print "min", np.array([np.min(a)])
print "max", np.array([np.max(a)])
print "mean", np.array([np.mean(a)])
print "gmean", np.array([st.gmean(a)])
print "hmean", np.array([st.hmean(a)])
print "var", np.array([np.var(a)])
print "std", np.array([np.std(a)])
print "kurtosis", np.array([st.kurtosis(a)])
print "skew", np.array([st.skew(a)])


p = [0.0000001, 0.00001, 0.001, 0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65,
    0.75, 0.85, 0.95, 0.999, 0.99999, 0.9999999]

x = st.norm.ppf(p)

print x
