<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard acs-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Access Control
            </h3>
            <p class="ph-subtitle">
              Assign &amp; deassign roles and permissions per UI page. Changes
              persist immediately, are enforced by the API on every request,
              and drive sidebar visibility. A page stays visible only while the
              role holds one of its listed permissions — no role shortcuts.
            </p>
          </div>
        </header>

        <a-tabs v-model:activeKey="activeTab" class="acs-tabs" type="card">
          <!-- ═══════════ Tab 1: Role ↔ Permissions ═══════════ -->
          <a-tab-pane key="role-permissions" tab="Role Permissions">
            <section class="panel acs-layout">
              <aside class="acs-rolesselect">
                <a-select
                  v-model:value="selectedRoleId"
                  show-search
                  option-filter-prop="label"
                  placeholder="Select a role…"
                  style="width: 100%"
                  :options="roleOptions"
                  @change="selectRole"
                ></a-select>
                <div v-if="selectedRole" class="acs-role-meta">
                  <strong>{{ selectedRoleName }}</strong>
                  <span>{{ selectedRoleOrg }}</span>
                </div>
                <p class="acs-hint">
                  Tick the API permissions that gate each UI page. Unticking a
                  permission deassigns it on save.
                </p>
              </aside>

              <section class="acs-perms">
                <template v-if="selectedRole">
                  <div class="acs-perms-head">
                    <h4>Permissions for {{ selectedRoleName }}</h4>
                    <sdButton
                      type="success"
                      class="acs-save"
                      :disabled="saving || permLoading"
                      @click="saveRolePermissions"
                    >
                      {{ saving ? "Saving…" : "Save Permissions" }}
                    </sdButton>
                  </div>

                  <div v-if="permsLoadFailed" class="acs-perms-failed">
                    ⚠ The permission list could not be loaded, so the module /
                    sub-module checkboxes are disabled. Reload the page; if it
                    persists, check that <code>massnet_permissions</code> has
                    been seeded, then try again.
                  </div>

                  <div v-if="permLoading" class="spin acs-spin">
                    <a-spin />
                  </div>

                  <div v-else class="acs-modules">
                    <div
                      v-for="mod in groupedModules"
                      :key="mod.key"
                      class="acs-module"
                    >
                      <div class="acs-module-head">
                        <span>{{ mod.label }}</span>
                        <label class="acs-module-toggle">
                          <a-checkbox
                            :checked="moduleAllChecked(mod)"
                            :indeterminate="moduleIndeterminate(mod)"
                            @change="toggleModule(mod, $event)"
                          />
                          <small>{{ moduleStateLabel(mod) }}</small>
                        </label>
                      </div>

                      <div
                        v-for="page in mod.pages"
                        :key="`${mod.key}-${page.path}`"
                        class="acs-page"
                      >
                        <div class="acs-page-head">
                          <span>{{ page.label }}</span>
                          <code>{{ page.path }}</code>
                          <label class="acs-page-toggle">
                            <a-checkbox
                              :checked="pageAllChecked(page)"
                              :indeterminate="pageIndeterminate(page)"
                              @change="togglePage(page, $event)"
                            />
                            <small>{{ pageStateLabel(page) }}</small>
                          </label>
                        </div>
                        <div
                          v-if="page.permissionItems.length"
                          class="acs-perm-grid"
                        >
                          <label
                            v-for="p in page.permissionItems"
                            :key="p.id"
                            class="acs-perm"
                          >
                            <a-checkbox
                              :checked="checkedPermIds.includes(p.id)"
                              @change="togglePermission(p.id, $event)"
                            />
                            <code>{{ p.name }}</code>
                          </label>
                        </div>
                        <div v-else class="acs-perm-grid">
                          <span
                            v-if="page.missingPermissions && page.missingPermissions.length"
                            class="acs-no-perm"
                          >
                            No matching API permission in the database —
                            {{ page.missingPermissions.join(', ') }}
                          </span>
                          <span v-else class="acs-no-perm">
                            role-gated only (no API permission yet)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div v-if="otherPermissions.length" class="acs-module">
                      <div class="acs-module-head">
                        <span>Other permissions</span>
                      </div>
                      <div class="acs-perm-grid">
                        <label
                          v-for="p in otherPermissions"
                          :key="p.id"
                          class="acs-perm"
                        >
                          <a-checkbox
                            :checked="checkedPermIds.includes(p.id)"
                            @change="togglePermission(p.id, $event)"
                          />
                          <code>{{ p.name }}</code>
                        </label>
                      </div>
                    </div>

                    <div class="acs-module">
                      <div class="acs-module-head">
                        <span>Summary</span>
                      </div>
                      <p class="acs-summary">
                        {{ checkedPermIds.length }} permission(s) selected for
                        this role.
                      </p>
                    </div>
                  </div>
                </template>
                <a-empty
                  v-else
                  description="Select a role from the dropdown to manage its permissions"
                />
              </section>
            </section>
          </a-tab-pane>

          <!-- ═══════════ Tab 2: Users & Roles ═══════════ -->
          <a-tab-pane key="users" tab="Users & Roles">
            <section class="panel acs-users">
              <div class="acs-users-toolbar">
                <a-input
                  v-model:value="userQuery"
                  placeholder="Search by name, ID no or phone…"
                  allow-clear
                  style="width: 320px; max-width: 100%"
                  @pressEnter="searchUsers"
                />
                <sdButton type="light" outlined @click="searchUsers">
                  Search
                </sdButton>
              </div>
              <TableWrapper class="table-data-view table-responsive">
                <a-table
                  :data-source="users"
                  :columns="userColumns"
                  :pagination="usersPagination"
                  row-key="id"
                  :loading="usersLoading"
                  @change="onUsersTableChange"
                >
                  <template #name="{ record }">
                    <span>{{ record.first_name }} {{ record.last_name }}</span>
                  </template>
                  <template #level_select="{ record }">
                    <a-select
                      :value="record.user_level_id ?? record.level_id"
                      show-search
                      option-filter-prop="label"
                      style="width: 160px; max-width: 100%"
                      :options="levelOptions"
                      @change="(v) => changeUserAccess(record, 'level_id', v)"
                    />
                  </template>
                  <template #location_select="{ record }">
                    <a-select
                      :value="record.user_location_id ?? record.location_id"
                      show-search
                      allow-clear
                      option-filter-prop="label"
                      style="width: 220px; max-width: 100%"
                      :options="locationOptionsFor(record)"
                      @change="(v) => changeUserAccess(record, 'location_id', v)"
                    />
                  </template>
                  <template #role_select="{ record }">
                    <a-select
                      :value="record.user_role_id ?? record.role_id"
                      show-search
                      option-filter-prop="label"
                      style="width: 240px; max-width: 100%"
                      :options="roleOptions"
                      @change="(v) => changeUserRole(record, v)"
                    />
                  </template>
                </a-table>
              </TableWrapper>
            </section>
          </a-tab-pane>

          <!-- ═══════════ Tab 3: Page Access Map (read-only) ═══════════ -->
          <a-tab-pane key="matrix" tab="Page Access Map">
            <section class="panel">
              <p class="acs-hint">
                Reference map of which API permission(s) gate each UI page.
                Grant these permissions to a role in the "Role Permissions" tab
                to expose the page in that role's sidebar.
              </p>
              <TableWrapper class="table-data-view table-responsive">
                <a-table
                  :data-source="matrixRows"
                  :columns="matrixColumns"
                  :pagination="false"
                  row-key="key"
                />
              </TableWrapper>
            </section>
          </a-tab-pane>
        </a-tabs>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import axios from "@/Axiosconfig";
