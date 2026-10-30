<template>
  <MePageWrapper>
    <Main>
      <MePageHeader
        icon="clipboard"
        title="My Checklists"
        subtitle="Supervision checklists for the activities you take part in. Pick one to record your responses."
      >
        <template #actions>
          <button class="me-btn" :disabled="loading" @click="loadMine">
            <sdFeatherIcons type="refresh-cw" size="13" /><span>Refresh</span>
          </button>
          <router-link to="/me/my-submissions" class="me-btn">
            <sdFeatherIcons type="list" size="13" /><span>My Submissions</span>
          </router-link>
        </template>
      </MePageHeader>

      <a-spin :spinning="loading" tip="Loading your checklists…">
        <div v-if="!loading && permissionDenied" class="me-empty">
          <h3>Not available</h3>
          <p>You do not have permission to submit M&amp;E checklists.</p>
        </div>

        <div v-else-if="!loading && !totalChecklists" class="me-empty">
          <h3>No checklists for you yet</h3>
          <p>
            Checklists appear for activities you participate in (confirmed
            participant or facilitator) and whose stage is not completed for the
            selected location.
          </p>
        </div>

        <template v-else-if="!loading">
          <div v-for="group in groups" :key="group.activity_id" class="me-card">
            <h3 class="me-card-title">{{ group.activity_code }}</h3>
            <div
              v-for="checklist in group.checklists"
              :key="checklist.id"
              class="me-question"
            >
              <div class="me-question-text">
                <strong>{{ checklist.name }}</strong>
                <div class="me-muted">
                  {{ useCaseLabel(checklist.use_case) }} ·
                  {{ checklist.stage || 'No stage' }}
                </div>
                <div class="me-tag-row" style="margin-top: 6px">
                  <a-tag v-for="level in levelsFor(checklist)" :key="level.level">
                    {{ level.label }}
                  </a-tag>
                </div>
              </div>
              <div class="me-question-actions">
                <button class="me-btn is-primary" @click="respond(group, checklist)">
                  <sdFeatherIcons type="edit-3" size="12" /><span>Respond</span>
                </button>
              </div>
            </div>
          </div>
        </template>
      </a-spin>
    </Main>
  </MePageWrapper>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import { Main } from '../../styled';
import MePageHeader from './components/MePageHeader.vue';
import { MePageWrapper } from './style';
import meChecklistService, { apiErrorMessage } from '@/services/me/me-checklist.service';
import { ME_LEVELS, useCaseLabel } from './constants';

const router = useRouter();
const groups = ref([]);
const loading = ref(false);
const permissionDenied = ref(false);

const totalChecklists = computed(() =>
  groups.value.reduce(
    (total, group) => total + (Array.isArray(group.checklists) ? group.checklists.length : 0),
    0,
  ),
);

const levelsFor = (checklist) => ME_LEVELS.filter((level) => Boolean(checklist[level.key]));

async function loadMine() {
  loading.value = true;
  permissionDenied.value = false;
  try {
    const { data } = await meChecklistService.listMyChecklists();
    groups.value = Array.isArray(data) ? data : [];
  } catch (error) {
    groups.value = [];
    if (error && error.response && error.response.status === 403) {
      permissionDenied.value = true;
    } else {
      notification.error({
        message: 'Could not load your checklists',
        description: apiErrorMessage(error),
      });
    }
  } finally {
    loading.value = false;
  }
}

function respond(group, checklist) {
  router.push({
    path: `/me/checklists/${checklist.id}/respond`,
    query: { activity_id: group.activity_id },
  });
}

onMounted(loadMine);
</script>
