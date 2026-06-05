# Insight Aktual - HealPoint

Dataset final memiliki 110,521 baris appointment valid setelah cleaning dari 110,527 baris mentah.

## Kesimpulan Utama

1. No-show rate keseluruhan adalah **20.2%**, sehingga masalah ketidakhadiran pasien cukup signifikan untuk dijadikan fitur prediksi.
2. Rata-rata waiting days adalah **10.18 hari**. Appointment dengan waiting days lebih dari 30 hari memiliki no-show rate **33.0%**, lebih tinggi dibanding appointment hari yang sama sebesar **4.6%**.
3. Kelompok usia dengan risiko tertinggi adalah **teen** dengan no-show rate **26.6%**.
4. Wilayah prioritas tertinggi berdasarkan minimal 100 appointment adalah **Santos Dumont** dengan **1,276** appointment dan no-show rate **28.9%**.
5. Pasien tanpa SMS memiliki no-show rate **16.7%**, sedangkan pasien yang menerima SMS memiliki no-show rate **27.6%**. Perbedaan ini perlu dibaca bersama waiting days karena penerima SMS bisa berasal dari appointment dengan jeda lebih panjang.

## Implikasi Produk

- HealPoint perlu menampilkan risk indicator saat appointment dibuat.
- Reminder tambahan diprioritaskan untuk appointment dengan waiting days panjang dan risk level tinggi.
- Admin dashboard perlu menampilkan area prioritas, distribusi risiko, dan performa appointment.
