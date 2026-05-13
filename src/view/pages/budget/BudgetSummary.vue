<template>
  <RecordViewWrapper>
    <sdPageHeader title="Budget Summary" />
    <Main>
      <BudgetPageWrapper>

        <!-- Budget Status Timeline -->
        <StatusTimeline>
          <div :class="['step', stepClass('pending')]"><div class="step-dot">🗒</div><div class="step-label">Draft</div></div>
          <div :class="['step', stepClass('generated')]"><div class="step-dot">⚙️</div><div class="step-label">Generated</div></div>
          <div :class="['step', stepClass('submitted')]"><div class="step-dot">📤</div><div class="step-label">Submitted</div></div>
          <div :class="['step', stepClass('approved', 'referred')]"><div class="step-dot">{{ budget.status === 'referred' ? '↩' : '✔' }}</div><div class="step-label">{{ budget.status === 'referred' ? 'Referred' : 'Approved' }}</div></div>
        </StatusTimeline>

        <!-- Referral Feedback Banner -->
        <div class="referral-box" v-if="budget.status === 'referred'">
          <div class="ref-icon">⚠️</div>
          <div class="ref-body">
            <div class="ref-title">Budget Referred Back</div>
            <div class="ref-note">{{ budget.referral_note }}</div>
          </div>
        </div>

        <!-- Action Bar -->
        <ActionBar>
          <div class="action-bar-left">
            <span style="font-weight:600; color:#272B41; font-size:14px;">Status:</span>
            <StatusBadge :status="budget.status" style="font-size:13px;">{{ capitalize(budget.status) }}</StatusBadge>
          </div>
          <div class="action-bar-right">
            <sdButton type="primary" @click="generateBudget" :loading="generating"
              v-if="budget.status === 'pending' || budget.status === 'referred'">
              ⚡ Generate Budget
            </sdButton>
            <sdButton type="default" @click="generateBudget" :loading="generating"
              v-if="budget.status === 'generated'">
              🔄 Regenerate
            </sdButton>
            <sdButton type="success" @click="submitModal = true"
              v-if="budget.status === 'generated'">
              📤 Submit for Review
            </sdButton>
            <sdButton @click="downloadPDF" v-if="budget.status !== 'pending'">
              📅 Download PDF
            </sdButton>
          </div>
        </ActionBar>

        <!-- Summary Stats -->
        <div class="budget-stat-row" v-if="budget.status !== 'pending'">
          <StatCard class="purple">
            <div class="stat-icon">💰</div>
            <div class="stat-label">Total Budget</div>
            <div class="stat-value">KES {{ (totalBudget / 1000).toFixed(0) }}K</div>
          </StatCard>
          <StatCard class="success">
            <div class="stat-icon">🦟</div>
            <div class="stat-label">LLINs Required</div>
            <div class="stat-value">{{ stats.llins.toLocaleString() }}</div>
          </StatCard>
          <StatCard class="primary">
            <div class="stat-icon">📌</div>
            <div class="stat-label">Activities</div>
            <div class="stat-value">{{ stats.activities }}</div>
          </StatCard>
          <StatCard class="info">
            <div class="stat-icon">📄</div>
            <div class="stat-label">Budget Lines</div>
            <div class="stat-value">{{ stats.lines }}</div>
          </StatCard>
          <StatCard class="warning">
            <div class="stat-icon">📊</div>
            <div class="stat-label">Cost per Net</div>
            <div class="stat-value">KES {{ stats.cost_per_net }}</div>
          </StatCard>
          <StatCard>
            <div class="stat-icon">📍</div>
            <div class="stat-label">Locations</div>
            <div class="stat-value">{{ stats.locations }}</div>
          </StatCard>
        </div>

        <!-- Collapsible Detail Sections -->
        <div v-if="budget.status !== 'pending'">
          <a-collapse :default-active-key="['1']" style="background:#fff; border-radius:10px; box-shadow: 0 2px 12px rgba(39,43,65,0.07);">
            <a-collapse-panel key="1" header="📊 Budget by Stage">
              <TableWrapper class="table-data-view table-responsive">
                <a-table :dataSource="byStageData" :columns="stageColumns" :pagination="false" row-key="stage" size="small" />
              </TableWrapper>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="🏷️ Cost by Category">
              <TableWrapper class="table-data-view table-responsive">
                <a-table :dataSource="byCategoryData" :columns="categoryColumns" :pagination="false" row-key="category" size="small">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'category'">
                      <a-tag :color="categoryColor(record.category)">{{ record.category }}</a-tag>
                    </template>
                    <template v-if="column.key === 'percentage'">
                      <a-progress :percent="record.percentage" size="small" :stroke-color="categoryProgressColor(record.category)" />
                    </template>
                  </template>
                </a-table>
              </TableWrapper>
            </a-collapse-panel>
            <a-collapse-panel key="3" header="🗒️ Detailed Line Items">
              <TableWrapper class="table-data-view table-responsive">
                <a-table :dataSource="lineItemsData" :columns="lineColumns" :pagination="{pageSize:8}" row-key="id" size="small" />
              </TableWrapper>
            </a-collapse-panel>
          </a-collapse>
        </div>

        <!-- Empty State -->
        <div class="empty-state" v-if="budget.status === 'pending'">
          <div class="empty-icon">📊</div>
          <div class="empty-title">No Budget Generated Yet</div>
          <div class="empty-desc">Click "Generate Budget" above to compute your budget based on your sub-county profile and budget lines.</div>
          <sdButton type="primary" size="large" @click="generateBudget" :loading="generating">⚡ Generate Budget</sdButton>
        </div>

        <!-- Submit Modal -->
        <a-modal v-model:visible="submitModal" title="Submit Budget for Review" @ok="submitBudget" ok-text="Yes, Submit" :confirm-loading="submitting">
          <a-alert
            message="Once submitted you cannot edit until a county officer refers it back."
            type="warning" show-icon
            style="margin-bottom:12px;"
          />
          <p style="color:#5a5f7d;">Your total budget of <strong>KES {{ totalBudget.toLocaleString() }}</strong> will be sent to the county budget officer for review.</p>
        </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { notification } from 'ant-design-vue';
