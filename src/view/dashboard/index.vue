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
                <sdHeading as="h3">{{ registered_users }}</sdHeading>
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
                <sdHeading as="h3">{{ activities }}</sdHeading>
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
                <sdHeading as="h3">{{ active_events }}</sdHeading>
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
                <sdHeading as="h3">{{ registered_house_holds }}</sdHeading>
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
                <sdHeading as="h3">{{ household_population }}</sdHeading>
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
                <sdHeading as="h3">{{ total_nets_required }}</sdHeading>
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
                <sdHeading as="h3">{{ nets_distributed }}</sdHeading>
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
        <a-col :xxl="12" :md="12" :sm="24" :xs="24">
          <sdCards headless>
            <EChartCard>
              <div class="chart-container">
                <highcharts :options="chartOptions" style="width: 100%;"></highcharts>
              </div>
            </EChartCard>
          </sdCards>
        </a-col>

        <a-col :xxl="12" :md="12" :sm="24" :xs="24">
          <sdCards headless>
            <EChartCard>
              <div class="chart-container">
                <highcharts :options="pieOptions" style="width: 100%;"></highcharts>
              </div>
            </EChartCard>
          </sdCards>
        </a-col>
      </a-row>
      <a-row :gutter="25">
        <a-col :xxl="24" :md="24" :sm="24" :xs="24">
          <sdCards headless>
            <EChartCard>
              <div class="chart-container">
                <highcharts :options="newChartOptions" style="width: 100%;"></highcharts>
              </div>
            </EChartCard>
          </sdCards>
        </a-col>

      </a-row>
  </div>

  </Main>
</template>
<script >
import { CardBarChart2, EChartCard } from "./style";
import { Main } from "../styled";
import { onMounted, ref } from "vue";
import { defineComponent } from "vue"; //defineAsyncComponent
import authHeader from "../../services/auth-header";
import Highcharts from 'highcharts';

export default defineComponent({
  name: "Dashboard",
  components: {
    Main,
    CardBarChart2,
    EChartCard,
  },
  data() {
    return {
      pieOptions: {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Household Registration by Subcounty'
        },
        series: [{
          name: 'Household Registered by Subcounty',
          data: [
            { name: 'Homa Bay Town Sub County', y: 27666 },
            { name: 'Kabondo Kasipul Sub County', y: 26572 },
            { name: 'Karachuonyo Sub County', y: 42745 }, 
            { name: 'Suba North Sub County', y: 23654 }, 
            { name: 'Ndhiwa Sub County', y: 48208 }, 
            { name: 'Rachuonyo South Sub County', y: 29782 },
            { name: 'Rangwe Sub County', y: 28792 }, 
            { name: 'Suba South Sub County', y: 26141 },
            { name: 'Suba Central Sub County', y: 5163 }, 
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

    // set intervals for 3 seconds

    // setInterval(data, 3000);

    const chartData = data.data.map(item => ({
      name: item.name,
      nets_required: parseInt(item.nets_required),
      total_issues: parseInt(item.total_issues)
    }));


    const newChartDataResponse = await fetch(
      `${process.env.VUE_APP_BASE_URL}/subcounty/stats?county_id=nK0A12Q7MvS`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );


    const newChartData = await newChartDataResponse.json();

    // setInterval(newChartData, 3000);

    const newChartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Subcounty Comparison'
      },
      xAxis: {
        categories: newChartData.data.map(item => item.name)
      },
      yAxis: {
        title: {
          text: 'Values'
        }
      },
      series: [
      {
        name: 'Population',
        data: newChartData.data.map(item => parseInt(item.population)),
        color: '#f39c12'
      },{
        name: 'Households Registered',
        data: newChartData.data.map(item => item.households_registered),
        color: '#3498db' 
      },
      {
        name: 'Nets Required',
        data: newChartData.data.map(item => parseInt(item.nets_required)),
        color: '#6A8ABC'
      }, {
        name: 'Nets Issued',
        data: newChartData.data.map(item => item.nets_issued),
        color: '#2ecc71'
      }],
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true, // Enable exporting module
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG', 
              'downloadJPEG',
              'downloadPDF',
            ]
          }
        }
      },
    };

    return {
      // chartOptions,
      active_events,
      nets_distributed,
      registered_house_holds,
      registered_users,
      household_population,
      total_nets_required,
      activities,
      newChartOptions,
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
          data: chartData.map(item => item.total_issues),
          color: '#2ecc71'
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
/* Additional styles for better responsiveness */
.chart-container {
  width: 100%;
}

/* Media queries for smaller screens */
@media screen and (max-width: 767px) {
  .chart-container {
    /* Adjust any additional styles for smaller screens */
  }
}
</style>
