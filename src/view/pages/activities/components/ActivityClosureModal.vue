<template>
  <a-modal
    :visible="visible"
    :title="`Close Activity — ${activity?.name || activity?.activity_code || ''}`"
    :width="720"
    :mask-closable="false"
    :footer="null"
    @cancel="onCancel"
  >
    <div class="ac-modal">
      <div v-if="loading || (!statusLoaded && !loadError)" class="ac-loading">
        <a-spin />
        <span>Loading closure requirements…</span>
      </div>

      <div v-else-if="loadError" class="ac-load-error">
        <a-alert
          type="error"
          show-icon
          class="ac-blockers"
          message="Could not load closure requirements"
        >
          <template #description>{{ loadError }}</template>
        </a-alert>
        <div class="ac-actions">
          <sdButton size="small" type="light" outlined @click="onCancel">
            Cancel
          </sdButton>
          <sdButton size="small" type="primary" @click="fetchStatus()">
            Retry
          </sdButton>
        </div>
      </div>

      <template v-else>
        <p class="ac-intro">
          Closing an activity finalises its delivery and triggers the budget
          deduction. The activity closes at the end of its scheduled days; any
          required LSO/fuel documents and a closure comment must be in place.
        </p>

        <a-alert
          v-if="status.is_closed"
          type="success"
          show-icon
          class="ac-blockers"
          message="This activity is already closed."
        />

        <template v-else>
          <a-alert
            v-if="!status.is_final_day"
            type="info"
            show-icon
            class="ac-blockers"
          >
            <template #message>Closure is due at the end of the activity</template>
            <template #description>
              This activity can only be closed on or after its final day<span
                v-if="status.final_day"
              >
                ({{ status.final_day }})</span
              >. You can upload the required documents now and close it then.
            </template>
          </a-alert>

          <a-alert
            v-else-if="visibleBlockers.length"
            type="warning"
            show-icon
            class="ac-blockers"
          >
            <template #message>Action required before closing</template>
            <template #description>
              <ul class="ac-blocker-list">
                <li v-for="(b, i) in visibleBlockers" :key="i">
                  {{ b.message }}
                </li>
              </ul>
            </template>
          </a-alert>

          <a-alert
            v-else-if="requiresUploads"
            type="success"
            show-icon
            class="ac-blockers"
            :message="
              status.has_closure_comment
                ? 'All required documents are in place.'
                : 'All required documents are in place. Add a comment to close the activity.'
            "
          />

          <a-alert
            v-else
            type="info"
            show-icon
            class="ac-blockers"
            :message="
              status.has_closure_comment
                ? 'This activity has no closure documents to upload.'
                : 'This activity has no closure documents to upload. Add a comment to close it.'
            "
          />
        </template>

        <!-- LSO / LPO link and LSO (PAS) document -->
        <section
          v-if="!status.is_closed && needsLsoSection"
          class="ac-section"
          :class="{ 'is-delinked': status.lso_delinked }"
        >
          <h4 class="ac-section-title">
            <sdFeatherIcons type="file-text" size="14" /> LSO / LPO &amp; PAS
            document
          </h4>
          <p v-if="status.lso_delinked" class="ac-hint is-warn">
            <sdFeatherIcons type="alert-triangle" size="12" />
            The LSO/LPO previously linked to this activity was delinked from its
            vendor. Link another LSO/LPO before closing.
          </p>
          <p v-else-if="needsLsoPicker" class="ac-hint">
            Link the LSO/LPO covering this activity.
          </p>

          <div v-if="needsLsoPicker" class="ac-row">
            <a-select
              v-model:value="lsoForm.vendor_lso_id"
              placeholder="Select an open LSO/LPO"
              allow-clear
              show-search
              option-filter-prop="label"
              :loading="lsoLoading"
              style="width: 100%"
            >
              <a-select-option
                v-for="lso in openLsos"
                :key="lso.id"
                :value="lso.id"
                :label="`${lso.lso_number || 'LSO'} — ${lso.vendor?.name || 'Vendor'}`"
              >
                <strong>{{ lso.lso_number || "LSO" }}</strong>
                <span> — {{ lso.vendor?.name || "Vendor" }}</span>
              </a-select-option>
            </a-select>
            <sdButton
              type="primary"
              size="small"
              :disabled="!lsoForm.vendor_lso_id || saving"
              @click="linkLso"
            >
              {{ lsoForm.file ? "Link & upload" : "Link" }}
            </sdButton>
          </div>

          <p v-else-if="status.has_lso" class="ac-chip ok">
            <sdFeatherIcons type="check-circle" size="12" /> LSO/LPO linked
          </p>

          <div v-if="needsLsoDocument" class="ac-upload-block">
            <p class="ac-hint">
              Upload the signed LSO (PAS) document for the linked LSO/LPO.
            </p>
            <a-upload
              :file-list="lsoFileList"
              :before-upload="onPickLsoFile"
              :max-count="1"
              accept=".pdf,.jpg,.jpeg,.png"
              @remove="clearLsoFile"
            >
              <sdButton size="small" type="light" outlined>
                <sdFeatherIcons type="upload" size="13" />&nbsp; Choose file
              </sdButton>
            </a-upload>
            <div class="ac-row-end">
              <sdButton
                type="primary"
                size="small"
                :disabled="!lsoForm.file || !status.vendor_lso_id || saving"
                @click="uploadLsoDocument"
              >
                Upload LSO document
              </sdButton>
            </div>
          </div>

          <p v-else-if="status.has_lso_document" class="ac-chip ok">
            <sdFeatherIcons type="check-circle" size="12" /> LSO (PAS) document
            uploaded
          </p>
        </section>

        <!-- Fuel receipts + work tickets per vehicle -->
        <section
          v-if="!status.is_closed && status.requires_fuel"
          class="ac-section"
        >
          <h4 class="ac-section-title">
            <sdFeatherIcons type="truck" size="14" /> Vehicle Fuel Receipts &amp;
            Work Tickets
          </h4>
          <p class="ac-hint">
            Add each vehicle's license plate, fuel amount, the fuel receipt (ETR)
            and the work ticket. Both documents are required for every vehicle.
          </p>

          <ul v-if="vehicles.length" class="ac-vehicle-list">
            <li
              v-for="v in vehicles"
              :key="v.id"
              class="ac-vehicle"
              :class="{
                'is-missing': !vehicleHasReceipt(v) || !vehicleHasWorkTicket(v),
              }"
            >
              <div class="ac-vehicle-head">
                <span class="ac-plate">{{ v.license_plate_number }}</span>
                <span class="ac-chips">
                  <span
                    class="ac-chip"
                    :class="vehicleHasReceipt(v) ? 'ok' : 'pending'"
                  >
                    {{
                      vehicleHasReceipt(v)
                        ? "Fuel receipt ✓"
                        : "Fuel receipt missing"
                    }}
                  </span>
                  <span
                    class="ac-chip"
                    :class="vehicleHasWorkTicket(v) ? 'ok' : 'pending'"
                  >
                    {{
                      vehicleHasWorkTicket(v)
                        ? "Work ticket ✓"
                        : "Work ticket missing"
                    }}
                  </span>
                </span>
              </div>
            </li>
          </ul>

          <a-form layout="vertical" class="ac-fuel-form">
            <div class="ac-fuel-grid">
              <a-form-item label="License plate">
                <a-input
                  v-model:value="fuelForm.license_plate_number"
                  placeholder="e.g. KDA 123A / GKA 543S"
                />
              </a-form-item>
              <a-form-item label="Fuel amount (KES)">
                <a-input-number
                  v-model:value="fuelForm.fuel_amount"
                  :min="0"
                  :step="100"
                  style="width: 100%"
                  placeholder="e.g. 5000"
                />
              </a-form-item>
            </div>
            <a-form-item label="Fuel receipt (ETR) document">
              <a-upload
                :file-list="fuelFileList"
                :before-upload="onPickFuelFile"
                :max-count="1"
                accept=".pdf,.jpg,.jpeg,.png"
                @remove="clearFuelFile"
              >
                <sdButton size="small" type="light" outlined>
                  <sdFeatherIcons type="upload" size="13" />&nbsp; Choose file
                </sdButton>
              </a-upload>
            </a-form-item>
            <a-form-item label="Work ticket document">
              <a-upload
                :file-list="fuelWorkTicketList"
                :before-upload="onPickFuelWorkTicket"
                :max-count="1"
                accept=".pdf,.jpg,.jpeg,.png"
                @remove="clearFuelWorkTicket"
              >
                <sdButton size="small" type="light" outlined>
                  <sdFeatherIcons type="upload" size="13" />&nbsp; Choose file
                </sdButton>
              </a-upload>
            </a-form-item>
            <div class="ac-row-end">
              <sdButton
                type="primary"
                size="small"
                :disabled="!canUploadFuel || saving"
                @click="uploadFuelReceipt"
              >
                Add receipt &amp; work ticket
              </sdButton>
            </div>
          </a-form>
        </section>

        <!-- Closure comment -->
        <section v-if="!status.is_closed" class="ac-section">
          <h4 class="ac-section-title">
            <sdFeatherIcons type="message-square" size="14" /> Closure comment
          </h4>
          <p class="ac-hint">
            Required. Describe what was delivered and note anything the payroll
            or budget team should know.
          </p>
          <a-textarea
            v-model:value="comments"
            :rows="3"
            :maxlength="2000"
            show-count
            placeholder="e.g. All five days delivered; attendance sheets and LSO/PAS filed."
            @change="commentsTouched = true"
          />
        </section>

        <div class="ac-actions">
          <sdButton size="small" type="light" outlined @click="onCancel">
            Cancel
          </sdButton>
          <sdButton
            size="small"
            type="danger"
            :disabled="!canClose || closing"
            @click="closeActivity"
          >
            <sdFeatherIcons type="x-circle" size="14" />&nbsp;
            {{ closing ? "Closing…" : "Close Activity" }}
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
  activity: { type: Object, default: null },
});

