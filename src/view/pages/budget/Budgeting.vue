<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard">
        <!-- Slim top bar -->
        <div class="tool-bar"></div>

        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▤</span> Sub-County Budgeting
            </h3>
            <p class="ph-subtitle">
              {{ subCounty.name }} Sub-County — {{ subCounty.countyName }} County
            </p>
          </div>
          <div class="ph-actions">
            <a-tag class="stage-tag">{{ stage }}</a-tag>
          </div>
        </div>

        <!-- ───────── Workflow stepper ───────── -->
        <ol class="workflow-stepper" aria-label="Budgeting workflow">
          <li :class="['ws-step', { active: currentStep === 1, done: currentStep > 1 }]">
            <span class="ws-num">1</span>
            <div class="ws-text">
              <div class="ws-title">Review activities</div>
              <div class="ws-sub">Open each activity to inspect its parameters.</div>
            </div>
          </li>
          <li class="ws-sep" aria-hidden="true"></li>
          <li :class="['ws-step', { active: currentStep === 2, done: currentStep > 2 }]">
            <span class="ws-num">2</span>
            <div class="ws-text">
              <div class="ws-title">Adjust units</div>
              <div class="ws-sub">Edit unit counts and save category parameters.</div>
            </div>
          </li>
          <li class="ws-sep" aria-hidden="true"></li>
          <li :class="['ws-step', { active: currentStep === 3 }]">
            <span class="ws-num">3</span>
            <div class="ws-text">
              <div class="ws-title">Generate &amp; submit</div>
              <div class="ws-sub">Recalculate totals and forward to the County.</div>
            </div>
          </li>
        </ol>

        <!-- ───────── Sticky summary bar ───────── -->
        <div class="summary-bar" v-if="!loading && selectedActivities.length">
          <div class="sb-left">
            <div class="sb-stat">
              <div class="sb-label">Running total</div>
              <div class="sb-value">KES {{ fmt(grandTotal) }}</div>
            </div>
            <div class="sb-stat">
              <div class="sb-label">Activities</div>
              <div class="sb-value">{{ selectedActivities.length }}</div>
            </div>
            <div class="sb-stat" v-if="dirtyCount">
              <div class="sb-label">Unsaved edits</div>
              <div class="sb-value warn">{{ dirtyCount }}</div>
            </div>
          </div>
          <div class="sb-right">
            <a-input
              v-model:value="searchTerm"
              size="small"
              class="sb-search"
              placeholder="Filter activities…"
              allow-clear
            />
            <sdButton size="small" class="pill-btn" @click="expandAll">Expand all</sdButton>
            <sdButton size="small" class="pill-btn" @click="collapseAll">Collapse all</sdButton>
          </div>
        </div>

        <!-- ───────── Loading ───────── -->
        <section v-if="loading" class="panel">
          <div style="text-align:center; padding:32px 0;">
            <a-spin />
            <div style="margin-top:10px; color:#7a8a82; font-size:12px;">
              Loading category parameters…
            </div>
          </div>
        </section>

        <!-- ───────── Empty state ───────── -->
        <section
          v-else-if="!selectedActivities.length"
          class="panel empty-panel"
        >
          <div class="empty-icon">▤</div>
          <div class="empty-title">No activities available</div>
          <div class="empty-desc">
            We couldn't find any category parameters for your sub-county.
            Please contact your administrator if you believe this is an error.
          </div>
        </section>

        <!-- ───────── No filter matches ───────── -->
        <section
          v-else-if="!filteredActivities.length"
          class="panel empty-panel"
        >
          <div class="empty-icon">⌕</div>
          <div class="empty-title">No activities match “{{ searchTerm }}”</div>
          <div class="empty-desc">
            Try a different search term or
            <a href="#" @click.prevent="searchTerm = ''">clear the filter</a>.
          </div>
        </section>

        <!-- ───────── Per-activity tables ───────── -->
        <section
          v-for="a in filteredActivities"
          :key="a.id"
          :class="['panel', 'activity-panel', { 'is-dirty-panel': isActivityDirty(a.id) }]"
        >
          <div
            class="panel-head activity-head"
            role="button"
            tabindex="0"
            @click="toggleExpanded(a.id)"
            @keydown.enter.prevent="toggleExpanded(a.id)"
            @keydown.space.prevent="toggleExpanded(a.id)"
          >
            <div class="activity-title">
              <span :class="['caret', { open: isExpanded(a.id) }]" aria-hidden="true">▸</span>
              <span class="at-name">{{ a.order }}. {{ a.name }}</span>
              <a-tag class="item-count-tag">{{ a.items.length }} items</a-tag>
              <a-tag v-if="isActivityDirty(a.id)" class="dirty-tag">Unsaved</a-tag>
            </div>
            <div class="activity-total">
              <span class="at-label">Activity total</span>
              <strong>KES {{ fmt(activityTotal(a)) }}</strong>
              <span class="at-hint">{{ isExpanded(a.id) ? 'Click to hide' : 'Click to expand' }}</span>
            </div>
          </div>

          <div v-show="isExpanded(a.id)" class="activity-hint">
            <span class="hint-icon">ℹ</span>
            Edit the <strong>Units</strong> column to adjust quantities. Totals update live.
          </div>

          <a-table
            v-show="isExpanded(a.id)"
            :dataSource="a.items"
            :columns="itemColumns"
            :pagination="false"
            row-key="id"
            size="small"
            class="minimal-table activity-table"
            :row-class-name="(r) => (r.highlight ? 'row-highlight' : '')"
          >
            <template #bodyCell="{ column, record }">
              <span v-if="column.key === 'description'" class="desc-cell">
                {{ record.description }}
              </span>
              <span v-else-if="column.key === 'item'">
                {{ record.item }}
                <a-tag v-if="record.tag" class="row-tag">{{ record.tag }}</a-tag>
              </span>
              <span v-else-if="column.key === 'unit_cost'">{{ fmt(record.unit_cost) }}</span>
              <span v-else-if="column.key === 'days'">{{ record.days }}</span>
              <span v-else-if="column.key === 'units'">
                <a-input-number
                  :min="0"
                  :step="1"
                  size="small"
                  class="units-input"
                  :value="record.units"
                  @change="(val) => onUnitsChange(a, record, val)"
                />
              </span>
              <span v-else-if="column.key === 'total'">
                {{ fmt(rowTotal(record)) }}
                <span class="row-edit" v-if="record.highlight">✎</span>
              </span>
            </template>

            <template #summary>
              <a-table-summary fixed>
                <a-table-summary-row class="subtotal-row">
                  <a-table-summary-cell :index="0" :col-span="4" align="right">
                    <strong>Activity Subtotal</strong>
                  </a-table-summary-cell>
                  <a-table-summary-cell :index="4" align="right">
                    <strong>KES {{ fmt(activityTotal(a)) }}</strong>
                  </a-table-summary-cell>
                </a-table-summary-row>
              </a-table-summary>
            </template>
          </a-table>

          <div class="activity-foot" v-show="isExpanded(a.id)">
            <span v-if="isActivityDirty(a.id)" class="dirty-note">
              You have unsaved edits in this activity.
            </span>
            <a-tooltip
              :title="isActivityDirty(a.id) ? '' : 'Edit a unit value to enable saving.'"
            >
              <sdButton
                size="small"
                :class="['pill-btn', 'update-cat-param-btn', { 'is-dirty': isActivityDirty(a.id) }]"
                :disabled="!isActivityDirty(a.id)"
                :loading="updatingActivityId === a.id"
                @click="updateCategoryParameter(a)"
              >
                ✓ Save changes
              </sdButton>
            </a-tooltip>
          </div>
        </section>

        <!-- ───────── Step 3: Generate & Submit ───────── -->
        <section
          v-if="!loading && selectedActivities.length"
          class="panel submit-panel"
        >
          <div class="panel-head">
            <div>
              <div class="panel-title strong">
                <span class="step-pill">Step 3</span> Generate &amp; Submit
              </div>
              <p class="panel-subtitle">
                Regenerate the sub-county budget after changes, then submit it to the County for review.
              </p>
            </div>
          </div>

          <div v-if="dirtyCount" class="submit-warning">
            <span class="sw-icon">!</span>
            You have <strong>{{ dirtyCount }}</strong> unsaved
            {{ dirtyCount === 1 ? 'edit' : 'edits' }}. Save them before regenerating
            so they're included in the budget.
          </div>

          <div class="submit-grid">
            <div class="submit-card">
              <div class="sc-icon regen">↻</div>
              <div class="sc-body">
                <div class="sc-title">
                  1. Regenerate Budget
                  <a-tag v-if="generated" class="status-tag ok">Generated</a-tag>
                </div>
                <div class="sc-desc">
                  Recalculate totals after updating activities or unit costs.
                </div>
              </div>
              <sdButton
                class="pill-btn"
                size="small"
                @click="regenerateBudget"
                :loading="regenerating"
              >
                {{ generated ? 'Regenerate' : 'Generate' }}
              </sdButton>
            </div>

            <div :class="['submit-card', { primary: generated, locked: !generated }]">
              <div class="sc-icon send">✈</div>
              <div class="sc-body">
                <div class="sc-title">
                  2. Submit to County
                  <a-tag v-if="!generated" class="status-tag muted">Locked</a-tag>
                </div>
                <div class="sc-desc">
                  {{ generated
                    ? 'Lock the budget and forward it to the county team for approval.'
                    : 'Generate the budget first to enable submission.' }}
                </div>
              </div>
              <a-tooltip :title="!generated ? 'Generate the budget first.' : ''">
                <sdButton
                  type="dark"
                  size="small"
                  @click="submitToCounty"
                  :loading="submitting"
                  :disabled="!generated"
                >
                  Submit
                </sdButton>
              </a-tooltip>
            </div>
          </div>
        </section>

        <!-- ───────── Generated Sub-County Budget ───────── -->
        <section class="panel generated-panel" v-if="generated">
          <div class="gp-head">
            <div class="gp-left">
              <div class="gp-title">
                <span class="gp-icon">✓</span>
                Generated Sub-County Budget
              </div>
              <div class="gp-meta">
                <span>Generated on <strong>{{ generated.date }}</strong></span>
                <span class="sep">·</span>
                <span>{{ selectedActivities.length }} activities included</span>
                <span class="sep">·</span>
                <span>Ready to submit</span>
              </div>
            </div>
            <a-tag class="stage-tag">{{ stage }}</a-tag>
          </div>

          <div class="gp-body">
            <div class="gp-amount">
              <div class="gp-amount-label">Total Budget</div>
              <div class="gp-amount-value">
                <span class="currency">KES</span> {{ fmt(generated.total) }}
              </div>
            </div>
            <div class="gp-stats">
              <div class="gp-stat">
                <div class="gps-label">Standard Subtotal</div>
                <div class="gps-value">KES {{ fmt(generated.total) }}</div>
              </div>
              <div class="gp-stat">
                <div class="gps-label">Activities</div>
                <div class="gps-value">{{ selectedActivities.length }}</div>
              </div>
              <div class="gp-stat">
                <div class="gps-label">Sub-County</div>
                <div class="gps-value">{{ subCounty.name }}</div>
              </div>
            </div>
          </div>

          <div class="gp-actions">
            <sdButton size="small" class="pill-btn">⇩ Download PDF</sdButton>
            <sdButton size="small" class="pill-btn">⎘ View Breakdown</sdButton>
          </div>
        </section>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

