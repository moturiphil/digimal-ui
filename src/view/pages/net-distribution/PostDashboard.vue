<template>
  <div class="post-dashboard">
    <header class="pd-head">
      <div>
        <h3 class="pd-title">Today at {{ post_name }}</h3>
        <p class="pd-sub">{{ todayLabel }}</p>
      </div>
    </header>

    <div v-if="isLoading" class="pd-loading"><a-spin /></div>

    <template v-else>
      <!-- KPI grid -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">Distribution Day</span>
          <span class="kpi-value">{{
            summary.distribution_day ? `Day ${summary.distribution_day}` : "—"
          }}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">No. of Bales</span>
          <span class="kpi-value">{{ summary.bales }}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">No. of Loose Nets</span>
          <span class="kpi-value">{{ summary.loose_nets }}</span>
          <span v-if="summary.today_variance_loose" class="kpi-foot">
            System {{ systemLoose }}
            {{ summary.today_variance_loose >= 0 ? "+" : "−" }}
            {{ Math.abs(summary.today_variance_loose) }} today's variance
          </span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label"
            >Total Nets (loose + bales × {{ summary.nets_per_bale }})</span
          >
          <span class="kpi-value">{{ summary.total_nets }}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Nets Issued Today</span>
          <span class="kpi-value">{{ summary.nets_issued_today }}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Cumulative Nets Issued</span>
          <span class="kpi-value">{{ summary.cumulative_nets_issued }}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Bales Opened / Received</span>
          <span class="kpi-value"
            >{{ summary.bales_opened }} / {{ summary.bales_received }}</span
          >
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Day Status</span>
          <span class="kpi-value">
            <a-tag :color="statusColor(summary.day_status)">{{
              summary.day_status
            }}</a-tag>
          </span>
        </div>
      </div>

      <!-- Nets unaccounted for -->
      <section v-if="summary.variances && summary.variances.length" class="panel">
        <h3 class="panel-title danger">
          <sdFeatherIcons type="alert-triangle" size="18" /> &nbsp;Nets
          unaccounted for
        </h3>

        <!-- Plain-language explainer -->
        <p class="var-explain">
          A variance is recorded whenever a post's <strong>physical count</strong>
          (the nets actually on the ground) differs from the
          <strong>system-expected</strong> figure at an opening or closing
          balance. A
          <span class="chip neg-chip">shortage (−)</span>
          means fewer nets were counted than expected;
          a <span class="chip pos-chip">surplus (+)</span>
          means more were found.
        </p>

        <!-- Headline: total nets unaccounted -->
        <div class="var-grid">
          <div class="var-cell var-cell--lead">
            <span class="var-label">Total Nets Unaccounted</span>
            <span class="var-value" :class="signClass(totalNetVariance)">
              {{ totalNetVariance > 0 ? "+" : "" }}{{ totalNetVariance }}
            </span>
            <span class="var-foot">
              {{ varianceDirection(totalNetVariance) }} across
              {{ summary.variances.length }}
              balance{{ summary.variances.length === 1 ? "" : "s" }}
            </span>
          </div>
          <div class="var-cell">
            <span class="var-label">Variance in Bales</span>
            <span class="var-value" :class="signClass(summary.total_variance_bales)">
              {{ summary.total_variance_bales > 0 ? "+" : ""
              }}{{ summary.total_variance_bales }}
            </span>
            <span class="var-foot"
              >≈ {{ Math.abs(summary.total_variance_bales) * summary.nets_per_bale }}
              nets</span
            >
          </div>
          <div class="var-cell">
            <span class="var-label">Variance in Loose Nets</span>
            <span class="var-value" :class="signClass(summary.total_variance_loose)">
              {{ summary.total_variance_loose > 0 ? "+" : ""
              }}{{ summary.total_variance_loose }}
            </span>
            <span class="var-foot">loose pieces</span>
          </div>
        </div>

        <!-- How the figure is derived -->
        <div class="var-formula">
          <span class="vf-label">How this is calculated</span>
          <span class="vf-eq">
            Physical counted
            <strong>{{ summary.loose_nets }}</strong> loose
            <span class="vf-op">−</span>
            System expected
            <strong>{{ systemLoose }}</strong> loose
            <span class="vf-op">=</span>
            <strong :class="signClass(summary.today_variance_loose)">
              {{ summary.today_variance_loose > 0 ? "+" : ""
              }}{{ summary.today_variance_loose }}
            </strong>
            today's loose variance
          </span>
        </div>

        <p class="var-table-cap">Where each variance came from</p>
        <TableWrapper class="table-responsive">
          <a-table
            :dataSource="summary.variances"
            :columns="varianceColumns"
            :pagination="false"
            size="small"
            row-key="date"
          >
            <template #source="{ record }">
              <td>
                <a-tag :color="record.type === 'closing' ? 'volcano' : 'geekblue'">
                  {{ record.type === "closing" ? "Closing count" : "Opening count" }}
                </a-tag>
              </td>
            </template>
            <template #vbales="{ record }">
              <td>
                <span :class="record.variance_bales !== 0 ? signClass(record.variance_bales) + ' bold' : 'muted'">
                  {{ record.variance_bales > 0 ? "+" : ""
                  }}{{ record.variance_bales }}
                </span>
              </td>
            </template>
            <template #vloose="{ record }">
              <td>
                <span :class="record.variance_loose !== 0 ? signClass(record.variance_loose) + ' bold' : 'muted'">
                  {{ record.variance_loose > 0 ? "+" : ""
                  }}{{ record.variance_loose }}
                </span>
              </td>
            </template>
            <template #netEquiv="{ record }">
              <td>
                <span :class="netEquiv(record) !== 0 ? signClass(netEquiv(record)) + ' bold' : 'muted'">
                  {{ netEquiv(record) > 0 ? "+" : "" }}{{ netEquiv(record) }}
                </span>
              </td>
            </template>
            <template #direction="{ record }">
              <td>
                <a-tag
                  v-if="netEquiv(record) !== 0"
                  :color="netEquiv(record) < 0 ? 'red' : 'green'"
                >
                  {{ varianceDirection(netEquiv(record)) }}
                </a-tag>
                <span v-else class="muted">Balanced</span>
              </td>
            </template>
            <template #reason="{ record }">
              <td>
                <span v-if="record.reason">{{ record.reason }}</span>
                <em v-else class="muted reason-warn">⚠ No reason recorded</em>
              </td>
            </template>
          </a-table>
        </TableWrapper>
      </section>


      <!-- Post Worker Summary chart + table -->
      <!-- Worker + Distribution summary side by side -->
      <div class="dash-row">
        <section class="panel bdg-panel">
          <div class="bdg-panel-title">▦ Post Worker Summary</div>
          <template v-if="workerChartData.length">
            <div
              v-for="w in workerChartData"
              :key="w.name"
              class="split-block"
            >
              <div class="split-row">
                <div class="split-label">{{ w.name }}</div>
                <div class="split-value">
                  {{ w.nets }}
                  <span class="split-percent">nets</span>
                </div>
              </div>
              <a-progress
                :percent="workerPercent(w.nets)"
                :show-info="false"
                stroke-color="#20C997"
                trail-color="#e1efe6"
                :stroke-width="6"
              />
            </div>
            <div class="grand-total">
              <span>Total nets distributed</span>
              <strong>{{ workerTotals.total_nets }}</strong>
            </div>
            <div class="grand-total no-border">
              <span>Total households served</span>
              <strong>{{ workerTotals.total_count }}</strong>
            </div>
          </template>
          <p v-else class="muted center">No worker distribution data yet.</p>

          <TableWrapper class="table-responsive worker-table">
            <a-table
              :dataSource="postWorkers"
              :columns="workerColumns"
              :pagination="{ pageSize: 10, showSizeChanger: true }"
              size="small"
              row-key="rowKey"
            />
          </TableWrapper>
        </section>

        <!-- Distribution Summary in budget style -->
        <section class="panel bdg-panel">
          <div class="bdg-panel-title">⌂ Distribution Summary</div>

          <!-- Net flow progress bars -->
          <div class="split-block">
            <div class="split-row">
              <div class="split-label">Nets Distributed</div>
              <div class="split-value">
                {{ distSummary.nets_distributed || 0 }}
                <span class="split-percent">of {{ distSummary.nets_received || 0 }} received</span>
              </div>
            </div>
            <a-progress
              :percent="pct(distSummary.nets_distributed, distSummary.nets_received)"
              :show-info="false"
              stroke-color="#20C997"
              trail-color="#e1efe6"
              :stroke-width="6"
            />
          </div>
          <div class="split-block">
            <div class="split-row">
              <div class="split-label">Households Served</div>
              <div class="split-value">
                {{ distSummary.households_served || 0 }}
                <span class="split-percent">of {{ distSummary.households_registered || 0 }} registered</span>
              </div>
            </div>
            <a-progress
              :percent="pct(distSummary.households_served, distSummary.households_registered)"
              :show-info="false"
              stroke-color="#0f9d58"
              trail-color="#e1efe6"
              :stroke-width="6"
            />
          </div>

          <!-- Metric list rows -->
          <div class="list-row">
            <span class="list-label">Nets Ordered</span>
            <span class="list-value">{{ distSummary.nets_ordered || 0 }}</span>
          </div>
          <div class="list-row">
            <span class="list-label">Nets Supplied</span>
            <span class="list-value">{{ distSummary.nets_supplied || 0 }}</span>
          </div>
          <div class="list-row">
            <span class="list-label">Nets Received</span>
            <span class="list-value">{{ distSummary.nets_received || 0 }}</span>
          </div>
          <div class="list-row">
            <span class="list-label">Nets Balance</span>
            <span class="list-value">{{ distSummary.undistributed_nets_balance || 0 }}</span>
          </div>
          <div class="list-row">
            <span class="list-label">Unserved Households</span>
            <span class="list-value">{{ distSummary.unserved_households || 0 }}</span>
          </div>
          <div class="grand-total">
            <span>Nets Distributed</span>
            <strong>{{ distSummary.nets_distributed || 0 }}</strong>
          </div>
        </section>
      </div>

      <!-- Household collection summary -->
      <section class="panel">
        <div class="hh-head">
          <h3 class="panel-title">Household Distribution</h3>
          <a-input
            v-model:value="hhSearch"
            placeholder="Search households by name or phone…"
            allow-clear
            class="hh-search"
          >
            <template #prefix>
              <sdFeatherIcons type="search" size="14" />
            </template>
          </a-input>
        </div>
        <div class="hh-summary">
          <div class="hh-stat pending">
            <div class="hh-stat-icon">
              <sdFeatherIcons type="clock" size="20" />
            </div>
            <div class="hh-stat-body">
              <span class="hh-stat-value">{{ pendingCount }}</span>
              <span class="hh-stat-label">Pending Distribution</span>
            </div>
          </div>
          <div class="hh-stat served">
            <div class="hh-stat-icon">
              <sdFeatherIcons type="check-circle" size="20" />
            </div>
            <div class="hh-stat-body">
              <span class="hh-stat-value">{{ servedCount }}</span>
              <span class="hh-stat-label">Households Served</span>
            </div>
          </div>
          <div class="hh-stat progress">
            <div class="hh-stat-icon">
              <sdFeatherIcons type="trending-up" size="20" />
            </div>
            <div class="hh-stat-body">
              <span class="hh-stat-value">{{ servedPercent }}%</span>
              <span class="hh-stat-label">Completion</span>
            </div>
          </div>
        </div>
        <a-progress
          :percent="servedPercent"
          :stroke-color="{ '0%': '#20C997', '100%': '#36ddb3' }"
          :show-info="false"
          class="hh-progress"
        />

        <div class="hh-tables">
          <div class="hh-table-block pending">
            <h4 class="hh-table-title">
              <span class="hh-dot warn-dot"></span>
              Pending Households
              <span class="hh-count-pill warn">{{ filteredPending.length }}</span>
            </h4>
            <TableWrapper class="table-responsive">
              <a-table
                :dataSource="filteredPending"
                :columns="hhColumns"
                :pagination="{ pageSize: 5, showSizeChanger: false }"
                size="small"
                row-key="hh_id"
              />
            </TableWrapper>
          </div>
          <div class="hh-table-block served">
            <h4 class="hh-table-title">
              <span class="hh-dot ok-dot"></span>
              Served Households
              <span class="hh-count-pill ok">{{ filteredServed.length }}</span>
            </h4>
            <TableWrapper class="table-responsive">
              <a-table
                :dataSource="filteredServed"
                :columns="hhColumns"
                :pagination="{ pageSize: 5, showSizeChanger: false }"
                size="small"
                row-key="hh_id"
              />
            </TableWrapper>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "@/Axiosconfig";
