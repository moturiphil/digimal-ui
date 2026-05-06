<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="bp-min">
        <!-- Header -->
        <header class="bp-head">
          <div>
            <h3 class="bp-title">Sub-County Budgeting</h3>
            <p class="bp-sub">{{ subCounty.name }} · {{ subCounty.countyName }} County</p>
          </div>
          <a-tag class="stage-tag">{{ stage }}</a-tag>
        </header>

        <!-- Summary bar -->
        <div class="bp-summary" v-if="!loading && selectedActivities.length">
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
        <section v-if="loading" class="panel center"><a-spin /></section>
        <section v-else-if="!selectedActivities.length" class="panel center muted">No activities available.</section>
        <section v-else-if="!filteredActivities.length" class="panel center muted">
          No matches for “{{ searchTerm }}”.
          <a href="#" @click.prevent="searchTerm = ''">Clear</a>
        </section>

        <!-- Activity panels -->
        <section
          v-for="a in filteredActivities"
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
              </span>
              <span v-else-if="column.key === 'unit_cost'">{{ fmt(record.unit_cost) }}</span>
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
              <span v-else-if="column.key === 'total'">{{ fmt(rowTotal(record)) }}</span>
            </template>
          </a-table>

          <div class="act-foot" v-show="isExpanded(a.id)">
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
          v-if="!loading && selectedActivities.length && zeroUnitCount"
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
        <section v-if="!loading && selectedActivities.length" class="panel action-row">
          <sdButton
            class="pill-btn"
            size="small"
            :loading="regenerating"
            :disabled="zeroUnitCount > 0 && !zeroConfirmed"
            @click="regenerateBudget"
          >
            {{ generated ? 'Regenerate' : 'Generate' }}
          </sdButton>
          <sdButton
            type="dark"
            size="small"
            :loading="submitting"
            :disabled="!generated"
            @click="submitToCounty"
          >
            Submit to County
          </sdButton>
        </section>

        <!-- Generated banner -->
        <section v-if="generated" class="panel gen-banner">
          <span class="gen-lbl">Generated total</span>
          <span class="gen-val">KES {{ fmt(generated.total) }}</span>
          <span class="gen-date">{{ generated.date }}</span>
        </section>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

/* Normalise paginated/wrapped API payloads. */
const normalizePayload = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.categories)) return raw.categories;
  return [];
};

/* Convert the categories list returned by `get_budget_categories` into the
 * activity shape used by this page. Items are loaded lazily, on demand,
 * via `get_category_parameters_for_profile`. */
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
    }));

/* Convert the parameters array returned by `get_category_parameters_for_profile`
 * into row items consumed by the activity table. */
