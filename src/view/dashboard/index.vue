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
          <a-col v-if="filterAccessList.includes('country')">
            <a-select v-model:value="country" show-search placeholder="Select Country" style="width: 200px"
              :options="countries" :filter-option="filterOption" @change="handleChange($event, 'country')"></a-select>
          </a-col>
          <a-col v-if="filterAccessList.includes('county')">
            <a-select v-model:value="county" show-search placeholder="Select County" style="width: 200px"
              :options="counties" :filter-option="filterOption" @change="handleChange($event, 'county')"></a-select>
          </a-col>
          <a-col v-if="filterAccessList.includes('subcounty')">
            <a-select v-model:value="subcounty" show-search placeholder="Select Sub County" style="width: 200px"
              :options="subcounties" :filter-option="filterOption" @change="handleChange($event, 'subcounty')"></a-select>
          </a-col>
          <a-col v-if="filterAccessList.includes('ward')">
            <a-select v-model:value="ward" show-search placeholder="Select Ward" style="width: 200px" :options="wards"
              :filter-option="filterOption" @change="handleChange($event, 'ward')"></a-select>
          </a-col>
          <a-col v-if="filterAccessList.includes('location')">
            <a-select v-model:value="location" show-search placeholder="Select Location" style="width: 200px"
              :options="locations" :filter-option="filterOption" @change="handleChange($event, 'location')"></a-select>
          </a-col>
          <a-col v-if="filterAccessList.includes('sublocation')">
            <a-select v-model:value="sublocation" show-search placeholder="Select Sub Location" style="width: 200px"
              :options="sublocations" :filter-option="filterOption"
              @change="handleChange($event, 'subcounty')"></a-select>
          </a-col>
        </a-row>
      </template>
    </sdPageHeader>
    <a-row :gutter="25">
      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless style="background:#D0F0C0;color:rgb(27, 19, 19)">
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h3">{{ new Intl.NumberFormat().format(registered_users) }}</sdHeading>
                <span>Registered Users</span>
                <p></p>
              </CardBarChart2>
            </div>
          </EChartCard>
        </sdCards>
      </a-col>
      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless style="background:#00A86B;color:rgb(27, 19, 19)">
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h3">{{ new Intl.NumberFormat().format(activities) }}</sdHeading>
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
        <sdCards headless style="background:#00A86B;color:rgb(27, 19, 19)">
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h3">{{ new Intl.NumberFormat().format(active_events) }}</sdHeading>
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
            <sdCards headless  style="background:#3498db;color:whitesmoke">
              <EChartCard>
                <div class="card-chunk">
                  <CardBarChart2>
                    <sdHeading as="h3">{{ new Intl.NumberFormat().format(total_nets_required) }}</sdHeading>
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
          <sdCards headless style="background:#D0F0C0;color:rgb(27, 19, 19)">
            <EChartCard>
              <div class="card-chunk">
                <CardBarChart2>
                  <sdHeading as="h3">{{ new Intl.NumberFormat().format(registered_house_holds) }}</sdHeading>
                  <span>Registered HouseHolds</span>
                  <p>
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
            <sdCards headless style="background:#8A9A5B;color:rgb(27, 19, 19)">
              <EChartCard>
                <div class="card-chunk">
                  <CardBarChart2>
                    <sdHeading as="h3">{{ new Intl.NumberFormat().format(totalhouseholds_served) }}</sdHeading>
                    <span>Total HouseHolds Served</span>
                    <p>
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
            <sdCards headless style="background:#8A9A5B;color:rgb(27, 19, 19)">
              <EChartCard>
                <div class="card-chunk">
                  <CardBarChart2>
                    <sdHeading as="h3">{{ new Intl.NumberFormat().format(household_population) }}</sdHeading>
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
        <sdCards headless  style="background:#4adede;color:whitesmoke">
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading as="h3">{{ new Intl.NumberFormat().format(nets_distributed) }}</sdHeading>
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
       <a-row :gutter="5" v-show="wards !== null">
         <a-col :xxl="8" :md="8" :sm="8" :xs="8">
            <figure class="highcharts-figure">
              <div id="HouseholdsRegisteredbyCountyChart"></div>
            </figure>
          </a-col>
          <a-col :xxl="8" :md="8" :sm="8" :xs="8">
            <figure class="highcharts-figure">
              <div id="HouseHoldsServedbyCountyChart"></div>
            </figure>
          </a-col>
          <a-col :xxl="8" :md="8" :sm="8" :xs="8">
              <figure class="highcharts-figure">
                <div id="NetsIssuedbyCountyChart"></div>
              </figure>
            </a-col>
        </a-row>
      <a-row :gutter="25">
        <a-col :xxl="24" :md="24" :sm="24" :xs="24">
          <figure class="highcharts-figure">
            <div id="householdRegvsServedChart"></div>
          </figure>
        </a-col>
      </a-row>
    <a-row :gutter="25">
      <a-col :xxl="24" :md="24" :sm="24" :xs="24">
        <figure class="highcharts-figure">
          <div id="netsReqvsIssuedChart"></div>
        </figure>
      </a-col>
    </a-row>
    </div>
    <a-notification :message="errorMessage" type="error" :description="errorDescription" :showIcon="true" :duration="0"
      :style="{ width: '100%' }" />
  </Main>
