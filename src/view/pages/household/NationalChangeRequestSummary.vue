<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard">
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Household Change Requests · Overview
            </h3>
            <p class="ph-subtitle">
              {{ scopeLabel }} view — read-only summary of household change
              requests across counties and sub-counties. Approvals are handled
              by the SCMCC at sub-county level.
            </p>
          </div>
          <div class="ph-actions">
            <a-tag color="green">{{ scopeLabel }}</a-tag>
            <a-tag color="blue">Read only</a-tag>
            <a-button size="small" :loading="loading" @click="loadSummary">
              <template #icon><ReloadOutlined /></template>
              Refresh
            </a-button>
          </div>
        </div>

        <a-spin :spinning="loading">
          <!-- ───────── Filters ───────── -->
          <section class="panel">
            <div class="panel-title">Filters</div>
            <div class="filter-row">
              <a-segmented
                v-model:value="statusFilter"
                :options="statusOptions"
                @change="loadSummary"
              />
              <a-select
                v-model:value="actionFilter"
                :options="actionOptions"
                style="min-width: 220px"
                @change="loadSummary"
              />
            </div>
          </section>

          <!-- ───────── National Totals ───────── -->
          <section class="panel">
            <div class="panel-title">Request Status Summary</div>
            <div class="tile-row tile-row-4">
              <div class="tile">
                <div class="tile-icon">▦</div>
                <div class="tile-label">Total Requests</div>
                <div class="tile-value">{{ fmt(totals.total) }}</div>
                <div class="tile-sub">All change requests</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-warning">◷</div>
                <div class="tile-label">Pending</div>
                <div class="tile-value">{{ fmt(totals.pending) }}</div>
                <div class="tile-sub">Awaiting SCMCC review</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-success">✓</div>
                <div class="tile-label">Approved</div>
                <div class="tile-value">{{ fmt(totals.approved) }}</div>
                <div class="tile-sub">Applied to households</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-danger">✕</div>
                <div class="tile-label">Rejected</div>
                <div class="tile-value">{{ fmt(totals.rejected) }}</div>
                <div class="tile-sub">Returned to CHA</div>
              </div>
            </div>
          </section>

          <!-- ───────── Requests by Action Type ───────── -->
          <section class="panel">
            <div class="panel-title">Requests by Action Type</div>
            <div class="tile-row tile-row-5">
              <div class="tile">
                <div class="tile-icon accent-success">＋</div>
                <div class="tile-label">New Household</div>
                <div class="tile-value">{{ fmt(byAction.create || 0) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-danger">⊘</div>
                <div class="tile-label">Mute</div>
                <div class="tile-value">{{ fmt(byAction.mute || 0) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-info">⇄</div>
                <div class="tile-label">Transfer</div>
                <div class="tile-value">{{ fmt(byAction.transfer_in || 0) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-info">☏</div>
                <div class="tile-label">Phone Change</div>
                <div class="tile-value">{{ fmt(byAction.phone_change || 0) }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-warning">↻</div>
                <div class="tile-label">Head Change</div>
                <div class="tile-value">{{ fmt(byAction.head_change || 0) }}</div>
              </div>
            </div>
          </section>

          <!-- ───────── By County (drill-in) ───────── -->
          <section class="panel" v-if="!selectedCounty">
            <div class="panel-title">
              <span class="accent-success-text">▤</span> By County
            </div>
            <a-table
              :dataSource="counties"
              :columns="countyColumns"
              :pagination="{ pageSize: 50 }"
              row-key="county_id"
              size="small"
              class="minimal-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'county_name'">
                  <a class="drill-link" @click="drillIntoCounty(record)">
                    {{ record.county_name }}
                  </a>
                </template>
                <template v-else-if="column.key === 'total'">
                  <strong>{{ fmt(record.total) }}</strong>
                </template>
                <template v-else-if="column.key === 'pending'">
                  <span class="accent-warning-text">{{ fmt(record.pending) }}</span>
                </template>
                <template v-else-if="column.key === 'approved'">
                  <span class="accent-success-text">{{ fmt(record.approved) }}</span>
                </template>
                <template v-else-if="column.key === 'rejected'">
                  <span class="accent-danger-text">{{ fmt(record.rejected) }}</span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-button size="small" type="link" @click="drillIntoCounty(record)">
                    View sub-counties →
                  </a-button>
                </template>
              </template>
            </a-table>
          </section>

          <!-- ───────── Sub-counties drill-down ───────── -->
          <section class="panel" v-if="selectedCounty">
            <div class="panel-title with-back">
              <a-button type="link" size="small" class="back-btn" @click="clearCounty">
                ← Back to all counties
              </a-button>
              <span>
                <span class="accent-success-text">▤</span>
                Sub-counties in {{ selectedCounty.name }}
              </span>
            </div>
            <a-table
              :dataSource="subcounties"
              :columns="subcountyColumns"
              :pagination="{ pageSize: 50 }"
              row-key="subcounty_id"
              size="small"
              class="minimal-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'subcounty_name'">
                  <a class="drill-link" @click="drillIntoSubcounty(record)">
                    {{ record.subcounty_name }}
                  </a>
                </template>
                <template v-else-if="column.key === 'total'">
                  <strong>{{ fmt(record.total) }}</strong>
                </template>
                <template v-else-if="column.key === 'pending'">
                  <span class="accent-warning-text">{{ fmt(record.pending) }}</span>
                </template>
                <template v-else-if="column.key === 'approved'">
                  <span class="accent-success-text">{{ fmt(record.approved) }}</span>
                </template>
                <template v-else-if="column.key === 'rejected'">
                  <span class="accent-danger-text">{{ fmt(record.rejected) }}</span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-button size="small" type="link" @click="drillIntoSubcounty(record)">
                    View requests →
                  </a-button>
                </template>
              </template>
            </a-table>
          </section>

          <!-- ───────── Sub-county requests (read-only list) ───────── -->
          <section class="panel" v-if="selectedSubcounty">
            <div class="panel-title with-back">
              <a-button
                type="link"
                size="small"
                class="back-btn"
                @click="clearSubcounty"
              >
                ← Back to {{ selectedCounty?.name }}
              </a-button>
              <span>
                <span class="accent-success-text">▦</span>
                Requests in {{ selectedSubcounty.subcounty_name }}
                <a-tag color="blue" style="margin-left: 8px">Read only</a-tag>
              </span>
            </div>
            <a-table
              :dataSource="subcountyRequests"
              :columns="requestColumns"
              :loading="requestsLoading"
              :pagination="requestsPagination"
              row-key="id"
              size="small"
              class="minimal-table"
              @change="onRequestsTableChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action_type'">
                  <a-tag :color="actionColor(record.action_type)">
                    {{ actionLabels[record.action_type] || record.action_type }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'status'">
                  <a-tag :color="statusColor(record.status)">
                    {{ record.status }}
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'household'">
                  {{ householdLabel(record) }}
                </template>
                <template v-else-if="column.key === 'initiator'">
                  {{ record.initiator?.first_name }} {{ record.initiator?.last_name }}
                </template>
                <template v-else-if="column.key === 'created_at'">
                  {{ formatDate(record.created_at) }}
                </template>
              </template>
            </a-table>
          </section>
        </a-spin>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { notification } from "ant-design-vue";
import { ReloadOutlined } from "@ant-design/icons-vue";
import axios from "@/Axiosconfig";
import { Main } from "../../styled";
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";

const user = ref(JSON.parse(sessionStorage.getItem("user") || "null"));

const loading = ref(false);
const requestsLoading = ref(false);

const totals = ref({ total: 0, pending: 0, approved: 0, rejected: 0 });
const byAction = ref({});
const counties = ref([]);

const selectedCounty = ref(null); // { id, name }
const subcounties = ref([]);

const selectedSubcounty = ref(null);
const subcountyRequests = ref([]);
const requestsPagination = ref({ current: 1, pageSize: 50, total: 0 });

const statusFilter = ref("");
const actionFilter = ref("");

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const actionLabels = {
  create: "New HH",
  mute: "Mute",
  transfer_in: "Transfer",
  phone_change: "Phone Change",
  head_change: "Head Change",
};

const actionOptions = [
  { label: "All actions", value: "" },
  ...Object.entries(actionLabels).map(([value, label]) => ({ label, value })),
];

const scopeLabel = computed(() => {
  const lvl = Number(user.value?.user?.level_id || user.value?.level_id || 0);
  if (lvl === 1) return "National";
  if (lvl === 2) return "County";
  return "Overview";
});

const countyColumns = [
  { title: "County", key: "county_name" },
  { title: "Total", key: "total" },
  { title: "Pending", key: "pending" },
  { title: "Approved", key: "approved" },
  { title: "Rejected", key: "rejected" },
  { title: "", key: "action", align: "right" },
];

const subcountyColumns = [
  { title: "Sub-county", key: "subcounty_name" },
  { title: "Total", key: "total" },
  { title: "Pending", key: "pending" },
  { title: "Approved", key: "approved" },
  { title: "Rejected", key: "rejected" },
  { title: "", key: "action", align: "right" },
];

const requestColumns = [
  { title: "Action", key: "action_type" },
  { title: "Status", key: "status" },
  { title: "Household", key: "household" },
  { title: "Initiated by", key: "initiator" },
  { title: "Submitted", key: "created_at" },
];

const fmt = (n) => (n == null ? "0" : Number(n).toLocaleString());

const statusColor = (s) =>
  ({ pending: "orange", approved: "green", rejected: "red" }[s] || "default");

const actionColor = (a) =>
  ({
    create: "green",
    mute: "red",
    transfer_in: "blue",
    phone_change: "cyan",
    head_change: "orange",
  }[a] || "default");

const formatDate = (d) => (d ? new Date(d).toLocaleString() : "—");

const householdLabel = (r) => {
  const hh = r.household;
  if (!hh) {
    const p = r.create_payload || {};
    return [p.first_name, p.last_name].filter(Boolean).join(" ") || "—";
  }
  return [hh.first_name, hh.last_name].filter(Boolean).join(" ") || hh.id_no || "—";
};

const buildParams = () => {
  const params = {};
  if (statusFilter.value) params.status = statusFilter.value;
  if (actionFilter.value) params.action_type = actionFilter.value;
  return params;
};

const loadSummary = async () => {
  loading.value = true;
  try {
    const res = await axios.get("hh_change_requests/national/summary", {
      params: buildParams(),
    });
    const data = res?.data?.data || {};
    totals.value = data.totals || { total: 0, pending: 0, approved: 0, rejected: 0 };
    byAction.value = data.by_action || {};
    counties.value = data.counties || [];
    if (selectedCounty.value) {
      await loadCounty(selectedCounty.value.id);
    }
    if (selectedSubcounty.value) {
      await loadSubcountyRequests(selectedSubcounty.value.subcounty_id, 1);
    }
  } catch (e) {
    notification.error({
      message: "Failed to load summary",
      description: e?.response?.data?.message || e.message,
    });
  } finally {
    loading.value = false;
  }
};

const loadCounty = async (countyId) => {
  try {
    const res = await axios.get(`hh_change_requests/national/county/${countyId}`, {
      params: buildParams(),
    });
    subcounties.value = res?.data?.data?.subcounties || [];
  } catch (e) {
    notification.error({
      message: "Failed to load sub-counties",
      description: e?.response?.data?.message || e.message,
    });
  }
};

const drillIntoCounty = async (record) => {
  selectedCounty.value = { id: record.county_id, name: record.county_name };
  selectedSubcounty.value = null;
  subcountyRequests.value = [];
  await loadCounty(record.county_id);
};

const clearCounty = () => {
  selectedCounty.value = null;
  selectedSubcounty.value = null;
  subcounties.value = [];
  subcountyRequests.value = [];
};

const loadSubcountyRequests = async (subcountyId, page = 1) => {
  requestsLoading.value = true;
  try {
    const res = await axios.get(
      `hh_change_requests/national/subcounty/${subcountyId}`,
      {
        params: {
          ...buildParams(),
          page,
          per_page: requestsPagination.value.pageSize,
        },
      }
    );
    const paginator = res?.data?.data || {};
    subcountyRequests.value = paginator.data || [];
    requestsPagination.value = {
      current: paginator.current_page || 1,
      pageSize: paginator.per_page || 50,
      total: paginator.total || 0,
    };
  } catch (e) {
    notification.error({
      message: "Failed to load requests",
      description: e?.response?.data?.message || e.message,
    });
  } finally {
    requestsLoading.value = false;
  }
};

const drillIntoSubcounty = async (record) => {
  selectedSubcounty.value = record;
  await loadSubcountyRequests(record.subcounty_id, 1);
};

const clearSubcounty = () => {
  selectedSubcounty.value = null;
  subcountyRequests.value = [];
};

const onRequestsTableChange = (pagination) => {
  if (selectedSubcounty.value) {
    loadSubcountyRequests(selectedSubcounty.value.subcounty_id, pagination.current);
  }
};

onMounted(loadSummary);
</script>

<style lang="less" scoped>
/* Mirrors the green-gradient palette used by the Budget National Dashboard. */
.minimal-dashboard {
  color: #272b41;

  .page-heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;

    .ph-left {
      flex: 1;
      min-width: 240px;
    }

    .ph-title {
      margin: 0;
      font-size: 18px;
      font-weight: 800;
      color: #15693c;
      display: flex;
      align-items: center;
      gap: 8px;

      .ph-icon {
        color: #20c997;
      }
    }
    .ph-subtitle {
      margin: 4px 0 0;
      font-size: 12px;
      color: #7a8a82;
    }

    .ph-actions {
      display: flex;
      gap: 8px;
      align-items: center;
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

    &.with-back {
      justify-content: space-between;
      .back-btn {
        padding: 0;
        font-size: 12px;
        color: #4d8a63;
      }
    }
  }

  .filter-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
  }

  /* Tile grid */
  .tile-row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .tile-row-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .tile-row-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .tile-row-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
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
      box-shadow: 0 6px 14px rgba(28, 122, 72, 0.10);
      transform: translateY(-1px);
    }

    .tile-icon {
      font-size: 14px;
      color: #4d8a63;
      margin-bottom: 6px;
      line-height: 1;
      &.accent-info { color: #2c99ff; }
      &.accent-success { color: #20c997; }
      &.accent-warning { color: #fa8b0c; }
      &.accent-danger { color: #ff4d4f; }
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

  .drill-link {
    color: #15693c;
    font-weight: 600;
    cursor: pointer;
    &:hover { color: #20c997; text-decoration: underline; }
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

  .accent-success-text { color: #20c997; }
  .accent-warning-text { color: #fa8b0c; font-weight: 600; }
  .accent-danger-text { color: #ff4d4f; }
}
</style>
