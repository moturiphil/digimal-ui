<template>
  <sdPageHeader title="CRM Dashboard">
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
    <a-row :gutter="25">
      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless>
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h1">7,461</sdHeading>
                <span>Orders</span>
                <p>
                  <span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                  <span>Since last week</span>
                </p>
              </CardBarChart2>
            </div>
            <div class="card-chunk">
              <Chart
                class="growth"
                :height="180"
                :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
                :style="{
                  marginBottom: '-5',
                }"
                :datasets="[
                  {
                    data: [20, 60, 50, 45, 50, 60, 70],
                    backgroundColor: '#EFEFFE',
                    hoverBackgroundColor: '#5F63F2',
                    label: 'Orders',
                    barPercentage: 1,
                  },
                ]"
                :options="chartOptions"
              />
            </div>
          </EChartCard>
        </sdCards>
      </a-col>
      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless>
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h1">$28,947</sdHeading>
                <span>Revenue</span>
                <p>
                  <span class="growth-downward"> <sdFeatherIcons type="arrow-down" /> 25% </span>
                  <span>Since last week</span>
                </p>
              </CardBarChart2>
            </div>
            <div class="card-chunk">
              <Chart
                class="downward"
                :height="180"
                :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
                :style="{
                  marginBottom: '-5',
                }"
                :datasets="[
                  {
                    data: [20, 60, 50, 45, 50, 60, 70],
                    backgroundColor: '#FFF0F6',
                    hoverBackgroundColor: '#FF69A5',
                    label: 'Revenue',
                    barPercentage: 1,
                  },
                ]"
                :options="chartOptions"
              />
            </div>
          </EChartCard>
        </sdCards>
      </a-col>

      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless>
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h1">$3,241</sdHeading>
                <span>Avg. order value</span>
                <p>
                  <span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                  <span>Since last week</span>
                </p>
              </CardBarChart2>
            </div>
            <div class="card-chunk">
              <Chart
                class="upward"
                :height="180"
                :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
                :style="{
                  marginBottom: '-5',
                }"
                :datasets="[
                  {
                    data: [20, 60, 50, 45, 50, 60, 70],
                    backgroundColor: '#E8FAF4',
                    hoverBackgroundColor: '#20C997',
                    label: 'Avg Orders',
                    barPercentage: 1,
                  },
                ]"
                :options="chartOptions"
              />
            </div>
          </EChartCard>
        </sdCards>
      </a-col>
      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless>
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h1">45.2k</sdHeading>
                <span>Unique visitors</span>
                <p>
                  <span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                  <span>Since last week</span>
                </p>
              </CardBarChart2>
            </div>
            <div class="card-chunk">
              <Chart
                class="visitors"
                :height="180"
                :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
                :style="{
                  marginBottom: '-5',
                }"
                :datasets="[
                  {
                    data: [20, 60, 50, 45, 50, 60, 70],
                    backgroundColor: '#E9F5FF',
                    hoverBackgroundColor: '#2C99FF',
                    label: 'Visitors',
                    barPercentage: 1,
                  },
                ]"
                :options="chartOptions"
              />
            </div>
          </EChartCard>
        </sdCards>
      </a-col>
    </a-row>
    <a-row :gutter="25">
      <a-col :xxl="16" :xs="24"
        ><Suspense>
          <template #default>
            <TotalRevenue title="Revenue" :chartHeight="88" />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="8" :xs="24"
        ><Suspense>
          <template #default>
            <ClosedDeals />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="8" :xl="12" :xs="24"
        ><Suspense>
          <template #default>
            <EmailSent />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="8" :xl="12" :xs="24"
        ><Suspense>
          <template #default>
            <SalesLeaderBoard />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="8" :xs="24"
        ><Suspense>
          <template #default>
            <RecentDeals />
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
import { CardBarChart2, EChartCard } from './style';
import Chart from '../../components/utilities/chartjs';
import { Main } from '../styled';
import { defineAsyncComponent } from 'vue';

const TotalRevenue = defineAsyncComponent(() => import('./overview/ecommerce/TotalRevenue'));
const ClosedDeals = defineAsyncComponent(() => import('./overview/crm/ClosedDeals'));
const EmailSent = defineAsyncComponent(() => import('./overview/crm/EmailSent'));
const SalesLeaderBoard = defineAsyncComponent(() => import('./overview/crm/SalesLeaderboard'));
const RecentDeals = defineAsyncComponent(() => import('./overview/crm/RecentDeals'));

const chartOptions = {
  legend: {
    display: false,
    labels: {
      display: false,
    },
  },
  scales: {
    yAxes: [
      {
        stacked: true,
        gridLines: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    ],
    xAxes: [
      {
        stacked: true,
        gridLines: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    ],
  },
};

const Ecommerce = {
  name: 'CRM',
  components: {
    Main,
    CardBarChart2,
    EChartCard,
    Chart,
    TotalRevenue,
    ClosedDeals,
    EmailSent,
    SalesLeaderBoard,
    RecentDeals,
  },
  setup() {
    return {
      chartOptions,
    };
  },
};

export default Ecommerce;
</script>
