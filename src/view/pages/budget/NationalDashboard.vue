<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard">
        <!-- Slim top bar -->

        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> National Budget Dashboard
            </h3>
            <p class="ph-subtitle">Overview of all county and sub-county budget submissions</p>
          </div>
          <div class="ph-actions">
            <a-tag color="green">FY {{ fiscalYear }}</a-tag>
          </div>
        </div>

        <!-- ───────── Submission Status ───────── -->
        <section class="panel">
          <div class="panel-title">Submission Status</div>
          <div class="tile-row tile-row-6">
            <div class="tile">
              <div class="tile-icon">📍</div>
              <div class="tile-label">Counties</div>
              <div class="tile-value">{{ fmt(submission.counties) }}</div>
            </div>
            <div class="tile">
              <div class="tile-icon">📍</div>
              <div class="tile-label">Sub-Counties</div>
              <div class="tile-value">{{ fmt(submission.subCounties) }}</div>
            </div>
            <div class="tile">
              <div class="tile-icon">▦</div>
              <div class="tile-label">Expected Budgets</div>
              <div class="tile-value">{{ fmt(submission.expected) }}</div>
              <div class="tile-foot">
                <span>Counties: <strong>{{ submission.counties }}</strong></span>
                <span>Sub-Counties: <strong>{{ submission.subCounties }}</strong></span>
              </div>
            </div>
            <div class="tile">
              <div class="tile-icon accent-info">✈</div>
              <div class="tile-label">Submitted</div>
              <div class="tile-value">{{ fmt(submission.submitted) }}</div>
              <div class="tile-foot">
                <span>Counties: <strong>{{ submission.submittedCounties }}</strong></span>
                <span>Sub-Counties: <strong>{{ submission.submittedSubCounties }}</strong></span>
              </div>
            </div>
            <div class="tile">
              <div class="tile-icon accent-success">✓</div>
              <div class="tile-label">Nationally Approved</div>
              <div class="tile-value">{{ fmt(submission.approved) }}</div>
              <div class="tile-foot">
                <span>Counties: <strong>{{ submission.approvedCounties }}</strong></span>
                <span>Sub-Counties: <strong>{{ submission.approvedSubCounties }}</strong></span>
              </div>
            </div>
            <div class="tile">
              <div class="tile-icon accent-warning">◷</div>
              <div class="tile-label">Pending</div>
              <div class="tile-value">{{ fmt(submission.pending) }}</div>
              <div class="tile-foot">
                <span>Counties: <strong>{{ submission.pendingCounties }}</strong></span>
                <span>Sub-Counties: <strong>{{ submission.pendingSubCounties }}</strong></span>
              </div>
            </div>
          </div>
        </section>

        <!-- ───────── Programmatic & Financial Analysis ───────── -->
        <section class="panel">
          <div class="panel-title">Programmatic &amp; Financial Analysis</div>
          <div class="tile-row tile-row-5">
            <div class="tile">
              <div class="tile-icon">👥</div>
              <div class="tile-label">Target Population</div>
              <div class="tile-value">{{ fmt(program.targetPopulation) }}</div>
            </div>
            <div class="tile">
              <div class="tile-icon">❂</div>
              <div class="tile-label">Total Nets to Distribute</div>
              <div class="tile-value">{{ fmt(program.totalNets) }}</div>
            </div>
            <div class="tile">
              <div class="tile-icon">⌂</div>
              <div class="tile-label">Nets per Household</div>
              <div class="tile-value">{{ program.netsPerHousehold.toFixed(2) }}</div>
            </div>
            <div class="tile">
              <div class="tile-icon">$</div>
              <div class="tile-label">Cost per Net (KES)</div>
              <div class="tile-value">{{ program.costPerNet.toFixed(2) }}</div>
            </div>
            <div class="tile">
              <div class="tile-icon">▤</div>
              <div class="tile-label">Total Distribution Posts</div>
              <div class="tile-value">{{ fmt(program.distributionPosts) }}</div>
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
              <div class="tile-sub">{{ ratios.coverageApproved }} of {{ ratios.coverageTotal }} budgets</div>
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
              <div class="tile-sub">
                {{ fmt(program.totalNets) }} nets / {{ fmt(program.distributionPosts) }} posts
              </div>
            </div>
            <div class="tile">
              <div class="tile-icon">◉</div>
              <div class="tile-label">Population per Post</div>
              <div class="tile-value">{{ fmt(ratios.populationPerPost) }}</div>
              <div class="tile-sub">{{ fmt(program.targetPopulation) }} people</div>
            </div>
          </div>
        </section>

        <!-- ───────── Two-column insight row ───────── -->
        <a-row :gutter="[16, 16]" class="insight-row">
          <a-col :xs="24" :lg="12">
            <section class="panel full-height">
              <div class="panel-title">⏱ County vs Sub-County Budget Split</div>
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
                <div class="split-label">County Budgets</div>
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
                  :percent="coverage.coveragePct"
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

        <!-- ───────── Top 5 Counties tables ───────── -->
        <a-row :gutter="[16, 16]" class="insight-row">
          <a-col :xs="24" :lg="12">
            <section class="panel full-height">
              <div class="panel-title"><span class="accent-success-text">↘</span> Top 5 Counties – Lowest Cost per Net</div>
              <a-table
                :dataSource="topLowest"
                :columns="topColumns"
                :pagination="false"
                row-key="id"
                size="small"
                class="minimal-table"
              >
                <template #bodyCell="{ column, record }">
                  <span v-if="column.key === 'cost_per_net'">
                    {{ record.cost_per_net > 0 ? Number(record.cost_per_net).toLocaleString() : '—' }}
                  </span>
                  <span v-else-if="column.key === 'total_nets'">
                    {{ fmt(record.total_nets) }}
                  </span>
                  <span v-else-if="column.key === 'total_budget'">
                    {{ record.total_budget > 0 ? Number(record.total_budget).toLocaleString() : '—' }}
                  </span>
                </template>
              </a-table>
            </section>
          </a-col>

          <a-col :xs="24" :lg="12">
            <section class="panel full-height">
              <div class="panel-title"><span class="accent-danger-text">↗</span> Top 5 Counties – Highest Cost per Net</div>
              <a-table
                :dataSource="topHighest"
                :columns="topColumns"
                :pagination="false"
                row-key="id"
                size="small"
                class="minimal-table"
              >
                <template #bodyCell="{ column, record }">
                  <span v-if="column.key === 'cost_per_net'">
                    {{ record.cost_per_net > 0 ? Number(record.cost_per_net).toLocaleString() : '—' }}
                  </span>
                  <span v-else-if="column.key === 'total_nets'">
                    {{ fmt(record.total_nets) }}
                  </span>
                  <span v-else-if="column.key === 'total_budget'">
                    {{ record.total_budget > 0 ? Number(record.total_budget).toLocaleString() : '—' }}
                  </span>
                </template>
              </a-table>
            </section>
          </a-col>
        </a-row>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

