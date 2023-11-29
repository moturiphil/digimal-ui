<template>
  <div>
    <sdPageHeader ghost title="Registered Households" />

    <Main>
      <!-- <sdButton class="btn-import" type="success" @click="exportHouseHoldData">
        Export HouseHolds Data
      </sdButton> -->
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <sdCards headless>
              <div class="result-list-content">
                <a-row :gutter="15">
                  <a-col class="w-100" :md="24">
                    <sdCards headless>
                      <div v-if="isLoading" class="spin">
                        <a-spin />
                      </div>

                      <div v-else>
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'all'"
                        ><h1></h1>
                        <a-row class="" style="float:end;" :gutter="5">
                          <a-space>
                          <a-col v-if="filterAccessList.includes('country')" :xxl="3" :xl="6" :md="12" :sm="24">
                            <a-select v-model:value="country" show-search placeholder="Select Country" style="width: 200px"
                              :options="countries" :filter-option="filterOption" @change="handleChange($event, 'country')"></a-select>
                          </a-col>
                          <a-col v-if="filterAccessList.includes('county')" :xxl="3" :xl="6" :md="12" :sm="24">
                            <a-select v-model:value="county" show-search placeholder="Select County" style="width: 200px"
                              :options="counties" :filter-option="filterOption" @change="handleChange($event, 'county')"></a-select>
                          </a-col>
                          <a-col v-if="filterAccessList.includes('subcounty')">
                            <a-select v-model:value="subcounty" show-search placeholder="Select Sub County" style="width: 200px"
                              :options="subcounties" :filter-option="filterOption" @change="handleChange($event, 'subcounty')"></a-select>
                          </a-col>
                          <a-col v-if="filterAccessList.includes('ward')" :xxl="3" :xl="6" :md="12" :sm="24">
                            <a-select v-model:value="ward" show-search placeholder="Select Ward" style="width: 200px" :options="wards"
                              :filter-option="filterOption" @change="handleChange($event, 'ward')"></a-select>
                          </a-col>
                          </a-space>
                        </a-row>
                        <br/>
                        <a-row style="float:end;" :gutter="5">
                          <a-space>
                          <a-col v-if="filterAccessList.includes('location')" :xxl="3" :xl="6" :md="12" :sm="24">
                            <a-select v-model:value="location" show-search placeholder="Select Location" style="width: 200px"
                              :options="locations" :filter-option="filterOption" @change="handleChange($event, 'location')"></a-select>
                          </a-col>
                          <a-col v-if="filterAccessList.includes('sublocation')" :xxl="3" :xl="6" :md="12" :sm="24">
                            <a-select v-model:value="sublocation" show-search placeholder="Select Sub Location" style="width: 200px"
                              :options="sublocations" :filter-option="filterOption"
                              @change="handleChange($event, 'sublocation')" ></a-select>
                          </a-col>
                          <a-col v-if="filterAccessList.includes('village')" :xxl="3" :xl="6" :md="12" :sm="24">
                              <a-select v-model:value="village" show-search placeholder="Select a Post" style="width: 200px"
                                :options="villages" :filter-option="filterOption"
                                @change="handleChange($event, 'village')" ></a-select>
                            </a-col>
                          </a-space>
                        </a-row>
                        <a-divider></a-divider>
                          <a-table
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                          <template #pagination="{ pageSize }">
                            <a-pagination
                              :total="pageSize"
                              v-model:current="current"
                              @change="handlePaginationChange(current)"
                            />
                            </template>
                          </a-table>
                        </TableWrapper>
                      </div>
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
              <!-- <a-pagination
                  show-size-changer
                  :default-current="3"
                  :total="40"
                  @showSizeChange="onShowSizeChange"
                /> -->
            </sdCards>
            <a-modal
              title="HouseHold Size Validation"
              :visible="isModalOpen"
              @ok="handleOk(recordId, inputValue)"
              @cancel="handleCancel"
              class="title-success"
            >
              <div>
                <h4>HouseHold Size Verification</h4>
                <p>HH Size: {{ inputValue }}</p>
                <input type="number" v-model="inputValue" />
              </div>
            </a-modal>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import { computed, onMounted, ref, defineProps } from "vue";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { notification } from "ant-design-vue";

// const households = ref([]);
const columns = [
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
];
//const store= useStore();

// const notData=ref(null)
const current=ref(0)
const pageSize=ref(0)
const visible=ref(false)
// const confirmLoading=ref(false)
// const modalType=ref("primary")
const colorVisible=ref(false)
//const households = ref([])
const { state } = useStore();
//const crud = computed(() => state.crud.data);
const isLoading = computed(() => state.crud.loading);
//const selectedRowKeys = ref([]);
const dataSource = ref([]);
const activeClass = ref("all");
const isModalOpen = ref(false);
const inputValue = ref("");
//const household_id = ref("");
//const searchItem = ref("");
const { query } = useRoute();
const API_URL = `${process.env.VUE_APP_BASE_URL}/chw_households?chp_id=${query.id}`;
console.log(query.id);