import { TableWrapper } from "../../styled";

const { query } = useRoute();
const post_id = Number(query.id);
const post_name = query.name;

const isLoading = ref(true);
const summary = ref({
  distribution_day: 0,
  bales: 0,
  loose_nets: 0,
  nets_per_bale: 50,
  total_nets: 0,
  system_quantity: 0,
  today_variance_loose: 0,
  today_variance_bales: 0,
  nets_issued_today: 0,
  cumulative_nets_issued: 0,
  bales_opened: 0,
  bales_received: 0,
  day_status: "not started",
  variances: [],
  total_variance_loose: 0,
  total_variance_bales: 0,
});
const postWorkers = ref([]);
const workerTotals = ref({ total_count: 0, total_nets: 0 });

// Distribution summary breakdown + household collection
const distributionSummary = ref({});
const pendingHouseholds = ref([]);
const servedHouseholds = ref([]);
const pendingCount = ref(0);
const servedCount = ref(0);

// Single search box shared across both household tables.
const hhSearch = ref("");
const filterHouseholds = (rows) => {
  const q = hhSearch.value.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (h) =>
      String(h.hh_name || "").toLowerCase().includes(q) ||
      String(h.hh_phone_number || "").toLowerCase().includes(q)
  );
};
const filteredPending = computed(() => filterHouseholds(pendingHouseholds.value));
const filteredServed = computed(() => filterHouseholds(servedHouseholds.value));

