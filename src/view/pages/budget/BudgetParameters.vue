<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper>
        <!-- Slim top bar -->

        <!-- Page heading -->
        <div class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Campaign Budget Parameters
            </h3>
            <p class="ph-subtitle">Define unit costs and parameters used across campaign budgets</p>
          </div>
          <div class="ph-actions">
            <sdButton @click="fetchBudgetParameters" :disabled="loading">
              Refresh
            </sdButton>
            <sdButton type="primary" @click="openCreateModal">
              Add Parameter
            </sdButton>
          </div>
        </div>

        <ActionBar class="budget-filter-bar">
          <div class="action-bar-left">
            <a-input
              v-model:value="searchText"
              placeholder="Search by label, key, or unit definition"
              class="bp-search"
              allow-clear
            />
            <a-select v-model:value="statusFilter" class="bp-select" allow-clear placeholder="All status">
              <a-select-option value="active">Active only</a-select-option>
              <a-select-option value="inactive">Inactive only</a-select-option>
            </a-select>
          </div>
          <div class="action-bar-right">
            <span class="result-counter">Showing {{ filteredAssumptions.length }} of {{ assumptions.length }}</span>
          </div>
        </ActionBar>

        <sdCards headless class="bp-table-shell">
          <!-- Desktop / tablet table -->
          <TableWrapper class="table-data-view table-responsive bp-table-view">
            <a-table
              :dataSource="filteredAssumptions"
              :columns="columns"
              :pagination="{ pageSize: 12 }"
              :loading="loading"
              row-key="id"
            >
              <template #bodyCell="{ column, record, text }">
                <a-tag v-if="column.key === 'key'" class="bp-key-tag">
                  {{ record.key || '—' }}
                </a-tag>
                <strong v-else-if="column.key === 'unit_cost'" class="bp-money">
                  KES {{ Number(record.unit_cost || 0).toLocaleString() }}
                </strong>
                <StatusBadge
                  v-else-if="column.key === 'is_active'"
                  :status="record.is_active ? 'approved' : 'pending'"
                >
                  {{ record.is_active ? 'Active' : 'Inactive' }}
                </StatusBadge>
                <div v-else-if="column.key === 'actions'" class="bp-actions">
                  <a-button
                    type="link"
                    size="small"
                    @click="openEditModal(record)"
                    :disabled="loading"
                  >
                    Edit
                  </a-button>
                  <a-divider type="vertical" />
                  <a-button
                    type="link"
                    danger
                    size="small"
                    @click="deleteParameter(record.id)"
                    :loading="deletingId === record.id"
                  >
                    Delete
                  </a-button>
                </div>
                <span v-else>{{ text }}</span>
              </template>
            </a-table>
          </TableWrapper>

          <!-- Mobile card view -->
          <div class="bp-card-view">
            <a-spin v-if="loading" class="bp-card-loading" />
            <div v-else-if="!filteredAssumptions.length" class="bp-card-empty">
              No budget parameters found.
            </div>
            <div
              v-else
              v-for="item in filteredAssumptions"
              :key="item.id"
              class="bp-card"
            >
              <div class="bp-card-head">
                <div class="bp-card-title">
                  <span class="bp-card-id">#{{ item.id }}</span>
                  <strong>{{ item.label || '—' }}</strong>
                </div>
                <StatusBadge :status="item.is_active ? 'approved' : 'pending'">
                  {{ item.is_active ? 'Active' : 'Inactive' }}
                </StatusBadge>
              </div>
              <a-tag class="bp-key-tag bp-card-key">{{ item.key || '—' }}</a-tag>
              <div class="bp-card-meta">
                <span class="bp-card-label">Unit Definition</span>
                <span>{{ item.unit_definition || '—' }}</span>
              </div>
              <div class="bp-card-meta">
                <span class="bp-card-label">Unit Cost</span>
                <strong class="bp-money">
                  KES {{ Number(item.unit_cost || 0).toLocaleString() }}
                </strong>
              </div>
              <div class="bp-card-actions">
                <a-button
                  type="primary"
                  ghost
                  size="small"
                  @click="openEditModal(item)"
                  :disabled="loading"
                >
                  Edit
                </a-button>
                <a-button
                  danger
                  size="small"
                  @click="deleteParameter(item.id)"
                  :loading="deletingId === item.id"
                >
                  Delete
                </a-button>
              </div>
            </div>
          </div>
        </sdCards>
      </BudgetPageWrapper>
    </Main>

    <!-- Create/Edit Modal -->
    <a-modal
      :title="isEditMode ? 'Edit Budget Parameter' : 'Create Budget Parameter'"
      v-model:visible="showModal"
      @ok="submitForm"
      :ok-text="isEditMode ? 'Update' : 'Create'"
      :confirm-loading="submitting"
      :ok-button-props="{ disabled: !isFormValid }"
    >
      <a-form layout="vertical" :model="formData">
        <a-form-item
          label="Key"
          :required="true"
          :help="keyError"
          :validate-status="keyError ? 'error' : ''"
        >
          <a-input
            v-model:value="formData.key"
            placeholder="e.g., STAFF_COST_MONTHLY"
            :disabled="isEditMode"
            @blur="validateKey"
          />
        </a-form-item>

        <a-form-item
          label="Label"
          :required="true"
          :help="labelError"
          :validate-status="labelError ? 'error' : ''"
        >
          <a-input
            v-model:value="formData.label"
            placeholder="e.g., Monthly Staff Cost"
            @blur="validateLabel"
          />
        </a-form-item>

        <a-form-item
          label="Unit Definition"
          :required="true"
          :help="unitDefinitionError"
          :validate-status="unitDefinitionError ? 'error' : ''"
        >
          <a-input
            v-model:value="formData.unit_definition"
            placeholder="e.g., Per Staff Member per Month"
            @blur="validateUnitDefinition"
          />
        </a-form-item>

        <a-form-item
          label="Unit Cost (KES)"
          :required="true"
          :help="unitCostError"
          :validate-status="unitCostError ? 'error' : ''"
        >
          <a-input-number
            v-model:value="formData.unit_cost"
            :min="0"
            placeholder="0"
            @blur="validateUnitCost"
          />
        </a-form-item>

        <a-form-item label="Active">
          <a-checkbox v-model:checked="formData.is_active">
            Active
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </RecordViewWrapper>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { notification, Modal } from 'ant-design-vue';
import axios from '@/Axiosconfig';
import { Main, TableWrapper } from '../../styled';
import { RecordViewWrapper, ActionBar, BudgetPageWrapper, StatusBadge } from './style';

