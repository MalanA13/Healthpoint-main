from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.compose import ColumnTransformer
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from custom_components import RiskCalibrationLayer, StopAtAuc


ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "ai engineer" / "data" / "model_input" / "appointments_model_ready.csv"
MODEL_PATH = ROOT / "ai engineer" / "models" / "healpoint_no_show_model.keras"
PREPROCESSOR_PATH = ROOT / "ai engineer" / "models" / "preprocessor.pkl"
REPORT_PATH = ROOT / "ai engineer" / "reports" / "training_metrics.txt"

CATEGORICAL_FEATURES = ["gender", "age_group", "neighbourhood", "appointment_weekday"]
NUMERIC_FEATURES = [
    "age",
    "scheduled_hour",
    "appointment_month",
    "waiting_days",
    "scholarship",
    "hypertension",
    "diabetes",
    "alcoholism",
    "handicap",
    "sms_received",
    "has_chronic_condition",
]
TARGET = "is_no_show"


def build_preprocessor() -> ColumnTransformer:
    return ColumnTransformer(
        transformers=[
            ("category", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES),
            ("number", Pipeline([("scaler", StandardScaler())]), NUMERIC_FEATURES),
        ],
        remainder="drop",
        verbose_feature_names_out=False,
    )


def build_model(input_dim: int) -> tf.keras.Model:
    inputs = tf.keras.Input(shape=(input_dim,), name="appointment_features")
    x = tf.keras.layers.Dense(128, activation="relu")(inputs)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dropout(0.25)(x)
    x = tf.keras.layers.Dense(64, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.15)(x)
    probability = tf.keras.layers.Dense(1, activation="sigmoid", name="no_show_probability")(x)
    outputs = RiskCalibrationLayer(scale=1.0, name="risk_calibration")(probability)
    model = tf.keras.Model(inputs=inputs, outputs=outputs, name="healpoint_no_show_predictor")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss="binary_crossentropy",
        metrics=[tf.keras.metrics.AUC(name="auc"), "accuracy"],
    )
    return model


def main() -> None:
    df = pd.read_csv(DATA_PATH)
    features = CATEGORICAL_FEATURES + NUMERIC_FEATURES
    x = df[features]
    y = df[TARGET].astype(int)

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42, stratify=y
    )

    preprocessor = build_preprocessor()
    x_train_ready = preprocessor.fit_transform(x_train).astype(np.float32)
    x_test_ready = preprocessor.transform(x_test).astype(np.float32)

    model = build_model(x_train_ready.shape[1])
    model.fit(
        x_train_ready,
        y_train,
        validation_split=0.2,
        epochs=20,
        batch_size=256,
        callbacks=[
            StopAtAuc(target_auc=0.78),
            tf.keras.callbacks.EarlyStopping(patience=4, restore_best_weights=True, monitor="val_auc", mode="max"),
        ],
        verbose=1,
    )

    probabilities = model.predict(x_test_ready).ravel()
    predictions = (probabilities >= 0.5).astype(int)
    auc = roc_auc_score(y_test, probabilities)
    report = classification_report(y_test, predictions)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    model.save(MODEL_PATH)

    import pickle

    with open(PREPROCESSOR_PATH, "wb") as file:
        pickle.dump(preprocessor, file)

    REPORT_PATH.write_text(
        f"ROC AUC: {auc:.4f}\n\n{report}\n",
        encoding="utf-8",
    )
    print(f"Saved model to {MODEL_PATH}")
    print(f"Saved preprocessor to {PREPROCESSOR_PATH}")
    print(f"ROC AUC: {auc:.4f}")


if __name__ == "__main__":
    main()
