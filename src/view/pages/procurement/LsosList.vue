<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard procurement-page">
        <!-- Page heading (matching events/budget design) -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▤</span> LSOs / LPOs
            </h3>
            <p class="ph-subtitle">
              Local Service Orders &amp; LPOs linked to vendors across all sub-counties.
            </p>
          </div>
          <div class="ph-actions">
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

      <!-- Filter panel (filters left, search right) -->
      <section class="panel filter-panel">
        <div class="filter-grid">
          <a-select
            v-model:value="filters.vendor_id"
            placeholder="Vendor"
            allow-clear
            show-search
            :filter-option="vendorFilter"
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
            @change="onFilterChange"
          >
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="expired">Expired</a-select-option>
            <a-select-option value="delinked">Delinked</a-select-option>
          </a-select>
          <sdButton
            size="small"
            class="pill-btn lso-clear-btn"
            :disabled="!hasActiveFilters"
            @click="resetFilters"
          >Clear</sdButton>
        </div>

        <div class="lso-search">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            v-model:value="filters.search"
            type="text"
            name="q"
            placeholder="Search LSO number or vendor…"
            allow-clear
            @pressEnter="onFilterChange"
          />
        </div>
      </section>

      <!-- LSOs table -->
      <section class="panel lso-content-panel">
        <a-table
          class="minimal-table"
          :data-source="lsos"
          :columns="columns"
          row-key="id"
          size="middle"
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
              <span :class="isExpired(record) && !isDelinked(record) ? 'danger' : ''">
                {{ formatDate(record.expiry_date) }}
              </span>
            </template>

            <template v-else-if="column.key === 'status'">
              <span class="v-chip" :class="statusChipClass(record)">
                {{ statusLabel(record) }}
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
                <a-tooltip v-if="canManageVendors" title="Edit">
                  <span class="action-icon" @click="openEdit(record)">
                    <sdFeatherIcons type="edit-2" size="13" />
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
                        {{ vendorCategoryShortLabel(v.category) }}
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
                  <div class="lso-dropzone-sub">
                    PDF, JPG or PNG &middot; up to {{ LSO_MAX_FILE_MB }} MB
                  </div>
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

      <!-- Edit LSO modal (edit directly from the list) -->
      <a-modal
        :visible="editModalOpen"
        :title="`Edit LSO — ${editing?.lso_number || ''}`"
        :confirm-loading="editSubmitting"
        :ok-text="editSubmitting ? 'Saving…' : 'Save Changes'"
        cancel-text="Cancel"
        :mask-closable="false"
        width="680px"
        wrap-class-name="lso-edit-modal"
        @cancel="closeEditModal"
        @ok="onSubmitEdit"
        @update:visible="(v) => (editModalOpen = v)"
      >
        <a-form layout="vertical" class="lso-form">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                label="LSO / LPO Number"
                :validate-status="editErrors.lso_number ? 'error' : ''"
                :help="editErrors.lso_number"
              >
                <a-input
                  v-model:value="editForm.lso_number"
                  placeholder="e.g. LPO/2026/0421"
                  size="large"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="Service Type"
                :validate-status="editErrors.service_type_id ? 'error' : ''"
                :help="editErrors.service_type_id"
              >
                <a-select
                  v-model:value="editForm.service_type_id"
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
                label="Issue Date"
                :validate-status="editErrors.issue_date ? 'error' : ''"
                :help="editErrors.issue_date"
              >
                <a-date-picker
                  v-model:value="editForm.issue_date"
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
                :validate-status="editErrors.expiry_date ? 'error' : ''"
                :help="editErrors.expiry_date"
              >
                <a-date-picker
                  v-model:value="editForm.expiry_date"
                  style="width: 100%"
                  size="large"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disableBeforeIssueEdit"
                  placeholder="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item
            label="Notes"
            :validate-status="editErrors.notes ? 'error' : ''"
            :help="editErrors.notes"
          >
            <a-textarea
              v-model:value="editForm.notes"
              :rows="3"
              :maxlength="1000"
              show-count
              placeholder="Scope of work, payment terms, or any relevant detail"
            />
          </a-form-item>
          <a-form-item
            label="Replace document (optional)"
            :validate-status="editErrors.file ? 'error' : ''"
            :help="editErrors.file"
          >
            <a-upload-dragger
              :file-list="editFileList"
              :before-upload="onPickEditFile"
              :max-count="1"
              accept=".pdf,.jpg,.jpeg,.png"
              :show-upload-list="false"
              class="lso-dropzone"
              @remove="clearEditFile"
            >
              <div v-if="!editForm.file" class="lso-dropzone-empty">
                <div class="lso-dropzone-icon">
                  <sdFeatherIcons type="upload-cloud" size="22" />
                </div>
                <div class="lso-dropzone-title">Drop a new document or click to replace</div>
                <div class="lso-dropzone-sub">
                  PDF, JPG or PNG &middot; up to {{ LSO_MAX_FILE_MB }} MB
                </div>
              </div>
              <div v-else class="lso-file-card" @click.stop>
                <div class="lso-file-icon">
                  <sdFeatherIcons
                    :type="editForm.file?.type === 'application/pdf' ? 'file-text' : 'image'"
                    size="18"
                  />
                </div>
                <div class="lso-file-body">
                  <div class="lso-file-name">{{ editForm.file.name }}</div>
                  <div class="lso-file-meta">
                    {{ humanSize(editForm.file.size) }} &middot; {{ fileLabel(editForm.file.type) }}
                  </div>
                </div>
                <a class="lso-file-remove" @click.stop="clearEditFile">
                  <sdFeatherIcons type="x" size="14" />
                </a>
              </div>
            </a-upload-dragger>
          </a-form-item>
        </a-form>
      </a-modal>
    </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import { Main } from '../../styled';
