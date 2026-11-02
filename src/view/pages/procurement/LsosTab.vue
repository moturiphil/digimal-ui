<template>
  <ProcurementPageWrapper class="bp-min">
    <div class="sub-head">
      <h4 class="panel-title">
        <sdFeatherIcons type="file-text" size="14" />
        Local Service Orders
        <span v-if="filteredLsos.length" class="pt-count">{{ filteredLsos.length }}</span>
      </h4>
      <div class="sub-head-actions">
        <a-select
          v-model:value="serviceTypeFilter"
          placeholder="Service type"
          allow-clear
          size="small"
          class="bp-select"
          style="width: 180px"
          @change="onFilterChange"
        >
          <a-select-option
            v-for="t in serviceTypes"
            :key="t.id"
            :value="t.id"
          >{{ t.name || t.service_type_name }}</a-select-option>
        </a-select>
        <a-select
          v-model:value="expiredFilter"
          placeholder="Expiry"
          allow-clear
          size="small"
          class="bp-select"
          style="width: 130px"
          @change="onFilterChange"
        >
          <a-select-option :value="false">Active</a-select-option>
          <a-select-option :value="true">Expired</a-select-option>
        </a-select>
        <sdButton
          v-if="canManageVendors"
          size="small"
          class="pill-btn is-primary"
          @click="openCreate"
        >
          <sdFeatherIcons type="upload" size="13" /> Upload LSO
        </sdButton>
      </div>
    </div>

    <section v-if="!filteredLsos.length" class="panel">
      <div class="empty-state">
        <div class="empty-icon">▤</div>
        <div class="empty-title">No Local Service Orders</div>
        <div class="empty-desc">
          Upload an LSO to record awarded work for this vendor.
        </div>
        <sdButton
          v-if="canManageVendors"
          size="small"
          class="pill-btn is-primary"
          @click="openCreate"
        >+ Upload LSO</sdButton>
      </div>
    </section>

    <div v-else class="lso-list">
      <div
        v-for="lso in filteredLsos"
        :key="lso.id"
        class="lso-row"
        :class="{ 'is-expired': isExpired(lso) }"
      >
        <div class="lso-number" :class="{ 'is-expired': isExpired(lso) }">
          {{ lso.lso_number }}
          <span class="lso-status">
            {{ isExpired(lso) ? 'Expired' : 'Active' }}
          </span>
        </div>
        <div class="lso-service">
          {{ lso.service_type?.name || lso.service_type?.service_type_name || '—' }}
        </div>
        <div class="lso-dates">
          <div class="ld-row">
            <span class="ld-label">Issued</span>
            <span class="ld-value">{{ lso.issue_date || '—' }}</span>
          </div>
          <div class="ld-row">
            <span class="ld-label">Expires</span>
            <span class="ld-value">{{ lso.expiry_date || '—' }}</span>
            <span v-if="isExpired(lso)" class="expired-pill">!</span>
          </div>
        </div>
        <div class="lso-actions">
          <a-tooltip title="Preview">
            <span class="action-icon" @click="preview(lso)">
              <sdFeatherIcons type="eye" size="13" />
            </span>
          </a-tooltip>
          <a-tooltip title="Download">
            <span class="action-icon" @click="download(lso)">
              <sdFeatherIcons type="download" size="13" />
            </span>
          </a-tooltip>
          <a-tooltip v-if="canManageVendors" title="Edit">
            <span class="action-icon" @click="openEdit(lso)">
              <sdFeatherIcons type="edit-2" size="13" />
            </span>
          </a-tooltip>
          <a-popconfirm
            v-if="canManageVendors"
            title="Delete this LSO?"
            ok-text="Delete"
            @confirm="onDelete(lso)"
          >
            <a-tooltip title="Delete">
              <span class="action-icon danger">
                <sdFeatherIcons type="trash-2" size="13" />
              </span>
            </a-tooltip>
          </a-popconfirm>
        </div>
        <div v-if="lso.notes" class="lso-notes-line">
          <strong>Notes:</strong> {{ lso.notes }}
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <a-modal
      :visible="modalOpen"
      :title="null"
      :footer="null"
      :closable="false"
      :mask-closable="false"
      width="680px"
      wrap-class-name="lso-modal-wrap"
      @cancel="closeModal"
      @update:visible="(v) => (modalOpen = v)"
    >
      <div class="lm-shell">
        <header class="lm-head">
          <div class="lm-head-left">
            <span class="lm-icon">
              <sdFeatherIcons :type="editing ? 'edit-3' : 'upload-cloud'" size="18" />
            </span>
            <div>
              <h3 class="lm-title">{{ editing ? 'Edit LSO/LPO' : 'Upload LSO/LPO' }}</h3>
              <p class="lm-sub">
                {{ editing
                  ? 'Update reference, validity dates or replace the document.'
                  : 'Record an awarded order for this vendor and upload the signed document.' }}
              </p>
            </div>
          </div>
          <button class="lm-close" type="button" @click="closeModal">
            <sdFeatherIcons type="x" size="16" />
          </button>
        </header>

        <div class="lm-body">
          <a-form layout="vertical" class="lm-form">
            <div class="lm-section">
              <h4 class="lm-section-title">
                <span class="lm-dot"></span> Order details
              </h4>
              <a-row :gutter="14">
                <a-col :span="12">
                  <a-form-item
                    label="Service Type"
                    :validate-status="errors.service_type_id ? 'error' : ''"
                    :help="errors.service_type_id"
                  >
                    <a-select v-model:value="form.service_type_id" placeholder="Select service type">
                      <a-select-option
                        v-for="t in serviceTypes"
                        :key="t.id"
                        :value="t.id"
                      >{{ t.name || t.service_type_name }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="LSO/LPO Number"
                    :validate-status="errors.lso_number ? 'error' : ''"
                    :help="errors.lso_number"
                  >
                    <a-input v-model:value="form.lso_number" placeholder="e.g. LPO/2026/0421" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="14">
                <a-col :span="12">
                  <a-form-item
                    label="Issue Date"
                    :validate-status="errors.issue_date ? 'error' : ''"
                    :help="errors.issue_date"
                  >
                    <a-date-picker
                      v-model:value="form.issue_date"
                      style="width: 100%"
                      value-format="YYYY-MM-DD"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="Expiry Date"
                    :validate-status="errors.expiry_date ? 'error' : ''"
                    :help="errors.expiry_date"
                  >
                    <a-date-picker
                      v-model:value="form.expiry_date"
                      style="width: 100%"
                      value-format="YYYY-MM-DD"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item
                label="Notes"
                :validate-status="errors.notes ? 'error' : ''"
                :help="errors.notes"
              >
                <a-textarea
                  v-model:value="form.notes"
                  :rows="3"
                  maxlength="1000"
                  placeholder="Scope, payment terms, or any detail relevant to this order"
                />
              </a-form-item>
            </div>

            <div class="lm-section">
              <h4 class="lm-section-title">
                <span class="lm-dot info"></span> Document
                <span class="lm-section-tag">
                  PDF / JPG / PNG · max {{ LSO_MAX_FILE_MB }} MB
                </span>
              </h4>
              <a-form-item
                :validate-status="errors.file ? 'error' : ''"
                :help="errors.file"
              >
                <a-upload
                  :file-list="fileList"
                  :before-upload="onPickFile"
                  :max-count="1"
                  accept=".pdf,.jpg,.jpeg,.png"
                  @remove="clearFile"
                >
                  <sdButton class="lm-upload-btn">
                    <sdFeatherIcons type="upload" size="13" /> Choose File
                  </sdButton>
                </a-upload>
              </a-form-item>
            </div>
          </a-form>
        </div>

        <footer class="lm-foot">
          <span class="lm-foot-hint">
            <sdFeatherIcons type="info" size="12" />
            Reference number, dates and a signed copy keep the audit trail intact.
          </span>
          <div class="lm-foot-actions">
            <sdButton size="small" class="pill-btn" @click="closeModal">Cancel</sdButton>
            <sdButton
              size="small"
              class="pill-btn is-primary"
              :loading="submitting"
              @click="onSubmit"
            >
              {{ editing ? 'Save Changes' : 'Upload LSO/LPO' }}
            </sdButton>
          </div>
        </footer>
      </div>
    </a-modal>

    <!-- Preview Drawer -->
    <a-drawer
      :open="previewOpen"
      title="LSO Preview"
      width="720"
      @close="closePreview"
      @update:open="(v) => (previewOpen = v)"
    >
      <a-spin :spinning="previewLoading">
        <iframe
          v-if="previewUrl && previewMime === 'application/pdf'"
          :src="previewUrl"
          style="width: 100%; height: 80vh; border: 0"
        />
        <img
          v-else-if="previewUrl"
          :src="previewUrl"
          style="max-width: 100%; height: auto"
        />
        <a-empty v-else description="No preview available" />
      </a-spin>
    </a-drawer>
  </ProcurementPageWrapper>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import lsoService from '@/services/procurement/vendor-lso.service';
import { useProcurementPermissions } from '@/services/procurement/usePermissions';
import { ProcurementPageWrapper } from './style';
import {
  LSO_MAX_FILE_BYTES,
  LSO_MAX_FILE_MB,
  PROCUREMENT_DOCUMENT_MIME_TYPES,
} from '@/config/procurement';

const blankForm = () => ({
  service_type_id: null,
  lso_number: '',
  issue_date: null,
  expiry_date: null,
  file: null,
  notes: '',
});

export default {
  name: 'LsosTab',
  components: { ProcurementPageWrapper },
  props: { vendorId: { type: Number, required: true } },
  setup(props) {
    const store = useStore();
    const permissions = useProcurementPermissions();

    const serviceTypeFilter = ref(null);
    const expiredFilter = ref(null);

    const modalOpen = ref(false);
    const editing = ref(null);
    const form = reactive(blankForm());
    const errors = reactive({});
    const submitting = ref(false);
    const fileList = ref([]);

    const previewOpen = ref(false);
    const previewLoading = ref(false);
    const previewUrl = ref(null);
    const previewMime = ref(null);

    const lsos = computed(() => store.state.procurement.lsos);
    const serviceTypes = computed(() => store.state.procurement.serviceTypes);

    const isExpired = (lso) =>
      lso.expiry_date && dayjs(lso.expiry_date).isBefore(dayjs(), 'day');

    const filteredLsos = computed(() => {
      return lsos.value.filter((l) => {
        if (serviceTypeFilter.value && l.service_type_id !== serviceTypeFilter.value) return false;
        if (expiredFilter.value === true && !isExpired(l)) return false;
        if (expiredFilter.value === false && isExpired(l)) return false;
        return true;
      });
    });

    const fetchLsos = () =>
      store.dispatch('procurement/fetchLsos', { vendorId: props.vendorId, params: {} });

    onMounted(() => {
      store.dispatch('procurement/fetchServiceTypes');
      fetchLsos();
    });

    watch(() => props.vendorId, (id) => { if (id) fetchLsos(); });

    const onFilterChange = () => { /* client-side; reactive */ };

    const reset = () => {
      Object.assign(form, blankForm());
      Object.keys(errors).forEach((k) => delete errors[k]);
      fileList.value = [];
      editing.value = null;
    };

    const openCreate = () => { reset(); modalOpen.value = true; };
    const openEdit = (record) => {
      reset();
      editing.value = record;
      form.service_type_id = record.service_type_id;
      form.lso_number = record.lso_number;
      form.issue_date = record.issue_date;
      form.expiry_date = record.expiry_date;
      form.notes = record.notes || '';
      modalOpen.value = true;
    };
    const closeModal = () => { modalOpen.value = false; reset(); };

    const onPickFile = (file) => {
      const okType = PROCUREMENT_DOCUMENT_MIME_TYPES.includes(file.type);
      const okSize = file.size <= LSO_MAX_FILE_BYTES;
      if (!okType) {
        notification.error({ message: 'Invalid file type', description: 'PDF, JPG, JPEG or PNG only.' });
        return false;
      }
      if (!okSize) {
        notification.error({ message: 'File too large', description: `Max size ${LSO_MAX_FILE_MB}MB.` });
        return false;
      }
      form.file = file;
      fileList.value = [{ uid: file.uid, name: file.name, status: 'done' }];
      return false;
    };

    const clearFile = () => { form.file = null; fileList.value = []; };

    const validate = () => {
      Object.keys(errors).forEach((k) => delete errors[k]);
      if (!form.service_type_id) errors.service_type_id = 'Required';
      if (!form.lso_number?.trim()) errors.lso_number = 'Required';
      if (!form.issue_date) errors.issue_date = 'Required';
      if (!form.expiry_date) errors.expiry_date = 'Required';
      else if (form.issue_date && dayjs(form.expiry_date).isBefore(dayjs(form.issue_date))) {
        errors.expiry_date = 'Must be after issue date';
      }
      if (!editing.value && !form.file) errors.file = 'File is required';
      if (form.notes && form.notes.length > 1000) errors.notes = 'Max 1000 characters';
      return Object.keys(errors).length === 0;
    };

    const onSubmit = async () => {
      if (!validate()) return;
      submitting.value = true;
      try {
        const payload = {
          service_type_id: form.service_type_id,
          lso_number: form.lso_number.trim(),
          issue_date: form.issue_date,
          expiry_date: form.expiry_date,
          notes: form.notes || '',
        };
        if (form.file) payload.file = form.file;

        if (editing.value) {
          await store.dispatch('procurement/updateLso', {
            vendorId: props.vendorId,
            id: editing.value.id,
            payload,
          });
        } else {
          await store.dispatch('procurement/createLso', {
            vendorId: props.vendorId,
            payload,
          });
        }
        modalOpen.value = false;
        reset();
      } catch (e) {
        const fe = e?.response?.data?.errors;
        if (fe) {
          Object.entries(fe).forEach(([k, v]) => {
            errors[k] = Array.isArray(v) ? v[0] : String(v);
          });
        }
      } finally {
        submitting.value = false;
      }
    };

    const onDelete = (record) =>
      store.dispatch('procurement/deleteLso', {
        vendorId: props.vendorId,
        id: record.id,
      });

    let lastBlobUrl = null;
    const preview = async (lso) => {
      previewOpen.value = true;
      previewLoading.value = true;
      previewUrl.value = null;
      previewMime.value = null;
      try {
        const response = await lsoService.download(props.vendorId, lso.id);
        const blob = response.data;
        previewMime.value = blob.type;
        if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
        lastBlobUrl = URL.createObjectURL(blob);
        previewUrl.value = lastBlobUrl;
      } catch (e) {
        notification.error({ message: 'Unable to load preview' });
        previewOpen.value = false;
      } finally {
        previewLoading.value = false;
      }
    };

    const closePreview = () => {
      previewOpen.value = false;
      if (lastBlobUrl) {
        URL.revokeObjectURL(lastBlobUrl);
        lastBlobUrl = null;
      }
      previewUrl.value = null;
    };

    const download = async (lso) => {
      try {
        const response = await lsoService.download(props.vendorId, lso.id);
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        const ext = blob.type === 'application/pdf' ? 'pdf'
          : blob.type === 'image/png' ? 'png' : 'jpg';
        const a = document.createElement('a');
        a.href = url;
        a.download = `${lso.lso_number || 'lso'}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (e) {
        notification.error({ message: 'Unable to download LSO' });
      }
    };

    return {
      ...permissions,
      serviceTypeFilter,
      expiredFilter,
      LSO_MAX_FILE_MB,
      modalOpen,
      editing,
      form,
      errors,
      submitting,
      fileList,
      previewOpen,
      previewLoading,
      previewUrl,
      previewMime,
      lsos,
      serviceTypes,
      filteredLsos,
      isExpired,
      onFilterChange,
      openCreate,
      openEdit,
      closeModal,
      onPickFile,
      clearFile,
      onSubmit,
      onDelete,
      preview,
      closePreview,
      download,
    };
  },
};
</script>

<style lang="less">
.lso-modal-wrap .ant-modal-body {
  padding: 0;
}
.lso-modal-wrap .ant-modal-content {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(20, 60, 38, 0.18);
}
</style>

<style lang="less" scoped>
.sub-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 4px 0 10px;
  .panel-title { margin: 0; }
  .sub-head-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
}

/* LSO upload modal */
.lm-shell {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}
.lm-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  background: linear-gradient(95deg, #15693c 0%, #1f9254 55%, #36b16f 100%);
  color: #fff;
}
.lm-head-left {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}
.lm-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.32);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lm-title {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}
.lm-sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.4;
}
.lm-close {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: rgba(255, 255, 255, 0.22); }
}

.lm-body {
  padding: 18px 22px 4px;
  overflow-y: auto;
  flex: 1 1 auto;
  background: #fafcfb;
}
.lm-form :deep(.ant-form-item) {
  margin-bottom: 14px;
}
.lm-form :deep(.ant-form-item-label > label) {
  font-size: 12px;
  font-weight: 600;
  color: #4d5661;
  height: 22px;
}
.lm-form :deep(.ant-input),
.lm-form :deep(.ant-input-affix-wrapper),
.lm-form :deep(.ant-select-selector),
.lm-form :deep(.ant-picker) {
  border-radius: 6px;
  border-color: #dde4e0;
  &:hover { border-color: #9ad8b4; }
}
.lm-form :deep(.ant-input:focus),
.lm-form :deep(.ant-picker-focused) {
  box-shadow: 0 0 0 2px rgba(31, 146, 84, 0.12);
  border-color: #1f9254;
}

.lm-section {
  background: #fff;
  border: 1px solid #e6ecef;
  border-radius: 10px;
  padding: 14px 16px 4px;
  margin-bottom: 14px;
  box-shadow: 0 2px 6px rgba(28, 122, 72, 0.04);
}
.lm-section-title {
  font-size: 12px;
  font-weight: 700;
  color: #2f6746;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.lm-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: #1f9254;
  &.info { background: #2C99FF; }
}
.lm-section-tag {
  margin-left: auto;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  background: #eafff5;
  color: #15693c;
  border: 1px solid #c9e6d3;
  padding: 1px 8px;
  border-radius: 10px;
}

.lm-upload-btn {
  background: #fff !important;
  border: 1px solid #e1e6ec !important;
  color: #4d5661 !important;
  border-radius: 6px;
  font-weight: 600;
  &:hover {
    border-color: #9ad8b4 !important;
    color: #15693c !important;
  }
}

.lm-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 22px;
  background: #fff;
  border-top: 1px solid #eaf0ee;
}
.lm-foot-hint {
  font-size: 11px;
  color: #8a9399;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.lm-foot-actions {
  display: flex;
  gap: 8px;
}
.pill-btn {
  background: #fff !important;
  border: 1px solid #e1e6ec !important;
  color: #4d5661 !important;
  border-radius: 6px;
  font-weight: 600;
  &:hover, &:focus {
    border-color: #9ad8b4 !important;
    color: #15693c !important;
  }
  &.is-primary {
    background: #1f9254 !important;
    border-color: #1f9254 !important;
    color: #fff !important;
    &:hover, &:focus {
      background: #167a45 !important;
      border-color: #167a45 !important;
    }
  }
}
</style>
