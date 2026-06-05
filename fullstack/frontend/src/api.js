const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

let authToken = localStorage.getItem("healpoint_token") || "";

export function setAuthToken(token) {
  authToken = token || "";
  if (authToken) {
    localStorage.setItem("healpoint_token", authToken);
  } else {
    localStorage.removeItem("healpoint_token");
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error("Tidak bisa terhubung ke server API. Pastikan backend berjalan di port 4000.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export const api = {
  health: () => request("/api/health"),
  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  appointments: () => request("/api/appointments"),
  doctors: () => request("/api/doctors"),
  doctor: (id) => request(`/api/doctors/${id}`),
  facilities: () => request("/api/facilities"),
  facility: (id) => request(`/api/facilities/${id}`),
  insights: () => request("/api/admin/insights"),
  createDoctor: (payload) =>
    request("/api/admin/doctors", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateDoctor: (id, payload) =>
    request(`/api/admin/doctors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteDoctor: (id) =>
    request(`/api/admin/doctors/${id}`, {
      method: "DELETE",
    }),
  createFacility: (payload) =>
    request("/api/admin/facilities", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateFacility: (id, payload) =>
    request(`/api/admin/facilities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteFacility: (id) =>
    request(`/api/admin/facilities/${id}`, {
      method: "DELETE",
    }),
  medicalRecords: (userId) => request(`/api/medical-records?userId=${encodeURIComponent(userId || "user-1")}`),
  createMedicalRecord: (payload) =>
    request("/api/medical-records", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateMedicalRecord: (id, payload) =>
    request(`/api/medical-records/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteMedicalRecord: (id) =>
    request(`/api/medical-records/${id}`, {
      method: "DELETE",
    }),
  createAppointment: (payload) =>
    request("/api/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateAppointment: (id, payload) =>
    request(`/api/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  deleteAppointment: (id) =>
    request(`/api/appointments/${id}`, {
      method: "DELETE",
    }),
  predictNoShow: (payload) =>
    request("/api/ai/predict-no-show", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
