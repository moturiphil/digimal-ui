<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard od-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Distribution Dashboard
            </h3>
            <p class="ph-subtitle">
              {{ scopeLabel }} · {{ todayLabel }}
            </p>
          </div>
          <div class="ph-actions">
            <sdButton type="light" size="small" @click="fetchDashboard">
              <sdFeatherIcons type="refresh-cw" size="14" /> &nbsp;Refresh
            </sdButton>
          </div>
        </header>

        <div v-if="isLoading" class="od-loading"><a-spin /></div>

        <template v-else>
          <!-- KPI grid -->
          <div class="kpi-grid">
            <div class="kpi-card">
              <span class="kpi-label">Distribution Posts</span>
              <span class="kpi-value">{{ totals.posts }}</span>
              <span class="kpi-foot">{{ totals.posts_active }} active</span>
            </div>
            <div class="kpi-card" :class="{ 'kpi-danger': totals.flagged_count > 0 }">
              <span class="kpi-label">Flagged Stock / Variance</span>
              <span class="kpi-value">{{ totals.flagged_count }}</span>
              <span class="kpi-foot">
                {{ totals.posts_flagged }} post{{ totals.posts_flagged === 1 ? "" : "s" }} affected
              </span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Households Served</span>
              <span class="kpi-value">{{ totals.households_served }}</span>
              <span class="kpi-foot">of {{ totals.households_registered }} registered</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Nets Received</span>
              <span class="kpi-value">{{ totals.nets_received }}</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Nets Distributed</span>
              <span class="kpi-value">{{ totals.nets_distributed }}</span>
            </div>
            <div class="kpi-card">
              <span class="kpi-label">Nets Balance (at hand)</span>
              <span class="kpi-value">{{ totals.nets_balance }}</span>
            </div>
          </div>

          <!-- Flagged stock / variance — prominent -->
          <section v-if="flaggedBalances.length" class="panel flag-panel">
            <h3 class="panel-title danger">
              <sdFeatherIcons type="alert-triangle" size="18" /> &nbsp;Flagged Stock &amp; Variances
              <span class="flag-pill">{{ flaggedBalances.length }}</span>
            </h3>
            <p class="flag-explain">
              These posts captured a balance whose physical count differs from the
              system-expected stock. Review and resolve each variance.
            </p>
            <TableWrapper class="table-responsive">
              <a-table
                :dataSource="flaggedBalances"
                :columns="flaggedColumns"
                :pagination="{ pageSize: 8, showSizeChanger: false }"
                size="small"
                row-key="id"
              >
                <template #post="{ record }">
                  <td>
                    <a class="od-link" @click="goToPost(record)">
                      {{ record.post_name }}
                    </a>
                    <div class="od-sub">{{ record.post_code }}</div>
                  </td>
                </template>
                <template #area="{ record }">
                  <td>
                    <div>{{ record.subcounty || "—" }}</div>
                    <div class="od-sub">{{ record.county || "" }}</div>
                  </td>
                </template>
                <template #type="{ record }">
                  <td>
                    <a-tag :color="record.type === 'closing' ? 'volcano' : 'geekblue'">
                      {{ record.type === "closing" ? "Closing" : "Opening" }}
                    </a-tag>
                  </td>
                </template>
                <template #variance="{ record }">
                  <td>
                    <span :class="signClass(record.variance_total_nets) + ' bold'">
                      {{ record.variance_total_nets > 0 ? "+" : "" }}{{ record.variance_total_nets }}
                    </span>
                  </td>
                </template>
                <template #reason="{ record }">
                  <td>
                    <span v-if="record.variance_notes">{{ record.variance_notes }}</span>
                    <em v-else class="od-warn">⚠ No reason recorded</em>
                  </td>
                </template>
                <template #action>
                  <td>
                    <sdButton size="extra-small" type="primary" @click="goToReview()">
                      Review
                    </sdButton>
                  </td>
                </template>
              </a-table>
            </TableWrapper>
          </section>

          <section v-else class="panel ok-panel">
            <sdFeatherIcons type="check-circle" size="18" />
            &nbsp;No flagged stock or variances in {{ scopeLabel }}.
          </section>

          <!-- Post distribution status -->
          <section class="panel">
            <div class="od-head">
              <h3 class="panel-title">Post Distribution Status</h3>
              <a-input
                v-model:value="search"
                placeholder="Search post, code, sub-county…"
                allow-clear
                class="od-search"
              >
                <template #prefix>
                  <sdFeatherIcons type="search" size="14" />
                </template>
              </a-input>
            </div>
            <TableWrapper class="table-responsive">
              <a-table
                :dataSource="filteredPosts"
                :columns="postColumns"
                :pagination="{ pageSize: 15, showSizeChanger: true }"
                size="small"
                row-key="post_id"
                :rowClassName="(record) => (record.has_flag ? 'od-row-flag' : '')"
              >
                <template #post="{ record }">
                  <td>
                    <a class="od-link" @click="goToPost(record)">{{ record.name }}</a>
                    <div class="od-sub">{{ record.post_code }}</div>
                  </td>
                </template>
                <template #area="{ record }">
                  <td>
                    <div>{{ record.subcounty || "—" }}</div>
                    <div class="od-sub">{{ record.county || "" }}</div>
                  </td>
                </template>
                <template #status="{ record }">
                  <td>
                    <a-tag :color="statusColor(record.day_status)">
                      {{ prettyStatus(record.day_status) }}
                    </a-tag>
                  </td>
                </template>
                <template #served="{ record }">
                  <td>{{ record.households_served }} / {{ record.households_registered }}</td>
                </template>
                <template #variance="{ record }">
                  <td>
                    <span v-if="record.has_flag" :class="signClass(record.latest_variance) + ' bold'">
                      {{ record.latest_variance > 0 ? "+" : "" }}{{ record.latest_variance }}
                    </span>
                    <span v-else class="od-muted">—</span>
                  </td>
                </template>
              </a-table>
            </TableWrapper>
          </section>
        </template>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/Axiosconfig";
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";
import { Main, TableWrapper } from "../../styled";

