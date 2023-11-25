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
              @change="handleChange($event, 'sublocation')"></a-select>
          </a-col>
        </a-row>
      </template>
    </sdPageHeader>
    <a-row :gutter="25">
      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless class="stat-card">
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(registered_users) }}</sdHeading>
                <span class="stat-span">Registered Users</span>
              </CardBarChart2>
            </div>
          </EChartCard>
        </sdCards>
      </a-col>
      <a-col :xxl="6" :md="12" :sm="12" :xs="24">
        <sdCards headless  class="stat-card">
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(activities) }}</sdHeading>
                <span class="stat-span">Active Activities</span>
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
        <sdCards headless class="stat-card">
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(active_events) }}</sdHeading>
                <span class="stat-span">Active Events</span>
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
            <sdCards headless  class="stat-card">
              <EChartCard>
                <div class="card-chunk">
                  <CardBarChart2>
                    <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(total_nets_required) }}</sdHeading>
                    <span class="stat-span">Total Nets Required</span>
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
          <sdCards headless  class="stat-card">
            <EChartCard>
              <div class="card-chunk">
                <CardBarChart2>
                  <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(registered_house_holds) }}</sdHeading>
                  <span class="stat-span">Registered HouseHolds</span>
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
            <sdCards headless class="stat-card">
              <EChartCard>
                <div class="card-chunk">
                  <CardBarChart2>
                    <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(totalhouseholds_served) }}</sdHeading>
                    <span class="stat-span">Total HouseHolds Served</span>
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
            <sdCards headless  class="stat-card">
              <EChartCard>
                <div class="card-chunk">
                  <CardBarChart2>
                    <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(household_population) }}</sdHeading>
                    <span class="stat-span">Total HouseHold Population</span>
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
        <sdCards headless  class="stat-card">
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(nets_distributed) }}</sdHeading>
                <span class="stat-span">Nets Distributed</span>
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
      <a-col :xxl="24" :md="24" :sm="24" :xs="24">
        <div>
            <a-row :gutter="16">
              <a-col :span="12"  style="display:flex;flex-direction:row;">{{ dateFrom }}
                  <a-space direction="horizontal" :size="5">
                <a-select v-model:value="selectedFilter" show-search placeholder="Select Country" style="width: 200px;height:100%;"
                :options="dateFilters" :filter-option="filterOption" @change="handleFilterChange($event)"></a-select>
                <div :span="12" v-if="selectedFilter === 'custom'" style="display:flex;flex-direction:row;">
                  <a-date-picker :style="{ width: '100%' }" v-model:value="dateRange.dateFrom" :format="dateFormat" />
                  <a-date-picker v-model:value="dateRange.dateTo" :style="{ width: '100%' }" placeholder="Select Date To" @keypress="fetchNetsDistributed()" />
                </div>
                </a-space>
              </a-col>
            </a-row>
          </div>
          <figure class="highcharts-figure">
            <div id="NetsDistributedwithTime"></div>
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
//import { defineComponent } from "vue"; //defineAsyncComponent
//import authHeader from "../../services/auth-header";
import Highcharts from 'highcharts';
import axios from '@/Axiosconfig';
import { notification } from "ant-design-vue";
import { onMounted,ref ,watch,reactive} from 'vue';
import moment from "moment"

const active_events = ref(0);
const nets_distributed = ref(0);
const registered_house_holds = ref(0);
const registered_users = ref(0);
const household_population = ref(0);
const total_nets_required = ref(0);
const activities = ref(0);
const newChartData = ref([])
const chartOptions = ref({})
const totalhouseholds_served = ref([])

//org levels
const access_level = ref({})
const filterAccessList = ref([])
const countries = ref([{ value: "HfVjCurKxh2", label: "Kenya" }])
const counties = ref(null)
const subcounties = ref(null)
const wards = ref(null)
const locations = ref(null)
const sublocations = ref(null)
const country = ref("Select Country")
const county = ref("Select County")
const sublocation = ref("Select Sublocation")
const subcounty = ref("Select Subcounty")
const location = ref("Select Location")
const ward = ref("Select Ward")

