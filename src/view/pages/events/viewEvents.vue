<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ev-events-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> MassNet Events
            </h3>
          </div>
          <div class="ph-actions">
            <router-link
              v-if="canCreateEvent"
              to="/events/event-create"
              class="ev-create-btn"
            >
              <sdFeatherIcons type="plus" size="14" />
              Create Event
            </router-link>
            <div class="ev-view-toggle" role="group" aria-label="Toggle view">
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
          </div>
        </header>

        <!-- Filter panel -->
        <section class="panel filter-panel">
          <div class="filter-grid">
            <a-select
              v-model:value="fundingSource"
              allow-clear
              placeholder="Funding Source (GF / PMI)"
              :options="funding_source_options"
              @change="handleFilterChange"
            ></a-select>
            <a-select
              v-model:value="campaignFilter"
              allow-clear
              show-search
              placeholder="Campaign"
              :options="campaignOptions"
              :filter-option="filterOption"
              :loading="campaignsLoading"
              @change="handleFilterChange"
            ></a-select>
            <a-select
              v-model:value="payrollStatus"
              allow-clear
              placeholder="Event Payroll Status"
              :options="payroll_status_options"
              @change="handleFilterChange"
            ></a-select>
          </div>

          <div class="ev-search">
            <span class="search-icon">
              <sdFeatherIcons type="search" size="14" />
            </span>
            <a-input
              v-model:value="searchItem"
              type="text"
              name="dataSource"
              placeholder="Search by name, code, venue or location"
              allow-clear
            />
          </div>
        </section>

        <!-- Events list -->
        <section class="panel events-panel">
          <div v-if="isLoading" class="ev-loading">
            <a-spin />
          </div>

          <div v-else>
            <!-- Table view -->
            <TableWrapper
              v-if="viewMode === 'table'"
              class="table-data-view table-responsive ev-table-shell"
            >
              <a-table
                :pagination="false"
                :dataSource="dataSource"
                :columns="columns"
                row-key="id"
              >
                <template #funding="{ record }">
                  <td>
                    <span
                      class="ev-fund-chip"
                      :class="fundingChipClass(record.funding_source, record.funding_id)"
                    >
                      {{ fundingLabel(record.funding_source, record.funding_id) }}
                    </span>
                  </td>
                </template>
                <template #events="{ record }">
                  <td>
                    <div class="table-actions ev-actions">
                      <sdButton
                        size="extra-small"
                        type="primary"
                        class="ev-action-btn"
                      >
                        <router-link
                          :to="{
                            name: `view-details`,
                            params: { id: record.id },
                            query: {
                              encryptedData: encodeURIComponent(
                                encrypt({
                                  id: record.id,
                                  name: record.name,
                                  event_code: record.event_code,
                                  event_host_id: record.event_host_id,
                                  funding_id: record.funding_id,
                                  start_date: record.start_date,
                                  event_list_id: record.event_list_id,
                                  location: record.county,
                                  payroll_status: record.payroll_status,
                                  status: record.status,
                                  payroll_submitted: record.payroll_submitted,
                                })
                              ),
                            },
                          }"
                        >
                          <sdFeatherIcons type="eye" size="12" /> View Event
                        </router-link>
                      </sdButton>
                      <sdButton
                        v-if="isPending(record)"
                        size="extra-small"
                        type="light"
                        outlined
                        class="ev-action-btn"
                        @click="openRegisterModal(record)"
                      >
                        <sdFeatherIcons type="user-plus" size="12" /> Register
                      </sdButton>
                      <sdButton
                        v-if="needsBudgetLink(record)"
                        size="extra-small"
                        type="light"
                        outlined
                        class="ev-action-btn ev-link-start"
                        title="Link this event to a budget template before starting it."
                      >
                        <router-link
                          :to="{
                            name: `view-details`,
                            params: { id: record.id },
                            query: {
                              encryptedData: encodeURIComponent(
                                encrypt({
                                  id: record.id,
                                  name: record.name,
                                  event_code: record.event_code,
                                  event_host_id: record.event_host_id,
                                  funding_id: record.funding_id,
                                  start_date: record.start_date,
                                  event_list_id: record.event_list_id,
                                  location: record.county,
                                  payroll_status: record.payroll_status,
                                  status: record.status,
                                  payroll_submitted: record.payroll_submitted,
                                })
                              ),
                            },
                          }"
                        >
                          <sdFeatherIcons type="link" size="12" /> Link Budget to Start
                        </router-link>
                      </sdButton>
                      <sdButton
                        v-if="canStart(record)"
                        size="extra-small"
                        type="success"
                        class="ev-action-btn"
                        :disabled="isStarting"
                        @click="startEvent(record)"
                      >
                        <sdFeatherIcons type="play-circle" size="12" /> Start
                      </sdButton>
                      <sdButton
                        v-if="canClose(record)"
                        size="extra-small"
                        type="danger"
                        class="ev-action-btn"
                        @click="openCloseModal(record)"
                      >
                        <sdFeatherIcons type="x-circle" size="12" /> Close
                      </sdButton>
                    </div>
                  </td>
                </template>
              </a-table>
            </TableWrapper>

            <!-- Card view -->
            <div v-else class="ev-card-list">
              <article
                v-for="record in dataSource"
                :key="record.id"
                class="ev-card"
              >
                <div class="ev-card-head">
                  <div class="ev-card-title">{{ record.name }}</div>
                  <span class="ev-card-code">{{ record.event_code }}</span>
                </div>
                <div class="ev-card-meta">
                  <div>
                    <span class="lbl">Campaign</span>
                    <span class="val">{{ record.campaign_id || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Funding</span>
                    <span class="val">
                      <span
                        class="ev-fund-chip"
                        :class="fundingChipClass(record.funding_source, record.funding_id)"
                      >
                        {{ fundingLabel(record.funding_source, record.funding_id) }}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span class="lbl">Location</span>
                    <span class="val">{{ record.location_id || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Venue</span>
                    <span class="val">{{ record.venue || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Payroll Status</span>
                    <span class="val">{{ record.payroll_status || "—" }}</span>
                  </div>
                </div>
                <div class="ev-card-actions">
                  <sdButton
                    size="extra-small"
                    type="primary"
                    class="ev-action-btn"
                  >
                    <router-link
                      :to="{
                        name: `view-details`,
                        params: { id: record.id },
                        query: {
                          encryptedData: encodeURIComponent(
                            encrypt({
                              id: record.id,
                              name: record.name,
                              event_code: record.event_code,
                              event_host_id: record.event_host_id,
                              funding_id: record.funding_id,
                              start_date: record.start_date,
                              event_list_id: record.event_list_id,
                              location: record.county,
                              payroll_status: record.payroll_status,
                              status: record.status,
                              payroll_submitted: record.payroll_submitted,
                            })
                          ),
                        },
                      }"
                    >
                      <sdFeatherIcons type="eye" size="12" /> View Event
                    </router-link>
                  </sdButton>
                  <sdButton
                    v-if="isPending(record)"
                    size="extra-small"
                    type="light"
                    outlined
                    class="ev-action-btn"
                    @click="openRegisterModal(record)"
                  >
                    <sdFeatherIcons type="user-plus" size="12" /> Register
                  </sdButton>
                  <sdButton
                    v-if="needsBudgetLink(record)"
                    size="extra-small"
                    type="light"
                    outlined
                    class="ev-action-btn ev-link-start"
                    title="Link this event to a budget template before starting it."
                  >
                    <router-link
                      :to="{
                        name: `view-details`,
                        params: { id: record.id },
                        query: {
                          encryptedData: encodeURIComponent(
                            encrypt({
                              id: record.id,
                              name: record.name,
                              event_code: record.event_code,
                              event_host_id: record.event_host_id,
                              funding_id: record.funding_id,
                              start_date: record.start_date,
                              event_list_id: record.event_list_id,
                              location: record.county,
                              payroll_status: record.payroll_status,
                              status: record.status,
                              payroll_submitted: record.payroll_submitted,
                            })
                          ),
                        },
                      }"
                    >
                      <sdFeatherIcons type="link" size="12" /> Link Budget to Start
                    </router-link>
                  </sdButton>
                  <sdButton
                    v-if="canStart(record)"
                    size="extra-small"
                    type="success"
                    class="ev-action-btn"
                    :disabled="isStarting"
                    @click="startEvent(record)"
                  >
                    <sdFeatherIcons type="play-circle" size="12" /> Start
                  </sdButton>
                  <sdButton
                    v-if="canClose(record)"
                    size="extra-small"
                    type="danger"
                    class="ev-action-btn"
                    @click="openCloseModal(record)"
                  >
                    <sdFeatherIcons type="x-circle" size="12" /> Close
                  </sdButton>
                </div>
              </article>
              <div v-if="!dataSource.length" class="ev-empty">
                No events found.
              </div>
            </div>

            <div class="ev-pagination">
              <a-pagination
                :current="currentPage"
                :total="datatotal"
                :pageSize="pageSize"
                :showSizeChanger="true"
                @change="onPageChange($event)"
              />
            </div>
          </div>
        </section>

        <!-- Register participant modal -->
        <a-modal
          title="Register Participant"
          :visible="isRegisterModalOpen"
          @ok="confirmRegistration"
          @cancel="closeRegisterModal"
          class="title-success"
        >
          <div>
            <p>
              Enter the participant registration code to confirm attendance for
              <b>{{ activeEvent.name }}</b
              >.
            </p>
            <a-input
              v-model:value="registrationCode"
              placeholder="Registration code"
            />
          </div>
        </a-modal>

        <!-- Close event workflow -->
        <EventClosureModal
          v-model:visible="isCloseModalOpen"
          :event="activeEvent"
          @closed="onEventClosed"
        />
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import axios from "@/Axiosconfig";
import { RecordViewWrapper } from "./style";
import { BudgetPageWrapper } from "../budget/style";
import { Main } from "../../styled";
import { onMounted, ref, watch } from "vue";
import { encrypt } from "@/cryptoHelper";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
import { confirmErrorMessage } from "../../../services/budgetCapacity";
import EventClosureModal from "./components/EventClosureModal.vue";
import { GATE_DEFINITIONS } from "../../../config/navigation-permissions";
import { satisfiesGate } from "../../../services/user-role";

// Same gate as the sidebar "Create Event" entry (the `create_events` /
// `event_with_facilitator_list` permission), so the button only appears for
// users who may actually create events.
const canCreateEvent = satisfiesGate(GATE_DEFINITIONS.canCreateEvent);

const columns = [
  { title: "Event Name", dataIndex: "name", key: "id" },
  { title: "Event Code", dataIndex: "event_code", key: "id" },
  { title: "Campaign", dataIndex: "campaign_id", key: "id" },
  {
    title: "Funding",
    dataIndex: "funding_source",
    key: "funding",
    slots: { customRender: "funding" },
  },
  { title: "Location", dataIndex: "location_id", key: "id" },
  { title: "Venue", dataIndex: "venue", key: "id" },
  { title: "Payroll Status", dataIndex: "payroll_status", key: "id" },
  {
    title: "Action",
    dataIndex: "",
    key: "events",
    slots: { customRender: "events" },
  },
];

const payroll_status_options = [
  { value: "2", label: "Pending Generation" },
  { value: "0", label: "Generated" },
  { value: "1", label: "Paid" },
];

const funding_source_options = [
  { value: 1, label: "GF (Global Fund)" },
  { value: 2, label: "PMI" },
];

const isLoading = ref(true);
const dataSource = ref([]);
const searchItem = ref("");
const viewMode = ref(
  typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
);

// filters
const fundingSource = ref(null);
const campaignFilter = ref(null);
const campaignOptions = ref([]);
const campaignsLoading = ref(false);
const payrollStatus = ref(null);

const currentPage = ref(1);
const pageSize = ref(100);
const datatotal = ref(0);

// The list API returns BOTH `funding_id` (FK to funding_sources) and
// `funding_source` (the resolved NAME — "GF" / "PMI" / "GOK"). Render the name
// so the column always matches what the funding source is called; the numeric
// id is only a fallback for legacy payloads that predate the relation.
const fundingName = (source) =>
  source == null ? "" : String(source).trim();

const fundingId = (source, fallbackId) => {
  const name = fundingName(source);
  return name !== "" && !Number.isNaN(Number(name)) ? Number(name) : Number(fallbackId);
};

const fundingLabel = (source, fallbackId) => {
  const name = fundingName(source);
  // A non-numeric value is the funding source NAME — show it as-is.
  if (name !== "" && Number.isNaN(Number(name))) return name;
  const id = fundingId(source, fallbackId);
  return id === 1 ? "GF" : id === 2 ? "PMI" : "—";
};

const fundingChipClass = (source, fallbackId) => {
  const name = fundingName(source);
  if (name !== "" && Number.isNaN(Number(name))) {
    const lower = name.toLowerCase();
    return lower === "gf" ? "gf" : lower === "pmi" ? "pmi" : "";
  }
  const id = fundingId(source, fallbackId);
  return id === 1 ? "gf" : id === 2 ? "pmi" : "";
};

const filterOption = (input, option) =>
  String(option?.label ?? option?.children ?? "")
    .toLowerCase()
    .includes(String(input).toLowerCase());

const buildQuery = (page = currentPage.value) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("per_page", pageSize.value);
  if (searchItem.value) params.append("query", searchItem.value);
  if (fundingSource.value != null)
    params.append("funding_source", fundingSource.value);
  if (payrollStatus.value != null && payrollStatus.value !== "")
    params.append("payroll_status", payrollStatus.value);
  if (campaignFilter.value != null && campaignFilter.value !== "")
    params.append("campaign_id", campaignFilter.value);
  return params.toString();
};

const getEvents = () => {
  isLoading.value = true;
  axios
    .get(`events/all?${buildQuery()}`)
    .then((response) => {
      datatotal.value = response.data.pagination.total;
      dataSource.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const fetchCampaigns = async () => {
  campaignsLoading.value = true;
  try {
    const res = await axios.get("campaign_all");
    const json = res.data;
    const list = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];
    campaignOptions.value = list
      .filter((c) => c && c.id != null && c.name != null)
      .map((c) => ({ value: c.id, label: c.name }));
  } catch (error) {
    console.error(error);
    campaignOptions.value = [];
  } finally {
    campaignsLoading.value = false;
  }
};

const onPageChange = async (page) => {
  currentPage.value = page;
  try {
    const response = await axios.get(`events/all?${buildQuery(page)}`);
    dataSource.value = response.data.data;
    datatotal.value = response.data.pagination.total;
  } catch (error) {
    console.error(error);
  }
};

const handleFilterChange = () => {
  currentPage.value = 1;
  getEvents();
};

// ── Event lifecycle (register / trainers / start / close) ──
const activeEvent = ref({});
const isStarting = ref(false);
const isCloseModalOpen = ref(false);
const isRegisterModalOpen = ref(false);
const registrationCode = ref("");

// An event is still in the registration/attendance phase while its payroll
// has not yet been generated or paid.
const isPending = (record) => record.payroll_status === "Pending";

// The host starts the event each day. Starting is available whenever the
// event is not currently running and has not yet been submitted for payroll.
// An event MUST be linked to a budget template first — see the backend guard
// in EventsController::eventStart().
const canStart = (record) =>
  !record.status &&
  !record.payroll_submitted &&
  isPending(record) &&
  (!!record.budget_line_item_id || !!record.is_national);

// True when an otherwise ready-to-start sub-county/county event still needs a
// budget template link. National events (is_national) are exempt — they start
// and run without a budget link.
const needsBudgetLink = (record) =>
  !record.status &&
  !record.payroll_submitted &&
  isPending(record) &&
  !record.budget_line_item_id &&
  !record.is_national;

// Closing is available while the event is currently running.
const canClose = (record) => !!record.status;

const startEvent = async (record) => {
  try {
    isStarting.value = true;
    const response = await axios.get(`event_start_trigger/${record.id}`, {
      headers: authHeader(),
    });
    const data = response.data;
    if (data.status === true) {
      notification.success({
        message: "Event Started",
        description: data.message,
      });
      getEvents();
    } else {
      notification.error({
        message: "Event Not Started",
        description: data.message,
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: error?.response?.data?.message || "Unable to start event",
    });
  } finally {
    isStarting.value = false;
  }
};

const openCloseModal = (record) => {
  activeEvent.value = record;
  isCloseModalOpen.value = true;
};
const onEventClosed = () => {
  isCloseModalOpen.value = false;
  getEvents();
};

const openRegisterModal = (record) => {
  activeEvent.value = record;
  registrationCode.value = "";
  isRegisterModalOpen.value = true;
};
const closeRegisterModal = () => {
  isRegisterModalOpen.value = false;
};
const confirmRegistration = async () => {
  if (!registrationCode.value) return;
  try {
    const response = await axios.get(
      `event/${activeEvent.value.event_code}/participant/${registrationCode.value}/assign`,
      { headers: authHeader() }
    );
    if (response.status === 200) {
      notification.success({
        message: "Success",
        description: response.data.message,
      });
    } else if (response.status === 208) {
      notification.info({
        message: "Info",
        description: response.data.message,
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: confirmErrorMessage(error, "event"),
    });
  } finally {
    registrationCode.value = "";
    isRegisterModalOpen.value = false;
  }
};

// debounced-ish search
watch(
  () => searchItem.value,
  () => {
    currentPage.value = 1;
    getEvents();
  }
);

onMounted(() => {
  getEvents();
  fetchCampaigns();
});
</script>

<style lang="css">
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}
</style>

<style lang="less" scoped>
.ev-events-page {
  .ev-search {
    position: relative;
    display: flex;
    align-items: center;
    width: 280px;
    max-width: 100%;
    .search-icon {
      position: absolute;
      left: 14px;
      color: #9ab8a8;
      display: flex;
      z-index: 1;
    }
    :deep(input) {
      height: 100%;
      width: 100%;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
    }
    :deep(.ant-input-affix-wrapper) {
      display: flex;
      align-items: center;
      border-radius: 22px;
      border: 1px solid #d9f0e2;
      background: #f7fdf9;
      padding: 0 16px 0 36px;
      height: 40px;
      width: 100%;
      max-width: 100%;
    }
  }

  .ev-view-toggle {
    display: inline-flex;
    background: #f0f7f3;
    border: 1px solid #d9f0e2;
    border-radius: 22px;
    padding: 3px;
    gap: 2px;
    .ev-toggle-btn {
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
  }

  /* Create Event shortcut in the page header — matches the "Create Activity"
     button on the activities list page (same position, size and green accent). */
  .ev-create-btn {
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
  }

  .panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 12px;
    padding: 16px 18px;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }

  /* Filter panel: filters on the left, search pinned to the right */
  .filter-panel {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
  .filter-panel .ev-search {
    flex: 0 0 auto;
    margin-left: auto;
  }

  .filter-grid {
    flex: 1 1 0;
    min-width: 240px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
    :deep(.ant-select) {
      width: 100%;
    }
  }

  .events-panel {
    padding: 10px;
  }

  .ev-loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  /* funding chip */
  .ev-fund-chip {
    display: inline-flex;
    align-items: center;
    font-size: 11px;
    font-weight: 700;
    border-radius: 10px;
    padding: 2px 10px;
    &.gf {
      background: #daf4e4;
      color: #15693c;
      border: 1px solid #9ad8b4;
    }
    &.pmi {
      background: #e0ecff;
      color: #1d4ed8;
      border: 1px solid #b3ccff;
    }
  }

  .ev-submitted-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #15693c;
    background: #f3fcf6;
    border: 1px solid #cdead9;
    border-radius: 10px;
    padding: 2px 10px;
  }

  /* table */
  .ev-table-shell {
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
    }
    :deep(.ant-table-tbody > tr > td) {
      border-bottom: 1px solid #f0f7f3;
    }
    :deep(.ant-table-tbody > tr:hover > td) {
      background: #f5fbf7;
    }
    :deep(.table-actions) {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
  }

  /* ─── Uniform Action button styling ───
     All action buttons on the MassNet Events page (row + card views) share
     the same size, icon alignment and pill silhouette. Only the semantic
     `type` prop drives the accent colour (primary for view, success for
     start, danger for close, light-outlined for register) to keep the
     look consistent with the rest of the platform. */
  :deep(.ev-action-btn.ant-btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    box-shadow: none;
    transition: transform 0.12s ease, box-shadow 0.15s ease;
    a {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: inherit;
    }
    &:hover:not([disabled]) {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(15, 105, 60, 0.15);
    }
    svg {
      flex-shrink: 0;
    }
  }
  :deep(.ev-action-btn.ant-btn-primary) { /* View Event — informational blue */
    background: #2C99FF;
    border-color: #2C99FF;
    color: #fff;
    &:hover:not([disabled]) {
      background: #1a86ec;
      border-color: #1a86ec;
    }
  }
  :deep(.ev-action-btn[type='light']) { /* Register — subtle secondary */
    background: #fff;
    border-color: #d9e0e4;
    color: #2f6746;
    &:hover:not([disabled]) {
      background: #f4fbf7;
      border-color: #9ad8b4;
    }
  }

  /* card list */
  .ev-card-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 4px;
  }

  .ev-card {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
  }

  .ev-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  .ev-card-title {
    font-size: 15px;
    font-weight: 700;
    color: #15693c;
    line-height: 1.3;
  }

  .ev-card-code {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 700;
    color: #2f6746;
    background: #daf4e4;
    border: 1px solid #9ad8b4;
    border-radius: 12px;
    padding: 2px 10px;
  }

  .ev-card-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 12px;
    margin-bottom: 14px;
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

  .ev-card-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px dashed #e1efe6;
    :deep(a) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: inherit;
    }
  }
  /* Only stack the card action buttons on very narrow screens. */
  @media (max-width: 480px) {
    .ev-card-actions {
      flex-direction: column;
      align-items: stretch;
      :deep(.ev-action-btn.ant-btn) {
        width: 100%;
      }
    }
  }

  .ev-empty {
    text-align: center;
    padding: 40px 0;
    color: #7a8a82;
    font-size: 13px;
  }

  .ev-pagination {
    display: flex;
    justify-content: flex-end;
    padding: 14px 8px 6px;
  }

  /* ───────── Mobile-first tweaks ───────── */
  @media (max-width: 991px) {
    .ph-actions {
      width: 100%;
    }
    .ev-pagination {
      justify-content: center;
    }
  }

  @media (max-width: 575px) {
    .ev-search,
    .ev-view-toggle {
      width: 100%;
    }
    .ev-view-toggle {
      justify-content: center;
    }
    .filter-grid {
      grid-template-columns: 1fr;
    }
    .ev-card-meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>
