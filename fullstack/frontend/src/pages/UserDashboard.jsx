import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  CalendarPlus, Activity, Stethoscope, BarChart3, MapPin,
  ClipboardList, Brain, ShieldCheck, Trash2, Plus, XCircle, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../api";
import { useAppContext } from "../App.jsx";
import { BackgroundBeams } from "../components/ui/BackgroundBeams";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ────────────────────────────────────────────────
// OPENROUTER CLIENT (DeepSeek via OpenRouter)
// ────────────────────────────────────────────────
const openaiClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || "",
  dangerouslyAllowBrowser: true,
});

// ────────────────────────────────────────────────
// KOMPONEN: AI APPOINTMENT CONSULTANT CHAT
// Fokus: konteks HealPoint — appointment, no-show, follow-up
// ────────────────────────────────────────────────
function AIAppointmentConsultant({ lastPredictedData, onClear }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const lastProcessedRiskStr = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  // Load riwayat chat dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("healpoint_ai_chat");
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch (e) { /* ignore */ }
    }
  }, []);

  // Simpan ke localStorage setiap ada perubahan
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("healpoint_ai_chat", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-analisis setelah prediksi AI baru masuk
  useEffect(() => {
    if (!lastPredictedData) return;
    const { risk, form } = lastPredictedData;
    const riskStr = JSON.stringify(risk) + JSON.stringify(form);
    if (lastProcessedRiskStr.current === riskStr) return;
    lastProcessedRiskStr.current = riskStr;

    const runAnalysis = async () => {
      setLoading(true);

      const saved = localStorage.getItem("healpoint_ai_chat");
      const currentMessages = saved ? JSON.parse(saved) : messages;
      const isContinuation = currentMessages.length > 0;

      // Prompt HealPoint — fokus ke appointment & no-show
      const promptContent = isContinuation
        ? `[Update Data Appointment Baru] Pasien baru saja membuat appointment. Data terbaru: Nama ${form.patientName}, Usia ${form.age} tahun, Gender ${form.gender === "F" ? "Wanita" : "Pria"}, Waiting Days ${form.waitingDays} hari, Lokasi: ${form.neighbourhood}. Kondisi: ${[form.hypertension && "Hipertensi", form.diabetes && "Diabetes", form.alcoholism && "Alkoholisme"].filter(Boolean).join(", ") || "Tidak ada"}. SMS Reminder: ${form.smsReceived ? "Aktif" : "Tidak aktif"}. Prediksi terbaru: Risiko No-show ${risk.risk_level} (probabilitas ${Math.round((risk.no_show_probability || 0) * 100)}%). Berikan analisis singkat perkembangan dan saran tindak lanjut terbaru. Jangan ulangi perkenalan panjang.`
        : `Halo AI, saya adalah sistem HealPoint. Pasien baru saja membuat appointment dengan data berikut: Nama: ${form.patientName}, Usia: ${form.age} tahun, Gender: ${form.gender === "F" ? "Wanita" : "Pria"}, Waiting Days: ${form.waitingDays} hari (jarak antara pendaftaran dan tanggal appointment), Lokasi: ${form.neighbourhood}. Kondisi kesehatan: ${[form.hypertension && "Hipertensi", form.diabetes && "Diabetes", form.alcoholism && "Alkoholisme"].filter(Boolean).join(", ") || "Tidak ada kondisi khusus"}. SMS Reminder: ${form.smsReceived ? "Sudah diaktifkan" : "Belum diaktifkan"}. Hasil prediksi model Deep Learning: Risiko No-show = ${risk.risk_level} dengan probabilitas ${Math.round((risk.no_show_probability || 0) * 100)}%. Rekomendasi dari model: ${risk.recommendation || "-"}. Tolong berikan: (1) Analisis singkat mengapa pasien ini berisiko tidak hadir berdasarkan data, (2) 2-3 rekomendasi tindak lanjut konkret (misal: jadwal SMS, follow-up telepon, penyesuaian waktu appointment). Gunakan bahasa Indonesia yang empatik, profesional, dan to-the-point.`;

      const systemMsg = { role: "user", content: promptContent };
      const conversationContext = [...currentMessages, systemMsg];

      setMessages(conversationContext);

      try {
        const apiResponse = await openaiClient.chat.completions.create({
          model: "deepseek/deepseek-chat",
          messages: conversationContext,
        });
        const response = apiResponse.choices[0].message;
        setMessages([...conversationContext, { role: "assistant", content: response.content }]);
      } catch (e) {
        console.error("AI Primary error:", e);
        try {
          const apiResponse2 = await openaiClient.chat.completions.create({
            model: "deepseek/deepseek-v3-base:free",
            messages: conversationContext,
          });
          const response2 = apiResponse2.choices[0].message;
          setMessages([...conversationContext, { role: "assistant", content: response2.content }]);
        } catch (err2) {
          setMessages([...conversationContext, {
            role: "assistant",
            content: "Maaf, koneksi ke AI Consultant sedang mengalami gangguan. Pastikan VITE_OPENROUTER_API_KEY sudah diset di file .env",
          }]);
        }
      }
      setLoading(false);
    };

    runAnalysis();
  }, [lastPredictedData]);

  const clearChat = () => {
    if (window.confirm("Hapus seluruh riwayat obrolan dengan AI Consultant?")) {
      setMessages([]);
      localStorage.removeItem("healpoint_ai_chat");
      lastProcessedRiskStr.current = null;
      if (onClear) onClear();
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const apiResponse = await openaiClient.chat.completions.create({
        model: "deepseek/deepseek-chat",
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
      });
      const response = apiResponse.choices[0].message;
      setMessages([...newMessages, { role: "assistant", content: response.content }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Gagal membalas pesan. Coba lagi." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[520px] w-full border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-md mt-8">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full text-xl leading-none">🏥</div>
          <div>
            <h4 className="font-black text-sm drop-shadow-sm leading-tight">HealPoint AI Consultant</h4>
            <p className="text-[10px] text-teal-100 font-medium">Asisten Analisis Appointment & No-show</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="text-[10px] bg-white/20 hover:bg-rose-500/80 border border-white/30 px-3 py-1.5 rounded-full font-bold shadow-inner transition-colors cursor-pointer"
          >
            🗑️ Hapus Chat
          </button>
          <span className="text-[10px] bg-teal-800/50 border border-teal-400/30 px-3 py-1.5 rounded-full font-bold shadow-inner hidden md:block">
            Powered by DeepSeek
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 gap-3">
            <span className="text-4xl">🤖</span>
            <p className="text-sm font-medium">Buat appointment dan klik "Simpan & Prediksi AI"<br />untuk mengaktifkan analisis AI Consultant.</p>
          </div>
        )}
        {messages.map((msg, idx) => {
          if (idx === 0) return null; // Sembunyikan prompt awal
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className={`p-4 md:p-5 rounded-2xl max-w-[90%] md:max-w-[80%] text-sm shadow-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-teal-600 text-white rounded-br-none ml-auto"
                  : "bg-white border border-slate-200 text-slate-700 rounded-bl-none mr-auto"
              }`}>
                {msg.role === "user" ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="text-base font-black text-teal-800 mb-2 mt-4 first:mt-0" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-sm font-bold text-teal-700 mb-2 mt-3 first:mt-0" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-teal-600 mb-2 mt-2 first:mt-0" {...props} />,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </motion.div>
          );
        })}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
            <div className="bg-white border border-slate-200 text-slate-400 text-xs font-medium italic p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <span className="animate-spin text-lg">⚙️</span> AI Consultant sedang menganalisis data appointment...
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan analisis appointment, strategi reminder, follow-up pasien..."
          className="flex-1 bg-slate-100/80 border border-slate-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all text-slate-700"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white px-6 py-3 rounded-full text-sm font-bold shadow-md shadow-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>Kirim</span>
          <span>✈️</span>
        </button>
      </form>
    </div>
  );
}

// ────────────────────────────────────────────────
// KOMPONEN UTAMA: USER DASHBOARD
// ────────────────────────────────────────────────
function ageGroup(age) {
  if (age <= 12) return "child";
  if (age <= 17) return "teen";
  if (age <= 35) return "young_adult";
  if (age <= 59) return "adult";
  return "senior";
}

export default function UserDashboard() {
  const { user, setPage, appointments, doctors, facilities, records, risk, setRisk, reload, setAppointments, setRecords, showToast } = useAppContext();
  const [tab, setTab] = useState("scheduling");
  const [form, setForm] = useState({
    patientName: user?.name || "", gender: "F", age: 31, appointmentDay: "2026-05-10T09:00",
    waitingDays: 12, neighbourhood: "Dago", doctorId: "doctor-1", facilityId: "facility-1",
    hypertension: false, diabetes: false, alcoholism: false, handicap: 0, smsReceived: true,
  });
  const [ledgerForm, setLedgerForm] = useState({
    title: "",
    facilityName: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const [busy, setBusy] = useState(false);
  const [ledgerBusy, setLedgerBusy] = useState(false);
  const [hasAIChat, setHasAIChat] = useState(false);
  const [lastPredictedData, setLastPredictedData] = useState(null);

  // Geolocation & Distance State
  const [userCoords, setUserCoords] = useState([-6.9175, 107.6191]); // Default Bandung Alun-alun
  const [hasLiveLocation, setHasLiveLocation] = useState(false);
  const [mapContainerEl, setMapContainerEl] = useState(null);
  const mapInstanceRef = useRef(null);
  const facilityMarkersRef = useRef({});

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords([pos.coords.latitude, pos.coords.longitude]);
          setHasLiveLocation(true);
        },
        (err) => {
          console.warn("Geolocation error:", err);
          // Fallback to Bandung center (already set in state)
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // Distance calculation helper (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0; // Fallback
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Process facilities list, calculate real distances and sort
  const processedFacilities = useMemo(() => {
    return facilities.map((f) => {
      const distance = calculateDistance(userCoords[0], userCoords[1], f.latitude, f.longitude);
      return {
        ...f,
        distanceKm: distance,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [facilities, userCoords]);

  // Leaflet Map rendering effect
  useEffect(() => {
    if (tab !== "healthhub") return;

    const container = mapContainerEl;
    if (!container) return;

    let resizeObserver;
    let resizeTimer;
    let initFrameId;
    let resizeFrameId;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initMap = () => {
      try {
      const map = L.map(container, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(userCoords, 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Define CSS-styled icons
      const userIcon = L.divIcon({
        html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md animate-ping" style="position: absolute;"></div><div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md" style="position: relative;"></div>`,
        className: "",
        iconSize: [16, 16],
      });

      const facilityIcon = L.divIcon({
        html: `<div class="w-7 h-7 bg-teal-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[12px] font-black" style="transform: translate(-2px, -2px);">🏥</div>`,
        className: "",
        iconSize: [24, 24],
      });

      // User Marker
      L.marker(userCoords, { icon: userIcon })
        .addTo(map)
        .bindPopup(`<b>Lokasi Anda</b><br/>${hasLiveLocation ? "GPS Aktif & Akurat" : "Pusat Kota Bandung (Default)"}`)
        .openPopup();

      const markers = {};

      // Facilities Markers
      processedFacilities.forEach((f) => {
        if (f.latitude && f.longitude) {
          const dc = doctors.filter((d) => d.facilityId === f.id);
          const services = f.services || [];
          const m = L.marker([f.latitude, f.longitude], { icon: facilityIcon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: 'Manrope', sans-serif; padding: 4px;">
                <h4 style="margin: 0 0 4px; font-weight: 800; color: #0f172a; font-size: 13px;">${f.name}</h4>
                <p style="margin: 0 0 6px; font-size: 11px; color: #64748b;">${f.type} · ${f.distanceKm.toFixed(2)} km</p>
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px;">
                  ${services.map(s => `<span style="font-size: 9px; font-weight: 700; background: #f0fdfa; color: #0d9488; border: 1px solid #ccfbf1; padding: 1px 6px; border-radius: 4px;">${s}</span>`).join('')}
                </div>
                <p style="margin: 0; font-size: 10px; color: #94a3b8; font-weight: 600;">Dokter: ${dc.map(d => d.name).join(', ')}</p>
              </div>
            `);
          markers[f.id] = m;
        }
      });

      facilityMarkersRef.current = markers;

      const invalidateMapSize = () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      };

      resizeFrameId = window.requestAnimationFrame(invalidateMapSize);
      resizeTimer = window.setTimeout(invalidateMapSize, 300);

      if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(invalidateMapSize);
        resizeObserver.observe(container);
      }
      } catch (e) {
        console.error("Leaflet Map init error:", e);
      }
    };

    initFrameId = window.requestAnimationFrame(initMap);

    return () => {
      window.cancelAnimationFrame(initFrameId);
      window.cancelAnimationFrame(resizeFrameId);
      window.clearTimeout(resizeTimer);
      resizeObserver?.disconnect();
      facilityMarkersRef.current = {};
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tab, mapContainerEl, userCoords, hasLiveLocation, processedFacilities, doctors]);

  const focusFacilityOnMap = (f) => {
    if (mapInstanceRef.current && f.latitude && f.longitude) {
      mapInstanceRef.current.setView([f.latitude, f.longitude], 15, { animate: true, duration: 1.2 });
      if (facilityMarkersRef.current[f.id]) {
        facilityMarkersRef.current[f.id].openPopup();
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("healpoint_ai_chat");
    if (saved && JSON.parse(saved).length > 0) setHasAIChat(true);
  }, []);

  useEffect(() => {
    if (lastPredictedData) setHasAIChat(true);
  }, [lastPredictedData]);

  useEffect(() => {
    if (!ledgerForm.facilityName && facilities.length > 0) {
      setLedgerForm((current) => ({ ...current, facilityName: facilities[0].name }));
    }
  }, [facilities, ledgerForm.facilityName]);

  useEffect(() => {
    const selectedFacility = facilities.find(f => f.id === form.facilityId);
    if (selectedFacility && selectedFacility.neighbourhood) {
      setForm((current) => ({ ...current, neighbourhood: selectedFacility.neighbourhood }));
    }
  }, [form.facilityId, facilities]);

  const stats = useMemo(() => ({
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === "scheduled").length,
    highRisk: appointments.filter((a) => a.riskLevel === "High").length,
  }), [appointments]);

  const doctorById = useMemo(() => Object.fromEntries(doctors.map((doctor) => [doctor.id, doctor])), [doctors]);
  const facilityById = useMemo(() => Object.fromEntries(facilities.map((facility) => [facility.id, facility])), [facilities]);

  if (!user || user.role === "admin") return (
    <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "120px" }}>
      <div className="text-center">
        <ShieldCheck size={48} className="text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-700">{user?.role === "admin" ? "Dashboard Pasien Tidak Tersedia untuk Admin" : "Login untuk membuka Dashboard"}</h2>
        <p className="text-slate-500 mt-2 mb-6">
          {user?.role === "admin" ? "Admin mengelola data melalui Admin Dashboard." : "Anda perlu login terlebih dahulu."}
        </p>
        <button className="btn btn-primary" onClick={() => setPage(user?.role === "admin" ? "admin" : "login")}>
          {user?.role === "admin" ? "Buka Admin Dashboard" : "Login"}
        </button>
      </div>
    </div>
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const age = Number(form.age);
      const prediction = await api.predictNoShow({
        gender: form.gender, age, age_group: ageGroup(age), neighbourhood: form.neighbourhood,
        scheduled_hour: new Date(form.appointmentDay).getHours(),
        appointment_weekday: new Date(form.appointmentDay).toLocaleDateString("en-US", { weekday: "long" }),
        appointment_month: new Date(form.appointmentDay).getMonth() + 1,
        waiting_days: Number(form.waitingDays), scholarship: 0,
        hypertension: form.hypertension ? 1 : 0, diabetes: form.diabetes ? 1 : 0,
        alcoholism: form.alcoholism ? 1 : 0, handicap: Number(form.handicap || 0),
        sms_received: form.smsReceived ? 1 : 0,
        has_chronic_condition: form.hypertension || form.diabetes ? 1 : 0,
      });
      setRisk(prediction);
      setLastPredictedData({ risk: prediction, form: { ...form } }); // Decoupled prediction event!
      await api.createAppointment({
        ...form, age: Number(form.age), waitingDays: Number(form.waitingDays),
        appointmentDay: `${form.appointmentDay}:00Z`, riskLevel: prediction.risk_level,
        noShowProbability: prediction.no_show_probability,
      });
      toast.success("Appointment berhasil disimpan & Prediksi AI selesai!");
      await reload(user);
    } catch (err) {
      toast.error(err.message || "Gagal membuat appointment.");
    } finally {
      setBusy(false);
    }
  }

  async function cancelAppt(id) {
    try { await api.updateAppointment(id, { status: "cancelled" }); showToast("Appointment dibatalkan", "info"); await reload(user); }
    catch (err) { showToast(err.message, "error"); }
  }
  async function completeAppt(id) {
    try { await api.updateAppointment(id, { status: "completed" }); showToast("Appointment ditandai selesai", "success"); await reload(user); }
    catch (err) { showToast(err.message, "error"); }
  }
  async function deleteAppt(id) {
    try { await api.deleteAppointment(id); setAppointments((c) => c.filter((a) => a.id !== id)); showToast("Appointment dihapus", "info"); }
    catch (err) { showToast(err.message, "error"); }
  }

  async function createLedgerRecord(e) {
    e.preventDefault();
    setLedgerBusy(true);
    try {
      const record = await api.createMedicalRecord(ledgerForm);
      setRecords((current) => [record, ...current]);
      setLedgerForm({
        title: "",
        facilityName: facilities[0]?.name || "",
        date: new Date().toISOString().slice(0, 10),
        note: "",
      });
      showToast("Catatan medis berhasil ditambahkan", "success");
    } catch (err) {
      showToast(err.message || "Gagal menambah catatan medis", "error");
    } finally {
      setLedgerBusy(false);
    }
  }

  async function deleteLedgerRecord(id) {
    try {
      await api.deleteMedicalRecord(id);
      setRecords((current) => current.filter((record) => record.id !== id));
      showToast("Catatan medis dihapus", "info");
    } catch (err) {
      showToast(err.message || "Gagal menghapus catatan medis", "error");
    }
  }

  const tabs = [
    { id: "scheduling", label: "Smart Scheduling", icon: <CalendarPlus size={16} /> },
    { id: "appointments", label: "Appointment Saya", icon: <Activity size={16} /> },
    { id: "healthhub", label: "Health Hub", icon: <MapPin size={16} /> },
    { id: "ledger", label: "Medical Ledger", icon: <ClipboardList size={16} /> },
  ];

  const riskColorClass = {
    Low: "from-emerald-400 to-teal-500",
    Medium: "from-amber-400 to-orange-500",
    High: "from-rose-500 to-red-600",
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm transition-all shadow-sm focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10";

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>
      <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-teal-100/40 blur-3xl pointer-events-none z-0" />

      <Toaster position="top-center" toastOptions={{
        style: { background: "#ffffff", color: "#1e293b", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
      }} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Dashboard Header */}
        <div className="mb-8">
          <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-1">User Dashboard</p>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Halo, {user.name} 👋</h1>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { val: stats.total, label: "Total Appointment", icon: <CalendarPlus size={20} />, color: "text-teal-600" },
            { val: stats.scheduled, label: "Scheduled", icon: <Activity size={20} />, color: "text-blue-600" },
            { val: doctors.length, label: "Dokter Tersedia", icon: <Stethoscope size={20} />, color: "text-emerald-600" },
            { val: stats.highRisk, label: "High Risk", icon: <BarChart3 size={20} />, color: "text-rose-600" },
          ].map(({ val, label, icon, color }) => (
            <motion.div
              key={label}
              whileHover={{ y: -3 }}
              className="bg-white/90 border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-emerald-400" />
              <div className={`mb-2 ${color}`}>{icon}</div>
              <div className="text-xs font-bold text-slate-500 mb-1">{label}</div>
              <div className="text-3xl font-black text-slate-800">{val}</div>
            </motion.div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-4 px-6 text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
                tab === t.id
                  ? "text-teal-600 border-b-2 border-teal-500"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* SMART SCHEDULING TAB */}
        <AnimatePresence mode="wait">
          {tab === "scheduling" && (
            <motion.div key="scheduling" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="grid md:grid-cols-12 gap-8">

                {/* Form Panel */}
                <div className="md:col-span-7 bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl p-8 shadow-md">
                  <h3 className="text-xl font-black mb-6 text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-2">
                    <span className="text-teal-500">📋</span> Buat Appointment
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Nama Pasien</label>
                        <input className={inputClass} value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Gender</label>
                        <select className={inputClass} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                          <option value="F">Perempuan</option>
                          <option value="M">Laki-laki</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Usia</label>
                        <input className={inputClass} type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} min="0" max="120" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Waiting Days</label>
                        <input className={inputClass} type="number" value={form.waitingDays} onChange={(e) => setForm({ ...form, waitingDays: e.target.value })} min="0" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Dokter</label>
                        <select className={inputClass} value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
                          {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Fasilitas</label>
                        <select className={inputClass} value={form.facilityId} onChange={(e) => setForm({ ...form, facilityId: e.target.value })}>
                          {facilities.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Tanggal Appointment</label>
                      <input className={inputClass} type="datetime-local" value={form.appointmentDay} onChange={(e) => setForm({ ...form, appointmentDay: e.target.value })} />
                    </div>

                    {/* Kondisi Kesehatan */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Kondisi Kesehatan</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: "hypertension", label: "Hipertensi" },
                          { key: "diabetes", label: "Diabetes" },
                          { key: "alcoholism", label: "Riwayat Alkoholisme" },
                          { key: "smsReceived", label: "Kirim SMS Reminder" },
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form[key]}
                              onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                              className="accent-teal-500 w-4 h-4"
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      id="appointment-submit-btn"
                      type="submit"
                      disabled={busy}
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold py-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {busy ? <><span className="animate-spin text-xl">⏳</span> Memproses...</> : <><Brain size={18} /> Simpan &amp; Prediksi AI</>}
                    </button>
                  </form>
                </div>

                {/* Risk Result Panel */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  {!risk ? (
                    <div className="flex-1 bg-white/50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
                      <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4 shadow-inner text-teal-400">
                        <span className="text-3xl">💻</span>
                      </div>
                      <h4 className="font-bold text-slate-600 mb-2">Menunggu Prediksi AI</h4>
                      <p className="text-sm">Isi form appointment dan klik "Simpan & Prediksi AI" untuk melihat hasil analisis Deep Learning.</p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-lg"
                    >
                      <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                        <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Hasil Prediksi AI</span>
                        <span className="text-teal-600 font-black text-sm">No-show Analysis</span>
                      </div>

                      {/* Risk Badge */}
                      <div className={`px-6 py-4 rounded-2xl bg-gradient-to-br text-white text-center mb-5 ${riskColorClass[risk.risk_level] || "from-slate-300 to-slate-400"}`}>
                        <span className="text-3xl font-black drop-shadow-md">{risk.risk_level} Risk</span>
                        <p className="text-sm font-bold mt-1 opacity-90">
                          {Math.round((risk.no_show_probability || 0) * 100)}% probabilitas tidak hadir
                        </p>
                      </div>

                      {/* Probability Bar */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-5">
                        <p className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">No-show Probability</p>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round((risk.no_show_probability || 0) * 100)}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              risk.risk_level === "Low" ? "bg-emerald-500" :
                              risk.risk_level === "High" ? "bg-rose-500" : "bg-amber-500"
                            }`}
                          />
                        </div>
                        <p className="text-right text-xs font-bold text-slate-500 mt-1">
                          {Math.round((risk.no_show_probability || 0) * 100)}%
                        </p>
                      </div>

                      {/* Recommendation */}
                      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                          🩺 Rekomendasi Sistem
                        </p>
                        <p className="text-sm text-teal-800 font-medium leading-relaxed">
                          {risk.recommendation || "Pantau kehadiran pasien dan aktifkan SMS reminder."}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500">
                        <span>Model: TF Deep Learning</span>
                        <span className="text-teal-600">AI Engine Active ✓</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* AI Consultant Chat — Full Width below grid */}
              {hasAIChat && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <AIAppointmentConsultant lastPredictedData={lastPredictedData} onClear={() => setHasAIChat(false)} />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* APPOINTMENTS TAB */}
          {tab === "appointments" && (
            <motion.div key="appointments" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Activity size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-slate-800">Daftar Appointment</h2>
                  </div>
                  <button type="button" onClick={() => setTab("scheduling")} className="btn btn-primary btn-sm">
                    <CalendarPlus size={15} /> Buat Baru
                  </button>
                </div>
                {appointments.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <CalendarPlus size={40} className="mx-auto mb-3 opacity-40" />
                    <p>Belum ada appointment. Buat appointment pertama Anda!</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {appointments.map((a) => (
                      <div key={a.id} className="grid lg:grid-cols-[1fr_auto] gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <strong className="text-sm text-slate-800">{a.patientName}</strong>
                            <span className={`badge badge-${(a.riskLevel || "low").toLowerCase()}`}>{a.riskLevel || "-"}</span>
                            <span className={`badge badge-${(a.status || "scheduled").replace("_", "-")}`}>{a.status || "scheduled"}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {a.appointmentDay?.slice(0, 10) || "-"} | {a.neighbourhood || "-"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {doctorById[a.doctorId]?.name || "Dokter belum dipilih"} | {facilityById[a.facilityId]?.name || "Fasilitas belum dipilih"}
                          </p>
                          {a.noShowProbability !== undefined && (
                            <p className="text-xs font-bold text-teal-700 mt-2">
                              Risiko no-show {Math.round((a.noShowProbability || 0) * 100)}%
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap lg:justify-end items-center gap-2">
                          {a.status === "scheduled" && (
                            <>
                              <button type="button" className="btn btn-ghost btn-sm" onClick={() => completeAppt(a.id)}>
                                <CheckCircle2 size={14} /> Selesai
                              </button>
                              <button type="button" className="btn btn-ghost btn-sm" onClick={() => cancelAppt(a.id)}>
                                <XCircle size={14} /> Cancel
                              </button>
                            </>
                          )}
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteAppt(a.id)}>
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* HEALTH HUB TAB */}
          {tab === "healthhub" && (
            <motion.div key="healthhub" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl p-8 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 tracking-tight">Geolocation Health Hub</h2>
                      <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">
                        {hasLiveLocation ? "🟢 Terhubung ke GPS Asli Anda" : "🔵 Fallback: Bandung Alun-Alun"}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 font-bold bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                    Koordinat Anda: {userCoords[0].toFixed(5)}, {userCoords[1].toFixed(5)}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Facilities List */}
                  <div className="lg:col-span-5 space-y-4 max-h-[550px] overflow-y-auto pr-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Daftar Faskes Terdekat ({processedFacilities.length})</p>
                    {processedFacilities.map((f) => {
                      const dc = doctors.filter((d) => d.facilityId === f.id);
                      return (
                        <motion.div
                          key={f.id}
                          whileHover={{ x: 3 }}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-teal-500 hover:bg-teal-50/10 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{f.name}</h4>
                              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full border border-teal-200">
                                {f.distanceKm < 1 ? `${(f.distanceKm * 1000).toFixed(0)} m` : `${f.distanceKm.toFixed(2)} km`}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold mb-2">{f.type} · {f.city}</p>
                            <p className="text-xs text-slate-500 mb-3 font-semibold">{dc.length} dokter aktif tersedia</p>
                            
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {(f.services || []).map((s) => (
                                <span key={s} className="text-[9px] font-extrabold bg-white text-teal-700 border border-teal-100 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => focusFacilityOnMap(f)}
                            className="w-full bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50/10 text-slate-600 font-bold py-2 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>🧭 Pusatkan di Peta</span>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Right Column: Leaflet Map Container */}
                  <div className="lg:col-span-7">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden relative shadow-inner h-[550px] w-full z-10">
                      <div ref={setMapContainerEl} id="leaflet-map" className="w-full h-full" style={{ minHeight: "550px" }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MEDICAL LEDGER TAB */}
          {tab === "ledger" && (
            <motion.div key="ledger" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="grid lg:grid-cols-12 gap-6">
                <form onSubmit={createLedgerRecord} className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <Plus size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-slate-800">Tambah Catatan Medis</h2>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Judul</label>
                    <input
                      className={inputClass}
                      value={ledgerForm.title}
                      onChange={(e) => setLedgerForm({ ...ledgerForm, title: e.target.value })}
                      placeholder="Contoh: Riwayat kontrol umum"
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Fasilitas</label>
                      <select
                        className={inputClass}
                        value={ledgerForm.facilityName}
                        onChange={(e) => setLedgerForm({ ...ledgerForm, facilityName: e.target.value })}
                        required
                      >
                        {facilities.map((facility) => (
                          <option key={facility.id} value={facility.name}>{facility.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Tanggal</label>
                      <input
                        className={inputClass}
                        type="date"
                        value={ledgerForm.date}
                        onChange={(e) => setLedgerForm({ ...ledgerForm, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Catatan</label>
                    <textarea
                      className={`${inputClass} min-h-[130px] resize-y`}
                      value={ledgerForm.note}
                      onChange={(e) => setLedgerForm({ ...ledgerForm, note: e.target.value })}
                      placeholder="Tulis hasil kontrol, alergi, resep, atau rekomendasi dokter."
                      required
                    />
                  </div>
                  <button type="submit" disabled={ledgerBusy} className="btn btn-primary w-full">
                    <Plus size={16} /> {ledgerBusy ? "Menyimpan..." : "Simpan Catatan"}
                  </button>
                </form>

                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <ClipboardList size={20} className="text-teal-600" />
                    <h2 className="text-lg font-bold text-slate-800">Personal Health Data Ledger</h2>
                  </div>
                  {records.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                      <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
                      <p>Belum ada catatan kesehatan.</p>
                    </div>
                  ) : (
                    <div className="border-l-2 border-teal-200 pl-6 space-y-6">
                      {records.map((r) => (
                        <div key={r.id} className="relative group">
                          <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-teal-500" />
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-slate-800">{r.title}</h4>
                              <p className="text-xs text-slate-500">{r.facilityName} | {r.date}</p>
                            </div>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteLedgerRecord(r.id)}>
                              <Trash2 size={14} /> Hapus
                            </button>
                          </div>
                          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{r.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
