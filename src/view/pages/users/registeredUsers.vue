<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard users-page">
        <!-- Page heading -->
        <header class="page-heading users-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">👥</span> Registered Users
            </h3>
            <p class="ph-subtitle">
              View and update user profiles, roles and locations across national,
              county and sub-county levels.
            </p>
          </div>
          <div class="ph-actions us-toolbar">
            <div class="us-view-toggle" role="group" aria-label="View mode">
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

            <span class="us-toolbar-sep" aria-hidden="true"></span>

            <div class="us-toolbar-group">
              <sdButton
                size="small"
                class="pill-btn"
                :disabled="isLoading"
                @click="refresh"
              >
                <sdFeatherIcons type="refresh-cw" size="13" /> Refresh
              </sdButton>

              <sdButton size="small" class="pill-btn" @click="openMasterlistModal">
                <sdFeatherIcons type="clipboard" size="13" /> Check Masterlist
              </sdButton>

              <sdButton
                v-if="canChangePhone"
                size="small"
                class="pill-btn"
                @click="openPhoneChangeModal"
              >
                <sdFeatherIcons type="smartphone" size="13" /> Change Phone Number
              </sdButton>
            </div>

            <span class="us-toolbar-sep" aria-hidden="true"></span>

            <div class="us-toolbar-group">
              <router-link to="/users/add-user" class="us-create-btn">
                <sdFeatherIcons type="user-plus" size="14" /> Add User
              </router-link>
              <router-link to="/users/add-chp-ve" class="us-create-btn secondary">
                <sdFeatherIcons type="users" size="14" /> Add CHP &amp; VE
              </router-link>
            </div>
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
                <p class="tu-sub">{{ transferScopeHint }}</p>
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
                :not-found-content="transferLocationNotFound"
                :placeholder="transferLocationPlaceholder"
                @search="onTransferLocationSearch"
                @change="onTransferLocationChange"
              />
              <p class="tu-hint">{{ transferLocationHint }}</p>
            </div>

            <div v-if="transferRequiresRole" class="tu-field">
              <span class="tu-label">New role</span>
              <a-select
                v-model:value="transferRoleId"
                show-search
                allow-clear
                :options="transferRoleOptions"
                :loading="transferRolesLoading"
                :not-found-content="transferRolesLoading ? 'Loading roles…' : null"
                placeholder="Select the role for the new level"
              />
              <p class="tu-hint">
                This move changes the user’s level ({{ transferCurrentLevelName }} →
                {{ transferDestinationLevelName }}). Select the role they will hold at
                the new level.
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
              <div>
                <span class="lbl">Current role</span>
                <span class="val">{{ transferUser?.role_id || "—" }}</span>
              </div>
            </div>

            <footer class="tu-foot">
              <sdButton size="small" class="pill-btn" @click="closeTransferModal">
                Cancel
              </sdButton>
              <sdButton
                type="success"
                :loading="transferSaving"
                :disabled="
                  !transferLocationId ||
                  (transferRequiresRole && !transferRoleId) ||
                  transferSaving
                "
                @click="confirmTransfer"
              >
                <sdFeatherIcons type="check" size="13" /> Confirm transfer
              </sdButton>
            </footer>
          </div>
        </div>
      </a-modal>

      <!-- Change phone number modal -->
      <a-modal
        :visible="phoneChangeModalOpen"
        :footer="null"
        :closable="false"
        :mask-closable="false"
        :destroy-on-close="true"
        width="600px"
        wrap-class-name="user-phone-change-modal-wrap"
        @cancel="closePhoneChangeModal"
      >
        <div class="pc-shell">
          <header class="pc-head">
            <div class="pc-head-left">
              <span class="pc-icon">
                <sdFeatherIcons type="smartphone" size="16" />
              </span>
              <div>
                <h3 class="pc-title">Change Phone Number</h3>
                <p class="pc-sub">
                  {{
                    phoneChangeStep === "details"
                      ? "Verify the record, then send a one-time code to the new number."
                      : "Enter the one-time code sent to the new number to finish."
                  }}
                </p>
              </div>
            </div>
            <button type="button" class="pc-close" @click="closePhoneChangeModal">
              <sdFeatherIcons type="x" size="15" />
            </button>
          </header>

          <div class="pc-body">
            <template v-if="phoneChangeStep === 'details'">
              <div class="pc-field">
                <span class="pc-label">ID number</span>
                <a-input
                  v-model:value="phoneChangeForm.id_no"
                  :maxlength="20"
                  inputmode="numeric"
                  placeholder="e.g. 12345678"
                  :class="{ 'pc-input-error': phoneChangeErrors.id_no }"
                  @input="onIdNoInput"
                />
                <p class="pc-hint">
                  The national ID number on the masterlist record.
                </p>
                <p v-if="phoneChangeErrors.id_no" class="pc-error">
                  {{ phoneChangeErrors.id_no }}
                </p>
              </div>

              <div class="pc-row">
                <div class="pc-field">
                  <span class="pc-label">Current phone number</span>
                  <a-input
                    v-model:value="phoneChangeForm.phone_no"
                    inputmode="numeric"
                    placeholder="e.g. 0745 450 770"
                    :class="{ 'pc-input-error': phoneChangeErrors.phone_no }"
                    @input="onPhoneChangeInput('phone_no', $event)"
                    @blur="onPhoneChangeBlur"
                  />
                  <p v-if="phoneChangeErrors.phone_no" class="pc-error">
                    {{ phoneChangeErrors.phone_no }}
                  </p>
                </div>

                <div class="pc-field">
                  <span class="pc-label">New phone number</span>
                  <a-input
                    v-model:value="phoneChangeForm.new_phone_no"
                    inputmode="numeric"
                    placeholder="e.g. 0745 450 770"
                    :class="{ 'pc-input-error': phoneChangeErrors.new_phone_no }"
                    @input="onPhoneChangeInput('new_phone_no', $event)"
                    @blur="onPhoneChangeBlur"
                  />
                  <p v-if="phoneChangeErrors.new_phone_no" class="pc-error">
                    {{ phoneChangeErrors.new_phone_no }}
                  </p>
                </div>
              </div>

              <p class="pc-hint pc-phone-hint">
                Accepts 0745…, 745…, 254745… or +254745… — stored as 254745450770.
              </p>

              <div class="pc-field">
                <span class="pc-label">Confirm new phone number</span>
                <a-input
                  v-model:value="phoneChangeForm.confirm_phone_no"
                  inputmode="numeric"
                  placeholder="Re-enter the new phone number"
                  :class="{ 'pc-input-error': phoneChangeErrors.confirm_phone_no }"
                  @input="onPhoneChangeInput('confirm_phone_no', $event)"
                  @blur="onPhoneChangeBlur"
                />
                <p v-if="phoneChangeErrors.confirm_phone_no" class="pc-error">
                  {{ phoneChangeErrors.confirm_phone_no }}
                </p>
              </div>

              <div class="pc-field">
                <span class="pc-label">Reason (optional)</span>
                <a-input
                  v-model:value="phoneChangeForm.reason"
                  :maxlength="255"
                  placeholder="e.g. Lost SIM"
                  :class="{ 'pc-input-error': phoneChangeErrors.reason }"
                />
                <p v-if="phoneChangeErrors.reason" class="pc-error">
                  {{ phoneChangeErrors.reason }}
                </p>
              </div>

              <div class="pc-note">
                <sdFeatherIcons type="info" size="13" />
                <span>
                  A 6-digit code is sent to the new number. The change is applied
                  only after that code is confirmed.
                </span>
              </div>

              <footer class="pc-foot">
                <sdButton size="small" class="pill-btn" @click="closePhoneChangeModal">
                  Cancel
                </sdButton>
                <sdButton
                  type="success"
                  :loading="phoneChangeAction === 'request'"
                  :disabled="phoneChangeSaving"
                  @click="requestPhoneChangeOtp"
                >
                  <sdFeatherIcons type="send" size="13" /> Send OTP
                </sdButton>
              </footer>
            </template>

            <template v-else>
              <div class="pc-current">
                <div>
                  <span class="lbl">ID number</span>
                  <span class="val">{{ phoneChangeForm.id_no || "—" }}</span>
                </div>
                <div>
                  <span class="lbl">Current phone</span>
                  <span class="val">{{ phoneChangeForm.phone_no || "—" }}</span>
                </div>
                <div>
                  <span class="lbl">New phone</span>
                  <span class="val">{{ phoneChangeForm.new_phone_no || "—" }}</span>
                </div>
                <div>
                  <span class="lbl">Reason</span>
                  <span class="val">{{ phoneChangeForm.reason || "—" }}</span>
                </div>
              </div>

              <div class="pc-field pc-otp-field">
                <span class="pc-label">One-time code</span>
                <a-input
                  v-model:value="phoneChangeForm.otp"
                  :maxlength="6"
                  inputmode="numeric"
                  placeholder="000000"
                  class="pc-otp-input"
                  :class="{ 'pc-input-error': phoneChangeErrors.otp }"
                  @input="onOtpInput"
                  @pressEnter="submitPhoneChange"
                />
                <p class="pc-hint">
                  A 6-digit code was sent to {{ phoneChangeForm.new_phone_no }}. It
                  expires in 10 minutes.
                </p>
                <p v-if="phoneChangeErrors.otp" class="pc-error">
                  {{ phoneChangeErrors.otp }}
                </p>
              </div>

              <div class="pc-note">
                <sdFeatherIcons type="info" size="13" />
                <span>
                  Did not receive the code? Resend it, or go back and check the
                  numbers you entered.
                </span>
              </div>

              <footer class="pc-foot">
                <sdButton size="small" class="pill-btn" @click="backToPhoneChangeDetails">
                  Back
                </sdButton>
                <sdButton
                  size="small"
                  class="pill-btn"
                  :loading="phoneChangeAction === 'request'"
                  :disabled="phoneChangeSaving"
                  @click="requestPhoneChangeOtp"
                >
                  Resend code
                </sdButton>
                <sdButton
                  type="success"
                  :loading="phoneChangeAction === 'confirm'"
                  :disabled="phoneChangeSaving"
                  @click="submitPhoneChange"
                >
                  <sdFeatherIcons type="check" size="13" /> Confirm change
                </sdButton>
              </footer>
            </template>
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

