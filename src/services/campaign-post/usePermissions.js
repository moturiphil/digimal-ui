import { canAny } from '@/services/user-role';
import {
  CAMPAIGN_POST_VIEW_PERMISSIONS,
  CAMPAIGN_POST_MANAGE_PERMISSIONS,
} from '@/config/campaign-post-permissions';

/**
 * Reactive campaign-post permissions.
 *
 * Resolved from the permission NAMES the user holds (role permissions ∪ direct
 * grants) — the same names the backend `role_permission:` middleware enforces.
 * Use directly in <script setup> or inside a component's setup().
 */
export function useCampaignPostPermissions() {
  return {
    // GET posts_data
    canViewCampaignPosts: canAny(CAMPAIGN_POST_VIEW_PERMISSIONS),
    // campaign_posts/confirm | deactivate | activate
    canManageCampaignPosts: canAny(CAMPAIGN_POST_MANAGE_PERMISSIONS),
  };
}