const hhColumns = [
  { title: "Name", dataIndex: "hh_name", key: "hh_name" },
  { title: "Phone Number", dataIndex: "hh_phone_number", key: "hh_phone_number" },
];

// Plain object accessor for the budget-style summary panel
const distSummary = computed(() => distributionSummary.value || {});

// Generic percentage helper (value of total), clamped 0–100
const pct = (value, total) => {
  const t = Number(total) || 0;
  if (t <= 0) return 0;
  return Math.min(100, Math.round((Number(value || 0) / t) * 100));
};

const servedPercent = computed(() => {
  const total = pendingCount.value + servedCount.value;
  if (!total) return 0;
  return Math.round((servedCount.value / total) * 100);
});

const todayLabel = computed(() =>
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
);
const systemLoose = computed(
  () => summary.value.loose_nets - summary.value.today_variance_loose
);

// Sign-based colour helper: shortage (negative) = red, surplus (positive) = green.
const signClass = (n) => (n < 0 ? "neg" : n > 0 ? "pos" : "");

// Human-readable direction for a variance value.
const varianceDirection = (n) =>
  n < 0 ? "Shortage" : n > 0 ? "Surplus" : "Balanced";

// Net-equivalent of a variance row: bales converted to nets + loose pieces.
const netEquiv = (record) =>
  (record.variance_bales || 0) * (summary.value.nets_per_bale || 50) +
  (record.variance_loose || 0);

