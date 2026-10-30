import { computed } from 'vue';
import { canAny } from '@/services/user-role';
import {
  ME_VIEW_PERMISSIONS,
  ME_MANAGE_PERMISSIONS,
  ME_SUBMIT_PERMISSIONS,
  ME_STAGE_COMPLETE_PERMISSIONS,
  ME_STRUCTURE_PERMISSIONS,
} from '@/config/me-permissions';

/**
 * Reactive M&E permissions.
 *
 * Resolved from the permission NAMES the user holds (role permissions ∪ direct
 * grants) — the same names the backend `role_permission:` middleware enforces.
 * Use directly in <script setup> or inside a component's setup().
 */
export function useMePermissions() {
  const canViewCompliance = canAny(ME_VIEW_PERMISSIONS);
  const canManageChecklists = canAny(ME_MANAGE_PERMISSIONS);
  const canSubmitChecklists = canAny(ME_SUBMIT_PERMISSIONS);
  const canCompleteStages = canAny(ME_STAGE_COMPLETE_PERMISSIONS);
  const canViewStructure = canAny(ME_STRUCTURE_PERMISSIONS);

  const canAccessModule = computed(
    () =>
      canViewCompliance.value ||
      canManageChecklists.value ||
      canSubmitChecklists.value ||
      canCompleteStages.value,
  );

  return {
    canViewCompliance,
    canManageChecklists,
    canSubmitChecklists,
    canCompleteStages,
    canViewStructure,
    canAccessModule,
  };
}
