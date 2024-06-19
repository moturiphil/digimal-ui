import Apps from "./Applications";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () =>
      import(
        /* webpackChunkName: "Dashboard" */ "@/view/dashboard/Dashboard.vue" //
      ),
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("@/view/dashboard"),
        meta: { auth: true },
      },
      {
        path: "/search-hh",
        name: "search-hh",
        component: () => import("@/view/pages/household/HouseholdSearch.vue"),
        meta: { auth: true },
      },
      {
        path: "/MNEDashboard",
        name: "MNEDashboard",
        component: () =>
          import(
            /* webpackChunkName: "Home" */ "@/view/dashboard/MNEDashboard"
          ),
      },
      {
        path: "/irs/summary",
        name: "IRSSummary",
        component: () =>
          import(
            /* webpackChunkName: "Home" */ "@/view/pages/household/IRSHouseholds"
          ),
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
        path: "meds-issues",
        name: "meds-issues",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/supply-chain/stockStatus.vue"
          ),
      },
      {
        path: "meds-orders",
        name: "meds-orders",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/supply-chain/MedsOrders.vue"
          ),
      },
      // {
      //   path: "kemsa-orders",
      //   name: "kemsa-orders",
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "Business" */ "@/view/pages/supply-chain/KEMSAOrders.vue"
      //     ),
      // },
      {
        path: "kemsa/drop-off-deliveries",
        name: "kemsa-deliveries",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/supply-chain/KEMSADeliveries.vue"
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
        path: "/sub-location/posts/:id",
        name: "sub-location-posts",
        component: () =>
          import("@/view/pages/net-distribution/SubLocationPosts.vue"),
      },
      {
        path: "/view-worker",
        name: "view-worker",
        component: () => import("@/view/pages/net-distribution/ViewWorker.vue"),
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
        path: "/events/add-stakeholder",
        name: "events-add-stakeholder",
        component: () => import("@/view/pages/events/addStakeholder.vue"),
      },
      {
        path: "/users/add-chp-ve",
        name: "users-chp-ve",
        component: () => import("@/view/pages/users/addCHPVE.vue"),
      },
      {
        path: "/users/cha",
        name: "view-cha",
        component: () => import("@/view/pages/users/registeredCHA.vue"),
      },
      {
        path: "/users/view-chp-ve",
        name: "view-chp",
        component: () => import("@/view/pages/users/chpVE.vue"),
      },
      {
        path: "/stakeholders",
        name: "stakeholder",
        component: () => import("@/view/pages/events/viewStakeholders.vue"),
      },
      {
        path: "/event/view/:id",
        name: "view-event",
        component: () => import("@/view/pages/events/showEvent.vue"),
      },
      {
        path: "/view/admin-events",
        name: "view-event",
        component: () => import("@/view/pages/events/adminEvent.vue"),
      },
      {
        path: "/event/participant-otp/:id",
        name: "participant-otp",
        component: () => import("@/view/pages/events/participantOTP.vue"),
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
        path: "/activity/details/:id",
        name: "activity-details",
        component: () => import("@/view/pages/activities/activityDetails.vue"),
      },
      {
        path: "dashboard/my-activities/",
        name: "my-activities-dashboard",
        component: () =>
          import("@/view/pages/activities/myActivityDashboard.vue"),
      },
      {
        path: "/activity/pending-approval-details/:id",
        name: "activity-pending-approval-details",
        component: () =>
          import("@/view/pages/activities/activityPendingApprovalDetails.vue"),
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
    path: "/gf/events",
    name: "global-fund",
    component: () =>
      import(
        /* webpackChunkName: "fireStore" */ "@/view/crud/fireStore/Index.vue"
      ),
    children: [
      {
        path: "all-payrolls",
        name: "gf-all-payrolls",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/gfEventPayrolls.vue"
          ),
      },
      {
        path: "payroll-validation",
        name: "gf-payroll-validation",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/gfUnvalidatedEventsPayrolls.vue"
          ),
      },
      {
        path: "payroll-approval",
        name: "gf-payroll-approvals",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/gfUnapprovedEventsPayrolls.vue"
          ),
      },
      {
        path: "payroll-pending-payments",
        name: "payroll-pending-payments",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/gfUnpaidEventsPayrolls.vue"
          ),
      },
      {
        path: "payroll-payments",
        name: "payroll-payments",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/gfPaidEventsPayrolls.vue"
          ),
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
        path: "gf",
        name: "gf",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/events/viewGFEvent.vue"
          ),
      },
      {
        path: "event-view",
        name: "event-view",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/events/viewEvents.vue"
          ),
      },
      {
        path: "pmi",
        name: "pmi",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/events/viewPMIEvent.vue"
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
        path: "view-activities",
        name: "view-activities",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/activities/viewActivity.vue"
          ),
      },

      {
        path: "gf",
        name: "gf-activities",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/activities/viewGFActivity.vue"
          ),
      },

      {
        path: "pmi",
        name: "pmi-activities",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/activities/viewPMIActivity.vue"
          ),
      },

      {
        path: "activity-pending-approval",
        name: "activity-pending-approval",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/activities/activityPendingApproval.vue"
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
      {
        path: "village-create",
        name: "/village-create",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-add" */ "../view/pages/orgUnits/createVillage.vue"
          ),
      },
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
      {
        path: "chp/:id",
        name: "/org-units-chp",
        component: () => import("../view/pages/users/chpVillageElders.vue"),
      },
      // {
      //   path: "sub-county-units/chp-ve/:id",
      //   name: "/org-units-chp",
      //   component: () => import("../view/pages/users/chpVillageElders.vue"),
      // },
    ],
  },
  {
    path: "/sub-county-units/chp-ve/:id",
    name: "/org-units-villages",
    component: () =>
      import("../view/pages/users/subCountyCHPVillageElders.vue"),
  },
  {
    path: "/sub-location/dashboard",
    name: "/sub-location-dashboard",
    component: () => import("../view/pages/orgUnits/CHADashboard.vue"),
  },
  //training summary
  {
    path: "/training/summary",
    name: "training-summary",
    component: () => import("../view/pages/campaigns/trainingSummary.vue"),
  },
  // households/summary
  {
    path: "/household/validation",
    name: "hh-validation",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/HouseHoldValidation.vue"
      ),
  },
  //IRS
  {
    path: "/household/irs",
    name: "hh-irs",
    component: () =>
      import(/* webpackChunkName: "Search" */ "@/view/pages/household/IRS.vue"),
  },
  {
    path: "/irs-household-summary",
    name: "irs-summary",
    component: () => import("@/view/pages/household/IRSHouseholds.vue"),
    meta: { auth: true },
  },
  {
    path: "/villages/hh/:id",
    name: "hh-villages",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/villagesHousehold.vue"
      ),
  },
  {
    path: "/village-hh/:id",
    name: "village-hh",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/villageHouseholds.vue"
      ),
  },
  {
    path: "/posts/hh/:id",
    name: "hh-posts",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/postsHousehold.vue"
      ),
  },
  {
    path: "/chp-hh-registered/:id",
    name: "chp-hh-registered",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/chpHHRegistered.vue"
      ),
  },
  {
    path: "/verify-chp-hh/:id",
    name: "verify-chp-hh",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/verifyCHPHH.vue"
      ),
  },
  {
    path: "/households/summary",
    name: "hh-summary",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/HouseHoldSummary.vue"
      ),
  },
  {
    path: "/add-household",
    name: "add-hh",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/AddHouseHold.vue"
      ),
  },
  {
    path: "/gf-activity-payroll",
    name: "activity-payroll",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/gfActivityPayroll.vue"
      ),
  },
  {
    path: "/pmi-activity-payroll",
    name: "pmi-payroll",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/pmiActivityPayroll.vue"
      ),
  },
  {
    path: "/gf-event-payroll",
    name: "global-fund-event-payroll",
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
    path: "/admin-massnet",
    name: "massnet-admin",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/admin/Administrator.vue"
      ),
  },
  {
    path: "/admin/subcounty-hh-reg",
    name: "hh-reg-subcounty",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/admin/SubCountyHHReg.vue"
      ),
  },
  {
    path: "/404", // Use an absolute path
    name: "404",
    component: () =>
      import(/* webpackChunkName: "404" */ "@/view/pages/404.vue"),
  },
  {
    path: "/maintenance", // Use an absolute path
    name: "maintenance",
    component: () =>
      import(/* webpackChunkName: "404" */ "@/view/pages/403.vue"),
  },

  ...Apps,
];

export default routes;
