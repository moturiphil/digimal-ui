<template>
  <sdPageHeader title="Website Performance Dashboard">
    <template v-slot:buttons>
      <div class="page-header-actions">
        <sdCalendarButton />
        <sdExportButton />
        <sdShareButton />
        <sdButton size="small" type="primary">
          <sdFeatherIcons type="plus" size="14" />
          Add New
        </sdButton>
      </div>
    </template>
  </sdPageHeader>
  <Main>
    <a-row justify="center" :gutter="25">
      <a-col :xxl="8" :xl="10" :lg="12" :xs="24">
        <Suspense>
          <template #default>
            <DailyOverview />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="16" :xl="14" :lg="12" :xs="24">
        <Suspense>
          <template #default>
            <WebsitePerformance />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="16" :xs="24">
        <Suspense>
          <template #default>
            <TrafficChannel />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="8" :xl="8" :md="12" :xs="24">
        <Suspense>
          <template #default>
            <SessionsByDevice />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="12" :xl="16" :md="12" :xs="24">
        <Suspense>
          <template #default>
            <TopLandingPages />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="12" :xl="16" :md="12" :xs="24">
        <Suspense>
          <template #default>
            <SessionsbyRegion />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import { Main } from '../styled';
import { defineAsyncComponent } from 'vue';

const DailyOverview = defineAsyncComponent(() => import('./overview/performance/DailyOverview'));
const WebsitePerformance = defineAsyncComponent(() => import('./overview/performance/WebsitePerformance'));
const TrafficChannel = defineAsyncComponent(() => import('./overview/performance/TrafficChannel'));
const SessionsByDevice = defineAsyncComponent(() => import('./overview/performance/SessionsByDevice'));
const TopLandingPages = defineAsyncComponent(() => import('./overview/performance/TopLandingPages'));
const SessionsbyRegion = defineAsyncComponent(() => import('./overview/performance/SessionsbyRegion'));

const Performance = {
  name: 'Performance',
  components: {
    Main,
    DailyOverview,
    TopLandingPages,
    WebsitePerformance,
    TrafficChannel,
    SessionsByDevice,
    SessionsbyRegion,
  },
};

export default Performance;
</script>
