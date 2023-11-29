import { createWebHistory, createRouter } from "vue-router";
import adminRoutes from "./AdminRoutes";
import authRoutes from "./authRoutes";
import { resetInactivityTimer } from "../../src/components/utilities/userActivity";

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

  if (to.meta.auth && (user_object == null)) {
    next({ path: "/auth/login" });
  } else {
    if (user_object != null && user_object.token != null && to.matched.length === 0) {
      // User is logged in but the route is not defined, redirect to 404
      next({ path: "/404" });
    }
    if (user_object && user_object.token) {
      resetInactivityTimer();
      // User is authenticated, allow navigation
      next();
    }
    if (to.name === "login") {
      resetInactivityTimer();
      // User is not authenticated and trying to access the login page, allow navigation
      next();
    }
  if (user_object && user_object.token) {
    // User has a token, allow navigation
    next();
  } else {
    //User is not logged in but is on the login page, allow navigation
    next();
  }
  }
  window.scrollTo(0, 0);
});

export default router;