const router = useRouter();

const isLoading = ref(true);
const search = ref("");
const totals = ref({
  posts: 0,
  posts_active: 0,
  posts_flagged: 0,
  households_registered: 0,
  households_served: 0,
  nets_received: 0,
  nets_distributed: 0,
  nets_balance: 0,
  flagged_count: 0,
  total_variance_nets: 0,
});
const flaggedBalances = ref([]);
const posts = ref([]);
const scope = ref({ level: "", label: "", is_national: false });

const scopeLabel = computed(() => scope.value.label || "Your jurisdiction");

const todayLabel = computed(() =>
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
);

const flaggedColumns = [
  { title: "Post", key: "post", slots: { customRender: "post" } },
  { title: "Area", key: "area", slots: { customRender: "area" } },
  { title: "Date", dataIndex: "balance_date", key: "balance_date" },
  { title: "Type", key: "type", slots: { customRender: "type" } },
  { title: "Expected", dataIndex: "expected_total_nets", key: "expected_total_nets" },
  { title: "Physical", dataIndex: "physical_total_nets", key: "physical_total_nets" },
  { title: "Variance", key: "variance", slots: { customRender: "variance" } },
  { title: "Reason", key: "reason", slots: { customRender: "reason" } },
  { title: "", key: "action", slots: { customRender: "action" } },
];

const postColumns = [
  { title: "Post", key: "post", slots: { customRender: "post" } },
  { title: "Area", key: "area", slots: { customRender: "area" } },
  { title: "Supervisor", dataIndex: "supervisor", key: "supervisor" },
  { title: "Day Status", key: "status", slots: { customRender: "status" } },
  { title: "Received", dataIndex: "nets_received", key: "nets_received" },
  { title: "Distributed", dataIndex: "nets_distributed", key: "nets_distributed" },
  { title: "Balance", dataIndex: "nets_balance", key: "nets_balance" },
  { title: "HH Served", key: "served", slots: { customRender: "served" } },
  { title: "Variance", key: "variance", slots: { customRender: "variance" } },
];

const filteredPosts = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return posts.value;
  return posts.value.filter(
    (p) =>
      String(p.name || "").toLowerCase().includes(q) ||
      String(p.post_code || "").toLowerCase().includes(q) ||
      String(p.subcounty || "").toLowerCase().includes(q) ||
      String(p.county || "").toLowerCase().includes(q) ||
      String(p.supervisor || "").toLowerCase().includes(q)
  );
});

const signClass = (n) => (n < 0 ? "neg" : n > 0 ? "pos" : "");

const prettyStatus = (s) =>
  (s || "not started").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const statusColor = (s) => {
  switch (s) {
    case "flagged":
      return "red";
    case "approved":
      return "green";
    case "submitted":
      return "blue";
    case "open":
      return "cyan";
    default:
      return "default";
  }
};

const goToPost = (record) => {
  router.push({
    path: "/nets/receive-nets-summary",
    query: { id: record.post_id, name: record.post_name || record.name },
  });
};

const goToReview = () => {
  router.push({ path: "/nets/supervisor-review" });
};

const fetchDashboard = async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.get("oversight/distribution-dashboard");
    if (data.success) {
      totals.value = data.data.totals;
      flaggedBalances.value = data.data.flagged_balances || [];
      posts.value = data.data.posts || [];
      scope.value = data.data.scope || scope.value;
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDashboard);
</script>

<style scoped>
.od-loading {
  text-align: center;
  padding: 48px 0;
}
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}
.kpi-card {
  background: #fff;
  border: 1px solid #eef1f5;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 3px 10px rgba(28, 122, 72, 0.05);
}
.kpi-card.kpi-danger {
  border-color: #ffccc7;
  background: #fff5f5;
}
.kpi-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8a90a6;
  font-weight: 600;
}
.kpi-value {
  display: block;
  font-size: 26px;
  font-weight: 800;
  color: #1f2437;
  line-height: 1.2;
}
.kpi-foot {
  font-size: 11px;
  color: #8a90a6;
}
.panel {
  background: #fff;
  border: 1px solid #eef1f5;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 16px;
  box-shadow: 0 3px 10px rgba(28, 122, 72, 0.05);
}
.panel-title {
  font-size: 15px;
  font-weight: 700;
  color: #2f6746;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}
.panel-title.danger {
  color: #ff4d4f;
}
.flag-panel {
  border-color: #ffd5d5;
  background: #fffbfb;
}
.flag-pill {
  margin-left: 10px;
  background: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  padding: 1px 10px;
}
.flag-explain {
  font-size: 12.5px;
  color: #5b6072;
  margin-bottom: 12px;
}
.ok-panel {
  display: flex;
  align-items: center;
  color: #20c997;
  font-weight: 600;
}
.od-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.od-head .panel-title {
  margin-bottom: 0;
}
.od-search {
  max-width: 320px;
  border-radius: 8px;
}
.od-link {
  color: #1c7a48;
  font-weight: 600;
  cursor: pointer;
}
.od-link:hover {
  text-decoration: underline;
}
.od-sub {
  font-size: 11px;
  color: #9299b8;
}
.od-muted {
  color: #9299b8;
}
.od-warn {
  color: #fa8c16;
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
:deep(.od-row-flag) {
  background: #fffaf0;
}

@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 480px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
