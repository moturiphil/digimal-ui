<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard hh-myrequests-dashboard">
        <!-- ── Page heading ───────────────────────────────────────────────── -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▤</span> My Change Requests
            </h3>
            <p class="ph-subtitle">
              All household change requests you have submitted, including their
              current status and any reviewer feedback.
            </p>
          </div>
          <div class="ph-actions">
            <a-tag color="orange" v-if="counts.pending">
              {{ counts.pending }} pending
            </a-tag>
            <a-button size="small" :loading="loading" @click="fetchRequests">
              <template #icon><ReloadOutlined /></template>
              Refresh
            </a-button>
          </div>
        </div>

        <a-spin :spinning="loading">
          <!-- ── Status summary tiles ────────────────────────────────────── -->
          <section class="panel">
            <div class="panel-title">Submission Summary</div>
            <div class="tile-row tile-row-4">
              <div class="tile">
                <div class="tile-icon">▦</div>
                <div class="tile-label">Total Submitted</div>
                <div class="tile-value">{{ fmt(counts.total) }}</div>
                <div class="tile-sub">All time</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-warning">◷</div>
                <div class="tile-label">Pending</div>
                <div class="tile-value">{{ fmt(counts.pending) }}</div>
                <div class="tile-sub">Awaiting SCMCC review</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-success">✓</div>
                <div class="tile-label">Approved</div>
                <div class="tile-value">{{ fmt(counts.approved) }}</div>
                <div class="tile-sub">Applied to the household</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-danger">✕</div>
                <div class="tile-label">Rejected</div>
                <div class="tile-value">{{ fmt(counts.rejected) }}</div>
                <div class="tile-sub">Review the reason &amp; resubmit</div>
              </div>
            </div>
          </section>

          <!-- ── Filters ────────────────────────────────────────────────── -->
          <section class="panel filter-panel">
            <div class="filter-row">
              <a-segmented
                v-model:value="statusFilter"
                :options="statusOptions"
                @change="fetchRequests"
              />
              <a-select
                v-model:value="actionFilter"
                :options="actionOptions"
                style="min-width: 180px"
                @change="fetchRequests"
              />
              <a-input
                v-model:value="search"
                placeholder="Search by household head, ID or phone"
                allow-clear
                class="search"
              >
                <template #prefix><SearchOutlined /></template>
              </a-input>
            </div>
          </section>

          <!-- ── Requests table ─────────────────────────────────────────── -->
          <section class="panel">
            <div class="panel-title">My Requests</div>
            <a-table
              :columns="columns"
              :data-source="filteredRequests"
              :loading="loading"
              :pagination="{ pageSize: 12, showSizeChanger: false }"
              row-key="id"
              :row-class-name="highlightRowClass"
              class="requests-table"
              :scroll="{ x: 1080 }"
              size="middle"
              :locale="{ emptyText: 'You have not submitted any change requests yet.' }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action_type'">
                  <a-tag :color="actionColor(record.action_type)">
                    {{ actionLabel(record.action_type) }}
                  </a-tag>
                </template>

                <template v-else-if="column.key === 'household'">
                  <div class="hh-cell">
                    <strong>{{ householdHead(record) }}</strong>
                    <span class="muted">
                      ID {{ maskId(record.household && record.household.id_no) || '—' }}
                      · {{ maskPhone(record.household && record.household.phone_no) || '—' }}
                    </span>
                  </div>
                </template>

                <template v-else-if="column.key === 'status'">
                  <a-tag :color="statusColor(record.status)">
                    {{ statusLabel(record.status) }}
                  </a-tag>
                </template>

                <template v-else-if="column.key === 'submitted_at'">
                  {{ formatDate(record.created_at) }}
                </template>

                <template v-else-if="column.key === 'reviewer'">
                  <div class="hh-cell" v-if="record.approver">
                    <strong>{{ record.approver.name || '—' }}</strong>
                    <span class="muted">
                      {{ formatDate(record.approved_at) }}
                    </span>
                  </div>
                  <span v-else class="muted">—</span>
                </template>

                <template v-else-if="column.key === 'actions'">
                  <a-button size="small" @click="openDetail(record)">
                    <template #icon><EyeOutlined /></template>
                    View
                  </a-button>
                </template>
              </template>
            </a-table>
          </section>
        </a-spin>

        <!-- Detail drawer -->
        <a-drawer
          v-model:visible="detailOpen"
          title="Change request details"
          width="540"
          :body-style="{ paddingBottom: '40px' }"
        >
          <div v-if="detailRequest" class="detail">
            <div class="detail-section">
              <h4>Request</h4>
              <p>
                <a-tag :color="actionColor(detailRequest.action_type)">
                  {{ actionLabel(detailRequest.action_type) }}
                </a-tag>
                <a-tag :color="statusColor(detailRequest.status)">
                  {{ statusLabel(detailRequest.status) }}
                </a-tag>
                <span class="muted">#{{ detailRequest.id }}</span>
              </p>
              <p class="muted">Submitted {{ formatDate(detailRequest.created_at) }}</p>
            </div>

            <div v-if="detailRequest.household" class="detail-section">
              <h4>Household Snapshot</h4>
              <div class="hh-snapshot">
                <div class="snap-row">
                  <span class="snap-label">Head</span>
                  <span class="snap-value">{{ householdHead(detailRequest) }}</span>
                </div>
                <div class="snap-row">
                  <span class="snap-label">ID Number</span>
                  <span class="snap-value">{{ detailRequest.household.id_no || '—' }}</span>
                </div>
                <div class="snap-row">
                  <span class="snap-label">Phone</span>
                  <span class="snap-value">{{ detailRequest.household.phone_no || '—' }}</span>
                </div>
                <div class="snap-row">
                  <span class="snap-label">Members</span>
                  <span class="snap-value">
                    {{ detailRequest.household.hh_size != null ? detailRequest.household.hh_size : '—' }}
                  </span>
                </div>
                <div class="snap-row">
                  <span class="snap-label">Location</span>
                  <span class="snap-value">{{ currentLocationName || '—' }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Before vs After</h4>
              <div v-if="detailDiffs.length" class="diff-grid">
                <div class="diff-col before-col">
                  <div class="diff-col-title">Before</div>
                  <div
                    v-for="diff in detailDiffs"
                    :key="'b-' + diff.label"
                    class="diff-line"
                  >
                    <span class="diff-line-label">{{ diff.label }}</span>
                    <span class="diff-line-value old-value">{{ diff.from || '—' }}</span>
                  </div>
                </div>
                <div class="diff-arrow-col">
                  <ArrowRightOutlined />
                </div>
                <div class="diff-col after-col">
                  <div class="diff-col-title">After</div>
                  <div
                    v-for="diff in detailDiffs"
                    :key="'a-' + diff.label"
                    class="diff-line"
                  >
                    <span class="diff-line-label">{{ diff.label }}</span>
                    <span class="diff-line-value new-value">{{ diff.to || '—' }}</span>
                  </div>
                </div>
              </div>
              <p v-else class="muted">No field-level changes recorded.</p>
            </div>

            <div v-if="detailRequest.notes" class="detail-section">
              <h4>Your notes</h4>
              <p class="notes-block">{{ detailRequest.notes }}</p>
            </div>

            <div
              v-if="detailRequest.status === 'rejected' && detailRequest.rejection_reason"
              class="detail-section reject-section"
            >
              <h4>Reason for rejection</h4>
              <p class="notes-block reject-block">
                {{ detailRequest.rejection_reason }}
              </p>
            </div>

            <div v-if="detailRequest.approver" class="detail-section">
              <h4>Reviewed by</h4>
              <p>
                <strong>{{ detailRequest.approver.name || '—' }}</strong>
                <span class="muted"> · {{ formatDate(detailRequest.approved_at) }}</span>
              </p>
            </div>
          </div>
        </a-drawer>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import axios from "@/Axiosconfig";
import { Main } from "../../styled";
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";
import {
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons-vue";

const loading = ref(false);
const requests = ref([]);
const search = ref("");
const statusFilter = ref("all");
const actionFilter = ref("all");

const detailOpen = ref(false);
const detailRequest = ref(null);

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const actionOptions = [
  { label: "All actions", value: "all" },
  { label: "Phone change", value: "phone_change" },
  { label: "Mute", value: "mute" },
  { label: "Head change", value: "head_change" },
  { label: "Transfer", value: "transfer_in" },
  { label: "New household", value: "create" },
];

const columns = [
  { title: "Action", key: "action_type", width: 140 },
  { title: "Household", key: "household" },
  { title: "Status", key: "status", width: 120 },
  { title: "Submitted", key: "submitted_at", width: 160 },
  { title: "Reviewed by", key: "reviewer", width: 180 },
  { title: "", key: "actions", width: 100, align: "right" },
];

const actionLabel = (type) =>
  ({
    create: "New household",
    mute: "Mute",
    transfer_in: "Transfer",
    phone_change: "Phone change",
    head_change: "Head change",
  }[type] || type);

const actionColor = (type) =>
  ({
    create: "geekblue",
    mute: "volcano",
    transfer_in: "purple",
    phone_change: "blue",
    head_change: "magenta",
  }[type] || "default");

const statusLabel = (status) =>
  ({
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  }[status] || status);

const statusColor = (status) =>
  ({
    pending: "orange",
    approved: "green",
    rejected: "red",
  }[status] || "default");

const householdHead = (req) => {
  const h = req.household;
  if (!h) {
    return req.create_payload
      ? [
          req.create_payload.first_name,
          req.create_payload.middle_name,
          req.create_payload.last_name,
        ]
          .filter(Boolean)
          .join(" ")
      : "—";
  }
  return (
    [h.first_name, h.middle_name, h.last_name].filter(Boolean).join(" ") || "—"
  );
};

const maskPhone = (phone) => {
  if (!phone) return "";
  const s = String(phone);
  if (s.length <= 4) return s;
  const start = Math.floor((s.length - 4) / 2);
  return s.slice(0, start) + "****" + s.slice(start + 4);
};

const maskId = (id) => {
  if (!id) return "";
  const s = String(id);
  if (s.length <= 6) return s;
  return s.slice(0, 3) + "*".repeat(s.length - 6) + s.slice(-3);
};

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const fmt = (n) => (n == null ? "0" : Number(n).toLocaleString());

const counts = computed(() => {
  const c = { total: requests.value.length, pending: 0, approved: 0, rejected: 0 };
  for (const r of requests.value) {
    if (c[r.status] !== undefined) c[r.status]++;
  }
  return c;
});

const filteredRequests = computed(() => {
  let rows = requests.value;
  if (statusFilter.value !== "all") {
    rows = rows.filter((r) => r.status === statusFilter.value);
  }
  if (actionFilter.value !== "all") {
    rows = rows.filter((r) => r.action_type === actionFilter.value);
  }
  const needle = search.value.trim().toLowerCase();
  if (needle) {
    rows = rows.filter((r) => {
      const head = householdHead(r).toLowerCase();
      const id = String(
        (r.household && r.household.id_no) ||
          (r.create_payload && r.create_payload.id_no) ||
          ""
      ).toLowerCase();
      const phone = String(
        (r.household && r.household.phone_no) ||
          (r.create_payload && r.create_payload.phone_no) ||
          ""
      ).toLowerCase();
      return (
        head.includes(needle) || id.includes(needle) || phone.includes(needle)
      );
    });
  }
  return rows;
});

// Prefer the immutable snapshot captured at approval time so the "Before"
// values remain correct even after the live household row has been mutated.
const originalSnapshot = computed(() => {
  const r = detailRequest.value;
  if (!r) return {};
  const snap = r.log && r.log.original_snapshot;
  if (snap && typeof snap === "object") return snap;
  return r.household || {};
});

const detailDiffs = computed(() => {
  const r = detailRequest.value;
  if (!r) return [];
  const h = originalSnapshot.value || {};
  const live = r.household || {};
  const currentLocation =
    (live.location && (live.location.name || live.location.org_name)) ||
    h.location_id ||
    live.location_id;
  const newLocation =
    (r.new_location && (r.new_location.name || r.new_location.org_name)) ||
    r.new_location_id;
  const out = [];
  switch (r.action_type) {
    case "phone_change":
      out.push({
        label: "Phone number",
        from: h.phone_no,
        to: r.new_phone_no,
      });
      break;
    case "mute":
      out.push({ label: "Status", from: "Active", to: "Muted" });
      out.push({ label: "Reason", from: "—", to: r.mute_reason });
      break;
    case "head_change":
      out.push({
        label: "Status",
        from: "Active",
        to: "Muted + Successor created",
      });
      out.push({
        label: "Head ID number",
        from: h.id_no,
        to: r.new_id_no,
      });
      out.push({
        label: "Head phone",
        from: h.phone_no,
        to: r.new_phone_no,
      });
      out.push({
        label: "Head name",
        from:
          [h.first_name, h.middle_name, h.last_name].filter(Boolean).join(" ") ||
          "—",
        to: "New successor record",
      });
      break;
    case "transfer_in":
      out.push({
        label: "Location",
        from: currentLocation,
        to: newLocation,
      });
      if (r.new_post_id) {
        out.push({
          label: "Post",
          from: h.post_id || "—",
          to: r.new_post_id,
        });
      }
      if (r.new_hh_size) {
        out.push({
          label: "Members",
          from: h.hh_size,
          to: r.new_hh_size,
        });
      }
      break;
    case "create":
      out.push({
        label: "ID number",
        from: "—",
        to: r.create_payload && r.create_payload.id_no,
      });
      out.push({
        label: "Phone",
        from: "—",
        to: r.create_payload && r.create_payload.phone_no,
      });
      out.push({
        label: "Members",
        from: "—",
        to: r.create_payload && r.create_payload.hh_size,
      });
      out.push({
        label: "Head name",
        from: "—",
        to:
          r.create_payload
            ? [
                r.create_payload.first_name,
                r.create_payload.middle_name,
                r.create_payload.last_name,
              ]
                .filter(Boolean)
                .join(" ") || "—"
            : "—",
      });
      break;
  }
  return out;
});

const currentLocationName = computed(() => {
  const h = detailRequest.value && detailRequest.value.household;
  if (!h) return "";
  if (h.location && (h.location.name || h.location.org_name)) {
    return h.location.name || h.location.org_name;
  }
  return h.location_id ? `Location #${h.location_id}` : "";
});

const fetchRequests = async () => {
  loading.value = true;
  try {
    const params = {};
    if (statusFilter.value !== "all") params.status = statusFilter.value;
    if (actionFilter.value !== "all") params.action_type = actionFilter.value;
    const res = await axios.get("hh_change_requests/history", { params });
    const payload = res.data && res.data.data;
    requests.value = Array.isArray(payload)
      ? payload
      : (payload && payload.data) || [];
  } catch (err) {
    message.error(
      (err && err.response && err.response.data && err.response.data.message) ||
        "Failed to load your change requests."
    );
  } finally {
    loading.value = false;
  }
};

const openDetail = (record) => {
  detailRequest.value = record;
  detailOpen.value = true;
};

const route = useRoute();
const router = useRouter();
const highlightId = ref(route.query.highlight ? String(route.query.highlight) : null);
const highlightRowClass = (record) =>
  String(record.id) === String(highlightId.value) ? "highlighted-row" : "";

const applyHighlight = async () => {
  const id = highlightId.value;
  if (!id) return;
  let match = requests.value.find((r) => String(r.id) === String(id));
  // If the target request isn't in the cached list yet (e.g. a freshly-approved
  // request the user hasn't refreshed for), pull a fresh list once.
  if (!match) {
    await fetchRequests();
    match = requests.value.find((r) => String(r.id) === String(id));
    if (!match) return;
  }
  await nextTick();
  const el = document.querySelector(`[data-row-key="${id}"]`);
  if (el && typeof el.scrollIntoView === "function") {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  openDetail(match);
  setTimeout(() => {
    highlightId.value = null;
    if (route.query.highlight) {
      const { highlight, _t, ...rest } = route.query;
      void highlight; void _t;
      router.replace({ query: rest });
    }
  }, 1500);
};

watch(() => route.query.highlight, (val) => {
  highlightId.value = val ? String(val) : null;
  applyHighlight();
});
// Cache-buster from the bell when same-path/same-highlight navigation occurs.
watch(() => route.query._t, () => {
  if (route.query.highlight) {
    highlightId.value = String(route.query.highlight);
    applyHighlight();
  }
});
watch(requests, () => {
  if (highlightId.value) applyHighlight();
});

onMounted(fetchRequests);
</script>

<style lang="less" scoped>
.hh-myrequests-dashboard {
  color: #272b41;

  /* Page heading */
  .page-heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 14px;
    flex-wrap: wrap;

    .ph-left {
      .ph-title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: #15693c;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ph-icon {
        color: #4d8a63;
        font-size: 16px;
      }
      .ph-subtitle {
        margin: 4px 0 0 0;
        color: #6f8076;
        font-size: 12.5px;
        max-width: 720px;
      }
    }
    .ph-actions {
      display: flex;
      align-items: center;
      gap: 8px;
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
  }

  .tile-row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .tile-row-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (max-width: 1100px) {
    .tile-row-4 {
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
      font-size: 16px;
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
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: 600;
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

  .filter-panel { padding: 12px 16px; }
  .filter-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    .search { max-width: 320px; }
  }

  .requests-table {
    :deep(.ant-table) { background: transparent; }
    :deep(.ant-table-thead > tr > th) {
      background: #f6fbf8;
      color: #2f6746;
      font-weight: 700;
      font-size: 12px;
      border-bottom: 1px solid #d9f0e2;
    }
    :deep(.ant-table-tbody > tr > td) { border-bottom: 1px solid #eef5f1; }
    :deep(.ant-table-tbody > tr:hover > td) { background: #f9fdfb; }
  }

  .hh-cell {
    display: flex;
    flex-direction: column;
    line-height: 1.3;

    strong { color: #15693c; }
    .muted { color: #7a8a82; font-size: 11.5px; }
  }

  :deep(.highlighted-row > td) {
    background: #fff8d6 !important;
    transition: background 0.4s ease;
  }

  /* ── Mobile responsive ──────────────────────────────────────────── */
  @media (max-width: 768px) {
    .panel { padding: 12px 12px 14px; border-radius: 8px; }
    .page-heading { flex-direction: column; align-items: stretch; gap: 8px; }
    .ph-title { font-size: 15px; }
    .ph-subtitle { font-size: 11.5px; }
    .filter-row { flex-direction: column; align-items: stretch; }
    .filter-row .search { max-width: 100%; }
    .tile-row,
    .tile-row-4 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .tile { padding: 10px 8px; }
    .tile-value { font-size: 18px; }
    .tile-label, .tile-sub { font-size: 10.5px; }
  }
  @media (max-width: 480px) {
    .tile-row,
    .tile-row-4 { grid-template-columns: 1fr; }
  }
}
</style>

<style lang="less">
.ant-drawer .detail {
  .detail-section {
    margin-bottom: 18px;

    h4 {
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.4px;
      color: #4d8a63;
      font-weight: 700;
      margin: 0 0 8px 0;
    }
    p { margin: 0 0 4px 0; }
    .muted { color: #7a8a82; font-size: 12px; }
    .notes-block {
      background: #f6fbf8;
      border: 1px solid #e1efe6;
      border-radius: 8px;
      padding: 10px 12px;
      white-space: pre-wrap;
    }
    .reject-block {
      background: #fff5f5;
      border-color: #ffd6d6;
      color: #92272a;
    }
  }

  .change-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px dashed #e1efe6;
      font-size: 13px;

      &:last-child { border-bottom: none; }

      .diff-label { font-weight: 600; color: #2f6746; }
      .diff-from { color: #b0b8c3; text-decoration: line-through; }
      .diff-arrow { color: #b0b8c3; }
      .diff-to { color: #15693c; font-weight: 700; }
    }
  }

  .hh-snapshot {
    background: #f6fbf8;
    border: 1px solid #e1efe6;
    border-radius: 8px;
    padding: 10px 12px;

    .snap-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 4px 0;
      font-size: 13px;
      border-bottom: 1px dashed #e1efe6;

      &:last-child { border-bottom: none; }

      .snap-label {
        color: #7a8a82;
        font-size: 12px;
      }
      .snap-value {
        color: #15693c;
        font-weight: 600;
        text-align: right;
        max-width: 65%;
        word-break: break-word;
      }
    }
  }

  .diff-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 10px;
    align-items: stretch;

    .diff-col {
      border-radius: 8px;
      padding: 10px 12px;
      border: 1px solid #e1efe6;
      background: #fff;

      &.before-col {
        background: #fff8f6;
        border-color: #ffd9cf;
      }
      &.after-col {
        background: #f0faf3;
        border-color: #b6e3c6;
      }

      .diff-col-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
      }
      &.before-col .diff-col-title { color: #c44d39; }
      &.after-col .diff-col-title { color: #15693c; }

      .diff-line {
        padding: 6px 0;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.06);
        font-size: 13px;
        display: flex;
        flex-direction: column;
        gap: 2px;

        &:last-child { border-bottom: none; }

        .diff-line-label {
          color: #7a8a82;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .diff-line-value {
          font-weight: 600;
          word-break: break-word;
        }
        .old-value { color: #92272a; text-decoration: line-through; }
        .new-value { color: #15693c; }
      }
    }

    .diff-arrow-col {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4d8a63;
      font-size: 18px;
      padding: 0 2px;
    }
  }
}
</style>