export default {
  name: 'BudgetParameters',
  components: { Main, TableWrapper, RecordViewWrapper, ActionBar, BudgetPageWrapper, StatusBadge },
  setup() {
    const searchText = ref('');
    const statusFilter = ref(null);
    const loading = ref(false);
    const submitting = ref(false);
    const deletingId = ref(null);
    const assumptions = ref([]);
    const showModal = ref(false);
    const isEditMode = ref(false);
    const editingId = ref(null);

    // Form data
    const formData = ref({
      key: '',
      label: '',
      unit_definition: '',
      unit_cost: null,
      is_active: true,
    });

    // Form validation errors
    const keyError = ref('');
    const labelError = ref('');
    const unitDefinitionError = ref('');
    const unitCostError = ref('');

    const resetFormData = () => {
      formData.value = {
        key: '',
        label: '',
        unit_definition: '',
        unit_cost: null,
        is_active: true,
      };
      keyError.value = '';
      labelError.value = '';
      unitDefinitionError.value = '';
      unitCostError.value = '';
      isEditMode.value = false;
      editingId.value = null;
    };

    const validateKey = () => {
      if (!formData.value.key || formData.value.key.trim() === '') {
        keyError.value = 'Key is required';
        return false;
      }
      if (formData.value.key.length > 80) {
        keyError.value = 'Key must not exceed 80 characters';
        return false;
      }
      keyError.value = '';
      return true;
    };

    const validateLabel = () => {
      if (!formData.value.label || formData.value.label.trim() === '') {
        labelError.value = 'Label is required';
        return false;
      }
      if (formData.value.label.length > 255) {
        labelError.value = 'Label must not exceed 255 characters';
        return false;
      }
      labelError.value = '';
      return true;
    };

    const validateUnitDefinition = () => {
      if (!formData.value.unit_definition || formData.value.unit_definition.trim() === '') {
        unitDefinitionError.value = 'Unit definition is required';
        return false;
      }
      if (formData.value.unit_definition.length > 255) {
        unitDefinitionError.value = 'Unit definition must not exceed 255 characters';
        return false;
      }
      unitDefinitionError.value = '';
      return true;
    };

    const validateUnitCost = () => {
      if (formData.value.unit_cost === null || formData.value.unit_cost === '') {
        unitCostError.value = 'Unit cost is required';
        return false;
      }
      if (formData.value.unit_cost < 0) {
        unitCostError.value = 'Unit cost must be greater than or equal to 0';
        return false;
      }
      unitCostError.value = '';
      return true;
    };

    const isFormValid = computed(() => {
      return (
        formData.value.key &&
        formData.value.label &&
        formData.value.unit_definition &&
        formData.value.unit_cost !== null &&
        formData.value.unit_cost !== '' &&
        formData.value.unit_cost >= 0 &&
        !keyError.value &&
        !labelError.value &&
        !unitDefinitionError.value &&
        !unitCostError.value
      );
    });

    const columns = [
      { title: 'Label', dataIndex: 'label', key: 'label', ellipsis: true },
      { title: 'Key', dataIndex: 'key', key: 'key', width: 230 },
      { title: 'Unit Definition', dataIndex: 'unit_definition', key: 'unit_definition' },
      { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost', width: 180 },
      { title: 'Status', dataIndex: 'is_active', key: 'is_active', width: 120 },
      { title: 'Actions', key: 'actions', width: 150, align: 'center' },
    ];

    const filteredAssumptions = computed(() =>
      assumptions.value.filter(a => {
        const normalizedSearch = searchText.value.trim().toLowerCase();
        const matchSearch = !normalizedSearch ||
          a.label.toLowerCase().includes(normalizedSearch) ||
          a.key.toLowerCase().includes(normalizedSearch) ||
          a.unit_definition.toLowerCase().includes(normalizedSearch);
        const matchStatus = !statusFilter.value ||
          (statusFilter.value === 'active' && a.is_active) ||
          (statusFilter.value === 'inactive' && !a.is_active);
        return matchSearch && matchStatus;
      })
    );

    const normalizePayload = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.message)) return payload.message;
      return [];
    };

    const fetchBudgetParameters = async () => {
      loading.value = true;
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
            updated_at: item.updated_at || null,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        assumptions.value = rows;
      } catch (error) {
        assumptions.value = [];
        notification.error({
          message: 'Unable to load budget parameters',
          description: error?.response?.data?.message || 'Please try again.',
        });
      } finally {
        loading.value = false;
      }
    };

    const openCreateModal = () => {
      resetFormData();
      showModal.value = true;
    };

    const openEditModal = (record) => {
      isEditMode.value = true;
      editingId.value = record.id;
      formData.value = {
        key: record.key,
        label: record.label,
        unit_definition: record.unit_definition,
        unit_cost: record.unit_cost,
        is_active: record.is_active,
      };
      showModal.value = true;
    };

    const submitForm = async () => {
      // Validate all fields
      const isKeyValid = validateKey();
      const isLabelValid = validateLabel();
      const isUnitDefinitionValid = validateUnitDefinition();
      const isUnitCostValid = validateUnitCost();

      if (!isKeyValid || !isLabelValid || !isUnitDefinitionValid || !isUnitCostValid) {
        return;
      }

      submitting.value = true;
      try {
        const payload = {
          key: formData.value.key,
          label: formData.value.label,
          unit_definition: formData.value.unit_definition,
          unit_cost: formData.value.unit_cost,
          is_active: formData.value.is_active,
        };

        if (isEditMode.value) {
          // Update existing parameter
          await axios.put(`update_budget_parameter/${editingId.value}`, payload);
          notification.success({
            message: 'Success',
            description: 'Budget parameter updated successfully.',
          });
        } else {
          // Create new parameter
          await axios.post('create_budget_parameter', payload);
          notification.success({
            message: 'Success',
            description: 'Budget parameter created successfully.',
          });
        }

        showModal.value = false;
        resetFormData();
        await fetchBudgetParameters();
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.error;
        if (error?.response?.data?.errors) {
          // Handle validation errors
          const errors = error.response.data.errors;
          if (errors.key) keyError.value = errors.key[0];
          if (errors.label) labelError.value = errors.label[0];
          if (errors.unit_definition) unitDefinitionError.value = errors.unit_definition[0];
          if (errors.unit_cost) unitCostError.value = errors.unit_cost[0];
          notification.error({
            message: 'Validation Error',
            description: 'Please check the form for errors.',
          });
        } else {
          notification.error({
            message: isEditMode.value ? 'Unable to update parameter' : 'Unable to create parameter',
            description: errorMessage || 'Please try again.',
          });
        }
      } finally {
        submitting.value = false;
      }
    };

    const deleteParameter = async (id) => {
      Modal.confirm({
        title: 'Confirm Delete',
        content: 'Are you sure you want to delete this budget parameter? This action cannot be undone.',
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          deletingId.value = id;
          try {
            await axios.delete(`delete_budget_parameter/${id}`);
            notification.success({
              message: 'Success',
              description: 'Budget parameter deleted successfully.',
            });
            await fetchBudgetParameters();
          } catch (error) {
            notification.error({
              message: 'Unable to delete parameter',
              description: error?.response?.data?.message || 'Please try again.',
            });
          } finally {
            deletingId.value = null;
          }
        },
      });
    };

    onMounted(() => {
      fetchBudgetParameters();
    });

    return {
      searchText,
      statusFilter,
      loading,
      submitting,
      deletingId,
      assumptions,
      columns,
      filteredAssumptions,
      fetchBudgetParameters,
      showModal,
      isEditMode,
      formData,
      keyError,
      labelError,
      unitDefinitionError,
      unitCostError,
      isFormValid,
      openCreateModal,
      openEditModal,
      submitForm,
      deleteParameter,
      validateKey,
      validateLabel,
      validateUnitDefinition,
      validateUnitCost,
    };
  },
};
</script>

