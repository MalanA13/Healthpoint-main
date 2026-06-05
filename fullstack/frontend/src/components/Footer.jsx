import React from "react";
import { HeartPulse } from "lucide-react";
import { useAppContext } from "../App.jsx";

export default function Footer() {
  const { setPage } = useAppContext();
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <div className="footer-brand"><HeartPulse size={22} /><span>HealPoint</span></div>
            <p>Sistem layanan kesehatan terintegrasi berbasis AI untuk appointment cerdas, prediksi risiko no-show, dan manajemen fasilitas kesehatan.</p>
          </div>
          <div>
            <h4>Navigasi</h4>
            <ul className="footer-links">
              <li onClick={() => setPage("landing")}>Home</li>
              <li onClick={() => setPage("login")}>Login</li>
              <li onClick={() => setPage("register")}>Register</li>
            </ul>
          </div>
          <div>
            <h4>Fitur</h4>
            <ul className="footer-links">
              <li>Smart Scheduling</li>
              <li>AI Prediction</li>
              <li>Health Hub</li>
              <li>Medical Ledger</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 HealPoint — CC26-PSU389</span>
          <span>Coding Camp 2026 powered by DBS Foundation</span>
        </div>
      </div>
    </footer>
  );
}
