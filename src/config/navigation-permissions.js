/**
 * Central RBAC registry for the UI.
 *
 * Access to every sidebar entry is governed here — NOT by scattered role-ID
 * arrays inside Aside.vue. A user passes a gate when they hold ANY listed
 * `permissions` — the permission NAMES the backend `role_permission:`
 * middleware enforces (role permissions ∪ direct user grants).
 *
 * IMPORTANT — evaluation is PERMISSION-ONLY (see satisfiesGate in
 * src/services/user-role.js). The `roles` arrays in GATE_DEFINITIONS are kept
 * purely as documentation of the audience the grants were seeded to; a role
 * NAME alone never satisfies a gate. That is deliberate: when role-name
 * fallbacks exist, revoking a permission in Access Control leaves the menu
 * visible, which is exactly the "permissions were assigned/removed but the
 * menu did not change" class of bug.
 *
 * The same registry powers the "Access Control" admin page
 * (view/pages/admin/AccessControl.vue), so the list of UI pages shown there
 * stays in sync with what the sidebar actually renders.
 */

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ROLE CATALOG — aligned with the `roles` table (id, name, orgtype_id).
 * Each entry mirrors one row of the roles table so the UI gate lists and the
 * Access Control page are self-documenting and match production data.
 * ─────────────────────────────────────────────────────────────────────────────
 */
/**
 * Reusable role groups — role NAMES resolved against the API-fetched roles
 * table (see src/services/rbac-lookup.js). Gate evaluation matches these
 * names to the logged-in user's session role name, so no role IDs are
 * hard-coded in this file.
 */
import { loadRolesOrgTypes, toRoleId, roleLevel, rolesForLevel, roleLabel } from "../services/rbac-lookup";

export { loadRolesOrgTypes, toRoleId, roleLevel, rolesForLevel, roleLabel };

/**
 * Household change-request audiences.
 *
 * • READ-ONLY OVERVIEW — available to every national (1), county (2) and
 *   sub-county (3) user; the API scopes the data by the caller's location
 *   (national = everything, county = own county, sub-county = own sub-county).
 * • APPROVE / REJECT — restricted to sub-county (level 3) users who belong to
 *   the SCHMT org type (Sub-County Health Management Team, org type 10), which
 *   is where the SCMCC role lives. Enforced in the router guard
 *   (meta.allowedLevels + meta.allowedOrgTypes) AND in the API
 *   (HouseHoldChangeRequestController::isScmcc).
 */
export const HH_CHANGE_OVERVIEW_LEVELS = Object.freeze([1, 2, 3]);
export const HH_CHANGE_REVIEW_LEVELS = Object.freeze([3]);
export const SCHMT_ORG_TYPE_ID = 10;

/**
 * National scope — levels table: 1 = National, 2 = County, 3 = Sub-County.
 *
 * The whole NATIONAL tier of the Budget module is LEVEL 1 ONLY:
 *
 *   • National Dashboard              /budget/national-dashboard
 *   • County & S.County Budget Review /budget/national-review
 *   • Financial Analysis              /budget/financial-analysis
 *   • National Budgeting              /budget/national-budgeting
 *
 * County (2) and Sub-County (3) users run their OWN chains (County Budgeting /
 * SubCounty Budgeting) and have no business in the national one, so those
 * entries are never rendered for them (Aside.vue `canViewNationalTier`) and
 * every national route carries `meta.allowedLevels: NATIONAL_BUDGET_LEVELS` —
 * a hand-typed URL lands on /403 instead of a national page.
 *
 * This is a LEVEL gate, not a permission gate, on purpose: the national
 * budget permissions (`create_campaign_budget`, `county_approve_campaign_budget`,
 * `approve_campaign_budget`) are ALSO held by county-tier roles for their own
 * chains, so a permission-only gate would leak the national menus to them.
 * Mirrors the API-side business-role gates in CampaignBudgetController /
 * BudgetEditAccessService.
 */
