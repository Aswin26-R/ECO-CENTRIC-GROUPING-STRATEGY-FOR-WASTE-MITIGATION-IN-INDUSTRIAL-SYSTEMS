"""
train_model.py

Generates the demo dataset (if it does not already exist) and trains the
Linear Discriminant Analysis model used by the prediction API.

    Demo / Sample Dataset for Academic Prototype
    ---------------------------------------------
    This dataset is SYNTHETICALLY GENERATED for the purpose of demonstrating
    the ML pipeline described in the project document ("ECO-CENTRIC GROUPING
    STRATEGY FOR WASTE MITIGATION IN INDUSTRIAL SYSTEMS"). The source
    document does not include an actual dataset, exact feature list, or
    exact waste categories, so the features/labels/relationships below are a
    PROTOTYPE IMPLEMENTATION ASSUMPTION, built to be realistic enough for a
    college-level demonstration. They are NOT real industrial measurements
    and must not be presented as such.

Pipeline:
    Dataset -> Data Cleaning -> Feature Selection -> Encoding ->
    Train/Test Split -> Linear Discriminant Analysis -> Evaluation ->
    Save Model
"""
import json
import os
import random

import joblib
import numpy as np
import pandas as pd
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

from config import Config

RANDOM_SEED = 42
random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

# ---------------------------------------------------------------------------
# 1. Reference data (prototype implementation assumption)
# ---------------------------------------------------------------------------
PRODUCTION_PROCESSES = [
    "Electric Arc Furnace",
    "Basic Oxygen Furnace",
    "Continuous Casting",
    "Hot Rolling",
    "Cold Rolling",
    "Galvanizing",
    "Forging",
    "Finishing & Grinding",
]

RAW_MATERIALS = [
    "Scrap Steel",
    "Iron Ore",
    "Coke",
    "Limestone",
    "Alloy Additives",
    "Zinc Coating Material",
]

PROCESS_STAGES = [
    "Melting",
    "Refining",
    "Casting",
    "Rolling",
    "Coating",
    "Finishing",
]

MATERIAL_CATEGORIES = [
    "Ferrous Metal",
    "Non-Ferrous Metal",
    "Flux Material",
    "Fuel/Reductant",
    "Coating Material",
]

WASTE_TYPES = [
    "Steel Scrap",
    "Blast Furnace Slag",
    "EAF Dust",
    "Mill Scale",
    "Pickling Sludge",
    "Zinc Ash",
    "Refractory Waste",
    "Waste Gas Sludge",
]

# Each production process has a characteristic (weighted) waste profile.
# This encodes the "process -> waste" relationship the LDA model learns.
PROCESS_WASTE_WEIGHTS = {
    "Electric Arc Furnace": {"EAF Dust": 0.45, "Steel Scrap": 0.25, "Refractory Waste": 0.15, "Waste Gas Sludge": 0.15},
    "Basic Oxygen Furnace": {"Blast Furnace Slag": 0.50, "Steel Scrap": 0.20, "Waste Gas Sludge": 0.15, "Refractory Waste": 0.15},
    "Continuous Casting": {"Mill Scale": 0.40, "Steel Scrap": 0.30, "Refractory Waste": 0.20, "Blast Furnace Slag": 0.10},
    "Hot Rolling": {"Mill Scale": 0.55, "Steel Scrap": 0.25, "Waste Gas Sludge": 0.10, "Pickling Sludge": 0.10},
    "Cold Rolling": {"Pickling Sludge": 0.45, "Mill Scale": 0.30, "Steel Scrap": 0.25},
    "Galvanizing": {"Zinc Ash": 0.55, "Pickling Sludge": 0.30, "Waste Gas Sludge": 0.15},
    "Forging": {"Steel Scrap": 0.60, "Mill Scale": 0.25, "Refractory Waste": 0.15},
    "Finishing & Grinding": {"Steel Scrap": 0.50, "Mill Scale": 0.30, "Pickling Sludge": 0.20},
}


def _weighted_choice(weight_map: dict) -> str:
    items, weights = zip(*weight_map.items())
    return random.choices(items, weights=weights, k=1)[0]


