<template>
  <MePageWrapper>
    <Main>
      <MePageHeader
        icon="check-square"
        :title="meta ? meta.name : 'Checklist'"
        :subtitle="meta ? `${useCaseLabel(meta.use_case)} · ${meta.stage ? meta.stage.name : 'No stage'}` : 'Section and question structure'"
      >
        <template #actions>
          <button class="me-btn" @click="goBack">
            <sdFeatherIcons type="arrow-left" size="13" /><span>Back</span>
          </button>
          <button class="me-btn" :disabled="loading" @click="loadChecklist">
            <sdFeatherIcons type="refresh-cw" size="13" /><span>Refresh</span>
          </button>
          <button v-if="canRespond" class="me-btn is-primary" @click="goRespond">
            <sdFeatherIcons type="edit-3" size="13" /><span>Respond</span>
          </button>
        </template>
      </MePageHeader>

      <a-spin :spinning="loading" tip="Loading checklist…">
        <template v-if="!loading">
          <div v-if="meta" class="me-card">
            <h3 class="me-card-title">{{ meta.name }}</h3>
            <p v-if="meta.description" class="me-muted">{{ meta.description }}</p>
            <div class="me-tag-row" style="margin-top: 8px">
              <a-tag v-for="level in enabledLevels" :key="level.level" color="green">
                {{ level.label }}
              </a-tag>
              <a-tag v-if="meta.stage" color="blue">{{ meta.stage.name }}</a-tag>
            </div>
            <p v-if="templates.length" class="me-muted" style="margin-top: 10px">
              Templates: {{ templateNames }}
            </p>
            <p v-else class="me-muted" style="margin-top: 10px">
              No activity templates linked.
            </p>
          </div>

          <div v-if="!structureAvailable" class="me-empty">
            <h3>Structure not available</h3>
            <p>
              Reading the section and question tree requires the
              <code>me_checklist_sections_questions</code> or
              <code>me_checklist_submit</code> permission.
            </p>
          </div>

          <template v-else>
          <div v-if="!sections.length" class="me-empty">
            <h3>No sections yet</h3>
            <p>Add the first section, then its questions.</p>
          </div>

          <div v-for="section in sections" :key="section.id" class="me-card">
            <div class="me-section-head">
              <div
                v-if="editingSectionId === section.id"
                class="me-inline-form"
                style="margin-top: 0"
              >
                <a-input
                  v-model:value="sectionDraft"
                  size="small"
                  @press-enter="saveSection(section)"
                />
                <a-button type="link" size="small" @click="saveSection(section)">
                  Save
                </a-button>
                <a-button type="link" size="small" @click="cancelSectionEdit">
                  Cancel
                </a-button>
              </div>
              <div v-else>
                <h3 class="me-card-title">{{ section.title }}</h3>
                <span class="me-muted">Sort order {{ section.sort_order }}</span>
              </div>
              <a-space v-if="canManage && editingSectionId !== section.id">
                <a-button type="link" size="small" @click="startEditSection(section)">
                  Rename
                </a-button>
                <a-button type="link" size="small" danger @click="removeSection(section)">
                  Delete
                </a-button>
              </a-space>
            </div>

            <div v-for="question in section.questions" :key="question.id" class="me-question">
              <div class="me-question-text">
                <template v-if="editingQuestionId === question.id">
                  <a-input
                    v-model:value="questionDraft"
                    size="small"
                    @press-enter="saveQuestion(question)"
                  />
                </template>
                <template v-else>
                  {{ question.text }}
                  <a-tag v-if="question.is_active === false" style="margin-left: 6px">
                    inactive
                  </a-tag>
                </template>
              </div>
              <div class="me-question-actions">
                <template v-if="editingQuestionId === question.id">
                  <a-button type="link" size="small" @click="saveQuestion(question)">
                    Save
                  </a-button>
                  <a-button type="link" size="small" @click="cancelQuestionEdit">
                    Cancel
                  </a-button>
                </template>
                <template v-else>
                  <a-switch
                    :checked="question.is_active"
                    size="small"
                    :disabled="!canManage"
                    @change="toggleQuestionActive(question)"
                  />
                  <a-button
                    v-if="canManage"
                    type="link"
                    size="small"
                    @click="startEditQuestion(question)"
                  >
                    Edit
                  </a-button>
                </template>
              </div>
            </div>

            <div v-if="canManage" class="me-inline-form">
              <a-input
                v-model:value="questionDrafts[section.id]"
                size="small"
                placeholder="Add a question…"
                @press-enter="addQuestion(section)"
              />
              <button
                class="me-btn"
                :disabled="!questionDrafts[section.id]"
                @click="addQuestion(section)"
              >
                <sdFeatherIcons type="plus" size="12" /><span>Add</span>
              </button>
            </div>
          </div>

          <div v-if="canManage" class="me-card">
            <h3 class="me-card-title">Add a section</h3>
            <div class="me-inline-form">
              <a-input
                v-model:value="newSectionTitle"
                placeholder="Section title…"
                @press-enter="addSection"
              />
              <button
                class="me-btn is-primary"
                :disabled="!newSectionTitle.trim()"
                @click="addSection"
              >
                <sdFeatherIcons type="plus" size="12" /><span>Add section</span>
              </button>
            </div>
          </div>
          </template>
        </template>
      </a-spin>
    </Main>
  </MePageWrapper>
