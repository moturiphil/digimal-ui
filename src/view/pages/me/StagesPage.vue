<template>
  <MePageWrapper>
    <Main>
      <MePageHeader
        icon="layers"
        title="Campaign Stages"
        subtitle="Order the supervision stages of the active campaign and map the activity templates each stage covers."
      >
        <template #actions>
          <button class="me-btn" :disabled="loading" @click="loadStages">
            <sdFeatherIcons type="refresh-cw" size="13" /><span>Refresh</span>
          </button>
          <button
            v-if="canManageChecklists"
            class="me-btn is-primary"
            @click="openCreateStage"
          >
            <sdFeatherIcons type="plus" size="13" /><span>New Stage</span>
          </button>
        </template>
      </MePageHeader>

      <div v-if="!loading && stages.length" class="me-stats">
        <div class="me-stat">
          <span class="me-stat-label">Stages</span>
          <span class="me-stat-value">{{ stats.stages }}</span>
        </div>
        <div class="me-stat">
          <span class="me-stat-label">Templates mapped</span>
          <span class="me-stat-value">{{ stats.templates }}</span>
        </div>
        <div class="me-stat">
          <span class="me-stat-label">Locations completed</span>
          <span class="me-stat-value">{{ stats.completions }}</span>
        </div>
      </div>

      <div class="me-toolbar">
        <a-input
          v-model:value="search"
          allow-clear
          placeholder="Search stage by name…"
          class="me-search"
        >
          <template #prefix>
            <sdFeatherIcons type="search" size="14" />
          </template>
        </a-input>
        <span v-if="!loading" class="me-result-count">
          {{ filteredStages.length }} of {{ stages.length }} shown
        </span>
      </div>

      <a-spin :spinning="loading" tip="Loading stages…">
        <div v-if="!loading && !filteredStages.length" class="me-empty">
          <h3>No stages yet</h3>
          <p>Create the first stage for this campaign, then map its activity templates.</p>
          <button
            v-if="canManageChecklists"
            class="me-btn is-primary"
            @click="openCreateStage"
          >
            Create Stage
          </button>
        </div>

        <a-table
          v-else
          :data-source="filteredStages"
          :columns="columns"
          :pagination="false"
          row-key="id"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'sequence'">
              <strong>{{ record.sequence }}</strong>
            </template>
            <template v-else-if="column.key === 'name'">
              {{ record.name }}
            </template>
            <template v-else-if="column.key === 'templates'">
              <div v-if="hasItems(record.activityLists)" class="me-tag-row">
                <a-tag
                  v-for="list in record.activityLists"
                  :key="list.id"
                  color="green"
                >
                  {{ list.name }}
                </a-tag>
              </div>
              <span v-else class="me-muted">No templates mapped</span>
            </template>
            <template v-else-if="column.key === 'completions'">
              <div v-if="hasItems(record.completions)" class="me-tag-row">
                <a-tag
                  v-for="completion in record.completions"
                  :key="completion.id"
                  color="blue"
                >
                  {{ completion.orgUnit?.name || `Location #${completion.org_unit_id}` }}
                  <template v-if="canCompleteStages">
                    <a-divider type="vertical" />
                    <a-button
                      type="link"
                      size="small"
                      @click="confirmReopen(record, completion)"
                    >
                      reopen
                    </a-button>
                  </template>
                </a-tag>
              </div>
              <span v-else class="me-muted">Not completed anywhere</span>
            </template>
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button
                  v-if="canManageChecklists"
                  type="link"
                  size="small"
                  @click="openEditStage(record)"
                >
                  Edit
                </a-button>
                <a-button
                  v-if="canManageChecklists"
                  type="link"
                  size="small"
                  @click="openActivityLists(record)"
                >
                  Activity lists
                </a-button>
                <a-button
                  v-if="canCompleteStages"
                  type="link"
                  size="small"
                  @click="openComplete(record)"
                >
                  Complete…
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-spin>
    </Main>

    <!-- Create / edit stage -->
    <a-modal
      v-model:visible="stageModalOpen"
      :title="stageForm.id ? 'Edit stage' : 'New stage'"
      :confirm-loading="saving"
      ok-text="Save"
      @ok="saveStage"
    >
      <a-form layout="vertical">
        <a-form-item label="Stage name" required>
          <a-input
            v-model:value="stageForm.name"
            placeholder="e.g. Training"
            @press-enter="saveStage"
          />
        </a-form-item>
        <a-form-item label="Sequence">
          <a-input-number
            v-model:value="stageForm.sequence"
            :min="1"
            style="width: 100%"
          />
        </a-form-item>
        <p v-if="formError" class="me-error">{{ formError }}</p>
      </a-form>
    </a-modal>

    <!-- Activity templates -->
    <a-modal
      v-model:visible="listsModalOpen"
      :title="`Activity templates — ${listStage ? listStage.name : ''}`"
      :confirm-loading="savingLists"
      ok-text="Save"
      @ok="saveActivityLists"
    >
      <p class="me-muted">
        Each template can belong to one stage per campaign. Templates already
        mapped to another stage are disabled.
      </p>
      <a-select
        v-model:value="selectedListIds"
        mode="multiple"
        option-filter-prop="children"
        placeholder="Select the activity templates this stage covers"
        style="width: 100%"
        :max-tag-count="6"
      >
        <a-select-option
          v-for="list in activityLists"
          :key="list.id"
          :value="list.id"
          :disabled="isClaimedByOtherStage(list)"
        >
          {{ list.name }}{{ isClaimedByOtherStage(list) ? ` (${list.stage_name})` : '' }}
        </a-select-option>
      </a-select>
      <p v-if="listsError" class="me-error">{{ listsError }}</p>
    </a-modal>

    <!-- Complete a stage for one location -->
    <a-modal
      v-model:visible="completeModalOpen"
      :title="`Complete stage — ${completeStageRow ? completeStageRow.name : ''}`"
      :confirm-loading="completing"
      ok-text="Complete"
      @ok="submitComplete"
    >
      <p class="me-muted">
        Completing locks checklist submissions for the selected location until
        the stage is reopened.
      </p>
      <a-select
        v-model:value="selectedOrgUnit"
        show-search
        option-filter-prop="children"
        placeholder="Select a location"
        style="width: 100%"
        :loading="orgUnitsLoading"
      >
        <a-select-option
          v-for="option in orgUnitOptions"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </a-select-option>
      </a-select>
      <p v-if="completeError" class="me-error">{{ completeError }}</p>
    </a-modal>
  </MePageWrapper>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { Modal, notification } from 'ant-design-vue';
