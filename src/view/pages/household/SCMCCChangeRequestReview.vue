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
            <div class="tile-row tile-row-8">
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
              <div class="tile">
                <div class="tile-icon accent-success">✓</div>
                <div class="tile-label">Accepted</div>
                <div class="tile-value">{{ fmt(decisionTotals.accepted) }}</div>
                <div class="tile-sub">Approved by you</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-danger">✗</div>
                <div class="tile-label">Rejected</div>
                <div class="tile-value">{{ fmt(decisionTotals.rejected) }}</div>
                <div class="tile-sub">Rejected by you</div>
              </div>
            </div>
          </section>

          <!-- ── Detailed pending table ─────────────────────────────────── -->
          <section class="panel">
            <div class="panel-title">All Pending Requests</div>

            <!-- Desktop / tablet: table -->
            <a-table
              :columns="columns"
              :data-source="filteredRequests"
              :loading="loading"
              :pagination="{ pageSize: 12, showSizeChanger: false }"
              row-key="id"
              :row-class-name="highlightRowClass"
              class="requests-table desktop-only"
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
                    <strong>{{ chaName(record) }}</strong>
                    <span class="muted">CHA · {{ chaSubLocation(record) }}</span>
                  </div>
                </template>

                <template v-else-if="column.key === 'submitted_at'">
                  {{ formatDate(record.created_at) }}
                </template>

                <template v-else-if="column.key === 'actions'">
                  <a-button size="small" type="primary" ghost @click="openDetail(record)">
                    <template #icon><EyeOutlined /></template>
                    Review
                  </a-button>
                </template>
              </template>
            </a-table>

            <!-- Mobile: card list -->
            <div class="mobile-only request-cards">
              <div
                v-for="req in filteredRequests"
                :key="'m-' + req.id"
                :class="['req-card', { highlighted: String(req.id) === String(highlightId) }]"
                :ref="(el) => registerCardRef(req.id, el)"
                @click="openDetail(req)"
              >
                <div class="rc-head">
                  <a-tag :color="actionColor(req.action_type)" class="rc-tag">
                    {{ actionLabel(req.action_type) }}
                  </a-tag>
                  <span class="rc-time">{{ relativeTime(req.created_at) }}</span>
                </div>
                <div class="rc-name">{{ householdHead(req) }}</div>
                <div class="rc-meta">
                  <span>ID {{ maskId(req.household && req.household.id_no) || '—' }}</span>
                  <span>{{ maskPhone(req.household && req.household.phone_no) || '—' }}</span>
                  <span v-if="householdVillage(req)">Village: {{ householdVillage(req) }}</span>
                </div>
                <div class="rc-footer">
                  <span class="rc-by">
                    By <strong>{{ chaName(req) }}</strong>
                    · CHA · {{ chaSubLocation(req) }}
                  </span>
                  <a-button size="small" type="primary" ghost @click.stop="openDetail(req)">
                    <template #icon><EyeOutlined /></template>
                    Review
                  </a-button>
                </div>
              </div>
              <div v-if="!filteredRequests.length && !loading" class="req-cards-empty">
                No pending requests.
              </div>
            </div>
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
              <h4>Submitted by (CHA)</h4>
              <div class="hh-snapshot">
                <div class="snap-row">
                  <span class="snap-label">Name</span>
                  <span class="snap-value">{{ chaName(detailRequest) }}</span>
                </div>
                <div class="snap-row">
                  <span class="snap-label">Sub-location</span>
                  <span class="snap-value">{{ chaSubLocation(detailRequest) }}</span>
                </div>
                <div class="snap-row">
                  <span class="snap-label">Phone</span>
                  <span class="snap-value">
                    <template v-if="chaPhone(detailRequest)">
                      <a :href="`tel:${chaPhone(detailRequest)}`">{{ chaPhone(detailRequest) }}</a>
                    </template>
                    <template v-else>—</template>
                  </span>
                </div>
              </div>
            </div>

            <!-- Prev/next pager (sticky on mobile) -->
            <div class="drawer-pager">
              <a-button
                :disabled="!hasPrevRequest"
                @click="gotoPrev"
                class="pager-btn"
              >
                <template #icon><LeftOutlined /></template>
                Previous
              </a-button>
              <span class="pager-counter">
                {{ currentDetailIndex + 1 }} / {{ filteredRequests.length }}
              </span>
              <a-button
                :disabled="!hasNextRequest"
                @click="gotoNext"
                class="pager-btn"
              >
                Next
                <template #icon><RightOutlined /></template>
              </a-button>
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
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { message, Modal } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/Axiosconfig";
import { Main } from "../../styled";
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";
import {
  ReloadOutlined,
  EyeOutlined,
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons-vue";

const loading = ref(false);
const requests = ref([]);
const decisionTotals = ref({ accepted: 0, rejected: 0 });
const search = ref("");
const activeFilter = ref("all");
const actingId = ref(null);
const actingType = ref(null);

const route = useRoute();
const router = useRouter();
const highlightId = ref(route.query.highlight ? String(route.query.highlight) : null);
const cardRefs = {};
const registerCardRef = (id, el) => {
  if (el) cardRefs[id] = el;
  else delete cardRefs[id];
};

const detailOpen = ref(false);
const detailRequest = ref(null);

const rejectOpen = ref(false);
const rejectReason = ref("");
const rejectTarget = ref(null);

const columns = [
  { title: "Action", key: "action_type", width: 130 },
  { title: "Household", key: "household" },
  { title: "Submitted by (CHA · Sub-location)", key: "initiator", width: 220 },
  { title: "Submitted", key: "submitted_at", width: 160 },
  { title: "", key: "actions", width: 130, align: "right" },
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

const chaName = (req) => {
  const u = req && req.initiator;
  if (!u) return "—";
  const composed = [u.first_name, u.middle_name, u.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return composed || u.name || u.email || "—";
};

const chaSubLocation = (req) => {
  const u = req && req.initiator;
  if (u && u.location && (u.location.name || u.location.org_name)) {
    return u.location.name || u.location.org_name;
  }
  return "—";
};

const chaPhone = (req) => {
  const u = req && req.initiator;
  return (u && (u.phone_no || u.phone)) || "";
};

const householdVillage = (req) => {
  const h = req && req.household;
  if (h && h.location && (h.location.name || h.location.org_name)) {
    return h.location.name || h.location.org_name;
  }
  return "";
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
    const totals = res.data && res.data.totals;
    decisionTotals.value = {
      accepted: Number(totals && totals.accepted) || 0,
      rejected: Number(totals && totals.rejected) || 0,
    };
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

// Drawer pager — navigate prev/next within the current filtered list.
const currentDetailIndex = computed(() => {
  if (!detailRequest.value) return -1;
  return filteredRequests.value.findIndex(
    (r) => String(r.id) === String(detailRequest.value.id)
  );
});
const hasPrevRequest = computed(() => currentDetailIndex.value > 0);
const hasNextRequest = computed(
  () =>
    currentDetailIndex.value >= 0 &&
    currentDetailIndex.value < filteredRequests.value.length - 1
);
const gotoPrev = () => {
  if (!hasPrevRequest.value) return;
  detailRequest.value = filteredRequests.value[currentDetailIndex.value - 1];
};
const gotoNext = () => {
  if (!hasNextRequest.value) return;
  detailRequest.value = filteredRequests.value[currentDetailIndex.value + 1];
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

// Watch route + requests so a notification deep-link (?highlight=ID) scrolls
// to and opens the target request once it has loaded.
const applyHighlight = async () => {
  const id = highlightId.value;
  if (!id) return;
  let match = requests.value.find((r) => String(r.id) === String(id));
  // If the highlighted request isn't in our cached list (e.g. brand-new
  // submission while the user was on a different page), refresh once before
  // giving up.
  if (!match) {
    await fetchRequests();
    match = requests.value.find((r) => String(r.id) === String(id));
    if (!match) return;
  }
  await nextTick();
  const el = cardRefs[id] || document.querySelector(`[data-row-key="${id}"]`);
  if (el && typeof el.scrollIntoView === "function") {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  openDetail(match);
  // Clear after applying so it doesn't re-trigger.
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

// Also react when the bell appends a `_t` cache-buster to force re-navigation
// while already on this page (same path + same highlight).
watch(() => route.query._t, () => {
  if (route.query.highlight) {
    highlightId.value = String(route.query.highlight);
    applyHighlight();
  }
});

watch(requests, () => {
  if (highlightId.value) applyHighlight();
});

const highlightRowClass = (record) =>
  String(record.id) === String(highlightId.value) ? "highlighted-row" : "";
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
  .tile-row-8 {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  @media (max-width: 1400px) {
    .tile-row-8 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
  @media (max-width: 1100px) {
    .tile-row-6,
    .tile-row-8 {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
  }
  @media (max-width: 640px) {
    .tile-row,
    .tile-row-6,
    .tile-row-8 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .tile {
      padding: 10px 8px;
      .tile-value { font-size: 18px; }
      .tile-label { font-size: 10px; }
      .tile-sub { font-size: 10px; }
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

  /* ── Desktop vs mobile rendering of the requests list ─────────── */
  .desktop-only { display: block; }
  .mobile-only { display: none !important; }

  /* Highlighted row from notification deep-link */
  :deep(.highlighted-row > td) {
    background: #fff8d6 !important;
    transition: background 0.4s ease;
  }
  .req-card.highlighted {
    border-color: #f0c000;
    box-shadow: 0 0 0 2px rgba(240, 192, 0, 0.35);
    background: #fffbe5;
  }

  /* ── Mobile request cards ─────────────────────────────────────── */
  .request-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .req-card {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 10px;
    padding: 12px 14px;
    box-shadow: 0 2px 6px rgba(28, 122, 72, 0.05);
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;

    &:active {
      transform: scale(0.995);
      border-color: #9ad8b4;
    }

    .rc-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      gap: 8px;
    }
    .rc-tag {
      margin: 0;
      font-size: 11px;
    }
    .rc-time {
      font-size: 11px;
      color: #7a8a82;
      white-space: nowrap;
    }
    .rc-name {
      font-size: 14px;
      font-weight: 700;
      color: #15693c;
      line-height: 1.3;
      margin-bottom: 4px;
      word-break: break-word;
    }
    .rc-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      font-size: 11.5px;
      color: #7a8a82;
      margin-bottom: 10px;
    }
    .rc-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px dashed #eef5f1;

      .rc-by {
        font-size: 11.5px;
        color: #7a8a82;
        strong { color: #2f6746; }
      }
    }
  }
  .req-cards-empty {
    text-align: center;
    color: #b0b8c3;
    font-size: 12px;
    padding: 24px 8px;
  }

  /* ── Mobile responsive ───────────────────────────────────────────── */
  @media (max-width: 768px) {
    .desktop-only { display: none !important; }
    .mobile-only { display: block !important; }
    .mobile-only.request-cards { display: flex !important; }

    .panel {
      padding: 12px 12px 14px;
      border-radius: 8px;
    }
    .page-heading {
      .ph-title { font-size: 16px; }
      .ph-subtitle { font-size: 12px; }
    }
  }
  @media (max-width: 480px) {
    .page-heading {
      flex-direction: column;
      align-items: stretch;
      .ph-actions { justify-content: flex-end; }
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

  /* Prev/Next navigation — inline on desktop, sticky footer on mobile */
  .drawer-pager {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 18px 0 6px;
    padding: 10px 12px;
    background: #f6fbf8;
    border: 1px solid #e1efe6;
    border-radius: 10px;

    .pager-counter {
      font-size: 12px;
      color: #4d8a63;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      min-width: 56px;
      text-align: center;
    }
    .pager-btn {
      min-width: 110px;
      border-radius: 8px;
      font-weight: 600;
    }
  }
}

/* Mobile responsive drawer */
@media (max-width: 640px) {
  .ant-drawer-content-wrapper {
    width: 100% !important;
    max-width: 100% !important;
  }
  .ant-drawer .detail {
    /* Reserve space for the sticky pager so it doesn't cover content */
    padding-bottom: 72px;

    .diff-grid {
      grid-template-columns: 1fr;
    }
    .diff-arrow-col {
      transform: rotate(90deg);
      padding: 4px 0;
    }
    .hh-snapshot .snap-row {
      flex-direction: column;
      align-items: flex-start;
      .snap-value { max-width: 100%; text-align: left; }
    }

    .drawer-pager {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 64px; /* sits above the drawer footer (approve/reject) */
      margin: 0;
      border-radius: 0;
      border-left: none;
      border-right: none;
      padding: 10px 14px;
      background: #ffffff;
      box-shadow: 0 -6px 14px rgba(15, 23, 42, 0.08);
      z-index: 5;

      .pager-btn { min-width: 0; flex: 1; }
    }
  }
  .ant-drawer .ant-drawer-footer .ant-space {
    float: none !important;
    width: 100%;
    display: flex !important;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
}
</style>
