<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper>
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="bp-title">
              <span class="ph-icon">✦</span> Special Area Cost Budget
            </h3>
            <p class="bp-sub">
              A separate budget from the standard campaign budget. It is submitted on its own and
              pushed <strong>directly to National</strong> — the county stage is skipped. The
              National Accountant (or Super Admin) reviews it, then the Finance Officer (or Super
              Admin) approves it.
            </p>
          </div>
          <div v-if="subCounty.name || subCounty.countyName" class="header-tags">
            <a-tag v-if="subCounty.countyName" class="scope-tag">{{ subCounty.countyName }}</a-tag>
            <a-tag v-if="subCounty.name" class="scope-tag">{{ subCounty.name }}</a-tag>
            <a-tag class="special-pill">Special Area Cost</a-tag>
          </div>
        </div>

        <div class="sab-body">
          <!-- Resolving the role / locale scope ------------------------------ -->
          <section v-if="scopeLoading" class="sab-loading"><a-spin /></section>

          <!-- The role does not own a SAC budget (not CMCC / SCMCC / admin) -->
          <section v-else-if="scopeMessage" class="panel sab-notice">
            <a-alert type="info" show-icon :message="scopeMessage" />
          </section>

          <template v-else>
            <!-- Super Admin override: choose the locale to work on -->
            <section v-if="scope.is_super_admin" class="panel sab-picker">
              <div class="sab-picker-row">
                <span class="sab-picker-label">Locale</span>
                <a-select
                  v-model:value="selectedProfileId"
                  show-search
                  allow-clear
                  option-filter-prop="label"
                  placeholder="Choose a Special Area Cost county or sub-county…"
                  :loading="loadingProfiles"
                  :options="profileOptions"
                  class="sab-picker-select"
                  @change="onProfilePicked"
                />
              </div>
              <p class="sab-hint">
                Super Admin override — pick the county (CMCC) or sub-county (SCMCC) whose
                Special Area Cost budget you want to work on.
              </p>
            </section>

            <section
              v-if="scope.is_super_admin && !countyProfileId"
              class="panel sab-notice"
            >
              <a-alert
                type="info"
                show-icon
                message="No locale selected"
                description="Pick a Special Area Cost county or sub-county above to load its budget."
              />
            </section>

            <template v-else>
              <!-- Not SAC-mapped -->
              <section v-if="!loading && !isSpecialAreaMapped" class="panel sab-notice">
                <a-alert
                  type="info"
                  show-icon
                  message="This unit is not mapped as a Special Area Cost area"
                  description="A Special Area Cost budget only exists for units flagged as Special Area Cost applicable. Ask an administrator to map this unit in Special Area Costs → County / Sub-County Mapping."
                />
              </section>

              <template v-else>
                <BudgetReferralBanner
                  v-if="isReferred"
                  :is-referred="isReferred"
                  :referrer="referredBy"
                  :referred-at="referredAt"
                  :message="referralMessage"
                />

                <!-- Owner status card (once the SAC budget has left draft) -->
                <BudgetStatusCard
                  v-if="showStatusCard"
                  title="Special Area Cost Budget"
                  :status="budgetStatus || 'draft'"
                  :is-referred="isReferred"
                  :is-sub-county="false"
                  :financial-year="budgetFinancialYear"
                  :grand-total="grandTotal"
                  :submitted-at="budgetSubmittedAt"
                  @click="openDetail"
                />

                <div v-if="loading && !showStatusCard" class="sab-loading"><a-spin /></div>

                <!-- Editor (draft, or after the owner clicks the status card) -->
                <template v-else-if="!showStatusCard">
                  <!-- Summary -->
                  <section v-if="selectedActivities.length" class="panel sab-summary">
                    <div class="sab-summary-row">
                      <span class="sab-summary-label">Budget categories</span>
                      <span class="sab-summary-value">{{ selectedActivities.length }}</span>
                    </div>
                    <div class="sab-summary-row">
                      <span class="sab-summary-label">Special Area Cost total</span>
                      <span class="sab-summary-value">KES {{ fmt(sacTotal) }}</span>
                    </div>
                    <div class="sab-summary-row">
                      <span class="sab-summary-label">Status</span>
                      <span class="sab-summary-value">{{ budgetStatus || 'Not created' }}</span>
                    </div>
                  </section>

                  <!-- SAC entry grid — editable while draft, read-only once generated -->
                  <SpecialAreaCostsSection
                    v-if="selectedActivities.length"
                    :categories="selectedActivities"
                    :view-mode="isDraft ? 'profile' : 'generated'"
                    :read-only="!isDraft"
                    :entries="sacEntries"
                    :items="sacItems"
                    :get-generated-row="sacGeneratedRow"
                    :save-entries="saveSacCategory"
                    :fmt="fmt"
                    @sync="onSacSync"
                  />

                  <!-- Action row -->
                  <section class="panel sab-actions">
                    <a-tag color="geekblue" style="margin-right: auto">
                      Goes directly to National — no county approval
                    </a-tag>

                    <sdButton
                      v-if="isDraft"
                      class="pill-btn sab-submit-btn"
                      size="small"
                      :loading="submitting || creating"
                      :disabled="!sacRows.length && !campaignBudgetId"
                      @click="submitSacBudget"
                    >
                      {{ campaignBudgetId ? 'Submit to National' : 'Create & Submit to National' }}
                    </sdButton>

                    <sdButton
                      v-if="isDraft && campaignBudgetId"
                      size="small"
                      :loading="voiding"
                      @click="voidModal.open = true"
                    >
                      Void
                    </sdButton>

                    <sdButton size="small" :disabled="loading" @click="reload">Refresh</sdButton>
                  </section>

                </template>
              </template>
            </template>
          </template>
        </div>

        <a-modal
          v-model:visible="voidModal.open"
          title="Void this Special Area Cost budget"
          :ok-text="voiding ? 'Voiding…' : 'Void budget'"
          :ok-button-props="{ danger: true }"
          :confirm-loading="voiding"
          @ok="voidSacBudget"
        >
          <p>
            Voiding discards this Special Area Cost budget so a fresh one can be created for the
            same locale. Provide a reason for the audit trail.
          </p>
          <a-textarea
            v-model:value="voidModal.reason"
            :rows="3"
            :maxlength="500"
            placeholder="Why is this budget being voided? (min 10 characters)"
          />
        </a-modal>
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
import BudgetStatusCard from './BudgetStatusCard.vue';
import BudgetReferralBanner from './BudgetReferralBanner.vue';
import SpecialAreaCostsSection from './SpecialAreaCostsSection.vue';
import { fetchSacItems, fallbackSacItems } from '@/services/specialAreaCosts';