import { computed, onMounted, ref } from "vue";
import { notification } from "ant-design-vue";
import { RecordViewWrapper } from "../style";
import { BudgetPageWrapper } from "../budget/style";
import { Main, TableWrapper } from "../../styled";
import {
  NAV_MODULES,
  NAVIGATION_PERMISSIONS,
} from "../../../config/navigation-permissions";
import {
  roles as rbacRoles,
  loadRolesOrgTypes,
  roleLabel,
} from "../../../services/rbac-lookup";
import { syncNow } from "../../../services/access-sync";

// ── Tabs ───────────────────────────────────────────────────────────────────
const activeTab = ref("role-permissions");

// ── Roles ───────────────────────────────────────────────────────────────────
// Roles are loaded once from the API via the shared RBAC lookup store
// (src/services/rbac-lookup.js) instead of a per-page fetch.
const roles = rbacRoles;
const roleOptions = computed(() =>
  (roles.value || []).map((r) => ({
    value: r.id,
    label: `${r.name} (${r.orgtype_name || "—"})`,
  }))
);
const selectedRoleId = ref(null);
const selectedRole = computed(
  () => roles.value.find((r) => r.id === selectedRoleId.value) || null
);
const selectedRoleName = computed(
  () => selectedRole.value?.name || roleLabel(selectedRoleId.value)
);
const selectedRoleOrg = computed(() => selectedRole.value?.orgtype_name || "");

