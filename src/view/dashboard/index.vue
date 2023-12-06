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
          <a-col v-if="filterAccessList.includes('sublocation')" >
            <a-select v-model:value="sublocation" show-search placeholder="Select Sub Location" style="width: 200px"
              :options="sublocations" :filter-option="filterOption"
              @change="handleChange($event, 'sublocation')"></a-select>
          </a-col>
          <a-col :style="{ padding: '2px', marging: '1px 0px 1px 0px', align:'center',justify:'center' }">
            <a-button @click="fetchInitialChartData(),county='Select County',country='Select Country'" :style="{padding:'2px', background:'#24daa3',marging:'1px 0px 1px 0px', align: 'center', justify: 'center' }">
              <ReloadOutlined />
              Reset</a-button>
          </a-col>
        </a-row>
      </template>
    </sdPageHeader>
    <a-row :gutter="25">
      <a-col :xxl="6" :md="12" :sm="12" :xs="24" class="stat-col">
        <sdCards headless class="stat-card">
             <EChartCard>
              <div class="card-chunk">
              <CardBarChart2>
              <table class="stat-table">
                <th><sHeading class="stat-title docorate" align="center">Digimal Stats</sHeading></th>
              <tbody>
                <tr>
                  <td><span class="stat-span">Registered Users</span></td>
                  <td><sdHeading class="stat-title">{{ new Intl.NumberFormat().format(registered_users) }}</sdHeading></td>
                </tr>
                <tr>
                  <td><span class="stat-span">Active Activities</span></td>
                  <td><sdHeading class="stat-title">{{ new Intl.NumberFormat().format(activities) }}</sdHeading></td>
                </tr>
                <tr>
                    <td><span class="stat-span">Active Events</span></td>
                    <td><sdHeading class="stat-title">{{ new Intl.NumberFormat().format(active_events) }}</sdHeading></td>
                  </tr>
              </tbody>
            </table>
         </CardBarChart2>
         </div>
         </EChartCard>
        </sdCards>
      </a-col>
      <a-col :xxl="6" :md="12" :sm="12" :xs="24" class="stat-col">
        <sdCards headless class="stat-card">
           <EChartCard>
            <div class="card-chunk">
            <CardBarChart2>
              <table class="stat-table">
                <th><sHeading class="stat-title docorate" align="center">Nets</sHeading></th>
                <tbody>
                  <tr>
                    <td> <span class="stat-span">Total Required</span></td>
                    <td><sdHeading class="stat-title">{{ new Intl.NumberFormat().format(total_nets_required) }}</sdHeading></td>
                  </tr>
                  <tr>
                    <td> <span class="stat-span">Tota Distributed</span></td>
                    <td> <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(nets_distributed) }}</sdHeading></td>
                  </tr>
                  <tr>
                      <td> <span class="stat-span">Total Remaining</span></td>
                      <td> <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(total_nets_required-nets_distributed) }}</sdHeading></td>
                    </tr>
                    <tr>
                      <td> <span class="stat-span"><strong>%</strong> of Nets Issued</span></td>
                      <td> <sdHeading class="stat-title">{{ Number((nets_distributed/ total_nets_required)*100).toFixed(2) }}%</sdHeading></td>
                    </tr>
                </tbody>
              </table>
            </CardBarChart2>
            </div>
            </EChartCard>
        </sdCards>
      </a-col>
      <a-col :xxl="6" :md="12" :sm="12" :xs="24" class="stat-col">
        <sdCards headless class="stat-card">
          <EChartCard>
            <div class="card-chunk">
              <CardBarChart2>
                <table class="stat-table">
                  <th><sHeading class="stat-title docorate" align="center">Households</sHeading></th>
                  <tbody>
                    <tr>
                      <td><span class="stat-span">Total Registered</span></td>
                      <td><sdHeading class="stat-title">{{ new Intl.NumberFormat().format(registered_house_holds) }}</sdHeading></td>
                    </tr>
                    <tr>
                      <td><span class="stat-span">Total Served</span></td>
                      <td><sdHeading class="stat-title">{{ new Intl.NumberFormat().format(totalhouseholds_served) }}</sdHeading></td>
                    </tr>
                    <tr>
                        <td> <span class="stat-span">Total Remaining</span></td>
                        <td> <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(registered_house_holds - totalhouseholds_served) }}</sdHeading></td>
                      </tr>
                      <tr>
                        <td> <span class="stat-span"><strong>%</strong> of Households Served</span></td>
                        <td> <sdHeading class="stat-title">{{ Number((totalhouseholds_served / registered_house_holds) * 100).toFixed(2) }}%</sdHeading></td>
                      </tr>
                  </tbody>
                </table>
              </CardBarChart2>
            </div>
          </EChartCard>
        </sdCards>
      </a-col>
      <a-col :xxl="6" :md="12" :sm="12" :xs="24" class="stat-col">
          <sdCards headless class="stat-card">
            <EChartCard>
              <div class="card-chunk">
                <CardBarChart2>
                  <table class="stat-table">
                    <thead>
                      <th rowspan=""><sHeading class="stat-title docorate" align="center">Household Population</sHeading></th>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span class="stat-span">Total Registered</span></td>
                        <td><sdHeading class="stat-title">{{ new Intl.NumberFormat().format(household_population) }}</sdHeading></td>
                      </tr>
                      <tr>
                        <td><span class="stat-span">Total Served</span></td>
                        <td><sdHeading class="stat-title">{{ new Intl.NumberFormat().format(totalhouseholds_served) }}</sdHeading></td>
                      </tr>
                      <tr>
                          <td> <span class="stat-span">Total Remaining</span></td>
                          <td> <sdHeading class="stat-title">{{ new Intl.NumberFormat().format(household_population - totalhouseholds_served) }}</sdHeading></td>
                        </tr>
                        <tr>
                          <td> <span class="stat-span"><strong>%</strong> Served</span></td>
                          <td> <sdHeading class="stat-title">{{ Number((totalhouseholds_served / household_population) * 100).toFixed(2) }}%</sdHeading></td>
                        </tr>
                    </tbody>
                  </table>
                </CardBarChart2>
              </div>
            </EChartCard>
          </sdCards>
      </a-col>
    </a-row>
    <div class="" justify="space-around" align="right">
      <div id="printPDFDiv">
         <a-row style="margin-top:10px;panding:1px;border:solid 1px 1px #6b055700">
           <a-button @click="exportChartsToPDF()" :style="{ panding: '2px', border: 'solid 1px 2%' }">
              <FilePdfOutlined /> Print Pdf
            </a-button>
         </a-row>
        <a-row :gutter="5" v-show="wards !== null">
          <a-col :xxl="8" :md="8" :sm="24" :xs="24" class="pdf-row">
            <figure class="highcharts-figure">
              <div id="HouseholdsRegisteredbyCountyChart"></div>
            </figure>
          </a-col>
          <a-col :xxl="8" :md="8" :sm="24" :xs="24" class="pdf-row">
            <figure class="highcharts-figure">
              <div id="HouseHoldsServedbyCountyChart"></div>
            </figure>
          </a-col>
          <a-col :xxl="8" :md="8" :sm="24" :xs="24" class="pdf-row">
            <figure class="highcharts-figure">
              <div id="NetsIssuedbyCountyChart"></div>
            </figure>
          </a-col>
        </a-row>
        <a-divider></a-divider>
        <a-row :gutter="25"  class="pdf-row">
          <a-col :xxl="24" :md="24" :sm="24" :xs="24">
              <figure class="highcharts-figure">
                <div id="householdRegvsServedChart"></div>
                <table class="table nested-table table-responsive" style="max-width: 100%;" v-if="printMode">
                  <thead>
                    <tr>
                      <th v-for="item in NetsChartData" :key="item.name">{{ item.name }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td v-for="item in NetsChartData" :key="item.name">
                        <table class="nested-table" style="max-width: 100%;">
                          <tbody>
                            <tr>
                              <td style="font-weight:bold;font-style:italic;">Households Registered</td>
                              <td style="font-weight:bold;font-style:italic;">Households Served</td>
                            </tr>
                            <tr>
                              <td>{{ parseInt(item.households_registered) || 0 }}</td>
                              <td>{{ parseInt(item.house_holds_served) || 0 }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </figure>
          </a-col>
          <a-divider></a-divider>
          <a-col :xxl="24" :md="24" :sm="24" :xs="24">
            <figure class="highcharts-figure">
              <div id="netsReqvsIssuedChart"></div>
              <table class="table nested-table table-responsive" style="max-width: 100%;" v-if="printMode">
                <thead>
                  <tr>
                    <th v-for="item in NetsChartData" :key="item.name">{{ item.name }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td v-for="item in NetsChartData" :key="item.name">
                      <table class="nested-table" style="max-width: 100%;">
                        <tbody>
                          <tr>
                            <td style="font-weight:bold;font-style:italic;">Nets Required</td>
                            <td style="font-weight:bold;font-style:italic;">Nets Issued</td>
                          </tr>
                          <tr>
                            <td>{{ parseInt(item.nets_required) || 0 }}</td>
                            <td>{{ parseInt(item.nets_issued) || 0 }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </figure>
          </a-col>
          <a-divider></a-divider>
          <a-col :xxl="24" :md="24" :sm="24" :xs="24">
            <div>
              <a-row :gutter="16" v-if="!printMode">
                <a-col :span="12" style="display:flex;flex-direction:row;">
                  <a-space direction="horizontal" :size="5">
                    <a-select v-model:value="selectedFilter" show-search placeholder="Select Filter"
                      style="width: 200px;height:100%;" :options="dateFilters" :filter-option="filterOption"
                      @change="handleFilterChange($event)"></a-select>
                    <div :span="12" v-if="selectedFilter === 'custom'" style="display:flex;flex-direction:row;">
                      <input type="date"
                        :style="{ width: '100%', padding: '6px', margin: '1px', border: '2px solid  #CCCCFF' }"
                        v-model="dateFrom" placeholder="Select Date From" :format="dateFormat" />
                      <input type="date" v-model="dateTo"
                        :style="{ width: '100%', padding: '6px', margin: '1px', border: '2px solid  #CCCCFF' }"
                        placeholder="Select Date To" @input="fetchNetsDistributed()" :format="dateFormat" />
                    </div>
                  </a-space>
                </a-col>
              </a-row>
            </div>
            <figure class="highcharts-figure">
              <div id="NetsDistributedwithTime"></div>
              <table class="table table-responsive" v-if="printMode">
                <thead>
                  <tr>
                    <th v-for="item in NetsDistributedwithTimeData.map(item => item.date)" :key="item">{{ item }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td v-for="item in NetsDistributedwithTimeData.map(item => item.no_of_nets)" :key="item">{{ item }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </figure>
          </a-col>
        </a-row>
      </div>
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
import { onMounted, ref, watch } from 'vue';
import moment from "moment"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
//import html2pdf from 'html2pdf.js';
import { FilePdfOutlined } from '@ant-design/icons-vue';
import { ReloadOutlined } from '@ant-design/icons-vue';

import { useRouter } from 'vue-router';
const router = useRouter()
//exporting(Highcharts);
const active_events = ref(0);
const nets_distributed = ref(0);
const registered_house_holds = ref(0);
const registered_users = ref(0);
const household_population = ref(0);
const total_nets_required = ref(0);
const activities = ref(0);
//chart data
const newChartData = ref([])
const NetsChartData = ref([])
const HouseHoldRegisteredbyCoountyChartData = ref([])
const HouseHoldsServedbyCountyChartData = ref([])
const NetsIssuedbyCountyChartData = ref([])
const NetsDistributedwithTimeData = ref([])
var printMode = ref(false)
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
var selectedFilter = ref('month');
var filterOrgId = ref(9)
var fileterOrgeLevel = ref("")
var dateFrom = ref(new Date())
var dateTo = ref(new Date())

const org_ids = ref([])
const dateFilters = ref([{ value: 'year', label: 'Past 1 Year' }, { value: 'month', label: 'Past 1 Month' }, { value: 'week', label: 'Past 1 Week' }, { value: '3day', label: 'Past 3 Days' }, { value: 'day', label: 'Past 1 Day' }, { value: 'custom', label: 'Custom' }])

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
  const user = sessionStorage.getItem("user");
  const user_object = JSON.parse(user);
  if (user_object !=null) {
    access_level.value = user_object.user;
    updateFilters()
    fetchInitialChartData()
    updateStats(access_level.value.location.org_id)
    handleFilterChange()
  } else {
    router.push("/login")
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
    filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
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
  axios.get(`subcounty/stats?org_id=${access_level.value.location.org_id}`)
    .then(response => {
      newChartData.value = response.data.data;
      if (access_level.value.level.id === 1) {
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

      let currentDate = new Date()
      //console.log(currentDate.getFullYear())
      dateFrom.value = moment(new Date(`2023-11-15`)).format(dateFormat.value)
      dateTo.value = moment(currentDate).format(dateFormat.value);
      fileterOrgeLevel.value = access_level.value.level.level_name
      NetsChartData.value = newChartData.value
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
  // console.log(org_id)
  // console.log(org_ids.value)
  let parent_id = org[0] || 9
  // console.log(parent_id)
  // console.log(org_level)
  fetchChildData(org_id, org_level)
  filterOrgId.value = parent_id
  fileterOrgeLevel.value = org_level
  fetchNetsDistributed()
};
const fetchChildData = async (org_id, org_level) => {
  updateStats(org_id)
  let fetchUrl = `get_sub_counties_list`
  let statUrl = `subcounty/stats`
  if (org_level == 'country') {//get counties
    fetchUrl += `?parent_id=${org_id}`
    statUrl += `?org_id=${org_id}`
    //clear fields
    county.value = "Select County"
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
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
        org_ids.value = [...org_ids.value, ...data.map(x => ({ org_id: x.org_id, id: x.id }))];
        counties.value.splice(0, 1)
      } else if (org_level == 'county') {//get subcounties
        subcounties.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
       org_ids.value = [
          ...org_ids.value,
          ...data
            .map(x => ({ org_id: x.org_id, id: x.id }))
            .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
        ];
      } else if (org_level == 'subcounty') {//get wards
        wards.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = [
          ...org_ids.value,
          ...data
            .map(x => ({ org_id: x.org_id, id: x.id }))
            .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
        ];
      } else if (org_level == 'ward') {//get locations
        locations.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = [
          ...org_ids.value,
          ...data
            .map(x => ({ org_id: x.org_id, id: x.id }))
            .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
        ];
      } else if (org_level == 'location') {//get sublocations
        sublocations.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
       org_ids.value = [
          ...org_ids.value,
          ...data
            .map(x => ({ org_id: x.org_id, id: x.id }))
            .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
        ];
      }
    }).then(async () => {
      await axios.get(`${statUrl}`)
        .then(response => {
          newChartData.value = response.data.data;
          if (org_level === 'country') {
            newChartData.value = newChartData.value.filter(e => selectedCounties.value.includes(e.name.toString()));
          }
          let rq = newChartData.value.map(item => parseInt(item.nets_required))//nets_required
          let isd = newChartData.value.map(item => parseInt(item.nets_issued))//nets_issued
          let isdvsrq = newChartData.value.map(item => (parseInt(item.nets_issued) / parseInt(item.nets_required)) * 100)//(nets_issued/nets_required)*100
          let tgt = newChartData.value.map(item => (parseInt(item.nets_required) / parseInt(item.nets_required)) * 100)//(nets_required/nets_required)*100
          let labels = newChartData.value.map(item => item.name)//cats
          fileterOrgeLevel.value = org_level
          //column Subcounty comparison
          let rgstd = newChartData.value.map(item => parseInt(item.households_registered))//registered
          let srvd = newChartData.value.map(item => parseInt(item.households_served))//served
          let rgstdvssvd = newChartData.value.map(item => (parseInt(item.households_served) / parseInt(item.households_registered)) * 100)//(registered/served)*100
          let tgt1 = newChartData.value.map(item => (parseInt(item.households_registered) / parseInt(item.households_registered)) * 100)//(registered/registered)*100
          let labels1 = newChartData.value.map(item => item.name)//cats
          org_level = capitalizeFirstLetter(fileterOrgeLevel.value);
          householdRegvsServedChart(rgstd, srvd, rgstdvssvd, tgt1, labels1, fileterOrgeLevel.value)
          //combine bar line bar Subcounty comparison
          netsReqvsIssuedChart(rq, isd, isdvsrq, tgt, labels, fileterOrgeLevel.value)
          NetsChartData.value = newChartData.value
          //pie chars Registered households by sub county
          let pieOptionsData = newChartData.value.map(item => ({ name: item.name, y: item.households_registered }))
          let chartData = newChartData.value.map(item => ({ name: item.name, y: item.households_served }))
          let netsIssuedData = newChartData.value.map(item => ({ name: item.name, y: parseInt(item.nets_issued) }))
          HouseHoldRegisteredbyCoountyChart(pieOptionsData, org_level)
          HouseHoldRegisteredbyCoountyChartData.value = pieOptionsData
          HouseHoldsServedbyCountyChart(chartData, org_level)
          HouseHoldsServedbyCountyChartData.value = chartData
          NetsIssuedbyCountyChart(netsIssuedData, org_level)
          NetsIssuedbyCountyChartData.value = netsIssuedData
          fileterOrgeLevel.value = org_level
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
      org_ids.value=[...org_ids.value,...response.data.map(x => ({ org_id: x.org_id,id: x.id }))];
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
const updateStats = async (org_id) => {
  await axios.get(`all_stats?org_id=${org_id}`)
    .then(response => {
      const data = response.data;
      //console.log(data)
      active_events.value = data.events || 0;
      nets_distributed.value = data.nets_distributed || 0;
      registered_house_holds.value = data.registered_house_holds || 0;
      totalhouseholds_served.value = data.households_served || 0;
      registered_users.value = data.registered_users || 0;
      household_population.value = data.all_hh_members || 0;
      total_nets_required.value = data.nets_required || 0;
      activities.value = data.activities || 0;
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
//chart pdf reports
// Function to export multiple charts to a single PDF
const exportChartsToPDF = async () => {
  printMode.value = true;
  const content = document.getElementById('printPDFDiv');

  // Create a new jsPDF instance
  const pdf = new jsPDF({
    orientation: 'potrait',
    unit: 'mm',
    format: 'a4',
  });
  // Get all rows in the content
  const rows = content.querySelectorAll('.pdf-row');
  // Loop through ev row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    // Use html2canvas to convert the row to a canvas
    const canvas = await html2canvas(row);
    // Add the canvas as an image to the PDF
    pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 10, 10, 190, 277);
    // If there are more rows, add a new page for the next row
    if (i < rows.length - 1) {
      pdf.addPage();
    }
  }
  // Save or display the PDF
  // You can modify this part based on your specific needs
  pdf.save('export.pdf');
  // printMode.value = false;
  window.location.reload()
};

// Call the function to export charts to PDF
//exportChartsToPDF();
//chart functions
const handleFilterChange = () => {
  const currentDate = new Date();
  //console.log(selectedFilter.value)

  switch (selectedFilter.value) {
    case 'year':
      dateFrom.value = new Date(`${currentDate.getFullYear() - 1}-11-15`)
      dateTo.value = currentDate
      break;
    case 'month':
      dateFrom.value = new Date(`${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`)
      dateTo.value = currentDate
      break;
    case 'week':
      dateFrom.value = new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate() - 7}`)
      dateTo.value = currentDate
      break;
    case '3day':
      dateFrom.value = new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate() - 3}`)
      dateTo.value = currentDate
      break;
    case 'day':
      dateFrom.value = new Date(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate() - 1}`)
      dateTo.value = currentDate
      break;
    default:
      dateFrom.value = new Date(`${currentDate.getFullYear()}-11-15`)
      dateTo.value = currentDate
      break;
  }
  //fetch data
  fetchNetsDistributed()
  // console.log(dateFrom)
  // console.log(dateTo)

}
const fetchNetsDistributed = () => {
  //format date
  dateFrom.value = moment(dateFrom.value).format(dateFormat.value)
  dateTo.value = moment(dateTo.value).format(dateFormat.value)
  axios.get(`distribution_post_trends?location_id=${filterOrgId.value}&date_from=${dateFrom.value}&date_to=${dateTo.value}`)
    .then(response => {
      let data = response.data.data.total_nets_distributed;
      //console.log(data.map(item => item.date.toString()))
      NetsDistributedwithTimeData.value = data
      NetsDistributedwithTime(data, fileterOrgeLevel.value)
    }).catch(error => {
      notification.error({
        message: `Error!`,
        description: `${error}`,
      });
    })
}

watch(selectedFilter, handleFilterChange)
const NetsDistributedwithTime = (data, org_level) => {
  //console.log(data)
  Highcharts.chart('NetsDistributedwithTime', {
    chart: {
      type: 'spline',
    },
    credits: {
            text: 'Powered by HealthIT KE', // Custom text
            href: 'https://unes.co.ke', // Custom link
            target:'_blank',
            position: {
                align: 'right',
                x: -10,
                verticalAlign: 'bottom',
                y: -5,
            },
        },
    title: {
      text: `Nets Distributed with Time by ${org_level}`,
      align: 'left',
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      categories: data.map(item => item.date.toString()),
      title: {
        text: ''
      },
    },
    yAxis: {
      // Primary yAxis (Count)
      title: {
        text: 'Count of Nets',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      labels: {
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      }
    },
    tooltip: {
      crosshairs:true,
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
      name: 'Cumulative',//Cumulative
      marker: {
        symbol: 'circle'
      },
      yAxis:0,
      data: data.map(item => parseInt(item.nets_cumulative))
    },
    {
      name: 'Daily Nets Distribution',
      type: 'column',
      color: '#4ADEDE',
      yAxis: 0,
      data: data.map(item => parseInt(item.no_of_nets))
    }]
  });

}
const HouseHoldRegisteredbyCoountyChart = (data, orglevel) => {
  Highcharts.chart('HouseholdsRegisteredbyCountyChart', {
    chart: {
      type: 'pie'
    },
    credits: {
            text: 'Powered by HealthIT KE', // Custom text
            href: 'https://unes.co.ke', // Custom link
            target:'_blank',
            position: {
                align: 'right',
                x: -10,
                verticalAlign: 'bottom',
                y: -5,
            },
        },
    title: {
      text: `Households Registered by ${orglevel}`,
      align: 'left',
    },
    subtitle: {
      text: orglevel,
      align: 'left'
    },
    tooltip: {
      valueSuffix: ''
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        borderWidth: 2,
        cursor: 'pointer',
        innerSize: 0,
        depth:0,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
          distance: 20
        }
      }
    },
    series: [
      {
        name: 'Count',
        colorByPoint: true,
        data: data,
      }
    ],
  });
}
const HouseHoldsServedbyCountyChart = (charData, orglevel) => {
  Highcharts.chart('HouseHoldsServedbyCountyChart', {
    chart: {
      type: 'pie'
    },
    credits: {
            text: 'Powered by HealthIT KE', // Custom text
            href: 'https://unes.co.ke', // Custom link
            target:'_blank',
            position: {
                align: 'right',
                x: -10,
                verticalAlign: 'bottom',
                y: -5,
            },
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
      pie: {
        allowPointSelect: true,
        borderWidth: 2,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
          distance: 20
        }
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
      type: 'pie',
    },
    credits: {
            text: 'Powered by HealthIT KE', // Custom text
            href: 'https://unes.co.ke', // Custom link
            target:'_blank',
            position: {
                align: 'right',
                x: -10,
                verticalAlign: 'bottom',
                y: -5,
            },
        },
    title: {
      text: `Nets Issued by ${orglevel}`,
      align: 'left',
    },
    subtitle: {
      text: orglevel,
      align: 'left'
    },
    tooltip: {
      valueSuffix: ''
    },
   plotOptions: {
      pie: {
        allowPointSelect: true,
        borderWidth: 2,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
          distance: 20
        }
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
const netsReqvsIssuedChart = (nets_required, nets_issued, target_data, target_level, cats, orglevel) => {
 Highcharts.chart('netsReqvsIssuedChart', {
    chart: {
      zoomType: 'xy'
    },
    credits: {
      text: 'Powered by HealthIT KE', // Custom text
      href: 'https://unes.co.ke', // Custom link
      target: '_blank',
      position: {
        align: 'right',
        x: -10,
        verticalAlign: 'bottom',
        y: -5,
      },
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
    yAxis: [{
      title: {
        text: 'Count',
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      },
      labels: {
        style: {
          color: Highcharts.getOptions().colors[0]
        }
      }
    }, { // Secondary yAxis (for Achievement and Expected Achievement)
      title: {
        text: 'Achievement',
        style: {
          color: '#004225'
        }
      },
      labels: {
        format: '{value:.1f}%',
        style: {
          color: '#004225'
        }
      },
      max: 100,
      min: 0,
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
      yAxis: 0, // Assign to the Count axis
      data: nets_required,
      color: '#3498db',
    }, {
      name: 'Nets Issued',
      type: 'column',
      yAxis: 0, // Assign to the Count axis
      data: nets_issued,
      color: '#4ADEDE',//color: '#3498db',
    }, {
      name: 'Expected Achievement',
      type: 'spline',
      yAxis: 1, // Assign to the Achievement axis
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
      name: 'Current Achievement',
      type: 'scatter',
      yAxis: 1, // Assign to the Achievement axis
      data: target_data,
      color: '#004225',
      marker: {
        radius: 6,
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
const householdRegvsServedChart = (registered, served, target_data, target_level, cats, orglevel) => {
 Highcharts.chart('householdRegvsServedChart', {
    chart: {
        zoomType: 'xy'
    },
    credits: {
        text: 'Powered by HealthIT KE', // Custom text
        href: 'https://unes.co.ke', // Custom link
        target: '_blank',
        position: {
            align: 'right',
            x: -10,
            verticalAlign: 'bottom',
            y: -5,
        },
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
    yAxis: [{
        // Primary yAxis (Count)
        title: {
            text: 'Count',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        }
    }, {
        // Secondary yAxis (Achievement and Expected Achievement)
        title: {
            text: 'Achievement',
            style: {
                color: '#004225'
            }
        },
        labels: {
            format: '{value:.1f}%',
            style: {
                color: '#004225'
            }
        },
        max: 100,
        min: 0,
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
            Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)'
    },
    series: [{
        name: 'Registered Households',
        type: 'column',
        yAxis: 0, // Use the first yAxis (Count)
        data: registered,
        color: '#3498db'
    }, {
        name: 'Served Households',
        type: 'column',
        yAxis: 0, // Use the first yAxis (Count)
        data: served,
        color: '#4ADEDE'
    }, {
        name: 'Expected Achievement',
        type: 'spline',
        yAxis: 1, // Use the second yAxis (Achievement and Expected Achievement)
        data: target_level,
        color: Highcharts.getOptions().colors[1],
        marker: {
            enabled: false
        },
        dashStyle: 'shortdot',
        tooltip: {
            valueSuffix: ' %'
        },
        lineWidth: 6
    }, {
        name: 'Current Achievement',
        type: 'scatter',
        yAxis: 1, // Use the second yAxis (Achievement and Expected Achievement)
        data: target_data,
        color: '#004225',
        tooltip: {
            pointFormat: '{point.name}: <b>{point.y:.1f}%</b>'
        },
        marker: {
            radius: 6
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
/* Make charts responsive */
.highcharts-figure {
  margin: 0;
}

/* Responsive styles for mobile screens */
@media only screen and (max-width: 600px) {
  .highcharts-figure {
    width: 100%;
  }
}

#NetsDistributedwithTime,
#HouseholdsRegisteredbyCountyChart,
#HouseHoldsServedbyCountyChart,
#NetsIssuedbyCountyChart,
#netsReqvsIssuedChart,
#householdRegvsServedChart {
  max-width: 100%;
}

#netsReqvsIssuedChart .highcharts-legend {
  display: none; /* Hide legend for this chart on small screens */
}

#householdRegvsServedChart .highcharts-legend {
  display: none; /* Hide legend for this chart on small screens */
}
.stat-span {
  white-space: nowrap;
  font-size: 1rem;
  max-width: 100%;
  margin: 0 auto;
}
.stat-col{
  margin-bottom: 10px;
}
.stat-title {
  white-space: nowrap;
  max-width: fit-content;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 auto;
  text-align: center;
  max-width: 400px; /* Set your desired maximum width */
  line-height: 1.5; /* Set your desired line height */
}
.docorate{
  text-decoration: overline;
  text-decoration-color: #d5dad7;
  text-decoration-thickness: 10%;
  text-overline-offset: 20%;
}
.stat-table{
  border-spacing: 0;
  margin:auto;
  width: 100%; /* Make the table take up 100% of the parent container (card) */
  border-collapse: collapse; /* Remove spacing between table cells */
}
.stat-table td, .stat-table{
  padding: 8px;
  text-align: left;
}
.stat-table th{
    text-align: center;
}
.stat-table tr{
  margin:0px;
  padding:0px;
}
.stat-card {
  width: 100%;
  height: 100%;
  background: #ebedec;
  border: solid;
  border-color: #d3efe7;
  color: #4b4d4c;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the content horizontally */
  justify-content: center; /* Center the content vertically */
  text-align: center; /* Center the text within the card */
  box-sizing: border-box;
}

.d-inline{
display: inline-block;
width: 100%;
max-width: 100%;
box-sizing: border-box;
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

.nested-table {
  width: 100%;
  border-collapse: collapse;
}

.nested-table td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
  border-collapse: collapse;
  /* Add this line to collapse table borders */
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border: 1px solid #dee2e6;
  /* Add this line for cell borders */
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table tbody+tbody {
  border-top: 2px solid #ffffff;
}

.table .table {
  background-color: #fff;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
}

.table-bordered thead th,
.table-bordered thead td {
  border-bottom-width: 2px;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Media query for responsiveness */
@media only screen and (max-width: 600px) {
  .stat-table td, .stat-table th {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }
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
}</style>
