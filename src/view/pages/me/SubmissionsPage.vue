<template>
  <MePageWrapper>
    <Main>
      <MePageHeader
        icon="list"
        :title="isMine ? 'My Submissions' : 'M&E Submissions'"
        subtitle="Checklist responses recorded for the active campaign."
      >
        <template #actions>
          <button class="me-btn" :disabled="loading" @click="refresh">
            <sdFeatherIcons type="refresh-cw" size="13" /><span>Refresh</span>
          </button>
          <router-link v-if="isMine" to="/me/my-checklists" class="me-btn">
            <sdFeatherIcons type="clipboard" size="13" /><span>My Checklists</span>
          </router-link>
          <router-link v-else to="/me/my-submissions" class="me-btn">
            <sdFeatherIcons type="user" size="13" /><span>My Submissions</span>
          </router-link>
        </template>
      </MePageHeader>

      <div v-if="!loading && rows.length" class="me-stats">
        <div class="me-stat">
          <span class="me-stat-label">Submissions</span>
          <span class="me-stat-value">{{ totals.count }}</span>
        </div>
        <div class="me-stat">
          <span class="me-stat-label">Yes</span>
          <span class="me-stat-value">{{ totals.yes }}</span>
        </div>
        <div class="me-stat">
          <span class="me-stat-label">No</span>
          <span class="me-stat-value">{{ totals.no }}</span>
        </div>
        <div class="me-stat">
          <span class="me-stat-label">N/A</span>
          <span class="me-stat-value">{{ totals.na }}</span>
        </div>
      </div>

      <div class="me-toolbar">
        <a-select
          v-model:value="filters.checklist_id"
          allow-clear
          show-search
          option-filter-prop="children"
          placeholder="All checklists"
          class="me-filter"
          @change="loadRows"
        >
          <a-select-option
            v-for="checklist in checklistOptions"
            :key="checklist.id"
            :value="checklist.id"
          >
            {{ checklist.name }}
          </a-select-option>
        </a-select>

        <a-select
          v-if="isMine"
          v-model:value="filters.activity_id"
          allow-clear
          placeholder="All activities"
          class="me-filter"
          @change="loadRows"
        >
          <a-select-option
            v-for="activity in activityOptions"
            :key="activity.activity_id"
            :value="activity.activity_id"
          >
            {{ activity.activity_code }}
          </a-select-option>
        </a-select>
        <a-input-number
          v-else
          v-model:value="filters.activity_id"
          placeholder="Activity id"
          class="me-filter"
          :min="1"
          @change="loadRows"
        />

        <a-select
          v-if="!isMine"
          v-model:value="filters.org_unit_id"
          allow-clear
          show-search
          option-filter-prop="children"
          placeholder="All locations"
          class="me-filter"
          @change="loadRows"
        >
          <a-select-option v-for="unit in orgUnitOptions" :key="unit.id" :value="unit.id">
            {{ unit.name }}
          </a-select-option>
        </a-select>
        <a-input-number
          v-if="!isMine"
          v-model:value="filters.user_id"
          placeholder="User id"
          class="me-filter"
          :min="1"
          @change="loadRows"
        />

        <span v-if="!loading" class="me-result-count">
          {{ rows.length }} submission{{ rows.length === 1 ? '' : 's' }}
        </span>
      </div>

      <a-spin :spinning="loading" tip="Loading submissions…">
        <div v-if="!loading && !rows.length" class="me-empty">
          <h3>No submissions found</h3>
          <p>
            {{ isMine
              ? 'Respond to a checklist from My Checklists to create your first submission.'
              : 'No checklist responses match the selected filters.' }}
          </p>
        </div>

        <a-table
          v-else
          :data-source="rows"
          :columns="columns"
          :pagination="{ pageSize: 15 }"
          row-key="submission_ref"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'submitted_at'">
              {{ formatDate(record.submitted_at) }}
            </template>
            <template v-else-if="column.key === 'checklist'">
              {{ record.checklist_name || `Checklist #${record.checklist_id}` }}
            </template>
            <template v-else-if="column.key === 'activity'">
              {{ record.activity_code || `Activity #${record.activity_id}` }}
            </template>
            <template v-else-if="column.key === 'location'">
              {{ record.org_unit_name || `Location #${record.org_unit_id}` }}
              <span class="me-muted">({{ levelLabel(record.level_id) }})</span>
            </template>
            <template v-else-if="column.key === 'answers'">
              {{ answerSummary(record.answers) }}
            </template>
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" @click="view(record)">
                  View
                </a-button>
                <a-button
                  v-if="isMine"
                  type="link"
                  size="small"
                  @click="edit(record)"
                >
                  Edit
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-spin>
    </Main>

    <a-modal
      v-model:visible="detailOpen"
      title="Submission details"
      width="720px"
      :footer="null"
    >
      <template v-if="detailRow">
        <a-descriptions bordered size="small" :column="2">
          <a-descriptions-item label="Reference">
            {{ detailRow.submission_ref }}
          </a-descriptions-item>
          <a-descriptions-item label="Submitted">
            {{ formatDate(detailRow.submitted_at) }}
          </a-descriptions-item>
          <a-descriptions-item label="Checklist">
            {{ detailRow.checklist_name || `Checklist #${detailRow.checklist_id}` }}
          </a-descriptions-item>
          <a-descriptions-item label="Activity">
            {{ detailRow.activity_code || `Activity #${detailRow.activity_id}` }}
          </a-descriptions-item>
          <a-descriptions-item label="Location">
            {{ detailRow.org_unit_name || `Location #${detailRow.org_unit_id}` }}
          </a-descriptions-item>
          <a-descriptions-item label="Submitted by">
            {{ detailRow.user_name || `User #${detailRow.user_id}` }}
          </a-descriptions-item>
        </a-descriptions>
        <p v-if="detailRow.overall_comment" class="me-muted" style="margin: 12px 0">
          {{ detailRow.overall_comment }}
        </p>
        <a-table
          :data-source="detailRow.answers || []"
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
      </template>
    </a-modal>
  </MePageWrapper>
