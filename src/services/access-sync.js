/**
 * Global access-state synchronisation.
 *
 * The backend enforces permissions on every request, but the UI caches the
 * user's profile (role + permissions) in sessionStorage at login. This module
 * keeps that snapshot fresh so permission grants / revocations made via the
 * Access Control page take effect WITHOUT a re-login:
 *
 *   • on window focus / tab visibility change (user returns to the app)
 *   • on a lightweight interval poll (catches changes made in another tab)
 *   • on demand via syncNow() / maybeSyncOnNavigation() (route changes)
 *
 * All triggers share one request de-duplication + throttle in refreshUserData,
 * so the polling never stacks requests and never fires more often than
 * MIN_INTERVAL_MS. Import once from main.js — module semantics make it a
 * singleton.
 */
import { refreshUserData } from "./user-role";

const POLL_INTERVAL_MS = 30_000; // light poll while the tab is open
const MIN_INTERVAL_MS = 5_000; // hard floor between refresh HTTP calls
const NAV_STALE_MS = 15_000; // route guard re-syncs at most this often

let lastSyncedAt = 0;
let started = false;

function isWindowVisible() {
  // `visibilityState` is the Page-Lifecycle API ("visible" | "hidden");
  // fall back to the older `document.hidden` boolean where unsupported.
  if (document.visibilityState !== undefined) {
    return document.visibilityState === "visible";
  }
  return !document.hidden;
}

/**
 * Re-sync access state from the backend, throttled and de-duplicated.
 * Fire-and-forget by design — callers must never block on it.
 */
export async function syncNow({ force = false } = {}) {
  const now = Date.now();
  if (!force && now - lastSyncedAt < MIN_INTERVAL_MS) return;
  if (!sessionStorage.getItem("user")) return;
  lastSyncedAt = now;
  await refreshUserData();
}

function handleWindowVisible() {
  if (isWindowVisible()) syncNow();
}

/** Start the global listeners. Safe to call multiple times (idempotent). */
export function startAccessSync() {
  if (started) return;
  started = true;

  window.addEventListener("focus", handleWindowVisible);
  document.addEventListener("visibilitychange", handleWindowVisible);
  window.addEventListener("pageshow", handleWindowVisible);

  window.setInterval(() => {
    if (isWindowVisible()) syncNow();
  }, POLL_INTERVAL_MS);
}

/**
 * Throttled re-sync hook for the router guard (protectedRoute.js).
 * Keeps the sidebar / page gates fresh on navigation without adding latency.
 */
export function maybeSyncOnNavigation() {
  if (Date.now() - lastSyncedAt >= NAV_STALE_MS) syncNow();
}