// ── Permissions ─────────────────────────────────────────────────────────────
const allPermissions = ref([]); // [{ id, name }] from permissionsList
const permissionByName = computed(() =>
  allPermissions.value.reduce((map, p) => {
    map[p.name] = p;
    return map;
  }, {})
);
const checkedPermIds = ref([]);
const permLoading = ref(false);
const saving = ref(false);

// Decorate NAV_MODULES with resolved permission items — only permissions that
// actually exist in massnet_permissions are rendered as checkboxes.
const groupedModules = computed(() =>
  NAV_MODULES.map((mod) => ({
    ...mod,
    pages: mod.pages.map((page) => {
      const items = (page.permissions || [])
        .map((name) => permissionByName.value[name])
        .filter(Boolean);
      return {
        ...page,
        permissionItems: items,
        // Permission names referenced by the navigation registry that have no
        // matching row in `massnet_permissions` yet. Until those rows exist
        // the checkbox has nothing to select — surface them so admins can seed
        // them (PermissionSeeder / UrlPermissionGenerator) instead of hitting a
        // page where clicking appears to do nothing.
        missingPermissions: (page.permissions || []).filter(
          (name) => !permissionByName.value[name]
        ),
      };
    }),
  }))
);

// Permissions that exist in the DB but aren't tied to any registered page.
const otherPermissions = computed(() =>
  allPermissions.value.filter((p) => !NAVIGATION_PERMISSIONS.includes(p.name))
);

// ── Checkbox matrix helpers ─────────────────────────────────────────────────
const pageIds = (page) => (page.permissionItems || []).map((p) => p.id);
const moduleIds = (mod) => mod.pages.flatMap((p) => pageIds(p));

const pageAllChecked = (page) => {
  const ids = pageIds(page);
  return ids.length > 0 && ids.every((id) => checkedPermIds.value.includes(id));
};
const pageIndeterminate = (page) => {
  const ids = pageIds(page);
  const count = ids.filter((id) => checkedPermIds.value.includes(id)).length;
  return count > 0 && count < ids.length;
};

const moduleAllChecked = (mod) => {
  const ids = moduleIds(mod);
  return ids.length > 0 && ids.every((id) => checkedPermIds.value.includes(id));
};
const moduleIndeterminate = (mod) => {
  const ids = moduleIds(mod);
  const count = ids.filter((id) => checkedPermIds.value.includes(id)).length;
  return count > 0 && count < ids.length;
};

// Clear page/module state labels for the Assign / Deassign toggles.
// "Denied" → deassign all on save; "Granted" → assign all; "Partial" → only
// some of the page's permissions are selected (advanced per-permission mode).
const pageStateLabel = (page) => {
  const ids = pageIds(page);
  if (!ids.length) return "—";
  const checked = ids.filter((id) => checkedPermIds.value.includes(id)).length;
  return checked >= ids.length ? "Granted" : checked > 0 ? "Partial" : "Denied";
};

const moduleStateLabel = (mod) => {
  const ids = moduleIds(mod);
  if (!ids.length) return "—";
  const checked = ids.filter((id) => checkedPermIds.value.includes(id)).length;
  return checked >= ids.length ? "All granted" : checked > 0 ? "Partial" : "None";
};

// antdv checkbox `change` delivers a native-style event object
// ({ target: { checked } }) — but some wrappers / future versions may emit a
// plain boolean instead. Normalise both so the toggles never silently no-op.
const eventChecked = (e) => {
  if (typeof e === 'boolean') return e;
  if (e && typeof e === 'object') {
    if (e.target && typeof e.target === 'object' && 'checked' in e.target) {
      return !!e.target.checked;
    }
    if ('checked' in e) return !!e.checked;
  }
  return !!e;
};

