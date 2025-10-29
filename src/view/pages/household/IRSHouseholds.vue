<template>
  <RecordViewWrapper>
    <sdPageHeader title="IRS Households Summary">
      <template v-slot:buttons>
        <a-row>
          <a-col v-if="filterAccessList.includes('country')">
            <a-select
              v-model:value="country"
              show-search
              placeholder="Select Country"
              style="width: 200px"
              :options="countries"
              :filter-option="filterOption"
              @change="handleChange($event, 'country')"
            ></a-select>
          </a-col>
          <a-col v-if="filterAccessList.includes('county')">
            <a-select
              v-model:value="county"
              show-search
              placeholder="Select County"
              style="width: 200px"
              :options="counties"
              :filter-option="filterOption"
              @change="handleChange($event, 'county')"
            ></a-select>
          </a-col>
          <a-col v-if="filterAccessList.includes('subcounty')">
            <a-select
              v-model:value="subcounty"
              show-search
              placeholder="Select Sub County"
              style="width: 200px"
              :options="subcounties"
              :filter-option="filterOption"
              @change="handleChange($event, 'subcounty')"
            ></a-select>
          </a-col>
          <a-col v-if="filterAccessList.includes('ward')">
            <a-select
              v-model:value="ward"
              show-search
              placeholder="Select Ward"
              style="width: 200px"
              :options="wards"
              :filter-option="filterOption"
              @change="handleChange($event, 'ward')"
            ></a-select>
          </a-col>
          <a-col v-if="filterAccessList.includes('location')">
            <a-select
              v-model:value="location"
              show-search
              placeholder="Select Location"
              style="width: 200px"
              :options="locations"
              :filter-option="filterOption"
              @change="handleChange($event, 'location')"
            ></a-select>
          </a-col>
          <a-col v-if="filterAccessList.includes('sublocation')">
            <a-select
              v-model:value="sublocation"
              show-search
              placeholder="Select Sub Location"
              style="width: 200px"
              :options="sublocations"
              :filter-option="filterOption"
              @change="handleChange($event, 'sublocation')"
            ></a-select>
          </a-col>
          <a-col
            :style="{
              padding: '2px',
              marging: '1px 0px 1px 0px',
              align: 'center',
              justify: 'center',
            }"
          >
            <a-button
              @click="
                getTrainingSummary(),
                  (county = 'Select County'),
                  (country = 'Select Country')
              "
              :style="{
                padding: '2px',
                background: '#24daa3',
                marging: '1px 0px 1px 0px',
                align: 'center',
                justify: 'center',
              }"
            >
              <ReloadOutlined />
              Reset
            </a-button>
          </a-col>
        </a-row>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="25">
        <a-col :xxl="12" :md="12" :sm="12" :xs="24" class="stat-col">
          <sdCards headless class="stat-card">
            <EChartCard>
              <div class="card-chunk">
                <CardBarChart2>
                  <table class="stat-table">
  <thead>
    <tr>
      <th>
        <sHeading class="stat-title docorate" align="center">
          <!-- Your heading text here, e.g. "Total Households" -->
        </sHeading>
      </th>
    </tr>
  </thead>
  <tbody>
    <!-- Your table rows here -->
  </tbody>
