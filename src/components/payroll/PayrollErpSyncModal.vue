<template>
  <a-modal
    :title="title"
    :visible="visible"
    :width="760"
    :footer="null"
    @cancel="close"
  >
    <div v-if="loading" class="erp-sync-loading">
      <a-spin />
    </div>
    <div v-else-if="summary">
      <h3 class="erp-sync-title">{{ summary.name }}</h3>

      <div class="erp-summary-grid">
        <div class="erp-summary-item">
          <span class="label">Participants</span>
          <span class="value">{{ summary.participants }}</span>
        </div>
        <div class="erp-summary-item">
          <span class="label">Total amount</span>
          <span class="value">{{ money(summary.total_amount) }}</span>
        </div>
        <div class="erp-summary-item" v-if="summary.level">
          <span class="label">Level</span>
          <span class="value">{{ summary.level }}</span>
        </div>
        <div class="erp-summary-item" v-if="summary.location">
          <span class="label">Location</span>
          <span class="value">{{ summary.location }}</span>
        </div>
        <div class="erp-summary-item" v-if="summary.no_of_days">
          <span class="label">Days</span>
          <span class="value">{{ summary.no_of_days }}</span>
        </div>
        <div class="erp-summary-item" v-if="summary.start_date">
          <span class="label">Start date</span>
          <span class="value">{{ summary.start_date }}</span>
        </div>
      </div>

      <h4 class="erp-section-title">Allowance breakdown</h4>
      <div class="erp-breakdown">
        <div><span>Airtime</span><b>{{ money(breakdownTotals.airtime_amount) }}</b></div>
        <div><span>Perdiem</span><b>{{ money(breakdownTotals.perdiem_amount) }}</b></div>
        <div><span>Transport</span><b>{{ money(breakdownTotals.transport_amount) }}</b></div>
        <div><span>Lunch</span><b>{{ money(breakdownTotals.lunch_amount) }}</b></div>
      </div>

      <div class="erp-participants">
        <div class="erp-participants-head">
          <h4 class="erp-section-title">Participant sync checklist</h4>
          <span
            class="erp-badge badge-orange"
            v-if="summary.synced_participants > 0 && !summary.all_synced"
          >
            Partial sync ({{ summary.synced_participants }}/{{ summary.participants }})
          </span>
          <span
            class="erp-badge badge-green"
            v-else-if="summary.all_synced && summary.participants > 0"
          >
            Fully synced
          </span>
        </div>

        <p class="erp-participants-hint">
          Tick the participants that have not synced yet and submit them, or use
          “Sync to ERP” to push every un-synced record.
        </p>

        <div class="erp-participants-list">
          <div class="erp-participant-row" v-for="p in participants" :key="p.id">
            <a-checkbox
              :checked="p.sync_status === 1 || selectedIds.includes(p.id)"
              :disabled="p.sync_status === 1 || running"
              @change="toggleSelect(p)"
            />
            <span class="erp-participant-name">{{ p.name }}</span>
            <span class="erp-participant-id">{{ p.id_number }}</span>
            <span class="erp-participant-amount">{{ money(p.amount) }}</span>
            <span
              class="erp-badge badge-green"
              v-if="p.sync_status === 1"
              :title="p.transaction_code || ''"
              >Synced</span
            >
            <span class="erp-badge badge-red" v-else-if="p.sync_status === 2" :title="p.error || ''"
              >Failed</span
            >
            <span class="erp-badge badge-grey" v-else>Not synced</span>
          </div>
        </div>
      </div>

      <div class="erp-progress" v-if="showProgress">
        <a-progress :percent="progress.percentage" :status="progressStatus" />
        <div class="erp-progress-meta">
          <span class="erp-badge badge-grey" v-if="progress.status === 'queued'">Queued…</span>
          <span class="erp-badge badge-green" v-if="progress.synced > 0">
            {{ progress.synced }} synced
          </span>
          <span class="erp-badge badge-red" v-if="progress.failed > 0">
            {{ progress.failed }} failed
          </span>
          <span class="erp-processed">
            Processed {{ progress.processed }} / {{ progress.total }}
          </span>
        </div>
        <p class="erp-error" v-if="progress.error">{{ progress.error }}</p>
        <details class="erp-log-wrap" v-if="progress.response_log">
          <summary>ERP response (diagnostics)</summary>
          <pre class="erp-log">{{ progress.response_log }}</pre>
        </details>
      </div>

      <div class="erp-sync-actions">
        <sdButton
          type="primary"
          :disabled="running || unsyncedCount === 0"
          @click="startSync"
        >
          {{ running ? "Syncing…" : syncLabel }}
        </sdButton>
        <sdButton v-if="summary.all_synced" type="success" @click="approve">
          Approve payroll
        </sdButton>
        <sdButton type="default" @click="close">Close</sdButton>
      </div>
    </div>
    <div v-else class="erp-sync-empty">No payroll summary available.</div>
  </a-modal>