// Total nets unaccounted for across all recorded variances.
const totalNetVariance = computed(
  () =>
    (summary.value.total_variance_bales || 0) *
      (summary.value.nets_per_bale || 50) +
    (summary.value.total_variance_loose || 0)
);

const varianceColumns = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Source", key: "source", slots: { customRender: "source" } },
  { title: "Var. bales", key: "vbales", slots: { customRender: "vbales" } },
  { title: "Var. loose", key: "vloose", slots: { customRender: "vloose" } },
  {
    title: "Net equivalent",
    key: "netEquiv",
    slots: { customRender: "netEquiv" },
  },
  { title: "Status", key: "direction", slots: { customRender: "direction" } },
  { title: "Reason", key: "reason", slots: { customRender: "reason" } },
];

const workerColumns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Role", dataIndex: "role", key: "role" },
  { title: "Issue Date", dataIndex: "issue_date", key: "issue_date" },
  {
    title: "Households Served",
    dataIndex: "total_households_served",
    key: "total_households_served",
  },
  { title: "Total Nets", dataIndex: "total_nets", key: "total_nets" },
];

// Aggregate worker nets per person for the chart
const workerChartData = computed(() => {
  const map = {};
  postWorkers.value.forEach((w) => {
    if (!w.name) return;
    map[w.name] = (map[w.name] || 0) + Number(w.total_nets || 0);
  });
  return Object.entries(map)
    .map(([name, nets]) => ({ name, nets }))
    .sort((a, b) => b.nets - a.nets)
    .slice(0, 15);
});

// Worker bar width relative to the busiest worker
const workerMax = computed(() =>
  workerChartData.value.reduce((m, w) => Math.max(m, w.nets), 0)
);
const workerPercent = (nets) => {
  if (!workerMax.value) return 0;
  return Math.round((Number(nets || 0) / workerMax.value) * 100);
};

const statusColor = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "flagged") return "red";
  if (s === "approved") return "green";
  if (s === "submitted") return "blue";
  if (s === "not started") return "default";
  return "default";
};

