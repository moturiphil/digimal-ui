<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard hh-review-dashboard">
        <!-- ── Page heading ───────────────────────────────────────────────── -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▤</span> Household Change Requests
            </h3>
            <p class="ph-subtitle">
              Review change requests submitted by Community Health Assistants in
              your sub-county and approve or reject each one.
            </p>
          </div>
          <div class="ph-actions">
            <a-tag color="green" v-if="counts.total">{{ counts.total }} pending</a-tag>
            <a-button size="small" :loading="loading" @click="fetchRequests">
              <template #icon><ReloadOutlined /></template>
              Refresh
            </a-button>
          </div>
        </div>

        <a-spin :spinning="loading">
          <!-- ── Summary tiles ──────────────────────────────────────────── -->
          <section class="panel">
            <div class="panel-title">Pending Summary</div>
            <div class="tile-row tile-row-6">
              <div class="tile">
                <div class="tile-icon">▦</div>
                <div class="tile-label">Total Pending</div>
                <div class="tile-value">{{ fmt(counts.total) }}</div>
                <div class="tile-sub">Awaiting your review</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-info">☏</div>
                <div class="tile-label">Phone Change</div>
                <div class="tile-value">{{ fmt(counts.phone_change) }}</div>
                <div class="tile-sub">Update household contact</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-danger">⊘</div>
                <div class="tile-label">Mute</div>
                <div class="tile-value">{{ fmt(counts.mute) }}</div>
                <div class="tile-sub">Deceased / relocated / duplicate</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-warning">↻</div>
                <div class="tile-label">Head Change</div>
                <div class="tile-value">{{ fmt(counts.head_change) }}</div>
                <div class="tile-sub">Successor after deceased head</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-info">⇄</div>
                <div class="tile-label">Transfer</div>
                <div class="tile-value">{{ fmt(counts.transfer_in) }}</div>
                <div class="tile-sub">Move to a new location</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-success">＋</div>
                <div class="tile-label">New Household</div>
                <div class="tile-value">{{ fmt(counts.create) }}</div>
                <div class="tile-sub">Newly registered HH</div>
              </div>
            </div>
          </section>

          <!-- ── Filters ────────────────────────────────────────────────── -->
          <section class="panel filter-panel">
            <div class="filter-row">
              <a-segmented
                v-model:value="activeFilter"
                :options="filterOptions"
                @change="fetchRequests"
              />
              <a-input
                v-model:value="search"
                placeholder="Search by head, ID or phone"
                allow-clear
                class="search"
              >
                <template #prefix><SearchOutlined /></template>
              </a-input>
            </div>
          </section>

          <!-- ── Pending requests grouped as status columns ─────────────── -->
          <section class="panel">
            <div class="panel-title">Pending Requests by Action Type</div>
            <div class="status-row">
              <div
                v-for="col in statusColumns"
                :key="col.key"
                class="status-col"
              >
                <div class="status-col-head">
                  <span class="status-col-title">{{ col.title }}</span>
                  <span class="status-col-count" :class="col.accent">{{ col.list.length }}</span>
                </div>
                <div v-if="!col.list.length" class="status-col-empty">
                  {{ col.empty }}
                </div>
                <ul v-else class="status-col-list">
                  <li
                    v-for="req in col.list"
                    :key="req.id"
                    class="status-col-item"
                    @click="openDetail(req)"
                  >
                    <span class="sci-icon">◉</span>
                    <span class="sci-body">
                      <span class="sci-name">{{ householdHead(req) }}</span>
                      <span class="sci-meta">
                        {{ maskId(req.household && req.household.id_no) || '—' }}
                        · {{ relativeTime(req.created_at) }}
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- ── Detailed pending table ─────────────────────────────────── -->
          <section class="panel">
            <div class="panel-title">All Pending Requests</div>
            <a-table
              :columns="columns"
              :data-source="filteredRequests"
              :loading="loading"
              :pagination="{ pageSize: 12, showSizeChanger: false }"
              row-key="id"
              class="requests-table"
              :scroll="{ x: 1080 }"
              size="middle"
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

                <template v-else-if="column.key === 'initiator'">
                  <div class="hh-cell">
                    <strong>{{ (record.initiator && record.initiator.name) || '—' }}</strong>
                    <span class="muted">CHA</span>
                  </div>
                </template>

                <template v-else-if="column.key === 'submitted_at'">
                  {{ formatDate(record.created_at) }}
                </template>

                <template v-else-if="column.key === 'actions'">
                  <a-space>
                    <a-button size="small" @click="openDetail(record)">
                      <template #icon><EyeOutlined /></template>
                      View
                    </a-button>
                    <a-button
                      size="small"
                      type="primary"
                      :loading="actingId === record.id && actingType === 'approve'"
                      @click="approve(record)"
                    >
                      <template #icon><CheckOutlined /></template>
                      Approve
                    </a-button>
                    <a-button
                      size="small"
                      danger
                      :loading="actingId === record.id && actingType === 'reject'"
                      @click="openReject(record)"
                    >
                      <template #icon><CloseOutlined /></template>
                      Reject
                    </a-button>
                  </a-space>
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
          :body-style="{ paddingBottom: '80px' }"
        >
          <div v-if="detailRequest" class="detail">
            <div class="detail-section">
              <h4>Request</h4>
              <p>
                <a-tag :color="actionColor(detailRequest.action_type)">
                  {{ actionLabel(detailRequest.action_type) }}
                </a-tag>
                <span class="muted">#{{ detailRequest.id }}</span>
              </p>
              <p class="muted">Submitted {{ formatDate(detailRequest.created_at) }}</p>
            </div>

            <div v-if="detailRequest.household || detailRequest.create_payload" class="detail-section">
              <h4>Household Snapshot</h4>
              <div class="hh-snapshot">
                <div class="snap-row">
                  <span class="snap-label">Head</span>
                  <span class="snap-value">{{ householdHead(detailRequest) }}</span>
                </div>
                <div class="snap-row">
                  <span class="snap-label">ID Number</span>
                  <span class="snap-value">{{ (detailRequest.household && detailRequest.household.id_no) || (detailRequest.create_payload && detailRequest.create_payload.id_no) || '—' }}</span>
                </div>
                <div class="snap-row">
                  <span class="snap-label">Phone</span>
                  <span class="snap-value">{{ (detailRequest.household && detailRequest.household.phone_no) || (detailRequest.create_payload && detailRequest.create_payload.phone_no) || '—' }}</span>
                </div>
                <div class="snap-row">
                  <span class="snap-label">Members</span>
                  <span class="snap-value">
                    {{ (detailRequest.household && detailRequest.household.hh_size) != null
                        ? detailRequest.household.hh_size
                        : ((detailRequest.create_payload && detailRequest.create_payload.hh_size) != null
                            ? detailRequest.create_payload.hh_size
                            : '—') }}
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
              <h4>CHA notes</h4>
              <p class="notes-block">{{ detailRequest.notes }}</p>
            </div>

            <div class="detail-section">
              <h4>Submitted by</h4>
              <p>
                <strong>{{ (detailRequest.initiator && detailRequest.initiator.name) || '—' }}</strong>
                <span class="muted"> · CHA</span>
              </p>
            </div>
          </div>

          <template #footer>
            <a-space style="float: right">
              <a-button @click="detailOpen = false">Close</a-button>
              <a-button
                danger
                @click="openReject(detailRequest)"
                :disabled="!detailRequest"
              >
                Reject
              </a-button>
              <a-button
                type="primary"
                @click="approve(detailRequest)"
                :loading="actingId === (detailRequest && detailRequest.id) && actingType === 'approve'"
                :disabled="!detailRequest"
              >
                Approve
              </a-button>
            </a-space>
          </template>
        </a-drawer>

        <!-- Reject modal -->
        <a-modal
          v-model:visible="rejectOpen"
          title="Reject change request"
          :confirm-loading="actingType === 'reject'"
          @ok="confirmReject"
          ok-text="Reject request"
          ok-type="danger"
        >
          <p class="muted">
            Provide a short reason — it will be sent to the CHA so they understand
            why the request was rejected.
          </p>
          <a-textarea
            v-model:value="rejectReason"
            :rows="4"
            placeholder="e.g. Phone number doesn't match household head"
          />
        </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { message, Modal } from "ant-design-vue";
