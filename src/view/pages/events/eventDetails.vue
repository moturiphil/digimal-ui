<template>
  <div class="event-detail-page">
    <Main>
      <header class="ev-detail-header">
        <div class="ev-detail-heading">
          <h2 class="ev-detail-title">{{ event_name }}</h2>
          <div class="ev-detail-chips">
            <span class="ev-chip ev-chip-code">{{ event_code }}</span>
            <span class="ev-status-badge" :class="statusBadgeClass">
              <span class="dot"></span> {{ eventStatusLabel }}
            </span>
            <span class="ev-status-badge payroll" :class="payrollBadgeClass">
              <sdFeatherIcons type="dollar-sign" size="12" /> {{ payrollLabel }}
            </span>
          </div>
        </div>
      </header>

      <div class="ev-detail-toolbar">
        <!-- Event lifecycle actions -->
        <div class="ev-toolbar-section">
          <span class="ev-toolbar-label">
            <sdFeatherIcons type="zap" size="13" /> Workflow
          </span>
          <div class="ev-toolbar-group">
          <sdButton
            class="btn-import"
            type="light"
            outlined
            size="extra-small"
            @click="openTrainersModal"
          >
            <sdFeatherIcons type="users" size="14" /> &nbsp; View Trainers
          </sdButton>
          <sdButton
            v-if="canSubmitEvent"
            class="btn-import"
            type="primary"
            size="extra-small"
            @click="openSubmitModal"
          >
            <sdFeatherIcons type="send" size="14" /> &nbsp; Submit for Payroll
          </sdButton>
          <span v-if="!canSubmitEvent && isPayrollPending" class="ev-workflow-hint">
            Start and close the event each day on the list page. Submit for
            payroll unlocks after the final day's closure.
          </span>
          </div>
        </div>

        <!-- Management actions -->
        <div class="ev-toolbar-section">
          <span class="ev-toolbar-label">
            <sdFeatherIcons type="settings" size="13" /> Manage
          </span>
          <div class="ev-toolbar-group">
          <sdButton
            v-if="
              isApprovedGenerator &&
              event_payroll_status !== 'Generated' &&
              event_payroll_status !== 'Paid'
            "
            class="btn-import"
            type="success"
            size="extra-small"
            @click="generatePayroll"
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
          <sdButton
            v-if="
              isApprovedGenerator &&
              (event_payroll_status == 'Generated' ||
                event_payroll_status == 'Paid')
            "
            class="btn-import"
            type="warning"
            size="extra-small"
            @click="reGeneratePayroll"
            :disabled="isGenerating"
          >
            {{
              isLoading
                ? "Loading..."
                : isGenerating
                ? "Processing ..."
                : "Re-Generate Payroll"
            }}
          </sdButton>
          <sdButton
            class="btn-import"
            type="success"
            @click="exportParticipants"
            size="extra-small"
          >
            {{
              isLoading
                ? "Downloading..."
                : isDownloading
                ? "Processing..."
                : "Download List"
            }}
            &nbsp;
            <sdFeatherIcons type="download-cloud" size="extra-small" />
          </sdButton>
          <sdButton
            class="btn-import"
            type="warning"
            @click="openCadreModal()"
            size="extra-small"
          >
            Participation Summary &nbsp;
            <sdFeatherIcons type="users" size="extra-small" />
          </sdButton>
          <sdButton
            v-if="event_list_id == 29"
            class="btn-import"
            type="warning"
            size="extra-small"
          >
            <router-link
              :to="{
                path: `/event/post-security-summary`,
                query: { event_location_id: event_location_id },
              }"
            >
              Post Security Summary
            </router-link>
          </sdButton>
          <sdButton
            class="btn-import"
            type="warning"
            @click="openMatrixModal()"
            size="extra-small"
          >
            Event Matrix &nbsp;
            <sdFeatherIcons type="award" size="extra-small" />
          </sdButton>
          <sdButton
            class="btn-import"
            type="warning"
            @click="openModal()"
            size="extra-small"
          >
            Archive Event &nbsp;
            <sdFeatherIcons type="archive" size="extra-small" />
          </sdButton>
          </div>
        </div>
      </div>

      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="ev-participant-bar">
              <a-tabs
                v-model:activeKey="activeClass"
                class="ev-participant-tabs"
              >
                <a-tab-pane key="all">
                  <template #tab>
                    <span class="ev-tab-label">
                      <sdFeatherIcons type="users" size="14" /> All Participants
                      <span class="ev-tab-count">{{ recordCount }}</span>
                    </span>
                  </template>
                </a-tab-pane>
                <a-tab-pane key="confirmed">
                  <template #tab>
                    <span class="ev-tab-label">
                      <sdFeatherIcons type="check-circle" size="14" /> Confirmed
                      <span class="ev-tab-count confirmed">{{
                        confirmedCount
                      }}</span>
                    </span>
                  </template>
                </a-tab-pane>
                <a-tab-pane key="pending">
                  <template #tab>
                    <span class="ev-tab-label">
                      <sdFeatherIcons type="clock" size="14" /> Pending
                      <span class="ev-tab-count pending">{{
                        pendingCount
                      }}</span>
                    </span>
                  </template>
                </a-tab-pane>
              </a-tabs>
              <div class="ev-table-search">
                <span class="search-icon">
                  <sdFeatherIcons type="search" size="14" />
                </span>
                <a-input
                  v-model:value="searchItem"
                  type="text"
                  name="dataSource"
                  placeholder="Search participant by name, phone, role…"
                  allow-clear
                />
              </div>
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
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #participants="{ record }">
                              <td>
                                <div class="table-actions">
                                  <sdButton
                                    size="extra-small"
                                    type="success"
                                    :disabled="isStarting"
                                    @click="assignFacilitator(record)"
                                    v-if="record.is_facilitator == false"
                                  >
                                    <span>Assign Facilitator </span>
                                  </sdButton>
                                  &nbsp;&nbsp;
                                  <sdButton
                                    size="extra-small"
                                    type="warning"
                                    :disabled="isStarting"
                                    @click="deassignFacilitator(record)"
                                    v-if="record.is_facilitator == true"
                                  >
                                    <span> De-assign Facilitator </span>
                                  </sdButton>
                                  &nbsp; &nbsp;
                                  <sdButton
                                    size="extra-small"
                                    type="danger"
                                    @click="voidParticipant(record.id)"
                                    v-if="isApprovedGenerator"
                                  >
                                    Void Participant
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'confirmed'"
                        >
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
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'pending'"
                        >
                          <div class="ev-validate-bar">
                            <span class="ev-validate-hint">
                              Confirm attendance for participants who have not
                              yet confirmed.
                            </span>
                            <div class="ev-validate-actions">
                              <sdButton
                                type="success"
                                size="extra-small"
                                :disabled="isValidating || !pending.length"
                                @click="validateAllPending"
                              >
                                <sdFeatherIcons type="check-circle" size="14" />
                                &nbsp; Validate All
                              </sdButton>
                              <sdButton
                                type="primary"
                                size="extra-small"
                                :disabled="isValidating || !selectedPendingKeys.length"
                                @click="validateSelectedPending"
                              >
                                <sdFeatherIcons type="check" size="14" /> &nbsp;
                                Confirm Selected ({{ selectedPendingKeys.length }})
                              </sdButton>
                            </div>
                          </div>
                          <a-table
                            :pagination="{
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                            :row-key="(record) => record.id"
                            :row-selection="{
                              selectedRowKeys: selectedPendingKeys,
                              onChange: onPendingSelectionChange,
                            }"
                          >
                            <template #participants="{ record }">
                              <td>
                                <div class="table-actions">
                                  <sdButton
                                    type="success"
                                    size="extra-small"
                                    :disabled="isValidating"
                                    @click="validateSinglePending(record.id)"
                                  >
                                    Confirm Attendance
                                  </sdButton>
                                  <sdButton
                                    type="warning"
                                    size="extra-small"
                                    @click="resendConfirmation(record.id)"
                                  >
                                    Resend Confirmation
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                      </div>
                      <!-- Void Participants Modal -->
                      <a-modal
                        title="Void Participant"
                        :visible="isModalOpen"
                        @cancel="handleCancel"
                        width="20%"
                      >
                        <p>Are you sure you want to void participant?</p>

                        <a-form
                          class="add-record-form"
                          :style="{ width: '100%' }"
                          layout="vertical"
                          name="addactivity"
                          :model="formState"
                        >
                          <a-form-item name="reason_for_voiding" label="Reason">
                            <a-textarea
                              v-model:value="formState.reason_for_voiding"
                              placeholder="State reason for voiding..."
                              :rows="4"
                            />
                          </a-form-item>
                        </a-form>
                        <template #footer>
                          <a-button
                            key="cancel"
                            type="warning"
                            @click="handleCancel"
                          >
                            Cancel
                          </a-button>
                          <a-button
                            key="confirm"
                            type="danger"
                            @click="handleVoid"
                          >
                            Confirm
                          </a-button>
                        </template>
                      </a-modal>
                      <!-- End void participant modal -->

                      <!-- Archive Event Modal -->
                      <a-modal
                        title="Archive Event"
                        :visible="isArchiveModalOpen"
                        @cancel="handleCancelArchive"
                        width="20%"
                      >
                        <p>
                          Are you sure you want to archive event? <br />
                          <br />
                          By confirming this, the event will not be available to
                          users.
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
                            @click="handleArchiveEvent"
                          >
                            Confirm
                          </a-button>
                        </template>
                      </a-modal>
                      <!-- End Archive Event modal -->

                      <!-- Event Matrix Modal -->
                      <a-modal
                        title="Payroll Event Matrix"
                        :visible="isMatrixModalOpen"
                        @cancel="handleCancelMatrix"
                        width="60%"
                        :footer="null"
                      >
                        <sdCards headless>
                          <div class="result-list-content">
                            <a-row :gutter="15">
                              <a-col class="w-100" :md="24">
                                <sdCards headless>
                                  <sdHeader>
                                    <b>
                                      <span class="ai-playback-shuffle"></span
                                      >Payable Organizations
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
                                        :dataSource="event_matrixes"
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

                      <!-- End Event Matrix modal -->

                      <!-- Cadre Modal -->
                      <a-modal
                        title="Participation Summary"
                        :visible="isCadreModalOpen"
                        @cancel="handleCancelCadre"
                        width="40%"
                        :footer="null"
                      >
                        <sdCards headless>
                          <div class="result-list-content">
                            <a-row :gutter="15">
                              <a-col class="w-100" :md="24">
                                <sdCards headless>
                                  <div>
                                    <ul class="cadre-list">
                                      <li
                                        v-for="cadre in cadres"
                                        :key="cadre.role_id"
                                        class="cadre-list-item"
                                      >
                                        {{ cadre.role_id }} -
                                        <b>{{ cadre.count }}</b>
                                        <span
                                          v-if="
                                            cadre.dayshift || cadre.nightshift
                                          "
                                        >
                                          (Dayshift -
                                          <b> {{ cadre.dayshift }}</b> &
                                          Nightshift -
                                          <b>{{ cadre.nightshift }} </b>)
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                  <br />
                                </sdCards>
                              </a-col>
                            </a-row>
                          </div>
                        </sdCards>
                      </a-modal>

                      <!-- End Cadre Modal -->

                      <!-- Assign & Deassign Modals -->
                      <a-modal
                        title="Assign Facilitator"
                        :visible="isAssignModal"
                        @ok="handleAssign"
                        @cancel="handleAssignCancel"
                        class="title-success"
                      >
                        <div>
                          <p>
                            Please confirm that you want to assign
                            {{ participant.first_name }}
                            {{ participant.last_name }},
                            {{ participant.id_no }} of
                            {{ participant.location_id }} as facilitator to
                            <br />
                            Event: {{ event_name }}
                          </p>
                        </div>
                      </a-modal>

                      <a-modal
                        title="De-assign Facilitator"
                        :visible="deassignModal"
                        @ok="handleDeassign"
                        @cancel="handleDeassignCancel"
                        class="title-success"
                      >
                        <div>
                          <p>
                            Please confirm that you want to de-assign
                            {{ participant.first_name }}
                            {{ participant.last_name }},
                            {{ participant.id_no }} of
                            {{ participant.location_id }} as facilitator to
                            <br />
                            Event: {{ event_name }}
                          </p>
                        </div>
                      </a-modal>
                      <!--  End of assign & Deassign Modals  -->
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>

      <!-- Submit for payroll workflow -->
      <EventSubmitPayrollModal
        v-model:visible="isSubmitModalOpen"
        :event="liveEvent"
        @submitted="onEventSubmitted"
      />

      <!-- Event trainers modal -->
      <a-modal
        title="Event Trainers"
        :visible="isTrainersModalOpen"
        :footer="null"
        @cancel="closeTrainersModal"
        class="title-success"
      >
        <div>
          <h4><b><u>Event Host</u></b></h4>
          <p>{{ trainers_host || "—" }}</p>
          <h4><b><u>Event Facilitators</u></b></h4>
          <br />
          <ul>
            <li v-for="f in trainers_facilitators" :key="f">{{ f }}</li>
            <li v-if="!trainers_facilitators.length">—</li>
          </ul>
        </div>
      </a-modal>
    </Main>
  </div>