</template>

<script setup>
import { computed, ref, watch, defineProps, defineEmits } from "vue";
import axios from "@/Axiosconfig";
import { notification } from "ant-design-vue";
import authHeader from "../../services/auth-header";

const props = defineProps({
  visible: { type: Boolean, default: false },
  payrollId: { type: [Number, String], default: null },
  payrollType: { type: String, default: "event" },
  primaryLabel: { type: String, default: "Sync to ERP" },
});

const emit = defineEmits(["update:visible", "synced", "approve"]);

const base = process.env.VUE_APP_BASE_URL;
const loading = ref(false);
const summary = ref(null);
const running = ref(false);
const participants = ref([]);
const selectedIds = ref([]);
const progress = ref({
  status: "not_started",
  total: 0,
  processed: 0,
  synced: 0,
  failed: 0,
  percentage: 0,
});

let pollTimer = null;

const title = computed(() =>
  props.payrollType === "activity"
    ? "Approve & sync activity payroll to ERP"
    : "Approve & sync event payroll to ERP"
);

const breakdownTotals = computed(
  () =>
    summary.value?.breakdown_totals || {
      airtime_amount: 0,
      perdiem_amount: 0,
      transport_amount: 0,
      lunch_amount: 0,
    }
);

const showProgress = computed(() =>
  ["queued", "processing", "completed", "failed"].includes(progress.value.status)
);

const unsyncedCount = computed(
  () => participants.value.filter((p) => p.sync_status !== 1).length
);

const syncLabel = computed(() =>
  selectedIds.value.length
    ? `Sync ${selectedIds.value.length} selected`
    : "Sync to ERP"
);

const progressStatus = computed(() => {
  if (progress.value.status === "failed") return "exception";
  if (progress.value.status === "completed") {
    return progress.value.failed > 0 ? "exception" : "success";
  }
  return "active";
});

const money = (value) => new Intl.NumberFormat().format(Number(value || 0));

const endpoint = (suffix) => `${base}/${props.payrollType}_payroll_${suffix}`;

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  running.value = false;
};

const fetchStatus = async () => {
  if (!props.payrollId) return;
  try {
    const res = await axios.get(
      `${endpoint("sync_status")}?payroll_id=${props.payrollId}`,
      { headers: authHeader() }
    );
    if (res.data.success) {
      progress.value = res.data.data;
      if (["completed", "failed"].includes(progress.value.status)) {
        stopPolling();
      }
    }
  } catch (error) {
    // keep polling
  }
};

const startPolling = () => {
  stopPolling();
  running.value = true;
  pollTimer = setInterval(fetchStatus, 2000);
  fetchStatus();
};

const fetchSummary = async () => {
  if (!props.payrollId) return;
  loading.value = true;
  try {
    const res = await axios.get(
      `${endpoint("sync_summary")}?payroll_id=${props.payrollId}`,
      { headers: authHeader() }
    );
    if (res.data.success) {
      summary.value = res.data.data;
      if (res.data.data.sync) {
        progress.value = res.data.data.sync;
        if (["queued", "processing"].includes(progress.value.status)) {
          startPolling();
        }
      }
    } else {
      notification.error({ message: "Error", description: res.data.message });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description:
        error?.response?.data?.message || "Failed to load the payroll summary",
    });
  } finally {
    loading.value = false;
  }
};