const togglePermission = (id, e) => {
  if (eventChecked(e)) {
    if (!checkedPermIds.value.includes(id)) checkedPermIds.value.push(id);
  } else {
    checkedPermIds.value = checkedPermIds.value.filter((x) => x !== id);
  }
};

const togglePage = (page, e) => {
  const next = new Set(checkedPermIds.value);
  const ids = pageIds(page);
  if (eventChecked(e)) ids.forEach((id) => next.add(id));
  else ids.forEach((id) => next.delete(id));
  checkedPermIds.value = Array.from(next);
};

const toggleModule = (mod, e) => {
  const next = new Set(checkedPermIds.value);
  const ids = moduleIds(mod);
  if (eventChecked(e)) ids.forEach((id) => next.add(id));
  else ids.forEach((id) => next.delete(id));
  checkedPermIds.value = Array.from(next);
};
// ── Role / permission data loading ───────────────────────────────────────────
const permsLoadFailed = ref(false);

const loadPermissions = async () => {
  try {
    const res = await axios.get('permissionsList');
    const data = res.data;
    allPermissions.value = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];
    // Zero permissions means every module/page checkbox has nothing to select.
    permsLoadFailed.value = allPermissions.value.length === 0;
  } catch (error) {
    notification.error({
      message: 'Error',
      description: 'Failed to load permissions — module / sub-module checkboxes are disabled.',
    });
    allPermissions.value = [];
    permsLoadFailed.value = true;
  }
};

const selectRole = () => {
  checkedPermIds.value = [];
  if (!selectedRoleId.value) return;
  loadRolePermissions();
};

const loadRolePermissions = async () => {
  permLoading.value = true;
  try {
    const res = await axios.get("roles_permissions_mapping", {
      params: { role_id: selectedRoleId.value },
    });
    const perms = res.data?.roles?.permissions || [];
    checkedPermIds.value = perms.map((p) => p.id);
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to load the role's permissions",
    });
  } finally {
    permLoading.value = false;
  }
};

const saveRolePermissions = async () => {
  if (!selectedRoleId.value) return;
  saving.value = true;
  try {
    await axios.post("assignPermissionsToRole", {
      role_id: selectedRoleId.value,
      permission_ids: Array.from(checkedPermIds.value),
    });
    notification.success({
      message: "Permissions saved",
      description: `Updates applied to ${selectedRoleName.value}.`,
    });
    await loadRolePermissions();
  } catch (error) {
    notification.error({
      message: "Error",
      description:
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to save permissions",
    });
  } finally {
    saving.value = false;
  }
};

// ── Users & roles tab ────────────────────────────────────────────────────────
const users = ref([]);
const usersLoading = ref(false);
const userQuery = ref('');
// Server-side pagination state. Search runs on the backend across the WHOLE
// user table (every page); the results are then paged in `per_page` chunks,
// so paging through the table walks every match — not just the first fetch.
const usersPage = ref(1);
const usersPerPage = ref(50);
const usersTotal = ref(0);

const usersPagination = computed(() => ({
  current: usersPage.value,
  pageSize: usersPerPage.value,
  total: usersTotal.value,
  showSizeChanger: true,
  pageSizeOptions: [10, 25, 50, 100],
  showTotal: (t) =>
    `${Number(t || 0).toLocaleString()} user${Number(t || 0) === 1 ? '' : 's'}`,
}));

// Level (National / County / Sub-County) and location (org unit) options for
// the per-user editors. Loaded once via dedicated endpoints.
const levels = ref([]); // [{ id, level_name }]
const orgUnits = ref([]); // [{ id, name, org_id, parent_id, level_id }]

const levelOptions = computed(() =>
  (levels.value || []).map((l) => ({ value: l.id, label: l.level_name }))
);

// Locations filtered to the level currently selected for that user row, so a
// County user only picks from counties, a Sub-County user from sub-counties.
const locationOptionsFor = (record) => {
  const lvl = Number(record.user_level_id || record.level_id || 0);
  return (orgUnits.value || [])
    .filter((u) => Number(u.level_id) === lvl)
    .map((u) => ({ value: u.id, label: u.name }));
};

