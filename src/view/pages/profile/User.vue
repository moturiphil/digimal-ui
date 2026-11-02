<template>
  <div class="profile-wrapper">
    <Main>
      <!-- Page header -->
      <div class="prof-pageheader">
        <div class="prof-pageheader-text">
          <span class="prof-pageheader-icon">
            <sdFeatherIcons type="user" size="18" />
          </span>
          <div>
            <h2 class="prof-pageheader-title">My Profile</h2>
            <p class="prof-pageheader-sub">
              Your personal details and payment activity.
            </p>
          </div>
        </div>
      </div>

      <!-- Hero profile card -->
      <div v-if="userData" class="profile-hero">
        <div class="hero-left">
          <div class="hero-avatar">{{ initials }}</div>
          <div class="hero-identity">
            <h3 class="hero-name">{{ userData.name }}</h3>
            <div class="hero-tags">
              <span v-if="userData.role" class="hero-tag is-primary">
                <sdFeatherIcons type="shield" size="12" />
                {{ userData.role }}
              </span>
              <span v-if="userData.organization" class="hero-tag">
                <sdFeatherIcons type="briefcase" size="12" />
                {{ userData.organization }}
              </span>
              <span v-if="userData.location" class="hero-tag">
                <sdFeatherIcons type="map-pin" size="12" />
                {{ userData.location }}
              </span>
            </div>
          </div>
        </div>

        <div class="hero-grid">
          <div class="hero-field">
            <span class="hero-label">ID Number</span>
            <span class="hero-value">{{ userData.id_no || '—' }}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">Phone</span>
            <span class="hero-value">{{ userData.phone_no || '—' }}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">Job Group</span>
            <span class="hero-value">{{ userData.job_group || '—' }}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">Organization</span>
            <span class="hero-value">{{ userData.organization || '—' }}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">Location</span>
            <span class="hero-value">{{ userData.location || '—' }}</span>
          </div>
          <div class="hero-field">
            <span class="hero-label">Role</span>
            <span class="hero-value">{{ userData.role || '—' }}</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="prof-stats">
        <div class="prof-stat">
          <span class="prof-stat-label">Event payments</span>
          <span class="prof-stat-value">{{ dataSource.length }}</span>
        </div>
        <div class="prof-stat">
          <span class="prof-stat-label">Activity payments</span>
          <span class="prof-stat-value">{{ activity_dataSource.length }}</span>
        </div>
        <div class="prof-stat">
          <span class="prof-stat-label">Total earned</span>
          <span class="prof-stat-value">{{ formatMoney(totalEarned) }}</span>
        </div>
      </div>

      <!-- Payments tabs -->
      <div class="section-card">
        <a-tabs v-model:activeKey="activeTab" class="prof-tabs">
          <a-tab-pane key="events">
            <template #tab>
              <span class="tab-label">
                <sdFeatherIcons type="calendar" size="13" />
                Event Payments
                <span class="tab-count">{{ dataSource.length }}</span>
              </span>
            </template>

            <a-spin :spinning="isLoadingEvents">
              <div v-if="dataSource.length" class="prof-table">
                <TableWrapper class="table-data-view table-responsive">
                  <a-table
                    :pagination="{ pageSize: 10, showSizeChanger: true }"
                    :data-source="dataSource"
                    :columns="columns"
                    row-key="id"
                  />
                </TableWrapper>
              </div>
              <div v-else-if="!isLoadingEvents" class="prof-empty">
                <sdFeatherIcons type="inbox" size="36" class="empty-icon" />
                <p>No event payments yet.</p>
              </div>
            </a-spin>
          </a-tab-pane>

          <a-tab-pane key="activities">
            <template #tab>
              <span class="tab-label">
                <sdFeatherIcons type="activity" size="13" />
                Activity Payments
                <span class="tab-count">{{ activity_dataSource.length }}</span>
              </span>
            </template>

            <a-spin :spinning="isLoadingActivities">
              <div v-if="activity_dataSource.length" class="prof-table">
                <TableWrapper class="table-data-view table-responsive">
                  <a-table
                    :pagination="{ pageSize: 10, showSizeChanger: true }"
                    :data-source="activity_dataSource"
                    :columns="activity_columns"
                    row-key="id"
                  />
                </TableWrapper>
              </div>
              <div v-else-if="!isLoadingActivities" class="prof-empty">
                <sdFeatherIcons type="inbox" size="36" class="empty-icon" />
                <p>No activity payments yet.</p>
              </div>
            </a-spin>
          </a-tab-pane>

          <a-tab-pane key="training">
            <template #tab>
              <span class="tab-label">
                <sdFeatherIcons type="book-open" size="13" />
                Training Materials
                <span v-if="trainingCount !== null" class="tab-count">{{ trainingCount }}</span>
              </span>
            </template>
            <TrainingMaterialsTab
              v-if="activeTab === 'training'"
              @loaded="trainingCount = $event"
            />
          </a-tab-pane>
        </a-tabs>
      </div>
    </Main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { Main, TableWrapper } from '../../styled';