import { Main, TableWrapper } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper, StatCard, StatusBadge, StatusTimeline, ActionBar } from './style';

const sampleLineItems = [
  { id: 1, activity: 'LLIN Distribution', description: 'Field Allowance', category: 'allowance', unit_cost: 1500, quantity: 6, total: 9000, stage: 'distribution' },
  { id: 2, activity: 'LLIN Distribution', description: 'Fuel – Motorcycles', category: 'fuel', unit_cost: 180, quantity: 20, total: 3600, stage: 'distribution' },
  { id: 3, activity: 'Community Sensitisation', description: 'Field Allowance', category: 'allowance', unit_cost: 1500, quantity: 4, total: 6000, stage: 'community' },
  { id: 4, activity: 'Health Worker Training', description: 'Training Allowance', category: 'allowance', unit_cost: 2000, quantity: 10, total: 20000, stage: 'training' },
  { id: 5, activity: 'Health Worker Training', description: 'Mobile Communication', category: 'communication', unit_cost: 100, quantity: 10, total: 1000, stage: 'training' },
  { id: 6, activity: 'Supervision', description: 'Fuel – Vehicles', category: 'fuel', unit_cost: 95, quantity: 300, total: 28500, stage: 'supervision' },
  { id: 7, activity: 'Supervision', description: 'Field Allowance', category: 'allowance', unit_cost: 1500, quantity: 8, total: 12000, stage: 'supervision' },
];

