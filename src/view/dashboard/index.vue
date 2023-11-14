<template>
  <Main>
    <sdPageHeader title="DigiMal KE Dashboard">
      <template v-slot:buttons>
        <div class="page-header-actions">
          <router-link v-bind:to="'campaigns/create-campaign'">
            <!-- <sdButton size="small" type="success">
              <sdFeatherIcons type="plus" size="14" class="icon-color-white" />
              Create Campaign
            </sdButton> -->
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
                <sdHeading as="h1">{{ registered_users }}</sdHeading>
                <span>Registered Users</span>
                <p></p>
              </CardBarChart2>
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
                </p>
              </CardBarChart2>
            </div>
            <div class="card-chunk">
              <Chart
                class="downward"
                :height="0"
                :labels="[]"
                :style="{
                  marginBottom: '-5',
                }"
                :datasets="[
                  {
                    data: [],
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
                :height="0"
                :labels="[]"
                :style="{
                  marginBottom: '-5',
                }"
                :datasets="[
                  {
                    data: [],
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
                :height="0"
                :labels="[]"
                :style="{
                  marginBottom: '-5',
                }"
                :datasets="[
                  {
                    data: [],
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
      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless>
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h1">{{ household_population }}</sdHeading>
                <span>Total HouseHold Population</span>
                <p>
                  <!--<span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                  <span>Since last week</span>-->
                </p>
              </CardBarChart2>
            </div>
            <div class="card-chunk">
              <Chart
                class="visitors"
                :height="0"
                :labels="[]"
                :style="{
                  marginBottom: '-5',
                }"
                :datasets="[
                  {
                    data: [],
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
      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless>
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h1">{{ total_nets_required }}</sdHeading>
                <span>Total Nets Required</span>
                <p>
                  <!--<span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                  <span>Since last week</span>-->
                </p>
              </CardBarChart2>
            </div>
            <div class="card-chunk">
              <Chart
                class="visitors"
                :height="0"
                :labels="[]"
                :style="{
                  marginBottom: '-5',
                }"
                :datasets="[
                  {
                    data: [],
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
                :height="0"
                :labels="[]"
                :style="{
                  marginBottom: '-5',
                }"
                :datasets="[
                  {
                    data: [],
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
    </a-row>
    <div>
    <a-row :gutter="25">
      <a-col :xxl="12" :md="12" :sm="12" :xs="24">
        <sdCards headless>
          <EChartCard>
            <div class="chart-container">
              <highcharts :options="chartOptions"></highcharts>
            </div>
          </EChartCard>
        </sdCards>
      </a-col>

      <a-col :xxl="12" :md="12" :sm="12" :xs="24">
        <sdCards headless>
          <EChartCard>
            <div class="chart-container">
              <highcharts :options="pieOptions"></highcharts>
            </div>
          </EChartCard>
        </sdCards>
      </a-col>
    </a-row>
  </div>

  </Main>
</template>
<script>
import { CardBarChart2, EChartCard } from "./style";
// import Chart from "../../components/utilities/chartjs";
import { Main } from "../styled";
import { onMounted, ref } from "vue";
import { defineComponent } from "vue"; //defineAsyncComponent
import authHeader from "../../services/auth-header";
// import { Bar } from 'ant-design-vue';
import Highcharts from 'highcharts';
// import HighchartsVue from 'highcharts-vue';

// );
// const chartOptions = {
//   legend: {
//     display: false,
//     labels: {
//       display: false,
//     },
//   },
//   scales: {
//     yAxes: [
//       {
//         stacked: true,
//         gridLines: {
//           display: false,
//         },
//         ticks: {
//           display: false,
//         },
//       },
//     ],
//     xAxes: [
//       {
//         stacked: true,
//         gridLines: {
//           display: false,
//         },
//         ticks: {
//           display: false,
//         },
//       },
//     ],
//   },
// };
export default defineComponent({
  name: "CRM",
  components: {
    Main,
    CardBarChart2,
    EChartCard,
    // Bar,
    // HighchartsVue,
  },
  data() {
    return {
      // chartOptions: {
      //   chart: {
      //     type: 'bar'
      //   },
      //   title: {
      //     text: 'Nets Required vs Nets Issued'
      //   },
      //   xAxis: {
      //     categories: ['Post 1', 'Post 2', 'Post 3'] // Replace with your subcounties
      //   },
      //   yAxis: {
      //     title: {
      //       text: 'Number of Nets'
      //     }
      //   },
      //   series: [{
      //     name: 'Nets Required',
      //     data: [100, 200, 150] // Replace with your data for Nets Required
      //   }, {
      //     name: 'Nets Issued',
      //     data: [80, 150, 120] // Replace with your data for Nets Issued
      //   }],
      //   credits: {
      //       enabled: false
      //   },
      // },

      pieOptions: {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Household Registration by Subcounty'
        },
        series: [{
          name: 'Household Registration',
          data: [
            { name: 'Subcounty 1', y: 150 }, // Replace with your data for Subcounty 1
            { name: 'Subcounty 2', y: 200 }, // Replace with your data for Subcounty 2
            { name: 'Subcounty 3', y: 100 }, // Replace with your data for Subcounty 3
          ]
        }],
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y}',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        credits: {
            enabled: false
        },
      }
    };
  },
  async setup() {
    const active_events = ref(0);
    const nets_distributed = ref(0);
    const registered_house_holds = ref(0);
    const registered_users = ref(0);
    const household_population = ref(0);
    const total_nets_required = ref(0);
    const activities = ref(0);

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


   
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/post/stats?sublocation_id=3488`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );

    const data = await response.json();

    const chartData = data.data.map(item => ({
      name: item.name,
      nets_required: parseInt(item.nets_required),
      total_issues: parseInt(item.total_issues)
    }));

    return {
      // chartOptions,
      active_events,
      nets_distributed,
      registered_house_holds,
      registered_users,
      household_population,
      total_nets_required,
      activities,
      chartOptions: {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Nets Required vs Nets Issued'
        },
        xAxis: {
          categories: chartData.map(item => item.name)
        },
        yAxis: {
          title: {
            text: 'Number of Nets'
          }
        },
        series: [{
          name: 'Nets Required',
          data: chartData.map(item => item.nets_required)
        }, {
          name: 'Nets Issued',
          data: chartData.map(item => item.total_issues)
        }],
        credits: {
          enabled: false
        }
      }
    };
  },
});
</script>
<style scoped>
.icon-color-white {
  color: white;
}
.chart-container {
  margin: 10px; /* Adjust the margin as needed to create space between charts */
}
</style>
