# AI Engineer - HealPoint

Folder ini digunakan untuk pekerjaan AI Engineer, khususnya pengembangan model Deep Learning untuk prediksi kepadatan pasien atau rekomendasi jadwal layanan kesehatan.

## Ownership

| Kode | Anggota | Fokus |
| --- | --- | --- |
| AI-1 | M. Nur Daffa | Pengembangan model TensorFlow, training, evaluasi, custom component. |
| AI-2 | M. Adam Sirojuddin | Export model, inference script, integrasi model ke backend, optimasi dan monitoring performa. |

## Deliverables

- Model Deep Learning menggunakan TensorFlow Functional API atau Model Subclassing.
- Minimal satu custom component seperti Custom Layer, Custom Loss Function, atau Custom Callback.
- Model final yang diekspor dalam format `.keras` atau SavedModel.
- Script inference sederhana.
- Dokumentasi input, output, dan cara menjalankan model.
- Endpoint atau modul integrasi dengan backend.

## Struktur yang Disarankan

```text
ai engineer/
  data/
    model_input/
  notebooks/
    01_model_experiment.ipynb
  src/
    train.py
    inference.py
    custom_components.py
  models/
    healpoint_queue_model.keras
  reports/
    model_card.md
```

## Target Fitur AI/ML

Fitur AI/ML utama yang disarankan untuk MVP adalah `AI Queue Prediction`, yaitu model yang memprediksi tingkat kepadatan pasien berdasarkan data jadwal, fasilitas, spesialisasi, hari, jam, dan pola antrian.

Contoh input inference:

```json
{
  "facility_type": "Rumah Sakit",
  "specialization": "Umum",
  "city": "Bandung",
  "day_of_week": "Tuesday",
  "appointment_hour": 10
}
```

Contoh output inference:

```json
{
  "predicted_queue_level": "High",
  "confidence": 0.87,
  "recommendation": "Pilih jadwal setelah pukul 13.00 untuk estimasi antrian lebih rendah."
}
```

## Checklist Main Quest

- [ ] Membangun model Deep Learning menggunakan TensorFlow Functional API atau Model Subclassing.
- [ ] Menyesuaikan model dengan dataset dan permasalahan bisnis yang ditentukan tim Data Science.
- [ ] Mengimplementasikan minimal satu komponen kustom lanjutan.
- [ ] Menyimpan dan mengekspor model yang telah dilatih penuh dalam format `.keras` atau SavedModel.
- [ ] Membuat kode sederhana untuk proses inference model.
- [ ] Tidak menggunakan model siap pakai dari TensorFlow Hub atau sumber serupa.
- [ ] Tidak menggunakan model langsung dari layanan API seperti ChatGPT API, Gemini API, dan sejenisnya.
- [ ] Tidak menggunakan AutoML untuk membuat model AI diskriminatif.

## Custom Component yang Disarankan

Pilihan paling aman untuk MVP:

- Custom Callback untuk menghentikan training saat metrik validasi mencapai target.
- Custom Layer untuk embedding fitur kategori.
- Custom Loss Function jika target prediksi menggunakan skema khusus.

## Kriteria Selesai

- Model dapat dilatih ulang dari script atau notebook.
- Model final berhasil disimpan dalam format produksi.
- Script inference dapat menerima input contoh dan mengembalikan prediksi.
- Hasil prediksi dapat dipakai oleh backend.
- Metrik evaluasi model dicatat dalam laporan.
- Batasan model dan asumsi dataset dijelaskan dalam model card.

## Cara Menjalankan

Pastikan dataset model-ready sudah dibuat oleh role Data Scientist:

```bash
python datascientist/src_prepare_dataset.py
```

Install dependency AI:

```bash
cd "ai engineer"
pip install -r requirements.txt
```

Training model:

```bash
python src/train.py
```

Inference contoh:

```bash
python src/inference.py
```

Output utama:

- `ai engineer/models/healpoint_no_show_model.keras`
- `ai engineer/models/preprocessor.pkl`
- `ai engineer/reports/training_metrics.txt`
