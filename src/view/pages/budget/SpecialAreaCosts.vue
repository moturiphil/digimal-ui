<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper>
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">✦</span> Special Area Costs
            </h3>
            <p class="ph-subtitle">
              Mark which counties and sub-counties are Special Area Cost areas, and manage the
              Special Area Cost items (DSA, Boat, Enhanced Transport…) shown under every budget
              category. Each unit has a single switch — when on, the unit's budget shows a Special
              Area Cost section after the standard budget categories, and its totals roll into the
              budget grand total.
            </p>

          </div>
        </div>

        <sdCards headless class="bp-table-shell sac-shell">
          <a-tabs v-model:activeKey="activeTab" class="bp-tabs sac-tabs">
            <a-tab-pane key="county" tab="County Mapping" />
            <a-tab-pane key="sub_county" tab="Sub-County Mapping" />
            <a-tab-pane key="cost_items" tab="Cost Items" />
            <a-tab-pane key="categories" tab="Budget Categories" />
          </a-tabs>

          <!-- ============================== COUNTY MAPPING ============================== -->
          <div v-if="activeTab === 'county'" class="sac-pane">
            <sdCards headless class="sac-section">
              <div class="sac-section-head">
                <h4> County applicability</h4>
                <span class="sac-section-note">
                  Check "Is Special Area Cost Applicable" to enable the SAC section on the
                  county's budgeting page.
                </span>
              </div>
              <div class="sac-actions-row">
                <a-input
                  v-model:value="countyFilters.search"
                  size="small"
                  placeholder="Search counties…"
                  allow-clear
                  class="sac-search"
                />
                <sdButton :disabled="loading" @click="fetchCounties">Refresh</sdButton>
              </div>
            </sdCards>

            <div v-if="loading" class="sac-loading">
              <a-spin />
            </div>
            <div v-else-if="!filteredCounties.length" class="sac-empty">
              No county profiles found.
            </div>

            <sdCards headless class="sac-list-card">
              <div class="sac-map-grid sac-map-head">
                <div>County</div>
                <div>Special Area Cost Applicable</div>
              </div>
              <div
                v-for="row in filteredCounties"
                :key="row.id"
                class="sac-map-grid sac-map-row"
              >
                <div class="sac-unit">
                  <span class="sac-unit-icon">▦</span>
                  <span class="sac-unit-name">{{ row.name }}</span>
                  <a-tag v-if="row.is_special_area_cost" class="sac-on-tag">Active</a-tag>
                </div>
                <div class="sac-switch-cell">
                  <a-checkbox
                    :checked="row.is_special_area_cost"
                    :disabled="isCellBusy(row.id)"
                    @change="(e) => toggleRow(row, e)"
                  >
                    Is Special Area Cost Applicable
                  </a-checkbox>
                </div>
              </div>
            </sdCards>
          </div>
