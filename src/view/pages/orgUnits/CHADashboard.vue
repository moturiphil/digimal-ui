<template>
  <a-layout class="layout">
    <a-layout-header>
      <h3
        class="sd-page-header"
        :style="{
          color: '#000000',
          lineHeight: '64px',
          margin: '0 24px',
          fontSize: '1.5rem',
        }"
      >
        Sub-Location Supervisor Dashboard
      </h3>
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
              @click="window.location.reload()"
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
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="light"
        mode="horizontal"
        :style="{
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '2px solid #1ec997',
        }"
      >
        <a-menu-item
          key="1"
          @click="selectMenuItem('1')"
          :style="{ color: selectedKeys[0] === '1' ? '#1ec997' : '' }"
          >Distribution Post</a-menu-item
        >
        <a-menu-item
          key="2"
          @click="selectMenuItem('2')"
          :style="{ color: selectedKeys[0] === '2' ? '#1ec997' : '' }"
          >Villages</a-menu-item
        >
      </a-menu>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0"> </a-breadcrumb>
      <br />
      <br />
      <br />
      <div
        :style="{ background: '#FFFFFF', padding: '24px', minHeight: '280px' }"
      >
        <template v-if="selectedKeys[0] === '1'">
          <h2>Distribution Posts</h2>
          <!-- <a-table :columns="transfersColumns" :data-source="subLocationData" /> -->
          <div class="table-responsive">
            <a-row>
              <div class="search-box">
                    <a-input
                      style="
                        padding: 8px;
                        border-radius: 5px;
                        align-items: end;
                        justify-items: end;
                      "
                      v-model:value="searchItem"
                      width="100"
                      type="text"
                      name="dataSource"
                      placeholder="Search ..."
                    />
                  </div>
            </a-row>
            <a-table
              :columns="transfersColumns"
              :data-source="subLocationData"
              :scroll="{ x: 'max-content' }"
              :pagination="false"
            >
              <template #posts="{ record }">
                <td>
                  <!-- Buttons for viewing confirmed and pending participants -->
                  <div class="table-actions">
                    <!-- Button for viewing confirmed participants -->
                    <sdButton size="extra-small" type="success">
                      <router-link
                        :to="{
                          path: `/posts/hh/${record.id}`,
                          query: {
                            id: record.id,
                          },
                        }"
                        class="btn-icon"
                        type="info"
                        shape="circle"
                      >
                        View Households
                      </router-link>
                    </sdButton>
                  </div>
                </td>
              </template>
            </a-table>
            <a-pagination
              :current="currentPage"
              :total="datatotal"
              :pageSize="pageSize"
              :showSizeChanger="true"
              :pagination="true"
              @change="onLTablePageChange($event)"
            />
          </div>
        </template>
        <template v-else-if="selectedKeys[0] === '2'">
          <h2>Villages</h2>
          <!-- <a-table :columns="villagesColumns" :data-source="villagesData" /> -->
          <div class="table-responsive">
            <a-row  style="
                        padding: 8px;
                        border-radius: 5px;
                        align-items: center;
                        justify-items: center;
                      ">
              <div class="search-box">
                    <a-input
                      style="
                        padding: 8px;
                        border-radius: 5px;
                        align-items: end;
                        justify-items: end;
                      "
                      v-model:value="searchItem"
                      width="100"
                      type="text"
                      name="dataSource"
                      placeholder="Search ..."
                    />
                  </div>
            </a-row>
            <a-table
              :columns="villagesColumns"
              :data-source="villagesData"
              :scroll="{ x: 'max-content' }"
            >
              <template #villages="{ record }">
                <td>
                  <!-- Buttons for viewing confirmed and pending participants -->
                  <div class="table-actions">
                    <!-- Button for viewing confirmed participants -->
                    <sdButton size="extra-small" type="success">
                      <router-link
                        :to="{
                          path: `/villages/hh/${record.id}`,
                          query: {
                            id: record.id,
                          },
                        }"
                        class="btn-icon"
                        type="info"
                        shape="circle"
                      >
                        View Households
                      </router-link>
                    </sdButton>
                  </div>
                </td>
              </template>
            </a-table>
            <a-pagination
              :current="currentPage"
              :total="datatotal"
              :pageSize="pageSize"
              :showSizeChanger="true"
              :pagination="true"
              @change="onPageChange($event)"
            />
          </div>
        </template>
      </div>
      <br />
      <br />
      <br />
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
//   import { fetchData } from "@/api"; // Replace with your actual API module
import axios from "@/Axiosconfig";
// import { TableWrapper } from "../../styled";
import { notification } from "ant-design-vue";
import { ReloadOutlined } from "@ant-design/icons-vue";

