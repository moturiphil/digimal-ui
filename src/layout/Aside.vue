<template>
  <a-menu
    v-model:selectedKeys="current"
    :mode="mode"
    :theme="darkMode ? 'dark' : 'light'"
  >
    <a-menu-item-group key="pages">
      <a-sub-menu key="widgetDashboard" v-if="!isCommunityHealthWorker">
        <template v-slot:title>
          <sdFeatherIcons type="home" /> <span>Dashboards</span>
        </template>
        <a-menu-item key="widgetDashboard">
          <router-link to="/"> Campaign Dashboard </router-link>
        </a-menu-item>
        <a-menu-item key="widgetM&EDashboard" v-if="true && canCreateCampaign" >
          <router-link to="/MNEDashboard"> M & E Dashboard </router-link>
        </a-menu-item>
        <a-menu-item key="widgetCHADash" v-if="canCreateCampaign">
          <router-link to="/sub-location/dashboard">
            Sub-location Dashboard
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetTrainingDash" v-if="canCreateCampaign">
          <router-link to="/training/summary">
            Training Summary
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetIRSSummary" v-if="canCreateCampaign">
          <router-link to="/irs/summary">
            IRS Household Summary
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetCountySummary">
          <router-link to="/county/summary">
            County Campaign Summary
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="campaigns" v-if="canCreateCampaign || canViewCampaign">
        <template v-slot:title>
          <sdFeatherIcons type="globe" /><span>Campaigns</span>
        </template>
        <a-menu-item key="widgetCamp" v-if="canCreateCampaign">
          <router-link to="/campaigns/create-campaign">
            Create Campaign
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetsList" v-if="canViewCampaign">
          <router-link to="/campaigns/view-campaign">
            List Campaigns
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="me" v-if="canAccessMe">
        <template v-slot:title>
          <sdFeatherIcons type="clipboard" /><span>M&amp;E</span>
        </template>
        <a-menu-item key="meStages" v-if="canViewMeCompliance">
          <router-link to="/me/stages">Stages</router-link>
        </a-menu-item>
        <a-menu-item key="meChecklists" v-if="canViewMeCompliance">
          <router-link to="/me/checklists">Checklists</router-link>
        </a-menu-item>
        <a-menu-item key="meMyChecklists" v-if="canSubmitMeChecklists">
          <router-link to="/me/my-checklists">My Checklists</router-link>
        </a-menu-item>
        <a-menu-item key="meSubmissions" v-if="canViewMeCompliance">
          <router-link to="/me/submissions">Submissions</router-link>
        </a-menu-item>
        <a-menu-item key="meMySubmissions" v-if="canSubmitMeChecklists">
          <router-link to="/me/my-submissions">My Submissions</router-link>
        </a-menu-item>
        <a-menu-item key="meCompliance" v-if="canViewMeCompliance">
          <router-link to="/me/compliance">Compliance</router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="budgeting" v-if="canAccessBudgeting">
        <template v-slot:title>
          <sdFeatherIcons type="bar-chart-2" /><span>Budgeting</span>
        </template>
        <a-menu-item key="budgetNationalDashboard" v-if="canViewNationalTier">
          <router-link to="/budget/national-dashboard">
            National Dashboard
          </router-link>
        </a-menu-item>
        <a-menu-item key="budgetNationalReview" v-if="canViewNationalTier">
          <router-link to="/budget/national-review">
            County & S.County Budget Review
          </router-link>
        </a-menu-item>
        <a-menu-item
          key="budgetFinancialAnalysis"
          v-if="canViewFinancialAnalysis && canViewNationalTier"
        >
          <router-link to="/budget/financial-analysis">
            Financial Analysis
          </router-link>
        </a-menu-item>
        <!-- National budget: the same Budget module flow as County /
             Sub-County budgeting, with its own approval chain
             (Vector Unit Head / GF Manager approve). -->
        <a-menu-item
          key="budgetNationalBudgeting"
          v-if="canViewNationalBudget && canViewNationalTier"
        >
          <router-link to="/budget/national-budgeting">
            National Budgeting
          </router-link>
        </a-menu-item>
        <a-menu-item
          key="budgetCountyDashboard"
          v-if="isCountyLevel || isLevelOne"
        >
          <router-link to="/budget/county-dashboard">
            County Dashboard
          </router-link>
        </a-menu-item>
        <a-menu-item
          key="budgetCountyProfile"
          v-if="isCountyLevel"
        >
          <router-link to="/budget/county-profile">
            County Profile
          </router-link>
        </a-menu-item>
        <a-menu-item
          key="budgetCountyBudgeting"
          v-if="isCountyLevel"
        >
          <router-link to="/budget/county-budgeting">
            County Budgeting
          </router-link>
        </a-menu-item>
        <a-menu-item key="budgetCountyBudgets" v-if="isCountyLevel || isAdmin">
          <router-link to="/budget/county-budgets">
            S. County Budgets Review
          </router-link>
        </a-menu-item>
        <a-menu-item key="budgetSubCountyProfile" v-if="isSubCountyLevel">
          <router-link to="/budget/subcounty-profile">
            Sub-County Profile
          </router-link>
        </a-menu-item>
        <a-menu-item key="budgetBudgeting" v-if="isSubCountyLevel">
          <router-link to="/budget/budgeting"> SubCounty Budgeting </router-link>
        </a-menu-item>
        <!-- The SEPARATE Special Area Cost budget. It is submitted on its own
             and pushed straight to National (the county stage is skipped). -->
        <a-menu-item
          key="budgetSpecialAreaBudget"
          v-if="isSubCountyLevel || isCountyLevel || isAdmin"
        >
          <router-link to="/budget/special-area-budget">
            Special Area Budget
          </router-link>
        </a-menu-item>
        <!-- <a-menu-item key="budgetSummary" v-if="isSubCountyLevel || isLevelOne">
          <router-link to="/budget/summary"> Budget Summary </router-link>
        </a-menu-item> -->
        <a-menu-item key="budgetCategories" v-if="isAdmin">
          <router-link to="/budget/categories"> Budget Categories </router-link>
        </a-menu-item>
        <a-menu-item key="budgetParameters" v-if="isAdmin">
          <router-link to="/budget/parameters"> Budget Parameters </router-link>
        </a-menu-item>
        <a-menu-item
          key="budgetSpecialAreaCost"
          v-if="isAdmin || canManageSpecialAreaCost"
        >
          <router-link to="/budget/special-area-costs"> Special Area Cost </router-link>
        </a-menu-item>
        <!-- <a-menu-item key="budgetLocations" v-if="isLevelOne || isCountyLevel">
          <router-link to="/budget/locations"> Locations </router-link>
        </a-menu-item> -->
      </a-sub-menu>
      <a-sub-menu key="procurement" v-if="canViewProcurement">
        <template v-slot:title>
          <sdFeatherIcons type="briefcase" /><span>Procurement</span>
        </template>
        <a-menu-item key="procurementVendors">
          <router-link to="/procurement/vendors">Vendors</router-link>
        </a-menu-item>
        <a-menu-item key="procurementLsos">
          <router-link to="/procurement/lsos">LSOs / LPOs</router-link>
        </a-menu-item>
      </a-sub-menu>
      <!-- Events. Visibility is permission-first: any Events permission
           granted through Access Control exposes the menu — including for CHW
           roles such as Ward Health Care Worker, which used to be hidden
           behind isCommunityHealthWorker regardless of their grants. The
           national (level 1) oversight and the AIE Holder keep their historic
           visibility. -->
      <a-sub-menu
        key="events"
        v-if="isLevelOne || (isAIEHolder && canCreateCampaign) || canAccessEvents"
      >
        <template v-slot:title>
          <sdFeatherIcons type="twitch" /><span>Events</span>
        </template>
        <a-menu-item
          key="widgetEventsDashboard"
          v-if="isOversightUser || canViewEventsDashboard"
        >
          <router-link to="/events/dashboard"> Events Dashboard </router-link>
        </a-menu-item>
        <a-menu-item key="widgetCreateEvent" v-if="canCreateEvent">
          <router-link to="/events/event-create"> Create Event </router-link>
        </a-menu-item>
        <a-menu-item
          key="widgetListEvents"
          v-if="isLevelOne || isAIEHolder || canViewEvent"
        >
          <router-link to="/events/event-view"> List Events </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu
        key="activities"
        v-if="canCreateActivity || canViewActivities || isAIEHolder"
      >
        <template v-slot:title>
          <sdFeatherIcons type="activity" /><span>Activities</span>
        </template>
        <a-menu-item key="widgetsMyActivity" v-if="canViewActivities">
          <router-link to="/dashboard/my-activities">
            My Activities Dashboard
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetCreateActivity" v-if="canCreateActivity">
          <router-link to="/activities/activity-create">
            Create Activity
          </router-link>
        </a-menu-item>
        <a-menu-item
          key="widgetActivityPendingApproval"
          v-if="canViewActivities"
        >
          <router-link to="/activities/activity-pending-approval">
            Pending Approval
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetsListActivity" v-if="canListActivities">
          <router-link to="/activities/view-activities">
            List Activities
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="admin-units" v-if="!isCommunityHealthWorker">
        <template v-slot:title>
          <sdFeatherIcons type="cpu" />
          <span>Administrative Units</span></template
        >
        <a-menu-item key="widgetListOrgUnits">
          <router-link to="/org-units/view">
            <sdFeatherIcons type="map" />
            <span>Organization Units</span>
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu
        key="house-holds"
        v-if="canViewRegHH || canValidateHH || canReviewHHChanges || canViewNetsDistributed || isOversightUser"
      >
        <template v-slot:title>
          <sdFeatherIcons type="home" />
          <span>HouseHolds</span></template
        >

        <a-menu-item key="widgetHouseholdReg" v-if="canViewRegHH">
          <router-link to="/households/list">
            HouseHolds Registered
          </router-link>
        </a-menu-item>
        <a-sub-menu key="widgetHouseholdValidation" v-if="canValidateHH && !isLevelOne && !isCountyLevel">
          <template v-slot:title>
            HouseHolds Validation
          </template>
          <a-menu-item key="widgetHouseholdValidationDashboard">
            <router-link to="/household/validation/dashboard">
              Dashboard
            </router-link>
          </a-menu-item>
          <a-menu-item key="widgetHouseholdValidationHouseholds">
            <router-link to="/household/validation/households">
              Households
            </router-link>
          </a-menu-item>
          <a-menu-item key="widgetHouseholdValidationTransfers" v-if="canTransferHouseholds">
            <router-link to="/household/validation/transfers">
              Transfers
            </router-link>
          </a-menu-item>
          <a-menu-item key="widgetMyHHChangeRequests" v-if="canSubmitHHChanges">
            <router-link to="/household/my-change-requests">
              My Change Requests
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="widgetHouseholdChangeReview" v-if="canReviewHHChanges && isSchmtSubcountyUser">
          <router-link to="/household/change-requests/review">
            Change Request Review
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetHouseholdChangeOverview" v-if="isOversightUser">
          <router-link to="/household/change-requests/overview">
            Change Requests Overview
          </router-link>
        </a-menu-item>
        <a-menu-item key="widgetHouseholdIRS" v-if="canValidateHH">
          <router-link to="/household/irs">
            Household IRS
          </router-link>
        </a-menu-item>
        <a-menu-item v-if="isCommunityHealthWorker || isAdmin" key="hh-registration">
        <router-link to="/add-household">
          Register HouseHold
        </router-link>
      </a-menu-item>
        <!-- <a-menu-item key="widgetIncompleteHouseholdReg">
          <router-link to="/households-registrations/incomplete">
            Incomplete HouseHolds Registration
          </router-link>
        </a-menu-item> -->
        <!-- <a-menu-item key="widgetHouseholdNets" v-if="canViewNetsDistributed">
          <router-link to="/hh-nets-distributed">
            Nets Distributed
          </router-link>
        </a-menu-item> -->
      </a-sub-menu>
      <a-sub-menu
        key="distribution"
        v-if="canViewRegHH || canValidateHH || canViewNetsDistributed"
      >
        <template v-slot:title>
          <sdFeatherIcons type="share" />
          <span>Distribution</span></template
        >

        <a-menu-item key="netDistribution" v-if="canViewRegHH">
          <router-link to="/nets/distributions">
            <sdFeatherIcons type="share-2" /><span> Nets Distribution </span>
          </router-link>
        </a-menu-item>
        <a-menu-item v-if="canIssueNets" key="nets-issuance">
        <router-link to="/issue-nets">
          <sdFeatherIcons type="share-2" /><span> Issue Nets </span>
        </router-link>
      </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="warehouses" v-if="canViewDropOffPoint">
        <template v-slot:title>
          <sdFeatherIcons type="package" /><span>Warehouses</span>
        </template>
        <a-menu-item key="widgetListWarehouses">
          <router-link to="/nets/warehouses"> List Warehouses </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu
        key="drop-off-point"
        v-if="canCreateDropOffPoint || canViewDropOffPoint"
      >
        <template v-slot:title>
          <sdFeatherIcons type="map-pin" /><span>Drop-off Point</span>
        </template>
        <!-- <a-menu-item key="widgetDropOffPoint" v-if="canCreateDropOffPoint">
          <router-link to="/nets/distribution-point">
            Create Drop-off Point
          </router-link>
        </a-menu-item> -->
        <a-menu-item key="widgetListDropOffPoint" v-if="canViewDropOffPoint">
          <router-link to="/nets/distribution-points">
            List Drop-off
          </router-link>
        </a-menu-item>
        <a-menu-item
          key="widgetDropOffPointReceives"
          v-if="canViewDropOffPoint"
        >
          <router-link to="/nets/drop-off"> Drop-off Receipts </router-link>
        </a-menu-item>
        <a-menu-item key="widgetListIssuance" v-if="canViewDropOffPoint">
          <router-link to="/nets/issuance-linelist">
            Drop-off Issues
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu
        key="nets-distribution"
        v-if="canCreateDistributionPost || canViewDistributitionPostRole || isOversightUser"
      >
        <template v-slot:title>
          <sdFeatherIcons type="share-2" /><span>Distribution Post</span>
        </template>
        <!-- <a-menu-item key="widgetCreatePost" v-if="canCreateDistributionPost">
          <router-link to="/nets/post-create"> Create Post </router-link>
        </a-menu-item> -->
        <a-menu-item
          key="widgetDistributionDashboard"
          v-if="isOversightUser"
        >
          <router-link to="/nets/distribution-dashboard">
            Distribution Dashboard
          </router-link>
        </a-menu-item>
        <a-menu-item
          key="widgetDistributionPost"
          v-if="canViewDistributitionPostRole"
        >
          <router-link to="/nets/distribution-post">
            Distribution Posts
          </router-link>
        </a-menu-item>
        <a-menu-item
          key="widgetDistributionPostOrders"
          v-if="canViewDistributitionPostRole"
        >
          <router-link to="/nets/distribution-order-summary">
            Posts Order Summary
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="inventory" v-if="canViewInventory">
        <template v-slot:title>
          <sdFeatherIcons type="layers" /><span>Inventory</span>
        </template>
        <a-menu-item key="widgetNetsDropOff">
          <router-link to="/nets/distribution-point-nets">
            Dropoff-Point Nets
          </router-link>
        </a-menu-item>
        <!-- <a-menu-item key="widgetNetsReceived">
          <router-link to="/nets/nets-delivered"> Post Nets </router-link>
        </a-menu-item> -->
        <a-menu-item key="widgetPostSummary">
          <router-link to="/nets/post-summary"> Posts Summary </router-link>
        </a-menu-item>
        <a-menu-item key="widgetSupervisorReview">
          <router-link to="/nets/supervisor-review">
            Stock Review
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="supply-chain" v-if="canViewInventory">
        <template v-slot:title>
          <sdFeatherIcons type="database" /><span>Supply Chain</span>
        </template>

        <a-sub-menu key="meds-issuance">
          <template v-slot:title>
            <sdFeatherIcons type="globe" /><span>MEDS</span>
          </template>
          <a-menu-item key="meds-orders">
            <router-link to="/meds-orders">Orders </router-link>
          </a-menu-item>
          <a-menu-item key="meds-issues">
            <router-link to="/meds-issues">Drop-off Deliveries</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="kemsa-issuance">
          <template v-slot:title>
            <sdFeatherIcons type="table" /><span>KEMSA</span>
          </template>
          <a-menu-item key="kemsa-orders/">
            <router-link to="/kemsa/order">Orders </router-link>
          </a-menu-item>
          <a-menu-item key="kemsa-issues">
            <router-link to="/kemsa/drop-off-deliveries"
              >Drop-off Deliveries</router-link
            >
          </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-sub-menu key="payroll" v-if="canViewPayroll">
        <template v-slot:title>
          <sdFeatherIcons type="credit-card" /><span>Payroll</span>
        </template>
        <a-sub-menu key="gf-payroll" v-if="canViewGFPayroll">
          <template v-slot:title>
            <sdFeatherIcons type="globe" /><span>Global Fund</span>
          </template>
          <a-menu-item key="gf-activity-payroll">
            <router-link to="/gf-activities-payroll"
              >Activity Payroll
            </router-link>
          </a-menu-item>
          <a-menu-item key="gf-event-payroll">
            <router-link to="/gf-event-payroll">Event Payroll </router-link>
          </a-menu-item>
          <a-menu-item key="widgetTransactionDetails">
            <router-link to="/view-transactions"
              >Transaction Details
            </router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="pmi-payroll" v-if="canViewPMIPayroll">
          <template v-slot:title>
            <sdFeatherIcons type="radio" /><span>PMI</span>
          </template>
          <a-menu-item key="pmi-activity-payroll">
            <router-link to="/pmi-activity-payroll"
              >Activity Payroll
            </router-link>
          </a-menu-item>
          <a-menu-item key="pmi-event-payroll">
            <router-link to="/pmi-event-payroll">Event Payroll </router-link>
          </a-menu-item>
          <a-menu-item key="widgetTransactionDetails">
            <router-link to="/view-transactions"
              >Transaction Details
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-sub-menu
        key="user-management"
        v-if="isAdmin || canViewUsers || canViewMasterlist"
      >
        <template v-slot:title>
          <sdFeatherIcons type="users" /><span>User Management</span>
        </template>
        <a-menu-item v-if="isAdmin || canViewMasterlist" key="widgetMasterList">
          <router-link to="/masterlist">Masterlist </router-link>
        </a-menu-item>
        <a-menu-item key="widgetUsers">
          <router-link to="/registered-users">Users </router-link>
        </a-menu-item>
        <a-menu-item key="widgetCHP">
          <router-link to="/users/view-chp-ve"
            >Registered CHP & VE
          </router-link>
        </a-menu-item>
        <!-- <a-menu-item key="widgetCHA">
          <router-link to="/users/cha"
            >Registered CHA
          </router-link>
        </a-menu-item> -->
        <a-menu-item v-if="isAdmin || canViewRoles" key="widgetRoles">
          <router-link to="/user-roles">Roles </router-link>
        </a-menu-item>
        <a-menu-item v-if="isAdmin || canViewAccessControl" key="widgetAccessControl">
          <router-link to="/admin/access-control">
            Access Control
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="data-management" v-if="isAdmin">
        <template v-slot:title>
          <sdFeatherIcons type="hard-drive" /><span>Data Management</span>
        </template>
        <a-menu-item v-if="isAdmin" key="admin-units">
          <router-link to="/import/admin-units">
            <span>Administrative Units </span>
          </router-link>
        </a-menu-item>
        <a-menu-item v-if="isAdmin" key="drop-off">
          <router-link to="/import/dropoff-points">
            <span>Drop-off Points </span>
          </router-link>
        </a-menu-item>
        <a-menu-item v-if="isAdmin" key="distribution-post">
          <router-link to="/import/distribution-posts">
            <span>Distribution Posts </span>
          </router-link>
        </a-menu-item>
      </a-sub-menu>
      <a-menu-item v-if="isAdmin || isTechSupport" key="massnet-admin">
        <router-link to="/admin-massnet">
          <sdFeatherIcons type="alert-triangle" /><span> Administrator </span>
        </router-link>
      </a-menu-item>
      <a-menu-item v-if="isAdmin" key="logs">
        <router-link to="/logs">
          <sdFeatherIcons type="clipboard" /><span> Audit Logs </span>
        </router-link>
      </a-menu-item>
      <a-menu-item v-if="isAdmin" key="server-metrics">
        <router-link to="/admin/server-metrics">
          <sdFeatherIcons type="activity" /><span> Server Metrics </span>
        </router-link>
      </a-menu-item>
    </a-menu-item-group>
  </a-menu>
