<template>
  <MePageWrapper>
    <Main>
      <MePageHeader
        icon="file-text"
        title="Submission"
        :subtitle="submission ? submission.submission_ref : 'Checklist response'"
      >
        <template #actions>
          <button class="me-btn" @click="goBack">
            <sdFeatherIcons type="arrow-left" size="13" /><span>Back</span>
          </button>
          <button class="me-btn" :disabled="loading" @click="load">
            <sdFeatherIcons type="refresh-cw" size="13" /><span>Refresh</span>
          </button>
          <button v-if="canEdit" class="me-btn is-primary" @click="editSubmission">
            <sdFeatherIcons type="edit-3" size="13" /><span>Edit my submission</span>
          </button>
        </template>
      </MePageHeader>

      <a-spin :spinning="loading" tip="Loading submission…">
        <div v-if="!loading && notFound" class="me-empty">
          <h3>Submission not found</h3>
          <p>The reference may belong to another campaign or no longer exist.</p>
          <button class="me-btn" @click="goBack">Back to submissions</button>
        </div>

        <template v-else-if="!loading && submission">
          <div class="me-card">
            <a-descriptions bordered size="small" :column="2">
              <a-descriptions-item label="Reference">
                {{ submission.submission_ref }}
              </a-descriptions-item>
              <a-descriptions-item label="Submitted">
                {{ formatDate(submission.submitted_at) }}
              </a-descriptions-item>
              <a-descriptions-item label="Checklist">
                {{ submission.checklist_name || `Checklist #${submission.checklist_id}` }}
              </a-descriptions-item>
              <a-descriptions-item label="Activity">
                {{ submission.activity_code || `Activity #${submission.activity_id}` }}
              </a-descriptions-item>
              <a-descriptions-item label="Location">
                {{ submission.org_unit_name || `Location #${submission.org_unit_id}` }}
              </a-descriptions-item>
              <a-descriptions-item label="Level">
                {{ levelLabel(submission.level_id) }}
              </a-descriptions-item>
              <a-descriptions-item label="Submitted by">
                {{ submission.user_name || `User #${submission.user_id}` }}
              </a-descriptions-item>
              <a-descriptions-item label="Answers">
                {{ (submission.answers || []).length }}
              </a-descriptions-item>
            </a-descriptions>
          </div>

          <div class="me-card">
            <h3 class="me-card-title">Answers</h3>
            <a-table
              :data-source="submission.answers || []"
              :columns="answerColumns"
              :pagination="false"
              row-key="question_id"
              size="small"
            >
              <template #bodyCell="{ column, record, text }">
                <template v-if="column.key === 'answer'">
                  <a-tag :color="answerColor(record.answer)">
                    {{ answerLabel(record.answer) }}
                  </a-tag>
                </template>
                <template v-else>{{ text }}</template>
              </template>
            </a-table>
          </div>

          <div class="me-card">
            <h3 class="me-card-title">Overall comment</h3>
            <p v-if="submission.overall_comment" class="me-muted">
              {{ submission.overall_comment }}
            </p>
            <p v-else class="me-muted">No overall comment was recorded.</p>
          </div>
        </template>
      </a-spin>
    </Main>
  </MePageWrapper>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import { Main } from '../../styled';
import MePageHeader from './components/MePageHeader.vue';
import { MePageWrapper } from './style';
import meChecklistService, { apiErrorMessage } from '@/services/me/me-checklist.service';
import { useMePermissions } from '@/services/me/usePermissions';
import { ME_ANSWERS, levelLabel } from './constants';

const props = defineProps({
  submissionRef: { type: String, required: true },
});

const router = useRouter();
const { canSubmitChecklists } = useMePermissions();

const loading = ref(false);
const submission = ref(null);
const notFound = ref(false);

const currentUserId = (() => {
  try {
    const session = JSON.parse(sessionStorage.getItem('user') || '{}');
    return Number((session.user || {}).id || 0);
  } catch (error) {
    return 0;
  }
})();

const canEdit = computed(
  () =>
    canSubmitChecklists.value &&
    submission.value &&
    Number(submission.value.user_id) === currentUserId,
);

const answerColumns = [
  { title: 'Question', dataIndex: 'question_text', key: 'question_text' },
  { title: 'Answer', key: 'answer', width: 110 },
];

const answerLabel = (value) =>
  (ME_ANSWERS.find((answer) => answer.value === value) || {}).label || value;

const answerColor = (value) =>
  (ME_ANSWERS.find((answer) => answer.value === value) || {}).color || 'default';

const formatDate = (value) => (value ? dayjs(value).format('DD MMM YYYY HH:mm') : '—');

async function load() {
  loading.value = true;
  notFound.value = false;
  try {
    const { data } = await meChecklistService.getSubmission(props.submissionRef);
    submission.value = data;
  } catch (error) {
    submission.value = null;
    if (error && error.response && error.response.status === 404) {
      notFound.value = true;
    } else {
      notification.error({
        message: 'Could not load the submission',
        description: apiErrorMessage(error),
      });
    }
  } finally {
    loading.value = false;
  }
}

function editSubmission() {
  if (!submission.value) return;
  router.push({
    path: `/me/checklists/${submission.value.checklist_id}/respond`,
    query: {
      ref: submission.value.submission_ref,
      activity_id: submission.value.activity_id,
    },
  });
}

function goBack() {
  router.push('/me/submissions');
}

onMounted(load);
</script>
