<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="bp-min">
        <!-- ── Header ───────────────────────────────────────────────────── -->
        <header class="bp-head">
          <div class="bh-left">
            <h3 class="bp-title">National Budget — Review &amp; Acknowledgement</h3>
            <p class="bp-sub">
              The final step of the national chain. Review the national budget
              together with the combined National, County and Sub-County
              summaries, then acknowledge it to close the chain.
            </p>
          </div>
          <span class="header-tags">
            <a-tag v-if="financialYear" class="fy-tag">FY {{ financialYear }}</a-tag>
            <a-tag class="stage-tag">{{ stageLabel }}</a-tag>
          </span>
        </header>

        <!-- ── Where the national budget sits in its chain ──────────────── -->
        <section v-if="nationalBudget" class="panel ack-pipeline">
          <span class="ack-pipeline-label">National budget chain</span>
          <BudgetStagePipeline
            :status="status"
            :is-sub-county="false"
            :is-national="true"
            action-status="approved"
          />
        </section>

        <!-- ── Loading ──────────────────────────────────────────────────── -->
        <section v-if="loading" class="panel bp-skeleton-panel">
          <a-skeleton-input style="width: 40%" active />
          <a-skeleton active :paragraph="{ rows: 4 }" />
        </section>

        <!-- ── Nothing generated yet ────────────────────────────────────── -->
        <section v-else-if="!nationalBudget" class="panel">
          <div class="empty-state">
            <div class="empty-icon">📘</div>
            <div class="empty-title">No national budget to acknowledge</div>
            <div class="empty-desc">
              A national budget has to be prepared, submitted and reviewed by the
              DNMP Accountant, the Program Accountant or the Finance Officer
              before the AIE Holder can acknowledge it.
            </div>
          </div>
        </section>

        <template v-else>
          <!-- ── What happens next, and who signed it off ───────────────── -->
          <section class="panel ack-callout" :class="`is-${callout.kind}`">
            <div class="ac-icon">{{ callout.icon }}</div>
            <div class="ac-body">
              <div class="ac-title">{{ callout.title }}</div>
              <div class="ac-note">{{ callout.note }}</div>

              <div v-if="approval" class="ack-signoff">
                <span class="ack-label">Reviewed by</span>
                <span class="ack-actor">
                  {{ approval.approved_by?.name || '—' }}
                  <span v-if="approval.approved_by?.role" class="ack-role">
                    ({{ approval.approved_by.role }})
                  </span>
                </span>
                <span class="ack-at">· {{ formatDate(approval.approved_at) }}</span>
              </div>
            </div>

            <div class="ac-action">
              <sdButton
                v-if="canAcknowledge && isAwaitingAcknowledgement"
                type="primary"
                class="pill-btn"
                :loading="working"
                @click="confirmOpen = true"
              >
                Acknowledge National Budget
              </sdButton>
              <a-tag v-else-if="isAcknowledged" color="green" class="ac-tag">Acknowledged</a-tag>
              <a-tag v-else-if="canAcknowledge" class="ac-tag">Not awaiting acknowledgement</a-tag>
              <a-tag v-else class="ac-tag">View only</a-tag>
            </div>
          </section>

          <!-- ── The numbers at a glance ────────────────────────────────── -->
          <div class="budget-stat-row">
            <StatCard class="success">
              <div class="stat-icon">🏛</div>
              <div class="stat-label">National total</div>
              <div class="stat-value">KES {{ fmt(combined.national_total) }}</div>
              <div class="stat-sub">
                {{ nationalCount }} budget{{ nationalCount === 1 ? '' : 's' }}
              </div>
            </StatCard>
            <StatCard class="info">
              <div class="stat-icon">🗺</div>
              <div class="stat-label">County + sub-county</div>
              <div class="stat-value">KES {{ fmt(combined.counties_total) }}</div>
              <div class="stat-sub">
                {{ countyCount }} counties · {{ subCountyCount }} sub-counties
              </div>
            </StatCard>
            <StatCard class="purple">
              <div class="stat-icon">💰</div>
              <div class="stat-label">Combined total</div>
              <div class="stat-value">KES {{ fmt(combined.grand_total) }}</div>
              <div class="stat-sub">What this acknowledgement covers</div>
            </StatCard>
            <StatCard class="primary">
              <div class="stat-icon">🧾</div>
              <div class="stat-label">Units covered</div>
              <div class="stat-value">{{ unitCount }}</div>
              <div class="stat-sub">National, county and sub-county budgets</div>
            </StatCard>
          </div>

          <!-- ── Combined summaries ─────────────────────────────────────── -->
          <section class="panel">
            <h4 class="ack-title">Combined Budget Summaries</h4>
            <p class="ack-note">
              National, County and Sub-County budgets combined — the picture the
              acknowledgement covers.
            </p>

            <div class="budget-filter-bar">
              <a-input
                v-model:value="search"
                class="bp-search"
                placeholder="Search a county or unit…"
                allow-clear
              />
              <a-select v-model:value="levelFilter" class="bp-select" :options="levelOptions" />
              <span class="result-counter">
                {{ summaryRows.length }} of {{ allSummaryRows.length }} units
              </span>
            </div>

            <div class="bp-table-shell">
              <a-table
                :data-source="summaryRows"
                :columns="summaryColumns"
                :pagination="false"
                size="middle"
                row-key="key"
                :loading="loadingCombined"
                :locale="{ emptyText: 'No units match this filter.' }"
              >
                <template #bodyCell="{ column, record }">
                  <span v-if="column.key === 'level'">
                    <a-tag :color="levelColor(record.level)">{{ levelLabel(record.level) }}</a-tag>
                  </span>
                  <span v-else-if="column.key === 'name'" class="ack-unit">{{ record.name }}</span>
                  <span v-else-if="column.key === 'budgets'">{{ record.budgets }}</span>
                  <span v-else-if="column.key === 'sub_counties'">{{ record.sub_counties }}</span>
                  <span v-else-if="column.key === 'share'" class="ack-share">
                    <span class="ack-share-track">
                      <span class="ack-share-fill" :style="{ width: record.share + '%' }"></span>
                    </span>
                    <span class="ack-share-text">{{ record.share }}%</span>
                  </span>
                  <span v-else class="ack-money">KES {{ fmt(record.total) }}</span>
                </template>
              </a-table>
            </div>

            <div class="grand-total-bar">
              <span class="gt-label">Combined grand total</span>
              <span class="gt-value">KES {{ fmt(combined.grand_total) }}</span>
            </div>
          </section>

          <!-- ── What the national team changed, and who approved it ────── -->
          <BudgetReviewFeedback
            :budget-id="nationalBudget.id"
            :status="status"
            :can-view="canAcknowledge"
          />
        </template>
      </BudgetPageWrapper>
    </Main>

    <!-- ── Acknowledgement is irreversible: confirm before closing ─────── -->
    <a-modal
      v-model:visible="confirmOpen"
      title="Acknowledge the national budget?"
      :ok-text="working ? 'Acknowledging…' : 'Yes, acknowledge'"
      cancel-text="Cancel"
      :confirm-loading="working"
      @ok="acknowledge"
    >
      <a-alert
        message="Acknowledging closes the national budget chain. It cannot be undone from here."
        type="warning"
        show-icon
        style="margin-bottom: 12px"
      />
      <p class="ack-modal-copy">
        You are acknowledging the national budget of
        <strong>KES {{ fmt(nationalBudget && nationalBudget.grand_total) }}</strong>
        together with the combined National, County and Sub-County summaries
        totalling <strong>KES {{ fmt(combined.grand_total) }}</strong>.
      </p>
    </a-modal>
  </RecordViewWrapper>