const fetchSummary = async () => {
  try {
    const { data } = await axios.get(`posts/${post_id}/dashboard-summary`);
    if (data.success) summary.value = data.data;
  } catch (e) {
    console.error(e);
  }
};

const fetchWorkers = async () => {
  try {
    const { data } = await axios.get(`post_worker_summary?post_id=${post_id}`);
    const payload = data.data;
    if (payload) {
      postWorkers.value = (payload.post_workers || []).map((w, i) => ({
        ...w,
        rowKey: `${w.name}-${w.issue_date}-${i}`,
      }));
      workerTotals.value = payload.total_summary || {
        total_count: 0,
        total_nets: 0,
      };
    }
  } catch (e) {
    console.error(e);
  }
};

const fetchDistributionSummary = async () => {
  try {
    const { data } = await axios.get(
      `nets_received_distributed_hh_post?post_id=${post_id}`
    );
    distributionSummary.value = data || {};
  } catch (e) {
    console.error(e);
  }
};

const fetchPendingHouseholds = async () => {
  try {
    const { data } = await axios.get(
      `hh_per_post_pending_collection?post_id=${post_id}`
    );
    pendingHouseholds.value = data.households || [];
    pendingCount.value = data.hh_pending_count || 0;
  } catch (e) {
    console.error(e);
  }
};

const fetchServedHouseholds = async () => {
  try {
    const { data } = await axios.get(`hh_per_post_served?post_id=${post_id}`);
    servedHouseholds.value = data.households || [];
    servedCount.value = data.hh_served_count || 0;
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([
    fetchSummary(),
    fetchWorkers(),
    fetchDistributionSummary(),
    fetchPendingHouseholds(),
    fetchServedHouseholds(),
  ]);
  isLoading.value = false;
});
</script>

