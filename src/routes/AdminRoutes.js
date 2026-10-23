import Apps from "./Applications";
import {
  HH_CHANGE_OVERVIEW_LEVELS,
  HH_CHANGE_REVIEW_LEVELS,
  NATIONAL_BUDGET_LEVELS,
  SCHMT_ORG_TYPE_ID,
} from "@/config/navigation-permissions";

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
        path: "/search-echis-hh",
        name: "search-echis-hh",
        component: () => import("@/view/pages/household/SearchECHISHousehold.vue"),
        meta: { auth: true },
      },
      {
        path: "/admin/server-metrics",
        name: "server-metrics",
        component: () =>
          import(
            /* webpackChunkName: "ServerMetrics" */ "@/view/pages/admin/ServerMetrics.vue"
          ),
        meta: { auth: true, allowedRoles: ["Super Admin"] }, // Super Admin only
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
        path: "/county/summary",
        name: "CountyCampaignSummary",
        component: () =>
          import(
            /* webpackChunkName: "Home" */ "@/view/pages/household/CountyCampaignSummary"
          ),
      },
      {
        path: "/sub_county/summary/:id",
        name: "SubCountyCampaignSummary",
        component: () =>
          import(
            /* webpackChunkName: "Home" */ "@/view/pages/household/SubCountyCampaignSummary"
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
        path: "admin/access-control",
        name: "access-control",
        component: () =>
          import(
            /* webpackChunkName: "Business" */ "@/view/pages/admin/AccessControl.vue"
          ),
        meta: { auth: true, allowedRoles: ["Super Admin"] }, // Super Admin only
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
        // NATIONAL tier (level 1) only — county (2) and sub-county (3) users
        // are bounced to /403 by the router guard. Mirrors the sidebar gate.
        path: "/budget/national-dashboard",
        name: "budget-national-dashboard",
        component: () => import("@/view/pages/budget/NationalDashboard.vue"),
        meta: { auth: true, allowedLevels: NATIONAL_BUDGET_LEVELS },
      },
      {
        // Reviews EVERY county / sub-county budget nationally — level 1 only.
        path: "/budget/national-review",
        name: "budget-national-review",
        component: () => import("@/view/pages/budget/NationalBudgetReview.vue"),
        meta: { auth: true, allowedLevels: NATIONAL_BUDGET_LEVELS },
      },
      {
        path: "/budget/county-dashboard",
        name: "budget-county-dashboard",
        component: () => import("@/view/pages/budget/CountyDashboard.vue"),
      },
      {
        path: "/budget/county-profile",
        name: "budget-county-profile",
        component: () => import("@/view/pages/budget/CountyProfile.vue"),
        meta: { auth: true, allowedLevels: [2] }, // County users only — hidden from National
      },
      {
        path: "/budget/county-budgeting",
        name: "budget-county-budgeting",
        component: () => import("@/view/pages/budget/CountyBudgeting.vue"),
        meta: { auth: true, allowedLevels: [2] }, // County users only — hidden from National
      },
      {
        path: "/budget/county-budgets",
        name: "budget-county-budgets",
        component: () => import("@/view/pages/budget/CountyBudgets.vue"),
      },
      {
        path: "/budget/subcounty-profile",
        name: "budget-subcounty-profile",
        component: () => import("@/view/pages/budget/SubCountyProfile.vue"),
        meta: { auth: true, allowedLevels: [3] }, // Sub-County users only — hidden from National
      },
      {
        path: "/budget/budgeting",
        name: "budget-budgeting",
        component: () => import("@/view/pages/budget/Budgeting.vue"),
        meta: { auth: true, allowedLevels: [3] }, // Sub-County users only — hidden from National
      },
      {
        path: "/budget/summary",
        name: "budget-summary",
        component: () => import("@/view/pages/budget/BudgetSummary.vue"),
      },
      {
        // Financial Analysis sub-module — read-only. Gated by
        // `get_budget_financial_analysis` through the sidebar / Access Control
        // rather than a hard role list, so the audience can be managed there.
        // The payload covers EVERY county, so it is additionally pinned to the
        // NATIONAL tier (level 1) — county / sub-county users never reach it.
        path: "/budget/financial-analysis",
        name: "budget-financial-analysis",
        component: () => import("@/view/pages/budget/FinancialAnalysis.vue"),
        meta: { auth: true, allowedLevels: NATIONAL_BUDGET_LEVELS },
      },
      {
        // NATIONAL budget workspace — the same generate → edit Units & No. of
        // Days → submit flow as County / Sub-County budgeting, for the national
        // profile. Level 1 (National) users only; the API additionally pins the
        // generate / submit / approve steps to the exact business roles.
        path: "/budget/national-budgeting",
        name: "budget-national-budgeting",
        component: () => import("@/view/pages/budget/NationalBudgeting.vue"),
        meta: { auth: true, allowedLevels: NATIONAL_BUDGET_LEVELS },
      },
      {
        // AIE Holder — review & acknowledge the national budget against the
        // combined National / County / Sub-County budget summaries.
        path: "/budget/national-acknowledgement",
        name: "budget-national-acknowledgement",
        component: () => import("@/view/pages/budget/NationalBudgetAcknowledgement.vue"),
        meta: { auth: true, allowedLevels: NATIONAL_BUDGET_LEVELS },
      },
      {
        path: "/budget/parameters",
        name: "budget-parameters",
        component: () => import("@/view/pages/budget/BudgetParameters.vue"),
        meta: { auth: true, allowedRoles: ["Super Admin"] }, // Admin only
      },
      {
        path: "/budget/categories",
        name: "budget-categories",
        component: () => import("@/view/pages/budget/BudgetCategories.vue"),
        meta: { auth: true, allowedRoles: ["Super Admin"] }, // Admin only
      },
      {
        path: "/budget/special-area-costs",
        name: "budget-special-area-costs",
        component: () => import("@/view/pages/budget/SpecialAreaCosts.vue"),
        // Super Admin + the National Accountant (SAC catalogue owner).
        meta: { auth: true, allowedRoles: ["Super Admin", "Accountant"] },
      },
      {
        // The SEPARATE Special Area Cost budget for a SAC-mapped sub-county.
        // Submitted on its own straight to National (the county stage is
        // skipped), reviewed by the Accountant and approved by the Finance
        // Officer. Gated by permission/sidebar rather than a hard role list so
        // the audience can be managed from Access Control.
        path: "/budget/special-area-budget",
        name: "budget-special-area-budget",
        component: () => import("@/view/pages/budget/SpecialAreaBudget.vue"),
        meta: { auth: true },
      },
      {
        path: "/budget/locations",
        name: "budget-locations",
        component: () => import("@/view/pages/budget/BudgetLocations.vue"),
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
        path: "/event/post-security-summary",
        name: "post-security-summary",
        component: () => import("@/view/pages/events/postSecuritySummary.vue"),
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
    name: "global-fund-events",
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
        name: "gf-payroll-pending-payments",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/gfUnpaidEventsPayrolls.vue"
          ),
      },
      {
        path: "payroll-payments",
        name: "gf-payroll-payments",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/gfPaidEventsPayrolls.vue"
          ),
      },
      {
        path: "manage-allowance",
        name: "gf-manage-allowance",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/gfManageAllowance.vue"
          ),
      },
    ],
  },
  {
    path: "/pmi/events",
    name: "pmi-event-payrolls",
    component: () =>
      import(
        /* webpackChunkName: "fireStore" */ "@/view/crud/fireStore/Index.vue"
      ),
    children: [
      {
        path: "all-payrolls",
        name: "pmi-all-payrolls",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/pmiEventPayrolls.vue"
          ),
      },
      {
        path: "payroll-validation",
        name: "pmi-payroll-validation",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/pmiUnvalidatedEventsPayrolls.vue"
          ),
      },
      {
        path: "payroll-approval",
        name: "pmi-payroll-approvals",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/pmiUnapprovedEventsPayrolls.vue"
          ),
      },
      {
        path: "payroll-pending-payments",
        name: "payroll-pending-payments",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/pmiUnpaidEventsPayrolls.vue"
          ),
      },
      {
        path: "payroll-payments",
        name: "payroll-payments",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/pmiPaidEventsPayrolls.vue"
          ),
      },
    ],
  },
  {
    path: "/gf/activities",
    name: "global-fund-activities",
    component: () =>
      import(
        /* webpackChunkName: "fireStore" */ "@/view/crud/fireStore/Index.vue"
      ),
    children: [
      {
        path: "all-payrolls",
        name: "gf-activity-payrolls",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/activities/gf/AllPayrolls.vue"
          ),
      },
      {
        path: "payroll-validation",
        name: "gf-activity-payroll-validation",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/activities/gf/PendingValidationPayrolls.vue"
          ),
      },
      {
        path: "payroll-approval",
        name: "gf-activity-payroll-approvals",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/activities/gf/PendingApprovalPayrolls.vue"
          ),
      },
      {
        path: "payroll-pending-payments",
        name: "gf-activity-payroll-pending-payments",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/activities/gf/PendingPaymentsPayrolls.vue"
          ),
      },
      {
        path: "payroll-payments",
        name: "gf-activity-payroll-payments",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/payroll/activities/gf/PaidPayrolls.vue"
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
        path: "event-view",
        name: "event-view",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/events/viewEvents.vue"
          ),
      },
      {
        path: "dashboard",
        name: "events-dashboard",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/events/EventsDashboard.vue"
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
      // Single merged "List Activities" page — the old GF / PMI split pages
      // (viewGFActivity.vue / viewPMIActivity.vue) were consolidated here.
      {
        path: "view-activities",
        name: "view-activities",
        component: () =>
          import(
            /* webpackChunkName: "fireStore-view" */ "@/view/pages/activities/viewActivity.vue"
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
    redirect: "/household/validation/dashboard",
  },
  {
    path: "/household/validation/dashboard",
    name: "hh-validation-dashboard",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/HouseHoldValidation.vue"
      ),
    props: { section: "dashboard" },
    // CHA (level 3) and SCMCC (level 2 sub-county roles are handled by role check below)
    // act on household data. County (2) and National (1) users are redirected to the
    // aggregate, read-only overview by the global router guard.
    meta: { householdRestricted: true },
  },
  {
    path: "/household/validation/households",
    name: "hh-validation-households",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/HouseHoldValidation.vue"
      ),
    props: { section: "households" },
    meta: { householdRestricted: true },
  },
  {
    path: "/household/validation/feedback",
    name: "hh-validation-feedback",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/HouseHoldValidation.vue"
      ),
    props: { section: "feedback" },
    meta: { householdRestricted: true },
  },
  {
    path: "/household/validation/alerts",
    name: "hh-validation-alerts",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/HouseHoldValidation.vue"
      ),
    props: { section: "alerts" },
    meta: { householdRestricted: true },
  },
  {
    path: "/household/validation/audit",
    name: "hh-validation-audit",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/HouseHoldValidation.vue"
      ),
    props: { section: "audit" },
    meta: { householdRestricted: true },
  },
  {
    path: "/household/change-requests/review",
    name: "hh-change-requests-review",
    component: () =>
      import(
        /* webpackChunkName: "ScmccReview" */ "@/view/pages/household/SCMCCChangeRequestReview.vue"
      ),
    meta: { allowedLevels: HH_CHANGE_REVIEW_LEVELS, allowedOrgTypes: [SCHMT_ORG_TYPE_ID] }, // sub-county SCHMT (SCMCC) only
  },
  {
    path: "/household/my-change-requests",
    name: "hh-my-change-requests",
    component: () =>
      import(
        /* webpackChunkName: "MyChangeRequests" */ "@/view/pages/household/MyChangeRequests.vue"
      ),
    meta: { allowedRoles: [77] }, // CHA only
  },
  {
    path: "/household/change-requests/overview",
    name: "hh-change-requests-overview",
    component: () =>
      import(
        /* webpackChunkName: "NationalSummary" */ "@/view/pages/household/NationalChangeRequestSummary.vue"
      ),
    meta: { allowedLevels: HH_CHANGE_OVERVIEW_LEVELS }, // National (1), County (2) and Sub-County (3) — read-only, location-scoped
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
        /* webpackChunkName: "Search" */ "@/view/pages/household/HouseholdRegistrationWrapper.vue"
      ),
  },
  {
    path: "/issue-nets",
    name: "issue-nets",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/household/IssueNets.vue"
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
    path: "/gf-activities-payroll",
    name: "global-fund-activity-payroll",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/payroll/activities/gf/Payrolls.vue"
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
    path: "/admin/transaction-reports",
    name: "transactions-reports",
    component: () =>
      import(
        /* webpackChunkName: "Search" */ "@/view/pages/admin/TransactionsReports.vue"
      ),
  },
  {
        path: "/chp/:id/hh-served",
        name: "chp-hh-served",
        component: () => import("@/view/pages/household/CHPHHServed.vue"),
      },
  {
    path: "/404",
    name: "404",
    component: () =>
      import(/* webpackChunkName: "404" */ "@/view/pages/404.vue"),
  },

  {
    path: "/procurement/vendors",
    name: "procurement-vendors",
    component: () =>
      import(
        /* webpackChunkName: "Procurement" */ "@/view/pages/procurement/VendorsList.vue"
      ),
    meta: { auth: true },
  },
  {
    path: "/procurement/vendors/:id",
    name: "procurement-vendor-detail",
    component: () =>
      import(
        /* webpackChunkName: "Procurement" */ "@/view/pages/procurement/VendorDetail.vue"
      ),
    meta: { auth: true },
  },
  {
    path: "/procurement/lsos",
    name: "procurement-lsos",
    component: () =>
      import(
        /* webpackChunkName: "Procurement" */ "@/view/pages/procurement/LsosList.vue"
      ),
    meta: { auth: true },
  },
  {
    path: "/procurement/lsos/:vendorId/:id",
    name: "procurement-lso-detail",
    component: () =>
      import(
        /* webpackChunkName: "Procurement" */ "@/view/pages/procurement/LsoDetail.vue"
      ),
    meta: { auth: true },
  },

  ...Apps,
];

export default routes;
