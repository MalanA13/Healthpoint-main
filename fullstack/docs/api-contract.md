# HealPoint API Contract

Base URL local: `http://localhost:4000`

## Health

`GET /api/health`

## Auth

`POST /api/auth/register`

```json
{
  "name": "Hasbi",
  "email": "hasbi@example.com",
  "password": "password123"
}
```

`POST /api/auth/login`

```json
{
  "email": "demo@healpoint.local",
  "password": "password123"
}
```

## Appointments

`GET /api/appointments`

`POST /api/appointments`

```json
{
  "patientName": "Demo Patient",
  "gender": "F",
  "age": 31,
  "appointmentDay": "2026-05-10T09:00:00Z",
  "waitingDays": 12,
  "neighbourhood": "Dago"
}
```

`PATCH /api/appointments/:id`

`DELETE /api/appointments/:id`

Data appointment disimpan pada JSON storage lokal `fullstack/backend/src/data/db.json` untuk kebutuhan MVP.

## Doctors

`GET /api/doctors`

`GET /api/doctors/:id`

## Facilities

`GET /api/facilities`

`GET /api/facilities/:id`

## AI

`POST /api/ai/predict-no-show`

```json
{
  "gender": "F",
  "age": 31,
  "age_group": "young_adult",
  "neighbourhood": "Dago",
  "scheduled_hour": 10,
  "appointment_weekday": "Monday",
  "appointment_month": 5,
  "waiting_days": 12,
  "sms_received": 1,
  "has_chronic_condition": 0
}
```

Response:

```json
{
  "no_show_probability": 0.3856,
  "risk_level": "Medium",
  "recommendation": "Kirim reminder standar satu hari sebelum appointment.",
  "source": "tensorflow-model"
}
```

## Admin Dashboard

`GET /api/admin/insights`

Response:

```json
{
  "totalAppointments": 21,
  "scheduledAppointments": 1,
  "completedAppointments": 12,
  "noShowAppointments": 8,
  "noShowRate": 0.381,
  "highRiskAppointments": 8,
  "highRiskRate": 0.381,
  "totalDoctors": 3,
  "totalFacilities": 3,
  "byRisk": {
    "Low": 12,
    "High": 8,
    "Medium": 1
  },
  "byNeighbourhood": [
    {
      "name": "Sukajadi",
      "value": 7
    }
  ]
}
```

## Medical Records

`GET /api/medical-records?userId=user-1`

`POST /api/medical-records`

```json
{
  "userId": "user-1",
  "title": "Riwayat kontrol umum",
  "facilityName": "HealPoint Klinik Utama",
  "date": "2026-04-18",
  "note": "Tekanan darah stabil."
}
```
