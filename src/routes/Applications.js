export default [
  {
    name: "net-distribution",
    path: "/nets",
    component: () =>
      import(
        /* webpackChunkName: "ecommerce" */ "@/view/crud/fireStore/Index.vue"
      ),
    children: [
      {
        name: "distribution-post",
        path: "distribution-post",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/DistributionPosts.vue"
          ),
      },
      {
        name: "delivered",
        path: "nets-delivered",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/NetDeliveries.vue"
          ),
      },
      // {
      //   name: 'distribution-post',
      //   path: 'distribution/post',
      //   component: () => import(/* webpackChunkName: "Orders" */ '../view/pages/net-distribution/CreatePost.vue'),
      // },
      {
        path: "receive-post-nets/",
        name: "receive-post-net",
        component: () =>import("../view/pages/net-distribution/ReceiveNets.vue"),
      },
      {
        path: "verify-post-nets/",
        name: "verify-post-net",
        component: () =>import("../view/pages/net-distribution/BaleVerification.vue"),
      },
      {
        name: "post-create",
        path: "post-create",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/CreatePost.vue"
          ),
      },
      {
        name: "distribution-point",
        path: "distribution-point",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/DistributionPoint.vue"
          ),
      },
      {
        name: "distribution-points",
        path: "distribution-points",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/ViewPoints.vue"
          ),
      },
      {
        name: "distribution-point-nets",
        path: "distribution-point-nets",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/DistributionPointNets.vue"
          ),
      },
      {
        name: "drop-off",
        path: "drop-off",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/NetsDropoff.vue"
          ),
      },
    ],
  },
  {
    name: "hh-nets-distributed",
    path: "hh-nets-distributed",
    component: () =>
      import(
        /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/HHNetsDistributed.vue"
      ),
  },
  {
    name: "receive-nets",
    path: "receive-nets/",
    component: () =>
      import(
        /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/DropoffNets.vue"
      ),
  },
  {
    name: "house-holds",
    path: "households",
    component: () =>
      import(
        /* webpackChunkName: "ecommerce" */ "@/view/crud/fireStore/Index.vue"
      ),
    children: [
      {
        name: "list",
        path: "list",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/household/viewHouseholds.vue"
          ),
      },
      // {
      //   name: "chv",
      //   path: "chv",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "Orders" */ "../view/pages/household/houseHoldCHV.vue"
      //     ),
      // },
    ],
  },
  {
    name: "import-export",
    path: "/users",
    component: () =>
      import(
        /* webpackChunkName: "import" */ "../view/apps/importExport/Index.vue"
      ),
    children: [
      {
        name: "import",
        path: "import",
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../view/apps/importExport/Import.vue"
          ),
      },
      {
        name: "export",
        path: "export",
        component: () =>
          import(
            /* webpackChunkName: "export" */ "../view/apps/importExport/Export.vue"
          ),
      },
    ],
  },
];
