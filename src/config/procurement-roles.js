/**
 * Centralised role IDs for the Procurement / Vendor module.
 *
 * Resolved from `roles` table in the MassNetCampaign backend.
 * Procurement Officer role seeded via ProcurementRolePermissionSeeder
 * (orgtype_id = 10, sub-county scope).
 */
export const PROCUREMENT_ROLES = Object.freeze({
  SUPER_ADMIN: 53,
  SCMCC: 37,
  ACCOUNTANT: 4,
  PROCUREMENT_OFFICER: 86,
});

const compact = (ids) => ids.filter((id) => id !== null && id !== undefined);

// All four procurement-aware roles can view the module.
export const PROCUREMENT_VIEW_ROLES = compact([
  PROCUREMENT_ROLES.SUPER_ADMIN,
  PROCUREMENT_ROLES.PROCUREMENT_OFFICER,
  PROCUREMENT_ROLES.SCMCC,
  PROCUREMENT_ROLES.ACCOUNTANT,
]);

// Roles that can create / edit vendors, bank accounts and LSOs.
export const PROCUREMENT_MANAGE_ROLES = compact([
  PROCUREMENT_ROLES.SUPER_ADMIN,
  PROCUREMENT_ROLES.PROCUREMENT_OFFICER,
  PROCUREMENT_ROLES.SCMCC,
]);

// Roles that can toggle (activate / deactivate) a vendor.
export const PROCUREMENT_APPROVE_ROLES = compact([
  PROCUREMENT_ROLES.SUPER_ADMIN,
  PROCUREMENT_ROLES.SCMCC,
]);

// Roles that can hard-delete a vendor.
export const PROCUREMENT_DELETE_ROLES = compact([
  PROCUREMENT_ROLES.SUPER_ADMIN,
  PROCUREMENT_ROLES.SCMCC,
]);
