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
          v-for="item in navItems"
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
              @click="createModalOpen = true"
            >New household request</a-button>
          </a-space>
        </div>

        <a-collapse v-model:activeKey="activeVillageKeys" accordion>
          <a-collapse-panel
            v-for="village in villages"
            :key="String(village.id)"
            @click="ensureVillageLoaded(village.id)"
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

            <a-table
              :columns="householdColumns"
              :data-source="filteredHouseholds(village.id)"
              :pagination="{
                current: getCurrentHouseholdPage(village.id),
                pageSize: 100,
                total: householdCount(village.id),
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
            :show-size-changer="false"
            :show-total="(total) => `Total ${total} villages`"
            @change="handleVillagePageChange"
          />
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

    <div v-else class="loading-wrap"><a-spin /></div>

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
            :disabled="activeHouseholdIndex <= 0"
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
            :disabled="activeHouseholdIndex >= activeHouseholds.length - 1"
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
                  <span class="record-pos">Record {{ activeHouseholdIndex + 1 }} of {{ activeHouseholds.length }}</span>
                </p>
                <h3 class="name">{{ activeHouseholdFullName || 'Unknown household' }}</h3>
                <div class="meta-row">
                  <span class="meta-chip"><IdcardOutlined /> {{ activeHousehold.id_no || 'No ID' }}</span>
                  <span class="meta-chip"><PhoneOutlined /> {{ activeHousehold.phone_no || 'No phone' }}</span>
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

        <!-- Body: featured stat + facts sheet -->
        <section class="hh-body">
          <div class="hero-stat">
            <div class="stat-icon"><GiftOutlined /></div>
            <div class="stat-content">
              <div class="stat-label">Nets allocated</div>
              <div class="stat-value">{{ activeHousehold.actual_allocation || activeHousehold.sys_allocation || '—' }}</div>
              <div class="stat-sub">based on {{ activeHousehold.hh_size || '?' }} household members</div>
            </div>
          </div>

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
                <dd>{{ activeHousehold.chw_id || '—' }}</dd>
              </div>
              <div class="fact">
                <dt><EnvironmentOutlined /> Village</dt>
                <dd>{{ activeVillageName }}</dd>
              </div>
              <div class="fact">
                <dt><CheckCircleFilled /> Status</dt>
                <dd>{{ statusLabel(activeHousehold) }}</dd>
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
              :disabled="activeHouseholdIndex <= 0"
              @click="goToHousehold('prev')"
              aria-label="Previous"
            >
              <LeftOutlined />
            </button>
            <span class="pager-pos">{{ activeHouseholdIndex + 1 }} <span class="sep">/</span> {{ activeHouseholds.length }}</span>
            <button
              type="button"
              class="pager-btn"
              :disabled="activeHouseholdIndex >= activeHouseholds.length - 1"
              @click="goToHousehold('next')"
              aria-label="Next"
            >
              <RightOutlined />
            </button>
            <span class="kbd-hint"><span class="kbd">←</span><span class="kbd">→</span></span>
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
                <a-select v-model:value="changeForm.type" style="width: 100%">
                  <a-select-option value="phone_change">Phone change</a-select-option>
                  <a-select-option value="head_change">Deceased head change</a-select-option>
                  <a-select-option value="transfer_in">Transfer</a-select-option>
                </a-select>
              </div>
            </div>

            <div v-if="changeForm.type === 'phone_change'" class="field-grid">
              <div class="field">
                <label class="field-label">New phone number <span class="req">*</span></label>
                <a-input v-model:value="changeForm.new_phone_no" placeholder="e.g. 0712 345 678" />
              </div>
            </div>

            <div v-if="changeForm.type === 'head_change'" class="field-grid two-col">
              <div class="field">
                <label class="field-label">New ID number <span class="req">*</span></label>
                <a-input v-model:value="changeForm.new_id_no" placeholder="National ID of new head" />
              </div>
              <div class="field">
                <label class="field-label">New phone number</label>
                <a-input v-model:value="changeForm.new_phone_no" placeholder="Phone number of new head" />
              </div>
            </div>

            <div v-if="changeForm.type === 'transfer_in'" class="field-grid two-col">
              <div class="field">
                <label class="field-label">New village <span class="req">*</span></label>
                <a-select v-model:value="changeForm.new_location_id" placeholder="Select new village" style="width: 100%" show-search :filter-option="(input, option) => option.children?.[0]?.children?.toLowerCase?.().includes(input.toLowerCase())">
                  <a-select-option v-for="item in villages" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </div>
              <div class="field">
                <label class="field-label">New post ID <span class="hint">(optional)</span></label>
                <a-input-number v-model:value="changeForm.new_post_id" placeholder="Numeric post ID" :min="1" style="width: 100%" />
              </div>
            </div>

            <div class="field-grid">
              <div class="field">
                <label class="field-label">Notes <span class="hint">(optional)</span></label>
                <a-textarea v-model:value="changeForm.notes" placeholder="Add supporting context for SCMCC" :rows="3" />
              </div>
            </div>
          </div>
          <footer class="panel-footer">
            <a-button @click="showChangePanel = false">Cancel</a-button>
            <a-button type="primary" class="panel-cta change-cta" @click="submitChange">
              <template #icon><EditOutlined /></template>
              Submit change request
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
              <a-select v-model:value="createForm.location_id" style="width: 100%">
                <a-select-option v-for="item in villages" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12"><a-form-item label="Post ID"><a-input-number v-model:value="createForm.post_id" :min="1" style="width: 100%" /></a-form-item></a-col>
        </a-row>
        <a-form-item label="Notes"><a-input v-model:value="createForm.notes" /></a-form-item>
      </a-form>
    </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { notification } from "ant-design-vue";
