<template>
  <a-modal
    :visible="visible"
    :title="`Close Event — ${event?.name || ''}`"
    :width="720"
    :mask-closable="false"
    :footer="null"
    @cancel="onCancel"
  >
    <div class="ec-modal">
      <div v-if="loading" class="ec-loading">
        <a-spin />
        <span>Loading closure requirements…</span>
      </div>

      <template v-else>
        <!-- Intro -->
        <p class="ec-intro">
          Closing an event finalises attendance. Provide the required documents
          below, then close the event. Payroll generation remains disabled until
          you submit the closed event for payroll.
        </p>

        <!-- Blockers -->
        <a-alert
          v-if="blockers.length"
          type="warning"
          show-icon
          class="ec-blockers"
        >
          <template #message>Action required before closing</template>
          <template #description>
            <ul class="ec-blocker-list">
              <li v-for="(b, i) in blockers" :key="i">{{ b.message }}</li>
            </ul>
          </template>
        </a-alert>

        <a-alert
          v-else-if="requiresUploads && !status.complete"
          type="warning"
          show-icon
          class="ec-blockers"
        >
          <template #message>Action required before closing</template>
          <template #description>
            <ul class="ec-blocker-list">
              <li v-if="status.lso_delinked">
                The LSO/LPO previously linked to this event has been delinked
                from its vendor. Link another LSO/LPO below.
              </li>
              <li v-else-if="status.requires_lso && !status.has_lso">
                Link the LSO/LPO covering the paid venue.
              </li>
              <li v-for="t in status.missing_types" :key="t">
                Upload the missing {{ String(t).replace(/_/g, ' ') }}.
              </li>
              <li v-if="status.requires_fuel && !fuelComplete">
                Add a fuel receipt and work ticket for every vehicle.
              </li>
            </ul>
          </template>
        </a-alert>

        <a-alert
          v-else-if="requiresUploads"
          type="success"
          show-icon
          class="ec-blockers"
          message="All required documents are in place. You can close the event."
        />

        <a-alert
          v-else
          type="info"
          show-icon
          class="ec-blockers"
          message="This event has no procurement documents to upload. You can close it directly."
        />

        <!-- LSO link (paid venue without an LSO, or the linked LSO was delinked) -->
        <section v-if="needsLsoLink" class="ec-section" :class="{ 'is-delinked': status.lso_delinked }">
          <h4 class="ec-section-title">
            <sdFeatherIcons type="file-text" size="14" /> Link LSO / LPO
          </h4>
          <p v-if="status.lso_delinked" class="ec-hint is-warn">
            <sdFeatherIcons type="alert-triangle" size="12" />
            The LSO/LPO previously linked to this event was delinked from its
            vendor. Link another LSO/LPO before closing.
          </p>
          <p v-else class="ec-hint">
            A paid venue was flagged for this event. Link the covering LSO/LPO.
          </p>
          <div class="ec-row">
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
              Link
            </sdButton>
          </div>
        </section>

        <!-- Venue invoice -->
        <section v-if="needsVenueInvoice" class="ec-section">
          <h4 class="ec-section-title">
            <sdFeatherIcons type="home" size="14" /> Venue Invoice
          </h4>
          <p class="ec-hint">Upload the paid venue invoice (PDF or image).</p>
          <a-form layout="vertical">
            <a-form-item label="Invoice amount (KES)">
              <a-input-number
                v-model:value="venueForm.invoice_amount"
                :min="0"
                :step="100"
                style="width: 100%"
                placeholder="e.g. 25000"
              />
            </a-form-item>
            <a-form-item label="Invoice document">
              <a-upload
                :file-list="venueFileList"
                :before-upload="onPickVenueFile"
                :max-count="1"
                accept=".pdf,.jpg,.jpeg,.png"
                @remove="clearVenueFile"
              >
                <sdButton size="small" type="light" outlined>
                  <sdFeatherIcons type="upload" size="13" />&nbsp; Choose file
                </sdButton>
              </a-upload>
            </a-form-item>
            <div class="ec-row-end">
              <sdButton
                type="primary"
                size="small"
                :disabled="!venueForm.file || venueForm.invoice_amount == null || saving"
                @click="uploadVenueInvoice"
              >
                Upload invoice
              </sdButton>
            </div>
          </a-form>
        </section>

        <!-- Fuel receipts + work tickets per vehicle -->
        <section v-if="status.requires_fuel" class="ec-section">
          <h4 class="ec-section-title">
            <sdFeatherIcons type="truck" size="14" /> Vehicle Fuel Receipts &amp; Work Tickets
          </h4>
          <p class="ec-hint">
            Add each vehicle's license plate, fuel amount, the fuel receipt
            (ETR) and the work ticket. Both documents are required for every
            vehicle before the event can be closed.
          </p>

          <!-- Existing vehicles -->
          <ul v-if="vehicles.length" class="ec-vehicle-list">
            <li
              v-for="v in vehicles"
              :key="v.id"
              class="ec-vehicle"
              :class="{ 'is-missing': !vehicleHasReceipt(v) || !vehicleHasWorkTicket(v) }"
            >
              <div class="ec-vehicle-head">
                <span class="ec-plate">{{ v.license_plate_number }}</span>
                <span class="ec-chips">
                  <span
                    class="ec-chip"
                    :class="vehicleHasReceipt(v) ? 'ok' : 'pending'"
                  >
                    {{ vehicleHasReceipt(v) ? "Fuel receipt ✓" : "Fuel receipt missing" }}
                  </span>
                  <span
                    class="ec-chip"
                    :class="vehicleHasWorkTicket(v) ? 'ok' : 'pending'"
                  >
                    {{ vehicleHasWorkTicket(v) ? "Work ticket ✓" : "Work ticket missing" }}
                  </span>
                </span>
              </div>
            </li>
          </ul>

          <!-- Add a fuel receipt + work ticket -->
          <a-form layout="vertical" class="ec-fuel-form">
            <div class="ec-fuel-grid">
              <a-form-item label="License plate">
                <a-input
                  v-model:value="fuelForm.license_plate_number"
                  placeholder="e.g. KDA 123A / GKA 543S / 019 CG 234A"
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
            <div class="ec-row-end">
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

        <!-- Footer actions -->
        <div class="ec-actions">
          <sdButton size="small" type="light" outlined @click="onCancel">
            Cancel
          </sdButton>
          <sdButton
            size="small"
            type="danger"
            :disabled="!canClose || closing"
            @click="closeEvent"
          >
            <sdFeatherIcons type="x-circle" size="14" />&nbsp;
            {{ closing ? "Closing…" : "Close Event" }}
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

