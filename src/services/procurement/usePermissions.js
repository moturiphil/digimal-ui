import { canAny } from '@/services/user-role';
import {
  PROCUREMENT_VIEW_PERMISSIONS,
  PROCUREMENT_MANAGE_PERMISSIONS,
  PROCUREMENT_APPROVE_PERMISSIONS,
  PROCUREMENT_DELETE_PERMISSIONS,
} from '@/config/procurement-roles';

/**
 * Returns reactive computed booleans for the procurement permissions.
 * Use directly in <script setup> or inside a component's setup().
 *
 * Resolved from the permission NAMES the user holds (role permissions ∪ direct
 * grants) — the same names the backend `role_permission:` middleware enforces.
 * This deliberately does NOT match on role IDs: those are environment-specific
 * and a stale id (e.g. the old `PROCUREMENT_OFFICER: 86` vs the seeded 84) would
 * silently hide the whole module / its action buttons.
 */
export function useProcurementPermissions() {
  return {
    canViewVendors: canAny(PROCUREMENT_VIEW_PERMISSIONS),
    canManageVendors: canAny(PROCUREMENT_MANAGE_PERMISSIONS),
    canApproveVendor: canAny(PROCUREMENT_APPROVE_PERMISSIONS),
    canDeleteVendor: canAny(PROCUREMENT_DELETE_PERMISSIONS),
  };
}
