<template>
  <a-modal
    :visible="visible"
    :title="`Submit for Payroll — ${event?.name || ''}`"
    :width="640"
    :mask-closable="false"
    :footer="null"
    @cancel="onCancel"
  >
    <div class="sp-modal">
      <div v-if="loading" class="sp-loading">
        <a-spin />
        <span>Checking readiness…</span>
      </div>

      <template v-else>
        <p class="sp-intro">
          Submitting locks the closed event for payroll processing and enables
          payroll generation. Confirm the checklist below.
        </p>

        <!-- Checklist -->
        <ul class="sp-checklist">
          <li :class="checkClass(isClosed)">
            <sdFeatherIcons :type="isClosed ? 'check-circle' : 'alert-circle'" size="15" />
            <span>Event is closed</span>
          </li>
          <li :class="checkClass(hasLso)">
            <sdFeatherIcons :type="hasLso ? 'check-circle' : 'alert-circle'" size="15" />
            <span>
              LSO/LPO attached to the event vendor
              <em v-if="!hasLso" class="sp-meta">
                (upload the LSO/LPO for this event's vendor before submitting)
              </em>
            </span>
          </li>
          <li :class="checkClass(participantsValid)">
            <sdFeatherIcons :type="participantsValid ? 'check-circle' : 'alert-circle'" size="15" />
            <span>
              At least one confirmed participant
              <em class="sp-meta">
                ({{ participants.confirmed }} confirmed{{
                  participants.pending ? `, ${participants.pending} pending` : ""
                }})
              </em>
            </span>
          </li>
          <li :class="checkClass(uploadsComplete)">
            <sdFeatherIcons :type="uploadsComplete ? 'check-circle' : 'alert-circle'" size="15" />
            <span>Procurement / fuel documents complete</span>
          </li>
        </ul>

        <!-- Server-side blockers -->
        <a-alert
          v-if="blockers.length"
          type="warning"
          show-icon
          class="sp-blockers"
        >
          <template #message>Resolve before submitting</template>
          <template #description>
            <ul class="sp-blocker-list">
              <li v-for="(b, i) in blockers" :key="i">{{ b.message }}</li>
            </ul>
          </template>
        </a-alert>

        <!-- Comments (mandatory) -->
        <a-form layout="vertical" class="sp-form">
          <a-form-item
            label="Closure comments / notes"
            required
            :validate-status="commentsError ? 'error' : ''"
            :help="commentsError"
          >
            <a-textarea
              v-model:value="comments"
              :rows="4"
              placeholder="Justification, issues encountered, approval remarks, or any missing procurement / fuel details…"
              @blur="touchComments"
            />
          </a-form-item>
        </a-form>

        <div class="sp-actions">
          <sdButton size="small" type="light" outlined @click="onCancel">
            Cancel
          </sdButton>
          <sdButton
            size="small"
            type="success"
            :disabled="!canSubmit || submitting"
            @click="submit"
          >
            <sdFeatherIcons type="send" size="14" />&nbsp;
            {{ submitting ? "Submitting…" : "Submit for Payroll" }}
          </sdButton>
        </div>
      </template>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, computed, watch, defineProps, defineEmits } from "vue";
import { notification } from "ant-design-vue";
import axios from "@/Axiosconfig";

const props = defineProps({
  visible: { type: Boolean, default: false },
  event: { type: Object, default: null },
});

const emit = defineEmits(["update:visible", "submitted"]);

const loading = ref(false);
const submitting = ref(false);
const comments = ref("");
const commentsTouched = ref(false);
const blockers = ref([]);
const participants = reactive({ confirmed: 0, pending: 0, total: 0 });
const uploadStatus = reactive({
  complete: false,
  requires_uploads: false,
  has_lso: false,
});

const isClosed = computed(() => props.event && props.event.status === false);
const participantsValid = computed(() => participants.confirmed >= 1);
const uploadsComplete = computed(
  () => !uploadStatus.requires_uploads || uploadStatus.complete
);
// LSO/LPO is required on every event before payroll submission, regardless
// of whether the event was flagged as requiring a paid venue. The readiness
// endpoint returns `status.has_lso`.
const hasLso = computed(() => !!uploadStatus.has_lso);

const commentsError = computed(() =>
  commentsTouched.value && !String(comments.value).trim()
    ? "Comments are required to submit."
    : ""
);