const emit = defineEmits(["update:visible", "closed"]);

const loading = ref(false);
const saving = ref(false);
const closing = ref(false);
const status = reactive({
  requires_uploads: false,
  requires_lso: false,
  has_lso: false,
  // True when the LSO/LPO currently attached to the event was delinked from
  // its vendor. The host must pick a replacement LSO/LPO before closing.
  lso_delinked: false,
  requires_fuel: false,
  fuel: null,
  missing_types: [],
  complete: false,
  uploads: [],
  vehicles: [],
});
const blockers = ref([]);
const openLsos = ref([]);
const lsoLoading = ref(false);

const lsoForm = reactive({ vendor_lso_id: null });
const venueForm = reactive({ invoice_amount: null, file: null });
const venueFileList = ref([]);
const fuelForm = reactive({ license_plate_number: "", fuel_amount: null, file: null, work_ticket: null });
const fuelFileList = ref([]);
const fuelWorkTicketList = ref([]);

const vehicles = computed(() => status.vehicles || []);
const requiresUploads = computed(() => !!status.requires_uploads);

/**
 * The LSO/LPO picker is shown whenever a paid venue needs an LSO and none is
 * linked — including the case where the previously-linked LSO was delinked
 * from its vendor (delinked orders are rejected by the backend).
 */