import { Main } from '../../styled';
import MePageHeader from './components/MePageHeader.vue';
import { MePageWrapper } from './style';
import meChecklistService, { apiErrorMessage } from '@/services/me/me-checklist.service';
import meLookups from '@/services/me/me-lookups.service';
import { useMePermissions } from '@/services/me/usePermissions';
import { useOrgUnitOptions } from '@/services/me/useOrgUnitOptions';

const { canManageChecklists, canCompleteStages } = useMePermissions();

const stages = ref([]);
const loading = ref(false);
const search = ref('');
const activityLists = ref([]);

const columns = [
  { title: '#', key: 'sequence', width: 70 },
  { title: 'Stage', key: 'name' },
  { title: 'Activity templates', key: 'templates' },
  { title: 'Completed locations', key: 'completions' },
  { title: 'Actions', key: 'actions', width: 260 },
];

const hasItems = (value) => Array.isArray(value) && value.length > 0;

const filteredStages = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return stages.value;
  return stages.value.filter((stage) => String(stage.name || '').toLowerCase().includes(term));
});

const stats = computed(() => {
  let templates = 0;
  let completions = 0;
  stages.value.forEach((stage) => {
    templates += Array.isArray(stage.activityLists) ? stage.activityLists.length : 0;
    completions += Array.isArray(stage.completions) ? stage.completions.length : 0;
  });
  return { stages: stages.value.length, templates, completions };
});

async function loadStages() {
  loading.value = true;
  try {
    const { data } = await meChecklistService.listStages();
    stages.value = Array.isArray(data) ? data : [];
  } catch (error) {
    notification.error({
      message: 'Could not load stages',
      description: apiErrorMessage(error),
    });
  } finally {
    loading.value = false;
  }
}

async function loadActivityLists() {
  try {
    activityLists.value = await meLookups.activityLists();
  } catch (error) {
    activityLists.value = [];
  }
}

// ── Create / edit ───────────────────────────────────────────────────────────
const stageModalOpen = ref(false);
const saving = ref(false);
const formError = ref('');
const stageForm = reactive({ id: null, name: '', sequence: 1 });