const emit = defineEmits(["update:visible", "closed"]);

const loading = ref(false);
const saving = ref(false);
const closing = ref(false);
// True once the backend status payload has loaded successfully. The Close
// Activity button stays disabled until then, so a failed request can never be
// mistaken for "this activity needs no documents".
const statusLoaded = ref(false);
const loadError = ref("");

const status = reactive({
  is_closed: false,
  requires_uploads: false,
  documents_required_now: false,
  requires_lso: false,
  has_lso: false,
  has_lso_document: false,
  vendor_lso_id: null,
  lso_delinked: false,
  requires_fuel: false,
  fuel: null,
  missing_types: [],
  complete: false,
  uploads: [],
  vehicles: [],
  is_final_day: false,
  final_day: null,
  closure_comments: "",
  has_closure_comment: false,
  blockers: [],
});

const comments = ref("");
const commentsTouched = ref(false);
const openLsos = ref([]);
const lsoLoading = ref(false);
const lsoForm = reactive({ vendor_lso_id: null, file: null });
const lsoFileList = ref([]);
const fuelForm = reactive({
  license_plate_number: "",
  fuel_amount: null,
  file: null,
  work_ticket: null,
});
const fuelFileList = ref([]);
const fuelWorkTicketList = ref([]);

const vehicles = computed(() => status.vehicles || []);
const requiresUploads = computed(() => !!status.requires_uploads);
const needsLsoSection = computed(
  () => status.requires_lso || status.lso_delinked
);
const needsLsoPicker = computed(
  () => (status.requires_lso && !status.has_lso) || status.lso_delinked
);
const needsLsoDocument = computed(
  () => status.requires_lso && !status.has_lso_document
);

