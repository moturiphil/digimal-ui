<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="bp-min">
        <!-- Header -->
        <header class="bp-head">
          <div class="bh-left">
            <h3 class="bp-title">
              {{ isBaringo ? 'Baringo National Oversight Budget' : 'National Budget' }}
            </h3>
            <p class="bp-sub">
              {{ isBaringo
                ? 'The Baringo oversight team — 2 county coordinators, 2 sub-county coordinators, 1 accountant and 4 drivers across 28 days (10 + 10 + 8).'
                : 'National oversight for every county except Baringo. Expand a category to set the Units and No. of Days, then submit for approval.' }}
            </p>
          </div>
          <span class="header-tags">
            <a-tag v-if="budgetFinancialYear" class="fy-tag">FY {{ budgetFinancialYear }}</a-tag>
            <a-tag class="stage-tag">{{ stageLabel }}</a-tag>
          </span>
        </header>

        <!-- Two SEPARATE national budget records (national + Baringo). Each
             shows its own status and total, so the two never blur together. -->
        <nav v-if="hasAnyBudget" class="type-switch" aria-label="National budget selector">
          <button
            v-for="opt in typeOptions"
            :key="opt.value"
            type="button"
            :class="['ts-opt', { active: activeType === opt.value, absent: !opt.exists }]"
            :aria-pressed="activeType === opt.value"
            @click="activeType = opt.value"
          >
            <span class="ts-top">
              <span class="ts-label">{{ opt.label }}</span>
              <span v-if="opt.exists" :class="['ts-status', opt.status]" />
            </span>
            <span class="ts-meta">{{ opt.meta }}</span>
          </button>
        </nav>

        <!-- No national profile -->
        <section v-if="profileError" class="panel center muted bp-error">
          {{ profileError }}
        </section>

        <!-- Loading -->
        <section v-else-if="loading" class="panel bp-skeleton-panel">
          <a-skeleton-input style="width: 55%; margin-bottom: 14px" active />
          <a-skeleton active :paragraph="{ rows: 3 }" />
          <a-skeleton active :paragraph="{ rows: 3 }" />
        </section>

        <template v-else>
          <!-- Status card (shown once the budget leaves draft) -->
          <section v-if="showStatusCard" class="panel" style="padding: 0; border: 0; background: transparent;">
            <BudgetStatusCard
              title="National Budget"
              :status="budgetStatus"
              :is-sub-county="false"
              :is-national="true"
              :financial-year="budgetFinancialYear"
              :grand-total="budget && budget.grand_total"
              :submitted-at="submittedAt"
              @click="openDetail"
            />
          </section>

          <BudgetStagePipeline
            v-if="budget"
            :status="budgetStatus"
            :is-sub-county="false"
            :is-national="true"
            :action-status="actionStatus"
          />

          <!-- National review feedback (reviewer changes + approval sign-off) -->
          <BudgetReviewFeedback
            v-if="!showStatusCard && budget"
            :budget-id="budget.id"
            :status="budgetStatus"
            :can-view="canViewReviewFeedback"
          />

          <!-- Empty state: neither budget exists yet -->
          <section v-if="!hasAnyBudget" class="panel center">
            <p class="muted">
              No national budget exists yet. Generating creates <strong>both</strong>
              budgets — the national oversight budget and the separate Baringo
              budget — with one line per category and parameter. Units and No. of
              Days are then editable.
            </p>
            <sdButton
              type="primary"
              class="pill-btn"
              :disabled="!canGenerate"
              :loading="working"
              @click="generate"
            >
              Generate National Budgets
            </sdButton>
          </section>

          <!-- The other record exists but this one does not yet -->
          <section v-else-if="!budget" class="panel center">
            <p class="muted">
              The {{ isBaringo ? 'Baringo' : 'National' }} budget has not been
              generated yet.
            </p>
            <sdButton
              type="primary"
              class="pill-btn"
              :disabled="!canGenerate"
              :loading="working"
              @click="generate"
            >
              Generate {{ isBaringo ? 'Baringo' : 'National' }} Budget
            </sdButton>
          </section>

          <!-- Summary bar -->
          <div v-if="showWorkspace" class="bp-summary">
            <div class="bp-totals">
              <div>
                <span class="lbl">Grand total</span>
                <strong class="money">KES {{ fmtMoney(grandTotal) }}</strong>
              </div>
              <div>
                <span class="lbl">Categories</span>
                <strong>{{ categories.length }}</strong>
              </div>
              <div>
                <span class="lbl">Lines filled</span>
                <strong :class="{ warn: filledCount < lineCount }">{{ filledCount }} / {{ lineCount }}</strong>
              </div>
              <div v-if="dirtyCount">
                <span class="lbl">Unsaved</span>
                <strong class="warn">{{ dirtyCount }}</strong>
              </div>
            </div>
            <div class="bp-tools">
              <a-input
                v-model:value="searchTerm"
                size="small"
                placeholder="Search categories or items…"
                allow-clear
                class="bp-search"
              />
              <sdButton size="small" class="pill-btn" @click="expandAll">Expand all</sdButton>
              <sdButton size="small" class="pill-btn" @click="collapseAll">Collapse all</sdButton>
            </div>
          </div>

          <!-- Stage strip: one tile per stage so the three subtotals are
               readable without scrolling the whole grid. -->
          <section v-if="showWorkspace" class="stage-strip">
            <div v-for="st in stages" :key="st.stage" class="ss-tile">
              <span class="ss-no">Stage {{ st.stage }}</span>
              <span class="ss-name">{{ st.label }}</span>
              <span class="ss-total">KES {{ fmtMoney(st.total) }}</span>
              <span class="ss-meta">
                {{ st.categories.length }} {{ st.categories.length === 1 ? 'category' : 'categories' }}
                · {{ st.lineCount }} {{ st.lineCount === 1 ? 'line' : 'lines' }}
              </span>
            </div>
          </section>

          <!-- Empty search -->
          <section
            v-if="showWorkspace && !filteredStages.length"
            class="panel center muted"
          >
            No matches for “{{ searchTerm }}”.
            <a href="#" @click.prevent="searchTerm = ''">Clear</a>
          </section>

          <!-- Stage 1 / 2 / 3 -->
          <section v-for="st in filteredStages" :key="st.stage" class="stage-block">
            <div class="stage-head">
              <span class="sh-badge">{{ st.stage }}</span>
              <div class="sh-copy">
                <span class="sh-name">{{ st.label }}</span>
                <span class="sh-count">
                  {{ st.categories.length }} {{ st.categories.length === 1 ? 'category' : 'categories' }}
                  · {{ st.lineCount }} {{ st.lineCount === 1 ? 'line' : 'lines' }}
                </span>
              </div>
              <div class="sh-right">
                <span class="sh-lbl">Stage total</span>
                <span class="sh-total">KES {{ fmtMoney(st.total) }}</span>
              </div>
            </div>

            <!-- Category panels -->
            <section
              v-for="c in st.categories"
              :key="c.id"
              :class="['panel', 'act', { dirty: c.dirty }]"
            >
              <div
                class="act-head"
                role="button"
                tabindex="0"
                @click="toggleCategory(c.id)"
                @keydown.enter.prevent="toggleCategory(c.id)"
                @keydown.space.prevent="toggleCategory(c.id)"
              >
                <div class="act-name">
                  <span :class="['caret', { open: c.expanded }]" aria-hidden="true">▸</span>
                  <span class="at-name">{{ c.order }}. {{ c.name }}</span>
                  <a-tag class="type-tag">{{ c.type === 'event' ? 'Event' : 'Activity' }}</a-tag>
                  <a-tag v-if="c.unsetCount" class="unset-tag">
                    {{ c.unsetCount }} not set
                  </a-tag>
                  <a-tag v-if="c.dirty" class="dirty-tag">Unsaved</a-tag>
                  <!-- The category's multiplier, straight from the Budget
                       Categories configuration. Flagged when the generated
                       rows have not been re-priced with it yet. -->
                  <a-tag
                    v-if="c.multiplierDisplay"
                    class="multiplier-tag"
                    :class="{ 'is-pending': c.multiplierPending }"
                    :title="c.multiplierPending
                      ? 'The rows in this category were generated before this multiplier was set, so the totals below do not include it yet — use ↻ Refresh from categories.'
                      : 'Every line in this category is multiplied by this value.'"
                  >
                    {{ c.multiplierDisplay }}
                  </a-tag>
                  <a-tag
                    v-if="c.multiplierPending"
                    class="multiplier-pending-tag"
                    title="Use ↻ Refresh from categories to apply it."
                  >
                    not applied yet
                  </a-tag>
                </div>
                <div class="act-total">KES {{ fmtMoney(c.total) }}</div>
              </div>

              <a-table
                v-show="c.expanded"
                :dataSource="c.items"
                :columns="itemColumns"
                :pagination="false"
                row-key="id"
                size="small"
                class="minimal-table activity-table"
                :row-class-name="rowClass"
              >
                <template #bodyCell="{ column, record }">
                  <span v-if="column.key === 'item'" class="desc-cell">
                    {{ record.label }}
                    <a-tag v-if="record.unit_definition" class="row-tag">{{ record.unit_definition }}</a-tag>
                    <a-tag v-if="!record._units" class="source-tag not_set">Not set</a-tag>
                  </span>
                  <span v-else-if="column.key === 'unit_cost'" class="money-cell">{{ fmtMoney(record.unit_cost) }}</span>
                  <span v-else-if="column.key === 'days'">
                    <a-input-number
                      v-if="canEdit"
                      v-model:value="record._days"
                      :min="1"
                      size="small"
                      class="units-input"
                    />
                    <span v-else>{{ record._days }}</span>
                  </span>
                  <span v-else-if="column.key === 'units'">
                    <a-input-number
                      v-if="canEdit"
                      v-model:value="record._units"
                      :min="0"
                      size="small"
                      class="units-input"
                    />
                    <span v-else>{{ fmt(record._units) }}</span>
                  </span>
                  <span v-else-if="column.key === 'multiplier'" class="multiplier-cell">
                    <span v-if="record._multiplier > 1" class="multiplier-on">
                      × {{ record._multiplier }}
                    </span>
                    <span v-else class="multiplier-off">—</span>
                  </span>
                  <span v-else-if="column.key === 'total'" class="total-cell">{{ fmtMoney(rowTotal(record)) }}</span>
                </template>
              </a-table>

              <div class="act-foot" v-show="c.expanded && canEdit">
                <sdButton
                  size="small"
                  :class="['pill-btn', 'save-btn', { 'is-dirty': c.dirty }]"
                  :loading="savingCategoryId === c.id"
                  @click="promptSave(c)"
                >
                  Save category
                </sdButton>
              </div>
            </section>
          </section>

          <!-- Zero-unit warning: national parameters carry no profile field, so
               Units start at 0 and a freshly generated budget reads KES 0 until
               the officer fills them in. -->
          <section v-if="showWorkspace && zeroUnitCount" class="panel zero-warning">
            <span class="zw-text">
              <strong>{{ zeroUnitCount }} {{ zeroUnitCount === 1 ? 'line has' : 'lines have' }} no units</strong>
              yet, so {{ zeroUnitCount === 1 ? 'its' : 'their' }} total reads KES 0.
              Set the units before submitting.
            </span>
            <sdButton size="small" class="pill-btn" @click="revealUnset">Review</sdButton>
          </section>

          <!-- Actions -->
          <section v-if="budget && !showStatusCard" class="panel action-row">
            <div class="ar-status">
              <a-tag v-if="!canEdit" color="purple">View only</a-tag>
              <a-tag v-else-if="budgetStatus === 'submitted'" color="blue">
                Submitted — awaiting review by the Accountant / Program Accountant / Finance Officer
              </a-tag>
              <a-tag v-else-if="budgetStatus === 'national_approved'" color="geekblue">
                Reviewed — awaiting AIE Holder acknowledgement
              </a-tag>
              <span v-else class="ar-hint">
                Changing a figure requires a comment — it is recorded in the
                immutable audit trail with your name, role and the time.
              </span>
            </div>

            <sdButton
              v-if="canEdit"
              size="small"
              class="pill-btn sync-btn"
              :loading="syncing"
              title="Bring this budget in line with the Budget Categories configuration: adds rows for newly created categories / linked parameters, and re-applies changed category multipliers. Entered Units and No. of Days are left untouched."
              @click="syncCategories"
            >
              ↻ Refresh from categories
            </sdButton>

            <sdButton
              v-if="canEdit && budgetStatus === 'draft'"
              type="primary"
              class="pill-btn submit-btn"
              :disabled="dirtyCount > 0 || !lineItems.length"
              :loading="working"
              @click="submit"
            >
              Submit for Approval
            </sdButton>

            <!-- REVIEW — the DNMP Accountant / Program Accountant / Finance
                 Officer sign the submitted budget off (submitted →
                 national_approved). The AIE Holder acknowledges it afterwards,
                 on the National Budget Acknowledgement page. -->
            <sdButton
              v-if="canReviewBudget"
              type="success"
              class="pill-btn review-btn"
              :disabled="dirtyCount > 0"
              :loading="reviewing"
              title="Sign this national budget off. It then goes to the AIE Holder for acknowledgement."
              @click="reviewBudget"
            >
              Mark as Reviewed
            </sdButton>
          </section>

          <!-- Comment modal (mandatory on a figure change) -->
          <a-modal
            v-model:visible="commentModal"
            :title="`Comment required — ${pendingCategory ? pendingCategory.name : ''}`"
            ok-text="Save changes"
            :confirm-loading="savingCategoryId !== null"
            @ok="confirmSave"
          >
            <p class="modal-lede">
              {{ pendingChanges.length }}
              {{ pendingChanges.length === 1 ? 'line' : 'lines' }} will change.
              Give one reason — it is recorded against every changed figure.
            </p>
            <ul class="change-list">
              <li v-for="ch in pendingChanges" :key="ch.id">
                <span class="cl-label">{{ ch.label }}</span>
                <span class="cl-change">
                  Units <b>{{ ch.fromUnits }}</b> → <b class="to">{{ ch.toUnits }}</b>
                  <span class="cl-sep">·</span>
                  Days <b>{{ ch.fromDays }}</b> → <b class="to">{{ ch.toDays }}</b>
                </span>
              </li>
            </ul>
            <a-textarea
              v-model:value="pendingComment"
              :rows="3"
              placeholder="Reason for the change (required)"
            />
          </a-modal>
        </template>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