/*
 * Special Area Cost (SAC) budget — the SEPARATE budget for a SAC-mapped
 * sub-county.
 *
 * Why it is separate:
 *   The standard budget (Budgeting.vue) walks
 *     draft → submitted → county_approved → dnmp_reviewed → approved.
 *   The SAC budget is its own record (campaign_budgets.budget_type =
 *   'special_area'), carries ONLY Special Area Cost line items, and is
 *   submitted on its own:
 *     draft → submitted → dnmp_reviewed → approved
 *   It is pushed straight to National for review by the National Accountant
 *   (or Super Admin) and approved by the Finance Officer (or Super Admin).
 *
 * WHO budgets it, and for which locale:
 *   It is budgeted by the management committee of its OWN locale —
 *     • county SAC     → CMCC, for its own county
 *     • sub-county SAC → SCMCC, for its own sub-county
 *   Super Admin may work on any locale (documented override).
 *   The backend enforces this (SpecialAreaBudgetAccessService); this page
 *   resolves the locale from `get_special_area_budget_scope` so a CMCC /
 *   SCMCC user is pinned to their own county / sub-county automatically.
 *
 * Endpoints used:
 *   GET  get_special_area_budget_scope                (role + locale)
 *   GET  get_campaign_budgets?county_profile_id=&budget_type=special_area
 *   GET  get_budget_categories?scope=sub_county
 *   GET  get_special_area_cost_entries?county_profile_id=
 *   GET  get_special_area_cost_items
 *   PUT  save_special_area_cost_entries
 *   POST create_campaign_budget            { budget_type: 'special_area' }
 *   POST submit_special_area_budget/{id}
 *   POST void_campaign_budget/{id}
 *   GET  get_county_profiles               (Super Admin locale picker)
 */
