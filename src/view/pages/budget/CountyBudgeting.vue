<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="bp-min">
        <!-- Header -->
        <header class="bp-head">
          <div>
            <h3 class="bp-title">{{ county.name }} County Budgeting</h3>
          </div>
          <span class="header-tags">
            <a-tag v-if="specialFlags.length" class="special-pill">
              ✦ Special Area: {{ specialTypeSummary }}
            </a-tag>
            <a-tag class="stage-tag">{{ stage }}</a-tag>
          </span>
        </header>

        <CountyAccessGate @scope-change="onScopeChange">
          <template #default="{ countyId: gatedId }">
            <span v-if="gatedId" style="display:none;">{{ gatedId }}</span>

        <!-- Special Area Cost mapping banner — visible before, during and after generation -->
        <SpecialAreaCostBanner :flags="specialFlags" :is-sub-county="false" />

        <!-- Status card view (shown when budget is past draft or has been referred back) -->
        <section v-if="showStatusCard" class="panel" style="padding: 0; border: 0; background: transparent;">
          <BudgetStatusCard
            :title="`${county.name || 'County'} Budget`"
            :status="budgetStatus"
            :is-referred="isReferred"
            :is-sub-county="false"
            :financial-year="budgetFinancialYear"
            :grand-total="generated && generated.total"
            :submitted-at="budgetSubmittedAt"
            @click="openBudgetDetail"
          />
        </section>

        <!-- Referral feedback banner (only visible once user opens a referred budget) -->
        <BudgetReferralBanner
          v-if="!showStatusCard && isReferred"
          :is-referred="isReferred"
          :referrer="referredBy"
          :referred-at="referredAt"
          :message="referralMessage"
        />

        <!-- Summary bar -->
        <div class="bp-summary" v-if="!showStatusCard && !loading && selectedActivities.length">
          <div class="bp-totals">
            <div><span class="lbl">Total</span><strong>KES {{ fmt(grandTotal) }}</strong></div>
            <div><span class="lbl">Activities</span><strong>{{ selectedActivities.length }}</strong></div>
            <div v-if="dirtyCount"><span class="lbl">Unsaved</span><strong class="warn">{{ dirtyCount }}</strong></div>
          </div>
          <div class="bp-tools">
            <a-input v-model:value="searchTerm" size="small" placeholder="Search…" allow-clear class="bp-search" />
            <sdButton size="small" class="pill-btn" @click="expandAll">Expand</sdButton>
            <sdButton size="small" class="pill-btn" @click="collapseAll">Collapse</sdButton>
          </div>
        </div>

        <!-- Loading / empty -->
        <section v-if="!showStatusCard && loading" class="panel bp-skeleton-panel">
          <a-skeleton-input style="width: 60%; margin-bottom: 14px" active />
          <a-skeleton active :paragraph="{ rows: 4 }" />
          <a-skeleton active :paragraph="{ rows: 3 }" />
        </section>
        <section v-else-if="!showStatusCard && !selectedActivities.length" class="panel center muted">No activities available.</section>
        <section v-else-if="!showStatusCard && !filteredActivities.length" class="panel center muted">
          No matches for “{{ searchTerm }}”.
          <a href="#" @click.prevent="searchTerm = ''">Clear</a>
        </section>

        <!-- Activity panels -->
        <section
          v-for="a in (showStatusCard ? [] : filteredActivities)"
          :key="a.id"
          :class="['panel', 'act', { dirty: isActivityDirty(a.id) }]"
        >
          <div
            class="act-head"
            role="button"
            tabindex="0"
            @click="toggleExpanded(a.id)"
            @keydown.enter.prevent="toggleExpanded(a.id)"
            @keydown.space.prevent="toggleExpanded(a.id)"
          >
            <div class="act-name">
              <span :class="['caret', { open: isExpanded(a.id) }]" aria-hidden="true">▸</span>
              <span class="at-name">{{ a.order }}. {{ a.name }}</span>
              <a-tag v-if="a.multiplier_display" class="multiplier-tag">{{ a.multiplier_display }}</a-tag>
              <a-tag v-if="isActivityDirty(a.id)" class="dirty-tag">Unsaved</a-tag>
            </div>
            <div class="act-total">KES {{ fmt(activityTotal(a)) }}</div>
          </div>

          <div v-show="isExpanded(a.id) && a.loading" class="center small"><a-spin /></div>

          <a-table
            v-show="isExpanded(a.id) && !a.loading"
            :dataSource="a.items"
            :columns="itemColumns"
            :pagination="false"
            row-key="category_parameter_id"
            size="small"
            class="minimal-table activity-table"
            :row-class-name="rowClass"
          >
            <template #bodyCell="{ column, record }">
              <span v-if="column.key === 'description'" class="desc-cell">{{ record.description }}</span>
              <span v-else-if="column.key === 'item'">
                {{ record.item }}
                <a-tag v-if="record.tag" class="row-tag">{{ record.tag }}</a-tag>
                <a-tag
                  v-if="record.unit_source && record.unit_source !== 'override'"
                  :class="['source-tag', record.unit_source]"
                >
                  {{ record.unit_source === 'fallback' ? 'Inherited' : 'Not set' }}
                </a-tag>
                <a-tag v-if="record.is_special_cost" class="special-cost-tag">
                  ✦ Special Cost — {{ specialTypeLabel(record.special_type) }}
                </a-tag>
              </span>
              <span v-else-if="column.key === 'unit_cost'">{{ fmt(record.unit_cost) }}</span>
              <span v-else-if="column.key === 'days'">{{ record.days }}</span>
              <span v-else-if="column.key === 'units'">
                <a-input-number
                  v-if="viewMode === 'profile' && !readOnly"
                  :min="0"
                  :max="300"
                  :precision="0"
                  size="small"
                  class="units-input"
                  :value="record.units"
                  @change="(val) => onUnitsChange(a, record, val)"
                />
                <span v-else>{{ fmt(record.units) }}</span>
              </span>
              <span v-else-if="column.key === 'total'">{{ fmt(rowTotal(record)) }}</span>
            </template>
          </a-table>

          <!-- Session multiplier row: shows the profile-derived multiplier
               and lets the user apply it to the line subtotals. -->
          <div
            v-if="a.multiplier_display && isExpanded(a.id) && !a.loading"
            class="act-multiplier"
          >
            <div class="mp-left">
              <span class="mp-title">Session Multiplier</span>
              <span class="mp-badge">{{ a.multiplier_display }}</span>
            </div>
            <div class="mp-mid">
              <template v-if="a.multiplierApplied">
                Subtotal: <strong>KES {{ fmt(activitySubtotal(a)) }}</strong>
                <span class="mp-arrow">→</span>
                Total: <strong class="mp-total">KES {{ fmt(activityTotal(a)) }}</strong>
              </template>
              <span v-else class="mp-hint">
                Line totals are subtotals. Apply the session multiplier to compute the budget total.
              </span>
            </div>
            <div class="mp-right">
              <sdButton
                v-if="hasSessionMultiplier(a)"
                size="small"
                :class="['pill-btn', 'mp-btn', { applied: a.multiplierApplied }]"
                @click="applyMultiplier(a)"
              >
                {{ a.multiplierApplied ? '✓ Multiplier Applied' : 'Apply Multiplier' }}
              </sdButton>
            </div>
          </div>

          <div class="act-foot" v-show="isExpanded(a.id) && viewMode === 'profile' && !readOnly">
            <sdButton
              size="small"
              :class="['pill-btn', 'save-btn', { 'is-dirty': isActivityDirty(a.id) }]"
              :disabled="!isActivityDirty(a.id)"
              :loading="updatingActivityId === a.id"
              @click="updateCategoryParameter(a)"
            >
              Save
            </sdButton>
          </div>
        </section>

        <!-- Zero-unit warning -->
        <section
          v-if="!showStatusCard && !loading && selectedActivities.length && zeroUnitCount"
          class="panel zero-warning"
        >
          <div class="zw-text">
            <strong>{{ zeroUnitCount }}</strong> parameter{{ zeroUnitCount === 1 ? '' : 's' }} still
            ha{{ zeroUnitCount === 1 ? 's' : 've' }} <strong>0 units</strong>.
            Highlighted rows are missing a value. Set a value, or confirm the
            zeros are intentional.
          </div>
          <a-checkbox v-model:checked="zeroConfirmed" class="zw-confirm">
            I confirm the zero-unit parameters are intentional
          </a-checkbox>
        </section>

        <!-- Action row -->
        <section v-if="!showStatusCard && !loading && selectedActivities.length" class="panel action-row">
          <a-tag
            v-if="readOnly"
            color="purple"
            style="margin-right: auto; align-self: center"
          >
            National view — read only
          </a-tag>
          <a-tag
            v-if="budgetStatus === 'submitted'"
            color="blue"
            style="margin-right: auto; align-self: center"
          >
            Submitted to National — view only
          </a-tag>
          <sdButton
            v-if="!readOnly && budgetStatus !== 'submitted'"
            class="pill-btn"
            size="small"
            :loading="regenerating"
            :disabled="(zeroUnitCount > 0 && !zeroConfirmed) || generated"
            @click="regenerateBudget"
          >
            {{ generated ? 'Generated (void to edit)' : 'Generate' }}
          </sdButton>
          <sdButton
            v-if="!readOnly && budgetStatus !== 'submitted'"
            type="dark"
            size="small"
            :loading="submitting"
            :disabled="!generated"
            @click="submitToNational"
          >
            Submit to National
          </sdButton>
          <a-button
            v-if="canVoid"
            danger
            size="small"
            :loading="voiding"
            @click="openVoidModal"
          >
            Void
          </a-button>
        </section>

        <!-- Void modal -->
        <a-modal
          v-model:visible="voidModalOpen"
          title="Void this budget"
          :ok-text="voiding ? 'Voiding…' : 'Void budget'"
          ok-type="danger"
          :ok-button-props="{ loading: voiding, disabled: voidReason.trim().length < 10 }"
          :confirm-loading="voiding"
          cancel-text="Cancel"
          @ok="confirmVoid"
        >
          <p style="margin-bottom: 8px">
            The budget categories and parameters will be open for edits. Provide a reason (minimum 10
            characters) for the audit trail.
          </p>
          <a-textarea
            v-model:value="voidReason"
            :rows="4"
            :maxlength="500"
            placeholder="e.g. Unit costs were misconfigured; restarting with corrected rates."
            show-count
          />
        </a-modal>

        <!-- Generated banner -->
        <section v-if="!showStatusCard && generated" class="panel gen-banner">
          <span class="gen-lbl">Generated total</span>
          <span class="gen-val">KES {{ fmt(generated.total) }}</span>
          <span v-if="specialCostsTotal > 0" class="gen-special">
            <span class="gen-special-lbl">Special Area Costs Added</span>
            <span class="gen-special-val">KES {{ fmt(specialCostsTotal) }}</span>
          </span>
          <span class="gen-date">{{ generated.date }}</span>
        </section>
          </template>
        </CountyAccessGate>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';
