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
            <p class="ph-subtitle">
              Group budget parameters into categories and stages, and enable or disable each
              category for its own scope — National, County or Sub-County.
            </p>
          </div>
          <div class="ph-actions">
            <sdButton type="primary" @click="openCreateCategory">
              + Create Category
            </sdButton>
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
            <a-select v-model:value="scopeFilter" class="bp-select" allow-clear placeholder="All scopes">
              <a-select-option v-for="s in availableScopes" :key="s" :value="s">
                {{ scopeLabel(s) }}
              </a-select-option>
            </a-select>
            <a-select v-model:value="statusFilter" class="bp-select" allow-clear placeholder="All statuses">
              <a-select-option value="active">Enabled</a-select-option>
              <a-select-option value="inactive">Disabled</a-select-option>
            </a-select>
          </div>
          <div class="action-bar-right">
            <span class="result-counter">
              Showing {{ filteredCategories.length }} of {{ categories.length }}
            </span>
          </div>
        </ActionBar>

        <div class="bp-scope-note">
          <strong>Scope</strong> — a category belongs to exactly one scope (National, National
          Baringo, County or Sub-County). Disabling it removes the category and every parameter
          hanging off it from <em>that scope's</em> budgeting only; the other scopes keep
          budgeting it normally. Budgets that were already generated pick the change up the next
          time they are regenerated.
        </div>

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
                <span v-else-if="column.key === 'category_multiplier'" class="bp-multiplier-cell">
                  <span class="bp-multiplier-value">{{ multiplierSummary(record).text }}</span>
                  <span class="bp-multiplier-src">{{ multiplierSummary(record).source }}</span>
                </span>
                <a-tag
                  v-else-if="column.key === 'category_scope'"
                  :color="scopeColor(record.category_scope)"
                  class="ba-tag"
                >
                  {{ scopeLabel(record.category_scope) }}
                </a-tag>
                <span v-else-if="column.key === 'category_enabled'" class="bp-enabled-cell">
                  <a-switch
                    :checked="record.category_is_active"
                    :loading="togglingId === record.category_id"
                    size="small"
                    @change="(checked) => toggleCategoryActive(record, checked)"
                  />
                  <span
                    class="bp-enabled-text"
                    :class="{ 'is-off': !record.category_is_active }"
                  >
                    {{
                      record.category_is_active
                        ? `Included in ${scopeLabel(record.category_scope)}`
                        : `Excluded from ${scopeLabel(record.category_scope)}`
                    }}
                  </span>
                </span>
                <span v-else-if="column.key === 'category_actions'" class="bp-row-actions">
                  <a-button
                    type="text"
                    size="small"
                    class="bp-edit-btn"
                    title="Edit category"
                    @click="openEditCategory(record)"
                  >
                    <template #icon>
                      <EditOutlined />
                    </template>
                  </a-button>
                </span>
                <span v-else>{{ text }}</span>
              </template>
            </a-table>
          </TableWrapper>
        </sdCards>
      </BudgetPageWrapper>
    </Main>

    <!-- Create / Edit Budget Category Modal -->
    <a-modal
      v-model:visible="categoryModalVisible"
      :title="categoryModalTitle"
      width="720px"
      :ok-text="categoryModalOkText"
      :confirm-loading="savingCategory"
      :ok-button-props="{ disabled: !canSubmitCategory }"
      :closable="!savingCategory"
      :mask-closable="!savingCategory"
      @ok="submitCategory"
      @cancel="closeCategoryModal"
    >
      <a-form layout="vertical" :model="categoryForm" class="bp-create-form">
        <div v-if="editingCategoryId" class="bp-edit-banner">
          Editing <strong>{{ editingCategoryName }}</strong>. Changes apply to
          <strong>{{ scopeLabel(categoryForm.scope) }}</strong> budgeting — the other
          scopes are unaffected. Budgets that were already generated pick the change
          up the next time they are regenerated.
        </div>

        <a-form-item label="Category name" required>
          <a-input
            v-model:value="categoryForm.name"
            placeholder="e.g. Post-campaign review meeting"
            :maxlength="255"
          />
          <p class="bp-form-hint">
            Names are unique per stage + scope — the same name may exist once for
            County and once for Sub-County.
          </p>
        </a-form-item>

        <a-form-item label="Scope" required>
          <a-select v-model:value="categoryForm.scope" class="bp-form-control">
            <a-select-option value="national">National</a-select-option>
            <a-select-option value="national_baringo">National (Baringo)</a-select-option>
            <a-select-option value="county">County</a-select-option>
            <a-select-option value="sub_county">Sub-County</a-select-option>
          </a-select>
          <p class="bp-form-hint">
            The category belongs to this scope only. Enable / disable it later from
            the table without affecting the other scopes.
          </p>
        </a-form-item>

        <div class="bp-form-row">
          <a-form-item label="Type" required class="bp-form-col">
            <a-select v-model:value="categoryForm.type" class="bp-form-control">
              <a-select-option value="event">Event</a-select-option>
              <a-select-option value="activity">Activity</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Stage" required class="bp-form-col">
            <a-select v-model:value="categoryForm.stage" class="bp-form-control">
              <a-select-option value="1">Stage 1 — Pre-campaign</a-select-option>
              <a-select-option value="2">Stage 2 — Campaign</a-select-option>
              <a-select-option value="3">Stage 3 — Post-campaign</a-select-option>
            </a-select>
          </a-form-item>
        </div>

        <div class="bp-form-row">
          <a-form-item label="Default days" class="bp-form-col">
            <a-input-number
              v-model:value="categoryForm.default_days"
              :min="1"
              :precision="0"
              class="bp-form-control"
            />
            <p class="bp-form-hint">Pre-fills the grid; editable per line.</p>
          </a-form-item>
          <a-form-item label="Sort order" class="bp-form-col">
            <a-input-number
              v-model:value="categoryForm.sort_order"
              :min="0"
              :precision="0"
              class="bp-form-control"
            />
            <p class="bp-form-hint">Lower numbers appear first within the stage.</p>
          </a-form-item>
        </div>

        <div class="bp-form-section">
          <h5 class="bp-form-section-title">Multiplier</h5>
          <p class="bp-form-hint">
            Multiplies every parameter total under this category —
            <code>unit cost × days × units × multiplier</code>. A value of
            <strong>1</strong> means no multiplier.
          </p>

          <div class="bp-form-row">
            <a-form-item label="Multiplier value" class="bp-form-col">
              <a-input-number
                v-model:value="categoryForm.multiplier_value"
                :min="1"
                :precision="0"
                class="bp-form-control"
                placeholder="1 = none"
              />
              <p class="bp-form-hint">
                Set this for <strong>National</strong> categories — the national
                profile has no multiplier columns, so a profile column can never
                produce a value there.
              </p>
            </a-form-item>
            <a-form-item label="Multiplier label" class="bp-form-col">
              <a-input
                v-model:value="categoryForm.profile_field_label"
                placeholder="e.g. Officers, Sub-counties"
                :maxlength="100"
              />
              <p class="bp-form-hint">
                Shown next to the × in the budgeting grids.
              </p>
            </a-form-item>
          </div>

          <a-form-item label="Or use a county-profile column (county / sub-county scopes)">
            <a-select
              v-model:value="categoryForm.budget_multiplier"
              class="bp-form-control"
              allow-clear
              show-search
              option-filter-prop="label"
              placeholder="No profile column"
              :options="multiplierColumnOptions"
            />
            <p class="bp-form-hint">
              Read live from the county profile at generation time (e.g.
              <em>Sub-counties</em>). Ignored whenever a multiplier value is set
              above.
            </p>
          </a-form-item>
        </div>

        <a-form-item label="Description">
          <a-textarea
            v-model:value="categoryForm.description"
            :rows="2"
            placeholder="What this category covers"
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="categoryForm.allows_special_costs">
            Applies Special Area Cost
          </a-checkbox>
          <p class="bp-form-hint">
            Only meaningful for units mapped as Special Area Cost areas — the
            category then also appears in their separate Special Area Cost budget.
          </p>
        </a-form-item>

        <a-form-item style="margin-bottom: 0;">
          <a-checkbox v-model:checked="categoryForm.is_active">
            Enabled for its scope
          </a-checkbox>
          <p class="bp-form-hint">
            Leave checked to make the category available for budgeting straight
            away. You can also link its parameters after saving.
          </p>
        </a-form-item>
      </a-form>
    </a-modal>

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

    <!-- Remove Parameter From Category Modal -->
    <!--
      A parameter that is already budgeted cannot simply be unlinked: the budgets
      that generated it would keep rows pointing at a category ↔ parameter
      mapping that no longer exists. So removal is a two-step operation —

        1. the line items this parameter generated are deleted from the budgets
           the administrator ticks here, and those budgets' totals are re-synced;
        2. the mapping itself is deleted.

      The impact list below (get_category_parameter_impact) is what makes step 1
      possible: it shows every budget that has budgeted for this parameter, with
      the amount at stake, so nothing is removed blind.
    -->
    <a-modal
      v-model:visible="deleteModalVisible"
      title="Remove Parameter From Category"
      width="720px"
      ok-text="Remove Parameter"
      cancel-text="Cancel"
      :ok-button-props="{ danger: true, disabled: impactLoading || !!impactError }"
      :confirm-loading="!!deletingId"
      :closable="!deletingId"
      :mask-closable="!deletingId"
      @ok="confirmDeleteCategoryParameter"
      @cancel="closeDeleteModal"
    >
      <div v-if="deleteTarget.parameter" class="bp-impact-head">
        <div class="bp-impact-head-main">
          <strong>
            {{ deleteTarget.parameter.parameter_label || deleteTarget.parameter.parameter_key }}
          </strong>
          <a-tag class="bp-key-tag">{{ deleteTarget.parameter.parameter_key }}</a-tag>
        </div>
        <div v-if="deleteTarget.category" class="bp-impact-head-sub">
          <span>
            From category <strong>{{ deleteTarget.category.category_name }}</strong>
          </span>
          <a-tag
            v-if="deleteTarget.category.category_scope"
            :color="scopeColor(deleteTarget.category.category_scope)"
            class="ba-tag"
          >
            {{ scopeLabel(deleteTarget.category.category_scope) }}
          </a-tag>
        </div>
      </div>

      <div v-if="impactLoading" class="bp-impact-loading">
        <a-spin size="small" />
        <span>Checking which budgets have budgeted for this parameter...</span>
      </div>

      <a-alert
        v-else-if="impactError"
        type="error"
        show-icon
        :message="impactError"
      />

      <a-alert
        v-else-if="!impactBudgets.length"
        type="info"
        show-icon
        message="No budget has budgeted for this parameter yet."
        description="Removing it only unlinks it from the category — there is nothing to clean up."
      />

      <template v-else>
        <a-alert
          type="warning"
          show-icon
          class="bp-impact-alert"
          :message="`${impactBudgets.length} budget(s) have budgeted for this parameter`"
          :description="`Totalling KES ${money(impact.total_amount)}. Tick the budgets to remove it from — their line items for this parameter are deleted and their totals re-synced — then it is unlinked from the category.`"
        />

        <div class="bp-impact-toolbar">
          <a-checkbox
            :checked="allRemovableSelected"
            :indeterminate="someRemovableSelected"
            :disabled="!removableBudgetIds.length"
            @change="toggleAllBudgets"
          >
            Select all removable budgets
          </a-checkbox>
          <span class="bp-impact-count">
            {{ selectedBudgetIds.length }} of {{ removableBudgetIds.length }} selected
          </span>
        </div>

        <a-checkbox-group v-model:value="selectedBudgetIds" class="bp-impact-list">
          <div
            v-for="b in impactBudgets"
            :key="b.campaign_budget_id"
            class="bp-impact-row"
            :class="{ 'is-locked': b.locked }"
          >
            <a-checkbox :value="b.campaign_budget_id" :disabled="b.locked" />
            <span class="bp-impact-name">
              {{ b.name }}
              <a-tag v-if="b.level" class="bp-key-tag">{{ scopeLabel(b.level) }}</a-tag>
            </span>
            <a-tag :color="budgetStatusColor(b.status)" class="ba-tag">
              {{ formatLabel(b.status) }}
            </a-tag>
            <span class="bp-impact-lines">{{ b.line_count }} line(s)</span>
            <strong class="bp-money">KES {{ money(b.total) }}</strong>
            <a-tag v-if="b.locked" color="default" class="bp-key-tag">Locked</a-tag>
          </div>
        </a-checkbox-group>

        <p v-if="impact.locked_budgets" class="bp-form-hint">
          Approved / voided budgets are listed for reference but never rewritten —
          they are historical records, so their rows stay.
        </p>

        <p v-if="!selectedBudgetIds.length" class="bp-form-hint is-warn">
          No budget ticked — the parameter is only unlinked. Its line items stay in
          the budgets above.
        </p>
      </template>
    </a-modal>
  </RecordViewWrapper>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { notification } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import axios from '@/Axiosconfig';
