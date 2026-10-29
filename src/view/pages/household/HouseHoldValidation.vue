<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard hh-validation-page">
    <header class="page-heading">
      <div class="ph-left">
        <h3 class="ph-title"><span class="ph-icon">▦</span> Net Campaign · Validation</h3>
        <p class="ph-subtitle">CHA · {{ scopeSubtitle }}</p>
      </div>
      <nav class="ph-actions" aria-label="CHA workflow sections">
        <router-link
          v-for="item in visibleNavItems"
          :key="item.key"
          :to="item.path"
          class="nav-item"
          :class="{ active: currentSection === item.key }"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </header>

    <section v-if="isNationalUser" class="panel drilldown-panel">
      <div class="drilldown-head">
        <h3>National Drilldown</h3>
        <a-button size="small" @click="resetDrilldown">Reset</a-button>
      </div>
      <div class="drilldown-grid">
        <a-select
          v-model:value="drilldown.county_id"
          placeholder="Select County"
          allow-clear
          show-search
          :filter-option="filterOption"
          @change="handleCountyChange"
        >
          <a-select-option v-for="item in counties" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>

        <a-select
          v-model:value="drilldown.sub_county_id"
          placeholder="Select SubCounty"
          allow-clear
          show-search
          :filter-option="filterOption"
          :disabled="!drilldown.county_id"
          @change="handleSubCountyChange"
        >
          <a-select-option v-for="item in subCounties" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>

        <a-select
          v-model:value="drilldown.ward_id"
          placeholder="Select Ward"
          allow-clear
          show-search
          :filter-option="filterOption"
          :disabled="!drilldown.sub_county_id"
          @change="handleWardChange"
        >
          <a-select-option v-for="item in wards" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>

        <a-select
          v-model:value="drilldown.sub_location_id"
          placeholder="Select Sub-Location"
          allow-clear
          show-search
          :filter-option="filterOption"
          :disabled="!drilldown.ward_id"
          @change="handleSubLocationChange"
        >
          <a-select-option v-for="item in subLocations" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <div class="scope-meta">
        <span>County: <b>{{ selectedCountyName }}</b></span>
        <span>SubCounty: <b>{{ selectedSubCountyName }}</b></span>
        <span>Ward: <b>{{ selectedWardName }}</b></span>
        <span>Sub-Location: <b>{{ selectedSubLocationName }}</b></span>
      </div>
    </section>

    <main v-if="!isLoading" class="workflow-content">
      <section v-if="currentSection === 'dashboard'" class="dashboard-grid">
        <div class="stat-card">
          <div class="label">Villages & households</div>
          <div class="value-row">
            <span>{{ villages.length }}</span>
            <span>{{ totalHouseholds }}</span>
          </div>
          <div class="meta-row">
            <span>Villages</span>
            <span>Households</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="label">Villages reviewed / pending</div>
          <div class="value-row">
            <span class="ok">{{ villagesReviewed }}</span>
            <span class="warn">{{ villagesPending }}</span>
          </div>
          <div class="meta-row">
            <span>Reviewed</span>
            <span>Pending</span>
          </div>
        </div>
        <div class="stat-card split">
          <div class="label">Pending by category</div>
          <div class="chips">
            <span>New {{ categoryTotals.pending.new }}</span>
            <span>Muted {{ categoryTotals.pending.muted }}</span>
            <span>Changed {{ categoryTotals.pending.changed }}</span>
            <span>Transfer {{ categoryTotals.pending.transfer }}</span>
          </div>
        </div>
        <div class="stat-card split">
          <div class="label">Approved by category</div>
          <div class="chips">
            <span>New {{ categoryTotals.approved.new }}</span>
            <span>Muted {{ categoryTotals.approved.muted }}</span>
            <span>Changed {{ categoryTotals.approved.changed }}</span>
            <span>Transfer {{ categoryTotals.approved.transfer }}</span>
          </div>
        </div>
        <div class="stat-card split">
          <div class="label">Denied by category</div>
          <div class="chips denied">
            <span>New {{ categoryTotals.rejected.new }}</span>
            <span>Muted {{ categoryTotals.rejected.muted }}</span>
            <span>Changed {{ categoryTotals.rejected.changed }}</span>
            <span>Transfer {{ categoryTotals.rejected.transfer }}</span>
          </div>
        </div>

        <div class="panel panel-wide">
          <h3>Changes by category</h3>
          <div class="bar-chart">
            <div v-for="bar in chartRows" :key="bar.key" class="bar-row">
              <div class="bar-label">{{ bar.label }}</div>
              <div class="bar-group">
                <div class="bar pending" :style="barStyle(bar.pending)"></div>
                <div class="bar approved" :style="barStyle(bar.approved)"></div>
                <div class="bar denied" :style="barStyle(bar.rejected)"></div>
              </div>
            </div>
          </div>
          <div class="legend">
            <span><i class="dot pending"></i>Pending</span>
            <span><i class="dot approved"></i>Approved</span>
            <span><i class="dot denied"></i>Denied</span>
          </div>
        </div>

        <div class="panel progress-panel">
          <h3>Villages validated</h3>
          <div class="progress-main">{{ villagesValidatedPercent }}%</div>
          <div class="progress-sub">{{ villagesReviewed }} / {{ villages.length || 0 }}</div>
          <a-progress :percent="villagesValidatedPercent" :show-info="false" />
          <div class="progress-label">Change completion {{ completionPercent }}%</div>
          <a-progress :percent="completionPercent" :show-info="false" :stroke-color="{ '0%': '#0f766e', '100%': '#94a3b8' }" />
        </div>

        <div class="panel panel-full">
          <div class="table-title">Demographics per village</div>
          <a-table
            :columns="villageColumns"
            :data-source="villageSummaryRows"
            :pagination="{
              current: villagesPaginationMeta.current,
              pageSize: villagesPaginationMeta.pageSize,
              total: villagesPaginationMeta.total,
              showSizeChanger: true,
              pageSizeOptions: [25, 50, 100],
              showTotal: (total) => `Total ${total} villages`,
            }"
            :loading="isLoading"
            row-key="id"
            size="small"
            @change="handleVillagePageChange"
          >
            <template #verifiedTotal="{ record }">
              <div class="verified-cell">
                <span class="verified-counts">
                  <strong>{{ record.verified_households }}</strong>
                  <span class="sep">/</span>
                  <span>{{ record.total_households }}</span>
                </span>
                <a-tag :color="record.verified_percent >= 100 ? 'green' : record.verified_percent > 0 ? 'blue' : 'default'">
                  {{ record.verified_percent }}% verified
                </a-tag>
              </div>
            </template>
            <template #action="{ record }">
              <a @click="openVillage(record.id)">View households</a>
            </template>
          </a-table>
        </div>
      </section>

      <section v-else-if="currentSection === 'households'" class="household-section">
        <div class="section-head">
          <div>
            <h2>Household Register</h2>
            <p>Review every household per village. Confirm, Change, or Mute each one.</p>
          </div>
          <a-space>
            <a-input v-model:value="searchText" placeholder="Search household name or phone" style="width: 260px" />
            <a-button
              type="primary"
              :disabled="isActiveVillageSubmitted"
              @click="openCreateModal"
            >New household request</a-button>
          </a-space>
        </div>

        <a-collapse v-model:activeKey="activeVillageKeys" accordion>
          <a-collapse-panel
            v-for="village in villages"
            :key="String(village.id)"
            @click="ensureVillageInitiallyLoaded(village.id)"
          >
            <template #header>
              <div class="village-header">
                <div class="left">
                  <div class="title">{{ village.name }}</div>
                  <div class="sub">CHP: {{ village.no_of_chp_registered > 0 ? 'Assigned' : 'No CHP assigned' }}</div>
                </div>
                <div class="right">
                  <a-tag
                    v-if="isVillageSubmitted(village.id)"
                    color="cyan"
                  >Submitted</a-tag>
                  <a-tag>{{ reviewedCount(village.id) }} / {{ householdCount(village.id) }} reviewed</a-tag>
                  <a-button
                    v-if="!isVillageSubmitted(village.id)"
                    type="primary"
                    size="small"
                    :disabled="!canSubmitVillage(village.id)"
                    :loading="submittingVillage[village.id]"
                    @click.stop="submitVillage(village.id)"
                  >Submit village</a-button>
                </div>
              </div>
            </template>

            <div
              v-if="villageLoading[village.id] && !(householdsByVillage[getCurrentHouseholdCacheKey(village.id)] || []).length"
              class="village-skeleton"
            >
              <a-skeleton active :paragraph="{ rows: 4 }" />
            </div>
            <a-table
              v-else
              :columns="householdColumns"
              :data-source="filteredHouseholds(village.id)"
              :pagination="{
                current: getCurrentHouseholdPage(village.id),
                pageSize: HOUSEHOLDS_PAGE_SIZE,
                total: householdCount(village.id),
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} households`,
              }"
              :loading="villageLoading[village.id]"
              row-key="id"
              size="small"
              @change="(pagination) => handleHouseholdPageChange(village.id, pagination.current)"
            >
              <template #status="{ record }">
                <a-tag :color="statusColor(record)">{{ statusLabel(record) }}</a-tag>
              </template>
              <template #phone="{ record }">
                {{ maskPhone(record.phone_no) }}
              </template>
              <template #action="{ record }">
                <a @click="openHouseholdModal(village.id, record.id)">View</a>
              </template>
            </a-table>
          </a-collapse-panel>
        </a-collapse>

        <div class="village-pagination-wrap">
          <a-pagination
            :current="villagesPaginationMeta.current"
            :page-size="villagesPaginationMeta.pageSize"
            :total="villagesPaginationMeta.total"
            :show-size-changer="true"
            :page-size-options="[25, 50, 100]"
            :show-total="(total) => `Total ${total} villages`"
            @change="handleVillagePageChange"
          />
        </div>
      </section>

      <section v-else-if="currentSection === 'transfers'" class="transfers-page">
        <div class="transfers-head">
          <div>
            <h2>Household transfers</h2>
            <p>
              Move a household to another village in your sub-location and assign it to a
              post inside that sub-location. The request goes to the SCMCC for approval and
              the household keeps its current location until it is approved.
            </p>
          </div>
          <a-button size="small" :loading="transfersLoading" @click="fetchTransfers(1)">
            Refresh
          </a-button>
        </div>

        <!-- Step 1 — find the household to move (raise side only) -->
        <div v-if="canTransferHouseholds" class="panel panel-full">
          <div class="table-title">1. Find the household</div>
          <div class="transfer-search-row">
            <a-input
              v-model:value="transferSearch.idNo"
              placeholder="Household head ID number (e.g. 23980654)"
              allow-clear
              style="max-width: 340px"
              @press-enter="searchTransferHousehold"
            />
            <a-button type="primary" :loading="transferSearch.loading" @click="searchTransferHousehold">
              Search
            </a-button>
          </div>
          <p class="transfer-hint">
            Only verified, active households can be transferred. Search with the ID number
            used when the household was registered.
          </p>

          <a-alert
            v-if="transferSearch.error"
            class="transfer-alert"
            type="warning"
            show-icon
            :message="transferSearch.error"
          />

          <div v-if="transferSearch.result" class="transfer-household">
            <div class="transfer-facts">
              <div class="transfer-fact">
                <span class="label">Household head</span>
                <span class="value">{{ householdFullName(transferSearch.result) || "—" }}</span>
              </div>
              <div class="transfer-fact">
                <span class="label">ID number</span>
                <span class="value">{{ transferSearch.result.id_no || "—" }}</span>
              </div>
              <div class="transfer-fact">
                <span class="label">Phone</span>
                <span class="value">{{ maskPhone(transferSearch.result.phone_no) }}</span>
              </div>
              <div class="transfer-fact">
                <span class="label">Household size</span>
                <span class="value">{{ transferSearch.result.hh_size || "—" }}</span>
              </div>
              <div class="transfer-fact">
                <span class="label">Current village</span>
                <span class="value">{{ transferSearch.result.village_name || "Not set" }}</span>
              </div>
              <div class="transfer-fact">
                <span class="label">Sub-location</span>
                <span class="value">{{ transferSearch.result.sublocation_name || "Not set" }}</span>
              </div>
            </div>

            <div class="transfer-household-actions">
              <a-button
                type="primary"
                :disabled="!transferSearch.result.can_transfer || transferSearch.pending"
                @click="openTransferModal"
              >
                Transfer household
              </a-button>
              <a-tag v-if="transferSearch.pending" color="blue">Transfer pending approval</a-tag>
              <span
                v-if="!transferSearch.result.can_transfer && transferSearch.result.cannot_transfer_reason"
                class="transfer-hint"
              >
                {{ transferSearch.result.cannot_transfer_reason }}
              </span>
              <span
                v-else-if="transferSearch.result.destination_count"
                class="transfer-hint"
              >
                {{ transferSearch.result.destination_count }} village(s) in this sub-location
                available as the destination.
              </span>
            </div>
          </div>
        </div>

        <!-- Step 2 — the requests raised (or awaiting approval) -->
        <div class="panel panel-full">
          <div class="transfer-list-head">
            <div class="table-title">2. Transfer requests</div>
            <a-select
              v-if="canApproveTransfers"
              v-model:value="transferStatusFilter"
              size="small"
              style="width: 150px"
              :options="transferStatusOptions"
              @change="fetchTransfers(1)"
            />
          </div>
          <a-alert
            v-if="transfersError"
            class="transfer-alert"
            type="warning"
            show-icon
            :message="transfersError"
          />
          <a-table
            :columns="transferColumns"
            :data-source="transfers"
            :loading="transfersLoading"
            :pagination="false"
            row-key="id"
            size="small"
          >
            <template #transferHousehold="{ record }">
              <div class="transfer-cell-strong">{{ transferHouseholdLabel(record) }}</div>
              <div class="transfer-cell-sub">Household #{{ record.household_id }}</div>
            </template>
            <template #transferVillage="{ record }">{{ transferVillageLabel(record) }}</template>
            <template #transferPost="{ record }">{{ transferPostLabel(record) }}</template>
            <template #transferReason="{ record }">{{ transferReasonValue(record.transfer_reason) }}</template>
            <template #transferRequested="{ record }">
              {{ formatTransferDate(record.transfer_datetime) }}
            </template>
            <template #transferStatus="{ record }">
              <a-tag :color="transferStatusColor(record)">{{ record.approval_status }}</a-tag>
            </template>
            <template #transferAction="{ record }">
              <template v-if="record.approval_status === 'pending' && canApproveTransfers">
                <!-- The API refuses self-approval, so say so instead of failing. -->
                <span v-if="isOwnTransfer(record)" class="transfer-cell-sub">Raised by you</span>
                <a-space v-else>
                  <a @click="approveTransfer(record)">Approve</a>
                  <a class="transfer-danger" @click="rejectTransfer(record)">Reject</a>
                </a-space>
              </template>
              <span v-else>—</span>
            </template>
          </a-table>

          <div class="village-pagination-wrap">
            <a-pagination
              :current="transfersPagination.current"
              :page-size="transfersPagination.pageSize"
              :total="transfersPagination.total"
              :show-total="(total) => `${total} request(s)`"
              @change="fetchTransfers"
            />
          </div>
        </div>
      </section>

      <section v-else class="table-page">
        <h2>{{ sectionTitle }}</h2>
        <a-table
          :columns="historyColumns"
          :data-source="historyRows"
          :pagination="{ pageSize: 10 }"
          row-key="id"
          size="small"
        >
          <template #status="{ record }">
            <a-tag :color="historyStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template #actionType="{ record }">
            {{ prettyAction(record.action_type) }}
          </template>
        </a-table>
      </section>
    </main>

    <main v-else class="workflow-content hh-skeleton">
      <div class="dashboard-grid">
        <div v-for="i in 5" :key="i" class="stat-card">
          <a-skeleton active :paragraph="{ rows: 1 }" />
        </div>
      </div>
      <div class="panel panel-full">
        <div class="table-title"><a-skeleton active style="width: 220px" /></div>
        <a-skeleton active :paragraph="{ rows: 5 }" />
      </div>
    </main>

    <a-modal
      v-model:visible="isHouseholdModalOpen"
      :width="880"
      :footer="null"
      :centered="true"
      :closable="false"
      :body-style="{ padding: '0' }"
      wrap-class-name="hh-review-modal-wrap"
      title=""
      @cancel="closeHouseholdModal"
    >
      <div v-if="activeHousehold" class="hh-modal">
        <!-- Floating side pagers (desktop only) -->
        <a-tooltip title="Previous household (←)" placement="right">
          <button
            class="floating-pager prev"
            type="button"
            :disabled="activeHouseholdGlobalIndex <= 1"
            aria-label="Previous household"
            @click="goToHousehold('prev')"
          >
            <LeftOutlined />
          </button>
        </a-tooltip>
        <a-tooltip title="Next household (→)" placement="left">
          <button
            class="floating-pager next"
            type="button"
            :disabled="activeHouseholdGlobalIndex >= activeVillageTotalHouseholds"
            aria-label="Next household"
            @click="goToHousehold('next')"
          >
            <RightOutlined />
          </button>
        </a-tooltip>

        <!-- Hero header -->
        <header class="hh-hero">
          <button
            class="hh-close"
            type="button"
            aria-label="Close"
            @click="closeHouseholdModal"
          >
            <CloseOutlined />
          </button>
          <div class="hero-top">
            <div class="hero-id">
              <div class="avatar-wrap" :class="{ muted: statusLabel(activeHousehold) === 'Muted', validated: statusLabel(activeHousehold) === 'Validated' }">
                <div class="avatar">{{ activeHouseholdInitials }}</div>
                <span class="avatar-badge" v-if="statusLabel(activeHousehold) === 'Validated'">
                  <CheckCircleFilled />
                </span>
              </div>
              <div class="who">
                <p class="eyebrow">
                  Household Review
                  <span class="dot-sep">·</span>
                  <span class="record-pos">Record {{ activeHouseholdGlobalIndex }} of {{ activeVillageTotalHouseholds }}</span>
                </p>
                <h3 class="name">{{ activeHouseholdFullName || 'Unknown household' }}</h3>
                <div class="meta-row">
                  <span class="meta-chip"><EnvironmentOutlined /> {{ activeVillageName }}</span>
                </div>
              </div>
            </div>
            <div class="hero-status">
              <a-tag
                class="status-pill"
                :color="statusColor(activeHousehold)"
              >
                <CheckCircleFilled v-if="statusLabel(activeHousehold) === 'Validated'" />
                <ClockCircleOutlined v-else />
                {{ statusLabel(activeHousehold) }}
              </a-tag>
              <a-tag v-if="pendingRequestLabel(activeHousehold)" color="warning" class="status-pill">
                Pending: {{ pendingRequestLabel(activeHousehold) }}
              </a-tag>
            </div>
          </div>

          <div class="hero-progress">
            <div class="step-row">
              <span class="step-label">{{ activeVillageName }} progress</span>
              <span class="step-sub"><strong>{{ villageProgressPercent }}%</strong> · {{ villageProgressLabel }}</span>
            </div>
            <div class="step-track" role="progressbar" :aria-valuenow="villageProgressPercent" aria-valuemin="0" aria-valuemax="100">
              <div class="step-fill" :style="{ width: villageProgressPercent + '%' }"></div>
            </div>
          </div>
        </header>

        <!-- Body: facts sheet -->
        <section class="hh-body single">
          <div class="facts-card">
            <div class="facts-card-head">Household details</div>
            <dl class="facts-grid">
              <div class="fact">
                <dt><IdcardOutlined /> National ID</dt>
                <dd>{{ activeHousehold.id_no || '—' }}</dd>
              </div>
              <div class="fact">
                <dt><PhoneOutlined /> Phone</dt>
                <dd>{{ activeHousehold.phone_no || '—' }}</dd>
              </div>
              <div class="fact">
                <dt><TeamOutlined /> Members</dt>
                <dd>{{ activeHousehold.hh_size || '—' }}</dd>
              </div>
              <div class="fact">
                <dt><UserOutlined /> CHP</dt>
                <dd>
                  {{ activeHousehold.chw_id || '—' }}
                  <span v-if="activeHousehold.chw_phone_no" class="fact-sub">
                    {{ activeHousehold.chw_phone_no }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <a-alert
          v-if="isActiveVillageSubmitted"
          message="Village submitted for approval — this household is now view-only."
          type="info"
          show-icon
          class="modal-note"
        />
        <a-alert
          v-else-if="isAlreadyValidated"
          message="This household has already been validated."
          type="success"
          show-icon
          class="modal-note"
        />

        <!-- Sticky action bar -->
        <footer class="action-bar">
          <div class="action-pager">
            <button
              type="button"
              class="pager-btn"
              :disabled="activeHouseholdGlobalIndex <= 1"
              @click="goToHousehold('prev')"
              aria-label="Previous"
            >
              <LeftOutlined />
            </button>
            <span class="pager-pos">{{ activeHouseholdGlobalIndex }} <span class="sep">/</span> {{ activeVillageTotalHouseholds }}</span>
            <button
              type="button"
              class="pager-btn"
              :disabled="activeHouseholdGlobalIndex >= activeVillageTotalHouseholds"
              @click="goToHousehold('next')"
              aria-label="Next"
            >
              <RightOutlined />
            </button>
            <!-- <span class="kbd-hint"><span class="kbd">←</span><span class="kbd">→</span></span> -->
          </div>
          <div class="action-buttons">
            <a-button
              size="large"
              danger
              :disabled="isActiveVillageSubmitted"
              @click="toggleMutePanel"
            >
              <template #icon><StopOutlined /></template>
              Mute
            </a-button>
            <a-button
              size="large"
              :disabled="isActiveVillageSubmitted"
              @click="toggleChangePanel"
            >
              <template #icon><EditOutlined /></template>
              Request change
            </a-button>
            <a-button
              size="large"
              :disabled="isActiveVillageSubmitted"
              @click="toggleSwitchHeadPanel"
            >
              <template #icon><SwapOutlined /></template>
              Switch HH head
            </a-button>
            <a-button
              type="primary"
              size="large"
              class="confirm-cta"
              :disabled="isAlreadyValidated || isActiveVillageSubmitted"
              @click="confirmHousehold"
            >
              <template #icon><CheckOutlined /></template>
              {{ isAlreadyValidated ? 'Validated' : 'Confirm household' }}
            </a-button>
          </div>
        </footer>


        <section v-if="showMutePanel" class="form-panel mute">
          <header class="panel-head">
            <div class="panel-title">
              <span class="panel-icon"><StopOutlined /></span>
              <div>
                <h4>Mute household</h4>
                <p class="panel-sub">Submit a mute request for SCMCC approval. The household will be marked as muted.</p>
              </div>
            </div>
            <button type="button" class="panel-close" @click="showMutePanel = false" aria-label="Close mute form">
              <CloseOutlined />
            </button>
          </header>
          <div class="panel-body">
            <div class="field-grid two-col">
              <div class="field">
                <label class="field-label">Reason <span class="req">*</span></label>
                <a-select v-model:value="muteForm.mute_reason" placeholder="Select a reason" style="width: 100%">
                  <a-select-option value="deceased">Deceased</a-select-option>
                  <a-select-option value="relocated">Relocated</a-select-option>
                  <a-select-option value="duplicate">Duplicate</a-select-option>
                  <a-select-option value="other">Other</a-select-option>
                </a-select>
              </div>
              <div class="field">
                <label class="field-label">Notes <span class="hint">(optional)</span></label>
                <a-input v-model:value="muteForm.notes" placeholder="Add any supporting context" />
              </div>
            </div>
          </div>
          <footer class="panel-footer">
            <a-button @click="showMutePanel = false">Cancel</a-button>
            <a-button type="primary" danger class="panel-cta mute-cta" @click="submitMute">
              <template #icon><StopOutlined /></template>
              Submit mute request
            </a-button>
          </footer>
        </section>

        <section v-if="showChangePanel" class="form-panel change">
          <header class="panel-head">
            <div class="panel-title">
              <span class="panel-icon"><EditOutlined /></span>
              <div>
                <h4>Request change</h4>
                <p class="panel-sub">Send the requested change to SCMCC for approval. Pick the type of change below.</p>
              </div>
            </div>
            <button type="button" class="panel-close" @click="showChangePanel = false" aria-label="Close change form">
              <CloseOutlined />
            </button>
          </header>
          <div class="panel-body">
            <div class="field-grid">
              <div class="field">
                <label class="field-label">Change type <span class="req">*</span></label>
                <a-segmented
                  v-model:value="changeForm.type"
                  :options="changeTypeOptions"
                  block
                />
                <p class="hint inline-hint">{{ changeTypeHint }}</p>
              </div>
            </div>

            <!-- Phone change -->
            <div v-if="changeForm.type === 'phone_change'" class="field-grid two-col">
              <div class="field">
                <label class="field-label">New phone number <span class="req">*</span></label>
                <a-input
                  v-model:value="changeForm.new_phone_no"
                  placeholder="e.g. 0712 345 678"
                  :maxlength="10"
                  autocomplete="off"
                />
                <p v-if="phoneFormatError" class="hint field-error">{{ phoneFormatError }}</p>
              </div>
              <div class="field">
                <label class="field-label">Confirm phone number <span class="req">*</span></label>
                <a-input
                  v-model:value="changeForm.new_phone_no_confirm"
                  placeholder="Re-enter the new phone number"
                  :maxlength="10"
                  autocomplete="off"
                  @paste.prevent
                />
                <p v-if="phoneMismatchError" class="hint field-error">{{ phoneMismatchError }}</p>
              </div>
            </div>

            <!-- Head change (deceased) -->
            <template v-else-if="changeForm.type === 'head_change'">
              <div class="field-grid two-col">
                <div class="field">
                  <label class="field-label">Successor ID number <span class="req">*</span></label>
                  <a-input v-model:value="changeForm.new_id_no" placeholder="National ID of the new head" />
                </div>
                <div class="field">
                  <label class="field-label">Successor phone <span class="req">*</span></label>
                  <a-input
                    v-model:value="changeForm.new_phone_no"
                    placeholder="e.g. 0712 345 678"
                    :maxlength="10"
                    autocomplete="off"
                  />
                  <p v-if="phoneFormatError" class="hint field-error">{{ phoneFormatError }}</p>
                </div>
              </div>
              <div class="field-grid">
                <div class="field">
                  <label class="field-label">Confirm successor phone <span class="req">*</span></label>
                  <a-input
                    v-model:value="changeForm.new_phone_no_confirm"
                    placeholder="Re-enter the successor phone number"
                    :maxlength="10"
                    autocomplete="off"
                    @paste.prevent
                  />
                  <p v-if="phoneMismatchError" class="hint field-error">{{ phoneMismatchError }}</p>
                </div>
              </div>
              <p class="hint">
                Approval will mute the current household (reason: deceased) and create a
                new household record with the successor's details. The successor's
                household will require fresh verification.
              </p>
            </template>

            <!-- Transfer -->
            <template v-else-if="changeForm.type === 'transfer_in'">
              <div class="field-grid two-col">
                <div class="field">
                  <label class="field-label">Destination village <span class="req">*</span></label>
                  <a-select
                    v-model:value="changeForm.new_location_id"
                    show-search
                    :filter-option="filterVillageOption"
                    placeholder="Pick the new village"
                    style="width: 100%"
                  >
                    <a-select-option
                      v-for="item in villages"
                      :key="item.id"
                      :value="item.id"
                      :disabled="item.id === activeHousehold?.location_id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </div>
                <div class="field">
                  <label class="field-label">New household size <span class="hint">(optional)</span></label>
                  <a-input-number
                    v-model:value="changeForm.new_hh_size"
                    :min="1"
                    style="width: 100%"
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>
              <div class="field-grid">
                <div class="field">
                  <label class="field-label">New post ID <span class="hint">(optional)</span></label>
                  <a-input-number
                    v-model:value="changeForm.new_post_id"
                    :min="1"
                    style="width: 100%"
                    placeholder="Distribution post at destination"
                  />
                </div>
              </div>
              <p class="hint">
                Approval will move the household to the destination village. If you
                change the household size, system &amp; actual allocations will be
                recalculated automatically.
              </p>
            </template>

            <div class="field-grid">
              <div class="field">
                <label class="field-label">Notes <span class="hint">(optional)</span></label>
                <a-textarea v-model:value="changeForm.notes" placeholder="Add supporting context for SCMCC" :rows="3" />
              </div>
            </div>
          </div>
          <footer class="panel-footer">
            <a-button @click="showChangePanel = false">Cancel</a-button>
            <a-button
              type="primary"
              class="panel-cta change-cta"
              :disabled="!canSubmitChange"
              @click="submitChange"
            >
              <template #icon><EditOutlined /></template>
              Submit {{ changeTypeLabel }} request
            </a-button>
          </footer>
        </section>

        <!-- Switch HH head: head details are mandatory, the post of collection is optional -->
        <section v-if="showSwitchHeadPanel" class="form-panel switch-head">
          <header class="panel-head">
            <div class="panel-title">
              <span class="panel-icon"><SwapOutlined /></span>
              <div>
                <h4>Switch household head</h4>
                <p class="panel-sub">
                  Update the head's names, national ID and phone number. Keep the
                  household on its current post of collection or switch it to a
                  different post. SCMCC reviews the request before it is applied.
                </p>
              </div>
            </div>
            <button type="button" class="panel-close" @click="closeSwitchHeadPanel" aria-label="Close switch head form">
              <CloseOutlined />
            </button>
          </header>

          <div class="panel-body">
            <div class="field-grid two-col">
              <div class="field">
                <label class="field-label">First name <span class="req">*</span></label>
                <a-input v-model:value="switchHeadForm.first_name" placeholder="Head's first name" autocomplete="off" />
              </div>
              <div class="field">
                <label class="field-label">Middle name <span class="hint">(optional)</span></label>
                <a-input v-model:value="switchHeadForm.middle_name" placeholder="Head's middle name" autocomplete="off" />
              </div>
            </div>

            <div class="field-grid two-col">
              <div class="field">
                <label class="field-label">Last name <span class="req">*</span></label>
                <a-input v-model:value="switchHeadForm.last_name" placeholder="Head's last name" autocomplete="off" />
              </div>
              <div class="field">
                <label class="field-label">National ID number <span class="req">*</span></label>
                <a-input v-model:value="switchHeadForm.id_no" placeholder="Full national ID of the head" autocomplete="off" />
                <p v-if="activeHousehold && activeHousehold.id_no" class="hint">
                  Currently on record: {{ activeHousehold.id_no }}
                </p>
              </div>
            </div>

            <div class="field-grid two-col">
              <div class="field">
                <label class="field-label">Phone number <span class="req">*</span></label>
                <a-input
                  v-model:value="switchHeadForm.phone_no"
                  placeholder="e.g. 0712 345 678"
                  :maxlength="10"
                  autocomplete="off"
                />
                <p v-if="switchPhoneFormatError" class="hint field-error">{{ switchPhoneFormatError }}</p>
                <p v-else-if="activeHousehold && activeHousehold.phone_no" class="hint">
                  Currently on record: {{ activeHousehold.phone_no }}
                </p>
              </div>
              <div class="field">
                <label class="field-label">Confirm phone number <span class="req">*</span></label>
                <a-input
                  v-model:value="switchHeadForm.phone_no_confirm"
                  placeholder="Re-enter the phone number"
                  :maxlength="10"
                  autocomplete="off"
                  @paste.prevent
                />
                <p v-if="switchPhoneMismatchError" class="hint field-error">{{ switchPhoneMismatchError }}</p>
              </div>
            </div>

            <div class="field-grid">
              <div class="field">
                <label class="field-label">Post of collection <span class="req">*</span></label>
                <a-radio-group v-model:value="switchHeadForm.post_mode" button-style="solid">
                  <a-radio-button value="keep">Keep current post</a-radio-button>
                  <a-radio-button value="change">Switch to another post</a-radio-button>
                </a-radio-group>
                <p v-if="switchHeadForm.post_mode === 'keep'" class="hint">
                  The household stays on its current post{{ currentPostLabel ? `: ${currentPostLabel}` : '' }}.
                </p>
                <a-select
                  v-else
                  v-model:value="switchHeadForm.post_id"
                  show-search
                  :filter-option="filterPostOption"
                  :options="switchPostOptions"
                  :loading="switchPostsLoading"
                  :not-found-content="switchPostsLoading ? undefined : 'No posts are mapped to this village'"
                  placeholder="Pick the new post of collection"
                  style="width: 100%"
                />
                <p v-if="switchHeadForm.post_mode === 'change' && !switchHeadForm.post_id" class="hint">
                  Pick the post the household will collect from.
                </p>
              </div>
            </div>
          </div>

          <footer class="panel-footer">
            <a-button @click="closeSwitchHeadPanel">Cancel</a-button>
            <a-button
              type="primary"
              class="panel-cta switch-head-cta"
              :disabled="!canSubmitSwitchHead"
              :loading="switchHeadSubmitting"
              @click="submitSwitchHead"
            >
              <template #icon><SwapOutlined /></template>
              Submit switch request
            </a-button>
          </footer>
        </section>
      </div>
    </a-modal>

    <a-modal v-model:visible="createModalOpen" title="Submit new household creation request" @ok="submitCreate" @cancel="resetCreateForm">
      <a-form layout="vertical">
        <a-row :gutter="12">
          <a-col :span="12"><a-form-item label="First name"><a-input v-model:value="createForm.first_name" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="Last name"><a-input v-model:value="createForm.last_name" /></a-form-item></a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12"><a-form-item label="Middle name"><a-input v-model:value="createForm.middle_name" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="ID no"><a-input v-model:value="createForm.id_no" /></a-form-item></a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12"><a-form-item label="Phone no"><a-input v-model:value="createForm.phone_no" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="HH size"><a-input-number v-model:value="createForm.hh_size" :min="1" style="width: 100%" /></a-form-item></a-col>
        </a-row>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Location">
              <a-select v-model:value="createForm.location_id" style="width: 100%" @change="fetchCreatePosts">
                <a-select-option v-for="item in villages" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Distribution Post">
              <a-select
                v-model:value="createForm.post_id"
                style="width: 100%"
                :loading="createPostsLoading"
                :options="createPostOptions"
                placeholder="Select post"
                allow-clear
                show-search
                :filter-option="filterVillageOption"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Notes"><a-input v-model:value="createForm.notes" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- Household transfer: destination village + post inside the CHA's sub-location -->
    <a-modal
      v-model:visible="transferModal.open"
      :width="640"
      :centered="true"
      :confirm-loading="transferModal.saving"
      :ok-button-props="{ disabled: !canSubmitTransfer }"
      ok-text="Transfer"
      cancel-text="Cancel"
      title="Transfer household"
      @ok="submitTransfer"
    >
      <div v-if="transferModal.household" class="transfer-modal">
        <div class="transfer-facts">
          <div class="transfer-fact">
            <span class="label">Household head</span>
            <span class="value">{{ householdFullName(transferModal.household) || "—" }}</span>
          </div>
          <div class="transfer-fact">
            <span class="label">ID number</span>
            <span class="value">{{ transferModal.household.id_no || "—" }}</span>
          </div>
          <div class="transfer-fact">
            <span class="label">Current village</span>
            <span class="value">{{ transferModal.household.village_name || "Not set" }}</span>
          </div>
        </div>

        <a-form layout="vertical" class="transfer-form">
          <a-form-item label="Destination village (inside your sub-location)" required>
            <a-select
              v-model:value="transferModal.villageId"
              show-search
              :filter-option="filterVillageOption"
              :options="transferModal.villageOptions"
              :loading="transferModal.villagesLoading"
              :not-found-content="transferModal.villagesLoading ? undefined : 'No villages found for this sub-location'"
              placeholder="Select a village"
              @change="onTransferVillageChange"
            />
          </a-form-item>

          <a-form-item label="Post (mapped to the same sub-location)" required>
            <a-select
              v-model:value="transferModal.postId"
              show-search
              :filter-option="filterVillageOption"
              :options="transferModal.postOptions"
              :loading="transferModal.postsLoading"
              :disabled="!transferModal.villageId"
              :not-found-content="transferModal.postsLoading ? undefined : 'No posts are mapped to this sub-location'"
              placeholder="Select the post the household will be assigned to"
            />
          </a-form-item>

          <a-form-item label="Reason" required>
            <a-textarea
              v-model:value="transferModal.reason"
              :rows="3"
              :maxlength="255"
              show-count
              placeholder="Why is the household being moved? e.g. it was registered under the wrong village"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Modal, notification } from "ant-design-vue";
import {
  LeftOutlined,
  RightOutlined,
  CheckOutlined,
  EditOutlined,
  StopOutlined,
  IdcardOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseOutlined,
  SwapOutlined,
} from "@ant-design/icons-vue";
import axios from "@/Axiosconfig";
import { Main } from "../../styled";
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";
import { GATE_DEFINITIONS } from "@/config/navigation-permissions";
import { satisfiesGate } from "@/services/user-role";

const rt = useRouter();
const route = useRoute();
const user = ref(JSON.parse(sessionStorage.getItem("user") || "null"));

const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/household/validation/dashboard" },
  { key: "households", label: "Households", path: "/household/validation/households" },
  { key: "transfers", label: "Transfers", path: "/household/validation/transfers" },
];

// ── Household transfers (CHA flow) ───────────────────────────────────────────
// The CHA searches a household, moves it to a village inside their sub-location
// and assigns it to a post mapped to that sub-location; the SCMCC / Super Admin
// approves or rejects the request. `satisfiesGate` is permission-first (the
// same `role_permission` names the API routes enforce), so the tab, the
// approve/reject actions and the backend always agree on who may act.
const canTransferHouseholds = satisfiesGate(GATE_DEFINITIONS.canTransferHouseholds);
const canApproveTransfers = satisfiesGate(GATE_DEFINITIONS.canApproveHouseholdTransfers);
// Either audience may open the tab: the CHA raises transfers, the SCMCC /
// Super Admin decide them (the actions inside are gated individually).
const canAccessTransferTab = satisfiesGate(GATE_DEFINITIONS.canAccessHouseholdTransfers);

const visibleNavItems = computed(() =>
  navItems.filter((item) => item.key !== "transfers" || canAccessTransferTab.value)
);

// Households per village are paginated server-side. Keep the page size small
// (10) so each request returns a tiny payload even when villages contain
// thousands of registered households.
const HOUSEHOLDS_PAGE_SIZE = 10;

const isLoading = ref(true);
const villages = ref([]);
const householdsByVillage = ref({});
const villageLoading = ref({});
const villagesPaginationMeta = ref({ current: 1, pageSize: 100, total: 0 });
const householdsPaginationMeta = ref({});
// Per-village server-side progress (total / validated / reviewed / pending /
// members) returned by the `village_hh` endpoint, keyed by village id. This
// drives the modal progress bar + collapse header counts with server truth
// instead of counting only the rows of the currently cached page.
const villageSummaryByVillage = ref({});
const villageSubmission = ref({});
const submittingVillage = ref({});
const counties = ref([]);
const subCounties = ref([]);
const wards = ref([]);
const subLocations = ref([]);
const historyRows = ref([]);
const pendingByHousehold = ref({});
const activeVillageKeys = ref([]);
const searchText = ref("");

const isHouseholdModalOpen = ref(false);
const activeVillageId = ref(null);
const activeHouseholdId = ref(null);
const showMutePanel = ref(false);
const showChangePanel = ref(false);

const muteForm = ref({
  mute_reason: "relocated",
  notes: "",
});

const changeForm = ref({
  type: "phone_change",
  new_phone_no: "",
  new_phone_no_confirm: "",
  new_id_no: "",
  new_location_id: null,
  new_post_id: null,
  new_hh_size: null,
  notes: "",
});

const changeTypeOptions = [
  { label: "Phone change", value: "phone_change" },
  { label: "Head change", value: "head_change" },
  { label: "Transfer", value: "transfer_in" },
];

const changeTypeLabel = computed(
  () =>
    ({
      phone_change: "phone change",
      head_change: "head change",
      transfer_in: "transfer",
    }[changeForm.value.type] || "change")
);

const changeTypeHint = computed(
  () =>
    ({
      phone_change: "Update the household's primary contact number.",
      head_change:
        "The current household head is deceased. Mute the household and create a successor record.",
      transfer_in:
        "Move this household to a different village (e.g. relocation).",
    }[changeForm.value.type] || "")
);

const canSubmitChange = computed(() => {
  const f = changeForm.value;
  if (f.type === "phone_change") return !!f.new_phone_no && isPhoneValid.value && isPhoneConfirmed.value;
  if (f.type === "head_change") return !!f.new_id_no && !!f.new_phone_no && isPhoneValid.value && isPhoneConfirmed.value;
  if (f.type === "transfer_in") return !!f.new_location_id;
  return false;
});

// --- Phone validation -------------------------------------------------------
// Accept Kenyan mobile numbers only: must start with 0 and be 10 digits long,
// with a second digit of 7 (07XX — Safaricom/Airtel/Telkom mobile) or 1 (01XX —
// newer Safaricom/Airtel mobile range). Whitespace inside the input is stripped
// before validation so users can type "0712 345 678".
const KE_MOBILE_REGEX = /^0(7|1)\d{8}$/;
const normalizedNewPhone = computed(() =>
  String(changeForm.value.new_phone_no || "").replace(/\s+/g, "")
);
const normalizedNewPhoneConfirm = computed(() =>
  String(changeForm.value.new_phone_no_confirm || "").replace(/\s+/g, "")
);
const phoneRequiresValidation = computed(() =>
  changeForm.value.type === "phone_change" || changeForm.value.type === "head_change"
);
const isPhoneValid = computed(() => KE_MOBILE_REGEX.test(normalizedNewPhone.value));
const isPhoneConfirmed = computed(
  () => normalizedNewPhone.value === normalizedNewPhoneConfirm.value
);
const phoneFormatError = computed(() => {
  if (!phoneRequiresValidation.value) return "";
  const value = normalizedNewPhone.value;
  if (!value) return "";
  if (!/^\d+$/.test(value)) return "Phone number must contain digits only.";
  if (!value.startsWith("0")) return "Phone number must start with 0.";
  if (value.length !== 10) return "Phone number must be exactly 10 digits.";
  if (!KE_MOBILE_REGEX.test(value)) {
    return "Enter a valid Kenyan mobile number (Safaricom, Airtel or Telkom).";
  }
  return "";
});
const phoneMismatchError = computed(() => {
  if (!phoneRequiresValidation.value) return "";
  if (!normalizedNewPhoneConfirm.value) return "";
  if (normalizedNewPhone.value !== normalizedNewPhoneConfirm.value) {
    return "Phone numbers do not match. Please re-enter.";
  }
  return "";
});

const filterVillageOption = (input, option) => {
  const label = (option?.children?.[0]?.children || option?.label || "")
    .toString()
    .toLowerCase();
  return label.includes(String(input).toLowerCase());
};

const resetChangeForm = () => {
  changeForm.value = {
    type: changeForm.value.type || "phone_change",
    new_phone_no: "",
    new_phone_no_confirm: "",
    new_id_no: "",
    new_location_id: null,
    new_post_id: null,
    new_hh_size: null,
    notes: "",
  };
};

// ── Switch HH head ───────────────────────────────────────────────────────────
// A different workflow from the head-change request above: the CHA updates the
// head's own details (names + national ID + phone are mandatory) and either
// keeps the household on its current post of collection or switches it to
// another post. Submits to `households/{id}/switch-head`; the SCMCC reviews it
// through the head-change approve/reject flow before anything is applied.
const showSwitchHeadPanel = ref(false);
const switchHeadSubmitting = ref(false);
const switchPostsLoading = ref(false);
const switchPostOptions = ref([]);

const switchHeadForm = ref({
  first_name: "",
  middle_name: "",
  last_name: "",
  id_no: "",
  phone_no: "",
  phone_no_confirm: "",
  post_mode: "keep", // 'keep' = retain the current post, 'change' = pick another
  post_id: null,
});

const normalizedSwitchPhone = computed(() =>
  String(switchHeadForm.value.phone_no || "").replace(/\s+/g, "")
);
const normalizedSwitchPhoneConfirm = computed(() =>
  String(switchHeadForm.value.phone_no_confirm || "").replace(/\s+/g, "")
);

const switchPhoneFormatError = computed(() => {
  const value = normalizedSwitchPhone.value;
  if (!value) return "";
  if (!/^\d+$/.test(value)) return "Phone number must contain digits only.";
  if (value.length !== 10) return "Phone number must be exactly 10 digits.";
  if (!KE_MOBILE_REGEX.test(value)) {
    return "Enter a valid Kenyan mobile number (Safaricom, Airtel or Telkom).";
  }
  return "";
});

const switchPhoneMismatchError = computed(() => {
  if (!normalizedSwitchPhoneConfirm.value) return "";
  return normalizedSwitchPhone.value === normalizedSwitchPhoneConfirm.value
    ? ""
    : "Phone numbers do not match. Please re-enter.";
});

const canSubmitSwitchHead = computed(() => {
  const f = switchHeadForm.value;
  return (
    !!String(f.first_name || "").trim() &&
    !!String(f.last_name || "").trim() &&
    !!String(f.id_no || "").trim() &&
    KE_MOBILE_REGEX.test(normalizedSwitchPhone.value) &&
    normalizedSwitchPhone.value === normalizedSwitchPhoneConfirm.value &&
    (f.post_mode === "keep" || !!f.post_id)
  );
});

// `format()` hands the modal the post's NAME (not its id), so it can only be
// shown as context — "keep" simply omits post_id from the request.
const currentPostLabel = computed(() => {
  const name = activeHousehold.value?.post_id;
  return typeof name === "string" && name.trim() ? name.trim() : "";
});

/** Posts of the household's village — the same sub-location mapping the transfer form uses. */
const loadSwitchPostOptions = async () => {
  switchPostsLoading.value = true;
  try {
    switchPostOptions.value = await ensureTransferPosts(activeVillageId.value);
  } finally {
    switchPostsLoading.value = false;
  }
};

const filterPostOption = (input, option) => {
  const label = (option?.label || "").toString().toLowerCase();
  return label.includes(String(input).toLowerCase());
};

const resetSwitchHeadForm = () => {
  switchHeadForm.value = {
    first_name: "",
    middle_name: "",
    last_name: "",
    id_no: "",
    phone_no: "",
    phone_no_confirm: "",
    post_mode: "keep",
    post_id: null,
  };
};

const closeSwitchHeadPanel = () => {
  showSwitchHeadPanel.value = false;
  resetSwitchHeadForm();
};

const openSwitchHeadPanel = async () => {
  const hh = activeHousehold.value;
  if (!hh) return;

  showMutePanel.value = false;
  showChangePanel.value = false;
  showSwitchHeadPanel.value = true;

  // Names come from the row (stored with trailing spaces) — they are the only
  // fields the list payload returns unmasked. The ID and phone are masked
  // there, so the CHA keys them in (the masked values are shown as hints) and
  // the post options are loaded lazily.
  resetSwitchHeadForm();
  switchHeadForm.value.first_name = String(hh.first_name || "").trim();
  switchHeadForm.value.middle_name = String(hh.middle_name || "").trim();
  switchHeadForm.value.last_name = String(hh.last_name || "").trim();

  await loadSwitchPostOptions();
};

const toggleSwitchHeadPanel = () => {
  if (showSwitchHeadPanel.value) {
    closeSwitchHeadPanel();
    return;
  }
  openSwitchHeadPanel();
};

const submitSwitchHead = async () => {
  const hh = activeHousehold.value;
  if (!hh) return;
  if (!canSubmitSwitchHead.value) {
    notification.warning({
      message: "Missing required fields",
      description:
        "The head's first & last name, national ID and a confirmed phone number are required. Pick a post if you are switching it.",
    });
    return;
  }

  const f = switchHeadForm.value;
  switchHeadSubmitting.value = true;
  try {
    await axios.post(`households/${hh.id}/switch-head`, {
      first_name: String(f.first_name).trim(),
      middle_name: String(f.middle_name || "").trim() || null,
      last_name: String(f.last_name).trim(),
      id_no: String(f.id_no).trim(),
      phone_no: normalizedSwitchPhone.value,
      // Omitted entirely when the household keeps its current post.
      post_id: f.post_mode === "change" ? Number(f.post_id) : null,
    });

    notification.success({
      message: "Switch request submitted",
      description:
        "SCMCC reviews the request before the household's head details are updated.",
    });

    closeSwitchHeadPanel();
    bumpActiveVillageSummary("reviewed");
    advanceToNextHousehold();
    fetchVillages(villagesPaginationMeta.value.current || 1).catch(() => {});
    fetchHistory().catch(() => {});
  } catch (error) {
    const fieldError = error?.response?.data?.errors
      ? Object.values(error.response.data.errors)[0]?.[0]
      : null;
    notification.error({
      message: "Failed to submit switch request",
      description:
        fieldError ||
        error?.response?.data?.message ||
        "Please check your input and try again.",
    });
  } finally {
    switchHeadSubmitting.value = false;
  }
};

const createModalOpen = ref(false);
const createPosts = ref([]);
const createPostsLoading = ref(false);
const createPostOptions = computed(() =>
  createPosts.value.map((p) => ({
    value: p.id,
    label: p.name || p.post_name || `Post #${p.id}`,
  }))
);
const fetchCreatePosts = async (villageId) => {
  const vId = villageId || createForm.value.location_id;
  createForm.value.post_id = null;
  if (!vId) {
    createPosts.value = [];
    return;
  }
  createPostsLoading.value = true;
  try {
    const { data } = await axios.get(`sublocation_posts?village_id=${vId}`);
    createPosts.value = data?.data || [];
  } catch (e) {
    createPosts.value = [];
  } finally {
    createPostsLoading.value = false;
  }
};
const openCreateModal = () => {
  createModalOpen.value = true;
  if (createForm.value.location_id) fetchCreatePosts(createForm.value.location_id);
};
const createForm = ref({
  first_name: "",
  last_name: "",
  middle_name: "",
  id_no: "",
  phone_no: "",
  hh_size: 1,
  location_id: null,
  post_id: null,
  campaign_id: 1,
  notes: "",
});

