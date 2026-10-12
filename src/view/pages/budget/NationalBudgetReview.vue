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
          <!-- Where every county & sub-county budget sits right now -->
          <section v-if="stageSummaryTotal" class="stage-summary">
            <div class="ss-title">
              <span class="ss-icon">⌛</span>
              Budget pipeline — where the county &amp; sub-county budgets are
            </div>
            <div class="ss-track">
              <div
                v-for="b in stageSummary"
                :key="b.label"
                class="ss-bucket"
                :class="{
                  'is-mine': myActionStages.includes(b.label),
                  'is-editable': myEditableStages.includes(b.label),
                  'is-empty': !b.count,
                }"
              >
                <div class="ss-count">{{ b.count }}</div>
                <div class="ss-label">{{ b.short }}</div>
                <div v-if="myActionStages.includes(b.label)" class="ss-you">Awaiting you</div>
                <div v-else-if="myEditableStages.includes(b.label)" class="ss-you ss-you--editable">
                  Editable
                </div>
              </div>
            </div>
          </section>

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
                <BudgetStagePipeline
                  v-if="c.county_budget"
                  class="dc-pipeline"
                  compact
                  :status="c.county_budget.status"
                  :is-sub-county="false"
                  :is-special-area="false"
                  :action-status="myActionStatus(false, false)"
                />
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
                  <span class="dc-meta-label">Standard:</span>
                  {{ selectedCounty.county_budget ? selectedCounty.county_budget.stage : 'No budget' }}
                </div>
                <BudgetStagePipeline
                  v-if="selectedCounty.county_budget"
                  class="dc-pipeline"
                  compact
                  :status="selectedCounty.county_budget.status"
                  :is-sub-county="false"
                  :is-special-area="false"
                  :action-status="myActionStatus(false, false)"
                />
                <span
                  v-if="selectedCounty.county_budget && selectedCounty.county_budget.special_area_cost"
                  class="dc-flag"
                >
                  ✦ Special Area Cost applicable
                </span>
              </div>
              <!-- The county's SEPARATE Special Area Cost budget: submitted
                   straight to National (no county approval). -->
              <div
                v-if="countySacTileVisible"
                class="drill-card"
                :class="{ 'is-empty': !selectedCounty.sac_budget }"
                @click="openSacBudget(selectedCounty)"
              >
                <div class="dc-head">
                  <span class="dc-title">
                    <span class="dc-icon">✦</span> County SAC Budget
                  </span>
                  <span class="dc-chevron">›</span>
                </div>
                <div class="dc-meta">
                  {{ selectedCounty.sac_budget ? selectedCounty.sac_budget.stage : 'No budget' }}
                </div>
                <BudgetStagePipeline
                  v-if="selectedCounty.sac_budget"
                  class="dc-pipeline"
                  compact
                  :status="selectedCounty.sac_budget.status"
                  :is-sub-county="false"
                  :is-special-area="true"
                  :action-status="myActionStatus(false, true)"
                />
              </div>
              <div
                v-for="sc in filteredSubCounties"
                :key="sc.id"
                class="drill-card"
                :class="{ 'is-empty': !sc.budget && !sc.sac_budget }"
                @click="openSubCountyBudget(sc)"
              >
                <div class="dc-head">
                  <span class="dc-title">{{ sc.name }}</span>
                  <span class="dc-chevron">›</span>
                </div>
                <div class="dc-meta">
                  <span class="dc-meta-label">Standard:</span>
                  {{ sc.budget ? sc.budget.stage : 'No budget' }}
                </div>
                <BudgetStagePipeline
                  v-if="sc.budget"
                  class="dc-pipeline"
                  compact
                  :status="sc.budget.status"
                  :is-sub-county="true"
                  :is-special-area="false"
                  :action-status="myActionStatus(true, false)"
                />
                <span v-if="sc.budget && sc.budget.special_area_cost" class="dc-flag">
                  ✦ Special Area Cost applicable
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
          <div class="detail-stage-head">
            <a-tag class="ph-stage-tag">{{ selectedBudget.stage }}</a-tag>
            <span class="detail-stage-hint">
              Current stage — the steps to the right are still ahead.
            </span>
          </div>
          <BudgetStagePipeline
            class="detail-pipeline"
            :status="selectedBudget.status"
            :is-sub-county="selectedBudget.is_sub_county"
            :is-special-area="selectedBudget.is_special_area"
            :action-status="myActionStatus(selectedBudget.is_sub_county, selectedBudget.is_special_area)"
          />

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
              <span class="sc-label">Sublocations:</span>
              <strong>{{ fmt(selectedBudget.sub_locations) }}</strong>
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
          <!-- Edit-mode hint (Finance Officer / Program Accountant, pre-approval) -->
          <div v-if="editing" class="nbr-edit-banner">
            Editing mode — adjust units, days or overrides per row, then
            <strong>Save changes</strong>. This budget locks automatically once
            approved.
          </div>

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
                  <!-- Applicable multiplier for this category (profile-derived,
                       e.g. "× 5 Sub-counties") so the reviewer can see how the
                       subtotal was scaled. -->
                  <a-tag
                    v-if="cat.multiplier_display"
                    class="cat-multiplier"
                    :title="`Unit totals are multiplied by ${cat.multiplier_display}`"
                  >
                    {{ cat.multiplier_display }}
                  </a-tag>
                  <span class="cat-total">KES {{ fmt(cat.total) }}</span>
                </div>
              </template>

              <a-table
                :dataSource="cat.items"
                :columns="tableColumns"
                :pagination="false"
                size="small"
                row-key="id"
                class="category-table"
              >
                <template #bodyCell="{ column, record }">
                  <span v-if="column.key === 'unit_cost'">
                    {{ fmt(record.unit_cost) }}
                  </span>
                  <!-- Days — editable for manual rows while in edit mode -->
                  <template v-else-if="column.key === 'days'">
                    <a-input-number
                      v-if="editing && !record.is_auto_calculated && !record.is_special_cost"
                      v-model:value="record.days"
                      :min="1"
                      size="small"
                      class="nbr-edit-input"
                    />
                    <span v-else>{{ record.days }}</span>
                  </template>
                  <!-- Units — editable for manual + SAC rows while in edit mode -->
                  <template v-else-if="column.key === 'units'">
                    <a-input-number
                      v-if="editing && !record.is_auto_calculated"
                      v-model:value="record.units"
                      :min="0"
                      :max="record.is_special_cost ? 20 : 100000"
                      size="small"
                      class="nbr-edit-input"
                    />
                    <span v-else>{{ record.units }}</span>
                  </template>
                  <!-- Multiplier applied to this parameter's units. Blank when
                       the category carries no multiplier (factor of 1). -->
                  <span v-else-if="column.key === 'multiplier'">
                    <span v-if="record.multiplier" class="row-multiplier">
                      × {{ record.multiplier }}
                    </span>
                  </span>
                  <!-- Override — auto-calculated rows only (edit mode column) -->
                  <template v-else-if="column.key === 'override'">
                    <a-input-number
                      v-if="editing && record.is_auto_calculated"
                      v-model:value="record.override_value"
                      :min="0"
                      size="small"
                      class="nbr-edit-input"
                      placeholder="Override"
                    />
                    <span v-else>
                      {{ record.override_value == null ? '—' : fmt(record.override_value) }}
                    </span>
                  </template>
                  <template v-else-if="column.key === 'total'">
                    <strong class="cat-item-total">{{ fmt(record.total) }}</strong>
                    <a-tag
                      v-if="editing && isRowDirty(record)"
                      color="orange"
                      class="nbr-dirty-tag"
                    >
                      edited
                    </a-tag>
                  </template>
                </template>
                <template #summary>
                  <a-table-summary fixed>
                    <a-table-summary-row>
                      <a-table-summary-cell
                        :index="0"
                        :col-span="showEditColumns ? 6 : 5"
                        align="right"
                      >
                        <strong>Subtotal</strong>
                      </a-table-summary-cell>
                      <a-table-summary-cell :index="showEditColumns ? 6 : 5" align="right">
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

            <!-- Pre-approval line-item editing (Finance Officer / Program
                 Accountant). Hidden once the budget is approved — it is then
                 locked (selectedBudget.can_edit === false). -->
            <sdButton
              v-if="canEditSelected && !editing"
              type="light"
              class="nbr-action-btn"
              @click="beginEdit"
            >
              Edit Budget
            </sdButton>
            <sdButton
              v-if="editing"
              type="primary"
              class="nbr-action-btn"
              :loading="savingEdits"
              :disabled="!dirtyEditCount"
              @click="saveEdits"
            >
              Save changes{{ dirtyEditCount ? ` (${dirtyEditCount})` : '' }}
            </sdButton>
            <sdButton
              v-if="editing"
              type="light"
              class="nbr-action-btn"
              @click="cancelEdit"
            >
              Cancel
            </sdButton>

            <!-- DNMP Accountant review step — before the Finance Officer can approve -->
            <sdButton
              v-if="!editing && selectedBudget.can_review && canReview"
              type="primary"
              class="nbr-action-btn"
              :loading="reviewing"
              @click="openReviewModal"
            >
              Mark as Reviewed
            </sdButton>
            <!-- Final national approval — Finance Officer -->
            <sdButton
              v-if="!editing && selectedBudget.can_approve && canApprove"
              type="success"
              class="nbr-action-btn"
              :loading="approving"
              @click="openApproveModal"
            >
              Approve
            </sdButton>
            <sdButton
              v-if="!editing && canReferBack"
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

        <!-- Final National Approval confirmation (Finance Officer).
             Surfaces the DNMP Accountant's review comments so the approver can
             see them before signing off — for both standard and SAC budgets. -->
        <a-modal
          v-model:visible="approveModal"
          title="Approve budget at national level?"
          @ok="confirmApprove"
          :ok-text="approving ? 'Approving…' : 'Approve budget'"
          cancel-text="Cancel"
          :confirm-loading="approving"
        >
          <p style="color: #6b7a72; margin-bottom: 12px">
            You are about to give final national approval for
            <strong>{{ selectedBudget?.label }}</strong>
            <span v-if="selectedBudget && selectedBudget.total_budget">
              (KES {{ fmt(selectedBudget.total_budget) }})
            </span>. Please review the DNMP Accountant's comments below before
            approving.
          </p>

          <div
            v-if="selectedBudget && selectedBudget.dnmp_review"
            class="dnmp-review-strip"
            style="margin-top: 0"
          >
            <strong>DNMP Accountant review comments</strong>
            <span>
              {{ selectedBudget.dnmp_review.reviewed_by?.name || '—' }}
              · {{ formatReviewDate(selectedBudget.dnmp_review.reviewed_at) }}
            </span>
            <span v-if="selectedBudget.dnmp_review.notes" class="dnmp-notes">
              “{{ selectedBudget.dnmp_review.notes }}”
            </span>
          </div>
          <p v-else style="color: #6b7a72; margin-bottom: 0">
            No review comments were recorded by the DNMP Accountant.
          </p>
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
import BudgetStagePipeline from './BudgetStagePipeline.vue';

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
    // Level + budget type drive the stage pipeline (which steps apply).
    budget_type: d.budget_type || 'standard',
    is_sub_county: !!(d.admin_unit && d.admin_unit.type === 'sub_county'),
    is_special_area: (d.budget_type || 'standard') === 'special_area',
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
    sub_locations: demo.sub_locations || 0,
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
      multiplier_display: cat.multiplier_display || '',
      session_multiplier: cat.session_multiplier ?? null,
      total: cat.total_kes || 0,
      items: (cat.parameters || []).map((p) => ({
        id: p.id,
        // Real budget_line_items.id — required for the pre-approval edits.
        line_item_id: p.line_item_id ?? null,
        item: p.item,
        unit_cost: p.unit_cost_kes || 0,
        days: p.days || 0,
        units: p.units || 0,
        // Only surface the multiplier when it actually scales the line (> 1).
        multiplier:
          p.session_multiplier && p.session_multiplier > 1
            ? p.session_multiplier
            : null,
        total: p.total_kes || 0,
        source: p.source,
        parameter_id: p.parameter_id,
        // Edit metadata — drives which editor a row shows while the budget
        // is editable (manual units/days vs. an auto-calculated override).
        is_auto_calculated: !!p.is_auto_calculated,
        is_special_cost: !!p.is_special_cost,
        override_value: p.override_value == null ? null : Number(p.override_value),
      })),
    })),
    can_approve: !!review.can_approve,
    can_review: !!review.can_review,
    can_refer_back: !!review.can_refer_back,
    // Pre-approval editing window (Finance Officer / Program Accountant).
    // False once the budget is approved — the row is then read-only.
    can_edit: !!review.can_edit,
    history: review.history || [],
    dnmp_review: d.dnmp_review || null,
  };
};