</table>
                </CardBarChart2>
              </div>
            </EChartCard>
          </sdCards>
        </a-col>
        <a-col :xxl="12" :md="12" :sm="12" :xs="24" class="stat-col">
          <sdCards headless class="stat-card">
            <EChartCard>
              <div class="card-chunk">
                <CardBarChart2>
                  <table class="stat-table">
                    <th>
                      <sHeading class="stat-title docorate" align="center"
                        >No of people in non sprayable</sHeading
                      >
                    </th>
                    <tbody>
                      <tr>
                        <td>
                          <span class="stat-span"
                            >No of people in non sprayable</span
                          >
                        </td>
                        <td>
                          <sdHeading class="stat-title">{{
                            new Intl.NumberFormat().format(
                              summary.no_of_people_sleep_in_non_sprayable
                            )
                          }}</sdHeading>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardBarChart2>
              </div>
            </EChartCard>
          </sdCards>
        </a-col>
        <a-col :xxl="12" :md="12" :sm="12" :xs="24" class="stat-col">
          <sdCards headless class="stat-card">
            <EChartCard>
              <div class="card-chunk">
                <CardBarChart2>
                  <table class="stat-table">
                    <th>
                      <sHeading class="stat-title docorate" align="center"
                        >No of people in stand alone non-sprayable
                        surface</sHeading
                      >
                    </th>
                    <tbody>
                      <tr>
                        <td>
                          <span class="stat-span"
                            >No of people in stand alone non-sprayable
                            surface</span
                          >
                        </td>
                        <td>
                          <sdHeading class="stat-title">{{
                            new Intl.NumberFormat().format(
                              summary.no_of_stand_alone_non_sprayable_surfaces
                            )
                          }}</sdHeading>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardBarChart2>
              </div>
            </EChartCard>
          </sdCards>
        </a-col>
        <a-col :xxl="12" :md="12" :sm="12" :xs="24" class="stat-col">
          <sdCards headless class="stat-card">
            <EChartCard>
              <div class="card-chunk">
                <CardBarChart2>
                  <table class="stat-table">
                    <th>
                      <sHeading class="stat-title docorate" align="center"
                        >Stand alone units near water body</sHeading
                      >
                    </th>
                    <tbody>
                      <tr>
                        <td>
                          <span class="stat-span"
                            >Stand alone units near water body</span
                          >
                        </td>
                        <td>
                          <sdHeading class="stat-title">{{
                            new Intl.NumberFormat().format(
                              summary.stand_alone_units_near_water_bodies
                            )
                          }}</sdHeading>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardBarChart2>
              </div>
            </EChartCard>
          </sdCards>
        </a-col>
        <a-col :xxl="12" :md="12" :sm="12" :xs="24" class="stat-col">
          <sdCards headless class="stat-card">
            <EChartCard>
              <div class="card-chunk">
                <CardBarChart2>
                  <table class="stat-table">
                    <th>
                      <sHeading class="stat-title docorate" align="center"
                        >No of people in stand alone units</sHeading
                      >
                    </th>
                    <tbody>
                      <tr>
                        <td>
                          <span class="stat-span"
                            >No of people in stand alone units</span
                          >
                        </td>
                        <td>
                          <sdHeading class="stat-title">{{
                            new Intl.NumberFormat().format(
                              summary.no_of_people_sleep_in_stand_alone_units
                            )
                          }}</sdHeading>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardBarChart2>
              </div>
            </EChartCard>
          </sdCards>
        </a-col>
        <a-col :xxl="12" :md="12" :sm="12" :xs="24" class="stat-col">
          <sdCards headless class="stat-card">
            <EChartCard>
              <div class="card-chunk">
                <CardBarChart2>
                  <table class="stat-table">
                    <th>
                      <sHeading class="stat-title docorate" align="center"
                        >Stand alone units sprayable surface</sHeading
                      >
                    </th>
                    <tbody>
                      <tr>
                        <td>
                          <span class="stat-span"
                            >Stand alone units sprayable surface</span
                          >
                        </td>
                        <td>
                          <sdHeading class="stat-title">{{
                            new Intl.NumberFormat().format(
                              summary.stand_alone_units_sprayable_surfaces
                            )
                          }}</sdHeading>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardBarChart2>
              </div>
            </EChartCard>
          </sdCards>
        </a-col>
        <a-col :xxl="12" :md="12" :sm="12" :xs="24" class="stat-col">
          <sdCards headless class="stat-card">
            <EChartCard>
              <div class="card-chunk">
                <CardBarChart2>
                  <table class="stat-table">
                    <th>
                      <sHeading class="stat-title docorate" align="center"
                        >Stand alone units where people sleep</sHeading
                      >
                    </th>
                    <tbody>
                      <tr>
                        <td>
                          <span class="stat-span"
                            >Stand alone units where people sleep</span
                          >
                        </td>
                        <td>
                          <sdHeading class="stat-title">{{
                            new Intl.NumberFormat().format(
                              summary.stand_alone_units_where_people_sleep
                            )
                          }}</sdHeading>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardBarChart2>
              </div>
            </EChartCard>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
//import { useStore } from "vuex";
import { onMounted, ref, reactive } from "vue";
import axios from "@/Axiosconfig";
import { notification } from "ant-design-vue";
// import dayjs from "dayjs";
//const dateFormat = "YYYY-MM-DD";
//org levels
const access_level = ref({});
const filterAccessList = ref([]);
const countries = ref([{ value: "HfVjCurKxh2", label: "Kenya" }]);
const counties = ref(null);
const subcounties = ref(null);
const wards = ref(null);
const county = ref("Select County");
const subcounty = ref("Select Subcounty");
const org_ids = ref([]);