//Nets with Time
const dateFormat = ref('YYYY-MM-DD');
var selectedFilter = ref('all');
var filterOrgId=ref(9)
const dateRange = reactive({
 dateFrom:"",
  dateTo: "",
});
const org_ids=ref([])
const dateFilters=ref([{value:'all',label:'All'}, { value: 'year', label: 'Year' }, { value: 'month', label: 'Month' }, { value: 'day', label: 'Day' }, { value: 'custom', label: 'Custom' }])

const selectedCounties = ref([
  "Homa Bay County",
  "Kisii County",
  "Nyamira County",
  // "Kisumu County",
  // "Siaya County",
  // "Busia County",
  // "Migori County",
  // "Lamu County",
  // "Kilifi County",
  // "Tana River County",
  // "Kwale County",
  // "Taita Taveta County",
  // "Mombasa County",
  // "Bungoma County",
  // "Kakamega County",
  // "Vihiga County",
  // "West Pokot County",
  // "Turkana County",
  // "Trans Nzoia County",
  // "Narok County",
  // "Marsabit County",
  // "Baringo County",
  // "Kirinyaga County"
])
const currentCounties = ref([
  'nK0A12Q7MvS',//homa bay
  'sPkRcDvhGWA',//kisii
  'uepLTG8wGWJ',//nyamira
  // 'u4t9H8XyU9P',//siaya
  // 'fVra3Pwta0Q',//migori
  // 'Tvf1zgVZ0K4',//busia
  // 'NjWSbQTwys4',//lamu
  // 'nrI2khZx3d0',//kilifi
  // 'JsH2bnvNt2d',//tan river
  // 'N7YETT3A9r1',//kwale
  // 'QyGNX2DpR4h',//taita taveta
  // 'wsBsC6gjHvn',// mombasa
  // 'KGHhQ5GLd4k',//
  // 'BjC1xL40gHo',//kakamega
  // 'sANMZ3lpqGs',//vihiga
  // 'XWALbfAPa6n',//west pokot
  // 'kphDeKClFch',//turkana
  // 'mThvosEflAU',//trans nzoia
  // 'kqJ83J2D72s',//naraok
  // 'Eey8fT4Im3y',//marsabit
  // 'vvOK1BxTbet',//baringo
  // 'Ulj33KBau7V',
])

onMounted(async () => {
  if (sessionStorage.getItem("user")) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    handleFilterChange()
    updateFilters()
    fetchInitialChartData()
    updateStats()
  }
});
const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};