//Drill down filters
const access_level = ref({})
const filterAccessList = ref([])
//org levels
const countries = ref([{ value: { id: 1, org_id: 'HfVjCurKxh2' }, label: "Kenya" }])
const counties = ref(null)
const subcounties = ref(null)
const wards = ref(null)
const locations = ref(null)
const sublocations = ref(null)
const villages = ref(null)
const country = ref("Select Country")
const county = ref("Select County")
const sublocation = ref("Select Sublocation")
const subcounty = ref("Select Subcounty")
const location = ref("Select Location")
const ward = ref("Select Ward")
const village = ref("Select a Post")
const org_ids = ref([])

onMounted(async () => {
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    updateFilters()
    console.log(JSON.stringify(access_level.value.location));
  }
});

// const handlePaginationChange = (newPage) => {
//   current.value = newPage;
//   console.log(newPage);
//   fetchHouseHolds()
// };

const updateFilters = () => {
  // access_level.value.level.level_name = 'national'
  // access_level.value.location.id = 1
  // access_level.value.location.org_id = 'HfVjCurKxh2'
  // access_level.value.location.name = 'Kenya'

  if (access_level.value.level.level_name.toLowerCase() == 'national') {
    filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    countries.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
    fetchCounties()
  } else if (access_level.value.level.level_name.toLowerCase() == 'county') {
    filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    counties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.level_name.toLowerCase() == 'subcounty') {
    filterAccessList.value = ['subcounty', 'ward', 'location', 'sublocation', 'village']
    subcounties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.level_name.toLowerCase() == 'ward') {
    filterAccessList.value = ['ward', 'location', 'sublocation', 'village']
    wards.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.level_name.toLowerCase() == 'location') {
    filterAccessList.value = ['location', 'sublocation', 'village']
    locations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.level_name.toLowerCase() == 'sublocation') {
    filterAccessList.value = ['sublocation', 'village']
    sublocations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else {
    filterAccessList.value = ['village']
    villages.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  }
  fetchHouseHolds()
}

const handleChange = async (org_id, org_level) => {
  //fetch child data
  let org = org_ids.value.filter(x => x.org_id === org_id).map(e => e.id)
  console.log(org)
  let parent_id = org[0] || 1
  console.log(parent_id)
  console.log(org_level)
  fetchChildData(parent_id, org_id, org_level)
};
const fetchChildData = async (location_id, org_id, org_level) => {
  let fetchUrl = `get_sub_counties_list`
  let masterListUrl = `users?page=${current.value}&per_page=${pageSize.value}`
  if (org_level == 'country') {//get counties
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    county.value = "Select County"
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'county') {//get subcounties
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'subcounty') {//get wards
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'ward') {//get locatios
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'location') {//get sub locatios
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'sublocation') {//get sublocations stats
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    sublocation.value = "Select Sub Location"
    village.value = "Select Post"
  } else if (org_level == 'village') {
    masterListUrl += `&location=${location_id}`
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
      } else if (org_level == 'sublocation') {//get villages
        villages.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = data.map(x => ({
          org_id: x.org_id,
          id: x.id
        }));
      }
    }).then(async () => {
      await axios.get(`${masterListUrl}`)
        .then(response => {
          console.log(response.data)
          let data = response.data;
          const updatedData = data.data.map((record) => {
            let fullName = `${record.first_name} ${record.middle_name} ${record.last_name}`;
            let status = record.status == 1 ? "validated" : "Not Validated";
            return {
              ...record,
              fullName,
              status,
            };
          });
          dataSource.value = updatedData;
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
      })).filter(e => e.value == 'nK0A12Q7MvS');
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

defineProps({
  recordId: Number,
  hh_size: Number,
});

const fetchHouseHolds=() => {
  axios
    .get(API_URL)
    .then((response) => {
      console.log(response.data.data);
      dataSource.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
}

// const handleSearch =(searchText)=>{
//   const data = this.searchData.filter((item) =>
//     item.title.toUpperCase().startsWith(searchText.toUpperCase())
//   );
//   notData.value = data;
// }

const handleCancel=()=>{
  isModalOpen.value = false;
  visible.value = false;
  colorVisible.value = false;
}

// const onShowSizeChange=(current, pageSize)=>{
//   current.value = current;
//   pageSize.value = pageSize;
// }
// const searchData=()=>{
//   return store.state.headerSearch.data;
// }

// const paginationOptions = ref({
//   pageSize: 100, // Number of items per page
//   showSizeChanger: true, // Show the page size changer
//   current: 1, // Current page number
//   total: 0, // Total number of items (will be updated after fetching data)
// });

// const handleChange = (tab) => {
//   activeClass.value = tab;
// };

// const formState = reactive({
//   searchItem: "",
// });

</script>