</template>

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./style";
import { computed, onMounted, ref, reactive } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { Modal } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import store from "../../../vuex/store";
import { decrypt } from "@/cryptoHelper";
import { notification } from "ant-design-vue";
import EventSubmitPayrollModal from "./components/EventSubmitPayrollModal.vue";

const columns = [
  {
    title: "Participant Name",
    dataIndex: "fullName",
    key: "id",
  },
  {
    title: "Participant Phone",
    dataIndex: "phone_no",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Level",
    dataIndex: "level_id",
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
    title: "Attendance Days",
    dataIndex: "no_of_days",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "participants",
    slots: { customRender: "participants" },
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

const recordCount = computed(() => dataSource.value.length);
const confirmedCount = computed(() => confirmed.value.length);
const pendingCount = computed(() => pending.value.length);
const { query } = useRoute();
const plainquery = decrypt(decodeURIComponent(query.encryptedData));
const event_name = plainquery.name;
const event_list_id = plainquery.event_list_id;
const event_location_id = plainquery.location;
const event_code = plainquery.event_code;
const event_payroll_status = plainquery.payroll_status;
const router = useRouter();
const { state } = useStore();
const isLoading = ref(true);
const dataSource = ref([]);
const confirmed = ref([]);
const pending = ref([]);
const activeClass = ref("all");
const isGenerating = computed(() => state.isGenerating);
const isModalOpen = ref(false);
const isArchiveModalOpen = ref(false);
const isMatrixModalOpen = ref(false);
const isCadreModalOpen = ref(false);
const participant_id = ref("");
const API_URL = `events/${plainquery.event_code}/participants`;
const genetatePayrollURL = `${process.env.VUE_APP_BASE_URL}/generate_events_pay_roll?status=1&event_code=${event_code}`;
const reGenetatePayrollURL = `${process.env.VUE_APP_BASE_URL}/regenerate_event_payroll?status=1&event_code=${event_code}`;
const export_participants_url = `${process.env.VUE_APP_BASE_URL}/event_participants_export?event_code=${plainquery.event_code}`;
const event_matrix = `${process.env.VUE_APP_BASE_URL}/view_event_matrix?event_list_id=${plainquery.event_list_id}`;
const orgs_matrix = `${process.env.VUE_APP_BASE_URL}/view_event_org_matrix?event_list_id=${plainquery.event_list_id}`;
const cadres_url = `${process.env.VUE_APP_BASE_URL}/get_event-registration_role_counts/${plainquery.id}`;
const sub_county_post = `${process.env.VUE_APP_BASE_URL}/get_sub_county_posts?subcounty_id=${event_location_id}`;
const total_sub_county_post = ref(0);
const event_matrixes = ref([]);
const org_matrixes = ref([]);
const cadres = ref([]);
const isAssignModal = ref(false);
const deassignModal = ref(false);
const participant = ref("");
const id_user = ref("");
const searchItem = ref("");
const isDownloading = ref(false);

// ── Event lifecycle (submit for payroll / generate payroll) ──
const liveEvent = ref({
  id: plainquery.id,
  name: event_name,
  event_code: event_code,
  status: plainquery.status,
  start_date: plainquery.start_date,
  payroll_status: event_payroll_status,
  payroll_submitted: plainquery.payroll_submitted,
});
// Kept only to disable the facilitator assign/de-assign buttons while a
// background mutation is in flight.
const isStarting = ref(false);
const isSubmitModalOpen = ref(false);

// ── Event trainers ──
const isTrainersModalOpen = ref(false);
const trainers_host = ref("");
const trainers_facilitators = ref([]);

const isPayrollPending = computed(
  () => (liveEvent.value.payroll_status || event_payroll_status) === "Pending"
);
// Submission is gated by the backend: the event must be closed on (or after)
// its final scheduled day. The list page drives the daily start/close cycle.
const canSubmitEvent = computed(
  () => !!liveEvent.value.can_submit_payroll && isPayrollPending.value
);

// ── Presentation helpers for the detail header ──
const eventStatusLabel = computed(() => {
  if (liveEvent.value.status) return "Active";
  if (liveEvent.value.start_date) return "Closed";
  return "Not Started";
});
const statusBadgeClass = computed(() => {
  if (liveEvent.value.status) return "is-active";
  if (liveEvent.value.start_date) return "is-closed";
  return "is-idle";
});
const payrollLabel = computed(() => {
  const status = liveEvent.value.payroll_status || event_payroll_status;
  if (status === "Generated") return "Payroll Generated";
  if (status === "Paid") return "Payroll Paid";
  return "Payroll Pending";
});
const payrollBadgeClass = computed(() => {
  const status = liveEvent.value.payroll_status || event_payroll_status;
  if (status === "Generated") return "is-generated";
  if (status === "Paid") return "is-paid";
  return "is-pending";
});

const fetchLiveEvent = async () => {
  try {
    const response = await axios.get(`events/${plainquery.id}/show`, {
      headers: authHeader(),
    });
    if (response.data && response.data.data) {
      liveEvent.value = response.data.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const openSubmitModal = () => {
  isSubmitModalOpen.value = true;
};
const onEventSubmitted = () => {
  setTimeout(() => location.reload(), 1500);
};

const openTrainersModal = async () => {
  trainers_host.value = "";
  trainers_facilitators.value = [];
  isTrainersModalOpen.value = true;
  try {
    const response = await axios.get(`event/${event_code}/facilitators`, {
      headers: authHeader(),
    });
    const details = response.data.data;
    trainers_host.value = details.event_host;
    trainers_facilitators.value = details.event_facilitators || [];
  } catch (error) {
    console.error(error);
  }
};
const closeTrainersModal = () => {
  isTrainersModalOpen.value = false;
};

const formState = reactive({
  reason_for_voiding: "",
});

const level_id = ref("");
const role_id = ref("");
const rt = useRouter();

onMounted(async () => {
  isLoading.value = true;
  getEventParticipants();
  fetchLiveEvent();
  if (event_list_id == 20) {
    getPostCount();
  }
});

const getEventParticipants = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_URL, {
      headers: authHeader(),
    });

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      return {
        ...record,
        fullName,
      };
    });

    dataSource.value = updatedData;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
  try {
    const response = await axios.get(API_URL + "?status=1", {
      headers: authHeader(),
    });
    console.log(API_URL + "?status=1");

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      return {
        ...record,
        fullName,
      };
    });
    confirmed.value = updatedData;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
  try {
    const response = await axios.get(API_URL + "?status=0", {
      headers: authHeader(),
    });
    console.log(API_URL + "?status=0");
    console.log(response.data.data);

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
  } finally {
    isLoading.value = false;
  }
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    rt.push({ path: "/auth/login" });
  } else {
    level_id.value = user.user.level_id;
    role_id.value = user.user.role_id;
  }
};

