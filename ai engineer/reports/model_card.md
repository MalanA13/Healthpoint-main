# Model Card - HealPoint No-show Predictor

## Tujuan Model

Model memprediksi risiko pasien tidak hadir pada appointment kesehatan. Output digunakan oleh HealPoint untuk menampilkan risk level dan rekomendasi reminder.

## Dataset

- Sumber: `KaggleV2-May-2016.csv`
- Dataset final: `datascientist/final_dataset.csv`
- Jumlah data final: 110.521 baris
- Target: `is_no_show`

## Fitur Input

Fitur kategori:

- `gender`
- `age_group`
- `neighbourhood`
- `appointment_weekday`

Fitur numerik:

- `age`
- `scheduled_hour`
- `appointment_month`
- `waiting_days`
- `scholarship`
- `hypertension`
- `diabetes`
- `alcoholism`
- `handicap`
- `sms_received`
- `has_chronic_condition`

## Output

```json
{
  "no_show_probability": 0.3856,
  "risk_level": "Medium",
  "recommendation": "Kirim reminder standar satu hari sebelum appointment."
}
```

## Arsitektur Model

Model dibangun dengan TensorFlow Functional API:

- Input dense vector hasil preprocessing.
- Dense 128 ReLU.
- BatchNormalization.
- Dropout 0.25.
- Dense 64 ReLU.
- Dropout 0.15.
- Dense sigmoid.
- Custom `RiskCalibrationLayer`.

## Custom Component

- Custom Layer: `RiskCalibrationLayer`.
- Custom Callback: `StopAtAuc`.
- Custom Loss Function: `FocalBinaryCrossentropy` untuk membantu class imbalance pada target no-show.

## Evaluasi

Hasil training aktual:

- ROC AUC: 0.7292
- Decision threshold: 0.35
- Accuracy: sekitar 0.64 pada threshold 0.35
- Recall kelas no-show: sekitar 0.70 pada threshold 0.35

Threshold 0.35 dipilih karena use case produk lebih membutuhkan deteksi pasien berisiko agar dapat diberi reminder tambahan.

## File Produksi

- `ai-engineer/model/saved_model/healpoint_no_show_model.keras`
- `ai-engineer/model/saved_model/preprocessor.pkl`

## Batasan

- Dataset berasal dari konteks appointment tertentu, sehingga perlu validasi ulang sebelum diterapkan ke fasilitas kesehatan Indonesia.
- Model tidak dipakai untuk diagnosis medis.
- Output hanya alat bantu operasional reminder dan scheduling.