function openCreateStage() {
  stageForm.id = null;
  stageForm.name = '';
  stageForm.sequence =
    stages.value.reduce((max, stage) => Math.max(max, Number(stage.sequence) || 0), 0) + 1;
  formError.value = '';
  stageModalOpen.value = true;
}

function openEditStage(stage) {
  stageForm.id = stage.id;
  stageForm.name = stage.name;
  stageForm.sequence = Number(stage.sequence) || 1;
  formError.value = '';
  stageModalOpen.value = true;
}

async function saveStage() {
  const name = stageForm.name.trim();
  if (!name) {
    formError.value = 'Stage name is required.';
    return;
  }

  saving.value = true;
  formError.value = '';
  try {
    const payload = { name, sequence: Number(stageForm.sequence) || 1 };
    if (stageForm.id) {
      await meChecklistService.updateStage(stageForm.id, payload);
    } else {
      await meChecklistService.createStage(payload);
    }
    notification.success({
      message: stageForm.id ? 'Stage updated' : 'Stage created',
      description: name,
    });
    stageModalOpen.value = false;
    await Promise.all([loadStages(), loadActivityLists()]);
  } catch (error) {
    formError.value = apiErrorMessage(error, 'Could not save the stage.');
  } finally {
    saving.value = false;
  }
}

// ── Activity templates ──────────────────────────────────────────────────────
const listsModalOpen = ref(false);
const listStage = ref(null);
const selectedListIds = ref([]);
const savingLists = ref(false);
const listsError = ref('');

function isClaimedByOtherStage(list) {
  return Boolean(
    list.stage_id &&
      listStage.value &&
      Number(list.stage_id) !== Number(listStage.value.id),
  );
}

function openActivityLists(stage) {
  listStage.value = stage;
  selectedListIds.value = (stage.activityLists || []).map((list) => Number(list.id));
  listsError.value = '';
  listsModalOpen.value = true;
}

async function saveActivityLists() {
  if (!listStage.value) return;

  savingLists.value = true;
  listsError.value = '';
  try {
    await meChecklistService.syncStageActivityLists(listStage.value.id, selectedListIds.value);
    notification.success({
      message: 'Activity templates updated',
      description: listStage.value.name,
    });
    listsModalOpen.value = false;
    await Promise.all([loadStages(), loadActivityLists()]);
  } catch (error) {
    listsError.value = apiErrorMessage(error, 'Could not update the activity templates.');
  } finally {
    savingLists.value = false;
  }
}

// ── Complete / reopen ───────────────────────────────────────────────────────
const completeModalOpen = ref(false);
const completeStageRow = ref(null);
const selectedOrgUnit = ref(null);
const completing = ref(false);
const completeError = ref('');
const {
  options: orgUnitOptions,
  loading: orgUnitsLoading,
  loadForStage,
} = useOrgUnitOptions();

async function openComplete(stage) {
  completeStageRow.value = stage;
  selectedOrgUnit.value = null;
  completeError.value = '';
  completeModalOpen.value = true;
  try {
    await loadForStage(stage.id);
  } catch (error) {
    completeError.value = apiErrorMessage(error, 'Could not load the locations.');
  }
}

async function submitComplete() {
  if (!completeStageRow.value) return;
  if (!selectedOrgUnit.value) {
    completeError.value = 'Select a location first.';
    return;
  }

  completing.value = true;
  completeError.value = '';
  try {
    await meChecklistService.completeStage(completeStageRow.value.id, selectedOrgUnit.value);
    notification.success({
      message: 'Stage completed',
      description: completeStageRow.value.name,
    });
    completeModalOpen.value = false;
    await loadStages();
  } catch (error) {
    completeError.value = apiErrorMessage(error, 'Could not complete the stage.');
  } finally {
    completing.value = false;
  }
}

function confirmReopen(stage, completion) {
  const location = completion.orgUnit?.name || `Location #${completion.org_unit_id}`;

  Modal.confirm({
    title: 'Reopen stage?',
    content: `Checklist submissions for ${stage.name} at ${location} will be unlocked.`,
    okText: 'Reopen',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        await meChecklistService.reopenStage(stage.id, completion.org_unit_id);
        notification.success({
          message: 'Stage reopened',
          description: `${stage.name} — ${location}`,
        });
        await loadStages();
      } catch (error) {
        notification.error({
          message: 'Could not reopen the stage',
          description: apiErrorMessage(error),
        });
      }
    },
  });
}

onMounted(() => {
  loadStages();
  loadActivityLists();
});
</script>
