# 01 · Machine learning

Classical machine learning, understood from the math and rebuilt from scratch (NumPy only).
This is the foundation the rest of the lab stands on: what a model is, what a loss is, how
optimisation finds parameters, and how to tell whether a model actually generalises.

## Layout

One folder per topic. Each topic carries its notes and its own implementation:

```
01-machine-learning/
└── <nn>-<topic>/
    ├── README.md        theory: derivation, intuition, figures
    ├── <topic>.py       from-scratch implementation (NumPy)
    └── notebook.ipynb   experiments on a small dataset
```

## Syllabus

| # | Topic | Covers | Status |
|---|-------|--------|--------|
| 01 | Linear regression | least squares, normal equation vs gradient descent, MSE | planned |
| 02 | Logistic regression | sigmoid, cross-entropy, decision boundaries | planned |
| 03 | Optimisation basics | gradient descent, learning rate, convexity, SGD | planned |
| 04 | Regularisation & generalisation | L1/L2, bias–variance, train/val/test, cross-validation | planned |
| 05 | k-nearest neighbours | distance metrics, curse of dimensionality | planned |
| 06 | Naive Bayes | MLE / MAP, generative vs discriminative | planned |
| 07 | Support vector machines | margins, hinge loss, kernels | planned |
| 08 | Decision trees & ensembles | entropy / Gini, bagging, random forests, gradient boosting | planned |
| 09 | k-means & Gaussian mixtures | clustering, EM algorithm | planned |
| 10 | PCA & dimensionality reduction | covariance, eigendecomposition, SVD | planned |
| 11 | Evaluation | accuracy, precision / recall, ROC-AUC, calibration | planned |
| 12 | Probability & information theory refresher | Bayes rule, entropy, KL divergence, MLE | planned |

## References

- Bishop, *Pattern Recognition and Machine Learning*
- Murphy, *Probabilistic Machine Learning: An Introduction*
- Stanford CS229 lecture notes
