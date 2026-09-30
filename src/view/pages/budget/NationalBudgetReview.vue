<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard nbr-review-page">
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
            <p class="ph-subtitle">
              Review county and sub-county budgets, mark them as reviewed by
              the DNMP Accountant, then approve at national level.
            </p>
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

        <!-- Filter panel — visible on Levels 1 & 2 (hidden on single-budget detail) -->
        <section v-if="!selectedBudget" class="panel nbr-filter-panel">
          <div class="filter-grid">
            <a-select
              v-model:value="filterCountyId"
              show-search
              allow-clear
              option-filter-prop="label"
              placeholder="Filter by County"
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
            <a-select
              v-model:value="filterSubCountyId"
              show-search
              allow-clear
              option-filter-prop="label"
              placeholder="Filter by Sub-County"
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
            <a-select
              v-model:value="filterStage"
              allow-clear
              placeholder="Approval Stage"
            >
              <a-select-option
                v-for="opt in stageOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </a-select-option>
            </a-select>
            <div class="nbr-filter-actions">
              <sdButton
                size="small"
                class="nbr-action-btn"
                type="light"
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
        </section>

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
                  v-if="selectedCounty.county_budget && selectedCounty.county_budget.special_area_cost"
                  class="dc-flag"
                >
                  ✦ Special Area Cost
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
                <span v-if="sc.budget && sc.budget.special_area_cost" class="dc-flag">
                  ✦ Special Area Cost
                </span>

                <!-- The SEPARATE Special Area Cost budget: submitted straight
                     to National (no county approval). -->
                <div
                  v-if="sc.sac_budget"
                  class="dc-sac-row"
                  @click.stop="openSacBudget(sc)"
                >
                  <span class="dc-sac-label">✦ SAC Budget</span>
                  <a-tag class="dc-sac-stage">{{ sc.sac_budget.stage }}</a-tag>
                  <span class="dc-chevron">›</span>
                </div>
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

          <!-- DNMP Accountant review strip -->
          <div
            v-if="selectedBudget.dnmp_review"
            class="dnmp-review-strip"
          >
            <strong>Reviewed by DNMP Accountant</strong>
            <span>
              {{ selectedBudget.dnmp_review.reviewed_by?.name || '—' }}
              · {{ formatReviewDate(selectedBudget.dnmp_review.reviewed_at) }}
            </span>
            <span v-if="selectedBudget.dnmp_review.notes" class="dnmp-notes">
              “{{ selectedBudget.dnmp_review.notes }}”
            </span>
          </div>

          <!-- actions -->
          <div class="detail-actions">
            <sdButton
              type="light"
              class="nbr-action-btn"
              @click="downloadBudgetPDF"
            >
              Download PDF
            </sdButton>
            <!-- DNMP Accountant review step — before the Finance Officer can approve -->
            <sdButton
              v-if="selectedBudget.can_review && canReview"
              type="primary"
              class="nbr-action-btn"
              :loading="reviewing"
              @click="openReviewModal"
            >
              Mark as Reviewed
            </sdButton>
            <!-- Final national approval — Finance Officer -->
            <sdButton
              v-if="selectedBudget.can_approve && canApprove"
              type="success"
              class="nbr-action-btn"
              :loading="approving"
              @click="approveBudget(selectedBudget)"
            >
              Approve
            </sdButton>
            <sdButton
              v-if="canReferBack"
              type="warning"
              class="nbr-action-btn"
              @click="openReferModal(selectedBudget)"
            >
              Refer Back
            </sdButton>
            <sdButton
              type="light"
              class="nbr-action-btn"
              @click="goCountyBudgets"
            >
              Back to {{ selectedCounty.name }}
            </sdButton>
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
          <p style="color: #6b7a72; margin-bottom: 12px">
            Provide detailed feedback for revision and resubmission.
          </p>
          <a-textarea
            v-model:value="referNote"
            :rows="4"
            placeholder="Explain what needs to be corrected..."
          />
        </a-modal>

        <!-- DNMP Accountant Review Modal -->
        <a-modal
          v-model:visible="reviewModal"
          title="DNMP Accountant Review"
          @ok="markReviewed"
          ok-text="Mark as Reviewed"
          :confirm-loading="reviewing"
        >
          <p style="color: #6b7a72; margin-bottom: 12px">
            Confirm that you have reviewed this budget. It will then be
            queued for final national approval by the Finance Officer.
          </p>
          <a-textarea
            v-model:value="reviewNote"
            :rows="3"
            placeholder="Optional review notes..."
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
import { hasRoleByName } from '@/services/user-role';
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
    can_review: !!review.can_review,
    can_refer_back: !!review.can_refer_back,
    history: review.history || [],
    dnmp_review: d.dnmp_review || null,
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

    /* DNMP Accountant review (before Finance Officer approval) */
    const reviewModal = ref(false);
    const reviewing = ref(false);
    const reviewNote = ref('');

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
      { value: 'Preparatory Stage',        label: 'Preparatory Stage' },
      { value: 'County Review',            label: 'County Review (sub-county submitted)' },
      { value: 'Pending DNMP Review',      label: 'Pending DNMP Review (county budget submitted)' },
      { value: 'County Approved',          label: 'County Approved (awaiting DNMP review)' },
      { value: 'Pending National Approval', label: 'Pending National Approval (reviewed, awaiting Finance Officer)' },
      { value: 'National Approved',        label: 'National Approved' },
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
    // The Special Area Cost budget is its own record — open it independently
    // so the Accountant / Finance Officer review and approve it on its own.
    const openSacBudget = (sc) => {
      const sac = sc && sc.sac_budget;
      if (!sac || !sac.id) return;
      fetchBudgetDetail(sac.id);
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
    /* Button visibility is gated by the EXACT business roles (mirrors the
     * strict backend gate in CampaignBudgetController):
     *   • Accountant (DNMP) or Super Admin        → Mark as Reviewed
     *   • Finance Officer (DNMP) or Super Admin   → Approve
     * The budget state (server-side can_review / can_approve) must also
     * allow it — e.g. Super Admin sees both buttons, but only when the
     * budget is actually at the right stage. */
    const canReview  = computed(() => hasRoleByName(['Super Admin', 'Accountant']).value);
    const canApprove = computed(() => hasRoleByName(['Super Admin', 'Finance Officer']).value);

    const approving = ref(false);
    const openReviewModal = () => {
      reviewNote.value = '';
      reviewModal.value = true;
    };
    const markReviewed = async () => {
      const record = selectedBudget.value;
      if (!record || !record.id) {
        notification.error({ message: 'Cannot review: missing budget id.' });
        return;
      }
      reviewing.value = true;
      try {
        await axios.post(`dnmp_review_campaign_budget/${record.id}`, {
          review_notes: reviewNote.value.trim() || undefined,
        });
        record.status = 'dnmp_reviewed';
        record.can_review = false;
        record.can_approve = true;
        notification.success({
          message: `Budget for ${record.label} marked as reviewed.`,
        });
        reviewModal.value = false;
        // Reload so the review strip shows the reviewer + notes from the server.
        await fetchBudgetDetail(record.id);
        await fetchCounties();
      } catch (err) {
        notification.error({
          message: 'Failed to submit review',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        reviewing.value = false;
      }
    };
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
        record.can_review = false;
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
    /* Locally-derived eligibility. The backend strictly restricts national-stage
     * referrals to the DNMP roles (Accountant | Finance Officer) plus Super
     * Admin, so the button only renders for those exact roles. The budget
     * must also be in a referrable state (sub-county submitted, county
     * submitted/county-approved, or already DNMP-reviewed awaiting approval);
     * if the BE explicitly says false we still respect that. */
    const canReferBack = computed(() => {
      const b = selectedBudget.value;
      if (!b) return false;
      if (b.can_refer_back === false) return false;
      if (!hasRoleByName(['Super Admin', 'Accountant', 'Finance Officer']).value) return false;
      return ['submitted', 'county_approved', 'dnmp_reviewed'].includes(b.status);
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
        // submitted, county_approved and dnmp_reviewed now revert to draft so
        // the owning sub-county / county user can edit and resubmit.
        selectedBudget.value.status = 'draft';
        selectedBudget.value.can_approve = false;
        selectedBudget.value.can_review = false;
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

    const formatReviewDate = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

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
      reviewModal,
      reviewing,
      reviewNote,
      itemColumns,
      openCounty,
      openCountyBudget,
      openSubCountyBudget,
      openSacBudget,
      goCounties,
      goCountyBudgets,
      approving,
      approveBudget,
      canReview,
      canApprove,
      openReviewModal,
      markReviewed,
      openReferModal,
      handleRefer,
      canReferBack,
      downloadBudgetPDF,
      fmt,
      formatReviewDate,
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
/* ───────── Slim top bar ───────── */
.tool-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f4fbf6;
  border: 1px solid #d9ecdf;
  border-radius: 6px;
  margin-bottom: 14px;
  font-size: 12px;
  color: #2f6746;
  font-weight: 600;
}

/* ───────── Page heading (platform theme) ───────── */
.page-heading {
  .ph-left {
    .ph-title {
      color: #15693c;
    }
    .ph-subtitle {
      font-size: 13px;
      color: #6b7a72;
    }
  }
}

.review-crumbs {
  font-size: 12px;
  :deep(a) {
    color: #2f6746;
    font-weight: 600;
  }
}

/* ───────── Section panel (platform theme) ───────── */
.panel {
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
}

/* ───────── Filter panel (Levels 1 & 2) ───────── */
.panel.nbr-filter-panel {
  padding: 12px 16px;
  margin-bottom: 16px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
  align-items: center;
  :deep(.ant-select) {
    width: 100%;
  }
}

.nbr-filter-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.nbr-fb-count {
  font-size: 12px;
  color: #2f6746;
  font-weight: 600;
  background: #e9f6ee;
  border-radius: 12px;
  padding: 2px 10px;
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
  border: 1px solid #e2ebe5;
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  &:hover {
    border-color: #4d8a63;
    box-shadow: 0 4px 14px rgba(15, 105, 60, 0.08);
    transform: translateY(-1px);
  }
  &.is-active {
    border-color: #15693c;
    background: #f4fbf6;
  }
  &.is-empty {
    opacity: 0.6;
    cursor: default;
    &:hover {
      transform: none;
      box-shadow: none;
    }
    .dc-meta { color: #8a9990; }
  }

  .dc-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .dc-title {
    font-size: 15px;
    font-weight: 700;
    color: #15693c;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .dc-icon {
    color: #4d8a63;
    font-size: 13px;
  }
  .dc-chevron {
    color: #95a59b;
    font-size: 18px;
    line-height: 1;
  }
  .dc-meta {
    font-size: 12px;
    color: #6b7a72;
  }
  .dc-stage,
  .dc-flag {
    display: inline-block;
    margin-top: 8px;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.4;
    padding: 2px 10px;
    border-radius: 10px;
  }
  .dc-stage {
    background: #e9f6ee;
    color: #15693c;
    border: 1px solid #9ad8b4;
  }
  .dc-flag {
    background: #fff4e6;
    color: #b85c00;
    border: 1px solid #f0d3a0;
  }
}

.empty-hint {
  grid-column: 1 / -1;
  text-align: center;
  color: #8a9990;
  padding: 24px 0;
}

/* ───────── Level title (section header for lists) ───────── */
.level-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
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
  background: #e9f6ee;
  color: #15693c;
  border: 1px solid #9ad8b4;
  font-size: 12px;
  font-weight: 600;
}

/* ───────── Level 3 stats ───────── */
.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
  .stat-chip {
    background: #f4fbf6;
    border: 1px solid #d9ecdf;
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 12px;
    color: #4d6357;
    .sc-label { color: #6b7a72; margin-right: 4px; }
    strong { color: #15693c; font-weight: 700; }
  }
}
.summary-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.summary-tile {
  background: #fff;
  border: 1px solid #e2ebe5;
  border-radius: 10px;
  padding: 12px 14px;
  .st-label {
    font-size: 12px;
    color: #6b7a72;
    margin-bottom: 4px;
  }
  .st-value {
    font-size: 18px;
    font-weight: 700;
    color: #15693c;
    line-height: 1.1;
    margin-top: 4px;
  }
  &.accent {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border-color: #c9e6d3;
  }
}

/* ───────── Collapsible categories ───────── */
.category-collapse {
  background: transparent;
  border: none;

  :deep(.ant-collapse-item) {
    background: #fff;
    border: 1px solid #e2ebe5 !important;
    border-radius: 10px !important;
    margin-bottom: 8px;
    overflow: hidden;
  }
  :deep(.ant-collapse-header) {
    align-items: center !important;
    padding: 12px 14px !important;
    background: #f9fcf8;
  }
  :deep(.ant-collapse-content) {
    border-top: 1px solid #eaf2e9;
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
      color: #15693c;
    }
    .cat-badge {
      background: #e9f6ee;
      color: #15693c;
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
    border-bottom: 1px solid #eaf2e9;
    color: #6b7a72;
    font-weight: 600;
    font-size: 11px;
    text-transform: none;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f4f8f5;
    font-size: 12px;
    color: #2f3a35;
  }
  .ant-table-tbody > tr:hover > td { background: #fafcfb; }
  .ant-table-summary {
    background: #f4fbf6;
    .ant-table-cell { border-bottom: none; }
  }
  .cat-item-total { color: #15693c; font-weight: 700; }
}

.grand-total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #15693c 0%, #1f8b53 100%);
  color: #fff;
  border-radius: 10px;
  padding: 14px 18px;
  margin-top: 14px;
  font-size: 15px;
  letter-spacing: 0.5px;
  strong { font-size: 18px; font-weight: 800; }
}

/* DNMP Accountant review strip */
.dnmp-review-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #9ad8b4;
  border-left: 4px solid #15693c;
  border-radius: 10px;
  padding: 10px 16px;
  margin-top: 14px;
  font-size: 12px;
  color: #2f3a35;
  strong { color: #15693c; font-weight: 700; }
  .dnmp-notes { color: #6b7a72; font-style: italic; }
}

.detail-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 18px;
  flex-wrap: wrap;
}

/* ───────── Platform pill buttons (Activities / Events theme) ───────── */
:deep(.nbr-action-btn.ant-btn) {
  border-radius: 22px;
  height: 38px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s;
}
:deep(.nbr-action-btn.ant-btn-primary) {
  background: #2c99ff;
  border-color: #2c99ff;
  color: #fff;
  &:hover:not([disabled]) {
    background: #1a86ec;
    border-color: #1a86ec;
  }
}
:deep(.nbr-action-btn.ant-btn-success) {
  background: #16a34a;
  border-color: #16a34a;
  color: #fff;
  &:hover:not([disabled]) {
    background: #15803d;
    border-color: #15803d;
  }
}
:deep(.nbr-action-btn.ant-btn-warning) {
  background: #fa8b0c;
  border-color: #fa8b0c;
  color: #fff;
  &:hover:not([disabled]) {
    background: #f07b00;
    border-color: #f07b00;
  }
}
:deep(.nbr-action-btn.ant-btn-light) {
  background: #fff;
  border-color: #d9e0e4;
  color: #2f6746;
  &:hover:not([disabled]) {
    background: #f4fbf7;
    border-color: #9ad8b4;
  }
}
.dc-flag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  padding: 1px 8px;
  border-radius: 10px;
  background: #fdeee7;
  color: #b3402a;
  font-size: 10px;
  font-weight: 600;
  align-self: flex-start;
}
/* The SEPARATE Special Area Cost budget row inside a sub-county card. */
.dc-sac-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  background: #fffaf3;
  border: 1px dashed #f0dcbe;
  cursor: pointer;
}
.dc-sac-row:hover {
  background: #fdf3e3;
}
.dc-sac-label {
  font-size: 11px;
  font-weight: 700;
  color: #8a4d1f;
}
.dc-sac-stage {
  margin: 0;
  font-size: 10px;
  border-radius: 10px;
  background: #f1e3cc;
  color: #8a5a2b;
  border: none;
}
</style>
