<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="financial-analysis">
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">◔</span> Financial Analysis
            </h3>
            <p class="ph-subtitle">
              Approved operational budgets by county, component and cost category
            </p>
          </div>
          <div class="ph-actions">
            <a-tag color="green">Approved</a-tag>
            <a-button size="small" :disabled="!hasRows" @click="exportExcel">
              <file-excel-outlined /> Excel
            </a-button>
            <a-button size="small" :disabled="!hasRows" @click="exportPdf">
              <file-pdf-outlined /> PDF
            </a-button>
            <a-button size="small" :loading="loading" @click="fetchAnalysis">
              <reload-outlined />
            </a-button>
          </div>
        </div>

        <a-spin :spinning="loading">
          <!-- ───────── Financial Indicators ───────── -->
          <section class="panel">
            <div class="panel-title">Financial Indicators</div>
            <div class="tile-row tile-row-6">
              <div class="tile">
                <div class="tile-icon">◎</div>
                <div class="tile-label">National Approval Rate</div>
                <div class="tile-value">{{ approvalRatePct }}</div>
                <div class="tile-sub">{{ indicators.national_approval_rate.label }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-info">✈</div>
                <div class="tile-label">Awaiting National Approval</div>
                <div class="tile-value">
                  KES {{ money(indicators.awaiting_national_approval.amount) }}
                </div>
                <div class="tile-sub">{{ indicators.awaiting_national_approval.label }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-success">✓</div>
                <div class="tile-label">Approved Budgets</div>
                <div class="tile-value">KES {{ money(indicators.approved_budgets.amount) }}</div>
                <div class="tile-sub">
                  {{ indicators.approved_budgets.count }} budget(s) approved
                </div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-warning">%</div>
                <div class="tile-label">Approved Special-Cost Share</div>
                <div class="tile-value">{{ specialCostSharePct }}</div>
                <div class="tile-sub">{{ indicators.approved_special_cost_share.label }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon">⌂</div>
                <div class="tile-label">Approved Cost per Household</div>
                <div class="tile-value">
                  KES {{ money(indicators.approved_cost_per_household.amount) }}
                </div>
                <div class="tile-sub">{{ indicators.approved_cost_per_household.label }}</div>
              </div>
              <div class="tile">
                <div class="tile-icon accent-purple">▦</div>
                <div class="tile-label">Units in Scope</div>
                <div class="tile-value">{{ indicators.units_in_scope.counties }}</div>
                <div class="tile-sub">{{ indicators.units_in_scope.label }}</div>
              </div>
            </div>
          </section>
          <!-- ───────── Approved Budget Analysis ───────── -->
          <section ref="analysisPanel" class="panel">
            <div class="panel-title">
              Approved Budget Analysis
              <span class="panel-hint">{{ scopeLabel }}</span>
            </div>

            <div v-if="!hasApprovedBudget" class="empty-note">
              No approved budgets yet for the selected scope — this analysis fills
              in as county and sub-county budgets are approved.
            </div>

            <a-table
              :dataSource="tableRows"
              :columns="columns"
              :pagination="false"
              :rowClassName="rowClass"
              :scroll="{ x: 960 }"
              row-key="key"
              size="small"
              class="minimal-table"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="moneyKeys.includes(column.key)">
                  <span :class="{ 'is-zero': !record[column.key] }">
                    {{ cellMoney(record[column.key]) }}
                  </span>
                </template>
                <template v-else-if="column.key === 'name'">
                  <span v-if="record.kind === 'county'" class="child-count">
                    {{ subCountyLabel(record) }}
                  </span>
                  <span v-else>{{ record.name }}</span>
                </template>
              </template>
            </a-table>

            <div class="table-note">
              Click <strong>+</strong> on a county to open its county-level line
              and its sub-counties. Each county line carries the county's
              rolled-up total, so the visible county lines always add up to the
              Grand Total, and
              <strong>Approved Amounts = Allowances + Fuel + Procurements + Other</strong>.
            </div>
          </section>

          <!-- ───────── Category Key ───────── -->
          <section class="panel">
            <div class="panel-title">Category Key</div>
            <div class="key-grid">
              <div v-for="group in costGroups" :key="group.key" class="key-item">
                <div class="key-label">{{ group.label }}</div>
                <div class="key-desc">{{ group.description }}</div>
              </div>
            </div>
          </section>

          <!-- ───────── Funding Allocations ───────── -->
          <!-- Extension point: the API returns `funding_allocations` (currently
               empty) because budgets carry no funding source yet. The section
               renders itself as soon as the API fills that list. -->
          <section v-if="fundingAllocations.length" class="panel">
            <div class="panel-title">Funding Allocations</div>
            <a-table
              :dataSource="fundingAllocations"
              :columns="fundingColumns"
              :pagination="false"
              row-key="source"
              size="small"
              class="minimal-table"
            >
              <template #bodyCell="{ column, record }">
                <span v-if="moneyKeys.includes(column.key)" :class="{ 'is-zero': !record[column.key] }">
                  {{ money(record[column.key]) }}
                </span>
              </template>
            </a-table>
          </section>
        </a-spin>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import {
  FileExcelOutlined,
  FilePdfOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

/**
 * The money columns of one analysis row, in the order they are rendered.
 * Kept in one place so the table, the Excel export and the PDF can never drift
 * apart. `approved_total` is the sum of the other four, so the page reconciles.
 */
const MONEY_KEYS = ['approved_total', 'allowances', 'fuel', 'procurements', 'other'];

/** Pick the money columns of one API row, defaulting anything missing to 0. */
function pickAmounts(row) {
  return MONEY_KEYS.reduce((amounts, key) => {
    amounts[key] = Number((row && row[key]) || 0);
    return amounts;
  }, {});
}

export default {
  name: 'FinancialAnalysis',
  components: {
    Main,
    RecordViewWrapper,
    BudgetPageWrapper,
    FileExcelOutlined,
    FilePdfOutlined,
    ReloadOutlined,
  },
  setup() {
    const loading = ref(false);
    const analysis = ref(null);
    const analysisPanel = ref(null);

    // get_budget_financial_analysis — every aggregate is computed server-side
    // (BudgetFinancialAnalysisService), so this page only renders.
    const fetchAnalysis = async () => {
      loading.value = true;
      try {
        const { data } = await axios.get('get_budget_financial_analysis');
        analysis.value = data || null;
      } catch (err) {
        message.error('Failed to load the financial analysis');
        // eslint-disable-next-line no-console
        console.error('get_budget_financial_analysis error:', err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchAnalysis);

    // ── Indicators ──────────────────────────────────────────────────────────
    // Each card is defaulted so a partial/empty payload still renders instead
    // of blowing up on a missing key.
    const indicators = computed(() => {
      const raw = (analysis.value && analysis.value.indicators) || {};
      const withLabel = (key, fallback) => ({ label: fallback, ...(raw[key] || {}) });

      return {
        national_approval_rate: withLabel('national_approval_rate', '0 of 0 expected budgets'),
        awaiting_national_approval: withLabel('awaiting_national_approval', '0 budgets ready for national review'),
        approved_budgets: withLabel('approved_budgets', 'Approved operational budgets'),
        approved_special_cost_share: withLabel('approved_special_cost_share', 'Special costs / total approved amount'),
        approved_cost_per_household: withLabel('approved_cost_per_household', 'Households in scope'),
        units_in_scope: withLabel('units_in_scope', 'Counties in scope'),
      };
    });

    const approvalRatePct = computed(
      () => `${Number(indicators.value.national_approval_rate.percentage || 0).toFixed(1)}%`,
    );
    const specialCostSharePct = computed(
      () => `${Number(indicators.value.approved_special_cost_share.percentage || 0).toFixed(1)}%`,
    );

    const costGroups = computed(() => (analysis.value && analysis.value.cost_groups) || []);
    const fundingAllocations = computed(
      () => (analysis.value && analysis.value.funding_allocations) || [],
    );

    const analysisData = computed(
      () => (analysis.value && analysis.value.approved_budget_analysis) || null,
    );
    const hasApprovedBudget = computed(
      () => !!(analysis.value && analysis.value.meta && analysis.value.meta.has_approved_budget),
    );

    const scopeLabel = computed(() => {
      const fy = analysis.value && analysis.value.filters && analysis.value.filters.financial_year;
      return fy ? `FY ${fy}` : 'All financial years';
    });

    // ── Analysis rows ───────────────────────────────────────────────────────
    // ONE line per county, collapsed by default. The county line carries the
    // county's rolled-up total and its components hang off it as `children`, so
    // the "+" at the start of the row opens the county's own county-level line
    // plus one line per sub-county. ant-design-vue builds the tree (and renders
    // the expand icon) straight from `children`, and keeps every money column
    // aligned across parents and children.
    const tableRows = computed(() => {
      const counties = (analysisData.value && analysisData.value.counties) || [];

      const rows = counties.map((county) => {
        const components = county.components || [];

        const children = [
          {
            key: `${county.county_id}-own`,
            kind: 'own',
            name: (county.own && county.own.name) || county.county_name,
            ...pickAmounts(county.own),
          },
          ...components.map((component, index) => ({
            key: `${county.county_id}-c${index}`,
            kind: 'component',
            name: component.name,
            ...pickAmounts(component),
          })),
        ];

        return {
          key: `county-${county.county_id}`,
          kind: 'county',
          county_name: county.county_name,
          // The collapsed line is the county total, so what is visible always
          // adds up to the Grand Total below.
          ...pickAmounts(county.totals),
          sub_county_count: county.components_count === undefined
            ? components.length
            : county.components_count,
          children,
        };
      });

      if (rows.length) {
        rows.push({
          key: 'grand-total',
          kind: 'grand',
          county_name: 'Grand Total',
          ...pickAmounts(analysisData.value && analysisData.value.grand_total),
        });
      }

      return rows;
    });

    // A lone Grand Total row means there is nothing approved to analyse yet.
    const hasRows = computed(() => tableRows.value.length > 1);

    /** What the closed county line says the "+" will reveal. */
    const subCountyLabel = (record) => {
      const count = record.sub_county_count;
      if (!count) {
        return 'County-level budget only';
      }

      return `${count} sub-count${count === 1 ? 'y' : 'ies'}`;
    };

    const columns = [
      // The tree's "+" / "−" toggle renders at the start of this first column.
      { title: 'County', dataIndex: 'county_name', key: 'county_name', width: 190 },
      { title: 'Components', dataIndex: 'name', key: 'name' },
      { title: 'Approved Amounts (KES)', dataIndex: 'approved_total', key: 'approved_total', align: 'right' },
      { title: 'Allowances (KES)', dataIndex: 'allowances', key: 'allowances', align: 'right' },
      { title: 'Fuel (KES)', dataIndex: 'fuel', key: 'fuel', align: 'right' },
      { title: 'Procurements (KES)', dataIndex: 'procurements', key: 'procurements', align: 'right' },
      { title: 'Other (KES)', dataIndex: 'other', key: 'other', align: 'right' },
    ];

    // Rendered only once the API starts returning funding sources.
    const fundingColumns = [
      { title: 'Funding Source', dataIndex: 'source', key: 'source' },
      { title: 'Approved Amounts (KES)', dataIndex: 'approved_total', key: 'approved_total', align: 'right' },
      { title: 'Allowances (KES)', dataIndex: 'allowances', key: 'allowances', align: 'right' },
      { title: 'Fuel (KES)', dataIndex: 'fuel', key: 'fuel', align: 'right' },
      { title: 'Procurements (KES)', dataIndex: 'procurements', key: 'procurements', align: 'right' },
    ];

    const rowClass = (record) => `row-${record.kind}`;

    // Tiles show real numbers (a 0 is meaningful); the analysis table follows
    // the prototype and blanks zero cells out.
    const money = (value) => Number(value || 0).toLocaleString();
    const cellMoney = (value) => (Number(value || 0) ? Number(value).toLocaleString() : '—');

    // ── Exports ─────────────────────────────────────────────────────────────
    // Excel: a FLAT version of what the table shows, so the collapsed county
    // lines are usable in a spreadsheet — every row carries its county, the
    // county line carries the county total and its components follow it.
    const exportExcel = () => {
      const header = ['County', 'Components', ...columns.slice(2).map((column) => column.title)];
      const body = [];

      tableRows.value.forEach((row) => {
        const amounts = MONEY_KEYS.map((key) => Number(row[key] || 0));

        if (row.kind === 'grand') {
          body.push([row.county_name, '', ...amounts]);
          return;
        }

        // The county's own line (the collapsed row) …
        body.push([row.county_name, subCountyLabel(row), ...amounts]);

        // … followed by the components the "+" reveals.
        (row.children || []).forEach((child) => {
          body.push([
            row.county_name,
            child.name,
            ...MONEY_KEYS.map((key) => Number(child[key] || 0)),
          ]);
        });
      });

      const sheet = XLSX.utils.aoa_to_sheet([header, ...body]);
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, sheet, 'Financial Analysis');
      XLSX.writeFile(book, 'financial-analysis.xlsx');
    };

    // PDF: rasterise the analysis panel, so the export matches what is on screen.
    const exportPdf = () => {
      if (!analysisPanel.value) {
        return;
      }

      html2pdf()
        .set({
          margin: 8,
          filename: 'financial-analysis.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' },
        })
        .from(analysisPanel.value)
        .save();
    };

    return {
      loading,
      analysisPanel,
      fetchAnalysis,
      indicators,
      approvalRatePct,
      specialCostSharePct,
      costGroups,
      fundingAllocations,
      fundingColumns,
      hasApprovedBudget,
      scopeLabel,
      tableRows,
      hasRows,
      subCountyLabel,
      columns,
      rowClass,
      money,
      cellMoney,
      moneyKeys: MONEY_KEYS,
      exportExcel,
      exportPdf,
    };
  },
};
</script>

<style lang="less" scoped>
/* Green-gradient palette — same tokens as National Dashboard /
   Budget Categories / Budget Parameters, so this sub-module reads as part of
   the budget module rather than a bolt-on. */
.financial-analysis {
  color: #272b41;

  .panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 10px;
    padding: 16px 20px 18px;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }
  .panel-title {
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .panel-hint {
    font-size: 11px;
    font-weight: 600;
    color: #7a8a82;
    background: #eaf7ef;
    border: 1px solid #d9f0e2;
    border-radius: 12px;
    padding: 1px 10px;
  }

  /* Indicator tiles */
  .tile-row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .tile-row-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  @media (max-width: 1200px) {
    .tile-row-6 { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
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
      &.accent-purple { color: #9254de; }
    }
    .tile-label {
      font-size: 11px;
      color: #7a8a82;
      margin-bottom: 6px;
      line-height: 1.2;
    }
    .tile-value {
      font-size: 20px;
      font-weight: 800;
      color: #15693c;
      line-height: 1.1;
      word-break: break-word;
    }
    .tile-sub {
      margin-top: 6px;
      font-size: 11px;
      color: #7a8a82;
      line-height: 1.35;
    }
  }

  /* Analysis / funding tables – green-tinted minimal */
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
    }
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid #eaf4ee;
      font-size: 12px;
      color: #1f2437;
      vertical-align: middle;
    }
    .ant-table-tbody > tr:hover > td {
      background: #f5fbf7;
    }
    .ant-table-placeholder {
      color: #9ab5a4;
      background: transparent;
    }
  }

  /* Row emphasis: the expandable county line, its revealed components and the
     Grand Total. */
  :deep(.row-county) > td {
    background: #f8fdfa;
    font-weight: 700;
    color: #15693c;
  }
  :deep(.row-own) > td {
    font-weight: 600;
  }
  :deep(.row-component) > td {
    color: #46695a;
  }
  :deep(.row-grand) > td {
    background: #eaf7ef;
    font-weight: 800;
    color: #15693c;
    border-top: 1px solid #d9f0e2;
  }
  .is-zero {
    color: #b8c7be;
  }
  .child-count {
    font-size: 11px;
    font-weight: 500;
    color: #7a8a82;
  }
  /* The tree's +/− toggle, tinted to the budget module palette. */
  :deep(.minimal-table .ant-table-row-expand-icon) {
    border-color: #9ad8b4;
    color: #15693c;
    &:hover {
      border-color: #15693c;
    }
  }

  /* Category legend */
  .key-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
  }
  .key-item {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 8px;
    padding: 12px 14px;
    .key-label {
      font-size: 12px;
      font-weight: 700;
      color: #15693c;
      margin-bottom: 4px;
    }
    .key-desc {
      font-size: 11px;
      color: #7a8a82;
      line-height: 1.45;
    }
  }

  /* Notes */
  .table-note,
  .empty-note {
    margin-top: 12px;
    font-size: 11px;
    line-height: 1.5;
    color: #7a8a82;
    strong {
      color: #15693c;
    }
  }
  .empty-note {
    margin: 0 0 12px;
    padding: 10px 14px;
    border: 1px dashed #cbe6d6;
    border-radius: 8px;
    background: #fbfefc;
    color: #4d8a63;
  }
}
</style>