export default {
  name: 'NationalBudgetReview',
  components: { Main, RecordViewWrapper, BudgetPageWrapper, BudgetStagePipeline },
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

    /* Final national approval (Finance Officer). A confirmation modal that
     * surfaces the DNMP Accountant's review comments before signing off —
     * applies to both the standard and Special Area Cost budgets. */
    const approveModal = ref(false);

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
          // The county's own Special Area Cost budget is a separate record.
          const csacMatch = c.sac_budget && stageMatches(c.sac_budget.stage);
          const scMatch = (c.sub_counties || []).some(
            (sc) =>
              (sc.budget && stageMatches(sc.budget.stage)) ||
              (sc.sac_budget && stageMatches(sc.sac_budget.stage)),
          );
          return cbMatch || csacMatch || scMatch;
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
        list = list.filter(
          (sc) =>
            (sc.budget && stageMatches(sc.budget.stage)) ||
            (sc.sac_budget && stageMatches(sc.sac_budget.stage)),
        );
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

    /* County-level SPECIAL AREA COST tile visibility on level 2. This is a
     * distinct record from the county standard budget; it is shown whenever a
     * SAC budget exists for the county (subject to the stage filter). */
    const countySacTileVisible = computed(() => {
      if (!selectedCounty.value) return false;
      if (filterSubCountyId.value) return false;
      const sac = selectedCounty.value.sac_budget;
      if (!sac) return false;
      if (filterStage.value) {
        return stageMatches(sac.stage);
      }
      return true;
    });

    /* Compact count message shown beside the Reset button. */
    const filteredCountResult = computed(() => {
      if (selectedCounty.value) {
        const n =
          filteredSubCounties.value.length +
          (countyBudgetTileVisible.value ? 1 : 0) +
          (countySacTileVisible.value ? 1 : 0);
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
      { title: 'Multiplier', key: 'multiplier', align: 'right', width: 120 },
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

    /* Open the approval confirmation. Guards against a missing budget id so the
     * modal never opens in an unusable state. */
    const openApproveModal = () => {
      if (!selectedBudget.value || !selectedBudget.value.id) {
        notification.error({ message: 'Cannot approve: missing budget id.' });
        return;
      }
      approveModal.value = true;
    };

    /* Confirm handler — runs the actual approval, keeping the modal open (with
     * its loading state) until the request settles. */
    const confirmApprove = async () => {
      await approveBudget(selectedBudget.value);
      approveModal.value = false;
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
    /* ────────── Pre-approval line-item editing ──────────
     * The Finance Officer / Program Accountant may correct county & sub-county
     * budget figures at any stage BEFORE final approval. Once approved the
     * backend returns can_edit=false and the table stays read-only. Edits are
     * saved per row via update_budget_line_item. */
    const canEditBudget = computed(() =>
      hasRoleByName(['Super Admin', 'Finance Officer', 'Program Accountant']).value,
    );
    const canEditSelected = computed(() =>
      !!(selectedBudget.value && selectedBudget.value.can_edit && canEditBudget.value),
    );

    const editing = ref(false);
    const savingEdits = ref(false);
    // Snapshot of editable values when edit mode opens, so we can detect
    // changed rows and restore them on cancel.
    const editSnapshot = ref({});

    const editableItems = computed(() => {
      const b = selectedBudget.value;
      if (!b) return [];
      return (b.categories || []).flatMap((cat) => cat.items || []);
    });

    const beginEdit = () => {
      const snap = {};
      editableItems.value.forEach((it) => {
        snap[it.line_item_id] = {
          units: it.units,
          days: it.days,
          override_value: it.override_value,
        };
      });
      editSnapshot.value = snap;
      editing.value = true;
    };

    const cancelEdit = () => {
      editableItems.value.forEach((it) => {
        const s = editSnapshot.value[it.line_item_id];
        if (!s) return;
        it.units = s.units;
        it.days = s.days;
        it.override_value = s.override_value;
      });
      editing.value = false;
    };

    // The payload each row type accepts (mirrors BudgetLineItemController):
    //   SAC rows    → unit_count
    //   auto rows   → override_value
    //   manual rows → unit_count + number_of_days
    const rowPayload = (it) => {
      if (it.is_special_cost) return { unit_count: it.units };
      if (it.is_auto_calculated) return { override_value: it.override_value };
      return { unit_count: it.units, number_of_days: it.days };
    };

    const norm = (v) => (v == null || v === '' ? null : Number(v));

    const isRowDirty = (it) => {
      const s = editSnapshot.value[it.line_item_id];
      if (!s) return false;
      if (it.is_auto_calculated) return norm(it.override_value) !== norm(s.override_value);
      if (it.is_special_cost) return norm(it.units) !== norm(s.units);
      return norm(it.units) !== norm(s.units) || norm(it.days) !== norm(s.days);
    };

    const dirtyEditCount = computed(() => editableItems.value.filter(isRowDirty).length);

    const saveEdits = async () => {
      const b = selectedBudget.value;
      const rid = b && b.id;
      if (!rid) return;

      const dirty = editableItems.value.filter(isRowDirty);
      if (!dirty.length) {
        editing.value = false;
        return;
      }

      savingEdits.value = true;
      try {
        for (const it of dirty) {
          if (!it.line_item_id) continue;
          // eslint-disable-next-line no-await-in-loop
          await axios.put(`update_budget_line_item/${rid}/${it.line_item_id}`, rowPayload(it));
        }
        notification.success({
          message: `Saved ${dirty.length} edit${dirty.length === 1 ? '' : 's'}.`,
        });
        editing.value = false;
        // Reload so totals & category subtotals reflect the recalculated figures.
        await fetchBudgetDetail(rid);
        await fetchCounties();
      } catch (err) {
        notification.error({
          message: 'Failed to save edits',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        savingEdits.value = false;
      }
    };

    /* Columns: add the Override column only while editing so the read-only
     * review view keeps its original six-column layout. */
    const showEditColumns = computed(() => editing.value && canEditSelected.value);
    const tableColumns = computed(() => {
      const cols = [...itemColumns];
      if (showEditColumns.value) {
        cols.splice(cols.length - 1, 0, {
          title: 'Override',
          key: 'override',
          align: 'right',
          width: 140,
        });
      }
      return cols;
    });

    /* ────────── Stage pipeline (where each budget sits) ──────────
     * Reviewers need the whole pre-approval journey at a glance, not just the
     * budgets already sitting on their desk. */

    /**
     * The status at which the ACTING user reviews / approves, per budget type.
     * Drives the accented "YOU" step in BudgetStagePipeline.
     *   • Finance Officer / Super Admin → dnmp_reviewed (final approval)
     *   • Accountant / Super Admin      → submitted (county + SAC) or
     *                                     county_approved (sub-county)
     *   • Program Accountant            → null (edits any pre-approval stage)
     */
    const myActionStatus = (isSubCounty, isSpecialArea) => {
      if (canApprove.value) return 'dnmp_reviewed';
      if (canReview.value) {
        return (!isSpecialArea && isSubCounty) ? 'county_approved' : 'submitted';
      }
      return null;
    };

    // Ordered review-pipeline buckets, keyed by the backend's stage label so
    // every budget lands in exactly one bucket regardless of level / SAC type.
    const STAGE_BUCKETS = [
      { label: 'Preparatory Stage',         short: 'Preparatory' },
      { label: 'County Review',             short: 'County Review' },
      { label: 'County Approved',           short: 'County Approved' },
      { label: 'Pending DNMP Review',       short: 'DNMP Review' },
      { label: 'Pending National Approval', short: 'National Approval' },
      { label: 'National Approved',         short: 'Approved' },
    ];

    /** Counts of every budget at each stage, across all counties. */
    const stageSummary = computed(() => {
      const counts = {};
      STAGE_BUCKETS.forEach((b) => { counts[b.label] = 0; });

      const bump = (b) => {
        if (b && b.stage && counts[b.stage] !== undefined) counts[b.stage] += 1;
      };

      counties.value.forEach((c) => {
        bump(c.county_budget);
        bump(c.sac_budget);
        (c.sub_counties || []).forEach((sc) => {
          bump(sc.budget);
          bump(sc.sac_budget);
        });
      });

      return STAGE_BUCKETS.map((b) => ({ ...b, count: counts[b.label] }));
    });

    const stageSummaryTotal = computed(() =>
      stageSummary.value.reduce((a, b) => a + b.count, 0),
    );

    /**
     * Stage labels where the acting role must act next — highlighted in the
     * summary strip so a reviewer can see what is queued for them.
     */
    const myActionStages = computed(() => {
      if (canApprove.value) return ['Pending National Approval'];
      if (canReview.value) return ['County Approved', 'Pending DNMP Review'];
      return [];
    });

    /**
     * The Program Accountant neither reviews nor approves — the whole
     * pre-approval window is editable for them. Surfaced separately so it can
     * be styled distinctly from the review/approve "awaiting you" stages.
     */
    const myEditableStages = computed(() => {
      if (canApprove.value || canReview.value) return [];
      if (canEditBudget.value) {
        return STAGE_BUCKETS
          .map((b) => b.label)
          .filter((label) => label !== 'National Approved');
      }
      return [];
    });

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
      tableColumns,
      showEditColumns,
      canEditSelected,
      editing,
      savingEdits,
      dirtyEditCount,
      isRowDirty,
      beginEdit,
      cancelEdit,
      saveEdits,
      /* stage pipeline */
      myActionStatus,
      stageSummary,
      stageSummaryTotal,
      myActionStages,
      myEditableStages,
      openCounty,
      openCountyBudget,
      openSubCountyBudget,
      openSacBudget,
      goCounties,
      goCountyBudgets,
      approving,
      approveBudget,
      approveModal,
      openApproveModal,
      confirmApprove,
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
      countySacTileVisible,
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
  .dc-meta-label {
    font-weight: 700;
    color: #4d8a63;
    margin-right: 4px;
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
    .cat-multiplier {
      background: #fff4e5;
      color: #b45309;
      border: 1px solid #fcd9a8;
      font-size: 10px;
      border-radius: 10px;
      padding: 1px 8px;
      font-weight: 600;
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
  .row-multiplier { color: #b45309; font-weight: 600; }
  /* Pre-approval inline editors (Finance Officer / Program Accountant) */
  .nbr-edit-input { width: 92px; }
  .nbr-dirty-tag { margin-left: 6px; font-size: 10px; line-height: 16px; }
}

/* Pre-approval edit-mode hint */
.nbr-edit-banner {
  margin: 12px 0 0;
  padding: 8px 14px;
  border-radius: 8px;
  background: #fff8e6;
  border: 1px solid #f0d48a;
  color: #8a6100;
  font-size: 12px;
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
/* ───────── Stage pipeline visuals ───────── */

/* At-a-glance bucket strip (Level 1) */
.stage-summary {
  background: #fff;
  border: 1px solid #e6efe9;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 18px;
  box-shadow: 0 2px 10px rgba(21, 105, 60, 0.05);
}
.ss-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #2f3a35;
  margin-bottom: 12px;
}
.ss-icon { color: #15693c; }
.ss-track { display: flex; gap: 8px; overflow-x: auto; }
.ss-bucket {
  flex: 1 1 0;
  min-width: 120px;
  border: 1px solid #e9edf2;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fafbfc;
}
.ss-bucket.is-empty { opacity: 0.5; }
.ss-bucket.is-mine {
  border-color: #2C99FF;
  background: #f2f9ff;
  box-shadow: 0 0 0 3px rgba(44, 153, 255, 0.1);
}
.ss-bucket.is-editable {
  border-color: #f0bb5a;
  background: #fffaf0;
}
.ss-you--editable { color: #8a6100; background: #fdf1d6; }
.ss-count { font-size: 22px; font-weight: 800; color: #272B41; line-height: 1; }
.ss-bucket.is-mine .ss-count { color: #2C99FF; }
.ss-label {
  margin-top: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #9299b8;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.ss-bucket.is-mine .ss-label { color: #2C99FF; }
.ss-you {
  margin-top: 6px;
  display: inline-block;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #2C99FF;
  background: #eaf5ff;
  border-radius: 6px;
  padding: 1px 6px;
}

/* Pipeline inside a grid tile */
.dc-pipeline {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed #eef1f5;
}

/* Detail-level pipeline */
.detail-stage-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.detail-stage-hint { font-size: 11px; color: #9299b8; }
.detail-pipeline {
  background: #fff;
  border: 1px solid #e6efe9;
  border-radius: 12px;
  padding: 14px 18px;
  margin: 12px 0 18px;
  box-shadow: 0 2px 10px rgba(21, 105, 60, 0.05);
}
</style>