const drilldown = ref({
  county_id: null,
  sub_county_id: null,
  ward_id: null,
  sub_location_id: null,
});

const userLocationName = computed(() => user.value?.user?.location?.name || "Assigned location");
const isNationalUser = computed(() => {
  const profile = user.value?.user || {};
  return Number(profile.level_id || user.value?.level_id || 0) === 1 || Number(profile.location_id || user.value?.location_id || 0) === 1;
});

const selectedCountyName = computed(() =>
  counties.value.find((item) => Number(item.id) === Number(drilldown.value.county_id))?.name || "All"
);

const selectedSubCountyName = computed(() =>
  subCounties.value.find((item) => Number(item.id) === Number(drilldown.value.sub_county_id))?.name || "All"
);

const selectedWardName = computed(() =>
  wards.value.find((item) => Number(item.id) === Number(drilldown.value.ward_id))?.name || "All"
);

const selectedSubLocationName = computed(() =>
  subLocations.value.find((item) => Number(item.id) === Number(drilldown.value.sub_location_id))?.name || "All"
);

const activeScopeLocationId = computed(() => {
  if (!isNationalUser.value) {
    return user.value?.user?.location?.id || user.value?.user?.location_id || user.value?.location_id || null;
  }
  return (
    drilldown.value.sub_location_id ||
    drilldown.value.ward_id ||
    drilldown.value.sub_county_id ||
    drilldown.value.county_id ||
    null
  );
});

