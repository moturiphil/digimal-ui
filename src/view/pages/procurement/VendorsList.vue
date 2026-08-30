<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard procurement-page">
        <!-- Page heading (matching events/budget design) -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">🏢</span> Vendors
            </h3>
            <p class="ph-subtitle">
              Manage registered suppliers — view profiles, bank accounts, contacts and LSO records.
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
              <sdFeatherIcons type="plus" size="13" /> New Vendor
            </sdButton>
          </div>
        </header>

        <!-- Summary row -->
        <div class="sum-row">
          <div class="sum-card">
            <span class="sum-label">Total Vendors</span>
            <span class="sum-value">{{ fmt(pagination.total) }}</span>
          </div>
          <div class="sum-card">
            <span class="sum-label">Active</span>
            <span class="sum-value active">{{ fmt(activeCount) }}</span>
          </div>
          <div class="sum-card">
            <span class="sum-label">Private</span>
            <span class="sum-value private">{{ fmt(privateCount) }}</span>
          </div>
          <div class="sum-card">
            <span class="sum-label">Public</span>
            <span class="sum-value public">{{ fmt(publicCount) }}</span>
          </div>
        </div>

        <!-- Filter row -->
      <div class="filter-row">
        <a-input
          v-model:value="filters.search"
          placeholder="Search name, KRA…"
          allow-clear
          size="small"
          class="bp-search"
          @pressEnter="onFilterChange"
        />
        <a-select
          v-model:value="filters.category"
          placeholder="Category"
          allow-clear
          size="small"
          class="bp-select"
          @change="onFilterChange"
        >
          <a-select-option value="private">Private</a-select-option>
          <a-select-option value="public">Public</a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.county_id"
          placeholder="County"
          allow-clear
          show-search
          size="small"
          :filter-option="optionFilter"
          class="bp-select"
          @change="onCountyChange"
        >
          <a-select-option v-for="c in counties" :key="c.id" :value="c.id">
            {{ c.name || c.county_name }}
          </a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.sub_county_id"
          placeholder="Sub-County"
          allow-clear
          show-search
          size="small"
          :filter-option="optionFilter"
          :disabled="!filters.county_id"
          class="bp-select"
          @change="onFilterChange"
        >
          <a-select-option v-for="s in subcountiesForSelected" :key="s.id" :value="s.id">
            {{ s.name || s.sub_county_name }}
          </a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.is_active"
          placeholder="Status"
          allow-clear
          size="small"
          class="bp-select"
          @change="onFilterChange"
        >
          <a-select-option :value="1">Active</a-select-option>
          <a-select-option :value="0">Inactive</a-select-option>
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
          :data-source="vendors"
          :columns="columns"
          row-key="id"
          size="small"
          :loading="loading"
          :pagination="paginationConfig"
          @change="onTableChange"
        >
          <template #emptyText>
            <div class="empty-state">
              <div class="empty-icon">▦</div>
              <div class="empty-title">No vendors found</div>
              <div class="empty-desc">
                Add your first vendor to start managing suppliers, bank accounts
                and Local Service Orders.
              </div>
              <sdButton
                v-if="canManageVendors"
                size="small"
                class="pill-btn is-primary"
                @click="openCreate"
              >+ New Vendor</sdButton>
            </div>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <router-link
                :to="`/procurement/vendors/${record.id}`"
                class="vendor-link"
              >{{ record.name }}</router-link>
              <div v-if="record.kra_pin" class="vendor-meta">
                KRA: {{ record.kra_pin }}
              </div>
            </template>

            <template v-else-if="column.key === 'category'">
              <span
                class="v-chip"
                :class="record.category === 'public' ? 'purple' : ''"
              >
                {{ (record.category || '—').toUpperCase() }}
              </span>
            </template>

            <template v-else-if="column.key === 'location'">
              <div>{{ record.county?.name || record.county?.county_name || '—' }}</div>
              <div class="muted">
                {{ record.sub_county?.name || record.sub_county?.sub_county_name || '' }}
              </div>
            </template>

            <template v-else-if="column.key === 'is_active'">
              <span class="v-chip" :class="record.is_active ? 'green' : 'muted'">
                {{ record.is_active ? 'Active' : 'Inactive' }}
              </span>
            </template>

            <template v-else-if="column.key === 'actions'">
              <a-space :size="2">
                <a-tooltip title="View">
                  <router-link :to="`/procurement/vendors/${record.id}`">
                    <span class="action-icon">
                      <sdFeatherIcons type="eye" size="13" />
                    </span>
                  </router-link>
                </a-tooltip>
                <a-tooltip v-if="canManageVendors" title="Edit">
                  <span class="action-icon" @click="openEdit(record)">
                    <sdFeatherIcons type="edit-2" size="13" />
                  </span>
                </a-tooltip>
                <a-tooltip
                  v-if="canApproveVendor"
                  :title="record.is_active ? 'Deactivate' : 'Activate'"
                >
                  <span
                    class="action-icon"
                    :class="record.is_active ? 'danger' : 'success'"
                    @click="onToggle(record)"
                  >
                    <sdFeatherIcons
                      :type="record.is_active ? 'pause-circle' : 'play-circle'"
                      size="13"
                    />
                  </span>
                </a-tooltip>
                <a-popconfirm
                  v-if="canDeleteVendor"
                  title="Delete this vendor?"
                  ok-text="Delete"
                  cancel-text="Cancel"
                  @confirm="onDelete(record)"
                >
                  <a-tooltip title="Delete">
                    <span class="action-icon danger">
                      <sdFeatherIcons type="trash-2" size="13" />
                    </span>
                  </a-tooltip>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </a-table>
      </section>

        <!-- Vendor form modal -->
        <VendorFormModal
          v-model:open="modalOpen"
          :vendor="editing"
          @saved="onSaved"
        />
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useStore } from 'vuex';
import { Main } from '../../styled';
import VendorFormModal from './VendorFormModal.vue';
import { useProcurementPermissions } from '@/services/procurement/usePermissions';
import { RecordViewWrapper } from '../events/style';
import { BudgetPageWrapper } from '../budget/style';