var currentPage = ref(1);
var pageSize = ref(100);
var datatotal = ref(0);

const selectedKeys = ref(["2"]);

const transfersColumns = ref([
  {
    title: "Distribution Post",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Post Code",
    dataIndex: "post_code",
    key: "id",
  },
  {
    title: "Post Supervisor",
    dataIndex: "post_supervisor_user_id",
    key: "id",
  },
  {
    title: "Distribution Start Date",
    dataIndex: "distribution_start_date",
    key: "id",
  },
  {
    title: "Distribution End Date",
    dataIndex: "distribution_end_date",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "posts",
    slots: { customRender: "posts" },
  },
]);

const villagesColumns = ref([
  {
    title: "Village",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "id",
  },
  {
    title: "No of CHPs",
    dataIndex: "no_of_chp_registered",
    key: "id",
  },
  {
    title: "No of Village Elders",
    dataIndex: "no_of_ve_registered",
    key: "id",
  },
  {
    title: "No of Households",
    dataIndex: "no_of_registered_hh",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "villages",
    slots: { customRender: "villages" },
  },
]);
const villagesData = ref([]);
const subLocationData = ref([]);
//Drill down filters
const access_level = ref({});
const filterAccessList = ref([]);
const searchItem = ref("");
//org levels
const countries = ref([
  { value: { id: 1, org_id: "HfVjCurKxh2" }, label: "Kenya" },
]);
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
const selecteLocation=ref("");
const selectedOrLevel=ref("");
const  org_ids = ref([]);
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
const selectMenuItem = (key) => {
  selectedKeys.value = [key];
};
const onPageChange = async (page) => {
  currentPage.value = page;
  try {
    if(selectedOrLevel.value=='sublocation'){
    fetchSubLocationData();
    }else{
      fetchVillagesData();
    }
  } catch (error) {
    console.error(error);
  }
};
watch(
  () => searchItem.value,
  (newValue) => {
    searchItem.value = newValue;
    if(selectedOrLevel.value=='sublocation'){
    fetchSubLocationData();
    }else{
      fetchVillagesData();
    }
  }
);
// Initial load: Fetch villages data
onMounted(async () => {
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
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
    await fetchVillagesData();
});
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
  fetchVillagesData();
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
  selectedOrLevel.value=org_level;
  currentPage.value = 1;
  let fetchUrl = `get_sub_counties_list`;
  let masterListUrl = `villages/list?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}`;
  if (org_level == "county") {
    selecteLocation.value=location_id||"";
    //get subcounties
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location_id=${selecteLocation.value}`;
    //clear fields
    subcounty.value = "Select SubCounty";
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "subcounty") {
    selecteLocation.value=location_id||"";
    //get wards
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location_id=${selecteLocation.value}`;
    //clear fields
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "ward") {
    selecteLocation.value=location_id||"";
    //get locatios
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location_id=${selecteLocation.value}`;
    //clear fields
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "location") {
    selecteLocation.value=location_id||"";
    //get sub locatios
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location_id=${selecteLocation.value}`;
    //clear fields
    sublocation.value = "Select Sub Location";
  } else if (org_level == "sublocation") {
    selecteLocation.value=location_id||"";
    //get sublocations stats
    masterListUrl=`sub_location_posts?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}`
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location_id=${selecteLocation.value}`;
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
        console.log(response.data.data);
        let data = response.data.data.data;
        if(org_level==='sublocation'){
          subLocationData.value=data;
        }else{
        villagesData.value = data;
        }
        datatotal.value = response.data.data.total;
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
const onLTablePageChange = async (page) => {
  currentPage.value = page;
  try {
    const response = await axios.get(
      `gf_events?page=${page}&per_page=${pageSize.value}`
    );
    subLocationData.value = response.data.data;
    datatotal.value = response.data.pagination.total;
  } catch (error) {
    console.error(error);
  }
};
// Function to fetch village data
const fetchVillagesData = async () => {
  try {
    const response = await axios.get(`villages/list?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}&location_id=${selecteLocation.value}`);
    const data = await response.data;
    console.log(data);
    villagesData.value = data.data;
  } catch (error) {
    console.error(error);
  }
};

// Function to fetch sub location data
const fetchSubLocationData = async () => {
  try {
    const response = await axios.get(`sub_location_posts?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}&location_id=${selecteLocation.value}`);
    const data = await response.data;
    console.log(data);
    subLocationData.value = data.data;
  } catch (error) {
    console.error(error);
  }
};

// Watch for changes in selectedKeys
watch(selectedKeys, async (newSelectedKeys) => {
  if (newSelectedKeys[0] === "1") {
    await fetchSubLocationData();
  } else if (newSelectedKeys[0] === "2") {
    await fetchVillagesData();
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