export default {
  name: 'NationalDashboard',
  components: { Main, RecordViewWrapper, BudgetPageWrapper },
  setup() {
    const loading = ref(false);
    const fiscalYear = ref('2026/2027');
    const countyList = ref([]);
    const dashboard = ref(null);

    const fetchDashboard = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_national_budget_dashboard');
        dashboard.value = data || null;
        if (data && data.financial_year) {
          fiscalYear.value = data.financial_year;
        }
      } catch (err) {
        message.error('Failed to load national budget dashboard');
        // eslint-disable-next-line no-console
        console.error('get_national_budget_dashboard error:', err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchDashboard);

    const submission = computed(() => {
      const s = (dashboard.value && dashboard.value.submission_status) || {};
      const expected = s.expected_budgets || {};
      const submitted = s.submitted || {};
      const approved = s.nationally_approved || {};
      const pending = s.pending || {};
      return {
        counties: s.counties || 0,
        subCounties: s.sub_counties || 0,
        expected: expected.total || 0,
        expectedCounties: expected.counties || 0,
        expectedSubCounties: expected.sub_counties || 0,
        submitted: submitted.total || 0,
        submittedCounties: submitted.counties || 0,
        submittedSubCounties: submitted.sub_counties || 0,
        approved: approved.total || 0,
        approvedCounties: approved.counties || 0,
        approvedSubCounties: approved.sub_counties || 0,
        pending: pending.total || 0,
        pendingCounties: pending.counties || 0,
        pendingSubCounties: pending.sub_counties || 0,
      };
    });

    const program = computed(() => {
      const p = (dashboard.value && dashboard.value.programmatic_analysis) || {};
      const h = (dashboard.value && dashboard.value.household_coverage) || {};
      return {
        targetPopulation: p.target_population || 0,
        totalNets: p.total_nets_to_distribute || 0,
        households: h.total_households || 0,
        netsPerHousehold: p.nets_per_household || 0,
        costPerNet: p.cost_per_net_kes || 0,
        distributionPosts: p.total_distribution_posts || 0,
      };
    });

    const ratios = computed(() => {
      const r = (dashboard.value && dashboard.value.coverage_ratios) || {};
      return {
        coverageRate: r.budget_coverage_rate || 0,
        coverageApproved: submission.value.approved,
        coverageTotal: submission.value.expected,
        avgCostPerCapita: r.avg_cost_per_capita_kes || 0,
        totalBudget: r.avg_cost_total_kes || 0,
        netsPerPost: r.nets_per_distribution_post || 0,
        populationPerPost: r.population_per_post || 0,
      };
    });

    const split = computed(() => {
      const b = (dashboard.value && dashboard.value.budget_split) || {};
      const sub = b.sub_county || {};
      const co = b.county || {};
      return {
        subCounty: sub.total_kes || 0,
        county: co.total_kes || 0,
        total: b.grand_total_kes || 0,
        subCountyPct: sub.percentage || 0,
        countyPct: co.percentage || 0,
      };
    });

    const coverage = computed(() => {
      const c = (dashboard.value && dashboard.value.household_coverage) || {};
      return {
        households: c.total_households || 0,
        nets: c.nets_to_distribute || 0,
        netsPerHousehold: c.avg_nets_per_household || 0,
        coveragePct: c.coverage_percentage || 0,
      };
    });

    const topColumns = [
      { title: 'County', dataIndex: 'name', key: 'name' },
      { title: 'Cost/Net (KES)', key: 'cost_per_net' },
      { title: 'Total Nets', key: 'total_nets' },
      { title: 'Budget (KES)', key: 'total_budget' },
    ];

    const withCostPerNet = computed(() =>
      countyList.value.filter((c) => c.cost_per_net > 0),
    );
    const topLowest = computed(() =>
      [...withCostPerNet.value]
        .sort((a, b) => a.cost_per_net - b.cost_per_net)
        .slice(0, 5),
    );
    const topHighest = computed(() =>
      [...withCostPerNet.value]
        .sort((a, b) => b.cost_per_net - a.cost_per_net)
        .slice(0, 5),
    );

    const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

    return {
      loading,
      fiscalYear,
      submission,
      program,
      ratios,
      split,
      coverage,
      topColumns,
      topLowest,
      topHighest,
      fmt,
    };
  },
};
</script>

