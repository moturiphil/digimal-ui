<template>
  <div class="campaigns-wrapper">
    <Main>
      <!-- Page header -->
      <div class="cmp-pageheader">
        <div class="cmp-pageheader-text">
          <span class="cmp-pageheader-icon">
            <sdFeatherIcons type="layers" size="18" />
          </span>
          <div>
            <h2 class="cmp-pageheader-title">Campaigns</h2>
            <p class="cmp-pageheader-sub">
              Manage and review every campaign currently running in the system.
            </p>
          </div>
        </div>
        <router-link to="/campaigns/create-campaign" class="cmp-create-btn">
          <sdFeatherIcons type="plus" size="14" />
          <span>Create Campaign</span>
        </router-link>
      </div>

      <!-- Stats strip -->
      <div v-if="!isLoading && dataSource.length" class="cmp-stats">
        <div class="cmp-stat">
          <span class="cmp-stat-label">Total</span>
          <span class="cmp-stat-value">{{ dataSource.length }}</span>
        </div>
        <div class="cmp-stat">
          <span class="cmp-stat-label">Active</span>
          <span class="cmp-stat-value">{{ counts.active }}</span>
        </div>
        <div class="cmp-stat">
          <span class="cmp-stat-label">Upcoming</span>
          <span class="cmp-stat-value">{{ counts.upcoming }}</span>
        </div>
        <div class="cmp-stat">
          <span class="cmp-stat-label">Ended</span>
          <span class="cmp-stat-value">{{ counts.ended }}</span>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="cmp-toolbar">
        <a-input
          v-model:value="search"
          allow-clear
          placeholder="Search campaign by name…"
          class="cmp-search"
        >
          <template #prefix>
            <sdFeatherIcons type="search" size="14" />
          </template>
        </a-input>
        <a-select v-model:value="statusFilter" class="cmp-filter" size="middle">
          <a-select-option value="all">All statuses</a-select-option>
          <a-select-option value="active">Active</a-select-option>
          <a-select-option value="upcoming">Upcoming</a-select-option>
          <a-select-option value="ended">Ended</a-select-option>
        </a-select>
        <span v-if="!isLoading" class="cmp-result-count">
          {{ filteredCampaigns.length }} of {{ dataSource.length }} shown
        </span>
      </div>

      <!-- Content -->
      <a-spin :spinning="isLoading" tip="Loading campaigns…">
        <div v-if="!isLoading && filteredCampaigns.length" class="campaigns-grid">
          <router-link
            v-for="(item, index) in filteredCampaigns"
            :key="item.id || index"
            :to="`/campaigns/view/${item.id}`"
            class="campaign-card"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <header class="card-head">
              <span class="card-status" :class="`is-${statusOf(item)}`">
                {{ statusLabel(statusOf(item)) }}
              </span>
              <span class="card-arrow">
                <sdFeatherIcons type="arrow-up-right" size="14" />
              </span>
            </header>

            <h3 class="campaign-name">{{ item.name }}</h3>

            <div class="card-meta">
              <div class="meta-row">
                <sdFeatherIcons type="play-circle" size="13" class="meta-icon" />
                <span class="meta-label">Starts</span>
                <span class="meta-value">{{ formatDate(item.start_date) }}</span>
              </div>
              <div class="meta-row">
                <sdFeatherIcons type="flag" size="13" class="meta-icon" />
                <span class="meta-label">Ends</span>
                <span class="meta-value">{{ formatDate(item.end_date) }}</span>
              </div>
              <div v-if="durationDays(item) !== null" class="meta-row">
                <sdFeatherIcons type="clock" size="13" class="meta-icon" />
                <span class="meta-label">Duration</span>
                <span class="meta-value">{{ durationDays(item) }} days</span>
              </div>
            </div>

            <footer class="card-foot">
              <span class="card-cta">
                View details
                <sdFeatherIcons type="chevron-right" size="13" />
              </span>
            </footer>
          </router-link>
        </div>

        <!-- No matches in filter -->
        <div
          v-else-if="!isLoading && dataSource.length && !filteredCampaigns.length"
          class="empty-state subtle"
        >
          <sdFeatherIcons type="search" size="40" class="empty-icon" />
          <h3>No campaigns match your search</h3>
          <p>Try a different name or change the status filter.</p>
          <button class="cmp-ghost-btn" @click="clearFilters">Clear filters</button>
        </div>

        <!-- Empty (no data at all) -->
        <div v-else-if="!isLoading" class="empty-state">
          <sdFeatherIcons type="inbox" size="48" class="empty-icon" />
          <h3>No campaigns yet</h3>
          <p>Create your first campaign to get started.</p>
          <router-link to="/campaigns/create-campaign" class="cmp-create-btn">
            <sdFeatherIcons type="plus" size="14" />
            <span>Create Your First Campaign</span>
          </router-link>
        </div>
      </a-spin>
    </Main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { Main } from '../../styled';
