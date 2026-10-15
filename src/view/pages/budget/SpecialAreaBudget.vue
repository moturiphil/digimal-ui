<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper>
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">✦</span> Special Area Cost Budget
            </h3>
            <p class="ph-subtitle">
              A separate budget from the standard campaign budget. It is submitted on its own and
              pushed <strong>directly to National</strong> — the county stage is skipped. The
              National Accountant reviews it, then the Finance Officer approves it.
            </p>
          </div>
          <div v-if="subCounty.name || subCounty.countyName" class="ph-actions header-tags">
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
                  :referred-to="referralLevel"
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
                  <!-- Overview — headline total + key facts -->
                  <section v-if="selectedActivities.length" class="panel sab-overview">
                    <div class="sab-overview-main">
                      <span class="sab-overview-eyebrow">Special Area Cost total</span>
                      <div class="sab-overview-total">
                        <span class="cur">KES</span> {{ fmt(displayTotal) }}
                      </div>
                      <span class="sab-overview-note">
                        Live total across every category. Save each category to persist it.
                      </span>
                    </div>
                    <div class="sab-overview-stats">
                      <div class="sab-stat">
                        <span class="sab-stat-label">Categories</span>
                        <span class="sab-stat-value">{{ selectedActivities.length }}</span>
                      </div>
                      <div class="sab-stat">
                        <span class="sab-stat-label">Status</span>
                        <span class="sab-stat-value">{{ statusLabel }}</span>
                      </div>
                      <div v-if="budgetFinancialYear" class="sab-stat">
                        <span class="sab-stat-label">Financial year</span>
                        <span class="sab-stat-value">{{ budgetFinancialYear }}</span>
                      </div>
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
                      @click="openSubmitModal"
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

        <a-modal
          v-model:visible="submitModal.open"
          title="Submit Special Area Cost budget for review?"
          :ok-text="submitting ? 'Submitting…' : 'Yes, submit for review'"
          cancel-text="Cancel"
          :confirm-loading="submitting"
          @ok="confirmSubmitSacBudget"
        >
          <p>
            You are about to submit this Special Area Cost budget to the National
            office. It is pushed straight to National (the county stage is
            skipped) and will be reviewed by the DNMP&nbsp;Accountant, then
            approved by the Finance Officer.
          </p>
          <p style="margin-bottom: 0">
            Once submitted the budget can no longer be edited unless it is
            approved or referred back. Do you want to submit it for review?
          </p>
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
 *   (or Super Admin) and approved by the Finance Officer.
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
    /* Destination level of the referral (sub_county | county | dnmp_review |
     * approver) — shown in the referral banner. */
    const referralLevel = ref(null);

    // Categories + SAC catalogue + staged entries.
    const activityCatalog = ref([]);
    const sacItems = ref(fallbackSacItems());
    const sacEntries = ref([]);
    const sacRows = ref([]);

    const voidModal = ref({ open: false, reason: '' });
    // Confirmation before pushing the SAC budget to National. The owner must
    // explicitly confirm they want to submit it for review (and lose the
    // ability to edit it until it is approved or referred back).
    const submitModal = ref({ open: false });

    let sacItemsLoaded = false;
    let sacEntriesLoaded = false;

    // ── Derived state ──────────────────────────────────────────────────────
    const selectedActivities = computed(() => activityCatalog.value);

    const isDraft = computed(() => !budgetStatus.value || budgetStatus.value === 'draft');

    /** Human-readable status for the overview card. */
    const STATUS_LABELS = {
      draft: 'Draft',
      submitted: 'Pending DNMP Review',
      dnmp_reviewed: 'Pending National Approval',
      approved: 'Approved',
      rejected: 'Referred back',
      voided: 'Voided',
    };
    const statusLabel = computed(() => {
      if (!budgetStatus.value) return 'Not created';
      return STATUS_LABELS[budgetStatus.value] || budgetStatus.value;
    });

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
          // Prefer the officer-entered No. of Days; fall back to the
          // category's default only when the row omits it.
          const days = Number(r.number_of_days) || daysOf(category);
          return sum + (Number(r.amount) || 0) * (Number(r.units) || 0) * days;
        },
        0,
      ),
    );

    // Headline total shown at the top of the page — the sum of the per-category
    // subtotals reported by the section (the staged rows while editing, the
    // generated rows once read-only). Falls back to the persisted budget total
    // only until the section has reported anything, so the figure is never left
    // blank after a Save or a Create/Generate.
    const displayTotal = computed(() =>
      sacRows.value.length ? sacTotal.value : Number(grandTotal.value) || 0,
    );

    /** Generated-mode row resolver for the read-only SAC grid. */
    const sacGeneratedRow = (category, item) => {
      const blank = { amount: 0, units: 0, days: 1, comment: '', total: 0 };
      if (!category) return blank;
      const li = (category.items || []).find(
        (r) => r.is_special_cost && r.special_type === item.type,
      );
      if (!li) return blank;
      return {
        amount: Number(li.unit_cost) || 0,
        units: Number(li.units) || 0,
        days: Number(li.days) || 1,
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
      // Budget Categories tab) render SAC rows here.
      //
      // The API returns the raw tinyint (0 / 1), so comparing against `false`
      // never matched and deselected categories slipped through. Treat
      // 0 / '0' / false as "not selected"; a missing flag keeps the legacy
      // behaviour (allowed) so older responses still work.
      const allowsSpecialCosts = (c) => {
        const v = c?.allows_special_costs;
        if (v === undefined || v === null) return true;
        return Number(v) !== 0;
      };

      const cats = normalizePayload(data).filter(
        (c) =>
          (c.is_active === undefined || !!c.is_active) &&
          allowsSpecialCosts(c),
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
        referralLevel.value = active.referred_to_level || null;
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
        referralLevel.value = null;
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

    /** Open the confirmation modal before submitting to National. */
    const openSubmitModal = () => {
      if (!sacRows.value.length && !campaignBudgetId.value) return;
      submitModal.value = { open: true };
    };

    /**
     * Confirmation handler — runs the real submission and keeps the modal open
     * (showing its loading state) until the request settles.
     */
    const confirmSubmitSacBudget = async () => {
      await submitSacBudget();
      submitModal.value = { open: false };
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
      if (!countyProfileId.value) {
        notification.error({
          message: 'Cannot save Special Area Costs',
          description: 'The sub-county profile has not been resolved yet.',
        });
        return;
      }

      const categoryName =
        selectedActivities.value.find((a) => a.id === categoryId)?.name ||
        `Category ${categoryId}`;

      try {
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

        notification.success({
          message: 'Special Area Costs saved',
          description: `${categoryName} saved.`,
        });
      } catch (err) {
        notification.error({
          message: 'Failed to save Special Area Costs',
          description:
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            'Unknown error.',
        });
        // Re-throw so the section keeps the edits staged for a retry.
        throw err;
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
      statusLabel,
      budgetFinancialYear,
      budgetSubmittedAt,
      grandTotal,
      showStatusCard,
      isSpecialAreaMapped,
      isReferred,
      referredAt,
      referralMessage,
      referralLevel,
      referredBy,
      selectedActivities,
      sacItems,
      sacEntries,
      sacRows,
      voidModal,
      submitModal,
      isDraft,
      fmt,
      sacTotal,
      displayTotal,
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
      openSubmitModal,
      confirmSubmitSacBudget,
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
  border: 1px solid #eef0f9;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 12px rgba(39, 43, 65, 0.06);
}
.sab-overview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 20px;
  background: linear-gradient(90deg, #f4fbf6 0%, #ffffff 60%);
  border: 1px solid #d9f0e2;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(28, 122, 72, 0.07);
}
.sab-overview-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 220px;
}
.sab-overview-eyebrow {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8a93a8;
  font-weight: 700;
}
.sab-overview-total {
  font-size: 30px;
  font-weight: 800;
  color: #1f6f43;
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.sab-overview-total .cur {
  font-size: 14px;
  font-weight: 700;
  color: #4d8a63;
  margin-right: 2px;
}
.sab-overview-note {
  font-size: 12px;
  color: #8a93a8;
}
.sab-overview-stats {
  display: flex;
  align-items: center;
  gap: 26px;
  flex-wrap: wrap;
}
.sab-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 18px;
  border-left: 1px solid #eef0f9;
}
.sab-stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8a93a8;
  font-weight: 600;
}
.sab-stat-value {
  font-size: 15px;
  font-weight: 700;
  color: #3a3f5e;
}
.sab-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #eef0f9;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(39, 43, 65, 0.06);
}
.sab-picker {
  padding: 16px 18px;
  background: #fff;
  border: 1px solid #eef0f9;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(39, 43, 65, 0.06);
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
