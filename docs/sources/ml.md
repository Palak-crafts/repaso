# Sources: ML fundamentals (`ml`)

One line per source: link, then the facts it backs. The monthly report checks that these links still answer. All checked in November 2026.

- [scikit-learn: cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html): k-fold, stratified and grouped splits, a validation set for tuning and a test set for the final score (ML-02, ML-13, ML-14, ML-18).
- [scikit-learn: common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html): data leakage, fitting preprocessing on training data only, using a `Pipeline` (ML-11, ML-29).
- [scikit-learn: nested versus non-nested cross-validation](https://scikit-learn.org/stable/auto_examples/model_selection/plot_nested_cross_validation_iris.html): why a score used to pick hyperparameters is optimistic (ML-14, ML-37).
- [scikit-learn: `TimeSeriesSplit`](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html): training folds always come before the test fold (ML-23).
- [scikit-learn: `GroupKFold`](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupKFold.html): the same group is never in both training and test folds (ML-24).
- [scikit-learn: metrics and scoring](https://scikit-learn.org/stable/modules/model_evaluation.html): precision, recall, F1, ROC-AUC, average precision, confusion matrix (ML-08, ML-09, ML-10, ML-19, ML-20, ML-21).
- [scikit-learn: linear models](https://scikit-learn.org/stable/modules/linear_model.html): ridge (L2) shrinks coefficients, lasso (L1) gives sparse coefficients, elastic net mixes both (ML-12, ML-25).
- [scikit-learn: `Ridge`](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html): `alpha` is the regularization strength (ML-25).
- [scikit-learn: decision trees](https://scikit-learn.org/stable/modules/tree.html): deep trees overfit; depth and leaf size limit them (ML-15).
- [scikit-learn: ensembles](https://scikit-learn.org/stable/modules/ensemble.html): random forest (bootstrap samples, random feature subsets, averaging) and gradient boosting (sequential trees fit to the loss gradient) (ML-16, ML-27).
- [scikit-learn: permutation feature importance](https://scikit-learn.org/stable/modules/permutation_importance.html): impurity-based importance favours high-cardinality features; permutation importance on held-out data is the alternative (ML-28).
- [scikit-learn: feature selection](https://scikit-learn.org/stable/modules/feature_selection.html): selection belongs inside the pipeline (ML-12, ML-29).
- [scikit-learn: `compute_class_weight`](https://scikit-learn.org/stable/modules/generated/sklearn.utils.class_weight.compute_class_weight.html): the "balanced" weight is `n_samples / (n_classes * np.bincount(y))` (ML-30).
- [scikit-learn: probability calibration](https://scikit-learn.org/stable/modules/calibration.html): reliability curves, Platt scaling, isotonic regression (ML-31, ML-38).
- [scikit-learn: preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html): why features are standardized and which models are sensitive to scale (ML-26).
- [Google ML Crash Course: overfitting](https://developers.google.com/machine-learning/crash-course/overfitting/overfitting): overfitting, generalization, train/validation/test roles (ML-02, ML-05, ML-07).
- [Google ML Crash Course: accuracy, precision, recall](https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall): the formulas, and why accuracy misleads on imbalanced data (ML-08, ML-09, ML-10).
- [Google: Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml): training-serving skew, offline versus online metrics, monitoring in production (ML-33, ML-34, ML-35, ML-36, ML-39).

Not backed by one page, so they rest on standard textbook results: the expected-cost threshold `p > cost_FP / (cost_FP + cost_FN)` (ML-38) and selection bias in credit scoring (ML-40). The Spanish and English versions of these two say it as a general principle, with no figures from a named source.
