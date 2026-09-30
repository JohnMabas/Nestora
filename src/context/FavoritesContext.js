"use client";

/**
 * FavoritesContext — persists saved property and hotel IDs in localStorage.
 * Provides a context so PropertyCard, HotelCard, and FavoritesContent all
 * share the same state without prop drilling.
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "elgaa_favorites";

const FavoritesContext = createContext({
  savedProperties: /** @type {string[]} */ ([]),
  savedHotels:     /** @type {string[]} */ ([]),
  toggleProperty:  /** @param {string} id */ (_id) => {},
  toggleHotel:     /** @param {string} id */ (_id) => {},
  isPropertySaved: /** @param {string} id */ (_id) => false,
  isHotelSaved:    /** @param {string} id */ (_id) => false,
  clearAll:        () => {},
});

export function FavoritesProvider({ children }) {
  const [savedProperties, setSavedProperties] = useState(/** @type {string[]} */ ([]));
  const [savedHotels,     setSavedHotels]     = useState(/** @type {string[]} */ ([]));
  const [hydrated,        setHydrated]        = useState(false);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.properties)) setSavedProperties(parsed.properties);
        if (Array.isArray(parsed.hotels))     setSavedHotels(parsed.hotels);
      }
    } catch (_) {}
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever state changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ properties: savedProperties, hotels: savedHotels }),
      );
    } catch (_) {}
  }, [savedProperties, savedHotels, hydrated]);

  const toggleProperty = useCallback((id) => {
    setSavedProperties((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }, []);

  const toggleHotel = useCallback((id) => {
    setSavedHotels((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
    );
  }, []);

  const isPropertySaved = useCallback(
    (id) => savedProperties.includes(id),
    [savedProperties],
  );

  const isHotelSaved = useCallback(
    (id) => savedHotels.includes(id),
    [savedHotels],
  );

  const clearAll = useCallback(() => {
    setSavedProperties([]);
    setSavedHotels([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ savedProperties, savedHotels, toggleProperty, toggleHotel, isPropertySaved, isHotelSaved, clearAll }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Hook to access favorites context.
 * Must be used inside a FavoritesProvider.
 */
export function useFavorites() {
  return useContext(FavoritesContext);
}
