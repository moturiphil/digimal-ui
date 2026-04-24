<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper>
        <ActionBar class="budget-hero">
          <div class="action-bar-left hero-copy">
            <h3 class="hero-title">Campaign Budget Categories</h3>
          </div>
          <div class="action-bar-right hero-actions">
            <a-tag color="green" class="hero-pill">KES Standardized</a-tag>
            <sdButton @click="fetchCategories" :disabled="loading">
              Refresh
            </sdButton>
          </div>
        </ActionBar>

        <ActionBar class="budget-filter-bar">
          <div class="action-bar-left">
            <a-input
              v-model:value="searchText"
              :placeholder="`Search ${activeTab === 'sub_county' ? 'sub-county' : 'county'} activities...`"
              class="bp-search"
              allow-clear
            />
            <a-select v-model:value="typeFilter" class="bp-select" allow-clear placeholder="All types">
              <a-select-option v-for="t in availableTypes" :key="t" :value="t">
                {{ t }}
              </a-select-option>
            </a-select>
            <a-select v-model:value="statusFilter" class="bp-select" allow-clear placeholder="All status">
              <a-select-option value="active">Active only</a-select-option>
              <a-select-option value="inactive">Inactive only</a-select-option>
            </a-select>
          </div>
          <div class="action-bar-right">
            <span class="result-counter">
              Showing {{ filteredCategories.length }} of {{ scopedCategories.length }}
            </span>
          </div>
        </ActionBar>

        <sdCards headless class="bp-table-shell">
          <a-tabs v-model:activeKey="activeTab" class="bp-tabs">
            <a-tab-pane key="sub_county" tab="Sub-County Activities" />
            <a-tab-pane key="county" tab="County Activities" />
          </a-tabs>

          <TableWrapper class="table-data-view table-responsive">
            <a-table
              :dataSource="filteredCategories"
              :columns="columns"
              :pagination="{ pageSize: 12 }"
              :loading="loading"
              row-key="id"
              :expandedRowKeys="expandedRowKeys"
              @expand="onExpand"
            >
              <template #expandedRowRender="{ record }">
                <div class="bp-expand-panel">
                  <div class="bp-expand-header">
                    <strong>Category Parameters</strong>
                    <span v-if="record.description" class="bp-expand-desc">{{ record.description }}</span>
                  </div>
                  <div v-if="parametersLoading[record.id]" class="bp-expand-loading">
                    <a-spin size="small" /> <span>Loading parameters...</span>
                  </div>
                  <div
                    v-else-if="!(categoryParameters[record.id] || []).length"
                    class="bp-expand-empty"
                  >
                    No parameters linked to this category.
                  </div>
                  <a-table
                    v-else
                    :dataSource="categoryParameters[record.id]"
                    :columns="parameterColumns"
                    :pagination="false"
                    size="small"
                    row-key="id"
                  >
                    <template #bodyCell="{ column, record: p }">
                      <a-tag v-if="column.key === 'key'" class="bp-key-tag">
                        {{ p.key || '—' }}
                      </a-tag>
                      <strong v-else-if="column.key === 'unit_cost'" class="bp-money">
                        KES {{ Number(p.unit_cost || 0).toLocaleString() }}
                      </strong>
                      <StatusBadge
                        v-else-if="column.key === 'is_active'"
                        :status="p.is_active ? 'approved' : 'pending'"
                      >
                        {{ p.is_active ? 'Active' : 'Inactive' }}
                      </StatusBadge>
                      <span v-else>{{ p[column.dataIndex] }}</span>
                    </template>
                  </a-table>
                </div>
              </template>

              <template #bodyCell="{ column, record, text }">
                <a-tag
                  v-if="column.key === 'type'"
                  :color="typeColor(record.type)"
                  class="ba-tag"
                >
                  {{ formatLabel(record.type) }}
                </a-tag>
                <a-tag
                  v-else-if="column.key === 'scope'"
                  :color="record.scope === 'county' ? 'geekblue' : 'cyan'"
                  class="ba-tag"
                >
                  {{ formatScope(record.scope) }}
                </a-tag>
                <a-tag
                  v-else-if="column.key === 'stage'"
                  color="purple"
                  class="ba-tag"
                >
                  Stage {{ record.stage || '—' }}
                </a-tag>
                <StatusBadge
                  v-else-if="column.key === 'is_active'"
                  :status="record.is_active ? 'approved' : 'pending'"
                >
                  {{ record.is_active ? 'Active' : 'Inactive' }}
                </StatusBadge>
                <a-tag
                  v-else-if="column.key === 'allows_special_costs'"
                  :color="record.allows_special_costs ? 'gold' : 'default'"
                  class="ba-tag"
                >
                  {{ record.allows_special_costs ? 'Yes' : 'No' }}
                </a-tag>
                <span v-else>{{ text }}</span>
              </template>
            </a-table>
          </TableWrapper>
        </sdCards>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue';
