# Data Scientist - HealPoint

Folder ini digunakan untuk pekerjaan Data Scientist, mulai dari perumusan masalah, pengumpulan data, data wrangling, EDA, visualisasi, dashboard Streamlit, sampai dataset akhir yang siap digunakan oleh AI Engineer.

## Ownership

| Kode | Anggota | Fokus |
| --- | --- | --- |
| DS-1 | Hasbi Nurwahid | Gathering data, assessing data, cleaning data, analisis pola antrian, persiapan dataset model. |
| DS-2 | Yan Syafiq Albari | EDA, visualisasi, explanatory analysis, dashboard Streamlit, data dictionary, laporan insight. |

## Deliverables

- Dokumen business questions yang dapat diukur.
- Dataset mentah dan dataset bersih.
- Notebook data wrangling dan EDA.
- Visualisasi data untuk menjawab business questions.
- Dashboard interaktif menggunakan Streamlit.
- Data dictionary.
- Dataset final yang siap digunakan pada tahap pemodelan AI/ML.

## Struktur yang Disarankan

```text
datascientist/
  data/
    raw/
    cleaned/
    processed/
  notebooks/
    01_gathering_data.ipynb
    02_assessing_cleaning.ipynb
    03_eda_visualization.ipynb
    04_feature_engineering.ipynb
  dashboard/
    streamlit_app.py
  data_dictionary.md
  final_dataset.csv
```

## Business Questions Awal

1. Pada hari dan jam apa layanan kesehatan cenderung mengalami kepadatan tertinggi?
2. Faktor apa yang paling berkaitan dengan tingginya jumlah antrian atau reservasi?
3. Bagaimana distribusi fasilitas kesehatan berdasarkan lokasi dan spesialisasi?
4. Bagaimana rekomendasi waktu kunjungan yang lebih optimal berdasarkan pola historis?

## Checklist Main Quest

- [ ] Mengumpulkan dan menganalisis berbagai permasalahan, lalu menentukan satu solusi utama proyek.
- [ ] Mendefinisikan pertanyaan bisnis yang dapat diukur.
- [ ] Melakukan Gathering Data dari sumber publik, scraping, simulasi, atau kombinasi yang dijelaskan.
- [ ] Melakukan Assessing Data untuk mengevaluasi kualitas dan struktur data.
- [ ] Melakukan Cleaning Data secara manual dan terdokumentasi.
- [ ] Melakukan Exploratory Data Analysis untuk mendapatkan insight.
- [ ] Membuat visualisasi data dan explanatory analysis untuk menjawab pertanyaan bisnis.
- [ ] Mengembangkan dashboard interaktif menggunakan Streamlit.
- [ ] Memastikan dataset final siap diproses oleh model.
- [ ] Membuat Data Dictionary.
- [ ] Tidak menggunakan dataset siap pakai tanpa proses pembersihan manual.
- [ ] Tidak melakukan analisis data tanpa penjelasan markdown atau teks.
- [ ] Tidak menarik kesimpulan tanpa dukungan visualisasi data.
- [ ] Tidak menghasilkan dataset akhir yang belum siap digunakan pada tahap pemodelan.
- [ ] Tidak menyertakan informasi target ke dalam fitur training untuk menghindari data leakage.

## Kolom Dataset yang Disarankan

| Kolom | Deskripsi | Contoh |
| --- | --- | --- |
| `facility_id` | ID fasilitas kesehatan | FASKES001 |
| `facility_name` | Nama fasilitas kesehatan | RS Sehat Sentosa |
| `facility_type` | Jenis fasilitas | Rumah Sakit, Klinik, Puskesmas |
| `city` | Kota/kabupaten | Bandung |
| `specialization` | Spesialisasi layanan | Umum, Anak, Jantung |
| `doctor_id` | ID dokter | DOK001 |
| `appointment_date` | Tanggal reservasi | 2026-05-05 |
| `appointment_hour` | Jam reservasi | 10 |
| `day_of_week` | Hari dalam minggu | Tuesday |
| `queue_count` | Jumlah antrian | 25 |
| `avg_waiting_time` | Rata-rata waktu tunggu | 45 |
| `is_peak` | Label kepadatan | 0 atau 1 |

## Kriteria Selesai

- Dataset bersih memiliki format konsisten dan siap dipakai training.
- Setiap keputusan cleaning dijelaskan.
- Dashboard Streamlit dapat dijalankan dan menampilkan visualisasi utama.
- Insight menjawab business questions.
- Target model tidak bocor ke fitur training.

## Cara Menjalankan

Generate dataset bersih dari file root `KaggleV2-May-2016.csv`:

```bash
python datascientist/src_prepare_dataset.py
```

Output utama:

- `datascientist/data/processed/appointments_clean.csv`
- `ai engineer/data/model_input/appointments_model_ready.csv`
- `fullstack/backend/src/data/appointments_sample.json`

Jalankan dashboard:

```bash
streamlit run datascientist/dashboard/streamlit_app.py
```