/**
 * NATIONAL budget workspace.
 *
 * Presents the national oversight budget the same way the County / Sub-County
 * budgeting pages do — one collapsible panel per CATEGORY, each listing the
 * parameters mapped to it — but grouped into STAGE 1, 2 and 3, because the
 * national categories are stage-scoped activities and events.
 *
 * Approval chain:
 *   draft → submitted (PREPARERS: Vector Unit Head | DNMP Program Officer)
 *         → national_approved (REVIEWERS: DNMP Accountant | Program Accountant |
 *                              Finance Officer)
 *         → approved (AIE Holder review & acknowledgement)
 *
 * `get_budget_line_items/{id}` returns the rows GROUPED BY CATEGORY:
 *   { budget_id, grand_total, line_items: { "<category_id>": [row, …] } }
 * so the payload is flattened, then re-grouped for display.
 *
 * Units and No. of Days are editable per line. Saving a category writes every
 * changed line through `update_budget_line_item`, which requires a comment and
 * records the immutable audit row (who / role / when).
 */
import { computed, onMounted, ref, watch } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';
import BudgetStatusCard from './BudgetStatusCard.vue';
import BudgetStagePipeline from './BudgetStagePipeline.vue';
import BudgetReviewFeedback from './BudgetReviewFeedback.vue';
import { hasPermission, hasRoleByName } from '@/services/user-role';