import authHeader from '../../../services/auth-header';
import TrainingMaterialsTab from './TrainingMaterialsTab.vue';

const columns = [
  { title: 'Event Name', dataIndex: 'event_name', key: 'event_name' },
  { title: 'Event Code', dataIndex: 'event_code', key: 'event_code' },
  { title: 'Venue', dataIndex: 'venue', key: 'venue' },
  { title: 'Days', dataIndex: 'days_confirmed', key: 'days_confirmed' },
  { title: 'Amount', dataIndex: 'amount_paid', key: 'amount_paid' },
  { title: 'Payment Date', dataIndex: 'payment_date', key: 'payment_date' },
];

const activity_columns = [
  { title: 'Activity Name', dataIndex: 'activity_name', key: 'activity_name' },
  { title: 'Activity Code', dataIndex: 'activity_code', key: 'activity_code' },
  { title: 'Days', dataIndex: 'days_confirmed', key: 'days_confirmed' },
  { title: 'Amount', dataIndex: 'amount_paid', key: 'amount_paid' },
  { title: 'Payment Date', dataIndex: 'payment_date', key: 'payment_date' },
];

const dataSource = ref([]);
const activity_dataSource = ref([]);
const isLoadingEvents = ref(false);
const isLoadingActivities = ref(false);
const activeTab = ref('events');
const trainingCount = ref(null);

const userData = (() => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.user) return null;
    const u = user.user;
    return {
      name: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
      id_no: u.id_no,
      job_group: u.job_group || '',
      phone_no: u.phone_no,
      location: u.location ? u.location.name : '',
      organization: u.org_type ? u.org_type.name : 'N/A',
      role: u.role ? u.role.name : 'N/A',
    };
  } catch (e) {
    console.error('Failed to read user from sessionStorage', e);
    return null;
  }
})();

const initials = computed(() => {
  if (!userData || !userData.name) return '?';
  return userData.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
});

const toNumber = (v) => {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const totalEarned = computed(() => {
  const events = dataSource.value.reduce((s, r) => s + toNumber(r.amount_paid), 0);
  const acts = activity_dataSource.value.reduce(
    (s, r) => s + toNumber(r.amount_paid),
    0,
  );
  return events + acts;
});

const formatMoney = (n) => {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(n || 0);
  } catch (e) {
    return `KES ${Math.round(n || 0).toLocaleString()}`;
  }
};

const fetchData = (url, target, loadingRef) => {
  loadingRef.value = true;
  axios
    .get(url, { headers: authHeader() })
    .then((response) => {
      target.value = response.data.data || [];
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      loadingRef.value = false;
    });
};

onMounted(() => {
  fetchData(
    `${process.env.VUE_APP_BASE_URL}/my_event_payments`,
    dataSource,
    isLoadingEvents,
  );
  fetchData(
    `${process.env.VUE_APP_BASE_URL}/my_activities_payments`,
    activity_dataSource,
    isLoadingActivities,
  );
});
</script>

<style scoped>
/* ─── Wrapper ──────────────────────────────────────────── */
.profile-wrapper {
  min-height: 100vh;
  background: #fafbfb;
  padding: 24px 28px 48px;
}