import { notification } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main, TableWrapper } from '../../styled';
import { RecordViewWrapper, ActionBar, BudgetPageWrapper, StatusBadge } from './style';

export default {
  name: 'BudgetActivities',
  components: { Main, TableWrapper, RecordViewWrapper, ActionBar, BudgetPageWrapper, StatusBadge },
  setup() {
    const activeTab = ref('sub_county');
    const searchText = ref('');
    const typeFilter = ref(null);
    const statusFilter = ref(null);
    const loading = ref(false);
    const categories = ref([]);
    const expandedRowKeys = ref([]);
    const categoryParameters = reactive({});
    const parametersLoading = reactive({});

    const columns = [
      { title: '#', dataIndex: 'id', key: 'id', width: 60 },
      { title: 'Activity Name', dataIndex: 'name', key: 'name', ellipsis: true },
      { title: 'Type', dataIndex: 'type', key: 'type', width: 140 },
      { title: 'Stage', dataIndex: 'stage', key: 'stage', width: 100 },
      { title: 'Scope', dataIndex: 'scope', key: 'scope', width: 140 },
      { title: 'Duration (days)', dataIndex: 'default_days', key: 'default_days', width: 140 },
      { title: 'Special Costs', dataIndex: 'allows_special_costs', key: 'allows_special_costs', width: 130 },
      { title: 'Status', dataIndex: 'is_active', key: 'is_active', width: 110 },
    ];

    const parameterColumns = [
      { title: 'Label', dataIndex: 'label', key: 'label', ellipsis: true },
      { title: 'Key', dataIndex: 'key', key: 'key', width: 220 },
      { title: 'Unit Definition', dataIndex: 'unit_definition', key: 'unit_definition' },
      { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost', width: 160 },
      { title: 'Status', dataIndex: 'is_active', key: 'is_active', width: 110 },
    ];

    const formatScope = (scope) => {
      if (!scope) return '—';
      return scope
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join('-');
    };

    const formatLabel = (value) => {
      if (!value) return '—';
      return String(value)
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    };

    const typeColorMap = {
      event: 'volcano',
      training: 'blue',
      distribution: 'green',
      supervision: 'magenta',
      community: 'orange',
      logistics: 'purple',
      meeting: 'cyan',
    };
    const typeColor = (type) => typeColorMap[type] || 'default';

    const normalizePayload = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.message)) return payload.message;
      return [];
    };

    const scopedCategories = computed(() =>
      categories.value.filter(c => c.scope === activeTab.value),
    );

    const availableTypes = computed(() => {
      const set = new Set();
      scopedCategories.value.forEach(c => c.type && set.add(c.type));
      return Array.from(set).sort();
    });

    const filteredCategories = computed(() =>
      scopedCategories.value.filter(c => {
        const needle = searchText.value.trim().toLowerCase();
        const matchSearch = !needle ||
          (c.name || '').toLowerCase().includes(needle) ||
          (c.type || '').toLowerCase().includes(needle) ||
          (c.description || '').toLowerCase().includes(needle);
        const matchType = !typeFilter.value || c.type === typeFilter.value;
        const matchStatus = !statusFilter.value ||
          (statusFilter.value === 'active' && c.is_active) ||
          (statusFilter.value === 'inactive' && !c.is_active);
        return matchSearch && matchType && matchStatus;
      }),
    );

    const fetchCategories = async () => {
      loading.value = true;
      try {
        const response = await axios.get('get_budget_categories');
        const rows = normalizePayload(response?.data)
          .map(item => ({
            id: item.id,
            name: item.name || '',
            description: item.description || '',
            type: item.type || '',
            stage: item.stage || '',
            scope: item.scope || '',
            default_days: Number(item.default_days || 0),
            sort_order: Number(item.sort_order || 0),
            allows_special_costs: Boolean(item.allows_special_costs),
            is_active: Boolean(item.is_active),
          }))
          .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
        categories.value = rows;
      } catch (error) {
        categories.value = [];
        notification.error({
          message: 'Unable to load budget categories',
          description: error?.response?.data?.message || 'Please try again.',
        });
      } finally {
        loading.value = false;
      }
    };

    const fetchCategoryParameters = async (categoryId) => {
      if (categoryParameters[categoryId]) return;
      parametersLoading[categoryId] = true;
      try {
        const response = await axios.get(`get_budget_category_parameters/${categoryId}`);
        const rows = normalizePayload(response?.data).map(item => ({
          id: item.id,
          key: item.key || '',
          label: item.label || '',
          unit_definition: item.unit_definition || '',
          unit_cost: Number(item.unit_cost || 0),
          is_active: Boolean(item.is_active),
        }));
        categoryParameters[categoryId] = rows;
      } catch (error) {
        categoryParameters[categoryId] = [];
      } finally {
        parametersLoading[categoryId] = false;
      }
    };

    const onExpand = (expanded, record) => {
      if (expanded) {
        expandedRowKeys.value = [...expandedRowKeys.value, record.id];
        fetchCategoryParameters(record.id);
      } else {
        expandedRowKeys.value = expandedRowKeys.value.filter(k => k !== record.id);
      }
    };

    onMounted(() => {
      fetchCategories();
    });

    return {
      activeTab,
      searchText,
      typeFilter,
      statusFilter,
      loading,
      categories,
      scopedCategories,
      filteredCategories,
      availableTypes,
      columns,
      parameterColumns,
      expandedRowKeys,
      categoryParameters,
      parametersLoading,
      fetchCategories,
      onExpand,
      formatScope,
      formatLabel,
      typeColor,
    };
  },
};
</script>