// "Transfer user" — the caller's tier decides the scope (national programme
// officers: county ↔ sub-county; CMCC / CHRIO: their own county ↔ its
// sub-counties; SCMCC / SCHRIO: inside their own sub-county). The API scopes
// every feed and re-derives the user's level from the destination unit, so the
// UI only has to hide what the API protects anyway.
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

// "Change phone number" — PR #239: an OTP goes to the NEW number and the
// masterlist (plus the linked users row) is only updated once that code is
// confirmed. The operator types the record's ID number and current phone into
// the modal; there is no separate search step.
const canRequestPhoneChange = hasPermission('request_phone_change_otp');
const canConfirmPhoneChange = hasPermission('confirm_phone_change');
const canChangePhone = computed(
  () => canRequestPhoneChange.value && canConfirmPhoneChange.value,
);

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
// Both feeds come from the API (never built client-side): the location list is
// scoped to the caller's branch AND tier, and the role list is limited to the
// destination level. Search is debounced and server-side — a national / county
// branch holds thousands of units.
const transferModalOpen = ref(false);
const transferUser = ref(null);
const transferLocationId = ref(undefined);
const transferSelectedLocation = ref(null);
const transferLocationOptions = ref([]);
const transferLocationsLoading = ref(false);
const transferLocationSearchTerm = ref('');
const transferRoleId = ref(undefined);
const transferRoleOptions = ref([]);
const transferRolesLoading = ref(false);
const transferSaving = ref(false);
let transferSearchTimer = null;

