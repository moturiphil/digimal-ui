<template>
  <Main>
    <sdPageHeader title="DigiMal KE Dashboard">
      <template v-slot:buttons>
        <div class="page-header-actions">
          <router-link v-bind:to="'campaigns/create-campaign'">
            <sdButton size="small" type="success">
              <sdFeatherIcons type="plus" size="14" class="icon-color-white" />
              Create Campaign
            </sdButton>
          </router-link>
        </div>
      </template>
    </sdPageHeader>
    <a-row :gutter="25">
      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless>
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h1">{{ nets_distributed }}</sdHeading>
                <span>Nets Distributed</span>
                <p></p>
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
                    backgroundColor: '#E8FAF4',
                    hoverBackgroundColor: '#20C997',
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
                <sdHeading as="h1">{{ activities }}</sdHeading>
                <span>Active Activities</span>
                <p>
                  <!--<span class="growth-downward"> <sdFeatherIcons type="arrow-down" /> 25% </span>
                  <span>Since last week</span> -->
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
                    backgroundColor: '#E8FAF4',
                    hoverBackgroundColor: '#20C997',
                    label: 'Nets Distributed',
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
                <sdHeading as="h1">{{ active_events }}</sdHeading>
                <span>Active Events</span>
                <p>
                  <!-- <span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                   <span>Since last week</span> -->
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
                <sdHeading as="h1">{{ registered_house_holds }}</sdHeading>
                <span>Registered HouseHolds</span>
                <p>
                  <!--<span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                  <span>Since last week</span>-->
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
                    backgroundColor: '#E8FAF4',
                    hoverBackgroundColor: '#20C997',
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
      <a-col :md="24">
        <Suspense>
          <template #default>
            <IncomeAndExpenses />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :lg="8" :xs="24">
        <sdCards headless>
          <OverviewSalesCard>
            <div class="icon-box box-primary">
              <SvgConverter
                :src="require('@/static/img/icon/New Customer.svg')"
              />
            </div>
            <div class="card-chunk">
              <CardBarChart2>
                <h2>{{ household_population }}</h2>
                <span>Total HouseHold Population</span>
              </CardBarChart2>
            </div>
          </OverviewSalesCard>
        </sdCards>

        <sdCards headless>
          <OverviewSalesCard>
            <div class="icon-box box-secondary">
              <SvgConverter
                :src="require('../../static/img/icon/SalesRevenue.svg')"
              />
            </div>
            <div class="card-chunk">
              <CardBarChart2>
                <h2>{{ total_nets_required }}</h2>
                <span>Total Nets Required</span>
              </CardBarChart2>
            </div>
          </OverviewSalesCard>
        </sdCards>

        <sdCards headless>
          <OverviewSalesCard>
            <div class="icon-box box-secondary">
              <SvgConverter
                :src="require('../../static/img/icon/SalesRevenue.svg')"
              />
            </div>
            <div class="card-chunk">
              <CardBarChart2>
                <h2>0</h2>
                <span>Total Actual Nets Allocation </span>
              </CardBarChart2>
            </div>
          </OverviewSalesCard>
        </sdCards>
      </a-col>
      <a-col :lg="16" :xs="24">
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
    </a-row>
  </Main>
</template>
<script>
import { CardBarChart2, EChartCard } from "./style";
import Chart from "../../components/utilities/chartjs";
import { Main } from "../styled";
import { onMounted, ref } from "vue";
import { defineComponent, defineAsyncComponent } from "vue";
import authHeader from "../../services/auth-header";

const IncomeAndExpenses = defineAsyncComponent(() =>
  import("./overview/business/IncomeAndExpenses")
);

const WebsitePerformance = defineAsyncComponent(() =>
  import("./overview/performance/WebsitePerformance")
);

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

export default defineComponent({
  name: "CRM",
  components: {
    Main,
    CardBarChart2,
    EChartCard,
    Chart,
    WebsitePerformance,
    IncomeAndExpenses,
  },
  data() {
    return {};
  },
  setup() {
    const active_events = ref(0);
    const nets_distributed = ref(0);
    const registered_house_holds = ref(0);
    const registered_users = ref(0);
    const household_population = ref(0);
    const total_nets_required = ref(0);
    const activities = ref(0);
    // const actual_allocation = ref(0);
    // const system_allocation = ref(0);

    // console.log(sessionStorage.getItem("user"));
    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/dash_stats`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log(data);
        active_events.value = data.active_events;
        nets_distributed.value = data.nets_distributed;
        registered_house_holds.value = data.registered_house_holds;
        registered_users.value = data.registered_users;
        household_population.value = data.all_hh_members;
        total_nets_required.value = data.sys_allocation;
        activities.value = data.active_activities;
        // actual_allocation = data.
        // console.log(data.active_events);
      } catch (error) {
        console.error(error);
      }
    });

    return {
      chartOptions,
      active_events,
      nets_distributed,
      registered_house_holds,
      registered_users,
      household_population,
      total_nets_required,
      activities,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (!sessionStorage.getItem("user")) {
      next("/auth/login");
    } else {
      next();
    }
  },
});
</script>
<style scoped>
.icon-color-white {
  color: white;
}
</style>
