<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard">
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Events M&amp;E Dashboard
            </h3>
            <p class="ph-subtitle">
              Monitoring &amp; evaluation summary of events
              {{ scopeSubtitle }}
            </p>
          </div>
          <div class="ph-actions">
            <a-tag color="green">{{ scopeLabel }}</a-tag>
            <a-button size="small" :loading="loading" @click="getDashboard">
              <reload-outlined /> Refresh
            </a-button>
          </div>
        </div>

        <div v-if="loading" class="ev-dash-loading">
          <a-spin />
        </div>

        <template v-else>
          <!-- ───────── Event Status ───────── -->
          <section class="panel">
            <div class="panel-title">Event Status</div>
            <div class="tile-row tile-row-5">
              <div class="tile">
                <div class="tile-icon">▦</div>
                <div class="tile-label">Total Events</div>
                <div class="tile-value">{{ fmt(totals.total) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-info">▶</div>
                <div class="tile-label">Active (Running)</div>
                <div class="tile-value">{{ fmt(totals.active) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-success">✓</div>
                <div class="tile-label">Closed</div>
                <div class="tile-value">{{ fmt(totals.closed) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-warning">◷</div>
                <div class="tile-label">Not Started</div>
                <div class="tile-value">{{ fmt(totals.not_started) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-info">✈</div>
                <div class="tile-label">Submitted for Payroll</div>
                <div class="tile-value">{{ fmt(totals.submitted) }}</div>
              </div>
            </div>
          </section>

          <!-- ───────── Payroll Status ───────── -->
          <section class="panel">
            <div class="panel-title">Payroll Status</div>
            <div class="tile-row tile-row-4">
              <div class="tile">
                <div class="tile-icon accent-warning">◷</div>
                <div class="tile-label">Pending Generation</div>
                <div class="tile-value">{{ fmt(payroll.pending) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-info">▤</div>
                <div class="tile-label">Generated</div>
                <div class="tile-value">{{ fmt(payroll.generated) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-success">$</div>
                <div class="tile-label">Paid</div>
                <div class="tile-value">{{ fmt(payroll.paid) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon">◎</div>
                <div class="tile-label">Payroll Completion</div>
                <div class="tile-value">{{ payrollCompletion.toFixed(1) }}%</div>
                <div class="tile-sub">
                  {{ fmt(payroll.paid) }} of {{ fmt(totals.total) }} paid
                </div>
              </div>
            </div>
          </section>

          <!-- ───────── Participants ───────── -->
          <section class="panel">
            <div class="panel-title">Participant Confirmation</div>
            <div class="tile-row tile-row-4">
              <div class="tile">
                <div class="tile-icon accent-success">✓</div>
                <div class="tile-label">Confirmed</div>
                <div class="tile-value">{{ fmt(participants.confirmed) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-warning">◷</div>
                <div class="tile-label">Pending Confirmation</div>
                <div class="tile-value">{{ fmt(participants.pending) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon">👥</div>
                <div class="tile-label">Total Registered</div>
                <div class="tile-value">{{ fmt(totalParticipants) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon">◉</div>
                <div class="tile-label">Confirmation Rate</div>
                <div class="tile-value">{{ confirmationRate.toFixed(1) }}%</div>
              </div>
            </div>
          </section>

          <!-- ───────── County / Sub-County breakdown ───────── -->
          <section class="panel">
            <div class="panel-title">Breakdown by County / Sub-County</div>
            <a-table
              :dataSource="breakdown"
              :columns="breakdownColumns"
              :pagination="breakdown.length > 15 ? { pageSize: 15 } : false"
              row-key="sub_county"
              size="small"
              class="minimal-table"
            >
              <template #bodyCell="{ column, record }">
                <span v-if="column.key === 'total'">{{ fmt(record.total) }}</span>
                <span v-else-if="column.key === 'active'">{{ fmt(record.active) }}</span>
                <span v-else-if="column.key === 'closed'">{{ fmt(record.closed) }}</span>
                <span v-else-if="column.key === 'not_started'">{{ fmt(record.not_started) }}</span>
                <span v-else-if="column.key === 'submitted'">{{ fmt(record.submitted) }}</span>
              </template>
            </a-table>
            <div v-if="!breakdown.length" class="empty-state">
              No events found for this scope.
            </div>
          </section>

          <!-- ───────── Events with Pending LSO/LPO ───────── -->
          <section class="panel">
            <div class="panel-title">
              <sdFeatherIcons type="alert-triangle" size="14" />
              Events with Pending LSO/LPO
              <span class="panel-badge">
                {{ fmt(filteredPendingLsoEvents.length) }}
                <span
                  v-if="filteredPendingLsoEvents.length !== pendingLsoTotal"
                  class="panel-badge-sub"
                >
                  / {{ fmt(pendingLsoTotal) }}
                </span>
              </span>
            </div>
            <p class="panel-subtitle">
              These events do not yet have an LSO/LPO attached. Their hosts
              cannot submit them for payroll until the LSO/LPO is uploaded.
            </p>

            <!-- Filter / search toolbar -->
            <div class="pending-lso-toolbar">
              <div class="pending-lso-filters">
                <a-select
                  v-model:value="pendingLsoFilters.county"
                  placeholder="All counties"
                  allow-clear
                  show-search
                  option-filter-prop="label"
                  class="pending-lso-select"
                  @change="onCountyFilterChange"
                >
                  <a-select-option
                    v-for="c in countyFilterOptions"
                    :key="c"
                    :value="c"
                    :label="c"
                  >
                    {{ c }}
                  </a-select-option>
                </a-select>
                <a-select
                  v-model:value="pendingLsoFilters.subCounty"
                  :placeholder="
                    pendingLsoFilters.county
                      ? 'All sub-counties'
                      : 'Select a county first'
                  "
                  :disabled="!pendingLsoFilters.county"
                  allow-clear
                  show-search
                  option-filter-prop="label"
                  class="pending-lso-select"
                >
                  <a-select-option
                    v-for="s in subCountyFilterOptions"
                    :key="s"
                    :value="s"
                    :label="s"
                  >
                    {{ s }}
                  </a-select-option>
                </a-select>
                <a-input
                  v-model:value="pendingLsoFilters.search"
                  placeholder="Search by event name or code"
                  allow-clear
                  class="pending-lso-search"
                >
                  <template #prefix>
                    <sdFeatherIcons type="search" size="14" />
                  </template>
                </a-input>
              </div>
              <a-button
                v-if="hasPendingLsoFilters"
                size="small"
                @click="resetPendingLsoFilters"
              >
                <sdFeatherIcons type="x" size="12" /> Clear filters
              </a-button>
            </div>

            <a-table
              :dataSource="filteredPendingLsoEvents"
              :columns="pendingLsoColumns"
              :pagination="
                filteredPendingLsoEvents.length > 15
                  ? { pageSize: 15 }
                  : false
              "
              row-key="id"
              size="small"
              class="minimal-table"
            >
              <template #bodyCell="{ column, record }">
                <span v-if="column.key === 'event_code'">
                  <a-tag color="orange">{{ record.event_code || "—" }}</a-tag>
                </span>
                <span v-else-if="column.key === 'venue'">
                  {{ record.venue || "—" }}
                </span>
                <span v-else-if="column.key === 'event_host'">
                  {{ record.event_host || "—" }}
                </span>
                <span v-else-if="column.key === 'start_date'">
                  {{ record.start_date || "Not started" }}
                </span>
                <span v-else-if="column.key === 'number_of_days'">
                  {{ fmt(record.number_of_days) }}
                </span>
              </template>
            </a-table>
            <div v-if="!pendingLsoEvents.length" class="empty-state">
              All events in this scope have an LSO/LPO attached.
            </div>
            <div
              v-else-if="!filteredPendingLsoEvents.length"
              class="empty-state"
            >
              No events match the current filters.
            </div>
          </section>
        </template>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { notification } from "ant-design-vue";
import { ReloadOutlined } from "@ant-design/icons-vue";
import axios from "@/Axiosconfig";
import authHeader from "../../../services/auth-header";
import { Main } from "../../styled";
import { RecordViewWrapper } from "./style";
import { BudgetPageWrapper } from "../budget/style";

const breakdownColumns = [
  { title: "County", dataIndex: "county", key: "county" },
  { title: "Sub-County", dataIndex: "sub_county", key: "sub_county" },
  { title: "Total", dataIndex: "total", key: "total" },
  { title: "Active", dataIndex: "active", key: "active" },
  { title: "Closed", dataIndex: "closed", key: "closed" },
  { title: "Not Started", dataIndex: "not_started", key: "not_started" },
  { title: "Submitted", dataIndex: "submitted", key: "submitted" },
];

// Column definitions for the "Events with Pending LSO/LPO" table. The
// backend supplies the shape of each row.
const pendingLsoColumns = [
  { title: "Event Code", dataIndex: "event_code", key: "event_code" },
  { title: "Event Name", dataIndex: "name", key: "name" },
  { title: "Host", dataIndex: "event_host", key: "event_host" },
  { title: "Venue", dataIndex: "venue", key: "venue" },
  { title: "County", dataIndex: "county", key: "county" },
  { title: "Sub-County", dataIndex: "sub_county", key: "sub_county" },
  { title: "Start Date", dataIndex: "start_date", key: "start_date" },
  { title: "Days", dataIndex: "number_of_days", key: "number_of_days" },
];

const loading = ref(false);
const totals = ref({
  total: 0,
  active: 0,
  closed: 0,
  not_started: 0,
  submitted: 0,
});
const payroll = ref({ pending: 0, generated: 0, paid: 0 });
const participants = ref({ confirmed: 0, pending: 0 });
const breakdown = ref([]);
const scope = ref({ level_id: null, is_national: false });
// Events pending LSO/LPO upload (loaded from the dashboard endpoint).
const pendingLsoEvents = ref([]);
const pendingLsoTotal = ref(0);

// ── Pending LSO/LPO filters ────────────────────────────────────────────
// County/Sub-County drill-down + free-text search over event name/code.
// The dropdown options are derived from the data returned by the backend
// so the user can only pick from combinations that actually appear.
const pendingLsoFilters = reactive({
  county: null,
  subCounty: null,
  search: "",
});

// Distinct, sorted list of counties present in the pending-LSO events.
const countyFilterOptions = computed(() => {
  const set = new Set();
  for (const e of pendingLsoEvents.value) {
    if (e.county) set.add(e.county);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

// Distinct, sorted list of sub-counties inside the currently selected
// county. Returns an empty array when no county is selected so the
// second dropdown starts disabled.
const subCountyFilterOptions = computed(() => {
  if (!pendingLsoFilters.county) return [];
  const set = new Set();
  for (const e of pendingLsoEvents.value) {
    if (e.county === pendingLsoFilters.county && e.sub_county) {
      set.add(e.sub_county);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});

// Applies County → Sub-County → search-term filters in that order.
const filteredPendingLsoEvents = computed(() => {
  const term = String(pendingLsoFilters.search || "").trim().toLowerCase();
  return pendingLsoEvents.value.filter((e) => {
    if (
      pendingLsoFilters.county &&
      e.county !== pendingLsoFilters.county
    ) {
      return false;
    }
    if (
      pendingLsoFilters.subCounty &&
      e.sub_county !== pendingLsoFilters.subCounty
    ) {
      return false;
    }
    if (term) {
      const name = String(e.name || "").toLowerCase();
      const code = String(e.event_code || "").toLowerCase();
      if (!name.includes(term) && !code.includes(term)) {
        return false;
      }
    }
    return true;
  });
});

const hasPendingLsoFilters = computed(
  () =>
    !!pendingLsoFilters.county ||
    !!pendingLsoFilters.subCounty ||
    !!String(pendingLsoFilters.search || "").trim()
);

// Reset the sub-county whenever the county changes; the old sub-county
// value would otherwise no longer belong to the newly selected county.
const onCountyFilterChange = () => {
  pendingLsoFilters.subCounty = null;
};

const resetPendingLsoFilters = () => {
  pendingLsoFilters.county = null;
  pendingLsoFilters.subCounty = null;
  pendingLsoFilters.search = "";
};

const fmt = (n) => Number(n || 0).toLocaleString();

const totalParticipants = computed(
  () => (participants.value.confirmed || 0) + (participants.value.pending || 0)
);
const confirmationRate = computed(() =>
  totalParticipants.value
    ? (participants.value.confirmed / totalParticipants.value) * 100
    : 0
);
const payrollCompletion = computed(() =>
  totals.value.total ? (payroll.value.paid / totals.value.total) * 100 : 0
);

const scopeLabel = computed(() => {
  if (scope.value.is_national) return "National";
  if (scope.value.level_id === 2) return "County";
  if (scope.value.level_id === 3) return "Sub-County";
  return "Scoped";
});
const scopeSubtitle = computed(() => {
  if (scope.value.is_national) return "across all counties and sub-counties";
  if (scope.value.level_id === 2) return "across your county and its sub-counties";
  if (scope.value.level_id === 3) return "within your sub-county";
  return "within your assigned location";
});

const getDashboard = async () => {
  loading.value = true;
  try {
    const response = await axios.get("events/dashboard", {
      headers: authHeader(),
    });
    const data = response.data.data;
    totals.value = data.totals;
    payroll.value = data.payroll;
    participants.value = data.participants;
    breakdown.value = data.breakdown || [];
    scope.value = data.scope || { level_id: null, is_national: false };
    const pendingLso = data.pending_lso || { events: [], total: 0 };
    pendingLsoEvents.value = pendingLso.events || [];
    pendingLsoTotal.value = pendingLso.total || 0;
    // Drop a filter that no longer matches any row after the refresh so the
    // table doesn't stay hidden behind a stale value.
    if (
      pendingLsoFilters.county &&
      !countyFilterOptions.value.includes(pendingLsoFilters.county)
    ) {
      pendingLsoFilters.county = null;
      pendingLsoFilters.subCounty = null;
    }
    if (
      pendingLsoFilters.subCounty &&
      !subCountyFilterOptions.value.includes(pendingLsoFilters.subCounty)
    ) {
      pendingLsoFilters.subCounty = null;
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description:
        error?.response?.data?.message || "Unable to load events dashboard",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(getDashboard);
</script>

<style lang="less" scoped>
/* Green-gradient palette aligned with the Budget dashboards */
.minimal-dashboard {
  color: #272b41;

  .ev-dash-loading {
    display: flex;
    justify-content: center;
    padding: 60px 0;
  }

  .page-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin: 4px 2px 18px;
    .ph-left {
      min-width: 0;
    }
    .ph-title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1f2437;
      display: flex;
      align-items: center;
      gap: 8px;
      .ph-icon {
        color: #1f2437;
        font-size: 18px;
      }
    }
    .ph-subtitle {
      margin: 4px 0 0;
      font-size: 12px;
      color: #8a90a6;
    }
    .ph-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
  }

  .panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 10px;
    padding: 16px 20px 18px;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }
  .panel-title {
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 6px;

    .panel-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 20px;
      padding: 0 8px;
      border-radius: 999px;
      background: #fff4e0;
      border: 1px solid #fbd8a1;
      color: #b26a00;
      font-size: 11px;
      font-weight: 700;
      margin-left: 4px;
      gap: 2px;

      .panel-badge-sub {
        font-weight: 500;
        opacity: 0.75;
      }
    }
  }
  .panel-subtitle {
    margin: -6px 0 12px;
    font-size: 12px;
    color: #7a8a82;
    line-height: 1.4;
  }

  /* Filter toolbar above the "Events with Pending LSO/LPO" table */
  .pending-lso-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .pending-lso-filters {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    flex: 1 1 auto;
    min-width: 0;
  }
  .pending-lso-select {
    min-width: 180px;
    max-width: 240px;
  }
  .pending-lso-search {
    min-width: 220px;
    max-width: 320px;
    flex: 1 1 220px;
  }
  @media (max-width: 720px) {
    .pending-lso-select,
    .pending-lso-search {
      min-width: 0;
      max-width: none;
      width: 100%;
    }
  }

  /* Tile grid */
  .tile-row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .tile-row-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .tile-row-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .tile-row-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
  @media (max-width: 1100px) {
    .tile-row-4,
    .tile-row-5,
    .tile-row-6 {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
  }

  .tile {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 8px;
    padding: 14px 16px;
    text-align: center;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
    &:hover {
      border-color: #9ad8b4;
      box-shadow: 0 6px 14px rgba(28, 122, 72, 0.1);
      transform: translateY(-1px);
    }

    .tile-icon {
      font-size: 14px;
      color: #4d8a63;
      margin-bottom: 6px;
      line-height: 1;
      &.accent-info {
        color: #2c99ff;
      }
      &.accent-success {
        color: #20c997;
      }
      &.accent-warning {
        color: #fa8b0c;
      }
    }
    .tile-label {
      font-size: 11px;
      color: #7a8a82;
      margin-bottom: 6px;
      line-height: 1.2;
    }
    .tile-value {
      font-size: 22px;
      font-weight: 800;
      color: #15693c;
      line-height: 1.1;
    }
    .tile-sub {
      margin-top: 6px;
      font-size: 11px;
      color: #7a8a82;
    }
  }

  /* Tables – green-tinted minimal */
  :deep(.minimal-table) {
    .ant-table {
      background: transparent;
    }
    .ant-table-thead > tr > th {
      background: #f4fbf6;
      border-bottom: 1px solid #d9f0e2;
      color: #2f6746;
      font-weight: 700;
      font-size: 11px;
      text-transform: none;
    }
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid #eaf4ee;
      font-size: 12px;
      color: #1f2437;
    }
    .ant-table-tbody > tr:hover > td {
      background: #f5fbf7;
    }
    .ant-table-placeholder {
      color: #9ab5a4;
    }
  }

  .empty-state {
    text-align: center;
    color: #8a9d93;
    padding: 24px 0;
    font-size: 13px;
  }
}
</style>