const needsLsoLink = computed(
  () => (status.requires_lso && !status.has_lso) || status.lso_delinked
);

const fuelComplete = computed(() => status.fuel?.complete !== false);

const needsVenueInvoice = computed(() =>
  (status.missing_types || []).includes("venue_invoice") ||
  (status.requires_lso && hasVenueInvoiceUploaded.value === false)
);

const hasVenueInvoiceUploaded = computed(() =>
  (status.uploads || []).some((u) => u.upload_type === "venue_invoice")
);

const canClose = computed(() => {
  if (!props.event) return false;
  // Complete when backend says closure requirements are satisfied,
  // or when there were no uploads required at all.
  return status.complete || !status.requires_uploads;
});

const canUploadFuel = computed(
  () =>
    !!fuelForm.file &&
    !!fuelForm.work_ticket &&
    fuelForm.fuel_amount != null &&
    String(fuelForm.license_plate_number || "").trim().length >= 3
);

watch(
  () => props.visible,
  (open) => {
    if (open && props.event) {
      // Reset any stale LSO state from a previous open.
      lsoForm.vendor_lso_id = null;
      openLsos.value = [];
      fetchStatus();
    }
  }
);

const fetchStatus = async () => {
  if (!props.event) return;
  loading.value = true;
  try {
    const res = await axios.get(`get_vendor_uploads/event/${props.event.id}`);
    applyStatus(res.data?.data || {});
    blockers.value = [];
  } catch (e) {
    notification.error({
      message: "Error",
      description: "Could not load closure requirements.",
    });
  } finally {
    loading.value = false;
  }
};

const applyStatus = (data) => {
  status.requires_uploads = !!data.requires_uploads;
  status.requires_lso = !!data.requires_lso;
  status.has_lso = !!data.has_lso;
  status.lso_delinked = !!data.lso_delinked;
  status.requires_fuel = !!data.requires_fuel;
  status.fuel = data.fuel || null;
  status.missing_types = data.missing_types || [];
  status.complete = !!data.complete;
  status.uploads = data.uploads || [];
  status.vehicles = data.vehicles || [];

  // Load the replacement-LSO options as soon as we know the host must pick
  // one (paid venue with no LSO, or the previous LSO was delinked).
  if (needsLsoLink.value && !openLsos.value.length) {
    fetchOpenLsos();
  }
};