// The user row carries the numeric level in `user_level_id`; `level_id` is the
// display NAME. Destination options carry the numeric level from the API.
const transferCurrentLevelId = computed(() =>
  Number(transferUser.value?.user_level_id ?? 0),
);
const transferDestinationLevelId = computed(() =>
  Number(transferSelectedLocation.value?.level_id ?? 0),
);

// County ↔ sub-county moves must also pick the role the user will hold at the
// new level. (Ward / location / sub-location units have no role catalogue, so
// the current role is kept there.) A row with no recorded level still asks:
// the API derives the change from the stored user.
const transferRequiresRole = computed(
  () =>
    [2, 3].includes(transferDestinationLevelId.value) &&
    transferDestinationLevelId.value !== transferCurrentLevelId.value,
);

const transferCurrentLevelName = computed(
  () => transferUser.value?.level_id || `Level ${transferCurrentLevelId.value || '—'}`,
);
const transferDestinationLevelName = computed(
  () =>
    transferSelectedLocation.value?.level_name ||
    `Level ${transferDestinationLevelId.value || '—'}`,
);

// Wording follows the caller's own tier — the API enforces the same scopes.
const transferScopeHint = computed(() => {
  switch (currentLevelId.value) {
    case 1:
      return 'Move this user between a county and its sub-counties. National-level accounts are never moved here.';
    case 2:
      return 'Move this user between your county and its sub-counties.';
    case 3:
      return 'Move this user within your sub-county.';
    default:
      return 'Move this user to another organisation unit inside your scope.';
  }
});

