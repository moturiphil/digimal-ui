import { createWebHistory, createRouter } from "vue-router";
import adminRoutes from "./AdminRoutes";
import authRoutes from "./authRoutes";
import { resetInactivityTimer } from "../../src/components/utilities/userActivity";
import { maybeSyncOnNavigation } from "../services/access-sync";

const routes = [
  {
    name: "Admin",
    path: "/",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/layout/withAdminLayout.vue"),
    children: [...adminRoutes],
    meta: { auth: true },
  },
  {
    name: "Auth",
    path: "/auth",
    component: () =>
      import(/* webpackChunkName: "auth" */ "@/layout/withAuthLayout.vue"),
    children: [...authRoutes],
    meta: { auth: false },
  },
];

const router = createRouter({
  history: createWebHistory(
    process.env.NODE_ENV === "production"
      ? process.env.VUE_APP_SUB_ROUTE
        ? process.env.VUE_APP_SUB_ROUTE
        : process.env.BASE_URL
      : process.env.BASE_URL
  ),
  linkExactActiveClass: "active",
  routes,
});

router.beforeEach((to, from, next) => {
  const user = sessionStorage.getItem("user");
  const user_object = JSON.parse(user);

  // const is_chp_otp = sessionStorage.getItem("is_chp_otp");

  if (to.meta.auth && (user_object == null)) {
    next({ path: "/auth/login" });
    return;
  }

  if (user_object != null && user_object.token != null && to.matched.length === 0) {
    // User is logged in but the route is not defined, redirect to 404
    next({ path: "/404" });
    return;
  }

  // ── Household change-request access control ──────────────────────────────
  // Build a flat list of meta entries from to.matched so we honour parent meta.
  const profile = user_object?.user || user_object || {};
  const userLevelId = Number(profile.level_id || 0);
  const userRoleId = Number(profile.role_id || 0);
  // Role names are the stable key from the API roles table — route guards
  // accept names or numeric ids in meta.allowedRoles.
  const userRoleName = profile.role?.name || "";

  const allowedLevels = to.matched
    .map((r) => r.meta?.allowedLevels)
    .filter(Boolean)
    .pop();
  const allowedRoles = to.matched
    .map((r) => r.meta?.allowedRoles)
    .filter(Boolean)
    .pop();
  const householdRestricted = to.matched.some((r) => r.meta?.householdRestricted);

  if (user_object && user_object.token) {
    // Fire-and-forget re-sync of cached role/permissions — throttled, so it
    // never blocks navigation but keeps gates fresh across route changes.
    maybeSyncOnNavigation();

    // National (1) and County (2) users cannot access per-household validation
    // pages — they get the read-only aggregate overview instead.
    if (householdRestricted && (userLevelId === 1 || userLevelId === 2)) {
      resetInactivityTimer();
      next({ path: "/household/change-requests/overview" });
      return;
    }

    if (allowedLevels && !allowedLevels.includes(userLevelId)) {
      resetInactivityTimer();
      next({ path: "/403" });
      return;
    }

    if (
      allowedRoles &&
      !allowedRoles.some((r) => r === userRoleId || r === userRoleName)
    ) {
      resetInactivityTimer();
      next({ path: "/403" });
      return;
    }

    resetInactivityTimer();
    next();
    return;
  }

  if (to.name === "login") {
    resetInactivityTimer();
    next();
    return;
  }

  // Default: allow (covers unauthenticated public pages).
  next();
  window.scrollTo(0, 0);
});

export default router;
