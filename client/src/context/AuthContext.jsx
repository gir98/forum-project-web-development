import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return setLoading(false);
    api.get("/auth/me").then(r => setUser(r.data)).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const r = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", r.data.token);
    setUser(r.data.user);
  };
  const register = async (username, email, password) => {
    await api.post("/auth/register", { username, email, password });
    await login(email, password);
  };
  const logout = () => { localStorage.removeItem("token"); setUser(null); };

  return <AuthCtx.Provider value={{ user, loading, login, register, logout }}>{children}</AuthCtx.Provider>;
}
