<template>
  <MePageWrapper>
    <Main>
      <MePageHeader
        icon="edit-3"
        :title="heading"
        :subtitle="editingRef ? `Editing submission ${editingRef}` : 'Answer every question, then submit one overall comment.'"
      >
        <template #actions>
          <button class="me-btn" @click="goBack">
            <sdFeatherIcons type="arrow-left" size="13" /><span>Back</span>
          </button>
          <button class="me-btn" :disabled="loading" @click="loadChecklist">
            <sdFeatherIcons type="refresh-cw" size="13" /><span>Refresh</span>
          </button>
        </template>
      </MePageHeader>

      <a-spin :spinning="loading" tip="Loading checklist…">
        <div v-if="!loading && loadError" class="me-empty">
          <h3>Cannot open this checklist</h3>
          <p>{{ loadError }}</p>
        </div>

        <template v-else-if="!loading && checklist">
          <div class="me-card">
            <h3 class="me-card-title">{{ checklist.name }}</h3>
            <p v-if="checklist.description" class="me-muted">{{ checklist.description }}</p>
            <div class="me-tag-row" style="margin-top: 8px">
              <a-tag v-for="level in enabledLevels" :key="level.level" color="green">
                {{ level.label }}
              </a-tag>
              <a-tag v-if="checklist.stage" color="blue">{{ checklist.stage.name }}</a-tag>
            </div>
          </div>

          <div v-if="!activities.length" class="me-empty">
            <h3>No activity available</h3>
            <p>
              This checklist is not linked to any activity you participate in,
              so it cannot be answered.
            </p>
          </div>

          <template v-else>
            <div class="me-card">
              <div class="me-inline-form" style="margin-top: 0; flex-wrap: wrap">
                <div style="flex: 1 1 260px">
                  <span class="me-stat-label">Activity</span>
                  <a-select
                    v-model:value="activityId"
                    placeholder="Select the activity you supervised"
                    style="width: 100%"
                    @change="onActivityChange"
                  >
                    <a-select-option
                      v-for="group in activities"
                      :key="group.activity_id"
                      :value="group.activity_id"
                    >
                      {{ group.activity_code }}
                    </a-select-option>
                  </a-select>
                </div>
                <div style="flex: 1 1 260px">
                  <span class="me-stat-label">Location</span>
                  <a-select
                    v-model:value="locationId"
                    show-search
                    option-filter-prop="children"
                    placeholder="Select the location"
                    style="width: 100%"
                    :loading="locationsLoading"
                  >
                    <a-select-option
                      v-for="option in locationOptions"
                      :key="option.value"
                      :value="option.value"
                      :disabled="option.disabled"
                    >
                      {{ option.label }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
              <p class="me-muted" style="margin: 10px 0 0">
                The selected location must be part of the activity. Locations
                whose stage is already completed are disabled.
              </p>
            </div>

            <div v-for="section in sections" :key="section.id" class="me-card">
              <h3 class="me-card-title">{{ section.title }}</h3>
              <div
                v-for="question in section.questions"
                :key="question.id"
                class="me-question"
              >
                <div class="me-question-text">
                  {{ question.text }}
                  <a-tag v-if="!answers[question.id]" style="margin-left: 6px">
                    unanswered
                  </a-tag>
                </div>
                <div class="me-question-actions">
                  <a-radio-group v-model:value="answers[question.id]" size="small">
                    <a-radio-button
                      v-for="option in ME_ANSWERS"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </a-radio-button>
                  </a-radio-group>
                </div>
              </div>
            </div>

            <div class="me-card">
              <h3 class="me-card-title">Overall comment</h3>
              <a-textarea
                v-model:value="overallComment"
                :rows="3"
                placeholder="Optional summary of the supervision visit…"
              />
            </div>

            <div class="me-card me-section-head">
              <span class="me-muted">
                {{ answeredCount }} of {{ totalQuestions }} answered
              </span>
              <div style="display: flex; gap: 8px; flex-wrap: wrap">
                <button class="me-btn" @click="goBack">Cancel</button>
                <button class="me-btn is-primary" :disabled="submitting" @click="submit">
                  <sdFeatherIcons type="check" size="13" />
                  <span>{{ submitLabel }}</span>
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
import { useRoute, useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import { Main } from '../../styled';
import MePageHeader from './components/MePageHeader.vue';
import { MePageWrapper } from './style';
import meChecklistService, { apiErrorMessage } from '@/services/me/me-checklist.service';
import { useOrgUnitOptions } from '@/services/me/useOrgUnitOptions';
import { ME_ANSWERS, ME_LEVELS } from './constants';

const props = defineProps({
  id: { type: [String, Number], required: true },
});

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const submitting = ref(false);
const loadError = ref('');
const checklist = ref(null);
const activities = ref([]);
const activityId = ref(null);
const locationId = ref(null);
const overallComment = ref('');
const answers = reactive({});

const {
  locations,
  options: locationOptions,
  loading: locationsLoading,
  loadForChecklist,
} = useOrgUnitOptions();

const editingRef = computed(() =>
  typeof route.query.ref === 'string' && route.query.ref ? route.query.ref : null,
);

const heading = computed(() =>
  checklist.value ? checklist.value.name : 'Respond to checklist',
);

const submitLabel = computed(() => {
  if (submitting.value) return 'Saving…';
  return editingRef.value ? 'Update submission' : 'Submit checklist';
});

const sections = computed(() =>
  checklist.value && Array.isArray(checklist.value.sections) ? checklist.value.sections : [],
);

const questions = computed(() =>
  sections.value.flatMap((section) =>
    Array.isArray(section.questions) ? section.questions : [],
  ),
);

const enabledLevels = computed(() =>
  ME_LEVELS.filter((level) => checklist.value && checklist.value[level.key]),
);

const answeredCount = computed(
  () => questions.value.filter((question) => Boolean(answers[question.id])).length,
);

const totalQuestions = computed(() => questions.value.length);

async function loadActivities() {
  const { data } = await meChecklistService.listMyChecklists();
  const groups = Array.isArray(data) ? data : [];

  activities.value = groups.filter((group) =>
    (Array.isArray(group.checklists) ? group.checklists : []).some(
      (row) => Number(row.id) === Number(props.id),
    ),
  );
}

async function loadLocations() {
  if (!activityId.value) {
    locations.value = [];
    locationId.value = null;
    return;
  }

  await loadForChecklist(props.id, activityId.value);

  const selectable = locationOptions.value.filter((option) => !option.disabled);
  const stillValid = selectable.some((option) => option.value === locationId.value);
  if (!stillValid) {
    locationId.value = selectable.length ? selectable[0].value : null;
  }
}

async function onActivityChange() {
  locationId.value = null;
  try {
    await loadLocations();
  } catch (error) {
    notification.error({
      message: 'Could not load the locations',
      description: apiErrorMessage(error),
    });
  }
}

async function prefill(ref) {
  try {
    const { data } = await meChecklistService.listMySubmissions({
      checklist_id: props.id,
      activity_id: activityId.value,
    });
    const row = (Array.isArray(data) ? data : []).find(
      (submission) => submission.submission_ref === ref,
    );
    if (!row) return;

    overallComment.value = row.overall_comment || '';
    const activeIds = new Set(questions.value.map((question) => Number(question.id)));
    (row.answers || []).forEach((answer) => {
      if (activeIds.has(Number(answer.question_id))) {
        answers[answer.question_id] = answer.answer;
      }
    });
  } catch (error) {
    notification.error({
      message: 'Could not load the submission',
      description: apiErrorMessage(error),
    });
  }
}

async function loadChecklist() {
  loading.value = true;
  loadError.value = '';
  try {
    const { data } = await meChecklistService.getChecklist(props.id, {
      with_inactive: 0,
    });
    checklist.value = data;

    await loadActivities();

    const preset =
      typeof route.query.activity_id === 'string' && route.query.activity_id
        ? Number(route.query.activity_id)
        : null;
    activityId.value =
      preset || (activities.value.length ? activities.value[0].activity_id : null);

    if (activityId.value) {
      await loadLocations();
    }

    if (editingRef.value) {
      await prefill(editingRef.value);
    }
  } catch (error) {
    checklist.value = null;
    if (error && error.response && error.response.status === 403) {
      loadError.value = 'You do not have permission to submit M&E checklists.';
    } else {
      loadError.value = apiErrorMessage(error, 'Could not load the checklist.');
    }
  } finally {
    loading.value = false;
  }
}

function validate() {
  const problems = [];

  if (!activityId.value) {
    problems.push('Select the activity you supervised.');
  }
  if (!locationId.value) {
    problems.push('Select the location.');
  }

  const missing = questions.value.filter((question) => !answers[question.id]);
  if (missing.length) {
    problems.push(`Answer all questions (${missing.length} still unanswered).`);
  }

  return problems;
}

async function submit() {
  const problems = validate();
  if (problems.length) {
    notification.warning({
      message: 'Check the form',
      description: problems.join(' '),
    });
    return;
  }

  submitting.value = true;
  try {
    const payloadAnswers = questions.value.map((question) => ({
      question_id: Number(question.id),
      answer: answers[question.id],
    }));

    let ref = editingRef.value;
    if (ref) {
      await meChecklistService.updateSubmission(ref, {
        overall_comment: overallComment.value || null,
        answers: payloadAnswers,
      });
    } else {
      const { data } = await meChecklistService.submitChecklist({
        checklist_id: Number(props.id),
        activity_id: Number(activityId.value),
        org_unit_id: Number(locationId.value),
        overall_comment: overallComment.value || null,
        answers: payloadAnswers,
      });
      ref = data ? data.submission_ref : null;
    }

    notification.success({
      message: editingRef.value ? 'Submission updated' : 'Checklist submitted',
      description: ref ? `Reference ${ref}` : undefined,
    });
    router.push('/me/my-submissions');
  } catch (error) {
    notification.error({
      message: 'Could not save the submission',
      description: apiErrorMessage(error),
    });
  } finally {
    submitting.value = false;
  }
}

function goBack() {
  router.push('/me/my-checklists');
}

onMounted(loadChecklist);
</script>
