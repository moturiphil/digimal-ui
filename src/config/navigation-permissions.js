/**
 * Central RBAC registry for the UI.
 *
 * Access to every sidebar entry is governed here — NOT by scattered role-ID
 * arrays inside Aside.vue. A user passes a gate when they hold ANY listed
 * `permissions` (backend `role_permission` middleware names) OR ANY listed
 * `roles` (legacy fallback kept for areas that don't expose dedicated
 * permission names yet).
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
  canViewEvent: { permissions: ["event_list", "list_events", "events_dashboard"], roles: ["Super Admin"] },
  canCreateActivity: { permissions: ["create_activity", "create_activity_with_facilitator"], roles: ["Super Admin"] },
  canViewActivities: { permissions: ["activity_list", "pmi_activities", "gf_activities"], roles: ["Super Admin"] },
  canViewOrgUnits: { permissions: ["counties_list", "list_subcounties", "sub_counties_list", "location_list", "sublocation_list", "wards_list"], roles: ADMIN_UNIT_OVERSIGHT },
  canViewRegHH: { permissions: ["households", "web_household_create"], roles: HOUSEHOLD_VIEW_OVERSIGHT },
  canValidateHH: { permissions: ["household-validation", "household_validation", "hh_change_requests"], roles: ["Super Admin", "Community Health Assistant"] },
  canReviewHHChanges: { permissions: ["hh_change_request_review"], roles: ["Super Admin", "SCMCC"] },
  canSubmitHHChanges: { permissions: ["hh_change_request_store"], roles: ["Community Health Assistant"] },
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
    key: "budgeting",
    label: "Budgeting",
    pages: compact([
      { label: "National Dashboard", path: "/budget/national-dashboard", permissions: ["get_budget"] },
      { label: "County Budgeting", path: "/budget/county-budgeting", permissions: ["get_budget"] },
      { label: "SubCounty Budgeting", path: "/budget/budgeting", permissions: ["get_budget"] },
      // These three configuration pages are ADMIN (Super Admin) ONLY — the
      // sidebar renders them via the isAdmin role gate and the routes carry
      // meta.allowedRoles ["Super Admin"], so only an admin can open them.
      { label: "Budget Categories", path: "/budget/categories", permissions: ["get_budget_categories", "get_budget_category", "get_budget_category_parameters", "get_category_line_items_preview", "create_budget_category", "update_budget_category", "delete_budget_category"] },
      { label: "Budget Parameters", path: "/budget/parameters", permissions: ["get_budget_parameters", "get_budget_parameter", "create_budget_parameter", "update_budget_parameter", "delete_budget_parameter"] },
      { label: "Special Area Cost", path: "/budget/special-area-costs", permissions: ["get_county_profiles", "get_special_area_cost", "update_special_area_cost"] },
    ]),
  },
  {
    key: "procurement",
    label: "Procurement",
    pages: compact([
      { label: "Vendors", path: "/procurement/vendors", permissions: ["get_vendors"] },
      { label: "LSOs / LPOs", path: "/procurement/lsos", permissions: ["get_vendors"] },
    ]),
  },
  {
    key: "events",
    label: "Events",
    pages: compact([
      { label: "Events Dashboard", path: "/events/dashboard", permissions: ["events_dashboard"] },
      // The sidebar "Create Event" gate accepts BOTH names; expose both here so
      // deselecting really hides the menu (a role can otherwise keep the menu
      // open via the legacy event_with_facilitator_list grant with no checkbox
      // to revoke it).
      { label: "Create Event", path: "/events/event-create", permissions: ["create_events", "event_with_facilitator_list"] },
      { label: "List Events", path: "/events/event-view", permissions: ["event_list", "list_events", "events_dashboard"] },
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
      { label: "My Change Requests", path: "/household/my-change-requests", permissions: ["hh_change_request_store"] },
      { label: "Issue Nets", path: "/issue-nets", permissions: ["issue_nets"] },
    ]),
  },
  {
    key: "distribution",
    label: "Distribution & Posts",
    pages: compact([
      { label: "Nets Distribution", path: "/nets/distributions", permissions: ["households", "web_household_create"] },
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