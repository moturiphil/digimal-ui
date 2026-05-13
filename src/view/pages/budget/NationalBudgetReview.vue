<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper>
        <!-- Slim top bar -->
        <div class="tool-bar">
          <span class="tool-bar-title">Budget Preparation Tool</span>
        </div>

        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Budget Review &amp; Approval
            </h3>
            <p class="ph-subtitle">Review and approve county and sub-county budget submissions</p>
          </div>
          <div class="ph-actions">
            <a-breadcrumb separator=">" class="review-crumbs">
              <a-breadcrumb-item>
                <a href="javascript:;" @click="goCounties">Counties</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item v-if="selectedCounty">
                <a href="javascript:;" @click="goCountyBudgets">{{ selectedCounty.name }}</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item v-if="selectedBudget">
                {{ selectedBudget.label }}
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
        </div>

        <!-- Filter bar — visible on Levels 1 & 2 (hidden on single-budget detail) -->
        <div v-if="!selectedBudget" class="nbr-filter-bar">
          <div class="nbr-fb-row">
            <div class="nbr-fb-field">
              <label class="nbr-fb-label">County</label>
              <a-select
                v-model:value="filterCountyId"
                show-search
                allow-clear
                option-filter-prop="label"
                placeholder="All counties"
                class="nbr-fb-control"
                @change="onCountyFilterChange"
              >
                <a-select-option
                  v-for="c in counties"
                  :key="c.id"
                  :value="c.id"
                  :label="c.name"
                >
                  {{ c.name }}
                </a-select-option>
              </a-select>
            </div>

            <div class="nbr-fb-field">
              <label class="nbr-fb-label">Sub-County</label>
              <a-select
                v-model:value="filterSubCountyId"
                show-search
                allow-clear
                option-filter-prop="label"
                placeholder="All sub-counties"
                class="nbr-fb-control"
                :disabled="!filterCountyId && subCountyOptions.length === 0"
              >
                <a-select-option
                  v-for="sc in subCountyOptions"
                  :key="sc.id"
                  :value="sc.id"
                  :label="sc.label"
                >
                  {{ sc.label }}
                </a-select-option>
              </a-select>
            </div>

            <div class="nbr-fb-field">
              <label class="nbr-fb-label">Approval Stage</label>
              <a-select
                v-model:value="filterStage"
                allow-clear
                placeholder="All stages"
                class="nbr-fb-control"
              >
                <a-select-option
                  v-for="opt in stageOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </a-select-option>
              </a-select>
            </div>

            <div class="nbr-fb-actions">
              <sdButton
                size="small"
                @click="resetFilters"
                :disabled="!hasActiveFilters"
              >
                Reset
              </sdButton>
              <span v-if="hasActiveFilters" class="nbr-fb-count">
                {{ filteredCountResult }}
              </span>
            </div>
          </div>
        </div>

        <!-- ════════ LEVEL 1 · County grid ════════ -->
        <template v-if="!selectedCounty">
          <a-spin :spinning="loadingCounties">
            <div class="card-grid four-col">
              <div
                v-for="c in filteredCounties"
                :key="c.id"
                class="drill-card"
                @click="openCounty(c)"
              >
                <div class="dc-head">
                  <span class="dc-title">
                    <span class="dc-icon">◎</span> {{ c.name }}
                  </span>
                  <span class="dc-chevron">›</span>
                </div>
                <div class="dc-meta">{{ (c.sub_counties || []).length }} sub-counties</div>
                <a-tag v-if="c.stage" class="dc-stage">{{ c.stage }}</a-tag>
              </div>
              <div v-if="!loadingCounties && filteredCounties.length === 0" class="empty-hint">
                {{ hasActiveFilters ? 'No counties match the current filters.' : 'No counties available.' }}
              </div>
            </div>
          </a-spin>
        </template>

        <!-- ════════ LEVEL 2 · Budgets for the selected county ════════ -->
        <template v-else-if="selectedCounty && !selectedBudget">
          <div class="level-title">
            <sdButton size="small" class="back-btn" @click="goCounties">
              ← Back to Counties
            </sdButton>
            <span class="lt-icon">◉</span>
            {{ selectedCounty.name }} — Budgets for Review
          </div>
          <a-spin :spinning="loadingDetail">
            <div class="card-grid four-col">
              <div
                v-if="countyBudgetTileVisible"
                class="drill-card"
                :class="{ 'is-empty': !selectedCounty.county_budget }"
                @click="openCountyBudget()"
              >
                <div class="dc-head">
                  <span class="dc-title">
                    <span class="dc-icon">▤</span> County Budget
                  </span>
                  <span class="dc-chevron">›</span>
                </div>
                <div class="dc-meta">
                  {{ selectedCounty.county_budget ? selectedCounty.county_budget.stage : 'No budget' }}
                </div>
                <span
                  v-if="selectedCounty.county_budget && selectedCounty.county_budget.flags"
                  class="dc-flag"
                >
                  {{ selectedCounty.county_budget.flags }}
                </span>
              </div>
              <div
                v-for="sc in filteredSubCounties"
                :key="sc.id"
                class="drill-card"
                :class="{ 'is-empty': !sc.budget }"
                @click="openSubCountyBudget(sc)"
              >
                <div class="dc-head">
                  <span class="dc-title">{{ sc.name }}</span>
                  <span class="dc-chevron">›</span>
                </div>
                <div class="dc-meta">
                  {{ sc.budget ? sc.budget.stage : 'No budget' }}
                </div>
                <span v-if="sc.budget && sc.budget.flags" class="dc-flag">
                  {{ sc.budget.flags }}
                </span>
              </div>
              <div
                v-if="!loadingDetail && !countyBudgetTileVisible && filteredSubCounties.length === 0"
                class="empty-hint"
              >
                No budgets match the current filters.
              </div>
            </div>
          </a-spin>
        </template>

        <!-- ════════ LEVEL 3 · Single budget detail ════════ -->
        <template v-else>
          <div class="level-title">
            <sdButton size="small" class="back-btn" @click="goCountyBudgets">
              ← Back to {{ selectedCounty.name }}
            </sdButton>
            <span class="lt-icon">▦</span>
            {{ selectedCounty.name }} — {{ selectedBudget.label }}
          </div>
          <a-tag class="ph-stage-tag">{{ selectedBudget.stage }}</a-tag>

          <!-- stats row -->
          <div class="stat-row">
            <div class="stat-chip">
              <span class="sc-label">Population:</span>
              <strong>{{ fmt(selectedBudget.population) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Households:</span>
              <strong>{{ fmt(selectedBudget.households) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Wards:</span>
              <strong>{{ fmt(selectedBudget.wards) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Locations:</span>
              <strong>{{ fmt(selectedBudget.locations) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Villages:</span>
              <strong>{{ fmt(selectedBudget.villages) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Posts:</span>
              <strong>{{ fmt(selectedBudget.posts) }}</strong>
            </div>
          </div>

          <!-- summary tiles -->
          <div class="summary-row">
            <div class="summary-tile">
              <div class="st-label">Nets Required</div>
              <div class="st-value">{{ fmt(selectedBudget.nets_required) }}</div>
            </div>
            <div class="summary-tile">
              <div class="st-label">Nets/Household</div>
              <div class="st-value">{{ selectedBudget.nets_per_hh.toFixed(2) }}</div>
            </div>
            <div class="summary-tile">
              <div class="st-label">Cost/Net (KES)</div>
              <div class="st-value">{{ selectedBudget.cost_per_net.toFixed(2) }}</div>
            </div>
            <div class="summary-tile accent">
              <div class="st-label">Total Budget (KES)</div>
              <div class="st-value">{{ fmt(selectedBudget.total_budget) }}</div>
            </div>
          </div>

          <!-- categories with parameters -->
          <a-collapse
            v-model:activeKey="openCategoryKeys"
            class="category-collapse"
            expand-icon-position="start"
          >
            <a-collapse-panel
              v-for="cat in selectedBudget.categories"
              :key="cat.id"
            >
              <template #header>
                <div class="cat-header">
                  <span class="cat-name">{{ cat.name }}</span>
                  <a-tag v-if="cat.badge" class="cat-badge">{{ cat.badge }}</a-tag>
                  <span class="cat-total">KES {{ fmt(cat.total) }}</span>
                </div>
              </template>

              <a-table
                :dataSource="cat.items"
                :columns="itemColumns"
                :pagination="false"
                size="small"
                row-key="id"
                class="category-table"
              >
                <template #bodyCell="{ column, record }">
                  <span v-if="column.key === 'unit_cost'">
                    {{ fmt(record.unit_cost) }}
                  </span>
                  <span v-else-if="column.key === 'days'">{{ record.days }}</span>
                  <span v-else-if="column.key === 'units'">{{ record.units }}</span>
                  <strong v-else-if="column.key === 'total'" class="cat-item-total">
                    {{ fmt(record.total) }}
                  </strong>
                </template>
                <template #summary>
                  <a-table-summary fixed>
                    <a-table-summary-row>
                      <a-table-summary-cell :index="0" :col-span="4" align="right">
                        <strong>Subtotal</strong>
                      </a-table-summary-cell>
                      <a-table-summary-cell :index="4" align="right">
                        <strong>{{ fmt(cat.total) }}</strong>
                      </a-table-summary-cell>
                    </a-table-summary-row>
                  </a-table-summary>
                </template>
              </a-table>
            </a-collapse-panel>
          </a-collapse>

          <!-- grand total -->
          <div class="grand-total-bar">
            <span>GRAND TOTAL</span>
            <strong>KES {{ fmt(selectedBudget.total_budget) }}</strong>
          </div>

          <!-- actions -->
          <div class="detail-actions">
            <sdButton @click="downloadBudgetPDF">Download PDF</sdButton>
            <sdButton
              v-if="selectedBudget.status !== 'approved'"
              type="success"
              :loading="approving"
              @click="approveBudget(selectedBudget)"
            >
              Approve
            </sdButton>
            <sdButton
              v-if="canReferBack"
              type="warning"
              @click="openReferModal(selectedBudget)"
            >
              Refer Back
            </sdButton>
            <sdButton @click="goCountyBudgets">Back to {{ selectedCounty.name }}</sdButton>
          </div>
        </template>

        <!-- Refer Back Modal -->
        <a-modal
          v-model:visible="referModal"
          title="Refer Budget Back"
          @ok="handleRefer"
          ok-text="Send Referral"
          :confirm-loading="referring"
        >
          <p style="color: #5a5f7d; margin-bottom: 12px">
            Provide detailed feedback for revision and resubmission.
          </p>
          <a-textarea
            v-model:value="referNote"
            :rows="4"
            placeholder="Explain what needs to be corrected..."
          />
        </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { notification, message } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

/* Map detail API response -> shape consumed by the template */
const mapDetail = (d) => {
  if (!d) return null;
  const demo = d.demographics || {};
  const sum = d.summary || {};
  const review = d.review || {};
  return {
    id: d.id,
    label: d.label || (d.admin_unit && d.admin_unit.name) || '',
    admin_unit: d.admin_unit || null,
    financial_year: d.financial_year,
    status: d.status,
    stage: d.stage,
    flags: d.flags,
    submitted_at: d.submitted_at,
    submitted_by: d.submitted_by,
    population: demo.population || 0,
    households: demo.households || 0,
    wards: demo.wards || 0,
    locations: demo.locations || 0,
    villages: demo.villages || 0,
    posts: demo.posts || 0,
    nets_required: sum.nets_required || 0,
    nets_per_hh: sum.nets_per_household || 0,
    cost_per_net: sum.cost_per_net_kes || 0,
    total_budget: sum.total_budget_kes || 0,
    categories: (d.categories || []).map((cat) => ({
      id: cat.id,
      code: cat.code,
      name: cat.name,
      badge: cat.badge,
      total: cat.total_kes || 0,
      items: (cat.parameters || []).map((p) => ({
        id: p.id,
        item: p.item,
        unit_cost: p.unit_cost_kes || 0,
        days: p.days || 0,
        units: p.units || 0,
        total: p.total_kes || 0,
        source: p.source,
        parameter_id: p.parameter_id,
      })),
    })),
    can_approve: !!review.can_approve,
    can_refer_back: !!review.can_refer_back,
    history: review.history || [],
  };
};

export default {
  name: 'NationalBudgetReview',
  components: { Main, RecordViewWrapper, BudgetPageWrapper },
  setup() {
    const counties = ref([]);
    const selectedCounty = ref(null);
    const selectedBudget = ref(null);

    const loadingCounties = ref(false);
    const loadingDetail = ref(false);

    const openCategoryKeys = ref([]);

    const referModal = ref(false);
    const referring = ref(false);
    const referNote = ref('');

    /* ────────── Filters ──────────
     * filterCountyId       – restrict to a single county (also auto-drills
     *                        into level 2 when explicitly picked).
     * filterSubCountyId    – restrict to a single sub-county within the
     *                        chosen / drilled-in county.
     * filterStage          – restrict by `stage` label as emitted by the
     *                        backend's statusToStageLabel().
     *
     * All filters are evaluated locally against the counties payload that
     * is already loaded by fetchCounties() — no extra round-trip needed.
     */
    const filterCountyId = ref(null);
    const filterSubCountyId = ref(null);
    const filterStage = ref(null);

    const stageOptions = [
      { value: 'Preparatory Stage',      label: 'Preparatory Stage' },
      { value: 'County Review',          label: 'County Review (sub-county submitted)' },
      { value: 'Pending National Review', label: 'Pending National Review' },
      { value: 'County Approved',        label: 'County Approved' },
      { value: 'National Approved',      label: 'National Approved' },
    ];

    const hasActiveFilters = computed(() =>
      !!(filterCountyId.value || filterSubCountyId.value || filterStage.value),
    );

    const resetFilters = () => {
      filterCountyId.value = null;
      filterSubCountyId.value = null;
      filterStage.value = null;
    };

    /* Sub-county options derived from the active county scope. When the
     * user is at level 2, options are drawn from the drilled-in county.
     * When at level 1 with a county filter, options are drawn from that
     * filtered county. Otherwise empty (we don't flatten across counties). */
    const subCountyOptions = computed(() => {
      const sourceCounty =
        selectedCounty.value ||
        (filterCountyId.value
          ? counties.value.find((c) => c.id === filterCountyId.value)
          : null);
      if (!sourceCounty) return [];
      return (sourceCounty.sub_counties || []).map((sc) => ({
        id: sc.id,
        label: sc.name,
      }));
    });

    /* Clear sub-county selection whenever county scope changes. */
    const onCountyFilterChange = () => {
      filterSubCountyId.value = null;
    };

    /* Helpers — does a budget row match the stage filter? */
    const stageMatches = (stage) => {
      if (!filterStage.value) return true;
      return stage === filterStage.value;
    };

    /* A county is included if either:
     *   – its county-level budget matches, OR
     *   – any sub-county budget under it matches.
     * Plus, if a sub-county id filter is set, the county must contain it. */
    const filteredCounties = computed(() => {
      let list = counties.value;

      if (filterCountyId.value) {
        list = list.filter((c) => c.id === filterCountyId.value);
      }

      if (filterSubCountyId.value) {
        list = list.filter((c) =>
          (c.sub_counties || []).some((sc) => sc.id === filterSubCountyId.value),
        );
      }

      if (filterStage.value) {
        list = list.filter((c) => {
          const cbMatch = c.county_budget && stageMatches(c.county_budget.stage);
          const scMatch = (c.sub_counties || []).some(
            (sc) => sc.budget && stageMatches(sc.budget.stage),
          );
          return cbMatch || scMatch;
        });
      }

      return list;
    });

    /* Within level 2, sub-county cards visible after filters. */
    const filteredSubCounties = computed(() => {
      if (!selectedCounty.value) return [];
      let list = selectedCounty.value.sub_counties || [];
      if (filterSubCountyId.value) {
        list = list.filter((sc) => sc.id === filterSubCountyId.value);
      }
      if (filterStage.value) {
        list = list.filter((sc) => sc.budget && stageMatches(sc.budget.stage));
      }
      return list;
    });

    /* County-level budget tile visibility on level 2. Hidden if a
     * sub-county is specifically targeted, or if the stage filter
     * rules it out. */
    const countyBudgetTileVisible = computed(() => {
      if (!selectedCounty.value) return false;
      if (filterSubCountyId.value) return false;
      const cb = selectedCounty.value.county_budget;
      if (filterStage.value) {
        return !!(cb && stageMatches(cb.stage));
      }
      return true;
    });

    /* Compact count message shown beside the Reset button. */
    const filteredCountResult = computed(() => {
      if (selectedCounty.value) {
        const n = filteredSubCounties.value.length + (countyBudgetTileVisible.value ? 1 : 0);
        return `${n} budget${n === 1 ? '' : 's'}`;
      }
      const n = filteredCounties.value.length;
      return `${n} county${n === 1 ? '' : 'ies'}`;
    });

    /* fetch counties list -------------------------------- */
    const fetchCounties = async () => {
      loadingCounties.value = true;
      try {
        const { data } = await axios.get('get_national_budget_review_counties');
        counties.value = (data && data.counties) || [];
      } catch (err) {
        message.error('Failed to load counties');
        // eslint-disable-next-line no-console
        console.error('get_national_budget_review_counties error:', err);
      } finally {
        loadingCounties.value = false;
      }
    };

    /* fetch one budget detail ---------------------------- */
    const fetchBudgetDetail = async (budgetId) => {
      if (!budgetId) return;
      loadingDetail.value = true;
      try {
        const { data } = await axios.get('get_national_budget_review_detail', {
          params: { budget_id: budgetId },
        });
        const mapped = mapDetail(data);
        selectedBudget.value = mapped;
        openCategoryKeys.value = mapped && mapped.categories.length
          ? [mapped.categories[0].id]
          : [];
      } catch (err) {
        message.error('Failed to load budget detail');
        // eslint-disable-next-line no-console
        console.error('get_national_budget_review_detail error:', err);
      } finally {
        loadingDetail.value = false;
      }
    };

    /* navigation ----------------------------------------- */
    const openCounty = (c) => {
      selectedCounty.value = c;
      selectedBudget.value = null;
    };
    const openCountyBudget = () => {
      const cb = selectedCounty.value && selectedCounty.value.county_budget;
      if (!cb || !cb.id) return;
      fetchBudgetDetail(cb.id);
    };
    const openSubCountyBudget = (sc) => {
      if (!sc || !sc.budget || !sc.budget.id) return;
      fetchBudgetDetail(sc.budget.id);
    };
    const goCounties = () => {
      selectedCounty.value = null;
      selectedBudget.value = null;
      // Clearing the drill-in also clears the sub-county filter — its
      // options were scoped to the previously-open county.
      filterSubCountyId.value = null;
    };
    const goCountyBudgets = () => {
      selectedBudget.value = null;
    };

    /* table columns -------------------------------------- */
    const itemColumns = [
      { title: 'Budget Item', dataIndex: 'item', key: 'item' },
      { title: 'Unit Cost', key: 'unit_cost', align: 'right', width: 140 },
      { title: 'Days', key: 'days', align: 'right', width: 100 },
      { title: 'Units', key: 'units', align: 'right', width: 100 },
      { title: 'Total (KES)', key: 'total', align: 'right', width: 160 },
    ];

    /* actions -------------------------------------------- */
    const approving = ref(false);
    const approveBudget = async (record) => {
      if (!record || !record.id) {
        notification.error({ message: 'Cannot approve: missing budget id.' });
        return;
      }
      approving.value = true;
      try {
        await axios.post(`approve_campaign_budget/${record.id}`);
        record.status = 'approved';
        record.can_approve = false;
        record.can_refer_back = false;
        notification.success({
          message: `Budget for ${record.label} approved.`,
        });
      } catch (err) {
        notification.error({
          message: 'Failed to approve budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        approving.value = false;
      }
    };
    const openReferModal = () => {
      referNote.value = '';
      referModal.value = true;
    };
    /* Locally-derived eligibility. The backend already returns
     * `can_refer_back` but it depends on the National role being
     * resolved server-side; surface the button purely from status
     * so it always lights up when the budget is in a referrable
     * state (sub-county submitted, or county submitted/approved).
     * If the BE explicitly says false we still respect that. */
    const canReferBack = computed(() => {
      const b = selectedBudget.value;
      if (!b) return false;
      if (b.can_refer_back === false) return false;
      return ['submitted', 'county_approved'].includes(b.status);
    });
    const handleRefer = async () => {
      const note = referNote.value.trim();
      if (note.length < 10) {
        notification.warning({
          message: 'Please provide feedback (minimum 10 characters).',
        });
        return;
      }
      if (!selectedBudget.value || !selectedBudget.value.id) {
        referModal.value = false;
        return;
      }
      referring.value = true;
      try {
        await axios.post(`reject_campaign_budget/${selectedBudget.value.id}`, {
          rejection_note: note,
        });
        // Both submitted and county_approved now revert to draft so the
        // owning sub-county / county user can edit and resubmit.
        selectedBudget.value.status = 'draft';
        selectedBudget.value.can_approve = false;
        selectedBudget.value.can_refer_back = false;
        notification.success({ message: 'Budget referred back for revision.' });
        referModal.value = false;
        await fetchCounties();
      } catch (err) {
        notification.error({
          message: 'Failed to refer budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        referring.value = false;
      }
    };
    const downloadBudgetPDF = () =>
      notification.info({ message: 'PDF download started (demo).' });

    const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

    onMounted(fetchCounties);

    /* kept for backward compat with template refs --------- */
    const countyBudgetRecord = computed(() => null);
    const subCountyRecord = () => null;

    return {
      counties,
      selectedCounty,
      selectedBudget,
      loadingCounties,
      loadingDetail,
      countyBudgetRecord,
      subCountyRecord,
      openCategoryKeys,
      referModal,
      referring,
      referNote,
      itemColumns,
      openCounty,
      openCountyBudget,
      openSubCountyBudget,
      goCounties,
      goCountyBudgets,
      approving,
      approveBudget,
      openReferModal,
      handleRefer,
      canReferBack,
      downloadBudgetPDF,
      fmt,
      /* filters */
      filterCountyId,
      filterSubCountyId,
      filterStage,
      stageOptions,
      subCountyOptions,
      hasActiveFilters,
      resetFilters,
      onCountyFilterChange,
      filteredCounties,
      filteredSubCounties,
      countyBudgetTileVisible,
      filteredCountResult,
    };
  },
};
</script>

<style lang="less" scoped>
.review-crumbs {
  font-size: 12px;
  :deep(a) {
    color: #2f6746;
    font-weight: 600;
  }
}

/* ───────── Filter bar (Levels 1 & 2) ───────── */
.nbr-filter-bar {
  background: #fff;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(31, 41, 55, 0.04);
}
.nbr-fb-row {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr) auto;
  gap: 12px;
  align-items: end;
}
@media (max-width: 900px) {
  .nbr-fb-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 540px) {
  .nbr-fb-row { grid-template-columns: 1fr; }
}
.nbr-fb-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.nbr-fb-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #6b7388;
}
.nbr-fb-control {
  width: 100%;
}
.nbr-fb-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}
.nbr-fb-count {
  font-size: 12px;
  color: #2f6746;
  font-weight: 600;
}

/* ───────── Card grid for levels 1 & 2 ───────── */
.card-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  margin-bottom: 18px;
}
.card-grid.four-col {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
@media (max-width: 1100px) {
  .card-grid.four-col {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

.drill-card {
  position: relative;
  background: #fff;
  border: 1px solid #e1efe6;
  border-radius: 8px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  &:hover {
    border-color: #9ad8b4;
    box-shadow: 0 6px 14px rgba(28, 122, 72, 0.1);
    transform: translateY(-1px);
  }
  &.is-active {
    border-color: #15693c;
    background: #f4fbf6;
  }
  &.is-empty {
    .dc-meta { color: #b0b8c3; }
  }

  .dc-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .dc-title {
    font-size: 13px;
    font-weight: 700;
    color: #1f2437;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .dc-icon {
    color: #4d8a63;
    font-size: 13px;
  }
  .dc-chevron {
    color: #b0b8c3;
    font-size: 16px;
    line-height: 1;
  }
  .dc-meta {
    font-size: 11px;
    color: #5a5f7d;
  }
  .dc-stage,
  .dc-flag {
    display: inline-block;
    margin-top: 8px;
    font-size: 10px;
    line-height: 1.4;
    padding: 2px 8px;
    border-radius: 10px;
    background: #eaf4ff;
    color: #2c99ff;
    border: none;
  }
  .dc-flag {
    background: #eef3fb;
    color: #2f6dcf;
  }
}

/* ───────── Level title (section header for lists) ───────── */
.level-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #15693c;
  margin: 6px 2px 12px;
  .lt-icon { color: #20c997; }
  .back-btn {
    margin-right: 4px;
    background: #fff;
    border: 1px solid #d9f0e2;
    color: #15693c;
    font-weight: 600;
    &:hover,
    &:focus {
      background: #f4fbf6;
      border-color: #9ad8b4;
      color: #15693c;
    }
  }
}

.ph-stage-tag {
  display: inline-block;
  margin-bottom: 14px;
  padding: 3px 12px;
  border-radius: 14px;
  background: #e5f3ff;
  color: #2c99ff;
  border: 1px solid #b7dcff;
  font-size: 12px;
  font-weight: 600;
}

/* ───────── Level 3 stats ───────── */
.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 12px 2px 14px;
  .stat-chip {
    font-size: 12px;
    color: #5a5f7d;
    .sc-label { margin-right: 4px; }
    strong { color: #1f2437; font-weight: 700; }
  }
}
.summary-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.summary-tile {
  background: #fff;
  border: 1px solid #e1efe6;
  border-radius: 8px;
  padding: 14px 16px;
  text-align: center;
  .st-label {
    font-size: 11px;
    color: #7a8a82;
    margin-bottom: 4px;
  }
  .st-value {
    font-size: 22px;
    font-weight: 800;
    color: #1f2437;
    line-height: 1.1;
  }
  &.accent .st-value { color: #15693c; }
}

/* ───────── Collapsible categories ───────── */
.category-collapse {
  background: transparent;
  border: none;

  :deep(.ant-collapse-item) {
    background: #fff;
    border: 1px solid #e6f0ea;
    border-radius: 8px !important;
    margin-bottom: 8px;
    overflow: hidden;
  }
  :deep(.ant-collapse-header) {
    background: #f6fbf8;
    padding: 10px 16px !important;
    align-items: center;
  }
  :deep(.ant-collapse-content) {
    border-top: 1px solid #eaf4ee;
  }
  :deep(.ant-collapse-content-box) {
    padding: 0 !important;
  }

  .cat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    .cat-name {
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      color: #272b41;
    }
    .cat-badge {
      background: #eef3fb;
      color: #2f6dcf;
      border: none;
      font-size: 10px;
      border-radius: 10px;
      padding: 1px 8px;
    }
    .cat-total {
      font-size: 13px;
      font-weight: 700;
      color: #15693c;
    }
  }
}

:deep(.category-table) {
  .ant-table { background: transparent; }
  .ant-table-thead > tr > th {
    background: #fff;
    border-bottom: 1px solid #eaf4ee;
    color: #7a8a82;
    font-weight: 600;
    font-size: 11px;
    text-transform: none;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f4f8f5;
    font-size: 12px;
    color: #1f2437;
  }
  .ant-table-tbody > tr:hover > td { background: #fafcfb; }
  .ant-table-summary {
    background: #f6fbf8;
    .ant-table-cell { border-bottom: none; }
  }
  .cat-item-total { color: #15693c; font-weight: 700; }
}

.grand-total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f2f3f7;
  border: 1px solid #e6e8ef;
  border-radius: 6px;
  padding: 12px 18px;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #1f2437;
  letter-spacing: 0.4px;
  strong { color: #15693c; font-size: 14px; font-weight: 800; }
}

.detail-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 18px;
  flex-wrap: wrap;
}
</style>
