import React, { useEffect, useState, useCallback, createContext, useContext } from "react";
import { api, setAuthToken } from "./api";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export const AppContext = createContext(null);

export function useAppContext() {
  return useContext(AppContext);
}

function normalizeStoredUser(user) {
  const localNames = {
    "demo@healpoint.local": "Siti Aminah",
    "userbaru@healpoint.local": "Rizky Maulana",
  };
  const localName = localNames[user?.email];
  return localName ? { ...user, name: localName } : user;
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("healpoint_user");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    const normalized = normalizeStoredUser(parsed);
    if (normalized?.name !== parsed?.name) {
      localStorage.setItem("healpoint_user", JSON.stringify(normalized));
    }
    return normalized;
  });
  const [doctors, setDoctors] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [insights, setInsights] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const loadPublicData = useCallback(async () => {
    try {
      const [d, f] = await Promise.all([api.doctors(), api.facilities()]);
      setDoctors(d);
      setFacilities(f);
    } catch {
      /* public endpoints may fail silently */
    }
  }, []);

  const loadProtectedData = useCallback(async (activeUser) => {
    if (!activeUser) return;
    try {
      if (activeUser.role === "admin") {
        const [a, i] = await Promise.all([api.appointments(), api.insights()]);
        setAppointments(a);
        setInsights(i);
      } else {
        const [a, r] = await Promise.all([
          api.appointments(),
          api.medicalRecords(activeUser.id),
        ]);
        setAppointments(a);
        setRecords(r);
      }
    } catch {
      /* protected calls may fail */
    }
  }, []);

  const reload = useCallback(
    async (activeUser = user) => {
      setLoading(true);
      await loadPublicData();
      await loadProtectedData(activeUser);
      setLoading(false);
    },
    [user, loadPublicData, loadProtectedData],
  );

  useEffect(() => {
    reload();
  }, []);

  async function onAuth(result) {
    setAuthToken(result.token);
    localStorage.setItem("healpoint_user", JSON.stringify(result.user));
    setUser(result.user);
    showToast(`Selamat datang, ${result.user.name}!`, "success");
    await reload(result.user);
    setPage(result.user.role === "admin" ? "admin" : "user");
  }

  function logout() {
    setAuthToken("");
    localStorage.removeItem("healpoint_user");
    setUser(null);
    setAppointments([]);
    setRecords([]);
    setInsights(null);
    setRisk(null);
    setPage("landing");
    showToast("Berhasil logout.", "info");
  }

  const ctx = {
    page, setPage, user, setUser, doctors, facilities,
    appointments, setAppointments, records, setRecords,
    insights, risk, setRisk, loading, reload, onAuth,
    logout, showToast,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div className="app-wrapper">
        <Header />
        <div className="app-content">
          {page === "landing" && <LandingPage />}
          {page === "login" && <LoginPage />}
          {page === "register" && <RegisterPage />}
          {page === "user" && <UserDashboard />}
          {page === "admin" && <AdminDashboard />}
        </div>
        <Footer />
        {toast && (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </AppContext.Provider>
  );
}
