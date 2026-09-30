/**
 * @fileoverview  Data access layer.
 *
 * All UI components should import data ONLY through this module, never
 * directly from properties.js / hotels.js.  When you connect a real API,
 * replace the implementations here without touching any component.
 */

import { properties }  from "./properties.js";
import { hotels }       from "./hotels.js";
import { agents, agentReviews } from "./agents.js";

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return all properties, optionally filtered.
 * @param {{ location?: string, type?: string, listingType?: string, minPrice?: number, maxPrice?: number, minBeds?: number }} [filters]
 * @returns {import('../types/index.js').Property[]}
 */
export function getProperties(filters = {}) {
  let result = [...properties];

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    result = result.filter(
      (p) =>
        p.location.city.toLowerCase().includes(loc) ||
        p.location.state.toLowerCase().includes(loc) ||
        p.location.country.toLowerCase().includes(loc) ||
        p.location.address.toLowerCase().includes(loc),
    );
  }

  if (filters.type && filters.type !== "all") {
    result = result.filter((p) => p.propertyType === filters.type);
  }

  if (filters.listingType && filters.listingType !== "all") {
    result = result.filter((p) => p.listingType === filters.listingType);
  }

  if (filters.minPrice != null) {
    result = result.filter((p) => p.price >= filters.minPrice);
  }

  if (filters.maxPrice != null) {
    result = result.filter((p) => p.price <= filters.maxPrice);
  }

  if (filters.minBeds != null) {
    result = result.filter((p) => p.bedrooms >= filters.minBeds);
  }

  return result;
}

/**
 * Return a single property by ID.
 * @param {string} id
 * @returns {import('../types/index.js').Property | undefined}
 */
export function getPropertyById(id) {
  return properties.find((p) => p.id === id || p.slug === id);
}

/**
 * Return featured properties.
 * @param {number} [limit=6]
 * @returns {import('../types/index.js').Property[]}
 */
export function getFeaturedProperties(limit = 6) {
  return properties.filter((p) => p.featured).slice(0, limit);
}

/**
 * Return recently added properties.
 * @param {number} [limit=4]
 * @returns {import('../types/index.js').Property[]}
 */
export function getRecentProperties(limit = 4) {
  return [...properties]
    .filter((p) => p.recent)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

/**
 * Return properties that share the same agent, excluding the given property.
 * Falls back to featured if not enough results.
 * @param {string} propertyId
 * @param {number} [limit=3]
 * @returns {import('../types/index.js').Property[]}
 */
export function getSimilarProperties(propertyId, limit = 3) {
  const current = getPropertyById(propertyId);
  if (!current) return [];

  return properties
    .filter(
      (p) =>
        p.id !== current.id &&
        (p.propertyType === current.propertyType || p.listingType === current.listingType),
    )
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// HOTELS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return all hotels, optionally filtered.
 * @param {{ destination?: string, minRating?: number, maxPrice?: number }} [filters]
 * @returns {import('../types/index.js').Hotel[]}
 */
export function getHotels(filters = {}) {
  let result = [...hotels];

  if (filters.destination) {
    const dest = filters.destination.toLowerCase();
    result = result.filter(
      (h) =>
        h.location.city.toLowerCase().includes(dest) ||
        h.location.state.toLowerCase().includes(dest) ||
        h.location.country.toLowerCase().includes(dest),
    );
  }

  if (filters.minRating != null) {
    result = result.filter((h) => h.starRating >= filters.minRating);
  }

  if (filters.maxPrice != null) {
    result = result.filter((h) => h.priceFrom <= filters.maxPrice);
  }

  return result;
}

/**
 * Return a single hotel by ID or slug.
 * @param {string} id
 * @returns {import('../types/index.js').Hotel | undefined}
 */
export function getHotelById(id) {
  return hotels.find((h) => h.id === id || h.slug === id);
}

/**
 * Return featured hotels.
 * @param {number} [limit=3]
 * @returns {import('../types/index.js').Hotel[]}
 */
export function getFeaturedHotels(limit = 3) {
  return hotels.filter((h) => h.featured).slice(0, limit);
}

/**
 * Return rooms for a given hotel.
 * @param {string} hotelId
 * @returns {import('../types/index.js').Room[]}
 */
export function getRooms(hotelId) {
  const hotel = getHotelById(hotelId);
  return hotel ? hotel.rooms : [];
}

/**
 * Return a single room.
 * @param {string} hotelId
 * @param {string} roomId
 * @returns {import('../types/index.js').Room | undefined}
 */
export function getRoomById(hotelId, roomId) {
  return getRooms(hotelId).find((r) => r.id === roomId);
}

/**
 * Return similar hotels (same city, excluding the given hotel).
 * @param {string} hotelId
 * @param {number} [limit=3]
 * @returns {import('../types/index.js').Hotel[]}
 */
export function getSimilarHotels(hotelId, limit = 3) {
  const current = getHotelById(hotelId);
  if (!current) return [];

  return hotels
    .filter(
      (h) =>
        h.id !== current.id &&
        (h.location.city === current.location.city ||
          h.starRating === current.starRating),
    )
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return all agents.
 * @returns {import('../types/index.js').AgentFull[]}
 */
export function getAgents() {
  return [...agents];
}

/**
 * Return a single agent by ID or slug.
 * @param {string} id
 * @returns {import('../types/index.js').AgentFull | undefined}
 */
export function getAgentById(id) {
  return agents.find((a) => a.id === id || a.slug === id);
}

/**
 * Return all reviews for an agent.
 * @param {string} agentId
 * @returns {import('../types/index.js').AgentReview[]}
 */
export function getAgentReviews(agentId) {
  return agentReviews.filter((r) => r.agentId === agentId);
}

/**
 * Return all properties listed by an agent.
 * @param {string} agentId
 * @returns {import('../types/index.js').Property[]}
 */
export function getPropertiesByAgent(agentId) {
  return properties.filter((p) => p.agent.id === agentId);
}
