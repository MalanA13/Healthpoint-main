import React, { useRef } from "react";
import {
  CalendarPlus, MapPin, Brain, BarChart3, ClipboardList,
  ShieldCheck, ArrowRight, Zap, HeartPulse, Activity,
  UserCheck, Cpu, Quote, ChevronRight,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypewriterEffectSmooth } from "../components/ui/TypewriterEffect";
import { BackgroundBeams } from "../components/ui/BackgroundBeams";
import { Spotlight } from "../components/ui/Spotlight";
import {
  HoverCard, BlurFadeText, FadeInSection, ParallaxSection,
} from "../components/ui/MotionComponents";
import { useAppContext } from "../App.jsx";

export default function LandingPage() {
  const { setPage } = useAppContext();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = [
    { text: "HealPoint:", className: "text-slate-700" },
    { text: "Smart", className: "text-slate-700" },
    { text: "Scheduling", className: "text-teal-600 font-black" },
    { text: "Berbasis", className: "text-slate-700" },
    { text: "AI.", className: "text-emerald-600 font-black" },
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  const features = [
    { icon: <CalendarPlus size={22} />, color: "teal", title: "Smart Scheduling", desc: "Buat jadwal appointment dan dapatkan prediksi risiko no-show secara real-time dari model AI." },
    { icon: <MapPin size={22} />, color: "blue", title: "Geolocation Health Hub", desc: "Temukan fasilitas kesehatan dan dokter terdekat dengan filter spesialisasi lengkap." },
    { icon: <Brain size={22} />, color: "violet", title: "AI No-show Prediction", desc: "Deep Learning TensorFlow memprediksi probabilitas no-show pasien dengan akurasi tinggi." },
    { icon: <BarChart3 size={22} />, color: "amber", title: "Analytics Dashboard", desc: "Dashboard insight untuk admin: distribusi risiko, pola reservasi, dan performa layanan." },
    { icon: <ClipboardList size={22} />, color: "emerald", title: "Medical Ledger", desc: "Simpan riwayat reservasi dan catatan kesehatan pasien secara aman dan terstruktur." },
    { icon: <ShieldCheck size={22} />, color: "rose", title: "Secure JWT Auth", desc: "Sistem autentikasi JWT yang aman untuk melindungi data kesehatan sensitif pasien." },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-800 font-sans selection:bg-teal-200 overflow-x-hidden">

      {/* ═══════════════════════════════════════════ */}
      {/* 1. HERO SECTION                             */}
      {/* ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-28 pb-24 px-6 flex flex-col lg:flex-row items-center justify-center min-h-[95vh] overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <BackgroundBeams />
        </div>

        <Spotlight className="-top-40 left-0 md:-top-20 md:-left-20 opacity-60" fill="#0d9488" />

        <motion.div style={{ y: heroY }} className="absolute top-0 inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] right-[8%] w-72 h-72 bg-teal-100/60 rounded-full blur-3xl" />
          <div className="absolute bottom-[15%] left-[5%] w-56 h-56 bg-emerald-100/50 rounded-full blur-3xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 z-10"
        >

          {/* Left Text Column */}
          <div className="w-full lg:w-[55%] min-w-0 flex flex-col items-start">
            <BlurFadeText delay={0.1}>
              <div className="bg-white/80 backdrop-blur-sm border border-teal-100 shadow-sm rounded-full px-5 py-2 mb-4 text-xs sm:text-sm text-teal-700 font-extrabold uppercase tracking-widest flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
                </span>
                Keras TensorFlow AI · Capstone Project 2026
              </div>
            </BlurFadeText>

            <div className="flex w-full justify-start mb-4">
              <TypewriterEffectSmooth words={words} cursorClassName="bg-teal-500" />
            </div>

            <BlurFadeText delay={0.3}>
              <p className="text-slate-500 max-w-[600px] text-left text-lg md:text-xl leading-relaxed font-medium mb-8">
                Ekosistem layanan kesehatan digital <em>one-stop solution</em> yang memadukan{" "}
                <strong>smart scheduling, prediksi no-show berbasis Deep Learning</strong>, dan manajemen
                fasilitas kesehatan secara real-time.
              </p>
            </BlurFadeText>

            <BlurFadeText delay={0.45}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  id="hero-cta-register"
                  onClick={() => setPage("register")}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 font-black text-white hover:from-teal-600 hover:to-emerald-400 transition-all shadow-lg hover:shadow-teal-500/30 hover:-translate-y-1 flex justify-center items-center gap-2"
                >
                  Buka Akses Pengujian <ArrowRight size={18} />
                </button>
                <button
                  id="hero-cta-login"
                  onClick={() => setPage("login")}
                  className="px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center"
                >
                  Coba Portal Faskes
                </button>
              </div>
            </BlurFadeText>

            <BlurFadeText delay={0.6}>
              <div className="flex gap-8 mt-10">
                {[["6+", "Fitur Utama"], ["AI", "Deep Learning"], ["MVP", "Capstone 2026"]].map(([val, label]) => (
                  <div key={label} className="flex flex-col">
                    <strong className="text-2xl font-black text-slate-800">{val}</strong>
                    <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">{label}</span>
                  </div>
                ))}
              </div>
            </BlurFadeText>
          </div>

          {/* Right Mockup Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="hidden xl:flex w-[40%] justify-end flex-shrink-0"
          >
            <div className="relative w-[390px] h-[440px] bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white p-6 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-50 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600"><UserCheck size={15} /></div>
                    <span className="font-bold text-slate-700 text-sm">Patient #8942</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 font-black text-[10px] rounded-full uppercase tracking-wider border border-emerald-100">LOW RISK</span>
                </div>
                <div className="space-y-3">
                  {[
                    ["❤️", "Resting BPM", "68 bpm"],
                    ["⚡", "No-show Risk", "12%"],
                    ["🧠", "AI Model", "TensorFlow"],
                  ].map(([icon, label, value]) => (
                    <motion.div
                      key={label}
                      whileHover={{ x: 4 }}
                      className="w-full h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 justify-between cursor-default hover:border-teal-200 hover:bg-teal-50/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{icon}</span>
                        <span className="text-xs font-bold text-slate-500">{label}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-700 text-sm">{value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-100 relative z-10">
                <p className="text-[10px] uppercase font-black tracking-widest text-teal-600 mb-1">AI Recommendation</p>
                <p className="text-xs font-medium text-teal-800 leading-snug">Jadwal aman. Kirim SMS reminder 24 jam sebelum kunjungan untuk memastikan kehadiran.</p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 2. COLLABORATORS STRIP                     */}
      {/* ═══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="border-y border-slate-200 bg-white py-10 relative z-20 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-extrabold mb-8">Proyek Capstone Akhir Dipersembahkan &amp; Didukung Oleh</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-500">
              <span className="text-slate-700 font-black text-xl">DBS Foundation</span>
              <div className="hidden md:block w-px h-10 bg-slate-200" />
              <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">Coding Camp 2026</span>
              <div className="hidden md:block w-px h-10 bg-slate-200" />
              <span className="text-slate-700 font-black text-xl">Dicoding</span>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ═══════════════════════════════════════════ */}
      {/* 3. HOW IT WORKS                             */}
      {/* ═══════════════════════════════════════════ */}
      <ParallaxSection>
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <BlurFadeText>
              <div className="text-center mb-16">
                <span className="text-teal-600 font-black text-xs uppercase tracking-widest block mb-3">ALUR KERJA SISTEM</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Empat Langkah Menuju Appointment Cerdas</h2>
              </div>
            </BlurFadeText>

            <div className="relative">
              <div className="hidden md:block absolute top-[35%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent z-0" />
              <motion.div
                initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
                variants={staggerContainer}
                className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8"
              >
                {[
                  { step: "1", title: "Register & Login", desc: "Buat akun dan masuk ke dashboard HealPoint dengan autentikasi JWT yang aman.", color: "teal" },
                  { step: "2", title: "Pilih Dokter & Faskes", desc: "Cari fasilitas kesehatan dan dokter terbaik berdasarkan spesialisasi dan lokasi.", color: "teal" },
                  { step: <Cpu size={26} />, title: "Prediksi AI No-show", desc: "Model Deep Learning TensorFlow menghitung probabilitas no-show dalam hitungan milidetik.", color: "teal", featured: true },
                  { step: "4", title: "Kelola Appointment", desc: "Terima rekomendasi tindak lanjut dan pantau semua jadwal di Medical Ledger.", color: "emerald" },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <HoverCard className="bg-white rounded-3xl p-8 border border-slate-100 shadow-md text-center flex flex-col items-center h-full">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 font-black text-xl ${
                        item.featured
                          ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30"
                          : `bg-slate-50 border border-slate-200 text-teal-600 shadow-inner`
                      }`}>{item.step}</div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </HoverCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* ═══════════════════════════════════════════ */}
      {/* 4. FEATURES GRID                            */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <BlurFadeText>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="md:w-2/3">
                <span className="text-teal-600 font-black text-xs uppercase tracking-widest block mb-3">KEUNGGULAN PLATFORM</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">Cerdas, Terintegrasi, Aman.</h2>
              </div>
              <p className="text-slate-500 md:w-1/3 leading-relaxed font-medium">
                HealPoint adalah ekosistem layanan kesehatan digital yang dirancang sebagai solusi "one-stop health service" berbasis AI.
              </p>
            </div>
          </BlurFadeText>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((item, i) => {
              const colorMap = {
                teal: "bg-teal-100 text-teal-600",
                blue: "bg-blue-100 text-blue-600",
                violet: "bg-violet-100 text-violet-600",
                amber: "bg-amber-100 text-amber-600",
                emerald: "bg-emerald-100 text-emerald-600",
                rose: "bg-rose-100 text-rose-600",
              };
              return (
                <motion.div key={i} variants={fadeInUp}>
                  <HoverCard className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:bg-white transition-colors duration-300 h-full">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${colorMap[item.color]}`}>{item.icon}</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                  </HoverCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 5. STATS SECTION — Dark                    */}
      {/* ═══════════════════════════════════════════ */}
      <section className="py-24 bg-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-teal-700/50"
          >
            {[
              { val: "98%", color: "text-white", label: "Ketepatan Prediksi AI" },
              { val: "0.2s", color: "text-emerald-400", label: "Waktu Inferensi Model" },
              { val: "6+", color: "text-cyan-300", label: "Fitur MVP Terintegrasi" },
            ].map(({ val, color, label }, i) => (
              <motion.div key={i} variants={fadeInUp} className="pt-8 md:pt-0">
                <span className={`block text-5xl md:text-7xl font-extrabold mb-2 tracking-tighter drop-shadow-lg ${color}`}>{val}</span>
                <span className="text-sm text-teal-200 uppercase tracking-widest font-bold">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* 6. PROJECT BACKGROUND                       */}
      {/* ═══════════════════════════════════════════ */}
      <ParallaxSection>
        <section className="py-24 px-6 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto">
            <BlurFadeText>
              <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Visi &amp; Tujuan Proyek HealPoint</h2>
                <p className="text-slate-500 max-w-lg mx-auto">Solusi nyata untuk permasalahan akses layanan kesehatan di Indonesia.</p>
              </div>
            </BlurFadeText>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  color: "teal", initial: "M", role: "Misi Utama Solusi", sub: "Akses Layanan Kesehatan",
                  quote: "HealPoint dirancang untuk membantu masyarakat menemukan layanan kesehatan, membuat reservasi, dan mendapatkan rekomendasi berbasis AI — dalam satu ekosistem digital yang mudah diakses.",
                },
                {
                  color: "emerald", initial: "T", role: "Target Evaluasi Teknis", sub: "Integrasi AI & Fullstack",
                  quote: "Sistem fullstack React + Node.js + TensorFlow yang terintegrasi end-to-end, membuktikan bahwa prediksi kepadatan pasien dan rekomendasi jadwal dapat diwujudkan dalam Capstone 2026.",
                },
              ].map((item, i) => (
                <FadeInSection key={i} delay={i * 0.15}>
                  <HoverCard className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-full">
                    <Quote size={40} className={`text-${item.color}-200 mb-6`} />
                    <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8 italic">"{item.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-${item.color}-600 rounded-full flex items-center justify-center font-bold text-white text-xl`}>{item.initial}</div>
                      <div>
                        <h4 className="font-bold text-slate-800">{item.role}</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{item.sub}</p>
                      </div>
                    </div>
                  </HoverCard>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* ═══════════════════════════════════════════ */}
      {/* 7. TECH STACK                               */}
      {/* ═══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="py-16 px-6 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-teal-600 font-black text-xs uppercase tracking-widest mb-3">Tech Stack</p>
            <h2 className="text-2xl font-black text-slate-800 mb-10 tracking-tight">Dibangun dengan Teknologi Modern</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {["React 18", "Vite", "Express.js", "TensorFlow", "Streamlit", "Node.js", "REST API", "JWT Auth", "Python", "MongoDB"].map((t) => (
                <span
                  key={t}
                  className="px-5 py-2.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-bold hover:bg-teal-100 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ═══════════════════════════════════════════ */}
      {/* 8. CTA BANNER                               */}
      {/* ═══════════════════════════════════════════ */}
      <FadeInSection>
        <section className="px-6 py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl text-white">
            <div className="absolute top-[-50%] left-[-10%] w-[400px] h-[400px] rounded-full border border-teal-500/20 pointer-events-none" />
            <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] rounded-full border border-emerald-500/20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-white/5 blur-3xl rounded-full" />

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <Zap size={32} className="text-teal-200 mb-4" />
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Siap Memulai Perjalanan Kesehatan Anda?</h2>
              <p className="text-teal-100 font-medium md:text-lg mb-10 leading-relaxed">
                Daftar sekarang dan rasakan kemudahan appointment cerdas berbasis AI. Temukan dokter, buat reservasi, dan pantau risiko — semua dalam satu platform.
              </p>
              <button
                id="cta-register-btn"
                onClick={() => setPage("register")}
                className="px-10 py-5 rounded-full bg-white text-teal-700 font-extrabold hover:bg-slate-50 hover:scale-105 transition-all shadow-xl flex items-center gap-3"
              >
                Daftar Gratis Sekarang <ChevronRight size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ═══════════════════════════════════════════ */}
      {/* 9. FOOTER                                   */}
      {/* ═══════════════════════════════════════════ */}
      <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-black text-slate-800 tracking-tighter mb-4 flex items-center gap-2">
                <Activity className="text-teal-600" /> HealPoint.
              </h2>
              <p className="text-slate-500 text-sm mb-6 leading-loose font-medium">
                Platform layanan kesehatan terintegrasi berbasis AI dan Real-Time. Proyek Capstone DBS 2026.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-xs">Arsitektur</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li><span className="hover:text-teal-600 transition-colors cursor-default">React + Vite (Frontend)</span></li>
                <li><span className="hover:text-teal-600 transition-colors cursor-default">Express.js / FastAPI (Backend)</span></li>
                <li><span className="hover:text-teal-600 transition-colors cursor-default">Streamlit (Data Science)</span></li>
                <li><span className="hover:text-teal-600 transition-colors cursor-default">TensorFlow Keras (AI Model)</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-xs">Navigasi</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li><button onClick={() => setPage("login")} className="hover:text-teal-600 transition-colors">Portal Login</button></li>
                <li><button onClick={() => setPage("register")} className="hover:text-teal-600 transition-colors">Daftar Akun</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-xs">Tim CC26-PSU389</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li>Fullstack Developer (2)</li>
                <li>Data Scientist (2)</li>
                <li>AI Engineer (2)</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
            <p>© 2026 Tim HealPoint · Capstone CC26-PSU389 · Coding Camp DBS Foundation.</p>
            <p>Dibuat dengan ❤️ untuk Capstone 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