/**
 * The backend always reports `comments_required` until the comment is saved.
 * Hide it while the creator is typing one — the close button still enforces a
 * non-empty comment.
 */
const visibleBlockers = computed(() => {
  const hasComment = comments.value.trim().length > 0;
  return (status.blockers || []).filter(
    (b) => !(b.code === "comments_required" && hasComment)
  );
});

const canClose = computed(
  () =>
    !!props.activity &&
    statusLoaded.value &&
    !loadError.value &&
    !status.is_closed &&
    status.is_final_day &&
    comments.value.trim().length > 0 &&
    (!status.documents_required_now || status.complete) &&
    !closing.value
);

const canUploadFuel = computed(
  () =>
    !!fuelForm.file &&
    !!fuelForm.work_ticket &&
    fuelForm.fuel_amount != null &&
    String(fuelForm.license_plate_number || "").trim().length >= 3
);

const resetStatus = () => {
  Object.assign(status, {
    is_closed: false,
    requires_uploads: false,
    documents_required_now: false,
    requires_lso: false,
    has_lso: false,
    has_lso_document: false,
    vendor_lso_id: null,
    lso_delinked: false,
    requires_fuel: false,
    fuel: null,
    missing_types: [],
    complete: false,
    uploads: [],
    vehicles: [],
    is_final_day: false,
    final_day: null,
    closure_comments: "",
    has_closure_comment: false,
    blockers: [],
  });
};