/* ─── Page header ──────────────────────────────────────── */
.prof-pageheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding: 8px 4px 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid #eef2f5;
}
.prof-pageheader-text {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.prof-pageheader-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eafff5;
  border: 1px solid #c9e6d3;
  color: #15693c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.prof-pageheader-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1d2226;
  line-height: 1.2;
}
.prof-pageheader-sub {
  margin: 3px 0 0;
  font-size: 12px;
  color: #7a8a82;
}

/* ─── Hero ─────────────────────────────────────────────── */
.profile-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(260px, 320px) 1fr;
  gap: 28px;
  background: #fff;
  border: 1px solid #eef2f5;
  border-radius: 14px;
  padding: 22px 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(20, 60, 38, 0.03);
  overflow: hidden;
}
.profile-hero::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, #15693c, #1f9254, #36b16f);
}
.hero-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}
.hero-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #15693c 0%, #1f9254 60%, #36b16f 100%);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(20, 60, 38, 0.22);
  flex-shrink: 0;
}
.hero-identity {
  min-width: 0;
}
.hero-name {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1d2226;
  letter-spacing: 0.2px;
  line-height: 1.2;
  word-break: break-word;
}
.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f5f6f8;
  border: 1px solid #e6ecef;
  color: #4a5560;
  font-size: 11.5px;
  font-weight: 600;
}
.hero-tag.is-primary {
  background: #eafff5;
  border-color: #c9e6d3;
  color: #15693c;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px 22px;
  align-self: center;
  padding-left: 28px;
  border-left: 1px dashed #eef2f5;
}
.hero-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.hero-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #8a9399;
}
.hero-value {
  font-size: 13px;
  font-weight: 600;
  color: #1d2226;
  word-break: break-word;
}

/* ─── Stats strip ──────────────────────────────────────── */
.prof-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.prof-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #eef2f5;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(20, 60, 38, 0.03);
}
.prof-stat-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #8a9399;
}
.prof-stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #15693c;
  line-height: 1.1;
}

/* ─── Section card / tabs ──────────────────────────────── */
.section-card {
  background: #fff;
  border: 1px solid #eef2f5;
  border-radius: 14px;
  padding: 8px 18px 18px;
  box-shadow: 0 1px 2px rgba(20, 60, 38, 0.03);
}
.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}
.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
  background: #f5f6f8;
  color: #6b7480;
  margin-left: 2px;
}

:deep(.prof-tabs .ant-tabs-tab) {
  padding: 12px 4px;
  margin: 0 22px 0 0 !important;
  color: #6b7480;
}
:deep(.prof-tabs .ant-tabs-tab-active),
:deep(.prof-tabs .ant-tabs-tab-active .tab-label) {
  color: #15693c !important;
}
:deep(.prof-tabs .ant-tabs-ink-bar) {
  background: linear-gradient(90deg, #15693c, #1f9254, #36b16f) !important;
  height: 3px !important;
  border-radius: 3px;
}
:deep(.prof-tabs .ant-tabs-nav::before) {
  border-bottom-color: #eef2f5 !important;
}

.prof-table {
  margin-top: 4px;
}

.prof-empty {
  text-align: center;
  padding: 44px 20px;
  color: #7a8a82;
}
.prof-empty p {
  margin: 10px 0 0;
  font-size: 13px;
}
.empty-icon {
  color: #c9e6d3;
}

/* ─── Spinner accent ──────────────────────────────────── */
:deep(.ant-spin-dot-item) {
  background-color: #1f9254;
}

/* ─── Responsive ──────────────────────────────────────── */
@media (max-width: 900px) {
  .profile-hero {
    grid-template-columns: 1fr;
  }
  .hero-grid {
    padding-left: 0;
    border-left: none;
    border-top: 1px dashed #eef2f5;
    padding-top: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .profile-wrapper {
    padding: 16px;
  }
  .prof-stats {
    grid-template-columns: 1fr;
  }
  .hero-grid {
    grid-template-columns: 1fr;
  }
  .hero-avatar {
    width: 60px;
    height: 60px;
    font-size: 20px;
  }
}
</style>
