<template>
  <MePageWrapper>
    <Main>
      <MePageHeader
        icon="activity"
        title="M&E Compliance"
        subtitle="Expected supervision checklist submissions per activity and location, and how many have been recorded."
      >
        <template #actions>
          <button class="me-btn" :disabled="loading" @click="loadAll">
            <sdFeatherIcons type="refresh-cw" size="13" /><span>Refresh</span>
          </button>
        </template>
      </MePageHeader>

      <div class="me-toolbar">
        <a-select
          v-model:value="filters.stage_id"
          allow-clear
          placeholder="All stages"
          class="me-filter"
          @change="onStageChange"
        >
          <a-select-option v-for="stage in stages" :key="stage.id" :value="stage.id">
            {{ stage.name }}
          </a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.checklist_id"
          allow-clear
          show-search
          option-filter-prop="children"
          placeholder="All checklists"
          class="me-filter"
          @change="loadReport"
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
          v-model:value="filters.county_id"
          allow-clear
          show-search
          option-filter-prop="children"
          placeholder="All counties"
          class="me-filter"
          @change="onCountyChange"
        >
          <a-select-option v-for="county in counties" :key="county.id" :value="county.id">
            {{ county.name }}
          </a-select-option>
        </a-select>
        <a-select
          v-model:value="filters.sub_county_id"
          allow-clear
          show-search
          option-filter-prop="children"
          placeholder="All sub-counties"
          class="me-filter"
          @change="loadReport"
        >
          <a-select-option
            v-for="subCounty in subCountyOptions"
            :key="subCounty.id"
            :value="subCounty.id"
          >
            {{ subCounty.name }}
          </a-select-option>
        </a-select>
      </div>

      <a-spin :spinning="loading" tip="Building the compliance report…">
        <div v-if="!loading && !activities.length" class="me-empty">
          <h3>No checklists configured</h3>
          <p>No active checklists match the selected filters for this campaign.</p>
        </div>

        <template v-else-if="!loading">
          <div class="me-stats">
            <div class="me-stat">
              <span class="me-stat-label">Expected</span>
              <span class="me-stat-value">{{ summary.expected }}</span>
            </div>
            <div class="me-stat">
              <span class="me-stat-label">Submitted</span>
              <span class="me-stat-value">{{ summary.submitted }}</span>
            </div>
            <div class="me-stat">
              <span class="me-stat-label">Missing</span>
              <span class="me-stat-value">{{ summary.missing }}</span>
            </div>
            <div class="me-stat">
              <span class="me-stat-label">Compliance</span>
              <span class="me-stat-value">{{ percentLabel(summary.compliance_pct) }}</span>
              <a-progress
                :percent="summary.compliance_pct || 0"
                :status="progressStatus"
                size="small"
              />
            </div>
          </div>

          <a-collapse v-model:activeKey="activeKeys" :bordered="false">
            <a-collapse-panel
              v-for="activity in activities"
              :key="String(activity.activity_id)"
              :header="activityHeader(activity)"
            >
              <a-table
                :data-source="activity.items || []"
                :columns="itemColumns"
                :pagination="false"
                :row-key="(row) => `${activity.activity_id}-${row.checklist_id}-${row.org_unit_id}`"
                size="small"
              >
                <template #bodyCell="{ column, record, text }">
                  <template v-if="column.key === 'level'">
                    {{ levelLabel(record.level_id) }}
                  </template>
                  <template v-else-if="column.key === 'status'">
                    <a-tag :color="record.compliant ? 'green' : 'red'">
                      {{ record.compliant ? 'Compliant' : 'Missing' }}
                    </a-tag>
                  </template>
                  <template v-else>{{ text }}</template>
                </template>
              </a-table>
            </a-collapse-panel>
          </a-collapse>
        </template>
      </a-spin>
    </Main>
  </MePageWrapper>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { Main } from '../../styled';
