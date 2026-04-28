<template>
  <RecordViewWrapper>
    <sdPageHeader title="County Budgets" />
    <Main>
      <BudgetPageWrapper>
        <!-- Filter Bar -->
        <ActionBar>
          <div class="action-bar-left">
            <a-input v-model:value="searchText" placeholder="🔍 Search sub-county..." style="width:240px; border-radius:8px;" allow-clear />
            <a-select v-model:value="filterStatus" placeholder="Filter by status" allow-clear style="width:180px;">
              <a-select-option value="pending">Pending</a-select-option>
              <a-select-option value="generated">Generated</a-select-option>
              <a-select-option value="submitted">Submitted</a-select-option>
              <a-select-option value="referred">Referred</a-select-option>
              <a-select-option value="approved">Approved</a-select-option>
            </a-select>
          </div>
          <div class="action-bar-right">
            <span style="font-size:13px; color:#9299b8;">{{ filteredBudgets.length }} record{{ filteredBudgets.length !== 1 ? 's' : '' }}</span>
          </div>
        </ActionBar>

        <!-- Budgets Table -->
        <sdCards headless>
          <TableWrapper class="table-data-view table-responsive">
            <a-table :dataSource="filteredBudgets" :columns="columns" :pagination="{pageSize:10}" row-key="id">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <StatusBadge :status="record.status">{{ capitalize(record.status) }}</StatusBadge>
                </template>
                <template v-if="column.key === 'total_budget'">
                  <span :style="{ fontWeight: 600, color: record.total_budget > 0 ? '#272B41' : '#adb5c9' }">
                    {{ record.total_budget > 0 ? `KES ${Number(record.total_budget).toLocaleString()}` : '—' }}
                  </span>
                </template>
                <template v-if="column.key === 'action'">
                  <div style="display:flex; gap:4px;">
                    <a-tooltip title="View Details">
                      <span class="action-icon" @click="viewBudget(record)">👁</span>
                    </a-tooltip>
                    <a-tooltip title="Approve Budget" v-if="record.status === 'submitted'">
                      <span class="action-icon success" @click="generateCountyBudget(record)">✔️</span>
                    </a-tooltip>
                    <a-tooltip title="Refer Back" v-if="record.status === 'submitted'">
                      <span class="action-icon danger" @click="openReferModal(record)">↩️</span>
                    </a-tooltip>
                  </div>
                </template>
              </template>
            </a-table>
          </TableWrapper>
        </sdCards>

        <!-- View Budget Modal -->
        <a-modal v-model:open="viewModal" title="Budget Details" width="800px" :footer="null">
          <div v-if="selectedBudget">
            <a-descriptions :column="2" bordered size="small" style="margin-bottom:16px;">
              <a-descriptions-item label="Sub-County">{{ selectedBudget.sub_county }}</a-descriptions-item>
              <a-descriptions-item label="Status">
                <StatusBadge :status="selectedBudget.status">{{ capitalize(selectedBudget.status) }}</StatusBadge>
              </a-descriptions-item>
              <a-descriptions-item label="Total Budget">
                <strong style="color:#5F63F2;">KES {{ Number(selectedBudget.total_budget).toLocaleString() }}</strong>
              </a-descriptions-item>
              <a-descriptions-item label="Submitted By">{{ selectedBudget.submitted_by }}</a-descriptions-item>
            </a-descriptions>
            <TableWrapper class="table-data-view table-responsive">
              <a-table :dataSource="selectedBudget.lines" :columns="lineColumns" :pagination="false" size="small" row-key="id" />
            </TableWrapper>
            <div style="display:flex; justify-content:flex-end; margin-top:12px; gap:10px;">
              <sdButton type="primary" @click="downloadBudgetPDF">Download PDF</sdButton>
              <sdButton @click="viewModal = false">Close</sdButton>
            </div>
          </div>
        </a-modal>

        <!-- Refer Back Modal -->
        <a-modal v-model:open="referModal" title="Refer Budget Back" @ok="handleRefer" ok-text="Send Referral" :confirm-loading="referring">
          <p style="color:#5a5f7d; margin-bottom:12px;">
            Provide clear feedback so the sub-county officer can revise the budget.
          </p>
          <a-textarea v-model:value="referNote" :rows="4" placeholder="Explain what needs to be corrected..." />
        </a-modal>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { ref, computed } from 'vue';
import { notification } from 'ant-design-vue';
import { Main, TableWrapper } from '../../styled';
import { RecordViewWrapper, BudgetPageWrapper, StatusBadge, ActionBar } from './style';