import authHeader from '../../../services/auth-header';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';

const isLoading = ref(false);
const dataSource = ref([]);
const search = ref('');
const statusFilter = ref('all');

const formatDate = (value) => {
  if (!value) return '—';
  const d = dayjs(value);
  return d.isValid() ? d.format('DD MMM YYYY') : '—';
};

const statusOf = (item) => {
  const now = dayjs();
  const start = item.start_date ? dayjs(item.start_date) : null;
  const end = item.end_date ? dayjs(item.end_date) : null;
  if (start && start.isAfter(now, 'day')) return 'upcoming';
  if (end && end.isBefore(now, 'day')) return 'ended';
  return 'active';
};

const statusLabel = (s) =>
  s === 'active' ? 'Active' : s === 'upcoming' ? 'Upcoming' : 'Ended';

const durationDays = (item) => {
  if (!item.start_date || !item.end_date) return null;
  const start = dayjs(item.start_date);
  const end = dayjs(item.end_date);
  if (!start.isValid() || !end.isValid()) return null;
  return Math.max(0, end.diff(start, 'day'));
};

const counts = computed(() => ({
  active: dataSource.value.filter((c) => statusOf(c) === 'active').length,
  upcoming: dataSource.value.filter((c) => statusOf(c) === 'upcoming').length,
  ended: dataSource.value.filter((c) => statusOf(c) === 'ended').length,
}));

const filteredCampaigns = computed(() => {
  const term = search.value.trim().toLowerCase();
  return dataSource.value.filter((c) => {
    if (statusFilter.value !== 'all' && statusOf(c) !== statusFilter.value) {
      return false;
    }
    if (!term) return true;
    return (c.name || '').toLowerCase().includes(term);
  });
});