const currentCounties = ref([
  // "nK0A12Q7MvS", //homa bay
  // "sPkRcDvhGWA", //kisii
  // "uepLTG8wGWJ", //nyamira
  // "tAbBVBbueqD", //kisumu
  // "u4t9H8XyU9P", //siaya
  "fVra3Pwta0Q", //migori
  'Tvf1zgVZ0K4',//busia
  // 'NjWSbQTwys4',//lamu
  // 'nrI2khZx3d0',//kilifi
  // 'JsH2bnvNt2d',//tan river
  // "N7YETT3A9r1", //kwale
  // "QyGNX2DpR4h", //taita taveta
  // "wsBsC6gjHvn", // mombasa
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
]);
const summary = reactive({
  no_of_people_sleep_in_non_sprayable: 0,
  no_of_people_sleep_in_stand_alone_units: 0,
  no_of_stand_alone_non_sprayable_surfaces: 0,
  number_of_households: 0,
  stand_alone_units_near_water_bodies: 0,
  stand_alone_units_sprayable_surfaces: 0,
  stand_alone_units_where_people_sleep: 0,
});
onMounted(async () => {
  ///alert()
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    //filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    updateFilters();
    // console.log(JSON.stringify(access_level.value.location));
  }
  getTrainingSummary();
});
const updateFilters = () => {
  // access_level.value.level.level_name = 'national'
  // access_level.value.location.id = 1
  // access_level.value.location.org_id = 'HfVjCurKxh2'
  // access_level.value.location.name = 'Kenya'

  if (access_level.value.level.id == 1) {
    filterAccessList.value = ["county", "subcounty"];
    countries.value = [
      {
        value: access_level.value.location.org_id,
        label: access_level.value.location.name,
      },
    ];
    org_ids.value = [
      {
        id: access_level.value.location.id,
        org_id: access_level.value.location.org_id,
      },
    ];
    fetchCounties();
  } else if (access_level.value.level.id == 2) {
    filterAccessList.value = ["county", "subcounty"];
    counties.value = [
      {
        value: access_level.value.location.org_id,
        label: access_level.value.location.name,
      },
    ];
    org_ids.value = [
      {
        id: access_level.value.location.id,
        org_id: access_level.value.location.org_id,
      },
    ];
  } else if (access_level.value.level.id == 3) {
    filterAccessList.value = ["subcounty"];
    subcounties.value = [
      {
        value: access_level.value.location.org_id,
        label: access_level.value.location.name,
      },
    ];
    org_ids.value = [
      {
        id: access_level.value.location.id,
        org_id: access_level.value.location.org_id,
      },
    ];
  }
  getTrainingSummary();
};
// get training summary
const getTrainingSummary = async () => {
  try {
    const response = await axios.get(
      `irs_household_summary?org_id=${access_level.value.location.org_id}`
    );
    const data = await response.data;
    Number(data);
    console.log(data.data);
    summary.no_of_people_sleep_in_non_sprayable =
      data.data.no_of_people_sleep_in_non_sprayable
        ? data.data.no_of_people_sleep_in_non_sprayable
        : 0;
    summary.no_of_people_sleep_in_stand_alone_units =
      data.data.no_of_people_sleep_in_stand_alone_units
        ? data.data.no_of_people_sleep_in_stand_alone_units
        : 0;
    summary.no_of_stand_alone_non_sprayable_surfaces =
      data.data.no_of_stand_alone_non_sprayable_surfaces
        ? data.data.no_of_stand_alone_non_sprayable_surfaces
        : 0;
    summary.number_of_households = data.data.number_of_households
      ? data.data.number_of_households
      : 0;
    summary.stand_alone_units_near_water_bodies =
      data.data.stand_alone_units_near_water_bodies
        ? data.data.stand_alone_units_near_water_bodies
        : 0;
    summary.stand_alone_units_sprayable_surfaces =
      data.data.stand_alone_units_sprayable_surfaces
        ? data.data.stand_alone_units_sprayable_surfaces
        : 0;
    summary.stand_alone_units_where_people_sleep =
      data.data.stand_alone_units_where_people_sleep
        ? data.data.stand_alone_units_where_people_sleep
        : 0;
  } catch (error) {
    console.error(error);
  }
};
const handleChange = async (org_id, org_level) => {
  //fetch child data
  // console.log(org_id)
  // console.log(org_ids.value)
  let org = org_ids.value.filter((x) => x.org_id === org_id).map((e) => e.id);
  // console.log(org)
  let parent_id = org[0] || 9;
  // console.log(parent_id)
  // console.log(org_level)
  fetchChildData(parent_id, org_id, org_level);
};
const fetchChildData = async (location_id, org_id, org_level) => {
  console.log(location_id);
  let fetchUrl = `get_sub_counties_list`;
  let masterListUrl = `irs_household_summary`;
  if (org_level == "county") {
    //get subcounties
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `?org_id=${org_id}`;
    //clear fields
    subcounty.value = "Select SubCounty";
  } else if (org_level == "subcounty") {
    //get wards
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `?org_id=${org_id}`;
  }
  await axios
    .get(`${fetchUrl}`)
    .then((response) => {
      let data = response.data.message;
      if (org_level == "county") {
        //get subcounties
        subcounties.value = data.map((x) => ({
          value: x.org_id,
          label: x.name,
        }));
        org_ids.value = [
          ...org_ids.value,
          ...data
            .map((x) => ({ org_id: x.org_id, id: x.id }))
            .filter(
              (newItem) =>
                !org_ids.value.some(
                  (existingItem) => existingItem.id === newItem.id
                )
            ),
        ];
      } else if (org_level == "subcounty") {
        //get wards
        wards.value = data.map((x) => ({
          value: x.org_id,
          label: x.name,
        }));
        org_ids.value = [
          ...org_ids.value,
          ...data
            .map((x) => ({ org_id: x.org_id, id: x.id }))
            .filter(
              (newItem) =>
                !org_ids.value.some(
                  (existingItem) => existingItem.id === newItem.id
                )
            ),
        ];
      }
    })
    .then(async () => {
      await axios.get(`${masterListUrl}`).then(async (response) => {
        console.log(response.data)
        const data = await response.data;
        summary.no_of_people_sleep_in_non_sprayable =
          data.no_of_people_sleep_in_non_sprayable
            ? data.no_of_people_sleep_in_non_sprayable
            : 0;
        summary.no_of_people_sleep_in_stand_alone_units =
          data.no_of_people_sleep_in_stand_alone_units
            ? data.no_of_people_sleep_in_stand_alone_units
            : 0;
        summary.no_of_stand_alone_non_sprayable_surfaces =
          data.no_of_stand_alone_non_sprayable_surfaces
            ? data.no_of_stand_alone_non_sprayable_surfaces
            : 0;
        summary.number_of_households = data.number_of_households
          ? data.number_of_households
          : 0;
        summary.stand_alone_units_near_water_bodies =
          data.stand_alone_units_near_water_bodies
            ? data.stand_alone_units_near_water_bodies
            : 0;
        summary.stand_alone_units_sprayable_surfaces =
          data.stand_alone_units_sprayable_surfaces
            ? data.stand_alone_units_sprayable_surfaces
            : 0;
        summary.stand_alone_units_where_people_sleep =
          data.stand_alone_units_where_people_sleep
            ? data.stand_alone_units_where_people_sleep
            : 0;
      });
    })
    .catch((error) => {
      notification.error({
        message: `Error!`,
        description: `${error}`,
      });
    });
};
const fetchCounties = async () => {
  axios
    .get("counties/")
    .then((response) => {
      counties.value = response.data
        .map((x) => ({
          value: x.org_id,
          label: x.name,
        }))
        .filter((e) => currentCounties.value.includes(e.value.toString()));
      org_ids.value = response.data.map((x) => ({
        org_id: x.org_id,
        id: x.id,
      }));
      // console.log(counties.value)
    })
    .catch((error) => {
      notification.error({
        message: `Error!`,
        description: `${error}`,
      });
    });
};
</script>
<style>
.badge-orange {
  background-color: orange;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-blue {
  background-color: blue;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-green {
  background-color: green;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-red {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-default {
  background-color: gray;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}
.full-modal {
  .ant-modal {
    max-width: 50%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    /* height: calc(70vh); */
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
