/**
 * Procurement / Vendor module RBAC.
 *
 * ── Why this is permission-based, not role-ID based ─────────────────────────
 * Access is resolved from the permission NAMES granted to the user (role
 * permissions ∪ direct user permissions) — exactly the names the backend
 * `role_permission:` middleware enforces (see routes/api.php and
 * ProcurementRolePermissionSeeder). Numeric role IDs are environment-specific
 * and drift between deployments: the module previously hard-coded
 * `PROCUREMENT_OFFICER: 86` while the seeded role was actually id 84, which is
 * precisely why the Procurement Officer could not see the module.
 *
 * The IDs below are kept for reference / debugging only. They mirror the local
 * `roles` table and are re-printed whenever
 * `php artisan db:seed --class=ProcurementRolePermissionSeeder` runs.
 * NOTHING should gate on them.
 */
export const PROCUREMENT_ROLE_IDS = Object.freeze({
  SUPER_ADMIN: 53,
  SCMCC: 37,
  CMCC: 21,
  ACCOUNTANT: 4,
  FINANCE_OFFICER: 85,
  PROCUREMENT_OFFICER: 84,
});

/** Read access to the Vendors + LSOs pages. */
export const PROCUREMENT_VIEW_PERMISSIONS = Object.freeze([
  "get_vendors",
  "get_vendor",
]);

/**
 * Creation / update actions across the vendor aggregate (the vendor itself
 * plus its bank accounts, contacts and LSOs/LPOs). Holding ANY of these lets
 * the user open the create / edit dialogs.
 */
export const PROCUREMENT_MANAGE_PERMISSIONS = Object.freeze([
  "create_vendor",
  "update_vendor",
  "search_erp_vendors",
  "create_vendor_bank_account",
  "update_vendor_bank_account",
  "create_vendor_contact",
  "update_vendor_contact",
  "create_vendor_lso",
  "update_vendor_lso",
]);

/** Activate / deactivate a vendor (approval step). */
export const PROCUREMENT_APPROVE_PERMISSIONS = Object.freeze([
  "toggle_vendor_status",
]);

/** Hard-delete a vendor. */
export const PROCUREMENT_DELETE_PERMISSIONS = Object.freeze([
  "delete_vendor",
]);