const resetForms = () => {
  lsoForm.vendor_lso_id = null;
  lsoForm.file = null;
  lsoFileList.value = [];
  fuelForm.license_plate_number = "";
  fuelForm.fuel_amount = null;
  fuelForm.file = null;
  fuelForm.work_ticket = null;
  fuelFileList.value = [];
  fuelWorkTicketList.value = [];
  comments.value = "";
  commentsTouched.value = false;
  openLsos.value = [];
};

watch(
  () => props.visible,
  (open) => {
    if (open && props.activity) {
      resetForms();
      resetStatus();
      loadError.value = "";
      statusLoaded.value = false;
      fetchStatus();
    }
  },
  { immediate: true }
);

const fetchStatus = async (silent = false) => {
  if (!props.activity) return;

  if (!silent) {
    loading.value = true;
    statusLoaded.value = false;
  }
  loadError.value = "";

  try {
    const res = await axios.get(`activity_closure_status/${props.activity.id}`);
    applyStatus(res.data?.data || {});
    statusLoaded.value = true;
  } catch (e) {
    const data = e?.response?.data;
    loadError.value = data?.message || "Could not load closure requirements.";
    notification.error({
      message:
        e?.response?.status === 401 || e?.response?.status === 403
          ? "Not allowed"
          : "Error",
      description: loadError.value,
    });
  } finally {
    if (!silent) loading.value = false;
  }
};

const applyStatus = (data) => {
  const uploads = data.uploads || {};

  status.is_closed = !!data.is_closed;
  status.requires_uploads = !!data.requires_uploads;
  status.documents_required_now = !!data.documents_required_now;
  status.requires_lso = !!data.requires_lso;
  status.has_lso = !!data.has_lso;
  status.has_lso_document = !!data.has_lso_document;
  status.vendor_lso_id = data.vendor_lso_id || null;
  status.lso_delinked = !!uploads.lso_delinked;
  status.requires_fuel = !!data.requires_fuel;
  status.fuel = data.fuel || null;
  status.missing_types = uploads.missing_types || [];
  status.complete = !!data.closure_ready;
  status.uploads = uploads.uploads || [];
  status.vehicles = uploads.vehicles || [];
  status.is_final_day = !!data.is_final_day;
  status.final_day = data.final_day || uploads.final_day || null;
  status.closure_comments = data.closure_comments || "";
  status.has_closure_comment = !!data.has_closure_comment;
  status.blockers = data.blockers || [];

  if (!commentsTouched.value) {
    comments.value = status.closure_comments;
  }

  if (needsLsoPicker.value && !openLsos.value.length) {
    fetchOpenLsos();
  }
};

