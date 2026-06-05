# Fullstack - HealPoint

Folder ini digunakan untuk pekerjaan Full-Stack Web Developer. Front-end dan back-end disatukan dalam folder `fullstack/` agar integrasi aplikasi, RESTful API, database, dan fitur AI/ML lebih mudah dipantau.

## Ownership

| Kode | Anggota | Fokus |
| --- | --- | --- |
| FS-1 | Muhammad Alan Andika | Frontend React.js, dashboard pengguna, daftar dokter/fasilitas, Smart Scheduling & Queue System, integrasi API. |
| FS-2 | Eko Wahyudi | Backend API, autentikasi, database, manajemen reservasi/antrian, endpoint inference AI. |

## Deliverables

- Aplikasi front-end menggunakan React.js dan module bundler seperti Vite.
- RESTful API untuk user, dokter, fasilitas kesehatan, reservasi, antrian, dan inference AI.
- Integrasi networking calls dari front-end ke API.
- Penyimpanan data menggunakan database atau file storage yang terstruktur.
- Validasi input, error handling, dan autentikasi JWT.
- Dokumentasi endpoint API.
- Demo aplikasi yang berjalan tanpa crash.

## Struktur yang Disarankan

```text
fullstack/
  frontend/
    src/
      components/
      hooks/
      pages/
      styles/
      App.jsx
      main.jsx
      api.js
    package.json
    vite.config.js
    README.md
  backend/
    src/
      routes/
      controllers/
      models/
      services/
    package.json atau requirements.txt
    app.js
    README.md
  docs/
    api-contract.md
```

## Checklist Main Quest

- [ ] Menggunakan networking calls untuk berinteraksi dengan API pada proyek.
- [ ] Menggunakan module bundler seperti Vite, webpack, atau sejenisnya.
- [ ] Membangun RESTful API untuk mendukung aplikasi Front-End.
- [ ] RESTful API dapat menyimpan data dengan atau tanpa database.
- [ ] Membuat RESTful API dengan URL yang mengikuti standar konvensi RESTful.
- [ ] Mengintegrasikan kemampuan AI/ML sebagai fitur utama aplikasi melalui back-end atau browser.
- [ ] Memastikan fitur utama berjalan baik tanpa menyebabkan aplikasi crash.
- [ ] Tidak menggunakan web generator untuk membuat aplikasi front-end maupun back-end.

## Endpoint RESTful yang Disarankan

| Method | URL | Fungsi |
| --- | --- | --- |
| POST | `/api/auth/register` | Registrasi pengguna |
| POST | `/api/auth/login` | Login pengguna |
| GET | `/api/users/me` | Mengambil profil pengguna aktif |
| GET | `/api/facilities` | Mengambil daftar fasilitas kesehatan |
| GET | `/api/facilities/:id` | Mengambil detail fasilitas kesehatan |
| GET | `/api/doctors` | Mengambil daftar dokter |
| GET | `/api/doctors/:id` | Mengambil detail dokter |
| GET | `/api/appointments` | Mengambil daftar reservasi pengguna |
| POST | `/api/appointments` | Membuat reservasi |
| PATCH | `/api/appointments/:id` | Mengubah status reservasi |
| DELETE | `/api/appointments/:id` | Membatalkan reservasi |
| POST | `/api/ai/predict-queue` | Prediksi kepadatan/antrian |

## Kriteria Selesai

- Front-end dapat login/register dan menyimpan token secara aman.
- Front-end dapat menampilkan dokter/fasilitas dari API.
- Pengguna dapat membuat, melihat, dan membatalkan reservasi.
- API mengembalikan status code yang sesuai.
- Endpoint AI dapat menerima input dan mengembalikan hasil prediksi.
- Error API ditampilkan dengan pesan yang jelas di UI.
- Aplikasi dapat dijalankan ulang dari instruksi README.

## Cara Menjalankan

Backend:

```bash
cd fullstack/backend
npm install
npm start
```

Frontend:

```bash
cd fullstack/frontend
npm install
npm run dev
```

URL lokal:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Health check: `http://localhost:4000/api/health`

Catatan integrasi AI: endpoint `POST /api/ai/predict-no-show` saat ini memakai heuristic fallback agar demo MVP langsung berjalan. Setelah model TensorFlow diekspor oleh role AI Engineer, service ini dapat diganti ke inference model produksi.