</template>

<script setup>
import { computed, defineProps, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Modal, notification } from 'ant-design-vue';
import { Main } from '../../styled';
import MePageHeader from './components/MePageHeader.vue';
import { MePageWrapper } from './style';
import meChecklistService, { apiErrorMessage } from '@/services/me/me-checklist.service';
import { useMePermissions } from '@/services/me/usePermissions';
import { ME_LEVELS, useCaseLabel } from './constants';

const props = defineProps({
  id: { type: [String, Number], required: true },
});

const router = useRouter();
const {
  canViewCompliance,
  canManageChecklists,
  canSubmitChecklists,
  canViewStructure,
} = useMePermissions();

const loading = ref(false);
const meta = ref(null);
const sections = ref([]);
const structureAvailable = ref(true);

const canManage = canManageChecklists;
const canRespond = computed(
  () => canSubmitChecklists.value && meta.value && meta.value.is_active !== false,
);

const enabledLevels = computed(() =>
  ME_LEVELS.filter((level) => meta.value && meta.value[level.key]),
);

const templates = computed(() =>
  meta.value && Array.isArray(meta.value.activityLists) ? meta.value.activityLists : [],
);

const templateNames = computed(() => templates.value.map((list) => list.name).join(', '));

const questionDrafts = reactive({});

function applyMeta(row, fallback) {
  const base = { ...(fallback || {}) };
  if (!row) return base;

  return {
    ...base,
    ...row,
    sections: undefined,
    activityLists: Array.isArray(row.activityLists)
      ? row.activityLists
      : base.activityLists || [],
    stage: row.stage || base.stage || null,
  };
}

async function loadChecklist() {
  loading.value = true;
  try {
    let structure = null;
    structureAvailable.value = true;

    if (canViewStructure.value) {
      const { data } = await meChecklistService.getChecklistStructure(props.id, {
        with_inactive: 1,
      });
      structure = data;
    } else if (canSubmitChecklists.value) {
      const { data } = await meChecklistService.getChecklist(props.id, {
        with_inactive: 1,
      });
      structure = data;
    } else {
      structureAvailable.value = false;
    }

    let listRow = null;
    if (canViewCompliance.value) {
      try {
        const { data } = await meChecklistService.listChecklists();
        listRow =
          (Array.isArray(data) ? data : []).find(
            (row) => Number(row.id) === Number(props.id),
          ) || null;
      } catch (error) {
        listRow = null;
      }
    }

    const base = structure
      ? {
          id: structure.id,
          name: structure.name,
          use_case: structure.use_case,
          description: structure.description,
          stage: null,
          activityLists: [],
          applies_national: false,
          applies_county: false,
          applies_sub_county: false,
          is_active: true,
        }
      : null;

    if (listRow || base) {
      meta.value = applyMeta(listRow, base || {});
    }

    sections.value = structure && Array.isArray(structure.sections) ? structure.sections : [];
    sections.value.forEach((section) => {
      if (questionDrafts[section.id] === undefined) questionDrafts[section.id] = '';
    });
  } catch (error) {
    notification.error({
      message: 'Could not load the checklist',
      description: apiErrorMessage(error),
    });
    sections.value = [];
  } finally {
    loading.value = false;
  }
}