const fetchOpenLsos = async () => {
  lsoLoading.value = true;
  try {
    const res = await axios.get("open_vendor_lsos");
    openLsos.value = res.data?.data || [];
  } catch (e) {
    openLsos.value = [];
  } finally {
    lsoLoading.value = false;
  }
};

const vehicleHasReceipt = (v) =>
  Array.isArray(v.fuel_receipts) && v.fuel_receipts.length > 0;
const vehicleHasWorkTicket = (v) =>
  Array.isArray(v.work_tickets) && v.work_tickets.length > 0;

const fileGuard = (file) => {
  const okType = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ].includes(file.type);
  const okSize = file.size <= 10 * 1024 * 1024;

  if (!okType) {
    notification.error({
      message: "Invalid file type",
      description: "PDF, JPG, JPEG or PNG only.",
    });
    return false;
  }
  if (!okSize) {
    notification.error({
      message: "File too large",
      description: "Max size 10MB.",
    });
    return false;
  }
  return true;
};

const onPickLsoFile = (file) => {
  if (!fileGuard(file)) return false;
  lsoForm.file = file;
  lsoFileList.value = [{ uid: file.uid, name: file.name, status: "done" }];
  return false;
};
const clearLsoFile = () => {
  lsoForm.file = null;
  lsoFileList.value = [];
};

const onPickFuelFile = (file) => {
  if (!fileGuard(file)) return false;
  fuelForm.file = file;
  fuelFileList.value = [{ uid: file.uid, name: file.name, status: "done" }];
  return false;
};
const clearFuelFile = () => {
  fuelForm.file = null;
  fuelFileList.value = [];
};

const onPickFuelWorkTicket = (file) => {
  if (!fileGuard(file)) return false;
  fuelForm.work_ticket = file;
  fuelWorkTicketList.value = [{ uid: file.uid, name: file.name, status: "done" }];
  return false;
};
const clearFuelWorkTicket = () => {
  fuelForm.work_ticket = null;
  fuelWorkTicketList.value = [];
};

const postUpload = (formData) =>
  axios.post(`create_vendor_upload/activity/${props.activity.id}`, formData);

// Fuel documents (fuel receipts + work tickets) live in fuel_records.
const postFuelRecords = (formData) =>
  axios.post(`create_fuel_records/activity/${props.activity.id}`, formData);

const linkLso = async () => {
  saving.value = true;
  try {
    const hadFile = !!lsoForm.file;
    const fd = new FormData();
    fd.append("upload_type", "lso");
    fd.append("vendor_lso_id", lsoForm.vendor_lso_id);
    if (hadFile) {
      fd.append("file", lsoForm.file);
    }
    await postUpload(fd);
    lsoForm.vendor_lso_id = null;
    clearLsoFile();
    await fetchStatus(true);
    notification.success({
      message: hadFile
        ? "LSO linked and document uploaded"
        : "LSO/LPO linked",
    });
  } catch (e) {
    notifyUploadError(e);
  } finally {
    saving.value = false;
  }
};

const uploadLsoDocument = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append("upload_type", "lso");
    fd.append("vendor_lso_id", status.vendor_lso_id || lsoForm.vendor_lso_id);
    fd.append("file", lsoForm.file);
    await postUpload(fd);
    clearLsoFile();
    await fetchStatus(true);
    notification.success({ message: "LSO (PAS) document uploaded" });
  } catch (e) {
    notifyUploadError(e);
  } finally {
    saving.value = false;
  }
};

const uploadFuelReceipt = async () => {
  saving.value = true;
  try {
    // Batch format: the backend stores the fuel receipt and the matching work
    // ticket for this vehicle in one transaction.
    const fd = new FormData();
    fd.append(
      "receipts[0][license_plate_number]",
      String(fuelForm.license_plate_number).trim()
    );
    fd.append("receipts[0][fuel_amount]", fuelForm.fuel_amount);
    fd.append("receipts[0][file]", fuelForm.file);
    fd.append("receipts[0][work_ticket]", fuelForm.work_ticket);
    await postFuelRecords(fd);
    clearFuelFile();
    clearFuelWorkTicket();
    fuelForm.license_plate_number = "";
    fuelForm.fuel_amount = null;
    await fetchStatus(true);
    notification.success({
      message: "Fuel receipt and work ticket added",
    });
  } catch (e) {
    notifyUploadError(e);
  } finally {
    saving.value = false;
  }
};

