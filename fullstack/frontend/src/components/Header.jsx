import React, { useState, useEffect } from "react";
import { HeartPulse, Menu, X, LayoutDashboard, Shield } from "lucide-react";
import { useAppContext } from "../App.jsx";

export default function Header() {
  const { page, setPage, user, logout } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function nav(target) { setPage(target); setMobileOpen(false); }

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200"
        : "bg-white/80 backdrop-blur-sm border-b border-slate-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <button
            id="header-brand"
            type="button"
            onClick={() => nav("landing")}
            className="flex items-center gap-2 group"
          >
            <HeartPulse size={22} className="text-teal-600 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-black text-slate-800 tracking-tight group-hover:text-teal-700 transition-colors">
              HealPoint
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-700 uppercase tracking-wide">
              MVP
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => nav("landing")}
              className={`text-sm font-semibold px-4 py-2 rounded-full transition-all ${
                page === "landing"
                  ? "text-teal-700 bg-teal-50"
                  : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
              }`}
            >
              Home
            </button>

            {user && user.role !== "admin" && (
              <button
                type="button"
                onClick={() => nav("user")}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                  page === "user"
                    ? "text-teal-700 bg-teal-50"
                    : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard size={15} /> Dashboard
              </button>
            )}

            {user?.role === "admin" && (
              <button
                type="button"
                onClick={() => nav("admin")}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                  page === "admin"
                    ? "text-teal-700 bg-teal-50"
                    : "text-slate-600 hover:text-teal-600 hover:bg-slate-50"
                }`}
              >
                <Shield size={15} /> Admin
              </button>
            )}

            <span className="w-px h-5 bg-slate-200 mx-1" />

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-700">Hi, {user.name?.split(" ")[0]}</span>
                <button
                  id="header-logout-btn"
                  type="button"
                  onClick={logout}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-full transition-all shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  id="header-login-btn"
                  type="button"
                  onClick={() => nav("login")}
                  className="text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors py-2"
                >
                  Sign In
                </button>
                <button
                  id="header-register-btn"
                  type="button"
                  onClick={() => nav("register")}
                  className="text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 transition-colors py-2 px-5 rounded-full shadow-md hover:shadow-teal-500/30"
                >
                  Register
                </button>
              </div>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-50 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg px-4 py-4 flex flex-col gap-2">
          <button type="button" onClick={() => nav("landing")} className="text-sm font-semibold text-slate-700 hover:text-teal-600 py-2 px-3 rounded-lg hover:bg-slate-50 text-left transition-colors">Home</button>
          {user && user.role !== "admin" && <button type="button" onClick={() => nav("user")} className="text-sm font-semibold text-slate-700 hover:text-teal-600 py-2 px-3 rounded-lg hover:bg-slate-50 text-left transition-colors flex items-center gap-2"><LayoutDashboard size={15} /> Dashboard</button>}
          {user?.role === "admin" && <button type="button" onClick={() => nav("admin")} className="text-sm font-semibold text-slate-700 hover:text-teal-600 py-2 px-3 rounded-lg hover:bg-slate-50 text-left transition-colors">Admin</button>}
          <div className="border-t border-slate-100 pt-3 mt-1">
            {user ? (
              <button type="button" onClick={logout} className="w-full text-sm font-bold text-rose-600 bg-rose-50 py-2.5 px-3 rounded-lg hover:bg-rose-100 transition-colors">Logout</button>
            ) : (
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => nav("login")} className="text-sm font-bold text-teal-600 py-2.5 px-3 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors">Sign In</button>
                <button type="button" onClick={() => nav("register")} className="text-sm font-bold text-white bg-teal-600 py-2.5 px-3 rounded-lg hover:bg-teal-500 transition-colors">Register</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