<style lang="less" scoped>
/* Green-gradient palette aligned with Budget Categories / Parameters */
.minimal-dashboard {
  color: #272b41;

  .budget-hero {
    margin-bottom: 16px;
  }

  .panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 10px;
    padding: 16px 20px 18px;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }
  .panel.full-height {
    height: 100%;
  }
  .panel-title {
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .insight-row {
    margin-bottom: 0;
  }

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
      flex-direction: column;
      gap: 2px;
      strong {
        color: #15693c;
        font-weight: 700;
      }
    }
    .tile-sub {
      margin-top: 6px;
      font-size: 11px;
      color: #7a8a82;
    }
  }

  /* Split / coverage panels */
  .split-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 10px;
    margin-bottom: 4px;
    .split-label {
      font-size: 12px;
      color: #4d8a63;
    }
    .split-value {
      font-size: 13px;
      font-weight: 700;
      color: #15693c;
      .split-percent {
        color: #7a8a82;
        font-weight: 400;
        margin-left: 2px;
      }
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
    strong {
      font-size: 14px;
      font-weight: 800;
    }
  }
  .list-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e6f3eb;
    &:last-of-type { border-bottom: none; }
    .list-label {
      font-size: 12px;
      color: #4d8a63;
    }
    .list-value {
      font-size: 13px;
      font-weight: 700;
      color: #15693c;
    }
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

  /* Tables – green-tinted minimal */
  :deep(.minimal-table) {
    .ant-table {
      background: transparent;
    }
    .ant-table-thead > tr > th {
      background: #f4fbf6;
      border-bottom: 1px solid #d9f0e2;
      color: #2f6746;
      font-weight: 700;
      font-size: 11px;
      text-transform: none;
    }
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid #eaf4ee;
      font-size: 12px;
      color: #1f2437;
    }
    .ant-table-tbody > tr:hover > td {
      background: #f5fbf7;
    }
    .ant-table-placeholder {
      color: #9ab5a4;
    }
  }

  .accent-success-text { color: #20c997; }
  .accent-danger-text { color: #ff4d4f; }
}
</style>
