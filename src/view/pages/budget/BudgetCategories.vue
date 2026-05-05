<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper>
        <br>
        <br>
        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Budget Categories Parameters
            </h3>
            <p class="ph-subtitle">Group budget parameters into categories and stages</p>
          </div>
          <div class="ph-actions">
            <sdButton @click="fetchData" :disabled="loading">
              Refresh
            </sdButton>
          </div>
        </div>

        <ActionBar class="budget-filter-bar">
          <div class="action-bar-left">
            <a-input
              v-model:value="searchText"
              placeholder="Search categories or parameters..."
              class="bp-search"
              allow-clear
            />
            <a-select v-model:value="typeFilter" class="bp-select" allow-clear placeholder="All types">
              <a-select-option v-for="t in availableTypes" :key="t" :value="t">
                {{ formatLabel(t) }}
              </a-select-option>
            </a-select>
            <a-select v-model:value="stageFilter" class="bp-select" allow-clear placeholder="All stages">
              <a-select-option v-for="s in availableStages" :key="s" :value="s">
                Stage {{ s }}
              </a-select-option>
            </a-select>
          </div>
          <div class="action-bar-right">
            <span class="result-counter">
              Showing {{ filteredCategories.length }} of {{ categories.length }}
            </span>
          </div>
        </ActionBar>

        <sdCards headless class="bp-table-shell">
          <TableWrapper class="table-data-view table-responsive">
            <a-table
              :dataSource="filteredCategories"
              :columns="columns"
              :pagination="{ pageSize: 12 }"
              :loading="loading"
              row-key="category_id"
              :expandedRowKeys="expandedRowKeys"
              @expand="onExpand"
            >
              <template #expandedRowRender="{ record }">
                <div class="bp-expand-panel">
                  <div class="bp-expand-header">
                    <strong>Category Parameters</strong>
                    <span class="bp-expand-spacer" />
                    <sdButton
                      type="primary"
                      size="small"
                      @click="openLinkModal(record)"
                    >
                      + Link Parameters
                    </sdButton>
                  </div>
                  <div v-if="!record.parameters.length" class="bp-expand-empty">
                    No parameters linked to this category.
                  </div>
                  <a-table
                    v-else
                    :dataSource="record.parameters"
                    :columns="parameterColumns"
                    :pagination="false"
                    size="small"
                    row-key="id"
                  >
                    <template #bodyCell="{ column, record: p }">
                      <a-tag v-if="column.key === 'parameter_key'" class="bp-key-tag">
                        {{ p.parameter_key || '—' }}
                      </a-tag>
                      <strong v-else-if="column.key === 'unit_cost'" class="bp-money">
                        KES {{ Number(p.unit_cost || 0).toLocaleString() }}
                      </strong>
                      <span v-else-if="column.key === 'actions'">
                        <a-button
                          type="text"
                          size="small"
                          danger
                          :loading="deletingId === p.id"
                          class="bp-delete-btn"
                          title="Delete parameter"
                          @click="openDeleteModal(record, p)"
                        >
                          <template #icon>
                            <DeleteOutlined />
                          </template>
                        </a-button>
                      </span>
                      <span v-else>{{ p[column.dataIndex] }}</span>
                    </template>
                  </a-table>
                </div>
              </template>

              <template #bodyCell="{ column, record, text }">
                <a-tag
                  v-if="column.key === 'category_type'"
                  :color="typeColor(record.category_type)"
                  class="ba-tag"
                >
                  {{ formatLabel(record.category_type) }}
                </a-tag>
                <a-tag
                  v-else-if="column.key === 'category_stage'"
                  color="purple"
                  class="ba-tag"
                >
                  Stage {{ record.category_stage || '—' }}
                </a-tag>
                <span v-else-if="column.key === 'param_count'">
                  <strong class="bp-money">{{ record.parameters.length }}</strong>
                </span>
                <strong v-else-if="column.key === 'total_cost'" class="bp-money">
                  KES {{ Number(record.total_cost || 0).toLocaleString() }}
                </strong>
                <span v-else>{{ text }}</span>
              </template>
            </a-table>
          </TableWrapper>
        </sdCards>
      </BudgetPageWrapper>
    </Main>

    <!-- Link Parameters Modal -->
    <a-modal
      v-model:visible="linkModalVisible"
      :title="`Link Parameters — ${linkTarget?.category_name || ''}`"
      width="640px"
      :confirm-loading="submitting"
      :ok-button-props="{ disabled: !selectedParameterIds.length }"
      ok-text="Link Parameters"
      @ok="submitLinkParameters"
      @cancel="closeLinkModal"
    >
      <div class="bp-link-modal">
        <a-input
          v-model:value="paramSearch"
          placeholder="Search available parameters by label or key..."
          allow-clear
          class="bp-link-search"
        />
        <div v-if="parametersLoading" class="bp-link-loading">
          <a-spin size="small" /> <span>Loading parameters...</span>
        </div>
        <div v-else-if="!availableToLink.length" class="bp-link-empty">
          All active parameters are already linked to this category.
        </div>
        <div v-else class="bp-link-list">
          <a-checkbox-group v-model:value="selectedParameterIds" style="width:100%;">
            <div
              v-for="p in filteredAvailableToLink"
              :key="p.id"
              class="bp-link-row"
            >
              <a-checkbox :value="p.id">
                <div class="bp-link-row-inner">
                  <div class="bp-link-row-main">
                    <strong>{{ p.label }}</strong>
                    <a-tag class="bp-key-tag">{{ p.key }}</a-tag>
                  </div>
                  <div class="bp-link-row-meta">
                    <span>{{ p.unit_definition }}</span>
                    <strong class="bp-money">KES {{ Number(p.unit_cost || 0).toLocaleString() }}</strong>
                  </div>
                </div>
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
        <div class="bp-link-footer">
          <span>{{ selectedParameterIds.length }} selected</span>
        </div>
      </div>
    </a-modal>

    <!-- Delete Parameter Confirmation Modal -->
    <a-modal
      v-model:visible="deleteModalVisible"
      title="Remove Parameter"
      ok-text="Delete"
      cancel-text="Cancel"
      :ok-button-props="{ danger: true }"
      :confirm-loading="!!deletingId"
      :closable="!deletingId"
      :mask-closable="!deletingId"
      @ok="confirmDeleteCategoryParameter"
      @cancel="closeDeleteModal"
    >
      <p style="margin-bottom: 8px;">
        Are you sure you want to remove this parameter from the category?
      </p>
      <div
        v-if="deleteTarget.parameter"
        style="background:#f7f9fa;border:1px solid #eef0f2;border-radius:6px;padding:10px 12px;"
      >
        <div style="font-weight:600;color:#1f2437;">
          {{ deleteTarget.parameter.parameter_label || deleteTarget.parameter.parameter_key }}
        </div>
        <div v-if="deleteTarget.category" style="font-size:12px;color:#7a8a82;margin-top:2px;">
          From category: <strong>{{ deleteTarget.category.category_name }}</strong>
        </div>
      </div>
      <p style="margin-top:12px;color:#c0392b;font-size:12px;">
        This action cannot be undone.
      </p>
    </a-modal>
  </RecordViewWrapper>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { notification } from 'ant-design-vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import axios from '@/Axiosconfig';
