export default [
  {
    name: 'user-profile',
    path: '/user/profile',
    component: () => import(/* webpackChunkName: "Profile" */ '@/view/pages/settings/overview/Profile.vue'),
    children: [
      {
        path: 'overview',
        name: 'overview',
        components: {
          default: () => import(/* webpackChunkName: "socialProfile" */ '../view/apps/myProfile/Index.vue'),
          child: () => import(/* webpackChunkName: "overview" */ '../view/apps/myProfile/overview/Overview.vue'),
        },
      },
      {
        path: 'timeline',
        name: 'timeline',
        components: {
          default: () => import(/* webpackChunkName: "socialProfile" */ '../view/apps/myProfile/Index.vue'),
          child: () => import(/* webpackChunkName: "timeline" */ '../view/apps/myProfile/overview/Timeline.vue'),
        },
      },
      {
        path: 'activity',
        name: 'activity',
        components: {
          default: () => import(/* webpackChunkName: "socialProfile" */ '../view/apps/myProfile/Index.vue'),
          child: () => import(/* webpackChunkName: "activity" */ '../view/apps/myProfile/overview/Activity.vue'),
        },
      },
    ],
  },
  {
    name: 'net-distribution',
    path: '/net/distribution',
    component: () => import(/* webpackChunkName: "netDistribution" */ '../view/apps/netDistribution/Index.vue'),
    children: [
      {
        name: 'national',
        path: 'national',
        components: {
          default: () => import(/* webpackChunkName: "netDistribution" */ '../view/apps/netDistribution/Index.vue'),
          child: () => import(/* webpackChunkName: "national" */ '../view/apps/netDistribution/overview/national.vue'),
        },
      },
      {
        name: 'county',
        path: 'county',
        components: {
          default: () => import(/* webpackChunkName: "netDistribution" */ '../view/apps/netDistribution/Index.vue'),
          child: () => import(/* webpackChunkName: "county" */ '../view/apps/netDistribution/overview/county.vue'),
        },
      },
      {
        name: 'sub-county',
        path: 'sub-county',
        components: {
          default: () => import(/* webpackChunkName: "netDistribution" */ '../view/apps/netDistribution/Index.vue'),
          child: () => import(/* webpackChunkName: "subCounty" */ '../view/apps/netDistribution/overview/subCounty.vue'),
        },
      },
    ],
  },
];