import CountyAccessGate from './CountyAccessGate.vue';
import BudgetStatusCard from './BudgetStatusCard.vue';
import BudgetReferralBanner from './BudgetReferralBanner.vue';
import SpecialAreaCostBanner from './SpecialAreaCostBanner.vue';

/* Human-readable label for a special_type enum value — mirrors the
 * backend's CampaignBudgetController::humanizeSpecialType(). */
const SPECIAL_TYPE_LABELS = {
  boat_hire: 'Boat Hire',
  enhanced_transport: 'Enhanced Transport',
  security: 'Security',
  dsa: 'DSA',
};
const specialTypeLabel = (type) =>
  SPECIAL_TYPE_LABELS[type] || String(type || '').replace(/_/g, ' ');

/* Sort and normalise budget categories returned by `get_budget_categories`
 * into the activity shape used by this page. Items are loaded lazily, on
 * demand, via `get_category_parameters_for_profile`. */
const normalizePayload = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.categories)) return raw.categories;
  return [];
};

const categoriesToActivities = (cats) =>
  cats
    .slice()
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((c, i) => ({
      id: c.id,
      order: i + 1,
      name: c.name || `Category ${c.id}`,
      description: c.description || '',
      stage: c.stage,
      type: c.type,
      scope: c.scope,
      default_days: Number(c.default_days || 0),
      itemsLoaded: false,
      loading: false,
      items: [],
      total_parameters: 0,
      set_count: 0,
      fallback_count: 0,
      not_set_count: 0,
      session_multiplier: c.session_multiplier ?? 1,
      multiplier_display: c.multiplier_display || '',
      multiplierApplied: false,
    }));

