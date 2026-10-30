<template>
  <MePageWrapper>
    <Main>
      <MePageHeader
        icon="check-square"
        title="M&E Checklists"
        subtitle="Configure supervision checklists for the active campaign, link them to a stage and decide the levels they apply to."
      >
        <template #actions>
          <button class="me-btn" :disabled="loading" @click="refresh">
            <sdFeatherIcons type="refresh-cw" size="13" /><span>Refresh</span>
          </button>
          <button
            v-if="canManageChecklists"
            class="me-btn is-primary"
            @click="openCreateChecklist"
          >
            <sdFeatherIcons type="plus" size="13" /><span>New Checklist</span>
          </button>
        </template>
      </MePageHeader>

      <div class="me-toolbar">
        <a-input
          v-model:value="filters.search"
          allow-clear
          placeholder="Search checklist by name…"
          class="me-search"
        >
          <template #prefix>
            <sdFeatherIcons type="search" size="14" />
          </template>
        </a-input>
        <a-select
          v-model:value="filters.stage_id"
          allow-clear
          placeholder="All stages"
          class="me-filter"
          @change="loadChecklists"
        >
          <a-select-option v-for="stage in stages" :key="stage.id" :value="stage.id">
            {{ stage.name }}
          </a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.use_case"
          allow-clear
          placeholder="All use cases"
          class="me-filter"
          @change="loadChecklists"
        >
          <a-select-option v-for="item in useCases" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.is_active"
          allow-clear
          placeholder="All statuses"
          class="me-filter"
          @change="loadChecklists"
        >
          <a-select-option :value="true">Active</a-select-option>
          <a-select-option :value="false">Inactive</a-select-option>
        </a-select>
        <span v-if="!loading" class="me-result-count">
          {{ filteredChecklists.length }} of {{ checklists.length }} shown
        </span>
      </div>

      <a-spin :spinning="loading" tip="Loading checklists…">
        <div v-if="!loading && !filteredChecklists.length" class="me-empty">
          <h3>No checklists yet</h3>
          <p>Create a checklist and link it to a stage of this campaign.</p>
          <button
            v-if="canManageChecklists"
            class="me-btn is-primary"
            @click="openCreateChecklist"
          >
            Create Checklist
          </button>
        </div>

        <a-table
          v-else
          :data-source="filteredChecklists"
          :columns="columns"
          :pagination="false"
          row-key="id"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <strong>{{ record.name }}</strong>
              <div v-if="record.description" class="me-muted">{{ record.description }}</div>
            </template>
            <template v-else-if="column.key === 'stage'">
              {{ record.stage ? record.stage.name : '—' }}
            </template>
            <template v-else-if="column.key === 'use_case'">
              {{ useCaseLabel(record.use_case) }}
            </template>
            <template v-else-if="column.key === 'levels'">
              <div class="me-tag-row">
                <a-tag v-for="level in ME_LEVELS" v-show="record[level.key]" :key="level.key">
                  {{ level.label }}
                </a-tag>
              </div>
            </template>
            <template v-else-if="column.key === 'templates'">
              {{ record.activityLists ? record.activityLists.length : 0 }}
            </template>
            <template v-else-if="column.key === 'is_active'">
              <a-switch
                :checked="record.is_active"
                :disabled="!canManageChecklists"
                size="small"
                @change="toggleActive(record)"
              />
            </template>
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button
                  v-if="canOpenDetail"
                  type="link"
                  size="small"
                  @click="goToDetail(record)"
                >
                  Open
                </a-button>
                <a-button
                  v-if="canManageChecklists"
                  type="link"
                  size="small"
                  @click="openEditChecklist(record)"
                >
                  Edit
                </a-button>
                <a-button
                  v-if="canSubmitChecklists && record.is_active"
                  type="link"
                  size="small"
                  @click="goToRespond(record)"
                >
                  Respond
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-spin>
    </Main>

    <a-modal
      v-model:visible="modalOpen"
      :title="form.id ? 'Edit checklist' : 'New checklist'"
      :confirm-loading="saving"
      ok-text="Save"
      width="640px"
      @ok="saveChecklist"
    >
      <a-form layout="vertical">
        <a-form-item label="Checklist name" required>
          <a-input
            v-model:value="form.name"
            placeholder="e.g. Distribution Supervision Checklist"
          />
        </a-form-item>
        <a-form-item label="Use case" required>
          <a-select
            v-model:value="form.use_case"
            placeholder="Select a use case"
            style="width: 100%"
          >
            <a-select-option
              v-for="item in useCases"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Stage" required>
          <a-select
            v-model:value="form.campaign_stage_id"
            placeholder="Select a stage"
            style="width: 100%"
            @change="onStageChange"
          >
            <a-select-option
              v-for="stage in stages"
              :key="stage.id"
              :value="stage.id"
            >
              {{ stage.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea v-model:value="form.description" :rows="2" />
        </a-form-item>
        <a-form-item label="Applies to levels" required>
          <a-space direction="vertical">
            <a-checkbox v-model:checked="form.applies_national">National</a-checkbox>
            <a-checkbox v-model:checked="form.applies_county">County</a-checkbox>
            <a-checkbox v-model:checked="form.applies_sub_county">Sub-County</a-checkbox>
          </a-space>
        </a-form-item>
        <a-form-item label="Activity templates">
          <a-select
            v-model:value="form.activity_list_ids"
            mode="multiple"
            style="width: 100%"
            :disabled="!form.campaign_stage_id"
            placeholder="Templates mapped to the selected stage"
          >
            <a-select-option
              v-for="list in activityListOptions"
              :key="list.id"
              :value="list.id"
            >
              {{ list.name }}
            </a-select-option>
          </a-select>
          <p class="me-muted">
            Only templates already mapped to the selected stage can be linked.
          </p>
        </a-form-item>
        <a-form-item v-if="form.id" label="Active">
          <a-switch v-model:checked="form.is_active" />
        </a-form-item>
        <p v-if="formError" class="me-error">{{ formError }}</p>
      </a-form>
    </a-modal>
  </MePageWrapper>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, notification } from 'ant-design-vue';
import { Main } from '../../styled';
import MePageHeader from './components/MePageHeader.vue';
import { MePageWrapper } from './style';
import meChecklistService, { apiErrorMessage } from '@/services/me/me-checklist.service';
import { useMePermissions } from '@/services/me/usePermissions';
import { ME_LEVELS, ME_USE_CASES, useCaseLabel } from './constants';

const router = useRouter();
const { canManageChecklists, canSubmitChecklists, canViewStructure } = useMePermissions();

const canOpenDetail = computed(
  () => canViewStructure.value || canManageChecklists.value || canSubmitChecklists.value,
);

const useCases = ME_USE_CASES;
const stages = ref([]);
const checklists = ref([]);
const loading = ref(false);
const filters = reactive({
  search: '',
  stage_id: null,
  use_case: null,
  is_active: null,
});

const columns = [
  { title: 'Checklist', key: 'name' },
  { title: 'Stage', key: 'stage', width: 150 },
  { title: 'Use case', key: 'use_case', width: 170 },
  { title: 'Levels', key: 'levels', width: 190 },
  { title: 'Templates', key: 'templates', width: 100 },
  { title: 'Active', key: 'is_active', width: 80 },
  { title: 'Actions', key: 'actions', width: 220 },
];

const filteredChecklists = computed(() => {
  const term = filters.search.trim().toLowerCase();
  if (!term) return checklists.value;
  return checklists.value.filter((row) =>
    String(row.name || '').toLowerCase().includes(term),
  );
});

function listParams() {
  const params = {};
  if (filters.stage_id) params.stage_id = filters.stage_id;
  if (filters.use_case) params.use_case = filters.use_case;
  if (filters.is_active === true) params.is_active = 1;
  if (filters.is_active === false) params.is_active = 0;
  return params;
}

async function loadStages() {
  try {
    const { data } = await meChecklistService.listStages();
    stages.value = Array.isArray(data) ? data : [];
  } catch (error) {
    stages.value = [];
  }
}

async function loadChecklists() {
  loading.value = true;
  try {
    const { data } = await meChecklistService.listChecklists(listParams());
    checklists.value = Array.isArray(data) ? data : [];
  } catch (error) {
    notification.error({
      message: 'Could not load checklists',
      description: apiErrorMessage(error),
    });
  } finally {
    loading.value = false;
  }
}

function refresh() {
  return Promise.all([loadStages(), loadChecklists()]);
}

// ── Create / edit ───────────────────────────────────────────────────────────
const modalOpen = ref(false);
const saving = ref(false);
const formError = ref('');
const form = reactive({
  id: null,
  name: '',
  use_case: null,
  description: '',
  campaign_stage_id: null,
  applies_national: true,
  applies_county: true,
  applies_sub_county: true,
  is_active: true,
  activity_list_ids: [],
});

const selectedStage = computed(() =>
  stages.value.find((stage) => Number(stage.id) === Number(form.campaign_stage_id)),
);

const activityListOptions = computed(() =>
  selectedStage.value && Array.isArray(selectedStage.value.activityLists)
    ? selectedStage.value.activityLists
    : [],
);

function resetForm() {
  form.id = null;
  form.name = '';
  form.use_case = null;
  form.description = '';
  form.campaign_stage_id = null;
  form.applies_national = true;
  form.applies_county = true;
  form.applies_sub_county = true;
  form.is_active = true;
  form.activity_list_ids = [];
  formError.value = '';
}

function openCreateChecklist() {
  resetForm();
  modalOpen.value = true;
}

function openEditChecklist(row) {
  resetForm();
  form.id = row.id;
  form.name = row.name;
  form.use_case = row.use_case;
  form.description = row.description || '';
  form.campaign_stage_id = row.campaign_stage_id;
  form.applies_national = Boolean(row.applies_national);
  form.applies_county = Boolean(row.applies_county);
  form.applies_sub_county = Boolean(row.applies_sub_county);
  form.is_active = Boolean(row.is_active);
  form.activity_list_ids = (row.activityLists || []).map((list) => Number(list.id));
  modalOpen.value = true;
}

function onStageChange() {
  form.activity_list_ids = [];
}

async function saveChecklist() {
  if (!form.name.trim()) {
    formError.value = 'Checklist name is required.';
    return;
  }
  if (!form.use_case) {
    formError.value = 'Select a use case.';
    return;
  }
  if (!form.campaign_stage_id) {
    formError.value = 'Select a stage.';
    return;
  }
  if (!form.applies_national && !form.applies_county && !form.applies_sub_county) {
    formError.value = 'Enable at least one level: national, county or sub-county.';
    return;
  }

  saving.value = true;
  formError.value = '';
  try {
    const payload = {
      name: form.name.trim(),
      use_case: form.use_case,
      description: form.description || null,
      campaign_stage_id: form.campaign_stage_id,
      applies_national: form.applies_national,
      applies_county: form.applies_county,
      applies_sub_county: form.applies_sub_county,
      activity_list_ids: form.activity_list_ids,
    };
    if (form.id) {
      payload.is_active = form.is_active;
      await meChecklistService.updateChecklist(form.id, payload);
    } else {
      await meChecklistService.createChecklist(payload);
    }
    notification.success({
      message: form.id ? 'Checklist updated' : 'Checklist created',
      description: payload.name,
    });
    modalOpen.value = false;
    await loadChecklists();
  } catch (error) {
    formError.value = apiErrorMessage(error, 'Could not save the checklist.');
  } finally {
    saving.value = false;
  }
}

// ── Toggle / navigation ─────────────────────────────────────────────────────
function toggleActive(row) {
  const deactivating = row.is_active;

  Modal.confirm({
    title: deactivating ? 'Deactivate checklist?' : 'Activate checklist?',
    content: deactivating
      ? `${row.name} will no longer be offered to respondents. Existing submissions are kept.`
      : `${row.name} will be offered to respondents again.`,
    okText: deactivating ? 'Deactivate' : 'Activate',
    okType: deactivating ? 'danger' : 'primary',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        const { data } = await meChecklistService.toggleChecklist(row.id);
        row.is_active =
          data && data.is_active !== undefined ? Boolean(data.is_active) : !row.is_active;
        notification.success({
          message: row.is_active ? 'Checklist activated' : 'Checklist deactivated',
          description: row.name,
        });
      } catch (error) {
        notification.error({
          message: 'Could not change the checklist status',
          description: apiErrorMessage(error),
        });
      }
    },
  });
}

function goToDetail(row) {
  router.push(`/me/checklists/${row.id}`);
}

function goToRespond(row) {
  router.push(`/me/checklists/${row.id}/respond`);
}

onMounted(refresh);
</script>
