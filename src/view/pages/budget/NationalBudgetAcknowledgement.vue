<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="bp-min">
        <header class="bp-head">
          <div>
            <h3 class="bp-title">National Budget — Review &amp; Acknowledgement</h3>
            <p class="bp-sub">
              The Vector Unit Head / GF Manager have approved the national
              budget. Review it together with the combined National, County and
              Sub-County budget summaries, then acknowledge it to close the
              chain.
            </p>
          </div>
          <span class="header-tags">
            <a-tag class="stage-tag">{{ stageLabel }}</a-tag>
          </span>
        </header>

        <!-- National budget -->
        <section v-if="loading" class="panel center"><a-spin /></section>

        <section v-else-if="!nationalBudget" class="panel center muted">
          No national budget has been generated yet.
        </section>

        <template v-else>
          <section class="panel">
            <div class="ack-head">
              <div>
                <h4 class="ack-title">National Budget</h4>
                <div class="ack-meta">
                  <span v-if="nationalBudget.financial_year">
                    <strong>FY:</strong> {{ nationalBudget.financial_year }}
                  </span>
                  <span><strong>Status:</strong> {{ stageLabel }}</span>
                  <span v-if="nationalBudget.grand_total != null">
                    <strong>Total:</strong> KES {{ fmt(nationalBudget.grand_total) }}
                  </span>
                </div>
              </div>

              <sdButton
                v-if="canAcknowledge"
                type="primary"
                class="pill-btn"
                :disabled="!isAwaitingAcknowledgement"
                :loading="working"
                @click="acknowledge"
              >
                Acknowledge National Budget
              </sdButton>
              <a-tag v-else-if="isAcknowledged" color="green">Acknowledged</a-tag>
              <a-tag v-else color="default">Not awaiting acknowledgement</a-tag>
            </div>

            <p v-if="!isAwaitingAcknowledgement && !isAcknowledged" class="ack-note">
              The national budget must be approved by the Vector Unit Head or the
              GF Manager before it can be acknowledged.
            </p>

            <!-- Who signed off so far -->
            <div v-if="approval" class="ack-signoff">
              <span class="ack-label">Approved by</span>
              <span class="ack-actor">
                {{ approval.approved_by?.name || '—' }}
                <span v-if="approval.approved_by?.role" class="ack-role">
                  ({{ approval.approved_by.role }})
                </span>
              </span>
              <span class="ack-at">· {{ formatDate(approval.approved_at) }}</span>
            </div>
          </section>

          <!-- ── Combined summaries ─────────────────────────────────────── -->
          <section class="panel">
            <h4 class="ack-title">Combined Budget Summaries</h4>
            <p class="ack-note">
              National, County and Sub-County budgets combined — the picture the
              acknowledgement covers.
            </p>

            <div class="ack-totals">
              <div class="ack-total">
                <span class="ack-label">National</span>
                <strong>KES {{ fmt(combined.national_total) }}</strong>
              </div>
              <div class="ack-total">
                <span class="ack-label">County (incl. sub-counties)</span>
                <strong>KES {{ fmt(combined.counties_total) }}</strong>
              </div>
              <div class="ack-total ack-total--grand">
                <span class="ack-label">Combined total</span>
                <strong>KES {{ fmt(combined.grand_total) }}</strong>
              </div>
            </div>

            <a-table
              :data-source="summaryRows"
              :columns="summaryColumns"
              :pagination="false"
              size="small"
              row-key="key"
              :loading="loadingCombined"
            >
              <template #bodyCell="{ column, record }">
                <span v-if="column.key === 'level'">
                  <a-tag :color="levelColor(record.level)">{{ levelLabel(record.level) }}</a-tag>
                </span>
                <span v-else-if="column.key === 'name'">{{ record.name }}</span>
                <span v-else-if="column.key === 'budgets'">{{ record.budgets }}</span>
                <span v-else-if="column.key === 'sub_counties'">{{ record.sub_counties }}</span>
                <span v-else class="ack-money">KES {{ fmt(record.total) }}</span>
              </template>
            </a-table>
          </section>
        </template>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