const generatePayroll = async () => {
  store.commit("setIsGenerating", true);

  try {
    const response = await axios.get(genetatePayrollURL, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    console.log(response);

    if (response.status === 200) {
      store.commit("setIsGenerating", false);
      Modal.success({
        title: "Success",
        content: "Payroll Generated Successfully",
      });
      await new Promise((resolve) => setTimeout(resolve, 4000));
      location.reload();
    } else {
      handleErrorResponse(response);
    }
  } catch (error) {
    console.error(error);
    handleErrorResponse(error);
  }
};

const reGeneratePayroll = async () => {
  store.commit("setIsGenerating", true);

  try {
    const response = await axios.get(reGenetatePayrollURL, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    console.log(response);

    if (response.status === 200) {
      store.commit("setIsGenerating", false);
      Modal.success({
        title: "Success",
        content: "Payroll Generated Successfully",
      });
      await new Promise((resolve) => setTimeout(resolve, 4000));
      location.reload();
    } else {
      handleErrorResponse(response);
    }
  } catch (error) {
    console.error(error);
    handleErrorResponse(error);
  }
};

// ── Host attendance validation (pending tab) ──
const selectedPendingKeys = ref([]);
const isValidating = ref(false);

const onPendingSelectionChange = (keys) => {
  selectedPendingKeys.value = keys;
};

const validatePendingParticipants = async (payload, successMessage) => {
  isValidating.value = true;
  try {
    const response = await axios.post(
      `event/${plainquery.id}/validate_participants`,
      payload,
      { headers: authHeader() }
    );
    if (response.data && response.data.success) {
      notification.success({
        message: "Attendance Confirmed",
        description: response.data.message || successMessage,
      });
      selectedPendingKeys.value = [];
      await getEventParticipants();
    } else {
      notification.info({
        message: "Info",
        description: response.data?.message || "No participants were updated.",
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description:
        error?.response?.data?.message ||
        "Unable to confirm participant attendance.",
    });
  } finally {
    isValidating.value = false;
  }
};

const validateAllPending = () =>
  validatePendingParticipants(
    { validate_all: true },
    "All pending participants confirmed."
  );

const validateSelectedPending = () => {
  if (!selectedPendingKeys.value.length) return;
  validatePendingParticipants(
    { user_ids: selectedPendingKeys.value },
    "Selected participants confirmed."
  );
};

const validateSinglePending = (id) =>
  validatePendingParticipants(
    { user_ids: [id] },
    "Participant attendance confirmed."
  );

// resendConfirmation
const resendConfirmation = async (id) => {
  console.log(id);
  let user_id = id;

  const url = `${process.env.VUE_APP_BASE_URL}/resend_event_registration_code/${plainquery.id}/${user_id}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    const { success, data } = await response.json();
    if (success === true) {
      notification.success({
        message: "Success",
        description: data,
      });
      isModalOpen.value = false;
    } else {
      notification.info({
        message: "Info",
        description: data,
      });
    }
    isModalOpen.value = false;
  } catch (error) {
    console.error("Error:", error);
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const voidParticipant = (id) => {
  isModalOpen.value = true;
  console.log(id);
  participant_id.value = id;
};

const handleCancel = () => {
  isModalOpen.value = false;
};

const handleVoid = async () => {
  console.log(participant_id.value);
  try {
    const data = {
      event_id: plainquery.id,
      user_id: participant_id.value,
      reason_for_voiding: formState.reason_for_voiding,
    };
    console.log(data);
    fetch(`${process.env.VUE_APP_BASE_URL}/void_event_participant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ success, message }) => {
        console.log(message);
        if (success == true) {
          notification.success({
            message: "Participant voided successfully",
            description: message,
          });
          new Promise((resolve) => {
            setTimeout(resolve, 3000);
          });
          location.reload();
        } else {
          notification.error({
            message: "Participant voiding not successful",
            description: message,
          });
        }
      })
      .catch((error) => {
        store.commit("setIsSubmitting", false);
        notification.error({
          message: "Could not submit!",
          description: "An error has occured. Please try again later.",
        });
        console.error("Error:", error);
      });
  } catch (error) {
    console.error(error);
  }
};