const notifyUploadError = (e) => {
  const data = e?.response?.data;
  let description = data?.message || "Upload failed.";
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first[0]) description = first[0];
  }
  notification.error({ message: "Upload error", description });
};

const closeActivity = async () => {
  closing.value = true;
  try {
    const res = await axios.post(
      `activity_close_trigger/${props.activity.id}`,
      { closure_comments: comments.value.trim() }
    );

    if (res.data?.success === true) {
      notification.success({
        message: "Activity closed",
        description: res.data.message,
      });
      emit("closed", res.data.data);
      emit("update:visible", false);
    }
  } catch (e) {
    const data = e?.response?.data;

    if (e?.response?.status === 422 && data) {
      // Backend rejected: refresh status + show blockers.
      status.blockers = data.blockers || [
        {
          code: "error",
          message: data.message || "Closure requirements not met.",
        },
      ];
      notification.warning({
        message: "Cannot close yet",
        description: data.message || "Resolve the highlighted items first.",
      });
      fetchStatus(true);
    } else if (e?.response?.status === 401 || e?.response?.status === 403) {
      notification.error({
        message: "Not allowed",
        description:
          data?.message || "Only the activity creator can close this activity.",
      });
    } else {
      notification.error({
        message: "Error",
        description: data?.message || "Could not close the activity.",
      });
    }
  } finally {
    closing.value = false;
  }
};

const onCancel = () => {
  emit("update:visible", false);
};
</script>

<style lang="less" scoped>
.ac-modal {
  .ac-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 40px 0;
    color: #7a8a82;
  }

  .ac-intro {
    color: #5f6c64;
    font-size: 13px;
    margin-bottom: 14px;
  }

  .ac-blockers {
    margin-bottom: 16px;
  }

  .ac-blocker-list {
    margin: 6px 0 0;
    padding-left: 18px;
    li {
      font-size: 13px;
      margin-bottom: 2px;
    }
  }

  .ac-section {
    border: 1px solid #e6eef0;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 14px;
    background: #fbfdfc;

    &.is-delinked {
      border-color: #d8c5f5;
      background: #fcfaff;
      .ac-section-title {
        color: #6f3fcc;
      }
    }
  }

  .ac-section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 700;
    color: #15693c;
    margin: 0 0 4px;
  }

  .ac-hint {
    font-size: 12px;
    color: #7a8a82;
    margin: 0 0 12px;

    &.is-warn {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #8a5b00;
      background: #fff8eb;
      border: 1px solid #f3c97c;
      border-radius: 6px;
      padding: 6px 10px;
    }
  }

  .ac-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ac-row-end {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }

  .ac-upload-block {
    margin-top: 12px;
  }

  .ac-fuel-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 12px;
  }

  .ac-vehicle-list {
    list-style: none;
    margin: 0 0 14px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ac-vehicle {
    border: 1px solid #e6eef0;
    border-radius: 8px;
    padding: 8px 12px;
    background: #fff;

    &.is-missing {
      border-color: #f3d39b;
      background: #fffaf0;
    }
  }

  .ac-vehicle-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .ac-plate {
    font-weight: 700;
    color: #2f3a35;
  }

  .ac-chips {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .ac-chip {
    font-size: 11px;
    font-weight: 600;
    border-radius: 10px;
    padding: 2px 10px;

    &.ok {
      background: #daf4e4;
      color: #15693c;
    }
    &.pending {
      background: #fceabb;
      color: #8a5b00;
    }
  }

  .ac-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 8px;
    border-top: 1px solid #eef3f1;
    padding-top: 14px;
  }

  @media (max-width: 575px) {
    .ac-fuel-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
