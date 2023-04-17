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
  // {
  //   path: 'activity-confirm',
  //   name: 'activity-confirm',
  //   component: () => import(/* webpackChunkName: "forgotPassword" */ '@/view/authentication/ActivityConfirm.vue'),
  // },
  {
    path: '/:a_part',
    redirect: to => {
      const a_code = to.query.a_code;
      return { name: 'register', params: { a_part: to.params.a_part }, query: { a_code: a_code } };
    }
  },
  {
    path: '/activity-confirm/:a_part',
    name: 'register',
    component: () => import(/* webpackChunkName: "forgotPassword" */ '@/view/authentication/ActivityConfirm.vue'),
  },
  {
    path: '/auth/activity-confirm',
    name: 'activity-confirm',
    component: () => import('@/view/authentication/ActivityConfirm.vue')
  },
];

export default routes;
