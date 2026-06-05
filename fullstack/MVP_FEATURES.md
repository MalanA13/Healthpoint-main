# HealPoint MVP Features

## Halaman Aplikasi

- Landing Page: halaman pembuka HealPoint dengan CTA ke Login/Register.
- Login Page: halaman autentikasi user dan admin.
- Register Page: halaman pendaftaran user baru.
- User Dashboard: halaman appointment, Health Hub, AI risk, dan health ledger.
- Admin Dashboard: halaman insight appointment dan monitoring risiko.

## 1. User Bisa Daftar/Login

Lokasi:

- Frontend: `frontend/src/main.jsx`
- Backend: `backend/src/routes/auth.js`

Endpoint:

- `POST /api/auth/register`
- `POST /api/auth/login`

Demo account:

- Email: `demo@healpoint.local`
- Password: `password123`

Admin account:

- Email: `admin@healpoint.local`
- Password: `admin123`

## 2. User Bisa Membuat Appointment

Lokasi:

- Frontend: form `Buat Appointment`
- Backend: `backend/src/routes/appointments.js`

Endpoint:

- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/:id`
- `DELETE /api/appointments/:id`

## 3. Sistem Menampilkan Daftar Dokter/Fasilitas

Lokasi:

- Frontend: panel `Geolocation Health Hub`
- Backend: `backend/src/routes/doctors.js` dan `backend/src/routes/facilities.js`

Endpoint:

- `GET /api/doctors`
- `GET /api/facilities`

## 4. Backend Menyimpan Data Appointment

Storage MVP:

- `backend/src/data/db.json`

Catatan:

- Storage ini sederhana dan cocok untuk demo MVP.
- Untuk produksi, ganti dengan PostgreSQL, MongoDB, Firestore, atau database lain.

## 5. AI Memprediksi Risiko No-show

Lokasi:

- Backend integration: `backend/src/services/aiModelClient.js`
- AI service: `backend/ai-service/app.py`
- AI Engineer TensorFlow: `../ai-engineer/model/train_model.py` dan `../ai-engineer/model/inference.py`

Endpoint:

- `POST /api/ai/predict-no-show`

Output:

- `no_show_probability`
- `risk_level`
- `recommendation`

Catatan:

- Backend Express memanggil AI service TensorFlow pada `http://127.0.0.1:5000/predict`.
- Jika service AI mati, backend tetap memiliki fallback agar demo tidak crash.

## 6. Dashboard Admin Menampilkan Insight Appointment

Lokasi:

- Frontend: tab `Admin Dashboard`
- Backend: `backend/src/routes/admin.js`

Endpoint:

- `GET /api/admin/insights`

Insight:

- total appointment,
- scheduled/completed/no-show,
- no-show rate,
- high-risk rate,
- distribusi risiko,
- top area appointment.

## 7. Personal Health Data Ledger

Lokasi:

- Frontend: panel `Personal Health Data Ledger`
- Backend: `backend/src/routes/medicalRecords.js`

Endpoint:

- `GET /api/medical-records?userId=user-1`
- `POST /api/medical-records`

Catatan:

- Fitur ini dibuat dalam bentuk ledger sederhana untuk memenuhi arah project plan.
- Untuk produksi, perlu hak akses berbasis token dan enkripsi data sensitif.
