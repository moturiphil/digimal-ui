<template>
  <RecordViewWrapper>
    <sdPageHeader title="Household IRS Dasboard">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search ..."
          />
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="16" class="search-row"> </a-row>
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <a-row>
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
                        marging: '1px 0px 4px 0px',
                        align: 'end',
                        justify: 'end',
                      }"
                    >
                      <a-button
                        @click="Reset"
                        :style="{
                          padding: '2px',
                          margin:'4px',
                          background: '#24daa3',
                          marging: '0px 0px 0px 4px',
                          align: 'end',
                          justify: 'end',
                        }"
                      >
                        <ReloadOutlined />
                        RESET
                      </a-button>
                    </a-col>
                </a-row>
                <a-table
                  :pagination="{
                    pageSize: 100,
                    showSizeChanger: true,
                    current: currentPage,
                  }"
                  :dataSource="dataSource"
                  :columns="columns"
                  @change="handleTableChange"
                >
                </a-table>
                <a-pagination
                  :current="currentPage"
                  :total="datatotal"
                  :pageSize="pageSize"
                  :showSizeChanger="true"
                  :pagination="true"
                  @change="onPageChange($event)"
                />
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref,watch } from "vue";
import { notification } from "ant-design-vue";
import axios from "@/Axiosconfig";

  const columns = [
      {
      title: "First Name",
      dataIndex: "first_name",
      key: "id",
      },
      {
      title: "Last Name",
      dataIndex: "last_name",
      key: "id",
      },
      {
      title: "Stand-Aulone Units",
      dataIndex: "stand_alone_units_where_people_sleep",
      key: "id",
      },
      {
      title: "Unit Capacity",
      dataIndex: "no_of_people_sleep_in_stand_alone_units",
      key: "id",
      },
      {
      title: "Unit Sprayable Surfaces",
      dataIndex: "stand_alone_units_sprayable_surfaces",
      key: "id",
      },
      {
      title: "Unit Non-Sprayable Surfaces",
      dataIndex: "no_of_stand_alone_non_sprayable_surfaces",
      key: "id",
      },
      {
      title: "Non-Sprayable Surfaces Capacity",
      dataIndex: "no_of_people_sleep_in_non_sprayable",
      key: "id",
      },
      {
      title: "Standalone Units Near Water Bodies",
      dataIndex: "stand_alone_units_near_water_bodies",
      key: "id",
      },
      {
      title: "",
      dataIndex: "",
      key: "action",
      slots: { customRender: "action" },
      },
  ];
  const { state } = useStore();
  const dataSource=ref([]);
  const isLoading = computed(() => state.crud.loading);
  const searchItem = ref("");
  const selecteLocation=ref("")
  var currentPage = ref(1);
  var pageSize = ref(100);
  var datatotal = ref(0);

  //Drill down filters
  const access_level = ref({});
  const filterAccessList = ref([]);
  const counties = ref(null);
  const subcounties = ref(null);
  const wards = ref(null);
  const locations = ref(null);
  const sublocations = ref(null);
  // const villages = ref(null)
  const county = ref("Select County");
  const sublocation = ref("Select Sublocation");
  const subcounty = ref("Select Subcounty");
  const location = ref("Select Location");
  const ward = ref("Select Ward");
  // const village = ref("Select a Post")
  const org_ids = ref([]);

  const currentCounties = ref([
    "nK0A12Q7MvS", //homa bay
    "sPkRcDvhGWA", //kisii
    "uepLTG8wGWJ", //nyamira
    "tAbBVBbueqD", //kisumu
    "u4t9H8XyU9P", //siaya
    "fVra3Pwta0Q", //migori
    // 'Tvf1zgVZ0K4',//busia
    // 'NjWSbQTwys4',//lamu
    // 'nrI2khZx3d0',//kilifi
    // 'JsH2bnvNt2d',//tan river
    "N7YETT3A9r1", //kwale
    "QyGNX2DpR4h", //taita taveta
    "wsBsC6gjHvn", // mombasa
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
  const onPageChange = async (page) => {
   currentPage.value = page;
    try {
      getHouseholdIRS();
    } catch (error) {
      console.error(error);
    }
  };
  //reset
  const Reset=()=>{
    window.location.reload();
  }
  //search
  watch(() => searchItem.value,(newValue) => {
    searchItem.value = newValue;
      getHouseholdIRS();
    }
  ); 
  onMounted(async () => {
      if (sessionStorage.getItem("user") != null) {
        access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
        selecteLocation.value=access_level.value.location.org_id;
        filterAccessList.value = [
          "country",
          "county",
          "subcounty",
          "ward",
          "location",
          "sublocation",
          "village",
        ];
      }
    await updateFilters();
  })
  const getHouseholdIRS=async()=>{
    axios.get(`irs_household_dashboard?page=${currentPage.value}&page_size=${pageSize.value}&org_id=${selecteLocation.value}&query=${searchItem.value}`)
    .then((response) => {
        let data = response.data.data;
        dataSource.value=data;
        datatotal.value = response.data.pagination.total;
      });
  };
  const updateFilters = () => {
  // access_level.value.level.level_name = 'national'
  // access_level.value.location.id = 1
  // access_level.value.location.org_id = 'HfVjCurKxh2'
  // access_level.value.location.name = 'Kenya'

    if (access_level.value.level.id == 1) {
      filterAccessList.value = [
        "county",
        "subcounty",
        "ward",
        "location",
        "sublocation",
      ];
      org_ids.value = [
        {
          id: access_level.value.location.id,
          org_id: access_level.value.location.org_id,
        },
      ];
      fetchCounties();
    } else if (access_level.value.level.id == 2) {
      filterAccessList.value = [
        "county",
        "subcounty",
        "ward",
        "location",
        "sublocation",
      ];
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
      filterAccessList.value = ["subcounty", "ward", "location", "sublocation"];
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
    } else if (access_level.value.level.id == 4) {
      filterAccessList.value = ["ward", "location", "sublocation"];
      wards.value = [
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
    } else if (access_level.value.level.id == 5) {
      filterAccessList.value = ["location", "sublocation"];
      locations.value = [
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
    } else if (access_level.value.level.id == 6) {
      filterAccessList.value = ["sublocation"];
      sublocations.value = [
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
    getHouseholdIRS();
  };

const handleChange = async (org_id, org_level) => {
  //fetch child data
  console.log(org_id);
  console.log(org_ids.value);
  let org = org_ids.value.filter((x) => x.org_id === org_id).map((e) => e.id);
  console.log(org);
  let parent_id = org[0] || 9;
  console.log(parent_id);
  console.log(org_level);
  fetchChildData(parent_id, org_id, org_level);
  };
  const fetchChildData = async (location_id, org_id, org_level) => {
  //selectedOrLevel.value=org_level;
  currentPage.value = 1;
  let fetchUrl = `get_sub_counties_list`;
  let masterListUrl = `irs_household_dashboard?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}`;
  if (org_level == "county") {
    selecteLocation.value=org_id||"";
    //get subcounties
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&org_id=${selecteLocation.value}`;
    //clear fields
    subcounty.value = "Select SubCounty";
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "subcounty") {
    selecteLocation.value=org_id||"";
    //get wards
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&org_id=${selecteLocation.value}`;
    //clear fields
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "ward") {
    selecteLocation.value=org_id||"";
    //get locatios
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&org_id=${selecteLocation.value}`;
    //clear fields
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "location") {
    selecteLocation.value=org_id||"";
    //get sub locatios
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&org_id=${selecteLocation.value}`;
    //clear fields
    sublocation.value = "Select Sub Location";
  } else if (org_level == "sublocation") {
    selecteLocation.value=org_id||"";
    //get sublocations stats
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&org_id=${selecteLocation.value}`;
  }
  await axios
    .get(`${fetchUrl}`)
    .then((response) => {
      let data = response.data.message;
      if (org_level == "country") {
        //get counties
        counties.value = data.map((x) => ({
          value: x.org_id,
          label: x.name,
        }));
        org_ids.value = data.map((x) => ({ org_id: x.org_id, id: x.id }));
        counties.value.splice(0, 1);
      } else if (org_level == "county") {
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
      } else if (org_level == "ward") {
        //get locations
        locations.value = data.map((x) => ({
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
      } else if (org_level == "location") {
        //get sublocations
        sublocations.value = data.map((x) => ({
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
      await axios.get(`${masterListUrl}`).then((response) => {
        let data = response.data.data;
        dataSource.value=data;
        datatotal.value = response.data.pagination.total;
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
      console.log(counties.value);
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
/* You can style the toggle switch as needed */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #1ec997;
}

input:focus + .slider {
  box-shadow: 0 0 1px #1ec997;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
