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
            <div class="vd-view-toggle" role="group" aria-label="Toggle view">
              <button
                type="button"
                class="vd-toggle-btn"
                :class="{ active: viewMode === 'cards' }"
                @click="viewMode = 'cards'"
              >
                <sdFeatherIcons type="grid" size="14" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                class="vd-toggle-btn"
                :class="{ active: viewMode === 'table' }"
                @click="viewMode = 'table'"
              >
                <sdFeatherIcons type="list" size="14" />
                <span>Table</span>
              </button>
            </div>
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

        <!-- Filter panel (events/activities style) -->
      <section class="panel filter-panel">
        <div class="filter-grid">
          <a-select
            v-model:value="filters.category"
            placeholder="Category"
            allow-clear
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
            :filter-option="optionFilter"
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
            :filter-option="optionFilter"
            :disabled="!filters.county_id"
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
            @change="onFilterChange"
          >
            <a-select-option :value="1">Active</a-select-option>
            <a-select-option :value="0">Inactive</a-select-option>
          </a-select>
          <sdButton
            size="small"
            class="pill-btn vd-clear-btn"
            :disabled="!hasActiveFilters"
            @click="resetFilters"
          >Clear</sdButton>
        </div>

        <div class="vd-search">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            v-model:value="filters.search"
            type="text"
            name="q"
            placeholder="Search name or KRA PIN…"
            allow-clear
            @pressEnter="onFilterChange"
          />
        </div>
      </section>

      <!-- Vendors (table + card views) -->
      <section class="panel content-panel">
        <!-- Table view -->
        <a-table
          v-if="viewMode === 'table'"
          class="minimal-table"
          :data-source="vendors"
          :columns="columns"
          row-key="id"
          size="middle"
          :loading="loading"
          :pagination="false"
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
                {{ record.subcounty?.name || record.subcounty?.sub_county_name || '' }}
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

        <!-- Cards view -->
        <div v-if="viewMode === 'cards'">
          <div v-if="loading" class="vd-loading">
            <a-spin />
          </div>
          <div v-else class="vd-card-list">
            <article
              v-for="record in vendors"
              :key="record.id"
              class="vd-card"
            >
              <div class="vd-card-head">
                <router-link
                  :to="`/procurement/vendors/${record.id}`"
                  class="vd-card-title"
                >{{ record.name }}</router-link>
                <span
                  class="vd-card-code"
                  :class="record.category === 'public' ? 'public' : ''"
                >{{ (record.category || '—').toUpperCase() }}</span>
              </div>
              <div class="vd-card-meta">
                <div>
                  <span class="lbl">Location</span>
                  <span class="val">{{ locationLabel(record) }}</span>
                </div>
                <div>
                  <span class="lbl">Status</span>
                  <span class="val">
                    <span class="v-chip" :class="record.is_active ? 'green' : 'muted'">
                      {{ record.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </span>
                </div>
                <div v-if="record.kra_pin">
                  <span class="lbl">KRA PIN</span>
                  <span class="val">{{ record.kra_pin }}</span>
                </div>
                <div v-if="record.method_of_procurement">
                  <span class="lbl">Procurement</span>
                  <span class="val">{{ methodLabel(record.method_of_procurement) }}</span>
                </div>
                <div v-if="record.physical_address">
                  <span class="lbl">Address</span>
                  <span class="val">{{ record.physical_address }}</span>
                </div>
              </div>
              <div class="vd-card-actions">
                <router-link
                  :to="`/procurement/vendors/${record.id}`"
                  class="pill-btn is-primary vd-view-link"
                >
                  <sdFeatherIcons type="eye" size="12" /> View
                </router-link>
                <sdButton
                  v-if="canManageVendors"
                  size="extra-small"
                  class="pill-btn"
                  @click="openEdit(record)"
                >
                  <sdFeatherIcons type="edit-2" size="12" /> Edit
                </sdButton>
                <sdButton
                  v-if="canApproveVendor"
                  size="extra-small"
                  class="pill-btn"
                  @click="onToggle(record)"
                >
                  <sdFeatherIcons
                    :type="record.is_active ? 'pause-circle' : 'play-circle'"
                    size="12"
                  />
                  {{ record.is_active ? 'Deactivate' : 'Activate' }}
                </sdButton>
                <a-popconfirm
                  v-if="canDeleteVendor"
                  title="Delete this vendor?"
                  ok-text="Delete"
                  cancel-text="Cancel"
                  @confirm="onDelete(record)"
                >
                  <sdButton size="extra-small" class="pill-btn is-danger">
                    <sdFeatherIcons type="trash-2" size="12" /> Delete
                  </sdButton>
                </a-popconfirm>
              </div>
            </article>
            <div v-if="!vendors.length" class="empty-state">
              <div class="empty-icon">▦</div>
              <div class="empty-title">No vendors found</div>
              <div class="empty-desc">
                Add your first vendor to start managing suppliers, bank accounts
                and Local Service Orders.
              </div>
            </div>
          </div>
        </div>

        <!-- Shared pagination -->
        <div class="vd-pagination">
          <a-pagination
            :current="pagination.page"
            :page-size="pagination.perPage"
            :total="pagination.total"
            :show-size-changer="true"
            :page-size-options="['10', '15', '25', '50']"
            size="small"
            @change="onPageChange"
          />
        </div>
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

const locationLabel = (record) => {
  const county = record.county?.name || record.county?.county_name || '—';
  const sc = record.subcounty || record.sub_county || {};
  const sub = sc.name || sc.sub_county_name || '';
  return sub ? `${county}, ${sub}` : county;
};
const methodLabel = (m) =>
  m === 'rfq' ? 'RFQ' : m === 'direct' ? 'Direct' : String(m || '—').toUpperCase();

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

    // Cards/Table view toggle — mirrors the events & activities list pages
    // (cards on narrow screens, table on desktop where the columns fit).
    const viewMode = ref(
      typeof window !== 'undefined' && window.innerWidth <= 991 ? 'cards' : 'table',
    );

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

    // Shared bottom pagination (same pattern as the events/activities lists).
    // a-pagination emits (page, pageSize) on change.
    const onPageChange = (page, pageSize) => {
      dispatchFetch({ page, perPage: pageSize || pagination.value.perPage });
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
      hasActiveFilters,
      columns,
      modalOpen,
      editing,
      viewMode,
      fmt,
      locationLabel,
      methodLabel,
      refresh,
      onFilterChange,
      onSearchInputChange,
      onCountyChange,
      onPageChange,
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

  /* Header search pill (events/activities style) */
  .vd-search {
    position: relative;
    display: flex;
    align-items: center;
    width: 260px;
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

  /* Cards / Table view toggle (events/activities style) */
  .vd-view-toggle {
    display: inline-flex;
    background: #f0f7f3;
    border: 1px solid #d9f0e2;
    border-radius: 22px;
    padding: 3px;
    gap: 2px;
    .vd-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      border: 0;
      background: transparent;
      color: #5f7268;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 18px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      &.active {
        background: #fff;
        color: #15693c;
        box-shadow: 0 2px 6px rgba(28, 122, 72, 0.12);
      }
    }
  }

  /* Responsive header (mirrors events/activities) */
  @media (max-width: 991px) {
    .ph-actions {
      width: 100%;
    }
  }
  @media (max-width: 575px) {
    .vd-search,
    .vd-view-toggle {
      width: 100%;
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

/* Filter panel (events/activities style) */
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
.filter-panel .vd-search {
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
.vd-clear-btn {
  height: 40px;
  width: 100%;
}
@media (max-width: 575px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
}

/* Table + cells */
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

/* Content panel (table + cards) */
.content-panel {
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

/* Vendor name link (table + cards) */
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
.muted {
  font-size: 12px;
  color: #8a90a6;
}

/* Status / category chips (shared) */
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

/* Cards view (events/activities style) */
.vd-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 2px;
}
.vd-card {
  background: #fff;
  border: 1px solid #e1efe6;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
}
.vd-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}
.vd-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #15693c;
  line-height: 1.3;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}
.vd-card-code {
  flex-shrink: 0;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-radius: 999px;
  padding: 2px 10px;
  background: #eafff5;
  color: #15693c;
  border: 1px solid #c9e6d3;
  &.public {
    background: #e8effb;
    color: #335ec7;
    border: 1px solid #c7d8f3;
  }
}
.vd-card-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
  margin-bottom: 14px;
  > div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .lbl {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #7a8a82;
    font-weight: 600;
  }
  .val {
    font-size: 13px;
    font-weight: 600;
    color: #2f3a35;
    word-break: break-word;
  }
}
.vd-card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed #e1efe6;
  :deep(a) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
.vd-view-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px !important;
  text-decoration: none;
}
.vd-loading {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}
.vd-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 14px 8px 6px;
}
@media (max-width: 575px) {
  .vd-card-meta {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 991px) {
  .vd-pagination {
    justify-content: center;
  }
}

/* Pill buttons (shared) */
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
  &.is-danger {
    color: #c43d3d !important;
    &:hover, &:focus {
      border-color: #ffa39e !important;
      color: #c43d3d !important;
    }
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
