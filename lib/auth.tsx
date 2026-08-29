"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { store, type Role } from "@/lib/store";

export interface SessionUser {
  role: Role;
  id: string; // "admin" for admin, doctorId/labId otherwise
  name: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (role: Role, username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);
const SESSION_KEY = "motamayez-lab-session-v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = React.useCallback((role: Role, username: string, password: string) => {
    const db = store.getAll();
    if (role === "admin") {
      if (db.admin.username === username && db.admin.password === password) {
        const u: SessionUser = { role: "admin", id: "admin", name: db.admin.name };
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(u));
        setUser(u);
        return { ok: true };
      }
      return { ok: false, error: "بيانات دخول الأدمن غير صحيحة" };
    }
    if (role === "doctor") {
      const found = db.doctors.find((d) => d.username === username && d.password === password);
      if (found) {
        const u: SessionUser = { role: "doctor", id: found.id, name: found.name };
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(u));
        setUser(u);
        return { ok: true };
      }
      return { ok: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" };
    }
    const found = db.labs.find((l) => l.username === username && l.password === password);
    if (found) {
      const u: SessionUser = { role: "lab", id: found.id, name: found.name };
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(u));
      setUser(u);
      return { ok: true };
    }
    return { ok: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" };
  }, []);

  const logout = React.useCallback(() => {
    window.localStorage.removeItem(SESSION_KEY);
    setUser(null);
    router.push("/");
  }, [router]);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
