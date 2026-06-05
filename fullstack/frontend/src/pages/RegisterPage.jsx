import React, { useState } from "react";
import { HeartPulse, UserPlus, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../api";
import { useAppContext } from "../App.jsx";
import { BackgroundBeams } from "../components/ui/BackgroundBeams";

export default function RegisterPage() {
  const { onAuth, setPage, showToast } = useAppContext();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (form.password.length < 6) { showToast("Password minimal 6 karakter", "error"); return; }
    setBusy(true);
    try {
      await api.register(form);
      const result = await api.login({ email: form.email, password: form.password });
      await onAuth(result);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm transition-all shadow-sm focus:outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-20 relative overflow-hidden bg-[#f8fafc]">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>
      <div className="absolute top-[10%] right-[8%] w-72 h-72 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-56 h-56 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <HeartPulse size={26} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pendaftaran Sistem</h1>
            <p className="text-slate-500 text-sm mt-1">Bergabung untuk menikmati layanan appointment cerdas dan prediksi risiko berbasis AI.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Nama Lengkap</label>
              <input
                id="register-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Email</label>
              <input
                id="register-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="email@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputClass} pr-12`}
                  placeholder="Min. 6 karakter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={busy}
              className="w-full mt-2 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold py-3.5 rounded-xl shadow-md shadow-teal-500/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <><span className="animate-spin text-lg">⏳</span> Memproses...</>
              ) : (
                <><UserPlus size={18} /> Otorisasi Pendaftaran</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={() => setPage("login")}
              className="text-teal-600 font-bold hover:underline"
            >
              Masuk Sini
            </button>
          </p>

          {/* Info box */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-600 space-y-1">
            <p className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-2">Info</p>
            <p>Setelah registrasi, Anda langsung masuk sebagai <strong>Pasien</strong>.</p>
            <p>Akun <strong>Admin</strong> dikelola oleh tim HealPoint.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
