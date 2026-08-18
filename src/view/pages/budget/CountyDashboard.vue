<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard">
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> County Dashboard
            </h3>
            <p class="ph-subtitle">
              {{ scopedCountyName || countyName }}<span v-if="fiscalYear"> — FY {{ fiscalYear }}</span>
            </p>
          </div>
          <div class="ph-actions">
            <a-tag color="green" v-if="fiscalYear">FY {{ fiscalYear }}</a-tag>
          </div>
        </div>

        <CountyAccessGate @scope-change="onScopeChange">
          <template #default="{ countyId: gatedId }">
            <a-spin :spinning="loading">
        <!-- ───────── Submission Status tiles ───────── -->
        <section class="panel">
          <div class="panel-title">Submission Status</div>
          <div class="tile-row tile-row-6">
            <div class="tile">
              <div class="tile-icon">▦</div>
              <div class="tile-label">Expected Budgets</div>
              <div class="tile-value">{{ fmt(submission.expected.total) }}</div>
              <div class="tile-foot">
                <span>Sub-Counties: <strong>{{ submission.expected.subCounties }}</strong></span>
                <span>County Budget: <strong>{{ submission.expected.county }}</strong></span>
              </div>
            </div>
            <div class="tile">
              <div class="tile-icon accent-info">✈</div>
              <div class="tile-label">Submitted for Review</div>
              <div class="tile-value">{{ fmt(submission.submitted.total) }}</div>
              <div class="tile-foot">
                <span>Sub-Counties: <strong>{{ submission.submitted.subCounties }}</strong></span>
                <span>County Budget: <strong>{{ submission.submitted.county }}</strong></span>
              </div>
            </div>
            <div class="tile">
              <div class="tile-icon accent-success">✓</div>
              <div class="tile-label">Approved at County</div>
              <div class="tile-value">{{ fmt(submission.approvedCounty.total) }}</div>
              <div class="tile-foot">
                <span>Sub-Counties: <strong>{{ submission.approvedCounty.subCounties }}</strong></span>
                <span>County Budget: <strong>{{ submission.approvedCounty.countyLabel }}</strong></span>
              </div>
            </div>
            <div class="tile">
              <div class="tile-icon accent-success">✓</div>
              <div class="tile-label">Approved by National</div>
              <div class="tile-value">{{ fmt(submission.approvedNational.total) }}</div>
              <div class="tile-foot">
                <span>Sub-Counties: <strong>{{ submission.approvedNational.subCounties }}</strong></span>
                <span>County Budget: <strong>{{ submission.approvedNational.county }}</strong></span>
              </div>
            </div>
            <div class="tile">
              <div class="tile-icon accent-danger">↺</div>
              <div class="tile-label">Referred</div>
              <div class="tile-value">{{ fmt(submission.referred.total) }}</div>
              <div class="tile-foot">
                <span>Sub-Counties: <strong>{{ submission.referred.subCounties }}</strong></span>
                <span>County Budget: <strong>{{ submission.referred.county }}</strong></span>
              </div>
            </div>
            <div class="tile">
              <div class="tile-icon accent-warning">◷</div>
              <div class="tile-label">Yet to Submit</div>
              <div class="tile-value">{{ fmt(submission.yetToSubmit.total) }}</div>
              <div class="tile-foot">
                <span>Sub-Counties: <strong>{{ submission.yetToSubmit.subCounties }}</strong></span>
                <span>County Budget: <strong>{{ submission.yetToSubmit.county }}</strong></span>
              </div>
            </div>
          </div>
        </section>

        <!-- ───────── Status lists (per stage) ───────── -->
        <section class="panel">
          <div class="panel-title">Submissions by Stage</div>
          <div class="status-row">
            <div
              v-for="col in statusColumns"
              :key="col.key"
              class="status-col"
            >
              <div class="status-col-head">
                <span class="status-col-title">{{ col.title }}</span>
                <span class="status-col-count" :class="col.accent">{{ col.list.length }}</span>
              </div>
              <div v-if="!col.list.length" class="status-col-empty">
                {{ col.empty }}
              </div>
              <ul v-else class="status-col-list">
                <li
                  v-for="(item, idx) in col.list"
                  :key="(item.id || idx) + '-' + col.key"
                  class="status-col-item"
                  :class="{ 'is-county-budget': item.type === 'county' }"
                >
                  <span class="sci-icon">{{ item.type === 'county' ? '▤' : '◉' }}</span>
                  <span class="sci-name">{{ item.name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- ───────── Key Financial & Coverage Ratios ───────── -->
        <section class="panel">
          <div class="panel-title">Key Financial &amp; Coverage Ratios</div>
          <div class="tile-row tile-row-4">
            <div class="tile">
              <div class="tile-icon">◎</div>
              <div class="tile-label">Budget Coverage Rate</div>
              <div class="tile-value">{{ ratios.coverageRate.toFixed(1) }}%</div>
              <div class="tile-sub">{{ ratios.coverageLabel }}</div>
            </div>
            <div class="tile">
              <div class="tile-icon">▥</div>
              <div class="tile-label">Avg Cost per Capita (KES)</div>
              <div class="tile-value">{{ ratios.avgCostPerCapita.toFixed(2) }}</div>
              <div class="tile-sub">Total: {{ fmt(ratios.totalBudget) }}</div>
            </div>
            <div class="tile">
              <div class="tile-icon">❂</div>
              <div class="tile-label">Nets per Distribution Post</div>
              <div class="tile-value">{{ fmt(ratios.netsPerPost) }}</div>
              <div class="tile-sub">{{ ratios.netsPerPostLabel }}</div>
            </div>
            <div class="tile">
              <div class="tile-icon">◉</div>
              <div class="tile-label">Population per Post</div>
              <div class="tile-value">{{ fmt(ratios.populationPerPost) }}</div>
              <div class="tile-sub">{{ ratios.populationPerPostLabel }}</div>
            </div>
          </div>
        </section>

        <!-- ───────── Two-column insight row ───────── -->
        <a-row :gutter="[16, 16]" class="insight-row">
          <a-col :xs="24" :lg="12">
            <section class="panel full-height">
              <div class="panel-title">⏱ Sub-County vs County Budget Split</div>
              <div class="split-row">
                <div class="split-label">Sub-County Budgets</div>
                <div class="split-value">
                  KES {{ fmt(split.subCounty) }}
                  <span class="split-percent">({{ split.subCountyPct.toFixed(1) }}%)</span>
                </div>
              </div>
              <a-progress
                :percent="split.subCountyPct"
                :show-info="false"
                stroke-color="#20C997"
                trail-color="#e1efe6"
                :stroke-width="6"
              />
              <div class="split-row">
                <div class="split-label">County Budget</div>
                <div class="split-value">
                  KES {{ fmt(split.county) }}
                  <span class="split-percent">({{ split.countyPct.toFixed(1) }}%)</span>
                </div>
              </div>
              <a-progress
                :percent="split.countyPct"
                :show-info="false"
                stroke-color="#0f9d58"
                trail-color="#e1efe6"
                :stroke-width="6"
              />
              <div class="grand-total">
                <span>Grand Total</span>
                <strong>KES {{ fmt(split.total) }}</strong>
              </div>
            </section>
          </a-col>

          <a-col :xs="24" :lg="12">
            <section class="panel full-height">
              <div class="panel-title">⌂ Household Coverage</div>
              <div class="list-row">
                <span class="list-label">Total Households</span>
                <span class="list-value">{{ fmt(coverage.households) }}</span>
              </div>
              <div class="list-row">
                <span class="list-label">Nets to Distribute</span>
                <span class="list-value">{{ fmt(coverage.nets) }}</span>
              </div>
              <div class="list-row">
                <span class="list-label">Avg Nets per Household</span>
                <span class="list-value">{{ coverage.netsPerHousehold.toFixed(2) }}</span>
              </div>
              <div class="coverage-bar">
                <a-progress
                  :percent="Math.min(100, coverage.coveragePct)"
                  :show-info="false"
                  stroke-color="#0f9d58"
                  trail-color="#e1efe6"
                  :stroke-width="10"
                />
                <div class="coverage-caption">
                  Coverage: <strong>{{ coverage.coveragePct.toFixed(1) }}%</strong>
                </div>
              </div>
            </section>
          </a-col>
        </a-row>
            </a-spin>
            <span v-if="gatedId" style="display:none;">{{ gatedId }}</span>
          </template>
        </CountyAccessGate>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';
import CountyAccessGate from './CountyAccessGate.vue';

const emptyBucket = () => ({ total: 0, subCounties: 0, county: 0, countyLabel: '0' });

export default {
  name: 'CountyDashboard',
  components: { Main, RecordViewWrapper, BudgetPageWrapper, CountyAccessGate },
  setup() {
    const loading = ref(false);
    const dashboard = ref(null);
    const scopedCountyId = ref(null);
    const scopedCountyName = ref('');
    const financialYear = ref(String(new Date().getFullYear()));

    const fetchDashboard = async () => {
      if (!scopedCountyId.value) return;
      loading.value = true;
      try {
        const { data } = await axios.get('get_county_budget_dashboard', {
          params: {
            county_id: scopedCountyId.value,
            financial_year: financialYear.value,
          },
        });
        dashboard.value = data || null;
      } catch (err) {
        message.error('Failed to load county budget dashboard');
        // eslint-disable-next-line no-console
        console.error('get_county_budget_dashboard error:', err);
      } finally {
        loading.value = false;
      }
    };

    const onScopeChange = ({ countyId, countyName }) => {
      scopedCountyId.value = countyId;
      scopedCountyName.value = countyName || '';
      fetchDashboard();
    };

    const countyName = computed(
      () => (dashboard.value && dashboard.value.county_name) || 'County',
    );
    const fiscalYear = computed(
      () => (dashboard.value && dashboard.value.financial_year) || '',
    );

    const readBucket = (b) => {
      const x = b || {};
      const subCounties = x.sub_counties == null ? 0 : x.sub_counties;
      const county = x.county_budget == null ? 0 : x.county_budget;
      const total = x.total == null ? subCounties + (Number(county) || 0) : x.total;
      return {
        total: Number(total) || 0,
        subCounties: Number(subCounties) || 0,
        county: Number(county) || 0,
        countyLabel: county === null || county === undefined || county === '' ? '0' : String(county),
      };
    };

    const submission = computed(() => {
      const s = (dashboard.value && dashboard.value.submission_status) || {};
      return {
        expected: readBucket(s.expected_budgets),
        submitted: readBucket(s.submitted),
        approvedCounty: readBucket(s.approved_at_county),
        approvedNational: readBucket(s.approved_by_national),
        referred: readBucket(s.referred),
        yetToSubmit: readBucket(s.yet_to_submit),
      };
    });

    const statusColumns = computed(() => {
      const lists = (dashboard.value && dashboard.value.status_lists) || {};
      return [
        {
          key: 'submitted_for_review',
          title: 'Submitted for Review',
          accent: 'accent-info',
          empty: 'None submitted',
          list: lists.submitted_for_review || [],
        },
        {
          key: 'approved_at_county',
          title: 'Approved at County',
          accent: 'accent-success',
          empty: 'None approved yet',
          list: lists.approved_at_county || [],
        },
        {
          key: 'approved_by_national',
          title: 'Approved by National',
          accent: 'accent-success',
          empty: 'None approved yet',
          list: lists.approved_by_national || [],
        },
        {
          key: 'referred',
          title: 'Referred',
          accent: 'accent-danger',
          empty: 'None referred',
          list: lists.referred || [],
        },
        {
          key: 'yet_to_submit',
          title: 'Yet to Submit',
          accent: 'accent-warning',
          empty: 'All submitted',
          list: lists.yet_to_submit || [],
        },
      ];
    });

    // Convert a 0–1 fraction to a 0–100 percent; pass through values already > 1.
    const toPercent = (v) => {
      const n = Number(v) || 0;
      return n > 0 && n <= 1 ? n * 100 : n;
    };

    const ratios = computed(() => {
      const r = (dashboard.value && dashboard.value.coverage_ratios) || {};
      return {
        coverageRate: toPercent(r.budget_coverage_rate),
        coverageLabel: r.budget_coverage_label || '',
        avgCostPerCapita: Number(r.avg_cost_per_capita_kes) || 0,
        totalBudget: Number(r.avg_cost_total_kes) || 0,
        netsPerPost: Number(r.nets_per_distribution_post) || 0,
        netsPerPostLabel: r.nets_per_post_label || '',
        populationPerPost: Number(r.population_per_post) || 0,
        populationPerPostLabel: r.population_per_post_label || '',
      };
    });

    const split = computed(() => {
      const b = (dashboard.value && dashboard.value.budget_split) || {};
      const sub = b.sub_county || {};
      const co = b.county || {};
      return {
        subCounty: Number(sub.total_kes) || 0,
        county: Number(co.total_kes) || 0,
        total: Number(b.grand_total_kes) || 0,
        subCountyPct: Number(sub.percentage) || 0,
        countyPct: Number(co.percentage) || 0,
      };
    });

    const coverage = computed(() => {
      const c = (dashboard.value && dashboard.value.household_coverage) || {};
      return {
        households: Number(c.total_households) || 0,
        nets: Number(c.nets_to_distribute) || 0,
        netsPerHousehold: Number(c.avg_nets_per_household) || 0,
        coveragePct: toPercent(c.coverage_percentage),
      };
    });

    const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

    return {
      loading,
      countyName,
      scopedCountyName,
      fiscalYear,
      financialYear,
      submission,
      statusColumns,
      ratios,
      split,
      coverage,
      fmt,
      onScopeChange,
      emptyBucket,
    };
  },
};
</script>

<style lang="less" scoped>
/* Green-gradient palette aligned with NationalDashboard */
.minimal-dashboard {
  color: #272b41;

  .panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 10px;
    padding: 16px 20px 18px;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }
  .panel.full-height { height: 100%; }
  .panel-title {
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .insight-row { margin-bottom: 0; }

  /* Tile grid */
  .tile-row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .tile-row-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .tile-row-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .tile-row-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  @media (max-width: 1100px) {
    .tile-row-4,
    .tile-row-5,
    .tile-row-6 {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
  }

  .tile {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 8px;
    padding: 14px 16px;
    text-align: center;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
    &:hover {
      border-color: #9ad8b4;
      box-shadow: 0 6px 14px rgba(28, 122, 72, 0.10);
      transform: translateY(-1px);
    }

    .tile-icon {
      font-size: 14px;
      color: #4d8a63;
      margin-bottom: 6px;
      line-height: 1;
      &.accent-info { color: #2c99ff; }
      &.accent-success { color: #20c997; }
      &.accent-warning { color: #fa8b0c; }
      &.accent-danger { color: #ff4d4f; }
    }
    .tile-label {
      font-size: 11px;
      color: #7a8a82;
      margin-bottom: 6px;
      line-height: 1.2;
    }
    .tile-value {
      font-size: 22px;
      font-weight: 800;
      color: #15693c;
      line-height: 1.1;
    }
    .tile-foot {
      margin-top: 8px;
      font-size: 11px;
      color: #7a8a82;
      display: flex;
      justify-content: space-between;
      gap: 6px;
      strong { color: #15693c; font-weight: 700; }
    }
    .tile-sub {
      margin-top: 6px;
      font-size: 11px;
      color: #7a8a82;
    }
  }

  /* Status columns row */
  .status-row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  @media (max-width: 1100px) {
    .status-row { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  }

  .status-col {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 8px;
    padding: 12px 12px 10px;
    min-height: 220px;
    display: flex;
    flex-direction: column;

    .status-col-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .status-col-title {
        font-size: 12px;
        font-weight: 700;
        color: #2f6746;
      }
      .status-col-count {
        font-size: 11px;
        font-weight: 700;
        color: #fff;
        background: #4d8a63;
        border-radius: 999px;
        padding: 1px 8px;
        min-width: 22px;
        text-align: center;
        &.accent-info { background: #2c99ff; }
        &.accent-success { background: #20c997; }
        &.accent-warning { background: #fa8b0c; }
        &.accent-danger { background: #ff4d4f; }
      }
    }
    .status-col-empty {
      color: #b0b8c3;
      font-size: 11px;
      flex: 1;
    }
    .status-col-list {
      list-style: none;
      margin: 0;
      padding: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
      max-height: 320px;
    }
    .status-col-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      background: #f6fbf8;
      border: 1px solid #eaf4ee;
      border-radius: 6px;
      font-size: 12px;
      color: #1f2437;
      &.is-county-budget {
        background: #f4f8ff;
        border-color: #dfe9fb;
      }
      .sci-icon {
        font-size: 11px;
        color: #4d8a63;
      }
      .sci-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  /* Split / coverage panels */
  .split-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 10px;
    margin-bottom: 4px;
    .split-label { font-size: 12px; color: #4d8a63; }
    .split-value {
      font-size: 13px;
      font-weight: 700;
      color: #15693c;
      .split-percent { color: #7a8a82; font-weight: 400; margin-left: 2px; }
    }
  }
  .grand-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #d9f0e2;
    font-size: 13px;
    color: #15693c;
    strong { font-size: 14px; font-weight: 800; }
  }
  .list-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e6f3eb;
    &:last-of-type { border-bottom: none; }
    .list-label { font-size: 12px; color: #4d8a63; }
    .list-value { font-size: 13px; font-weight: 700; color: #15693c; }
  }
  .coverage-bar {
    margin-top: 14px;
    .coverage-caption {
      text-align: center;
      font-size: 11px;
      color: #7a8a82;
      margin-top: 4px;
      strong { color: #15693c; }
    }
  }
}
</style>
