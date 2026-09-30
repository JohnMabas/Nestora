"use client";

/**
 * AgentAuthContext — lightweight client-side authentication state for agents.
 *
 * Mirrors the shape of AuthContext.js for buyers so both can be swapped for
 * a real auth provider (NextAuth, Clerk, custom JWT) without touching page code.
 *
 * Stored in localStorage under a separate key so buyer and agent sessions
 * are fully independent.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { agents } from "@/lib/data/agents";

/**
 * @typedef {Object} AgentSession
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} avatar
 * @property {string} agencyName
 * @property {string} licenseNumber
 * @property {string} title
 * @property {string} bio
 * @property {number} yearsExperience
 * @property {string[]} languages
 * @property {string[]} specializations
 * @property {string[]} areasServed
 * @property {Object} socialLinks
 * @property {boolean} verified
 */

/**
 * @typedef {Object} AgentAuthContextValue
 * @property {AgentSession|null} agent      — currently authenticated agent
 * @property {boolean} loading
 * @property {(email: string, password: string, remember?: boolean) => Promise<{ok: boolean, error?: string}>} login
 * @property {(data: Object) => Promise<{ok: boolean, error?: string}>} register
 * @property {() => void} logout
 * @property {(updates: Partial<AgentSession>) => void} updateAgent — update in-memory session
 */

const AgentAuthContext = createContext(/** @type {AgentAuthContextValue} */ (null));

const SESSION_KEY = "elgaa_agent_session";

/**
 * Lazy initializer — reads from storage once, synchronously, at mount time.
 * Avoids calling setState inside a useEffect (React Compiler lint rule).
 */
function initAgentSession() {
  if (typeof window === "undefined") return null;
  try {
    const stored =
      localStorage.getItem(SESSION_KEY) ||
      sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AgentAuthProvider({ children }) {
  // Lazy initializer runs once on mount; no effect needed for hydration.
  const [agent, setAgent]     = useState(initAgentSession);
  // loading is false from the start because we read storage synchronously.
  const [loading]             = useState(false);

  /**
   * Mock login.
   * Checks against the mock agent list; any registered email + 6+ char password works.
   * Pass remember=true to persist in localStorage, false for sessionStorage.
   *
   * TODO: replace with POST /api/agent/login and set an HTTP-only cookie / JWT.
   */
  const login = useCallback(async (email, password, remember = true) => {
    if (!email || !password) {
      return { ok: false, error: "Email and password are required." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 700));

    // Check mock agents first, then check registered agents from localStorage
    const mockAgent = agents.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );

    // Also check for agents registered via the register flow
    let registeredAgents = [];
    try {
      const raw = localStorage.getItem("elgaa_registered_agents");
      if (raw) registeredAgents = JSON.parse(raw);
    } catch { /* ignore */ }

    const registeredAgent = registeredAgents.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );

    const found = mockAgent || registeredAgent;

    if (!found) {
      return { ok: false, error: "No agent account found with that email address." };
    }

    const session = {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone || "",
      avatar: found.avatar || "",
      agencyName: found.agencyName || "",
      licenseNumber: found.licenseNumber || "",
      title: found.title || "Real Estate Agent",
      bio: found.bio || "",
      yearsExperience: found.yearsExperience || 0,
      languages: found.languages || ["English"],
      specializations: found.specializations || [],
      areasServed: found.areasServed || [],
      socialLinks: found.socialLinks || {},
      verified: found.verified || false,
    };

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    setAgent(session);
    return { ok: true };
  }, []);

  /**
   * Mock register.
   * Saves a new agent to localStorage so the login flow can find them.
   *
   * TODO: replace with POST /api/agent/register.
   */
  const register = useCallback(async (data) => {
    const { name, email, password, confirmPassword, phone, agencyName, licenseNumber } = data;

    if (!name || !email || !password || !phone || !agencyName || !licenseNumber) {
      return { ok: false, error: "All fields are required." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: "Please enter a valid email address." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    if (password !== confirmPassword) {
      return { ok: false, error: "Passwords do not match." };
    }

    // Check for duplicate email
    const existing = agents.find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return { ok: false, error: "An account with this email already exists." };
    }

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));

    const newAgent = {
      id: `agent-reg-${Date.now()}`,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      avatar: "",
      agencyName: agencyName.trim(),
      licenseNumber: licenseNumber.trim(),
      title: "Real Estate Agent",
      bio: "",
      yearsExperience: 0,
      languages: ["English"],
      specializations: [],
      areasServed: [],
      socialLinks: {},
      verified: false,
      rating: 0,
      reviewCount: 0,
      responseTime: "Usually responds within a few hours",
      activeListings: 0,
      propertiesSold: 0,
      createdAt: new Date().toISOString(),
    };

    // Persist registered agents separately so login can find them
    try {
      const raw = localStorage.getItem("elgaa_registered_agents");
      const list = raw ? JSON.parse(raw) : [];
      list.push(newAgent);
      localStorage.setItem("elgaa_registered_agents", JSON.stringify(list));
    } catch { /* ignore */ }

    const session = {
      id: newAgent.id,
      name: newAgent.name,
      email: newAgent.email,
      phone: newAgent.phone,
      avatar: newAgent.avatar,
      agencyName: newAgent.agencyName,
      licenseNumber: newAgent.licenseNumber,
      title: newAgent.title,
      bio: newAgent.bio,
      yearsExperience: newAgent.yearsExperience,
      languages: newAgent.languages,
      specializations: newAgent.specializations,
      areasServed: newAgent.areasServed,
      socialLinks: newAgent.socialLinks,
      verified: newAgent.verified,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setAgent(session);
    return { ok: true };
  }, []);

  /** Update the in-memory (and stored) session. Useful for profile edits. */
  const updateAgent = useCallback((updates) => {
    setAgent((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      // Persist wherever it was stored
      if (localStorage.getItem(SESSION_KEY)) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setAgent(null);
  }, []);

  return (
    <AgentAuthContext.Provider value={{ agent, loading, login, register, logout, updateAgent }}>
      {children}
    </AgentAuthContext.Provider>
  );
}

/**
 * Hook to access agent auth context. Must be used inside <AgentAuthProvider>.
 * @returns {AgentAuthContextValue}
 */
export function useAgentAuth() {
  const ctx = useContext(AgentAuthContext);
  if (!ctx) throw new Error("useAgentAuth must be used inside <AgentAuthProvider>");
  return ctx;
}