const scopeSubtitle = computed(() => {
  if (!isNationalUser.value) return userLocationName.value;
  return `National · ${selectedCountyName.value} / ${selectedSubCountyName.value} / ${selectedWardName.value} / ${selectedSubLocationName.value}`;
});

const currentSection = computed(() => {
  const slug = route.path.split("/").pop();
  return navItems.some((n) => n.key === slug) ? slug : "dashboard";
});

const sectionTitle = computed(() => {
  if (currentSection.value === "feedback") return "Feedback";
  if (currentSection.value === "alerts") return "Alerts";
  if (currentSection.value === "audit") return "Audit trail";
  return "Households";
});

const villageColumns = [
  { title: "Village", dataIndex: "name", key: "name" },
  {
    title: "Verified / Total households",
    key: "verified_total",
    slots: { customRender: "verifiedTotal" },
  },
  { title: "Total population", dataIndex: "population", key: "population" },
  { title: "Action", key: "action", slots: { customRender: "action" } },
];

const householdColumns = [
  { title: "Serial No.", dataIndex: "serial", key: "serial", width: 80 },
  { title: "Head of Household", dataIndex: "head", key: "head" },
  { title: "Phone", dataIndex: "phone_no", key: "phone_no", slots: { customRender: "phone" } },
  { title: "Status", key: "status", slots: { customRender: "status" } },
  { title: "Open", key: "action", slots: { customRender: "action" }, width: 80 },
];

