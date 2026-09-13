<template>
  <div class="activity-details-page">
    <Main>
      <header class="ev-detail-header">
        <div class="ev-detail-heading">
          <div class="ev-detail-back">
            <sdButton size="small" class="pill-btn" @click="goBack">
              <sdFeatherIcons type="arrow-left" size="13" /> Back
            </sdButton>
          </div>
          <h2 class="ev-detail-title">
            {{ event_name }} Activity - {{ activity_code }} on
            {{ formattedStartDate }}
          </h2>
          <div class="ev-detail-chips">
            <span class="ev-chip ev-chip-code">{{ activity_code }}</span>
            <span v-if="isNationalActivity" class="ev-status-badge is-active">
              <span class="dot"></span> National Activity
            </span>
            <span
              class="ev-status-badge"
              :class="activityBudget.budget_category_id ? 'submitted' : 'is-idle'"
            >
              <sdFeatherIcons
                :type="activityBudget.budget_category_id ? 'link' : 'alert-circle'"
                size="12"
              />
              {{ activityBudget.budget_category_id ? "Budget Linked" : "No Budget Link" }}
            </span>
          </div>
        </div>
      </header>

      <div class="ev-detail-toolbar">
        <div class="ev-toolbar-section">
          <span class="ev-toolbar-label">
            <sdFeatherIcons type="zap" size="13" /> Workflow
          </span>
          <div class="ev-toolbar-group">
        <sdButton
          class="btn-import"
          type="success"
          size="extra-small"
          @click="generatePayroll"
          v-if="isApprovedGenerator"
          :disabled="isGenerating"
        >
          {{
            isLoading
              ? "Loading..."
              : isGenerating
              ? "Processing ..."
              : "Generate Payroll"
          }}
        </sdButton>
        &nbsp;&nbsp;
        <sdButton
          v-if="isApprovedGenerator"
          class="btn-import"
          type="warning"
          size="extra-small"
          @click="reGeneratePayroll"
          :disabled="isReGenerating"
        >
          <!-- Generate Payroll -->
          {{
            isLoading
              ? "Loading..."
              : isGenerating
              ? "Processing ..."
              : "Re-Generate Payroll"
          }}
        </sdButton>
        <span v-if="isApprovedGenerator">&nbsp;&nbsp;</span>
        <sdButton
          class="btn-import"
          type="success"
          @click="exportParticipants"
          size="extra-small"
        >
          Download List &nbsp; &nbsp;
          <sdFeatherIcons type="download-cloud" size="extra-small" />
        </sdButton>
        &nbsp;&nbsp;
        <sdButton
          class="btn-import"
          type="warning"
          @click="sendInvites"
          size="extra-small"
        >
          Send Invites &nbsp; &nbsp;
          <sdFeatherIcons type="mail" size="extra-small" />
        </sdButton>
        &nbsp; &nbsp;
        <sdButton
          class="btn-import"
          type="warning"
          @click="openArchiveModal()"
          size="extra-small"
        >
          Archive Event &nbsp; &nbsp;
        </sdButton>
        &nbsp; &nbsp;
        <sdButton
          class="btn-import"
          type="warning"
          @click="openMatrixModal()"
          size="extra-small"
        >
          Activity Matrix &nbsp; &nbsp;
          <sdFeatherIcons type="award" size="extra-small" />
        </sdButton>
        &nbsp; &nbsp;
        <sdButton
          v-if="!isNationalActivity"
          class="btn-import"
          type="success"
          @click="openBudgetLinkModal"
          size="extra-small"
        >
          <sdFeatherIcons type="link" size="extra-small" />
          &nbsp;
          {{
            !activityBudget.budget_category_id
              ? "Link Budget"
              : canRelinkBudget
                ? "Re-link Budget"
                : "View Budget Link"
          }}
        </sdButton>
      </div>
        </div>
      </div>

      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="ad-officer-tabs" role="tablist" aria-label="Activity officers">
              <button
                type="button"
                class="ad-tab"
                :class="{ active: activeClass === 'all' }"
                role="tab"
                @click="handleChange('all')"
              >
                Invited Officers
                <span class="ad-tab-count">{{ recordCount }}</span>
              </button>
              <button
                type="button"
                class="ad-tab"
                :class="{ active: activeClass === 'confirmed' }"
                role="tab"
                @click="handleChange('confirmed')"
              >
                Confirmed Officers
                <span class="ad-tab-count confirmed">{{ confirmedCount }}</span>
              </button>
              <button
                type="button"
                class="ad-tab"
                :class="{ active: activeClass === 'pending' }"
                role="tab"
                @click="handleChange('pending')"
              >
                Pending Confirmation
                <span class="ad-tab-count pending">{{ pendingCount }}</span>
              </button>
              <div
                class="ev-view-toggle"
                role="group"
                aria-label="Toggle officers view"
              >
                <button
                  type="button"
                  class="ev-toggle-btn"
                  :class="{ active: viewMode === 'cards' }"
                  @click="viewMode = 'cards'"
                >
                  <sdFeatherIcons type="grid" size="14" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  class="ev-toggle-btn"
                  :class="{ active: viewMode === 'table' }"
                  @click="viewMode = 'table'"
                >
                  <sdFeatherIcons type="list" size="14" />
                  <span>Table</span>
                </button>
              </div>
              <button
                v-if="isCreator"
                type="button"
                class="ad-tab is-add"
                @click="openModal()"
              >
                <sdFeatherIcons type="plus" size="12" /> Add Officer
              </button>
            </div>
          </a-col>
          <a-col :xs="24">
            <sdCards headless>
              <div class="result-list-content">
                <a-row :gutter="15">
                  <a-col class="w-100" :md="24">
                    <sdCards headless>
                      <div v-if="isLoading" class="spin">
                        <a-spin />
                      </div>

                      <div v-else>
                        <!-- Table view (desktop / user selected) -->
                        <div v-if="viewMode === 'table'">
                        <TableWrapper
                          class="table-data-view table-responsive ad-table-shell"
                          v-show="activeClass === 'all'"
                        >
                          <p class="ad-record-count">
                            <span>Total Records</span>
                            <b>{{ recordCount }}</b>
                          </p>

                          <a-table
                            :pagination="{
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #activity="{ record }">
                              <td>
                                <div class="table-actions" v-if="isCreator">
                                  <sdButton
                                    size="extra-small"
                                    type="danger"
                                    @click="removeOfficer(record.user_id)"
                                    v-show="record.status === 'Active'"
                                  >
                                    <span> Remove Officer </span>
                                  </sdButton>
                                  <sdButton
                                    size="extra-small"
                                    type="warning"
                                    @click="activateOfficer(record.user_id)"
                                    v-show="record.status === 'Inactive'"
                                  >
                                    <span> Activate Officer </span>
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive ad-table-shell"
                          v-show="activeClass === 'confirmed'"
                        >
                          <p class="ad-record-count">
                            <span>Total Records</span>
                            <b>{{ confirmedCount }}</b>
                          </p>
                          <a-table
                            :pagination="{
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive ad-table-shell"
                          v-show="activeClass === 'pending'"
                        >
                          <p class="ad-record-count">
                            <span>Total Records</span>
                            <b>{{ pendingCount }}</b>
                          </p>
                          <a-table
                            :pagination="{
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #activity="{ record }">
                              <td>
                                <!-- Buttons for viewing confirmed and pending participants -->
                                <div class="table-actions">
                                  <!-- Button for viewing confirmed participants -->
                                  <sdButton
                                    class="btn-import"
                                    type="warning"
                                    size="small"
                                    @click="resendSMS(record.id)"
                                  >
                                    <!-- {{
                                      isLoading
                                        ? "Loading..."
                                        : isGenerating
                                          ? "Processing ..."
                                          : "Generate Payroll"
                                    }} -->
                                    Resend SMS
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        </div>

                        <!-- Card view (default on mobile / user selectable on
                             desktop). Mirrors the officer tables. -->
                        <div v-else class="ev-card-list-wrap">
                          <!-- All officers -->
                          <div v-show="activeClass === 'all'" class="ev-card-list">
                            <p class="ad-record-count">
                              <span>Total Records</span>
                              <b>{{ recordCount }}</b>
                            </p>
                            <article
                              v-for="record in filteredData"
                              :key="record.user_id ?? record.id"
                              class="ev-card"
                            >
                              <div class="ev-card-head">
                                <div class="ev-card-title">{{ record.fullName }}</div>
                                <span class="ev-card-code">{{ record.phone_no }}</span>
                              </div>
                              <div class="ev-card-meta">
                                <div>
                                  <span class="lbl">Phone</span>
                                  <span class="val">{{ record.phone_no || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Location</span>
                                  <span class="val">{{ record.location_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Organization</span>
                                  <span class="val">{{ record.org_types_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Role</span>
                                  <span class="val">{{ record.role_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Confirmed Days</span>
                                  <span class="val">{{ record.confirmed_days ?? "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Unconfirmed Days</span>
                                  <span class="val">{{ record.unconfirmed_days ?? "—" }}</span>
                                </div>
                              </div>
                              <div class="ev-card-meta status-meta">
                                <div>
                                  <span class="lbl">Status</span>
                                  <span class="val">
                                    <span
                                      v-if="record.status"
                                      class="ev-status-badge"
                                      :class="record.status === 'Active' ? 'is-active' : 'is-idle'"
                                    >
                                      <span class="dot"></span> {{ record.status }}
                                    </span>
                                    <span v-else>—</span>
                                  </span>
                                </div>
                              </div>
                              <div v-if="isCreator" class="ev-card-actions">
                                <sdButton
                                  v-if="record.status === 'Active'"
                                  size="extra-small"
                                  type="danger"
                                  @click="removeOfficer(record.user_id)"
                                >
                                  Remove Officer
                                </sdButton>
                                <sdButton
                                  v-else
                                  size="extra-small"
                                  type="warning"
                                  @click="activateOfficer(record.user_id)"
                                >
                                  Activate Officer
                                </sdButton>
                              </div>
                            </article>
                          </div>
                          <!-- Confirmed officers -->
                          <div v-show="activeClass === 'confirmed'" class="ev-card-list">
                            <p class="ad-record-count">
                              <span>Total Records</span>
                              <b>{{ confirmedCount }}</b>
                            </p>
                            <article
                              v-for="record in filteredData"
                              :key="record.user_id ?? record.id"
                              class="ev-card"
                            >
                              <div class="ev-card-head">
                                <div class="ev-card-title">{{ record.fullName }}</div>
                                <span class="ev-card-code">{{ record.phone_no }}</span>
                              </div>
                              <div class="ev-card-meta">
                                <div>
                                  <span class="lbl">Phone</span>
                                  <span class="val">{{ record.phone_no || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Location</span>
                                  <span class="val">{{ record.location_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Organization</span>
                                  <span class="val">{{ record.org_types_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Role</span>
                                  <span class="val">{{ record.role_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Confirmed Days</span>
                                  <span class="val">{{ record.confirmed_days ?? "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Unconfirmed Days</span>
                                  <span class="val">{{ record.unconfirmed_days ?? "—" }}</span>
                                </div>
                              </div>
                            </article>
                          </div>
                          <!-- Pending officers -->
                          <div v-show="activeClass === 'pending'" class="ev-card-list">
                            <p class="ad-record-count">
                              <span>Total Records</span>
                              <b>{{ pendingCount }}</b>
                            </p>
                            <article
                              v-for="record in filteredData"
                              :key="record.user_id ?? record.id"
                              class="ev-card"
                            >
                              <div class="ev-card-head">
                                <div class="ev-card-title">{{ record.fullName }}</div>
                                <span class="ev-card-code">{{ record.phone_no }}</span>
                              </div>
                              <div class="ev-card-meta">
                                <div>
                                  <span class="lbl">Phone</span>
                                  <span class="val">{{ record.phone_no || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Location</span>
                                  <span class="val">{{ record.location_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Organization</span>
                                  <span class="val">{{ record.org_types_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Role</span>
                                  <span class="val">{{ record.role_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Confirmed Days</span>
                                  <span class="val">{{ record.confirmed_days ?? "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Unconfirmed Days</span>
                                  <span class="val">{{ record.unconfirmed_days ?? "—" }}</span>
                                </div>
                              </div>
                              <div class="ev-card-actions">
                                <sdButton
                                  class="btn-import"
                                  type="warning"
                                  size="small"
                                  @click="resendSMS(record.id)"
                                >
                                  Resend SMS
                                </sdButton>
                              </div>
                            </article>
                          </div>
                        </div>
                      </div>
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
              <!-- add officers -->
              <a-modal
                title="Add Officers"
                :visible="isModalOpen"
                @cancel="handleCancel"
                :width="isMobile ? '93%' : '50%'"
                footer=""
              >
                <BasicFormWrapper>
                  <a-form
                    class="add-transfer-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleAddOfficers"
                  >
                    <a-form-item
                      name="add_officer"
                      label="Add Officer to Activity"
                    >
                      <a-select
                        placeholder="Add Officer(s)"
                        v-model:value="formState.add_officer"
                        v-if="!loading"
                        show-search
                        option-filter-prop="label"
                        mode="multiple"
                        @search="handleOfficerSearch"
                      >
                        <a-select-option
                          v-for="officer in officers"
                          :key="officer.id"
                          v-model:value="officer.id"
                          :label="`${officer.first_name} ${officer.last_name} -${officer.role_id} `"
                        >
                          {{ officer.first_name }}
                          {{ officer.last_name }} - {{ officer.id_no }},
                          {{ officer.role_id }}, {{ officer.location_id }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <div class="record-form-actions text-right">
                      <sdButton size="default" htmlType="Save" type="success">
                        {{ isLoading ? "Loading..." : "Submit" }}
                      </sdButton>
                    </div>
                  </a-form>
                </BasicFormWrapper>
              </a-modal>
              <!-- End of Assigning officer modal -->

              <!-- Archive Event Modal -->
              <a-modal
                title="Archive Activity"
                :visible="isArchiveModalOpen"
                @cancel="handleCancelArchive"
                width="20%"
              >
                <p>
                  Are you sure you want to archive activity? <br />
                  <br />
                  By confirming this, the event will not be available to users.
                </p>
                <template #footer>
                  <a-button
                    key="cancel"
                    type="warning"
                    @click="handleCancelArchive"
                  >
                    Cancel
                  </a-button>
                  <a-button
                    key="confirm"
                    type="danger"
                    @click="handleArchiveActivity"
                  >
                    Confirm
                  </a-button>
                </template>
              </a-modal>
              <!-- End Archive Event modal -->

              <!-- Activity Matrix Modal -->
              <a-modal
                title="Payroll Activity Matrix"
                :visible="isMatrixModalOpen"
                @cancel="handleCancelMatrix"
                :width="isMobile ? '95%' : '60%'"
                :footer="null"
              >
                <sdCards headless>
                  <div class="result-list-content">
                    <a-row :gutter="15">
                      <a-col class="w-100" :md="24">
                        <sdCards headless>
                          <sdHeader>
                            <b>
                              <span class="ai-playback-shuffle"></span>Payable
                              Organizations
                            </b>
                          </sdHeader>
                          <br />
                          <br />
                          <div>
                            <sdButton
                              class="spaced-button"
                              size="extra-small"
                              type="success"
                              outlined
                              v-for="org in org_matrixes"
                              :key="org.id"
                            >
                              {{ org.org_id }}
                            </sdButton>
                          </div>
                          <br />
                          <div v-if="isLoading" class="spin">
                            <a-spin />
                          </div>
                          <div v-else>
                            <TableWrapper
                              class="table-data-view table-responsive"
                              v-show="activeClass === 'all'"
                            >
                              <a-table
                                :dataSource="activity_matrixes"
                                :columns="matrix_column"
                              >
                              </a-table>
                            </TableWrapper>
                          </div>
                        </sdCards>
                      </a-col>
                    </a-row>
                  </div>
                </sdCards>
              </a-modal>

              <!-- End Activity Matrix modal -->

              <!-- Budget template linking -->
              <BudgetTemplateLinkModal
                v-model:visible="isBudgetLinkModalOpen"
                target-type="activity"
                :target-id="query.id"
                :target-name="event_name"
                :current-link="activityBudget"
                :allow-relink="canRelinkBudget"
                @linked="onBudgetLinked"
              />
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./style";
import { computed, onMounted, ref, reactive } from "vue";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { Modal } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import store from "../../../vuex/store";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
import BudgetTemplateLinkModal from "../../../components/budget/BudgetTemplateLinkModal.vue";

const columns = [
  {
    title: "Participant Name",
    dataIndex: "fullName",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Phone",
    dataIndex: "phone_no",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "org_types_id",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "role_id",
    key: "id",
  },
  {
    title: "Confirmed Days",
    dataIndex: "confirmed_days",
    key: "id",
  },
  {
    title: "Unconfirmed Days",
    dataIndex: "unconfirmed_days",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    fixed: "right",
    width: 20,
    key: "activity",
    slots: { customRender: "activity" },
  },
];
const matrix_column = [
  {
    title: "Matrix",
    dataIndex: "pay_matrix_id",
    key: "id",
  },
  {
    title: "Rate",
    dataIndex: "rate",
    key: "id",
  },
];
const { state } = useStore();
const isLoading = ref(true);
const dataSource = ref([]);
const confirmed = ref({});
const pending = ref([]);
const officers = ref([]);
const activeClass = ref("all");

// Cards/Table view toggle for the officers/participants list — mirrors the
// Events details page (cards by default on narrow/mobile screens, table on
// desktop where the columns fit; the user can switch either way).
const viewMode = ref(
  typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
);
const { query } = useRoute();
// True on phones/tablets — used to make modals full-width on small screens.
const isMobile = computed(
  () => typeof window !== "undefined" && window.innerWidth <= 767
);
const isGenerating = computed(() => state.isGenerating);
const isArchiveModalOpen = ref(false);
const router = useRouter();
// Back to the activities list. Uses the browser history when arriving via
// in-app navigation; falls back to the Activities list page on a hard refresh.
const goBack = () => {
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push({ name: "view-activities" });
  }
};
const searchOfficerItem = ref("");
const isModalOpen = ref(false);
const activity_code = ref(query.code);
const recordCount = computed(() => {
  return dataSource.value.length;
});
const confirmedCount = computed(() => {
  return confirmed.value.length;
});
const pendingCount = computed(() => {
  return pending.value.length;
});
const event_name = ref(query.name);
const API_URL = `activity_invited_officers?activity_id=${query.id}`;
const export_participants_url = `${process.env.VUE_APP_BASE_URL}/activity_participants_export?activity_code=${query.code}`;
const isMatrixModalOpen = ref(false);
const activity_matrixes = ref([]);
const org_matrixes = ref([]);
const activity_matrix = `${process.env.VUE_APP_BASE_URL}/view_activity_matrix?activity_list_id=${query.activity_list_id}`;
const orgs_matrix = `${process.env.VUE_APP_BASE_URL}/view_activity_org_matrix?activity_list_id=${query.activity_list_id}`;

// ── Budget template linking ──
const isNationalActivity = computed(() => !!query.is_national);
const isBudgetLinkModalOpen = ref(false);
const activityBudget = ref({
  campaign_budget_id: query.campaign_budget_id ?? null,
  budget_category_id: query.budget_category_id ?? null,
  budget_category_name: query.budget_category_name ?? null,
});
const openBudgetLinkModal = () => {
  isBudgetLinkModalOpen.value = true;
};
// Only super admin / accountant may re-link to a different budget template.
// Mirrors BudgetDeductionService::canRelinkBudget() (super-admin set 1,53,63,
// 64,59,4 + the Accountant role — id 65 used across the payroll screens).
const canRelinkBudget = computed(() => {
  const u = JSON.parse(sessionStorage.getItem("user"));
  const rid = Number(u?.user?.role_id);
  return [1, 53, 63, 64, 59, 4, 65].includes(rid);
});
const onBudgetLinked = (linked) => {
  if (linked) {
    activityBudget.value = {
      campaign_budget_id: linked.campaign_budget_id ?? activityBudget.value.campaign_budget_id,
      budget_category_id: linked.budget_category_id ?? activityBudget.value.budget_category_id,
      budget_category_name:
        linked.budget_category_name ?? activityBudget.value.budget_category_name,
    };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Function to get the ordinal suffix for a number
  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const formattedDay = `${day}${getOrdinalSuffix(day)}`;
  const formattedMonth = monthNames[monthIndex];

  return `${formattedDay} ${formattedMonth} ${year}`;
};
const start_date = query.start_date;
const formattedStartDate = formatDate(start_date);

const exportParticipants = async () => {
  try {
    const response = await fetch(export_participants_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch export data");
    }

    const fileBlob = await response.blob();
    console.log(response);
    const fileName = "Activity Participants.xlsx";
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([fileBlob]));
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};

const resendSMS = async (id) => {
  console.log(id);
  console.log(query.id);
  try {
    const response = await axios.get(
      `resend_activity_confirmation_reminder/${query.id}/${id}`
    );
    console.log(response);
    if (response.status == 200) {
      Modal.success({
        title: "Success",
        content: "SMS Confirmation Sent successfully",
      });
    } else {
      Modal.error({
        title: "Error",
        content: "Something went wrong during SMS resend",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const openArchiveModal = () => {
  console.log(query.id);
  isArchiveModalOpen.value = true;
  // formState.post_id = id;
};

const handleCancelArchive = () => {
  isArchiveModalOpen.value = false;
};

const handleCancel = () => {
  isModalOpen.value = false;
};

const handleArchiveActivity = async () => {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/activity/archive?id=${query.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    );
    const data = await response.json();
    console.log(data);

    if (data.success === true) {
      notification.success({
        message: "Success!",
        description: data.data,
      });
      isArchiveModalOpen.value = true;
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      router.back();
    } else {
      notification.error({
        message: "Error!",
        description: data.data,
      });
      isArchiveModalOpen.value = false;
      router.back();
    }
  } catch (error) {
    console.error(error);
  }
};

const removeOfficer = (id) => {
  axios
    .post(
      `/deassign_activity_facilitator?activity_id=${query.id}&user_id=${id}`
    )
    .then((response) => {
      const { success, message } = response.data;
      if (success === true) {
        notification.success({
          message: "Success",
          description: message,
        });
        isModalOpen.value = false;
        setTimeout(() => {
          location.reload();
        }, 3000);
      } else {
        notification.error({
          message: "Error",
          description: `${message}`,
        });
      }
    })
    .catch((error) => {
      notification.error({
        message: "Error",
        description: `${error.message || "Unknown error"}`,
      });
    });
};

const activateOfficer = (id) => {
  axios
    .post(`/activate_officer?activity_id=${query.id}&user_id=${id}`)
    .then((response) => {
      const { success, data } = response.data;
      if (success === true) {
        notification.success({
          message: "Success",
          description: data,
        });
        isModalOpen.value = false;
        setTimeout(() => {
          location.reload();
        }, 3000);
      } else {
        notification.error({
          message: "Error",
          description: `${data}`,
        });
      }
    })
    .catch((error) => {
      notification.error({
        message: "Error",
        description: `${error.message || "Unknown error"}`,
      });
    });
};

const handleChange = (tab) => {
  activeClass.value = tab;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_URL);
    console.log(response.data.data);

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;

      // check if status = 0 return inactive else return active
      let status =
        record.status == 0 || record.status == null ? "Inactive" : "Active";

      return {
        ...record,
        fullName,
        status,
      };
    });

    console.log(updatedData);

    dataSource.value = updatedData;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
  try {
    isLoading.value = true;
    const response = await axios.get(
      `activity_participants?activity_id=${activity_code.value}&confirmed=1`
    );
    console.log(response);
    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      return {
        ...record,
        fullName,
      };
    });
    console.log(response.data);
    confirmed.value = updatedData;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
  try {
    isLoading.value = true;
    const response = await axios.get(
      `activity_participants?activity_id=${activity_code.value}&confirmed=0`
    );

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      return {
        ...record,
        fullName,
      };
    });

    pending.value = updatedData;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
});

const formState = reactive({
  activity_id: query.id,
  add_officer: [],
});

const sendInvites = async () => {
  try {
    await axios
      .get(`notify_activity_participants/${query.id}`)
      .then((response) => response.data)
      .then(({ success, message }) => {
        console.log(message);
        if (success == true) {
          notification.success({
            message: "Success",
            description: message,
          });
          isModalOpen.value = false;
          setTimeout(function () {
            location.reload();
          }, 3000);
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        isModalOpen.value = false;
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const handleAddOfficers = async () => {
  try {
    const data = {
      activity_id: formState.activity_id,
      participants: formState.add_officer,
    };

    console.log(data);

    console.log(JSON.stringify(data));
    await axios
      .post(`add_officers`, data)
      .then((response) => response.data)
      .then(({ success, data }) => {
        if (success == true) {
          notification.success({
            message: "Success",
            description: data,
          });
          isModalOpen.value = false;
          setTimeout(function () {
            location.reload();
          }, 3000);
        } else {
          notification.error({
            message: "Error",
            description: `${data}`,
          });
        }
        isModalOpen.value = false;
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const officersList = async () => {
  try {
    const response = await axios.get(`users?query=${searchOfficerItem.value}`);
    const data = await response.data;

    console.log(data);

    // Modify the structure of each supervisor to include a 'label' property
    officers.value = data.data.map((user) => ({
      ...user,
      label: `${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`,
    }));
  } catch (error) {
    console.error(error);
  }
};

officersList();

const handleOfficerSearch = (value) => {
  searchOfficerItem.value = value;
  officersList();
};

const filteredData = computed(() => {
  if (activeClass.value === "confirmed") {
    console.log(confirmed.value);
    return confirmed.value;
  } else if (activeClass.value === "pending") {
    console.log(dataSource.value);
    return pending.value;
  } else {
    return dataSource.value;
  }
});

// const event_host_id = query.event_host_id;
const user = JSON.parse(sessionStorage.getItem("user"));
console.log(user.user.id);

const isApprovedGenerator = computed(() => {
  // const currentTime = new Date();
  if (
    user.user.role_id === 53 ||
    user.user.role_id === 63 ||
    user.user.role_id === 4 ||
    user.user.role_id === 59
  ) {
    return true;
  } else {
    return false;
  }
});

const isCreator = computed(() => {
  // const currentTime = new Date();
  if (user.user.id == query.created_by) {
    return true;
  } else {
    return false;
  }
});

const generatePayroll = async () => {
  store.commit("setIsGenerating", true);
  try {
    const response = await axios.get(
      `/generate_pay_roll?activity_code=${query.code}&confirmed=1`
    );
    console.log(response);
    if (response.status == 200) {
      store.commit("setIsGenerating", false);
      Modal.success({
        title: "Success",
        content: "Payroll Generated Successfully",
      });
      location.reload();
    } else {
      store.commit("setIsGenerating", false);
      Modal.error({
        title: "Error",
        content:
          "Something went wrong, ensure you have assigned payroll matrix to the event",
      });
    }
  } catch (error) {
    store.commit("setIsGenerating", true);
    console.error(error);
  }
};
const openModal = () => {
  isModalOpen.value = true;
};

const openMatrixModal = () => {
  isMatrixModalOpen.value = true;
};

const handleCancelMatrix = () => {
  isMatrixModalOpen.value = false;
};
const getActivityMatrix = () => {
  axios
    .get(activity_matrix, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response.data.data);
      activity_matrixes.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

getActivityMatrix();
const getOrgMatrix = () => {
  axios
    .get(orgs_matrix, {
      headers: authHeader(),
    })
    .then((response) => {
      org_matrixes.value = response.data.data;
      console.log(org_matrixes.value);
    })
    .catch((error) => {
      console.error(error);
    });
};

getOrgMatrix();

const reGeneratePayroll = async () => {
  store.commit("setIsGenerating", true);
  try {
    const response = await axios.get(
      `/regenerate_activity_payroll?activity_code=${query.code}&confirmed=1`
    );
    console.log(response);
    if (response.status == 200) {
      store.commit("setIsGenerating", false);
      Modal.success({
        title: "Success",
        content: "Payroll Generated Successfully",
      });
      location.reload();
    } else {
      store.commit("setIsGenerating", false);
      Modal.error({
        title: "Error",
        content:
          "Something went wrong, ensure you have assigned payroll matrix to the event",
      });
    }
  } catch (error) {
    store.commit("setIsGenerating", true);
    console.error(error);
  }
};
</script>

<style>
/* ════════════════════════════════════════════════════════════════════════════
   Activity details — same layout & look-and-feel as the Event details page
   ════════════════════════════════════════════════════════════════════════════ */

/* Page wrapper — matches the Event details page top spacing */
.activity-details-page {
  padding: 16px 12px 0;
}

/* ── Action toolbar (same card & look as the Event details toolbar) ── */
.activity-details-page .ev-detail-toolbar {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 18px;
  background: #fff;
  border: 1px solid #e6eef0;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 3px 10px rgba(20, 60, 40, 0.04);
}
.activity-details-page .ev-toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.activity-details-page .ev-toolbar-section:not(:last-child) {
  padding-bottom: 14px;
  border-bottom: 1px dashed #e1efe6;
}
.activity-details-page .ev-toolbar-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: #8a9d93;
}
.activity-details-page .ev-toolbar-label svg {
  color: #4a9d6f;
}
.activity-details-page .ev-toolbar-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.activity-details-page .ev-toolbar-group .btn-import {
  margin: 0;
}
.activity-details-page .ev-toolbar-group .btn-import a {
  color: inherit;
}

/* ════════════════════════════════════════════════════════════════════════════
   Activity details — responsive layout polish (desktop + mobile friendly)
   ════════════════════════════════════════════════════════════════════════════ */

/* ── Officer tabs ─────────────────────────────────────────────────────────── */
.activity-details-page .ad-officer-tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 8px 2px 18px;
}
.activity-details-page .ad-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #d9f0e2;
  background: #fff;
  color: #5a6470;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.activity-details-page .ad-tab.active {
  background: #eafff5;
  border-color: #9ad8b4;
  color: #15693c;
}
.activity-details-page .ad-tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 7px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  background: #eef3f0;
  color: #2f6746;
}
.activity-details-page .ad-tab-count.confirmed {
  background: #e3f7ec;
  color: #15693c;
}
.activity-details-page .ad-tab-count.pending {
  background: #fdf6e3;
  color: #a9802a;
}
.activity-details-page .ad-tab.is-add {
  background: #16a34a;
  border-color: #16a34a;
  color: #fff;
}
.activity-details-page .ad-tab.is-add:hover {
  background: #15803d;
  color: #fff;
}

/* ── Total records pill ───────────────────────────────────────────────────── */
.activity-details-page .ad-record-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 2px 0 10px;
  padding: 4px 12px;
  background: #eef3f0;
  border: 1px solid #ddeadd;
  border-radius: 999px;
  font-size: 12px;
  color: #7a8a82;
}
.activity-details-page .ad-record-count span {
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 10px;
  font-weight: 600;
}
.activity-details-page .ad-record-count b {
  color: #15693c;
  font-weight: 700;
}

/* ── Officer tables — same green shell as the Events pages ───────────────── */
.activity-details-page .ad-table-shell .ant-table {
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}
.activity-details-page .ad-table-shell .ant-table-thead > tr > th {
  background: #f4fbf6;
  color: #2f6746;
  font-weight: 700;
  border-bottom: 1px solid #e1efe6;
}
.activity-details-page .ad-table-shell .ant-table-tbody > tr > td {
  border-bottom: 1px solid #f0f7f3;
}
.activity-details-page .ad-table-shell .ant-table-tbody > tr:hover > td {
  background: #f5fbf7;
}
.activity-details-page .ad-table-shell .table-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

/* ── Mobile refinements ──────────────────────────────────────────────────── */
@media (max-width: 767px) {
  .activity-details-page .ev-toolbar-group {
    flex-direction: column;
    align-items: stretch;
  }
  .activity-details-page .ev-toolbar-group sdButton,
  .activity-details-page .ev-toolbar-group > .ant-btn {
    width: 100%;
    height: 40px;
    border-radius: 12px;
    margin: 0;
  }

  .activity-details-page .ad-officer-tabs {
    width: 100%;
  }
  .activity-details-page .ad-tab {
    flex: 1 1 auto;
    justify-content: center;
  }
  .activity-details-page .ad-tab.is-add {
    flex: 1 1 100%;
  }

  .activity-details-page .ad-table-shell .ant-table-thead > tr > th,
  .activity-details-page .ad-table-shell .ant-table-tbody > tr > td {
    padding: 8px 12px;
  }
}

@media (max-width: 575px) {
  .activity-details-page .ev-detail-title {
    font-size: 17px;
  }
  .activity-details-page .ev-detail-heading {
    gap: 8px;
  }
  .activity-details-page .ev-detail-toolbar {
    padding: 14px 12px;
  }
}
/* ── Back button (activity details) ── */
.activity-details-page .pill-btn {
  background: #fff !important;
  border: 1px solid #e1e6ec !important;
  color: #4d5661 !important;
  border-radius: 999px !important;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.activity-details-page .pill-btn:hover,
.activity-details-page .pill-btn:focus {
  border-color: #9ad8b4 !important;
  color: #15693c !important;
}
/* ── Header (same classes/look as the Event details page) ── */
.activity-details-page .ev-detail-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.activity-details-page .ev-detail-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.activity-details-page .ev-detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #1b3b2a;
  margin: 0;
  line-height: 1.25;
}
.activity-details-page .ev-detail-back {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.activity-details-page .ev-detail-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

/* ── Chips & status badges (same look as the Event details page) ── */
.activity-details-page .ev-chip {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  border-radius: 12px;
  padding: 3px 12px;
  letter-spacing: 0.02em;
}
.activity-details-page .ev-chip-code {
  background: #e6f4ed;
  color: #15693c;
  border: 1px solid #bfe4cd;
}
.activity-details-page .ev-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  padding: 4px 12px;
  border: 1px solid transparent;
}
.activity-details-page .ev-status-badge .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.activity-details-page .ev-status-badge.is-active {
  color: #15693c;
  background: #e3f7ec;
  border-color: #9ad8b4;
}
.activity-details-page .ev-status-badge.is-idle {
  color: #8a6d1b;
  background: #fdf6e3;
  border-color: #ecd9a0;
}
.activity-details-page .ev-status-badge.submitted {
  color: #15693c;
  background: #f3fcf6;
  border-color: #cdead9;
}
/* ── Cards / Table view toggle (officers list) — same as the Events page ── */
.activity-details-page .ev-view-toggle {
  display: inline-flex;
  background: #f0f7f3;
  border: 1px solid #d9f0e2;
  border-radius: 22px;
  padding: 3px;
  gap: 2px;
}
.activity-details-page .ev-toggle-btn {
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
}
.activity-details-page .ev-toggle-btn.active {
  background: #fff;
  color: #15693c;
  box-shadow: 0 2px 6px rgba(28, 122, 72, 0.12);
}
.activity-details-page .ad-officer-tabs .ev-view-toggle {
  flex: 0 0 auto;
}

/* ── Officers cards view (same look as the Events participants cards) ── */
.activity-details-page .ev-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px;
}
.activity-details-page .ev-card-list .ad-record-count {
  margin: 2px 0 0;
}
.activity-details-page .ev-card {
  background: #fff;
  border: 1px solid #e1efe6;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
}
.activity-details-page .ev-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}
.activity-details-page .ev-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #15693c;
  line-height: 1.3;
}
.activity-details-page .ev-card-code {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  color: #2f6746;
  background: #daf4e4;
  border: 1px solid #9ad8b4;
  border-radius: 12px;
  padding: 2px 10px;
}
.activity-details-page .ev-card-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
  margin-bottom: 14px;
}
.activity-details-page .ev-card-meta.status-meta {
  margin-bottom: 10px;
}
.activity-details-page .ev-card-meta > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.activity-details-page .ev-card-meta .lbl {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #7a8a82;
  font-weight: 600;
}
.activity-details-page .ev-card-meta .val {
  font-size: 13px;
  font-weight: 600;
  color: #2f3a35;
  word-break: break-word;
}
.activity-details-page .ev-card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed #e1efe6;
}

@media (max-width: 575px) {
  .activity-details-page .ad-officer-tabs .ev-view-toggle {
    width: 100%;
    justify-content: center;
  }
  .activity-details-page .ev-card-meta {
    grid-template-columns: 1fr;
  }
  .activity-details-page .ev-card-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .activity-details-page .ev-card-actions .ant-btn {
    width: 100%;
  }
}
</style>
