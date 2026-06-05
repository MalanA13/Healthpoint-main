from pathlib import Path
import pickle

import numpy as np
import pandas as pd
import tensorflow as tf

from custom_components import RiskCalibrationLayer, StopAtAuc


ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = ROOT / "ai engineer" / "models" / "healpoint_no_show_model.keras"
PREPROCESSOR_PATH = ROOT / "ai engineer" / "models" / "preprocessor.pkl"


def load_artifacts():
    model = tf.keras.models.load_model(
        MODEL_PATH,
        custom_objects={
            "RiskCalibrationLayer": RiskCalibrationLayer,
            "StopAtAuc": StopAtAuc,
        },
    )
    with open(PREPROCESSOR_PATH, "rb") as file:
        preprocessor = pickle.load(file)
    return model, preprocessor


def risk_label(probability: float) -> str:
    if probability >= 0.65:
        return "High"
    if probability >= 0.35:
        return "Medium"
    return "Low"


def recommendation(label: str) -> str:
    if label == "High":
        return "Kirim reminder tambahan dan tawarkan konfirmasi ulang jadwal."
    if label == "Medium":
        return "Kirim reminder standar satu hari sebelum appointment."
    return "Risiko rendah, reminder standar sudah cukup."


def predict_no_show(payload: dict) -> dict:
    model, preprocessor = load_artifacts()
    row = pd.DataFrame([payload])
    ready = preprocessor.transform(row).astype(np.float32)
    probability = float(model.predict(ready, verbose=0).ravel()[0])
    label = risk_label(probability)
    return {
        "no_show_probability": round(probability, 4),
        "risk_level": label,
        "recommendation": recommendation(label),
    }


if __name__ == "__main__":
    example = {
        "gender": "F",
        "age": 31,
        "age_group": "young_adult",
        "neighbourhood": "Jardim Da Penha",
        "scheduled_hour": 10,
        "appointment_weekday": "Monday",
        "appointment_month": 5,
        "waiting_days": 12,
        "scholarship": 0,
        "hypertension": 0,
        "diabetes": 0,
        "alcoholism": 0,
        "handicap": 0,
        "sms_received": 1,
        "has_chronic_condition": 0,
    }
    print(predict_no_show(example))