</template>
<script setup>
import { CardBarChart2, EChartCard } from "./style";
import { Main } from "../styled";
import { onMounted, ref } from "vue";
//import { defineComponent } from "vue"; //defineAsyncComponent
//import authHeader from "../../services/auth-header";
import Highcharts from 'highcharts';
import axios from '@/Axiosconfig';
import { notification } from "ant-design-vue";

    const active_events = ref(0);
    const nets_distributed = ref(0);
    const registered_house_holds = ref(0);
    const registered_users = ref(0);
    const household_population = ref(0);
    const total_nets_required = ref(0);
    const activities = ref(0);
    const newChartData = ref([])
    const countries = ref([{ value: "HfVjCurKxh2", label: "Kenya" }])
    const counties = ref(null)
    const subcounties = ref(null)
    const wards = ref(null)
    const locations = ref(null)
    const sublocations = ref(null)
    const chartOptions = ref({})
    const access_level = ref({})
    const filterAccessList = ref([])
    const totalhouseholds_served = ref([])


    onMounted(async () => {
      if (sessionStorage.getItem("user") != null) {
        access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
        updateFilters()
        fetchInitialChartData()
        updateStats()
      }
    });

    const updateFilters = () => {
      access_level.value.level.level_name = 'county'
      access_level.value.location.org_id = 'nK0A12Q7MvS'
      access_level.value.location.name = 'Homa Bay County'

      if (access_level.value.level.level_name.toLowerCase() == 'national') {
        filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation']
        fetchCounties()
      } else if (access_level.value.level.level_name.toLowerCase() == 'county') {
        filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation']
        counties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
      } else if (access_level.value.level.level_name.toLowerCase() == 'subcounty') {
        filterAccessList.value = ['subcounty', 'ward', 'location', 'sublocation']
        subcounties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
      } else if (access_level.value.level.level_name.toLowerCase() == 'ward') {
        filterAccessList.value = ['ward', 'location', 'sublocation']
        wards.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
      } else if (access_level.value.level.level_name.toLowerCase() == 'location') {
        filterAccessList.value = ['location', 'sublocation']
        locations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
      } else if (access_level.value.level.level_name.toLowerCase() == 'sublocation') {
        filterAccessList.value = ['sublocation']
        sublocations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
      }
    }

    const handleChange = async (org_id, org_level) => {
      //fetch child data
      fetchChildData(org_id, org_level)
    };

    const fetchChildData = async (org_id, org_level) => {
      let fetchUrl = ``
      let statUrl = ``
      if (org_level == 'country') {//get counties
        fetchUrl = `get_sub_counties_list?parent_id=${org_id}`
        statUrl = `subcounty/stats?org_id=${org_id}`
      } else if (org_level == 'county') {//get subcounties
        fetchUrl = `get_sub_counties_list?parent_id=${org_id}`
        statUrl = `subcounty/stats?org_id=${org_id}`
      } else if (org_level == 'subcounty') {//get wards
        fetchUrl = `get_sub_counties_list?parent_id=${org_id}`
        statUrl = `subcounty/stats?org_id=${org_id}`
      } else if (org_level == 'ward') {//get locatios
        fetchUrl = `get_sub_counties_list?parent_id=${org_id}`
        statUrl = `subcounty/stats?org_id=${org_id}`
      } else if (org_level == 'location') {//get sub locatios
        fetchUrl = `get_sub_counties_list?parent_id=${org_id}`
        statUrl = `subcounty/stats?org_id=${org_id}`
      } else if (org_level == 'sublocation') {//get sublocations stats
        statUrl = `subcounty/stats?org_id=${org_id}`
      }
      await axios.get(`${fetchUrl}`)
        .then(response => {
          if (org_level == 'country') {//get county stats
            counties.value = response.data.message.map(x => ({
              value: x.org_id,
              label: x.name
            })).filter(e => e.value == 'nK0A12Q7MvS');
            //counties.value.splice(0, 1)
          } else if (org_level == 'county') {//get county stats
            subcounties.value = response.data.message.map(x => ({
              value: x.org_id,
              label: x.name
            }));
          } else if (org_level == 'subcounty') {//get sub county stats
            wards.value = response.data.message.map(x => ({
              value: x.org_id,
              label: x.name
            }));
          } else if (org_level == 'ward') {//get ward stats
            locations.value = response.data.message.map(x => ({
              value: x.org_id,
              label: x.name
            }));
          } else if (org_level == 'location') {//get location stats
            sublocations.value = response.data.message.map(x => ({
              value: x.org_id,
              label: x.name
            }));
          }
        }).then(async () => {
          await axios.get(`${statUrl}`)
            .then(response => {
              newChartData.value = response.data.data;
              //column Subcounty comparison
              householdRegvsServedChart(
                newChartData.value.map(item => parseInt(item.households_registered)),//registered
                newChartData.value.map(item => parseInt(item.households_served)),//served
                newChartData.value.map(item => (parseInt(item.households_served) / parseInt(item.households_registered)) * 100),//(registered/served)*100
                newChartData.value.map(item => (parseInt(item.households_registered) / parseInt(item.households_registered)) * 100),//(registered/registered)*100
                newChartData.value.map(item => item.name),//cats
                org_level,
              )
              //combine bar line bar Subcounty comparison
              netsReqvsIssuedChart(
                newChartData.value.map(item => parseInt(item.nets_required)),//nets_required
                newChartData.value.map(item => parseInt(item.nets_issued)),//nets_issued
                newChartData.value.map(item => (parseInt(item.nets_issued) / parseInt(item.nets_required)) * 100),//(nets_issued/nets_required)*100
                newChartData.value.map(item => (parseInt(item.nets_required) / parseInt(item.nets_required)) * 100),//(nets_required/nets_required)*100
                newChartData.value.map(item => item.name),//cats
                org_level,
              )

              //pie chars Registered households by sub county
              let pieOptionsData = newChartData.value.map(item => ({ name: item.name, y: item.households_registered }))
              let chartData = newChartData.value.map(item => ({ name: item.name, y: item.households_served }))
              let netsIssuedData= newChartData.value.map(item => ({ name: item.name, y: parseInt(item.nets_issued) }))
              HouseHoldRegisteredbyCoountyChart(pieOptionsData,org_level)
              HouseHoldsServedbyCountyChart(chartData, org_level)
              NetsIssuedbyCountyChart(netsIssuedData, org_level)
            })
        }).catch(error => {
          notification.error({
            message: `Error!`,
            description: `${error}`,
          });
        });
    }

    const fetchCounties = async () => {
      axios.get('counties/')
        .then(response => {
          counties.value = response.data.map(x => ({
            value: x.org_id,
            label: x.name
          })).filter(e=>e.value == 'nK0A12Q7MvS');
        }).catch(error => {
          notification.error({
            message: `Error!`,
            description: `${error}`,
          });
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
          totalhouseholds_served.value= data.registered_house_holds;
          registered_users.value = data.registered_users;
          household_population.value = data.all_hh_members;
          total_nets_required.value = data.sys_allocation;
          activities.value = data.active_activities;
          // actual_allocation = data.
          // console.log(data.active_events);
        }).catch(error => {
          notification.error({
            message: `Error!`,
            description: `${error}`,
          });
          console.error(error);
        });
    }

    const fetchInitialChartData = async () => {
          axios.get(`/subcounty/stats?org_id=${access_level.value.location.org_id}`)
            .then(response1 => {
              newChartData.value = response1.data
              //nets_required,nets_issued,target_data,target_level,cats
              netsReqvsIssuedChart(
                newChartData.value.data.map(item => parseInt(item.nets_required)),//nets_required
                newChartData.value.data.map(item => parseInt(item.nets_issued)),//nets_issued
                newChartData.value.data.map(item => (parseInt(item.nets_issued) / parseInt(item.nets_required)) * 100),//(nets_issued/nets_required)*100
                newChartData.value.data.map(item => (parseInt(item.nets_required) / parseInt(item.nets_required)) * 100),//(nets_required/nets_required)*100
                newChartData.value.data.map(item => item.name),//cats
                access_level.value.level.level_name,//level
              )
              //registered,served,target_data,target_level,cats
              householdRegvsServedChart(
                newChartData.value.data.map(item => parseInt(item.households_registered)),//registered
                newChartData.value.data.map(item => parseInt(item.households_served)),//served
                newChartData.value.data.map(item => (parseInt(item.households_served) / parseInt(item.households_registered)) * 100),//(registered/served)*100
                newChartData.value.data.map(item => (parseInt(item.households_registered) / parseInt(item.households_registered)) * 100),//(registered/registered)*100
                newChartData.value.data.map(item => item.name),//cats
                access_level.value.level.level_name,//level
              )
        }).catch(error => {
          notification.error({
            message: `Error!`,
            description: `${error}`,
          });
        })
}
//chart functions
const HouseHoldRegisteredbyCoountyChart = (data,orglevel) => {
      Highcharts.chart('HouseholdsRegisteredbyCountyChart', {
      chart: {
          type: 'pie'
        },
        title: {
          text: `Households Registered by ${orglevel}`,
          align:'left',
        },
         subtitle: {
          text: orglevel,
          align: 'left'
        },
        tooltip: {
          valueSuffix: ''
        },
        plotOptions: {
          series: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: [{
              enabled: true,
              distance: 10
            }, {
              enabled: true,
              distance: -40,
              format: '{point.percentage:.1f}%',
              style: {
                fontSize: '1.2em',
                textOutline: 'none',
                opacity: 0.7
              },
              filter: {
                operator: '>',
                format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
                property: 'percentage',
                value: 10
              }
            }]
          }
        },
        series: [
          {
            name: 'Count',
            colorByPoint: true,
            data: data,
          }
        ]
      });
}
const HouseHoldsServedbyCountyChart = (charData,orglevel) => {
  (function (H) {
    H.seriesTypes.pie.prototype.animate = function (init) {
      const series = this,
        chart = series.chart,
        points = series.points,
        {
          animation
        } = series.options,
        {
          startAngleRad
        } = series;

      function fanAnimate(point, startAngleRad) {
        const graphic = point.graphic,
          args = point.shapeArgs;

        if (graphic && args) {

          graphic
            // Set inital animation values
            .attr({
              start: startAngleRad,
              end: startAngleRad,
              opacity: 1
            })
            // Animate to the final position
            .animate({
              start: args.start,
              end: args.end
            }, {
              duration: animation.duration / points.length
            }, function () {
              // On complete, start animating the next point
              if (points[point.index + 1]) {
                fanAnimate(points[point.index + 1], args.end);
              }
              // On the last point, fade in the data labels, then
              // apply the inner size
              if (point.index === series.points.length - 1) {
                series.dataLabelsGroup.animate({
                  opacity: 1
                },
                  void 0,
                  function () {
                    points.forEach(point => {
                      point.opacity = 1;
                    });
                    series.update({
                      enableMouseTracking: true
                    }, false);
                    chart.update({
                      plotOptions: {
                        pie: {
                          innerSize: '40%',
                          borderRadius: 8
                        }
                      }
                    });
                  });
              }
            });
        }
      }

      if (init) {
        // Hide points on init
        points.forEach(point => {
          point.opacity = 0;
        });
      } else {
        fanAnimate(points[0], startAngleRad);
      }
    };
  }(Highcharts));

  Highcharts.chart('HouseHoldsServedbyCountyChart', {
    chart: {
      type: 'pie'
    },
    title: {
      text: `Households Served by ${orglevel}`,
      align: 'left'
    },
    subtitle: {
      text: orglevel,
      align: 'left'
    },
    tooltip: {
      pointFormat: '{point.name}: <b>{point.y}</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: [{
          enabled: true,
          distance: 10
        }, {
          enabled: true,
          distance: -40,
          format: '{point.percentage:.1f}%',
          style: {
            fontSize: '1.2em',
            textOutline: 'none',
            opacity: 0.7
          },
          filter: {
            operator: '>',
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            property: 'percentage',
            value: 10
          }
        }]
      }
    },
    series: [{
      // Disable mouse tracking on load, enable after custom animation
      enableMouseTracking: false,
      animation: {
        duration: 2000
      },
      colorByPoint: true,
      data: charData,
    }]
  });

}
const NetsIssuedbyCountyChart = (charData, orglevel) => {
  Highcharts.chart('NetsIssuedbyCountyChart', {
    chart: {
      type: 'pie'
    },
    title: {
      text: `Nets Issued by ${orglevel}`,
      align:'left',
    },
     subtitle: {
      text: orglevel,
      align: 'left'
    },
    tooltip: {
      valueSuffix: ''
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: [{
          enabled: true,
          distance: 10
        }, {
          enabled: true,
          distance: -40,
          format: '{point.percentage:.1f}%',
          style: {
            fontSize: '1.2em',
            textOutline: 'none',
            opacity: 0.7
          },
          filter: {
            operator: '>',
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            property: 'percentage',
            value: 10
          }
        }]
      }
    },
    series: [
      {
        name: 'Count',
        colorByPoint: true,
        data: charData,
      }
    ]
  });
}
const netsReqvsIssuedChart = (nets_required, nets_issued, target_data, target_level, cats,orglevel) => {
      Highcharts.chart('netsReqvsIssuedChart', {
        chart: {
          zoomType: 'xy'
        },
        title: {
          text: `Comparison by ${orglevel}`,
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
          min:0,
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
            text: '',
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
          min:0,
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
          color: '#4ADEDE',
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
const householdRegvsServedChart = (registered, served, target_data, target_level, cats,orglevel) => {
  Highcharts.chart('householdRegvsServedChart', {
    chart: {
      zoomType: 'xy'
    },
    title: {
      text: `Comparison by ${orglevel}`,
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
      min:0,
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
        text: '',
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
      min:0,
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
      name: 'Registered Households',
      type: 'column',
      yAxis: 1,
      data: registered,
      color: '#3498db',
    }, {
      name: 'Served Households',
      type: 'column',
      yAxis: 1,
      data: served,
      color: '#4ADEDE',
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