<style scoped>
.bp-tabs {
  margin-bottom: 0;
  padding: 4px 20px 0;
}
.ba-tag {
  font-weight: 600;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 12px;
  border-width: 1px;
  line-height: 18px;
}
.ba-tag,
.ba-tag span {
  color: inherit !important;
}
.ba-tag.ant-tag-volcano { color: #d4380d !important; }
.ba-tag.ant-tag-blue { color: #1d39c4 !important; }
.ba-tag.ant-tag-geekblue { color: #1d39c4 !important; }
.ba-tag.ant-tag-cyan { color: #08979c !important; }
.ba-tag.ant-tag-green { color: #389e0d !important; }
.ba-tag.ant-tag-magenta { color: #c41d7f !important; }
.ba-tag.ant-tag-orange { color: #d46b08 !important; }
.ba-tag.ant-tag-purple { color: #531dab !important; }
.ba-tag.ant-tag-gold { color: #d48806 !important; }
.ba-tag.ant-tag-default { color: #595959 !important; }
.bp-expand-panel {
  padding: 12px 18px;
  background: #fafbfc;
  border-radius: 6px;
}
.bp-expand-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  color: #5a5f7d;
}
.bp-expand-desc {
  color: #868eae;
  font-size: 13px;
}
.bp-expand-loading,
.bp-expand-empty {
  padding: 12px 0;
  color: #868eae;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
