/**
 * Central handling for the backend's "caller is not authenticated" signal:
 * an HTTP 401 response carrying the body { "message": "Unauthenticated." }.
 *
 * That payload is what Laravel's auth:api / Passport token guard returns when
 * the bearer token is missing, expired or revoked. Whenever any of the UI's
 * API clients observes it, the user is signed out locally and the browser is
 * re-routed to the login page so they can re-authenticate.
 *
 * Used by Axiosconfig.js, config/dataService/dataService.js and the global
 * default-axios safety net registered in main.js.
 */

const UNAUTHENTICATED_MESSAGE = "Unauthenticated.";
const LOGIN_PATH = "/auth/login";

/**
 * Returns `true` when the axios error is the backend's unauthenticated
 * response: HTTP 401 with body { "message": "Unauthenticated." }.
 */
export function isUnauthenticatedError(error) {
  const response = error && error.response;
  return (
    !!response &&
    response.status === 401 &&
    !!response.data &&
    response.data.message === UNAUTHENTICATED_MESSAGE
  );
}

/**
 * Clears every piece of persisted auth state and, unless already on the login
 * page, hard-redirects the browser to it. Safe to call multiple times (e.g.
 * when several failing requests are in flight at once): the second call is a
 * no-op because the page has started navigating.
 */
export function redirectToLogin() {
  // 1. Drop persisted auth data so stale tokens are never reused and the
  //    router's beforeEach guard treats the user as logged out.
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("user-config-token");
  localStorage.removeItem("access_token");

  // 2. Build the login URL using the same publicPath/base rules as the
  //    router (see customize-vue-config.js / routes/protectedRoute.js).
  const base =
    process.env.NODE_ENV === "production" && process.env.VUE_APP_SUB_ROUTE
      ? process.env.VUE_APP_SUB_ROUTE
      : process.env.BASE_URL;
  const normalizedBase = String(base || "").replace(/\/+$/, "");
  const loginUrl = new URL(
    `${normalizedBase}${LOGIN_PATH}`,
    window.location.origin
  ).href;

  // 3. No-op when already sitting on the login page (avoids reload loops).
  if (new URL(window.location.href).pathname !== new URL(loginUrl).pathname) {
    window.location.assign(loginUrl);
  }
}

/**
 * Axios response-error interceptor: detects the unauthenticated payload,
 * bounces the user to the login page, and always re-throws the error so the
 * per-request error handling in the calling code keeps working unchanged.
 */
export function handleResponseError(error) {
  if (isUnauthenticatedError(error)) {
    redirectToLogin();
  }
  return Promise.reject(error);
}