const transferLocationPlaceholder = computed(() => {
  switch (currentLevelId.value) {
    case 1:
    case 2:
      return 'Type 4+ characters — county or sub-county…';
    case 3:
      return 'Type 4+ characters — sub-county, ward or location…';
    default:
      return 'Type 4+ characters — organisation unit…';
  }
});

const transferLocationHint = computed(() => {
  switch (currentLevelId.value) {
    case 1:
      return 'Type at least 4 characters. Only counties and sub-counties are offered — national is never a transfer destination.';
    case 2:
      return 'Type at least 4 characters. Only your own county and its sub-counties are offered.';
    case 3:
      return 'Type at least 4 characters. Only units inside your sub-county are offered.';
    default:
      return 'Type at least 4 characters. Only units inside your own scope are offered.';
  }
});

// Empty-state copy for the dropdown: nothing is fetched until 4+ characters
// are typed, so explain the minimum instead of showing "Not Found".
const transferLocationNotFound = computed(() => {
  if (transferLocationsLoading.value) return 'Searching…';
  if (transferLocationSearchTerm.value.length > 3) return 'No matching locations.';
  return 'Type at least 4 characters to search.';
});

const transferInitials = computed(() => {
  const record = transferUser.value || {};
  const first = (record.first_name || ' ')[0];
  const last = (record.last_name || ' ')[0];
  return `${first}${last}`.trim().toUpperCase() || '?';
});