export const NATIONAL_BUDGET_LEVELS = Object.freeze([1]);

const NATIONAL_MANAGEMENT = Object.freeze(["Super Admin","AIE Holder","Program head","Program officer - DNMP","Accountant","Finance Officer","Vector Unit Head","Program officer - MOH","MOH leadership","KEMSA","Program officer - TNT","Afya Ugavi","Kinga Malaria","LFA","Technical Support","Program Accountant","Development Agency","HealthIT Leadership","Procurement Officer"]);

const COUNTY_MANAGEMENT = Object.freeze(["County Admin","County Commissioner","CMCC","CHRIO","CDH","CHMT Leadership","County Health Team"]);

const ADMIN_UNIT_OVERSIGHT = Object.freeze([...NATIONAL_MANAGEMENT, ...COUNTY_MANAGEMENT, "Ward Health Care Worker","SCHRIO","SCMCC","Post in Charge","Ward Administrator","Sub County Health Team","SCDSC","Community Health Assistant"]);

const HOUSEHOLD_VIEW_OVERSIGHT = Object.freeze([...ADMIN_UNIT_OVERSIGHT, "Ward PHO", "Kinga Malaria - AIE Holder"]);

const NETS_MANAGEMENT = Object.freeze([...NATIONAL_MANAGEMENT, ...COUNTY_MANAGEMENT, "Ward Health Care Worker","SCHRIO","SCMCC","Post in Charge","Ward Administrator","Sub County Health Team","SCDSC","Community Health Assistant","MEDS","Kinga Malaria - AIE Holder","Driver - DNMP"]);

const DROPOFF_CREATE = Object.freeze(["Super Admin","AIE Holder","Program head","Program officer - DNMP","Accountant","Finance Officer","Vector Unit Head","Program officer - MOH","MOH leadership","KEMSA","Program officer - TNT","Afya Ugavi","Kinga Malaria","Technical Support","Program Accountant", ...COUNTY_MANAGEMENT, "Ward Health Care Worker","SCHRIO","SCMCC","Post in Charge","Ward Administrator","Sub County Health Team","SCDSC"]);

const DROPOFF_VIEW = Object.freeze([...HOUSEHOLD_VIEW_OVERSIGHT, "MEDS", "Kinga Malaria - AIE Holder", "Program Accountant"]);

const POST_VIEW = Object.freeze([...HOUSEHOLD_VIEW_OVERSIGHT, "MEDS", "Kinga Malaria - AIE Holder", "LFA"]);

const USER_VIEW = Object.freeze(["Super Admin","AIE Holder","Program head","Program officer - DNMP","Vector Unit Head","Program officer - MOH","MOH leadership","Program officer - TNT","Afya Ugavi","Kinga Malaria","County Commissioner","Driver - County Admin","CHMT Leadership","County Health Team","CDH","CHRIO","CMCC","Ward Health Care Worker","SCHRIO","SCMCC","Post in Charge","Ward Administrator","Development Agency","Technical Support","HealthIT Leadership","LFA","Sub County Health Team","Ward PHO","Sub-County Community Focal Person","Kinga Malaria - AIE Holder","Procurement Officer"]);

const POST_CREATE = Object.freeze(["Super Admin","Vector Unit Head","Program officer - DNMP","Program officer - MOH","MOH leadership","KEMSA","Program officer - TNT","Afya Ugavi","Kinga Malaria","CMCC","Ward Health Care Worker","SCHRIO","SCMCC","Post in Charge","Ward Administrator","Sub County Health Team","HealthIT Leadership"]);

const compact = (items) => items.filter((item) => item !== null && item !== undefined);

/**
 * Permission names must match the route names used by the backend
 * `role_permission:` middleware (see app/Http/Middleware/RolePermissionMiddleware.php).
 * `roles` are role NAMES from the API roles table, matched against the session
 * role — keep them in sync with the backend `roles` seed.
 */