export default {
  name: 'SpecialAreaBudget',
  components: {
    Main,
    RecordViewWrapper,
    BudgetPageWrapper,
    BudgetStatusCard,
    BudgetReferralBanner,
    SpecialAreaCostsSection,
  },
  setup() {
    // ── Role / locale scope ────────────────────────────────────────────────
    // Resolved from `get_special_area_budget_scope`: the SAC budget belongs to
    // the management committee of its own locale — CMCC for a county, SCMCC for
    // a sub-county. A Super Admin gets both levels and a picker.
    const scopeLoading = ref(true);
    const scope = ref({});
    const scopeMessage = ref(null);
    const selectedProfileId = ref(null);
    const profileOptions = ref([]);
    const loadingProfiles = ref(false);

    const loading = ref(false);
    const creating = ref(false);
    const submitting = ref(false);
    const voiding = ref(false);

    const countyProfileId = ref(null);
    const subCounty = ref({ name: '', countyName: '' });

    // The SAC budget record for this profile (one at a time, draft → approved).
    const campaignBudgetId = ref(null);
    const budgetStatus = ref(null);
    const budgetFinancialYear = ref(null);
    const budgetSubmittedAt = ref(null);
    const grandTotal = ref(0);
    const showStatusCard = ref(false);

    const isSpecialAreaMapped = ref(false);

    // Referral state (set by `reject_campaign_budget` at the national stage).
    const isReferred = ref(false);
    const referredAt = ref(null);
    const referralMessage = ref('');
    const referredBy = ref(null);

    // Categories + SAC catalogue + staged entries.
    const activityCatalog = ref([]);
    const sacItems = ref(fallbackSacItems());
    const sacEntries = ref([]);
    const sacRows = ref([]);

    const voidModal = ref({ open: false, reason: '' });

    let sacItemsLoaded = false;
    let sacEntriesLoaded = false;

    // ── Derived state ──────────────────────────────────────────────────────
    const selectedActivities = computed(() => activityCatalog.value);

    const isDraft = computed(() => !budgetStatus.value || budgetStatus.value === 'draft');

    /** Days inherited from the standard budget's category (read-only). */
    const daysOf = (category) => {
      const d = Number(category?.default_days || 0);
      return d > 0 ? d : 1;
    };

    const fmt = (value) => Number(value || 0).toLocaleString();

    // Profile-mode total (the staged rows the officer has entered).
    const sacTotal = computed(() =>
      sacRows.value.reduce(
        (sum, r) => {
          const category = selectedActivities.value.find(
            (a) => a.id === r.budget_category_id,
          );
          return sum + (Number(r.amount) || 0) * (Number(r.units) || 0) * daysOf(category);
        },
        0,
      ),
    );

    /** Generated-mode row resolver for the read-only SAC grid. */
    const sacGeneratedRow = (category, item) => {
      if (!category) return { amount: 0, units: 0, comment: '', total: 0 };
      const li = (category.items || []).find(
        (r) => r.is_special_cost && r.special_type === item.type,
      );
      if (!li) return { amount: 0, units: 0, comment: '', total: 0 };
      return {
        amount: Number(li.unit_cost) || 0,
        units: Number(li.units) || 0,
        comment: li.special_area_comment || '',
        total: Number(li.total_cost) || 0,
      };
    };

    // ── Data loading ───────────────────────────────────────────────────────

    const normalizePayload = (raw) => {
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.data)) return raw.data;
      if (Array.isArray(raw?.categories)) return raw.categories;
      return [];
    };

    /** `get_budget_categories` rows → the shape the SAC section consumes. */
    const categoriesToActivities = (cats) =>
      cats
        .slice()
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((c, i) => ({
          id: c.id,
          order: i + 1,
          name: c.name,
          description: c.description || '',
          default_days: Number(c.default_days || 1),
          items: [],
        }));

    const loadActivities = async () => {
      const { data } = await axios.get('get_budget_categories', {
        params: { scope: 'sub_county' },
      });
      // Only categories selected for Special Area Cost (managed by the
      // National Accountant / Super Admin on the Special Area Cost →
      // Budget Categories tab) render SAC rows here. Missing flag = allowed,
      // so older responses keep working.
      const cats = normalizePayload(data).filter(
        (c) =>
          (c.is_active === undefined || !!c.is_active) &&
          c.allows_special_costs !== false,
      );
      activityCatalog.value = categoriesToActivities(cats);
    };

    const loadSacItems = async () => {
      if (sacItemsLoaded) return;
      sacItemsLoaded = true;
      const items = await fetchSacItems();
      if (items.length) sacItems.value = items;
    };

    const loadSacEntries = async () => {
      if (sacEntriesLoaded || !countyProfileId.value) return;
      sacEntriesLoaded = true;
      try {
        const { data } = await axios.get('get_special_area_cost_entries', {
          params: { county_profile_id: countyProfileId.value },
        });
        const payload = data?.data || data || {};
        sacEntries.value = Array.isArray(payload.entries) ? payload.entries : [];
      } catch (err) {
        sacEntries.value = [];
      }
    };

    /** Raw generated `line_items` → the read-only row shape the grid uses. */
    const lineItemsToItems = (items) =>
      (items || [])
        .slice()
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((li) => ({
          item: li.label,
          label: li.label,
          unit_cost: Number(li.unit_cost) || 0,
          days: Number(li.number_of_days) || 1,
          units: Number(li.unit_count) || 0,
          total_cost: Number(li.total_cost) || 0,
          sort_order: li.sort_order,
          is_special_cost: !!li.is_special_cost,
          special_type: li.special_type || null,
          special_area_comment: li.special_area_comment || null,
        }));

    /** Read back the generated SAC line items for a non-draft budget. */
    const loadGeneratedItems = async (budgetId) => {
      try {
        const { data } = await axios.get(`get_budget_line_items/${budgetId}`);
        const payload = data?.data || data || {};
        const grouped = payload.line_items;

        // `get_budget_line_items` groups the rows BY CATEGORY, so line_items is
        // normally an object keyed by budget_category_id. Flatten either shape
        // and bucket the rows onto their category.
        const byCategory = (() => {
          if (Array.isArray(grouped)) {
            return grouped.reduce((acc, li) => {
              const key = String(li.budget_category_id);
              (acc[key] = acc[key] || []).push(li);
              return acc;
            }, {});
          }
          return grouped && typeof grouped === 'object' ? grouped : {};
        })();

        activityCatalog.value = activityCatalog.value.map((cat) => ({
          ...cat,
          items: lineItemsToItems(byCategory[String(cat.id)]),
        }));
      } catch (err) {
        // Non-fatal — the section simply renders zeros.
      }
    };

    /** Resolve the profile flag + names. */
    const loadProfile = async () => {
      try {
        const { data } = await axios.get(`get_county_profile/${countyProfileId.value}`);
        const profile = data?.data || data || {};
        isSpecialAreaMapped.value = !!profile.is_special_area_cost;
        if (profile.sub_county_name) subCounty.value.name = profile.sub_county_name;
        if (profile.county_name) subCounty.value.countyName = profile.county_name;
      } catch (err) {
        isSpecialAreaMapped.value = false;
      }
    };

    /** Load the SAC budget record for this profile (if one exists). */
    const loadSacBudget = async () => {
      try {
        const { data } = await axios.get('get_campaign_budgets', {
          params: {
            county_profile_id: countyProfileId.value,
            budget_type: 'special_area',
          },
        });
        const rows = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

        // The list is newest-first; pick the newest non-voided SAC budget.
        const active = rows.find(
          (b) => b.budget_type === 'special_area' && b.status !== 'voided',
        );

        if (!active) {
          campaignBudgetId.value = null;
          budgetStatus.value = null;
          showStatusCard.value = false;
          return;
        }

        campaignBudgetId.value = active.id;
        budgetStatus.value = active.status;
        budgetFinancialYear.value = active.financial_year || null;
        budgetSubmittedAt.value = active.submitted_at || null;
        grandTotal.value = Number(active.grand_total) || 0;
        isReferred.value = !!active.is_referred;
        referredAt.value = active.referred_at || null;
        referralMessage.value = active.referral_message || '';
        referredBy.value =
          active.referred_by && typeof active.referred_by === 'object'
            ? active.referred_by
            : null;

        // Anything past draft opens on the status card first.
        showStatusCard.value = !['draft'].includes(active.status);
      } catch (err) {
        campaignBudgetId.value = null;
        budgetStatus.value = null;
      }
    };

    // ── Bootstrap ──────────────────────────────────────────────────────────

    const bootstrap = async () => {
      if (!countyProfileId.value) return;

      loading.value = true;
      sacEntriesLoaded = false;
      sacItemsLoaded = false;
      try {
        await loadProfile();

        // Reset the previous scope's state.
        activityCatalog.value = [];
        sacEntries.value = [];
        sacRows.value = [];
        grandTotal.value = 0;
        isReferred.value = false;
        referredAt.value = null;
        referralMessage.value = '';
        referredBy.value = null;

        await Promise.all([loadSacItems(), loadActivities()]);
        await loadSacBudget();

        if (campaignBudgetId.value && budgetStatus.value !== 'draft') {
          await loadGeneratedItems(campaignBudgetId.value);
        } else {
          await loadSacEntries();
        }
      } finally {
        loading.value = false;
      }
    };

    /**
     * Resolve the role + locale scope, then load the owning locale's SAC budget.
     *
     *   • CMCC  → their own county profile (county-level SAC)
     *   • SCMCC → their own sub-county profile (sub-county SAC)
     *   • Super Admin → both levels; a picker drives the target profile
     *   • anything else → a message and no grid (the backend refuses too)
     */
    const loadScope = async () => {
      scopeLoading.value = true;
      try {
        const { data } = await axios.get('get_special_area_budget_scope');
        const payload = data?.data || data || {};
        scope.value = payload;
        scopeMessage.value = payload.message || null;

        if (payload.is_super_admin) {
          // Nothing selected yet — the admin picks a locale below.
          await loadProfileOptions();
          return;
        }

        if (!payload.county_profile_id) {
          return;
        }

        applyTarget(payload.county_profile_id);
        subCounty.value.name = payload.sub_county_name || '';
        subCounty.value.countyName = payload.county_name || '';
        await bootstrap();
      } catch (err) {
        scopeMessage.value =
          err?.response?.data?.message ||
          err?.message ||
          'Unable to resolve your Special Area Cost access scope.';
      } finally {
        scopeLoading.value = false;
      }
    };

    /** Point the page at a target profile + refresh the header labels. */
    const applyTarget = (profileId) => {
      countyProfileId.value = profileId || null;

      const option = profileOptions.value.find((o) => o.value === profileId);
      if (option) {
        subCounty.value.name = option.subCountyName || '';
        subCounty.value.countyName = option.countyName || '';
      }
    };

    /**
     * Super Admin locale picker: every SAC-mapped active profile — counties
     * (budgeted by CMCC) and sub-counties (budgeted by SCMCC) — in one list.
     */
    const loadProfileOptions = async () => {
      loadingProfiles.value = true;
      try {
        const { data } = await axios.get('get_county_profiles', {
          params: { active_only: 1 },
        });
        const rows = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        profileOptions.value = rows
          .filter((p) => p.is_special_area_cost)
          .map((p) => {
            const isSub = !!p.sub_county_id;
            const countyName = p.county_name || p?.county?.name || '';
            const subName = p.sub_county_name || p?.sub_county?.name || '';

            return {
              value: p.id,
              label: isSub
                ? `Sub-County · ${subName} (${countyName})`
                : `County · ${countyName}`,
              countyName,
              subCountyName: subName,
              level: isSub ? 'sub_county' : 'county',
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
      } catch (err) {
        profileOptions.value = [];
      } finally {
        loadingProfiles.value = false;
      }
    };

    const onProfilePicked = (profileId) => {
      if (!profileId) {
        countyProfileId.value = null;
        isSpecialAreaMapped.value = false;
        subCounty.value = { name: '', countyName: '' };
        return;
      }

      applyTarget(profileId);
      bootstrap();
    };

    onMounted(loadScope);

    const reload = () => bootstrap();

    const openDetail = async () => {
      showStatusCard.value = false;
      if (campaignBudgetId.value) {
        loading.value = true;
        try {
          await loadGeneratedItems(campaignBudgetId.value);
        } finally {
          loading.value = false;
        }
      }
    };

    // ── Actions ────────────────────────────────────────────────────────────

    /** Create the SAC budget from the staged entries (generates line items). */
    const createSacBudget = async ({ silent = false } = {}) => {
      creating.value = true;
      try {
        const { data } = await axios.post('create_campaign_budget', {
          county_profile_id: countyProfileId.value,
          budget_type: 'special_area',
        });
        campaignBudgetId.value = data?.id ?? null;
        budgetStatus.value = data?.status ?? 'draft';
        grandTotal.value = Number(data?.grand_total) || 0;

        if (!silent) {
          notification.success({
            message: 'Special Area Cost budget created',
            description:
              'The special area costs have been generated. Submit it to National when you are ready.',
          });
        }
        return campaignBudgetId.value;
      } catch (err) {
        // A concurrent create (e.g. a stale tab) returns 409 with the existing
        // record — adopt it instead of failing.
        const existingId = err?.response?.data?.existing?.id;
        if (err?.response?.status === 409 && existingId) {
          campaignBudgetId.value = existingId;
          budgetStatus.value = err.response.data.existing.status;
          return existingId;
        }

        notification.error({
          message: 'Failed to create the Special Area Cost budget',
          description:
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            'Unknown error.',
        });
        throw err;
      } finally {
        creating.value = false;
      }
    };

    /** Submit the SAC budget — pushed straight to National. */
    const submitSacBudget = async () => {
      submitting.value = true;
      try {
        let budgetId = campaignBudgetId.value;

        // One-click flow: create (and generate) the budget first if needed.
        if (!budgetId) {
          budgetId = await createSacBudget({ silent: true });
          if (!budgetId) return;
        }

        const { data } = await axios.post(`submit_special_area_budget/${budgetId}`);
        budgetStatus.value = data?.status ?? 'submitted';
        budgetSubmittedAt.value = data?.submitted_at || new Date().toISOString();
        grandTotal.value = Number(data?.grand_total) || grandTotal.value;
        showStatusCard.value = true;

        notification.success({
          message: 'Submitted directly to National',
          description:
            'The Special Area Cost budget is now pending the DNMP Accountant review. The Finance Officer approves it after the review.',
        });
      } catch (err) {
        notification.error({
          message: 'Failed to submit the Special Area Cost budget',
          description:
            err?.response?.data?.message || err?.message || 'Unknown error.',
        });
      } finally {
        submitting.value = false;
      }
    };

    const voidSacBudget = async () => {
      const reason = String(voidModal.value.reason || '').trim();
      if (reason.length < 10) {
        notification.warning({
          message: 'A voiding reason of at least 10 characters is required.',
        });
        return;
      }
      voiding.value = true;
      try {
        await axios.post(`void_campaign_budget/${campaignBudgetId.value}`, {
          voided_reason: reason,
        });
        voidModal.value = { open: false, reason: '' };
        campaignBudgetId.value = null;
        budgetStatus.value = null;
        showStatusCard.value = false;
        grandTotal.value = 0;

        notification.success({
          message: 'Special Area Cost budget voided',
          description: 'You can now create a fresh one for this sub-county.',
        });
        await bootstrap();
      } catch (err) {
        notification.error({
          message: 'Failed to void the Special Area Cost budget',
          description:
            err?.response?.data?.message || err?.message || 'Unknown error.',
        });
      } finally {
        voiding.value = false;
      }
    };

    /** The section reports every change; keep the rows for the total. */
    const onSacSync = (rows) => {
      sacRows.value = Array.isArray(rows) ? rows : [];
    };

    /**
     * Per-category Save from the SAC section.
     *
     * When a draft SAC budget already exists its generated line items are
     * rebuilt (delete + re-create) so the stored total always matches the
     * staged entries. Once the budget is submitted this is a no-op — the
     * grid is read-only past draft.
     */
    const saveSacCategory = async (categoryId, rows) => {
      if (!countyProfileId.value) return;

      const { data } = await axios.put('save_special_area_cost_entries', {
        county_profile_id: countyProfileId.value,
        budget_category_id: categoryId,
        rows,
      });

      const payload = data?.data || data || {};
      const saved = Array.isArray(payload.entries) ? payload.entries : [];
      const kept = sacEntries.value.filter(
        (e) => e.budget_category_id !== categoryId,
      );
      sacEntries.value = [...kept, ...saved];

      // Keep a draft budget's generated rows in sync with the saved entries.
      if (campaignBudgetId.value && budgetStatus.value === 'draft') {
        const oldId = campaignBudgetId.value;
        campaignBudgetId.value = null;
        try {
          await axios.delete(`delete_campaign_budget/${oldId}`);
        } catch (err) {
          // Already gone / no longer deletable — the create below reports it.
        }
        await createSacBudget({ silent: true });
      }
    };





    return {
      loading,
      creating,
      submitting,
      voiding,
      countyProfileId,
      subCounty,
      campaignBudgetId,
      budgetStatus,
      budgetFinancialYear,
      budgetSubmittedAt,
      grandTotal,
      showStatusCard,
      isSpecialAreaMapped,
      isReferred,
      referredAt,
      referralMessage,
      referredBy,
      selectedActivities,
      sacItems,
      sacEntries,
      sacRows,
      voidModal,
      isDraft,
      fmt,
      sacTotal,
      sacGeneratedRow,
      scopeLoading,
      scope,
      scopeMessage,
      selectedProfileId,
      profileOptions,
      loadingProfiles,
      onProfilePicked,
      reload,
      openDetail,
      createSacBudget,
      submitSacBudget,
      voidSacBudget,
      onSacSync,
      saveSacCategory,
    };
  },
};
</script>

<style scoped>
.sab-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sab-loading {
  padding: 32px;
  text-align: center;
}
.sab-notice {
  background: #fff;
}
.sab-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  background: #fff;
}
.sab-summary-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sab-summary-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8a93a8;
  font-weight: 600;
}
.sab-summary-value {
  font-size: 15px;
  font-weight: 700;
  color: #3a3f5e;
}
.sab-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  background: #fff;
}
.sab-picker {
  background: #fff;
}
.sab-picker-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.sab-picker-label {
  font-size: 12px;
  font-weight: 700;
  color: #3a3f5e;
}
.sab-picker-select {
  min-width: 340px;
}
.sab-hint {
  margin: 6px 0 0;
  font-size: 12px;
  color: #8a93a8;
}
.sab-submit-btn {
  background: #1f6f43;
  color: #fff;
  border: none;
  font-weight: 600;
}
.scope-tag {
  background: #f1f2f6;
  color: #5a6277;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.special-pill {
  background: #fdeee7;
  color: #b3402a;
  border: none;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.header-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
