import { createWebHistory, createRouter } from "vue-router";
import adminRoutes from "./AdminRoutes";
import authRoutes from "./authRoutes";
import { resetInactivityTimer } from "../../src/components/utilities/userActivity"

const routes = [
  {
    name: "Admin",
    path: "/",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/layout/withAdminLayout.vue"),
    children: [...adminRoutes],
    meta: { auth: false },
  },
  {
    name: "Auth",
    path: "/auth",
    component: () =>
      import(/* webpackChunkName: "auth" */ "@/layout/withAuthLayout.vue"),
    children: [...authRoutes],
    meta: { auth: true },
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

  console.log(user_object);
  

  if (user_object && user_object.token && to.matched.length === 0) {
    // User is logged in but the route is not defined, redirect to 404
    next({ path: "/404" });
  }

  if (user_object && user_object.token) {
    // User has a token, allow navigation
    next();
  }
  // } else if (!user_object && to.name !== "login") {
  //   // User is not logged in and trying to access other route, redirect to login
  //   next({ name: "login" });
  // } 
  else {
    // User is not logged in but is on the login page, allow navigation
    next();
  }


  window.scrollTo(0, 0);
});

router.beforeEach((to, from, next) => {
  const user = sessionStorage.getItem("user");
  const user_object = JSON.parse(user);

  console.log(user_object);
  // Check the 'to' route and decide whether to allow navigation or redirect
  if (user_object && user_object.token) {
      // User is authenticated, allow navigation
      resetInactivityTimer(); // Reset the timer on user activity
    // User is authenticated, allow navigation
    next();
  } else if (to.name === "login") {
    resetInactivityTimer(); // Reset the timer on user activity
    // User is not authenticated and trying to access the login page, allow navigation
    next();
  } else {
    resetInactivityTimer(); // Reset the timer on user activity
    // User is not authenticated and trying to access other routes, redirect to login
    next({ name: "login" });
  }

  window.scrollTo(0, 0);
});



export default router;