const fetchTransferLocations = async (term) => {
  // Never hit the API without a meaningful term — both the UI and the API
  // enforce the 4-character minimum to keep this expensive lookup cheap.
  if (!term || term.length <= 3) return;

  transferLocationsLoading.value = true;
  try {
    const { data } = await axios.get('users/transfer_locations', {
      params: {
        query: term,
        limit: 10,
      },
    });

    const list = Array.isArray(data?.data) ? data.data : [];
    const options = list.map((item) => ({
      value: item.id,
      label: item.label,
      level_id: Number(item.level_id),
      level_name: item.level_name || '',
    }));

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
  transferLocationSearchTerm.value = term;
  if (transferSearchTimer) clearTimeout(transferSearchTimer);

  // Selecting an option echoes its label back through @search — do not re-query.
  if (term && term === transferSelectedLocation.value?.label) return;

  // Only ping the endpoint once the operator has typed more than 3 characters.
  if (term.length <= 3) return;

  transferSearchTimer = setTimeout(() => fetchTransferLocations(term), 300);
};

// Role catalogue for a destination tier (county = 2, sub-county = 3). The API
// returns only roles whose org type sits at that level.
const fetchTransferRoles = async (levelId) => {
  if (!levelId) return;

  transferRolesLoading.value = true;
  try {
    const { data } = await axios.get('users/transfer_roles', {
      params: { level_id: levelId },
    });

    const list = Array.isArray(data?.data) ? data.data : [];
    transferRoleOptions.value = list.map((role) => ({
      value: role.id,
      label: role.orgtype_name ? `${role.name} (${role.orgtype_name})` : role.name,
    }));
  } catch (error) {
    notifyError('Unable to load roles for the destination level', error);
  } finally {
    transferRolesLoading.value = false;
  }
};

const onTransferLocationChange = (value) => {
  transferSelectedLocation.value =
    transferLocationOptions.value.find((option) => option.value === value) || null;

  // Reset any role picked for a previous destination, then load the catalogue
  // for the new level only when the move actually changes the user's tier.
  transferRoleId.value = undefined;
  transferRoleOptions.value = [];

  if (transferRequiresRole.value) {
    fetchTransferRoles(transferDestinationLevelId.value);
  }
};

const resetTransferState = () => {
  if (transferSearchTimer) clearTimeout(transferSearchTimer);
  transferSearchTimer = null;
  transferUser.value = null;
  transferLocationId.value = undefined;
  transferSelectedLocation.value = null;
  transferLocationOptions.value = [];
  transferLocationsLoading.value = false;
  transferLocationSearchTerm.value = '';
  transferRoleId.value = undefined;
  transferRoleOptions.value = [];
  transferRolesLoading.value = false;
  transferSaving.value = false;
};

const openTransferModal = (record) => {
  resetTransferState();
  transferUser.value = record;
  transferModalOpen.value = true;
  // Nothing is fetched until the operator types 4+ characters.
};

const closeTransferModal = () => {
  transferModalOpen.value = false;
  resetTransferState();
};

const confirmTransfer = async () => {
  const record = transferUser.value;
  if (!record || !transferLocationId.value || transferSaving.value) return;
  // Tier-changing moves must carry the role for the destination level.
  if (transferRequiresRole.value && !transferRoleId.value) return;

  transferSaving.value = true;
  try {
    const payload = { location_id: transferLocationId.value };
    if (transferRoleId.value) payload.role_id = transferRoleId.value;

    const { data } = await axios.post(`users/${record.id}/transfer`, payload);

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

// ── Change phone number modal ─────────────────────────────────────────────
// PR #239: POST phone_change/request_otp sends a 6-digit code to the NEW
// number; POST phone_change/confirm checks it and updates both the masterlist
// and the linked users row. There is no search step — the operator enters the
// target record's ID number and current phone inside the modal.
const PHONE_NO_REGEX = /^254[0-9]{9}$/;
const ID_NO_REGEX = /^[0-9]{1,20}$/;

const phoneChangeModalOpen = ref(false);
const phoneChangeStep = ref('details'); // 'details' → 'otp'
const phoneChangeAction = ref(''); // '' | 'request' | 'confirm'
const phoneChangeSaving = computed(() => !!phoneChangeAction.value);
const phoneChangeForm = reactive({
  id_no: '',
  phone_no: '',
  new_phone_no: '',
  confirm_phone_no: '',
  reason: '',
  otp: '',
});
const phoneChangeErrors = reactive({
  id_no: '',
  phone_no: '',
  new_phone_no: '',
  confirm_phone_no: '',
  reason: '',
  otp: '',
});

const clearPhoneChangeErrors = () => {
  Object.keys(phoneChangeErrors).forEach((key) => {
    phoneChangeErrors[key] = '';
  });
};

const resetPhoneChangeState = () => {
  phoneChangeStep.value = 'details';
  phoneChangeAction.value = '';
  Object.assign(phoneChangeForm, {
    id_no: '',
    phone_no: '',
    new_phone_no: '',
    confirm_phone_no: '',
    reason: '',
    otp: '',
  });
  clearPhoneChangeErrors();
};

const openPhoneChangeModal = () => {
  resetPhoneChangeState();
  phoneChangeModalOpen.value = true;
};

const closePhoneChangeModal = () => {
  phoneChangeModalOpen.value = false;
  resetPhoneChangeState();
};

// Formatting is deliberately deferred until the operator leaves the field (or
// submits): rewriting the value while typing used to turn a partial 9-digit
// entry into "254…" mid-keystroke and made full 254… numbers impossible to type.
const normalizePhoneChange = (value) => {
  const digits = String(value || '').replace(/\D/g, '');

  // Local format: 0745 450 770 → 254745450770
  if (digits.startsWith('0') && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  // Subscriber-only format: 745 450 770 → 254745450770
  // (a 9-digit value starting with 254 is an incomplete international number,
  // not a subscriber number — leave it untouched)
  if (digits.length === 9 && !digits.startsWith('254')) {
    return `254${digits}`;
  }

  // Already international (254…), or still incomplete — keep the digits as-is.
  return digits.slice(0, 12);
};

const onIdNoInput = (event) => {
  phoneChangeForm.id_no = String(event?.target?.value || '')
    .replace(/\D/g, '')
    .slice(0, 20);
  phoneChangeErrors.id_no = '';
};

const onPhoneChangeInput = (field, event) => {
  // Keep digits only while typing — the 254 conversion is applied on blur and
  // again on submit, never mid-keystroke.
  phoneChangeForm[field] = String(event?.target?.value || '')
    .replace(/\D/g, '')
    .slice(0, 12);
  phoneChangeErrors[field] = '';
};

const onPhoneChangeBlur = () => {
  phoneChangeForm.phone_no = normalizePhoneChange(phoneChangeForm.phone_no);
  phoneChangeForm.new_phone_no = normalizePhoneChange(phoneChangeForm.new_phone_no);
  phoneChangeForm.confirm_phone_no = normalizePhoneChange(
    phoneChangeForm.confirm_phone_no,
  );
};

const onOtpInput = (event) => {
  phoneChangeForm.otp = String(event?.target?.value || '')
    .replace(/\D/g, '')
    .slice(0, 6);
  phoneChangeErrors.otp = '';
};

const validatePhoneChangeDetails = () => {
  clearPhoneChangeErrors();

  // Format whatever is still in the fields (e.g. the operator clicked Send OTP
  // without blurring the last input) before validating.
  phoneChangeForm.phone_no = normalizePhoneChange(phoneChangeForm.phone_no);
  phoneChangeForm.new_phone_no = normalizePhoneChange(phoneChangeForm.new_phone_no);
  phoneChangeForm.confirm_phone_no = normalizePhoneChange(
    phoneChangeForm.confirm_phone_no,
  );

  const { id_no: idNo, phone_no: phone, new_phone_no: newPhone } = phoneChangeForm;

  if (!idNo) {
    phoneChangeErrors.id_no = 'Enter the ID number.';
  } else if (!ID_NO_REGEX.test(idNo)) {
    phoneChangeErrors.id_no = 'The ID number must contain digits only.';
  }

  if (!phone) {
    phoneChangeErrors.phone_no = 'Enter the current phone number.';
  } else if (!PHONE_NO_REGEX.test(phone)) {
    phoneChangeErrors.phone_no =
      'Enter a valid Kenyan phone number (e.g. 0745 450 770).';
  }

  if (!newPhone) {
    phoneChangeErrors.new_phone_no = 'Enter the new phone number.';
  } else if (!PHONE_NO_REGEX.test(newPhone)) {
    phoneChangeErrors.new_phone_no =
      'Enter a valid Kenyan phone number (e.g. 0745 450 770).';
  } else if (newPhone === phone) {
    phoneChangeErrors.new_phone_no =
      'The new phone number must be different from the current one.';
  }

  if (!phoneChangeErrors.new_phone_no) {
    if (!phoneChangeForm.confirm_phone_no) {
      phoneChangeErrors.confirm_phone_no = 'Confirm the new phone number.';
    } else if (phoneChangeForm.confirm_phone_no !== newPhone) {
      phoneChangeErrors.confirm_phone_no = 'The phone numbers do not match.';
    }
  }

  return !Object.values(phoneChangeErrors).some(Boolean);
};

const validatePhoneChangeOtp = () => {
  phoneChangeErrors.otp =
    phoneChangeForm.otp.length === 6
      ? ''
      : 'Enter the 6-digit code sent to the new phone number.';
  return !phoneChangeErrors.otp;
};

// The API reports validation failures under `errors`; surface them on the
// matching inputs in addition to the notification.
const applyPhoneChangeApiErrors = (error) => {
  const apiErrors = error?.response?.data?.errors || {};
  Object.keys(phoneChangeErrors).forEach((key) => {
    if (Array.isArray(apiErrors[key]) && apiErrors[key].length) {
      phoneChangeErrors[key] = apiErrors[key][0];
    }
  });
};

const requestPhoneChangeOtp = async () => {
  if (phoneChangeSaving.value) return;
  // On the OTP step this is a resend — the details were already validated.
  if (phoneChangeStep.value === 'details' && !validatePhoneChangeDetails()) return;

  phoneChangeAction.value = 'request';
  try {
    const { data } = await axios.post('phone_change/request_otp', {
      id_no: phoneChangeForm.id_no,
      phone_no: phoneChangeForm.phone_no,
      new_phone_no: phoneChangeForm.new_phone_no,
    });

    phoneChangeForm.otp = '';
    phoneChangeErrors.otp = '';
    phoneChangeStep.value = 'otp';

    notification.success({
      message: 'OTP sent',
      description:
        data?.message ||
        `A 6-digit code was sent to ${phoneChangeForm.new_phone_no}.`,
    });
  } catch (error) {
    applyPhoneChangeApiErrors(error);
    notifyError('Unable to send the OTP', error);
  } finally {
    phoneChangeAction.value = '';
  }
};

const backToPhoneChangeDetails = () => {
  phoneChangeStep.value = 'details';
  phoneChangeForm.otp = '';
  phoneChangeErrors.otp = '';
};

const submitPhoneChange = async () => {
  if (phoneChangeSaving.value || !validatePhoneChangeOtp()) return;

  phoneChangeAction.value = 'confirm';
  try {
    const payload = {
      id_no: phoneChangeForm.id_no,
      phone_no: phoneChangeForm.phone_no,
      new_phone_no: phoneChangeForm.new_phone_no,
      otp: phoneChangeForm.otp,
    };
    const reason = phoneChangeForm.reason.trim();
    if (reason) payload.reason = reason;

    const { data } = await axios.post('phone_change/confirm', payload);

    notification.success({
      message: 'Phone number changed',
      description: data?.message || 'The phone number was updated successfully.',
    });

    closePhoneChangeModal();
    fetchUsers();
  } catch (error) {
    applyPhoneChangeApiErrors(error);
    notifyError('Unable to change the phone number', error);
  } finally {
    phoneChangeAction.value = '';
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
.page-heading.users-heading {
  align-items: center;

  .ph-left {
    flex: 1 1 320px;
  }
}

.us-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  row-gap: 10px;
  flex-wrap: wrap;

  /* sdButton renders an ant-btn — keep icon + label on one centred baseline */
  :deep(.ant-btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
}

.us-toolbar-group {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.us-toolbar-sep {
  width: 1px;
  height: 24px;
  background: #e1e9e4;
  border-radius: 1px;
  flex: 0 0 1px;
}

.us-view-toggle {
  display: inline-flex;
  align-items: center;
  height: 40px;
  box-sizing: border-box;
  background: #f0f7f3;
  border: 1px solid #d9f0e2;
  border-radius: 20px;
  padding: 3px;
  gap: 2px;
  flex-shrink: 0;
}
.us-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 32px;
  border: 0;
  background: transparent;
  color: #5f7268;
  font-size: 12px;
  font-weight: 600;
  padding: 0 16px;
  min-width: 92px;
  border-radius: 16px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  &:hover {
    color: #15693c;
  }
  &.active {
    background: #fff;
    color: #15693c;
    box-shadow: 0 2px 6px rgba(28, 122, 72, 0.12);
  }
}
.us-create-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

/* ── Change phone number modal ─────────────────────────────────────────── */
.pc-shell {
  display: flex;
  flex-direction: column;
}
.pc-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 22px;
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border-bottom: 1px solid #d9f0e2;
}
.pc-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.pc-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eefaf2;
  color: #15693c;
  border: 1px solid #cbeedb;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pc-title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1f2437;
}
.pc-sub {
  margin: 2px 0 0;
  font-size: 12px;
  color: #8a90a6;
  line-height: 1.5;
}
.pc-close {
  border: 0;
  background: transparent;
  color: #7a8a82;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  line-height: 1;
  &:hover { background: #eefaf2; color: #15693c; }
}
.pc-body {
  padding: 18px 22px 22px;
}
.pc-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 14px;
}
.pc-phone-hint {
  margin-top: 6px;
}
.pc-otp-field {
  max-width: 260px;
}
.pc-otp-input {
  letter-spacing: 0.5em;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.pc-current {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
  margin-top: 16px;
  padding: 12px 14px;
  border: 1px dashed #d9f0e2;
  border-radius: 12px;
  background: #fbfffd;
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
.pc-field {
  margin-top: 16px;
  :deep(.ant-input) {
    border-radius: 8px;
  }
  :deep(.pc-input-error) {
    border-color: #ff7875 !important;
    box-shadow: 0 0 0 2px rgba(255, 120, 117, 0.12) !important;
  }
}
.pc-label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #7a8a82;
  font-weight: 700;
  margin-bottom: 6px;
}
.pc-hint {
  margin: 8px 0 0;
  font-size: 11px;
  color: #8a9399;
  line-height: 1.5;
}
.pc-error {
  margin: 5px 0 0;
  font-size: 11px;
  color: #d4380d;
  line-height: 1.4;
}
.pc-note {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  margin-top: 16px;
  padding: 10px 12px;
  border-radius: 9px;
  background: #f3fcf6;
  border: 1px solid #d9f0e2;
  color: #2f6746;
  font-size: 12px;
  line-height: 1.5;
}
.pc-foot {
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
  .us-toolbar-sep { display: none; }
}
@media (max-width: 991px) {
  .sum-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ph-actions { width: 100%; }
  .page-heading.users-heading { align-items: flex-start; }
  .us-toolbar { width: 100%; justify-content: flex-start; }
  .us-toolbar-sep { display: none; }
  .us-search { width: 100%; margin-left: 0; }
  .us-search :deep(.ant-input),
  .us-search :deep(.ant-input-affix-wrapper) { width: 100%; }
  .us-pagination { justify-content: center; }
}
@media (max-width: 575px) {
  .sum-row { grid-template-columns: 1fr; }
  .filter-grid { grid-template-columns: 1fr; }
  .us-view-toggle { width: 100%; justify-content: center; }
  .us-toolbar-group { width: 100%; }
  .us-toolbar-group .us-create-btn { flex: 1 1 0; }
  .us-card-meta { grid-template-columns: 1fr; }
  .us-card-foot { flex-direction: column; align-items: stretch; }
  .us-actions { justify-content: flex-start; }
  .pc-row { grid-template-columns: 1fr; }
  .pc-otp-field { max-width: 100%; }
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
.user-phone-change-modal-wrap .ant-modal-content {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(20, 60, 38, 0.18);
}
.user-phone-change-modal-wrap .ant-modal-body {
  padding: 0;
}
</style>
