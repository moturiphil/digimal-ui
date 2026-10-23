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
                <span v-else-if="column.key === 'percentage'" class="bp-pct-cell">
                  <span v-if="record.is_percentage" class="bp-pct-text">
                    {{ percentageSummary(record) }}
                  </span>
                  <span v-else class="bp-pct-none">—</span>
                </span>
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
          :label="formData.is_percentage ? 'Fallback Unit Cost (KES)' : 'Unit Cost (KES)'"
          :required="!formData.is_percentage"
          :help="unitCostError"
          :validate-status="unitCostError ? 'error' : ''"
        >
          <a-input-number
            v-model:value="formData.unit_cost"
            :min="0"
            placeholder="0"
            @blur="validateUnitCost"
          />
          <p v-if="formData.is_percentage" class="bp-pct-hint">
            A percentage parameter DERIVES its unit cost, so this rate is only the
            fallback used when the percentage cannot be resolved.
          </p>
        </a-form-item>

        <!-- Percentage parameter ---------------------------------------------- -->
        <div class="bp-pct-section">
          <div class="bp-pct-head">
            <strong>Percentage parameter</strong>
            <a-checkbox v-model:checked="formData.is_percentage">
              Charge this as a percentage of another parameter
            </a-checkbox>
          </div>
          <p class="bp-pct-hint">
            The unit cost is then derived instead of typed:
            <code>(numerator ÷ denominator) × what it is compared against</code>.
            For 5% use numerator <strong>5</strong> and denominator
            <strong>100</strong>.
          </p>

          <template v-if="formData.is_percentage">
            <div class="bp-pct-row">
              <a-form-item label="Numerator" required class="bp-pct-col">
                <a-input-number
                  v-model:value="formData.percentage_numerator"
                  :min="0"
                  :precision="4"
                  placeholder="5"
                  class="bp-pct-input"
                />
              </a-form-item>
              <a-form-item label="Denominator" required class="bp-pct-col">
                <a-input-number
                  v-model:value="formData.percentage_denominator"
                  :min="0"
                  :precision="4"
                  placeholder="100"
                  class="bp-pct-input"
                />
              </a-form-item>
              <a-form-item label="Equals" class="bp-pct-col">
                <span class="bp-pct-preview">{{ percentagePreview }}%</span>
              </a-form-item>
            </div>

            <a-form-item
              label="Percentage of (the amount it is taken of)"
              required
              :help="percentageError"
              :validate-status="percentageError ? 'error' : ''"
            >
              <a-input-number
                v-model:value="formData.percentage_of_amount"
                :min="0"
                :precision="2"
                placeholder="e.g. 565488"
                class="bp-pct-amount"
              />
              <p class="bp-pct-hint">
                The actual cost the percentage is taken of.
                <template v-if="percentageOfPreview !== '—'">
                  {{ percentagePreview }}% of
                  <strong>{{ Number(formData.percentage_of_amount).toLocaleString() }}</strong>
                  prices the line at <strong>KES {{ percentageOfPreview }}</strong>.
                </template>
              </p>
            </a-form-item>

            <a-form-item label="…or take it from a parameter (used only when the amount above is blank)">
              <a-select
                v-model:value="formData.percentage_of_parameter_id"
                show-search
                allow-clear
                option-filter-prop="label"
                placeholder="No parameter — use the amount above"
                :options="percentageBaseOptions"
              />
            </a-form-item>

            <a-form-item v-if="formData.percentage_of_parameter_id" label="Compare against">
              <a-select v-model:value="formData.percentage_base">
                <a-select-option value="unit_cost">Its unit cost (rate card)</a-select-option>
                <a-select-option value="actual_cost">Its actual cost in this budget</a-select-option>
              </a-select>
              <p class="bp-pct-hint">
                <strong>Actual cost</strong> makes the derived amount follow the
                base's real amount in each budget, so Units and No. of Days can
                stay at 1 and the line still equals that percentage of the base.
                <strong>Unit cost</strong> keeps this a true per-unit rate, which
                the officer mirrors against the base line.
              </p>
            </a-form-item>
          </template>
        </div>

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

    // Form data.
    //
    // `is_percentage` is UI-only: it decides whether the percentage block is
    // shown. The API keys off `percentage_of_parameter_id` — with no base the
    // parameter is an ordinary fixed-rate one.
    const blankForm = () => ({
      key: '',
      label: '',
      unit_definition: '',
      unit_cost: null,
      is_active: true,
      is_percentage: false,
      percentage_numerator: null,
      percentage_denominator: 100,
      percentage_of_parameter_id: null,
      percentage_of_amount: null,
      percentage_base: 'unit_cost',
    });

    const formData = ref(blankForm());

    // Form validation errors
    const keyError = ref('');
    const labelError = ref('');
    const unitDefinitionError = ref('');
    const unitCostError = ref('');
    const percentageError = ref('');

    const resetFormData = () => {
      formData.value = blankForm();
      keyError.value = '';
      labelError.value = '';
      unitDefinitionError.value = '';
      unitCostError.value = '';
      percentageError.value = '';
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
      // A percentage parameter DERIVES its unit cost from its base, so the
      // stored rate is only the fallback used when the percentage cannot be
      // resolved — it may legitimately be left at 0.
      if (formData.value.is_percentage
        && (formData.value.unit_cost === null || formData.value.unit_cost === '')) {
        unitCostError.value = '';
        return true;
      }

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

    /**
     * The percentage has something to be taken of: an explicitly entered amount
     * (the "Percentage of" input), or a parameter to resolve it from.
     */
    const hasPercentageOf = computed(() => {
      const amount = formData.value.percentage_of_amount;
      const hasAmount = amount !== null && amount !== '' && Number(amount) > 0;

      return hasAmount || !!formData.value.percentage_of_parameter_id;
    });

    /**
     * A percentage parameter needs a numerator, a denominator and something to
     * take the percentage OF. Mirrors the API's guardPercentage().
     */
    const validatePercentage = () => {
      if (!formData.value.is_percentage) {
        percentageError.value = '';
        return true;
      }

      if (!hasPercentageOf.value) {
        percentageError.value = 'Enter the amount the percentage is taken of, or choose a parameter to take it from';
        return false;
      }

      const numerator = Number(formData.value.percentage_numerator);
      if (!Number.isFinite(numerator) || numerator <= 0) {
        percentageError.value = 'Numerator must be greater than 0 (e.g. 5)';
        return false;
      }

      const denominator = Number(formData.value.percentage_denominator);
      if (!Number.isFinite(denominator) || denominator <= 0) {
        percentageError.value = 'Denominator must be greater than 0 (e.g. 100)';
        return false;
      }

      percentageError.value = '';
      return true;
    };

    /** True when the percentage block is complete. */
    const isPercentageValid = computed(() =>
      !formData.value.is_percentage
      || (Number(formData.value.percentage_numerator) > 0
        && Number(formData.value.percentage_denominator) > 0
        && hasPercentageOf.value),
    );

    /** Live preview of the rate as a percentage, e.g. 5 ÷ 100 → "5". */
    const percentagePreview = computed(() => {
      const numerator = Number(formData.value.percentage_numerator);
      const denominator = Number(formData.value.percentage_denominator);

      if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
        return '—';
      }

      return String(parseFloat((numerator / denominator * 100).toFixed(4)));
    });

    /**
     * Live preview of the derived unit cost:
     *   (numerator ÷ denominator) × the amount entered.
     * 5 ÷ 100 × 565,488 → "28,274.40".
     */
    const percentageOfPreview = computed(() => {
      const numerator = Number(formData.value.percentage_numerator);
      const denominator = Number(formData.value.percentage_denominator);
      const amount = Number(formData.value.percentage_of_amount);

      if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0
        || !Number.isFinite(amount) || amount <= 0) {
        return '—';
      }

      return (amount * numerator / denominator).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    });

    /**
     * The parameters the percentage can be taken of — every loaded parameter
     * except the one being edited (a parameter cannot be a percentage of itself).
     */
    const percentageBaseOptions = computed(() =>
      assumptions.value
        .filter((a) => a.id !== editingId.value)
        .map((a) => ({
          value: a.id,
          label: `${a.label} — KES ${Number(a.unit_cost || 0).toLocaleString()}`,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    );

    /** "5% of KES 565,488" or "5% of Fuel for county vehicles (unit cost)". */
    const percentageSummary = (record) => {
      if (!record.is_percentage) {
        return '';
      }

      const pct = `${formatPct(record)}%`;

      if (record.percentage_of_amount !== null && record.percentage_of_amount !== undefined) {
        return `${pct} of KES ${Number(record.percentage_of_amount).toLocaleString()}`;
      }

      const against = record.percentage_base === 'actual_cost'
        ? 'actual cost'
        : 'unit cost';

      return `${pct} of ${record.percentage_base_label} (${against})`;
    };

    /** The numerator/denominator expressed as a percentage, e.g. "5" or "7.5". */
    const formatPct = (record) => {
      const numerator = Number(record.percentage_numerator);
      const denominator = Number(record.percentage_denominator);

      if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
        return '0';
      }

      return String(parseFloat((numerator / denominator * 100).toFixed(4)));
    };

    const isFormValid = computed(() => {
      return (
        formData.value.key &&
        formData.value.label &&
        formData.value.unit_definition &&
        (formData.value.is_percentage
          || (formData.value.unit_cost !== null
            && formData.value.unit_cost !== ''
            && formData.value.unit_cost >= 0)) &&
        isPercentageValid.value &&
        !keyError.value &&
        !labelError.value &&
        !unitDefinitionError.value &&
        !unitCostError.value &&
        !percentageError.value
      );
    });

    const columns = [
      { title: 'Label', dataIndex: 'label', key: 'label', ellipsis: true },
      { title: 'Key', dataIndex: 'key', key: 'key', width: 230 },
      { title: 'Unit Definition', dataIndex: 'unit_definition', key: 'unit_definition' },
      { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost', width: 180 },
      { title: 'Percentage', key: 'percentage', width: 300 },
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
            // Percentage configuration (all NULL = ordinary fixed-rate parameter).
            percentage_numerator:
              item.percentage_numerator === null || item.percentage_numerator === undefined
                ? null
                : Number(item.percentage_numerator),
            percentage_denominator:
              item.percentage_denominator === null || item.percentage_denominator === undefined
                ? null
                : Number(item.percentage_denominator),
            percentage_of_parameter_id:
              item.percentage_of_parameter_id === null || item.percentage_of_parameter_id === undefined
                ? null
                : Number(item.percentage_of_parameter_id),
            // The amount the percentage is taken of — authoritative when set.
            percentage_of_amount:
              item.percentage_of_amount === null || item.percentage_of_amount === undefined
                ? null
                : Number(item.percentage_of_amount),
            percentage_base: item.percentage_base || 'unit_cost',
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        // Resolve the base parameter's label from the list we already have, so
        // the table can read "5% of Fuel for county vehicles" with no extra call.
        const byId = new Map(rows.map((r) => [r.id, r]));

        rows.forEach((r) => {
          r.is_percentage = (r.percentage_of_parameter_id !== null || r.percentage_of_amount !== null)
            && r.percentage_numerator !== null
            && r.percentage_denominator !== null;

          r.percentage_base_label = r.percentage_of_parameter_id !== null
            ? (byId.get(r.percentage_of_parameter_id)?.label
              || `Parameter #${r.percentage_of_parameter_id}`)
            : '';
        });

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
        is_percentage: !!record.is_percentage,
        percentage_numerator: record.percentage_numerator,
        percentage_denominator: record.percentage_denominator ?? 100,
        percentage_of_parameter_id: record.percentage_of_parameter_id,
        percentage_of_amount: record.percentage_of_amount ?? null,
        percentage_base: record.percentage_base || 'unit_cost',
      };
      showModal.value = true;
    };

    const submitForm = async () => {
      // Validate all fields
      const isKeyValid = validateKey();
      const isLabelValid = validateLabel();
      const isUnitDefinitionValid = validateUnitDefinition();
      const isUnitCostValid = validateUnitCost();
      const isPercentageOk = validatePercentage();

      if (!isKeyValid || !isLabelValid || !isUnitDefinitionValid
        || !isUnitCostValid || !isPercentageOk) {
        return;
      }

      submitting.value = true;
      try {
        const payload = {
          key: formData.value.key,
          label: formData.value.label,
          unit_definition: formData.value.unit_definition,
          // For a percentage parameter the stored rate is only the fallback
          // used when the percentage cannot be resolved.
          unit_cost: Number(formData.value.unit_cost) || 0,
          is_active: formData.value.is_active,
          // A percentage parameter sends its parts together, or all NULL — the
          // API keys off the rate plus an amount or a base parameter.
          percentage_numerator: formData.value.is_percentage
            ? Number(formData.value.percentage_numerator)
            : null,
          percentage_denominator: formData.value.is_percentage
            ? Number(formData.value.percentage_denominator)
            : null,
          // The amount the percentage is taken of — authoritative when set.
          percentage_of_amount: formData.value.is_percentage
            && formData.value.percentage_of_amount !== null
            && formData.value.percentage_of_amount !== ''
            ? Number(formData.value.percentage_of_amount)
            : null,
          // Optional: take the percentage from a parameter instead. Sent as NULL
          // rather than 0 so the API's exists: rule is not tripped.
          percentage_of_parameter_id: formData.value.is_percentage
            && formData.value.percentage_of_parameter_id
            ? Number(formData.value.percentage_of_parameter_id)
            : null,
          percentage_base: formData.value.is_percentage
            ? formData.value.percentage_base
            : null,
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
          if (errors.percentage_numerator) percentageError.value = errors.percentage_numerator[0];
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
      percentageError,
      isFormValid,
      openCreateModal,
      openEditModal,
      submitForm,
      deleteParameter,
      validateKey,
      validateLabel,
      validateUnitDefinition,
      validateUnitCost,
      validatePercentage,
      // Percentage parameter UI
      percentagePreview,
      percentageOfPreview,
      percentageBaseOptions,
      percentageSummary,
    };
  },
};
</script>

<style scoped>
/* ── Percentage parameter ──────────────────────────────────────────────── */
.bp-pct-cell {
  display: inline-flex;
  align-items: center;
}
.bp-pct-text {
  font-size: 12px;
  font-weight: 600;
  color: #1f6f43;
}
.bp-pct-none {
  color: #c3c8d4;
}
.bp-pct-section {
  margin: 4px 0 18px;
  padding: 12px 14px;
  background: #fafbfc;
  border: 1px solid #eef0f5;
  border-radius: 8px;
}
.bp-pct-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 6px;
}
.bp-pct-head strong {
  font-size: 13px;
  color: #3a3f5e;
}
.bp-pct-hint {
  margin: 4px 0 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: #868eae;
}
.bp-pct-hint code {
  background: #eef1f7;
  border-radius: 4px;
  padding: 0 4px;
  font-size: 11px;
}
.bp-pct-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.bp-pct-col {
  flex: 1;
  min-width: 0;
}
.bp-pct-input {
  width: 100%;
}
.bp-pct-amount {
  width: 100%;
}
.bp-pct-preview {
  display: inline-block;
  padding: 4px 10px;
  background: #eaf5ee;
  color: #1f6f43;
  border: 1px solid #c6e6d3;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
}

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