export default {
  name: 'BudgetSummary',
  components: { Main, TableWrapper, RecordViewWrapper, BudgetPageWrapper, StatCard, StatusBadge, StatusTimeline, ActionBar },
  setup() {
    const generating = ref(false);
    const submitting = ref(false);
    const submitModal = ref(false);

    const budget = reactive({
      status: 'generated',
      referral_note: 'Please revise the fuel estimates for the distribution stage — the vehicle quantity appears overstated.',
    });

    const lineItemsData = ref([...sampleLineItems]);

    const totalBudget = computed(() => lineItemsData.value.reduce((sum, l) => sum + l.total, 0));
    const stats = computed(() => ({
      llins: 32940,
      activities: 4,
      lines: lineItemsData.value.length,
      cost_per_net: Math.round(totalBudget.value / 32940),
      locations: 8,
    }));

    const byStageData = computed(() => {
      const stages = {};
      lineItemsData.value.forEach(l => {
        if (!stages[l.stage]) stages[l.stage] = { stage: l.stage, lines: 0, total: 0 };
        stages[l.stage].lines++;
        stages[l.stage].total += l.total;
      });
      return Object.values(stages);
    });

    const byCategoryData = computed(() => {
      const cats = {};
      lineItemsData.value.forEach(l => {
        if (!cats[l.category]) cats[l.category] = { category: l.category, lines: 0, total: 0 };
        cats[l.category].lines++;
        cats[l.category].total += l.total;
      });
      const total = totalBudget.value;
      return Object.values(cats).map(c => ({ ...c, percentage: Math.round((c.total / total) * 100) }));
    });

    const stageColumns = [
      { title: 'Stage', dataIndex: 'stage', key: 'stage' },
      { title: 'Budget Lines', dataIndex: 'lines', key: 'lines' },
      { title: 'Total (KES)', dataIndex: 'total', key: 'total', customRender: ({ text }) => `KES ${Number(text).toLocaleString()}` },
    ];

    const categoryColumns = [
      { title: 'Category', dataIndex: 'category', key: 'category' },
      { title: 'Lines', dataIndex: 'lines', key: 'lines' },
      { title: 'Total (KES)', dataIndex: 'total', key: 'total', customRender: ({ text }) => `KES ${Number(text).toLocaleString()}` },
      { title: 'Share', key: 'percentage', width: 200 },
    ];

    const lineColumns = [
      { title: 'Activity', dataIndex: 'activity', key: 'activity' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      { title: 'Category', dataIndex: 'category', key: 'category' },
      { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost', customRender: ({ text }) => `KES ${text}` },
      { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
      { title: 'Total', dataIndex: 'total', key: 'total', customRender: ({ text }) => `KES ${Number(text).toLocaleString()}` },
    ];

    const statusColor = (s) => ({ pending: 'default', generated: 'blue', submitted: 'processing', approved: 'success', referred: 'warning' }[s] || 'default');
    const categoryColor = (c) => ({ allowance: 'blue', vendor: 'purple', fuel: 'orange', communication: 'green' }[c] || 'default');
    const categoryProgressColor = (c) => ({ allowance: '#5F63F2', vendor: '#7B2D8B', fuel: '#FA8B0C', communication: '#20C997' }[c] || '#9299b8');
    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    const generateBudget = () => {
      generating.value = true;
      setTimeout(() => {
        generating.value = false;
        budget.status = 'generated';
        notification.success({ message: 'Budget generated successfully.' });
      }, 1200);
    };

    const submitBudget = () => {
      submitting.value = true;
      setTimeout(() => {
        submitting.value = false;
        submitModal.value = false;
        budget.status = 'submitted';
        notification.success({ message: 'Budget submitted for county review.' });
      }, 800);
    };

    const downloadPDF = () => {
      notification.info({ message: 'PDF download started (demo).' });
    };

    const stepOrder = ['pending', 'generated', 'submitted', 'approved'];
    const stepClass = (...keys) => {
      const currentIdx = stepOrder.indexOf(budget.status === 'referred' ? 'approved' : budget.status);
      const keyIdx = Math.max(...keys.map(k => stepOrder.indexOf(k === 'referred' ? 'approved' : k)));
      if (budget.status === 'referred' && keys.includes('referred')) return 'active warn';
      if (keyIdx < currentIdx) return 'done';
      if (keyIdx === currentIdx) return 'active';
      return '';
    };

    return {
      budget, generating, submitting, submitModal,
      lineItemsData, totalBudget, stats, byStageData, byCategoryData,
      stageColumns, categoryColumns, lineColumns,
      statusColor, categoryColor, categoryProgressColor, capitalize,
      generateBudget, submitBudget, downloadPDF, stepClass,
    };
  },
};
</script>
