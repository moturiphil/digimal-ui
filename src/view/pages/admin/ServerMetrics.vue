<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="sm-page">
        <!-- Heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <sdFeatherIcons type="activity" size="18" /> Server Metrics
            </h3>
            <p class="ph-subtitle">
              Request performance &amp; resource usage · super-admin only
            </p>
          </div>
          <div class="ph-actions" v-if="isSuperAdmin">
            <sdButton type="light" size="small" @click="openPulse">
              <sdFeatherIcons type="bar-chart-2" size="14" /> &nbsp;Pulse Dashboard
            </sdButton>
            <sdButton
              v-if="report"
              type="primary"
              size="small"
              :disabled="loading"
              @click="loadReport"
            >
              <sdFeatherIcons type="refresh-cw" size="14" /> &nbsp;Refresh
            </sdButton>
          </div>
        </header>

        <!-- Not authorised -->
        <a-alert
          v-if="!isSuperAdmin"
          type="error"
          show-icon
          message="Access denied"
          description="Only the super administrator can view server metrics."
        />

        <template v-else>
          <!-- Controls -->
          <div class="sm-controls">
            <span class="sm-window-label">Window</span>
            <a-select v-model:value="hours" style="width: 180px" @change="loadReport">
              <a-select-option v-for="w in windows" :key="w.value" :value="w.value">
                {{ w.label }}
              </a-select-option>
            </a-select>
            <span v-if="report" class="sm-range">
              {{ report.window.since }} → {{ report.window.until }}
            </span>
          </div>

          <div v-if="loading" class="sm-loading"><a-spin /></div>

          <template v-else-if="report">
            <!-- Totals -->
            <div class="sm-cards">
              <div class="sm-card"><span class="lbl">Requests</span><span class="val">{{ report.totals.requests }}</span></div>
              <div class="sm-card"><span class="lbl">Errors</span><span class="val">{{ report.totals.errors }}</span></div>
              <div class="sm-card"><span class="lbl">Error rate</span><span class="val">{{ report.totals.error_rate_pct }}%</span></div>
              <div class="sm-card"><span class="lbl">Avg</span><span class="val">{{ report.totals.avg_ms }} ms</span></div>
              <div class="sm-card"><span class="lbl">p95</span><span class="val">{{ report.totals.p95_ms }} ms</span></div>
              <div class="sm-card"><span class="lbl">p99</span><span class="val">{{ report.totals.p99_ms }} ms</span></div>
              <div class="sm-card"><span class="lbl">Max</span><span class="val">{{ report.totals.max_ms }} ms</span></div>
            </div>

            <!-- Server resources -->
            <h4 class="sm-section">Server resources</h4>
            <div class="sm-cards">
              <div class="sm-card"><span class="lbl">Load 1m</span><span class="val">{{ fmt(report.server.load_avg['1m']) }}</span></div>
              <div class="sm-card"><span class="lbl">Load 5m</span><span class="val">{{ fmt(report.server.load_avg['5m']) }}</span></div>
              <div class="sm-card"><span class="lbl">Load 15m</span><span class="val">{{ fmt(report.server.load_avg['15m']) }}</span></div>
              <div class="sm-card"><span class="lbl">CPU cores</span><span class="val">{{ report.server.cpu_cores ?? '—' }}</span></div>
              <div class="sm-card"><span class="lbl">PHP mem</span><span class="val">{{ report.server.php_memory_usage_mb }} MB</span></div>
              <div class="sm-card" v-if="report.server.system_memory">
                <span class="lbl">RAM used</span>
                <span class="val">{{ report.server.system_memory.used_pct }}%</span>
              </div>
            </div>

            <!-- Endpoints -->
            <h4 class="sm-section">Endpoints</h4>
            <TableWrapper class="table-responsive">
              <a-table
                :dataSource="report.endpoints"
                :columns="endpointColumns"
                :pagination="{ pageSize: 10, showSizeChanger: true }"
                size="small"
                row-key="endpoint"
              />
            </TableWrapper>

            <!-- Slowest -->
            <h4 class="sm-section">Slowest requests</h4>
            <TableWrapper class="table-responsive">
              <a-table
                :dataSource="report.slowest_requests"
                :columns="slowestColumns"
                :pagination="false"
                size="small"
                row-key="at"
              />
            </TableWrapper>

            <!-- Usage -->
            <div class="sm-two-col">
              <div>
                <h4 class="sm-section">Usage by user</h4>
                <TableWrapper class="table-responsive">
                  <a-table
                    :dataSource="report.usage_by_user"
                    :columns="usageUserColumns"
                    :pagination="false"
                    size="small"
                    row-key="user_id"
                  />
                </TableWrapper>
              </div>
              <div>
                <h4 class="sm-section">Usage by role</h4>
                <TableWrapper class="table-responsive">
                  <a-table
                    :dataSource="report.usage_by_role"
                    :columns="usageRoleColumns"
                    :pagination="false"
                    size="small"
                    row-key="role_id"
                  />
                </TableWrapper>
              </div>
            </div>
          </template>
        </template>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { notification } from "ant-design-vue";
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";
import { Main, TableWrapper } from "../../styled";
import adminMetrics from "@/services/admin-metrics.service";