import axios from "@/Axiosconfig";
import { Main } from "../../styled";
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";
import {
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons-vue";

const loading = ref(false);
const requests = ref([]);
const search = ref("");
const activeFilter = ref("all");
const actingId = ref(null);
const actingType = ref(null);

const detailOpen = ref(false);
const detailRequest = ref(null);

const rejectOpen = ref(false);
const rejectReason = ref("");
const rejectTarget = ref(null);

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Phone change", value: "phone_change" },
  { label: "Mute", value: "mute" },
  { label: "Head change", value: "head_change" },
  { label: "Transfer", value: "transfer_in" },
  { label: "New household", value: "create" },
];

const columns = [
  { title: "Action", key: "action_type", width: 140 },
  { title: "Household", key: "household" },
  { title: "Submitted by", key: "initiator", width: 180 },
  { title: "Submitted", key: "submitted_at", width: 160 },
  { title: "", key: "actions", width: 270, align: "right" },
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

const relativeTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
};

const fmt = (n) => (n == null ? "0" : Number(n).toLocaleString());

const counts = computed(() => {
  const c = {
    total: requests.value.length,
    create: 0,
    mute: 0,
    transfer_in: 0,
    phone_change: 0,
    head_change: 0,
  };
  for (const r of requests.value) {
    if (c[r.action_type] !== undefined) c[r.action_type]++;
  }
  return c;
});