<style lang="less" scoped>
.post-dashboard {
  .pd-head {
    margin-bottom: 16px;
  }
  .pd-title {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #1f2437;
  }
  .pd-sub {
    margin: 2px 0 0;
    font-size: 12px;
    color: #8a90a6;
  }
  .pd-loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
  }
  .kpi-card {
    background: #fff;
    border: 1px solid #e6f2eb;
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: 0 3px 10px rgba(28, 122, 72, 0.05);
  }
  .kpi-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #8a90a6;
    font-weight: 600;
  }
  .kpi-value {
    font-size: 26px;
    font-weight: 800;
    color: #1f2437;
    line-height: 1.1;
  }
  .kpi-foot {
    font-size: 11px;
    color: #8a90a6;
  }

  .panel {
    background: #fff;
    border: 1px solid #e6f2eb;
    border-radius: 12px;
    padding: 18px 20px;
    margin-bottom: 16px;
    box-shadow: 0 3px 10px rgba(28, 122, 72, 0.05);
  }
  .panel-title {
    font-size: 15px;
    font-weight: 700;
    color: #2f6746;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
  }
  .panel-title.danger {
    color: #ff4d4f;
  }

  .var-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 16px;
  }
  .var-cell {
    background: #fafbfc;
    border: 1px solid #eef0f4;
    border-radius: 10px;
    padding: 12px 14px;
  }
  .var-cell--lead {
    background: #fff5f5;
    border-color: #ffd5d5;
  }
  .var-label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #8a90a6;
    font-weight: 600;
  }
  .var-value {
    display: block;
    font-size: 24px;
    font-weight: 800;
    color: #1f2437;
  }
  .var-foot {
    font-size: 11px;
    color: #8a90a6;
  }

  /* Plain-language explainer + chips */
  .var-explain {
    font-size: 12.5px;
    line-height: 1.6;
    color: #5b6072;
    background: #fffaf0;
    border: 1px solid #ffe7ba;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 16px;
  }
  .chip {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 11.5px;
    white-space: nowrap;
  }
  .neg-chip {
    background: #fff1f0;
    color: #ff4d4f;
    border: 1px solid #ffccc7;
  }
  .pos-chip {
    background: #f6ffed;
    color: #20c997;
    border: 1px solid #b7eb8f;
  }

  /* Derivation strip */
  .var-formula {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px;
    background: #f4f8ff;
    border: 1px solid #d6e4ff;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 16px;
  }
  .vf-label {
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 700;
    color: #2f54eb;
    margin-right: 6px;
  }
  .vf-eq {
    font-size: 12.5px;
    color: #5b6072;
  }
  .vf-op {
    font-weight: 800;
    color: #2f54eb;
    margin: 0 2px;
  }
  .var-table-cap {
    font-size: 12px;
    font-weight: 700;
    color: #5b6072;
    margin: 0 0 8px;
  }
  .reason-warn {
    color: #fa8c16 !important;
    font-style: normal;
    font-weight: 600;
  }
  .neg {
    color: #ff4d4f;
  }
  .pos {
    color: #20c997;
  }
  .bold {
    font-weight: 700;
  }
  .muted {
    color: #9299b8;
  }
  .center {
    text-align: center;
    padding: 24px 0;
  }

  .chart-wrap {
    margin-bottom: 14px;
  }

  /* Side-by-side worker + distribution summary */
  .dash-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    align-items: start;
  }
  .dash-row .panel {
    margin-bottom: 0;
  }

  /* ── Budget-style panels (green-tinted, progress bars) ── */
  .bdg-panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 10px;
    padding: 16px 20px 18px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }
  .bdg-panel-title {
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .split-block {
    margin-bottom: 6px;
  }
  .split-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 10px;
    margin-bottom: 4px;
  }
  .split-label {
    font-size: 12px;
    color: #4d8a63;
  }
  .split-value {
    font-size: 13px;
    font-weight: 700;
    color: #15693c;
  }
  .split-percent {
    color: #7a8a82;
    font-weight: 400;
    margin-left: 2px;
  }
  .grand-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #d9f0e2;
    font-size: 13px;
    color: #15693c;
  }
  .grand-total.no-border {
    margin-top: 4px;
    padding-top: 8px;
    border-top: none;
  }
  .grand-total strong {
    font-size: 14px;
    font-weight: 800;
  }
  .list-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e6f3eb;
  }
  .list-row:last-of-type {
    border-bottom: none;
  }
  .list-label {
    font-size: 12px;
    color: #4d8a63;
  }
  .list-value {
    font-size: 13px;
    font-weight: 700;
    color: #15693c;
  }
  .worker-table {
    margin-top: 16px;
  }

  /* Household distribution summary */
  .hh-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 14px;
  }
  .hh-stat {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #fbfdfc;
    border: 1px solid #e6f2eb;
    border-radius: 12px;
    padding: 14px 16px;
  }
  .hh-stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .hh-stat.pending .hh-stat-icon {
    background: #fff4e0;
    color: #fa8b0c;
  }
  .hh-stat.served .hh-stat-icon {
    background: #e3faf3;
    color: #20c997;
  }
  .hh-stat.progress .hh-stat-icon {
    background: #ebebff;
    color: #5f63f2;
  }
  .hh-stat-body {
    display: flex;
    flex-direction: column;
  }
  .hh-stat-value {
    font-size: 24px;
    font-weight: 800;
    color: #1f2437;
    line-height: 1.1;
  }
  .hh-stat-label {
    font-size: 12px;
    color: #8a90a6;
    font-weight: 600;
  }
  .hh-progress {
    margin-bottom: 18px;
  }
  .hh-tables {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .hh-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .hh-head .panel-title {
    margin-bottom: 0;
  }
  .hh-search {
    max-width: 320px;
    border-radius: 8px;
  }
  .hh-table-block {
    border: 1px solid #eef1f5;
    border-radius: 12px;
    padding: 14px 14px 6px;
    background: #fcfdfe;
  }
  .hh-table-block.pending {
    border-top: 3px solid #fa8b0c;
    background: #fffdf8;
  }
  .hh-table-block.served {
    border-top: 3px solid #20c997;
    background: #f8fffc;
  }
  .hh-table-title {
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .hh-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: inline-block;
  }
  .hh-dot.warn-dot {
    background: #fa8b0c;
  }
  .hh-dot.ok-dot {
    background: #20c997;
  }
  .hh-count-pill {
    font-size: 11px;
    font-weight: 700;
    border-radius: 12px;
    padding: 1px 10px;
    margin-left: auto;
  }
  .hh-count-pill.warn {
    background: #fff4e0;
    color: #fa8b0c;
  }
  .hh-count-pill.ok {
    background: #e3faf3;
    color: #20c997;
  }

  @media (max-width: 991px) {
    .kpi-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .var-grid {
      grid-template-columns: 1fr;
    }
    .dash-row {
      grid-template-columns: 1fr;
    }
    .hh-summary {
      grid-template-columns: 1fr;
    }
    .hh-tables {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 575px) {
    .kpi-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
