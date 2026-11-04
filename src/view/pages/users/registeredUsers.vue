<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard users-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">👥</span> Registered Users
            </h3>
            <p class="ph-subtitle">
              View and update user profiles, roles and locations across national,
              county and sub-county levels.
            </p>
          </div>
          <div class="ph-actions">
            <div class="us-view-toggle" role="group" aria-label="Toggle view">
              <button
                type="button"
                class="us-toggle-btn"
                :class="{ active: viewMode === 'cards' }"
                @click="viewMode = 'cards'"
              >
                <sdFeatherIcons type="grid" size="14" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                class="us-toggle-btn"
                :class="{ active: viewMode === 'table' }"
                @click="viewMode = 'table'"
              >
                <sdFeatherIcons type="list" size="14" />
                <span>Table</span>
              </button>
            </div>

            <sdButton size="small" class="pill-btn" :disabled="isLoading" @click="refresh">
              <sdFeatherIcons type="refresh-cw" size="13" /> Refresh
            </sdButton>

            <sdButton size="small" class="pill-btn" @click="openMasterlistModal">
              <sdFeatherIcons type="clipboard" size="13" /> Check Masterlist
            </sdButton>

            <router-link to="/users/add-user" class="us-create-btn">
              <sdFeatherIcons type="user-plus" size="14" /> Add User
            </router-link>
            <router-link to="/users/add-chp-ve" class="us-create-btn secondary">
              <sdFeatherIcons type="users" size="14" /> Add CHP &amp; VE
            </router-link>
          </div>
        </header>

        <!-- Summary cards -->
        <div class="sum-row">
          <div class="sum-card">
            <span class="sum-label">Total Users</span>
            <span class="sum-value">{{ fmt(summary.total) }}</span>
            <span class="sum-hint">All users in scope</span>
          </div>
          <div class="sum-card">
            <span class="sum-label">On This Page</span>
            <span class="sum-value">{{ fmt(dataSource.length) }}</span>
            <span class="sum-hint">Current page only</span>
          </div>
          <div class="sum-card">
            <span class="sum-label">National</span>
            <span class="sum-value national">{{ fmt(summary.national) }}</span>
            <span class="sum-hint">All national users</span>
          </div>
          <div class="sum-card">
            <span class="sum-label">County</span>
            <span class="sum-value county">{{ fmt(summary.county) }}</span>
            <span class="sum-hint">All county users</span>
          </div>
          <div class="sum-card">
            <span class="sum-label">Sub-County &amp; Below</span>
            <span class="sum-value subcounty">{{ fmt(summary.sub_county) }}</span>
            <span class="sum-hint">All sub-county users</span>
          </div>
        </div>

        <!-- Filter panel -->
        <section class="panel filter-panel">
          <div class="filter-grid">
            <a-select
              v-if="filterAccessList.includes('country')"
              v-model:value="country"
              show-search
              allow-clear
              placeholder="Country"
              :options="countries"
              :filter-option="filterOption"
              @change="(value) => handleFilterChange(value, 'country')"
            />
            <a-select
              v-if="filterAccessList.includes('county')"
              v-model:value="county"
              show-search
              allow-clear
              placeholder="County"
              :options="counties"
              :filter-option="filterOption"
              @change="(value) => handleFilterChange(value, 'county')"
            />
            <a-select
              v-if="filterAccessList.includes('subcounty')"
              v-model:value="subcounty"
              show-search
              allow-clear
              placeholder="Sub-County"
              :options="subcounties"
              :filter-option="filterOption"
              @change="(value) => handleFilterChange(value, 'subcounty')"
            />
            <a-select
              v-if="filterAccessList.includes('ward')"
              v-model:value="ward"
              show-search
              allow-clear
              placeholder="Ward"
              :options="wards"
              :filter-option="filterOption"
              @change="(value) => handleFilterChange(value, 'ward')"
            />
            <a-select
              v-if="filterAccessList.includes('location')"
              v-model:value="location"
              show-search
              allow-clear
              placeholder="Location"
              :options="locations"
              :filter-option="filterOption"
              @change="(value) => handleFilterChange(value, 'location')"
            />
            <a-select
              v-if="filterAccessList.includes('sublocation')"
              v-model:value="sublocation"
              show-search
              allow-clear
              placeholder="Sub-Location"
              :options="sublocations"
              :filter-option="filterOption"
              @change="(value) => handleFilterChange(value, 'sublocation')"
            />
          </div>

          <div class="us-search">
            <span class="search-icon">
              <sdFeatherIcons type="search" size="14" />
            </span>
            <a-input
              v-model:value="searchItem"
              type="text"
              name="q"
              placeholder="Search by name, ID number or phone…"
              allow-clear
              @change="onSearchChange"
              @pressEnter="onSearchNow"
            />
          </div>
        </section>

        <!-- Users table / cards -->
        <section class="panel users-panel">
          <div v-if="isLoading && !dataSource.length" class="us-loading"><a-spin /></div>

          <template v-else>
            <TableWrapper
              v-if="viewMode === 'table'"
              class="table-data-view table-responsive us-table-shell"
            >
              <a-table
                :pagination="false"
                :data-source="dataSource"
                :columns="columns"
                row-key="id"
                :loading="isLoading"
                :scroll="{ x: 1180 }"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'user'">
                    <div class="us-user-cell">
                      <span class="us-avatar">{{ initials(record) }}</span>
                      <div class="us-user-text">
                        <span class="us-user-name">{{ fullName(record) }}</span>
                        <span class="us-user-meta">ID · {{ record.id_no || '—' }}</span>
                      </div>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'contact'">
                    <div class="us-contact">
                      <span class="us-contact-main">{{ record.phone_no || '—' }}</span>
                      <span v-if="record.email" class="us-contact-sub">{{ record.email }}</span>
                    </div>
                  </template>

                  <template v-else-if="column.key === 'level'">
                    <span class="us-chip" :class="levelTone(record)">
                      {{ record.level_id || '—' }}
                    </span>
                  </template>

                  <template v-else-if="column.key === 'location'">
                    <span class="us-location">{{ record.location_id || '—' }}</span>
                  </template>

                  <template v-else-if="column.key === 'org'">
                    <span class="us-location">{{ record.org_types_id || '—' }}</span>
                  </template>

                  <template v-else-if="column.key === 'role'">
                    <span class="us-role">{{ record.role_id || '—' }}</span>
                  </template>

                  <template v-else-if="column.key === 'status'">
                    <span class="v-status" :class="record.status ? 'active' : 'inactive'">
                      <span class="dot"></span>{{ record.status ? 'Active' : 'Inactive' }}
                    </span>
                  </template>

                  <template v-else-if="column.key === 'actions'">
                    <div class="us-actions">
                      <a-tooltip v-if="canEditRecord(record)" title="Edit user">
                        <span class="action-icon" @click="edit(record)">
                          <sdFeatherIcons type="edit-2" size="13" />
                        </span>
                      </a-tooltip>
                      <a-tooltip
                        v-if="canToggleRecord(record)"
                        :title="record.status ? 'Deactivate' : 'Activate'"
                      >
                        <span
                          class="action-icon"
                          :class="record.status ? 'danger' : 'success'"
                          @click="toggleUser(record)"
                        >
                          <sdFeatherIcons
                            :type="record.status ? 'pause-circle' : 'play-circle'"
                            size="13"
                          />
                        </span>
                      </a-tooltip>
                      <a-tooltip v-if="canTransferRecord(record)" title="Transfer user">
                        <span class="action-icon transfer" @click="openTransferModal(record)">
                          <sdFeatherIcons type="move" size="13" />
                        </span>
                      </a-tooltip>
                      <span
                        v-if="
                          !canEditRecord(record) &&
                          !canToggleRecord(record) &&
                          !canTransferRecord(record)
                        "
                        class="us-no-action"
                      >—</span>
                    </div>
                  </template>
                </template>
                <template #emptyText>
                  <div class="us-empty">
                    <div class="us-empty-icon">👥</div>
                    <div class="us-empty-title">No users found</div>
                    <div class="us-empty-desc">
                      Try a different search term or clear the location filters.
                    </div>
                  </div>
                </template>
              </a-table>
            </TableWrapper>

            <div v-else class="us-card-list">
              <div v-if="!dataSource.length" class="us-empty">
                <div class="us-empty-icon">👥</div>
                <div class="us-empty-title">No users found</div>
                <div class="us-empty-desc">
                  Try a different search term or clear the location filters.
                </div>
              </div>

              <article v-for="record in dataSource" :key="record.id" class="us-card">
                <div class="us-card-head">
                  <div class="us-user-cell">
                    <span class="us-avatar">{{ initials(record) }}</span>
                    <div class="us-user-text">
                      <span class="us-user-name">{{ fullName(record) }}</span>
                      <span class="us-user-meta">ID · {{ record.id_no || '—' }}</span>
                    </div>
                  </div>
                  <span class="us-chip" :class="levelTone(record)">
                    {{ record.level_id || '—' }}
                  </span>
                </div>

                <div class="us-card-meta">
                  <div>
                    <span class="lbl">Role</span>
                    <span class="val">{{ record.role_id || '—' }}</span>
                  </div>
                  <div>
                    <span class="lbl">Organisation</span>
                    <span class="val">{{ record.org_types_id || '—' }}</span>
                  </div>
                  <div>
                    <span class="lbl">Location</span>
                    <span class="val">{{ record.location_id || '—' }}</span>
                  </div>
                  <div>
                    <span class="lbl">Phone</span>
                    <span class="val">{{ record.phone_no || '—' }}</span>
                  </div>
                </div>

                <div class="us-card-foot">
                  <span class="v-status" :class="record.status ? 'active' : 'inactive'">
                    <span class="dot"></span>{{ record.status ? 'Active' : 'Inactive' }}
                  </span>
                  <div class="us-actions">
                    <sdButton
                      v-if="canEditRecord(record)"
                      size="extra-small"
                      type="light"
                      outlined
                      class="us-action-btn"
                      @click="edit(record)"
                    >
                      <sdFeatherIcons type="edit-2" size="12" /> Edit
                    </sdButton>
                    <sdButton
                      v-if="canToggleRecord(record)"
                      size="extra-small"
                      type="light"
                      outlined
                      class="us-action-btn"
                      @click="toggleUser(record)"
                    >
                      <sdFeatherIcons
                        :type="record.status ? 'pause-circle' : 'play-circle'"
                        size="12"
                      />
                      {{ record.status ? 'Deactivate' : 'Activate' }}
                    </sdButton>
                    <sdButton
                      v-if="canTransferRecord(record)"
                      size="extra-small"
                      type="light"
                      outlined
                      class="us-action-btn"
                      @click="openTransferModal(record)"
                    >
                      <sdFeatherIcons type="move" size="12" /> Transfer
                    </sdButton>
                  </div>
                </div>
              </article>
            </div>

            <div class="us-pagination">
              <a-pagination
                :current="currentPage"
                :total="total"
                :page-size="pageSize"
                :show-size-changer="true"
                :page-size-options="['20', '50', '100']"
                :show-total="(count) => `${fmt(count)} users`"
                @change="onPageChange"
                @showSizeChange="onPageSizeChange"
              />
            </div>
          </template>
        </section>
      </BudgetPageWrapper>

      <!-- Edit modal -->
      <a-modal
        :visible="userEditModalOpen"
        :footer="null"
        :closable="false"
        :mask-closable="false"
        :destroy-on-close="true"
        width="760px"
        wrap-class-name="user-edit-modal-wrap"
        @cancel="closeEditModal"
      >
        <div class="um-shell">
          <header class="um-head">
            <div class="um-head-left">
              <span class="um-icon"><sdFeatherIcons type="edit-3" size="16" /></span>
              <div>
                <h3 class="um-title">Edit User</h3>
                <p class="um-sub">
                  {{ editingUserName || 'Update the user profile below.' }}
                </p>
              </div>
            </div>
            <button type="button" class="um-close" @click="closeEditModal">
              <sdFeatherIcons type="x" size="15" />
            </button>
          </header>

          <div class="um-body">
            <UserEditForm
              :key="userEditFields.id"
              :form-fields="userEditFields"
              @close-editmodal="closeEditModal"
              @saved="onUserSaved"
            />
          </div>
        </div>
      </a-modal>

      <!-- Check masterlist modal -->
      <a-modal
        :visible="masterlistModalOpen"
        :footer="null"
        :closable="false"
        :destroy-on-close="true"
        width="640px"
        wrap-class-name="masterlist-check-modal-wrap"
        @cancel="closeMasterlistModal"
      >
        <div class="mc-shell">
          <header class="mc-head">
            <div class="mc-head-left">
              <span class="mc-icon">
                <sdFeatherIcons type="clipboard" size="16" />
              </span>
              <div>
                <h3 class="mc-title">Check Masterlist</h3>
                <p class="mc-sub">
                  Search the master list by exact ID number or phone number.
                </p>
              </div>
            </div>
            <button type="button" class="mc-close" @click="closeMasterlistModal">
              <sdFeatherIcons type="x" size="15" />
            </button>
          </header>

          <div class="mc-body">
            <form class="mc-search" @submit.prevent="searchMasterlist">
              <a-input
                v-model:value="masterlistQuery"
                placeholder="00123456, 0745450770, 745450770 or +254745450770"
                allow-clear
                @pressEnter="searchMasterlist"
              >
                <template #prefix>
                  <sdFeatherIcons type="search" size="13" />
                </template>
              </a-input>
              <sdButton
                type="success"
                htmlType="submit"
                :loading="masterlistLoading"
                :disabled="!masterlistQuery.trim()"
                class="mc-btn"
              >
                Search
              </sdButton>
            </form>
            <p class="mc-hint">
              Phone numbers can be entered as 0745…, 745…, 254745… or
              +254745…. Only an exact ID number or phone number match is
              returned.
            </p>

            <div v-if="masterlistLoading" class="mc-loading"><a-spin /></div>

            <template v-else-if="masterlistSearched">
              <div v-if="masterlistRecord" class="mc-result">
                <div class="mc-result-head">
                  <span class="mc-avatar">{{ masterlistInitials }}</span>
                  <div class="mc-result-name">
                    <div class="mc-name">{{ masterlistRecord.full_name }}</div>
                    <div class="mc-meta">ID · {{ masterlistRecord.id_no }}</div>
                  </div>
                  <span
                    class="mc-badge"
                    :class="masterlistRecord.is_stakeholder ? 'stakeholder' : 'user'"
                  >
                    {{ masterlistRecord.is_stakeholder ? "Stakeholder" : "User" }}
                  </span>
                </div>

                <a-alert
                  v-if="masterlistRecord.scopeMessage"
                  class="mc-scope-alert"
                  type="warning"
                  show-icon
                  :message="masterlistRecord.scopeMessage"
                />

                <div class="mc-grid">
                  <div>
                    <span class="lbl">Phone</span>
                    <span class="val">{{ masterlistRecord.phone_no || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Gender</span>
                    <span class="val">{{ masterlistRecord.gender || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Level</span>
                    <span class="val">{{ masterlistRecord.level || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Organisation</span>
                    <span class="val">{{ masterlistRecord.organization || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Role</span>
                    <span class="val">{{ masterlistRecord.role || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Location</span>
                    <span class="val">
                      {{
                        masterlistRecord.location_name ||
                        masterlistRecord.location_code ||
                        "—"
                      }}
                    </span>
                  </div>
                  <div>
                    <span class="lbl">Location code</span>
                    <span class="val">{{ masterlistRecord.location_code || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Status</span>
                    <span
                      class="v-status"
                      :class="masterlistStatusTone"
                      :title="masterlistStatusTitle"
                    >
                      <span class="dot"></span>{{ masterlistStatusLabel }}
                    </span>
                  </div>
                  <div>
                    <span class="lbl">Sync status</span>
                    <span
                      class="v-status"
                      :class="masterlistRecord.sync_status ? 'active' : 'unknown'"
                      :title="
                        masterlistRecord.sync_status
                          ? 'Synced to the training platform'
                          : 'Not yet synced to the training platform'
                      "
                    >
                      <span class="dot"></span>
                      {{ masterlistRecord.sync_status ? "Synced" : "Not synced" }}
                    </span>
                  </div>
                </div>

                <p class="mc-matched">
                  Matched by
                  {{
                    masterlistRecord.matchedBy === "phone_no"
                      ? "phone number"
                      : "ID number"
                  }}.
                </p>
              </div>

              <div v-else class="mc-empty">
                <div class="mc-empty-icon">🔍</div>
                <div class="mc-empty-title">No matching record</div>
                <div class="mc-empty-desc">
                  No master-list record matches this ID number or phone number
                  exactly.
                </div>
              </div>
            </template>
          </div>
        </div>
      </a-modal>
      <!-- Transfer user modal -->
      <a-modal
        :visible="transferModalOpen"
        :footer="null"
        :closable="false"
        :mask-closable="false"
        :destroy-on-close="true"
        width="640px"
        wrap-class-name="user-transfer-modal-wrap"
        @cancel="closeTransferModal"
      >
        <div class="tu-shell">
          <header class="tu-head">
            <div class="tu-head-left">
              <span class="tu-icon"><sdFeatherIcons type="move" size="16" /></span>
              <div>
                <h3 class="tu-title">Transfer User</h3>
                <p class="tu-sub">
                  Move this user to another location inside your county.
                </p>
              </div>
            </div>
            <button type="button" class="tu-close" @click="closeTransferModal">
              <sdFeatherIcons type="x" size="15" />
            </button>
          </header>

          <div class="tu-body">
            <div v-if="transferUser" class="tu-user">
              <span class="tu-avatar">{{ transferInitials }}</span>
              <div class="tu-user-text">
                <span class="tu-user-name">{{ fullName(transferUser) }}</span>
                <span class="tu-user-meta">
                  ID · {{ transferUser.id_no || "—" }} · Phone ·
                  {{ transferUser.phone_no || "—" }}
                </span>
              </div>
            </div>

            <div class="tu-field">
              <span class="tu-label">Move to</span>
              <a-select
                v-model:value="transferLocationId"
                show-search
                allow-clear
                :filter-option="false"
                :options="transferLocationOptions"
                :loading="transferLocationsLoading"
                :not-found-content="transferLocationsLoading ? 'Searching…' : null"
                placeholder="Search a sub-county, ward or location…"
                @search="onTransferLocationSearch"
                @change="onTransferLocationChange"
              />
              <p class="tu-hint">
                Type at least 2 characters (e.g. “South Mugirango”). Each match
                shows its level in brackets — e.g. South Mugirango (Location).
                Only units inside your county are offered.
              </p>
            </div>

            <div class="tu-current">
              <div>
                <span class="lbl">Current location</span>
                <span class="val">{{ transferUser?.location_id || "—" }}</span>
              </div>
              <div>
                <span class="lbl">Current level</span>
                <span class="val">{{ transferUser?.level_id || "—" }}</span>
              </div>
            </div>

            <footer class="tu-foot">
              <sdButton size="small" class="pill-btn" @click="closeTransferModal">
                Cancel
              </sdButton>
              <sdButton
                type="success"
                :loading="transferSaving"
                :disabled="!transferLocationId || transferSaving"
                @click="confirmTransfer"
              >
                <sdFeatherIcons type="check" size="13" /> Confirm transfer
              </sdButton>
            </footer>
          </div>
        </div>
      </a-modal>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main, TableWrapper } from '../../styled';
import { RecordViewWrapper } from '../style';
import { BudgetPageWrapper } from '../budget/style';
import UserEditForm from './EdiUsers.vue';
import { fetchUserData, hasPermission, refreshUserData } from '@/services/user-role';

const columns = [
  { title: 'User', key: 'user', width: 250 },
  { title: 'Contact', key: 'contact', width: 190 },
  { title: 'Level', key: 'level', width: 120 },
  { title: 'Location', key: 'location', width: 180 },
  { title: 'Organisation', key: 'org', width: 180 },
  { title: 'Role', key: 'role', width: 190 },
  { title: 'Status', key: 'status', width: 105 },
  { title: 'Actions', key: 'actions', width: 130, align: 'right' },
];

// Roles that could edit users before national access was broadened. Kept so
// the county / sub-county editors keep their existing action buttons.
const LEGACY_EDITOR_ROLES = ['3', '7', '15', '16', '37', '53', '56'];

const canUpdateDetails = hasPermission('update_user_details');
const canToggleStatus = hasPermission('deactive_activate_users');

const profile = ref({});
const currentLevelId = computed(() => Number(profile.value?.level?.id || 0));
const isNational = computed(() => currentLevelId.value === 1);
const currentRoleId = computed(() => String(profile.value?.role_id || ''));

const canEditRecord = (record) => {
  if (!canUpdateDetails.value) return false;
  // National accounts are protected by the API — never offer the action.
  if (Number(record.user_level_id) === 1) return false;
  return isNational.value || LEGACY_EDITOR_ROLES.includes(currentRoleId.value);
};

const canToggleRecord = (record) => {
  if (!canToggleStatus.value) return false;
  if (Number(record.user_level_id) === 1) return false;
  return isNational.value || LEGACY_EDITOR_ROLES.includes(currentRoleId.value);
};

// "Transfer user" — the CMCC (and any role granted `transfer_users`) moves a
// user between the organisation units of their OWN county. The API scopes the
// location feed to the caller's branch and re-derives the user's level from the
// destination unit, so the UI only has to hide what the API protects anyway.
const canTransferUsers = hasPermission('transfer_users');

const canTransferRecord = (record) => {
  if (!canTransferUsers.value) return false;
  // National-level accounts are protected by the API — never offer the action.
  if (Number(record.user_level_id) === 1) return false;
  // Never offer to move your own account out of your own scope.
  if (profile.value?.id != null && Number(record.id) === Number(profile.value.id)) {
    return false;
  }
  return true;
};

const fmt = (value) => (value == null ? '0' : Number(value).toLocaleString());
const fullName = (record) =>
  [record.first_name, record.middle_name, record.last_name].filter(Boolean).join(' ') || '—';
const initials = (record) =>
  `${(record.first_name || ' ')[0]}${(record.last_name || ' ')[0]}`.trim().toUpperCase() || '?';

const levelTone = (record) => {
  const level = Number(record.user_level_id);
  if (level === 1) return 'national';
  if (level === 2) return 'county';
  if (level === 3) return 'subcounty';
  return 'local';
};

// ── List state ─────────────────────────────────────────────────────────────
const dataSource = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);
const isLoading = ref(true);
const searchItem = ref('');
const viewMode = ref(
  typeof window !== 'undefined' && window.innerWidth <= 991 ? 'cards' : 'table',
);

// Summary cards. These come from the API `summary` block, which counts every
// National / County / Sub-County user in scope (search + location filters) —
// not just the rows on the current page.
const summary = reactive({
  total: 0,
  national: 0,
  county: 0,
  sub_county: 0,
});

const applySummary = (payload, fallbackTotal = 0) => {
  if (payload) {
    summary.total = Number(payload.total || 0);
    summary.national = Number(payload.national || 0);
    summary.county = Number(payload.county || 0);
    summary.sub_county = Number(payload.sub_county || 0);
    return;
  }

  // Older API responses carry no summary — fall back to the current page so
  // the cards still render something sensible.
  summary.total = Number(fallbackTotal || 0);
  summary.national = 0;
  summary.county = 0;
  summary.sub_county = 0;

  dataSource.value.forEach((record) => {
    const level = Number(record.user_level_id);
    if (level === 1) summary.national += 1;
    else if (level === 2) summary.county += 1;
    else if (level >= 3) summary.sub_county += 1;
  });
};

// ── Location filters ───────────────────────────────────────────────────────
const filterLevels = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation'];
const country = ref(null);
const county = ref(null);
const subcounty = ref(null);
const ward = ref(null);
const location = ref(null);
const sublocation = ref(null);
const filterRefs = { country, county, subcounty, ward, location, sublocation };

const filterAccessList = ref([]);
const orgIndex = ref([]);
const countries = ref([]);
const counties = ref([]);
const subcounties = ref([]);
const wards = ref([]);
const locations = ref([]);
const sublocations = ref([]);

const filterOption = (input, option) =>
  String(option?.label || '').toLowerCase().includes(String(input || '').toLowerCase());

const registerOrgIds = (items) => {
  const map = new Map(orgIndex.value.map((entry) => [entry.org_id, entry]));
  items.forEach((item) => {
    if (item.id) map.set(item.value, { id: item.id, org_id: item.value });
  });
  orgIndex.value = Array.from(map.values());
};

const toOptions = (items) =>
  (items || []).map((item) => ({ value: item.org_id, label: item.name, id: item.id }));

// Deepest selected org unit → the numeric location_id the users endpoint
// expects. Passing `location` (the old code) was ignored by the API.
const selectedLocationId = computed(() => {
  for (let i = filterLevels.length - 1; i >= 0; i -= 1) {
    const value = filterRefs[filterLevels[i]].value;
    if (!value) continue;
    const entry = orgIndex.value.find((option) => option.org_id === value);
    if (entry?.id) return entry.id;
  }
  return null;
});

const resetBelow = (level) => {
  const index = filterLevels.indexOf(level);
  filterLevels.slice(index + 1).forEach((key) => {
    filterRefs[key].value = null;
  });
};

const notifyError = (message, error) => {
  notification.error({
    message,
    description: error?.response?.data?.message || 'Please try again.',
  });
};

const fetchCounties = async () => {
  try {
    // `get_counties` is the ungated org-unit feed (the older `counties`
    // endpoint is behind a `counties_list` permission that is not seeded, so
    // it returned 403 for every role).
    const { data } = await axios.get('get_counties');
    const list = Array.isArray(data) ? data : (data?.data || data?.message || []);
    counties.value = toOptions(list);
    registerOrgIds(counties.value);
  } catch (error) {
    notifyError('Unable to load counties', error);
  }
};

const loadChildren = async (orgId, level) => {
  try {
    const { data } = await axios.get('get_sub_counties_list', {
      params: { parent_id: orgId },
    });
    const children = toOptions(data?.message);
    registerOrgIds(children);

    if (level === 'country') counties.value = children;
    else if (level === 'county') subcounties.value = children;
    else if (level === 'subcounty') wards.value = children;
    else if (level === 'ward') locations.value = children;
    else if (level === 'location') sublocations.value = children;
  } catch (error) {
    notifyError('Unable to load locations', error);
  }
};

const handleFilterChange = async (value, level) => {
  resetBelow(level);
  currentPage.value = 1;

  if (!value) {
    fetchUsers();
    return;
  }

  await loadChildren(value, level);
  fetchUsers();
};

const updateFilters = () => {
  const levelId = currentLevelId.value;
  const home = profile.value?.location || {};
  const homeOption = { value: home.org_id, label: home.name };

  if (home.id && home.org_id) {
    orgIndex.value = [{ id: home.id, org_id: home.org_id }];
  }

  if (levelId === 1) {
    filterAccessList.value = [...filterLevels];
    countries.value = [{ ...homeOption, label: home.name || 'Kenya', id: home.id }];
    fetchCounties();
  } else if (levelId === 2) {
    filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation'];
    counties.value = [homeOption];
  } else if (levelId === 3) {
    filterAccessList.value = ['subcounty', 'ward', 'location', 'sublocation'];
    subcounties.value = [homeOption];
  } else if (levelId === 4) {
    filterAccessList.value = ['ward', 'location', 'sublocation'];
    wards.value = [homeOption];
  } else if (levelId === 5) {
    filterAccessList.value = ['location', 'sublocation'];
    locations.value = [homeOption];
  } else if (levelId === 6) {
    filterAccessList.value = ['sublocation'];
    sublocations.value = [homeOption];
  } else {
    filterAccessList.value = [];
  }

  fetchUsers();
};

// ── Data fetching ──────────────────────────────────────────────────────────
const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const params = {
      page: currentPage.value,
      per_page: pageSize.value,
    };

    if (searchItem.value.trim().length > 2) {
      params.query = searchItem.value.trim();
    }
    if (selectedLocationId.value) {
      params.location_id = selectedLocationId.value;
    }

    const { data } = await axios.get('users', { params });
    total.value = Number(data?.pagination?.total || 0);
    dataSource.value = (data?.data || []).map((record) => ({
      ...record,
      fullName: fullName(record),
    }));
    applySummary(data?.summary, total.value);
  } catch (error) {
    notifyError('Unable to load users', error);
  } finally {
    isLoading.value = false;
  }
};

const refresh = () => {
  currentPage.value = 1;
  fetchUsers();
};

const onPageChange = (page) => {
  currentPage.value = page;
  fetchUsers();
};

const onPageSizeChange = (_page, size) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchUsers();
};

// Debounce the search so typing doesn't fire a request per keystroke.
let searchTimer = null;
const onSearchChange = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchUsers();
  }, 350);
};
const onSearchNow = () => {
  if (searchTimer) clearTimeout(searchTimer);
  currentPage.value = 1;
  fetchUsers();
};

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer);
  if (transferSearchTimer) clearTimeout(transferSearchTimer);
});

// ── Edit modal ─────────────────────────────────────────────────────────────
const userEditModalOpen = ref(false);
const editingUser = ref(null);
const editingUserName = computed(() =>
  editingUser.value ? fullName(editingUser.value) : '',
);

const userEditFields = reactive({
  id: null,
  first_name: '',
  middle_name: '',
  last_name: '',
  location_id: '',
  org_types_id: null,
  role_id: null,
  id_no: '',
  phone_no: '',
  current_id_no: '',
});

const edit = (record) => {
  editingUser.value = record;
  Object.assign(userEditFields, {
    id: record.id,
    first_name: record.first_name || '',
    middle_name: record.middle_name || '',
    last_name: record.last_name || '',
    location_id: record.location_id || '',
    org_types_id: record.user_org_type_id ?? null,
    role_id: record.user_role_id ?? null,
    id_no: '',
    phone_no: record.phone_no || '',
    current_id_no: record.id_no || '',
  });
  userEditModalOpen.value = true;
};

const closeEditModal = () => {
  userEditModalOpen.value = false;
};

const onUserSaved = () => {
  userEditModalOpen.value = false;
  fetchUsers();
};

// ── Status toggle ──────────────────────────────────────────────────────────
const toggleUser = async (record) => {
  try {
    const { data } = await axios.post(`users/${record.id}/toggleStatus`);
    notification.success({
      message: 'Success',
      description: data?.message || 'User status updated.',
    });
    fetchUsers();
  } catch (error) {
    notifyError('Unable to update user status', error);
  }
};

// ── Check masterlist modal ────────────────────────────────────────────────
// Looks up one master-list record by an exact ID number or phone number. The
// API accepts every common phone notation (0745…, 745…, 254745…, +254745…).
const masterlistModalOpen = ref(false);
const masterlistQuery = ref('');
const masterlistLoading = ref(false);
const masterlistSearched = ref(false);
const masterlistRecord = ref(null);

const masterlistInitials = computed(() => {
  const first = (masterlistRecord.value?.first_name || ' ')[0];
  const last = (masterlistRecord.value?.last_name || ' ')[0];
  return `${first}${last}`.trim().toUpperCase() || '?';
});

// The master-list `status` column is a legacy import flag (always 0), so the
// modal reports the registered ACCOUNT state instead:
//   flag missing    → "Unknown"        (older backend, no has_account field)
//   no account      → "Not registered"
//   account status  → "Active" / "Inactive"
const masterlistStatusLabel = computed(() => {
  const record = masterlistRecord.value;
  if (!record) return '—';
  if (record.hasAccount === null) return 'Unknown';
  if (record.hasAccount === false) return 'Not registered';
  return record.userStatus ? 'Active' : 'Inactive';
});

const masterlistStatusTone = computed(() => {
  const record = masterlistRecord.value;
  if (!record) return 'unknown';
  if (record.hasAccount !== true) return 'unknown';
  return record.userStatus ? 'active' : 'inactive';
});

// Explains the badge on hover — makes "Not registered" self-explanatory.
const masterlistStatusTitle = computed(() => {
  const record = masterlistRecord.value;
  if (!record) return '';
  if (record.hasAccount === null) {
    return 'The server did not report the account state for this record.';
  }
  if (record.hasAccount === false) {
    return 'No account in the users table matches this ID number or phone number.';
  }
  return record.userStatus
    ? 'Matched account in the users table is active.'
    : 'Matched account in the users table is deactivated.';
});

const resetMasterlistSearch = () => {
  masterlistQuery.value = '';
  masterlistRecord.value = null;
  masterlistSearched.value = false;
  masterlistLoading.value = false;
};

const openMasterlistModal = () => {
  resetMasterlistSearch();
  masterlistModalOpen.value = true;
};

const closeMasterlistModal = () => {
  masterlistModalOpen.value = false;
  resetMasterlistSearch();
};

const searchMasterlist = async () => {
  const identifier = masterlistQuery.value.trim();
  if (!identifier || masterlistLoading.value) return;

  masterlistLoading.value = true;
  masterlistSearched.value = false;
  masterlistRecord.value = null;

  try {
    const { data } = await axios.get('masterlist/check', {
      params: { identifier },
    });

    masterlistRecord.value =
      data?.found && data?.data
        ? {
            ...data.data,
            matchedBy: data.matched_by || 'id_no',
            // The API reports whether the record sits inside the operator's own
            // county. Records from elsewhere are still returned (most legacy
            // rows carry a stale location code) but flagged for verification.
            withinScope: data.within_scope !== false,
            scopeMessage: data.scope_message || '',
            // Account state — the master-list `status` flag is a legacy import
            // value that is always 0, so the modal reports the real account.
            // `null` means the API did not report the flag (older backend):
            // show "Unknown" instead of wrongly claiming "Not registered".
            hasAccount: data.has_account === undefined ? null : data.has_account === true,
            userStatus: data.user_status === true,
          }
        : null;
    masterlistSearched.value = true;
  } catch (error) {
    notifyError('Unable to check the masterlist', error);
  } finally {
    masterlistLoading.value = false;
  }
};

// ── Transfer user modal ───────────────────────────────────────────────────
// The location list is fetched from the API (never built client-side) so it is
// always scoped to the caller's own county and every option arrives already
// labelled "South Mugirango (Location)". Search is debounced and server-side —
// a county branch holds thousands of sub-locations.
const transferModalOpen = ref(false);
const transferUser = ref(null);
const transferLocationId = ref(undefined);
const transferSelectedLocation = ref(null);
const transferLocationOptions = ref([]);
const transferLocationsLoading = ref(false);
const transferSaving = ref(false);
let transferSearchTimer = null;

const transferInitials = computed(() => {
  const record = transferUser.value || {};
  const first = (record.first_name || ' ')[0];
  const last = (record.last_name || ' ')[0];
  return `${first}${last}`.trim().toUpperCase() || '?';
});

const fetchTransferLocations = async (term) => {
  transferLocationsLoading.value = true;
  try {
    const { data } = await axios.get('users/transfer_locations', {
      params: {
        query: term && term.length >= 2 ? term : undefined,
        limit: 50,
      },
    });

    const list = Array.isArray(data?.data) ? data.data : [];
    const options = list.map((item) => ({ value: item.id, label: item.label }));

    // Keep the current selection visible after a new search so the field never
    // falls back to showing the raw id.
    const selected = transferSelectedLocation.value;
    if (selected && !options.some((option) => option.value === selected.value)) {
      options.unshift(selected);
    }

    transferLocationOptions.value = options;
  } catch (error) {
    notifyError('Unable to load transfer locations', error);
  } finally {
    transferLocationsLoading.value = false;
  }
};

const onTransferLocationSearch = (value) => {
  const term = String(value || '').trim();
  if (transferSearchTimer) clearTimeout(transferSearchTimer);
  transferSearchTimer = setTimeout(() => fetchTransferLocations(term), 300);
};

const onTransferLocationChange = (value) => {
  transferSelectedLocation.value =
    transferLocationOptions.value.find((option) => option.value === value) || null;
};

const resetTransferState = () => {
  if (transferSearchTimer) clearTimeout(transferSearchTimer);
  transferSearchTimer = null;
  transferUser.value = null;
  transferLocationId.value = undefined;
  transferSelectedLocation.value = null;
  transferLocationOptions.value = [];
  transferLocationsLoading.value = false;
  transferSaving.value = false;
};

const openTransferModal = (record) => {
  resetTransferState();
  transferUser.value = record;
  transferModalOpen.value = true;
  // Prime the dropdown with the first page of in-scope units.
  fetchTransferLocations('');
};

const closeTransferModal = () => {
  transferModalOpen.value = false;
  resetTransferState();
};

const confirmTransfer = async () => {
  const record = transferUser.value;
  if (!record || !transferLocationId.value || transferSaving.value) return;

  transferSaving.value = true;
  try {
    const { data } = await axios.post(`users/${record.id}/transfer`, {
      location_id: transferLocationId.value,
    });

    notification.success({
      message: 'Transfer complete',
      description: data?.message || 'The user has been transferred.',
    });

    closeTransferModal();
    fetchUsers();
  } catch (error) {
    notifyError('Unable to transfer the user', error);
  } finally {
    transferSaving.value = false;
  }
};

onMounted(async () => {
  // Pull the freshest permission set so a national role that was just granted
  // update_user_details sees the Edit action without having to log out/in.
  const refreshed = await refreshUserData();
  if (!refreshed) await fetchUserData();

  try {
    const stored = JSON.parse(sessionStorage.getItem('user') || '{}');
    profile.value = stored.user || {};
  } catch (error) {
    profile.value = {};
  }

  updateFilters();
});
</script>

<style lang="less" scoped>
/* ── Summary cards ─────────────────────────────────────────────────────── */
.sum-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}
.sum-card {
  background: linear-gradient(135deg, #f3fcf6 0%, #f9fffb 55%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: box-shadow 0.15s, transform 0.15s;
  &:hover {
    box-shadow: 0 6px 14px rgba(28, 122, 72, 0.1);
    transform: translateY(-1px);
  }
}
.sum-label {
  font-size: 11px;
  color: #7a8a82;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.sum-value {
  font-size: 24px;
  font-weight: 800;
  color: #15693c;
  line-height: 1.1;
  &.national { color: #6f3fcc; }
  &.county { color: #2c99ff; }
  &.subcounty { color: #0f9d58; }
}
.sum-hint {
  font-size: 10px;
  font-weight: 500;
  color: #9aa6ad;
  letter-spacing: 0.2px;
}

/* ── Header actions ────────────────────────────────────────────────────── */
.us-view-toggle {
  display: inline-flex;
  background: #f0f7f3;
  border: 1px solid #d9f0e2;
  border-radius: 22px;
  padding: 3px;
  gap: 2px;
}
.us-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: #5f7268;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 18px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  &.active {
    background: #fff;
    color: #15693c;
    box-shadow: 0 2px 6px rgba(28, 122, 72, 0.12);
  }
}
.us-create-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 16px;
  border-radius: 22px;
  background: #16a34a;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  &:hover {
    background: #15803d;
    color: #fff;
  }
  &.secondary {
    background: #fff;
    color: #15693c;
    border: 1px solid #9ad8b4;
    &:hover {
      background: #f3fcf6;
      color: #15693c;
    }
  }
}
.pill-btn {
  background: #fff !important;
  border: 1px solid #e1e6ec !important;
  color: #4d5661 !important;
  border-radius: 999px !important;
  font-weight: 600;
  height: 40px;
  &:hover, &:focus {
    border-color: #9ad8b4 !important;
    color: #15693c !important;
  }
  &.is-primary {
    background: #16a34a !important;
    border-color: #16a34a !important;
    color: #fff !important;
    &:hover, &:focus {
      background: #15803d !important;
      border-color: #15803d !important;
    }
  }
}