const clearFilters = () => {
  search.value = '';
  statusFilter.value = 'all';
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/campaign_all`,
      { method: 'GET', headers: authHeader() },
    );
    const data = await response.json();
    dataSource.value = data.data || [];
  } catch (error) {
    console.error(error);
    notification.error({
      message: 'Error Loading Campaigns',
      description: 'Failed to fetch campaigns. Please try again later.',
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* ─── Wrapper ──────────────────────────────────────────── */
.campaigns-wrapper {
  min-height: 100vh;
  background: #fafbfb;
  padding: 24px 28px 48px;
}

/* ─── Page header ──────────────────────────────────────── */
.cmp-pageheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding: 8px 4px 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid #eef2f5;
}
.cmp-pageheader-text {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.cmp-pageheader-icon {
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
.cmp-pageheader-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1d2226;
  letter-spacing: 0.2px;
  line-height: 1.2;
}
.cmp-pageheader-sub {
  margin: 3px 0 0;
  font-size: 12px;
  color: #7a8a82;
  max-width: 640px;
  line-height: 1.5;
}

/* ─── Brand-green primary button ───────────────────────── */
.cmp-create-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, #15693c 0%, #1f9254 60%, #36b16f 100%);
  color: #fff !important;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  text-decoration: none;
  border: none;
  box-shadow: 0 4px 10px rgba(20, 60, 38, 0.18);
  transition: filter 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.cmp-create-btn:hover,
.cmp-create-btn:focus {
  filter: brightness(1.05);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(20, 60, 38, 0.26);
  color: #fff !important;
}

.cmp-ghost-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 14px;
  border-radius: 999px;
  background: #fff;
  color: #15693c;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #c9e6d3;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.cmp-ghost-btn:hover {
  background: #eafff5;
  border-color: #1f9254;
}

/* ─── Stats strip ──────────────────────────────────────── */
.cmp-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.cmp-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #eef2f5;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(20, 60, 38, 0.03);
}
.cmp-stat-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #8a9399;
}
.cmp-stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #15693c;
  line-height: 1;
}

/* ─── Toolbar ──────────────────────────────────────────── */
.cmp-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.cmp-search {
  width: 320px;
  max-width: 100%;
}
.cmp-filter {
  width: 160px;
}
.cmp-result-count {
  font-size: 12px;
  color: #8a9399;
  font-weight: 600;
  margin-left: auto;
}

/* ─── Cards grid ──────────────────────────────────────── */
.campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 16px;
}

.campaign-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #eef2f5;
  border-radius: 14px;
  padding: 18px 18px 14px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 1px 2px rgba(20, 60, 38, 0.03);
  transition: border-color 0.18s ease, box-shadow 0.18s ease,
    transform 0.18s ease;
  animation: fadeInUp 0.4s ease-out both;
  overflow: hidden;
}
.campaign-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, #15693c, #1f9254, #36b16f);
  opacity: 0;
  transition: opacity 0.18s ease;
}
.campaign-card:hover {
  border-color: #c9e6d3;
  box-shadow: 0 10px 24px rgba(20, 60, 38, 0.08);
  transform: translateY(-3px);
}
.campaign-card:hover::before {
  opacity: 1;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
.card-status {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.card-status.is-active {
  background: #eafff5;
  color: #15693c;
  border: 1px solid #c9e6d3;
}
.card-status.is-upcoming {
  background: #fff7e8;
  color: #a06200;
  border: 1px solid #ffe2a8;
}
.card-status.is-ended {
  background: #f5f6f8;
  color: #6b7480;
  border: 1px solid #e6ecef;
}
.card-arrow {
  color: #8a9399;
  display: inline-flex;
  transition: color 0.18s ease, transform 0.18s ease;
}
.campaign-card:hover .card-arrow {
  color: #15693c;
  transform: translate(2px, -2px);
}

.campaign-name {
  font-size: 16px;
  font-weight: 700;
  color: #1d2226;
  line-height: 1.35;
  margin: 0 0 12px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 0;
  margin: 0 0 4px;
  border-top: 1px dashed #eef2f5;
  border-bottom: 1px dashed #eef2f5;
}
.meta-row {
  display: grid;
  grid-template-columns: 16px 72px 1fr;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
}
.meta-icon {
  color: #1f9254;
}
.meta-label {
  color: #8a9399;
  font-weight: 600;
}
.meta-value {
  color: #1d2226;
  font-weight: 600;
}

.card-foot {
  padding-top: 10px;
}
.card-cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #15693c;
}

/* ─── Empty / no-match states ─────────────────────────── */
.empty-state {
  text-align: center;
  padding: 56px 24px;
  background: #fff;
  border: 1px solid #eef2f5;
  border-radius: 14px;
  margin-top: 8px;
}
.empty-state.subtle {
  background: #fafbfb;
  border-style: dashed;
}
.empty-icon {
  color: #c9e6d3;
  margin-bottom: 16px;
}
.empty-state h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1d2226;
  margin: 0 0 6px;
}
.empty-state p {
  font-size: 13px;
  color: #7a8a82;
  margin: 0 0 18px;
}

/* ─── Spinner accent ──────────────────────────────────── */
:deep(.ant-spin) {
  color: #1f9254;
}
:deep(.ant-spin-dot-item) {
  background-color: #1f9254;
}
:deep(.ant-spin-text) {
  color: #1d2226;
  font-size: 13px;
  margin-top: 6px;
}

/* ─── Animations ──────────────────────────────────────── */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── Responsive ──────────────────────────────────────── */
@media (max-width: 900px) {
  .cmp-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .campaigns-wrapper {
    padding: 16px;
  }
  .cmp-pageheader {
    align-items: flex-start;
  }
  .cmp-search,
  .cmp-filter {
    width: 100%;
  }
  .cmp-result-count {
    margin-left: 0;
  }
  .campaigns-grid {
    grid-template-columns: 1fr;
  }
}
</style>
