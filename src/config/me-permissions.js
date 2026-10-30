/**
 * M&E (Monitoring & Evaluation) module RBAC.
 *
 * Access is resolved from the permission NAMES the user holds (role permissions
 * ∪ direct grants) — exactly the names the backend `role_permission:`
 * middleware enforces (see DigiMalBackend/routes/api.php `me/*` routes and
 * database/migrations/2026_10_24_000003_grant_me_checklist_permissions.php).
 * Nothing here gates on role IDs: those are environment-specific.
 */

/** Read access to stages, checklists, submissions and the compliance report. */
export const ME_VIEW_PERMISSIONS = Object.freeze(['me_compliance_view']);

/** Create / edit stages, checklists, sections and questions. */
export const ME_MANAGE_PERMISSIONS = Object.freeze(['me_checklist_manage']);

/** Respond to checklists and edit own submissions. */
export const ME_SUBMIT_PERMISSIONS = Object.freeze(['me_checklist_submit']);

/** Complete / reopen a stage for an org unit. */
export const ME_STAGE_COMPLETE_PERMISSIONS = Object.freeze(['me_stage_complete']);

/**
 * Read a checklist's section -> question tree
 * (GET me/checklists/{checklist}/structure). Managers who can edit questions
 * are expected to hold this too; the detail page falls back to the
 * `me_checklist_submit` show endpoint when they do not.
 */
export const ME_STRUCTURE_PERMISSIONS = Object.freeze(['me_checklist_sections_questions']);

export const ME_ALL_PERMISSIONS = Object.freeze([
  ...ME_VIEW_PERMISSIONS,
  ...ME_MANAGE_PERMISSIONS,
  ...ME_SUBMIT_PERMISSIONS,
  ...ME_STAGE_COMPLETE_PERMISSIONS,
  ...ME_STRUCTURE_PERMISSIONS,
]);
