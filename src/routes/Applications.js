export default [
  // {
  //   name: 'user-profile',
  //   path: '/user/profile',
  //   component: () => import(/* webpackChunkName: "Profile" */ '@/view/pages/settings/overview/Profile.vue'),
  //   children: [
  //     {
  //       path: 'overview',
  //       name: 'overview',
  //       components: {
  //         default: () => import(/* webpackChunkName: "socialProfile" */ '../view/apps/myProfile/Index.vue'),
  //         child: () => import(/* webpackChunkName: "overview" */ '../view/apps/myProfile/overview/Overview.vue'),
  //       },
  //     },
  //     {
  //       path: 'timeline',
  //       name: 'timeline',
  //       components: {
  //         default: () => import(/* webpackChunkName: "socialProfile" */ '../view/apps/myProfile/Index.vue'),
  //         child: () => import(/* webpackChunkName: "timeline" */ '../view/apps/myProfile/overview/Timeline.vue'),
  //       },
  //     },
  //     {
  //       path: 'activity',
  //       name: 'activity',
  //       components: {
  //         default: () => import(/* webpackChunkName: "socialProfile" */ '../view/apps/myProfile/Index.vue'),
  //         child: () => import(/* webpackChunkName: "activity" */ '../view/apps/myProfile/overview/Activity.vue'),
  //       },
  //     },
  //   ],
  // },
  {
    name: 'project',
    path: '/app/project',
    component: () => import(/* webpackChunkName: "project" */ '../view/apps/project/Project.vue'),
    children: [
      {
        path: 'grid',
        name: 'grid',
        components: {
          default: () => import(/* webpackChunkName: "project" */ '../view/apps/project/Project.vue'),
          child: () => import(/* webpackChunkName: "grid" */ '../view/apps/project/overview/Grid.vue'),
        },
      },
      {
        path: 'list',
        name: 'list',
        components: {
          default: () => import(/* webpackChunkName: "project" */ '../view/apps/project/Project.vue'),
          child: () => import(/* webpackChunkName: "list" */ '../view/apps/project/overview/List.vue'),
        },
      },
    ],
  },
  {
    name: 'net-distribution',
    path: '/nets',
    component: () => import(/* webpackChunkName: "ecommerce" */ '@/view/crud/fireStore/Index.vue'),
    children: [
      {
        name: 'distribution',
        path: 'distribution',
        component: () => import(/* webpackChunkName: "Orders" */ '../view/pages/net-distribution/DistributionPosts.vue'),
      },
      {
        name: 'delivered',
        path: 'delivered',
        component: () => import(/* webpackChunkName: "Orders" */ '../view/pages/net-distribution/NetDeliveries.vue'),
      },
      // {
      //   name: 'distribution-post',
      //   path: 'distribution/post',
      //   component: () => import(/* webpackChunkName: "Orders" */ '../view/pages/net-distribution/CreatePost.vue'),
      // },
      {
        name: 'post-create',
        path: 'post-create',
        component: () => import(/* webpackChunkName: "Orders" */ '../view/pages/net-distribution/CreatePost.vue'),
      },
      {
        name: 'receive-nets',
        path: 'receive-nets',
        component: () => import(/* webpackChunkName: "Orders" */ '../view/pages/net-distribution/ReceiveNets.vue'),
      },
    ],
  },
  {
    name: 'house-holds',
    path: 'households',
    component: () => import(/* webpackChunkName: "ecommerce" */ '@/view/crud/fireStore/Index.vue'),
    children: [
      {
        name: 'list',
        path: 'list',
        component: () => import(/* webpackChunkName: "Orders" */ '../view/pages/household/viewHouseholds.vue'),
      },
     
    ],
  },
  {
    name: 'import-export',
    path: '/users',
    component: () => import(/* webpackChunkName: "import" */ '../view/apps/importExport/Index.vue'),
    children: [
      {
        name: 'import',
        path: 'import',
        component: () => import(/* webpackChunkName: "import" */ '../view/apps/importExport/Import.vue'),
      },
      {
        name: 'export',
        path: 'export',
        component: () => import(/* webpackChunkName: "export" */ '../view/apps/importExport/Export.vue'),
      },
    ],
  },
];
