<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper>
        <!-- Slim top bar -->
        <div class="tool-bar">
          <span class="tool-bar-title">Budget Preparation Tool</span>
        </div>

        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Budget Review &amp; Approval
            </h3>
            <p class="ph-subtitle">Review and approve county and sub-county budget submissions</p>
          </div>
          <div class="ph-actions">
            <a-breadcrumb separator=">" class="review-crumbs">
              <a-breadcrumb-item>
                <a href="javascript:;" @click="goCounties">Counties</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item v-if="selectedCounty">
                <a href="javascript:;" @click="goCountyBudgets">{{ selectedCounty.name }}</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item v-if="selectedBudget">
                {{ selectedBudget.label }}
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
        </div>

        <!-- ════════ LEVEL 1 · County grid ════════ -->
        <template v-if="!selectedCounty">
          <div class="card-grid four-col">
            <div
              v-for="c in counties"
              :key="c.id"
              class="drill-card"
              @click="openCounty(c)"
            >
              <div class="dc-head">
                <span class="dc-title">
                  <span class="dc-icon">◎</span> {{ c.name }}
                </span>
                <span class="dc-chevron">›</span>
              </div>
              <div class="dc-meta">{{ c.sub_counties.length }} sub-counties</div>
              <a-tag v-if="c.stage" class="dc-stage">{{ c.stage }}</a-tag>
            </div>
          </div>
        </template>

        <!-- ════════ LEVEL 2 · Budgets for the selected county ════════ -->
        <template v-else-if="selectedCounty && !selectedBudget">
          <div class="level-title">
            <sdButton size="small" class="back-btn" @click="goCounties">
              ← Back to Counties
            </sdButton>
            <span class="lt-icon">◉</span>
            {{ selectedCounty.name }} — Budgets for Review
          </div>
          <div class="card-grid four-col">
            <div
              class="drill-card"
              :class="{ 'is-active': false, 'is-empty': !selectedCounty.county_budget }"
              @click="openBudget(countyBudgetRecord)"
            >
              <div class="dc-head">
                <span class="dc-title">
                  <span class="dc-icon">▤</span> County Budget
                </span>
                <span class="dc-chevron">›</span>
              </div>
              <div class="dc-meta">
                {{ selectedCounty.county_budget ? selectedCounty.county_budget.stage : 'No budget' }}
              </div>
              <span
                v-if="selectedCounty.county_budget && selectedCounty.county_budget.flags"
                class="dc-flag"
              >
                {{ selectedCounty.county_budget.flags }}
              </span>
            </div>
            <div
              v-for="sc in selectedCounty.sub_counties"
              :key="sc.id"
              class="drill-card"
              :class="{ 'is-empty': !sc.budget }"
              @click="openBudget(subCountyRecord(sc))"
            >
              <div class="dc-head">
                <span class="dc-title">{{ sc.name }}</span>
                <span class="dc-chevron">›</span>
              </div>
              <div class="dc-meta">
                {{ sc.budget ? sc.budget.stage : 'No budget' }}
              </div>
              <span v-if="sc.budget && sc.budget.flags" class="dc-flag">
                {{ sc.budget.flags }}
              </span>
            </div>
          </div>
        </template>

        <!-- ════════ LEVEL 3 · Single budget detail ════════ -->
        <template v-else>
          <div class="level-title">
            <sdButton size="small" class="back-btn" @click="goCountyBudgets">
              ← Back to {{ selectedCounty.name }}
            </sdButton>
            <span class="lt-icon">▦</span>
            {{ selectedCounty.name }} — {{ selectedBudget.label }}
          </div>
          <a-tag class="ph-stage-tag">{{ selectedBudget.stage }}</a-tag>

          <!-- stats row -->
          <div class="stat-row">
            <div class="stat-chip">
              <span class="sc-label">Population:</span>
              <strong>{{ fmt(selectedBudget.population) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Households:</span>
              <strong>{{ fmt(selectedBudget.households) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Wards:</span>
              <strong>{{ fmt(selectedBudget.wards) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Locations:</span>
              <strong>{{ fmt(selectedBudget.locations) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Villages:</span>
              <strong>{{ fmt(selectedBudget.villages) }}</strong>
            </div>
            <div class="stat-chip">
              <span class="sc-label">Posts:</span>
              <strong>{{ fmt(selectedBudget.posts) }}</strong>
            </div>
          </div>

          <!-- summary tiles -->
          <div class="summary-row">
            <div class="summary-tile">
              <div class="st-label">Nets Required</div>
              <div class="st-value">{{ fmt(selectedBudget.nets_required) }}</div>
            </div>
            <div class="summary-tile">
              <div class="st-label">Nets/Household</div>
              <div class="st-value">{{ selectedBudget.nets_per_hh.toFixed(2) }}</div>
            </div>
            <div class="summary-tile">
              <div class="st-label">Cost/Net (KES)</div>
              <div class="st-value">{{ selectedBudget.cost_per_net.toFixed(2) }}</div>
            </div>
            <div class="summary-tile accent">
              <div class="st-label">Total Budget (KES)</div>
              <div class="st-value">{{ fmt(selectedBudget.total_budget) }}</div>
            </div>
          </div>

          <!-- categories with parameters -->
          <a-collapse
            v-model:activeKey="openCategoryKeys"
            class="category-collapse"
            expand-icon-position="start"
          >
            <a-collapse-panel
              v-for="cat in selectedBudget.categories"
              :key="cat.id"
              :header="null"
            >
              <template #header>
                <div class="cat-header">
                  <span class="cat-name">{{ cat.name }}</span>
                  <a-tag v-if="cat.badge" class="cat-badge">{{ cat.badge }}</a-tag>
                  <span class="cat-total">KES {{ fmt(cat.total) }}</span>
                </div>
              </template>

              <a-table
                :dataSource="cat.items"
                :columns="itemColumns"
                :pagination="false"
                size="small"
                row-key="id"
                class="category-table"
              >
                <template #bodyCell="{ column, record }">
                  <span v-if="column.key === 'unit_cost'">
                    {{ fmt(record.unit_cost) }}
                  </span>
                  <span v-else-if="column.key === 'days'">{{ record.days }}</span>
                  <span v-else-if="column.key === 'units'">{{ record.units }}</span>
                  <strong v-else-if="column.key === 'total'" class="cat-item-total">
                    {{ fmt(record.total) }}
                  </strong>
                </template>
                <template #summary>
                  <a-table-summary fixed>
                    <a-table-summary-row>
                      <a-table-summary-cell :index="0" :col-span="4" align="right">
                        <strong>Subtotal</strong>
                      </a-table-summary-cell>
                      <a-table-summary-cell :index="4" align="right">
                        <strong>{{ fmt(cat.total) }}</strong>
                      </a-table-summary-cell>
                    </a-table-summary-row>
                  </a-table-summary>
                </template>
              </a-table>
            </a-collapse-panel>
          </a-collapse>

          <!-- grand total -->
          <div class="grand-total-bar">
            <span>GRAND TOTAL</span>
            <strong>KES {{ fmt(selectedBudget.total_budget) }}</strong>
          </div>

          <!-- actions -->
          <div class="detail-actions">
            <sdButton
              v-if="selectedBudget.status === 'submitted'"
              type="success"
              @click="approveBudget(selectedBudget)"
            >
              Approve
            </sdButton>
            <sdButton
              v-if="selectedBudget.status === 'submitted'"
              type="warning"
              @click="openReferModal(selectedBudget)"
            >
              Refer Back
            </sdButton>
            <sdButton @click="downloadBudgetPDF">Download PDF</sdButton>
            <sdButton @click="goCountyBudgets">Back to {{ selectedCounty.name }}</sdButton>
          </div>
        </template>

        <!-- Refer Back Modal -->
        <a-modal
          v-model:open="referModal"
          title="Refer Budget Back"
          @ok="handleRefer"
          ok-text="Send Referral"
          :confirm-loading="referring"
        >
          <p style="color: #5a5f7d; margin-bottom: 12px">
            Provide detailed feedback for revision and resubmission.
          </p>
          <a-textarea
            v-model:value="referNote"
            :rows="4"
            placeholder="Explain what needs to be corrected..."
          />
        </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { computed, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';

/* ───────── Mock data (replace with API wiring) ───────── */
const sampleCategories = () => [
  {
    id: 'stakeholder',
    name: 'Stakeholders meeting for Sensitization',
    total: 97200,
    items: [
      { id: 1, item: 'Hall Hire stakeholders and health worker training', unit_cost: 12500, days: 1, units: 1, total: 12500 },
      { id: 2, item: 'Communication - Officers', unit_cost: 250, days: 1, units: 5, total: 1250 },
      { id: 3, item: 'Driver lunch Allowance', unit_cost: 750, days: 1, units: 1, total: 750 },
      { id: 4, item: 'Fuel - Vehicle', unit_cost: 30, days: 1, units: 100, total: 3000 },
      { id: 5, item: 'Transport reimbursements - General', unit_cost: 500, days: 1, units: 50, total: 25000 },
      { id: 6, item: 'Lunch allowance - Officers', unit_cost: 1000, days: 1, units: 55, total: 55000 },
    ],
  },
  {
    id: 'data-bundles',
    name: 'Data Bundles for Officers Stage 1',
    total: 5000,
    items: [
      { id: 1, item: 'Data Bundles', unit_cost: 500, days: 1, units: 10, total: 5000 },
    ],
  },
  {
    id: 'trainings',
    name: 'County participation in Sub-County Stakeholder sensitization Meeting',
    badge: '8 Sub-Counties',
    total: 72000,
    items: [
      { id: 1, item: 'Participation allowance', unit_cost: 9000, days: 1, units: 8, total: 72000 },
    ],
  },
];

const makeBudget = (overrides = {}) => ({
  status: 'submitted',
  stage: 'Preparatory Stage',
  population: 223717,
  households: 38904,
  wards: 5,
  locations: 12,
  villages: 439,
  posts: 68,
  nets_required: 124287,
  nets_per_hh: 3.19,
  cost_per_net: 2.78,
  total_budget: 174200,
  categories: sampleCategories(),
  ...overrides,
});

const countiesData = [
  {
    id: 1, name: 'Baringo', stage: null,
    county_budget: null,
    sub_counties: [
      { id: 11, name: 'Baringo Central', budget: null },
      { id: 12, name: 'Mogotio', budget: null },
    ],
  },
  {
    id: 2, name: 'Bungoma', stage: 'County Budget: Preparatory Stage',
    county_budget: { stage: 'Preparatory Stage', flags: null },
    sub_counties: [
      { id: 21, name: 'Bumula', budget: { stage: 'Preparatory Stage', flags: null } },
      { id: 22, name: 'Cheptais', budget: null },
      { id: 23, name: 'Kabuchai', budget: null },
      { id: 24, name: 'Kanduyi', budget: { stage: 'Preparatory Stage', flags: 'Post Additions / Special Cases' } },
      { id: 25, name: 'Kimilili', budget: null },
      { id: 26, name: 'Sirisia', budget: null },
      { id: 27, name: 'Webuye East', budget: null },
      { id: 28, name: 'Webuye West', budget: null },
    ],
  },
  {
    id: 3, name: 'Busia', stage: null, county_budget: null,
    sub_counties: [{ id: 31, name: 'Budalang\'i', budget: null }],
  },
  {
    id: 4, name: 'Homa Bay', stage: 'County Budget: Preparatory Stage',
    county_budget: { stage: 'Preparatory Stage' },
    sub_counties: [{ id: 41, name: 'Homa Bay Town', budget: null }],
  },
  {
    id: 5, name: 'Kakamega', stage: null, county_budget: null,
    sub_counties: Array.from({ length: 10 }, (_, i) => ({ id: 50 + i, name: `Sub-County ${i + 1}`, budget: null })),
  },
  {
    id: 6, name: 'Kericho', stage: null, county_budget: null,
    sub_counties: Array.from({ length: 5 }, (_, i) => ({ id: 60 + i, name: `SC ${i + 1}`, budget: null })),
  },
  {
    id: 7, name: 'Kisii', stage: null, county_budget: null,
    sub_counties: Array.from({ length: 7 }, (_, i) => ({ id: 70 + i, name: `SC ${i + 1}`, budget: null })),
  },
  {
    id: 8, name: 'Kisumu', stage: null, county_budget: null,
    sub_counties: Array.from({ length: 3 }, (_, i) => ({ id: 80 + i, name: `SC ${i + 1}`, budget: null })),
  },
  {
    id: 9, name: 'Kwale', stage: null, county_budget: null,
    sub_counties: Array.from({ length: 4 }, (_, i) => ({ id: 90 + i, name: `SC ${i + 1}`, budget: null })),
  },
  {
    id: 10, name: 'Migori', stage: null, county_budget: null,
    sub_counties: Array.from({ length: 4 }, (_, i) => ({ id: 100 + i, name: `SC ${i + 1}`, budget: null })),
  },
  {
    id: 11, name: 'Nandi', stage: null, county_budget: null,
    sub_counties: Array.from({ length: 6 }, (_, i) => ({ id: 110 + i, name: `SC ${i + 1}`, budget: null })),
  },
  {
    id: 12, name: 'Siaya', stage: null, county_budget: null,
    sub_counties: Array.from({ length: 6 }, (_, i) => ({ id: 120 + i, name: `SC ${i + 1}`, budget: null })),
  },
  {
    id: 13, name: 'Trans Nzoia', stage: null, county_budget: null,
    sub_counties: Array.from({ length: 5 }, (_, i) => ({ id: 130 + i, name: `SC ${i + 1}`, budget: null })),
  },
  {
    id: 14, name: 'Turkana', stage: 'County Budget: Preparatory Stage',
    county_budget: { stage: 'Preparatory Stage' },
    sub_counties: Array.from({ length: 7 }, (_, i) => ({ id: 140 + i, name: `SC ${i + 1}`, budget: null })),
  },
  {
    id: 15, name: 'Vihiga', stage: 'County Budget: Preparatory Stage',
    county_budget: { stage: 'Preparatory Stage' },
    sub_counties: Array.from({ length: 5 }, (_, i) => ({ id: 150 + i, name: `SC ${i + 1}`, budget: null })),
  },
  {
    id: 16, name: 'West Pokot', stage: null, county_budget: null,
    sub_counties: Array.from({ length: 4 }, (_, i) => ({ id: 160 + i, name: `SC ${i + 1}`, budget: null })),
  },
];

export default {
  name: 'NationalBudgetReview',
  components: { Main, RecordViewWrapper, BudgetPageWrapper },
  setup() {
    const counties = ref(countiesData);
    const selectedCounty = ref(null);
    const selectedBudget = ref(null);

    const openCategoryKeys = ref(['stakeholder']);

    const referModal = ref(false);
    const referring = ref(false);
    const referNote = ref('');

    /* derived records for level-2 cards ------------------ */
    const countyBudgetRecord = computed(() => {
      if (!selectedCounty.value) return null;
      const cb = selectedCounty.value.county_budget;
      return cb
        ? makeBudget({
            id: `county-${selectedCounty.value.id}`,
            label: 'County Budget',
            stage: cb.stage,
            wards: 15,
            locations: 25,
            villages: 1165,
            posts: 289,
            population: 1670570,
            households: 342301,
            nets_required: 927000,
            total_budget: 174200,
          })
        : null;
    });

    const subCountyRecord = (sc) => {
      if (!sc.budget) return null;
      return makeBudget({
        id: `sc-${sc.id}`,
        label: sc.name,
        stage: sc.budget.stage,
      });
    };

    /* navigation ----------------------------------------- */
    const openCounty = (c) => {
      selectedCounty.value = c;
      selectedBudget.value = null;
    };
    const openBudget = (record) => {
      if (!record) return;
      selectedBudget.value = record;
    };
    const goCounties = () => {
      selectedCounty.value = null;
      selectedBudget.value = null;
    };
    const goCountyBudgets = () => {
      selectedBudget.value = null;
    };

    /* table columns -------------------------------------- */
    const itemColumns = [
      { title: 'Budget Item', dataIndex: 'item', key: 'item' },
      { title: 'Unit Cost', key: 'unit_cost', align: 'right', width: 140 },
      { title: 'Days', key: 'days', align: 'right', width: 100 },
      { title: 'Units', key: 'units', align: 'right', width: 100 },
      { title: 'Total (KES)', key: 'total', align: 'right', width: 160 },
    ];

    /* actions -------------------------------------------- */
    const approveBudget = (record) => {
      record.status = 'approved';
      notification.success({ message: `Budget for ${record.label} approved.` });
    };
    const openReferModal = () => {
      referNote.value = '';
      referModal.value = true;
    };
    const handleRefer = () => {
      if (!referNote.value.trim()) {
        notification.warning({ message: 'Please provide feedback.' });
        return;
      }
      referring.value = true;
      setTimeout(() => {
        if (selectedBudget.value) selectedBudget.value.status = 'referred';
        referring.value = false;
        referModal.value = false;
        notification.success({ message: 'Budget referred back.' });
      }, 500);
    };
    const downloadBudgetPDF = () =>
      notification.info({ message: 'PDF download started (demo).' });

    const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

    return {
      counties,
      selectedCounty,
      selectedBudget,
      countyBudgetRecord,
      subCountyRecord,
      openCategoryKeys,
      referModal,
      referring,
      referNote,
      itemColumns,
      openCounty,
      openBudget,
      goCounties,
      goCountyBudgets,
      approveBudget,
      openReferModal,
      handleRefer,
      downloadBudgetPDF,
      fmt,
    };
  },
};
</script>

<style lang="less" scoped>
.review-crumbs {
  font-size: 12px;
  :deep(a) {
    color: #2f6746;
    font-weight: 600;
  }
}

/* ───────── Card grid for levels 1 & 2 ───────── */
.card-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  margin-bottom: 18px;
}
.card-grid.four-col {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
@media (max-width: 1100px) {
  .card-grid.four-col {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

.drill-card {
  position: relative;
  background: #fff;
  border: 1px solid #e1efe6;
  border-radius: 8px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
  &:hover {
    border-color: #9ad8b4;
    box-shadow: 0 6px 14px rgba(28, 122, 72, 0.1);
    transform: translateY(-1px);
  }
  &.is-active {
    border-color: #15693c;
    background: #f4fbf6;
  }
  &.is-empty {
    .dc-meta { color: #b0b8c3; }
  }

  .dc-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .dc-title {
    font-size: 13px;
    font-weight: 700;
    color: #1f2437;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .dc-icon {
    color: #4d8a63;
    font-size: 13px;
  }
  .dc-chevron {
    color: #b0b8c3;
    font-size: 16px;
    line-height: 1;
  }
  .dc-meta {
    font-size: 11px;
    color: #5a5f7d;
  }
  .dc-stage,
  .dc-flag {
    display: inline-block;
    margin-top: 8px;
    font-size: 10px;
    line-height: 1.4;
    padding: 2px 8px;
    border-radius: 10px;
    background: #eaf4ff;
    color: #2c99ff;
    border: none;
  }
  .dc-flag {
    background: #eef3fb;
    color: #2f6dcf;
  }
}

/* ───────── Level title (section header for lists) ───────── */
.level-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #15693c;
  margin: 6px 2px 12px;
  .lt-icon { color: #20c997; }
  .back-btn {
    margin-right: 4px;
    background: #fff;
    border: 1px solid #d9f0e2;
    color: #15693c;
    font-weight: 600;
    &:hover,
    &:focus {
      background: #f4fbf6;
      border-color: #9ad8b4;
      color: #15693c;
    }
  }
}

.ph-stage-tag {
  display: inline-block;
  margin-bottom: 14px;
  padding: 3px 12px;
  border-radius: 14px;
  background: #e5f3ff;
  color: #2c99ff;
  border: 1px solid #b7dcff;
  font-size: 12px;
  font-weight: 600;
}

/* ───────── Level 3 stats ───────── */
.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 12px 2px 14px;
  .stat-chip {
    font-size: 12px;
    color: #5a5f7d;
    .sc-label { margin-right: 4px; }
    strong { color: #1f2437; font-weight: 700; }
  }
}
.summary-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.summary-tile {
  background: #fff;
  border: 1px solid #e1efe6;
  border-radius: 8px;
  padding: 14px 16px;
  text-align: center;
  .st-label {
    font-size: 11px;
    color: #7a8a82;
    margin-bottom: 4px;
  }
  .st-value {
    font-size: 22px;
    font-weight: 800;
    color: #1f2437;
    line-height: 1.1;
  }
  &.accent .st-value { color: #15693c; }
}

/* ───────── Collapsible categories ───────── */
.category-collapse {
  background: transparent;
  border: none;

  :deep(.ant-collapse-item) {
    background: #fff;
    border: 1px solid #e6f0ea;
    border-radius: 8px !important;
    margin-bottom: 8px;
    overflow: hidden;
  }
  :deep(.ant-collapse-header) {
    background: #f6fbf8;
    padding: 10px 16px !important;
    align-items: center;
  }
  :deep(.ant-collapse-content) {
    border-top: 1px solid #eaf4ee;
  }
  :deep(.ant-collapse-content-box) {
    padding: 0 !important;
  }

  .cat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    .cat-name {
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      color: #272b41;
    }
    .cat-badge {
      background: #eef3fb;
      color: #2f6dcf;
      border: none;
      font-size: 10px;
      border-radius: 10px;
      padding: 1px 8px;
    }
    .cat-total {
      font-size: 13px;
      font-weight: 700;
      color: #15693c;
    }
  }
}

:deep(.category-table) {
  .ant-table { background: transparent; }
  .ant-table-thead > tr > th {
    background: #fff;
    border-bottom: 1px solid #eaf4ee;
    color: #7a8a82;
    font-weight: 600;
    font-size: 11px;
    text-transform: none;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f4f8f5;
    font-size: 12px;
    color: #1f2437;
  }
  .ant-table-tbody > tr:hover > td { background: #fafcfb; }
  .ant-table-summary {
    background: #f6fbf8;
    .ant-table-cell { border-bottom: none; }
  }
  .cat-item-total { color: #15693c; font-weight: 700; }
}

.grand-total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f2f3f7;
  border: 1px solid #e6e8ef;
  border-radius: 6px;
  padding: 12px 18px;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #1f2437;
  letter-spacing: 0.4px;
  strong { color: #15693c; font-size: 14px; font-weight: 800; }
}

.detail-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 18px;
  flex-wrap: wrap;
}
</style>