const fetchOpenLsos = async () => {
  lsoLoading.value = true;
  try {
    const res = await axios.get(`open_vendor_lsos`);
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

const onPickVenueFile = (file) => {
  if (!fileGuard(file)) return false;
  venueForm.file = file;
  venueFileList.value = [{ uid: file.uid, name: file.name, status: "done" }];
  return false;
};
const clearVenueFile = () => {
  venueForm.file = null;
  venueFileList.value = [];
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

const postUpload = async (formData) => {
  return axios.post(
    `create_vendor_upload/event/${props.event.id}`,
    formData
  );
};

// Fuel documents (fuel receipts + work tickets) live in the dedicated
// fuel_records table — they are no longer vendor uploads.
const postFuelRecords = async (formData) => {
  return axios.post(
    `create_fuel_records/event/${props.event.id}`,
    formData
  );
};

const linkLso = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append("upload_type", "lso");
    fd.append("vendor_lso_id", lsoForm.vendor_lso_id);
    const res = await postUpload(fd);
    applyStatus(res.data?.data?.status || {});
    notification.success({ message: "LSO linked" });
  } catch (e) {
    notifyUploadError(e);
  } finally {
    saving.value = false;
  }
};

const uploadVenueInvoice = async () => {
  saving.value = true;
  try {
    const fd = new FormData();
    fd.append("upload_type", "venue_invoice");
    fd.append("invoice_amount", venueForm.invoice_amount);
    fd.append("file", venueForm.file);
    const res = await postUpload(fd);
    applyStatus(res.data?.data?.status || {});
    clearVenueFile();
    venueForm.invoice_amount = null;
    notification.success({ message: "Venue invoice uploaded" });
  } catch (e) {
    notifyUploadError(e);
  } finally {
    saving.value = false;
  }
};

const uploadFuelReceipt = async () => {
  saving.value = true;
  try {
    // Batch format so the backend stores the fuel receipt and the work
    // ticket for this vehicle in a single transaction — both documents are
    // mandatory for every vehicle on a fuel event.
    const fd = new FormData();
    fd.append(
      "receipts[0][license_plate_number]",
      String(fuelForm.license_plate_number).trim()
    );
    fd.append("receipts[0][fuel_amount]", fuelForm.fuel_amount);
    fd.append("receipts[0][file]", fuelForm.file);
    fd.append("receipts[0][work_ticket]", fuelForm.work_ticket);
    const res = await postFuelRecords(fd);
    applyStatus(res.data?.data?.status || {});
    clearFuelFile();
    clearFuelWorkTicket();
    fuelForm.license_plate_number = "";
    fuelForm.fuel_amount = null;
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

const closeEvent = async () => {
  closing.value = true;
  try {
    const res = await axios.post(`event_close_trigger/${props.event.id}`);
    if (res.data?.status === true) {
      notification.success({
        message: "Event closed",
        description: res.data.message,
      });
      emit("closed", res.data.data);
      emit("update:visible", false);
    }
  } catch (e) {
    const data = e?.response?.data;
    if (e?.response?.status === 422 && data) {
      // Backend rejected: refresh status + show blockers.
      if (data.status) applyStatus(data.status);
      blockers.value = data.blockers || [
        { message: data.message || "Closure requirements not met." },
      ];
      notification.warning({
        message: "Cannot close yet",
        description: data.message || "Resolve the highlighted items first.",
      });
    } else if (e?.response?.status === 401) {
      notification.error({
        message: "Not allowed",
        description: data?.message || "Only the event host can close this event.",
      });
    } else {
      notification.error({
        message: "Error",
        description: data?.message || "Could not close the event.",
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
.ec-modal {
  .ec-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 40px 0;
    color: #7a8a82;
  }

  .ec-intro {
    color: #5f6c64;
    font-size: 13px;
    margin-bottom: 14px;
  }

  .ec-blockers {
    margin-bottom: 16px;
  }

  .ec-blocker-list {
    margin: 6px 0 0;
    padding-left: 18px;
    li {
      font-size: 13px;
      margin-bottom: 2px;
    }
  }

  .ec-section {
    border: 1px solid #e6eef0;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 14px;
    background: #fbfdfc;

    /* The linked LSO was delinked from its vendor — highlight the section
       so the host notices they must pick a replacement. */
    &.is-delinked {
      border-color: #d8c5f5;
      background: #fcfaff;
      .ec-section-title { color: #6f3fcc; }
    }
  }

  .ec-hint.is-warn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #8a5b00;
    background: #fff8eb;
    border: 1px solid #f3c97c;
    border-radius: 6px;
    padding: 6px 10px;
  }

  .ec-section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 700;
    color: #15693c;
    margin: 0 0 4px;
  }

  .ec-hint {
    font-size: 12px;
    color: #7a8a82;
    margin: 0 0 12px;
  }

  .ec-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ec-row-end {
    display: flex;
    justify-content: flex-end;
  }

  .ec-fuel-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 12px;
  }

  .ec-vehicle-list {
    list-style: none;
    margin: 0 0 14px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ec-vehicle {
    border: 1px solid #e6eef0;
    border-radius: 8px;
    padding: 8px 12px;
    background: #fff;
    &.is-missing {
      border-color: #f3d39b;
      background: #fffaf0;
    }
  }

  .ec-vehicle-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .ec-plate {
    font-weight: 700;
    color: #2f3a35;
  }

  .ec-chips {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .ec-chip {
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

  .ec-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 8px;
    border-top: 1px solid #eef3f1;
    padding-top: 14px;
  }

  @media (max-width: 575px) {
    .ec-fuel-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