const historyColumns = [
  { title: "Request #", dataIndex: "id", key: "id", width: 80 },
  { title: "Action", key: "action_type", slots: { customRender: "actionType" } },
  { title: "Status", key: "status", slots: { customRender: "status" } },
  { title: "Household ID", dataIndex: "household_id", key: "household_id" },
  { title: "Created", dataIndex: "created_at", key: "created_at" },
];

const activeHouseholds = computed(() => {
  if (!activeVillageId.value) return [];
  const cacheKey = getCurrentHouseholdCacheKey(activeVillageId.value);
  return householdsByVillage.value[cacheKey] || [];
});

const activeHouseholdIndex = computed(() =>
  activeHouseholds.value.findIndex((item) => item.id === activeHouseholdId.value)
);

// The modal walks across PAGES of a village, so the position shown to the
// user must be global: (page - 1) * pageSize + position-within-page + 1.
const activeHouseholdGlobalIndex = computed(() => {
  const meta = householdsPaginationMeta.value[activeVillageId.value];
  const page = Number(meta?.current || 1);
  const pageSize = Number(meta?.pageSize || HOUSEHOLDS_PAGE_SIZE);
  const idx = activeHouseholdIndex.value;
  return idx < 0 ? 0 : (page - 1) * pageSize + idx + 1;
});

const activeVillageTotalHouseholds = computed(() =>
  householdCount(activeVillageId.value)
);

// Keep the modal's village-level progress live while a request is in flight:
// the server snapshot (village_hh `summary`) is bumped locally after each
// Confirm / Mute / Change action, then reconciled on the next page load.
const bumpActiveVillageSummary = (kind) => {
  const id = activeVillageId.value;
  const current = villageSummaryByVillage.value[id];
  if (!id || !current) return;
  const total = Number(current.total || 0);
  const next = {
    ...current,
    reviewed: Number(current.reviewed || 0) + 1,
  };
  if (kind === "verified") {
    next.verified = Number(current.verified || 0) + 1;
  }
  if (total > 0) {
    next.reviewed = Math.min(next.reviewed, total);
    next.verified = Math.min(next.verified, total);
  }
  villageSummaryByVillage.value = {
    ...villageSummaryByVillage.value,
    [id]: next,
  };
};

const activeHousehold = computed(() =>
  activeHouseholds.value.find((item) => item.id === activeHouseholdId.value) || null
);

const isAlreadyValidated = computed(() => {
  const hh = activeHousehold.value;
  if (!hh) return true;
  return hh.validated === 1 || hh.validated === true;
});

const isVillageSubmitted = (villageId) =>
  Boolean(villageSubmission.value[villageId]?.submitted);

const isActiveVillageSubmitted = computed(() =>
  isVillageSubmitted(activeVillageId.value)
);

const canSubmitVillage = (villageId) => {
  if (isVillageSubmitted(villageId)) return false;
  const total = householdCount(villageId);
  if (!total) return false;
  return reviewedCount(villageId) >= total;
};

const activeVillageName = computed(() =>
  villages.value.find((v) => v.id === activeVillageId.value)?.name || "Village"
);

const activeHouseholdFullName = computed(() => {
  const hh = activeHousehold.value;
  if (!hh) return "";
  return [hh.first_name, hh.middle_name, hh.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
});

const activeHouseholdInitials = computed(() => {
  const hh = activeHousehold.value;
  if (!hh) return "?";
  const parts = [hh.first_name, hh.last_name].filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .map((p) => String(p).trim()[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
});

const villageProgressPercent = computed(() => {
  if (!activeVillageId.value) return 0;
  const total = householdCount(activeVillageId.value);
  if (!total) return 0;
  return Math.round((reviewedCount(activeVillageId.value) / total) * 100);
});

const villageProgressLabel = computed(() => {
  if (!activeVillageId.value) return "";
  return `${reviewedCount(activeVillageId.value)} / ${householdCount(activeVillageId.value)} reviewed`;
});

const villageSummaryRows = computed(() =>
  villages.value.map((village) => {
    const total = Number(village.no_of_registered_hh || 0);
    const verified = Number(village.no_of_verified_hh || 0);
    const reviewed = Number(
      village.no_of_reviewed_hh ?? village.no_of_verified_hh ?? 0
    );
    return {
      id: village.id,
      name: village.name,
      total_households: total,
      verified_households: verified,
      reviewed_households: reviewed,
      verified_percent: total ? Math.round((verified / total) * 100) : 0,
      population: Number(village.total_members || 0),
    };
  })
);

// Dashboard aggregates come from the server-side per-village counts returned
// by `villages/list` (AdministrativeUnit::formatVillages) — never from the
// cached household pages, which only ever hold one page (10 rows) per village.
const totalHouseholds = computed(() =>
  villages.value.reduce((sum, v) => sum + Number(v.no_of_registered_hh || 0), 0)
);

const villagesReviewed = computed(() =>
  villages.value.filter((v) => {
    const total = Number(v.no_of_registered_hh || 0);
    const reviewed = Number(v.no_of_reviewed_hh ?? v.no_of_verified_hh ?? 0);
    return total > 0 && reviewed >= total;
  }).length
);

const villagesPending = computed(() => Math.max(villages.value.length - villagesReviewed.value, 0));

const categoryTotals = computed(() => {
  const base = {
    pending: { new: 0, muted: 0, changed: 0, transfer: 0 },
    approved: { new: 0, muted: 0, changed: 0, transfer: 0 },
    rejected: { new: 0, muted: 0, changed: 0, transfer: 0 },
  };

  historyRows.value.forEach((item) => {
    const status = ["pending", "approved", "rejected"].includes(item.status)
      ? item.status
      : "pending";
    const bucket = base[status];

    if (item.action_type === "create") bucket.new += 1;
    else if (item.action_type === "mute") bucket.muted += 1;
    else if (item.action_type === "transfer_in") bucket.transfer += 1;
    else if (["phone_change", "head_change"].includes(item.action_type)) bucket.changed += 1;
  });

  return base;
});

const chartRows = computed(() => [
  {
    key: "new",
    label: "New",
    pending: categoryTotals.value.pending.new,
    approved: categoryTotals.value.approved.new,
    rejected: categoryTotals.value.rejected.new,
  },
  {
    key: "muted",
    label: "Muted",
    pending: categoryTotals.value.pending.muted,
    approved: categoryTotals.value.approved.muted,
    rejected: categoryTotals.value.rejected.muted,
  },
  {
    key: "changed",
    label: "Changed",
    pending: categoryTotals.value.pending.changed,
    approved: categoryTotals.value.approved.changed,
    rejected: categoryTotals.value.rejected.changed,
  },
  {
    key: "transfer",
    label: "Transfer",
    pending: categoryTotals.value.pending.transfer,
    approved: categoryTotals.value.approved.transfer,
    rejected: categoryTotals.value.rejected.transfer,
  },
]);

const villagesValidatedPercent = computed(() => {
  if (!villages.value.length) return 0;
  return Math.round((villagesReviewed.value / villages.value.length) * 100);
});

const completionPercent = computed(() => {
  const totals = categoryTotals.value;
  const approved = totals.approved.new + totals.approved.muted + totals.approved.changed + totals.approved.transfer;
  const pending = totals.pending.new + totals.pending.muted + totals.pending.changed + totals.pending.transfer;
  const rejected = totals.rejected.new + totals.rejected.muted + totals.rejected.changed + totals.rejected.transfer;
  const total = approved + pending + rejected;
  if (!total) return 0;
  return Math.round((approved / total) * 100);
});

const maxChartValue = computed(() => {
  const values = chartRows.value.flatMap((row) => [row.pending, row.approved, row.rejected]);
  return Math.max(...values, 1);
});

const barStyle = (value) => ({
  width: `${Math.round((Number(value || 0) / maxChartValue.value) * 100)}%`,
});

const normalizeOrgUnitResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.message)) return payload.message;
  return [];
};

const filterOption = (input, option) =>
  (option?.children || "").toLowerCase().includes(input.toLowerCase());

const normalizePaginationMeta = ({ payload, fallbackCurrent, fallbackPageSize, fallbackTotal }) => {
  const pageMeta =
    payload?.pagination ||
    payload?.meta ||
    payload?.data?.pagination ||
    payload?.data?.meta ||
    {};

  return {
    current:
      Number(pageMeta.current_page || pageMeta.currentPage || pageMeta.page || payload?.current_page) ||
      fallbackCurrent,
    pageSize:
      Number(pageMeta.per_page || pageMeta.perPage || pageMeta.page_size || payload?.per_page) ||
      fallbackPageSize,
    total:
      Number(pageMeta.total || pageMeta.total_count || pageMeta.recordsTotal || payload?.total) ||
      fallbackTotal,
  };
};

const fetchHistory = async () => {
  try {
    const { data } = await axios.get("hh_change_requests/history");
    const rows = data?.data?.data || [];
    historyRows.value = rows;

    const byHousehold = {};
    rows.forEach((row) => {
      if (!row.household_id) return;
      if (!byHousehold[row.household_id]) byHousehold[row.household_id] = [];
      byHousehold[row.household_id].push(row);
    });
    pendingByHousehold.value = byHousehold;
  } catch (error) {
    historyRows.value = [];
    pendingByHousehold.value = {};
  }
};

const fetchVillages = async (page = 1) => {
  const locationId = activeScopeLocationId.value;
  const pageSize = villagesPaginationMeta.value.pageSize || 100;
  const endpoint = `villages/list?page=${page}&per_page=${pageSize}${locationId ? `&location_id=${locationId}` : ""}`;
  const { data } = await axios.get(endpoint);
  villages.value = data?.data || [];
  villagesPaginationMeta.value = normalizePaginationMeta({
    payload: data,
    fallbackCurrent: page,
    fallbackPageSize: pageSize,
    fallbackTotal: villages.value.length,
  });

  if (villages.value.length) {
    createForm.value.location_id = villages.value[0].id;
  }
};

// ── Household transfers (CHA) ────────────────────────────────────────────────
// Step 1: search a verified household (by the household head's ID number).
// Step 2: pick a destination village inside the household's sub-location — the
//         CHA only validates one sub-location, so this is their sub-location.
// Step 3: pick one of the posts mapped to that village's sub-location
//         (post_sublocation_mapping, via sublocation_posts) and give a reason.
// The request stays pending until an approver accepts it; the household keeps
// its current location until then.
const TRANSFERS_PAGE_SIZE = 10;

const transferSearch = reactive({ idNo: "", loading: false, error: "", result: null, pending: false });

const transferModal = reactive({
  open: false,
  saving: false,
  household: null,
  villagesLoading: false,
  postsLoading: false,
  villageOptions: [],
  postOptions: [],
  villageId: null,
  postId: null,
  reason: "",
});

const transfers = ref([]);
const transfersLoading = ref(false);
const transfersError = ref("");
const transfersPagination = reactive({ current: 1, pageSize: TRANSFERS_PAGE_SIZE, total: 0 });

// Approvers work the pending queue (the history holds 800k+ legacy rows), so
// their default filter is "pending"; a CHA always sees their own requests only.
const transferStatusFilter = ref(canApproveTransfers.value ? "pending" : "");
const transferStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "", label: "All" },
];

// Village rows keyed by `administrative_units.id` — the id households (and the
// transfer history rows) store as `location_id`. Each row also carries
// `village_id`, the `org_units` id the posts endpoint resolves villages with.
// Plus the posts mapped to each village's sub-location and the resolved post
// names, so the list and the modal never request the same thing twice.
const transferVillagesById = ref({});
const transferPostsByVillageId = ref({});
const transferPostNames = ref({});
// Names resolved for villages that are NOT in the caller's own scoped list
// (e.g. a household whose current village sits outside their area), keyed by
// administrative_units.id.
const transferVillageNamesById = ref({});

const transferCurrentUserId = computed(() => Number(user.value?.user?.id || 0));

// The API refuses to approve a transfer raised by the same user, so the queue
// shows "Raised by you" instead of buttons that would fail with a 403.
const isOwnTransfer = (record) =>
  transferCurrentUserId.value > 0 &&
  Number(record?.transferred_by) === transferCurrentUserId.value;

// Household names seen while searching / raising transfers, so the queue can
// show a name instead of a bare id (the list endpoint returns ids only).
const transferHouseholdLabels = ref({});

const householdFullName = (row) =>
  [row?.first_name, row?.middle_name, row?.last_name]
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" ");

const rememberTransferHousehold = (household) => {
  const id = Number(household?.id) || 0;
  if (!id) return;
  const label = householdFullName(household);
  if (!label) return;
  transferHouseholdLabels.value = { ...transferHouseholdLabels.value, [id]: label };
};

const transferHouseholdLabel = (record) => {
  const id = Number(record?.household_id) || 0;
  return transferHouseholdLabels.value[id] || (id ? `Household #${id}` : "—");
};

const transferColumns = [
  { title: "Household", key: "household", slots: { customRender: "transferHousehold" } },
  { title: "To village", key: "village", slots: { customRender: "transferVillage" } },
  { title: "Post", key: "post", slots: { customRender: "transferPost" } },
  { title: "Reason", key: "reason", slots: { customRender: "transferReason" } },
  { title: "Requested", key: "requested", slots: { customRender: "transferRequested" } },
  { title: "Status", key: "status", slots: { customRender: "transferStatus" } },
  { title: "Action", key: "action", slots: { customRender: "transferAction" } },
];

const transferStatusColor = (record) => {
  if (record?.approval_status === "approved") return "green";
  if (record?.approval_status === "rejected") return "red";
  return "blue";
};

const transferReasonValue = (value) =>
  value && String(value).trim() ? String(value).trim() : "—";

const formatTransferDate = (value) => {
  if (!value) return "—";
  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};

/**
 * The caller's destination villages. `villages/list` is already scoped to the
 * user's own sub-location by the backend (and carries both ids), so it is the
 * one source of truth for "a village within my sub-location".
 */
const ensureTransferVillages = async () => {
  if (Object.keys(transferVillagesById.value).length) return transferVillagesById.value;

  try {
    const scopeId = Number(activeScopeLocationId.value) || 0;
    const rows = {};
    let page = 1;
    let lastPage = 1;

    // `villages/list` is already scoped to the caller's own sub-location by the
    // backend (it matches the user's location against every ancestor column),
    // 200 per page — walk the pages so nothing is truncated.
    do {
      const { data } = await axios.get(
        `villages/list?page=${page}&per_page=200${scopeId ? `&location_id=${scopeId}` : ""}`
      );

      (data?.data || []).forEach((village) => {
        const id = Number(village.id) || 0;
        if (id) rows[id] = village;
      });

      lastPage = Number(data?.pagination?.total_pages) || 1;
      page += 1;
    } while (page <= lastPage && page <= 5);

    transferVillagesById.value = { ...transferVillagesById.value, ...rows };
  } catch (error) {
    // Keep the cache empty; labels fall back to the raw ids.
  }

  return transferVillagesById.value;
};

const transferVillageRow = (villageId) => transferVillagesById.value[Number(villageId) || 0] || null;

// Destination villages of the sub-location currently being transferred into,
// cached so searching a household and then opening the modal costs one request.
const transferDestinationCache = reactive({ sublocationId: null, rows: [] });

/**
 * Villages that sit in one sub-location (`administrative_unit?sublocation_id=`).
 * Each row carries `id` — the `administrative_units.id` a household's
 * `location_id` stores — and `village_id`, the `org_units` id the posts
 * endpoint resolves villages with.
 */
const fetchTransferSublocationVillages = async (sublocationId) => {
  const id = Number(sublocationId) || 0;
  if (!id) return [];

  const collected = [];
  let page = 1;
  let lastPage = 1;

  try {
    // The endpoint paginates 50 per page — walk the pages (cap at 5 = 250).
    do {
      const { data } = await axios.get(`administrative_unit?sublocation_id=${id}&page=${page}`);

      (data?.data || []).forEach((row) => {
        const villageId = Number(row.id) || 0;
        if (!villageId) return;

        const village = {
          id: villageId,
          village_id: Number(row.village_id) || 0,
          name: row.village || row.name || `Village #${villageId}`,
          sublocation: row.sublocation || null,
          sublocation_id: id,
        };

        collected.push(village);
        transferVillagesById.value = { ...transferVillagesById.value, [villageId]: village };
      });

      lastPage = Number(data?.pagination?.total_pages) || 1;
      page += 1;
    } while (page <= lastPage && page <= 5);
  } catch (error) {
    return collected;
  }

  return collected;
};

/**
 * A household may be transferred when it sits inside the caller's own area of
 * coverage. The caller's org unit is compared against every ancestor recorded on
 * the household (county → sub-location), mirroring how `villages/list` scopes a
 * user: a CHA whose location is a sub-county matches `hh_subcounty_id`, one
 * bound to a sub-location matches `hh_sublocation_id`.
 */
const householdInTransferScope = (household) => {
  const scopeId = Number(activeScopeLocationId.value) || 0;
  if (!scopeId) return true;

  return [
    household?.location_id,
    household?.hh_sublocation_id,
    household?.hh_location_id,
    household?.hh_ward_id,
    household?.hh_subcounty_id,
    household?.hh_county_id,
  ].some((carriedId) => Number(carriedId) === scopeId);
};