const filteredRequests = computed(() => {
  let rows = requests.value;
  if (activeFilter.value !== "all") {
    rows = rows.filter((r) => r.action_type === activeFilter.value);
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

const statusColumns = computed(() => {
  const groups = {
    phone_change: [],
    mute: [],
    head_change: [],
    transfer_in: [],
    create: [],
  };
  for (const r of requests.value) {
    if (groups[r.action_type]) groups[r.action_type].push(r);
  }
  return [
    {
      key: "phone_change",
      title: "Phone Change",
      accent: "accent-info",
      empty: "No pending phone changes",
      list: groups.phone_change,
    },
    {
      key: "mute",
      title: "Mute",
      accent: "accent-danger",
      empty: "No pending mutes",
      list: groups.mute,
    },
    {
      key: "head_change",
      title: "Head Change",
      accent: "accent-warning",
      empty: "No pending head changes",
      list: groups.head_change,
    },
    {
      key: "transfer_in",
      title: "Transfer",
      accent: "accent-info",
      empty: "No pending transfers",
      list: groups.transfer_in,
    },
    {
      key: "create",
      title: "New Household",
      accent: "accent-success",
      empty: "No new household requests",
      list: groups.create,
    },
  ];
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

const currentLocationName = computed(() => {
  const h = detailRequest.value && detailRequest.value.household;
  if (!h) return "";
  if (h.location && (h.location.name || h.location.org_name)) {
    return h.location.name || h.location.org_name;
  }
  return h.location_id ? `Location #${h.location_id}` : "";
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

const fetchRequests = async () => {
  loading.value = true;
  try {
    const params = {};
    if (activeFilter.value !== "all") params.action_type = activeFilter.value;
    const res = await axios.get("hh_change_requests/pending", { params });
    const payload = res.data && res.data.data;
    requests.value = Array.isArray(payload)
      ? payload
      : (payload && payload.data) || [];
  } catch (err) {
    message.error(
      (err && err.response && err.response.data && err.response.data.message) ||
        "Failed to load pending requests."
    );
  } finally {
    loading.value = false;
  }
};

const openDetail = (record) => {
  detailRequest.value = record;
  detailOpen.value = true;
};

const approve = (record) => {
  if (!record) return;
  Modal.confirm({
    title: "Approve this change request?",
    content: `This will apply the ${actionLabel(
      record.action_type
    ).toLowerCase()} to the household immediately and notify the CHA.`,
    okText: "Approve",
    okType: "primary",
    cancelText: "Cancel",
    async onOk() {
      actingId.value = record.id;
      actingType.value = "approve";
      try {
        await axios.post(`hh_change_request/${record.id}/approve`);
        message.success("Request approved.");
        requests.value = requests.value.filter((r) => r.id !== record.id);
        if (detailRequest.value && detailRequest.value.id === record.id) {
          detailOpen.value = false;
        }
      } catch (err) {
        message.error(
          (err &&
            err.response &&
            err.response.data &&
            err.response.data.message) ||
            "Failed to approve request."
        );
      } finally {
        actingId.value = null;
        actingType.value = null;
      }
    },
  });
};

const openReject = (record) => {
  if (!record) return;
  rejectTarget.value = record;
  rejectReason.value = "";
  rejectOpen.value = true;
};

const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    message.warning("Please provide a reason for rejection.");
    return;
  }
  const record = rejectTarget.value;
  actingId.value = record.id;
  actingType.value = "reject";
  try {
    await axios.post(`hh_change_request/${record.id}/reject`, {
      rejection_reason: rejectReason.value.trim(),
    });
    message.success("Request rejected.");
    requests.value = requests.value.filter((r) => r.id !== record.id);
    rejectOpen.value = false;
    if (detailRequest.value && detailRequest.value.id === record.id) {
      detailOpen.value = false;
    }
  } catch (err) {
    message.error(
      (err && err.response && err.response.data && err.response.data.message) ||
        "Failed to reject request."
    );
  } finally {
    actingId.value = null;
    actingType.value = null;
  }
};

onMounted(fetchRequests);
</script>

<style lang="less" scoped>
/* Green-gradient palette aligned with budget dashboards */
.hh-review-dashboard {
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

  /* Panels */
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
  }

  /* Tile grid */
  .tile-row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .tile-row-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
  @media (max-width: 1100px) {
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
      line-height: 1.2;
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

  /* Filter panel */
  .filter-panel {
    padding: 12px 16px;
  }
  .filter-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;

    .search {
      max-width: 320px;
    }
  }

  /* Status columns */
  .status-row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  @media (max-width: 1100px) {
    .status-row {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
  }

  .status-col {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 8px;
    padding: 12px 12px 10px;
    min-height: 220px;
    display: flex;
    flex-direction: column;

    .status-col-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .status-col-title {
        font-size: 12px;
        font-weight: 700;
        color: #2f6746;
      }
      .status-col-count {
        font-size: 11px;
        font-weight: 700;
        color: #fff;
        background: #4d8a63;
        border-radius: 999px;
        padding: 1px 8px;
        min-width: 22px;
        text-align: center;
        &.accent-info { background: #2c99ff; }
        &.accent-success { background: #20c997; }
        &.accent-warning { background: #fa8b0c; }
        &.accent-danger { background: #ff4d4f; }
      }
    }

    .status-col-empty {
      color: #b0b8c3;
      font-size: 11px;
      flex: 1;
    }

    .status-col-list {
      list-style: none;
      margin: 0;
      padding: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
      max-height: 320px;
    }
    .status-col-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 10px;
      background: #f6fbf8;
      border: 1px solid #eaf4ee;
      border-radius: 6px;
      font-size: 12px;
      color: #1f2437;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;

      &:hover {
        background: #ecf7f1;
        border-color: #c5e6d4;
      }

      .sci-icon {
        font-size: 10px;
        color: #4d8a63;
        margin-top: 4px;
      }
      .sci-body {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }
      .sci-name {
        font-weight: 600;
        color: #15693c;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sci-meta {
        font-size: 11px;
        color: #7a8a82;
        margin-top: 1px;
      }
    }
  }

  /* Table */
  .requests-table {
    :deep(.ant-table) {
      background: transparent;
    }
    :deep(.ant-table-thead > tr > th) {
      background: #f6fbf8;
      color: #2f6746;
      font-weight: 700;
      font-size: 12px;
      border-bottom: 1px solid #d9f0e2;
    }
    :deep(.ant-table-tbody > tr > td) {
      border-bottom: 1px solid #eef5f1;
    }
    :deep(.ant-table-tbody > tr:hover > td) {
      background: #f9fdfb;
    }
  }

  .hh-cell {
    display: flex;
    flex-direction: column;
    line-height: 1.3;

    strong {
      color: #15693c;
    }
    .muted {
      color: #7a8a82;
      font-size: 11.5px;
    }
  }
}
</style>

<!-- Drawer content is teleported outside scoped styles -->
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
    p {
      margin: 0 0 4px 0;
    }
    .muted {
      color: #7a8a82;
      font-size: 12px;
    }
    .notes-block {
      background: #f6fbf8;
      border: 1px solid #e1efe6;
      border-radius: 8px;
      padding: 10px 12px;
      white-space: pre-wrap;
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

      &:last-child {
        border-bottom: none;
      }

      .diff-label {
        font-weight: 600;
        color: #2f6746;
      }
      .diff-from {
        color: #b0b8c3;
        text-decoration: line-through;
      }
      .diff-arrow {
        color: #b0b8c3;
      }
      .diff-to {
        color: #15693c;
        font-weight: 700;
      }
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