const handleArchiveEvent = async () => {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/event/archive?id=${plainquery.id}`,
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

const handleErrorResponse = (error) => {
  store.commit("setIsGenerating", false);

  // Surface the backend's specific message (e.g. payroll gating: the event must
  // be closed and submitted for payroll before generation is allowed).
  const data = error?.response?.data;
  const statusCode = error?.response?.status;
  const message = data?.message;

  if (statusCode === 422 && message) {
    Modal.warning({
      title: "Payroll not available yet",
      content: message,
    });
    return; // do not reload — let the host act on the message
  }

  if (statusCode === 401 && message) {
    Modal.error({
      title: "Not allowed",
      content: message,
    });
    return;
  }

  Modal.error({
    title: "Error",
    content: message || "Something went wrong, contact admin",
  });
  setTimeout(() => location.reload(), 4000);
};
const openModal = () => {
  console.log("archive modal");
  isArchiveModalOpen.value = true;
};

const handleCancelArchive = () => {
  isArchiveModalOpen.value = false;
};

const openMatrixModal = () => {
  isMatrixModalOpen.value = true;
};

const handleCancelMatrix = () => {
  isMatrixModalOpen.value = false;
};

const openCadreModal = () => {
  isCadreModalOpen.value = true;
};

const handleCancelCadre = () => {
  isCadreModalOpen.value = false;
};

const getEventMatrix = () => {
  axios
    .get(event_matrix, {
      headers: authHeader(),
    })
    .then((response) => {
      event_matrixes.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

getEventMatrix();

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

const getTraineCadres = () => {
  axios
    .get(cadres_url, {
      headers: authHeader(),
    })
    .then((response) => {
      cadres.value = response.data.data;
      console.log(cadres.value);
    })
    .catch((error) => {
      console.error(error);
    });
};

getTraineCadres();

const exportParticipants = async () => {
  isDownloading.value = true;
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
    const fileName = "Event Participants.xlsx";
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([fileBlob]));
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error(error);
  } finally {
    isDownloading.value = false;
  }
};

const assignFacilitator = (user) => {
  isAssignModal.value = true;
  console.log(user.first_name);
  participant.value = user;
  id_user.value = user.id;
};

const handleAssignCancel = () => {
  isAssignModal.value = false;
};

const deassignFacilitator = (user) => {
  deassignModal.value = true;
  participant.value = user;
  id_user.value = user.id;
};

const handleDeassignCancel = () => {
  deassignModal.value = false;
};

const handleAssign = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/assign_facilitator/${plainquery.id}/${id_user.value}`,
      null,
      {
        headers: authHeader(),
      }
    );

    isAssignModal.value = false;
    console.log(response);
    if (response.data.success == true) {
      notification.success({
        message: "Success",
        description: response.data.data,
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      location.reload();
    } else if (response.data.success == false) {
      notification.warning({
        message: "Info",
        description: response.data.message,
      });
    }
  } catch (e) {
    notification.error({
      message: "Error!",
      description: e.toString(),
    });
    console.log(e);
  }
};

