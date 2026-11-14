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
 * Fail fast: the boot gate in App.vue waits for this probe, so a hanging
 * backend must not hold the whole UI hostage. On timeout the gate falls back
 * to the last known state (production on a cold boot).
 */
const APP_ENV_TIMEOUT_MS = 8000;

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
    // The value actually published by APP_STATE is spelled `maintanance` in
    // existing deployments. Accept the correct spelling and the common
    // variants so the maintenance gate engages no matter which one an
    // operator sets.
    aliases: [
      "maintenance",
      "maintanance",
      "maintainance",
      "maintanence",
    ],
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
 * APP_STATE is typed by hand in deployment configs, and existing instances
 * have shipped values like `maintanance` and `maintainance`. Treat any
 * `maint…ance` / `maint…ence` value as maintenance mode so a typo can never
 * leave the platform open when an operator intended to take it down.
 */
function isMaintenanceSpelling(state) {
  return /^maint.*(ance|ence)$/.test(state);
}

/**
 * Resolves a raw APP_STATE value into the environment descriptor described at
 * the top of this module.
 */
export function resolveAppEnvironment(raw) {
  const state = normalizeAppState(raw);
  let match = APP_ENVIRONMENTS.find((env) => env.aliases.includes(state));

  if (!match && isMaintenanceSpelling(state)) {
    match = APP_ENVIRONMENTS.find((env) => env.maintenance);
  }

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
    `${process.env.VUE_APP_BASE_URL}${APP_ENV_ENDPOINT}`,
    { timeout: APP_ENV_TIMEOUT_MS }
  );
  return normalizeAppState(data);
}

/** Convenience wrapper: fetch the raw APP_STATE and resolve it. */
export async function fetchAppEnvironment() {
  return resolveAppEnvironment(await fetchAppState());
}

/**
 * In-memory cache shared by the App.vue boot gate and the auth screens, so a
 * single `GET /app_env` probe answers every "are we in maintenance?" question
 * and all consumers see the same APP_STATE.
 */
let cachedEnvironment = null;
let pendingEnvironment = null;

/** Last successfully resolved environment, or null before the first probe. */
export function getCachedAppEnvironment() {
  return cachedEnvironment;
}

/**
 * Resolves the current environment, reusing the cached value unless
 * `refresh` is set (used by the periodic APP_STATE poll in App.vue).
 * Concurrent callers share one request. Failed probes are never cached.
 */
export async function loadAppEnvironment({ refresh = false } = {}) {
  if (!refresh && cachedEnvironment) {
    return cachedEnvironment;
  }
  // A probe already in flight is recent enough for a refresh too: share it
  // rather than hammering the endpoint from the boot gate and auth screens.
  if (pendingEnvironment) {
    return pendingEnvironment;
  }

  const request = fetchAppEnvironment()
    .then((environment) => {
      cachedEnvironment = environment;
      return environment;
    })
    .finally(() => {
      if (pendingEnvironment === request) {
        pendingEnvironment = null;
      }
    });

  pendingEnvironment = request;
  return request;
}

/** Drops the cached value (mainly for tests). */
export function clearAppEnvironmentCache() {
  cachedEnvironment = null;
  pendingEnvironment = null;
}