<!-- ============================== SUB-COUNTY MAPPING ============================== -->
          <div v-if="activeTab === 'sub_county'" class="sac-pane">
            <sdCards headless class="sac-section">
              <div class="sac-section-head">
                <h4> Sub-county applicability</h4>
                <span class="sac-section-note">
                  A sub-county's SAC section is controlled independently of its county — check the box
                  only where the sub-county itself is a Special Area Cost area.
                </span>
              </div>
              <div class="sac-actions-row">
                <a-select
                  v-model:value="subCountyFilters.county_id"
                  size="small"
                  placeholder="All counties"
                  allow-clear
                  class="sac-filter"
                  :options="countyFilterOptions"
                />
                <a-input
                  v-model:value="subCountyFilters.search"
                  size="small"
                  placeholder="Search sub-counties…"
                  allow-clear
                  class="sac-search"
                />
                <sdButton :disabled="loading" @click="fetchSubCounties">Refresh</sdButton>
              </div>
            </sdCards>

            <div v-if="loading" class="sac-loading">
              <a-spin />
            </div>
            <div v-else-if="!filteredSubCountyRows.length" class="sac-empty">
              No sub-county profiles found.
            </div>

            <sdCards headless class="sac-list-card">
              <div class="sac-map-grid sac-map-head">
                <div>Sub-County</div>
                <div>County</div>
                <div>Special Area Cost Applicable</div>
              </div>
              <div
                v-for="row in filteredSubCountyRows"
                :key="row.id"
                class="sac-map-grid sac-map-row"
              >
                <div class="sac-unit">
                  <span class="sac-unit-icon">◔</span>
                  <span class="sac-unit-name">{{ row.name }}</span>
                  <a-tag v-if="row.is_special_area_cost" class="sac-on-tag">Active</a-tag>
                </div>
                <div class="sac-county">{{ row.county_name }}</div>
                <div class="sac-switch-cell">
                  <a-checkbox
                    :checked="row.is_special_area_cost"
                    :disabled="isCellBusy(row.id)"
                    @change="(e) => toggleRow(row, e, true)"
                  >
                    Is Special Area Cost Applicable
                  </a-checkbox>
                </div>
              </div>
            </sdCards>
          </div>

          <!-- ============================== COST ITEMS ============================== -->
          <div v-if="activeTab === 'cost_items'" class="sac-pane">
            <sdCards headless class="sac-section">
              <div class="sac-section-head">
                <h4> Special area cost items</h4>
                <span class="sac-section-note">
                  Add or remove the cost items shown under every budget category (DSA, Boat,
                  Enhanced Transport, Security…). For each item choose whether its units are
                  <strong>Default</strong> (a fixed number of units applied automatically and
                  read-only in the budgeting grid) or <strong>Dynamic</strong> (entered by the
                  budgeting officer on each row).
                </span>
              </div>
              <div class="sac-actions-row">
                <sdButton class="pill-btn sac-add-btn" @click="openItemModal()">
                  + Add cost item
                </sdButton>
                <a-checkbox
                  v-model:checked="itemsIncludeInactive"
                  @change="fetchItems"
                >
                  Show removed items
                </a-checkbox>
                <sdButton :disabled="itemsLoading" @click="fetchItems">Refresh</sdButton>
              </div>
            </sdCards>

            <div v-if="itemsLoading" class="sac-loading">
              <a-spin />
            </div>
            <div v-else-if="!items.length" class="sac-empty">
              No Special Area Cost items yet. Add one to make it available in the budgeting grid.
            </div>

            <sdCards v-else headless class="sac-list-card">
              <a-table
                :dataSource="items"
                :columns="itemColumns"
                :pagination="false"
                row-key="id"
                size="small"
                class="minimal-table sac-items-table"
              >
                <template #bodyCell="{ column, record }">
                  <span v-if="column.key === 'label'" class="sac-item-cell">
                    <span class="sac-item-label">{{ record.label }}</span>
                    <code class="sac-code">{{ record.type }}</code>
                    <a-tag v-if="!record.is_active" class="sac-removed-tag">Removed</a-tag>
                  </span>
                  <span v-else-if="column.key === 'amount'">
                    <span v-if="record.locked" class="sac-fixed-amount">
                      {{ fmtMoney(record.default_amount) }}
                      <a-tag class="lc-tag">Fixed</a-tag>
                    </span>
                    <span v-else-if="record.default_amount !== null" class="sac-amount-hint">
                      {{ fmtMoney(record.default_amount) }} default
                    </span>
                    <span v-else class="sac-comment-empty">Officer-entered</span>
                    <div class="sac-max-hint">max {{ fmtMoney(record.max_amount) }}</div>
                  </span>
                  <span v-else-if="column.key === 'units'">
                    <a-tag
                      :class="record.units_mode === 'default' ? 'sac-units-default' : 'sac-units-dynamic'"
                    >
                      {{ record.units_mode === 'default'
                        ? `Default · ${record.default_units} unit${record.default_units === 1 ? '' : 's'}`
                        : 'Dynamic' }}
                    </a-tag>
                    <div v-if="record.units_mode === 'dynamic'" class="sac-max-hint">
                      limit {{ record.min_units ?? 0 }}–{{ record.max_units ?? 20 }}
                    </div>
                  </span>
                  <span v-else-if="column.key === 'status'">
                    <a-tag :class="record.is_active ? 'sac-on-tag' : 'sac-removed-tag'">
                      {{ record.is_active ? 'Active' : 'Removed' }}
                    </a-tag>
                  </span>
                  <span v-else-if="column.key === 'actions'" class="sac-row-actions">
                    <a @click="openItemModal(record)">Edit</a>
                    <a-popconfirm
                      v-if="record.is_active"
                      title="Remove this cost item from the budgeting grid?"
                      ok-text="Remove"
                      cancel-text="Cancel"
                      @confirm="removeItem(record)"
                    >
                      <a class="sac-danger" :class="{ 'is-busy': isCellBusy(`item-${record.id}`) }">
                        Remove
                      </a>
                    </a-popconfirm>
                    <a v-else @click="restoreItem(record)">Restore</a>
                  </span>
                </template>
              </a-table>
            </sdCards>
          </div>

          <!-- ======================== BUDGET CATEGORIES ======================== -->
          <div v-if="activeTab === 'categories'" class="sac-pane">
            <sdCards headless class="sac-section">
              <div class="sac-section-head">
                <h4> Special Area Cost budget categories</h4>
                <span class="sac-section-note">
                  Select the budget categories Special Area Cost applies to. Only the selected
                  categories show the Special Area Cost rows on the budgeting grid. Newly created
                  categories are selected by default.
                </span>
              </div>
              <div class="sac-actions-row">
                <a-input
                  v-model:value="categoryFilters.search"
                  size="small"
                  placeholder="Search budget categories…"
                  allow-clear
                  class="sac-search"
                />
                <a-select
                  v-model:value="categoryFilters.stage"
                  size="small"
                  class="sac-filter"
                  :options="categoryStageOptions"
                  placeholder="All stages"
                  allow-clear
                />
                <a-checkbox
                  v-model:checked="categoriesIncludeInactive"
                  @change="fetchCategories"
                >
                  Show inactive categories
                </a-checkbox>
                <sdButton :disabled="categoriesLoading" @click="fetchCategories">Refresh</sdButton>
              </div>
              <div class="sac-cat-summary">
                <strong>{{ enabledCategoryCount }}</strong> of
                <strong>{{ categories.length }}</strong> categories apply Special Area Cost.
              </div>
            </sdCards>

            <div v-if="categoriesLoading" class="sac-loading">
              <a-spin />
            </div>
            <div v-else-if="!filteredCategories.length" class="sac-empty">
              No budget categories found.
            </div>

            <sdCards v-else headless class="sac-list-card">
              <div class="sac-map-grid sac-map-head sac-cat-grid">
                <div>Budget category</div>
                <div>Applies Special Area Cost</div>
              </div>
              <div
                v-for="row in filteredCategories"
                :key="row.id"
                class="sac-map-grid sac-map-row sac-cat-grid"
              >
                <div class="sac-unit">
                  <span class="sac-unit-icon">▦</span>
                  <span class="sac-unit-name">{{ row.name }}</span>
                  <a-tag class="sac-stage-tag">{{ stageLabel(row.stage) }}</a-tag>
                  <a-tag class="sac-scope-tag">{{ scopeLabel(row.scope) }}</a-tag>
                  <a-tag v-if="!row.is_active" class="sac-removed-tag">Inactive</a-tag>
                </div>
                <div class="sac-switch-cell">
                  <a-checkbox
                    :checked="row.allows_special_costs"
                    :disabled="isCellBusy(`category-${row.id}`)"
                    @change="(e) => toggleCategory(row, e)"
                  >
                    Applies Special Area Cost
                  </a-checkbox>
                </div>
              </div>
            </sdCards>
          </div>

        </sdCards>
      </BudgetPageWrapper>
    </Main>

    <!-- Add / Edit cost item -->
    <a-modal
      v-model:visible="itemModal.open"
      :title="itemModal.id ? 'Edit Special Area Cost item' : 'Add Special Area Cost item'"
      :ok-text="itemModal.id ? 'Update' : 'Create'"
      :confirm-loading="itemModal.saving"
      width="560px"
      @ok="saveItem"
    >
      <a-form layout="vertical" :model="itemModal.form">
        <a-form-item label="Name" required>
          <a-input
            v-model:value="itemModal.form.label"
            placeholder="e.g. Night Allowance"
            :maxlength="120"
          />
        </a-form-item>

        <a-form-item label="Code">
          <a-input
            v-model:value="itemModal.form.code"
            placeholder="e.g. night_allowance"
            :disabled="!!itemModal.id"
          />
          <p class="sac-hint">
            Lower-case identifier stored on budgets. Generated from the name when left blank.
            It cannot be changed after the item is created.
          </p>
        </a-form-item>

        <a-form-item label="Amount">
          <a-checkbox v-model:checked="itemModal.form.is_amount_fixed">
            Fixed amount (locked — cannot be edited while budgeting)
          </a-checkbox>
          <a-input-number
            v-model:value="itemModal.form.default_amount"
            :min="0"
            :precision="2"
            class="sac-modal-input"
            :placeholder="itemModal.form.is_amount_fixed ? 'Fixed amount' : 'Default amount (optional)'"
          />
        </a-form-item>

        <a-form-item label="Maximum amount">
          <a-input-number
            v-model:value="itemModal.form.max_amount"
            :min="0"
            :precision="2"
            class="sac-modal-input"
            placeholder="10000"
          />
          <p class="sac-hint">
            Highest amount an officer may enter when the amount is not fixed.
          </p>
        </a-form-item>

        <a-form-item label="Units">
          <a-radio-group v-model:value="itemModal.form.units_mode">
            <a-radio value="default">Default — fixed number of units</a-radio>
            <a-radio value="dynamic">Dynamic — entered per budget</a-radio>
          </a-radio-group>
          <a-input-number
            v-if="itemModal.form.units_mode === 'default'"
            v-model:value="itemModal.form.default_units"
            :min="0"
            :max="20"
            :precision="0"
            class="sac-modal-input sac-modal-units"
            placeholder="Number of units"
          />

          <!-- Officer-entered units bounds (dynamic mode only). -->
          <div v-if="itemModal.form.units_mode === 'dynamic'" class="sac-limits-row">
            <a-input-number
              v-model:value="itemModal.form.min_units"
              :min="0"
              :precision="0"
              class="sac-modal-units"
              placeholder="Lower limit"
            />
            <span class="sac-limits-sep">to</span>
            <a-input-number
              v-model:value="itemModal.form.max_units"
              :min="0"
              :precision="0"
              class="sac-modal-units"
              placeholder="Upper limit"
            />
          </div>
          <p v-if="itemModal.form.units_mode === 'dynamic'" class="sac-hint">
            Lowest and highest number of units an officer may enter for this item.
          </p>
        </a-form-item>

        <a-form-item label="Display order">
          <a-input-number
            v-model:value="itemModal.form.sort_order"
            :min="0"
            :precision="0"
            class="sac-modal-input"
          />
        </a-form-item>
      </a-form>
    </a-modal>

  </RecordViewWrapper>
