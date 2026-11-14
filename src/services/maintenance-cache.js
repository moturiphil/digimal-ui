/**
 * Client-side cache purge for maintenance mode.
 *
 * The SPA persists identity + RBAC in sessionStorage, a handful of data
 * caches in localStorage, and a `logedIn` cookie. When APP_STATE resolves to
 * maintenance we clear all of them before rendering the maintenance screen so
 * no cached user, page state or API data can be shown — and when the platform
 * returns, the user starts from a clean, unauthenticated session.
 *
 * Cache Storage and service-worker registrations are cleared defensively so a
 * future PWA/service worker can never serve a stale app shell. The browser's
 * HTTP cache itself is not script-controllable; serve `index.html` with
 * `Cache-Control: no-cache` (or equivalent) at the web server for a guaranteed
 * fresh app shell.
 *
 * Every operation is deliberately best-effort: private browsing / disabled
 * storage / blocked cache APIs must never prevent the maintenance page from
 * rendering.
 */
import Cookies from "js-cookie";

/**
 * localStorage is not path-scoped, so only remove the keys this app owns
 * instead of calling `localStorage.clear()` (which could wipe unrelated
 * apps/tools hosted on the same origin).
 */
const CACHED_LOCAL_STORAGE_KEYS = [
  "user", // legacy copy of the signed-in user (GIS pages)
  "currentUser", // legacy notification-routing cache
  "access_token", // legacy bearer token
  "accessToken", // GIS page token
  "eventStatus", // cached event start/stop map
];

/** Cookies written by the UI that should not survive maintenance. */
const APP_COOKIES = ["logedIn"];

async function clearCacheStorage() {
  if (typeof window === "undefined" || !("caches" in window)) {
    return;
  }
  try {
    const keys = await window.caches.keys();
    await Promise.all(keys.map((key) => window.caches.delete(key)));
  } catch (error) {
    // Cache API unavailable or blocked — nothing else we can do.
  }
}

async function unregisterServiceWorkers() {
  if (typeof navigator === "undefined" || !navigator.serviceWorker) {
    return;
  }
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister())
    );
  } catch (error) {
    // Service worker API unavailable or blocked.
  }
}

/**
 * Purge every client-side cache the SPA can own. Safe to call repeatedly
 * (e.g. if two APP_STATE probes overlap) and in environments where storage
 * access throws.
 */
export async function clearClientCaches() {
  if (typeof window === "undefined") {
    return;
  }

  // Session storage is entirely app-owned transient state: bearer token,
  // user/RBAC snapshot, redirect target and multi-step flow flags.
  try {
    window.sessionStorage.clear();
  } catch (error) {
    // Storage unavailable (private mode / disabled) — continue.
  }

  try {
    CACHED_LOCAL_STORAGE_KEYS.forEach((key) =>
      window.localStorage.removeItem(key)
    );
  } catch (error) {
    // Storage unavailable — continue.
  }

  try {
    APP_COOKIES.forEach((name) => Cookies.remove(name));
  } catch (error) {
    // Cookie API unavailable — continue.
  }

  await Promise.all([clearCacheStorage(), unregisterServiceWorkers()]);
}
