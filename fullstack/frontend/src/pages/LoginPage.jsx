import React, { useState } from "react";
import { HeartPulse, LogIn, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../api";
import { useAppContext } from "../App.jsx";
import { BackgroundBeams } from "../components/ui/BackgroundBeams";

export default function LoginPage() {
  const { onAuth, setPage, showToast } = useAppContext();
  const [form, setForm] = useState({ email: "demo@healpoint.local", password: "password123" });
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await api.login(form);
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
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">HealPoint Portal</h1>
            <p className="text-slate-500 text-sm mt-1">Masuk untuk mengelola appointment dan akses dashboard AI.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Email</label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputClass} pr-12`}
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
              id="login-submit-btn"
              type="submit"
              disabled={busy}
              className="w-full mt-2 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold py-3.5 rounded-xl shadow-md shadow-teal-500/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? (
                <><span className="animate-spin text-lg">⏳</span> Memproses...</>
              ) : (
                <><LogIn size={18} /> Masuk Jaringan Klinis</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => setPage("register")}
              className="text-teal-600 font-bold hover:underline"
            >
              Klaim Akses Akun
            </button>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-teal-50 border border-teal-100 rounded-2xl text-xs text-teal-800 space-y-1">
            <p className="font-black text-[10px] uppercase tracking-widest text-teal-600 mb-2">Demo Credentials</p>
            <p><strong>User:</strong> demo@healpoint.local / password123</p>
            <p><strong>Admin:</strong> admin@healpoint.local / admin123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