const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

export default {
  name: 'VendorsList',
  components: { Main, VendorFormModal, RecordViewWrapper, BudgetPageWrapper },
  setup() {
    const store = useStore();
    const permissions = useProcurementPermissions();

    // Scoped per-instance so debounce timers don't leak across components
    // or fire after unmount.
    let searchTimer = null;

    const filters = reactive({
      search: '',
      category: null,
      county_id: null,
      sub_county_id: null,
      is_active: null,
    });

    const modalOpen = ref(false);
    const editing = ref(null);

    const vendors = computed(() => store.state.procurement.vendors);
    const pagination = computed(() => store.state.procurement.pagination);
    const loading = computed(() => store.state.procurement.loading);
    const counties = computed(() => store.state.procurement.counties);
    const activeCount = computed(() => vendors.value.filter((v) => v.is_active).length);
    const privateCount = computed(() => vendors.value.filter((v) => v.category === 'private').length);
    const publicCount = computed(() => vendors.value.filter((v) => v.category === 'public').length);
    const subcountiesForSelected = computed(() =>
      store.getters['procurement/subcountiesFor'](filters.county_id),
    );

    const paginationConfig = computed(() => ({
      current: pagination.value.page,
      pageSize: pagination.value.perPage,
      total: pagination.value.total,
      showSizeChanger: true,
      pageSizeOptions: ['10', '15', '25', '50'],
      size: 'small',
    }));

    const hasActiveFilters = computed(() =>
      Boolean(
        filters.search ||
          filters.category ||
          filters.county_id ||
          filters.sub_county_id ||
          filters.is_active !== null,
      ),
    );

    const columns = [
      { title: 'Vendor', key: 'name' },
      { title: 'Category', key: 'category', width: 110 },
      { title: 'Location', key: 'location', width: 200 },
      { title: 'Status', key: 'is_active', width: 100 },
      { title: 'Actions', key: 'actions', width: 170, align: 'right' },
    ];

    const dispatchFetch = (overrides = {}) => {
      store.commit('procurement/setFilters', filters);
      return store.dispatch('procurement/fetchVendors', overrides);
    };

    const refresh = () => dispatchFetch({ page: 1 });
    const onFilterChange = () => dispatchFetch({ page: 1 });

    const onSearchInputChange = () => {
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => dispatchFetch({ page: 1 }), 350);
    };

    // Debounced search-as-you-type. Watches v-model so typing AND the
    // allow-clear (×) button both trigger a fetch.
    watch(
      () => filters.search,
      () => onSearchInputChange(),
    );

    const onCountyChange = (countyId) => {
      filters.sub_county_id = null;
      if (countyId) store.dispatch('procurement/fetchSubcounties', { countyId });
      onFilterChange();
    };

    const onTableChange = (pag) => {
      dispatchFetch({ page: pag.current, perPage: pag.pageSize });
    };

    const resetFilters = () => {
      filters.search = '';
      filters.category = null;
      filters.county_id = null;
      filters.sub_county_id = null;
      filters.is_active = null;
      onFilterChange();
    };

    const openCreate = () => {
      editing.value = null;
      modalOpen.value = true;
    };
    const openEdit = (record) => {
      editing.value = record;
      modalOpen.value = true;
    };
    const onSaved = () => {
      modalOpen.value = false;
      dispatchFetch();
    };

    const onToggle = async (record) => {
      await store.dispatch('procurement/toggleVendorStatus', record.id);
    };
    const onDelete = async (record) => {
      await store.dispatch('procurement/deleteVendor', record.id);
      dispatchFetch();
    };

    const optionFilter = (input, option) =>
      (option?.children?.[0]?.children || option?.label || '')
        .toString()
        .toLowerCase()
        .includes(input.toLowerCase());

    onMounted(() => {
      store.dispatch('procurement/fetchCounties');
      dispatchFetch({ page: 1 });
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
      vendors,
      counties,
      subcountiesForSelected,
      activeCount,
      privateCount,
      publicCount,
      loading,
      pagination,
      paginationConfig,
      hasActiveFilters,
      columns,
      modalOpen,
      editing,
      fmt,
      refresh,
      onFilterChange,
      onSearchInputChange,
      onCountyChange,
      onTableChange,
      resetFilters,
      openCreate,
      openEdit,
      onSaved,
      onToggle,
      onDelete,
      optionFilter,
    };
  },
};
</script>

