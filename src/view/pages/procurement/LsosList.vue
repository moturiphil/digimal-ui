<template>
  <Main>
    <ProcurementPageWrapper class="bp-min">
      <!-- Header -->
      <header class="bp-head">
        <div class="bp-head-main">
          <h3 class="bp-title">LSOs / LPOs</h3>
          <span class="bp-sub">{{ fmt(pagination.total) }} total</span>
        </div>
        <div class="bp-head-actions">
          <sdButton size="small" class="pill-btn" :disabled="loading" @click="refresh">
            <sdFeatherIcons type="refresh-cw" size="13" /> Refresh
          </sdButton>
          <sdButton
            v-if="canManageVendors"
            size="small"
            class="pill-btn is-primary"
            @click="openCreate"
          >
            <sdFeatherIcons type="plus" size="13" /> New LSO
          </sdButton>
        </div>
      </header>

      <!-- Filter row -->
      <div class="filter-row">
        <a-input
          v-model:value="filters.search"
          placeholder="Search LSO number, vendor…"
          allow-clear
          size="small"
          class="bp-search"
          @pressEnter="onFilterChange"
        />
        <a-select
          v-model:value="filters.vendor_id"
          placeholder="Vendor"
          allow-clear
          show-search
          size="small"
          :filter-option="vendorFilter"
          class="bp-select"
          style="min-width: 180px"
          @change="onFilterChange"
        >
          <a-select-option v-for="v in vendors" :key="v.id" :value="v.id">
            {{ v.name }}
          </a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.service_type_id"
          placeholder="Service type"
          allow-clear
          size="small"
          class="bp-select"
          style="min-width: 160px"
          @change="onFilterChange"
        >
          <a-select-option
            v-for="t in serviceTypes"
            :key="t.id"
            :value="t.id"
          >{{ t.name || t.service_type_name }}</a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.status"
          placeholder="Status"
          allow-clear
          size="small"
          class="bp-select"
          style="min-width: 120px"
          @change="onFilterChange"
        >
          <a-select-option value="active">Active</a-select-option>
          <a-select-option value="expired">Expired</a-select-option>
        </a-select>
        <sdButton
          size="small"
          class="pill-btn"
          :disabled="!hasActiveFilters"
          @click="resetFilters"
        >Clear</sdButton>
      </div>

      <!-- Table -->
      <section class="panel flush">
        <a-table
          class="minimal-table"
          :data-source="lsos"
          :columns="columns"
          row-key="id"
          size="small"
          :loading="loading"
          :pagination="paginationConfig"
          @change="onTableChange"
        >
          <template #emptyText>
            <div class="empty-state">
              <div class="empty-icon">▤</div>
              <div class="empty-title">No LSOs found</div>
              <div class="empty-desc">
                Local Service Orders uploaded against any vendor will appear here.
              </div>
              <sdButton
                v-if="canManageVendors"
                size="small"
                class="pill-btn is-primary"
                @click="openCreate"
              >+ New LSO</sdButton>
            </div>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'lso_number'">
              <router-link
                :to="`/procurement/lsos/${record.vendor_id}/${record.id}`"
                class="vendor-link"
              >{{ record.lso_number || '—' }}</router-link>
              <div v-if="record.service_type?.name" class="vendor-meta">
                {{ record.service_type.name }}
              </div>
            </template>

            <template v-else-if="column.key === 'vendor'">
              <router-link
                :to="`/procurement/vendors/${record.vendor_id}`"
                class="vendor-link"
              >{{ record.vendor?.name || '—' }}</router-link>
              <div v-if="record.vendor?.kra_pin" class="vendor-meta">
                KRA: {{ record.vendor.kra_pin }}
              </div>
            </template>

            <template v-else-if="column.key === 'issue_date'">
              {{ formatDate(record.issue_date) }}
            </template>

            <template v-else-if="column.key === 'expiry_date'">
              <span :class="isExpired(record) ? 'danger' : ''">
                {{ formatDate(record.expiry_date) }}
              </span>
            </template>

            <template v-else-if="column.key === 'status'">
              <span class="v-chip" :class="isExpired(record) ? 'warn' : 'green'">
                {{ isExpired(record) ? 'Expired' : 'Active' }}
              </span>
            </template>

            <template v-else-if="column.key === 'actions'">
              <a-space :size="2">
                <a-tooltip title="View">
                  <router-link :to="`/procurement/lsos/${record.vendor_id}/${record.id}`">
                    <span class="action-icon">
                      <sdFeatherIcons type="eye" size="13" />
                    </span>
                  </router-link>
                </a-tooltip>
                <a-tooltip title="Download">
                  <span class="action-icon" @click="download(record)">
                    <sdFeatherIcons type="download" size="13" />
                  </span>
                </a-tooltip>
              </a-space>
            </template>
          </template>
        </a-table>
      </section>

      <!-- New LSO modal (vendor picker + LSO form) -->
      <a-modal
        :visible="modalOpen"
        :confirm-loading="submitting"
        :ok-text="submitting ? 'Saving…' : 'Create LSO'"
        cancel-text="Cancel"
        :mask-closable="false"
        width="720px"
        wrap-class-name="lso-create-modal"
        :body-style="{ padding: '0' }"
        @cancel="closeModal"
        @ok="onSubmit"
        @update:visible="(v) => (modalOpen = v)"
      >
        <template #title>
          <div class="lso-hero">
            <span class="lso-hero-icon">
              <sdFeatherIcons type="file-plus" size="18" />
            </span>
            <div>
              <h4 class="lso-hero-title">New LSO / LPO</h4>
              <p class="lso-hero-sub">
                Record a new local service / purchase order for a vendor.
              </p>
            </div>
          </div>
        </template>

        <a-form layout="vertical" class="lso-form">
          <!-- Section 1 · Vendor -->
          <div class="section-card">
            <div class="section-head">
              <span class="section-icon">
                <sdFeatherIcons type="briefcase" size="14" />
              </span>
              <div>
                <h4 class="section-title">Vendor</h4>
                <p class="section-sub">Who is this order being issued to?</p>
              </div>
            </div>
            <a-form-item
              :validate-status="errors.vendor_id ? 'error' : ''"
              :help="errors.vendor_id"
              class="lso-no-label"
            >
              <a-select
                v-model:value="form.vendor_id"
                placeholder="Search vendor by name…"
                show-search
                size="large"
                option-label-prop="label"
                :filter-option="vendorFilter"
              >
                <a-select-option
                  v-for="v in vendors"
                  :key="v.id"
                  :value="v.id"
                  :label="v.name"
                >
                  <div class="vendor-option">
                    <div class="vendor-option-name">{{ v.name }}</div>
                    <div class="vendor-option-meta">
                      <span class="vendor-tag" :class="`vt-${v.category}`">
                        {{ v.category === 'private' ? 'Private' : 'Public' }}
                      </span>
                      <span v-if="v.kra_pin">KRA · {{ v.kra_pin }}</span>
                    </div>
                  </div>
                </a-select-option>
              </a-select>
            </a-form-item>
          </div>

          <!-- Section 2 · Order details -->
          <div class="section-card">
            <div class="section-head">
              <span class="section-icon">
                <sdFeatherIcons type="clipboard" size="14" />
              </span>
              <div>
                <h4 class="section-title">Order details</h4>
                <p class="section-sub">Reference number, service type and validity window.</p>
              </div>
              <span v-if="validityLabel" class="lso-validity" :class="validityClass">
                {{ validityLabel }}
              </span>
            </div>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  label="LSO / LPO Number"
                  :validate-status="errors.lso_number ? 'error' : ''"
                  :help="errors.lso_number"
                >
                  <a-input
                    v-model:value="form.lso_number"
                    placeholder="e.g. LPO/2026/0421"
                    size="large"
                  >
                    <template #prefix>
                      <sdFeatherIcons type="hash" size="13" />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Service Type"
                  :validate-status="errors.service_type_id ? 'error' : ''"
                  :help="errors.service_type_id"
                >
                  <a-select
                    v-model:value="form.service_type_id"
                    placeholder="Select service type"
                    size="large"
                  >
                    <a-select-option
                      v-for="t in serviceTypes"
                      :key="t.id"
                      :value="t.id"
                    >{{ t.name || t.service_type_name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  :validate-status="errors.issue_date ? 'error' : ''"
                  :help="errors.issue_date"
                >
                  <template #label>
                    <span class="lbl-row">
                      <span>Issue Date</span>
                      <a class="lbl-link" @click="setIssueToday">Today</a>
                    </span>
                  </template>
                  <a-date-picker
                    v-model:value="form.issue_date"
                    style="width: 100%"
                    size="large"
                    value-format="YYYY-MM-DD"
                    :disabled-date="disableFutureIssue"
                    placeholder="YYYY-MM-DD"
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
                    size="large"
                    value-format="YYYY-MM-DD"
                    :disabled-date="disableBeforeIssue"
                    placeholder="YYYY-MM-DD"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <!-- Section 3 · Document -->
          <div class="section-card">
            <div class="section-head">
              <span class="section-icon">
                <sdFeatherIcons type="paperclip" size="14" />
              </span>
              <div>
                <h4 class="section-title">Document</h4>
                <p class="section-sub">Attach a scanned copy of the signed LSO / LPO.</p>
              </div>
            </div>
            <a-form-item
              :validate-status="errors.file ? 'error' : ''"
              :help="errors.file"
              class="lso-no-label"
            >
              <a-upload-dragger
                :file-list="fileList"
                :before-upload="onPickFile"
                :max-count="1"
                accept=".pdf,.jpg,.jpeg,.png"
                :show-upload-list="false"
                class="lso-dropzone"
                @remove="clearFile"
              >
                <div v-if="!form.file" class="lso-dropzone-empty">
                  <div class="lso-dropzone-icon">
                    <sdFeatherIcons type="upload-cloud" size="22" />
                  </div>
                  <div class="lso-dropzone-title">Drag &amp; drop or click to upload</div>
                  <div class="lso-dropzone-sub">PDF, JPG or PNG &middot; up to 10 MB</div>
                </div>
                <div v-else class="lso-file-card" @click.stop>
                  <div class="lso-file-icon">
                    <sdFeatherIcons
                      :type="form.file?.type === 'application/pdf' ? 'file-text' : 'image'"
                      size="18"
                    />
                  </div>
                  <div class="lso-file-body">
                    <div class="lso-file-name">{{ form.file.name }}</div>
                    <div class="lso-file-meta">
                      {{ humanSize(form.file.size) }} &middot; {{ fileLabel(form.file.type) }}
                    </div>
                  </div>
                  <a class="lso-file-remove" @click.stop="clearFile">
                    <sdFeatherIcons type="x" size="14" />
                  </a>
                </div>
              </a-upload-dragger>
            </a-form-item>
            <a-form-item
              label="Notes"
              :validate-status="errors.notes ? 'error' : ''"
              :help="errors.notes"
              class="lso-notes"
            >
              <a-textarea
                v-model:value="form.notes"
                :rows="3"
                :maxlength="1000"
                show-count
                placeholder="Scope of work, payment terms, or any relevant detail"
              />
            </a-form-item>
          </div>
        </a-form>
      </a-modal>
    </ProcurementPageWrapper>
  </Main>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import { Main } from '../../styled';
import lsoService from '@/services/procurement/vendor-lso.service';
import { useProcurementPermissions } from '@/services/procurement/usePermissions';
import { ProcurementPageWrapper } from './style';

const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

const formatDate = (value) => {
  if (!value) return '—';
  const d = dayjs(value);
  return d.isValid() ? d.format('DD/MM/YYYY') : '—';
};

const blankForm = () => ({
  vendor_id: null,
  service_type_id: null,
  lso_number: '',
  issue_date: null,
  expiry_date: null,
  file: null,
  notes: '',
});

export default {
  name: 'LsosList',
  components: { Main, ProcurementPageWrapper },
  setup() {
    const store = useStore();
    const permissions = useProcurementPermissions();
    let searchTimer = null;

    const filters = reactive({
      search: '',
      vendor_id: null,
      service_type_id: null,
      status: null,
    });

    const modalOpen = ref(false);
    const submitting = ref(false);
    const form = reactive(blankForm());
    const errors = reactive({});
    const fileList = ref([]);

    const lsos = computed(() => store.state.procurement.allLsos);
    const pagination = computed(() => store.state.procurement.allLsosPagination);
    const loading = computed(() => store.state.procurement.loading);
    const vendors = computed(() => store.state.procurement.vendors);
    const serviceTypes = computed(() => store.state.procurement.serviceTypes);

    const paginationConfig = computed(() => ({
      current: pagination.value.page,
      pageSize: pagination.value.perPage,
      total: pagination.value.total,
      showSizeChanger: true,
      pageSizeOptions: ['10', '15', '25', '50'],
      size: 'small',
    }));

    const isExpired = (l) =>
      l.expiry_date && dayjs(l.expiry_date).isBefore(dayjs(), 'day');

    const hasActiveFilters = computed(() =>
      Boolean(
        filters.search ||
          filters.vendor_id ||
          filters.service_type_id ||
          filters.status,
      ),
    );

    const columns = [
      { title: 'LSO / LPO', key: 'lso_number' },
      { title: 'Vendor', key: 'vendor' },
      { title: 'Issued', key: 'issue_date', width: 120 },
      { title: 'Expires', key: 'expiry_date', width: 130 },
      { title: 'Status', key: 'status', width: 100 },
      { title: 'Actions', key: 'actions', width: 110, align: 'right' },
    ];

    const buildParams = (overrides = {}) => ({
      search: filters.search || undefined,
      vendor_id: filters.vendor_id || undefined,
      service_type_id: filters.service_type_id || undefined,
      status: filters.status || undefined,
      page: pagination.value.page,
      per_page: pagination.value.perPage,
      ...overrides,
    });

    const fetch = (overrides = {}) =>
      store.dispatch('procurement/fetchAllLsos', buildParams(overrides));

    const refresh = () => fetch({ page: 1 });
    const onFilterChange = () => fetch({ page: 1 });
    const onSearchInputChange = () => {
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => fetch({ page: 1 }), 350);
    };

    // Debounced search-as-you-type. Watches v-model so typing AND the
    // allow-clear (×) button both trigger a fetch.
    watch(
      () => filters.search,
      () => onSearchInputChange(),
    );
    const onTableChange = (pag) =>
      fetch({ page: pag.current, per_page: pag.pageSize });
    const resetFilters = () => {
      filters.search = '';
      filters.vendor_id = null;
      filters.service_type_id = null;
      filters.status = null;
      onFilterChange();
    };

    const vendorFilter = (input, option) => {
      const q = (input || '').toString().toLowerCase();
      if (!q) return true;
      const name = (option?.label || '').toString().toLowerCase();
      return name.includes(q);
    };

    // ── modal ───────────────────────────────────────────────────────────
    const reset = () => {
      Object.assign(form, blankForm());
      Object.keys(errors).forEach((k) => delete errors[k]);
      fileList.value = [];
    };
    const openCreate = () => { reset(); modalOpen.value = true; };
    const closeModal = () => { modalOpen.value = false; reset(); };

    // ── form helpers ────────────────────────────────────────────────────
    const setIssueToday = () => {
      form.issue_date = dayjs().format('YYYY-MM-DD');
    };
    const disableFutureIssue = (current) => current && current.isAfter(dayjs(), 'day');
    const disableBeforeIssue = (current) => {
      if (!current) return false;
      const ref = form.issue_date ? dayjs(form.issue_date) : null;
      return ref ? current.isBefore(ref, 'day') : false;
    };

    const validityLabel = computed(() => {
      if (!form.issue_date || !form.expiry_date) return '';
      const days = dayjs(form.expiry_date).diff(dayjs(form.issue_date), 'day');
      if (days < 0) return 'Invalid range';
      if (days === 0) return 'Valid for 1 day';
      return `Valid for ${days} day${days === 1 ? '' : 's'}`;
    });
    const validityClass = computed(() => {
      if (!validityLabel.value) return '';
      if (validityLabel.value === 'Invalid range') return 'lv-bad';
      const days = dayjs(form.expiry_date).diff(dayjs(form.issue_date), 'day');
      if (days <= 30) return 'lv-warn';
      return 'lv-ok';
    });

    const humanSize = (bytes) => {
      if (!bytes && bytes !== 0) return '';
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    const fileLabel = (mime) => {
      if (mime === 'application/pdf') return 'PDF';
      if (mime === 'image/png') return 'PNG image';
      if (mime === 'image/jpeg' || mime === 'image/jpg') return 'JPEG image';
      return 'File';
    };

    const onPickFile = (file) => {
      const okType = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
      const okSize = file.size <= 10 * 1024 * 1024;
      if (!okType) {
        notification.error({ message: 'Invalid file type', description: 'PDF, JPG, JPEG or PNG only.' });
        return false;
      }
      if (!okSize) {
        notification.error({ message: 'File too large', description: 'Max size 10MB.' });
        return false;
      }
      form.file = file;
      fileList.value = [{ uid: file.uid, name: file.name, status: 'done' }];
      return false;
    };
    const clearFile = () => { form.file = null; fileList.value = []; };

    const validate = () => {
      Object.keys(errors).forEach((k) => delete errors[k]);
      if (!form.vendor_id) errors.vendor_id = 'Required';
      if (!form.service_type_id) errors.service_type_id = 'Required';
      if (!form.lso_number?.trim()) errors.lso_number = 'Required';
      if (!form.issue_date) errors.issue_date = 'Required';
      if (!form.expiry_date) errors.expiry_date = 'Required';
      else if (form.issue_date && dayjs(form.expiry_date).isBefore(dayjs(form.issue_date))) {
        errors.expiry_date = 'Must be after issue date';
      }
      if (!form.file) errors.file = 'File is required';
      return Object.keys(errors).length === 0;
    };

    const onSubmit = async () => {
      if (!validate()) return;
      submitting.value = true;
      try {
        await store.dispatch('procurement/createLso', {
          vendorId: form.vendor_id,
          payload: {
            service_type_id: form.service_type_id,
            lso_number: form.lso_number.trim(),
            issue_date: form.issue_date,
            expiry_date: form.expiry_date,
            notes: form.notes || '',
            file: form.file,
          },
        });
        modalOpen.value = false;
        reset();
        fetch();
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

    const download = async (lso) => {
      try {
        const response = await lsoService.download(lso.vendor_id, lso.id);
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

    onMounted(() => {
      // Vendors and service types for filter + form pickers.
      store.dispatch('procurement/fetchVendors', { page: 1, perPage: 200 });
      store.dispatch('procurement/fetchServiceTypes');
      fetch({ page: 1 });
    });

    onBeforeUnmount(() => {
      if (searchTimer) {
        clearTimeout(searchTimer);
        searchTimer = null;
      }
    });

    return {
      ...permissions,
      filters,
      lsos,
      vendors,
      serviceTypes,
      loading,
      pagination,
      paginationConfig,
      hasActiveFilters,
      columns,
      modalOpen,
      submitting,
      form,
      errors,
      fileList,
      fmt,
      formatDate,
      isExpired,
      refresh,
      onFilterChange,
      onSearchInputChange,
      onTableChange,
      resetFilters,
      vendorFilter,
      openCreate,
      closeModal,
      onPickFile,
      clearFile,
      onSubmit,
      download,
      setIssueToday,
      disableFutureIssue,
      disableBeforeIssue,
      validityLabel,
      validityClass,
      humanSize,
      fileLabel,
    };
  },
};
</script>

<style lang="less" scoped>
.bp-min {
  padding-top: 24px;
}
.bp-head-main {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}
.bp-head-main .bp-sub {
  color: #7a8a82;
  font-size: 13px;
}
.filter-row .bp-search {
  width: 220px;
}
</style>

<style lang="less">
/* ────────────────────────────────────────────────────────────────
   New LSO / LPO modal – scoped via wrap-class-name="lso-create-modal"
   so we can reach the body, header and antd-injected elements.
   ──────────────────────────────────────────────────────────────── */
.lso-create-modal .ant-modal-content {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 18px 60px -20px rgba(0, 0, 0, 0.4);
}
.lso-create-modal .ant-modal-header {
  padding: 0;
  border-bottom: 0;
  background: linear-gradient(135deg, #15693c 0%, #1f9254 60%, #36b16f 100%);
}
.lso-create-modal .ant-modal-close {
  color: rgba(255, 255, 255, 0.9);
  top: 14px;
  right: 16px;
}
.lso-create-modal .ant-modal-close-x {
  color: inherit;
  width: 38px;
  height: 38px;
  line-height: 38px;
}
.lso-create-modal .ant-modal-body {
  background: #f6f8fa;
}
.lso-create-modal .ant-modal-footer {
  padding: 14px 22px;
  background: #fff;
  border-top: 1px solid #eef2f5;
}
.lso-create-modal .ant-modal-footer .ant-btn {
  height: 38px;
  border-radius: 999px;
  padding: 0 22px;
  font-weight: 600;
}
.lso-create-modal .ant-modal-footer .ant-btn-primary {
  background: #15693c;
  border-color: #15693c;
  box-shadow: 0 6px 14px -6px rgba(21, 105, 60, 0.6);
}
.lso-create-modal .ant-modal-footer .ant-btn-primary:hover {
  background: #1f9254;
  border-color: #1f9254;
}

/* Hero (modal title) */
.lso-hero {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 24px;
  color: #fff;
}
.lso-hero-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lso-hero-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.2px;
}
.lso-hero-sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
}

/* Form body (sections) */
.lso-form {
  padding: 18px 22px 6px;
  max-height: 72vh;
  overflow-y: auto;
}
.lso-create-modal .section-card {
  background: #fff;
  border: 1px solid #e6ecef;
  border-radius: 12px;
  padding: 18px 20px 6px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(28, 122, 72, 0.04);
}
.lso-create-modal .section-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #eef2f5;
}
.lso-create-modal .section-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #eafff5;
  border: 1px solid #c9e6d3;
  color: #15693c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lso-create-modal .section-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #15693c;
  letter-spacing: 0.3px;
}
.lso-create-modal .section-sub {
  margin: 2px 0 0;
  font-size: 11px;
  color: #8a9399;
  line-height: 1.5;
}
.lso-validity {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.2px;
}
.lso-validity.lv-ok {
  background: #eafff5;
  color: #15693c;
  border: 1px solid #c9e6d3;
}
.lso-validity.lv-warn {
  background: #fff4e0;
  color: #b06b00;
}
.lso-validity.lv-bad {
  background: #fde9e9;
  color: #c0392b;
}

/* Form item tweaks */
.lso-form .ant-form-item {
  margin-bottom: 14px;
}
.lso-form .ant-form-item-label > label {
  font-weight: 500;
  color: #4a5560;
  font-size: 13px;
}
.lso-form .lso-no-label .ant-form-item-label {
  display: none;
}
.lso-form .ant-input-affix-wrapper-lg,
.lso-form .ant-select-lg .ant-select-selector,
.lso-form .ant-picker-large {
  border-radius: 8px;
}
.lso-form .lbl-row {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}
.lso-form .lbl-link {
  font-size: 11px;
  color: #15693c;
  font-weight: 600;
  cursor: pointer;
}
.lso-form .lbl-link:hover {
  text-decoration: underline;
}

/* Vendor option */
.vendor-option {
  padding: 2px 0;
}
.vendor-option-name {
  font-size: 13px;
  font-weight: 500;
  color: #2a3036;
  line-height: 1.25;
}
.vendor-option-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  font-size: 11px;
  color: #8a9690;
}
.vendor-tag {
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2px;
  text-transform: uppercase;
}
.vendor-tag.vt-private {
  background: #eafff5;
  color: #15693c;
}
.vendor-tag.vt-public {
  background: #e8effb;
  color: #335ec7;
}

/* Dropzone */
.lso-dropzone.ant-upload.ant-upload-drag {
  border-radius: 10px;
  border: 1.5px dashed #d8dde2;
  background: #fafbfc;
  transition: all 0.15s ease;
}
.lso-dropzone.ant-upload.ant-upload-drag:hover {
  border-color: #15693c;
  background: #f4fbf8;
}
.lso-dropzone .ant-upload {
  padding: 10px 0;
}
.lso-dropzone-empty {
  padding: 14px 16px;
  text-align: center;
}
.lso-dropzone-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #eafff5;
  color: #15693c;
  margin: 0 auto 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.lso-dropzone-title {
  font-size: 13px;
  font-weight: 600;
  color: #2a3036;
}
.lso-dropzone-sub {
  font-size: 11px;
  color: #8a9690;
  margin-top: 2px;
}

/* Selected file card inside dropzone */
.lso-file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  margin: 4px 12px;
  background: #fff;
  border: 1px solid #e6eae8;
  border-radius: 10px;
  text-align: left;
}
.lso-file-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #eafff5;
  color: #15693c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lso-file-body {
  flex: 1;
  min-width: 0;
}
.lso-file-name {
  font-size: 13px;
  font-weight: 600;
  color: #2a3036;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lso-file-meta {
  font-size: 11px;
  color: #8a9690;
  margin-top: 1px;
}
.lso-file-remove {
  color: #8a9690;
  padding: 4px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.lso-file-remove:hover {
  color: #c0392b;
  background: #fde9e9;
}

.lso-notes .ant-input {
  border-radius: 8px;
}
</style>