import { Main, TableWrapper } from '../../styled';
import { RecordViewWrapper, ActionBar, BudgetPageWrapper } from './style';

export default {
  name: 'BudgetCategories',
  components: { Main, TableWrapper, RecordViewWrapper, ActionBar, BudgetPageWrapper, DeleteOutlined, EditOutlined },
  setup() {
    const searchText = ref('');
    const typeFilter = ref(null);
    const stageFilter = ref(null);
    // Scope (national | national_baringo | county | sub_county) and the enabled
    // state are properties of the category ROW, so these two filters only shape
    // the admin listing below.
    const scopeFilter = ref(null);
    const statusFilter = ref(null);
    const loading = ref(false);
    const categories = ref([]);
    const expandedRowKeys = ref([]);
    // budget_categories.id currently being switched on / off.
    const togglingId = ref(null);

    // ── Create / edit-category modal ──────────────────────────────────────
    // Defaults mirror the API's most common shape: a Sub-County activity in
    // Stage 1, enabled, one day.
    const blankCategoryForm = () => ({
      name: '',
      description: '',
      type: 'activity',
      stage: '1',
      scope: 'sub_county',
      default_days: 1,
      sort_order: 0,
      allows_special_costs: false,
      is_active: true,
      // Multiplier. `multiplier_value` wins over `budget_multiplier`.
      multiplier_value: null,
      budget_multiplier: null,
      profile_field_label: '',
    });

    const categoryModalVisible = ref(false);
    const savingCategory = ref(false);
    const categoryForm = ref(blankCategoryForm());
    // budget_categories.id being edited — null while creating.
    const editingCategoryId = ref(null);
    const editingCategoryName = ref('');

    const categoryModalTitle = computed(() =>
      editingCategoryId.value ? 'Edit Budget Category' : 'Create Budget Category',
    );
    const categoryModalOkText = computed(() =>
      editingCategoryId.value ? 'Save Changes' : 'Create Category',
    );

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
      { title: 'Scope', key: 'category_scope', width: 150 },
      { title: 'Type', dataIndex: 'category_type', key: 'category_type', width: 130 },
      { title: 'Stage', dataIndex: 'category_stage', key: 'category_stage', width: 100 },
      { title: 'Multiplier', key: 'category_multiplier', width: 170 },
      { title: 'Parameters', key: 'param_count', width: 110 },
      { title: 'Total Unit Cost', key: 'total_cost', width: 150 },
      { title: 'Enabled for scope', key: 'category_enabled', width: 220 },
      { title: '', key: 'category_actions', width: 80, align: 'center' },
    ];

    const parameterColumns = [
      { title: 'Label', dataIndex: 'parameter_label', key: 'parameter_label', ellipsis: true },
      { title: 'Key', dataIndex: 'parameter_key', key: 'parameter_key', width: 240 },
      { title: 'Unit Definition', dataIndex: 'unit_definition', key: 'unit_definition' },
      { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost', width: 160 },
      { title: '', key: 'actions', width: 60, align: 'center' },
    ];

    // ── Remove-parameter modal (impact list + two-step delink) ────────────
    // Removing a parameter from a category has to clear the line items it has
    // already generated, otherwise those budgets keep rows pointing at a
    // category ↔ parameter mapping that no longer exists. The impact endpoint
    // lists the budgets that have budgeted for it; the administrator then ticks
    // which ones to clear before the mapping itself is deleted.
    const deletingId = ref(null);
    const deleteModalVisible = ref(false);
    const deleteTarget = ref({ category: null, parameter: null });
    const impactLoading = ref(false);
    const impactError = ref('');
    // get_category_parameter_impact payload: { budgets, total_amount, locked_budgets }
    const impact = ref({ budgets: [], total_amount: 0, locked_budgets: 0 });
    const selectedBudgetIds = ref([]);

    const impactBudgets = computed(() => impact.value.budgets || []);

    // Approved / voided budgets are reported but can never be rewritten, so they
    // are excluded from "select all" and their checkboxes stay disabled.
    const removableBudgetIds = computed(() =>
      impactBudgets.value.filter(b => !b.locked).map(b => b.campaign_budget_id),
    );

    const allRemovableSelected = computed(() =>
      removableBudgetIds.value.length > 0
      && removableBudgetIds.value.every(id => selectedBudgetIds.value.includes(id)),
    );

    const someRemovableSelected = computed(() =>
      selectedBudgetIds.value.length > 0 && !allRemovableSelected.value,
    );

    const toggleAllBudgets = (e) => {
      selectedBudgetIds.value = e.target.checked ? [...removableBudgetIds.value] : [];
    };

    const openDeleteModal = async (categoryRecord, parameter) => {
      deleteTarget.value = { category: categoryRecord, parameter };
      deleteModalVisible.value = true;

      impact.value = { budgets: [], total_amount: 0, locked_budgets: 0 };
      selectedBudgetIds.value = [];
      impactError.value = '';

      if (!parameter || !parameter.id) return;

      impactLoading.value = true;
      try {
        const { data } = await axios.get(`get_category_parameter_impact/${parameter.id}`);
        impact.value = data || {};
        // Every removable budget starts ticked: clearing the parameter everywhere
        // is the common case, and unticking one is a single click.
        selectedBudgetIds.value = [...removableBudgetIds.value];
      } catch (error) {
        impactError.value = error?.response?.data?.message
          || 'Unable to check which budgets use this parameter.';
      } finally {
        impactLoading.value = false;
      }
    };

    const closeDeleteModal = () => {
      if (deletingId.value) return;
      deleteModalVisible.value = false;
      deleteTarget.value = { category: null, parameter: null };
      impact.value = { budgets: [], total_amount: 0, locked_budgets: 0 };
      selectedBudgetIds.value = [];
      impactError.value = '';
    };

    /**
     * Two-step removal: the backend deletes the selected budgets' line items for
     * this parameter FIRST, then deletes the mapping itself — so no budget is
     * left holding rows whose mapping has gone.
     */
    const confirmDeleteCategoryParameter = async () => {
      const { category, parameter } = deleteTarget.value;
      if (!parameter || !parameter.id) return;

      deletingId.value = parameter.id;
      try {
        const { data } = await axios.post(`delink_category_parameter/${parameter.id}`, {
          budget_ids: selectedBudgetIds.value,
        });

        // Unlink locally so the table updates without a refetch.
        const idx = category.parameters.findIndex(p => p.id === parameter.id);
        if (idx !== -1) {
          category.parameters.splice(idx, 1);
          category.total_cost = category.parameters
            .reduce((sum, p) => sum + Number(p.unit_cost || 0), 0);
        }

        notification.success({
          message: 'Parameter removed',
          description: data?.message
            || `"${parameter.parameter_label || parameter.parameter_key}" was removed from the category.`,
        });

        // Close only on success: a failure keeps the dialog (and the tick list)
        // on screen so the removal can be retried as-is.
        deleteModalVisible.value = false;
        deleteTarget.value = { category: null, parameter: null };
        impact.value = { budgets: [], total_amount: 0, locked_budgets: 0 };
        selectedBudgetIds.value = [];
        impactError.value = '';
      } catch (error) {
        notification.error({
          message: 'Unable to remove parameter',
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

    const money = (value) => Number(value || 0).toLocaleString();

    // campaign_budgets.status → antd tag colour, so the impact list reads the
    // same way as the status badges on the budgeting pages.
    const BUDGET_STATUS_COLORS = {
      draft: 'default',
      submitted: 'blue',
      county_approved: 'cyan',
      dnmp_reviewed: 'purple',
      national_approved: 'geekblue',
      approved: 'green',
      voided: 'red',
    };
    const budgetStatusColor = (status) => BUDGET_STATUS_COLORS[status] || 'default';

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

    /**
     * Human label for a budget_categories.scope value — mirrors the column's
     * enum: national | national_baringo | county | sub_county.
     */
    const SCOPE_LABELS = {
      national: 'National',
      national_baringo: 'National (Baringo)',
      county: 'County',
      sub_county: 'Sub-County',
    };
    const scopeLabel = (scope) => SCOPE_LABELS[scope] || '—';

    const scopeColorMap = {
      national: 'blue',
      national_baringo: 'geekblue',
      county: 'purple',
      sub_county: 'green',
    };
    const scopeColor = (scope) => scopeColorMap[scope] || 'default';

    const normalizePayload = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.data)) return payload.data;
      if (Array.isArray(payload?.message)) return payload.message;
      return [];
    };

    /**
     * Builds the row set the table renders.
     *
     * Categories come from `get_budget_categories?admin=1` — EVERY category,
     * every scope, active AND inactive — so the scope column and the
     * enable/disable switch work even for a category that has no parameters
     * mapped to it yet. The parameter rows come from `get_category_parameters`
     * and are merged in by category_id. The backend order (scope → stage →
     * sort_order) is preserved so the National / County / Sub-County groups
     * read together.
     */
    const mergeCategories = (categoryRows, mappingRows) => {
      const parametersByCategory = new Map();

      mappingRows.forEach((row) => {
        const cid = row.category_id;
        if (!parametersByCategory.has(cid)) parametersByCategory.set(cid, []);
        parametersByCategory.get(cid).push({
          id: row.id,
          parameter_id: row.parameter_id,
          parameter_key: row.parameter_key || '',
          parameter_label: row.parameter_label || '',
          unit_definition: row.unit_definition || '',
          unit_cost: Number(row.unit_cost || 0),
        });
      });

      return categoryRows.map((c) => {
        const parameters = parametersByCategory.get(c.id) || [];
        return {
          category_id: c.id,
          category_name: c.name || '',
          category_type: c.type || '',
          category_stage: c.stage || '',
          // Scope + enabled state — drive the Scope column and the switch.
          category_scope: c.scope || '',
          category_is_active: Boolean(c.is_active),
          // Remaining editable fields, carried so the Edit modal can pre-fill.
          category_description: c.description || '',
          category_default_days: Number(c.default_days || 1),
          category_sort_order: Number(c.sort_order || 0),
          category_allows_special_costs: Boolean(c.allows_special_costs),
          // Multiplier configuration — resolved by BudgetCategory::multiplierContext():
          // an explicit value wins, otherwise the named county_profiles column.
          category_multiplier_value:
            c.multiplier_value === null || c.multiplier_value === undefined
              ? null
              : Number(c.multiplier_value),
          category_budget_multiplier: c.budget_multiplier || '',
          category_profile_field_label: c.profile_field_label || '',
          parameters,
          total_cost: parameters.reduce((sum, p) => sum + Number(p.unit_cost || 0), 0),
        };
      });
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

    const availableScopes = computed(() => {
      const set = new Set();
      categories.value.forEach(c => c.category_scope && set.add(c.category_scope));
      return Array.from(set).sort();
    });

    /**
     * county_profiles columns already used as a multiplier by some category,
     * labelled with the human name that category carries. Derived from the
     * loaded rows so no extra endpoint is needed — it is exactly the set an
     * administrator can meaningfully pick from.
     */
    const multiplierColumnOptions = computed(() => {
      const byColumn = new Map();

      categories.value.forEach((c) => {
        if (!c.category_budget_multiplier) return;
        if (!byColumn.has(c.category_budget_multiplier)) {
          byColumn.set(
            c.category_budget_multiplier,
            c.category_profile_field_label || c.category_budget_multiplier,
          );
        }
      });

      // Keep the value being edited selectable even if no row uses it any more.
      const current = categoryForm.value.budget_multiplier;
      if (current && !byColumn.has(current)) {
        byColumn.set(current, current);
      }

      return [...byColumn.entries()]
        .map(([value, label]) => ({ value, label: `${label} (${value})` }))
        .sort((a, b) => a.label.localeCompare(b.label));
    });

    /**
     * How this category's multiplier is CONFIGURED — the config, not a
     * profile-resolved value (the admin listing has no profile to resolve
     * against). Mirrors BudgetCategory::multiplierContext(): an explicit
     * multiplier_value wins over the profile column.
     */
    const multiplierSummary = (record) => {
      if (record.category_multiplier_value) {
        return {
          text: record.category_profile_field_label
            ? `× ${record.category_multiplier_value} ${record.category_profile_field_label}`
            : `× ${record.category_multiplier_value}`,
          source: 'Fixed value',
        };
      }

      if (record.category_budget_multiplier) {
        return {
          text: record.category_profile_field_label || record.category_budget_multiplier,
          source: 'Profile column',
        };
      }

      return { text: '—', source: 'None' };
    };

    const filteredCategories = computed(() =>
      categories.value.filter(c => {
        const needle = searchText.value.trim().toLowerCase();
        const matchSearch = !needle ||
          (c.category_name || '').toLowerCase().includes(needle) ||
          (c.category_type || '').toLowerCase().includes(needle) ||
          scopeLabel(c.category_scope).toLowerCase().includes(needle) ||
          c.parameters.some(p =>
            (p.parameter_label || '').toLowerCase().includes(needle) ||
            (p.parameter_key || '').toLowerCase().includes(needle),
          );
        const matchType = !typeFilter.value || c.category_type === typeFilter.value;
        const matchStage = !stageFilter.value || c.category_stage === stageFilter.value;
        const matchScope = !scopeFilter.value || c.category_scope === scopeFilter.value;
        const matchStatus = !statusFilter.value ||
          (statusFilter.value === 'active' && c.category_is_active) ||
          (statusFilter.value === 'inactive' && !c.category_is_active);
        return matchSearch && matchType && matchStage && matchScope && matchStatus;
      }),
    );

    const fetchData = async () => {
      loading.value = true;
      try {
        // Two reads:
        //   1. get_budget_categories?admin=1 — EVERY category, every scope,
        //      active and inactive, so the scope column and the switch are
        //      available for each one (including parameter-less categories).
        //   2. get_category_parameters — the category → parameter mappings that
        //      fill the expanded panel.
        const [categoriesResponse, mappingsResponse] = await Promise.all([
          axios.get('get_budget_categories', { params: { admin: 1 } }),
          axios.get('get_category_parameters'),
        ]);

        const categoryRows = normalizePayload(categoriesResponse?.data);
        const mappingRows = normalizePayload(mappingsResponse?.data);

        categories.value = mergeCategories(categoryRows, mappingRows);
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

    /**
     * Enable / disable a category FOR ITS OWN SCOPE.
     *
     * Scope is a property of the category row, so `is_active` is exactly
     * "enabled for <scope>". Turning a National row off excludes that category
     * — and every parameter hanging off it — from the national budget only; the
     * county / sub-county rows are separate records and stay untouched.
     *
     * The switch is `:checked`-bound rather than v-model, so a failed request
     * leaves it showing the stored value.
     */
    const toggleCategoryActive = async (record, checked) => {
      const next = !!checked;
      togglingId.value = record.category_id;
      try {
        const { data } = await axios.put(`update_budget_category/${record.category_id}`, {
          is_active: next,
        });
        record.category_is_active = next;

        // The backend clears the category's already-generated lines from the
        // budgets still in flight, so the grid reflects the switch at once.
        const removed = Number(data?.line_items_removed || 0);

        notification.success({
          message: next ? 'Category enabled' : 'Category disabled',
          description: next
            ? `"${record.category_name}" is available to ${scopeLabel(record.category_scope)} budgeting again.`
            : `"${record.category_name}" and its ${record.parameters.length} parameter(s) are now excluded from ${scopeLabel(record.category_scope)} budgeting.${
                removed
                  ? ` ${removed} already-generated line(s) were removed from budgets still in flight.`
                  : ''
              } Other scopes are unaffected.`,
        });
      } catch (error) {
        notification.error({
          message: 'Unable to update the category',
          description: error?.response?.data?.message || 'Please try again.',
        });
      } finally {
        togglingId.value = null;
      }
    };

    // ── Create / edit a budget category ───────────────────────────────────

    const canSubmitCategory = computed(() =>
      !!String(categoryForm.value.name || '').trim()
      && !!categoryForm.value.type
      && !!categoryForm.value.stage
      && !!categoryForm.value.scope,
    );

    const openCreateCategory = () => {
      editingCategoryId.value = null;
      editingCategoryName.value = '';
      categoryForm.value = blankCategoryForm();
      categoryModalVisible.value = true;
    };

    /** Pre-fill the modal from a table row so the category can be edited. */
    const openEditCategory = (record) => {
      editingCategoryId.value = record.category_id;
      editingCategoryName.value = record.category_name || '';
      categoryForm.value = {
        name: record.category_name || '',
        description: record.category_description || '',
        type: record.category_type || 'activity',
        stage: String(record.category_stage || '1'),
        scope: record.category_scope || 'sub_county',
        default_days: Number(record.category_default_days) || 1,
        sort_order: Number(record.category_sort_order) || 0,
        allows_special_costs: !!record.category_allows_special_costs,
        is_active: !!record.category_is_active,
        multiplier_value:
          record.category_multiplier_value === null
          || record.category_multiplier_value === undefined
            ? null
            : Number(record.category_multiplier_value),
        budget_multiplier: record.category_budget_multiplier || null,
        profile_field_label: record.category_profile_field_label || '',
      };
      categoryModalVisible.value = true;
    };

    const closeCategoryModal = () => {
      if (savingCategory.value) return;
      categoryModalVisible.value = false;
    };

    /**
     * POST create_budget_category, or PUT update_budget_category/{id} when the
     * modal was opened from a row's Edit action.
     *
     * The name is unique per (stage, scope), so the same category name may exist
     * once for County and once for Sub-County — the backend reports a clash as a
     * 422 with an `errors.name` entry.
     *
     * Switching a category OFF here goes through the same backend path as the
     * table switch, so its already-generated lines are removed from the budgets
     * still in flight (the response's `line_items_removed`).
     */
    const submitCategory = async () => {
      if (!canSubmitCategory.value) return;
      savingCategory.value = true;

      const isEdit = !!editingCategoryId.value;
      const categoryId = editingCategoryId.value;

      try {
        const payload = {
          name: String(categoryForm.value.name || '').trim(),
          description: categoryForm.value.description || null,
          type: categoryForm.value.type,
          stage: String(categoryForm.value.stage),
          scope: categoryForm.value.scope,
          default_days: Number(categoryForm.value.default_days) || 1,
          sort_order: Number(categoryForm.value.sort_order) || 0,
          allows_special_costs: !!categoryForm.value.allows_special_costs,
          is_active: !!categoryForm.value.is_active,
          // Multiplier: an explicit value wins over the profile column. The
          // backend validates the column name against county_profiles and
          // rejects an unknown one with a 422.
          multiplier_value:
            categoryForm.value.multiplier_value === null
            || categoryForm.value.multiplier_value === ''
              ? null
              : Number(categoryForm.value.multiplier_value),
          budget_multiplier: categoryForm.value.budget_multiplier || null,
          profile_field_label: categoryForm.value.profile_field_label || null,
        };

        const { data } = isEdit
          ? await axios.put(`update_budget_category/${categoryId}`, payload)
          : await axios.post('create_budget_category', payload);

        const saved = data?.category || data || {};
        const removed = Number(data?.line_items_removed || 0);

        notification.success({
          message: isEdit ? 'Budget category updated' : 'Budget category created',
          description: isEdit
            ? `"${payload.name}" saved for ${scopeLabel(payload.scope)}.${
                !payload.is_active
                  ? ` It is now excluded from ${scopeLabel(payload.scope)} budgeting${
                      removed
                        ? ` and ${removed} already-generated line(s) were removed from budgets still in flight`
                        : ''
                    }.`
                  : ''
              }`
            : `"${payload.name}" was created for ${scopeLabel(payload.scope)}${
                payload.is_active ? '' : ' (disabled)'
              }. Link its parameters next.`,
        });

        categoryModalVisible.value = false;
        editingCategoryId.value = null;
        editingCategoryName.value = '';
        await fetchData();

        // Keep the saved row open so linking parameters stays the obvious step.
        const savedId = isEdit ? categoryId : saved.id;
        if (savedId) {
          expandedRowKeys.value = [savedId];
        }
      } catch (error) {
        const body = error?.response?.data;
        const fieldErrors = body?.errors
          ? Object.values(body.errors).flat().join(' ')
          : null;

        notification.error({
          message: isEdit
            ? 'Unable to update the category'
            : 'Unable to create the category',
          description:
            fieldErrors || body?.message || 'Please check the form and try again.',
        });
      } finally {
        savingCategory.value = false;
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
      scopeFilter,
      statusFilter,
      loading,
      categories,
      filteredCategories,
      availableTypes,
      availableStages,
      availableScopes,
      columns,
      parameterColumns,
      expandedRowKeys,
      togglingId,
      fetchData,
      onExpand,
      formatLabel,
      typeColor,
      scopeLabel,
      scopeColor,
      multiplierSummary,
      multiplierColumnOptions,
      toggleCategoryActive,
      // create / edit-category modal
      categoryModalVisible,
      savingCategory,
      categoryForm,
      editingCategoryId,
      editingCategoryName,
      categoryModalTitle,
      categoryModalOkText,
      canSubmitCategory,
      openCreateCategory,
      openEditCategory,
      closeCategoryModal,
      submitCategory,
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
      deleteModalVisible,
      deleteTarget,
      openDeleteModal,
      closeDeleteModal,
      confirmDeleteCategoryParameter,
      // remove-parameter impact list
      impactLoading,
      impactError,
      impact,
      impactBudgets,
      selectedBudgetIds,
      removableBudgetIds,
      allRemovableSelected,
      someRemovableSelected,
      toggleAllBudgets,
      budgetStatusColor,
      money,
    };
  },
};
</script>

<style scoped>
.bp-scope-note {
  margin: 0 0 12px;
  padding: 10px 14px;
  background: #f6f8ff;
  border: 1px solid #e6ebfb;
  border-radius: 8px;
  color: #5a5f7d;
  font-size: 12.5px;
  line-height: 1.5;
}
.bp-scope-note strong {
  color: #3a3f5e;
}
.bp-enabled-cell {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.bp-enabled-text {
  font-size: 12px;
  font-weight: 600;
  color: #389e0d;
}
.bp-enabled-text.is-off {
  color: #d4380d;
}

/* Create-category modal */
.bp-create-form .bp-form-row {
  display: flex;
  gap: 16px;
}
.bp-create-form .bp-form-col {
  flex: 1;
  min-width: 0;
}
.bp-create-form .bp-form-control {
  width: 100%;
}
.bp-form-hint {
  margin: 4px 0 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: #868eae;
}
.bp-form-hint.is-warn {
  color: #d46b08;
}

/* Remove-parameter modal — header + "which budgets use this" impact list */
.bp-impact-head {
  padding: 10px 12px;
  margin-bottom: 12px;
  background: #f7f9fa;
  border: 1px solid #eef0f2;
  border-radius: 6px;
}
.bp-impact-head-main {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1f2437;
}
.bp-impact-head-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
  color: #7a8a82;
}
.bp-impact-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 0;
  font-size: 13px;
  color: #7a8a82;
}
.bp-impact-alert {
  margin-bottom: 12px;
}
.bp-impact-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 8px;
  border-bottom: 1px solid #f0f0f0;
}
.bp-impact-count {
  font-size: 12px;
  color: #8a93a8;
}
.bp-impact-list {
  display: block;
  width: 100%;
  max-height: 260px;
  overflow-y: auto;
  margin-top: 8px;
}
.bp-impact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13px;
}
.bp-impact-row + .bp-impact-row {
  border-top: 1px solid #f5f6f8;
}
.bp-impact-row:hover {
  background: #fafbfc;
}
/* An approved / voided budget: reported for context, never rewritten. */
.bp-impact-row.is-locked {
  background: #fafafa;
  color: #8a93a8;
}
.bp-impact-name {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  font-weight: 600;
  color: #1f2437;
}
.bp-impact-row.is-locked .bp-impact-name {
  color: #8a93a8;
}
.bp-impact-lines {
  font-size: 12px;
  color: #8a93a8;
  white-space: nowrap;
}

/* Edit-category affordance + modal banner */
.bp-row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.bp-edit-btn {
  color: #5a5f7d;
}
.bp-edit-btn:hover {
  color: #1677ff;
  background: #f0f5ff;
}
.bp-edit-banner {
  margin: 0 0 14px;
  padding: 9px 12px;
  background: #f6f8ff;
  border: 1px solid #e6ebfb;
  border-radius: 6px;
  color: #5a5f7d;
  font-size: 12.5px;
  line-height: 1.5;
}
.bp-edit-banner strong {
  color: #3a3f5e;
}

/* Multiplier fieldset in the modal + column in the table */
.bp-form-section {
  margin: 0 0 16px;
  padding: 12px 14px;
  background: #fafbfc;
  border: 1px solid #eef0f5;
  border-radius: 8px;
}
.bp-form-section-title {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 700;
  color: #3a3f5e;
}
.bp-form-section .bp-form-hint code {
  background: #eef1f7;
  border-radius: 4px;
  padding: 0 4px;
  font-size: 11px;
}
.bp-multiplier-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.bp-multiplier-value {
  font-weight: 600;
  color: #3a3f5e;
}
.bp-multiplier-src {
  font-size: 11px;
  color: #8a93a8;
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