const paramsToItems = (params) =>
  (params || []).map((p) => ({
    category_parameter_profile_id: p.category_parameter_profile_id || null,
    category_parameter_id: p.category_parameter_id,
    parameter_id: p.parameter_id,
    parameter_key: p.parameter_key,
    description: p.parameter_label,
    item: p.parameter_label,
    tag: p.unit_definition,
    unit_cost: Number(p.unit_cost) || 0,
    units: p.total_units == null ? 0 : Number(p.total_units),
    total_cost: Number(p.total_cost) || 0,
    unit_source: p.unit_source || 'not_set',
    resolved_from: p.resolved_from || null,
    highlight: /fuel/i.test(p.parameter_key || ''),
  }));

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

    /* Resolve the user's profile id (sub-county scope). Required for the
     * new `get_category_parameters_for_profile` and update endpoints. */
    const resolveProfile = async () => {
      try {
        const { data } = await axios.get('get_my_county_profile');
        const id = data?.county_profile_id || data?.profile?.id || null;
        if (id) countyProfileId.value = id;
        if (data?.sub_county?.name || data?.sub_county_name) {
          subCounty.value.name =
            data?.sub_county?.name || data?.sub_county_name || subCounty.value.name;
        }
        if (data?.county?.name || data?.county_name) {
          subCounty.value.countyName =
            data?.county?.name || data?.county_name || subCounty.value.countyName;
        }
        return data;
      } catch (err) {
        notification.error({
          message: 'Failed to load profile',
          description: err?.response?.data?.message || err.message,
        });
        return null;
      }
    };

    /* Fetch active budget categories. The per-profile endpoint resolves
     * scope and inheritance server-side, so we don't filter by scope here
     * — that would hide categories the backend legitimately returns
     * parameters for. Parameters are fetched lazily on expand. */
    const loadActivities = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_budget_categories');
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

    /* Load (or reload) the parameters for a single activity from the new
     * per-profile endpoint. */
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
        activity.items = paramsToItems(payload.parameters);
        activity.total_parameters = Number(payload.total_parameters || 0);
        activity.set_count = Number(payload.set_count || 0);
        activity.fallback_count = Number(payload.fallback_count || 0);
        activity.not_set_count = Number(payload.not_set_count || 0);
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

    onMounted(async () => {
      await resolveProfile();
      await loadActivities();
      // Prefetch parameters for every activity so totals display in the
      // collapsed headers without requiring the user to expand each one.
      await Promise.all(
        activityCatalog.value.map((a) => loadActivityParameters(a)),
      );
    });

    const selectedActivities = computed(() =>
      selectedIds.value
        .map((id) => activityCatalog.value.find((a) => a.id === id))
        .filter(Boolean),
    );

    const rowTotal = (r) => {
      if (r && r.total_cost != null && r.total_cost !== 0) return r.total_cost;
      return (Number(r.unit_cost) || 0) * (Number(r.units) || 0);
    };
    const activityTotal = (a) =>
      (a.items || []).reduce((s, i) => s + rowTotal(i), 0);

    const grandTotal = computed(() =>
      selectedActivities.value.reduce((s, a) => s + activityTotal(a), 0),
    );

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
    watch(zeroUnitCount, () => {
      zeroConfirmed.value = false;
    });

    const rowClass = (r) => {
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
      { title: 'Units', key: 'units', align: 'right', width: 110 },
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
            message: 'Failed to generate sub-county budget',
            description: 'Could not determine the campaign budget id from the server response.',
          });
          return;
        }
        campaignBudgetId.value = budgetId;

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

        // Don't overwrite the activity tables from generated line items.
        // The tables reflect the persisted profile (via
        // `get_category_parameters_for_profile`) which is the source of
        // truth for what the user has actually set. Re-deriving units
        // from generated line items (which expand defaults for every
        // parameter) would make every row look "auto-populated".

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
      if (!campaignBudgetId.value) {
        notification.error({
          message: 'Cannot submit',
          description: 'Please generate the sub-county budget first.',
        });
        return;
      }
      submitting.value = true;
      try {
        await axios.post(`submit_campaign_budget/${campaignBudgetId.value}`);
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
      record.total_cost = (Number(record.unit_cost) || 0) * (Number(record.units) || 0);
      record._dirty = true;
      dirtyActivities.value = { ...dirtyActivities.value, [activity.id]: true };
    };

    /* Persist edited unit values for one activity. The backend exposes
     * `update_category_parameter_profile/{id}` with a body of
     * `{ total_units }` for both updates and (auto-)creates. */
    const saveRowProfile = (row) =>
      axios.put(
        `update_category_parameter_profile/${row.category_parameter_profile_id}`,
        { total_units: Number(row.units) || 0 },
      );

    const updateCategoryParameter = async (activity) => {
      if (!countyProfileId.value) {
        notification.error({
          message: 'Missing profile',
          description: 'Cannot save without a sub-county profile id.',
        });
        return;
      }
      const dirtyRows = (activity.items || []).filter((r) => r._dirty);
      if (!dirtyRows.length) return;

      // Quietly skip rows that genuinely have no profile id; they'll be
      // picked up after a refetch if the backend auto-creates them.
      const saveable = dirtyRows.filter((r) => r.category_parameter_profile_id);
      if (saveable.length < dirtyRows.length) {
        // eslint-disable-next-line no-console
        console.warn(
          '[updateCategoryParameter] skipping rows without profile id',
          dirtyRows.filter((r) => !r.category_parameter_profile_id),
        );
      }

      updatingActivityId.value = activity.id;
      try {
        await Promise.all(saveable.map(saveRowProfile));
        const next = { ...dirtyActivities.value };
        delete next[activity.id];
        dirtyActivities.value = next;
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
      zeroUnitCount,
      zeroConfirmed,
      rowClass,
    };
  },
};
</script>

<style lang="less" scoped>
.bp-min {
  /* Header */
  .bp-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }
  .bp-title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #1f2437;
  }
  .bp-sub {
    margin: 2px 0 0;
    font-size: 12px;
    color: #7a8a82;
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