import MePageHeader from './components/MePageHeader.vue';
import { MePageWrapper } from './style';
import meChecklistService, { apiErrorMessage } from '@/services/me/me-checklist.service';
import meLookups from '@/services/me/me-lookups.service';
import { levelLabel, percentLabel } from './constants';

const loading = ref(false);
const stages = ref([]);
const checklists = ref([]);
const orgUnits = ref({ counts: {}, counties: [] });
const report = ref({ summary: {}, activities: [] });
const activeKeys = ref([]);

const filters = reactive({
  stage_id: null,
  checklist_id: null,
  county_id: null,
  sub_county_id: null,
});

const itemColumns = [
  { title: 'Checklist', dataIndex: 'checklist_name', key: 'checklist_name' },
  { title: 'Stage', dataIndex: 'stage', key: 'stage', width: 140 },
  { title: 'Location', dataIndex: 'org_unit_name', key: 'org_unit_name', width: 200 },
  { title: 'Level', key: 'level', width: 110 },
  { title: 'Submissions', dataIndex: 'submissions', key: 'submissions', width: 110 },
  { title: 'Status', key: 'status', width: 110 },
];

const counties = computed(() =>
  Array.isArray(orgUnits.value.counties) ? orgUnits.value.counties : [],
);

const subCountyOptions = computed(() => {
  const county = counties.value.find(
    (row) => Number(row.id) === Number(filters.county_id),
  );
  return county && Array.isArray(county.sub_counties) ? county.sub_counties : [];
});

const checklistOptions = computed(() => checklists.value);

const summary = computed(() => ({
  expected: 0,
  submitted: 0,
  missing: 0,
  compliance_pct: null,
  ...(report.value.summary || {}),
}));

const activities = computed(() =>
  Array.isArray(report.value.activities) ? report.value.activities : [],
);

const progressStatus = computed(() => {
  const pct = summary.value.compliance_pct;
  if (pct === null || pct === undefined) return 'normal';
  if (pct >= 80) return 'success';
  if (pct < 50) return 'exception';
  return 'active';
});

const activityHeader = (activity) =>
  `${activity.activity_code} — ${activity.activity_name} · ${activity.submitted}/${activity.expected} (${percentLabel(activity.compliance_pct)})`;

async function loadStages() {
  try {
    const { data } = await meChecklistService.listStages();
    stages.value = Array.isArray(data) ? data : [];
  } catch (error) {
    stages.value = [];
  }
}

async function loadChecklists() {
  const params = {};
  if (filters.stage_id) params.stage_id = filters.stage_id;

  try {
    const { data } = await meChecklistService.listChecklists(params);
    checklists.value = Array.isArray(data) ? data : [];
  } catch (error) {
    checklists.value = [];
  }
}

async function loadOrgUnits() {
  try {
    orgUnits.value = await meLookups.campaignOrgUnits();
  } catch (error) {
    orgUnits.value = { counts: {}, counties: [] };
  }
}

async function loadReport() {
  loading.value = true;
  try {
    const params = {};
    if (filters.stage_id) params.stage_id = filters.stage_id;
    if (filters.checklist_id) params.checklist_id = filters.checklist_id;
    if (filters.county_id) params.county_id = filters.county_id;
    if (filters.sub_county_id) params.sub_county_id = filters.sub_county_id;

    const { data } = await meChecklistService.getCompliance(params);
    report.value = data || { summary: {}, activities: [] };
    activeKeys.value = (report.value.activities || [])
      .slice(0, 3)
      .map((activity) => String(activity.activity_id));
  } catch (error) {
    report.value = { summary: {}, activities: [] };
    notification.error({
      message: 'Could not build the compliance report',
      description: apiErrorMessage(error),
    });
  } finally {
    loading.value = false;
  }
}

async function onStageChange() {
  filters.checklist_id = null;
  await loadChecklists();
  await loadReport();
}

async function onCountyChange() {
  filters.sub_county_id = null;
  await loadReport();
}

async function loadAll() {
  await Promise.all([loadStages(), loadChecklists(), loadOrgUnits(), loadReport()]);
}

onMounted(loadAll);
</script>
