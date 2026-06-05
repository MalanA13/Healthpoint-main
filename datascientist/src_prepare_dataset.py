from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "KaggleV2-May-2016.csv"
RAW_COPY = Path(__file__).resolve().parent / "data" / "raw" / "appointments_raw.csv"
PROCESSED = Path(__file__).resolve().parent / "data" / "processed" / "appointments_clean.csv"
MODEL_INPUT_LEGACY = ROOT / "ai engineer" / "data" / "model_input" / "appointments_model_ready.csv"
MODEL_INPUT = ROOT / "ai-engineer" / "model" / "saved_model" / "appointments_model_ready.csv"
BACKEND_SAMPLE = ROOT / "fullstack" / "backend" / "src" / "data" / "appointments_sample.json"


def age_group(age: int) -> str:
    if age <= 12:
        return "child"
    if age <= 17:
        return "teen"
    if age <= 35:
        return "young_adult"
    if age <= 59:
        return "adult"
    return "senior"


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    cleaned = df.copy()

    cleaned.columns = (
        cleaned.columns.str.strip()
        .str.lower()
        .str.replace("-", "_", regex=False)
        .str.replace(" ", "_", regex=False)
    )
    cleaned = cleaned.rename(
        columns={
            "hipertension": "hypertension",
            "handcap": "handicap",
            "no_show": "no_show",
        }
    )

    cleaned["patient_id"] = cleaned["patientid"].astype(str)
    cleaned["appointment_id"] = cleaned["appointmentid"].astype(int)
    cleaned = cleaned.drop(columns=["patientid", "appointmentid"])

    cleaned["scheduled_day"] = pd.to_datetime(cleaned["scheduledday"], utc=True)
    cleaned["appointment_day"] = pd.to_datetime(cleaned["appointmentday"], utc=True)
    cleaned = cleaned.drop(columns=["scheduledday", "appointmentday"])

    cleaned["gender"] = cleaned["gender"].str.upper().str.strip()
    cleaned["neighbourhood"] = cleaned["neighbourhood"].str.title().str.strip()

    cleaned["is_no_show"] = cleaned["no_show"].map({"Yes": 1, "No": 0}).astype(int)
    cleaned = cleaned.drop(columns=["no_show"])

    cleaned["waiting_days"] = (
        cleaned["appointment_day"].dt.normalize() - cleaned["scheduled_day"].dt.normalize()
    ).dt.days
    cleaned = cleaned[cleaned["age"].between(0, 115)]
    cleaned = cleaned[cleaned["waiting_days"] >= 0]

    cleaned["scheduled_hour"] = cleaned["scheduled_day"].dt.hour
    cleaned["appointment_weekday"] = cleaned["appointment_day"].dt.day_name()
    cleaned["appointment_month"] = cleaned["appointment_day"].dt.month
    cleaned["age_group"] = cleaned["age"].apply(age_group)
    cleaned["has_chronic_condition"] = (
        (cleaned["hypertension"] == 1) | (cleaned["diabetes"] == 1)
    ).astype(int)

    ordered = [
        "appointment_id",
        "patient_id",
        "gender",
        "age",
        "age_group",
        "neighbourhood",
        "scheduled_day",
        "appointment_day",
        "scheduled_hour",
        "appointment_weekday",
        "appointment_month",
        "waiting_days",
        "scholarship",
        "hypertension",
        "diabetes",
        "alcoholism",
        "handicap",
        "sms_received",
        "has_chronic_condition",
        "is_no_show",
    ]
    return cleaned[ordered].sort_values("appointment_id").reset_index(drop=True)


def build_backend_sample(cleaned: pd.DataFrame) -> None:
    sample = cleaned.head(40).copy()
    sample["scheduled_day"] = sample["scheduled_day"].dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    sample["appointment_day"] = sample["appointment_day"].dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    BACKEND_SAMPLE.parent.mkdir(parents=True, exist_ok=True)
    sample.to_json(BACKEND_SAMPLE, orient="records", indent=2)


def main() -> None:
    df = pd.read_csv(SOURCE, dtype={"PatientId": str})
    cleaned = clean_dataset(df)

    RAW_COPY.parent.mkdir(parents=True, exist_ok=True)
    PROCESSED.parent.mkdir(parents=True, exist_ok=True)
    MODEL_INPUT.parent.mkdir(parents=True, exist_ok=True)
    MODEL_INPUT_LEGACY.parent.mkdir(parents=True, exist_ok=True)

    if not RAW_COPY.exists():
        df.to_csv(RAW_COPY, index=False)
    cleaned.to_csv(PROCESSED, index=False)
    cleaned.to_csv(MODEL_INPUT, index=False)
    cleaned.to_csv(MODEL_INPUT_LEGACY, index=False)
    cleaned.to_csv(ROOT / "datascientist" / "data" / "cleaned" / "appointments_clean.csv", index=False)
    cleaned.to_csv(ROOT / "datascientist" / "final_dataset.csv", index=False)
    build_backend_sample(cleaned)

    summary = {
        "raw_rows": int(len(df)),
        "clean_rows": int(len(cleaned)),
        "columns": int(cleaned.shape[1]),
        "no_show_rate": round(float(cleaned["is_no_show"].mean()), 4),
        "avg_waiting_days": round(float(cleaned["waiting_days"].mean()), 2),
    }
    print(summary)


if __name__ == "__main__":
    main()