</template>
<script>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';
import { normalizeSacItem } from '@/services/specialAreaCosts';

/*
 * Special Area Cost — admin configuration page.
 *
 * Four tabs:
 *   • County Mapping      — toggle county_profiles.is_special_area_cost.
 *   • Sub-County Mapping  — toggle the same flag per sub-county profile.
 *   • Cost Items          — the admin-managed SAC catalogue (DSA, Boat,
 *                           Enhanced Transport, Security, …): add / remove
 *                           items and set each item's units to 'default'
 *                           (fixed) or 'dynamic' (entered per budget).
 *   • Budget Categories   — select / deselect the budget categories the SAC
 *                           rows are entered under
 *                           (budget_categories.allows_special_costs).
 *
 * Applicability is a single flag per administrative unit, stored on
 * county_profiles.is_special_area_cost and toggled here. The budgeting pages
 * (CountyBudgeting.vue / Budgeting.vue) read the same flag to decide whether
 * to render their SAC section, and render the catalogue managed in this page.
 *
 * Available to the National Accountant and the Super Admin (see
 * SpecialAreaCostRolePermissionSeeder on the backend).
 */
export default {
  name: 'SpecialAreaCosts',
  components: { Main, RecordViewWrapper, BudgetPageWrapper },
  setup() {
    const activeTab = ref('county');
    const loading = ref(false);

    // ── Shared busy map (one in-flight toggle per row) ────────────────
    const busyCells = reactive({});
    const isCellBusy = (id) => Boolean(busyCells[id]);

    // ── County rows ───────────────────────────────────────────────────
    const counties = ref([]);
    const countyFilters = reactive({ search: '' });

    const normalizeCounty = (p) => ({
      id: p.id,
      name: p?.county?.name || p?.county_name || `County ${p.county_id}`,
      county_id: p.county_id,
      is_special_area_cost: Boolean(p.is_special_area_cost),
    });

    const fetchCounties = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_county_profiles', {
          params: { level: 'county' },
        });
        const rows = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : data?.message || [];
        counties.value = rows.map(normalizeCounty);
      } catch (err) {
        notification.error({
          message: 'Failed to load counties',
          description: err?.response?.data?.message || err.message,
        });
        counties.value = [];
      } finally {
        loading.value = false;
      }
    };

