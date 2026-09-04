<template>
  <ProjectDetailsWrapper>
    <sdPageHeader>
      <template #title>
        <div key="1" class="project-header">
          <sdHeading as="h2">{{
            campaign?.name || "Campaign Details"
          }}</sdHeading>
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <div v-if="loading" class="spin">
        <a-spin />
      </div>
      <template v-else-if="campaign">
        <!-- Aggregate stats -->
        <a-row :gutter="25" class="campaign-stats">
          <a-col :xs="36" :sm="18" :md="12">
            <div class="stat-card">
              <span class="stat-icon">
                <sdFeatherIcons type="calendar" size="18" />
              </span>
              <div class="stat-body">
                <span class="stat-label">Events</span>
                <span class="stat-value">{{ campaign.total_events }}</span>
                <span class="stat-sub">{{ campaign.active_events }} active</span>
              </div>
            </div>
          </a-col>
          <a-col :xs="36" :sm="18" :md="12">
            <div class="stat-card">
              <span class="stat-icon">
                <sdFeatherIcons type="activity" size="18" />
              </span>
              <div class="stat-body">
                <span class="stat-label">Activities</span>
                <span class="stat-value">{{ campaign.total_activities }}</span>
                <span class="stat-sub"
                  >{{ campaign.approved_activities }} approved</span
                >
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- Campaign period + events table -->
        <a-row :gutter="25">
          <a-col :xxl="6" :xl="8" :md="24" :xs="24">
            <sdCards headless>
              <div class="campaign-meta">
                <h4>Campaign Period</h4>
                <p>
                  {{ campaign.start_date || "—" }} &rarr;
                  {{ campaign.end_date || "—" }}
                </p>
              </div>
            </sdCards>
          </a-col>
          <a-col :xxl="18" :xl="16" :md="24" :xs="24">
            <sdCards title="Event List Table"> <EventCampaignTable /></sdCards>
          </a-col>
        </a-row>
      </template>
      <div v-else class="spin">
        <a-empty description="Campaign not found" />
      </div>
    </Main>
  </ProjectDetailsWrapper>
</template>
<script setup>
import { ProjectDetailsWrapper } from "./overview/style";
import { Main } from "../../styled";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "@/Axiosconfig";
import EventCampaignTable from "./CampaignTable/CampaignInfo.vue";

const route = useRoute();
const campaign = ref(null);
const loading = ref(true);

const fetchSummary = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`campaign/${route.params.id}/summary`);
    campaign.value = res.data?.data ?? null;
  } catch (error) {
    console.error(error);
    campaign.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSummary);
</script>

<style lang="less" scoped>
.campaign-stats {
  margin-bottom: 4px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #e1efe6;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);

  .stat-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: #eafff5;
    border: 1px solid #c9e6d3;
    color: #15693c;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .stat-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #7a8a82;
    font-weight: 600;
  }

  .stat-value {
    font-size: 26px;
    font-weight: 800;
    line-height: 1.1;
    color: #1d2226;
  }

  .stat-sub {
    font-size: 11px;
    color: #8a9399;
  }
}

.campaign-meta {
  background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
  border: 1px solid #d9f0e2;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);

  h4 {
    margin: 0 0 6px;
    font-size: 13px;
    font-weight: 700;
    color: #15693c;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #2f3a35;
    word-break: break-word;
  }
}
</style>