const transferVillageLabel = (record) => {
  const id = Number(record?.location_id) || 0;
  if (!id) return "—";
  const village = transferVillageRow(id);
  return village ? village.name : transferVillageNamesById.value[id] || `Village #${id}`;
};

/**
 * Village name for an `administrative_units.id` that is not in the scoped list —
 * `village_hh` resolves a village by exactly that id, so the household card and
 * the queue can still show a name instead of "Village #1234".
 */
const fetchTransferVillageName = async (villageId) => {
  const id = Number(villageId) || 0;
  if (!id) return null;
  if (transferVillageRow(id)?.name) return transferVillageRow(id).name;
  if (transferVillageNamesById.value[id]) return transferVillageNamesById.value[id];

  try {
    const { data } = await axios.get(`village_hh?village_id=${id}&per_page=1`);
    const name = data?.village?.name || null;

    if (name) {
      transferVillageNamesById.value = { ...transferVillageNamesById.value, [id]: name };
    }

    return name;
  } catch (error) {
    return null;
  }
};

/** Posts mapped to the village's sub-location (`sublocation_posts`). */
const ensureTransferPosts = async (villageId) => {
  const id = Number(villageId) || 0;
  if (!id) return [];
  if (transferPostsByVillageId.value[id] !== undefined) return transferPostsByVillageId.value[id];

  let village = transferVillageRow(id);

  if (!village) {
    // Not cached yet (e.g. a queue row) — resolve it from the scoped list.
    await ensureTransferVillages();
    village = transferVillageRow(id);
  }

  if (!village?.village_id) {
    transferPostsByVillageId.value = { ...transferPostsByVillageId.value, [id]: [] };
    return [];
  }

  try {
    // The endpoint resolves the village through org_units, so it needs the
    // village's `village_id` (org_units id) — not administrative_units.id.
    const { data } = await axios.get(`sublocation_posts?village_id=${Number(village.village_id)}`);
    const options = (data?.data || []).map((post) => ({
      value: Number(post.id),
      label: post.name || post.post || `Post #${post.id}`,
    }));

    transferPostsByVillageId.value = { ...transferPostsByVillageId.value, [id]: options };
    return options;
  } catch (error) {
    transferPostsByVillageId.value = { ...transferPostsByVillageId.value, [id]: [] };
    return [];
  }
};

const transferPostLabel = (record) => {
  const villageId = Number(record?.location_id) || 0;
  const postId = Number(record?.post_id) || 0;
  if (!postId) return "—";
  return transferPostNames.value[`${villageId}:${postId}`] || `Post #${postId}`;
};

/** Resolve the village + post names a page of transfer rows shows. */
const prefetchTransferLabels = async (rows) => {
  await ensureTransferVillages();

  // Queue rows can point at villages outside the caller's scoped list.
  const unresolvedVillageIds = [...new Set(rows.map((row) => Number(row.location_id) || 0))].filter(
    (id) => id && !transferVillageRow(id) && !transferVillageNamesById.value[id]
  );

  await Promise.all(unresolvedVillageIds.map((id) => fetchTransferVillageName(id)));

  const pairs = rows
    .map((row) => ({ villageId: Number(row.location_id) || 0, postId: Number(row.post_id) || 0 }))
    .filter(
      ({ villageId, postId }) =>
        villageId && postId && transferPostNames.value[`${villageId}:${postId}`] === undefined
    );

  await Promise.all(
    pairs.map(async ({ villageId, postId }) => {
      const options = await ensureTransferPosts(villageId);
      const found = options.find((option) => option.value === postId);
      transferPostNames.value = {
        ...transferPostNames.value,
        [`${villageId}:${postId}`]: found ? found.label : `Post #${postId}`,
      };
    })
  );
};

/** The caller's transfer requests (the whole queue for an approver). */
const fetchTransfers = async (page = 1) => {
  transfersLoading.value = true;
  transfersError.value = "";
  try {
    const status = String(transferStatusFilter.value || "").trim();
    const { data } = await axios.get(
      `transfers?page=${page}&per_page=${TRANSFERS_PAGE_SIZE}${
        status ? `&approval_status=${encodeURIComponent(status)}` : ""
      }`
    );
    const pageRows = data?.data || [];
    // The list endpoint has no "mine" filter: a CHA only acts on the requests
    // they raised, while approvers review every pending request of the campaign.
    const rows = canApproveTransfers.value
      ? pageRows
      : pageRows.filter((row) => Number(row.transferred_by) === transferCurrentUserId.value);

    transfers.value = rows;
    transfersPagination.current = Number(data?.current_page) || page;
    transfersPagination.pageSize = Number(data?.per_page) || TRANSFERS_PAGE_SIZE;
    transfersPagination.total = canApproveTransfers.value
      ? Number(data?.total) || rows.length
      : rows.length;

    await prefetchTransferLabels(rows);
  } catch (error) {
    transfers.value = [];
    transfersPagination.total = 0;

    const status = Number(error?.response?.status) || 0;
    if (status === 403) {
      transfersError.value = "You do not have permission to view household transfers.";
    } else if (status >= 500) {
      transfersError.value =
        "The transfer list could not be loaded. New transfers can still be raised below — refresh in a moment.";
    } else {
      transfersError.value =
        error?.response?.data?.message || "Could not load the transfer list.";
    }
  } finally {
    transfersLoading.value = false;
  }
};

/** Step 1 — find the household to move (verified + active only). */
const searchTransferHousehold = async () => {
  const idNo = String(transferSearch.idNo || "").trim();
  transferSearch.error = "";
  transferSearch.result = null;
  transferSearch.pending = false;

  if (!idNo) {
    transferSearch.error = "Enter the household head's ID number.";
    return;
  }

  transferSearch.loading = true;
  try {
    const { data } = await axios.get(`transfers/search-household?id_no=${encodeURIComponent(idNo)}`);
    const household = data?.data || null;

    if (!household) {
      transferSearch.error = "No verified, active household found with that ID number.";
      return;
    }

    // The household must sit inside the caller's own area of coverage. A CHA's
    // `location_id` is usually the sub-county, so the match is against ANY
    // ancestor the household records (sub-county, ward, location, sub-location).
    if (!householdInTransferScope(household)) {
      transferSearch.error =
        "This household is outside your area of coverage, so it cannot be transferred from here.";
      return;
    }

    const householdSubLocationId = Number(household.hh_sublocation_id) || 0;

    transferSearch.result = {
      ...household,
      village_name: household.location_id ? `Village #${household.location_id}` : null,
      sublocation_name: null,
      destination_count: 0,
      can_transfer: householdSubLocationId > 0,
      cannot_transfer_reason: householdSubLocationId
        ? ""
        : "This household has no sub-location recorded, so the villages to move it to cannot be resolved.",
    };
    rememberTransferHousehold(household);

    // Resolve the current village name, then load the destination villages of
    // the household's sub-location (the transfer modal reuses that response).
    const scopedVillages = await ensureTransferVillages();
    const currentVillage = scopedVillages[Number(household.location_id)];

    if (currentVillage) {
      transferSearch.result.village_name = currentVillage.name;
    } else if (household.location_id) {
      // The household's village can sit outside the caller's scoped list.
      const resolvedName = await fetchTransferVillageName(household.location_id);
      if (resolvedName) transferSearch.result.village_name = resolvedName;
    }

    if (householdSubLocationId) {
      const destinations = await loadTransferDestinationVillages(household);

      transferSearch.result.sublocation_name =
        destinations.find((village) => village.sublocation)?.sublocation || null;

      transferSearch.result.destination_count = destinations.filter(
        (village) => Number(village.id) > 0 && Number(village.id) !== Number(household.location_id)
      ).length;

      if (!transferSearch.result.destination_count) {
        transferSearch.result.can_transfer = false;
        transferSearch.result.cannot_transfer_reason =
          "No other village was found in this household's sub-location, so there is nowhere to transfer it to.";
      }
    }
  } catch (error) {
    transferSearch.error = error?.response?.data?.message || "Could not search for that household.";
  } finally {
    transferSearch.loading = false;
  }
};

/**
 * Step 2 — the village picker. Destination villages are the villages of the
 * household's sub-location (which is the CHA's area of coverage), i.e. exactly
 * "a village within their sub-location". Returns the rows so callers can tell
 * whether the sub-location even has somewhere to move to.
 */
const loadTransferDestinationVillages = async (household = null) => {
  const target = household || transferModal.household;
  const sublocationId = Number(target?.hh_sublocation_id) || 0;
  const currentVillageId = Number(target?.location_id) || 0;

  transferModal.villagesLoading = true;
  try {
    let rows = [];

    if (sublocationId) {
      rows =
        transferDestinationCache.sublocationId === sublocationId
          ? transferDestinationCache.rows
          : await fetchTransferSublocationVillages(sublocationId);

      transferDestinationCache.sublocationId = sublocationId;
      transferDestinationCache.rows = rows;
    } else {
      // No sub-location recorded on the household: fall back to every village
      // the caller may see (`villages/list` is scoped to their own location).
      rows = Object.values(await ensureTransferVillages());
    }

    transferModal.villageOptions = rows
      .filter((village) => Number(village.id) > 0 && Number(village.id) !== currentVillageId)
      .map((village) => ({
        // administrative_units.id — the id a household's `location_id` stores.
        value: Number(village.id),
        label: village.name || `Village #${village.id}`,
      }));

    return rows;
  } catch (error) {
    transferModal.villageOptions = [];
    return [];
  } finally {
    transferModal.villagesLoading = false;
  }
};

/** Step 3 — the post picker: posts mapped to the village's sub-location. */
const onTransferVillageChange = async (villageId) => {
  transferModal.postId = null;
  transferModal.postOptions = [];
  const id = Number(villageId) || 0;
  if (!id) return;

  transferModal.postsLoading = true;
  try {
    transferModal.postOptions = await ensureTransferPosts(id);
  } finally {
    transferModal.postsLoading = false;
  }
};

const canSubmitTransfer = computed(
  () =>
    Boolean(transferModal.household) &&
    Boolean(transferModal.villageId) &&
    Boolean(transferModal.postId) &&
    String(transferModal.reason || "").trim().length > 0
);

const openTransferModal = async () => {
  const household = transferSearch.result;
  if (!household || !household.can_transfer) return;

  transferModal.household = household;
  transferModal.open = true;
  transferModal.saving = false;
  transferModal.villageId = null;
  transferModal.postId = null;
  transferModal.postOptions = [];
  transferModal.reason = "";

  await loadTransferDestinationVillages();
};

const submitTransfer = async () => {
  const household = transferModal.household;
  if (!household || !canSubmitTransfer.value) {
    notification.warning({
      message: "Incomplete transfer",
      description: "Pick the destination village and post, and give a reason.",
    });
    return;
  }

  transferModal.saving = true;
  try {
    await axios.post("transfers", {
      household_id: Number(household.id),
      // Destination village as administrative_units.id — the id a household's
      // `location_id` (and this history table) stores.
      location_id: Number(transferModal.villageId),
      post_id: Number(transferModal.postId),
      transfer_reason: String(transferModal.reason).trim(),
      // The destination is inside the same sub-location as the household (the
      // picker only offers those villages), so the household's recorded chain
      // stays valid for the new record and is sent as-is.
      hh_county_id: household.hh_county_id ?? null,
      hh_subcounty_id: household.hh_subcounty_id ?? null,
      hh_ward_id: household.hh_ward_id ?? null,
      hh_location_id: household.hh_location_id ?? null,
      hh_sublocation_id: household.hh_sublocation_id ?? null,
    });

    transferModal.open = false;
    transferSearch.pending = true;

    notification.success({
      message: "Transfer request submitted",
      description:
        "It stays pending until the SCMCC approves it — the household keeps its current location until then.",
    });

    await fetchTransfers(1);
  } catch (error) {
    notification.error({
      message: "Transfer failed",
      description: error?.response?.data?.message || "Could not submit the transfer.",
    });
  } finally {
    transferModal.saving = false;
  }
};

/** Approve / reject — only rendered for holders of the approval permissions. */
const decideTransfer = (record, decision) => {
  const approving = decision === "approve";

  Modal.confirm({
    title: approving ? "Approve transfer" : "Reject transfer",
    content: approving
      ? `Move the household to ${transferVillageLabel(record)} and assign it to the selected post?`
      : `Reject the transfer to ${transferVillageLabel(record)}? The household keeps its current location.`,
    okText: approving ? "Approve" : "Reject",
    okButtonProps: { danger: !approving },
    async onOk() {
      try {
        await axios.post(`transfers/${record.id}/${decision}`);
        notification.success({ message: approving ? "Transfer approved" : "Transfer rejected" });
        await fetchTransfers(transfersPagination.current);
      } catch (error) {
        notification.error({
          message: approving ? "Approval failed" : "Rejection failed",
          description: error?.response?.data?.message || "Please try again.",
        });
      }
    },
  });
};

const approveTransfer = (record) => decideTransfer(record, "approve");
const rejectTransfer = (record) => decideTransfer(record, "reject");

// Load the queue the first time the tab is opened (or on a direct visit).
watch(
  () => currentSection.value,
  (section) => {
    if (section === "transfers" && canAccessTransferTab.value) {
      fetchTransfers(1).catch(() => {});
    }
  },
  { immediate: true }
);

const fetchCounties = async () => {
  try {
    const { data } = await axios.get("get_counties");
    counties.value = normalizeOrgUnitResponse(data);
  } catch (error) {
    counties.value = [];
    notification.error({
      message: "Failed to load counties",
      description: error?.response?.data?.message || "Please try again.",
    });
  }
};

const fetchChildrenByParentOrgId = async (parentOrgId) => {
  if (!parentOrgId) return [];
  const { data } = await axios.get(`get_sub_counties_list?parent_id=${parentOrgId}`);
  return normalizeOrgUnitResponse(data);
};

const findById = (rows, id) => rows.find((item) => Number(item.id) === Number(id));

const handleCountyChange = async (countyId) => {
  drilldown.value.sub_county_id = null;
  drilldown.value.ward_id = null;
  drilldown.value.sub_location_id = null;
  wards.value = [];
  subLocations.value = [];

  const selected = findById(counties.value, countyId);
  subCounties.value = selected ? await fetchChildrenByParentOrgId(selected.org_id) : [];
  await refreshAll();
};

const handleSubCountyChange = async (subCountyId) => {
  drilldown.value.ward_id = null;
  drilldown.value.sub_location_id = null;
  subLocations.value = [];

  const selected = findById(subCounties.value, subCountyId);
  wards.value = selected ? await fetchChildrenByParentOrgId(selected.org_id) : [];
  await refreshAll();
};

const handleWardChange = async (wardId) => {
  drilldown.value.sub_location_id = null;
  const selected = findById(wards.value, wardId);
  subLocations.value = selected ? await fetchChildrenByParentOrgId(selected.org_id) : [];
  await refreshAll();
};

const handleSubLocationChange = async () => {
  await refreshAll();
};

const resetDrilldown = async () => {
  drilldown.value = {
    county_id: null,
    sub_county_id: null,
    ward_id: null,
    sub_location_id: null,
  };
  subCounties.value = [];
  wards.value = [];
  subLocations.value = [];
  await refreshAll();
};

const ensureVillageLoaded = async (villageId, page = 1, { force = false } = {}) => {
  const cacheKey = `${villageId}_${page}`;
  if (!force && householdsByVillage.value[cacheKey]) {
    // Make sure the active page meta reflects this cached page so the table
    // paginator shows the right "current" value when re-opening a panel.
    const existingMeta = householdsPaginationMeta.value[villageId];
    if (existingMeta && existingMeta.current !== page) {
      householdsPaginationMeta.value = {
        ...householdsPaginationMeta.value,
        [villageId]: { ...existingMeta, current: page },
      };
    }
    return;
  }
  villageLoading.value = { ...villageLoading.value, [villageId]: true };
  try {
    const pageSize = HOUSEHOLDS_PAGE_SIZE;
    const { data } = await axios.get(`village_hh?village_id=${villageId}&page=${page}&per_page=${pageSize}`);
    const allRows = data?.data || [];
    const rows = allRows.map((row, index) => ({
      ...row,
      serial: String((page - 1) * pageSize + index + 1).padStart(3, "0"),
      head: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
    }));

    householdsByVillage.value = {
      ...householdsByVillage.value,
      [cacheKey]: rows,
    };

    if (data?.village) {
      villageSubmission.value = {
        ...villageSubmission.value,
        [villageId]: {
          submitted: Boolean(data.village.submitted),
          submitted_at: data.village.submitted_at,
          submitted_by: data.village.submitted_by,
        },
      };
    }

    // Server-side progress for this village — source of truth for the modal
    // progress bar + collapse header counts regardless of which page of
    // households the user is looking at.
    if (data?.summary) {
      villageSummaryByVillage.value = {
        ...villageSummaryByVillage.value,
        [villageId]: {
          total: Number(data.summary.total || 0),
          verified: Number(data.summary.validated || 0),
          reviewed: Number(data.summary.reviewed ?? data.summary.validated ?? 0),
          pending: Number(data.summary.pending || 0),
          members: Number(data.summary.total_members || 0),
        },
      };
    }

    householdsPaginationMeta.value = {
      ...householdsPaginationMeta.value,
      [villageId]: normalizePaginationMeta({
        payload: data,
        fallbackCurrent: page,
        fallbackPageSize: pageSize,
        fallbackTotal: rows.length,
      }),
    };
  } catch (error) {
    notification.error({
      message: "Failed to load village households",
      description: error?.response?.data?.message || "Please try again.",
    });
  } finally {
    villageLoading.value = { ...villageLoading.value, [villageId]: false };
  }
};