const fetchAccessLookups = async () => {
  try {
    const [lv, ou] = await Promise.all([
      axios.get("levels"),
      axios.get("access_locations"),
    ]);
    levels.value = Array.isArray(lv.data?.data) ? lv.data.data : [];
    orgUnits.value = Array.isArray(ou.data?.data) ? ou.data.data : [];
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to load level / location options",
    });
  }
};

const userColumns = [
  { title: "Name", dataIndex: "", key: "name", slots: { customRender: "name" } },
  { title: "ID No", dataIndex: "id_no", key: "id_no" },
  { title: "Phone", dataIndex: "phone_no", key: "phone_no" },
  {
    title: "Level",
    dataIndex: "",
    key: "level_select",
    slots: { customRender: "level_select" },
  },
  {
    title: "Location",
    dataIndex: "",
    key: "location_select",
    slots: { customRender: "location_select" },
  },
  {
    title: "Role",
    dataIndex: "",
    key: "role_select",
    slots: { customRender: "role_select" },
  },
];

const fetchUsers = async () => {
  usersLoading.value = true;
  try {
    const res = await axios.get('users', {
      params: {
        page: usersPage.value,
        per_page: usersPerPage.value,
        query: userQuery.value.trim() || undefined,
      },
    });
    const body = res.data || {};
    users.value = Array.isArray(body.data) ? body.data : [];
    const pg = body.pagination || {};
    usersTotal.value = Number(pg.total) || users.value.length;
    // Sync the table with the page the server actually served (it clamps to
    // the last page, e.g. after deleting the last row of a page).
    if (Number(pg.current_page)) usersPage.value = Number(pg.current_page);
  } catch (error) {
    notification.error({
      message: 'Error',
      description: 'Failed to load users',
    });
    users.value = [];
    usersTotal.value = 0;
  } finally {
    usersLoading.value = false;
  }
};

// Search-based navigation: reset to page 1 so the user always starts at the
// top of the result set. The query itself is applied server-side and matches
// across every page of users (first / last name, phone, ID number).
const searchUsers = () => {
  usersPage.value = 1;
  fetchUsers();
};

// antdv fires the table's `@change` with
// (pagination, filters, sorter, { currentDataSource, action }) on paginate,
// sort, or filter interactions. Only pagination matters here.
const onUsersTableChange = (pagination, filters, sorter, changeInfo) => {
  if (!pagination) return;
  if (changeInfo && String(changeInfo.action) !== 'paginate') return;
  const page = Number(pagination.current);
  const size = Number(pagination.pageSize);
  if (!page || !size) return;
  if (page === usersPage.value && size === usersPerPage.value) return;
  usersPage.value = page;
  usersPerPage.value = size;
  fetchUsers();
};

const changeUserRole = async (record, roleId) => {
  try {
    await axios.put(`users/${record.id}/updateRole`, { role_id: roleId });
    record.user_role_id = roleId;
    record.role_id = roleId;
    const r = roles.value.find((x) => x.id === roleId);
    notification.success({
      message: "Role updated",
      description: `${record.first_name} ${record.last_name} is now assigned to ${r?.name || roleId}.`,
    });
    // The role's org type carries the scope level, so `level_id` may have been
    // realigned server-side — re-fetch so the inline selects stay truthful.
    fetchUsers();
    // Editing your OWN account: the sidebar gates and the router guard read a
    // cached profile (role name + permissions + level) from sessionStorage, so
    // a plain role change would leave every gate evaluating the old role
    // (typically landing on /403). Re-sync it and reload so all cached flags
    // are rebuilt from the new role.
    let current = null;
    try {
      current = JSON.parse(sessionStorage.getItem("user") || "null");
    } catch (e) {
      current = null;
    }
    if (current?.user?.id === record.id) {
      await syncNow({ force: true });
      notification.info({
        message: "Session refreshed",
        description: "Reloading to apply your new role and permissions…",
        duration: 2,
      });
      setTimeout(() => window.location.reload(), 1200);
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: error?.response?.data?.message || "Failed to update role",
    });
  }
};