</template>

<script>
/**
 * AIE Holder — National Budget REVIEW & ACKNOWLEDGEMENT.
 *
 * The final step of the national chain. The DNMP Accountant, the Program
 * Accountant or the Finance Officer have already reviewed and approved the
 * national budget (`national_approved`); the AIE Holder reviews it together
 * with the COMBINED National + County + Sub-County budget summaries and
 * acknowledges it, which closes the budget to `approved`.
 *
 * Data:
 *   • the national budget     — `get_campaign_budgets?county_profile_id=<national>`
 *   • the combined summaries  — `get_approved_budgets_overview` (grouped by
 *                               county_profiles.level, with each county's
 *                               sub-county children rolled up)
 *   • the approval sign-off   — `get_budget_review_feedback` (national_approval)
 *
 * Acknowledgement is an action ON the national budget: POST
 * approve_campaign_budget/{id}. No separate combined-budget entity is created.
 *
 * Styling follows the rest of the budget module: BudgetPageWrapper utilities
 * (`.panel`, `.bp-table-shell`, `.budget-stat-row`, `.budget-filter-bar`,
 * `.grand-total-bar`, `.empty-state`) plus the shared BudgetStagePipeline and
 * BudgetReviewFeedback components.
 */
import { computed, onMounted, ref } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper, StatCard } from './style';
import { hasPermission } from '@/services/user-role';
import BudgetStagePipeline from './BudgetStagePipeline.vue';
import BudgetReviewFeedback from './BudgetReviewFeedback.vue';