<style scoped>
/* Card view hidden by default (desktop) */
.bp-card-view {
  display: none;
}

.bp-card-loading,
.bp-card-empty {
  padding: 24px 0;
  text-align: center;
  color: #868eae;
  font-size: 13px;
}

.bp-card {
  background: #fff;
  border: 1px solid #f1f2f6;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(146, 153, 184, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bp-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.bp-card-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.bp-card-title strong {
  color: #272b41;
  font-size: 15px;
  line-height: 1.35;
  word-break: break-word;
}

.bp-card-id {
  font-size: 11px;
  font-weight: 600;
  color: #9299b8;
}

.bp-card-key {
  align-self: flex-start;
}

.bp-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #5a5f7d;
  padding: 6px 0;
  border-top: 1px dashed #f1f2f6;
}

.bp-card-label {
  color: #9299b8;
  font-weight: 500;
}

.bp-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 6px;
  border-top: 1px solid #f1f2f6;
}

/* Mobile breakpoint: swap table for cards */
@media (max-width: 767px) {
  .bp-table-view {
    display: none;
  }
  .bp-card-view {
    display: block;
  }

  /* Tighter hero + filter bar on mobile */
  :deep(.budget-hero),
  :deep(.budget-filter-bar) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  :deep(.budget-filter-bar .action-bar-left) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    width: 100%;
  }
  :deep(.budget-filter-bar .action-bar-left .bp-search),
  :deep(.budget-filter-bar .action-bar-left .bp-select) {
    width: 100% !important;
  }
  :deep(.hero-actions) {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