// Update a user's scope level (National / County / Sub-County) or location.
// Clears the value when the inline select emits an empty (cleared) selection.
const changeUserAccess = async (record, field, value) => {
  if (value === undefined || value === null || value === "") return;
  const key = field === "level_id" ? "user_level_id" : "user_location_id";
  try {
    await axios.put(`users/${record.id}/updateAccess`, { [field]: value });
    record[key] = value;
    notification.success({
      message: "Access updated",
      description: `${record.first_name} ${record.last_name}'s ${field === "level_id" ? "level" : "location"} updated.`,
    });
    // Re-fetch rows so the display names (level / location / role) reflect
    // the saved values.
    fetchUsers();
  } catch (error) {
    notification.error({
      message: "Error",
      description:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update access",
    });
  }
};

// ── Page access map tab ──────────────────────────────────────────────────────
const matrixRows = computed(() =>
  NAV_MODULES.flatMap((mod) =>
    mod.pages.map((page) => ({
      key: `${mod.key}-${page.path}`,
      module: mod.label,
      page: page.label,
      path: page.path,
      permissions: (page.permissions || []).join(", ") || "—",
    }))
  )
);

const matrixColumns = [
  { title: "Module", dataIndex: "module", key: "module" },
  { title: "Page", dataIndex: "page", key: "page" },
  { title: "Route", dataIndex: "path", key: "path" },
  { title: "Required permission(s)", dataIndex: "permissions", key: "permissions" },
];

onMounted(() => {
  loadRolesOrgTypes();
  loadPermissions();
  fetchAccessLookups();
  fetchUsers();
});
</script>

<style lang="less" scoped>
.acs-page {
  .acs-tabs {
    margin-top: 18px;
  }

  .acs-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 16px;
    align-items: start;

    @media (max-width: 991px) {
      grid-template-columns: 1fr;
    }
  }

  .acs-rolesselect {
    position: sticky;
    top: 70px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border: 1px solid #e1efe6;
    background: #f7fdf9;
    border-radius: 12px;

    .acs-role-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;

      strong {
        color: #15693c;
        font-size: 14px;
      }
      span {
        color: #7a8a82;
        font-size: 12px;
      }
    }
  }

  .acs-hint {
    margin: 0;
    color: #7a8a82;
    font-size: 12px;
    line-height: 1.5;
  }

  .acs-perms {
    min-width: 0;
  }

  .acs-perms-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;

    h4 {
      margin: 0;
      color: #2f3a35;
    }
  }

  .acs-spin {
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }

  .acs-perms-failed {
    margin: 10px 0 0;
    padding: 10px 14px;
    font-size: 12px;
    line-height: 1.6;
    color: #b3502f;
    background: #fdf1ef;
    border: 1px solid #f3d7d3;
    border-radius: 8px;

    code {
      background: transparent;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
  }

  .acs-modules {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .acs-module {
    border: 1px solid #e1efe6;
    border-radius: 12px;
    overflow: hidden;
  }

  .acs-module-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 14px;
    background: #eaf7f0;
    border-bottom: 1px solid #d5ecdf;
    font-weight: 700;
    color: #15693c;
    font-size: 13px;

    .acs-module-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 400;
      font-size: 11px;
      color: #7a8a82;
    }
  }

  .acs-page {
    padding: 10px 14px;
    border-bottom: 1px dashed #e1efe6;

    &:last-child {
      border-bottom: 0;
    }
  }

  .acs-page-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;

    span {
      font-size: 13px;
      font-weight: 600;
      color: #2f3a35;
    }
    code {
      flex: 1;
      font-size: 11px;
      color: #7a8a82;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .acs-page-toggle {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #7a8a82;
    }
  }

  .acs-perm-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
  }

  .acs-perm {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #2f3a35;

    code {
      background: #f1f5f3;
      border: 1px solid #e3ece7;
      border-radius: 6px;
      padding: 1px 6px;
      font-size: 11px;
    }
  }

  .acs-no-perm {
    font-size: 11px;
    font-style: italic;
    color: #9ab8a8;
  }

  .acs-summary {
    margin: 0;
    padding: 10px 14px;
    color: #2f3a35;
    font-size: 12px;
  }

  .acs-users {
    padding: 14px;
  }

  .acs-users-toolbar {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
}
</style>