/* ── Panels / filters ──────────────────────────────────────────────────── */
.panel {
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  overflow: hidden;
}
.filter-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
}
.filter-grid {
  flex: 1 1 0;
  min-width: 240px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  :deep(.ant-select) { width: 100%; }
}
.us-search {
  position: relative;
  flex: 0 0 auto;
  margin-left: auto;
  .search-icon {
    position: absolute;
    z-index: 2;
    margin: 12px 0 0 13px;
    color: #8a90a6;
    pointer-events: none;
  }
  :deep(.ant-input-affix-wrapper),
  :deep(.ant-input) {
    display: flex;
    align-items: center;
    border-radius: 22px;
    border: 1px solid #d9f0e2;
    background: #f7fdf9;
    padding: 0 16px 0 36px;
    height: 40px;
    width: 300px;
    max-width: 100%;
  }
}
.users-panel { padding: 10px; }
.us-loading {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

/* ── Table ─────────────────────────────────────────────────────────────── */
.us-table-shell {
  :deep(.ant-table) {
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }
  :deep(.ant-table-thead > tr > th) {
    background: #f4fbf6;
    color: #2f6746;
    font-weight: 700;
    border-bottom: 1px solid #e1efe6;
    white-space: nowrap;
  }
  :deep(.ant-table-tbody > tr > td) {
    border-bottom: 1px solid #f0f7f3;
    padding: 10px 14px;
    vertical-align: middle;
  }
  :deep(.ant-table-tbody > tr:hover > td) {
    background: #f5fbf7;
  }
}

.us-user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.us-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #eafff5;
  color: #15693c;
  border: 1px solid #c9e6d3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}
.us-user-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.us-user-name {
  font-size: 13px;
  font-weight: 700;
  color: #1f2437;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.us-user-meta {
  font-size: 11px;
  color: #8a90a6;
}

.us-contact {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.us-contact-main {
  font-size: 12.5px;
  font-weight: 600;
  color: #2f3a35;
}
.us-contact-sub {
  font-size: 11px;
  color: #8a90a6;
  word-break: break-all;
}

.us-chip {
  display: inline-flex;
  align-items: center;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  white-space: nowrap;
  &.national { background: #f3ebff; color: #6f3fcc; border-color: #d8c5f5; }
  &.county { background: #e8effb; color: #335ec7; border-color: #c7d8f3; }
  &.subcounty { background: #eafff5; color: #15693c; border-color: #c9e6d3; }
  &.local { background: #f0f2f5; color: #5a6470; border-color: #e1e6ec; }
}

.us-location {
  font-size: 12.5px;
  color: #2f3a35;
}
.us-role {
  font-size: 12px;
  font-weight: 600;
  color: #2f6746;
}

.v-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #b8c2c8;
  }
  &.active {
    color: #15693c;
    .dot { background: #20c997; box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.15); }
  }
  &.inactive {
    color: #c43d3d;
    .dot { background: #f05a5a; }
  }
  &.unknown {
    color: #7a8a82;
    .dot { background: #b8c2c8; box-shadow: 0 0 0 3px rgba(184, 194, 200, 0.18); }
  }
}

.us-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
}
.action-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5a6470;
  transition: background 0.15s, color 0.15s;
  &:hover { background: #f0f7f2; color: #15693c; }
  &.danger:hover { background: #fff1f1; color: #c43d3d; }
  &.success:hover { background: #eafff5; color: #15693c; }
  &.transfer:hover { background: #eef7ff; color: #1d6fb8; }
}
.us-no-action { color: #b8c2c8; }

/* ── Cards view ────────────────────────────────────────────────────────── */
.us-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 2px;
}
.us-card {
  background: #fff;
  border: 1px solid #e1efe6;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
}
.us-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}
.us-card-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
  margin-bottom: 12px;
  > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .lbl {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #7a8a82;
    font-weight: 600;
  }
  .val {
    font-size: 13px;
    font-weight: 600;
    color: #2f3a35;
    word-break: break-word;
  }
}
.us-card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed #e1efe6;
}
.us-action-btn {
  border-radius: 999px !important;
  font-weight: 600;
}

.us-empty {
  text-align: center;
  padding: 44px 16px;
  color: #9aa6ad;
}
.us-empty-icon {
  font-size: 40px;
  opacity: 0.4;
  margin-bottom: 8px;
}
.us-empty-title {
  font-size: 15px;
  font-weight: 700;
  color: #4d5661;
  margin-bottom: 4px;
}
.us-empty-desc {
  font-size: 12px;
  max-width: 320px;
  margin: 0 auto;
  line-height: 1.5;
}

.us-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 14px 8px 6px;
}

/* ── Check masterlist modal ────────────────────────────────────────────── */
.mc-shell {
  display: flex;
  flex-direction: column;
}
.mc-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 22px;
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border-bottom: 1px solid #d9f0e2;
}
.mc-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.mc-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eafff5;
  color: #15693c;
  border: 1px solid #c9e6d3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mc-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1f2437;
}
.mc-sub {
  margin: 2px 0 0;
  font-size: 12px;
  color: #8a90a6;
}
.mc-close {
  border: 0;
  background: transparent;
  color: #7a8a82;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  line-height: 1;
  &:hover { background: #eef6f1; color: #15693c; }
}
.mc-body {
  padding: 18px 22px 22px;
}
.mc-search {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mc-btn {
  border-radius: 999px !important;
  font-weight: 600;
  padding: 0 20px !important;
  height: 34px !important;
  flex-shrink: 0;
}
.mc-hint {
  margin: 8px 0 0;
  font-size: 11px;
  color: #8a9399;
  line-height: 1.5;
}
.mc-loading {
  display: flex;
  justify-content: center;
  padding: 26px 0;
}
.mc-result {
  margin-top: 16px;
  border: 1px solid #d9f0e2;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fffb 0%, #ffffff 60%);
  padding: 16px;
}
.mc-result-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #d9f0e2;
}
.mc-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #eafff5;
  border: 1px solid #c9e6d3;
  color: #15693c;
  font-weight: 800;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mc-result-name {
  min-width: 0;
  flex: 1;
}
.mc-name {
  font-size: 15px;
  font-weight: 700;
  color: #1f2437;
  line-height: 1.2;
}
.mc-meta {
  font-size: 11px;
  color: #8a90a6;
  margin-top: 2px;
}
.mc-badge {
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 4px 10px;
  border: 1px solid transparent;
  &.user { background: #eef7ff; color: #1d6fb8; border-color: #cde5fa; }
  &.stakeholder { background: #fff6e6; color: #a4620a; border-color: #f6dfb8; }
}
.mc-scope-alert {
  margin-top: 14px;
  border-radius: 10px;
  :deep(.ant-alert-message) {
    font-size: 12px;
    line-height: 1.5;
  }
}
.mc-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 18px;
  margin-top: 14px;
  .lbl {
    display: block;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #7a8a82;
    font-weight: 600;
  }
  .val {
    font-size: 13px;
    font-weight: 600;
    color: #2f3a35;
    word-break: break-word;
  }
}
.mc-matched {
  margin: 14px 0 0;
  font-size: 11px;
  color: #8a9399;
}
.mc-empty {
  margin-top: 16px;
  text-align: center;
  padding: 30px 12px;
  border: 1px dashed #e1efe6;
  border-radius: 12px;
  background: #fbfefc;
}
.mc-empty-icon {
  font-size: 30px;
  opacity: 0.5;
  margin-bottom: 6px;
}
.mc-empty-title {
  font-size: 14px;
  font-weight: 700;
  color: #4d5661;
  margin-bottom: 3px;
}
.mc-empty-desc {
  font-size: 12px;
  color: #9aa6ad;
  max-width: 320px;
  margin: 0 auto;
  line-height: 1.5;
}

/* ── Transfer user modal ───────────────────────────────────────────────── */
.tu-shell {
  display: flex;
  flex-direction: column;
}
.tu-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 22px;
  background: linear-gradient(90deg, #f3f6fc 0%, #f9fbff 45%, #f4f7fd 100%);
  border-bottom: 1px solid #dbe6f5;
}
.tu-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.tu-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eef7ff;
  color: #1d6fb8;
  border: 1px solid #cde5fa;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tu-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1f2437;
}
.tu-sub {
  margin: 2px 0 0;
  font-size: 12px;
  color: #8a90a6;
}
.tu-close {
  border: 0;
  background: transparent;
  color: #7a8a82;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  line-height: 1;
  &:hover { background: #eef4fb; color: #1d6fb8; }
}
.tu-body {
  padding: 18px 22px 22px;
}
.tu-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #dbe6f5;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fbff 0%, #ffffff 60%);
}
.tu-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #eef7ff;
  border: 1px solid #cde5fa;
  color: #1d6fb8;
  font-weight: 800;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tu-user-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.tu-user-name {
  font-size: 14px;
  font-weight: 700;
  color: #1f2437;
}
.tu-user-meta {
  font-size: 11px;
  color: #8a90a6;
}
.tu-field {
  margin-top: 16px;
  :deep(.ant-select) { width: 100%; }
}
.tu-label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #7a8a82;
  font-weight: 700;
  margin-bottom: 6px;
}
.tu-hint {
  margin: 8px 0 0;
  font-size: 11px;
  color: #8a9399;
  line-height: 1.5;
}
.tu-current {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
  margin-top: 16px;
  padding: 12px 14px;
  border: 1px dashed #dbe6f5;
  border-radius: 12px;
  background: #fbfdff;
  .lbl {
    display: block;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #7a8a82;
    font-weight: 600;
  }
  .val {
    font-size: 13px;
    font-weight: 600;
    color: #2f3a35;
    word-break: break-word;
  }
}
.tu-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #eef2f7;
}

/* ── Edit modal ────────────────────────────────────────────────────────── */
.um-shell {
  display: flex;
  flex-direction: column;
}
.um-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 22px;
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border-bottom: 1px solid #d9f0e2;
}
.um-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.um-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eafff5;
  color: #15693c;
  border: 1px solid #c9e6d3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.um-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1f2437;
}
.um-sub {
  margin: 2px 0 0;
  font-size: 12px;
  color: #8a90a6;
}
.um-close {
  border: 0;
  background: transparent;
  color: #7a8a82;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  line-height: 1;
  &:hover { background: #eef6f1; color: #15693c; }
}
.um-body {
  padding: 18px 22px 22px;
}

@media (max-width: 1200px) {
  .sum-row { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 991px) {
  .sum-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ph-actions { width: 100%; }
  .us-search { width: 100%; margin-left: 0; }
  .us-search :deep(.ant-input),
  .us-search :deep(.ant-input-affix-wrapper) { width: 100%; }
  .us-pagination { justify-content: center; }
}
@media (max-width: 575px) {
  .sum-row { grid-template-columns: 1fr; }
  .filter-grid { grid-template-columns: 1fr; }
  .us-view-toggle { width: 100%; justify-content: center; }
  .us-card-meta { grid-template-columns: 1fr; }
  .us-card-foot { flex-direction: column; align-items: stretch; }
  .us-actions { justify-content: flex-start; }
}
</style>

<style lang="less">
.user-edit-modal-wrap .ant-modal-content {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(20, 60, 38, 0.18);
}
.user-edit-modal-wrap .ant-modal-body {
  padding: 0;
}
.masterlist-check-modal-wrap .ant-modal-content {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(20, 60, 38, 0.18);
}
.masterlist-check-modal-wrap .ant-modal-body {
  padding: 0;
}
.user-transfer-modal-wrap .ant-modal-content {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(20, 60, 38, 0.18);
}
.user-transfer-modal-wrap .ant-modal-body {
  padding: 0;
}
</style>
