import { createWebHistory, createRouter } from "vue-router";
import adminRoutes from "./AdminRoutes";
import authRoutes from "./authRoutes";
// import store from "@/vuex/store";

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

  if (user_object && user_object.token) {
    // User has a token, allow navigation
    next();
  } else if (!user_object && to.name !== "login") {
    // User is not logged in and trying to access other route, redirect to login
    next({ name: "login" });
  } else {
    // User is not logged in but is on the login page, allow navigation
    next();
  }

  window.scrollTo(0, 0);
});

// router.beforeEach((to, from, next) => {
//   const user = sessionStorage.getItem("user");
//   const user_object = JSON.parse(user);

//   if (user_object && user_object.token) {
//     // User has a token, check if the route exists
//     const matchedRoute = router.resolve(to.path).route;
    
//     if (matchedRoute) {
//       // The route exists, proceed with navigation
//       next();
//     } else {
//       // Redirect to the 404 page for undefined routes
//       next({ name: "404" });
//     }
//   } else if (!user_object && to.name !== "login") {
//     // User is not logged in and trying to access other route, redirect to login
//     next({ name: "login" });
//   } else {
//     // User is not logged in but is on the login page or has a token, allow navigation
//     next();
//   }

//   window.scrollTo(0, 0);
// });


export default router;