/**
 * Roles that may PREPARE the national budget — create it, generate the rows,
 * edit Units / No. of Days and submit it. The Accountant / Program Accountant /
 * Finance Officer REVIEW it afterwards, so they are deliberately not here.
 */
const GENERATOR_ROLES = [
  'Vector Unit Head',
  'Program officer - DNMP',
  'Super Admin',
];

/**
 * Roles that may REVIEW the submitted national budget — correct figures while
 * it is `submitted` or `national_approved`. Mirrors
 * BudgetEditAccessService::EDITOR_ROLES.
 */
const REVIEWER_ROLES = [
  'Accountant',
  'Program Accountant',
  'Finance Officer',
  'Super Admin',
];

/** Stage labels — mirror CampaignBudgetController::totalsByStage(). */
const STAGE_LABELS = {
  '1': 'Stage 1',
  '2': 'Stage 2',
  '3': 'Stage 3',
};

/** Short status wording for the National / Baringo switch tiles. */
const STATUS_SHORT = {
  draft: 'Draft',
  submitted: 'Submitted',
  national_approved: 'Approved',
  approved: 'Acknowledged',
  voided: 'Voided',
};

/**
 * The two SEPARATE national budget records (campaign_budgets.budget_type):
 * the main national budget and the Baringo national oversight budget.
 */
const TYPE_STANDARD = 'standard';
const TYPE_BARINGO = 'national_baringo';
const NATIONAL_TYPES = [TYPE_STANDARD, TYPE_BARINGO];

