import { ref, computed } from "vue";
import axios from "@/Axiosconfig";

/**
 * RBAC lookup store — loads the `roles` and `org_types` tables from the API
 * once and keeps them in reactive state, so the navigation registry and the
 * Access Control page resolve role / org-type metadata without hard-coding
 * the tables in front-end code.
 *
 * Endpoints (both permission-gated in the backend):
 *   GET /roles          → array of { id, orgtype_id, name, orgtype_name }
 *   GET /organizations  → { success, data: [{ id, name, description, level_id }] }
 *
 * NOTE: gate evaluation in the sidebar never depends on this store — gates
 * match ROLE NAMES against the logged-in user's session `role.name`, so users
 * who lack the `roles_list` / `organization_list` permissions are unaffected.
 */

const roles = ref([]); // [{ id, orgtype_id, name, orgtype_name }]
const orgTypes = ref([]); // [{ id, name, description, level_id }]
const loaded = ref(false);
const loading = ref(false);
let inflight = null;

function normalizeArray(response, wrapperKey = "data") {
  const body = response?.data;
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body[wrapperKey])) return body[wrapperKey];
  return [];
}

const roleById = computed(() =>
  Object.fromEntries(roles.value.map((r) => [r.id, r]))
);

// Name→id map. Some role names repeat in the DB (e.g. "AMREF", "ACC"); the
// first occurrence wins for a stable resolution — none of the repeated names
// are used by the navigation gates today.
const roleIdByName = computed(() => {
  const map = {};
  roles.value.forEach((r) => {
    if (!(r.name in map)) map[r.name] = r.id;
  });
  return map;
});

const orgTypeById = computed(() =>
  Object.fromEntries(orgTypes.value.map((t) => [t.id, t]))
);

/**
 * Load roles + org types from the API. Safe to call multiple times — the
 * request is de-duplicated and only runs again when `force` is set.
 */
async function loadRolesOrgTypes({ force = false } = {}) {
  if (loaded.value && !force) return;
  if (inflight) return inflight;
  loading.value = true;
  inflight = (async () => {
    try {
      const [rolesRes, orgRes] = await Promise.all([
        axios.get("roles"),
        axios.get("organizations"),
      ]);
      roles.value = normalizeArray(rolesRes, "data");
      const orgs = normalizeArray(orgRes, "data");
      // The `organizations` endpoint excludes org type 1 (HealthIT), but the
      // Super Admin / Technical Support / HealthIT Leadership roles reference
      // it. Re-seed it so `roleLevel()` resolves for national roles.
      if (!orgs.some((t) => Number(t.id) === 1)) {
        orgs.unshift({ id: 1, name: "HealthIT", description: "UoN", level_id: 1 });
      }
      orgTypes.value = orgs;
      loaded.value = true;
    } catch (e) {
      console.error(
        "[rbac-lookup] Failed to load roles / org_types",
        e?.response?.data || e
      );
    } finally {
      loading.value = false;
      inflight = null;
    }
  })();
  return inflight;
}

/** Resolve a role name (or numeric id) to a numeric role id (or null). */
function toRoleId(ref) {
  if (ref == null) return null;
  if (typeof ref === "number") return Number(ref);
  return roleIdByName.value[ref] ?? null;
}

/** Scope level (1 = National, 2 = County, 3 = Sub-County) for a role id/name. */
function roleLevel(ref) {
  const id = toRoleId(ref);
  const meta = roleById.value[id];
  if (!meta) return null;
  const org = orgTypeById.value[meta.orgtype_id];
  return org ? Number(org.level_id) : null;
}

/** All role ids whose org type sits at the given scope level. */
function rolesForLevel(levelId) {
  const target = Number(levelId);
  return roles.value.filter((r) => roleLevel(r.id) === target).map((r) => r.id);
}

/** Display name for a role id (passes through names unchanged). */
function roleLabel(ref) {
  if (typeof ref === "string") return ref;
  return roleById.value[ref]?.name || `Role ${ref}`;
}

export {
  roles,
  orgTypes,
  loaded,
  loading,
  roleById,
  roleIdByName,
  orgTypeById,
  loadRolesOrgTypes,
  toRoleId,
  roleLevel,
  rolesForLevel,
  roleLabel,
};