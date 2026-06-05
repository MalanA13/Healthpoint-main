import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, BarChart3, Building2, CalendarPlus, ClipboardList,
  Hospital, Pencil, Plus, Save, ShieldCheck, Stethoscope, Trash2, Users,
} from "lucide-react";
import { api } from "../api";
import { useAppContext } from "../App.jsx";

const emptyDoctor = { name: "", specialization: "", facilityId: "", schedule: "" };
const emptyFacility = {
  name: "",
  type: "Klinik",
  city: "Bandung",
  neighbourhood: "",
  services: "",
  distanceKm: 0,
  latitude: 0,
  longitude: 0,
};

export default function AdminDashboard() {
  const { user, setPage, appointments, doctors, facilities, insights, reload, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [doctorEditId, setDoctorEditId] = useState(null);
  const [facilityForm, setFacilityForm] = useState(emptyFacility);
  const [facilityEditId, setFacilityEditId] = useState(null);
  const [recordForm, setRecordForm] = useState({
    appointmentId: "",
    title: "",
    facilityName: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const [busy, setBusy] = useState(false);

  const doctorById = useMemo(() => Object.fromEntries(doctors.map((doctor) => [doctor.id, doctor])), [doctors]);
  const facilityById = useMemo(() => Object.fromEntries(facilities.map((facility) => [facility.id, facility])), [facilities]);
  const riskData = insights?.byRisk || {};
  const maxRisk = Math.max(...Object.values(riskData), 1);
  const riskColors = { Low: "low", Medium: "medium", High: "high" };

  useEffect(() => {
    if (!doctorForm.facilityId && facilities.length > 0) {
      setDoctorForm((current) => ({ ...current, facilityId: facilities[0].id }));
    }
  }, [doctorForm.facilityId, facilities]);

  if (!user || user.role !== "admin") return (
    <div className="dash shell" style={{ textAlign: "center", paddingTop: "120px" }}>
      <ShieldCheck size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
      <h2>Akses Terbatas</h2>
      <p style={{ color: "var(--text-sec)", margin: "8px 0 24px" }}>Login sebagai admin untuk membuka dashboard.</p>
      <button className="btn btn-primary" onClick={() => setPage("login")}>Login Admin</button>
    </div>
  );

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-teal-500";
  const tabs = [
    ["overview", "Overview", <BarChart3 size={16} key="overview" />],
    ["appointments", "Appointment", <CalendarPlus size={16} key="appointments" />],
    ["doctors", "Dokter", <Stethoscope size={16} key="doctors" />],
    ["facilities", "Fasilitas", <Hospital size={16} key="facilities" />],
    ["ledger", "Ledger Pasien", <ClipboardList size={16} key="ledger" />],
  ];

  function selectedAppointment() {
    return appointments.find((item) => item.id === recordForm.appointmentId);
  }

  function startRecord(appointment) {
    const facilityName = facilityById[appointment.facilityId]?.name || facilities[0]?.name || "";
    setRecordForm({
      appointmentId: appointment.id,
      title: `Catatan kunjungan ${appointment.patientName}`,
      facilityName,
      date: appointment.appointmentDay?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      note: "",
    });
    setActiveTab("ledger");
  }

  async function runAction(action, successMessage, fallbackMessage) {
    setBusy(true);
    try {
      await action();
      showToast(successMessage, "success");
      await reload(user);
      return true;
    } catch (err) {
      showToast(err.message || fallbackMessage, "error");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(id, status) {
    await runAction(
      () => api.updateAppointment(id, { status }),
      "Status appointment diperbarui",
      "Gagal mengubah status appointment",
    );
  }

  async function deleteAppointment(id) {
    await runAction(
      () => api.deleteAppointment(id),
      "Appointment dihapus",
      "Gagal menghapus appointment",
    );
  }

  async function saveDoctor(e) {
    e.preventDefault();
    const saved = await runAction(
      () => doctorEditId ? api.updateDoctor(doctorEditId, doctorForm) : api.createDoctor(doctorForm),
      doctorEditId ? "Data dokter diperbarui" : "Dokter baru ditambahkan",
      "Gagal menyimpan dokter",
    );
    if (saved) {
      setDoctorForm({ ...emptyDoctor, facilityId: facilities[0]?.id || "" });
      setDoctorEditId(null);
    }
  }

  function editDoctor(doctor) {
    setDoctorEditId(doctor.id);
    setDoctorForm({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      facilityId: doctor.facilityId || facilities[0]?.id || "",
      schedule: (doctor.schedule || []).join(", "),
    });
  }

  async function deleteDoctor(id) {
    await runAction(() => api.deleteDoctor(id), "Dokter dihapus", "Gagal menghapus dokter");
  }

  async function saveFacility(e) {
    e.preventDefault();
    const saved = await runAction(
      () => facilityEditId ? api.updateFacility(facilityEditId, facilityForm) : api.createFacility(facilityForm),
      facilityEditId ? "Data fasilitas diperbarui" : "Fasilitas baru ditambahkan",
      "Gagal menyimpan fasilitas",
    );
    if (saved) {
      setFacilityForm(emptyFacility);
      setFacilityEditId(null);
    }
  }

  function editFacility(facility) {
    setFacilityEditId(facility.id);
    setFacilityForm({
      name: facility.name || "",
      type: facility.type || "Klinik",
      city: facility.city || "",
      neighbourhood: facility.neighbourhood || "",
      services: (facility.services || []).join(", "),
      distanceKm: facility.distanceKm || 0,
      latitude: facility.latitude || 0,
      longitude: facility.longitude || 0,
    });
  }

  async function deleteFacility(id) {
    await runAction(() => api.deleteFacility(id), "Fasilitas dihapus", "Gagal menghapus fasilitas");
  }

  async function createRecord(e) {
    e.preventDefault();
    const appointment = selectedAppointment();
    if (!appointment) {
      showToast("Pilih appointment terlebih dahulu", "error");
      return;
    }
    const saved = await runAction(
      () => api.createMedicalRecord({
        userId: appointment.userId,
        title: recordForm.title,
        facilityName: recordForm.facilityName,
        date: recordForm.date,
        note: recordForm.note,
      }),
      "Catatan medis pasien ditambahkan",
      "Gagal membuat catatan medis",
    );
    if (saved) {
      setRecordForm({
        appointmentId: "",
        title: "",
        facilityName: "",
        date: new Date().toISOString().slice(0, 10),
        note: "",
      });
    }
  }

  return (
    <section className="dash shell">
      <div className="dash-header">
        <p className="dash-eyebrow">Admin Dashboard</p>
        <h1 className="dash-title">Operational Control Center</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          [`${insights?.totalAppointments || 0}`, "Total Appointment", <CalendarPlus key="1" size={20} />],
          [`${Math.round((insights?.noShowRate || 0) * 100)}%`, "No-show Rate", <Activity key="2" size={20} />],
          [`${doctors.length}`, "Dokter Aktif", <Stethoscope key="3" size={20} />],
          [`${facilities.length}`, "Fasilitas", <Building2 key="4" size={20} />],
        ].map(([value, label, icon]) => (
          <div className="metric-card" key={label}>{icon}<div className="metric-label">{label}</div><div className="metric-value">{value}</div></div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 mb-6">
        {tabs.map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`pb-4 px-4 text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === id ? "text-teal-600 border-b-2 border-teal-500" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="panel">
            <div className="panel-header"><BarChart3 size={20} /><h2>Ringkasan Operasional</h2></div>
            <div className="insight-boxes">
              {[
                ["Scheduled", insights?.scheduledAppointments || 0],
                ["Completed", insights?.completedAppointments || 0],
                ["No-show", insights?.noShowAppointments || 0],
                ["High Risk", insights?.highRiskAppointments || 0],
              ].map(([label, value]) => <div className="insight-box" key={label}><span>{label}</span><strong>{value}</strong></div>)}
            </div>
          </div>
          <div className="panel">
            <div className="panel-header"><Activity size={20} /><h2>Distribusi Risiko</h2></div>
            <div className="bar-chart">
              {Object.entries(riskData).map(([label, value]) => (
                <div className="bar-row" key={label}>
                  <span style={{ fontWeight: 600 }}>{label}</span>
                  <div className="bar-track"><div className={`bar-fill ${riskColors[label] || "low"}`} style={{ width: `${(value / maxRisk) * 100}%` }} /></div>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="panel lg:col-span-2">
            <div className="panel-header"><Users size={20} /><h2>Area Appointment Terbanyak</h2></div>
            <div className="grid md:grid-cols-3 gap-3">
              {(insights?.byNeighbourhood || []).map((item, index) => (
                <div key={item.name} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                  <span className="text-xs font-black text-teal-600">#{index + 1}</span>
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.value} appointment</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "appointments" && (
        <div className="panel">
          <div className="panel-header"><CalendarPlus size={20} /><h2>Kelola Appointment User</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-3 pr-4">Pasien</th>
                  <th className="py-3 pr-4">Jadwal</th>
                  <th className="py-3 pr-4">Dokter & Fasilitas</th>
                  <th className="py-3 pr-4">Risk</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-4 font-bold text-slate-800">{appointment.patientName}</td>
                    <td className="py-3 pr-4 text-slate-500">{appointment.appointmentDay?.slice(0, 10) || "-"}<br />{appointment.neighbourhood || "-"}</td>
                    <td className="py-3 pr-4 text-slate-500">{doctorById[appointment.doctorId]?.name || "-"}<br />{facilityById[appointment.facilityId]?.name || "-"}</td>
                    <td className="py-3 pr-4"><span className={`badge badge-${(appointment.riskLevel || "low").toLowerCase()}`}>{appointment.riskLevel || "-"}</span></td>
                    <td className="py-3 pr-4">
                      <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-600" value={appointment.status || "scheduled"} onChange={(e) => updateStatus(appointment.id, e.target.value)}>
                        <option value="scheduled">scheduled</option>
                        <option value="completed">completed</option>
                        <option value="no_show">no_show</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => startRecord(appointment)}><ClipboardList size={14} /> Catatan</button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteAppointment(appointment.id)}><Trash2 size={14} /> Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "doctors" && (
        <div className="grid lg:grid-cols-12 gap-6">
          <form onSubmit={saveDoctor} className="lg:col-span-4 panel space-y-4">
            <div className="panel-header"><Stethoscope size={20} /><h2>{doctorEditId ? "Edit Dokter" : "Tambah Dokter"}</h2></div>
            <input className={inputClass} placeholder="Nama dokter" value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} required />
            <input className={inputClass} placeholder="Spesialisasi" value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} required />
            <select className={inputClass} value={doctorForm.facilityId || facilities[0]?.id || ""} onChange={(e) => setDoctorForm({ ...doctorForm, facilityId: e.target.value })} required>
              <option value="">Pilih fasilitas</option>
              {facilities.map((facility) => <option key={facility.id} value={facility.id}>{facility.name}</option>)}
            </select>
            <textarea className={`${inputClass} min-h-[96px]`} placeholder="Jadwal, pisahkan koma. Contoh: Monday 09:00, Wednesday 13:00" value={doctorForm.schedule} onChange={(e) => setDoctorForm({ ...doctorForm, schedule: e.target.value })} />
            <div className="flex gap-2">
              <button type="submit" disabled={busy} className="btn btn-primary flex-1"><Save size={16} /> Simpan</button>
              {doctorEditId && <button type="button" className="btn btn-ghost" onClick={() => { setDoctorEditId(null); setDoctorForm(emptyDoctor); }}>Batal</button>}
            </div>
          </form>
          <div className="lg:col-span-8 panel">
            <div className="panel-header"><Users size={20} /><h2>Daftar Dokter</h2></div>
            <div className="grid md:grid-cols-2 gap-3">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                  <h3 className="font-black text-slate-800">{doctor.name}</h3>
                  <p className="text-sm font-bold text-teal-700">{doctor.specialization}</p>
                  <p className="text-xs text-slate-500 mt-1">{facilityById[doctor.facilityId]?.name || "Fasilitas belum terhubung"}</p>
                  <p className="text-xs text-slate-500 mt-2">{(doctor.schedule || []).join(" | ") || "Jadwal belum diisi"}</p>
                  <div className="flex gap-2 mt-4">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => editDoctor(doctor)}><Pencil size={14} /> Edit</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteDoctor(doctor.id)}><Trash2 size={14} /> Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "facilities" && (
        <div className="grid lg:grid-cols-12 gap-6">
          <form onSubmit={saveFacility} className="lg:col-span-4 panel space-y-4">
            <div className="panel-header"><Hospital size={20} /><h2>{facilityEditId ? "Edit Fasilitas" : "Tambah Fasilitas"}</h2></div>
            <input className={inputClass} placeholder="Nama fasilitas" value={facilityForm.name} onChange={(e) => setFacilityForm({ ...facilityForm, name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputClass} placeholder="Tipe" value={facilityForm.type} onChange={(e) => setFacilityForm({ ...facilityForm, type: e.target.value })} required />
              <input className={inputClass} placeholder="Kota" value={facilityForm.city} onChange={(e) => setFacilityForm({ ...facilityForm, city: e.target.value })} required />
            </div>
            <input className={inputClass} placeholder="Area / neighbourhood" value={facilityForm.neighbourhood} onChange={(e) => setFacilityForm({ ...facilityForm, neighbourhood: e.target.value })} />
            <input className={inputClass} placeholder="Layanan, pisahkan koma" value={facilityForm.services} onChange={(e) => setFacilityForm({ ...facilityForm, services: e.target.value })} />
            <div className="grid grid-cols-3 gap-3">
              <input className={inputClass} type="number" step="0.1" placeholder="Jarak km" value={facilityForm.distanceKm} onChange={(e) => setFacilityForm({ ...facilityForm, distanceKm: e.target.value })} />
              <input className={inputClass} type="number" step="0.000001" placeholder="Latitude" value={facilityForm.latitude} onChange={(e) => setFacilityForm({ ...facilityForm, latitude: e.target.value })} />
              <input className={inputClass} type="number" step="0.000001" placeholder="Longitude" value={facilityForm.longitude} onChange={(e) => setFacilityForm({ ...facilityForm, longitude: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={busy} className="btn btn-primary flex-1"><Save size={16} /> Simpan</button>
              {facilityEditId && <button type="button" className="btn btn-ghost" onClick={() => { setFacilityEditId(null); setFacilityForm(emptyFacility); }}>Batal</button>}
            </div>
          </form>
          <div className="lg:col-span-8 panel">
            <div className="panel-header"><Building2 size={20} /><h2>Daftar Fasilitas</h2></div>
            <div className="grid md:grid-cols-2 gap-3">
              {facilities.map((facility) => (
                <div key={facility.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                  <h3 className="font-black text-slate-800">{facility.name}</h3>
                  <p className="text-sm text-slate-500">{facility.type} | {facility.city}</p>
                  <p className="text-xs text-slate-500 mt-1">{facility.neighbourhood} | {facility.latitude}, {facility.longitude}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(facility.services || []).map((service) => <span key={service} className="badge badge-low">{service}</span>)}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => editFacility(facility)}><Pencil size={14} /> Edit</button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteFacility(facility.id)}><Trash2 size={14} /> Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "ledger" && (
        <form onSubmit={createRecord} className="panel max-w-3xl">
          <div className="panel-header"><ClipboardList size={20} /><h2>Catatan Medis Pasien</h2></div>
          <div className="grid gap-4">
            <select className={inputClass} value={recordForm.appointmentId} onChange={(e) => {
              const appointment = appointments.find((item) => item.id === e.target.value);
              if (appointment) startRecord(appointment);
              else setRecordForm({ ...recordForm, appointmentId: "" });
            }} required>
              <option value="">Pilih appointment</option>
              {appointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>{appointment.patientName} - {appointment.appointmentDay?.slice(0, 10) || "-"}</option>
              ))}
            </select>
            <input className={inputClass} placeholder="Judul catatan" value={recordForm.title} onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })} required />
            <input className={inputClass} type="date" value={recordForm.date} onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })} required />
            <textarea className={`${inputClass} min-h-[150px]`} placeholder="Catatan medis pasien" value={recordForm.note} onChange={(e) => setRecordForm({ ...recordForm, note: e.target.value })} required />
            <button type="submit" disabled={busy} className="btn btn-primary"><Plus size={16} /> Simpan ke Ledger</button>
          </div>
        </form>
      )}
    </section>
  );
}
