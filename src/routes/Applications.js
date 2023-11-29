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
      {
        path: "receive-post-nets/",
        name: "receive-post-net",
        component: () =>import("../view/pages/net-distribution/ReceiveNets.vue"),
      },
      {
        path: "issuance-linelist",
        name: "issuance-linelist",
        component: () =>import("../view/pages/net-distribution/IssuanceLineList.vue"),
      },
      {
        path: "distributions",
        name: "net-distributions",
        component: () =>import("../view/pages/net-distribution/viewDistribution.vue"),
      },
      {
        path: "receive-nets-summary/",
        name: "receive-nets-summary",
        component: () =>import("../view/pages/net-distribution/ReceiveNetsSummary.vue"),
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
        name: "nets-transfer-dropoff",
        path: "nets-transfer-dropoff",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/NetTransfersDropOff.vue"
          ),
      },
      {
        name: "receive-nets-dropoff",
        path: "receive-nets-dropoff",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/ReceiveNetsDropOff.vue"
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
        name: "post-summary",
        path: "post-summary",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/PostSummary.vue"
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
      {
        name: "meds-supplies",
        path: "meds-supplies",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/MedsIssuance.vue"
          ),
      },
    ],
  },
  {
    name: "dropoff-assign-posts",
    path: "dropoff/assign-posts",
    component: () =>
      import(
        /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/AssignDropOffPosts.vue"
      ),
  },
  {
    name: "manage-dropoff-inventory",
    path: "manage-dropoff-inventory",
    component: () =>
      import(
        /* webpackChunkName: "Orders" */ "../view/pages/net-distribution/ManageDropOffInventory.vue"
      ),
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
    ],
  },
  {
    name: "households-registrations",
    path: "households-registrations",
    component: () =>
      import(
        /* webpackChunkName: "ecommerce" */ "@/view/crud/fireStore/Index.vue"
      ),
    children: [
      {
        name: "incomplete",
        path: "incomplete",
        component: () =>
          import(
            /* webpackChunkName: "Orders" */ "../view/pages/household/incompleteHouseholds.vue"
          ),
      },
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
  {
    name: "data-management",
    path: "/import",
    component: () =>
      import(
        /* webpackChunkName: "import" */ "../view/apps/importExport/Index.vue"
      ),
    children: [
      {
        name: "import-masterlist",
        path: "import-masterlist",
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../view/apps/importExport/Import.vue"
          ),
      },
      {
        name: "admin-units",
        path: "admin-units",
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../view/apps/importExport/ImportAdminUnits.vue"
          ),
      },
      {
        name: "dropoff-points",
        path: "dropoff-points",
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../view/apps/importExport/ImportDropOffPoints.vue"
          ),
      },
      {
        name: "distribution-posts",
        path: "distribution-posts",
        component: () =>
          import(
            /* webpackChunkName: "import" */ "../view/apps/importExport/ImportDistributionPosts.vue"
          ),
      },
      // {
      //   name: "export",
      //   path: "export",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "export" */ "../view/apps/importExport/Export.vue"
      //     ),
      // },
    ],
  },
];