<style lang="less" scoped>
.procurement-page {
  /* Match the green page-heading used in events / budget pages */
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
}

/* Summary cards row */
.sum-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}
.sum-card {
  background: linear-gradient(135deg, #f3fcf6 0%, #f9fffb 55%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: box-shadow 0.15s, transform 0.15s;
  &:hover {
    box-shadow: 0 6px 14px rgba(28, 122, 72, 0.1);
    transform: translateY(-1px);
  }
}
.sum-label {
  font-size: 11px;
  color: #7a8a82;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.sum-value {
  font-size: 24px;
  font-weight: 800;
  color: #15693c;
  line-height: 1.1;
  &.active { color: #20c997; }
  &.private { color: #2c99ff; }
  &.public { color: #9254de; }
}
@media (max-width: 768px) {
  .sum-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 420px) {
  .sum-row {
    grid-template-columns: 1fr;
  }
}

/* Filter row polish */
.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  .bp-search { width: 220px; }
  .bp-select { min-width: 140px; }
}
@media (max-width: 575px) {
  .filter-row .bp-search,
  .filter-row .bp-select {
    width: 100%;
    min-width: 0;
  }
}

/* Table + cells */
.panel {
  background: #fff;
  border: 1px solid #e1efe6;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(28, 122, 72, 0.04);
  overflow: hidden;
  &.flush { padding: 0; }
}
:deep(.minimal-table) {
  .ant-table {
    background: transparent;
  }
  .ant-table-thead > tr > th {
    background: #f4fbf6;
    border-bottom: 1px solid #d9f0e2;
    color: #2f6746;
    font-weight: 700;
    font-size: 11px;
    text-transform: none;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #eaf4ee;
    font-size: 12.5px;
    font-weight: 500;
    color: #000000;
  }
  .ant-table-tbody > tr:hover > td {
    background: #f5fbf7;
  }
}

/* Vendor name link */
.v-link {
  color: #15693c;
  font-weight: 600;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

/* Category chip */
.v-cat {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 2px 10px;
  border-radius: 999px;
  &.private {
    background: #eafff5;
    color: #15693c;
    border: 1px solid #c9e6d3;
  }
  &.public {
    background: #e8effb;
    color: #335ec7;
    border: 1px solid #c7d8f3;
  }
}

/* Location */
.v-loc {
  font-size: 12.5px;
  font-weight: 500;
  color: #000000;
}

/* Status pill */
.v-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #b8c2c8;
  }
  &.active {
    color: #15693c;
    .dot { background: #20c997; box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.15); }
  }
  &.inactive {
    color: #c43d3d;
    .dot { background: #f05a5a; }
  }
}

/* Action icons */
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

/* Empty state */
.empty-state {
  text-align: center;
  padding: 48px 16px;
  color: #9aa6ad;
  .empty-icon { font-size: 44px; opacity: 0.4; margin-bottom: 10px; }
  .empty-title { font-size: 15px; font-weight: 700; color: #4d5661; margin-bottom: 4px; }
  .empty-desc { font-size: 12px; max-width: 320px; margin: 0 auto 14px; line-height: 1.5; }
}

/* Pill buttons (shared) */
.pill-btn {
  border-radius: 999px !important;
  font-weight: 600;
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