</template>

<script setup>
import { computed, defineProps, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import { Main } from '../../styled';
import MePageHeader from './components/MePageHeader.vue';
import { MePageWrapper } from './style';
import meChecklistService, { apiErrorMessage } from '@/services/me/me-checklist.service';
import meLookups from '@/services/me/me-lookups.service';
import { useMePermissions } from '@/services/me/usePermissions';
import { answerCounts, answerSummary, levelLabel, ME_ANSWERS } from './constants';

const props = defineProps({
  scope: { type: String, default: 'all' },
});

const router = useRouter();
const { canViewCompliance } = useMePermissions();

const isMine = computed(() => props.scope === 'mine');

const rows = ref([]);
const loading = ref(false);
const checklistOptions = ref([]);
const activityOptions = ref([]);
const orgUnitOptions = ref([]);
const detailOpen = ref(false);
const detailRow = ref(null);
const filters = reactive({
  checklist_id: null,
  activity_id: null,
  org_unit_id: null,
  user_id: null,
});

const columns = [
  { title: 'Submitted', key: 'submitted_at', width: 160 },
  { title: 'Checklist', key: 'checklist' },
  { title: 'Activity', key: 'activity', width: 140 },
  { title: 'Location', key: 'location', width: 200 },
  { title: 'Answers', key: 'answers', width: 160 },
  { title: 'Actions', key: 'actions', width: 130 },
];

const answerColumns = [
  { title: 'Question', dataIndex: 'question_text', key: 'question_text' },
  { title: 'Answer', key: 'answer', width: 110 },
];

const totals = computed(() =>
  rows.value.reduce(
    (acc, row) => {
      const counts = answerCounts(row.answers);
      acc.count += 1;
      acc.yes += counts.yes;
      acc.no += counts.no;
      acc.na += counts.na;
      return acc;
    },
    { count: 0, yes: 0, no: 0, na: 0 },
  ),
);

const answerLabel = (value) =>
  (ME_ANSWERS.find((answer) => answer.value === value) || {}).label || value;

const answerColor = (value) =>
  (ME_ANSWERS.find((answer) => answer.value === value) || {}).color || 'default';

const formatDate = (value) =>
  value ? dayjs(value).format('DD MMM YYYY HH:mm') : '—';

async function loadLookups() {
  if (isMine.value) {
    try {
      const { data } = await meChecklistService.listMyChecklists();
      const groups = Array.isArray(data) ? data : [];
      const seen = new Map();

      groups.forEach((group) => {
        (Array.isArray(group.checklists) ? group.checklists : []).forEach((row) => {
          if (!seen.has(row.id)) seen.set(row.id, { id: row.id, name: row.name });
        });
      });

      checklistOptions.value = Array.from(seen.values()).sort((a, b) =>
        String(a.name).localeCompare(String(b.name)),
      );
      activityOptions.value = groups.map((group) => ({
        activity_id: group.activity_id,
        activity_code: group.activity_code,
      }));
    } catch (error) {
      checklistOptions.value = [];
      activityOptions.value = [];
    }
    return;
  }

  try {
    const { data } = await meChecklistService.listChecklists();
    checklistOptions.value = Array.isArray(data) ? data : [];
  } catch (error) {
    checklistOptions.value = [];
  }

  try {
    const tree = await meLookups.campaignOrgUnits();
    const units = [];
    (Array.isArray(tree.counties) ? tree.counties : []).forEach((county) => {
      units.push({ id: county.id, name: county.name });
      (Array.isArray(county.sub_counties) ? county.sub_counties : []).forEach((sub) => {
        units.push({ id: sub.id, name: sub.name });
      });
    });
    orgUnitOptions.value = units;
  } catch (error) {
    orgUnitOptions.value = [];
  }
}

async function loadRows() {
  loading.value = true;
  try {
    const params = {};
    if (filters.checklist_id) params.checklist_id = filters.checklist_id;
    if (filters.activity_id) params.activity_id = filters.activity_id;
    if (!isMine.value && filters.org_unit_id) params.org_unit_id = filters.org_unit_id;
    if (!isMine.value && filters.user_id) params.user_id = filters.user_id;

    const { data } = isMine.value
      ? await meChecklistService.listMySubmissions(params)
      : await meChecklistService.listSubmissions(params);

    rows.value = Array.isArray(data) ? data : [];
  } catch (error) {
    rows.value = [];
    notification.error({
      message: 'Could not load submissions',
      description: apiErrorMessage(error),
    });
  } finally {
    loading.value = false;
  }
}

function refresh() {
  return Promise.all([loadLookups(), loadRows()]);
}

function view(row) {
  if (canViewCompliance.value) {
    router.push(`/me/submissions/${row.submission_ref}`);
    return;
  }
  detailRow.value = row;
  detailOpen.value = true;
}

function edit(row) {
  router.push({
    path: `/me/checklists/${row.checklist_id}/respond`,
    query: { ref: row.submission_ref, activity_id: row.activity_id },
  });
}

onMounted(refresh);
</script>
