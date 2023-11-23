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
        <a-row>
          <a-col>
            <a-select v-model:value="county" show-search placeholder="Select County" style="width: 200px"
              :options="counties" :filter-option="filterOption" @change="handleChange"></a-select>
            <a-select v-model:value="subcounty" show-search placeholder="Select Sub County" style="width: 200px"
              :options="subcounties" :filter-option="filterOption" @change="handleChange"></a-select>
            <a-select v-model:value="ward" show-search placeholder="Select Ward" style="width: 200px" :options="wards"
              :filter-option="filterOption" @change="handleChange"></a-select>
            <a-select v-model:value="location" show-search placeholder="Select Location" style="width: 200px"
              :options="locations" :filter-option="filterOption" @change="handleChange"></a-select>
            <a-select v-model:value="sublocation" show-search placeholder="Select Sub Location" style="width: 200px"
              :options="sublocations" :filter-option="filterOption" @change="handleChange"></a-select>
          </a-col>
        </a-row>
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
              <Chart class="downward" :height="0" :labels="[]" :style="{
                marginBottom: '-5',
              }" :datasets="[
  {
    data: [],
    backgroundColor: '#E8FAF4',
    hoverBackgroundColor: '#20C997',
    label: 'Nets Distributed',
    barPercentage: 1,
  },
]" :options="chartOptions" />
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
              <Chart class="upward" :height="0" :labels="[]" :style="{
                marginBottom: '-5',
              }" :datasets="[
  {
    data: [],
    backgroundColor: '#E8FAF4',
    hoverBackgroundColor: '#20C997',
    label: 'Avg Orders',
    barPercentage: 1,
  },
]" :options="chartOptions" />
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
              <Chart class="visitors" :height="0" :labels="[]" :style="{
                marginBottom: '-5',
              }" :datasets="[
  {
    data: [],
    backgroundColor: '#E8FAF4',
    hoverBackgroundColor: '#20C997',
    label: 'Visitors',
    barPercentage: 1,
  },
]" :options="chartOptions" />
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
              <Chart class="visitors" :height="0" :labels="[]" :style="{
                marginBottom: '-5',
              }" :datasets="[
  {
    data: [],
    backgroundColor: '#E8FAF4',
    hoverBackgroundColor: '#20C997',
    label: 'Visitors',
    barPercentage: 1,
  },
]" :options="chartOptions" />
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
              <Chart class="visitors" :height="0" :labels="[]" :style="{
                marginBottom: '-5',
              }" :datasets="[
  {
    data: [],
    backgroundColor: '#E8FAF4',
    hoverBackgroundColor: '#20C997',
    label: 'Visitors',
    barPercentage: 1,
  },
]" :options="chartOptions" />
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
              <Chart class="growth" :height="0" :labels="[]" :style="{
                marginBottom: '-5',
              }" :datasets="[
  {
    data: [],
    backgroundColor: '#E8FAF4',
    hoverBackgroundColor: '#20C997',
    label: 'Orders',
    barPercentage: 1,
  },
]" :options="chartOptions" />
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
                <highcharts :options="chartOptions" ref="" style="width: 100%;"></highcharts>
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
      <a-row :gutter="25">
        <a-col :xxl="24" :md="24" :sm="24" :xs="24">
          <figure class="highcharts-figure">
            <div id="combinedchart"></div>
          </figure>
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
//import authHeader from "../../services/auth-header";
import Highcharts from 'highcharts';
import Swal from 'sweetalert2';
import axios from '@/Axiosconfig';