const sampleBudgets = [
  { id: 1, sub_county: 'Kilifi North', status: 'submitted', total_budget: 485000, submitted_by: 'John Otieno', submitted_at: '2026-04-10',
    lines: [
      { id: 1, activity: 'Distribution', description: 'Field Allowance', unit_cost: 1500, quantity: 6, total: 9000 },
      { id: 2, activity: 'Distribution', description: 'Fuel – Motorcycles', unit_cost: 180, quantity: 20, total: 3600 },
    ] },
  { id: 2, sub_county: 'Kilifi South', status: 'approved', total_budget: 362000, submitted_by: 'Grace Wambua', submitted_at: '2026-04-09', lines: [] },
  { id: 3, sub_county: 'Kaloleni', status: 'referred', total_budget: 0, submitted_by: 'Peter Mwangi', submitted_at: '2026-04-08', lines: [] },
  { id: 4, sub_county: 'Rabai', status: 'pending', total_budget: 0, submitted_by: '—', submitted_at: '—', lines: [] },
  { id: 5, sub_county: 'Ganze', status: 'generated', total_budget: 415000, submitted_by: 'Mary Akinyi', submitted_at: '2026-04-11', lines: [] },
  { id: 6, sub_county: 'Malindi', status: 'submitted', total_budget: 520000, submitted_by: 'Ali Hassan', submitted_at: '2026-04-12', lines: [] },
];

export default {
  name: 'CountyBudgets',
  components: { Main, TableWrapper, RecordViewWrapper, BudgetPageWrapper, StatusBadge, ActionBar },
  setup() {
    const filterStatus = ref(null);
    const searchText = ref('');
    const viewModal = ref(false);
    const referModal = ref(false);
    const referring = ref(false);
    const referNote = ref('');
    const selectedBudget = ref(null);
    const budgets = ref([...sampleBudgets]);

    const filteredBudgets = computed(() =>
      budgets.value.filter(b => {
        const matchStatus = !filterStatus.value || b.status === filterStatus.value;
        const matchSearch = !searchText.value || b.sub_county.toLowerCase().includes(searchText.value.toLowerCase());
        return matchStatus && matchSearch;
      })
    );

    const columns = [
      { title: 'Sub-County', dataIndex: 'sub_county', key: 'sub_county' },
      { title: 'Status', key: 'status' },
      { title: 'Total Budget', key: 'total_budget' },
      { title: 'Submitted By', dataIndex: 'submitted_by', key: 'submitted_by' },
      { title: 'Date', dataIndex: 'submitted_at', key: 'submitted_at' },
      { title: 'Actions', key: 'action', width: 200 },
    ];

    const lineColumns = [
      { title: 'Activity', dataIndex: 'activity', key: 'activity' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost', customRender: ({ text }) => `KES ${text}` },
      { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
      { title: 'Total', dataIndex: 'total', key: 'total', customRender: ({ text }) => `KES ${Number(text).toLocaleString()}` },
    ];

    const statusColor = (s) => ({ pending: 'default', generated: 'blue', submitted: 'processing', approved: 'success', referred: 'warning' }[s] || 'default');
    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    const viewBudget = (record) => { selectedBudget.value = record; viewModal.value = true; };
    const openReferModal = (record) => { selectedBudget.value = record; referNote.value = ''; referModal.value = true; };

    const generateCountyBudget = (record) => {
      const idx = budgets.value.findIndex(b => b.id === record.id);
      if (idx >= 0) budgets.value[idx].status = 'approved';
      notification.success({ message: `Budget for ${record.sub_county} approved.` });
    };

    const handleRefer = () => {
      if (!referNote.value.trim()) { notification.warning({ message: 'Please provide feedback.' }); return; }
      referring.value = true;
      setTimeout(() => {
        const idx = budgets.value.findIndex(b => b.id === selectedBudget.value?.id);
        if (idx >= 0) budgets.value[idx].status = 'referred';
        referring.value = false;
        referModal.value = false;
        notification.success({ message: 'Budget referred back with feedback.' });
      }, 700);
    };

    const downloadBudgetPDF = () => notification.info({ message: 'PDF download started (demo).' });

    return {
      filterStatus, searchText, viewModal, referModal, referring, referNote,
      selectedBudget, filteredBudgets, columns, lineColumns,
      statusColor, capitalize, viewBudget, openReferModal,
      generateCountyBudget, handleRefer, downloadBudgetPDF,
    };
  },
};
</script>