const filteredCounties = computed(() => {
      const q = (countyFilters.search || '').trim().toLowerCase();
      let rows = counties.value.slice().sort((a, b) => a.name.localeCompare(b.name));
      if (q) rows = rows.filter((c) => c.name.toLowerCase().includes(q));
      return rows;
    });

    // ── Sub-county rows ───────────────────────────────────────────────
    const subCounties = ref([]);
    const subCountyFilters = reactive({ search: '', county_id: null });

    // The API serialises the `subCounty` relation snake-cased as
    // `sub_county`, and CountyProfile now also exposes a flat
    // `sub_county_name` accessor. Reading only `p.subCounty.name` (camelCase)
    // is what made this list show "Sub-County 123" instead of the real name.
    const normalizeSubCounty = (p) => ({
      id: p.id,
      name:
        p?.sub_county?.name ||
        p?.subCounty?.name ||
        p?.sub_county_name ||
        `Sub-County ${p.sub_county_id}`,
      county_id: p.county_id,
      county_name: p?.county?.name || p?.county_name || '—',
      is_special_area_cost: Boolean(p.is_special_area_cost),
    });

    const fetchSubCounties = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_county_profiles', {
          params: { level: 'sub_county' },
        });
        const rows = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : data?.message || [];
        subCounties.value = rows.map(normalizeSubCounty);
      } catch (err) {
        notification.error({
          message: 'Failed to load sub-counties',
          description: err?.response?.data?.message || err.message,
        });
        subCounties.value = [];
      } finally {
        loading.value = false;
      }
    };

    const countyFilterOptions = computed(() => {
      const seen = {};
      return subCounties.value
        .filter((r) => (seen[r.county_id] = !seen[r.county_id]))
        .map((r) => ({ value: r.county_id, label: r.county_name }));
    });

    const filteredSubCountyRows = computed(() => {
      const q = (subCountyFilters.search || '').trim().toLowerCase();
      const cid = subCountyFilters.county_id;
      let rows = subCounties.value.slice().sort((a, b) => {
        const byCounty = a.county_name.localeCompare(b.county_name);
        return byCounty !== 0 ? byCounty : a.name.localeCompare(b.name);
      });
      if (cid) rows = rows.filter((r) => r.county_id === cid);
      if (q) {
        rows = rows.filter((r) =>
          r.name.toLowerCase().includes(q) ||
          r.county_name.toLowerCase().includes(q),
        );
      }
      return rows;
    });

    // ── Toggle ────────────────────────────────────────────────────────
    const toggleRow = async (row, e, isSubCounty = false) => {
      const checked = e?.target?.checked ?? !row.is_special_area_cost;
      if (busyCells[row.id]) return;
      busyCells[row.id] = true;
      try {
        const { data } = await axios.put(`update_special_area_cost/${row.id}`, {
          is_special_area_cost: checked,
        });
        const saved = data?.data || data || {};
        row.is_special_area_cost = Boolean(saved.is_special_area_cost ?? checked);
        notification.success({
          message: `${isSubCounty ? 'Sub-county' : 'County'} updated`,
          description: `Special Area Cost ${row.is_special_area_cost ? 'enabled' : 'disabled'} for ${row.name}.`,
        });
      } catch (err) {
        notification.error({
          message: 'Failed to update Special Area Cost mapping',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        busyCells[row.id] = false;
      }
    };

    // ── Cost-item catalogue (Accountant / Super Admin) ────────────────
    // Backed by `special_area_cost_items` via get/create/update/delete
    // _special_area_cost_item. Removal deactivates items that are already
    // referenced by saved budgets (the backend decides).
    const items = ref([]);
    const itemsLoading = ref(false);
    const itemsIncludeInactive = ref(false);

    const emptyItemForm = () => ({
      label: '',
      code: '',
      default_amount: null,
      max_amount: 10000,
      is_amount_fixed: false,
      units_mode: 'dynamic',
      default_units: 0,
      // Officer-entered units bounds (dynamic items).
      min_units: 0,
      max_units: 20,
      sort_order: 0,
    });

    const itemModal = reactive({
      open: false,
      saving: false,
      id: null,
      form: emptyItemForm(),
    });

    const itemColumns = [
      { title: 'Cost item', key: 'label', dataIndex: 'label' },
      { title: 'Amount (KES)', key: 'amount', width: 220 },
      { title: 'Units', key: 'units', width: 190 },
      { title: 'Status', key: 'status', width: 110 },
      { title: 'Actions', key: 'actions', width: 170, align: 'center' },
    ];

    const fmtMoney = (value) =>
      Number(value || 0).toLocaleString('en-KE', { maximumFractionDigits: 2 });

    const fetchItems = async () => {
      itemsLoading.value = true;
      try {
        const { data } = await axios.get('get_special_area_cost_items', {
          params: itemsIncludeInactive.value ? { include_inactive: 1 } : {},
        });
        const payload = data?.data || data || {};
        const rows = Array.isArray(payload.items)
          ? payload.items
          : Array.isArray(payload)
            ? payload
            : [];
        items.value = rows
          .map(normalizeSacItem)
          .sort(
            (a, b) =>
              (a.sort_order || 0) - (b.sort_order || 0) ||
              a.label.localeCompare(b.label),
          );
      } catch (err) {
        notification.error({
          message: 'Failed to load Special Area Cost items',
          description: err?.response?.data?.message || err.message,
        });
        items.value = [];
      } finally {
        itemsLoading.value = false;
      }
    };

    const openItemModal = (record = null) => {
      itemModal.id = record?.id ?? null;
      itemModal.form = record
        ? {
            label: record.label,
            code: record.type,
            default_amount: record.default_amount,
            max_amount: record.max_amount,
            is_amount_fixed: !!record.locked,
            units_mode: record.units_mode,
            default_units: record.default_units,
            min_units: record.min_units ?? 0,
            max_units: record.max_units ?? 20,
            sort_order: record.sort_order,
          }
        : emptyItemForm();
      itemModal.open = true;
    };

    const saveItem = async () => {
      const f = itemModal.form;

      if (!String(f.label || '').trim()) {
        notification.warning({ message: 'A name is required for the cost item.' });
        return;
      }

      const isFixed = !!f.is_amount_fixed;
      const unitsMode = f.units_mode === 'default' ? 'default' : 'dynamic';

      if (isFixed && (f.default_amount === null || f.default_amount === '')) {
        notification.warning({ message: 'A fixed-amount item needs a fixed amount.' });
        return;
      }

      const minUnits = Number(f.min_units) || 0;
      const maxUnits =
        f.max_units === '' || f.max_units === null ? 20 : Number(f.max_units);

      if (unitsMode === 'dynamic' && maxUnits < minUnits) {
        notification.warning({
          message: 'The upper units limit cannot be lower than the lower limit.',
        });
        return;
      }

      const payload = {
        label: String(f.label).trim(),
        default_amount:
          f.default_amount === '' || f.default_amount === undefined
            ? null
            : f.default_amount,
        max_amount:
          f.max_amount === '' || f.max_amount === null ? 10000 : f.max_amount,
        is_amount_fixed: isFixed,
        units_mode: unitsMode,
        default_units: unitsMode === 'default' ? Number(f.default_units) || 0 : 0,
        // Officer-entered units bounds — configurable per Cost Item.
        min_units: minUnits,
        max_units: maxUnits,
        sort_order: Number(f.sort_order) || 0,
      };

      // `code` is only accepted on create — it is immutable afterwards.
      if (!itemModal.id && String(f.code || '').trim()) {
        payload.code = String(f.code).trim();
      }

      itemModal.saving = true;
      try {
        if (itemModal.id) {
          await axios.put(`update_special_area_cost_item/${itemModal.id}`, payload);
          notification.success({
            message: 'Cost item updated',
            description: `${payload.label} saved.`,
          });
        } else {
          await axios.post('create_special_area_cost_item', payload);
          notification.success({
            message: 'Cost item added',
            description: `${payload.label} is now available in the budgeting grid.`,
          });
        }
        itemModal.open = false;
        await fetchItems();
      } catch (err) {
        const errors = err?.response?.data?.errors || {};
        notification.error({
          message: 'Failed to save the cost item',
          description:
            err?.response?.data?.message ||
            Object.values(errors)[0]?.[0] ||
            err.message,
        });
      } finally {
        itemModal.saving = false;
      }
    };

    const removeItem = async (record) => {
      const key = `item-${record.id}`;
      if (busyCells[key]) return;
      busyCells[key] = true;
      try {
        const { data } = await axios.delete(
          `delete_special_area_cost_item/${record.id}`,
        );
        const payload = data?.data || data || {};
        notification.success({
          message: payload.deactivated ? 'Cost item removed' : 'Cost item deleted',
          description: payload.message || `${record.label} removed.`,
        });
        await fetchItems();
      } catch (err) {
        notification.error({
          message: 'Failed to remove the cost item',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        busyCells[key] = false;
      }
    };

    const restoreItem = async (record) => {
      const key = `item-${record.id}`;
      if (busyCells[key]) return;
      busyCells[key] = true;
      try {
        await axios.put(`update_special_area_cost_item/${record.id}`, {
          is_active: true,
        });
        notification.success({
          message: 'Cost item restored',
          description: `${record.label} is available in the budgeting grid again.`,
        });
        await fetchItems();
      } catch (err) {
        notification.error({
          message: 'Failed to restore the cost item',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        busyCells[key] = false;
      }
    };



    // ── Budget-category applicability (Accountant / Super Admin) ──────
    // `budget_categories.allows_special_costs` decides which categories the
    // SAC grid renders. Backed by get / update_special_area_cost_category.
    const categories = ref([]);
    const categoriesLoading = ref(false);
    const categoriesIncludeInactive = ref(false);
    const categoryFilters = reactive({ search: '', stage: null });

    const categoryStageOptions = [
      { value: '1', label: 'Stage 1 · Pre-campaign' },
      { value: '2', label: 'Stage 2 · Campaign' },
      { value: '3', label: 'Stage 3 · Post-campaign' },
    ];

    const stageLabel = (stage) =>
      ({ '1': 'Stage 1', '2': 'Stage 2', '3': 'Stage 3' }[String(stage)] || `Stage ${stage}`);

    const scopeLabel = (scope) =>
      ({ county: 'County', sub_county: 'Sub-County', both: 'County & Sub-County' }[scope] || scope);

    const normalizeCategory = (c) => ({
      id: c.id,
      name: c.name || `Category ${c.id}`,
      description: c.description || '',
      type: c.type,
      stage: c.stage,
      scope: c.scope,
      default_days: Number(c.default_days || 1),
      sort_order: Number(c.sort_order || 0),
      allows_special_costs: Boolean(c.allows_special_costs),
      is_active: c.is_active === undefined ? true : Boolean(c.is_active),
    });

    const fetchCategories = async () => {
      categoriesLoading.value = true;
      try {
        const { data } = await axios.get('get_special_area_cost_categories', {
          params: categoriesIncludeInactive.value ? { include_inactive: 1 } : {},
        });
        const payload = data?.data || data || {};
        const rows = Array.isArray(payload.categories)
          ? payload.categories
          : Array.isArray(payload)
            ? payload
            : [];
        categories.value = rows.map(normalizeCategory);
      } catch (err) {
        notification.error({
          message: 'Failed to load budget categories',
          description: err?.response?.data?.message || err.message,
        });
        categories.value = [];
      } finally {
        categoriesLoading.value = false;
      }
    };

    const filteredCategories = computed(() => {
      const q = (categoryFilters.search || '').trim().toLowerCase();
      let rows = categories.value.slice().sort(
        (a, b) =>
          String(a.stage).localeCompare(String(b.stage)) ||
          (a.sort_order || 0) - (b.sort_order || 0) ||
          a.name.localeCompare(b.name),
      );
      if (categoryFilters.stage) {
        rows = rows.filter((c) => String(c.stage) === String(categoryFilters.stage));
      }
      if (q) rows = rows.filter((c) => c.name.toLowerCase().includes(q));
      return rows;
    });

    const enabledCategoryCount = computed(
      () => categories.value.filter((c) => c.allows_special_costs).length,
    );

    const toggleCategory = async (row, e) => {
      const checked = e?.target?.checked ?? !row.allows_special_costs;
      const key = `category-${row.id}`;
      if (busyCells[key]) return;
      busyCells[key] = true;
      try {
        const { data } = await axios.put(
          `update_special_area_cost_category/${row.id}`,
          { allows_special_costs: checked },
        );
        const saved = data?.data || data || {};
        row.allows_special_costs = Boolean(saved.allows_special_costs ?? checked);
        notification.success({
          message: 'Budget category updated',
          description: `Special Area Cost ${row.allows_special_costs ? 'enabled' : 'disabled'} for ${row.name}.`,
        });
      } catch (err) {
        notification.error({
          message: 'Failed to update the budget category',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        busyCells[key] = false;
      }
    };

    // Switching tabs lazily loads the matching list.
    watch(activeTab, (tab) => {
      if (tab === 'county' && !counties.value.length) fetchCounties();
      if (tab === 'sub_county' && !subCounties.value.length) fetchSubCounties();
      if (tab === 'cost_items' && !items.value.length) fetchItems();
      if (tab === 'categories' && !categories.value.length) fetchCategories();
    });

    // Load the county list on page mount (the default tab).
    onMounted(() => {
      fetchCounties();
    });

    return {
      activeTab,
      loading,
      counties,
      countyFilters,
      filteredCounties,
      subCounties,
      subCountyFilters,
      countyFilterOptions,
      filteredSubCountyRows,
      isCellBusy,
      toggleRow,
      fetchCounties,
      fetchSubCounties,
      // Cost items (catalogue management)
      items,
      itemsLoading,
      itemsIncludeInactive,
      itemColumns,
      itemModal,
      fmtMoney,
      fetchItems,
      openItemModal,
      saveItem,
      removeItem,
      restoreItem,
      // Budget-category applicability (SAC scope)
      categories,
      categoriesLoading,
      categoriesIncludeInactive,
      categoryFilters,
      categoryStageOptions,
      filteredCategories,
      enabledCategoryCount,
      stageLabel,
      scopeLabel,
      fetchCategories,
      toggleCategory,
    };
  },
};
</script>
<style lang="less" scoped>
.sac-shell {
  margin-top: 4px;
}
.sac-tabs {
  margin-bottom: 14px;
}
.sac-pane {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sac-section {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 10px;
  padding: 12px 16px;
  .sac-section-head {
    display: flex;
    flex-direction: column;
    gap: 4px;
    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #3a3f5e;
    }
    .sac-section-note {
      font-size: 12px;
      color: #7a8599;
    }
  }
  .sac-actions-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
  }
}
.sac-search {
  width: 240px;
}
.sac-filter {
  width: 200px;
}
.sac-loading {
  padding: 24px;
  text-align: center;
}
.sac-empty {
  padding: 28px;
  text-align: center;
  color: #7a8599;
  background: #fff;
  border: 1px dashed #e2e6ef;
  border-radius: 10px;
}
.sac-list-card {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 10px;
}
.sac-map-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  padding: 10px 16px;
  align-items: center;
  border-bottom: 1px solid #eef0f5;
  &:last-child {
    border-bottom: none;
  }
}
.sac-map-head {
  font-size: 12px;
  font-weight: 700;
  color: #8a93a8;
  background: #f6f8fc;
}
.sac-map-row:hover {
  background: #fafbfe;
}
.sac-unit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  .sac-unit-icon {
    color: #9aa4b8;
    font-size: 14px;
  }
  .sac-unit-name {
    font-weight: 600;
    color: #3a3f5e;
  }
}
.sac-on-tag {
  background: #fdeee7;
  color: #b3402a;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
/* ── Budget Categories tab ──────────────────────────────────────────── */
.sac-cat-grid {
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
}
.sac-cat-summary {
  margin-top: 10px;
  font-size: 12px;
  color: #5a6277;
}
.sac-stage-tag {
  background: #eef4ff;
  color: #2f5fa8;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.sac-scope-tag {
  background: #f1f2f6;
  color: #5a6277;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.sac-county {
  font-size: 13px;
  color: #5a6277;
}
.sac-switch-cell {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #3a3f5e;
  white-space: nowrap;
}

/* ── Cost Items tab ─────────────────────────────────────────────────── */
.sac-add-btn {
  background: #8a4d1f;
  color: #fff;
  border: none;
  font-weight: 600;
}
.sac-items-table {
  .sac-item-cell {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .sac-item-label {
    font-weight: 600;
    color: #3a3f5e;
  }
  .sac-code {
    font-size: 11px;
    color: #7a8599;
    background: #f3f5fa;
    border-radius: 4px;
    padding: 1px 6px;
  }
  .sac-max-hint {
    font-size: 11px;
    color: #9aa4b8;
    margin-top: 2px;
  }
  .sac-amount-hint {
    color: #5a6277;
  }
}
.sac-row-actions {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  a {
    font-weight: 600;
  }
  .sac-danger {
    color: #c0392b;
    &.is-busy {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}
.sac-removed-tag {
  background: #f1f2f6;
  color: #7a8599;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.sac-units-default {
  background: #eef4ff;
  color: #2f5fa8;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.sac-units-dynamic {
  background: #fdf3e3;
  color: #8a5a2b;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.sac-hint {
  margin: 4px 0 0;
  font-size: 11px;
  color: #9aa4b8;
}
.sac-limits-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.sac-limits-sep {
  color: #8a93a8;
  font-size: 12px;
}
.sac-modal-input {
  width: 100%;
  margin-top: 8px;
}
.sac-modal-units {
  margin-top: 8px;
}
</style>