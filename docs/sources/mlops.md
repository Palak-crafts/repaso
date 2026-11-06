# Sources: MLOps & serving (`mlops`)

One line per source: link, then the facts it backs. The monthly report checks that these links still answer. All checked in November 2026. The topic is about concepts, so no product versions, prices or quotas are used.

- [Google Cloud: MLOps, continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning): what MLOps is, pipelines, continuous training, validation steps and model registry (MLO-01, MLO-02, MLO-07, MLO-17, MLO-18, MLO-29, MLO-36).
- [Sculley et al., Hidden Technical Debt in Machine Learning Systems (NeurIPS 2015)](https://papers.nips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html): data dependencies, feedback loops and why the model is a small part of the system (MLO-01, MLO-33, MLO-35).
- [Google: Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml): training-serving skew, logging features at serving time, monitoring, freshness of features (MLO-15, MLO-20, MLO-32, MLO-37).
- [MLflow: tracking](https://mlflow.org/docs/latest/ml/tracking/) and [MLflow: model registry](https://mlflow.org/docs/latest/ml/model-registry/): what a run records, versions, stages or aliases, lineage back to the run (MLO-05, MLO-06, MLO-11, MLO-12, MLO-30).
- [Google Cloud Vertex AI: model registry introduction](https://cloud.google.com/vertex-ai/docs/model-registry/introduction): the registry as a catalogue of versions that are deployed from (MLO-06, MLO-30).
- [Feast: point-in-time joins](https://docs.feast.dev/getting-started/concepts/point-in-time-joins): joining each row to the feature values known at its event time (MLO-15, MLO-19, MLO-37).
- [NVIDIA Triton Inference Server: model configuration](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/user_guide/model_configuration.html): dynamic batching trades a small queue delay for throughput (MLO-14, MLO-24).
- [TensorFlow Data Validation guide](https://www.tensorflow.org/tfx/guide/tfdv) and [Great Expectations documentation](https://docs.greatexpectations.io/docs/home/): schema, anomaly, skew and drift checks on data (MLO-08, MLO-21, MLO-27).
- [Evidently documentation](https://docs.evidentlyai.com/): drift metrics on inputs and predictions and why a magnitude, not only a test, is monitored (MLO-08, MLO-21, MLO-38).
- [PyTorch: quantization](https://pytorch.org/docs/stable/quantization.html): lower-precision weights and activations, and the need to measure accuracy afterwards (MLO-26).
- [KServe: canary rollout](https://kserve.github.io/website/latest/modelserving/v1beta1/rollout/canary/): sending a share of traffic to a new model version and promoting or rolling back (MLO-09, MLO-10, MLO-34).
- [Google SRE Book: monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/): latency percentiles, why averages hide the tail, the four golden signals (MLO-16, MLO-24).

Not backed by one page, so they rest on general engineering practice: idempotent pipeline steps (MLO-28), prediction caching (MLO-31), A/B testing a model (MLO-22), data contracts (MLO-35), slice-based monitoring (MLO-38), and the contents of the design flashcards (MLO-39, MLO-40).
