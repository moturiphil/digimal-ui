const routes = [
  {
    path: 'login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/view/authentication/SignIn.vue'),
  },
  {
    path: 'register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '@/view/authentication/Signup.vue'),
  },
  {
    path: 'fb-login',
    name: 'fb-login',
    component: () => import(/* webpackChunkName: "fb-login" */ '@/view/authentication/FbSignIn.vue'),
  },
  {
    path: 'fb-register',
    name: 'fb-register',
    component: () => import(/* webpackChunkName: "fb-register" */ '@/view/authentication/FbSignup.vue'),
  },
  {
    path: 'forgotPassword',
    name: 'forgotPassword',
    component: () => import(/* webpackChunkName: "forgotPassword" */ '@/view/authentication/ForgotPassword.vue'),
  },
];

export default routes;