import {
  LeftOutlined,
  RightOutlined,
  CheckOutlined,
  EditOutlined,
  StopOutlined,
  IdcardOutlined,
  PhoneOutlined,
  TeamOutlined,
  GiftOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons-vue";
import axios from "@/Axiosconfig";
import { Main } from "../../styled";
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";

const rt = useRouter();
const route = useRoute();
const user = ref(JSON.parse(sessionStorage.getItem("user") || "null"));

const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/household/validation/dashboard" },
  { key: "households", label: "Households", path: "/household/validation/households" },
];

const isLoading = ref(true);
const villages = ref([]);
const householdsByVillage = ref({});
const villageLoading = ref({});
const villagesPaginationMeta = ref({ current: 1, pageSize: 100, total: 0 });
const householdsPaginationMeta = ref({});
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
  new_id_no: "",
  new_location_id: null,
  new_post_id: null,
  notes: "",
});

const createModalOpen = ref(false);
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
  { title: "Phone", dataIndex: "phone_no", key: "phone_no" },
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
    const hhs = householdsByVillage.value[`${village.id}_1`] || [];
    const totalFromMeta = householdsPaginationMeta.value[village.id]?.total;
    const totalHouseholds = Number(
      village.no_of_registered_hh ?? totalFromMeta ?? hhs.length
    );
    const verifiedHouseholds = Number(
      village.no_of_verified_hh ??
        hhs.filter((row) => row.validated === 1 || row.validated === true).length
    );
    const verifiedPercent = totalHouseholds
      ? Math.round((verifiedHouseholds / totalHouseholds) * 100)
      : 0;
    return {
      id: village.id,
      name: village.name,
      total_households: totalHouseholds,
      verified_households: verifiedHouseholds,
      verified_percent: verifiedPercent,
      population: hhs.reduce((sum, row) => sum + Number(row.hh_size || 0), 0),
    };
  })
);

const totalHouseholds = computed(() =>
  Object.values(householdsByVillage.value).reduce((sum, list) => sum + list.length, 0)
);