const updateFilters = () => {
  // access_level.value.level.id = 3
  // access_level.value.location.org_id = 'BzFBYZhF5fx'
  // access_level.value.location.name = 'Kabondo Kasipul Sub County'

  if (access_level.value.level.id == 1) {
    filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    countries.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
    fetchCounties()
  } else if (access_level.value.level.id == 2) {
    filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    counties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 3) {
    filterAccessList.value = ['subcounty', 'ward', 'location', 'sublocation', 'village']
    subcounties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 4) {
    filterAccessList.value = ['ward', 'location', 'sublocation', 'village']
    wards.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 5) {
    filterAccessList.value = ['location', 'sublocation', 'village']
    locations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 6) {
    filterAccessList.value = ['sublocation', 'village']
    sublocations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  }
}
const fetchInitialChartData = async () => {
  axios.get(`/subcounty/stats?org_id=${access_level.value.location.org_id}`)
    .then(response => {
      newChartData.value = response.data.data;
       if (access_level.value.level.level_name.toLowerCase() === 'national') {
        newChartData.value = newChartData.value.filter(e => selectedCounties.value.includes(e.name.toString()));
      }
      //nets_required,nets_issued,target_data,target_level,cats
      netsReqvsIssuedChart(
        newChartData.value.map(item => parseInt(item.nets_required)),//nets_required
        newChartData.value.map(item => parseInt(item.nets_issued)),//nets_issued
        newChartData.value.map(item => (parseInt(item.nets_issued) / parseInt(item.nets_required)) * 100),//(nets_issued/nets_required)*100
        newChartData.value.map(item => (parseInt(item.nets_required) / parseInt(item.nets_required)) * 100),//(nets_required/nets_required)*100
        newChartData.value.map(item => item.name),//cats
        access_level.value.level.level_name,//level
      )
      //registered,served,target_data,target_level,cats
      householdRegvsServedChart(
        newChartData.value.map(item => parseInt(item.households_registered)),//registered
        newChartData.value.map(item => parseInt(item.households_served)),//served
        newChartData.value.map(item => (parseInt(item.households_served) / parseInt(item.households_registered)) * 100),//(registered/served)*100
        newChartData.value.map(item => (parseInt(item.households_registered) / parseInt(item.households_registered)) * 100),//(registered/registered)*100
        newChartData.value.map(item => item.name),//cats
        access_level.value.level.level_name,//level
      )
      fetchNetsDistributed()
    }).catch(error => {
      notification.error({
        message: `Error!`,
        description: `${error}`,
      });
    })
}
const handleChange = async (org_id, org_level) => {
  //fetch child data
 let org = org_ids.value.filter(x => x.org_id === org_id).map(e => e.id)
  console.log(org)
  let parent_id = org[0] || 9
  console.log(parent_id)
  console.log(org_level)
  fetchChildData(org_id, org_level)
  filterOrgId.value = parent_id
  fetchNetsDistributed()
};
const fetchChildData = async (org_id, org_level) => {
  let fetchUrl = `get_sub_counties_list`
  let statUrl = `subcounty/stats`
  if (org_level == 'country') {//get counties
    fetchUrl += `?parent_id=${org_id}`
    statUrl += `?org_id=${org_id}`
    //clear fields
    county.value="Select County"
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value="Select Sub Location"
  } else if (org_level == 'county') {//get subcounties
    fetchUrl += `?parent_id=${org_id}`
    statUrl += `?org_id=${org_id}`
    //clear fields
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'subcounty') {//get wards
    fetchUrl += `?parent_id=${org_id}`
    statUrl += `?org_id=${org_id}`
    //clear fields
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'ward') {//get locatios
    fetchUrl += `?parent_id=${org_id}`
    statUrl += `?org_id=${org_id}`
    //clear fields
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'location') {//get sub locatios
    fetchUrl += `?parent_id=${org_id}`
    statUrl += `?org_id=${org_id}`
    //clear fields
   sublocation.value = "Select Sub Location"
  } else if (org_level == 'sublocation') {//get sublocations stats
    statUrl += `?org_id=${org_id}`
  }
  await axios.get(`${fetchUrl}`)
    .then(response => {
      let data = response.data.message;
      if (org_level == 'country') {//get counties
        counties.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = data.map(x => ({
          org_id: x.org_id,
          id: x.id
        }));
        counties.value.splice(0, 1)
      } else if (org_level == 'county') {//get subcounties
        subcounties.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = data.map(x => ({
          org_id: x.org_id,
          id: x.id
        }));
      } else if (org_level == 'subcounty') {//get wards
        wards.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = data.map(x => ({
          org_id: x.org_id,
          id: x.id
        }));
      } else if (org_level == 'ward') {//get locations
        locations.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = data.map(x => ({
          org_id: x.org_id,
          id: x.id
        }));
      } else if (org_level == 'location') {//get sublocations
        sublocations.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = data.map(x => ({
          org_id: x.org_id,
          id: x.id
        }));
      }
    }).then(async () => {
      await axios.get(`${statUrl}`)
        .then(response => {
          newChartData.value = response.data.data;
          if (org_level === 'country') {
            newChartData.value=newChartData.value.filter(e => selectedCounties.value.includes(e.name.toString()));
          }
          //column Subcounty comparison
          org_level = capitalizeFirstLetter(org_level);
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
          fetchNetsDistributed()
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
      })).filter(e => currentCounties.value.includes(e.value.toString()));
      org_ids.value = response.data.map(x => ({
        org_id: x.org_id,
        id: x.id
      }));
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
      totalhouseholds_served.value= data.house_holds_served;
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
//chart functions
const handleFilterChange = () => {
  const currentDate = new Date('2023-11-18');
  console.log(selectedFilter.value)

  switch (selectedFilter.value) {
    case 'year':
      dateRange.dateFrom = moment(new Date(currentDate.getFullYear() - 1, currentDate.getDate(), currentDate.getMonth())).format(dateFormat.value);
      dateRange.dateTo = moment(currentDate).format(dateFormat.value);
      break;
    case 'month':
      dateRange.dateFrom = moment(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)).format(dateFormat.value);
      dateRange.dateTo = moment(currentDate).format(dateFormat.value);
      break;
    case 'day':
      dateRange.dateFrom = moment(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1)).format(dateFormat.value);
      dateRange.dateTo = moment(currentDate).format(dateFormat.value);
      break;
    default:
      dateRange.dateFrom = moment(new Date(currentDate.getFullYear(), 10, 11)).format(dateFormat.value);
      dateRange.dateTo = moment(currentDate).format(dateFormat.value);
      break;
  }
  //fetch data
 fetchNetsDistributed()
  console.log(dateRange.dateFrom)
  console.log(dateRange.dateTo)

}
const fetchNetsDistributed = () => {
   axios.get(`distribution_post_trends?location_id=${filterOrgId.value}&date_from=${dateRange.dateFrom}&date_to=${dateRange.dateTo}`)
    .then(response => {
      let data = response.data.data.total_nets_distributed;
      console.log(data.map(item => item.date.toString()))
      let org_level = access_level.value.level.level_name
      NetsDistributedwithTime(data, org_level)
    }).catch(error => {
      notification.error({
        message: `Error!`,
        description: `${error}`,
      });
    })
}

