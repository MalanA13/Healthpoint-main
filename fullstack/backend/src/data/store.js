const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const appointmentsSample = require("./appointments_sample.json");

const dbPath = path.join(__dirname, "db.json");

const localPatientNames = [
  "Siti Aminah",
  "Budi Santoso",
  "Dewi Lestari",
  "Ahmad Fauzi",
  "Rina Anggraini",
  "Agus Pratama",
  "Nurul Hidayah",
  "Dian Puspita",
  "Fajar Ramadhan",
  "Maya Sari",
  "Rizky Maulana",
  "Fitri Handayani",
  "Hendra Wijaya",
  "Nadia Putri",
  "Yusuf Kurniawan",
  "Ayu Safitri",
  "Rudi Hartono",
  "Lina Marlina",
  "Bagus Saputra",
  "Nisa Aulia",
];

const localNeighbourhoods = [
  "Dago",
  "Pasteur",
  "Cibiru",
  "Antapani",
  "Cicendo",
  "Buah Batu",
  "Sukajadi",
  "Setiabudi",
  "Coblong",
  "Kiaracondong",
  "Cihampelas",
  "Ujungberung",
  "Lengkong",
  "Cibeunying",
  "Arcamanik",
];

const neighbourhoodAliases = {
  "Jardim Da Penha": "Dago",
  "Maria Ortiz": "Pasteur",
  "Santo Antonio": "Cibiru",
  "Santo Ant\u00f4nio": "Cibiru",
  "Santo Ant\u00f3nio": "Cibiru",
  "Santo Ant\u00c3\u00b4nio": "Cibiru",
  "Resist\u00eancia": "Antapani",
  "Resist\u00c3\u00aancia": "Antapani",
  "Vila Rubim": "Cicendo",
  "S\u00e3o Crist\u00f3v\u00e3o": "Buah Batu",
  "S\u00c3\u00a3o Crist\u00c3\u00b3v\u00c3\u00a3o": "Buah Batu",
  "Maru\u00edpe": "Sukajadi",
  "Maru\u00c3\u00adpe": "Sukajadi",
  "Santa Cec\u00edlia": "Setiabudi",
  "Santa Cec\u00c3\u00adlia": "Setiabudi",
  "Tabuazeiro": "Ujungberung",
};

const demoUserNamesByEmail = {
  "demo@healpoint.local": "Siti Aminah",
  "userbaru@healpoint.local": "Rizky Maulana",
};

const displayNameAliases = {
  "Demo Patient": "Siti Aminah",
  "User HealPoint": "Rizky Maulana",
  "Patient Kondisi": "Hilman Maulana",
  "E2E Model Test 3": "Dian Puspita",
  "E2E Model Test 2": "Nurul Hidayah",
  "E2E Model Test": "Agus Pratama",
  "MVP Test": "Rina Anggraini",
};

function pickLocalPatientName(index = 0) {
  return localPatientNames[Math.abs(index) % localPatientNames.length];
}

function pickLocalNeighbourhood(index = 0) {
  return localNeighbourhoods[Math.abs(index) % localNeighbourhoods.length];
}

function normalizeNeighbourhood(name, index = 0) {
  const value = String(name || "").trim();
  if (!value) return pickLocalNeighbourhood(index);
  return neighbourhoodAliases[value] || value;
}

function shouldReplacePatientName(name) {
  const value = String(name || "").trim();
  return (
    !value ||
    /^Patient\b/i.test(value) ||
    /^Demo Patient$/i.test(value) ||
    /^User HealPoint$/i.test(value) ||
    /^E2E Model Test/i.test(value) ||
    /^MVP Test$/i.test(value)
  );
}

function normalizeUser(user) {
  return {
    ...user,
    name: demoUserNamesByEmail[user.email] || user.name,
    role: user.role || "user",
    password: user.password?.startsWith("$2") ? user.password : bcrypt.hashSync(user.password, 10),
  };
}

function normalizeAppointment(appointment, index = 0, usersById = {}) {
  const linkedUserName = usersById[appointment.userId]?.name;
  const shouldReplace = shouldReplacePatientName(appointment.patientName);
  const patientName =
    shouldReplace && linkedUserName && !shouldReplacePatientName(linkedUserName)
      ? linkedUserName
      : shouldReplace
        ? pickLocalPatientName(index)
        : appointment.patientName;

  return {
    ...appointment,
    patientName,
    neighbourhood: normalizeNeighbourhood(appointment.neighbourhood, index),
  };
}

function replaceDisplayNames(text = "") {
  const value = String(text || "");
  return Object.entries(displayNameAliases).reduce(
    (current, [from, to]) => current.replace(new RegExp(from, "g"), to),
    value,
  );
}

function normalizeMedicalRecord(record) {
  return {
    ...record,
    title: replaceDisplayNames(record.title),
    note: replaceDisplayNames(record.note),
  };
}

