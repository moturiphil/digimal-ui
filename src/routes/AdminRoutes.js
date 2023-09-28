import Apps from "./Applications";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () =>
      import(
        /* webpackChunkName: "Dashboard" */ "@/view/dashboard/Dashboard.vue"
      ),
    children: [
      {
        path: "/",
        name: "home",
        component: () =>
          import(/* webpackChunkName: "Home" */ "@/view/dashboard"),
      },
      {
        path: "registered-users",
        name: "registered-users",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/users/registeredUsers.vue"
          ),
      },
      {
        path: "masterlist",
        name: "masterlist",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/users/masterlist.vue"
          ),
      },
      {
        path: "uploads",
        name: "uploads",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/users/uploadedFiles.vue"
          ),
      },
      {
        path: "user-roles",
        name: "user-roles",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/users/usersRole.vue"
          ),
      },
      {
        path: "assign-permission/:id",
        name: "assign-permission",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/users/assignPermission.vue"
          ),
      },
      {
        path: "role-users/:id",
        name: "role-users",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/users/roleUsers.vue"
          ),
      },
      {
        path: "review_excel",
        name: "review_excel",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/users/excelReview.vue"
          ),
      },
      {
        path: "approve_masterlist/:id",
        name: "approve_masterlist",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/users/approval.vue"
          ),
      },
      {
        path: "stock-status",
        name: "stock-status",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/users/stockStatus.vue"
          ),
      },
      {
        path: "/campaigns/view/:id",
        name: "campaign-details",
        component: () => import("@/view/pages/campaigns/showCampaign.vue"),
      },
      {
        path: "/assign-worker",
        name: "post-worker",
        component: () =>
          import("@/view/pages/net-distribution/AssignWorker.vue"),
      },
      {
        path: "/campaigns/create-campaign",
        name: "create-campaign",
        component: () => import("@/view/pages/campaigns/createCampaign.vue"),
      },
      {
        path: "/campaigns/view-campaign",
        name: "view-campaigns",
        component: () => import("@/view/pages/campaigns/viewCampaigns.vue"),
      },
      {
        path: "/events/register/:id",
        name: "events-register",
        // component: () => import("@/view/pages/events/eventRegister.vue"),
      },
      {
        path: "/event/view/:id",
        name: "view-event",
        component: () => import("@/view/pages/events/showEvent.vue"),
      },
      {
        path: "/event/details/:id",
        name: "view-details",
        component: () => import("@/view/pages/events/eventDetails.vue"),
      },
      {
        path: "/event/pending-confirmation/:id",
        name: "pending-confirmation-event",
        component: () => import("@/view/pages/events/pendingConfirmation.vue"),
      },
      {
        path: "/activity/pending-confirmation/:id",
        name: "pending-confirmation-activity",
        component: () =>
          import("@/view/pages/activities/pendingConfirmation.vue"),
      },
      {
        path: "/activity/confirmed-participants/:id",
        name: "activity-confirmed-participants",
        component: () =>
          import("@/view/pages/activities/confirmedParticipants.vue"),
      },
      {
        path: "/payroll/view/:id",
        name: "view-activity-payroll",
        component: () => import("@/view/pages/payroll/showPayroll.vue"),
      },
      {
        path: "/payroll/event-view/:id",
        name: "view-event-payroll",
        component: () => import("@/view/pages/payroll/showEventPayroll.vue"),
      },
      {
        path: "/activity/breakdown/:id",
        name: "activity-breakdown",
        component: () => import("@/view/pages/payroll/activityBreakdown.vue"),
      },
      {
        path: "/event/breakdown/:id",
        name: "event-breakdown",
        component: () => import("@/view/pages/payroll/eventBreakdown.vue"),
      },
    ],
  },
  {
    path: "/events",
    name: "events",
    component: () =>
      import(
        /* webpackChunkName: "fireStore" */ "@/view/crud/fireStore/Index.vue"
      ),
    children: [
      {
        path: "event-view",
        name: "event-view",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/events/viewEvent.vue"
          ),
      },
      {
        path: "event-create",
        name: "event-create",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-add" */ "../view/pages/events/createEvent.vue"
          ),
      },
    ],
  },
  {
    path: "/activities",
    name: "activities",
    component: () =>
      import(
        /* webpackChunkName: "fireStore" */ "@/view/crud/fireStore/Index.vue"
      ),
    children: [
      {
        path: "activity-view",
        name: "activity-view",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/activities/viewActivity.vue"
          ),
      },

      {
        path: "activity-confirm",
        name: "activity-confirm",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/activities/confirmActivity.vue"
          ),
      },
      {
        path: "activity-create",
        name: "activity-create",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-add" */ "../view/pages/activities/createActivity.vue"
          ),
      },
    ],
  },
  {
    path: "/org-units/",
    name: "org-units",
    component: () =>
      import(
        /* webpackChunkName: "fireStore" */ "@/view/crud/fireStore/Index.vue"
      ),
    children: [
      {
        path: "view",
        name: "view",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-add" */ "../view/pages/orgUnits/viewUnits.vue"
          ),
      },
      // {
      //   path: "location-create",
      //   name: "location-create",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "fireStore-add" */ "../view/pages/orgUnits/createLocation.vue"
      //     ),
      // },
      {
        path: "import-orgunit/:id",
        name: "/org-units/import-orgunit",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-add" */ "../view/pages/orgUnits/importOrgUnit.vue"
          ),
      },
      // {
      //   path: "sub-location-create",
      //   name: "sub-location-create",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "fireStore-add" */ "../view/pages/orgUnits/createSubLocation.vue"
      //     ),
      // },
      // {
      //   path: "village-create",
      //   name: "village-create",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "fireStore-add" */ "../view/pages/orgUnits/createVillage.vue"
      //     ),
      // },
      {
        path: "sub-counties/:id",
        name: "/org-units/sub-counties",
        component: () => import("../view/pages/orgUnits/subCounties.vue"),
      },
      {
        path: "wards/:id",
        name: "/org-units",
        component: () => import("../view/pages/orgUnits/wardUnits.vue"),
      },
      {
        path: "locations/:id",
        name: "/org-units/locations",
        component: () => import("../view/pages/orgUnits/locationUnits.vue"),
      },
      {
        path: "sub-locations/:id",
        name: "/org-units/sub-locations",
        component: () => import("../view/pages/orgUnits/subLocations.vue"),
      },
      {
        path: "villages/:id",
        name: "/org-units/villages",
        component: () => import("../view/pages/orgUnits/villageUnits.vue"),
      },
    ],
  },
  {
    path: "/household/validation",
    name: "hh-validation",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/HouseHoldValidation.vue"
      ),
  },
  {
    path: "/activity-payroll",
    name: "activity-payroll",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/Payroll.vue"
      ),
  },
  {
    path: "/gf-event-payroll",
    name: "gloabal-fund-event-payroll",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/gfEventPayroll.vue"
      ),
  },
  {
    path: "/pmi-event-payroll",
    name: "pmi-event-payroll",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/pmiEventPayroll.vue"
      ),
  },
  {
    path: "/activity/matrix/:id",
    name: "assign-activity-matrix",
    component: () => import("@/view/pages/payroll/assignActivityMatrix.vue"),
  },
  {
    path: "/activity/matrix/create",
    name: "create-activity-matrix",
    component: () => import("@/view/pages/payroll/createActivityMatrix.vue"),
  },
  {
    path: "/event/matrix/:id",
    name: "assign-event-matrix",
    component: () => import("@/view/pages/payroll/assignEventMatrix.vue"),
  },
  {
    path: "/view-payroll",
    name: "view-payroll",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/PayrollView.vue"
      ),
  },
  {
    path: "/view-transactions",
    name: "view-transactions",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/eventTransactionDetails.vue"
      ),
  },
  {
    path: "/activity-payroll-matrix",
    name: "activity-payroll-matrix",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/activityPayrollMatrix.vue" // activity/view-matrix/
      ),
  },
  {
    path: "/activity/view-matrix/:id",
    name: "assigned-activity-matrix",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/matrixPerActivity.vue"
      ),
  },
  {
    path: "/event/view-matrix/:id",
    name: "assigned-event-matrix",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/matrixPerEvent.vue"
      ),
  },
  {
    path: "/list-activity/matrix",
    name: "/list-activity-matrix",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/listActivityMatrix.vue"
      ),
  },
  {
    path: "/event-payroll-matrix",
    name: "event-payroll-matrix",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/eventPayrollMatrix.vue"
      ),
  },
  {
    path: "/logs",
    name: "logs",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/audit-logs/AuditLogs.vue"
      ),
  },
  {
    path: "/404", // Use an absolute path
    name: "404",
    component: () =>
      import(/* webpackChunkName: "404" */ "@/view/pages/404.vue"),
  },
  
  ...Apps,
];

export default routes;