const villagesReviewed = computed(() =>
  villages.value.filter((v) => {
    const list = householdsByVillage.value[`${v.id}_1`] || [];
    if (!list.length) return false;
    return list.every((row) => statusLabel(row) !== "Pending Review");
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
  const pageSize = 100;
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

const ensureVillageLoaded = async (villageId, page = 1) => {
  const cacheKey = `${villageId}_${page}`;
  if (householdsByVillage.value[cacheKey]) return;
  villageLoading.value = { ...villageLoading.value, [villageId]: true };
  try {
    const pageSize = 100;
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

const fetchAllVillageHouseholds = async () => {
  await Promise.all(villages.value.map((v) => ensureVillageLoaded(v.id, 1)));
};

const handleVillagePageChange = async (pagination) => {
  const nextPage = Number(pagination?.current || pagination || 1);
  villagesPaginationMeta.value.current = nextPage;
  await fetchVillages(nextPage);
};

const handleHouseholdPageChange = async (villageId, page) => {
  await ensureVillageLoaded(villageId, page);
};

const refreshAll = async () => {
  isLoading.value = true;
  try {
    householdsByVillage.value = {};
    householdsPaginationMeta.value = {};
    villageLoading.value = {};
    activeVillageKeys.value = [];
    activeVillageId.value = null;
    villagesPaginationMeta.value.current = 1;
    await fetchHistory();
    await fetchVillages(1);
    await fetchAllVillageHouseholds();
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
  const cacheKey = getCurrentHouseholdCacheKey(villageId);
  return (householdsByVillage.value[cacheKey] || []).length;
};

const reviewedCount = (villageId) => {
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
  await ensureVillageLoaded(villageId);
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

const goToHousehold = (direction) => {
  if (!activeHouseholds.value.length) return;
  const index = activeHouseholdIndex.value;
  const nextIndex = direction === "next" ? index + 1 : index - 1;
  if (nextIndex < 0 || nextIndex >= activeHouseholds.value.length) return;
  activeHouseholdId.value = activeHouseholds.value[nextIndex].id;
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
      notification.info({ message: "All households in this village have been reviewed." });
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
};

const toggleChangePanel = () => {
  showChangePanel.value = !showChangePanel.value;
  showMutePanel.value = false;
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
    muteForm.value.notes = "";
    showMutePanel.value = false;
    await refreshAll();
  } catch (error) {
    notification.error({
      message: "Failed to submit mute request",
      description: error?.response?.data?.message || "Please check your input and try again.",
    });
  }
};

const submitChange = async () => {
  if (!activeHousehold.value) return;

  const type = changeForm.value.type;
  let endpoint = "";
  let payload = {
    household_id: activeHousehold.value.id,
    notes: changeForm.value.notes,
  };

  if (type === "phone_change") {
    endpoint = "hh_change_request/phone_change";
    payload.new_phone_no = changeForm.value.new_phone_no;
  } else if (type === "head_change") {
    endpoint = "hh_change_request/head_change";
    payload.new_id_no = changeForm.value.new_id_no;
    payload.new_phone_no = changeForm.value.new_phone_no;
  } else {
    endpoint = "hh_change_request/transfer";
    payload.new_location_id = changeForm.value.new_location_id;
    if (changeForm.value.new_post_id) payload.new_post_id = changeForm.value.new_post_id;
  }

  try {
    await axios.post(endpoint, payload);
    notification.success({ message: "Change request submitted" });
    changeForm.value.new_phone_no = "";
    changeForm.value.new_id_no = "";
    changeForm.value.new_location_id = null;
    changeForm.value.new_post_id = null;
    changeForm.value.notes = "";
    showChangePanel.value = false;
    await refreshAll();
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
    grid-template-columns: 240px 1fr;
    gap: 16px;
    padding: 20px 28px 0;
  }

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
</style>