const seedData = {
  users: [
    {
      id: "user-1",
      name: "Siti Aminah",
      email: "demo@healpoint.local",
      password: "password123",
      role: "user",
    },
    {
      id: "user-2",
      name: "Admin HealPoint",
      email: "admin@healpoint.local",
      password: "admin123",
      role: "admin",
    },
  ],
  facilities: [
    {
      id: "facility-1",
      name: "HealPoint Klinik Utama",
      type: "Klinik",
      city: "Bandung",
      neighbourhood: "Dago",
      distanceKm: 1.8,
      services: ["Umum", "Diabetes", "Hipertensi"],
      latitude: -6.909244,
      longitude: 107.617112,
    },
    {
      id: "facility-2",
      name: "HealPoint Medical Center",
      type: "Rumah Sakit",
      city: "Bandung",
      neighbourhood: "Pasteur",
      distanceKm: 4.2,
      services: ["Umum", "Anak", "Penyakit Dalam"],
      latitude: -6.914212,
      longitude: 107.609532,
    },
    {
      id: "facility-3",
      name: "HealPoint Puskesmas Digital",
      type: "Puskesmas",
      city: "Bandung",
      neighbourhood: "Cibiru",
      distanceKm: 2.6,
      services: ["Umum", "Ibu dan Anak"],
      latitude: -6.879435,
      longitude: 107.618641,
    },
  ],
  doctors: [
    {
      id: "doctor-1",
      name: "dr. Anisa Rahma",
      specialization: "Umum",
      facilityId: "facility-1",
      schedule: ["Monday 09:00", "Wednesday 13:00", "Friday 10:00"],
    },
    {
      id: "doctor-2",
      name: "dr. Bima Pratama",
      specialization: "Penyakit Dalam",
      facilityId: "facility-2",
      schedule: ["Tuesday 10:00", "Thursday 14:00"],
    },
    {
      id: "doctor-3",
      name: "dr. Citra Lestari",
      specialization: "Anak",
      facilityId: "facility-3",
      schedule: ["Monday 13:00", "Thursday 09:00"],
    },
  ],
  appointments: appointmentsSample.slice(0, 20).map((item, index) => ({
    id: String(item.appointment_id),
    patientName: pickLocalPatientName(index),
    gender: item.gender,
    age: item.age,
    ageGroup: item.age_group,
    neighbourhood: normalizeNeighbourhood(item.neighbourhood, index),
    facilityId: "facility-1",
    doctorId: "doctor-1",
    appointmentDay: item.appointment_day,
    waitingDays: item.waiting_days,
    smsReceived: item.sms_received,
    riskLevel: item.is_no_show ? "High" : "Low",
    noShowProbability: item.is_no_show ? 0.72 : 0.18,
    status: item.is_no_show ? "no_show" : "completed",
  })),
  medicalRecords: [
    {
      id: "record-1",
      userId: "user-1",
      title: "Riwayat kontrol umum",
      facilityName: "HealPoint Klinik Utama",
      date: "2026-04-18",
      note: "Tekanan darah stabil. Disarankan kontrol rutin bulan depan.",
    },
    {
      id: "record-2",
      userId: "user-1",
      title: "Catatan alergi",
      facilityName: "HealPoint Medical Center",
      date: "2026-03-22",
      note: "Alergi ringan terhadap debu. Tidak ada tindakan lanjutan.",
    },
  ],
};

function ensureDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(seedData, null, 2));
    return;
  }

  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  let changed = false;

  if (!db.users?.some((user) => user.email === "admin@healpoint.local")) {
    db.users = [
      ...(db.users || []).map((user) => ({ ...user, role: user.role || "user" })),
      seedData.users[1],
    ];
    changed = true;
  }

  if (!db.medicalRecords) {
    db.medicalRecords = seedData.medicalRecords;
    changed = true;
  }

  if (db.users) {
    db.users = db.users.map(normalizeUser);
    changed = true;
  }

  if (db.facilities) {
    db.facilities = db.facilities.map((facility) => {
      const seed = seedData.facilities.find((item) => item.id === facility.id);
      return {
        ...facility,
        city: seed?.city || facility.city,
        neighbourhood: seed?.neighbourhood || normalizeNeighbourhood(facility.neighbourhood),
        distanceKm: facility.distanceKm ?? seed?.distanceKm ?? 3.5,
        latitude: seed?.latitude || facility.latitude,
        longitude: seed?.longitude || facility.longitude,
      };
    });
    changed = true;
  }

  if (db.appointments) {
    const usersById = Object.fromEntries((db.users || []).map((user) => [user.id, user]));
    db.appointments = db.appointments.map((appointment, index) => normalizeAppointment(appointment, index, usersById));
    changed = true;
  }

  if (db.medicalRecords) {
    db.medicalRecords = db.medicalRecords.map(normalizeMedicalRecord);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  }
}

function loadDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function getCollection(name) {
  const db = loadDb();
  return db[name] || [];
}

function updateCollection(name, updater) {
  const db = loadDb();
  db[name] = updater(db[name] || [], db);
  saveDb(db);
  return db[name];
}

module.exports = {
  getCollection,
  loadDb,
  saveDb,
  updateCollection,
};