import lsoService from '@/services/procurement/vendor-lso.service';
import { useProcurementPermissions } from '@/services/procurement/usePermissions';
import { RecordViewWrapper } from '../events/style';
import { BudgetPageWrapper } from '../budget/style';
import {
  LSO_MAX_FILE_BYTES,
  LSO_MAX_FILE_MB,
  PROCUREMENT_DOCUMENT_MIME_TYPES,
} from '@/config/procurement';
import { vendorCategoryShortLabel } from '@/config/vendor-categories';

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
  components: { Main, RecordViewWrapper, BudgetPageWrapper },
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

    const isDelinked = (l) => !!l?.is_delinked;

    // Delinked takes precedence over expired — the order can no longer be used.
    const statusOf = (l) => {
      if (isDelinked(l)) return 'delinked';
      return isExpired(l) ? 'expired' : 'active';
    };

    const statusLabel = (l) =>
      ({ delinked: 'Delinked', expired: 'Expired', active: 'Active' }[statusOf(l)]);

    const statusChipClass = (l) =>
      ({ delinked: 'purple', expired: 'warn', active: 'green' }[statusOf(l)]);

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

    // ── edit modal ────────────────────────────────────────────────────────
    const editModalOpen = ref(false);
    const editSubmitting = ref(false);
    const editing = ref(null);
    const editForm = reactive({
      service_type_id: null,
      lso_number: '',
      issue_date: null,
      expiry_date: null,
      notes: '',
      file: null,
    });
    const editErrors = reactive({});
    const editFileList = ref([]);

    const editBlankForm = (record) => ({
      service_type_id: record.service_type_id,
      lso_number: record.lso_number || '',
      issue_date: record.issue_date,
      expiry_date: record.expiry_date,
      notes: record.notes || '',
      file: null,
    });

    const resetEdit = () => {
      Object.assign(editForm, { service_type_id: null, lso_number: '', issue_date: null, expiry_date: null, notes: '', file: null });
      Object.keys(editErrors).forEach((k) => delete editErrors[k]);
      editFileList.value = [];
      editing.value = null;
    };

    const openEdit = (record) => {
      resetEdit();
      editing.value = record;
      Object.assign(editForm, editBlankForm(record));
      editModalOpen.value = true;
    };

    const closeEditModal = () => {
      editModalOpen.value = false;
      resetEdit();
    };

    const onPickEditFile = (file) => {
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
      editForm.file = file;
      editFileList.value = [{ uid: file.uid, name: file.name, status: 'done' }];
      return false;
    };

    const clearEditFile = () => { editForm.file = null; editFileList.value = []; };

    const validateEdit = () => {
      Object.keys(editErrors).forEach((k) => delete editErrors[k]);
      if (!editForm.service_type_id) editErrors.service_type_id = 'Required';
      if (!editForm.lso_number?.trim()) editErrors.lso_number = 'Required';
      if (!editForm.issue_date) editErrors.issue_date = 'Required';
      if (!editForm.expiry_date) editErrors.expiry_date = 'Required';
      else if (editForm.issue_date && dayjs(editForm.expiry_date).isBefore(dayjs(editForm.issue_date))) {
        editErrors.expiry_date = 'Must be after issue date';
      }
      if (editForm.notes && editForm.notes.length > 1000) editErrors.notes = 'Max 1000 characters';
      return Object.keys(editErrors).length === 0;
    };

    const disableBeforeIssueEdit = (current) => {
      if (!current) return false;
      const ref = editForm.issue_date ? dayjs(editForm.issue_date) : null;
      return ref ? current.isBefore(ref, 'day') : false;
    };

    const onSubmitEdit = async () => {
      if (!validateEdit()) return;
      editSubmitting.value = true;
      try {
        const payload = {
          service_type_id: editForm.service_type_id,
          lso_number: editForm.lso_number.trim(),
          issue_date: editForm.issue_date,
          expiry_date: editForm.expiry_date,
          notes: editForm.notes || '',
        };
        if (editForm.file) payload.file = editForm.file;

        await store.dispatch('procurement/updateLso', {
          vendorId: editing.value.vendor_id,
          id: editing.value.id,
          payload,
        });
        editModalOpen.value = false;
        resetEdit();
        fetch();
      } catch (e) {
        const fe = e?.response?.data?.errors;
        if (fe) {
          Object.entries(fe).forEach(([k, v]) => {
            editErrors[k] = Array.isArray(v) ? v[0] : String(v);
          });
        }
      } finally {
        editSubmitting.value = false;
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
      LSO_MAX_FILE_MB,
      vendorCategoryShortLabel,
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
      isDelinked,
      statusLabel,
      statusChipClass,
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
      // edit modal
      editModalOpen,
      editSubmitting,
      editing,
      editForm,
      editErrors,
      editFileList,
      openEdit,
      closeEditModal,
      onPickEditFile,
      clearEditFile,
      onSubmitEdit,
      disableBeforeIssueEdit,
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

/* Platform page heading + header search pill */
.procurement-page {
  :deep(.page-heading) {
    .ph-title {
      color: #1f2437;
      .ph-icon {
        color: #15693c;
        font-size: 18px;
      }
    }
    .ph-subtitle {
      color: #7a8a82;
    }
  }

  .lso-search {
    position: relative;
    display: flex;
    align-items: center;
    width: 280px;
    max-width: 100%;
    .search-icon {
      position: absolute;
      left: 14px;
      color: #9ab8a8;
      display: flex;
      z-index: 1;
    }
    :deep(input) {
      height: 100%;
      width: 100%;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
    }
    :deep(.ant-input-affix-wrapper) {
      display: flex;
      align-items: center;
      border-radius: 22px;
      border: 1px solid #d9f0e2;
      background: #f7fdf9;
      padding: 0 16px 0 36px;
      height: 40px;
      width: 100%;
      max-width: 100%;
    }
  }

  @media (max-width: 575px) {
    .lso-search {
      width: 100%;
    }
  }
}

/* Filter panel: filters on the left, search pinned to the right */
.filter-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
}
.filter-panel .lso-search {
  flex: 0 0 auto;
  margin-left: auto;
}
.filter-grid {
  flex: 1 1 0;
  min-width: 240px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  :deep(.ant-select) {
    width: 100%;
  }
}
.lso-clear-btn {
  height: 40px;
  width: 100%;
}
@media (max-width: 575px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
}

/* Content panel + table (matches the Distribution Posts listing look) */
.panel {
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  overflow: hidden;
  &.flush { padding: 0; }
}
.lso-content-panel {
  padding: 10px;
}
:deep(.minimal-table) {
  .ant-table {
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }
  .ant-table-thead > tr > th {
    background: #f4fbf6;
    color: #2f6746;
    font-weight: 700;
    border-bottom: 1px solid #e1efe6;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f7f3;
  }
  .ant-table-tbody > tr:hover > td {
    background: #f5fbf7;
  }
}

/* Cell links / chips / actions / empty state / pills */
.vendor-link {
  font-weight: 700;
  color: #1f2437;
  cursor: pointer;
  &:hover { color: #15693c; }
}
.vendor-meta {
  font-size: 11px;
  color: #8a90a6;
  margin-top: 2px;
}
.danger {
  color: #c43d3d;
  font-weight: 700;
}
.v-chip {
  display: inline-block;
  background: #eef3fb;
  color: #2f6dcf;
  border: 1px solid #d7e3f5;
  border-radius: 10px;
  padding: 1px 9px;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  &.green { background: #eafff5; color: #15693c; border-color: #c9e6d3; }
  &.purple { background: #f3ebff; color: #6f3fcc; border-color: #d8c5f5; }
  &.warn { background: #fff4e0; color: #b35a00; border-color: #f3c97c; }
  &.muted { background: #f0f2f5; color: #7a8a82; border-color: #e1e6ec; }
}
.action-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5a6470;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #f0f7f2;
    color: #15693c;
  }
  &.danger:hover {
    background: #fff1f1;
    color: #c43d3d;
  }
}
.empty-state {
  text-align: center;
  padding: 48px 16px;
  color: #9aa6ad;
  .empty-icon { font-size: 38px; opacity: 0.4; margin-bottom: 8px; }
  .empty-title { font-size: 14px; font-weight: 700; color: #4d5661; margin-bottom: 4px; }
  .empty-desc { font-size: 12px; max-width: 340px; margin: 0 auto 12px; line-height: 1.5; }
}
.pill-btn {
  background: #fff !important;
  border: 1px solid #e1e6ec !important;
  color: #4d5661 !important;
  border-radius: 999px !important;
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
      color: #fff !important;
    }
  }
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
.vendor-tag.vt-fbo {
  background: #f3ebff;
  color: #6f3fcc;
}
.vendor-tag.vt-cbo {
  background: #fff6e5;
  color: #a86400;
}
.vendor-tag.vt-ngo {
  background: #fdecf3;
  color: #a83262;
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
