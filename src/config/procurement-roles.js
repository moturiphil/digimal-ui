/**
 * Centralised role IDs for the Procurement / Vendor module.
 *
 * Resolved from `roles` table in the MassNetCampaign backend.
 * Procurement Officer role seeded via ProcurementRolePermissionSeeder
 * (orgtype_id = 10, sub-county scope).
 *
 * Finance Officer is created by BudgetRolePermissionSeeder (orgtype_id = 2,
 * DNMP) with ALL of the Accountant's permissions. Its numeric ID depends on
 * the environment — copy it from the seeder's console output
 * ("Finance Officer: <id>") and paste below. Until then the role is
 * filtered out by `compact()` and simply does not see this module.
 */
export const PROCUREMENT_ROLES = Object.freeze({
  SUPER_ADMIN: 53,
  SCMCC: 37,
  CMCC: 21,
  ACCOUNTANT: 4,
  FINANCE_OFFICER: null,
  PROCUREMENT_OFFICER: 86,
});

const compact = (ids) => ids.filter((id) => id !== null && id !== undefined);

// All five procurement-aware roles can view the module.
export const PROCUREMENT_VIEW_ROLES = compact([
  PROCUREMENT_ROLES.SUPER_ADMIN,
  PROCUREMENT_ROLES.PROCUREMENT_OFFICER,
  PROCUREMENT_ROLES.SCMCC,
  PROCUREMENT_ROLES.CMCC,
  PROCUREMENT_ROLES.ACCOUNTANT,
  PROCUREMENT_ROLES.FINANCE_OFFICER, // inherits the Accountant's access
]);

// Roles that can create / edit vendors, bank accounts and LSOs.
export const PROCUREMENT_MANAGE_ROLES = compact([
  PROCUREMENT_ROLES.SUPER_ADMIN,
  PROCUREMENT_ROLES.PROCUREMENT_OFFICER,
  PROCUREMENT_ROLES.SCMCC,
  PROCUREMENT_ROLES.CMCC,
]);

// Roles that can toggle (activate / deactivate) a vendor.
export const PROCUREMENT_APPROVE_ROLES = compact([
  PROCUREMENT_ROLES.SUPER_ADMIN,
  PROCUREMENT_ROLES.SCMCC,
  PROCUREMENT_ROLES.CMCC,
]);

// Roles that can hard-delete a vendor.
export const PROCUREMENT_DELETE_ROLES = compact([
  PROCUREMENT_ROLES.SUPER_ADMIN,
  PROCUREMENT_ROLES.SCMCC,
  PROCUREMENT_ROLES.CMCC,
]);