// ── Sections ────────────────────────────────────────────────────────────────
const editingSectionId = ref(null);
const sectionDraft = ref('');
const newSectionTitle = ref('');

function startEditSection(section) {
  editingSectionId.value = section.id;
  sectionDraft.value = section.title;
}

function cancelSectionEdit() {
  editingSectionId.value = null;
  sectionDraft.value = '';
}

async function saveSection(section) {
  const title = sectionDraft.value.trim();
  if (!title) return;

  try {
    await meChecklistService.updateSection(section.id, { title });
    notification.success({ message: 'Section renamed', description: title });
    cancelSectionEdit();
    await loadChecklist();
  } catch (error) {
    notification.error({
      message: 'Could not rename the section',
      description: apiErrorMessage(error),
    });
  }
}

async function addSection() {
  const title = newSectionTitle.value.trim();
  if (!title) return;

  try {
    await meChecklistService.createSection(props.id, { title });
    notification.success({ message: 'Section added', description: title });
    newSectionTitle.value = '';
    await loadChecklist();
  } catch (error) {
    notification.error({
      message: 'Could not add the section',
      description: apiErrorMessage(error),
    });
  }
}

function removeSection(section) {
  Modal.confirm({
    title: 'Delete section?',
    content: `“${section.title}” and its questions will be removed. Sections with answered questions cannot be deleted.`,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk: async () => {
      try {
        await meChecklistService.deleteSection(section.id);
        notification.success({ message: 'Section deleted', description: section.title });
        await loadChecklist();
      } catch (error) {
        notification.error({
          message: 'Could not delete the section',
          description: apiErrorMessage(error),
        });
      }
    },
  });
}

// ── Questions ───────────────────────────────────────────────────────────────
const editingQuestionId = ref(null);
const questionDraft = ref('');

function startEditQuestion(question) {
  editingQuestionId.value = question.id;
  questionDraft.value = question.text;
}

function cancelQuestionEdit() {
  editingQuestionId.value = null;
  questionDraft.value = '';
}

async function saveQuestion(question) {
  const text = questionDraft.value.trim();
  if (!text) return;

  try {
    const { data } = await meChecklistService.updateQuestion(question.id, { text });

    if (data && data.previous_question_id) {
      notification.info({
        message: 'New question version created',
        description:
          'Earlier submissions keep the previous wording; the new wording applies to future responses.',
        duration: 6,
      });
    } else {
      notification.success({ message: 'Question updated' });
    }

    cancelQuestionEdit();
    await loadChecklist();
  } catch (error) {
    notification.error({
      message: 'Could not update the question',
      description: apiErrorMessage(error),
    });
  }
}

async function addQuestion(section) {
  const text = String(questionDrafts[section.id] || '').trim();
  if (!text) return;

  try {
    await meChecklistService.createQuestion(section.id, { text });
    questionDrafts[section.id] = '';
    notification.success({ message: 'Question added' });
    await loadChecklist();
  } catch (error) {
    notification.error({
      message: 'Could not add the question',
      description: apiErrorMessage(error),
    });
  }
}

async function toggleQuestionActive(question) {
  try {
    await meChecklistService.toggleQuestion(question.id);
    notification.success({
      message: question.is_active ? 'Question deactivated' : 'Question activated',
    });
    await loadChecklist();
  } catch (error) {
    notification.error({
      message: 'Could not change the question status',
      description: apiErrorMessage(error),
    });
  }
}

function goBack() {
  router.push('/me/checklists');
}

function goRespond() {
  router.push(`/me/checklists/${props.id}/respond`);
}

onMounted(loadChecklist);
</script>