export const GATE_DEFINITIONS = Object.freeze({
  canCreateCampaign: { permissions: ["create_campaign"], roles: ["Super Admin", "Vector Unit Head"] },
  canViewCampaign: { permissions: ["campaigns_list", "get_campaign"], roles: ["Super Admin"] },
  canCreateEvent: { permissions: ["create_events", "event_with_facilitator_list"], roles: ["Super Admin", "SCMCC", "CMCC"] },
  // Events → List Events. The page loads `events/all`, which the API enforces
  // with `role_permission:list_events`; `event_list` covers the legacy
  // event-list / venue endpoints.
  canViewEvent: { permissions: ["event_list", "list_events"], roles: ["Super Admin"] },
  // Events → Events Dashboard. The page is identified by the `events_dashboard`
  // route name, while GET events/dashboard is enforced with `list_events` (see
  // DigiMalBackend/routes/api.php). Accept both so an Access Control grant of
  // either name exposes the page in the sidebar — the page mapping below
  // grants both together.
  canViewEventsDashboard: { permissions: ["events_dashboard", "list_events"], roles: ["Super Admin"] },
  canCreateActivity: { permissions: ["create_activity", "create_activity_with_facilitator"], roles: ["Super Admin"] },
  canViewActivities: { permissions: ["activity_list", "pmi_activities", "gf_activities"], roles: ["Super Admin"] },
  canViewOrgUnits: { permissions: ["counties_list", "list_subcounties", "sub_counties_list", "location_list", "sublocation_list", "wards_list"], roles: ADMIN_UNIT_OVERSIGHT },
  canViewRegHH: { permissions: ["households", "web_household_create"], roles: HOUSEHOLD_VIEW_OVERSIGHT },
  canValidateHH: { permissions: ["household-validation", "household_validation", "hh_change_requests"], roles: ["Super Admin", "Community Health Assistant"] },
  // SCMCC (role 37) / SCHMT review queue — the page loads
  // `hh_change_requests/pending` and decides through the approve / reject
  // endpoints, so the gate must reference THOSE names (the previous
  // `hh_change_request_review` was never a backend route or permission, so the
  // gate could never be satisfied and the menu stayed hidden from SCMCC).
  canReviewHHChanges: {
    permissions: [
      "hh_change_requests_pending",
      "hh_change_request_approve",
      "hh_change_request_reject",
    ],
    roles: ["Super Admin", "SCMCC"],
  },
  // CHA (role 77) submission entry points — these are the five route names the
  // CHA posts to (routes/api.php). `hh_change_request_store` does not exist;
  // that name belongs to the user change-request flow.
  canSubmitHHChanges: {
    permissions: [
      "hh_change_request_create",
      "hh_change_request_mute",
      "hh_change_request_transfer",
      "hh_change_request_phone_change",
      "hh_change_request_head_change",
    ],
    roles: ["Community Health Assistant"],
  },
  /**
   * Household transfers (CHA flow, inside HouseHolds Validation).
   *
   * The CHA searches for a household, moves it to a village inside their own
   * sub-location and assigns it to a post mapped to that sub-location
   * (routes/api.php → HOUSEHOLD TRANSFER). Approval is a separate gate: an
   * SCMCC/Super Admin decides with approve_household_transfer /
   * reject_household_transfer.
   */
  canTransferHouseholds: {
    permissions: [
      "search_household_for_transfer",
      "initiate_household_transfer",
      "list_household_transfers",
    ],
    roles: ["Community Health Assistant"],
  },
  /**
   * Seeing the Transfers entry at all: either raise them (CHA) or decide them
   * (SCMCC / Super Admin). The actions inside are gated separately by
   * canTransferHouseholds (search + initiate) and canApproveHouseholdTransfers.
   */
  canAccessHouseholdTransfers: {
    permissions: [
      "search_household_for_transfer",
      "initiate_household_transfer",
      "list_household_transfers",
      "approve_household_transfer",
      "reject_household_transfer",
    ],
    roles: ["Community Health Assistant", "SCMCC", "Super Admin"],
  },
  canApproveHouseholdTransfers: {
    permissions: ["approve_household_transfer", "reject_household_transfer"],
    roles: ["SCMCC", "Super Admin"],
  },
  canViewNetsDistributed: { permissions: ["net_distribution_by_post"], roles: NETS_MANAGEMENT },
  canCreateDropOffPoint: { permissions: ["create_drop_off_point"], roles: DROPOFF_CREATE },
  canViewDropOffPoint: { permissions: ["drop_off_points_list", "drop_off_receipts"], roles: DROPOFF_VIEW },
  canCreateDistributionPost: { permissions: ["create_distribution_post"], roles: POST_CREATE },
  canViewDistributitionPostRole: { permissions: ["posts_data", "post_order_summary"], roles: POST_VIEW },
  canViewInventory: { permissions: ["post_daily_balance", "get_post_nets_distribution_summary"], roles: ["Super Admin"] },
  canViewPayroll: { permissions: ["draft_events_pay_roll", "draft_activity_pay_roll"], roles: ["Super Admin"] },
  canViewGFPayroll: { permissions: ["draft_events_pay_roll"], roles: ["Super Admin"] },
  canViewPMIPayroll: { permissions: ["draft_activity_pay_roll"], roles: ["Super Admin"] },
  canViewUsers: { permissions: ["users_list", "view_user_details"], roles: USER_VIEW },
  canViewMasterlist: { permissions: ["export_masterlist", "sync_masterlist"], roles: ["Technical Support", "Program officer - MOH", "Program officer - DNMP"] },
  // "Issue Nets" was previously shown to community health workers + admins via
  // hard-coded role flags in the sidebar; it is now a managed permission with a
  // role fallback that preserves exactly that audience.
  canIssueNets: {
    permissions: ["issue_nets"],
    roles: ["Super Admin", "Technical Support", "CHV", "Community Health Assistant", "Post in Charge", "Ward Health Care Worker"],
  },
  // Role management + access control screens. Role-name fallback removed
  // (permission-only evaluation) — these are governed purely by the granted
  // permission names.
  canViewRoles: {
    permissions: ["roles_list", "update_user_role", "create_role"],
    roles: [],
  },
  canViewAccessControl: {
    permissions: ["assign_permissions_to_role", "update_user_role"],
    roles: [],
  },
  // Special Area Cost configuration — National Accountant + Super Admin.
  // Reading the mapping is granted through `get_special_area_cost`; the
  // catalogue (Cost Items tab) is driven by the *_special_area_cost_item
  // permissions. Evaluated permission-first, so an admin can extend the
  // audience from the Access Control page.
  canManageSpecialAreaCost: {
    permissions: [
      "get_special_area_cost",
      "update_special_area_cost",
      "get_special_area_cost_items",
      "create_special_area_cost_item",
      "update_special_area_cost_item",
      "delete_special_area_cost_item",
      "update_special_area_cost_category",
    ],
    roles: ["Super Admin", "Accountant"],
  },
  // Procurement / Vendor module (Vendors + LSOs pages). Evaluated
  // permission-first, so the Procurement Officer sees the sidebar entry purely
  // because the backend ProcurementRolePermissionSeeder grants `get_vendors` /
  // `get_vendor` — no hard-coded role id needed. The `roles` list documents the
  // audience the seeder provisions so Access Control stays self-describing.
  canViewProcurement: {
    permissions: ["get_vendors", "get_vendor"],
    roles: ["Super Admin", "Procurement Officer", "SCMCC", "CMCC", "Accountant", "Finance Officer"],
  },
  // Financial Analysis — read-only sub-module of the Budget module (approved
  // budgets rolled up by county → component and split by cost group, plus the
  // financial indicators). Evaluated permission-first: the backend
  // BudgetRolePermissionSeeder grants `get_budget_financial_analysis` to EVERY
  // National (level 1) role, so the page is visible to the whole national
  // audience. The `roles` list below is only the legacy name fallback kept for
  // the original budget reviewers / approvers — the grant (not this list) is
  // what exposes the page to the other national roles, so Access Control stays
  // authoritative.
  //
  // The menu additionally requires the NATIONAL tier (`canViewNationalTier`,
  // level 1 only): the payload covers EVERY county, so county / sub-county
  // users are excluded even if the permission is granted to their role.
  canViewFinancialAnalysis: {
    permissions: ["get_budget_financial_analysis"],
    roles: ["Super Admin", "Accountant", "Finance Officer", "Program Accountant", "Program head", "DNMP GF Manager", "Vector Unit Head"],
  },
  // National budget workspace. Evaluated
  // permission-first: the PREPARERS hold `create_campaign_budget`, the
  // REVIEWERS `county_approve_campaign_budget`, and the APPROVERS (Finance
  // Officer / GF Manager / AIE Holder) `approve_campaign_budget` — so Access
  // Control decides the audience.
  // Mirrors BudgetEditAccessService::NATIONAL_*_ROLES.
  //
  // NB county-tier roles hold the same permission names for their own county /
  // sub-county chains, so this gate alone would leak the national menus to
  // them. The sidebar therefore ANDs it with the NATIONAL tier
  // (`canViewNationalTier`, level 1 only — see NATIONAL_BUDGET_LEVELS).
  canViewNationalBudget: {
    permissions: [
      "create_campaign_budget",
      "submit_campaign_budget",
      "county_approve_campaign_budget",
      "approve_campaign_budget",
    ],
    // Legacy name fallback — the documented national chain:
    //   prepare (draft → submitted)             : Vector Unit Head |
    //                                             Program officer - DNMP
    //   review  (submitted → national_approved) : Accountant |
    //                                             Program Accountant |
    //                                             Finance Officer
    //   acknowledge (→ approved)                : AIE Holder
    roles: [
      "Super Admin",
      "Vector Unit Head",
      "Program officer - DNMP",
      "Accountant",
      "Program Accountant",
      "Finance Officer",
      "DNMP GF Manager",
      "AIE Holder",
    ],
  },
  // ── M&E campaign supervision checklists ──────────────────────────────────
  // Permission names mirror the backend `role_permission:` middleware on the
  // me/* routes (see DigiMalBackend/routes/api.php).
  canViewMeCompliance: {
    permissions: ["me_compliance_view"],
    roles: ["Super Admin"],
  },
  canManageMeChecklists: {
    permissions: ["me_checklist_manage"],
    roles: ["Super Admin"],
  },
  canSubmitMeChecklists: {
    permissions: ["me_checklist_submit"],
    roles: ["Super Admin"],
  },
  canCompleteMeStages: {
    permissions: ["me_stage_complete"],
    roles: ["Super Admin"],
  },
  canViewMeChecklistStructure: {
    permissions: ["me_checklist_sections_questions"],
    roles: ["Super Admin"],
  },
});