export default defineComponent({
  name: "Dashboard",
  components: {
    Main,
    CardBarChart2,
    EChartCard,
  },
  async setup() {
    const active_events = ref(0);
    const nets_distributed = ref(0);
    const registered_house_holds = ref(0);
    const registered_users = ref(0);
    const household_population = ref(0);
    const total_nets_required = ref(0);
    const activities = ref(0);
    const counties = ref([])
    const newChartData = ref([])

    const subcounties = ref([])
    const wards = ref([])
    const locations = ref([])
    const sublocations = ref([])
    const newChartOptions = ref({});
    const combineChartOptions = ref({});
    const chartOptions = ref({})
    const chartData = ref({})
    const pieOptions = ref({})


    const handleChange = async (county_id) => {
      await axios.get(`subcounty/stats?county_id=${county_id}`)
        .then(response => {
          //column Subcounty comparison
          newChartData.value = response.data.data;
          newChartOptions.value.xAxis.categories = newChartData.value.map(item => item.name);
          newChartOptions.value.series[0].data = newChartData.value.map(item => parseInt(item.households_registered));
          newChartOptions.value.series[1].data = newChartData.value.map(item => parseInt(item.households_served));
          //bar Registered vs Issued
          chartOptions.value.xAxis.categories = newChartData.value.map(item => item.name);
          chartOptions.value.series[0].data = newChartData.value.map(item => parseInt(item.nets_required))
          chartOptions.value.series[1].data = newChartData.value.map(item => parseInt(item.nets_issued))
          //combine bar line bar Subcounty comparison
          drawCombineChart(
            newChartData.value.map(item => parseInt(item.nets_required)),//nets_required
            newChartData.value.map(item => parseInt(item.nets_issued)),//nets_issued
            newChartData.value.map(item => (parseInt(item.nets_issued) / parseInt(item.nets_required)) * 100),//(nets_issued/nets_required)*100
            newChartData.value.map(item => (parseInt(item.nets_required) / parseInt(item.nets_required)) * 100),//(nets_required/nets_required)*100
            newChartData.value.map(item => item.name),//cats
          )
          //pie chars Registered households by sub county
          pieOptions.value.series[0].data = newChartData.value.map(item => ({ name: item.name, y: item.households_registered }))
        }).catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            html: error,
            timer: 3000,
          })
        })
    };

    const fetchFilterData = async () => {
      axios.get('counties/')
        .then(response => {
          counties.value = response.data.map(x => ({
            value: x.org_id,
            label: x.name
          }));
        }).catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            html: error,
            timer: 3000,
          })
        })
    }

    const filterOption = (input, option) => {
      return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const updateStats = async () => {
      await axios.get(`dash_stats`)
        .then(response => {
          const data = response.data;
          active_events.value = data.active_events;
          nets_distributed.value = data.nets_distributed;
          registered_house_holds.value = data.registered_house_holds;
          registered_users.value = data.registered_users;
          household_population.value = data.all_hh_members;
          total_nets_required.value = data.sys_allocation;
          activities.value = data.active_activities;
          // actual_allocation = data.
          // console.log(data.active_events);
        }).catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            html: error,
            timer: 3000,
          })
          console.error(error);
        });
    }

    onMounted(async () => {
      fetchInitialChartData()
      updateStats()
      fetchFilterData()
      const user = JSON.parse(sessionStorage.getItem("user")).location_id;
      console.log(user);
    });

    const drawCombineChart = (nets_required, nets_issued, target_data, target_level, cats) => {
      Highcharts.chart('combinedchart', {
        chart: {
          zoomType: 'xy'
        },
        title: {
          text: 'Comparison by ...',
          align: 'left'
        },
        subtitle: {
          text: 'Source:',
          align: 'left'
        },
        xAxis: [{
          categories: cats,
          crosshair: true
        }],
        yAxis: [{ // Primary yAxis
          labels: {
            format: '{value}%',
            style: {
              color: Highcharts.getOptions().colors[2]
            }
          },
          title: {
            text: 'Target',
            style: {
              color: Highcharts.getOptions().colors[2]
            }
          },
          max: 100,
          opposite: true

        }, { // Secondary yAxis
          gridLineWidth: 0,
          title: {
            text: 'Count',
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          labels: {
            // format: '{value} mm',
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          }

        }, { // Tertiary yAxis
          gridLineWidth: 0,
          title: {
            text: 'Expected Target',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          labels: {
            format: '{value} %',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          max: 100,
          opposite: true
        }],
        tooltip: {
          shared: true
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          x: 80,
          verticalAlign: 'top',
          y: 10,
          floating: true,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
        },
        series: [{
          name: 'Nets Required',
          type: 'column',
          yAxis: 1,
          data: nets_required,
          color: '#3498db',
        }, {
          name: 'Nets Issued',
          type: 'column',
          yAxis: 1,
          data: nets_issued,
          color: '#f39c12',
        }, {
          name: 'Expected Target',
          type: 'spline',
          yAxis: 2,
          data: target_level,
          color: Highcharts.getOptions().colors[1],
          marker: {
            enabled: false
          },
          dashStyle: 'shortdot',
          tooltip: {
            valueSuffix: ' %'
          },
          lineWidth: 6,
        }, {
          name: 'Target',
          type: 'spline',
          yAxis: 2,
          data: target_data,
          color: Highcharts.getOptions().colors[2],
          tooltip: {
            valueSuffix: ' %'
          }
        }],
        responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                floating: false,
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                x: 0,
                y: 0
              },
              yAxis: [{
                labels: {
                  align: 'right',
                  x: 0,
                  y: -6
                },
                showLastLabel: false
              }, {
                labels: {
                  align: 'left',
                  x: 0,
                  y: -6
                },
                showLastLabel: false
              }, {
                visible: false
              }]
            }
          }]
        }
      });
    }

    const fetchInitialChartData = async () => {
      axios.get(`post/stats?sublocation_id=3488`)
        .then(response => {
          chartData.value = response.data.data.map(item => ({
            name: item.name,
            nets_required: parseInt(item.nets_required),
            total_issues: parseInt(item.total_issues)
          }));
          chartOptions.value = {
            chart: {
              type: 'bar'
            },
            title: {
              text: 'Nets Required vs Nets Issued'
            },
            xAxis: {
              categories: chartData.value.map(item => item.name)
            },
            yAxis: {
              title: {
                text: 'Number of Nets'
              }
            },
            series: [{
              name: 'Nets Required',
              data: chartData.value.map(item => item.nets_required)
            }, {
              name: 'Nets Issued',
              data: chartData.value.map(item => item.total_issues),
              color: '#2ecc71'
            }],
            credits: {
              enabled: false
            }
          }
          axios.get(`/subcounty/stats?county_id=nK0A12Q7MvS`)
            .then(response1 => {
              newChartData.value = response1.data
              const pieOptionsData = newChartData.value.data.map(item => ({ name: item.name, y: item.households_registered }))
              newChartOptions.value = {
                chart: {
                  type: 'column',
                },
                title: {
                  text: 'Subcounty Comparison'
                },
                xAxis: {
                  categories: newChartData.value.data.map(item => item.name)
                },
                yAxis: {
                  title: {
                    text: 'Values'
                  }
                },
                series: [
                  {
                    name: 'Households Registered',
                    data: newChartData.value.data.map(item => item.households_registered),
                    color: '#3498db'
                  },

                  {
                    name: 'Household Served',
                    data: newChartData.value.data.map(item => parseInt(item.households_served)),
                    color: '#f39c12'
                  }
                ],
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
              }
              //nets_required,nets_issued,target_data,target_level,cats
              drawCombineChart(
                newChartData.value.data.map(item => parseInt(item.nets_required)),//nets_required
                newChartData.value.data.map(item => parseInt(item.nets_issued)),//nets_issued
                newChartData.value.data.map(item => (parseInt(item.nets_issued) / parseInt(item.nets_required)) * 100),//(nets_issued/nets_required)*100
                newChartData.value.data.map(item => (parseInt(item.nets_required) / parseInt(item.nets_required)) * 100),//(nets_required/nets_required)*100
                newChartData.value.data.map(item => item.name),//cats
              )
              pieOptions.value = {
                chart: {
                  type: 'pie'
                },
                title: {
                  text: 'Household Registration by Subcounty'
                },
                series: [{
                  name: 'Household Registered by Subcounty',
                  data: pieOptionsData,
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
            })
        }).catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            html: error,
            timer: 3000,
          })
        })
    }
    return {
      // chartOptions,
      active_events,
      nets_distributed,
      registered_house_holds,
      registered_users,
      household_population,
      total_nets_required,
      activities,
      //filters
      newChartData,
      counties,
      subcounties,
      wards,
      locations,
      sublocations,
      fetchInitialChartData,
      fetchFilterData,
      handleChange,
      filterOption,
      updateStats,
      drawCombineChart,
      //charts
      //charts options
      newChartOptions,
      combineChartOptions,
      chartOptions,
      pieOptions,
    };
  },
});
</script>
<style scoped>
.icon-color-white {
  color: white;
}

.chart-container {
  margin: 10px;
  /* Adjust the margin as needed to create space between charts */
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
