/**
 * Single source of truth for "which deployment environment is this UI talking
 * to".
 *
 * The backend publishes the `APP_STATE` env var through `GET /app_env` (see
 * DigiMalBackend/routes/api.php). Non-production builds are supposed to say so
 * loudly, so every APP_STATE value is mapped here exactly once to:
 *
 *   - `label`      – human readable name shown as an env badge on the auth
 *                    pages (empty = nothing shown)
 *   - `watermark`  – the word stamped across every page by the global
 *                    EnvironmentWatermark component (empty = not watermarked)
 *   - `badgeClass` – CSS class used for the auth page badge, so each
 *                    environment keeps its own colour
 *   - `tone`       – colour key handed to EnvironmentWatermark
 *   - `maintenance` – when true the auth pages redirect to /maintenance
 *
 * Consumed by src/App.vue (watermark) and the auth screens
 * (view/authentication/SignIn.vue, view/authentication/UserTypeSelection.vue).
 */

import axios from "axios";

/** Backend endpoint that reports the raw APP_STATE value. */
export const APP_ENV_ENDPOINT = "/app_env";

/**
 * Known APP_STATE values. `aliases` lists the accepted spellings of a state
 * (matched case-insensitively); the first entry whose alias list contains the
 * reported value wins.
 */
const APP_ENVIRONMENTS = [
  {
    state: "production",
    aliases: ["production", "prod", "live"],
    label: "",
    watermark: "",
    badgeClass: "",
    tone: "production",
    maintenance: false,
  },
  {
    state: "staging",
    aliases: ["staging", "stage"],
    label: "Staging Environment",
    watermark: "STAGING",
    badgeClass: "staging-badge",
    tone: "staging",
    maintenance: false,
  },
  {
    state: "development",
    aliases: ["development", "develop", "dev", "local"],
    label: "Development Environment",
    watermark: "DEVELOPMENT",
    badgeClass: "development-badge",
    tone: "development",
    maintenance: false,
  },
  {
    state: "training",
    aliases: ["training", "train"],
    label: "Training Platform",
    watermark: "TRAINING",
    badgeClass: "training-badge",
    tone: "training",
    maintenance: false,
  },
  {
    state: "pilot",
    // Pilot is a customer facing environment: it is badged on the auth pages
    // but never watermarked.
    aliases: ["pilot"],
    label: "Pilot Environment",
    watermark: "",
    badgeClass: "pilot-badge",
    tone: "pilot",
    maintenance: false,
  },
  {
    state: "maintenance",
    aliases: ["maintenance"],
    label: "",
    watermark: "",
    badgeClass: "",
    tone: "maintenance",
    maintenance: true,
  },
];

/**
 * Used for unknown or missing APP_STATE values: behave exactly like
 * production — no watermark, no badge, no maintenance redirect.
 */
const DEFAULT_ENVIRONMENT = {
  state: "production",
  label: "",
  watermark: "",
  badgeClass: "",
  tone: "production",
  maintenance: false,
};

/** Lower-trims the raw value reported by the backend. */
export function normalizeAppState(raw) {
  return String(raw ?? "").trim().toLowerCase();
}

/**
 * Resolves a raw APP_STATE value into the environment descriptor described at
 * the top of this module.
 */
export function resolveAppEnvironment(raw) {
  const state = normalizeAppState(raw);
  const match = APP_ENVIRONMENTS.find((env) => env.aliases.includes(state));
  return {
    ...DEFAULT_ENVIRONMENT,
    ...(match ?? {}),
    state: match ? match.state : state,
  };
}

/**
 * Raw APP_STATE as reported by the backend. Rejects on network/HTTP errors so
 * callers can decide whether that is fatal (it never is for the watermark).
 */
export async function fetchAppState() {
  const { data } = await axios.get(
    `${process.env.VUE_APP_BASE_URL}${APP_ENV_ENDPOINT}`
  );
  return normalizeAppState(data);
}

/** Convenience wrapper: fetch the raw APP_STATE and resolve it. */
export async function fetchAppEnvironment() {
  return resolveAppEnvironment(await fetchAppState());
}