export default {
  name: 'NationalBudgeting',
  components: {
    Main,
    RecordViewWrapper,
    BudgetPageWrapper,
    BudgetStatusCard,
    BudgetStagePipeline,
    BudgetReviewFeedback,
  },
  setup() {
    const loading = ref(false);
    const working = ref(false);
    // ADDITIVE "Sync categories" action in flight.
    const syncing = ref(false);

    const profileError = ref(null);
    const countyProfileId = ref(null);

    // Two separate national budget records, keyed by budget_type, plus the
    // line items and the "user opened the detail" flag for each.
    const activeType = ref(TYPE_STANDARD);
    const budgets = ref({});
    const lineItemsByType = ref({});
    const detailOpen = ref({});

    const searchTerm = ref('');
    const expandedIds = ref([]);

    const budget = computed(() => budgets.value[activeType.value] || null);
    const budgetStatus = computed(() => (budget.value && budget.value.status) || null);
    const lineItems = computed(() => lineItemsByType.value[activeType.value] || []);
    const hasAnyBudget = computed(() => NATIONAL_TYPES.some((t) => !!budgets.value[t]));

    /** The status card is shown once a budget leaves draft, until opened. */
    const showStatusCard = computed(
      () => !!budget.value
        && budget.value.status !== 'draft'
        && !detailOpen.value[activeType.value],
    );

    const isBaringo = computed(() => activeType.value === TYPE_BARINGO);

    /** The editable grid is on screen (draft opened, categories present). */
    const showWorkspace = computed(
      () => !!budget.value && !showStatusCard.value && lineItems.value.length > 0,
    );

    const savingCategoryId = ref(null);
    const commentModal = ref(false);
    const pendingCategory = ref(null);
    const pendingChanges = ref([]);
    const pendingComment = ref('');

    const canGenerate = hasPermission('create_campaign_budget');
    const canViewReviewFeedback = hasPermission('get_budget_review_feedback');

    const isGenerator = hasRoleByName(GENERATOR_ROLES);
    const isReviewer = hasRoleByName(REVIEWER_ROLES);

    /**
     * Editing is gated server-side too (BudgetEditAccessService): the PREPARERS
     * own the draft, the REVIEWERS own the submitted window.
     */
    const canEdit = computed(() => {
      if (budgetStatus.value === 'draft') return isGenerator.value;
      if (['submitted', 'national_approved'].includes(budgetStatus.value)) return isReviewer.value;
      return false;
    });

    /**
     * The REVIEW action (`submitted` → `national_approved`) is offered to the
     * reviewers only, and only while the budget is actually awaiting review.
     */
    const canReviewBudget = computed(
      () => isReviewer.value && budgetStatus.value === 'submitted',
    );

    const itemColumns = [
      { title: 'Budget Item', key: 'item' },
      { title: 'Unit Cost', key: 'unit_cost', align: 'right', width: 120 },
      { title: 'No. of Days', key: 'days', align: 'right', width: 130 },
      { title: 'Units', key: 'units', align: 'right', width: 130 },
      { title: 'Multiplier', key: 'multiplier', align: 'right', width: 110 },
      { title: 'Total (KES)', key: 'total', align: 'right', width: 150 },
    ];

    const stageLabel = computed(() => {
      const map = {
        draft: 'Preparatory Stage',
        submitted: 'Pending Review (Accountant / Program Accountant / Finance Officer)',
        national_approved: 'Reviewed (Accountant / Program Accountant / Finance Officer)',
        approved: 'Acknowledged by AIE Holder',
        voided: 'Voided',
      };
      return map[budgetStatus.value] || 'National Budget';
    });

    /** The stage at which the acting role acts — accented in the pipeline. */
    const actionStatus = computed(() => {
      if (!canEdit.value) return null;
      if (budgetStatus.value === 'submitted') return 'submitted';
      if (budgetStatus.value === 'national_approved') return 'national_approved';
      return null;
    });

    const submittedAt = computed(() => (budget.value && budget.value.submitted_at) || null);
    const budgetFinancialYear = computed(() => (budget.value && budget.value.financial_year) || null);

    const fmt = (v) => {
      const n = Number(v) || 0;
      return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    /**
     * Money with a fixed two decimals so the columns and totals line up —
     * `fmt()` drops trailing zeros, which reads untidily in a financial grid
     * (961,075.8 next to 256,286.88).
     */
    const fmtMoney = (v) => {
      const n = Number(v) || 0;
      return n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    /**
     * A line's cost. Mirrors BudgetCalculationService / BudgetLineItem:
     *   unit_cost × number_of_days × unit_count × session_multiplier
     *
     * The multiplier comes from the category (an explicit value set on the
     * Budget Categories page, or a county-profile column) and is stored on each
     * line at generation time — so it must be included here or the grid would
     * disagree with the persisted total.
     */
    const rowTotal = (row) =>
      (Number(row.unit_cost) || 0)
      * (Number(row._days) || 0)
      * (Number(row._units) || 0)
      * (Number(row._multiplier) || 1);

    const grandTotal = computed(() =>
      lineItems.value.reduce((sum, row) => sum + rowTotal(row), 0),
    );

    /**
     * True when either editable figure differs from the value the row was loaded
     * — or last saved — with.
     *
     * Dirtiness is DERIVED, not tracked with a change event, and that matters:
     * `a-input-number` only emits `change` on blur / Enter. A flag set there left
     * the Save button disabled while the input still had focus, so clicking Save
     * did nothing, the input never blurred, the flag never flipped, and the edit
     * could never be persisted. Comparing against the baseline updates on every
     * keystroke instead.
     */
    const isRowDirty = (row) =>
      Number(row._days) !== Number(row._originalDays)
      || Number(row._units) !== Number(row._originalUnits);

    const dirtyCount = computed(() => lineItems.value.filter(isRowDirty).length);

    /** Total lines, and how many of them carry a unit count. */
    const lineCount = computed(() => lineItems.value.length);
    const filledCount = computed(() => lineItems.value.filter((r) => !!r._units).length);

    /**
     * Lines still at 0 units. National parameters carry no profile field, so
     * Units are entered by hand and a freshly generated budget reads KES 0
     * until the officer fills them in — this drives the warning banner.
     */
    const zeroUnitCount = computed(() => lineItems.value.filter((r) => !r._units).length);

    /** Tint lines with no units so they stand out in the table. */
    const rowClass = (record) => (!record._units ? 'row-zero' : '');

    /**
     * The two national budget records as switch tiles. Each shows its OWN
     * status and total, so the separate Baringo entity never blurs into the
     * national budget.
     */
    const typeOptions = computed(() =>
      NATIONAL_TYPES.map((type) => {
        const b = budgets.value[type];
        const exists = !!b && b.status !== 'voided';

        return {
          value: type,
          label: type === TYPE_BARINGO ? 'Baringo' : 'National',
          exists,
          status: exists ? b.status : null,
          meta: exists
            ? `${STATUS_SHORT[b.status] || b.status} · KES ${fmtMoney(b.grand_total || 0)}`
            : 'Not generated yet',
        };
      }),
    );

    /**
     * Group the flat line items back into CATEGORIES, preserving each
     * category's own display order, and attach the per-category roll-up and UI
     * state (expanded / dirty / total).
     */
    const categories = computed(() => {
      const map = new Map();

      lineItems.value.forEach((row) => {
        const key = row.category_id;

        if (!map.has(key)) {
          map.set(key, {
            id: key,
            name: row.category_name,
            type: row.category_type,
            stage: row.category_stage,
            sort_order: row.category_sort_order,
            items: [],
          });
        }

        map.get(key).items.push(row);
      });

      return [...map.values()]
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((c, i) => {
          // Multiplier state for the header: what the Budget Categories page
          // says (configured) vs what the generated rows actually carry
          // (applied). A mismatch means the rows were generated before the
          // multiplier was set, so the totals below do not include it yet.
          const first = c.items[0] || {};
          const configured = Number(first.category_multiplier_value) || null;
          const label = first.category_multiplier_label
            || first.category_budget_multiplier
            || '';
          const applied = c.items.length
            ? Math.max(...c.items.map((r) => Number(r._multiplier) || 1))
            : 1;

          return {
            ...c,
            order: i + 1,
            expanded: expandedIds.value.includes(c.id),
            dirty: c.items.some(isRowDirty),
            unsetCount: c.items.filter((r) => !r._units).length,
            total: c.items.reduce((sum, r) => sum + rowTotal(r), 0),
            multiplierDisplay: configured
              ? `× ${configured}${label ? ` ${label}` : ''}`
              : null,
            multiplierPending: !!configured && configured !== applied,
          };
        });
    });

    /** Stage 1 / 2 / 3 buckets, each with its own subtotal. */
    const stages = computed(() => {
      const map = new Map();

      categories.value.forEach((c) => {
        const st = c.stage || '1';

        if (!map.has(st)) {
          map.set(st, {
            stage: st,
            label: STAGE_LABELS[st] || `Stage ${st}`,
            categories: [],
          });
        }

        map.get(st).categories.push(c);
      });

      return [...map.values()]
        .sort((a, b) => String(a.stage).localeCompare(String(b.stage)))
        .map((s) => ({
          ...s,
          total: s.categories.reduce((sum, c) => sum + c.total, 0),
          lineCount: s.categories.reduce((n, c) => n + c.items.length, 0),
        }));
    });

    const filteredStages = computed(() => {
      const term = searchTerm.value.trim().toLowerCase();
      if (!term) return stages.value;

      return stages.value
        .map((s) => ({
          ...s,
          categories: s.categories.filter(
            (c) => c.name.toLowerCase().includes(term)
              || c.items.some((r) => (r.label || '').toLowerCase().includes(term)),
          ),
        }))
        .filter((s) => s.categories.length > 0);
    });

    // ── Expand / collapse ─────────────────────────────────────────────────

    const toggleCategory = (id) => {
      expandedIds.value = expandedIds.value.includes(id)
        ? expandedIds.value.filter((x) => x !== id)
        : [...expandedIds.value, id];
    };

    const expandAll = () => {
      expandedIds.value = categories.value.map((c) => c.id);
    };

    const collapseAll = () => {
      expandedIds.value = [];
    };

    /** Open the first category that still has lines with no units. */
    const revealUnset = () => {
      const target = categories.value.find((c) => c.unsetCount > 0);
      if (!target) return;

      if (!expandedIds.value.includes(target.id)) {
        expandedIds.value = [...expandedIds.value, target.id];
      }
    };

    // ── Data loading ──────────────────────────────────────────────────────

    /** Resolve the national county_profiles row for this (level-1) user. */
    const loadProfile = async () => {
      try {
        const { data } = await axios.get('get_my_county_profile');
        const payload = data?.data || data || {};
        countyProfileId.value = payload.county_profile_id || null;

        if (!countyProfileId.value) {
          profileError.value = 'No active national profile found. Run the NationalBudgetProfileSeeder.';
        }
      } catch (err) {
        countyProfileId.value = null;
        profileError.value = err?.response?.data?.message
          || 'No active national profile found for your account.';
      }
    };

    /**
     * `get_budget_line_items/{id}` returns the rows GROUPED BY CATEGORY:
     *
     *   { budget_id, grand_total, line_items: { "<category_id>": [row, …] } }
     *
     * so the payload must be flattened into a single list. An array shape is
     * tolerated too.
     */
    const normalizeLineItems = (payload) => {
      const body = (payload && payload.data) ? payload.data : (payload || {});
      const map = body.line_items;

      if (Array.isArray(map)) return map;

      if (map && typeof map === 'object') {
        return Object.values(map).flatMap((rows) => (Array.isArray(rows) ? rows : []));
      }

      if (Array.isArray(body.data)) return body.data;

      return Array.isArray(body) ? body : [];
    };

    /** Normalise the line-item payload into editable rows. */
    const toRows = (items) =>
      (items || [])
        .slice()
        .sort((a, b) => {
          // Keep each CATEGORY's rows together, in the category's own display
          // order, then by the row's sort_order inside it.
          const ca = (a.budget_category && a.budget_category.sort_order) || 0;
          const cb = (b.budget_category && b.budget_category.sort_order) || 0;
          if (ca !== cb) return ca - cb;

          return (a.sort_order || 0) - (b.sort_order || 0);
        })
        .map((li) => {
          const cat = li.budget_category || {};

          return {
            id: li.id,
            category_id: li.budget_category_id,
            category_name: cat.name || '—',
            category_type: cat.type || 'activity',
            category_stage: cat.stage || '1',
            category_sort_order: cat.sort_order || 0,
            label: li.label,
            unit_definition: li.unit_definition,
            unit_cost: Number(li.unit_cost) || 0,
            _days: Number(li.number_of_days) || 1,
            _units: Number(li.unit_count) || 0,
            // Category multiplier resolved at generation time (1 = none). Kept
            // so rowTotal() matches the persisted total_cost.
            _multiplier: Number(li.session_multiplier) || 1,
            // Category multiplier CONFIG (what /budget/categories says) — shown
            // in the category header and compared with the applied _multiplier
            // so a "not applied yet" state is visible instead of silent.
            category_multiplier_value: Number(cat.multiplier_value) || null,
            category_multiplier_label: cat.profile_field_label || '',
            category_budget_multiplier: cat.budget_multiplier || '',
            _originalDays: Number(li.number_of_days) || 1,
            _originalUnits: Number(li.unit_count) || 0,
          };
        });

    /**
     * Budget ids already brought in line with the category configuration, so the
     * automatic pass below runs at most once per budget per page load.
     */
    const configSynced = new Set();

    const loadLineItems = async (type, budgetId) => {
      try {
        const { data } = await axios.get(`get_budget_line_items/${budgetId}`);
        lineItemsByType.value = {
          ...lineItemsByType.value,
          [type]: toRows(normalizeLineItems(data)),
        };
      } catch (err) {
        lineItemsByType.value = { ...lineItemsByType.value, [type]: [] };
        return;
      }

      // While the budget is still a DRAFT the category configuration is the
      // source of truth, so bring the rows in line automatically: newly created
      // categories / linked parameters are added, and a changed category
      // multiplier is re-applied. Non-destructive — entered Units, No. of Days
      // and reviewer overrides are untouched — and a no-op when nothing changed.
      //
      // Deliberately limited to drafts: once the budget is submitted, the
      // multiplier-drift flag has to keep its meaning for the reviewers, so
      // re-pricing there stays a deliberate "↻ Refresh from categories" action.
      const status = (budgets.value[type] && budgets.value[type].status) || null;
      if (!canEdit.value || status !== 'draft') return;
      if (configSynced.has(budgetId)) return;

      configSynced.add(budgetId);

      try {
        const { data } = await axios.post(`sync_campaign_budget_line_items/${budgetId}`);

        const changed = Number(data?.created || 0) + Number(data?.multipliers_applied || 0);
        if (!changed) return;

        const { data: refreshed } = await axios.get(`get_budget_line_items/${budgetId}`);
        lineItemsByType.value = {
          ...lineItemsByType.value,
          [type]: toRows(normalizeLineItems(refreshed)),
        };

        if (budgets.value[type]) {
          budgets.value = {
            ...budgets.value,
            [type]: {
              ...budgets.value[type],
              grand_total: data?.grand_total ?? budgets.value[type].grand_total,
            },
          };
        }
      } catch (err) {
        // Non-fatal — the grid renders whatever is stored, and the manual
        // "↻ Refresh from categories" action is still there.
      }
    };

    /**
     * Load BOTH national budget records — the main national budget and the
     * separate Baringo budget. A draft's line items load eagerly; a past-draft
     * budget defers them until the status card is opened.
     */
    const loadBudget = async () => {
      for (const type of NATIONAL_TYPES) {
        // eslint-disable-next-line no-await-in-loop
        const { data } = await axios.get('get_campaign_budgets', {
          params: { county_profile_id: countyProfileId.value, budget_type: type },
        });

        const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const active = rows.find((b) => b.status !== 'voided') || null;

        budgets.value = { ...budgets.value, [type]: active };

        if (active && active.status === 'draft') {
          // eslint-disable-next-line no-await-in-loop
          await loadLineItems(type, active.id);
        } else {
          lineItemsByType.value = { ...lineItemsByType.value, [type]: [] };
        }
      }
    };

    const bootstrap = async () => {
      loading.value = true;
      budgets.value = {};
      lineItemsByType.value = {};
      detailOpen.value = {};
      expandedIds.value = [];
      profileError.value = null;

      try {
        await loadProfile();
        if (countyProfileId.value) {
          await loadBudget();
        }
      } catch (err) {
        // Surface the failure inline — a silent failure used to leave the page
        // with nothing but the header.
        profileError.value = err?.response?.data?.message
          || err?.message
          || 'Could not load the national budget.';

        notification.error({
          message: 'Failed to load the national budget',
          description: profileError.value,
        });
      } finally {
        loading.value = false;
      }
    };

    // ── Actions ───────────────────────────────────────────────────────────

    /**
     * Create BOTH national budgets in one action — the main national budget and
     * the separate Baringo budget — so the two stay in step. Any budget that
     * already exists (non-voided) is left untouched.
     */
    const generate = async () => {
      if (!countyProfileId.value) return;
      working.value = true;
      try {
        const created = [];

        for (const type of NATIONAL_TYPES) {
          if (budgets.value[type] && budgets.value[type].status !== 'voided') {
            continue;
          }

          // eslint-disable-next-line no-await-in-loop
          const { data } = await axios.post('create_campaign_budget', {
            county_profile_id: countyProfileId.value,
            budget_type: type,
          });

          const row = data?.data || data;

          budgets.value = { ...budgets.value, [type]: row };

          // eslint-disable-next-line no-await-in-loop
          await loadLineItems(type, row.id);

          created.push(type === TYPE_BARINGO ? 'Baringo' : 'National');
        }

        notification.success({
          message: created.length
            ? `Generated: ${created.join(' + ')}`
            : 'National budgets already exist',
          description: 'Set the Units and No. of Days per category, then submit each for approval.',
        });
      } catch (err) {
        notification.error({
          message: 'Could not generate the national budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        working.value = false;
      }
    };

    const openDetail = async () => {
      const type = activeType.value;

      detailOpen.value = { ...detailOpen.value, [type]: true };

      if (budget.value) {
        await loadLineItems(type, budget.value.id);
      }
    };

    /**
     * Bring the budget in line with the current Budget Categories configuration:
     *
     *   • adds the line items a newly created category (or a newly linked
     *     parameter) is missing — the grid renders GENERATED rows, so without
     *     this the category never appears;
     *   • re-applies a category's multiplier when it has changed (an explicit
     *     value set on the Budget Categories page, or a county-profile column) —
     *     the multiplier is snapshotted onto each row at generation time.
     *
     * Nothing an officer typed is rewritten: Units, No. of Days and any reviewer
     * override survive.
     */
    const syncCategories = async () => {
      if (!budget.value) return;

      const type = activeType.value;
      const budgetId = budget.value.id;

      syncing.value = true;
      try {
        const { data } = await axios.post(`sync_campaign_budget_line_items/${budgetId}`);

        // Reload the grid and keep the header total in step with the server.
        await loadLineItems(type, budgetId);

        if (budgets.value[type]) {
          budgets.value = {
            ...budgets.value,
            [type]: {
              ...budgets.value[type],
              grand_total: data?.grand_total ?? budgets.value[type].grand_total,
            },
          };
        }

        notification.success({
          message: 'Categories synced',
          description:
            data?.message
            || 'The budget now covers every category and parameter configured for its scope.',
        });
      } catch (err) {
        notification.error({
          message: 'Could not sync the categories',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        syncing.value = false;
      }
    };

    /** Switching tabs closes any open detail view for the other budget. */
    watch(activeType, () => {
      expandedIds.value = [];
    });

    /** Collect the changed lines of a category and ask for the comment. */
    const promptSave = (category) => {
      const changed = category.items.filter(isRowDirty);

      if (!changed.length) {
        // Reachable when the button is clicked without a pending edit — the
        // button is intentionally never disabled, so a click always reaches here
        // (and blurs the focused input, committing whatever was typed).
        notification.info({
          message: 'Nothing to save',
          description: 'No figure in this category has changed.',
        });
        return;
      }

      pendingCategory.value = category;
      pendingChanges.value = changed.map((r) => ({
        id: r.id,
        label: r.label,
        fromUnits: r._originalUnits,
        toUnits: Number(r._units),
        fromDays: r._originalDays,
        toDays: Number(r._days),
        row: r,
      }));
      pendingComment.value = '';
      commentModal.value = true;
    };

    const confirmSave = async () => {
      const category = pendingCategory.value;
      if (!category) return;

      const comment = pendingComment.value.trim();
      if (comment === '') {
        notification.warning({
          message: 'A comment is required',
          description: 'Describe why the figures are changing — it is recorded in the audit trail.',
        });
        return;
      }

      savingCategoryId.value = category.id;
      try {
        // One PUT per changed line — each writes its own immutable audit row.
        for (const ch of pendingChanges.value) {
          const row = ch.row;

          // eslint-disable-next-line no-await-in-loop
          await axios.put(`update_budget_line_item/${budget.value.id}/${row.id}`, {
            unit_count: Number(row._units),
            number_of_days: Number(row._days),
            comment,
          });

          // Moving the baseline is what clears the row's "Unsaved" state —
          // dirtiness is derived from it (see isRowDirty()).
          row._originalUnits = Number(row._units);
          row._originalDays = Number(row._days);
        }

        commentModal.value = false;
        pendingCategory.value = null;
        pendingChanges.value = [];

        notification.success({
          message: 'Category saved',
          description: category.name,
        });
      } catch (err) {
        notification.error({
          message: 'Could not save the category',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        savingCategoryId.value = null;
      }
    };

    const reviewing = ref(false);

    const submit = async () => {
      working.value = true;
      try {
        await axios.post(`submit_campaign_budget/${budget.value.id}`);
        await loadBudget();
        notification.success({
          message: 'National budget submitted',
          description: 'It is now awaiting review by the DNMP Accountant, the Program Accountant or the Finance Officer.',
        });
      } catch (err) {
        notification.error({
          message: 'Could not submit the national budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        working.value = false;
      }
    };

    /**
     * REVIEW — `submitted` → `national_approved`.
     *
     * Uses county_approve_campaign_budget, which the backend routes to the
     * national REVIEWERS (DNMP Accountant / Program Accountant / Finance
     * Officer) for a national budget — see
     * CampaignBudgetController::countyApprove().
     */
    const reviewBudget = async () => {
      reviewing.value = true;
      try {
        await axios.post(`county_approve_campaign_budget/${budget.value.id}`);
        await loadBudget();
        notification.success({
          message: 'National budget reviewed',
          description: 'It is now awaiting review and acknowledgement by the AIE Holder.',
        });
      } catch (err) {
        notification.error({
          message: 'Could not review the national budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        reviewing.value = false;
      }
    };

    onMounted(bootstrap);

    return {
      loading, working, profileError, countyProfileId, budget, budgetStatus,
      lineItems, searchTerm, showStatusCard, savingCategoryId, commentModal,
      pendingCategory, pendingChanges, pendingComment, canGenerate,
      canViewReviewFeedback, canEdit, itemColumns, stageLabel, actionStatus,
      submittedAt, budgetFinancialYear, fmt, fmtMoney, rowTotal, grandTotal, dirtyCount,
      categories, stages, filteredStages, toggleCategory, expandAll, collapseAll,
      bootstrap, generate, openDetail, promptSave, confirmSave, submit,
      // REVIEW — submitted → national_approved (the Accountant / Program
      // Accountant / Finance Officer sign the national budget off).
      reviewing, reviewBudget, canReviewBudget,
      // ADDITIVE "Sync categories" — pulls in newly configured categories /
      // parameters without rewriting the figures already entered.
      syncing, syncCategories,
      // Two separate national budget records (main national + Baringo).
      activeType, hasAnyBudget, isBaringo, showWorkspace, typeOptions,
      lineCount, filledCount, zeroUnitCount, rowClass, revealUnset,
      TYPE_STANDARD, TYPE_BARINGO,
    };
  },
};
</script>

<style lang="less" scoped>
.bp-min {
  /* ── Header ─────────────────────────────────────────────────────────── */
  .bp-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid #eef0f5;
  }
  .bh-left { min-width: 0; }
  .bp-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1f2437;
  }
  .bp-sub {
    margin: 4px 0 0;
    font-size: 12px;
    color: #7a8a82;
    max-width: 760px;
  }
  .header-tags {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .stage-tag {
    background: #eef3fb;
    color: #2f6dcf;
    border: 1px solid #d7e3f5;
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 11px;
    font-weight: 600;
  }
  .fy-tag {
    background: #e8f6ee;
    color: #15693c;
    border: 1px solid #9ad8b4;
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 11px;
    font-weight: 600;
  }

  /* ── National / Baringo switch ────────────────────────────────────────
     Two tiles, each carrying its own status dot, status word and total, so
     the separate Baringo entity never blurs into the national budget. */
  .type-switch {
    display: inline-flex;
    gap: 6px;
    padding: 5px;
    margin-bottom: 16px;
    background: #f4f7f5;
    border: 1px solid #e3ece7;
    border-radius: 12px;
  }
  .ts-opt {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    min-width: 212px;
    padding: 8px 16px;
    border: 1px solid transparent;
    border-radius: 9px;
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: background 0.16s, box-shadow 0.16s, border-color 0.16s;

    &:hover { background: #fff; border-color: #d9e6de; }
    &:focus-visible { outline: 2px solid #9ad8b4; outline-offset: 1px; }

    &.active {
      background: #fff;
      border-color: #9ad8b4;
      box-shadow: 0 2px 10px rgba(21, 105, 60, 0.12);
      .ts-label { color: #15693c; }
      .ts-meta { color: #4d8a63; }
    }
    &.absent {
      .ts-label { color: #9aa6ad; }
      .ts-meta { color: #b6bec4; font-style: italic; }
    }
  }
  .ts-top {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .ts-label {
    font-size: 13px;
    font-weight: 700;
    color: #4d5661;
  }
  .ts-status {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #c3cbd1;
    &.draft { background: #f0a13a; }
    &.submitted { background: #2f6dcf; }
    &.national_approved { background: #17a673; }
    &.approved { background: #15693c; }
  }
  .ts-meta {
    font-size: 11px;
    color: #8a9399;
    white-space: nowrap;
  }

  /* ── Summary bar ────────────────────────────────────────────────────── */
  .bp-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 14px;
    margin-bottom: 12px;
    background: #fff;
    border: 1px solid #e6ecef;
    border-radius: 10px;
  }
  .bp-totals {
    display: flex;
    gap: 26px;
    flex-wrap: wrap;
    > div {
      display: flex;
      flex-direction: column;
      .lbl {
        font-size: 10px;
        color: #9aa6ad;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        font-weight: 600;
      }
      strong {
        font-size: 13px;
        color: #15693c;
        font-weight: 800;
        &.warn { color: #d97706; }
        &.money { font-size: 15px; letter-spacing: 0.2px; }
      }
    }
  }
  .bp-tools {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    .bp-search { width: 220px; }
  }

  /* ── Stage strip: the three subtotals at a glance ───────────────────── */
  .stage-strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 10px;
    margin-bottom: 6px;
  }
  .ss-tile {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 14px;
    border-radius: 10px;
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-left: 4px solid #1f9254;
  }
  .ss-no {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #4d8a63;
  }
  .ss-name {
    font-size: 12px;
    font-weight: 600;
    color: #2f6746;
  }
  .ss-total {
    font-size: 15px;
    font-weight: 800;
    color: #15693c;
  }
  .ss-meta {
    font-size: 11px;
    color: #7a8a82;
  }

  /* ── Stage headers ──────────────────────────────────────────────────── */
  .stage-block { margin-bottom: 6px; }
  .stage-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    margin: 20px 0 10px;
    border-radius: 10px;
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-left: 4px solid #1f9254;
  }
  .sh-badge {
    flex: 0 0 auto;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1f9254;
    color: #fff;
    font-size: 12px;
    font-weight: 800;
  }
  .sh-copy {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }
  .sh-name {
    font-size: 13px;
    font-weight: 700;
    color: #1f2437;
  }
  .sh-count {
    font-size: 11px;
    color: #7a8a82;
  }
  .sh-right {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1px;
  }
  .sh-lbl {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 600;
    color: #4d8a63;
  }
  .sh-total {
    font-size: 14px;
    font-weight: 800;
    color: #15693c;
    white-space: nowrap;
  }

  /* ── Collapsible category panel ─────────────────────────────────────── */
  .act {
    padding: 10px 14px;
    margin-bottom: 10px;
    transition: border-color 0.15s;
    &.dirty { border-color: #f3c97c !important; }
  }
  .act-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
    border-radius: 6px;
    padding: 4px 6px;
    margin: -4px -6px;
    &:hover { background: #f7faf8; }
    &:focus-visible { outline: 2px solid #9ad8b4; outline-offset: 2px; }
  }
  .act-name {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    min-width: 0;
    .at-name { font-size: 13px; font-weight: 700; color: #1f2437; }
    .caret {
      display: inline-block;
      color: #9aa6ad;
      font-size: 12px;
      transition: transform 0.15s;
      &.open { transform: rotate(90deg); color: #15693c; }
    }
    .type-tag {
      margin: 0;
      background: #eef3fb;
      color: #2f6dcf;
      border: 1px solid #d7e3f5;
      border-radius: 10px;
      padding: 0 8px;
      font-size: 10px;
      line-height: 18px;
      font-weight: 700;
    }
    .unset-tag {
      margin: 0;
      background: #f0f2f5;
      color: #7a8a82;
      border: 1px solid #e1e6ec;
      border-radius: 10px;
      padding: 0 8px;
      font-size: 10px;
      line-height: 18px;
      font-weight: 700;
    }
    .dirty-tag {
      margin: 0;
      background: #fff4e0;
      color: #b35a00;
      border: 1px solid #f3c97c;
      border-radius: 10px;
      padding: 0 8px;
      font-size: 10px;
      line-height: 18px;
      font-weight: 700;
    }
    /* Category multiplier (from the Budget Categories configuration). */
    .multiplier-tag {
      margin: 0;
      background: #eaf5ee;
      color: #1f6f43;
      border: 1px solid #c6e6d3;
      border-radius: 10px;
      padding: 0 8px;
      font-size: 10px;
      line-height: 18px;
      font-weight: 700;
      &.is-pending {
        background: #fff1f0;
        color: #c0392b;
        border-color: #f5c2bd;
      }
    }
    .multiplier-pending-tag {
      margin: 0;
      background: #fff1f0;
      color: #c0392b;
      border: 1px solid #f5c2bd;
      border-radius: 10px;
      padding: 0 8px;
      font-size: 10px;
      line-height: 18px;
      font-weight: 700;
    }
  }
  .act-total {
    font-size: 13px;
    font-weight: 800;
    color: #15693c;
    white-space: nowrap;
  }
  .act-foot {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
  .units-input { width: 80px; }

  /* ── Buttons ────────────────────────────────────────────────────────── */
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
  }
  /* Save button: muted by default, green once the category is dirty. */
  .save-btn {
    transition: all 0.15s ease-in-out;
    &[disabled] { opacity: 0.6; cursor: not-allowed; }
    &.is-dirty {
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
  .submit-btn {
    background: #1f9254 !important;
    border-color: #1f9254 !important;
    color: #fff !important;
    &:hover, &:focus {
      background: #167a45 !important;
      border-color: #167a45 !important;
      color: #fff !important;
    }
    &[disabled] {
      background: #d8dee2 !important;
      border-color: #d8dee2 !important;
      color: #fff !important;
    }
  }

  /* ── Parameter table ────────────────────────────────────────────────── */
  :deep(.activity-table) {
    margin-top: 8px;
    .ant-table-thead > tr > th {
      background: #fff;
      border-bottom: 1px solid #eaf0ee;
      color: #8a9399;
      font-weight: 600;
      font-size: 11px;
    }
    .ant-table-tbody > tr > td {
      font-size: 12px;
      color: #2f6746;
      border-bottom: 1px solid #f1f5f3;
    }
    .ant-table-tbody > tr:hover > td { background: #fafcfb; }
    /* Lines with no units yet read KES 0 — flag them so they are not missed. */
    .ant-table-tbody > tr.row-zero > td {
      background: #fff9ec;
      box-shadow: inset 3px 0 0 #f3c97c;
    }
    .ant-table-tbody > tr.row-zero:hover > td { background: #fff3d9; }
    .desc-cell { color: #2f6746; }
    .row-tag {
      margin-left: 6px;
      background: #f0f2f5;
      color: #5a5f7d;
      border: none;
      border-radius: 8px;
      font-size: 10px;
      padding: 0 8px;
      line-height: 18px;
    }
    .source-tag {
      margin-left: 6px;
      border-radius: 8px;
      border: none;
      font-size: 10px;
      line-height: 18px;
      padding: 0 8px;
      &.not_set { background: #fff4e0; color: #b35a00; }
    }
    .money-cell { color: #4d5661; }
    .total-cell { font-weight: 700; color: #15693c; }
    /* Category multiplier resolved at generation time (× N, or — when 1). */
    .multiplier-cell {
      .multiplier-on { font-weight: 600; color: #1f6f43; }
      .multiplier-off { color: #b9c2c9; }
    }
  }

  /* ── Helpers ────────────────────────────────────────────────────────── */
  .panel.center {
    text-align: center;
    padding: 24px 0;
    color: #7a8a82;
    font-size: 12px;
    a { color: #15693c; font-weight: 600; margin-left: 4px; }
  }
  .panel.center.muted { color: #9aa6ad; }
  .bp-error { padding: 24px; }

  .bp-skeleton-panel {
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    background: #fff;
    border: 1px solid #eef0f5;
    border-radius: 10px;
  }

  /* ── Zero-unit warning ──────────────────────────────────────────────── */
  .zero-warning {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 14px;
    margin-top: 12px;
    background: #fff8eb;
    border: 1px solid #f3c97c !important;
    .zw-text {
      font-size: 12px;
      color: #8a4a00;
      flex: 1 1 320px;
      strong { color: #8a4a00; font-weight: 800; }
    }
  }

  /* ── Action row ─────────────────────────────────────────────────────── */
  .action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 14px;
    margin-top: 12px;
    .ar-status { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .ar-hint { font-size: 12px; color: #7a8a82; }
  }
}

/* ── Comment modal (teleported outside .bp-min) ─────────────────────────── */
.modal-lede {
  margin: 0 0 10px;
  font-size: 12px;
  color: #7a8a82;
}
.change-list {
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
  max-height: 220px;
  overflow-y: auto;
  li {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 10px;
    margin-bottom: 6px;
    background: #f7faf8;
    border: 1px solid #e6ecef;
    border-radius: 8px;
    .cl-label { font-size: 12px; font-weight: 700; color: #1f2437; }
    .cl-change {
      font-size: 11px;
      color: #7a8a82;
      b { color: #4d5661; font-weight: 700; }
      b.to { color: #15693c; }
      .cl-sep { margin: 0 6px; color: #c3cbd1; }
    }
  }
}
</style>