def generate_dataset(n_rows: int = 1200) -> pd.DataFrame:
    rows = []
    for _ in range(n_rows):
        process = random.choice(PRODUCTION_PROCESSES)
        raw_material = random.choice(RAW_MATERIALS)
        process_stage = random.choice(PROCESS_STAGES)
        material_category = random.choice(MATERIAL_CATEGORIES)

        production_quantity = round(np.random.gamma(shape=6, scale=15), 2)   # tons
        material_quantity = round(production_quantity * np.random.uniform(0.6, 1.3), 2)

        waste_type = _weighted_choice(PROCESS_WASTE_WEIGHTS[process])

        # Small chance of label noise so the dataset isn't perfectly
        # separable -- more realistic for a classroom demonstration.
        if random.random() < 0.06:
            waste_type = random.choice(WASTE_TYPES)

        rows.append(
            {
                "production_process": process,
                "raw_material": raw_material,
                "process_stage": process_stage,
                "material_category": material_category,
                "production_quantity": production_quantity,
                "material_quantity": material_quantity,
                "waste_type": waste_type,
            }
        )

    df = pd.DataFrame(rows)
    return df


def build_dataset_if_missing():
    os.makedirs(os.path.dirname(Config.DATASET_PATH), exist_ok=True)
    if not os.path.exists(Config.DATASET_PATH):
        df = generate_dataset()
        df.to_csv(Config.DATASET_PATH, index=False)
        print(f"Demo dataset created at {Config.DATASET_PATH} ({len(df)} rows)")
    else:
        print(f"Dataset already exists at {Config.DATASET_PATH}, skipping generation")


# ---------------------------------------------------------------------------
# 2. Training pipeline
# ---------------------------------------------------------------------------
CATEGORICAL_FEATURES = ["production_process", "raw_material", "process_stage", "material_category"]
NUMERIC_FEATURES = ["production_quantity", "material_quantity"]
TARGET = "waste_type"


def train():
    build_dataset_if_missing()

    df = pd.read_csv(Config.DATASET_PATH)

    # --- Data cleaning ---
    df = df.dropna()
    df = df.drop_duplicates()

    # --- Feature selection ---
    feature_cols = CATEGORICAL_FEATURES + NUMERIC_FEATURES
    X = df[feature_cols].copy()
    y = df[TARGET].copy()

    # --- Encoding ---
    # Categorical (nominal) features are one-hot encoded rather than
    # label-encoded: LDA operates on continuous feature space, and integer
    # label-encoding would imply a false ordinal relationship between
    # unrelated categories (e.g. "Galvanizing" > "Forging"), which hurts
    # discrimination. We keep a fixed category vocabulary (encoders) so the
    # same columns can be reproduced at prediction time.
    encoders = {}
    onehot_cols = {}
    for col in CATEGORICAL_FEATURES:
        categories = sorted(X[col].unique().tolist())
        encoders[col] = categories
        for cat in categories:
            colname = f"{col}__{cat}"
            X[colname] = (X[col] == cat).astype(int)
            onehot_cols.setdefault(col, []).append(colname)
        X.drop(columns=[col], inplace=True)

    target_encoder = LabelEncoder()
    y_encoded = target_encoder.fit_transform(y)

    scaler = StandardScaler()
    X[NUMERIC_FEATURES] = scaler.fit_transform(X[NUMERIC_FEATURES])

    final_feature_order = [c for col in CATEGORICAL_FEATURES for c in onehot_cols[col]] + NUMERIC_FEATURES
    X = X[final_feature_order]

    # --- Train/test split ---
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=RANDOM_SEED, stratify=y_encoded
    )

    # --- Linear Discriminant Analysis ---
    model = LinearDiscriminantAnalysis()
    model.fit(X_train, y_train)

    # --- Evaluation ---
    y_pred = model.predict(X_test)
    metrics = {
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred, average="weighted", zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, y_pred, average="weighted", zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_test, y_pred, average="weighted", zero_division=0)), 4),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
        "class_labels": target_encoder.classes_.tolist(),
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
    }

    print("Model evaluation:")
    print(json.dumps({k: v for k, v in metrics.items() if k != "confusion_matrix"}, indent=2))

    # --- Save model + preprocessing artifacts ---
    os.makedirs(os.path.dirname(Config.ML_MODEL_PATH), exist_ok=True)
    artifact = {
        "model": model,
        "encoders": encoders,  # dict: categorical col -> sorted list of known category values
        "onehot_cols": onehot_cols,  # dict: categorical col -> ordered one-hot column names
        "target_encoder": target_encoder,
        "scaler": scaler,
        "feature_cols": feature_cols,
        "final_feature_order": final_feature_order,
        "categorical_features": CATEGORICAL_FEATURES,
        "numeric_features": NUMERIC_FEATURES,
        "metrics": metrics,
    }
    joblib.dump(artifact, Config.ML_MODEL_PATH)
    print(f"Model saved to {Config.ML_MODEL_PATH}")

    metrics_path = os.path.join(os.path.dirname(Config.ML_MODEL_PATH), "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Metrics saved to {metrics_path}")


if __name__ == "__main__":
    train()