/* Group category_parameters rows into activities.
 * Each unique category_id becomes one activity; rows under it become items.
 * Ordering follows first appearance in the payload. */
const groupIntoActivities = (rows) => {
  const map = new Map();
  let order = 0;
  rows.forEach((r) => {
    const cid = r.category_id;
    if (!map.has(cid)) {
      order += 1;
      map.set(cid, {
        id: cid,
        order,
        name: r.category_name,
        stage: r.category_stage,
        type: r.category_type,
        items: [],
      });
    }
    const cat = map.get(cid);
    cat.items.push({
      id: r.id,
      parameter_id: r.parameter_id,
      description: r.parameter_label,
      item: r.parameter_label,
      tag: r.unit_definition,
      unit_cost: Number(r.unit_cost) || 0,
      days: 1,
      units: 1,
      highlight: /fuel/i.test(r.parameter_key || ''),
    });
  });
  return Array.from(map.values());
};

/* Group generated budget line_items into activity panels. Uses the actual
 * computed values returned by the API (days, units, totals, special costs). */
const groupBudgetLineItems = (lineItems) => {
  const map = new Map();
  let order = 0;
  (lineItems || []).forEach((li) => {
    const cat = li.budget_category || {};
    const cid = li.budget_category_id || cat.id;
    if (!map.has(cid)) {
      order += 1;
      map.set(cid, {
        id: cid,
        order,
        name: cat.name || `Category ${cid}`,
        stage: cat.stage,
        type: cat.type,
        items: [],
      });
    }
    const param = li.budget_parameter || {};
    map.get(cid).items.push({
      id: li.id,
      parameter_id: li.budget_parameter_id || param.id,
      description: li.label || param.label,
      item: li.label || param.label,
      tag: li.unit_definition || param.unit_definition,
      unit_cost: parseFloat(li.unit_cost) || 0,
      days: Number(li.number_of_days) || 0,
      units: Number(li.unit_count) || 0,
      total_cost: parseFloat(li.total_cost) || 0,
      is_special_cost: !!li.is_special_cost,
      special_type: li.special_type,
      sort_order: Number(li.sort_order) || 0,
      highlight: /fuel/i.test(param.key || ''),
    });
  });
  // Sort items inside each activity by sort_order to match API ordering
  Array.from(map.values()).forEach((a) => {
    a.items.sort((x, y) => (x.sort_order || 0) - (y.sort_order || 0));
  });
  return Array.from(map.values());
};