const handleVillagePageChange = async (pagination) => {
  const nextPage = Number(pagination?.current || pagination || 1);
  const nextSize =
    Number(pagination?.pageSize) ||
    villagesPaginationMeta.value.pageSize ||
    100;
  villagesPaginationMeta.value = {
    ...villagesPaginationMeta.value,
    current: nextPage,
    pageSize: nextSize,
  };
  await fetchVillages(nextPage);
};

const handleHouseholdPageChange = async (villageId, page) => {
  // Record the new current page up-front so the paginator UI updates even
  // while the request is in flight (and so it persists when the response
  // is served from cache and short-circuits the meta refresh).
  const existingMeta = householdsPaginationMeta.value[villageId] || {
    current: 1,
    pageSize: HOUSEHOLDS_PAGE_SIZE,
    total: 0,
  };
  householdsPaginationMeta.value = {
    ...householdsPaginationMeta.value,
    [villageId]: { ...existingMeta, current: page },
  };
  await ensureVillageLoaded(villageId, page);
};

// Called by the collapse panel header click. The header is a wide hit-target
// that fires every time the user clicks anywhere in the panel chrome — we
// must NOT reload page 1 each time, otherwise the active paginator + cache
// key snap back to page 1 (breaking the modal view and the next-page click).
const ensureVillageInitiallyLoaded = (villageId) => {
  const hasAnyPageCached = Object.keys(householdsByVillage.value).some((key) =>
    key.startsWith(`${villageId}_`),
  );
  if (hasAnyPageCached) return;
  ensureVillageLoaded(villageId, 1);
};

const refreshAll = async () => {
  isLoading.value = true;
  try {
    householdsByVillage.value = {};
    householdsPaginationMeta.value = {};
    villageSummaryByVillage.value = {};
    villageLoading.value = {};
    activeVillageKeys.value = [];
    activeVillageId.value = null;
    activeHouseholdId.value = null;
    villagesPaginationMeta.value.current = 1;
    // The dashboard only needs the server-side village aggregates
    // (`villages/list`) + the change-request history. Households are NOT
    // pre-fetched per village — they load lazily when the CHA expands a
    // village (ensureVillageInitiallyLoaded / activeVillageKeys watch), so
    // the initial route resolves in two requests regardless of how many
    // villages the scope contains.
    await fetchHistory();
    await fetchVillages(1);
  } finally {
    isLoading.value = false;
  }
};

const openVillage = (villageId) => {
  rt.push("/household/validation/households");
  activeVillageKeys.value = [String(villageId)];
};

const householdCount = (villageId) => {
  const total = householdsPaginationMeta.value[villageId]?.total;
  if (total !== undefined) return total;
  const village = villages.value.find((v) => v.id === villageId);
  if (
    village &&
    village.no_of_registered_hh !== undefined &&
    village.no_of_registered_hh !== null
  ) {
    return Number(village.no_of_registered_hh);
  }
  const cacheKey = getCurrentHouseholdCacheKey(villageId);
  return (householdsByVillage.value[cacheKey] || []).length;
};

// Server-authoritative "reviewed" count per village (validated OR muted) —
// matches the backend's submission rule (submitVillage). Falls back to the
// loaded page rows only when the aggregate sources haven't arrived yet.
const reviewedCount = (villageId) => {
  const summary = villageSummaryByVillage.value[villageId];
  if (summary && summary.reviewed !== undefined) return Number(summary.reviewed);
  const village = villages.value.find((v) => v.id === villageId);
  if (
    village &&
    village.no_of_reviewed_hh !== undefined &&
    village.no_of_reviewed_hh !== null
  ) {
    return Number(village.no_of_reviewed_hh);
  }
  const cacheKey = getCurrentHouseholdCacheKey(villageId);
  return (householdsByVillage.value[cacheKey] || []).filter((row) => statusLabel(row) !== "Pending Review").length;
};

const getCurrentHouseholdPage = (villageId) => {
  return householdsPaginationMeta.value[villageId]?.current || 1;
};

const getCurrentHouseholdCacheKey = (villageId) => {
  const page = getCurrentHouseholdPage(villageId);
  return `${villageId}_${page}`;
};

const filteredHouseholds = (villageId) => {
  const cacheKey = getCurrentHouseholdCacheKey(villageId);
  const rows = householdsByVillage.value[cacheKey] || [];
  const needle = searchText.value.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter(
    (row) =>
      row.head?.toLowerCase().includes(needle) ||
      row.phone_no?.toLowerCase().includes(needle) ||
      row.id_no?.toLowerCase().includes(needle)
  );
};

const latestRequest = (householdId) => {
  const rows = pendingByHousehold.value[householdId] || [];
  if (!rows.length) return null;
  return rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
};

const pendingRequestLabel = (record) => {
  const req = latestRequest(record.id);
  if (!req || req.status !== "pending") return "";
  return prettyAction(req.action_type);
};

const statusLabel = (record) => {
  const req = latestRequest(record.id);
  // A pending mute request should already surface as "Muted" so reviewers can
  // see at a glance which households have been requested for muting.
  if (req?.status === "pending" && req?.action_type === "mute") return "Muted";
  if (req?.status === "pending") return "Pending Review";
  if (req?.status === "approved" && req?.action_type === "mute") return "Muted";
  if (record.is_muted === 1 || record.is_muted === true) return "Muted";
  if (record.validated === 1 || record.validated === true) return "Validated";
  return "Pending Review";
};

const statusColor = (record) => {
  const status = statusLabel(record);
  if (status === "Validated") return "gold";
  if (status === "Muted") return "default";
  return "blue";
};

// Mask the middle 4 digits of a phone number for line-list display.
// e.g. "0715765988" -> "071****988", "254712345678" -> "2547****5678".
// The household review modal continues to read `phone_no` directly, so the
// full number remains visible there.
const maskPhone = (phone) => {
  if (phone === null || phone === undefined || phone === "") return "—";
  const s = String(phone);
  if (s.length <= 4) return s;
  const start = Math.floor((s.length - 4) / 2);
  return s.slice(0, start) + "****" + s.slice(start + 4);
};

const historyStatusColor = (status) => {
  if (status === "approved") return "green";
  if (status === "rejected") return "red";
  return "blue";
};

const prettyAction = (action) => {
  if (action === "create") return "New household";
  if (action === "mute") return "Mute";
  if (action === "transfer_in") return "Transfer";
  if (action === "phone_change") return "Phone change";
  if (action === "head_change") return "Head change";
  return action || "Unknown";
};

const openHouseholdModal = async (villageId, householdId) => {
  // Load the page the user is currently viewing — not page 1 — otherwise
  // the active cache key (and the table's current page) would snap back to
  // page 1 and the household id from a later page would be missing from
  // `activeHouseholds`, leaving the modal grayed out with no body.
  const page = getCurrentHouseholdPage(villageId);
  await ensureVillageLoaded(villageId, page);
  activeVillageId.value = villageId;
  activeHouseholdId.value = householdId;
  isHouseholdModalOpen.value = true;
  showMutePanel.value = false;
  showChangePanel.value = false;
};

const closeHouseholdModal = () => {
  isHouseholdModalOpen.value = false;
  showMutePanel.value = false;
  showChangePanel.value = false;
};

const goToHousehold = async (direction) => {
  const villageId = activeVillageId.value;
  const list = activeHouseholds.value;
  if (!villageId || !list.length) return;
  const index = activeHouseholdIndex.value;
  const meta = householdsPaginationMeta.value[villageId] || {
    current: 1,
    pageSize: HOUSEHOLDS_PAGE_SIZE,
    total: 0,
  };

  if (direction === "next") {
    if (index >= 0 && index + 1 < list.length) {
      activeHouseholdId.value = list[index + 1].id;
    } else {
      // End of the current page — paginate forward transparently so the modal
      // walks every household in the village, not just the current page.
      const lastPage = Math.max(
        Math.ceil((meta.total || 0) / (meta.pageSize || HOUSEHOLDS_PAGE_SIZE)),
        meta.current
      );
      if (meta.current < lastPage) {
        const nextPage = meta.current + 1;
        await handleHouseholdPageChange(villageId, nextPage);
        const nextList =
          householdsByVillage.value[`${villageId}_${nextPage}`] || [];
        if (nextList.length) activeHouseholdId.value = nextList[0].id;
      } else {
        notification.info({
          message: "You've reached the last household in this village.",
        });
      }
    }
  } else {
    if (index > 0) {
      activeHouseholdId.value = list[index - 1].id;
    } else if (meta.current > 1) {
      // First row of this page — hop back to the previous page's last row.
      const prevPage = meta.current - 1;
      await handleHouseholdPageChange(villageId, prevPage);
      const prevList =
        householdsByVillage.value[`${villageId}_${prevPage}`] || [];
      if (prevList.length) {
        activeHouseholdId.value = prevList[prevList.length - 1].id;
      }
    } else {
      notification.info({
        message: "This is the first household in this village.",
      });
    }
  }

  showMutePanel.value = false;
  showChangePanel.value = false;
};

const confirmHousehold = async () => {
  if (!activeHousehold.value) return;
  try {
    const hhSize = Number(activeHousehold.value.hh_size || 1);
    const villageId = activeVillageId.value;
    const list = activeHouseholds.value;
    const currentIndex = activeHouseholdIndex.value;
    const currentHouseholdId = activeHousehold.value.id;
    const nextHouseholdId =
      currentIndex >= 0 && currentIndex + 1 < list.length
        ? list[currentIndex + 1].id
        : null;

    await axios.patch(`verify_household?house_id=${currentHouseholdId}&inputValue=${hhSize}`);
    notification.success({ message: "Household confirmed" });

    // Reflect the confirmation in the village-level progress immediately
    // (the background fetchVillages / next page load reconcile from server).
    bumpActiveVillageSummary("verified");

    // Update the local record in place so progress counters refresh and the
    // confirmed row shows as "Validated" — without unmounting the modal.
    if (villageId) {
      const cacheKey = getCurrentHouseholdCacheKey(villageId);
      const rows = householdsByVillage.value[cacheKey];
      if (Array.isArray(rows)) {
        const idx = rows.findIndex((r) => r.id === currentHouseholdId);
        if (idx !== -1) {
          const updated = [...rows];
          updated[idx] = { ...updated[idx], validated: 1, hh_size: hhSize };
          householdsByVillage.value = {
            ...householdsByVillage.value,
            [cacheKey]: updated,
          };
        }
      }
    }

    showMutePanel.value = false;
    showChangePanel.value = false;

    if (nextHouseholdId) {
      activeHouseholdId.value = nextHouseholdId;
    } else {
      // End of the current page — advance into the next page's households
      // instead of stopping the session ("next" shows the end-of-village
      // message only after the true last household).
      await goToHousehold("next");
    }

    // Refresh village-level progress + history in the background — these update
    // the dashboard cards without touching the modal's household cache.
    fetchVillages(villagesPaginationMeta.value.current || 1).catch(() => {});
    fetchHistory().catch(() => {});
  } catch (error) {
    notification.error({
      message: "Failed to confirm household",
      description: error?.response?.data?.message || "Please try again.",
    });
  }
};

const toggleMutePanel = () => {
  showMutePanel.value = !showMutePanel.value;
  showChangePanel.value = false;
  showSwitchHeadPanel.value = false;
};

const toggleChangePanel = () => {
  showChangePanel.value = !showChangePanel.value;
  showMutePanel.value = false;
  showSwitchHeadPanel.value = false;
};

// Advance the modal to the next household in the current village list
// without unmounting it. Used after Confirm / Mute / Request change / Switch
// head so the CHA can keep reviewing without re-opening the modal each time.
const advanceToNextHousehold = () => {
  const list = activeHouseholds.value;
  if (!list.length) return;
  const currentIndex = activeHouseholdIndex.value;
  const nextHouseholdId =
    currentIndex >= 0 && currentIndex + 1 < list.length
      ? list[currentIndex + 1].id
      : null;
  showMutePanel.value = false;
  showChangePanel.value = false;
  showSwitchHeadPanel.value = false;
  if (nextHouseholdId) {
    activeHouseholdId.value = nextHouseholdId;
  } else {
    // End of the current page — advance into the next page's households
    // ("next" shows the end-of-village message only after the true last row).
    goToHousehold("next");
  }
};

const submitMute = async () => {
  if (!activeHousehold.value) return;
  try {
    await axios.post("hh_change_request/mute", {
      household_id: activeHousehold.value.id,
      mute_reason: muteForm.value.mute_reason,
      notes: muteForm.value.notes,
    });
    notification.success({ message: "Mute request submitted" });
    // The household is now "reviewed" (validated OR mute-requested) — bump the
    // local progress snapshot immediately.
    bumpActiveVillageSummary("reviewed");
    muteForm.value.notes = "";
    advanceToNextHousehold();
    // Refresh village-level progress + history in the background so the
    // dashboard cards update without unmounting the modal.
    fetchVillages(villagesPaginationMeta.value.current || 1).catch(() => {});
    fetchHistory().catch(() => {});
  } catch (error) {
    notification.error({
      message: "Failed to submit mute request",
      description: error?.response?.data?.message || "Please check your input and try again.",
    });
  }
};

const submitChange = async () => {
  if (!activeHousehold.value) return;
  if (!canSubmitChange.value) {
    notification.warning({
      message: "Missing required fields",
      description: "Please fill in the required fields for this change type.",
    });
    return;
  }

  const type = changeForm.value.type;
  let endpoint = "";
  let payload = {
    household_id: activeHousehold.value.id,
    notes: changeForm.value.notes,
  };

  if (type === "phone_change") {
    endpoint = "hh_change_request/phone_change";
    payload.new_phone_no = normalizedNewPhone.value;
  } else if (type === "head_change") {
    endpoint = "hh_change_request/head_change";
    payload.new_id_no = changeForm.value.new_id_no;
    payload.new_phone_no = normalizedNewPhone.value;
  } else {
    endpoint = "hh_change_request/transfer";
    payload.new_location_id = changeForm.value.new_location_id;
    if (changeForm.value.new_post_id) payload.new_post_id = changeForm.value.new_post_id;
    if (changeForm.value.new_hh_size) payload.new_hh_size = changeForm.value.new_hh_size;
  }

  try {
    await axios.post(endpoint, payload);
    notification.success({ message: "Change request submitted" });
    // The household is now "reviewed" (a request is in flight) — bump the
    // local progress snapshot immediately.
    bumpActiveVillageSummary("reviewed");
    resetChangeForm();
    advanceToNextHousehold();
    fetchVillages(villagesPaginationMeta.value.current || 1).catch(() => {});
    fetchHistory().catch(() => {});
  } catch (error) {
    notification.error({
      message: "Failed to submit change request",
      description: error?.response?.data?.message || "Please check your input and try again.",
    });
  }
};

const submitCreate = async () => {
  try {
    await axios.post("hh_change_request/create", createForm.value);
    notification.success({ message: "New household request submitted" });
    createModalOpen.value = false;
    resetCreateForm();
    await refreshAll();
  } catch (error) {
    notification.error({
      message: "Failed to submit creation request",
      description: error?.response?.data?.message || "Please check required fields.",
    });
  }
};

const submitVillage = async (villageId) => {
  if (!canSubmitVillage(villageId)) {
    notification.warning({
      message: "Cannot submit village",
      description: "All households must be reviewed and validated first.",
    });
    return;
  }
  submittingVillage.value = { ...submittingVillage.value, [villageId]: true };
  try {
    const { data } = await axios.post("village_hh/submit", { village_id: villageId });
    villageSubmission.value = {
      ...villageSubmission.value,
      [villageId]: {
        submitted: true,
        submitted_at: data?.data?.submitted_at || new Date().toISOString(),
        submitted_by: data?.data?.submitted_by || user.value?.id || null,
      },
    };
    notification.success({
      message: "Village submitted",
      description: data?.message || "Village locked for further changes.",
    });
  } catch (error) {
    notification.error({
      message: "Failed to submit village",
      description: error?.response?.data?.message || "Please try again.",
    });
  } finally {
    submittingVillage.value = { ...submittingVillage.value, [villageId]: false };
  }
};

const resetCreateForm = () => {
  createForm.value = {
    first_name: "",
    last_name: "",
    middle_name: "",
    id_no: "",
    phone_no: "",
    hh_size: 1,
    location_id: villages.value[0]?.id || null,
    post_id: null,
    campaign_id: 1,
    notes: "",
  };
};

watch(
  () => activeVillageKeys.value,
  (keys) => {
    const villageId = Number(keys?.[0] || 0);
    if (villageId) {
      ensureVillageLoaded(villageId);
    }
  }
);

onMounted(async () => {
  if (!user.value?.token) {
    rt.push({ path: "/auth/login" });
    return;
  }
  if (isNationalUser.value) {
    await fetchCounties();
  }
  await refreshAll();
  window.addEventListener("keydown", handleModalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleModalKeydown);
});

const handleModalKeydown = (event) => {
  if (!isHouseholdModalOpen.value) return;
  const tag = event.target?.tagName;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
  if (event.target?.isContentEditable) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToHousehold("prev");
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    goToHousehold("next");
  }
};
</script>

