"use client";

/**
 * AuthContext — lightweight client-side authentication state.
 *
 * Uses localStorage to persist a mock session so the UI stays
 * consistent across page refreshes. Replace the mock login/register
 * functions with real API calls when a backend is available.
 */

import { createContext, useContext, useState, useCallback } from "react";

/** @typedef {{ id: string, name: string, email: string }} User */

/**
 * @typedef {Object} AuthContextValue
 * @property {User|null} user
 * @property {boolean} loading
 * @property {(email: string, password: string) => Promise<{ok: boolean, error?: string}>} login
 * @property {(name: string, email: string, password: string) => Promise<{ok: boolean, error?: string}>} register
 * @property {() => void} logout
 */

const AuthContext = createContext(/** @type {AuthContextValue} */ (null));

const STORAGE_KEY = "elgaa_auth_user";

/**
 * Lazy initializer — reads from localStorage once synchronously at mount time.
 * Avoids calling setState inside a useEffect (React Compiler lint rule).
 */
function initUserSession() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Lazy initializer runs once on mount; no effect needed for hydration.
  const [user, setUser] = useState(initUserSession);
  // loading is false from the start because we read storage synchronously.
  const [loading]       = useState(false);

  /**
   * Mock login — replace with a real API call.
   * For demo purposes any email + password of 6+ chars succeeds.
   */
  const login = useCallback(async (email, password) => {
    if (!email || !password) {
      return { ok: false, error: "Email and password are required." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const newUser = {
      id:    `user-${Date.now()}`,
      name:  email.split("@")[0].replace(/[._]/g, " "),
      email,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return { ok: true };
  }, []);

  /**
   * Mock register — replace with a real API call.
   */
  const register = useCallback(async (name, email, password) => {
    if (!name || !email || !password) {
      return { ok: false, error: "All fields are required." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: "Please enter a valid email address." };
    }

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const newUser = {
      id:    `user-${Date.now()}`,
      name:  name.trim(),
      email: email.trim().toLowerCase(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context. Must be used inside <AuthProvider>.
 * @returns {AuthContextValue}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