/* Resolve the active sub-county from session or route. */
const resolveSubCounty = () => {
  try {
    const raw = sessionStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      const u = parsed?.user || parsed;
      const sc = u?.sub_county || u?.subCounty || null;
      const co = u?.county || null;
      return {
        id: u?.sub_county_id || sc?.id || null,
        name: sc?.name || u?.sub_county_name || 'Sub-County',
        countyName: co?.name || u?.county_name || 'County',
      };
    }
  } catch (e) {
    /* noop */
  }
  return { id: null, name: 'Sub-County', countyName: 'County' };
};

export default {
  name: 'SubCountyBudgeting',
  components: { Main, RecordViewWrapper, BudgetPageWrapper },
  setup() {
    const subCounty = ref(resolveSubCounty());
    const stage = ref('Preparatory Stage');

    const loading = ref(false);
    const activityCatalog = ref([]);
    const selectedIds = ref([]);
    const expandedIds = ref([]);
    const searchTerm = ref('');

    const isExpanded = (id) => expandedIds.value.includes(id);
    const toggleExpanded = (id) => {
      expandedIds.value = isExpanded(id)
        ? expandedIds.value.filter((x) => x !== id)
        : [...expandedIds.value, id];
    };
    const expandAll = () => {
      expandedIds.value = activityCatalog.value.map((a) => a.id);
    };
    const collapseAll = () => {
      expandedIds.value = [];
    };

    const regenerating = ref(false);
    const submitting = ref(false);
    const generated = ref(null);
    const countyProfileId = ref(null);

    const loadCategoryParameters = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_category_parameters');
        const rows = Array.isArray(data) ? data : data?.data || [];
        activityCatalog.value = groupIntoActivities(rows);
        selectedIds.value = activityCatalog.value.map((a) => a.id);
        expandedIds.value = [];
      } catch (err) {
        notification.error({
          message: 'Failed to load category parameters',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadCategoryParameters);

    const selectedActivities = computed(() =>
      selectedIds.value
        .map((id) => activityCatalog.value.find((a) => a.id === id))
        .filter(Boolean),
    );

    const rowTotal = (r) => {
      if (r && r.total_cost != null && r.total_cost !== 0) return r.total_cost;
      return (r.unit_cost || 0) * (r.days || 0) * (r.units || 0);
    };
    const activityTotal = (a) =>
      a.items.reduce((s, i) => s + rowTotal(i), 0);

    const grandTotal = computed(() =>
      selectedActivities.value.reduce((s, a) => s + activityTotal(a), 0),
    );

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
      { title: 'Days', key: 'days', align: 'right', width: 90 },
      { title: 'Units', key: 'units', align: 'right', width: 90 },
      { title: 'Total (KES)', key: 'total', align: 'right', width: 140 },
    ];

    const regenerateBudget = async () => {
      regenerating.value = true;
      try {
        // 1) Fetch the user's profile (county or sub-county scope)
        const { data: profileResp } = await axios.get('get_my_county_profile');

        // 2) Reject users without a sub-county profile
        if (!profileResp || profileResp.level !== 'sub_county') {
          notification.error({
            message: 'Access denied',
            description:
              'Only sub-county users can generate a sub-county budget. Your profile is not a sub-county profile.',
          });
          return;
        }

        const profileId =
          profileResp.county_profile_id || profileResp.profile?.id;
        if (!profileId) {
          notification.error({
            message: 'Missing sub-county profile',
            description: 'Unable to determine your county profile id.',
          });
          return;
        }
        countyProfileId.value = profileId;

        const financialYear = String(new Date().getFullYear());

        // 3) Create the campaign budget
        await axios.post('create_campaign_budget', {
          county_profile_id: profileId,
          financial_year: financialYear,
        });

        // 4) Generate the campaign budget
        const { data: genResp } = await axios.post(
          `generate_campaign_budget/${profileId}`,
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

        // Replace activity tables with API-computed line items
        if (Array.isArray(budget?.line_items) && budget.line_items.length) {
          activityCatalog.value = groupBudgetLineItems(budget.line_items);
          selectedIds.value = activityCatalog.value.map((a) => a.id);
        }

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

        notification.success({ message: 'Sub-County budget generated.' });
      } catch (err) {
        notification.error({
          message: 'Failed to generate sub-county budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        regenerating.value = false;
      }
    };

    const submitToCounty = async () => {
      if (!countyProfileId.value) {
        notification.error({
          message: 'Cannot submit',
          description: 'Please generate the sub-county budget first.',
        });
        return;
      }
      submitting.value = true;
      try {
        await axios.post(`submit_campaign_budget/${countyProfileId.value}`);
        notification.success({
          message: 'Sub-County budget submitted to County.',
        });
      } catch (err) {
        notification.error({
          message: 'Failed to submit sub-county budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        submitting.value = false;
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

    // Workflow stepper state: 1 = review, 2 = adjusting, 3 = ready to generate/submit
    const currentStep = computed(() => {
      if (generated.value) return 3;
      if (dirtyCount.value > 0) return 2;
      if (expandedIds.value.length > 0) return 2;
      return 1;
    });

    const onUnitsChange = (activity, record, val) => {
      const next = Number.isFinite(Number(val)) ? Number(val) : 0;
      record.units = next < 0 ? 0 : next;
      // Recompute total_cost so the table totals reflect the edit immediately
      if (record.unit_cost != null && record.days != null) {
        record.total_cost =
          (Number(record.unit_cost) || 0) *
          (Number(record.days) || 0) *
          (Number(record.units) || 0);
      }
      dirtyActivities.value = { ...dirtyActivities.value, [activity.id]: true };
    };

    const updateCategoryParameter = async (activity) => {
      updatingActivityId.value = activity.id;
      try {
        // No backend update endpoint is wired yet; persist locally and notify.
        // When the API becomes available, send activity.items here.
        const next = { ...dirtyActivities.value };
        delete next[activity.id];
        dirtyActivities.value = next;
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
      subCounty,
      stage,
      loading,
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
      submitToCounty,
      generated,
      fmt,
      isActivityDirty,
      dirtyCount,
      currentStep,
      onUnitsChange,
      updateCategoryParameter,
      updatingActivityId,
    };
  },
};
</script>

<style lang="less" scoped>
.minimal-dashboard {
  .stage-tag {
    background: #eef3fb;
    color: #2f6dcf;
    border: 1px solid #d7e3f5;
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 11px;
    font-weight: 600;
  }

  .panel-title.strong {
    color: #1f2437;
    font-size: 13px;
    font-weight: 700;
  }

  .pill-btn {
    background: #fff !important;
    border: 1px solid #e1e6ec !important;
    color: #4d5661 !important;
    border-radius: 6px;
    font-weight: 600;
    &:hover,
    &:focus {
      border-color: #9ad8b4 !important;
      color: #15693c !important;
    }
  }

  /* ===== Workflow stepper ===== */
  .workflow-stepper {
    list-style: none;
    margin: 4px 0 16px;
    padding: 14px 18px;
    display: flex;
    align-items: stretch;
    gap: 8px;
    background: #ffffff;
    border: 1px solid #e6ecef;
    border-radius: 12px;
    overflow-x: auto;
  }
  .ws-step {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    flex: 1 1 0;
    min-width: 180px;
    padding: 4px 6px;
    border-radius: 8px;
    transition: background 0.15s;
    .ws-num {
      width: 26px; height: 26px;
      border-radius: 50%;
      background: #eef1f5;
      color: #7a8a82;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ws-text { line-height: 1.2; }
    .ws-title {
      font-size: 12px;
      font-weight: 700;
      color: #5a6470;
    }
    .ws-sub {
      font-size: 11px;
      color: #9aa6ad;
      margin-top: 2px;
    }
    &.active {
      background: #f3fcf6;
      .ws-num { background: #15693c; color: #fff; }
      .ws-title { color: #15693c; }
    }
    &.done {
      .ws-num { background: #c9e6d3; color: #15693c; }
      .ws-title { color: #2f6746; }
    }
  }
  .ws-sep {
    align-self: center;
    flex: 0 0 28px;
    height: 1px;
    background: #e1e6ec;
  }

  /* ===== Sticky summary bar ===== */
  .summary-bar {
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding: 10px 14px;
    margin-bottom: 12px;
    background: rgba(255,255,255,0.96);
    backdrop-filter: blur(6px);
    border: 1px solid #e6ecef;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(28, 122, 72, 0.04);
    .sb-left {
      display: flex;
      gap: 22px;
      flex-wrap: wrap;
    }
    .sb-stat .sb-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #9aa6ad;
      font-weight: 600;
    }
    .sb-stat .sb-value {
      font-size: 14px;
      font-weight: 800;
      color: #15693c;
      &.warn { color: #d97706; }
    }
    .sb-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .sb-search { width: 200px; }
  }

  /* ===== Empty state ===== */
  .empty-panel {
    text-align: center;
    padding: 36px 20px;
    .empty-icon {
      font-size: 28px;
      color: #c9cfd8;
      margin-bottom: 10px;
    }
    .empty-title {
      font-size: 14px;
      font-weight: 700;
      color: #1f2437;
      margin-bottom: 6px;
    }
    .empty-desc {
      font-size: 12px;
      color: #7a8a82;
      max-width: 460px;
      margin: 0 auto;
      a { color: #15693c; font-weight: 600; }
    }
  }

  /* Activity panels */
  .activity-panel {
    padding-top: 14px;
    padding-bottom: 14px;
    transition: border-color 0.15s, box-shadow 0.15s;
    &.is-dirty-panel {
      border-color: #f3c97c !important;
      box-shadow: 0 2px 8px rgba(217, 119, 6, 0.08);
    }
  }
  .panel-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
  }
  .activity-head {
    cursor: pointer;
    user-select: none;
    border-radius: 8px;
    padding: 4px 6px;
    margin: -4px -6px 6px;
    transition: background 0.12s;
    &:hover { background: #f7faf8; }
    &:focus-visible { outline: 2px solid #9ad8b4; outline-offset: 2px; }
  }
  .activity-title {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    .at-name {
      font-size: 13px;
      font-weight: 700;
      color: #1f2437;
    }
    .caret {
      display: inline-block;
      color: #9aa6ad;
      font-size: 12px;
      transition: transform 0.15s;
      &.open { transform: rotate(90deg); color: #15693c; }
    }
    .item-count-tag {
      background: #eef3fb;
      color: #2f6dcf;
      border: 1px solid #d7e3f5;
      border-radius: 10px;
      padding: 0 8px;
      font-size: 10px;
      line-height: 18px;
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
  }
  .activity-total {
    font-size: 12px;
    color: #5a5f7d;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: right;
    .at-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      color: #9aa6ad;
      font-weight: 600;
    }
    strong { color: #15693c; font-weight: 800; font-size: 13px; }
    .at-hint {
      font-size: 10px;
      color: #9aa6ad;
      padding-left: 10px;
      border-left: 1px dashed #e1e6ec;
    }
  }

  .activity-hint {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f3fcf6;
    border: 1px dashed #c9e6d3;
    color: #2f6746;
    border-radius: 6px;
    font-size: 11px;
    padding: 4px 10px;
    margin: 0 0 10px;
    .hint-icon { color: #15693c; font-weight: 700; }
    strong { color: #15693c; }
  }

  .units-input {
    width: 80px;
  }

  /* Update Category Parameter button: muted by default, green when dirty */
  .update-cat-param-btn {
    transition: all 0.15s ease-in-out;
    &[disabled],
    &.is-disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    &.is-dirty {
      background: #1f9254 !important;
      border-color: #1f9254 !important;
      color: #ffffff !important;
      box-shadow: 0 1px 2px rgba(31, 146, 84, 0.25);
      &:hover,
      &:focus {
        background: #167a45 !important;
        border-color: #167a45 !important;
        color: #ffffff !important;
      }
    }
  }

  .activity-foot {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin-top: 10px;
    .dirty-note {
      font-size: 11px;
      color: #b35a00;
      font-weight: 600;
    }
  }

  /* ===== Step 3 — submit panel ===== */
  .submit-panel .panel-subtitle {
    margin: 2px 0 0;
    font-size: 12px;
    color: #7a8a82;
    max-width: 640px;
  }
  .submit-panel .step-pill {
    display: inline-block;
    background: #15693c;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    border-radius: 10px;
    padding: 2px 8px;
    margin-right: 8px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .submit-warning {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 8px 12px;
    background: #fff8eb;
    border: 1px solid #f3c97c;
    border-radius: 8px;
    color: #8a4a00;
    font-size: 12px;
    .sw-icon {
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #f3c97c;
      color: #fff;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    strong { color: #8a4a00; }
  }
  .status-tag {
    margin-left: 8px;
    border-radius: 10px;
    font-size: 10px;
    line-height: 18px;
    padding: 0 8px;
    border: 1px solid transparent;
    &.ok {
      background: #e3faf3;
      color: #15693c;
      border-color: #c9e6d3;
    }
    &.muted {
      background: #f0f2f5;
      color: #7a8a82;
      border-color: #e1e6ec;
    }
  }
  .submit-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 14px;
    @media (max-width: 780px) { grid-template-columns: 1fr; }
  }
  .submit-card {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff;
    border: 1px solid #e6ecef;
    border-radius: 10px;
    padding: 14px 16px;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
    &:hover {
      border-color: #c9e6d3;
      box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
      transform: translateY(-1px);
    }
    &.primary {
      background: linear-gradient(90deg, #f3fcf6 0%, #eaf7ef 100%);
      border-color: #c9e6d3;
    }
    &.locked {
      background: #fafbfc;
      border-style: dashed;
      .sc-title, .sc-desc { color: #9aa6ad; }
      .sc-icon.send { background: #c9cfd8; }
    }
    .sc-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      flex-shrink: 0;
      &.regen { background: #eef3fb; color: #2f6dcf; }
      &.send  { background: #15693c; color: #fff; }
    }
    .sc-body { flex: 1; min-width: 0; }
    .sc-title {
      font-size: 13px;
      font-weight: 700;
      color: #1f2437;
    }
    .sc-desc {
      margin-top: 2px;
      font-size: 11px;
      color: #7a8a82;
      line-height: 1.35;
    }
  }

  /* ===== Generated Sub-County Budget ===== */
  .generated-panel {
    background: linear-gradient(135deg, #f3fcf6 0%, #ffffff 60%, #f4fbf6 100%) !important;
    border-color: #c9e6d3 !important;
  }
  .gp-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }
  .gp-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #1f2437;
    .gp-icon { color: #15693c; }
  }
  .gp-meta {
    margin-top: 4px;
    font-size: 11px;
    color: #7a8a82;
    .sep { margin: 0 6px; color: #c9cfd8; }
    strong { color: #1f2437; font-weight: 700; }
  }
  .gp-body {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) 2fr;
    gap: 16px;
    align-items: stretch;
    @media (max-width: 780px) { grid-template-columns: 1fr; }
  }
  .gp-amount {
    background: #fff;
    border: 1px solid #c9e6d3;
    border-radius: 10px;
    padding: 16px 18px;
    .gp-amount-label {
      font-size: 11px;
      color: #4d8a63;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .gp-amount-value {
      margin-top: 4px;
      font-size: 26px;
      font-weight: 800;
      color: #15693c;
      line-height: 1.1;
      .currency {
        font-size: 13px;
        font-weight: 700;
        color: #4d8a63;
        margin-right: 4px;
      }
    }
  }
  .gp-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    @media (max-width: 560px) { grid-template-columns: 1fr; }
  }
  .gp-stat {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 10px;
    padding: 14px 16px;
    .gps-label {
      font-size: 11px;
      color: #7a8a82;
      margin-bottom: 4px;
    }
    .gps-value {
      font-size: 14px;
      font-weight: 700;
      color: #1f2437;
    }
  }
  .gp-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 14px;
    flex-wrap: wrap;
  }

  /* Row-level highlight and tags inside tables */
  :deep(.activity-table) {
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
    .row-edit {
      margin-left: 8px;
      color: #8a9399;
      cursor: pointer;
    }
    .subtotal-row {
      .ant-table-cell {
        background: #f6f8fb;
        color: #1f2437;
        font-weight: 700;
        border-top: 1px solid #e3e5ec;
        border-bottom: none;
      }
    }
  }
}
</style>
