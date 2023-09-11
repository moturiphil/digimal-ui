import { ref, computed } from "vue";

// Define a reactive reference for user role and permission
const role_id = ref("");
const permissions = ref([]);

// Fetch user data from the API and set role_id and permissions
async function fetchUserData() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    role_id.value = user.user.role_id;
    permissions.value = user.user.role.permissions.map(
      (permission) => permission.name
    );
  }
}

// Check if the user has a specific role
function hasRole(roleId) {
  return computed(() => role_id.value === roleId);
}

// Check if the user has a specific permission
function hasPermission(permissionName) {
  return computed(() => permissions.value.includes(permissionName));
}

export { fetchUserData, hasRole, hasPermission };
