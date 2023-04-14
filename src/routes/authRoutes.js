const routes = [
  {
    path: 'login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/view/authentication/SignIn.vue'),
  },
  {
    path: 'set-password',
    name: 'set-password',
    component: () => import(/* webpackChunkName: "comingSoon" */ '@/view/authentication/setPassword.vue'),
  },
  // {
  //   path: 'register',
  //   name: 'register',
  //   component: () => import(/* webpackChunkName: "register" */ '@/view/authentication/Signup.vue'),
  // },
  // {
  //   path: 'fb-login',
  //   name: 'fb-login',
  //   component: () => import(/* webpackChunkName: "fb-login" */ '@/view/authentication/FbSignIn.vue'),
  // },
  // {
  //   path: 'fb-register',
  //   name: 'fb-register',
  //   component: () => import(/* webpackChunkName: "fb-register" */ '@/view/authentication/FbSignup.vue'),
  // },

  {
    path: 'register',
    name: 'register',
    component: () => import(/* webpackChunkName: "forgotPassword" */ '@/view/authentication/UserRegistration.vue'),
  },
  {
    path: 'activity-confirm',
    name: 'activity-confirm',
    component: () => import(/* webpackChunkName: "forgotPassword" */ '@/view/authentication/ActivityConfirm.vue'),
  },
];

export default routes;
