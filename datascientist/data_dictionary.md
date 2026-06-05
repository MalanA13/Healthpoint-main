# Data Dictionary - HealPoint Appointment Dataset

| Kolom | Tipe | Deskripsi |
| --- | --- | --- |
| `appointment_id` | integer | ID unik appointment. |
| `patient_id` | string | ID pasien, disimpan sebagai string untuk menghindari perubahan presisi numerik. |
| `gender` | category | Jenis kelamin pasien: `F` atau `M`. |
| `age` | integer | Usia pasien. |
| `age_group` | category | Kelompok usia: child, teen, young_adult, adult, senior. |
| `neighbourhood` | category | Wilayah fasilitas/appointment. |
| `scheduled_day` | datetime | Waktu pasien membuat jadwal. |
| `appointment_day` | datetime | Hari appointment berlangsung. |
| `scheduled_hour` | integer | Jam appointment dibuat. |
| `appointment_weekday` | category | Hari appointment. |
| `appointment_month` | integer | Bulan appointment. |
| `waiting_days` | integer | Selisih hari antara scheduled day dan appointment day. |
| `scholarship` | binary | Status bantuan sosial pada dataset asli. |
| `hypertension` | binary | Indikator hipertensi. |
| `diabetes` | binary | Indikator diabetes. |
| `alcoholism` | binary | Indikator alkoholisme. |
| `handicap` | integer | Level disabilitas sesuai dataset asli. |
| `sms_received` | binary | Indikator apakah pasien menerima SMS. |
| `has_chronic_condition` | binary | Fitur turunan dari hypertension atau diabetes. |
| `is_no_show` | binary | Target model: 1 jika pasien tidak hadir, 0 jika hadir. |

## Catatan Data Leakage

Kolom target `is_no_show` tidak boleh digunakan sebagai fitur training. `appointment_id` dan `patient_id` juga tidak digunakan sebagai fitur model karena merupakan identifier.
