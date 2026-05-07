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
              <span class="ph-icon">▦</span> County Budgets Review &amp; Approval
            </h3>
            <p class="ph-subtitle">
              Review and approve sub-county budget submissions for your county
            </p>
          </div>
          <div class="ph-actions">
            <a-tag v-if="readOnly" color="purple" style="margin-right: 8px">
              National view — read only
            </a-tag>
            <a-breadcrumb separator=">" class="review-crumbs">
              <a-breadcrumb-item>
                <a href="javascript:;" @click="goSubCounties">{{ scopedCountyName || 'County' }}</a>
              </a-breadcrumb-item>
              <a-breadcrumb-item v-if="selectedBudget">
                {{ selectedBudget.label }}
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
        </div>

        <CountyAccessGate @scope-change="onScopeChange">
          <template #default="{ countyId: gatedId }">
            <!-- ════════ LEVEL 1 · Sub-county grid ════════ -->
            <template v-if="!selectedBudget">
              <a-spin :spinning="loadingSubCounties">
                <div class="card-grid four-col">
                  <!-- County Budget tile -->
                  <div
                    class="drill-card"
                    :class="{ 'is-empty': !countyBudget }"
                    @click="openCountyBudget()"
                  >
                    <div class="dc-head">
                      <span class="dc-title">
                        <span class="dc-icon">▤</span> County Budget
                      </span>
                      <span class="dc-chevron">›</span>
                    </div>
                    <div class="dc-meta">
                      {{ countyBudget ? countyBudget.stage : 'No budget' }}
                    </div>
                    <span v-if="countyBudget && countyBudget.flags" class="dc-flag">
                      {{ countyBudget.flags }}
                    </span>
                  </div>

                  <!-- Sub-county tiles -->
                  <div
                    v-for="sc in subCounties"
                    :key="sc.id"
                    class="drill-card"
                    :class="{ 'is-empty': !sc.budget }"
                    @click="openSubCountyBudget(sc)"
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

                  <div
                    v-if="!loadingSubCounties && !subCounties.length && !countyBudget"
                    class="empty-hint"
                  >
                    No budgets available for this county.
                  </div>
                </div>
              </a-spin>
            </template>

            <!-- ════════ LEVEL 2 · Single budget detail ════════ -->
            <template v-else>
              <div class="level-title">
                <sdButton size="small" class="back-btn" @click="goSubCounties">
                  ← Back to {{ scopedCountyName || 'County' }}
                </sdButton>
                <span class="lt-icon">▦</span>
                {{ scopedCountyName }} — {{ selectedBudget.label }}
              </div>
              <a-tag class="ph-stage-tag">{{ selectedBudget.stage }}</a-tag>

              <a-spin :spinning="loadingDetail">
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
                    v-if="!readOnly && selectedBudget.can_approve"
                    type="success"
                    @click="approveBudget(selectedBudget)"
                    :loading="approving"
                  >
                    Approve
                  </sdButton>
                  <sdButton
                    v-if="!readOnly && selectedBudget.can_refer_back"
                    type="warning"
                    @click="openReferModal(selectedBudget)"
                  >
                    Refer Back
                  </sdButton>
                  <sdButton @click="downloadBudgetPDF">Download PDF</sdButton>
                  <sdButton @click="goSubCounties">
                    Back to {{ scopedCountyName || 'County' }}
                  </sdButton>
                </div>
              </a-spin>
            </template>
            <span v-if="gatedId" style="display:none;">{{ gatedId }}</span>
          </template>
        </CountyAccessGate>

        <!-- Refer Back Modal -->
        <a-modal
          v-model:visible="referModal"
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
import { ref } from 'vue';
import { notification, message } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper } from './style';
import CountyAccessGate from './CountyAccessGate.vue';

/* Map detail API response -> shape consumed by the template */
const mapDetail = (d) => {
  if (!d) return null;
  const demo = d.demographics || {};
  const sum = d.summary || {};
  const review = d.review || {};
  return {
    id: d.id,
    label: d.label || (d.admin_unit && d.admin_unit.name) || '',
    admin_unit: d.admin_unit || null,
    financial_year: d.financial_year,
    status: d.status,
    stage: d.stage,
    flags: d.flags,
    submitted_at: d.submitted_at,
    submitted_by: d.submitted_by,
    population: demo.population || 0,
    households: demo.households || 0,
    wards: demo.wards || 0,
    locations: demo.locations || 0,
    villages: demo.villages || 0,
    posts: demo.posts || 0,
    nets_required: sum.nets_required || 0,
    nets_per_hh: sum.nets_per_household || 0,
    cost_per_net: sum.cost_per_net_kes || 0,
    total_budget: sum.total_budget_kes || 0,
    categories: (d.categories || []).map((cat) => ({
      id: cat.id,
      code: cat.code,
      name: cat.name,
      badge: cat.badge,
      total: cat.total_kes || 0,
      items: (cat.parameters || []).map((p) => ({
        id: p.id,
        item: p.item,
        unit_cost: p.unit_cost_kes || 0,
        days: p.days || 0,
        units: p.units || 0,
        total: p.total_kes || 0,
        source: p.source,
        parameter_id: p.parameter_id,
      })),
    })),
    can_approve: !!review.can_approve,
    can_refer_back: !!review.can_refer_back,
    history: review.history || [],
  };
};

