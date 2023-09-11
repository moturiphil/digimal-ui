import { ref, computed } from "vue";

// Define a reactive reference for user role and permission
// const role_id = ref(""); s
const permissions = ref([]);
const userRoles = ref([]);
const userPermissions = ref([]);


async function fetchUserData() {
  const user = JSON.parse(sessionStorage.getItem("user"));
//   console.log( user.user.role_id ); 
  if (user && user.user && user.user.role_id) {
    userRoles.value = [user.user.role_id];
    userPermissions.value =
      user.user.role.permissions?.map((permission) => permission.name) || [];
  }
}

// Check if the user has a specific role
function hasRole(roleIds) {
  //   return computed(() => role_id.value === roleId);
  return computed(() => {
    const userHasRole = userRoles.value.some((role) => roleIds.includes(role));
    return userHasRole;
  });
}

// Check if the user has a specific permission
function hasPermission(permissionName) {
  return computed(() => permissions.value.includes(permissionName));
}

export { fetchUserData, hasRole, hasPermission };
