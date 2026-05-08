import { hasRole } from '@/services/user-role';
import {
  PROCUREMENT_VIEW_ROLES,
  PROCUREMENT_MANAGE_ROLES,
  PROCUREMENT_APPROVE_ROLES,
  PROCUREMENT_DELETE_ROLES,
} from '@/config/procurement-roles';

/**
 * Returns reactive computed booleans for the procurement permissions.
 * Use directly in <script setup> or inside a component's setup().
 */
export function useProcurementPermissions() {
  return {
    canViewVendors: hasRole(PROCUREMENT_VIEW_ROLES),
    canManageVendors: hasRole(PROCUREMENT_MANAGE_ROLES),
    canApproveVendor: hasRole(PROCUREMENT_APPROVE_ROLES),
    canDeleteVendor: hasRole(PROCUREMENT_DELETE_ROLES),
  };
}
