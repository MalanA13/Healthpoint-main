import { createContext, useContext, useMemo, useState } from "react";
import { api, setAuthToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("healpoint_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ id: Date.now(), message, type });
  }

  function clearToast() {
    setToast(null);
  }

  async function login(payload) {
    const result = await api.login(payload);
    setAuthToken(result.token);
    localStorage.setItem("healpoint_user", JSON.stringify(result.user));
    setUser(result.user);
    showToast(`Selamat datang, ${result.user.name}`, "success");
    return result.user;
  }

  async function register(payload) {
    await api.register(payload);
    showToast("Akun berhasil dibuat", "success");
    return login({ email: payload.email, password: payload.password });
  }

  function logout() {
    setAuthToken("");
    localStorage.removeItem("healpoint_user");
    setUser(null);
    showToast("Anda sudah logout", "info");
  }

  const value = useMemo(
    () => ({ user, login, register, logout, toast, showToast, clearToast }),
    [user, toast],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