/* Convert the parameters array returned by `get_category_parameters_for_profile`
 * into row items consumed by the activity table.
 *
 * Initial state: every row starts at 0 units and KES 0 total. The user enters
 * units in the grid, the row total auto-calculates as
 *   total_cost = unit_cost × number_of_days × units
 * which is the exact same formula `BudgetCalculationService` uses at
 * generation time, so the pre-generation subtotal always equals the
 * Generated Total. */
const paramsToItems = (params, activity) => {
  const daysOf = (p) =>
    Number(p.number_of_days) || Number(activity?.default_days) || 1;
  const multiplier = Number(activity?.session_multiplier) || 1;
  const applied = !!activity?.multiplierApplied;
  return (params || []).map((p) => {
    const u = Number(p.total_units) || 0;
    const d = daysOf(p);
    const cost = Number(p.unit_cost) || 0;
    const subtotal = cost * d * u;
    return {
      category_parameter_profile_id: p.category_parameter_profile_id || null,
      category_parameter_id: p.category_parameter_id,
      parameter_id: p.parameter_id,
      parameter_key: p.parameter_key,
      description: p.parameter_label,
      item: p.parameter_label,
      tag: p.unit_definition,
      unit_cost: cost,
      days: d,
      units: u,
      _subtotal: subtotal,
      _session_multiplier: multiplier,
      total_cost: applied ? subtotal * multiplier : subtotal,
      unit_source: p.unit_source || 'not_set',
      highlight: /fuel/i.test(p.parameter_key || ''),
    };
  });
};

/* Convert generated `line_items` (from `get_budget_line_items/{id}`) into
 * row items consumed by the activity table. These rows are read-only
 * and reflect the canonical, server-generated breakdown. */
const lineItemsToItems = (items) =>
  (items || [])
    .slice()
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((li) => ({
      category_parameter_profile_id: null,
      category_parameter_id: li.id,
      parameter_id: li.budget_parameter_id,
      parameter_key: li?.budget_parameter?.key || null,
      description: li.label,
      item: li.label,
      tag: li.unit_definition,
      unit_cost: Number(li.unit_cost) || 0,
      days: Number(li.number_of_days) || 1,
      units: Number(li.unit_count) || 0,
      total_cost: Number(li.total_cost) || 0,
      unit_source: 'override',
      resolved_from: null,
      sort_order: li.sort_order,
      is_special_cost: !!li.is_special_cost,
      special_type: li.special_type || null,
      highlight: false,
    }));