const canSubmit = computed(
  () =>
    isClosed.value &&
    hasLso.value &&
    participantsValid.value &&
    uploadsComplete.value &&
    String(comments.value).trim().length > 0
);

const checkClass = (ok) => (ok ? "sp-ok" : "sp-pending");

watch(
  () => props.visible,
  (open) => {
    if (open && props.event) {
      comments.value = props.event.closure_comments || "";
      commentsTouched.value = false;
      blockers.value = [];
      fetchReadiness();
    }
  }
);

const fetchReadiness = async () => {
  if (!props.event) return;
  loading.value = true;
  try {
    const res = await axios.get(`event_payroll_readiness/${props.event.id}`);
    const data = res.data?.data || {};

    if (data.participants) {
      participants.confirmed = data.participants.confirmed ?? 0;
      participants.pending = data.participants.pending ?? 0;
      participants.total = data.participants.total ?? 0;
    }

    const status = data.status || {};
    uploadStatus.complete = !!status.complete;
    uploadStatus.requires_uploads = !!status.requires_uploads;
    uploadStatus.has_lso = !!status.has_lso;

    blockers.value = Array.isArray(data.blockers) ? data.blockers : [];
  } catch (e) {
    // Non-fatal: submit endpoint re-validates server-side.
    uploadStatus.complete = false;
    uploadStatus.requires_uploads = false;
    uploadStatus.has_lso = false;
  } finally {
    loading.value = false;
  }
};

const touchComments = () => {
  commentsTouched.value = true;
};

const submit = async () => {
  commentsTouched.value = true;
  if (!canSubmit.value) return;
  submitting.value = true;
  blockers.value = [];
  try {
    const res = await axios.post(`event_submit_payroll/${props.event.id}`, {
      closure_comments: comments.value.trim(),
    });
    if (res.data?.status === true) {
      notification.success({
        message: "Submitted for payroll",
        description: res.data.message,
      });
      emit("submitted", res.data.data);
      emit("update:visible", false);
    }
  } catch (e) {
    const data = e?.response?.data;
    if (e?.response?.status === 422 && data) {
      blockers.value = data.blockers || [
        { message: data.message || "The event cannot be submitted yet." },
      ];
      if (data.participants) {
        participants.confirmed = data.participants.confirmed ?? 0;
        participants.pending = data.participants.pending ?? 0;
        participants.total = data.participants.total ?? 0;
      }
      if (data.status) {
        uploadStatus.complete = !!data.status.complete;
        uploadStatus.requires_uploads = !!data.status.requires_uploads;
        uploadStatus.has_lso = !!data.status.has_lso;
      }
      notification.warning({
        message: "Cannot submit yet",
        description: data.message || "Resolve the highlighted items first.",
      });
    } else if (e?.response?.status === 409) {
      notification.info({
        message: "Already submitted",
        description: data?.message || "This event is already submitted for payroll.",
      });
      emit("submitted", data?.data);
      emit("update:visible", false);
    } else if (e?.response?.status === 401) {
      notification.error({
        message: "Not allowed",
        description: data?.message || "Only the event host can submit this event.",
      });
    } else {
      notification.error({
        message: "Error",
        description: data?.message || "Could not submit the event for payroll.",
      });
    }
  } finally {
    submitting.value = false;
  }
};

const onCancel = () => {
  emit("update:visible", false);
};
</script>

<style lang="less" scoped>
.sp-modal {
  .sp-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 40px 0;
    color: #7a8a82;
  }

  .sp-intro {
    color: #5f6c64;
    font-size: 13px;
    margin-bottom: 14px;
  }

  .sp-checklist {
    list-style: none;
    margin: 0 0 14px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #e6eef0;
    }
    .sp-meta {
      font-style: normal;
      font-weight: 500;
      color: #7a8a82;
    }
    .sp-ok {
      color: #15693c;
      background: #f3fcf6;
      border-color: #cdead9;
    }
    .sp-pending {
      color: #8a5b00;
      background: #fffaf0;
      border-color: #f3d39b;
    }
  }

  .sp-blockers {
    margin-bottom: 14px;
  }

  .sp-blocker-list {
    margin: 6px 0 0;
    padding-left: 18px;
    li {
      font-size: 13px;
      margin-bottom: 2px;
    }
  }

  .sp-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 4px;
    border-top: 1px solid #eef3f1;
    padding-top: 14px;
  }
}
</style>
