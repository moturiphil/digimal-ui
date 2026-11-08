/**
 * Campaign post selection RBAC.
 *
 * Access is resolved from the permission NAMES the user holds (role permissions
 * ∪ direct grants) — exactly the names the backend `role_permission:`
 * middleware enforces. See DigiMalBackend/routes/api.php:
 *
 *   GET  posts_data                  → role_permission:distribution_post_list
 *   POST campaign_posts/confirm       → role_permission:confirm_campaign_posts
 *   POST campaign_posts/deactivate    → role_permission:confirm_campaign_posts
 *   POST campaign_posts/activate      → role_permission:confirm_campaign_posts
 *
 * Nothing here gates on role IDs: those are environment-specific.
 */

/** Read the posts of a campaign (GET posts_data → `distribution_post_list`). */
export const CAMPAIGN_POST_VIEW_PERMISSIONS = Object.freeze([
  'posts_data',
  'distribution_post_list',
]);

/**
 * Carry posts into the active campaign and stop / restart them in it
 * (campaign_posts/confirm | deactivate | activate).
 */
export const CAMPAIGN_POST_MANAGE_PERMISSIONS = Object.freeze(['confirm_campaign_posts']);

export const CAMPAIGN_POST_ALL_PERMISSIONS = Object.freeze([
  ...CAMPAIGN_POST_VIEW_PERMISSIONS,
  ...CAMPAIGN_POST_MANAGE_PERMISSIONS,
]);
