<template>
  <Main>
    <ProcurementPageWrapper class="bp-min">
      <!-- Header -->
      <header class="bp-head">
        <div>
          <h3 class="bp-title">
            <span class="bp-icon">▦</span> Vendor Management
          </h3>
          <p class="bp-sub">
            Suppliers, bank accounts and Local Service Orders.
          </p>
        </div>
        <div class="bp-head-actions">
          <a-tag class="stage-tag green">{{ pagination.total }} total</a-tag>
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

      <!-- Summary bar -->
      <div class="bp-summary">
        <div class="bp-totals">
          <div>
            <span class="lbl">Total</span>
            <strong>{{ fmt(pagination.total) }}</strong>
          </div>
          <div>
            <span class="lbl">Active (page)</span>
            <strong>{{ pageStats.active }}<span class="muted-suffix">{{ pageStats.activePct }}%</span></strong>
          </div>
          <div>
            <span class="lbl">Inactive (page)</span>
            <strong :class="pageStats.inactive ? 'warn' : 'muted'">{{ pageStats.inactive }}</strong>
          </div>
          <div>
            <span class="lbl">Categories</span>
            <strong class="muted">
              {{ pageStats.privateCount }} priv &middot; {{ pageStats.publicCount }} pub
            </strong>
          </div>
        </div>
        <div class="bp-tools">
          <a-input
            v-model:value="filters.search"
            placeholder="Search name, KRA…"
            allow-clear
            size="small"
            class="bp-search"
            @change="onSearchInputChange"
            @pressEnter="onFilterChange"
          />
        </div>
      </div>

      <!-- Filter row -->
      <div class="filter-row">
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
        <span class="result-counter">
          Showing {{ vendors.length }} of {{ fmt(pagination.total) }}
        </span>
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
    </ProcurementPageWrapper>

    <VendorFormModal
      v-model:open="modalOpen"
      :vendor="editing"
      @saved="onSaved"
    />
  </Main>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { Main } from '../../styled';
import VendorFormModal from './VendorFormModal.vue';
import { useProcurementPermissions } from '@/services/procurement/usePermissions';
import { ProcurementPageWrapper } from './style';

const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

export default {
  name: 'VendorsList',
  components: { Main, VendorFormModal, ProcurementPageWrapper },
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

    const pageStats = computed(() => {
      const list = vendors.value || [];
      const active = list.filter((v) => v.is_active).length;
      const inactive = list.length - active;
      const cats = new Set(list.map((v) => v.category).filter(Boolean));
      const privateCount = list.filter((v) => v.category === 'private').length;
      const publicCount = list.filter((v) => v.category === 'public').length;
      return {
        active,
        inactive,
        categories: cats.size,
        privateCount,
        publicCount,
        activePct: list.length ? Math.round((active / list.length) * 100) : 0,
      };
    });

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
      loading,
      pagination,
      paginationConfig,
      pageStats,
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
.muted-suffix {
  color: #9aa6ad;
  font-weight: 600;
  font-size: 11px;
  margin-left: 4px;
}
</style>