import { Main, TableWrapper } from '../../styled';
import { RecordViewWrapper, ActionBar, BudgetPageWrapper } from './style';

export default {
  name: 'BudgetCategories',
  components: { Main, TableWrapper, RecordViewWrapper, ActionBar, BudgetPageWrapper, DeleteOutlined },
  setup() {
    const searchText = ref('');
    const typeFilter = ref(null);
    const stageFilter = ref(null);
    const loading = ref(false);
    const categories = ref([]);
    const expandedRowKeys = ref([]);

    // Link-parameters modal state
    const linkModalVisible = ref(false);
    const linkTarget = ref(null);
    const submitting = ref(false);
    const allParameters = ref([]);
    const parametersLoading = ref(false);
    const selectedParameterIds = ref([]);
    const paramSearch = ref('');

    const columns = [
      { title: '#', dataIndex: 'category_id', key: 'category_id', width: 60 },
      { title: 'Category Name', dataIndex: 'category_name', key: 'category_name', ellipsis: true },
      { title: 'Type', dataIndex: 'category_type', key: 'category_type', width: 140 },
      { title: 'Stage', dataIndex: 'category_stage', key: 'category_stage', width: 110 },
      { title: 'Parameters', key: 'param_count', width: 120 },
      { title: 'Total Unit Cost', key: 'total_cost', width: 180 },
    ];

    const parameterColumns = [
      { title: 'Label', dataIndex: 'parameter_label', key: 'parameter_label', ellipsis: true },
      { title: 'Key', dataIndex: 'parameter_key', key: 'parameter_key', width: 240 },
      { title: 'Unit Definition', dataIndex: 'unit_definition', key: 'unit_definition' },
      { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost', width: 160 },
      { title: '', key: 'actions', width: 60, align: 'center' },
    ];

    const deletingId = ref(null);
    const deleteModalVisible = ref(false);
    const deleteTarget = ref({ category: null, parameter: null });

    const openDeleteModal = (categoryRecord, parameter) => {
      deleteTarget.value = { category: categoryRecord, parameter };
      deleteModalVisible.value = true;
    };

    const closeDeleteModal = () => {
      if (deletingId.value) return;
      deleteModalVisible.value = false;
      deleteTarget.value = { category: null, parameter: null };
    };

    const confirmDeleteCategoryParameter = async () => {
      const { category, parameter } = deleteTarget.value;
      if (!parameter || !parameter.id) return;
      await deleteCategoryParameter(category, parameter);
      deleteModalVisible.value = false;
      deleteTarget.value = { category: null, parameter: null };
    };

    const deleteCategoryParameter = async (categoryRecord, parameter) => {
      if (!parameter || !parameter.id) return;
      deletingId.value = parameter.id;
      try {
        await axios.delete(`delete_category_parameter/${parameter.id}`);
        // remove locally and update total
        const idx = categoryRecord.parameters.findIndex(p => p.id === parameter.id);
        if (idx !== -1) {
          categoryRecord.parameters.splice(idx, 1);
          categoryRecord.total_cost = categoryRecord.parameters
            .reduce((sum, p) => sum + Number(p.unit_cost || 0), 0);
        }
        notification.success({
          message: 'Parameter removed',
          description: `"${parameter.parameter_label || parameter.parameter_key}" was removed from the category.`,
        });
      } catch (error) {
        notification.error({
          message: 'Unable to delete parameter',
          description: error?.response?.data?.message || 'Please try again.',
        });
      } finally {
        deletingId.value = null;
      }
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

    const groupByCategory = (rows) => {
      const map = new Map();
      rows.forEach(row => {
        const cid = row.category_id;
        if (!map.has(cid)) {
          map.set(cid, {
            category_id: cid,
            category_name: row.category_name || '',
            category_type: row.category_type || '',
            category_stage: row.category_stage || '',
            parameters: [],
            total_cost: 0,
          });
        }
        const group = map.get(cid);
        const unitCost = Number(row.unit_cost || 0);
        group.parameters.push({
          id: row.id,
          parameter_id: row.parameter_id,
          parameter_key: row.parameter_key || '',
          parameter_label: row.parameter_label || '',
          unit_definition: row.unit_definition || '',
          unit_cost: unitCost,
        });
        group.total_cost += unitCost;
      });
      return Array.from(map.values()).sort((a, b) => a.category_id - b.category_id);
    };

    const availableTypes = computed(() => {
      const set = new Set();
      categories.value.forEach(c => c.category_type && set.add(c.category_type));
      return Array.from(set).sort();
    });

    const availableStages = computed(() => {
      const set = new Set();
      categories.value.forEach(c => c.category_stage && set.add(c.category_stage));
      return Array.from(set).sort();
    });

    const filteredCategories = computed(() =>
      categories.value.filter(c => {
        const needle = searchText.value.trim().toLowerCase();
        const matchSearch = !needle ||
          (c.category_name || '').toLowerCase().includes(needle) ||
          (c.category_type || '').toLowerCase().includes(needle) ||
          c.parameters.some(p =>
            (p.parameter_label || '').toLowerCase().includes(needle) ||
            (p.parameter_key || '').toLowerCase().includes(needle),
          );
        const matchType = !typeFilter.value || c.category_type === typeFilter.value;
        const matchStage = !stageFilter.value || c.category_stage === stageFilter.value;
        return matchSearch && matchType && matchStage;
      }),
    );

    const fetchData = async () => {
      loading.value = true;
      try {
        const response = await axios.get('get_category_parameters');
        const rows = normalizePayload(response?.data);
        categories.value = groupByCategory(rows);
      } catch (error) {
        categories.value = [];
        notification.error({
          message: 'Unable to load category parameters',
          description: error?.response?.data?.message || 'Please try again.',
        });
      } finally {
        loading.value = false;
      }
    };

    const onExpand = (expanded, record) => {
      if (expanded) {
        expandedRowKeys.value = [...expandedRowKeys.value, record.category_id];
      } else {
        expandedRowKeys.value = expandedRowKeys.value.filter(k => k !== record.category_id);
      }
    };

    const fetchAllParameters = async () => {
      if (allParameters.value.length) return;
      parametersLoading.value = true;
      try {
        const response = await axios.get('get_budget_parameters');
        const rows = normalizePayload(response?.data)
          .map(item => ({
            id: item.id,
            key: item.key || '',
            label: item.label || '',
            unit_definition: item.unit_definition || '',
            unit_cost: Number(item.unit_cost || 0),
            is_active: Boolean(item.is_active),
          }))
          .filter(p => p.is_active)
          .sort((a, b) => a.label.localeCompare(b.label));
        allParameters.value = rows;
      } catch (error) {
        allParameters.value = [];
        notification.error({
          message: 'Unable to load parameters',
          description: error?.response?.data?.message || 'Please try again.',
        });
      } finally {
        parametersLoading.value = false;
      }
    };

    const availableToLink = computed(() => {
      if (!linkTarget.value) return [];
      const linked = new Set(
        (linkTarget.value.parameters || []).map(p => p.parameter_id),
      );
      return allParameters.value.filter(p => !linked.has(p.id));
    });

    const filteredAvailableToLink = computed(() => {
      const needle = paramSearch.value.trim().toLowerCase();
      if (!needle) return availableToLink.value;
      return availableToLink.value.filter(p =>
        p.label.toLowerCase().includes(needle) ||
        p.key.toLowerCase().includes(needle) ||
        p.unit_definition.toLowerCase().includes(needle),
      );
    });

    const openLinkModal = (record) => {
      linkTarget.value = record;
      selectedParameterIds.value = [];
      paramSearch.value = '';
      linkModalVisible.value = true;
      fetchAllParameters();
    };

    const closeLinkModal = () => {
      linkModalVisible.value = false;
      linkTarget.value = null;
      selectedParameterIds.value = [];
      paramSearch.value = '';
    };

    const submitLinkParameters = async () => {
      if (!linkTarget.value || !selectedParameterIds.value.length) return;
      submitting.value = true;
      try {
        const payload = {
          category_id: linkTarget.value.category_id,
          parameters: selectedParameterIds.value.map(id => ({ parameter_id: id })),
        };
        await axios.post('create_category_parameter', payload);
        notification.success({
          message: 'Parameters linked',
          description: `${selectedParameterIds.value.length} parameter(s) linked successfully.`,
        });
        closeLinkModal();
        await fetchData();
      } catch (error) {
        notification.error({
          message: 'Unable to link parameters',
          description: error?.response?.data?.message || 'Please try again.',
        });
      } finally {
        submitting.value = false;
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      searchText,
      typeFilter,
      stageFilter,
      loading,
      categories,
      filteredCategories,
      availableTypes,
      availableStages,
      columns,
      parameterColumns,
      expandedRowKeys,
      fetchData,
      onExpand,
      formatLabel,
      typeColor,
      // link-parameters modal
      linkModalVisible,
      linkTarget,
      submitting,
      parametersLoading,
      selectedParameterIds,
      paramSearch,
      availableToLink,
      filteredAvailableToLink,
      openLinkModal,
      closeLinkModal,
      submitLinkParameters,
      deletingId,
      deleteCategoryParameter,
      deleteModalVisible,
      deleteTarget,
      openDeleteModal,
      closeDeleteModal,
      confirmDeleteCategoryParameter,
    };
  },
};
</script>

<style scoped>
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
.bp-expand-empty {
  padding: 12px 0;
  color: #868eae;
  font-size: 13px;
}
.bp-expand-spacer {
  flex: 1;
}

/* Link parameters modal */
.bp-link-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bp-link-search {
  margin-bottom: 4px;
}
.bp-link-loading,
.bp-link-empty {
  padding: 16px 0;
  color: #868eae;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}
.bp-link-list {
  max-height: 360px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 6px;
}
.bp-link-row {
  padding: 8px 10px;
  border-radius: 4px;
  transition: background 0.15s;
}
.bp-link-row:hover {
  background: #fafbfc;
}
.bp-link-row + .bp-link-row {
  border-top: 1px solid #f5f5f5;
}
.bp-link-row :deep(.ant-checkbox-wrapper) {
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
}
.bp-link-row :deep(.ant-checkbox-wrapper > span:last-child) {
  flex: 1;
  padding-right: 0;
}
.bp-link-row-inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.bp-link-row-main {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.bp-link-row-meta {
  display: flex;
  justify-content: space-between;
  color: #868eae;
  font-size: 12px;
}
.bp-link-footer {
  display: flex;
  justify-content: flex-end;
  color: #5a5f7d;
  font-size: 12px;
  font-weight: 600;
}
</style>
