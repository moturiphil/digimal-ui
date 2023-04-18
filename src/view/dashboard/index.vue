<template>
  <sdPageHeader title="DigiMal KE Dashboard">
    <template v-slot:buttons>
      <div class="page-header-actions">
        <!-- <sdCalendarButton />
        <sdExportButton />
        <sdShareButton /> -->
        <router-link v-bind:to="'campaigns/create'">
          <sdButton size="small" type="success">
            <sdFeatherIcons type="plus" size="14" />
            Start Campaign
          </sdButton>
        </router-link>
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
                <sdHeading as="h1">{{ nets_distributed }}</sdHeading>
                <span>Nets Distributed</span>
                <p>
                  <!-- <span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                  <span>Since last week</span> -->
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
                <sdHeading as="h1">{{registered_users}}</sdHeading>
                <span>Registered Users</span>
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
      <a-col :xxl="16" :xs="24"
        ><Suspense>
          <template #default>
            <NetsDistributed title="Nets Distributed" :chartHeight="70" />
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
            <EventsDetails />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="12" :xl="12" :xs="24"
        ><Suspense>
          <template #default>
            <OnGoingEvents />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="12" :xs="24"
        ><Suspense>
          <template #default>
            <HouseHoldRegistered />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="24" :xl="12" :xs="24"
        ><Suspense>
          <template #default>
            <PerformancePerCounty />
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
import { defineAsyncComponent, onMounted, ref } from "vue";
import { defineComponent } from 'vue';
import authHeader from "../../services/auth-header";


// import { useRouter } from "vue-router";

const NetsDistributed = defineAsyncComponent(() =>
  import("./overview/massnet/NetsDistributed")
);
const PerformancePerCounty = defineAsyncComponent(() =>
  import("./overview/massnet/PerformancePerCounty")
);
const EventsDetails = defineAsyncComponent(() =>
  import("./overview/massnet/EventsDetails")
);
const OnGoingEvents = defineAsyncComponent(() =>
  import("./overview/massnet/OnGoingEvents")
);
const HouseHoldRegistered = defineAsyncComponent(() =>
  import("./overview/massnet/HouseHoldRegistered")
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
    NetsDistributed,
    PerformancePerCounty,
    EventsDetails,
    OnGoingEvents,
    HouseHoldRegistered,
  },
  data() {
    return {
    };
  },
  setup() {
    const active_events = ref(0);
    const nets_distributed= ref(0);
    const registered_house_holds= ref(0);
    const registered_users= ref(0);


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
        console.log(data.active_events);
        active_events.value = data.active_events;
        nets_distributed.value = data.nets_distributed;
        registered_house_holds.value = data.registered_house_holds;
        registered_users.value = data.registered_users;
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