/**
 * AIE Holder — National Budget REVIEW & ACKNOWLEDGEMENT.
 *
 * The final step of the national chain. The Vector Unit Head / GF Manager have
 * already approved the national budget (`national_approved`); the AIE Holder
 * reviews it together with the COMBINED National + County + Sub-County budget
 * summaries and acknowledges it, which closes the budget to `approved`.
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
 */
import { computed, onMounted, ref } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';
import { hasPermission } from '@/services/user-role';

export default {
  name: 'NationalBudgetAcknowledgement',
  components: { Main, RecordViewWrapper, BudgetPageWrapper },
  setup() {
    const loading = ref(false);
    const loadingCombined = ref(false);
    const working = ref(false);

    const nationalBudget = ref(null);
    const combinedRaw = ref(null);
    const approval = ref(null);

    const canAcknowledge = hasPermission('approve_campaign_budget');

    const summaryColumns = [
      { title: 'Level', key: 'level', width: 140 },
      { title: 'Unit', key: 'name' },
      { title: 'Budgets', key: 'budgets', width: 100 },
      { title: 'Sub-counties', key: 'sub_counties', width: 120 },
      { title: 'Total (KES)', key: 'total', width: 180, align: 'right' },
    ];

    const stageLabel = computed(() => {
      const map = {
        draft: 'Preparatory Stage',
        submitted: 'Pending Vector Unit Head / GF Manager Approval',
        national_approved: 'Approved (Vector Unit Head / GF Manager)',
        approved: 'Acknowledged by AIE Holder',
      };
      return map[nationalBudget.value && nationalBudget.value.status] || 'National Budget';
    });

    const isAwaitingAcknowledgement = computed(
      () => !!nationalBudget.value && nationalBudget.value.status === 'national_approved',
    );

    const isAcknowledged = computed(
      () => !!nationalBudget.value && nationalBudget.value.status === 'approved',
    );

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

    /** One row per level so the AIE Holder sees the whole picture. */
    const summaryRows = computed(() => {
      const raw = combinedRaw.value || {};
      const rows = [];

      const national = raw.national || {};
      rows.push({
        key: 'national',
        level: 'national',
        name: 'National',
        budgets: (national.budgets || []).length,
        sub_counties: '—',
        total: Number(national.grand_total) || 0,
      });

      (raw.counties || []).forEach((c) => {
        rows.push({
          key: `county-${c.county_id}`,
          level: 'county',
          name: c.county_name,
          budgets: (c.budgets || []).length,
          sub_counties: c.children_count || 0,
          total: Number(c.grand_total) || 0,
        });
      });

      return rows;
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
      loading, loadingCombined, working, nationalBudget, approval,
      canAcknowledge, summaryColumns, stageLabel, isAwaitingAcknowledgement,
      isAcknowledged, combined, summaryRows, levelLabel, levelColor, fmt,
      formatDate, acknowledge, bootstrap,
    };
  },
};
</script>

<style scoped>
.bp-sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: #8b8fa3;
  max-width: 760px;
}
.ack-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.ack-title {
  margin: 0 0 6px;
  font-size: 15px;
  color: #2b3245;
}
.ack-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: #5a5f7d;
}
.ack-note {
  margin: 8px 0 0;
  font-size: 12px;
  color: #8b8fa3;
}
.ack-signoff {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin-top: 12px;
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
  color: #2b3245;
}
.ack-role {
  font-weight: 400;
  color: #5a5f7d;
}
.ack-at {
  color: #8b8fa3;
}
.ack-totals {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 12px 0 16px;
}
.ack-total {
  flex: 1 1 200px;
  padding: 12px 16px;
  border: 1px solid #e6e8ef;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ack-total--grand {
  border-left: 4px solid #2f54eb;
  background: #f7f8fc;
}
.ack-total strong {
  font-size: 16px;
  color: #2b3245;
}
.ack-money {
  font-weight: 600;
  color: #2b3245;
}
</style>
