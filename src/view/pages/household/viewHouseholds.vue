<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ou-units-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> HouseHolds Registered
            </h3>
            <div class="ou-crumb">
              <span class="crumb-current">HouseHolds</span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">Registered</span>
            </div>
          </div>
          <div class="ph-actions">
            <div class="ou-search">
              <span class="search-icon">
                <sdFeatherIcons type="search" size="14" />
              </span>
              <a-input
                v-model:value="searchItem"
                type="text"
                name="dataSource"
                placeholder="Search by ID No, Phone No, name"
                allow-clear
              />
            </div>
            <div class="ou-view-toggle" role="group" aria-label="Toggle view">
              <button
                type="button"
                class="ou-toggle-btn"
                :class="{ active: viewMode === 'cards' }"
                @click="viewMode = 'cards'"
              >
                <sdFeatherIcons type="grid" size="14" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                class="ou-toggle-btn"
                :class="{ active: viewMode === 'table' }"
                @click="viewMode = 'table'"
              >
                <sdFeatherIcons type="list" size="14" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Summary strip -->
        <section class="panel ou-stats">
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="home" size="16" /></span>
            <div>
              <span class="val">{{ datatotal }}</span>
              <span class="lbl">Total Households</span>
            </div>
          </div>
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="database" size="16" /></span>
            <div>
              <span class="val">{{ dataSource.length }}</span>
              <span class="lbl">On This Page</span>
            </div>
          </div>
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="layers" size="16" /></span>
            <div>
              <span class="val">{{ pageSize }}</span>
              <span class="lbl">Page Size</span>
            </div>
          </div>
        </section>

        <!-- Location filters -->
        <section class="panel ou-filter-panel">
          <div class="ou-filter-grid">
            <a-row class="" :gutter="5">
              <a-space wrap>
                              <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                                <a-select
                                  v-if="filterAccessList.includes('country')"
                                  v-model:value="country"
                                  show-search
                                  placeholder="Select Country"
                                  style="width: 100%"
                                  :options="countries"
                                  :filter-option="filterOption"
                                  @change="handleChange($event, 'country')"
                                ></a-select>
                              </a-col>
                              <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                                <a-select
                                  v-if="filterAccessList.includes('county')"
                                  v-model:value="county"
                                  show-search
                                  placeholder="Select County"
                                  style="width: 100%"
                                  :options="counties"
                                  :filter-option="filterOption"
                                  @change="handleChange($event, 'county')"
                                ></a-select>
                              </a-col>
                              <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                                <a-select
                                  v-if="filterAccessList.includes('subcounty')"
                                  v-model:value="subcounty"
                                  show-search
                                  placeholder="Select Sub County"
                                  style="width: 100%"
                                  :options="subcounties"
                                  :filter-option="filterOption"
                                  @change="handleChange($event, 'subcounty')"
                                ></a-select>
                              </a-col>
                              <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                                <a-select
                                  v-if="filterAccessList.includes('ward')"
                                  v-model:value="ward"
                                  show-search
                                  placeholder="Select Ward"
                                  style="width: 100%"
                                  :options="wards"
                                  :filter-option="filterOption"
                                  @change="handleChange($event, 'ward')"
                                ></a-select>
                              </a-col>
                              <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                                <a-select
                                  v-if="filterAccessList.includes('location')"
                                  v-model:value="location"
                                  show-search
                                  placeholder="Select Location"
                                  style="width: 100%"
                                  :options="locations"
                                  :filter-option="filterOption"
                                  @change="handleChange($event, 'location')"
                                ></a-select>
                              </a-col>
                              <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                                <a-select
                                  v-if="
                                    filterAccessList.includes('sublocation')
                                  "
                                  v-model:value="sublocation"
                                  show-search
                                  placeholder="Select Sub Location"
                                  style="width: 100%"
                                  :options="sublocations"
                                  :filter-option="filterOption"
                                  @change="handleChange($event, 'sublocation')"
                                ></a-select>
                              </a-col>
                            </a-space>
            </a-row>
          </div>
        </section>

        <!-- Households list -->
        <section class="panel ou-list-panel">
          <div v-if="isLoading" class="ou-loading">
            <a-spin />
          </div>

          <div v-else>
            <TableWrapper
              v-if="viewMode === 'table'"
              class="table-data-view table-responsive ou-table-shell"
            >
              <a-table
                :pagination="false"
                :dataSource="dataSource"
                :columns="columns"
                row-key="id"
              >
              </a-table>
              <div class="ou-pagination">
                <a-pagination
                  :current="currentPage"
                  :total="datatotal"
                  :pageSize="pageSize"
                  :showSizeChanger="true"
                  @change="onPageChange($event)"
                />
              </div>
            </TableWrapper>

            <div v-else class="ou-card-list">
              <article
                v-for="record in dataSource"
                :key="record.id"
                class="ou-card"
              >
                <div class="ou-card-head">
                  <div class="ou-card-title">
                    {{ record.first_name }} {{ record.last_name }}
                  </div>
                  <span class="ou-chip">
                    {{ record.hh_size }} member(s)
                  </span>
                </div>
                <div class="ou-card-meta">
                  <div>
                    <span class="lbl">Phone</span>
                    <span class="val">{{ record.phone_no || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Village</span>
                    <span class="val">{{ record.location_id || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Post</span>
                    <span class="val">{{ record.post_id || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">CHP</span>
                    <span class="val">{{ record.chw_id || "—" }}</span>
                  </div>
                </div>
              </article>
              <div v-if="!dataSource.length" class="ou-empty">
                No households found.
              </div>
            </div>
          </div>
        </section>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { RecordViewWrapper } from "../style";
import { BudgetPageWrapper } from "../budget/style";
import { Main, TableWrapper } from "../../styled";
import { onMounted, ref, defineProps, watch } from "vue";
import axios from "@/Axiosconfig";
import { notification } from "ant-design-vue";

const columns = ref([
  {
    title: "First name",
    dataIndex: "first_name",
    key: "id_no",
  },
  {
    title: "Last name",
    dataIndex: "last_name",
    key: "id_no",
  },
  {
    title: "Phone number",
    dataIndex: "phone_no",
    key: "id_no",
  },
  {
    title: "Household size",
    dataIndex: "hh_size",
    key: "id_no",
  },
  {
    title: "Village",
    dataIndex: "location_id",
    key: "id_no",
  },
  {
    title: "Distribution Post",
    dataIndex: "post_id",
    key: "id_no",
  },
  {
    title: "CHP",
    dataIndex: "chw_id",
    key: "id_no",
  },
  {
    title: "CHP Phone Number",
    dataIndex: "chw_phone_no",
    key: "id_no",
  },
  {
    title: "Timestamp",
    dataIndex: "created_at_time",
    key: "id_no",
  },
  {
    title: "",
    dataIndex: "",
    key: "households",
    slots: { customRender: "households" },
  },
]);
var currentPage = ref(1);
var pageSize = ref(100);
var datatotal = ref(0);
const searchItem = ref("");
const isLoading = ref(true);
const dataSource = ref([]);
const total_households = ref(0);
const viewMode = ref(
  typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
);

//Drill down filters
const access_level = ref({});
const filterAccessList = ref([]);
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
const country = ref("Select Country");
const county = ref("Select County");
const sublocation = ref("Select Sublocation");
const subcounty = ref("Select Subcounty");
const location = ref("Select Location");
const ward = ref("Select Ward");
// const village = ref("Select a Post")
const org_ids = ref([]);
const location_id = ref("");

const currentCounties = ref([
  "nK0A12Q7MvS", //homa bay
  "sPkRcDvhGWA", //kisii
  "uepLTG8wGWJ", //nyamira
  "tAbBVBbueqD", //kisumu
  "u4t9H8XyU9P", //siaya
  "fVra3Pwta0Q", //migori
  "Tvf1zgVZ0K4", //busia
  "NjWSbQTwys4", //lamu
  "nrI2khZx3d0", //kilifi
  "JsH2bnvNt2d", //tana river
  "N7YETT3A9r1", //kwale
  "QyGNX2DpR4h", //taita taveta
  "wsBsC6gjHvn", // mombasa
  "KGHhQ5GLd4k", //bungoma
  "BjC1xL40gHo", //kakamega
  "ihZsJ8alvtb", // Kericho
  "t0J75eHKxz5", // Nandi
  "sANMZ3lpqGs", //vihiga
  "XWALbfAPa6n", //west pokot
  "kphDeKClFch", //turkana
  "mThvosEflAU", //trans nzoia
  "kqJ83J2D72s", //naraok
  // 'Eey8fT4Im3y',//marsabit
  "vvOK1BxTbet", //baringo
  "Ulj33KBau7V", // kirinyaga
]);

defineProps({
  recordId: Number,
  hh_size: Number,
});

onMounted(async () => {
  isLoading.value = true;
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
    updateFilters();
    console.log(JSON.stringify(access_level.value.location));
  }
});

const onPageChange = async (page) => {
  currentPage.value = page;
  try {
    fetchHouseholds();
  } catch (error) {
    console.error(error);
  }
};

const updateFilters = () => {
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
  fetchHouseholds();
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
const fetchChildData = async (loc_id, org_id, org_level) => {
  currentPage.value = 1;
  location_id.value = loc_id;
  let fetchUrl = `get_sub_counties_list`;
  let masterListUrl = `households?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}`;
  if (org_level == "county") {
    //get subcounties
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location_id=${location_id.value}`;
    //clear fields
    subcounty.value = "Select SubCounty";
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "subcounty") {
    //get wards
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location_id=${location_id.value}`;
    //clear fields
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "ward") {
    //get locatios
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location_id=${location_id.value}`;
    //clear fields
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "location") {
    //get sub locatios
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location_id=${location_id.value}`;
    //clear fields
    sublocation.value = "Select Sub Location";
  } else if (org_level == "sublocation") {
    //get sublocations stats
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location_id=${location_id.value}`;
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
        dataSource.value = data;
        // paginationOptions.value.total = response.data.data.length;
        datatotal.value = response.data.data.total;
        total_households.value = response.data.data.total;
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

const fetchHouseholds = () => {
  isLoading.value = true;
  axios
    .get(
      `households?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}&location_id=${location_id.value}`
    )
    .then((response) => {
      console.log(response.data.data);
      dataSource.value = response.data.data.data;
      // paginationOptions.value.total = response.data.data.length;
      datatotal.value = response.data.data.total;
      total_households.value = response.data.data.total;
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

watch(
  () => searchItem.value,
  (newValue) => {
    searchItem.value = newValue;
    fetchHouseholds();
  }
);
</script>
<style>
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}
</style>
