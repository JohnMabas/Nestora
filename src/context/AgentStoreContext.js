"use client";

/**
 * @fileoverview  Agent mock store — client-side state for leads, appointments,
 * and agent-scoped listings mutations.
 *
 * All writes here are local-only. This is the ONLY place to change when wiring
 * up a real API backend. Replace each function body with the appropriate
 * fetch/axios call and keep the same return shapes.
 *
 * Stored in localStorage under "elgaa_agent_store_<agentId>".
 */

import { createContext, useContext, useState, useEffect, useCallback, startTransition } from "react";
import { useAgentAuth } from "@/context/AgentAuthContext";
import { properties as seedProperties } from "@/lib/data/properties";

const STORE_KEY = (id) => `elgaa_agent_store_${id}`;

const defaultStore = (agentId) => ({
  leads: [
    {
      id: "lead-demo-001",
      agentId,
      propertyId: "prop-001",
      hotelId: null,
      name: "James Adeyemi",
      email: "james.adeyemi@example.com",
      phone: "+234 810 000 1111",
      message: "I am very interested in the Hill View Villa. Can we schedule a viewing this week?",
      status: "new",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "lead-demo-002",
      agentId,
      propertyId: "prop-003",
      hotelId: null,
      name: "Fatima Garba",
      email: "fatima.g@example.com",
      phone: "+234 815 222 3333",
      message: "Is the Jos GRA apartment still available? I would like more details on the lease terms.",
      status: "contacted",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
  ],
  appointments: [
    {
      id: "appt-demo-001",
      agentId,
      propertyId: "prop-001",
      buyerName: "James Adeyemi",
      buyerContact: "james.adeyemi@example.com",
      dateTime: new Date(Date.now() + 2 * 86400000).toISOString(),
      status: "confirmed",
    },
  ],
  // Agent-specific listing additions/edits (does not modify the shared mock data)
  listingMutations: {},
});

const AgentStoreContext = createContext(null);

export function AgentStoreProvider({ children }) {
  const { agent } = useAgentAuth();
  const [store, setStore] = useState(null);

  useEffect(() => {
    // Use startTransition to avoid calling setState synchronously inside
    // the effect body — satisfies the React Compiler lint rule.
    startTransition(() => {
      if (!agent) {
        setStore(null);
        return;
      }
      try {
        const raw = localStorage.getItem(STORE_KEY(agent.id));
        setStore(raw ? JSON.parse(raw) : defaultStore(agent.id));
      } catch {
        setStore(defaultStore(agent.id));
      }
    });
  }, [agent]);

  const persist = useCallback((next) => {
    if (!agent) return;
    setStore(next);
    try { localStorage.setItem(STORE_KEY(agent.id), JSON.stringify(next)); } catch { /* ignore */ }
  }, [agent]);

  // ── LEADS ──────────────────────────────────────────────────────────────────

  /** TODO: replace body with POST /api/leads */
  const addLead = useCallback((lead) => {
    setStore((prev) => {
      if (!prev) return prev;
      const next = { ...prev, leads: [{ id: `lead-${Date.now()}`, createdAt: new Date().toISOString(), status: "new", ...lead }, ...prev.leads] };
      persist(next);
      return next;
    });
  }, [persist]);

  /** TODO: replace body with PATCH /api/leads/:id */
  const updateLead = useCallback((id, updates) => {
    setStore((prev) => {
      if (!prev) return prev;
      const next = { ...prev, leads: prev.leads.map((l) => l.id === id ? { ...l, ...updates } : l) };
      persist(next);
      return next;
    });
  }, [persist]);

  // ── APPOINTMENTS ───────────────────────────────────────────────────────────

  /** TODO: replace body with POST /api/appointments */
  const addAppointment = useCallback((appt) => {
    setStore((prev) => {
      if (!prev) return prev;
      const next = { ...prev, appointments: [{ id: `appt-${Date.now()}`, status: "pending", ...appt }, ...prev.appointments] };
      persist(next);
      return next;
    });
  }, [persist]);

  /** TODO: replace body with PATCH /api/appointments/:id */
  const updateAppointment = useCallback((id, updates) => {
    setStore((prev) => {
      if (!prev) return prev;
      const next = { ...prev, appointments: prev.appointments.map((a) => a.id === id ? { ...a, ...updates } : a) };
      persist(next);
      return next;
    });
  }, [persist]);

  // ── LISTINGS ───────────────────────────────────────────────────────────────

  /**
   * Returns the agent's listings: seed data filtered by agentId + any
   * new listings created in the session.
   */
  const getAgentListings = useCallback(() => {
    if (!agent || !store) return [];
    const seed = seedProperties.filter((p) => p.agent.id === agent.id);
    const added = Object.values(store.listingMutations || {}).filter((m) => m._action === "add");
    // Merge edits into seed listings
    return [
      ...seed.map((p) => {
        const mutation = store.listingMutations?.[p.id];
        return mutation ? { ...p, ...mutation } : p;
      }),
      ...added,
    ];
  }, [agent, store]);

  /** TODO: replace body with POST /api/properties */
  const addListing = useCallback((listing) => {
    setStore((prev) => {
      if (!prev) return prev;
      const id = `prop-new-${Date.now()}`;
      const newListing = {
        _action: "add",
        id,
        slug: listing.title?.toLowerCase().replace(/\s+/g, "-") ?? id,
        createdAt: new Date().toISOString(),
        featured: false,
        recent: true,
        agent: { id: agent?.id, name: agent?.name, photo: agent?.avatar, phone: agent?.phone, email: agent?.email },
        images: [],
        amenities: [],
        features: [],
        status: listing.status || "active",
        ...listing,
      };
      const next = { ...prev, listingMutations: { ...prev.listingMutations, [id]: newListing } };
      persist(next);
      return next;
    });
  }, [agent, persist]);

  /** TODO: replace body with PATCH /api/properties/:id */
  const updateListing = useCallback((id, updates) => {
    setStore((prev) => {
      if (!prev) return prev;
      const existing = prev.listingMutations?.[id] || {};
      const next = { ...prev, listingMutations: { ...prev.listingMutations, [id]: { ...existing, ...updates } } };
      persist(next);
      return next;
    });
  }, [persist]);

  /** TODO: replace body with DELETE /api/properties/:id */
  const deleteListing = useCallback((id) => {
    setStore((prev) => {
      if (!prev) return prev;
      const existing = prev.listingMutations?.[id] || {};
      const next = { ...prev, listingMutations: { ...prev.listingMutations, [id]: { ...existing, _action: "delete" } } };
      persist(next);
      return next;
    });
  }, [persist]);

  return (
    <AgentStoreContext.Provider value={{
      store,
      leads: store?.leads ?? [],
      appointments: store?.appointments ?? [],
      addLead,
      updateLead,
      addAppointment,
      updateAppointment,
      getAgentListings,
      addListing,
      updateListing,
      deleteListing,
    }}>
      {children}
    </AgentStoreContext.Provider>
  );
}

export function useAgentStore() {
  const ctx = useContext(AgentStoreContext);
  if (!ctx) throw new Error("useAgentStore must be used inside <AgentStoreProvider>");
  return ctx;
}
