<template>
  <div>
    <sdPageHeader title="Widgets Charts">
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
      <CardChartStyle>
        <a-row :gutter="25">
          <a-col :xs="24">
            <IncomeAndExpenses />
          </a-col>
          <a-col :xs="24">
            <FacebookOverview />
          </a-col>
          <AccountGroup />
          <a-col :xl="12" :xs="24">
            <div class="cashflow-wrap">
              <CashFlow />
            </div>
          </a-col>
          <a-col :xl="12" :xs="24">
            <TotalRevenue />
          </a-col>
          <a-col :xl="8" :xs="24">
            <TwitterOverview />
          </a-col>
          <a-col :xl="16" :xs="24">
            <a-row :gutter="25">
              <a-col :md="12" :sm="12" :xs="24">
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
                        :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
                        :datasets="[
                          {
                            data: [20, 60, 50, 45, 50, 60, 70],
                            backgroundColor: '#EFEFFE',
                            hoverBackgroundColor: '#5F63F2',
                            label: 'Orders',
                          },
                        ]"
                        :options="chartOptions"
                      />
                    </div>
                  </EChartCard>
                </sdCards>
              </a-col>
              <a-col :md="12" :sm="12" :xs="24">
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
                        :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
                        :datasets="[
                          {
                            data: [20, 60, 50, 45, 50, 60, 70],
                            backgroundColor: '#FFF0F6',
                            hoverBackgroundColor: '#FF69A5',
                            label: 'Revenue',
                          },
                        ]"
                        :options="chartOptions"
                        class="sd"
                      />
                    </div>
                  </EChartCard>
                </sdCards>
              </a-col>
              <a-col :md="12" :sm="12" :xs="24">
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
                        :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
                        :datasets="[
                          {
                            data: [20, 60, 50, 45, 50, 60, 70],
                            backgroundColor: '#E8FAF4',
                            hoverBackgroundColor: '#20C997',
                            label: 'Avg Orders',
                          },
                        ]"
                        :options="chartOptions"
                        class="sd2"
                      />
                    </div>
                  </EChartCard>
                </sdCards>
              </a-col>
              <a-col :md="12" :sm="12" :xs="24">
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
                        :labels="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
                        :datasets="[
                          {
                            data: [20, 60, 50, 45, 50, 60, 70],
                            backgroundColor: '#E9F5FF',
                            hoverBackgroundColor: '#2C99FF',
                            label: 'Visitors',
                          },
                        ]"
                        :options="chartOptions"
                        class="sd3"
                      />
                    </div>
                  </EChartCard>
                </sdCards>
              </a-col>
            </a-row>
          </a-col>

          <a-col :xl="8" :md="12" :xs="24">
            <SessionsByDevice />
          </a-col>
          <a-col :xl="8" :md="12" :xs="24">
            <RevenueByDevice />
          </a-col>
          <a-col :xl="8" :xs="24">
            <div class="youtube-subscriber-wrap">
              <YoutubeSubscribers />
            </div>
          </a-col>
        </a-row>
      </CardChartStyle>
    </Main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { Main } from '../styled';
import Chart from '../../components/utilities/chartjs';
import FacebookOverview from '../dashboard/overview/index/FacebookOverview';
import YoutubeSubscribers from '../dashboard/overview/index/YoutubeSubscribers';
import TwitterOverview from '../dashboard/overview/index/TwitterOverview';
import CashFlow from '../dashboard/overview/business/CashFlow';
import IncomeAndExpenses from '../dashboard/overview/business/IncomeAndExpenses';
import AccountGroup from '../dashboard/overview/business/AccountGroup';
import SessionsByDevice from '../dashboard/overview/performance/SessionsByDevice';
import { CardBarChart2, EChartCard } from '../dashboard/style';
import { CardChartStyle } from './Style';
import TotalRevenue from '../dashboard/overview/ecommerce/TotalRevenue';
import RevenueByDevice from '../dashboard/overview/ecommerce/RevenueByDevice';
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
        barPercentage: 1,
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
export default defineComponent({
  name: 'WidgetChart',
  components: {
    Main,
    FacebookOverview,
    YoutubeSubscribers,
    TwitterOverview,
    CashFlow,
    IncomeAndExpenses,
    AccountGroup,
    SessionsByDevice,
    Chart,
    CardBarChart2,
    EChartCard,
    CardChartStyle,
    TotalRevenue,
    RevenueByDevice,
  },
  setup() {
    return {
      chartOptions,
    };
  },
});
</script>
