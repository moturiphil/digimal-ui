import { ref, computed } from "vue";
import axios from "@/Axiosconfig";

/**
 * Reactive access state, kept in sync with the profile stored at login
 * (sessionStorage → user.user). The backend is the source of truth:
 * `user.role.permissions[]` carries the permission NAMES granted via the
 * user's role and the `role_permission` middleware enforces them per endpoint.
 */
const profile = ref(null);
const userRoles = ref([]); // role IDs
const userRoleNames = ref([]); // role names (from session role)
const rolePermissions = ref([]); // permission names from the user's role
const userPermissions = ref([]); // permission names granted directly to the user
const permissions = ref([]); // combined unique permission names

function parseProfile(raw) {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return (data && data.user) || data || null;
  } catch (e) {
    return null;
  }
}

function fetchUserData() {
  const p = parseProfile(sessionStorage.getItem("user"));
  profile.value = p;
  userRoles.value = p && p.role_id != null ? [Number(p.role_id)] : [];
  // The session stores the user's full role object (name + permissions), so we
  // can match role NAMES without needing the roles table for gate evaluation.
  userRoleNames.value = p && p.role && p.role.name ? [p.role.name] : [];
  const rolePerms = (p && p.role && p.role.permissions) || [];
  rolePermissions.value = rolePerms
    .map((x) => (x && x.name) || x)
    .filter(Boolean);
  const direct = (p && p.permissions) || [];
  userPermissions.value = direct
    .map((x) => (x && x.name) || x)
    .filter(Boolean);
  permissions.value = Array.from(
    new Set([...rolePermissions.value, ...userPermissions.value])
  );
  return Promise.resolve(!!p);
}

// Check if the user has a specific role (legacy helper, role-ID based).
function hasRole(roleIds) {
  return computed(() => userRoles.value.some((role) => roleIds.includes(role)));
}

/**
 * Re-sync the reactive access state from the backend without a re-login.
 *
 * Calls the self-service `GET /me` endpoint (returns the current user with
 * level / orgType / role / role.permissions — no permission required), merges
 * the fresh profile into the stored session while preserving the token, and
 * rebuilds every reactive ref so computed gates (`satisfiesGate`, `hasRole*`,
 * `canAny`, …) update immediately — permission grants/revocations by an admin
 * take effect on the next successful refresh instead of the next login.
 *
 * Safe to call often: no-op when unauthenticated, de-duplicated while a
 * request is in flight, and keeps the last known snapshot on failure (never
 * logs the user out).
 */
let refreshInflight = null;

async function refreshUserData() {
  if (!sessionStorage.getItem("user")) return Promise.resolve(false);
  if (refreshInflight) return refreshInflight;

  refreshInflight = (async () => {
    try {
      const res = await axios.get("me");
      const body = res.data || {};
      const data = Array.isArray(body.data) ? body.data[0] : body.data;
      if (data && (data.id || data.role || data.role_id)) {
        const raw = sessionStorage.getItem("user");
        let session = null;
        try {
          session = JSON.parse(raw) || {};
        } catch (e) {
          session = {};
        }
        if (typeof session !== "object") session = {};
        session.user = data; // fresh role + permissions (+ direct grants)
        sessionStorage.setItem("user", JSON.stringify(session));
        return fetchUserData();
      }
      return Promise.resolve(false);
    } catch (e) {
      // Network / auth error — keep the current snapshot. A 401 here means
      // the token itself is invalid; the route guard handles that path.
      return Promise.resolve(false);
    } finally {
      refreshInflight = null;
    }
  })();

  return refreshInflight;
}

// Check if the user's role matches any of the given role NAMES.
// Role names are the stable business key (aligns with the API roles table).
function hasRoleByName(roleNames) {
  const list = roleNames || [];
  return computed(() => userRoleNames.value.some((name) => list.includes(name)));
}

// Check if the user holds a specific permission name.
function hasPermission(permissionName) {
  return computed(() => permissions.value.includes(permissionName));
}

// True if the user holds ANY of the given permission names.
function canAny(permissionNames) {
  const list = permissionNames || [];
  return computed(() => list.some((n) => permissions.value.includes(n)));
}

// True if the user holds ALL of the given permission names.
function canAll(permissionNames) {
  const list = permissionNames || [];
  return computed(() => list.every((n) => permissions.value.includes(n)));
}

/**
 * Evaluate a gate definition `{ permissions: [] }`.
 *
 * IMPORTANT — permission-only semantics. The user passes ONLY when they hold
 * ANY named permission in their EFFECTIVE permission set (role permissions ∪
 * direct user permissions). Role-name shortcuts were historically accepted
 * here, which is exactly why deassigning a permission from a role in Access
 * Control never hid the menu: the role NAME alone kept the gate true. That
 * fallback has been REMOVED — the `roles` arrays in GATE_DEFINITIONS are now
 * kept solely as documentation of the audience that the migration seeder
 * (AppPermissionAudienceSeeder) grants the permission to. Sidebar visibility
 * is now driven purely by what Access Control writes.
 */
function satisfiesGate({ permissions: p = [] } = {}) {
  return computed(() => {
    return (p || []).some((n) => permissions.value.includes(n));
  });
}

// Debugging helper for the Access Control page / devtools.
function getAccessState() {
  return {
    profile,
    roles: userRoles,
    rolePermissions,
    userPermissions,
    permissions,
  };
}

export {
  fetchUserData,
  refreshUserData,
  hasRole,
  hasRoleByName,
  hasPermission,
  canAny,
  canAll,
  satisfiesGate,
  getAccessState,
};