export default {
  name: 'CountyBudgets',
  components: { Main, RecordViewWrapper, BudgetPageWrapper, CountyAccessGate },
  setup() {
    // Level 1 (National / Super Admin) users can review but not approve
    // or refer back — those actions are county-officer only.
    const currentUser = (() => {
      try {
        return JSON.parse(sessionStorage.getItem('user') || '{}');
      } catch (e) {
        return {};
      }
    })();
    const readOnly = ref(Number(currentUser?.user?.level_id) === 1);

    const scopedCountyId = ref(null);
    const scopedCountyName = ref('');

    const subCounties = ref([]);
    const countyBudget = ref(null);
    const selectedBudget = ref(null);

    const loadingSubCounties = ref(false);
    const loadingDetail = ref(false);
    const approving = ref(false);

    const openCategoryKeys = ref([]);

    const referModal = ref(false);
    const referring = ref(false);
    const referNote = ref('');

    /* fetch sub-county list for the scoped county ------- */
    const fetchSubCounties = async () => {
      if (!scopedCountyId.value) return;
      loadingSubCounties.value = true;
      try {
        const { data } = await axios.get('get_county_budget_review_subcounties', {
          params: { county_id: scopedCountyId.value },
        });
        const payload = data && (data.data || data) || {};
        subCounties.value = payload.sub_counties || [];
        countyBudget.value = payload.county_budget || null;
      } catch (err) {
        message.error('Failed to load sub-county budgets');
        // eslint-disable-next-line no-console
        console.error('get_county_budget_review_subcounties error:', err);
      } finally {
        loadingSubCounties.value = false;
      }
    };

    /* fetch one budget detail --------------------------- */
    const fetchBudgetDetail = async (budgetId) => {
      if (!budgetId) return;
      loadingDetail.value = true;
      try {
        const { data } = await axios.get('get_county_budget_review_detail', {
          params: { budget_id: budgetId },
        });
        const mapped = mapDetail(data);
        selectedBudget.value = mapped;
        openCategoryKeys.value =
          mapped && mapped.categories.length ? [mapped.categories[0].id] : [];
      } catch (err) {
        message.error('Failed to load budget detail');
        // eslint-disable-next-line no-console
        console.error('get_county_budget_review_detail error:', err);
      } finally {
        loadingDetail.value = false;
      }
    };

    /* navigation ---------------------------------------- */
    const onScopeChange = ({ countyId, countyName }) => {
      scopedCountyId.value = countyId;
      scopedCountyName.value = countyName || '';
      selectedBudget.value = null;
      fetchSubCounties();
    };
    const openCountyBudget = () => {
      if (!countyBudget.value || !countyBudget.value.id) return;
      fetchBudgetDetail(countyBudget.value.id);
    };
    const openSubCountyBudget = (sc) => {
      if (!sc || !sc.budget || !sc.budget.id) return;
      fetchBudgetDetail(sc.budget.id);
    };
    const goSubCounties = () => {
      selectedBudget.value = null;
    };

    /* table columns ------------------------------------- */
    const itemColumns = [
      { title: 'Budget Item', dataIndex: 'item', key: 'item' },
      { title: 'Unit Cost', key: 'unit_cost', align: 'right', width: 140 },
      { title: 'Days', key: 'days', align: 'right', width: 100 },
      { title: 'Units', key: 'units', align: 'right', width: 100 },
      { title: 'Total (KES)', key: 'total', align: 'right', width: 160 },
    ];

    /* actions ------------------------------------------- */
    const approveBudget = async (record) => {
      if (!record || !record.id) return;
      approving.value = true;
      try {
        await axios.post(`county_approve_campaign_budget/${record.id}`);
        notification.success({
          message: `Budget for ${record.label} approved.`,
        });
        record.status = 'approved';
        record.can_approve = false;
        record.can_refer_back = false;
        await fetchSubCounties();
      } catch (err) {
        notification.error({
          message: 'Failed to approve budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        approving.value = false;
      }
    };

    const openReferModal = () => {
      referNote.value = '';
      referModal.value = true;
    };

    const handleRefer = async () => {
      const note = referNote.value.trim();
      if (note.length < 10) {
        notification.warning({
          message: 'Please provide feedback (minimum 10 characters).',
        });
        return;
      }
      if (!selectedBudget.value || !selectedBudget.value.id) {
        referModal.value = false;
        return;
      }
      referring.value = true;
      try {
        await axios.post(`reject_campaign_budget/${selectedBudget.value.id}`, {
          rejection_note: note,
        });
        selectedBudget.value.status = 'draft';
        selectedBudget.value.can_approve = false;
        selectedBudget.value.can_refer_back = false;
        notification.success({ message: 'Budget referred back to the sub-county.' });
        referModal.value = false;
        await fetchSubCounties();
      } catch (err) {
        notification.error({
          message: 'Failed to refer budget',
          description: err?.response?.data?.message || err.message,
        });
      } finally {
        referring.value = false;
      }
    };

    const downloadBudgetPDF = () =>
      notification.info({ message: 'PDF download started (demo).' });

    const fmt = (n) => (n == null ? '0' : Number(n).toLocaleString());

    return {
      scopedCountyId,
      scopedCountyName,
      readOnly,
      subCounties,
      countyBudget,
      selectedBudget,
      loadingSubCounties,
      loadingDetail,
      approving,
      openCategoryKeys,
      referModal,
      referring,
      referNote,
      itemColumns,
      onScopeChange,
      openCountyBudget,
      openSubCountyBudget,
      goSubCounties,
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

.tool-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: #f4fbf6;
  border: 1px solid #d9ecdf;
  border-radius: 6px;
  margin-bottom: 14px;
  font-size: 12px;
  color: #2f6746;
  font-weight: 600;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
  .ph-title {
    margin: 0;
    font-size: 20px;
    color: #15693c;
    .ph-icon { margin-right: 6px; }
  }
  .ph-subtitle {
    margin: 4px 0 0;
    font-size: 13px;
    color: #6b7a72;
  }
}

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
  background: #fff;
  border: 1px solid #e2ebe5;
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  position: relative;
  &:hover {
    border-color: #4d8a63;
    box-shadow: 0 4px 14px rgba(15, 105, 60, 0.08);
    transform: translateY(-1px);
  }
  &.is-empty { opacity: 0.6; cursor: default; &:hover { transform: none; box-shadow: none; } }
  .dc-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    .dc-title {
      font-weight: 600;
      color: #15693c;
      .dc-icon { margin-right: 4px; }
    }
    .dc-chevron { color: #95a59b; font-size: 18px; }
  }
  .dc-meta { font-size: 12px; color: #6b7a72; }
  .dc-flag {
    display: inline-block;
    margin-top: 6px;
    padding: 2px 8px;
    background: #fff4e6;
    color: #b85c00;
    border-radius: 10px;
    font-size: 11px;
  }
  .dc-stage {
    margin-top: 6px;
  }
}

.empty-hint {
  grid-column: 1 / -1;
  text-align: center;
  color: #8a9990;
  padding: 24px 0;
}

.level-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 4px 0 14px;
  font-size: 15px;
  font-weight: 600;
  color: #15693c;
  .lt-icon { font-size: 18px; }
  .back-btn { margin-right: 4px; }
}

.ph-stage-tag {
  margin-bottom: 14px;
  background: #e9f6ee;
  color: #15693c;
  border: none;
}

.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
  .stat-chip {
    background: #f4fbf6;
    border: 1px solid #d9ecdf;
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 12px;
    color: #4d6357;
    .sc-label { color: #6b7a72; margin-right: 4px; }
    strong { color: #15693c; }
  }
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 18px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .summary-tile {
    background: #fff;
    border: 1px solid #e2ebe5;
    border-radius: 10px;
    padding: 12px 14px;
    .st-label { font-size: 12px; color: #6b7a72; }
    .st-value {
      font-size: 18px;
      font-weight: 700;
      color: #15693c;
      margin-top: 4px;
    }
    &.accent {
      background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
      border-color: #c9e6d3;
    }
  }
}

.category-collapse {
  background: transparent;
  border: none;
  margin-bottom: 14px;
  :deep(.ant-collapse-item) {
    background: #fff;
    border: 1px solid #e2ebe5 !important;
    border-radius: 10px !important;
    margin-bottom: 8px;
    overflow: hidden;
  }
  :deep(.ant-collapse-header) {
    align-items: center !important;
    padding: 12px 14px !important;
  }
  .cat-header {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    .cat-name { font-weight: 600; color: #15693c; }
    .cat-badge { background: #e9f6ee; color: #15693c; border: none; }
    .cat-total {
      margin-left: auto;
      font-weight: 700;
      color: #15693c;
    }
  }
}

.category-table {
  :deep(.ant-table) { font-size: 12px; }
  :deep(.cat-item-total) { color: #15693c; }
}

.grand-total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-radius: 10px;
  background: linear-gradient(90deg, #15693c 0%, #1f8b53 100%);
  color: #fff;
  margin-bottom: 16px;
  font-size: 15px;
  letter-spacing: 0.5px;
  strong { font-size: 18px; }
}

.detail-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
</style>