export default {
  name: 'CountyBudgeting',
  components: {
    Main,
    RecordViewWrapper,
    BudgetPageWrapper,
    CountyAccessGate,
    BudgetStatusCard,
    BudgetReferralBanner,
    SpecialAreaCostBanner,
  },
  setup() {
    // Level 1 (National / Super Admin) users get a read-only view across
    // all budget pages — they can browse county / sub-county data but
    // cannot edit, save, regenerate, submit or void.
    const currentUser = (() => {
      try {
        return JSON.parse(sessionStorage.getItem('user') || '{}');
      } catch (e) {
        return {};
      }
    })();
    const readOnly = ref(Number(currentUser?.user?.level_id) === 1);

    const county = ref({ name: '', subCounties: 9 });
    const stage = ref('Preparatory Stage');

    // Set by CountyAccessGate. For County officers (level 2) this is
    // their own county; for Super Admins (level 1) it is the county the
    // user picked from the gate's selector. The page does not load any
    // data until this is resolved.
    const scopedCountyId = ref(null);
    const scopedCountyName = ref('');

    const loading = ref(false);
    const activityCatalog = ref([]);
    const selectedIds = ref([]);
    const expandedIds = ref([]);
    const searchTerm = ref('');

    const isExpanded = (id) => expandedIds.value.includes(id);
    const ensureLoaded = (id) => {
      const activity = activityCatalog.value.find((a) => a.id === id);
      if (activity && !activity.itemsLoaded && !activity.loading) {
        loadActivityParameters(activity);
      }
    };
    const toggleExpanded = (id) => {
      const willExpand = !isExpanded(id);
      expandedIds.value = isExpanded(id)
        ? expandedIds.value.filter((x) => x !== id)
        : [...expandedIds.value, id];
      if (willExpand) ensureLoaded(id);
    };
    const expandAll = () => {
      expandedIds.value = activityCatalog.value.map((a) => a.id);
      activityCatalog.value.forEach((a) => ensureLoaded(a.id));
    };
    const collapseAll = () => {
      expandedIds.value = [];
    };

    const regenerating = ref(false);
    const submitting = ref(false);
    const generated = ref(null);
    const countyProfileId = ref(null);
    const campaignBudgetId = ref(null);
    // Tracks lifecycle state of the active campaign budget so the action row
    // can lock the appropriate buttons:
    //   null       — no budget yet, user is editing units
    //   'draft'    — created/generated, can void and submit
    //   'submitted'— sent upstream, view-only (no void, no regenerate)
    const budgetStatus = ref(null);
    // 'profile' = editable rows from get_category_parameters_for_profile
    // 'generated' = read-only rows from get_budget_line_items/{id}
    const viewMode = ref('profile');

    // ── Status-card / referral state ─────────────────────────────────────
    // showStatusCard is true when the budget should first render as a
    // status summary card (submitted / county_approved / approved / referred).
    // The user clicks the card to drill into the categories & parameters.
    const showStatusCard = ref(false);
    const budgetFinancialYear = ref(null);
    const budgetSubmittedAt = ref(null);
    const isReferred = ref(false);
    const referredAt = ref(null);
    const referralMessage = ref('');
    const referredBy = ref(null);

    // ── Special Area Cost mapping state ──────────────────────────────────
    // Populated from `get_active_special_flags` once the gate resolves a
    // county. Drives the header pill, the SpecialAreaCostBanner (visible
    // before/during editing), and the "Special Cost" row tags + summary
    // shown once the budget has been generated. County-wide flags only
    // (sub_county_id is not passed for the county budgeting page).
    const specialFlags = ref([]);

    const specialTypeSummary = computed(() =>
      [...new Set(specialFlags.value.map((f) => specialTypeLabel(f.special_type)))].join(', '),
    );

    const specialCostsTotal = computed(() =>
      activityCatalog.value.reduce(
        (sum, a) =>
          sum + (a.items || [])
            .filter((i) => i.is_special_cost)
            .reduce((s, i) => s + (Number(i.total_cost) || 0), 0),
        0,
      ),
    );

    const fetchSpecialFlags = async () => {
      if (!scopedCountyId.value) {
        specialFlags.value = [];
        return;
      }
      try {
        const { data } = await axios.get('get_active_special_flags', {
          params: { county_id: scopedCountyId.value },
        });
        specialFlags.value = Array.isArray(data?.flags) ? data.flags : [];
      } catch (e) {
        // Non-fatal — page still works without the mapping indicator.
        specialFlags.value = [];
      }
    };

    /* Resolve the active county profile id. When the user is a County
     * officer (level 2) we trust `get_my_county_profile`. When the user
     * is a Super Admin (level 1), the gate provides the chosen
     * `scopedCountyId`, and we look up the county-level profile for
     * that county directly. */
    const resolveCountyProfile = async () => {
      try {
        if (scopedCountyId.value) {
          const { data } = await axios.get('get_county_profiles', {
            params: { county_id: scopedCountyId.value, level: 'county' },
          });
          const rows = Array.isArray(data) ? data : data?.data || [];
          const profile = rows[0] || null;
          if (!profile) {
            notification.error({
              message: 'No county-level profile',
              description:
                'No county-level profile exists for the selected county. Create one in County Profile first.',
            });
            return null;
          }
          countyProfileId.value = profile.id;
          county.value.name =
            profile.county?.name || scopedCountyName.value || county.value.name;
          return {
            level: 'county',
            county_profile_id: profile.id,
            county_id: profile.county_id,
            sub_county_id: null,
            profile,
          };
        }

        const { data } = await axios.get('get_my_county_profile');
        const id = data?.county_profile_id || data?.profile?.id || null;
        if (id) countyProfileId.value = id;
        if (data?.county?.name || data?.county_name) {
          county.value.name = data?.county?.name || data?.county_name;
        }
        if (data?.sub_counties_count != null) {
          county.value.subCounties =
            Number(data.sub_counties_count) || county.value.subCounties;
        }
        return data;
      } catch (err) {
        notification.error({
          message: 'Failed to load county profile',
          description: err?.response?.data?.message || err.message,
        });
        return null;
      }
    };

    /* Fetch the list of active budget categories scoped to county. The
     * BE returns categories whose scope is `county` or `both`, so a
     * county user never sees sub-county-level categories. Parameters
     * are loaded lazily via `get_category_parameters_for_profile` on
     * expand. */
    const loadActivities = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_budget_categories', {
          params: { scope: 'county' },
        });
        const cats = normalizePayload(data).filter(
          (c) => c.is_active === undefined || !!c.is_active,
        );
        activityCatalog.value = categoriesToActivities(cats);
        selectedIds.value = activityCatalog.value.map((a) => a.id);
        expandedIds.value = [];
      } catch (err) {
        notification.error({
          message: 'Failed to load budget categories',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        loading.value = false;
      }
    };

    /* Load (or reload) parameters for a single activity. */
    const loadActivityParameters = async (activity) => {
      if (!countyProfileId.value) return;
      activity.loading = true;
      try {
        const { data } = await axios.get(
          'get_category_parameters_for_profile',
          {
            params: {
              category_id: activity.id,
              county_profile_id: countyProfileId.value,
            },
          },
        );
        const payload = data?.data || data || {};
        if (payload.category) {
          activity.default_days =
            Number(payload.category.default_days || activity.default_days);
        }
        activity.items = paramsToItems(payload.parameters, activity);
        activity.total_parameters = Number(payload.total_parameters || 0);
        activity.set_count = Number(payload.set_count || 0);
        activity.fallback_count = Number(payload.fallback_count || 0);
        activity.not_set_count = Number(payload.not_set_count || 0);
        activity.session_multiplier = Number(payload.session_multiplier) || 1;
        activity.multiplier_display = payload.multiplier_display || '';
        if (payload.category) {
          activity.description =
            payload.category.description || activity.description;
          activity.default_days =
            Number(payload.category.default_days || activity.default_days);
        }
        activity.itemsLoaded = true;
      } catch (err) {
        notification.error({
          message: 'Failed to load category parameters',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        activity.loading = false;
      }
    };

    /* Bootstrap data once the gate has resolved a county. Re-runs
     * whenever the user picks a different county. */
    const bootstrap = async () => {
      // Reset any prior state to avoid carrying data from another county.
      countyProfileId.value = null;
      campaignBudgetId.value = null;
      budgetStatus.value = null;
      generated.value = null;
      viewMode.value = 'profile';
      activityCatalog.value = [];
      selectedIds.value = [];
      expandedIds.value = [];
      showStatusCard.value = false;
      budgetFinancialYear.value = null;
      budgetSubmittedAt.value = null;
      isReferred.value = false;
      referredAt.value = null;
      referralMessage.value = '';
      referredBy.value = null;

      const profile = await resolveCountyProfile();
      if (!profile) return;

      // Skeleton on while we figure out which view to render.
      loading.value = true;

      // Hydrate the latest non-voided budget FIRST so we can decide
      // whether to show the status card. Categories / parameters /
      // line items are loaded lazily on click via `openBudgetDetail()`.
      try {
        const { data } = await axios.get('get_campaign_budgets', {
          params: { county_profile_id: countyProfileId.value },
        });
        const rows = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        const active = rows.find((b) => b.status !== 'voided');
        if (active) {
          campaignBudgetId.value = active.id;
          budgetStatus.value = active.status;
          budgetFinancialYear.value = active.financial_year || null;
          budgetSubmittedAt.value = active.submitted_at || null;
          isReferred.value = !!active.is_referred;
          referredAt.value = active.referred_at || null;
          referralMessage.value = active.referral_message || '';
          // Owner endpoint serialises is_referred/referred_at on the row;
          // referrer user object is lazy-loaded on card click via show().
          referredBy.value = active.referred_by_user || null;

          // `create_campaign_budget` generates the line items in the same
          // call, so ANY existing (non-voided) budget row is an already-
          // generated budget — even a draft whose grand_total is KES 0
          // (e.g. all units were zero and the confirmation was accepted).
          // Always marking it "generated" deactivates the Generate button
          // on reload; the owner uses Void (draft) to rebuild it.
          generated.value = {
            total: Number(active.grand_total) || 0,
            date: active.submitted_at
              ? new Date(active.submitted_at).toLocaleDateString()
              : new Date(active.updated_at || active.created_at).toLocaleDateString(),
          };

          // Whenever the budget has progressed past draft, or was
          // referred back, render the status card first.
          showStatusCard.value = isReferred.value || active.status !== 'draft';
        }
      } catch (e) {
        // Non-fatal — user can still generate a fresh budget.
      }

      // If we're going to show the status card, stop here.
      if (showStatusCard.value) {
        loading.value = false;
        return;
      }

      // Editor path: load activities + parameters, then the line items.
      try {
        await loadActivities();
        await Promise.all(
          activityCatalog.value.map((a) => loadActivityParameters(a)),
        );
        if (campaignBudgetId.value && generated.value) {
          await loadBudgetLineItems(campaignBudgetId.value);
        }
      } finally {
        loading.value = false;
      }
    };

    const onScopeChange = ({ countyId, countyName }) => {
      scopedCountyId.value = countyId || null;
      scopedCountyName.value = countyName || '';
      bootstrap();
      fetchSpecialFlags();
    };

    /* Card → Detail transition. Loads category tree, parameters and
     * existing line items lazily — none of this is fetched on initial
     * page load when the budget is already past draft. When referred
     * back we also fetch the full record so the banner can show the
     * referrer's name, role and message. */
    const openBudgetDetail = async () => {
      showStatusCard.value = false;
      loading.value = true;
      try {
        if (!activityCatalog.value.length) {
          await loadActivities();
          await Promise.all(
            activityCatalog.value.map((a) => loadActivityParameters(a)),
          );
        }
        if (campaignBudgetId.value && generated.value) {
          await loadBudgetLineItems(campaignBudgetId.value);
        }
        if (isReferred.value && !referredBy.value && campaignBudgetId.value) {
          try {
            const { data } = await axios.get(`get_campaign_budget/${campaignBudgetId.value}`);
            const b = data?.data || data || {};
            // Laravel's relation eager-load overwrites the FK column with
            // the related User object under the same snake_case key.
            const rb = b.referred_by;
            if (rb && typeof rb === 'object') referredBy.value = rb;
            if (b.referred_at && !referredAt.value) referredAt.value = b.referred_at;
            if (b.referral_message && !referralMessage.value) referralMessage.value = b.referral_message;
          } catch (e) {
            // Non-fatal — banner still renders with whatever fields we have.
          }
        }
      } finally {
        loading.value = false;
      }
    };

    const selectedActivities = computed(() =>
      selectedIds.value
        .map((id) => activityCatalog.value.find((a) => a.id === id))
        .filter(Boolean),
    );

    const rowTotal = (r) => {
      if (r && Number(r.total_cost) > 0) return Number(r.total_cost);
      return (
        (Number(r.unit_cost) || 0)
        * (Number(r.days) || 1)
        * (Number(r.units) || 0)
      );
    };
    const activityTotal = (a) =>
      (a.items || []).reduce((s, i) => s + rowTotal(i), 0);

    const grandTotal = computed(() =>
      selectedActivities.value.reduce((s, a) => s + activityTotal(a), 0),
    );

    // Void is only available while the budget is still a working draft.
    // Once it is submitted to National, the review chain owns it — the
    // owner must wait for it to be referred back (which returns it to
    // draft) before it can be voided and regenerated.
    const canVoid = computed(() => {
      if (readOnly.value || !campaignBudgetId.value) return false;
      return budgetStatus.value === 'draft';
    });

    // Zero-unit gate: any loaded parameter row whose units === 0 must be
    // explicitly confirmed before the user can generate.
    const zeroUnitCount = computed(() =>
      selectedActivities.value.reduce(
        (n, a) =>
          n + (a.items || []).filter((i) => (Number(i.units) || 0) === 0).length,
        0,
      ),
    );
    const zeroConfirmed = ref(false);
    // Reset confirmation whenever the set of zero rows changes (e.g. user
    // edits a value), so they have to re-acknowledge.
    watch(zeroUnitCount, () => {
      zeroConfirmed.value = false;
    });

    const rowClass = (r) => {
      if (r.is_special_cost) return 'row-special';
      if ((Number(r.units) || 0) === 0) return 'row-zero';
      return r.highlight ? 'row-highlight' : '';
    };

    const filteredActivities = computed(() => {
      const q = searchTerm.value.trim().toLowerCase();
      if (!q) return selectedActivities.value;
      return selectedActivities.value.filter((a) => {
        if ((a.name || '').toLowerCase().includes(q)) return true;
        return (a.items || []).some((i) =>
          (i.description || '').toLowerCase().includes(q)
          || (i.item || '').toLowerCase().includes(q)
          || (i.tag || '').toLowerCase().includes(q),
        );
      });
    });

    const itemColumns = [
      { title: 'Description', key: 'description', dataIndex: 'description' },
      { title: 'Budget Item', key: 'item', dataIndex: 'item' },
      { title: 'Unit Cost', key: 'unit_cost', align: 'right', width: 120 },
      { title: 'Days', key: 'days', align: 'right', width: 70 },
      { title: 'Units', key: 'units', align: 'right', width: 110 },
      { title: 'Total (KES)', key: 'total', align: 'right', width: 140 },
    ];

    /* Refresh activity tables from the canonical generated breakdown. */
    const loadBudgetLineItems = async (budgetId) => {
      if (!budgetId) return null;
      try {
        const { data } = await axios.get(`get_budget_line_items/${budgetId}`);
        const payload = data?.data || data || {};
        const map = payload.line_items || {};
        activityCatalog.value.forEach((a) => {
          const items = map[String(a.id)];
          if (Array.isArray(items)) {
            a.items = lineItemsToItems(items);
            a.itemsLoaded = true;
          }
        });
        viewMode.value = 'generated';
        return payload;
      } catch (err) {
        notification.error({
          message: 'Failed to load generated line items',
          description: err?.response?.data?.message || err.message,
        });
        return null;
      }
    };

    const regenerateBudget = async () => {
      if (generated.value) {
        notification.warning({
          message: 'Budget already generated',
          description:
            'Void the current budget first if you need to make changes and regenerate.',
        });
        return;
      }
      regenerating.value = true;
      try {
        // 1) Re-resolve the active county profile (honours the gate-set
        //    scope so a National user generating for a chosen county
        //    targets the right profile, not their default one).
        const profileResp = await resolveCountyProfile();
        const profileId = countyProfileId.value;
        if (!profileResp || !profileId) {
          notification.error({
            message: 'Missing county profile',
            description: 'Unable to determine the county profile to generate for.',
          });
          return;
        }

        const financialYear = String(new Date().getFullYear());

        // 3) Create the campaign budget and capture the returned budget id
        const { data: createResp } = await axios.post('create_campaign_budget', {
          county_profile_id: profileId,
          financial_year: financialYear,
        });

        // Normalise wrapper shapes to find the new budget id.
        const budgetId =
          createResp?.id
          ?? createResp?.data?.id
          ?? createResp?.budget?.id
          ?? createResp?.campaign_budget?.id
          ?? createResp?.data?.budget?.id
          ?? null;

        if (!budgetId) {
          notification.error({
            message: 'Failed to generate county budget',
            description: 'Could not determine the campaign budget id from the server response.',
          });
          return;
        }
        campaignBudgetId.value = budgetId;
        budgetStatus.value =
          createResp?.status
          ?? createResp?.data?.status
          ?? createResp?.budget?.status
          ?? 'draft';

        // 4) Generate the campaign budget using the budget id
        const { data: genResp } = await axios.post(
          `generate_campaign_budget/${budgetId}`,
        );

        // Normalise wrapper shapes
        const budget =
          genResp?.grand_total != null
            ? genResp
            : genResp?.data?.grand_total != null
              ? genResp.data
              : genResp?.budget?.grand_total != null
                ? genResp.budget
                : genResp?.data ?? genResp ?? {};

        const rawTotal = budget?.grand_total ?? budget?.total;
        let apiTotal = rawTotal != null ? parseFloat(rawTotal) : NaN;
        if (!Number.isFinite(apiTotal) && Array.isArray(budget?.line_items)) {
          apiTotal = budget.line_items.reduce(
            (s, li) => s + (parseFloat(li.total_cost) || 0),
            0,
          );
        }

        generated.value = {
          total: Number.isFinite(apiTotal) ? apiTotal : grandTotal.value,
          date: new Date().toLocaleDateString(),
        };

        // 5) Refresh tables with the canonical generated breakdown.
        await loadBudgetLineItems(budgetId);

        notification.success({ message: 'County budget generated.' });
      } catch (err) {
        // The backend refuses to create a second budget while an active
        // (non-voided) one exists and returns it as `existing` so the
        // caller can adopt it. Reuse that budget instead of failing
        // loudly — the owner voids it (draft) to rebuild, or waits for
        // the review chain if it is already upstream.
        const body = err?.response?.data || {};
        const existing = body?.existing ?? body?.budget ?? null;
        if (err?.response?.status === 409 && existing?.id) {
          campaignBudgetId.value = existing.id;
          budgetStatus.value = existing.status || 'draft';
          budgetFinancialYear.value = existing.financial_year || null;
          budgetSubmittedAt.value = existing.submitted_at || null;
          isReferred.value = !!existing.is_referred;
          referredAt.value = existing.referred_at || null;
          referralMessage.value = existing.referral_message || '';
          referredBy.value = null;
          generated.value = {
            total: Number(existing.grand_total) || 0,
            date: existing.submitted_at
              ? new Date(existing.submitted_at).toLocaleDateString()
              : new Date(existing.updated_at || existing.created_at).toLocaleDateString(),
          };
          showStatusCard.value = !!existing.is_referred || existing.status !== 'draft';
          if (!showStatusCard.value) {
            await loadBudgetLineItems(existing.id);
          }
          notification.warning({
            message: 'A budget already exists for this county',
            description:
              existing.status === 'draft'
                ? 'Void the draft budget to generate a new one instead, or submit it to National when ready.'
                : `This budget is already ${existing.status} — it returns to draft only if a reviewer refers it back.`,
          });
          return;
        }
        notification.error({
          message: 'Failed to generate county budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        regenerating.value = false;
      }
    };

    const submitToNational = async () => {
      const submitId = campaignBudgetId.value || countyProfileId.value;
      if (!submitId) {
        notification.error({
          message: 'Cannot submit',
          description: 'Please generate the county budget first.',
        });
        return;
      }
      submitting.value = true;
      try {
        await axios.post(`submit_campaign_budget/${submitId}`);
        budgetStatus.value = 'submitted';
        budgetSubmittedAt.value = new Date().toISOString();
        // A fresh submission supersedes any prior referral.
        isReferred.value = false;
        referredAt.value = null;
        referralMessage.value = '';
        referredBy.value = null;
        // Surface the status card immediately so the user lands on the
        // “National Review” view post-submit.
        showStatusCard.value = true;
        notification.success({ message: 'County budget submitted to National.' });
      } catch (err) {
        notification.error({
          message: 'Failed to submit county budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        submitting.value = false;
      }
    };

    /* Void the active campaign budget so a new draft can be created.
     * Backend allows voiding from `draft` or `submitted` state only and
     * requires a reason of at least 10 characters. */
    const voidModalOpen = ref(false);
    const voidReason = ref('');
    const voiding = ref(false);

    const openVoidModal = () => {
      voidReason.value = '';
      voidModalOpen.value = true;
    };

    const confirmVoid = async () => {
      if (!campaignBudgetId.value) {
        notification.error({
          message: 'Cannot void',
          description: 'No active county budget to void.',
        });
        return;
      }
      const reason = voidReason.value.trim();
      if (reason.length < 10) {
        notification.error({
          message: 'Reason too short',
          description: 'Please provide at least 10 characters explaining why this budget is being voided.',
        });
        return;
      }
      voiding.value = true;
      try {
        await axios.post(`void_campaign_budget/${campaignBudgetId.value}`, {
          voided_reason: reason,
        });
        notification.success({
          message: 'County budget voided',
          description: 'You can now generate a new draft for this county.',
        });
        // Reset local state so the page returns to the editable view and a
        // fresh budget can be generated.
        campaignBudgetId.value = null;
        budgetStatus.value = null;
        generated.value = null;
        viewMode.value = 'profile';
        voidModalOpen.value = false;
        voidReason.value = '';
        await Promise.all(
          activityCatalog.value.map((a) => loadActivityParameters(a)),
        );
      } catch (err) {
        notification.error({
          message: 'Failed to void county budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        voiding.value = false;
      }
    };

    const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

    // Track which activities have unsaved unit edits
    const dirtyActivities = ref({});
    const updatingActivityId = ref(null);
    const isActivityDirty = (id) => !!dirtyActivities.value[id];
    const dirtyCount = computed(
      () => Object.values(dirtyActivities.value).filter(Boolean).length,
    );

    const onUnitsChange = (activity, record, val) => {
      // Units must be a positive integer (no decimals, no negatives), up to 300.
      const raw = Number(val);
      let next = Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 0;
      next = Math.min(next, 300);
      record.units = next;
      // Recompute subtotal and apply multiplier if active
      record._subtotal =
        (Number(record.unit_cost) || 0)
        * (Number(record.days) || 1)
        * (Number(record.units) || 0);
      const m = activity.multiplierApplied
        ? (Number(activity.session_multiplier) || 1)
        : 1;
      record.total_cost = record._subtotal * m;
      record._dirty = true;
      dirtyActivities.value = { ...dirtyActivities.value, [activity.id]: true };
    };

    /* Session multiplier helpers ----------------------------------------- */

    /* A category only shows the multiplier row when its profile-derived
     * session multiplier is greater than 1. */
    const hasSessionMultiplier = (a) =>
      (Number(a?.session_multiplier) || 1) > 1;

    /* Base subtotal for one row: unit_cost × days × units (no multiplier). */
    const rowSubtotal = (r) =>
      Number(r?._subtotal) || (
        (Number(r?.unit_cost) || 0)
        * (Number(r?.days) || 1)
        * (Number(r?.units) || 0)
      );

    /* Sum of row subtotals — used to display the pre-multiplier value. */
    const activitySubtotal = (a) =>
      (a.items || []).reduce((s, i) => s + rowSubtotal(i), 0);

    /* Toggle the session multiplier on/off for one activity. When turned on,
     * every row total becomes subtotal × session_multiplier, mirroring the
     * formula BudgetCalculationService uses at generation time. The
     * multiplier itself is never sent on save — it is read from the profile. */
    const applyMultiplier = (activity) => {
      activity.multiplierApplied = !activity.multiplierApplied;
      const m = activity.multiplierApplied
        ? (Number(activity.session_multiplier) || 1)
        : 1;
      (activity.items || []).forEach((item) => {
        item._subtotal = rowSubtotal(item);
        item.total_cost = item._subtotal * m;
      });
    };

    /* Persist edited unit values for one activity in a single batch call.
     * `save_category_parameter_profiles` upserts by composite
     * (category_parameter_id, county_profile_id) so it works for rows that
     * have never been materialised — which is the common case for
     * `unit_source: 'not_set'` parameters. The endpoint returns the refreshed
     * list with newly-assigned `category_parameter_profile_id`s so subsequent
     * edits resolve correctly. */
    const updateCategoryParameter = async (activity) => {
      if (!countyProfileId.value) {
        notification.error({
          message: 'Missing county profile',
          description: 'Cannot save without a county profile id.',
        });
        return;
      }
      const dirtyRows = (activity.items || []).filter((r) => r._dirty);
      if (!dirtyRows.length) return;

      updatingActivityId.value = activity.id;
      try {
        await axios.post('save_category_parameter_profiles', {
          county_profile_id: countyProfileId.value,
          category_id: activity.id,
          parameters: dirtyRows.map((r) => ({
            category_parameter_id: r.category_parameter_id,
            total_units: Number(r.units) || 0,
          })),
        });
        const next = { ...dirtyActivities.value };
        delete next[activity.id];
        dirtyActivities.value = next;
        // Refresh from the server so each row gets its newly-assigned
        // category_parameter_profile_id and unit_source flags.
        await loadActivityParameters(activity);
        notification.success({
          message: 'Category parameter updated',
          description: `${activity.name} totals recalculated.`,
        });
      } catch (err) {
        notification.error({
          message: 'Failed to update category parameter',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        updatingActivityId.value = null;
      }
    };

    return {
      county,
      stage,
      loading,
      readOnly,
      onScopeChange,
      isExpanded,
      toggleExpanded,
      expandAll,
      collapseAll,
      searchTerm,
      selectedActivities,
      filteredActivities,
      itemColumns,
      rowTotal,
      activityTotal,
      grandTotal,
      regenerating,
      submitting,
      regenerateBudget,
      submitToNational,
      generated,
      fmt,
      isActivityDirty,
      dirtyCount,
      onUnitsChange,
      updateCategoryParameter,
      updatingActivityId,
      zeroUnitCount,
      zeroConfirmed,
      rowClass,
      viewMode,
      campaignBudgetId,
      budgetStatus,
      voidModalOpen,
      voidReason,
      voiding,
      canVoid,
      openVoidModal,
      confirmVoid,
      showStatusCard,
      budgetFinancialYear,
      budgetSubmittedAt,
      isReferred,
      referredAt,
      referralMessage,
      referredBy,
      openBudgetDetail,
      hasSessionMultiplier,
      activitySubtotal,
      applyMultiplier,
      specialFlags,
      specialTypeSummary,
      specialCostsTotal,
      specialTypeLabel,
    };
  },
};
</script>

<style lang="less" scoped>
.bp-min {
  /* Outer top/bottom padding now lives on BudgetPageWrapper
     so every budget page shares the same vertical rhythm. */
  /* Header */
  .bp-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #eef0f5;
  }
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
  .special-pill {
    background: #fff4e6;
    color: #b85c00;
    border: 1px solid #f3c97c;
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 11px;
    font-weight: 600;
  }

  /* Summary bar */
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
    gap: 22px;
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
      }
    }
  }
  .bp-tools {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    .bp-search { width: 180px; }
  }

  /* Generic helpers */
  .panel.center {
    text-align: center;
    padding: 24px 0;
    color: #7a8a82;
    font-size: 12px;
    a { color: #15693c; font-weight: 600; margin-left: 4px; }
  }
  .panel.center.small { padding: 14px 0; }
  .panel.center.muted { color: #9aa6ad; }

  /* Skeleton block shown while the first bootstrap is in flight */
  .bp-skeleton-panel {
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    background: #fff;
    border: 1px solid #eef0f5;
    border-radius: 10px;
  }

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

  /* Activity panels */
  .act {
    padding: 10px 14px;
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
    .at-name { font-size: 13px; font-weight: 700; color: #1f2437; }
    .caret {
      color: #9aa6ad;
      font-size: 12px;
      transition: transform 0.15s;
      &.open { transform: rotate(90deg); color: #15693c; }
    }
    .dirty-tag {
      background: #fff4e0;
      color: #b35a00;
      border: 1px solid #f3c97c;
      border-radius: 10px;
      padding: 0 8px;
      font-size: 10px;
      line-height: 18px;
      font-weight: 700;
    }
    .multiplier-tag {
      background: #e8f6ee;
      color: #15693c;
      border: 1px solid #9ad8b4;
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
  }
  .act-foot {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
  .units-input { width: 80px; }

  /* Session multiplier row: sits between the parameter table and the save
   * button, shows the profile-derived multiplier and lets the user apply it
   * to the line subtotals. */
  .act-multiplier {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 8px;
    padding: 8px 12px;
    background: #f7fbf8;
    border: 1px solid #c9e6d3;
    border-radius: 8px;
    .mp-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      .mp-title {
        font-size: 11px;
        font-weight: 700;
        color: #4d8a63;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .mp-badge {
        background: #e8f6ee;
        color: #15693c;
        border: 1px solid #9ad8b4;
        border-radius: 10px;
        padding: 0 8px;
        font-size: 10px;
        line-height: 18px;
        font-weight: 700;
      }
    }
    .mp-mid {
      flex: 1 1 260px;
      font-size: 12px;
      color: #2f6746;
      .mp-arrow {
        margin: 0 6px;
        color: #15693c;
        font-weight: 700;
      }
      .mp-total {
        color: #15693c;
        font-weight: 800;
      }
      .mp-hint {
        color: #7a8a82;
        font-style: italic;
      }
    }
    .mp-btn {
      &.applied {
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
  }

  /* Save button: muted by default, green when dirty */
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

  /* Action row */
  .action-row {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 14px;
  }

  /* Zero-unit warning */
  .zero-warning {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 14px;
    background: #fff8eb;
    border: 1px solid #f3c97c !important;
    .zw-text {
      font-size: 12px;
      color: #8a4a00;
      flex: 1 1 320px;
      strong { color: #8a4a00; font-weight: 800; }
    }
    .zw-confirm {
      font-size: 12px;
      color: #8a4a00;
    }
  }

  /* Generated banner */
  .gen-banner {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 16px;
    background: linear-gradient(90deg, #f3fcf6 0%, #ffffff 100%);
    border: 1px solid #c9e6d3 !important;
    .gen-lbl {
      font-size: 10px;
      color: #4d8a63;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .gen-val {
      font-size: 16px;
      font-weight: 800;
      color: #15693c;
    }
    .gen-date {
      margin-left: auto;
      font-size: 11px;
      color: #7a8a82;
    }
    .gen-special {
      display: flex;
      flex-direction: column;
      padding-left: 14px;
      border-left: 1px solid #d7e3f5;
      .gen-special-lbl {
        font-size: 10px;
        color: #b85c00;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      .gen-special-val {
        font-size: 14px;
        font-weight: 800;
        color: #b85c00;
      }
    }
  }

  /* Source tag */
  .source-tag {
    margin-left: 6px;
    border-radius: 8px;
    border: none;
    font-size: 10px;
    line-height: 18px;
    padding: 0 8px;
    &.fallback { background: #eef3fb; color: #2f6dcf; }
    &.not_set  { background: #f0f2f5; color: #7a8a82; }
  }

  /* Special cost tag */
  .special-cost-tag {
    margin-left: 6px;
    border-radius: 8px;
    border: none;
    font-size: 10px;
    line-height: 18px;
    padding: 0 8px;
    background: #fff4e6;
    color: #b85c00;
    font-weight: 600;
  }

  /* Tables */
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
    .ant-table-tbody > tr.row-highlight > td { background: #fff9ec; }
    .ant-table-tbody > tr.row-zero > td {
      background: #fff5e6;
      box-shadow: inset 3px 0 0 #f3c97c;
    }
    .ant-table-tbody > tr.row-zero:hover > td { background: #ffeed1; }
    .ant-table-tbody > tr.row-special > td {
      background: #fffaf0;
      box-shadow: inset 3px 0 0 #b85c00;
    }
    .ant-table-tbody > tr.row-special:hover > td { background: #fff2dc; }
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
  }
}
</style>