const SUPER_ADMIN_ROLE_ID = 53;

const isSuperAdmin = ref(false);
const loading = ref(false);
const hours = ref(24);
const report = ref(null);

const windows = [
  { value: 1, label: "Last hour" },
  { value: 6, label: "Last 6 hours" },
  { value: 24, label: "Last 24 hours" },
  { value: 72, label: "Last 3 days" },
  { value: 168, label: "Last 7 days" },
  { value: 720, label: "Last 30 days" },
];

const pulseUrl =
  (process.env.VUE_APP_BASE_URL || "").replace(/\/api\/?$/, "") + "/pulse-login";

const fmt = (v) => (v === null || v === undefined ? "—" : v);

const endpointColumns = [
  { title: "Endpoint", dataIndex: "endpoint", key: "endpoint" },
  { title: "Method", dataIndex: "method", key: "method", width: 80 },
  {
    title: "Requests",
    dataIndex: "request_count",
    key: "request_count",
    sorter: (a, b) => a.request_count - b.request_count,
    defaultSortOrder: "descend",
  },
  {
    title: "Err %",
    dataIndex: "error_rate_pct",
    key: "error_rate_pct",
    sorter: (a, b) => a.error_rate_pct - b.error_rate_pct,
  },
  { title: "Avg ms", dataIndex: "avg_ms", key: "avg_ms", sorter: (a, b) => a.avg_ms - b.avg_ms },
  { title: "p95 ms", dataIndex: "p95_ms", key: "p95_ms", sorter: (a, b) => a.p95_ms - b.p95_ms },
  { title: "p99 ms", dataIndex: "p99_ms", key: "p99_ms", sorter: (a, b) => a.p99_ms - b.p99_ms },
  { title: "Max ms", dataIndex: "max_ms", key: "max_ms", sorter: (a, b) => a.max_ms - b.max_ms },
  { title: "Avg mem kb", dataIndex: "avg_peak_mem_kb", key: "avg_peak_mem_kb" },
];

const slowestColumns = [
  { title: "Endpoint", dataIndex: "endpoint", key: "endpoint" },
  { title: "Method", dataIndex: "method", key: "method", width: 80 },
  { title: "Status", dataIndex: "status_code", key: "status_code", width: 80 },
  { title: "Duration ms", dataIndex: "duration_ms", key: "duration_ms" },
  { title: "Peak mem kb", dataIndex: "peak_mem_kb", key: "peak_mem_kb" },
  { title: "User", dataIndex: "user_id", key: "user_id", width: 80 },
  { title: "Role", dataIndex: "role_id", key: "role_id", width: 80 },
  { title: "At", dataIndex: "at", key: "at" },
];

const usageUserColumns = [
  { title: "User ID", dataIndex: "user_id", key: "user_id" },
  { title: "Requests", dataIndex: "request_count", key: "request_count" },
];

const usageRoleColumns = [
  { title: "Role ID", dataIndex: "role_id", key: "role_id" },
  { title: "Requests", dataIndex: "request_count", key: "request_count" },
];

const loadReport = async () => {
  if (!isSuperAdmin.value) return;
  loading.value = true;
  try {
    const { data } = await adminMetrics.report({ hours: hours.value, top: 10 });
    report.value = data.data;
  } catch (e) {
    notification.error({
      message: "Could not load metrics",
      description: e?.response?.data?.message || e.message,
    });
  } finally {
    loading.value = false;
  }
};

const openPulse = () => window.open(pulseUrl, "_blank");

onMounted(() => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  isSuperAdmin.value = !!user && user.user?.role_id === SUPER_ADMIN_ROLE_ID;
  if (isSuperAdmin.value) loadReport();
});
</script>

<style lang="less" scoped>
.sm-page { padding: 4px 2px; }
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
}
.ph-title { margin: 0; font-size: 17px; font-weight: 800; color: #1f2437; display: flex; align-items: center; gap: 8px; }
.ph-subtitle { margin: 4px 0 0; font-size: 12px; color: #7a8a82; }
.ph-actions { display: flex; gap: 8px; }
.sm-loading { padding: 40px 0; text-align: center; }
.sm-controls { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.sm-window-label { font-size: 12px; font-weight: 700; color: #1f2437; }
.sm-range { font-size: 12px; color: #7a8a82; }
.sm-section { margin: 22px 0 10px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .4px; color: #2f6746; }
.sm-cards { display: flex; flex-wrap: wrap; gap: 12px; }
.sm-card {
  flex: 1 1 120px;
  min-width: 120px;
  background: #fff;
  border: 1px solid #eef1f4;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sm-card .lbl { font-size: 11px; color: #7a8a82; text-transform: uppercase; letter-spacing: .3px; }
.sm-card .val { font-size: 18px; font-weight: 800; color: #1f2437; }
.sm-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
@media (max-width: 767px) {
  .sm-two-col { grid-template-columns: 1fr; }
}
</style>