</template>
<script>
import {
  computed,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect,
  defineComponent,
  onMounted,
} from "vue";
import VueTypes from "vue-types";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { fetchUserData, hasRoleByName, satisfiesGate } from "../services/user-role";
import { GATE_DEFINITIONS, SCHMT_ORG_TYPE_ID } from "../config/navigation-permissions";

// ── System flags & cross-cutting groups ──────────────────────────────────────
// All menu gates are defined in src/config/navigation-permissions.js
// (permission-first with role-name fallbacks). Only the "who manages the
// system" flags and the community-health-worker group stay local, and they are
// matched by role NAME (stable key from the API roles table) rather than IDs.
const ADMIN_ROLE_NAMES = ["Super Admin"];
const AIE_HOLDER_ROLE_NAMES = ["AIE Holder"];
const TECH_SUPPORT_ROLE_NAMES = ["Technical Support"];

// Community health workers are a cross-cutting group (not tied to a menu gate).
const CHW_ROLE_NAMES = [
  "CHV", // 52
  "Community Health Assistant", // 77
  "Post in Charge", // 39
  "Ward Health Care Worker", // 34
];

export default defineComponent({
  name: "AsideItems",
  props: {
    toggleCollapsed: VueTypes.func,
    events: VueTypes.object,
  },
  setup(props) {
    const store = useStore();
    const darkMode = computed(() => store.state.themeLayout.data);
    const mode = ref("inline");
    const { events } = toRefs(props);
    const {
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
    } = events.value;

    const level_id = ref("");
    const role_id = ref("");
    const org_types_id = ref("");
    const current = ref("");
    const rt = useRouter();

    // ── Access gates ─────────────────────────────────────────────────────────
    // System-management flags stay role-based (matched by role name)…
    const isAIEHolder = hasRoleByName(AIE_HOLDER_ROLE_NAMES);
    const isAdmin = hasRoleByName(ADMIN_ROLE_NAMES);
    const isTechSupport = hasRoleByName(TECH_SUPPORT_ROLE_NAMES);

    // …every menu gate is permission-first with a role fallback, driven by
    // the central registry so the Access Control page can manage it.
    const canCreateCampaign = satisfiesGate(GATE_DEFINITIONS.canCreateCampaign);
    const canViewCampaign = satisfiesGate(GATE_DEFINITIONS.canViewCampaign);
    // M&E (campaign supervision checklists)
    const canViewMeCompliance = satisfiesGate(GATE_DEFINITIONS.canViewMeCompliance);
    const canManageMeChecklists = satisfiesGate(GATE_DEFINITIONS.canManageMeChecklists);
    const canSubmitMeChecklists = satisfiesGate(GATE_DEFINITIONS.canSubmitMeChecklists);
    const canCompleteMeStages = satisfiesGate(GATE_DEFINITIONS.canCompleteMeStages);
    const canAccessMe = computed(
      () =>
        canViewMeCompliance.value ||
        canManageMeChecklists.value ||
        canSubmitMeChecklists.value ||
        canCompleteMeStages.value
    );
    const canCreateEvent = satisfiesGate(GATE_DEFINITIONS.canCreateEvent);
    const canViewEvent = satisfiesGate(GATE_DEFINITIONS.canViewEvent);
    // Events → Events Dashboard. Permission-first: the grant alone exposes the
    // item, so ward-level roles (e.g. Ward Health Care Worker) are no longer
    // blocked by the level-only isOversightUser fallback.
    const canViewEventsDashboard = satisfiesGate(
      GATE_DEFINITIONS.canViewEventsDashboard
    );
    // Any Events permission surfaces the Events submenu, which is how roles
    // outside the historic audiences (notably the CHW group) get the menu once
    // an admin grants it in Access Control.
    const canAccessEvents = computed(
      () =>
        canCreateEvent.value ||
        canViewEvent.value ||
        canViewEventsDashboard.value
    );
    const canCreateActivity = satisfiesGate(GATE_DEFINITIONS.canCreateActivity);
    const canViewActivities = satisfiesGate(GATE_DEFINITIONS.canViewActivities);
    // The single merged "List Activities" page is available to anyone who can
    // view activities OR any national (level 1) user — mirroring Events.
    const canListActivities = computed(
      () => canViewActivities.value || isAIEHolder.value || isLevelOne.value
    );
    const canViewOrgUnits = satisfiesGate(GATE_DEFINITIONS.canViewOrgUnits);
    const canViewRegHH = satisfiesGate(GATE_DEFINITIONS.canViewRegHH);
    const canValidateHH = satisfiesGate(GATE_DEFINITIONS.canValidateHH);
    const canReviewHHChanges = satisfiesGate(GATE_DEFINITIONS.canReviewHHChanges);
    const canSubmitHHChanges = satisfiesGate(GATE_DEFINITIONS.canSubmitHHChanges);
    // Household transfers live as a tab of the validation page: the CHA raises
    // them, the SCMCC / Super Admin approve or reject them. Either audience may
    // open the tab, so the entry is gated by the combined access gate.
    const canTransferHouseholds = satisfiesGate(GATE_DEFINITIONS.canAccessHouseholdTransfers);
    const canViewNetsDistributed = satisfiesGate(GATE_DEFINITIONS.canViewNetsDistributed);
    const canCreateDropOffPoint = satisfiesGate(GATE_DEFINITIONS.canCreateDropOffPoint);
    const canViewDropOffPoint = satisfiesGate(GATE_DEFINITIONS.canViewDropOffPoint);
    const canCreateDistributionPost = satisfiesGate(GATE_DEFINITIONS.canCreateDistributionPost);
    const canViewDistributitionPostRole = satisfiesGate(GATE_DEFINITIONS.canViewDistributitionPostRole);
    const canViewInventory = satisfiesGate(GATE_DEFINITIONS.canViewInventory);
    const canViewPayroll = satisfiesGate(GATE_DEFINITIONS.canViewPayroll);
    const canViewGFPayroll = satisfiesGate(GATE_DEFINITIONS.canViewGFPayroll);
    const canViewPMIPayroll = satisfiesGate(GATE_DEFINITIONS.canViewPMIPayroll);
    const canViewUsers = satisfiesGate(GATE_DEFINITIONS.canViewUsers);
    const canViewMasterlist = satisfiesGate(GATE_DEFINITIONS.canViewMasterlist);
    const canIssueNets = satisfiesGate(GATE_DEFINITIONS.canIssueNets);
    const canViewRoles = satisfiesGate(GATE_DEFINITIONS.canViewRoles);
    const canViewAccessControl = satisfiesGate(
      GATE_DEFINITIONS.canViewAccessControl
    );
    // Special Area Cost configuration (National Accountant + Super Admin).
    const canManageSpecialAreaCost = satisfiesGate(
      GATE_DEFINITIONS.canManageSpecialAreaCost
    );
    const isCommunityHealthWorker = hasRoleByName(CHW_ROLE_NAMES);
    const canAccessBudgeting = computed(
      () => !isCommunityHealthWorker.value && !!role_id.value
    );
    // Procurement / Vendor module — permission-first (granted to the
    // Procurement Officer by ProcurementRolePermissionSeeder), so the sidebar
    // entry follows Access Control instead of a hard-coded role id.
    const canViewProcurement = satisfiesGate(
      GATE_DEFINITIONS.canViewProcurement
    );
    // Budget → Financial Analysis sub-module (read-only). Permission-first, so
    // Access Control decides who sees it.
    const canViewFinancialAnalysis = satisfiesGate(
      GATE_DEFINITIONS.canViewFinancialAnalysis
    );
    // Budget → National budget workspace + AIE Holder acknowledgement.
    // Permission-first (the generators hold create_campaign_budget; the AIE
    // Holder holds approve_campaign_budget).
    const canViewNationalBudget = satisfiesGate(
      GATE_DEFINITIONS.canViewNationalBudget
    );

    onMounted(() => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      fetchUserData();
      if (!user) {
        rt.push({ path: "/auth/login" });
      } else {
        level_id.value = user.user.level_id;
        role_id.value = user.user.role_id;
        org_types_id.value = user.user.org_types_id;
      }
    });

    const isLevelOne = computed(() => {
      return level_id.value === 1;
    });

    const isCountyLevel = computed(() => {
      return level_id.value === 2;
    });

    const isSubCountyLevel = computed(() => {
      return level_id.value === 3;
    });

    /**
     * NATIONAL tier of the Budget module — level 1 (National) only.
     *
     * Every national budget sub-module (National Dashboard, County & S.County
     * Budget Review, Financial Analysis, National Budgeting and the National
     * Budget Acknowledgement) belongs to the national scope. County (2) and
     * Sub-County (3) users run their own chains (County / SubCounty Budgeting),
     * so each national sub-menu item is ANDed with this flag: a permission that
     * a county-tier role also holds for its own chain (e.g.
     * `create_campaign_budget`, `county_approve_campaign_budget`) can never
     * surface a national entry for them.
     *
     * Mirrors `meta.allowedLevels` (NATIONAL_BUDGET_LEVELS) on the national
     * budget routes, so a hand-typed URL lands on /403.
     */
    const canViewNationalTier = computed(() => isLevelOne.value);

    // Oversight users (National / County / Sub-County) for the distribution dashboard.
    const isOversightUser = computed(() => {
      return [1, 2, 3].includes(level_id.value);
    });

    // Approve / reject audience: sub-county (level 3) users whose role belongs
    // to the SCHMT org type (Sub-County Health Management Team — where the
    // SCMCC role lives). Mirrors the API check in
    // HouseHoldChangeRequestController::isScmcc and the review route meta.
    const isSchmtSubcountyUser = computed(() => {
      return (
        Number(level_id.value) === 3 &&
        Number(org_types_id.value) === SCHMT_ORG_TYPE_ID
      );
    });

    const router = computed(() => useRoute());
    const state = reactive({
      selectedKeys: ["home"],
      openKeys: ["dashboard"],
      preOpenKeys: ["dashboard"],
    });

    // const authService = new AuthService();

    watchEffect(() => {
      if (router.value.matched.length) {
        if (router.value.matched.length > 2) {
          state.selectedKeys = [router.value.matched[2].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        } else if (router.value.matched.length > 3) {
          state.selectedKeys = [router.value.matched[3].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        } else {
          state.selectedKeys = [router.value.matched[1].name];
          state.openKeys = [router.value.matched[1].name];
          state.preOpenKeys = [router.value.matched[1].name];
        }
      }
    });

    watch(
      () => state.openKeys,
      (val, oldVal) => {
        state.preOpenKeys = oldVal;
      }
    );

    return {
      mode,
      ...toRefs(state),
      darkMode,
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
      canCreateCampaign,
      level_id,
      current,
      role_id,
      isLevelOne,
      canViewNationalTier,
      isCountyLevel,
      isSubCountyLevel,
      isOversightUser,
      isSchmtSubcountyUser,
      isAdmin,
      isTechSupport,
      isAIEHolder,
      isCommunityHealthWorker,
      canAccessBudgeting,
      canViewProcurement,
      canViewFinancialAnalysis,
      canViewNationalBudget,
      canViewCampaign,
      canAccessMe,
      canViewMeCompliance,
      canManageMeChecklists,
      canSubmitMeChecklists,
      canCompleteMeStages,
      canCreateEvent,
      canViewEvent,
      canViewEventsDashboard,
      canAccessEvents,
      canCreateActivity,
      canViewOrgUnits,
      canViewActivities,
      canListActivities,
      canViewRegHH,
      canValidateHH,
      canReviewHHChanges,
      canSubmitHHChanges,
      canTransferHouseholds,
      canViewNetsDistributed,
      canCreateDropOffPoint,
      canViewDropOffPoint,
      canCreateDistributionPost,
      canViewDistributitionPostRole,
      canViewInventory,
      canViewPayroll,
      canViewUsers,
      canViewMasterlist,
      canIssueNets,
      canViewRoles,
      canViewAccessControl,
      canManageSpecialAreaCost,
      canViewGFPayroll,
      canViewPMIPayroll
    };
  },
});
</script>