watch(selectedFilter, handleFilterChange)
const NetsDistributedwithTime = (data,org_level) => {
  console.log(data)
  Highcharts.chart('NetsDistributedwithTime', {
    chart: {
      type: 'spline'
    },
    title: {
      text: `Nets Distributed with Time by ${org_level}`
    },
    subtitle: {
      text: org_level
    },
    xAxis: {
      categories: data.map(item=>item.date.toString()),
      title: {
        text: 'Dates'
      },
    },
    yAxis: {
      title: {
        text: 'Number of Nets'
      },
      labels: {
        format: '{value}'
      }
    },
    tooltip: {
      crosshairs: true,
      shared: true
    },
    plotOptions: {
      spline: {
        marker: {
          radius: 4,
          lineColor: '#666666',
          lineWidth: 1
        }
      }
    },
    series: [{
      name:'Total Nets',
      marker: {
        symbol: 'circle'
      },
      data: data.map(item => parseInt(item.no_of_nets))
    }]
  });

}
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
          text: `Comparison of Nets Required vs Nets Issued by ${orglevel}`,
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
              color: '#004225'
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
            format: '{value:.1f} %',
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
          y: 20,
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
          type: 'scatter',
          yAxis: 2,
          data: target_data,
          color: '#004225',
          tooltip: {
            valueSuffix: ' %'
          },
          marker: {
            radius: 8, // Set the radius to adjust the size of scatter plot dots
          },
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
      text: `Comparison of Households Registered vs Households Served by ${orglevel}`,
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
          color: '#004225'
        }
      },
      title: {
        text: 'Target',
        style: {
          color: '#004225'
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
      y: 20,
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
      type: 'scatter',
      yAxis: 2,
      data: target_data,
      color: '#004225',
      tooltip: {
        valueSuffix: ' %'
      },
      marker: {
        radius: 8, // Set the radius to adjust the size of scatter plot dots
      },
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

.stat-span {
  white-space: nowrap;
  font-size: 1.1rem;
}
.stat-title{
  font-size: 1.6rem;
  font-weight: bold;
}

.stat-card {
 background:#ebedec;
 border:solid;
 border-color:#24daa3;
 color:#4b4d4c
}
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

@media screen and (max-width: 400px) {
  .stat-span {
      white-space: wrap;
  }
}

/* Media queries for smaller screens */
@media screen and (max-width: 767px) {
  .chart-container {
    /* Adjust any additional styles for smaller screens */
  }
}
</style>
