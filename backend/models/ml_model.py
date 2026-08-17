"""
Loads the trained LDA artifact and exposes a predict() function used by the
prediction API. Run `python train_model.py` (from backend/) at least once
before starting the Flask app so saved_models/lda_model.pkl exists.
"""
import os

import joblib
import numpy as np
import pandas as pd

from config import Config

_artifact = None


class ModelNotTrainedError(Exception):
    pass


def _load_artifact():
    global _artifact
    if _artifact is None:
        if not os.path.exists(Config.ML_MODEL_PATH):
            raise ModelNotTrainedError(
                "Model file not found. Run 'python train_model.py' in the backend/ "
                "directory first to generate the dataset and train the LDA model."
            )
        _artifact = joblib.load(Config.ML_MODEL_PATH)
    return _artifact


def get_metrics():
    artifact = _load_artifact()
    return artifact["metrics"]


def predict_waste(input_data: dict):
    """
    input_data keys expected:
        production_process, raw_material, process_stage, material_category,
        production_quantity, material_quantity
    Returns: (predicted_label, confidence, probability_dict)
    """
    artifact = _load_artifact()
    model = artifact["model"]
    encoders = artifact["encoders"]
    onehot_cols = artifact["onehot_cols"]
    scaler = artifact["scaler"]
    target_encoder = artifact["target_encoder"]
    numeric_features = artifact["numeric_features"]
    final_feature_order = artifact["final_feature_order"]
    categorical_features = artifact["categorical_features"]

    row = {}
    for col in categorical_features:
        value = input_data.get(col)
        known_categories = encoders[col]
        for cat in known_categories:
            colname = f"{col}__{cat}"
            row[colname] = 1 if value == cat else 0
        # Unknown category value at inference time -> all-zero one-hot
        # (model falls back to the learned intercept behaviour).

    numeric_df = pd.DataFrame(
        [[input_data.get(f, 0) for f in numeric_features]], columns=numeric_features
    )
    scaled_numeric = scaler.transform(numeric_df)
    for i, f in enumerate(numeric_features):
        row[f] = scaled_numeric[0][i]

    X = pd.DataFrame([row])[final_feature_order]

    pred_encoded = model.predict(X)[0]
    predicted_label = target_encoder.inverse_transform([pred_encoded])[0]

    probabilities = model.predict_proba(X)[0]
    prob_dict = {
        target_encoder.inverse_transform([i])[0]: round(float(p), 4)
        for i, p in enumerate(probabilities)
    }
    confidence = round(float(np.max(probabilities)), 4)

    return predicted_label, confidence, prob_dict