export default {
  name: 'NationalBudgetAcknowledgement',
  components: {
    Main,
    RecordViewWrapper,
    BudgetPageWrapper,
    StatCard,
    BudgetStagePipeline,
    BudgetReviewFeedback,
  },
  setup() {
    const loading = ref(false);
    const loadingCombined = ref(false);
    const working = ref(false);
    const confirmOpen = ref(false);

    const nationalBudget = ref(null);
    const combinedRaw = ref(null);
    const approval = ref(null);

    /** Combined-summary table filters. */
    const search = ref('');
    const levelFilter = ref('all');

    const canAcknowledge = hasPermission('approve_campaign_budget');

    const status = computed(() => (nationalBudget.value ? nationalBudget.value.status : null));
    const financialYear = computed(
      () => (nationalBudget.value ? nationalBudget.value.financial_year : null),
    );

    const summaryColumns = [
      { title: 'Level', key: 'level', width: 130 },
      { title: 'Unit', key: 'name' },
      { title: 'Budgets', key: 'budgets', width: 100, align: 'center' },
      { title: 'Sub-counties', key: 'sub_counties', width: 120, align: 'center' },
      { title: 'Total (KES)', key: 'total', width: 170, align: 'right' },
      { title: 'Share', key: 'share', width: 190 },
    ];

    const levelOptions = [
      { value: 'all', label: 'All levels' },
      { value: 'national', label: 'National' },
      { value: 'county', label: 'County' },
    ];

    /** Short label for the header tag; the callout carries the full wording. */
    const stageLabel = computed(() => {
      const map = {
        draft: 'Preparatory',
        submitted: 'Pending review',
        national_approved: 'Awaiting acknowledgement',
        approved: 'Acknowledged',
      };
      return map[status.value] || 'National budget';
    });

    const isAwaitingAcknowledgement = computed(() => status.value === 'national_approved');

    const isAcknowledged = computed(() => status.value === 'approved');

    /**
     * Status-aware callout: what this budget is waiting for, on whom, and what
     * acknowledging it will do — the one thing the AIE Holder needs to know.
     */
    const callout = computed(() => {
      if (isAcknowledged.value) {
        return {
          kind: 'done',
          icon: '✅',
          title: 'This national budget has been acknowledged',
          note: 'The national chain is complete. The figures below are the ones that were acknowledged.',
        };
      }

      if (isAwaitingAcknowledgement.value) {
        return {
          kind: 'ready',
          icon: '📝',
          title: 'Awaiting your acknowledgement',
          note: 'The DNMP Accountant, the Program Accountant or the Finance Officer have reviewed and approved the national budget. Check the combined summaries below, then acknowledge to close the chain.',
        };
      }

      return {
        kind: 'blocked',
        icon: '⏳',
        title: 'Not ready to be acknowledged yet',
        note: 'The national budget must first be reviewed and approved by the DNMP Accountant, the Program Accountant or the Finance Officer.',
      };
    });

    /** Totals rolled up from the combined payload (backend `summary`). */
    const combined = computed(() => {
      const raw = combinedRaw.value || {};
      const summary = raw.summary || {};

      const national = Number(summary.national_total) || 0;
      const counties = Number(summary.county_sub_county_total) || 0;

      return {
        national_total: national,
        counties_total: counties,
        // Prefer the backend's own grand total; fall back to the sum.
        grand_total: Number(summary.grand_total) || (national + counties),
      };
    });

    const nationalCount = computed(() => {
      const raw = combinedRaw.value || {};
      return ((raw.national || {}).budgets || []).length;
    });

    const countyCount = computed(() => ((combinedRaw.value || {}).counties || []).length);

    const subCountyCount = computed(() =>
      ((combinedRaw.value || {}).counties || []).reduce(
        (sum, c) => sum + (Number(c.children_count) || 0),
        0,
      ),
    );

    /** National + county + sub-county budgets the acknowledgement covers. */
    const unitCount = computed(() => 1 + countyCount.value + subCountyCount.value);

    /** One row per level so the AIE Holder sees the whole picture. */
    const allSummaryRows = computed(() => {
      const raw = combinedRaw.value || {};
      const grand = combined.value.grand_total;
      const share = (total) => (grand > 0 ? Math.round(((Number(total) || 0) / grand) * 100) : 0);

      const rows = [];

      const national = raw.national || {};
      rows.push({
        key: 'national',
        level: 'national',
        name: 'National',
        budgets: (national.budgets || []).length,
        sub_counties: '—',
        total: Number(national.grand_total) || 0,
        share: share(national.grand_total),
      });

      (raw.counties || []).forEach((c) => {
        rows.push({
          key: `county-${c.county_id}`,
          level: 'county',
          name: c.county_name,
          budgets: (c.budgets || []).length,
          sub_counties: c.children_count || 0,
          total: Number(c.grand_total) || 0,
          share: share(c.grand_total),
        });
      });

      return rows;
    });

    /** The same rows, narrowed by the level filter and the free-text search. */
    const summaryRows = computed(() => {
      const term = search.value.trim().toLowerCase();

      return allSummaryRows.value.filter((row) => {
        const matchesLevel = levelFilter.value === 'all' || row.level === levelFilter.value;
        const matchesTerm = !term || String(row.name || '').toLowerCase().includes(term);

        return matchesLevel && matchesTerm;
      });
    });

    const levelLabel = (level) => ({
      national: 'National',
      county: 'County',
      sub_county: 'Sub-County',
    }[level] || level);

    const levelColor = (level) => ({
      national: 'geekblue',
      county: 'blue',
      sub_county: 'orange',
    }[level] || 'default');

    const fmt = (v) => {
      const n = Number(v) || 0;
      return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    const formatDate = (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    // ── Loading ───────────────────────────────────────────────────────────

    const loadNationalBudget = async () => {
      const { data } = await axios.get('get_my_county_profile');
      const payload = data?.data || data || {};
      const profileId = payload.county_profile_id || null;
      if (!profileId) return;

      const list = await axios.get('get_campaign_budgets', {
        params: { county_profile_id: profileId, budget_type: 'standard' },
      });
      const rows = Array.isArray(list.data?.data)
        ? list.data.data
        : Array.isArray(list.data)
          ? list.data
          : [];
      const active = rows.find((b) => b.status !== 'voided') || null;
      nationalBudget.value = active;

      if (active) {
        try {
          const { data: fb } = await axios.get(`get_budget_review_feedback/${active.id}`);
          approval.value = (fb && fb.national_approval) || null;
        } catch (e) {
          approval.value = null;
        }
      }
    };

    const loadCombined = async () => {
      loadingCombined.value = true;
      try {
        const { data } = await axios.get('get_approved_budgets_overview');
        combinedRaw.value = data || null;
      } catch (err) {
        combinedRaw.value = null;
      } finally {
        loadingCombined.value = false;
      }
    };

    const bootstrap = async () => {
      loading.value = true;
      try {
        await Promise.all([loadNationalBudget(), loadCombined()]);
      } catch (err) {
        notification.error({
          message: 'Failed to load the acknowledgement view',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        loading.value = false;
      }
    };

    /** Review & acknowledge — closes the national budget to `approved`. */
    const acknowledge = async () => {
      if (!nationalBudget.value) return;
      working.value = true;
      try {
        await axios.post(`approve_campaign_budget/${nationalBudget.value.id}`);
        confirmOpen.value = false;
        await bootstrap();
        notification.success({
          message: 'National budget acknowledged',
          description: 'The national budget chain is now complete.',
        });
      } catch (err) {
        notification.error({
          message: 'Could not acknowledge the national budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        working.value = false;
      }
    };

    onMounted(bootstrap);

    return {
      loading, loadingCombined, working, confirmOpen,
      nationalBudget, approval, search, levelFilter, levelOptions,
      canAcknowledge, status, financialYear, stageLabel,
      isAwaitingAcknowledgement, isAcknowledged, callout,
      combined, nationalCount, countyCount, subCountyCount, unitCount,
      summaryColumns, allSummaryRows, summaryRows,
      levelLabel, levelColor, fmt, formatDate,
      acknowledge, bootstrap,
    };
  },
};
</script>

<style scoped>
/* ── Header ──────────────────────────────────────────────────────────────
   Same header rhythm as the other budget pages (NationalBudgeting /
   Budgeting / CountyBudgeting). */
.bp-min .bp-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eef0f5;
}
.bp-min .bh-left {
  min-width: 0;
}
.bp-min .bp-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2437;
}
.bp-min .bp-sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: #7a8a82;
  max-width: 760px;
}
.bp-min .header-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.bp-min .stage-tag {
  background: #eef3fb;
  color: #2f6dcf;
  border: 1px solid #d7e3f5;
  border-radius: 12px;
  padding: 2px 12px;
  font-size: 11px;
  font-weight: 600;
}
.bp-min .fy-tag {
  background: #e8f6ee;
  color: #15693c;
  border: 1px solid #9ad8b4;
  border-radius: 12px;
  padding: 2px 12px;
  font-size: 11px;
  font-weight: 600;
}

/* ── Section panel (platform theme) ──────────────────────────────────────
   Defined here because BudgetPageWrapper ships the table/stat/total shells
   but not the base panel. BudgetReviewFeedback renders its own `.panel` with a
   blue accent border, so it is excluded to avoid clobbering it. */
.panel:not(.review-feedback) {
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
}

/* ── Stage pipeline strip ──────────────────────────────────────────────── */
.ack-pipeline-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #7a8a82;
  margin-bottom: 10px;
}

/* ── Status callout: what is waiting, and on whom ──────────────────────── */
.ack-callout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.ack-callout.is-ready {
  border-left: 4px solid #15693c;
}
.ack-callout.is-done {
  border-left: 4px solid #52c41a;
}
.ack-callout.is-blocked {
  border-left: 4px solid #fa8b0c;
}
.ac-icon {
  font-size: 26px;
  line-height: 1;
  flex-shrink: 0;
}
.ac-body {
  flex: 1;
  min-width: 0;
}
.ac-title {
  font-size: 15px;
  font-weight: 700;
  color: #1f2437;
  margin-bottom: 4px;
}
.ac-note {
  font-size: 13px;
  color: #5a5f7d;
  line-height: 1.55;
  max-width: 880px;
}
.ac-action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.ac-tag {
  margin: 0;
}
.bp-min .pill-btn {
  border-radius: 20px;
  font-weight: 600;
  height: 36px;
  padding: 0 20px;
}

/* sign-off strip (matches BudgetReviewFeedback's approval strip) */
.ack-signoff {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f6ffed;
  border-left: 3px solid #52c41a;
  font-size: 13px;
}
.ack-label {
  font-weight: 600;
  color: #5a5f7d;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.04em;
}
.ack-actor {
  font-weight: 600;
  color: #1f2437;
}
.ack-role {
  font-weight: 400;
  color: #5a5f7d;
}
.ack-at {
  color: #8b8fa3;
}

/* ── Combined summaries ────────────────────────────────────────────────── */
.ack-title {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
  color: #1f2437;
}
.ack-note {
  margin: 0 0 12px;
  font-size: 12px;
  color: #7a8a82;
}
.ack-unit {
  font-weight: 600;
  color: #1f2437;
}
.ack-money {
  font-weight: 800;
  color: #1f6b40;
  letter-spacing: 0.2px;
}
.ack-share {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ack-share-track {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #eef2f0;
  overflow: hidden;
}
.ack-share-fill {
  display: block;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #15693c, #41c87b);
}
.ack-share-text {
  font-size: 12px;
  font-weight: 600;
  color: #5a5f7d;
  width: 40px;
  text-align: right;
}

/* ── Loading / empty / modal ───────────────────────────────────────────── */
.bp-skeleton-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: #fff;
  border: 1px solid #eef0f5;
  padding: 18px 20px;
}
.ack-modal-copy {
  margin: 0;
  font-size: 13px;
  color: #5a5f7d;
  line-height: 1.6;
}
</style>