const handleDeassign = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/de_assign_facilitator/${plainquery.id}/${id_user.value}`,
      null,
      {
        headers: authHeader(),
      }
    );

    isAssignModal.value = false;
    console.log(response);
    if (response.data.success == true) {
      notification.success({
        message: "Success",
        description: response.data.data,
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      location.reload();
    } else if (response.data.success == false) {
      notification.warning({
        message: "Info",
        description: response.data.message,
      });
    }
  } catch (e) {
    notification.error({
      message: "Error!",
      description: e.toString(),
    });
    console.log(e);
  }
};

const filteredData = computed(() => {
  let list;
  if (activeClass.value === "confirmed") {
    list = confirmed.value;
  } else if (activeClass.value === "pending") {
    list = pending.value;
  } else {
    list = dataSource.value;
  }

  const term = searchItem.value ? searchItem.value.toLowerCase() : "";
  if (!term) return list;

  return list.filter((item) => {
    const fields = [
      item.fullName,
      item.phone_no,
      item.location_id,
      item.level_id,
      item.org_types_id,
      item.role_id,
    ];
    return fields.some((f) =>
      String(f ?? "").toLowerCase().includes(term)
    );
  });
});

const user = JSON.parse(sessionStorage.getItem("user"));
console.log(event_list_id);

const isApprovedGenerator = computed(() => {
  if (
    user.user.role_id === 53 ||
    user.user.role_id === 63 ||
    user.user.role_id === 64 ||
    user.user.role_id === 59 ||
    user.user.role_id === 4
  ) {
    return true;
  } else {
    return false;
  }
});

console.log( isApprovedGenerator.value && event_payroll_status == 'Generated' || event_payroll_status == 'Paid');


computed(() => {
  if (user.user.org_types_id === 10) {
    return true;
  } else {
    return false;
  }
});

const getPostCount = async () => {
  try {
    const response = await fetch(sub_county_post, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    const data = await response.json(); // Await here to resolve the JSON promise
    console.log(data); // Log data after it has resolved
    total_sub_county_post.value = data.total_posts;
  } catch (error) {
    console.error("Error:", error);
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};
</script>

<style>
.search-box {
  width: 100%; /* Adjust the width as needed, e.g., 100%, 300px, etc. */
  max-width: 400px; /* Optionally, set a maximum width */
  margin: 0 auto; /* Optional: Center align the search box */
}
.button-container {
  text-align: center;
}

.button-container sdButton {
  margin: 5px;
}

/* ───────── Event detail header ───────── */
.event-detail-page {
  padding: 16px 12px 0;
}
.ev-detail-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.ev-detail-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.ev-detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #1b3b2a;
  margin: 0;
  line-height: 1.25;
}
.ev-detail-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.ev-workflow-hint {
  font-size: 12px;
  color: #7d8c84;
  max-width: 520px;
  line-height: 1.4;
}
.ev-participant-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.ev-validate-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  padding: 10px 14px;
  border: 1px solid #cfeadb;
  border-radius: 10px;
  background: #f3fbf6;
}
.ev-validate-hint {
  font-size: 12px;
  color: #5c6f64;
}
.ev-validate-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ev-table-search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 1 300px;
  min-width: 220px;
}
.ev-table-search .search-icon {
  position: absolute;
  left: 14px;
  z-index: 1;
  display: flex;
  color: #6fae8b;
}
.ev-table-search :deep(.ant-input-affix-wrapper),
.ev-table-search .ant-input-affix-wrapper {
  border-radius: 22px;
  border: 1px solid #cfeadb;
  background: #fff;
  padding-left: 38px;
  height: 40px;
  width: 100%;
}
.ev-table-search input {
  border: 0;
  background: transparent;
}

/* ───────── Event hero summary (legacy) ───────── */
.ev-hero {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: flex-start;
  justify-content: space-between;
  background: linear-gradient(120deg, #f1fbf5 0%, #f9fffb 45%, #eef9f2 100%);
  border: 1px solid #d9f0e2;
  border-radius: 16px;
  padding: 20px 22px;
  margin-bottom: 16px;
  box-shadow: 0 6px 18px rgba(28, 122, 72, 0.07);
}
.ev-hero-main {
  flex: 1 1 420px;
  min-width: 0;
}
.ev-hero-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.ev-hero-title {
  font-size: 22px;
  font-weight: 700;
  color: #1b3b2a;
  margin: 0;
  line-height: 1.25;
}
.ev-chip {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  border-radius: 12px;
  padding: 3px 12px;
  letter-spacing: 0.02em;
}
.ev-chip-code {
  background: #e6f4ed;
  color: #15693c;
  border: 1px solid #bfe4cd;
}
.ev-chip-gf {
  background: #daf4e4;
  color: #15693c;
  border: 1px solid #9ad8b4;
}
.ev-chip-pmi {
  background: #e0ecff;
  color: #1d4ed8;
  border: 1px solid #b3ccff;
}
.ev-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.ev-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  padding: 4px 12px;
  border: 1px solid transparent;
}
.ev-status-badge .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.ev-status-badge.is-active {
  color: #15693c;
  background: #e3f7ec;
  border-color: #9ad8b4;
}
.ev-status-badge.is-idle {
  color: #8a6d1b;
  background: #fdf6e3;
  border-color: #ecd9a0;
}
.ev-status-badge.is-closed {
  color: #9b2c2c;
  background: #fdecec;
  border-color: #f3b5b5;
}
.ev-status-badge.payroll.is-pending {
  color: #6b7280;
  background: #f3f4f6;
  border-color: #d8dce2;
}
.ev-status-badge.payroll.is-generated {
  color: #1d4ed8;
  background: #e6efff;
  border-color: #b3ccff;
}
.ev-status-badge.payroll.is-paid {
  color: #15693c;
  background: #e3f7ec;
  border-color: #9ad8b4;
}
.ev-status-badge.submitted {
  color: #15693c;
  background: #f3fcf6;
  border-color: #cdead9;
}
.ev-meta {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px 18px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.ev-meta li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: #2f6746;
}
.ev-meta li svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: #4a9d6f;
}
.ev-meta .meta-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ev-meta .lbl {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #7d9488;
  font-weight: 600;
}
.ev-meta .val {
  font-size: 13.5px;
  font-weight: 600;
  color: #243831;
  word-break: break-word;
}
.ev-hero-search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 1 320px;
  min-width: 240px;
}
.ev-hero-search .search-icon {
  position: absolute;
  left: 14px;
  z-index: 1;
  display: flex;
  color: #6fae8b;
}
.ev-hero-search :deep(.ant-input-affix-wrapper),
.ev-hero-search .ant-input-affix-wrapper {
  border-radius: 22px;
  border: 1px solid #cfeadb;
  background: #fff;
  padding-left: 38px;
  height: 42px;
  width: 100%;
}
.ev-hero-search input {
  border: 0;
  background: transparent;
}

/* ───────── Quick stats ───────── */
.ev-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}
.ev-stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #e6eef0;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 3px 10px rgba(20, 60, 40, 0.05);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.ev-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(20, 60, 40, 0.1);
}
.ev-stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: #fff;
}
.ev-stat-card.all .ev-stat-icon {
  background: linear-gradient(135deg, #2f9e6b, #1c7a48);
}
.ev-stat-card.confirmed .ev-stat-icon {
  background: linear-gradient(135deg, #34c38f, #18a06f);
}
.ev-stat-card.pending .ev-stat-icon {
  background: linear-gradient(135deg, #f1b44c, #e08e0b);
}
.ev-stat-card.posts .ev-stat-icon {
  background: linear-gradient(135deg, #4f8cff, #1d4ed8);
}
.ev-stat-body {
  display: flex;
  flex-direction: column;
}
.ev-stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1b3b2a;
  line-height: 1.1;
}
.ev-stat-label {
  font-size: 12px;
  color: #7d9488;
  font-weight: 600;
}

/* ── Reorganised action toolbar ── */
.ev-detail-toolbar {
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
.ev-toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ev-toolbar-section:not(:last-child) {
  padding-bottom: 14px;
  border-bottom: 1px dashed #e1efe6;
}
.ev-toolbar-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: #8a9d93;
}
.ev-toolbar-label svg {
  color: #4a9d6f;
}
.ev-toolbar-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.ev-toolbar-group .btn-import {
  margin: 0;
}
.ev-toolbar-group .btn-import a {
  color: inherit;
}

/* ── Participant tabs ── */
.ev-participant-tabs .ev-tab-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.ev-participant-tabs .ev-tab-count {
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
.ev-participant-tabs .ev-tab-count.confirmed {
  background: #e3f7ec;
  color: #15693c;
}
.ev-participant-tabs .ev-tab-count.pending {
  background: #fdf6e3;
  color: #a9802a;
}

.cadre-list {
  list-style-type: none;
  padding: 0;
}

.cadre-list-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
}

@media (min-width: 769px) {
  .button-container {
    text-align: left;
    display: inline-block;
  }

  .button-container sdButton {
    margin: 5px;
  }
}
@media (max-width: 768px) {
  .button-container sdButton {
    margin: 5px 0;
    padding: 5px;
  }
  .ev-toolbar-group {
    justify-content: flex-start;
  }
  .ev-hero {
    padding: 16px;
  }
  .ev-hero-title {
    font-size: 19px;
  }
  .ev-hero-search {
    flex: 1 1 100%;
  }
}
</style>
