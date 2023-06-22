import FeaturesRoutes from "./FeaturesRoutes";
import PageRoutes from "./PageRoutes";
import Components from "./Components";
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
        path: "/assign-worker/:id",
        name: "post-worker",
        component: () => import("@/view/pages/net-distribution/AssignWorker.vue"),
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
        component: () => import("@/view/pages/activities/pendingConfirmation.vue"),
      },
      {
        path: "/activity/confirmed-participants/:id",
        name: "activity-confirmed-participants",
        component: () => import("@/view/pages/activities/confirmedParticipants.vue"),
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
      //   {
      //     path: 'fireStore-edit/:id',
      //     name: 'fireStore-edit',
      //     component: () => import(/* webpackChunkName: "fireStore-edit" */ '@/view/pages/events/createEvent.vue'),
      //   },
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
      {
        path: "location-create",
        name: "location-create",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-add" */ "../view/pages/orgUnits/createLocation.vue"
          ),
      },
      {
        path: "sub-location-create",
        name: "sub-location-create",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-add" */ "../view/pages/orgUnits/createSubLocation.vue"
          ),
      },
      {
        path: "village-create",
        name: "village-create",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-add" */ "../view/pages/orgUnits/createVillage.vue"
          ),
      },
      {
        path: "/:id/sub-counties",
        name: "county-sub-counties",
        component: () => import("../view/pages/orgUnits/subCounties.vue"),
      },
      {
        path: "/:id/wards",
        name: "wards",
        component: () => import("../view/pages/orgUnits/wardUnits.vue"),
      },
      {
        path: "/:id/locations",
        name: "locations",
        component: () => import("../view/pages/orgUnits/locationUnits.vue"),
      },
      {
        path: "/:id/sub-locations",
        name: "sub-locations",
        component: () => import("../view/pages/orgUnits/subLocations.vue"),
      },
      {
        path: "/:id/villages",
        name: "villages",
        component: () => import("../view/pages/orgUnits/villageUnits.vue"),
      },
    ],
  },
  {
    path: '/household/validation',
    name: 'hh-validation',
    component: () => import(/* webpackChunkName: "Search" */ '@/view/pages/HouseHoldValidation.vue'),
  },
  {
    path: '/activity-payroll',
    name: 'activity-payroll',
    component: () => import(/* webpackChunkName: "Search" */ '@/view/pages/payroll/Payroll.vue'),
  },
  {
    path: '/event-payroll',
    name: 'event-payroll',
    component: () => import(/* webpackChunkName: "Search" */ '@/view/pages/payroll/eventPayroll.vue'),
  },
  {
    path: "/activity/matrix/:id",
    name: "assign-activity-matrix",
    component: () => import("@/view/pages/payroll/assignActivityMatrix.vue"),
  },
  {
    path: "/event/matrix/:id",
    name: "assign-event-matrix",
    component: () => import("@/view/pages/payroll/assignEventMatrix.vue"),
  },
  {
    path: '/view-payroll',
    name: 'view-payroll',
    component: () => import(/* webpackChunkName: "Search" */ '@/view/pages/payroll/PayrollView.vue'),
  },
  {
    path: '/view-transactions',
    name: 'view-transactions',
    component: () => import(/* webpackChunkName: "Search" */ '@/view/pages/payroll/eventTransactionDetails.vue'),
  },
  {
    path: '/activity-payroll-matrix',
    name: 'activity-payroll-matrix',
    component: () => import(/* webpackChunkName: "Search" */ '@/view/pages/payroll/activityPayrollMatrix.vue'),
  },
  {
    path: '/event-payroll-matrix',
    name: 'event-payroll-matrix',
    component: () => import(/* webpackChunkName: "Search" */ '@/view/pages/payroll/eventPayrollMatrix.vue'),
  },
  {
    path: '/logs',
    name: 'logs',
    component: () => import(/* webpackChunkName: "Search" */ '@/view/pages/audit-logs/AuditLogs.vue'),
  },
  ...PageRoutes,
  ...FeaturesRoutes,
  ...Components,
  ...Apps,
];

export default routes;