/**
 * The pages / features an admin manages from the "Access Control" page.
 * `permissions` are the API permission names that gate each UI page — the
 * same strings the backend `role_permission` middleware enforces. Pages
 * without dedicated permissions are gated by role only (add names here as
 * the backend exposes them).
 */
export const NAV_MODULES = Object.freeze([
  {
    key: "dashboards",
    label: "Dashboards",
    pages: compact([
      {
        label: "Campaign Dashboard",
        path: "/",
        permissions: ["view_dashboard", "view_new_dashboard"],
      },
      { label: "M & E Dashboard", path: "/MNEDashboard", permissions: ["create_campaign"] },
      { label: "IRS Household Summary", path: "/irs/summary", permissions: ["create_campaign"] },
      { label: "County Campaign Summary", path: "/county/summary", permissions: [] },
    ]),
  },
  {
    key: "campaigns",
    label: "Campaigns",
    pages: compact([
      { label: "Create Campaign", path: "/campaigns/create-campaign", permissions: ["create_campaign"] },
      { label: "List Campaigns", path: "/campaigns/view-campaign", permissions: ["campaigns_list"] },
    ]),
  },
  {
    key: "me",
    label: "M&E",
    pages: compact([
      { label: "Stages", path: "/me/stages", permissions: ["me_compliance_view"] },
      { label: "Checklists", path: "/me/checklists", permissions: ["me_compliance_view"] },
      { label: "My Checklists", path: "/me/my-checklists", permissions: ["me_checklist_submit"] },
      { label: "Submissions", path: "/me/submissions", permissions: ["me_compliance_view"] },
      { label: "My Submissions", path: "/me/my-submissions", permissions: ["me_checklist_submit"] },
      { label: "Compliance", path: "/me/compliance", permissions: ["me_compliance_view"] },
    ]),
  },
  {
    key: "budgeting",
    label: "Budgeting",
    pages: compact([
      // NATIONAL tier (level 1) only — hidden from county / sub-county users
      // and additionally guarded by the route meta. See NATIONAL_BUDGET_LEVELS.
      { label: "National Dashboard", path: "/budget/national-dashboard", permissions: ["get_budget"] },
      { label: "County Budgeting", path: "/budget/county-budgeting", permissions: ["get_budget"] },
      { label: "SubCounty Budgeting", path: "/budget/budgeting", permissions: ["get_budget"] },
      // These three configuration pages are ADMIN (Super Admin) ONLY — the
      // sidebar renders them via the isAdmin role gate and the routes carry
      // meta.allowedRoles ["Super Admin"], so only an admin can open them.
      { label: "Budget Categories", path: "/budget/categories", permissions: ["get_budget_categories", "get_budget_category", "get_budget_category_parameters", "get_category_line_items_preview", "create_budget_category", "update_budget_category", "delete_budget_category"] },
      { label: "Budget Parameters", path: "/budget/parameters", permissions: ["get_budget_parameters", "get_budget_parameter", "create_budget_parameter", "update_budget_parameter", "delete_budget_parameter"] },
      { label: "Special Area Cost", path: "/budget/special-area-costs", permissions: ["get_county_profiles", "get_special_area_cost", "update_special_area_cost", "get_special_area_cost_items", "create_special_area_cost_item", "update_special_area_cost_item", "delete_special_area_cost_item", "update_special_area_cost_category"] },
      // The SEPARATE Special Area Cost budget (sub-county workspace). Shown to
      // whoever may create a campaign budget; the page itself checks that the
      // unit is SAC-mapped.
      { label: "Special Area Budget", path: "/budget/special-area-budget", permissions: ["create_campaign_budget", "submit_campaign_budget", "get_campaign_budgets"] },
      // Read-only financial analysis of the approved budgets (indicators + the
      // approved budget analysis split county → component → cost group).
      // NATIONAL tier (level 1) only — the figures are nationwide (national
      // approval rate, all counties), so county / sub-county users never see
      // the entry. See NATIONAL_BUDGET_LEVELS.
      { label: "Financial Analysis", path: "/budget/financial-analysis", permissions: ["get_budget_financial_analysis"] },
      // The NATIONAL budget workspace — same Budget module flow as County /
      // Sub-County budgeting. Preparers: Vector Unit Head, DNMP Program
      // Officer. Reviewers: Accountant, Program Accountant, Finance Officer.
      // NATIONAL tier (level 1) only: county / sub-county users hold these
      // permission names for their own chains, so the sidebar level-gates the
      // entry (Aside.vue canViewNationalTier) and the route carries
      // meta.allowedLevels. See NATIONAL_BUDGET_LEVELS.
      { label: "National Budgeting", path: "/budget/national-budgeting", permissions: ["create_campaign_budget", "submit_campaign_budget", "county_approve_campaign_budget"] },
    ]),
  },
  {
    key: "procurement",
    label: "Procurement",
    pages: compact([
      // The Vendors workspace: list / view / create / update vendors plus
      // their bank accounts and contacts. Permission names mirror the backend
      // `role_permission:` middleware so Access Control can grant each action
      // individually (see ProcurementRolePermissionSeeder).
      {
        label: "Vendors",
        path: "/procurement/vendors",
        permissions: [
          "get_vendors",
          "get_vendors_payload",
          "get_vendor",
          "create_vendor",
          "update_vendor",
          "delete_vendor",
          "toggle_vendor_status",
          "search_erp_vendors",
          "get_vendor_bank_accounts",
          "get_vendor_bank_account",
          "create_vendor_bank_account",
          "update_vendor_bank_account",
          "delete_vendor_bank_account",
          "set_primary_vendor_bank_account",
          "get_vendor_contacts",
          "get_vendor_contact",
          "create_vendor_contact",
          "update_vendor_contact",
          "delete_vendor_contact",
          "set_primary_vendor_contact",
          "get_banks",
          "get_bank",
          "get_counties",
          "get_subcounties",
          "get_service_types",
        ],
      },
      // The cross-vendor LSO / LPO register: list, upload, update and
      // download vendor LSOs. `get_vendors` / `get_vendor` are included
      // because each row renders its parent vendor.
      {
        label: "LSOs / LPOs",
        path: "/procurement/lsos",
        permissions: [
          "get_vendors",
          "get_vendor",
          "get_vendor_lsos",
          "get_vendor_lso",
          "create_vendor_lso",
          "update_vendor_lso",
          "delete_vendor_lso",
          "download_vendor_lso",
        ],
      },
    ]),
  },
  {
    key: "events",
    label: "Events",
    pages: compact([
      // `events_dashboard` is the route name the UI gate matches; the API
      // endpoint itself is enforced with `list_events`, so ticking this page
      // must grant BOTH or the dashboard loads its data with a 403.
      { label: "Events Dashboard", path: "/events/dashboard", permissions: ["events_dashboard", "list_events"] },
      // The sidebar "Create Event" gate accepts BOTH names; expose both here so
      // deselecting really hides the menu (a role can otherwise keep the menu
      // open via the legacy event_with_facilitator_list grant with no checkbox
      // to revoke it).
      { label: "Create Event", path: "/events/event-create", permissions: ["create_events", "event_with_facilitator_list"] },
      // `events/all` (loaded by the List Events page) is enforced with
      // `list_events`; `event_list` covers the legacy list/venue endpoints.
      { label: "List Events", path: "/events/event-view", permissions: ["event_list", "list_events"] },
    ]),
  },
  {
    key: "activities",
    label: "Activities",
    pages: compact([
      {
        label: "My Activities Dashboard",
        path: "/dashboard/my-activities",
        permissions: ["my_created_activities", "my_assigned_activities", "my_enrolled_activities"],
      },
      {
        label: "Create Activity",
        path: "/activities/activity-create",
        permissions: ["create_activity", "create_activity_with_facilitator"],
      },
      {
        label: "Pending Approval",
        path: "/activities/activity-pending-approval",
        permissions: ["activities_pending_approval", "approve_activity"],
      },
      {
        label: "List Activities",
        path: "/activities/view-activities",
        permissions: ["activity_list", "pmi_activities", "gf_activities"],
      },
    ]),
  },
  {
    key: "admin-units",
    label: "Administrative Units",
    pages: compact([
      {
        label: "Organization Units",
        path: "/org-units/view",
        permissions: ["counties_list", "list_subcounties", "location_list"],
      },
    ]),
  },
  {
    key: "households",
    label: "Households",
    pages: compact([
      { label: "HouseHolds Registered", path: "/households/list", permissions: ["households"] },
      // `household-validation` is the canonical name the API middleware
      // enforces (routes/api.php); `household_validation` is the legacy name
      // older grants were made against — keep both so a grant of either shows
      // the submenu and the dashboard actually loads.
      {
        label: "Households Validation",
        path: "/household/validation/dashboard",
        permissions: ["household-validation", "household_validation"],
      },
      // Household transfers — a tab of the validation page where the CHA
      // searches a household, moves it to a village inside their sub-location
      // and assigns it to a post. Same permission names as the API routes.
      {
        label: "Household Transfers",
        path: "/household/validation/transfers",
        permissions: [
          "search_household_for_transfer",
          "initiate_household_transfer",
          "list_household_transfers",
        ],
      },
      // CHA (role 77) submissions — the sidebar "My Change Requests" item is
      // gated by GATE_DEFINITIONS.canSubmitHHChanges, so list the same route
      // names here to keep Access Control and the sidebar in sync.
      {
        label: "My Change Requests",
        path: "/household/my-change-requests",
        permissions: [
          "hh_change_request_create",
          "hh_change_request_mute",
          "hh_change_request_transfer",
          "hh_change_request_phone_change",
          "hh_change_request_head_change",
          "hh_change_requests_history",
        ],
      },
      // SCMCC (role 37) / SCHMT review queue — approve or reject the changes
      // submitted by the CHAs of the reviewer's sub-county.
      {
        label: "Change Request Review",
        path: "/household/change-requests/review",
        permissions: [
          "hh_change_requests_pending",
          "hh_change_request_approve",
          "hh_change_request_reject",
          "hh_change_requests_history",
        ],
      },
      // Read-only overview of every change request, scoped by the caller's
      // location. Available to all national / county / sub-county users (the
      // sidebar item is level-gated via isOversightUser); the permissions below
      // are what the read-only API endpoints enforce.
      {
        label: "Change Requests Overview",
        path: "/household/change-requests/overview",
        permissions: [
          "hh_change_requests_national_summary",
          "hh_change_requests_national_county",
          "hh_change_requests_national_subcounty",
          "hh_change_requests_subcounty_summary",
        ],
      },
      { label: "Issue Nets", path: "/issue-nets", permissions: ["issue_nets"] },
    ]),
  },
  {
    key: "distribution",
    label: "Distribution & Posts",
    pages: compact([
      { label: "Nets Distribution", path: "/nets/distributions", permissions: ["households", "web_household_create"] },
      { label: "Warehouses", path: "/nets/warehouses", permissions: ["drop_off_points_list"] },
      { label: "List Drop-off", path: "/nets/distribution-points", permissions: ["drop_off_points_list", "drop_off_receipts"] },
      { label: "Distribution Post", path: "/nets/distribution-post", permissions: ["posts_data", "post_order_summary"] },
      { label: "Inventory", path: "/nets/distribution-point-nets", permissions: ["post_daily_balance", "get_post_nets_distribution_summary"] },
    ]),
  },

  {
    key: "payroll",
    label: "Payroll",
    pages: compact([
      { label: "Activity Payroll (GF)", path: "/gf-activities-payroll", permissions: ["draft_activity_pay_roll"] },
      { label: "Event Payroll (GF)", path: "/gf-event-payroll", permissions: ["draft_events_pay_roll"] },
      { label: "PMI Payroll", path: "/pmi-activities-payroll", permissions: ["draft_activity_pay_roll"] },
    ]),
  },
  {
    key: "user-management",
    label: "User Management",
    pages: compact([
      { label: "Masterlist", path: "/masterlist", permissions: ["export_masterlist", "sync_masterlist"] },
      { label: "Users", path: "/registered-users", permissions: ["users_list"] },
      { label: "Roles", path: "/user-roles", permissions: ["roles_list", "assign_permissions_to_role"] },
      { label: "Access Control", path: "/admin/access-control", permissions: ["assign_permissions_to_role", "update_user_role"] },
    ]),
  },
]);

/**
 * Flatten every permission name referenced by the navigation registry.
 * Used by the Access Control page to detect permissions not tied to a page.
 */
export const NAVIGATION_PERMISSIONS = Object.freeze(
  Array.from(
    new Set(
      NAV_MODULES.flatMap((mod) => mod.pages.flatMap((p) => p.permissions || []))
    )
  )
);