const startSync = async () => {
  if (!props.payrollId) return;

  const selected = selectedIds.value.length
    ? selectedIds.value
    : participants.value
        .filter((p) => p.sync_status !== 1)
        .map((p) => p.id);

  try {
    const res = await axios.post(
      endpoint("sync"),
      { payroll_id: props.payrollId, payroll_list_ids: selected },
      { headers: authHeader() }
    );
    if (res.data.success) {
      notification.info({
        message: "Sync queued",
        description: "Your payroll is being pushed to the ERP.",
      });
      selectedIds.value = [];
      progress.value = {
        status: "queued",
        total: res.data.total || 0,
        processed: 0,
        synced: 0,
        failed: 0,
        percentage: 0,
      };
      startPolling();
    } else {
      notification.error({
        message: "Sync Failed",
        description: res.data.message,
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description:
        error?.response?.data?.message || "Failed to queue the payroll sync",
    });
  }
};

const fetchParticipants = async () => {
  if (!props.payrollId) return;
  try {
    const res = await axios.get(
      `${endpoint("sync_participants")}?payroll_id=${props.payrollId}`,
      { headers: authHeader() }
    );
    if (res.data.success) {
      participants.value = res.data.data.participants || [];
      // Drop any selection that is now synced.
      selectedIds.value = selectedIds.value.filter((id) =>
        participants.value.some((p) => p.id === id && p.sync_status !== 1)
      );
    }
  } catch (error) {
    // non-blocking
  }
};

const toggleSelect = (participant) => {
  if (participant.sync_status === 1 || running.value) return;
  selectedIds.value = selectedIds.value.includes(participant.id)
    ? selectedIds.value.filter((id) => id !== participant.id)
    : [...selectedIds.value, participant.id];
};

const refresh = async () => {
  await fetchSummary();
  await fetchParticipants();
};

const approve = () => {
  emit("approve");
};

const close = () => {
  stopPolling();
  emit("update:visible", false);
};

watch(
  () => progress.value.status,
  async (status) => {
    if (status === "completed") {
      selectedIds.value = [];
      await refresh();
      emit("synced", {
        ...progress.value,
        all_synced: summary.value?.all_synced === true,
      });
      notification.success({
        message: "Sync complete",
        description: `${progress.value.synced} synced, ${progress.value.failed} failed`,
      });
    } else if (status === "failed") {
      notification.error({
        message: "Sync failed",
        description: progress.value.error || "The sync could not be completed",
      });
    }
  }
);

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      fetchSummary();
      fetchParticipants();
    } else {
      stopPolling();
    }
  }
);
</script>

<style scoped>
.erp-sync-loading {
  padding: 40px;
  text-align: center;
}
.erp-sync-title {
  margin-bottom: 16px;
}
.erp-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}
.erp-summary-item {
  background: #f7f8fa;
  border-radius: 6px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
}
.erp-summary-item .label {
  font-size: 12px;
  color: #8c8c8c;
}
.erp-summary-item .value {
  font-size: 16px;
  font-weight: 600;
  color: #272b41;
}
.erp-section-title {
  margin: 8px 0 10px;
}
.erp-participants {
  margin-bottom: 18px;
}
.erp-participants-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.erp-participants-hint {
  color: #8c8c8c;
  font-size: 12px;
  margin: 4px 0 10px;
}
.erp-participants-list {
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}
.erp-participant-row {
  display: grid;
  grid-template-columns: 28px 2fr 1.2fr 1fr 90px;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-bottom: 1px solid #f5f5f5;
}
.erp-participant-row:last-child {
  border-bottom: none;
}
.erp-participant-name {
  font-weight: 500;
  color: #272b41;
}
.erp-participant-id,
.erp-participant-amount {
  color: #595959;
  font-size: 13px;
}
.badge-orange {
  background: #faad14;
}
.erp-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}
.erp-breakdown div {
  display: flex;
  justify-content: space-between;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 8px 12px;
}
.erp-progress {
  margin-bottom: 18px;
}
.erp-progress-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.erp-processed {
  color: #8c8c8c;
  font-size: 13px;
}
.erp-error {
  color: #ff4d4f;
  font-size: 12px;
  margin: 8px 0 0;
  word-break: break-word;
}
.erp-log-wrap {
  margin-top: 10px;
  font-size: 12px;
  color: #595959;
}
.erp-log {
  max-height: 180px;
  overflow: auto;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 6px 0 0;
}
.erp-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}
.badge-green {
  background: #1ec997;
}
.badge-red {
  background: #ff4d4f;
}
.badge-grey {
  background: #bfbfbf;
}
.erp-sync-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.erp-sync-empty {
  padding: 30px;
  text-align: center;
  color: #8c8c8c;
}
</style>