<style lang="less" scoped>
.hh-validation-page {
  .panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 10px;
    padding: 16px 20px 18px;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }

  .workflow-content {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .drilldown-panel {
    margin-bottom: 2px;
  }

  .drilldown-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .drilldown-head h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
  }

  .drilldown-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .scope-meta {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
    font-size: 11px;
    color: #476f5b;
  }

  .scope-meta b {
    color: #1c5c39;
    font-weight: 700;
  }

  .ph-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .nav-item {
    padding: 6px 12px;
    border-radius: 18px;
    border: 1px solid #d9f0e2;
    background: #ffffff;
    color: #2f6746;
    font-size: 12px;
    font-weight: 600;
  }

  .nav-item.active {
    background: #daf4e4;
    border-color: #9ad8b4;
    color: #15693c;
  }

  .dashboard-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .stat-card {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 8px;
    padding: 14px 16px;
    text-align: center;
  }

  .stat-card .label {
    font-size: 11px;
    color: #7a8a82;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .value-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 22px;
    font-weight: 800;
    color: #15693c;
    line-height: 1.1;
  }

  .value-row .ok { color: #20c997; }
  .value-row .warn { color: #fa8b0c; }

  .meta-row {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #7a8a82;
  }

  .chips {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .chips span {
    border-radius: 6px;
    border: 1px solid #e1efe6;
    background: #f6fbf8;
    color: #2f6746;
    padding: 6px 8px;
    font-size: 11px;
    font-weight: 700;
  }

  .chips.denied span {
    background: #fff5f5;
    border-color: #ffd9d9;
    color: #b42318;
  }

  .panel-wide { grid-column: span 3; }
  .progress-panel { grid-column: span 2; }
  .panel-full { grid-column: 1 / -1; }

  .panel h3 {
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
    margin-bottom: 12px;
  }

  .bar-chart {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .bar-row {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 8px;
    align-items: center;
  }

  .bar-label { font-size: 12px; color: #4d8a63; }

  .bar-group {
    display: grid;
    grid-template-rows: repeat(3, 8px);
    gap: 5px;
  }

  .bar { border-radius: 999px; min-width: 2px; }
  .bar.pending { background: #2c99ff; }
  .bar.approved { background: #20c997; }
  .bar.denied { background: #ff4d4f; }

  .legend {
    display: flex;
    gap: 12px;
    margin-top: 12px;
    font-size: 11px;
    color: #7a8a82;
  }

  .legend .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
  }

  .legend .dot.pending { background: #2c99ff; }
  .legend .dot.approved { background: #20c997; }
  .legend .dot.denied { background: #ff4d4f; }

  .progress-main {
    font-size: 30px;
    font-weight: 800;
    color: #15693c;
    margin-bottom: 4px;
  }

  .progress-sub,
  .progress-label {
    font-size: 11px;
    color: #7a8a82;
    margin-bottom: 8px;
  }

  .table-title {
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
    margin-bottom: 8px;
  }

  .village-skeleton {
    padding: 12px 16px;
  }

  .verified-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .verified-cell .verified-counts {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    color: #2f3937;
    font-size: 13px;
  }

  .verified-cell .verified-counts strong {
    color: #15693c;
    font-size: 14px;
  }

  .verified-cell .verified-counts .sep {
    color: #b6c4bd;
  }

  .section-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 10px;
  }

  .section-head h2 {
    margin: 0;
    font-size: 16px;
    color: #2f6746;
    font-weight: 700;
  }

  .section-head p {
    margin: 2px 0 0;
    font-size: 12px;
    color: #7a8a82;
  }

  .village-pagination-wrap {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }

  .village-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 10px;
  }

  .village-header .title {
    font-size: 14px;
    font-weight: 700;
    color: #1f2437;
  }

  .village-header .sub {
    font-size: 11px;
    color: #7a8a82;
  }

  .village-header .right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .loading-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 260px;
  }

  :deep(.ant-collapse) {
    border-radius: 10px;
    border-color: #d9f0e2;
    overflow: hidden;
  }

  :deep(.ant-collapse > .ant-collapse-item > .ant-collapse-header) {
    background: #f6fbf8;
    border-bottom: 1px solid #e6f3eb;
  }

  :deep(.ant-collapse-content > .ant-collapse-content-box) {
    padding: 12px;
  }

  :deep(.ant-table-thead > tr > th) {
    background: #f4fbf6;
    border-bottom: 1px solid #d9f0e2;
    color: #2f6746;
    font-weight: 700;
    font-size: 11px;
  }

  :deep(.ant-table-tbody > tr > td) {
    border-bottom: 1px solid #eaf4ee;
    font-size: 12px;
    color: #1f2437;
  }

  :deep(.ant-table-tbody > tr:hover > td) {
    background: #f5fbf7;
  }

  .hh-modal {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(15, 60, 38, 0.22);
  }

  // ── Hero header ──
  .hh-hero {
    position: relative;
    padding: 26px 28px 20px;
    color: #11281c;
    background:
      radial-gradient(900px 240px at -10% -40%, rgba(32, 201, 151, 0.18) 0%, transparent 60%),
      radial-gradient(700px 220px at 110% -30%, rgba(15, 105, 60, 0.16) 0%, transparent 55%),
      linear-gradient(180deg, #f4fbf6 0%, #ffffff 100%);
    border-bottom: 1px solid #ecf3ef;
  }

  .hh-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid #e6efe9;
    background: rgba(255, 255, 255, 0.92);
    color: #6f8076;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.15s;
    z-index: 6;
  }
  .hh-close:hover {
    background: #15693c;
    color: #fff;
    border-color: #15693c;
    transform: rotate(90deg);
  }

  .hero-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  .hero-id {
    display: flex;
    gap: 16px;
    align-items: center;
    min-width: 0;
  }

  .avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: linear-gradient(135deg, #2f6746 0%, #15693c 50%, #20c997 100%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 10px 22px rgba(15, 105, 60, 0.28);
    border: 3px solid rgba(255, 255, 255, 0.85);
  }
  .avatar-wrap.muted .avatar {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    box-shadow: 0 10px 22px rgba(100, 116, 139, 0.25);
  }
  .avatar-badge {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffffff;
    color: #15693c;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 4px 10px rgba(15, 105, 60, 0.2);
  }

  .who { min-width: 0; flex: 1; }

  .who .eyebrow {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #2f6746;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .who .eyebrow .dot-sep { color: #c4d2cb; }
  .who .eyebrow .record-pos {
    color: #6f8076;
    letter-spacing: 0.04em;
    font-weight: 600;
  }

  .who .name {
    margin: 4px 0 10px;
    font-size: 26px;
    font-weight: 700;
    color: #0f1f17;
    line-height: 1.15;
    letter-spacing: -0.02em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #dceee3;
    border-radius: 999px;
    font-size: 12px;
    color: #2f3937;
    font-weight: 500;
  }
  .meta-chip :deep(.anticon) {
    color: #2f6746;
    font-size: 12px;
  }

  .hero-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    flex-shrink: 0;
    margin-right: 44px; /* clear the close button */
  }

  .status-pill {
    display: inline-flex !important;
    align-items: center;
    gap: 5px;
    padding: 4px 12px !important;
    border-radius: 999px !important;
    font-weight: 600;
    font-size: 12px;
    border: none !important;
  }

  // ── Progress bar ──
  .hero-progress {
    margin-top: 18px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid #e6efe9;
    border-radius: 12px;
    backdrop-filter: blur(4px);
  }
  .step-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
    gap: 12px;
    flex-wrap: wrap;
  }
  .step-label {
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #2f6746;
  }
  .step-sub {
    font-size: 12px;
    color: #6f8076;
  }
  .step-sub strong {
    color: #15693c;
    font-weight: 700;
  }
  .step-track {
    height: 8px;
    background: #e6efe9;
    border-radius: 999px;
    overflow: hidden;
  }
  .step-fill {
    height: 100%;
    background: linear-gradient(90deg, #20c997 0%, #15693c 100%);
    border-radius: 999px;
    transition: width 0.4s ease;
    box-shadow: 0 0 12px rgba(32, 201, 151, 0.35);
  }

  // ── Body ──
  .hh-body {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 16px;
    padding: 20px 28px 0;
  }

  // Featured stat card
  .hero-stat {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
    border-radius: 14px;
    background:
      radial-gradient(120% 120% at 0% 0%, rgba(255, 255, 255, 0.25) 0%, transparent 60%),
      linear-gradient(160deg, #15693c 0%, #2f6746 60%, #20c997 130%);
    color: #ffffff;
    box-shadow: 0 12px 28px rgba(15, 105, 60, 0.28);
    position: relative;
    overflow: hidden;
  }
  .hero-stat::after {
    content: "";
    position: absolute;
    top: -40px;
    right: -40px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
  }
  .stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.18);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #ffffff;
  }
  .stat-label {
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    opacity: 0.85;
  }
  .stat-value {
    font-size: 42px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
    margin: 2px 0;
  }
  .stat-sub {
    font-size: 12px;
    opacity: 0.82;
  }

  // Facts sheet
  .facts-card {
    background: #ffffff;
    border: 1px solid #e6efe9;
    border-radius: 14px;
    overflow: hidden;
  }
  .facts-card-head {
    padding: 12px 16px;
    background: #f5fbf7;
    border-bottom: 1px solid #e6efe9;
    font-size: 11.5px;
    font-weight: 700;
    color: #2f6746;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .facts-grid {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .facts-grid .fact {
    padding: 12px 16px;
    border-right: 1px dashed #eef5f1;
    border-bottom: 1px dashed #eef5f1;
    transition: background 0.15s;
  }
  .facts-grid .fact:hover { background: #f9fdfb; }
  .facts-grid .fact:nth-child(2n) { border-right: none; }
  .facts-grid .fact:nth-last-child(-n+2) { border-bottom: none; }
  .facts-grid dt {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #6f8076;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 4px;
  }
  .facts-grid dt :deep(.anticon) {
    color: #94a3b8;
    font-size: 12px;
  }
  .facts-grid dd {
    margin: 0;
    color: #0f1f17;
    font-weight: 600;
    font-size: 14px;
    word-break: break-word;
  }
  .facts-grid dd .fact-sub {
    display: block;
    margin-top: 2px;
    color: #6f8076;
    font-weight: 500;
    font-size: 12px;
  }

  .modal-note {
    margin: 14px 28px 0;
    border-radius: 10px;
  }

  // ── Action bar ──
  .action-bar {
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-top: 20px;
    padding: 14px 28px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, #f8fcfa 100%);
    border-top: 1px solid #ecf3ef;
    backdrop-filter: blur(8px);
    z-index: 4;
  }

  .action-pager {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .pager-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid #d4ead9;
    background: #ffffff;
    color: #2f6746;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .pager-btn:not(:disabled):hover {
    background: #15693c;
    color: #fff;
    border-color: #15693c;
  }
  .pager-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .pager-pos {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    padding: 0 10px;
    font-size: 13px;
    font-weight: 700;
    color: #15693c;
    min-width: 56px;
    justify-content: center;
  }
  .pager-pos .sep { color: #b6c4bd; font-weight: 400; }

  .kbd-hint {
    display: inline-flex;
    gap: 3px;
    margin-left: 8px;
  }
  .kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 5px;
    background: #ffffff;
    border: 1px solid #d4ead9;
    border-bottom-width: 2px;
    border-radius: 5px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    color: #2f6746;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .action-buttons .ant-btn {
    border-radius: 8px;
    font-weight: 600;
    min-width: 120px;
  }
  .action-buttons .confirm-cta {
    min-width: 180px;
    background: #15693c;
    border-color: #15693c;
    box-shadow: 0 6px 16px rgba(15, 105, 60, 0.32);
  }
  .action-buttons .confirm-cta:hover:not(:disabled),
  .action-buttons .confirm-cta:focus:not(:disabled) {
    background: #2f6746;
    border-color: #2f6746;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(15, 105, 60, 0.38);
  }
  .action-buttons .confirm-cta:disabled {
    background: #cfe5d8;
    border-color: #cfe5d8;
    color: #ffffff;
    box-shadow: none;
  }

  // ── Floating prev/next pagers (desktop only, redundant with bar) ──
  .floating-pager {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid #d4ead9;
    background: #ffffff;
    color: #2f6746;
    cursor: pointer;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 10px 22px rgba(15, 105, 60, 0.16);
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.15s, color 0.15s, border-color 0.15s;
  }
  .floating-pager.prev { left: -22px; }
  .floating-pager.next { right: -22px; }
  .floating-pager:not(:disabled):hover,
  .floating-pager:not(:disabled):focus {
    background: #15693c;
    color: #ffffff;
    border-color: #15693c;
    transform: translateY(-50%) scale(1.08);
    box-shadow: 0 14px 28px rgba(15, 105, 60, 0.32);
    outline: none;
  }
  .floating-pager:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }

  // ── Inline form panels (mute / change) ──
  .form-panel {
    margin: 14px 28px 0;
    border: 1px solid #dceee3;
    border-radius: 12px;
    background: #f8fcfa;
    padding: 14px 16px 16px;
  }
  .form-panel.mute {
    background: #fff7f6;
    border-color: #f5d2cd;
  }
  .form-panel h4 {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
  }
  .form-panel.mute h4 { color: #c0392b; }

  .inline-form {
    display: grid;
    grid-template-columns: 180px 1fr auto;
    gap: 10px;
  }
  .inline-form.stacked { grid-template-columns: 1fr; }

  // ── Modal chrome overrides ──
  :deep(.hh-review-modal-wrap .ant-modal-content) {
    border-radius: 16px;
    overflow: hidden;
    background: transparent;
    box-shadow: none;
  }
  :deep(.hh-review-modal-wrap .ant-modal-header) { display: none; }
  :deep(.hh-review-modal-wrap .ant-modal-body) { padding: 0; }

  @media (max-width: 1100px) {
    .dashboard-grid { grid-template-columns: 1fr; }
    .panel-wide,
    .progress-panel,
    .panel-full { grid-column: auto; }

    .drilldown-grid,
    .scope-meta {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 760px) {
    .section-head {
      flex-direction: column;
      align-items: stretch;
    }

    .village-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .hh-card .grid {
      grid-template-columns: 1fr;
    }

    .hh-hero {
      padding: 20px 18px 16px;
    }
    .hero-top {
      flex-direction: column;
      align-items: stretch;
    }
    .hero-status {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      margin-right: 40px;
    }
    .who .name {
      font-size: 21px;
      white-space: normal;
    }
    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      font-size: 19px;
    }

    .hh-body {
      grid-template-columns: 1fr;
      padding: 16px 18px 0;
    }
    .stat-value { font-size: 36px; }

    .facts-grid {
      grid-template-columns: 1fr;
    }
    .facts-grid .fact {
      border-right: none !important;
      border-bottom: 1px dashed #eef5f1 !important;
    }
    .facts-grid .fact:last-child { border-bottom: none !important; }

    .modal-note { margin: 14px 18px 0; }
    .form-panel { margin: 14px 18px 0; }

    .action-bar {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
      padding: 14px 18px;
    }
    .action-pager { justify-content: center; }
    .kbd-hint { display: none; }
    .action-buttons {
      width: 100%;
      flex-wrap: wrap;
    }
    .action-buttons .ant-btn {
      flex: 1 1 auto;
      min-width: 0;
    }
    .action-buttons .confirm-cta {
      flex-basis: 100%;
      order: -1;
      min-width: 0;
    }

    // Hide floating pagers on mobile — pager controls live in the action bar
    .floating-pager { display: none; }

    .inline-form {
      grid-template-columns: 1fr;
    }

    .drilldown-grid,
    .scope-meta {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      font-size: 17px;
    }
    .who .name { font-size: 19px; }
    .stat-value { font-size: 32px; }
  }

  /* ── Additional mobile UX hardening ───────────────────────────── */
  @media (max-width: 760px) {
    .panel {
      padding: 12px 12px 14px;
      border-radius: 8px;
    }
    .page-heading {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
    .ph-title { font-size: 15px; }
    .ph-subtitle { font-size: 11.5px; }
    .ph-actions {
      width: 100%;
      overflow-x: auto;
      flex-wrap: nowrap;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 4px;
      &::-webkit-scrollbar { height: 4px; }
    }
    .nav-item {
      flex: 0 0 auto;
      padding: 6px 10px;
      font-size: 11.5px;
    }
    .dashboard-grid { gap: 8px; }
    .stat-card { padding: 10px 12px; }
    .value-row { font-size: 18px; }
    .chips { grid-template-columns: 1fr 1fr; gap: 6px; }
    .chips span { font-size: 10.5px; padding: 5px 6px; }
    .scope-meta { font-size: 10.5px; }
  }

  @media (max-width: 480px) {
    .ph-title { font-size: 14px; }
    .nav-item { padding: 5px 9px; font-size: 11px; }
    .value-row { font-size: 16px; }
    .chips { grid-template-columns: 1fr; }
  }
}
</style>

<!--
  Modal styles live in a NON-scoped block because Ant Design Vue teleports
  the modal to document.body. Rules are namespaced under `.hh-review-modal-wrap`
  (the wrap-class-name we pass to <a-modal>) so they can't leak elsewhere.
-->
<style lang="less">
.hh-review-modal-wrap {
  // Reset Ant's default modal chrome
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
    background: transparent;
    box-shadow: none;
    padding: 0;
  }
  .ant-modal-header { display: none; }
  .ant-modal-body { padding: 0; }
  .ant-modal-close { display: none; }

  .hh-modal {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(15, 60, 38, 0.22);
    font-family: inherit;
  }

  // ── Hero header ──
  .hh-hero {
    position: relative;
    padding: 26px 28px 20px;
    color: #11281c;
    background:
      radial-gradient(900px 240px at -10% -40%, rgba(32, 201, 151, 0.18) 0%, transparent 60%),
      radial-gradient(700px 220px at 110% -30%, rgba(15, 105, 60, 0.16) 0%, transparent 55%),
      linear-gradient(180deg, #f4fbf6 0%, #ffffff 100%);
    border-bottom: 1px solid #ecf3ef;
  }

  .hh-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid #e6efe9;
    background: rgba(255, 255, 255, 0.92);
    color: #6f8076;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.2s;
    z-index: 6;
  }
  .hh-close:hover {
    background: #15693c;
    color: #fff;
    border-color: #15693c;
    transform: rotate(90deg);
  }

  .hero-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }
  .hero-id {
    display: flex;
    gap: 16px;
    align-items: center;
    min-width: 0;
    flex: 1;
  }

  .avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }
  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: linear-gradient(135deg, #2f6746 0%, #15693c 50%, #20c997 100%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 10px 22px rgba(15, 105, 60, 0.28);
    border: 3px solid rgba(255, 255, 255, 0.85);
  }
  .avatar-wrap.muted .avatar {
    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
    box-shadow: 0 10px 22px rgba(100, 116, 139, 0.25);
  }
  .avatar-badge {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffffff;
    color: #15693c;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 4px 10px rgba(15, 105, 60, 0.2);
  }

  .who { min-width: 0; flex: 1; }
  .who .eyebrow {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #2f6746;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .who .eyebrow .dot-sep { color: #c4d2cb; }
  .who .eyebrow .record-pos {
    color: #6f8076;
    letter-spacing: 0.04em;
    font-weight: 600;
  }
  .who .name {
    margin: 4px 0 10px;
    font-size: 26px;
    font-weight: 700;
    color: #0f1f17;
    line-height: 1.15;
    letter-spacing: -0.02em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #dceee3;
    border-radius: 999px;
    font-size: 12px;
    color: #2f3937;
    font-weight: 500;
  }
  .meta-chip .anticon {
    color: #2f6746;
    font-size: 12px;
  }

  .hero-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    flex-shrink: 0;
    margin-right: 44px;
  }
  .status-pill {
    display: inline-flex !important;
    align-items: center;
    gap: 5px;
    padding: 4px 12px !important;
    border-radius: 999px !important;
    font-weight: 600;
    font-size: 12px;
    border: none !important;
  }

  // ── Progress card ──
  .hero-progress {
    margin-top: 18px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid #e6efe9;
    border-radius: 12px;
  }
  .step-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
    gap: 12px;
    flex-wrap: wrap;
  }
  .step-label {
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #2f6746;
  }
  .step-sub { font-size: 12px; color: #6f8076; }
  .step-sub strong { color: #15693c; font-weight: 700; }
  .step-track {
    height: 8px;
    background: #e6efe9;
    border-radius: 999px;
    overflow: hidden;
  }
  .step-fill {
    height: 100%;
    background: linear-gradient(90deg, #20c997 0%, #15693c 100%);
    border-radius: 999px;
    transition: width 0.4s ease;
    box-shadow: 0 0 12px rgba(32, 201, 151, 0.35);
  }

  // ── Body ──
  .hh-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 20px 28px 0;
  }
  .hh-body.single { grid-template-columns: 1fr; }

  .hero-stat {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
    border-radius: 14px;
    background:
      radial-gradient(120% 120% at 0% 0%, rgba(255, 255, 255, 0.25) 0%, transparent 60%),
      linear-gradient(160deg, #15693c 0%, #2f6746 60%, #20c997 130%);
    color: #ffffff;
    box-shadow: 0 12px 28px rgba(15, 105, 60, 0.28);
    position: relative;
    overflow: hidden;
  }
  .hero-stat::after {
    content: "";
    position: absolute;
    top: -40px;
    right: -40px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
  }
  .hero-stat .stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.18);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #ffffff;
  }
  .stat-label {
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    opacity: 0.85;
  }
  .stat-value {
    font-size: 42px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.02em;
    margin: 2px 0;
  }
  .stat-sub { font-size: 12px; opacity: 0.82; }

  .facts-card {
    background: #ffffff;
    border: 1px solid #e6efe9;
    border-radius: 14px;
    overflow: hidden;
  }
  .facts-card-head {
    padding: 12px 16px;
    background: #f5fbf7;
    border-bottom: 1px solid #e6efe9;
    font-size: 11.5px;
    font-weight: 700;
    color: #2f6746;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .facts-grid {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .facts-grid .fact {
    padding: 12px 16px;
    border-right: 1px dashed #eef5f1;
    border-bottom: 1px dashed #eef5f1;
    transition: background 0.15s;
  }
  .facts-grid .fact:hover { background: #f9fdfb; }
  .facts-grid .fact:nth-child(2n) { border-right: none; }
  .facts-grid .fact:nth-last-child(-n+2) { border-bottom: none; }
  .facts-grid dt {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #6f8076;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 4px;
  }
  .facts-grid dt .anticon { color: #94a3b8; font-size: 12px; }
  .facts-grid dd {
    margin: 0;
    color: #0f1f17;
    font-weight: 600;
    font-size: 14px;
    word-break: break-word;
  }
  .facts-grid dd .fact-sub {
    display: block;
    margin-top: 2px;
    color: #6f8076;
    font-weight: 500;
    font-size: 12px;
  }

  .modal-note {
    margin: 14px 28px 0;
    border-radius: 10px;
  }

  // ── Action bar ──
  .action-bar {
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-top: 20px;
    padding: 14px 28px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, #f8fcfa 100%);
    border-top: 1px solid #ecf3ef;
    backdrop-filter: blur(8px);
    z-index: 4;
  }
  .action-pager {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .pager-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid #d4ead9;
    background: #ffffff;
    color: #2f6746;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .pager-btn:not(:disabled):hover {
    background: #15693c;
    color: #fff;
    border-color: #15693c;
  }
  .pager-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .pager-pos {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
    padding: 0 10px;
    font-size: 13px;
    font-weight: 700;
    color: #15693c;
    min-width: 56px;
    justify-content: center;
  }
  .pager-pos .sep { color: #b6c4bd; font-weight: 400; }

  .kbd-hint { display: inline-flex; gap: 3px; margin-left: 8px; }
  .kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 5px;
    background: #ffffff;
    border: 1px solid #d4ead9;
    border-bottom-width: 2px;
    border-radius: 5px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    color: #2f6746;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .action-buttons .ant-btn {
    border-radius: 8px;
    font-weight: 600;
    min-width: 120px;
  }
  .action-buttons .confirm-cta.ant-btn-primary {
    min-width: 180px;
    background: #15693c;
    border-color: #15693c;
    box-shadow: 0 6px 16px rgba(15, 105, 60, 0.32);
  }
  .action-buttons .confirm-cta.ant-btn-primary:hover:not(:disabled),
  .action-buttons .confirm-cta.ant-btn-primary:focus:not(:disabled) {
    background: #2f6746;
    border-color: #2f6746;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(15, 105, 60, 0.38);
  }
  .action-buttons .confirm-cta.ant-btn-primary:disabled,
  .action-buttons .confirm-cta.ant-btn-primary[disabled] {
    background: #cfe5d8;
    border-color: #cfe5d8;
    color: #ffffff;
    box-shadow: none;
  }

  // ── Floating prev/next pagers ──
  .floating-pager {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid #d4ead9;
    background: #ffffff;
    color: #2f6746;
    cursor: pointer;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 10px 22px rgba(15, 105, 60, 0.16);
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.15s, color 0.15s, border-color 0.15s;
  }
  .floating-pager.prev { left: -22px; }
  .floating-pager.next { right: -22px; }
  .floating-pager:not(:disabled):hover,
  .floating-pager:not(:disabled):focus {
    background: #15693c;
    color: #ffffff;
    border-color: #15693c;
    transform: translateY(-50%) scale(1.08);
    box-shadow: 0 14px 28px rgba(15, 105, 60, 0.32);
    outline: none;
  }
  .floating-pager:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }

  // ── Form panels ──
  .form-panel {
    margin: 16px 28px 4px;
    border: 1px solid #dceee3;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(15, 60, 38, 0.08);
    overflow: hidden;
  }
  .form-panel.change {
    border-color: #cfe5d8;
    background:
      linear-gradient(180deg, #f4fbf6 0%, #ffffff 60%);
  }
  .form-panel.mute {
    border-color: #f5d2cd;
    background:
      linear-gradient(180deg, #fff5f4 0%, #ffffff 60%);
  }

  .form-panel .panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
    border-bottom: 1px solid #ecf3ef;
  }
  .form-panel.mute .panel-head { border-bottom-color: #f7e1dd; }
  .form-panel .panel-title {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
  }
  .form-panel .panel-icon {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    background: rgba(47, 103, 70, 0.1);
    color: #15693c;
  }
  .form-panel.mute .panel-icon {
    background: rgba(192, 57, 43, 0.1);
    color: #c0392b;
  }
  .form-panel h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #0f1f17;
    letter-spacing: -0.01em;
  }
  .form-panel.mute h4 { color: #0f1f17; }
  .form-panel .panel-sub {
    margin: 2px 0 0;
    font-size: 12px;
    color: #6f8076;
    line-height: 1.4;
  }
  .form-panel .panel-close {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid #e6efe9;
    background: #ffffff;
    color: #6f8076;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.2s;
  }
  .form-panel .panel-close:hover {
    background: #2f6746;
    color: #ffffff;
    border-color: #2f6746;
    transform: rotate(90deg);
  }
  .form-panel.mute .panel-close:hover {
    background: #c0392b;
    border-color: #c0392b;
  }

  .form-panel .panel-body {
    padding: 16px 18px 4px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .form-panel .field-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .form-panel .field-grid.two-col {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .form-panel .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }
  .form-panel .field-label {
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #2f6746;
  }
  .form-panel.mute .field-label { color: #c0392b; }
  .form-panel .field-label .req { color: #c0392b; margin-left: 2px; }
  .form-panel .field-label .hint {
    color: #6f8076;
    font-weight: 500;
    text-transform: none;
    letter-spacing: normal;
    margin-left: 4px;
  }
  .form-panel .field .field-error {
    margin: 4px 0 0;
    color: #c0392b;
    font-size: 11.5px;
    font-weight: 500;
  }
  .form-panel .field .ant-input,
  .form-panel .field .ant-input-number,
  .form-panel .field .ant-input-number-input,
  .form-panel .field .ant-select-selector {
    border-radius: 8px !important;
  }
  .form-panel .field .ant-input,
  .form-panel .field .ant-select-selector {
    border-color: #d4ead9 !important;
  }
  .form-panel.mute .field .ant-input,
  .form-panel.mute .field .ant-select-selector {
    border-color: #f0c6c0 !important;
  }
  .form-panel .field .ant-input:focus,
  .form-panel .field .ant-input-focused,
  .form-panel .field .ant-select-focused .ant-select-selector {
    border-color: #15693c !important;
    box-shadow: 0 0 0 2px rgba(21, 105, 60, 0.15) !important;
  }
  .form-panel.mute .field .ant-input:focus,
  .form-panel.mute .field .ant-input-focused,
  .form-panel.mute .field .ant-select-focused .ant-select-selector {
    border-color: #c0392b !important;
    box-shadow: 0 0 0 2px rgba(192, 57, 43, 0.15) !important;
  }
  .form-panel textarea.ant-input { resize: vertical; }

  .form-panel .panel-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 14px 18px;
    margin-top: 8px;
    background: rgba(244, 251, 246, 0.6);
    border-top: 1px solid #ecf3ef;
  }
  .form-panel.mute .panel-footer {
    background: rgba(255, 247, 246, 0.7);
    border-top-color: #f7e1dd;
  }
  .form-panel .panel-footer .ant-btn {
    border-radius: 8px;
    font-weight: 600;
    min-width: 110px;
  }
  .form-panel .panel-cta {
    min-width: 200px;
    box-shadow: 0 6px 16px rgba(15, 105, 60, 0.22);
  }
  .form-panel .panel-cta.change-cta {
    background: #15693c;
    border-color: #15693c;
  }
  .form-panel .panel-cta.change-cta:hover:not(:disabled),
  .form-panel .panel-cta.change-cta:focus:not(:disabled) {
    background: #2f6746;
    border-color: #2f6746;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(15, 105, 60, 0.3);
  }
  .form-panel .panel-cta.mute-cta {
    box-shadow: 0 6px 16px rgba(192, 57, 43, 0.25);
  }
  .form-panel .panel-cta.mute-cta:hover:not(:disabled),
  .form-panel .panel-cta.mute-cta:focus:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(192, 57, 43, 0.32);
  }

  /* Switch HH head — blue accents so the workflow reads as an edit of the
     household's own details (neither a mute nor a generic change request). */
  .form-panel.switch-head .field .ant-input,
  .form-panel.switch-head .field .ant-select-selector {
    border-color: #c9ddf2 !important;
  }
  .form-panel.switch-head .field .ant-input:focus,
  .form-panel.switch-head .field .ant-input-focused,
  .form-panel.switch-head .field .ant-select-focused .ant-select-selector {
    border-color: #1d5f9c !important;
    box-shadow: 0 0 0 2px rgba(29, 95, 156, 0.15) !important;
  }
  .form-panel.switch-head .panel-footer {
    background: rgba(246, 250, 255, 0.7);
    border-top-color: #e1ecf8;
  }
  .form-panel .panel-cta.switch-head-cta {
    background: #1d5f9c;
    border-color: #1d5f9c;
    box-shadow: 0 6px 16px rgba(29, 95, 156, 0.22);
  }
  .form-panel .panel-cta.switch-head-cta:hover:not(:disabled),
  .form-panel .panel-cta.switch-head-cta:focus:not(:disabled) {
    background: #17507f;
    border-color: #17507f;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(29, 95, 156, 0.3);
  }

  // Legacy inline-form kept for any remaining callers; rendered as a simple stack.
  .inline-form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .inline-form.stacked { grid-template-columns: 1fr; }

  // ── Mobile ──
  @media (max-width: 760px) {
    .hh-hero { padding: 20px 18px 16px; }
    .hero-top { flex-direction: column; align-items: stretch; }
    .hero-status {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      margin-right: 40px;
    }
    .who .name { font-size: 21px; white-space: normal; }
    .avatar { width: 56px; height: 56px; border-radius: 16px; font-size: 19px; }

    .hh-body { grid-template-columns: 1fr; padding: 16px 18px 0; }
    .stat-value { font-size: 36px; }

    .facts-grid { grid-template-columns: 1fr; }
    .facts-grid .fact {
      border-right: none !important;
      border-bottom: 1px dashed #eef5f1 !important;
    }
    .facts-grid .fact:last-child { border-bottom: none !important; }

    .modal-note { margin: 14px 18px 0; }
    .form-panel { margin: 14px 18px 0; }
    .form-panel .panel-head { padding: 12px 14px; }
    .form-panel .panel-body { padding: 14px 14px 0; }
    .form-panel .panel-footer { padding: 12px 14px; flex-wrap: wrap; }
    .form-panel .panel-footer .ant-btn { flex: 1 1 auto; min-width: 0; }
    .form-panel .panel-cta { flex-basis: 100%; order: -1; }
    .form-panel .field-grid.two-col { grid-template-columns: 1fr; }

    .action-bar {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
      padding: 14px 18px;
    }
    .action-pager { justify-content: center; }
    .kbd-hint { display: none; }
    .action-buttons { width: 100%; flex-wrap: wrap; }
    .action-buttons .ant-btn { flex: 1 1 auto; min-width: 0; }
    .action-buttons .confirm-cta.ant-btn-primary {
      flex-basis: 100%;
      order: -1;
      min-width: 0;
    }

    .floating-pager { display: none; }
    .inline-form { grid-template-columns: 1fr; }
  }

  @media (max-width: 480px) {
    .avatar { width: 50px; height: 50px; border-radius: 14px; font-size: 17px; }
    .who .name { font-size: 19px; }
    .stat-value { font-size: 32px; }
  }
}

// ── Household transfers (CHA → village/post inside their sub-location) ──
.transfer-cta.ant-btn {
  border-radius: 10px;
}

.transfers-panel {
  margin: 0 28px 28px;
  padding: 18px 20px;
  border: 1px solid #dce8e1;
  border-radius: 16px;
  background: #ffffff;

  .transfers-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: #15693c;
    }

    .transfers-sub {
      margin: 2px 0 0;
      font-size: 12px;
      color: #6b7a70;
    }
  }

  .transfers-table { margin-top: 8px; }
}

.transfer-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f4f9f6;
  border: 1px solid #dce8e1;

  .transfer-fact {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #6b7a70;
    }

    .value {
      font-size: 14px;
      font-weight: 600;
      color: #1d2b22;
    }
  }
}

.transfer-form {
  .ant-form-item { margin-bottom: 14px; }
}

// Transfers tab: header, search row, result card and table cells.
.transfers-page {
  .transfers-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;

    h2 {
      margin: 0 0 4px;
      font-size: 18px;
      font-weight: 700;
      color: #1d2b22;
    }

    p {
      margin: 0;
      max-width: 780px;
      font-size: 13px;
      color: #6b7a70;
    }
  }

  .transfer-search-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .transfer-hint {
    margin: 8px 0 0;
    font-size: 12px;
    color: #6b7a70;
  }

  .transfer-alert { margin-top: 12px; }

  .transfer-list-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .transfer-household {
    margin-top: 14px;
    padding: 14px;
    border: 1px solid #dce8e1;
    border-radius: 12px;
    background: #fbfdfc;

    .transfer-facts { margin-bottom: 12px; }
  }

  .transfer-household-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .transfer-cell-strong {
    font-weight: 600;
    color: #1d2b22;
  }

  .transfer-cell-sub {
    font-size: 12px;
    color: #6b7a70;
  }

  .transfer-danger { color: #b42318; }
}
</style>
