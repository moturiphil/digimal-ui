<template>
  <div>
    <sdPageHeader ghost title="HouseHold Validations">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name, level, location or organization"
          />
        </div>
      </template>
    </sdPageHeader>

    <Main>
      <!-- <sdButton class="btn-import" type="success" @click="exportHouseHoldData">
        Export HouseHolds Data
      </sdButton> -->
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu">
              <ul>
                <!-- <li>
                  <a
                    :class="activeClass === 'all' ? 'active' : 'deactivate'"
                    @click="handleChange('all')"
                    href="#"
                  >
                    All HouseHolds
                  </a>
                </li> -->
                <!-- <li>
                  <a
                    :class="
                      activeClass === 'approved' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('approved')"
                    href="#"
                  >
                    Approved HouseHolds
                  </a>
                </li> -->
                <li>
                  <a
                    :class="
                      activeClass === 'outliers' ? 'active' : 'active'
                    "
                    @click="handleChange('outliers')"
                    href="#"
                  >
                    Outliers
                  </a>
                </li>
              </ul>
            </div>
          </a-col>
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
                        <!-- <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="false"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                          </a-table>
                          <br />
                          <br />
                        </TableWrapper> -->

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'approved'"
                        >
                          <a-table
                            :pagination="false"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <br />
                            <br />
                            <!-- <a-pagination
                              :current="paginationOptions.current"
                              :total="paginationOptions.total"
                              :pageSize="paginationOptions.pageSize"
                              :showSizeChanger="
                                paginationOptions.showSizeChanger
                              "
                              @change="paginationOptions.onChange"
                          /> -->
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'outliers'"
                        >
                        <a-row class="" :gutter="5">
                            <a-space>
                            <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                              <a-select v-if="filterAccessList.includes('country')" v-model:value="country" show-search placeholder="Select Country" style="width: 100%" :options="countries" :filter-option="filterOption" @change="handleChange($event, 'country')"></a-select>
                            </a-col>
                            <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                              <a-select v-if="filterAccessList.includes('county')" v-model:value="county" show-search placeholder="Select County" style="width: 100%" :options="counties" :filter-option="filterOption" @change="handleChange($event, 'county')"></a-select>
                            </a-col>
                            <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                              <a-select v-if="filterAccessList.includes('subcounty')" v-model:value="subcounty" show-search placeholder="Select Sub County" style="width: 100%" :options="subcounties" :filter-option="filterOption" @change="handleChange($event, 'subcounty')"></a-select>
                            </a-col>
                            <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                              <a-select v-if="filterAccessList.includes('ward')" v-model:value="ward" show-search placeholder="Select Ward" style="width: 100%" :options="wards" :filter-option="filterOption" @change="handleChange($event, 'ward')"></a-select>
                            </a-col>
                            <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                              <a-select v-if="filterAccessList.includes('location')" v-model:value="location" show-search placeholder="Select Location" style="width: 100%" :options="locations" :filter-option="filterOption" @change="handleChange($event, 'location')"></a-select>
                            </a-col>
                            <a-col :xxl="24" :xl="24" :md="24" :sm="24">
                              <a-select v-if="filterAccessList.includes('sublocation')" v-model:value="sublocation" show-search placeholder="Select Sub Location" style="width: 100%" :options="sublocations" :filter-option="filterOption" @change="handleChange($event, 'sublocation')"></a-select>
                            </a-col>
                            </a-space>
                          </a-row>
                          <a-divider></a-divider>
                          <a-table
                            :pagination="false"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template #households="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton
                                    type="check"
                                    size="16"
                                    @click="
                                      handleVerify(record.id, record.hh_size)
                                    "
                                  >
                                    &nbsp;&nbsp;
                                    <span class="badge badge-green"
                                      >&nbsp;&nbsp; Verify</span
                                    >
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                            <br />
                            <br />
                            <!-- <a-pagination
                              :current="paginationOptions.current"
                              :total="paginationOptions.total"
                              :pageSize="paginationOptions.pageSize"
                              :showSizeChanger="
                                paginationOptions.showSizeChanger
                              "
                              @change="paginationOptions.onChange"
                            /> -->
                          </a-table>
                        </TableWrapper>
                        <br />
                        <br />
                        <a-pagination
                          :current="paginationOptions.current"
                          :total="paginationOptions.total"
                          :pageSize="paginationOptions.pageSize"
                          :showSizeChanger="paginationOptions.showSizeChanger"
                          @change="paginationOptions.onChange"
                        />
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
import {
  computed,
  onMounted,
  ref,
 // reactive,
  watch,
} from "vue";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

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
// const notData=ref({})
// const current=ref(0)
// const pageSize=ref(0)
const visible=ref(false)
// const confirmLoading=ref(false)
// const modalType=ref("primary")
const colorVisible=ref(false)
// const households=ref([])
const { state } = useStore();
const isLoading = computed(() => state.crud.loading);
// const selectedRowKeys = ref([]);
const dataSource = ref([]);
const activeClass = ref("outliers");
const isModalOpen = ref(false);
const inputValue = ref("");
const household_id = ref("");
const searchItem = ref("");
const level_id = ref("");
const role_id = ref("");
const rt = useRouter();
const household_validations = ref([]);
const location_id = ref("");
const access_level = ref({})
// const crud = computed(() => state.crud.data);

const filterAccessList = ref([])
//org levels
const countries = ref([{ value: { id: 1, org_id: 'HfVjCurKxh2' }, label: "Kenya" }])
const counties = ref(null)
const subcounties = ref(null)
const wards = ref(null)
const locations = ref(null)
const sublocations = ref(null)
// const villages = ref(null)
const county = ref("Select County")
const sublocation = ref("Select Sublocation")
const subcounty = ref("Select Subcounty")
const location = ref("Select Location")
const ward = ref("Select Ward")
// const village = ref("Select a Post")
const org_ids = ref([])


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

// const notData=ref({})
// const current=ref(0)
// const pageSize=ref(0)
// const visible=ref(false)
// const confirmLoading=ref(false)
// const modalType=ref("primary")
// const colorVisible=ref(false)
// const households=ref([])
// const { state } = useStore();
// const isLoading = computed(() => state.crud.loading); 
const user = JSON.parse(sessionStorage.getItem("user"));

  //  const handleSearch=(searchText)=> {
  //     const data = searchData.value.filter((item) =>
  //       item.title.toUpperCase().startsWith(searchText.toUpperCase())
  //     );
  //     notData.value = data;
  //   }
    // const onShowSizeChange=(current, pageSize)=>{
    //   current.value = current;
    //   pageSize.value = pageSize;
    // }
    // const searchData=()=> {
    //   return store.state.headerSearch.data;
    // }
    const handleCancel=()=> {
    isModalOpen.value = false;
    visible.value = false;
    colorVisible.value = false;
    }

    if (!user) {
      rt.push({ path: "/auth/login" });
    } else {
      level_id.value = user.user.level_id;
      role_id.value = user.user.role_id;
      location_id.value = user.user.location_id;
      console.log(location_id.value);
    }

    onMounted(() => {
      access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
      location_id.value=access_level.value.location.id
      filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
      fetchData(); // Initial data fetch
      updateFilters(); 
    });

    const updateFilters = () => {
  // access_level.value.level.level_name = 'national'
  // access_level.value.location.id = 1
  // access_level.value.location.org_id = 'HfVjCurKxh2'
  // access_level.value.location.name = 'Kenya'

   if (access_level.value.level.id == 1) {
    filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation']
    countries.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
    fetchCounties()
  } else if (access_level.value.level.id == 2) {
    filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation']
    counties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 3) {
    filterAccessList.value = ['subcounty', 'ward', 'location', 'sublocation']
    subcounties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 4) {
    filterAccessList.value = ['ward', 'location', 'sublocation']
    wards.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 5) {
    filterAccessList.value = ['location', 'sublocation']
    locations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 6) {
    filterAccessList.value = ['sublocation']
    sublocations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  }
  fetchOutliers()
}
  const handleChange = async (org_id, org_level) => {
  //fetch child data
  console.log(org_id)
  console.log(org_ids.value)
  let org = org_ids.value.filter(x => x.org_id === org_id).map(e => e.id)
  console.log(org)
  let parent_id = org[0] || 9
  console.log(parent_id)
  console.log(org_level)
  fetchChildData(parent_id, org_id, org_level)
};

const fetchChildData = async (location_id, org_id, org_level) => {
  let fetchUrl = `get_sub_counties_list`
  let masterListUrl = `household_outliers?location_id=${location_id}&page=${paginationOptions.value.current}&pageSize=${paginationOptions.value.pageSize}`
  if (org_level == 'country') {//get counties
    fetchUrl += `?parent_id=${org_id}`
    //masterListUrl += `&location=${location_id}`
    //clear fields
    county.value = "Select County"
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'county') {//get subcounties
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&county=${location_id}`
    //clear fields
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'subcounty') {//get wards
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&sub_county=${location_id}`
    //clear fields
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'ward') {//get locatios
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&ward=${location_id}`
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
    masterListUrl += `&sublocation=${location_id}`
  }
  await axios.get(`${fetchUrl}`)
    .then(response => {
      let data = response.data.message;
      if (org_level == 'country') {//get counties
        counties.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = data.map(x => ({ org_id: x.org_id, id: x.id }))
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
      await axios.get(`${masterListUrl}`)
        .then(response => {
          console.log(response.data.data)
          let data = response.data.data.data;
          dataSource.value = data;
          console.log(dataSource.value)
          // paginationOptions.value.total = response.data.data.length;
          paginationOptions.value.total = response.data.data.total;
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
      console.log(counties.value)
    }).catch(error => {
      notification.error({
        message: `Error!`,
        description: `${error}`,
      });
    })
}

    const paginationOptions = ref({
      pageSize: 100,
      showSizeChanger: true,
      current: 1,
      total: 0,
      onChange: async (page, pageSize) => {
        // Update the current page when the pagination changes
        const query = searchItem.value.toLowerCase();
        paginationOptions.value.current = page;
        let url =''

        if(!query) {
          url = `household_outliers?location_id=${location_id.value}&page=${page}&pageSize=${pageSize}`;
        } else {
          url = `household_outliers?location_id=${location_id.value}&page=${page}&pageSize=${pageSize}&query=${query}`;
        }
        // Fetch data for the new page using the updated page number
        try {
          const response = await axios.get(url);
          dataSource.value = response.data.data.data;
          paginationOptions.value.total = response.data.data.total;
        } catch (error) {
          console.error(error);
        }
      },
    });

    const API_URL = `household_validation?sub_county_id=${location_id.value}`;


    // const households_url = `${process.env.VUE_APP_BASE_URL}/generateHHCSV`;

    // const exportHouseHoldData = async () => {
    //   try {
    //     const response = await fetch(households_url, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         ...authHeader(),
    //       },
    //     });

    //     if (!response.ok) {
    //       throw new Error("Failed to fetch export data");
    //     }

    //     const fileBlob = await response.blob();
    //     const fileName = "households.csv";
    //     const link = document.createElement("a");
    //     link.href = window.URL.createObjectURL(new Blob([fileBlob]));
    //     link.setAttribute("download", fileName);
    //     document.body.appendChild(link);
    //     link.click();
    //     link.parentNode.removeChild(link);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };   household_outliers

    const fetchOutliers = async () => {
      try {
        const response = await axios.get(`household_outliers?location_id=${location_id.value}&page=${paginationOptions.value.current}&pageSize=${paginationOptions.value.pageSize}&query=${searchItem.value}`);
        dataSource.value = response.data.data.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // const filteredData = computed(() => {
    //   if (activeClass.value === "approved") {
    //     console.log(dataSource.value);
    //     return dataSource.value.filter((item) => item.isVerified === 1);
    //   } else if (activeClass.value === "outliers") {
    //     // Call the asynchronous function to fetch data
    //     return outliers.value;
    //   } else {
    //     return dataSource.value;
    //   }
    // });

    // const filteredData = computed(() => {
    //   if (activeClass.value === "approved") {
    //     return dataSource.value.filter((item) => item.isVerified === 1);
    //   } else if (activeClass.value === "outliers") {
    //     return dataSource.value.filter((item) => item.isVerified === 0);
    //   } else {
    //     return dataSource.value;
    //   }
    // });

    // const handleChange = (tab) => {
    //   activeClass.value = tab;
    // };

    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        household_validations.value = response.data.data.data;
        dataSource.value = response.data.data.data;
        paginationOptions.value.total = response.data.data.total;
      } catch (error) {
        console.error(error);
      }
    };

    // Watch for changes in the activeClass and refetch data accordingly
    watch(searchItem.value, async (newValue) => {
      searchItem.value=newValue
      fetchOutliers()
    })

    const handleVerify = (hh_id, hh_size) => {
      console.log({ hh_id, hh_size });
      inputValue.value = hh_size;
      isModalOpen.value = true;
      household_id.value = hh_id;
    };

    const handleOk = async (id, inputValue) => {
      try {
        const house_id = household_id.value;
        // Construct the URL
        const url = `verify_household?house_id=${house_id}&inputValue=${inputValue}`;

        // Make the fetch request
        axios.patch(url)
          .then((response) => {
            if (response.data.success==true) {
              return response.data; // Parse the JSON response
            }
            throw new Error("Network response was not ok.");
          })
          .then((data) => {
            console.log(data); // Handle the successful response data here
            notification["success"]({
              message: "HouseHold Verified",
              description: `HouseHold has been verified successfully`,
              duration: 5.5,
            })
            setTimeout(()=>{
              window.location.reload()
            },5000)
          })
          .catch((error) => {
            // Handle errors here
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
            notification["error"]({
              message: "HouseHold Not Verified",
              description: `HouseHold verification failed`,
              duration: 5.5,
            });
          })
          .finally(() => {
            inputValue = ""; // Clear inputValue after the modal is closed
            isModalOpen.value = false;
          });
      } catch (error) {
        // Handle exceptions here
        console.error("Error:", error);
      }
    };

    // const formState = reactive({
    //   searchItem: "",
    // });

    // const results = computed(() => {
    //   const start =
    //     (paginationOptions.value.current - 1) *
    //     paginationOptions.value.pageSize;
    //   const end = start + paginationOptions.value.pageSize;
    //   return filteredData.value.slice(start, end);
    // });

    // const searchResults = computed(() => {
    //   const query = searchItem.value.toLowerCase();
    //   const regex = new RegExp(query, "i");
    //   if (!query) {
    //     return dataSource.value;
    //   } else {
    //     return dataSource.value.filter((user) => {
    //       return (
    //         regex.test(user.first_name) ||
    //         regex.test(user.middle_name) ||
    //         regex.test(user.last_name) ||
    //         regex.test(user.id_no) ||
    //         regex.test(user.phone_no) ||
    //         regex.test(user.post_id)
    //       );
    //     });
    //   }
    // });

    // watchEffect(async()=>{
    //   const query = searchItem.value.toLowerCase();
      
    //   try {
    //     if(!query){ 
    //       dataSource.value = household_validations.value;
    //       return dataSource.value;
    //     }
    //     if(query.length > 3){
    //       const response = await axios.get(`household_validation?sub_county_id=${location_id.value}&query=${query}`);
    //     const data = await response.data;
    //     dataSource.value = data.data.data;
    //     paginationOptions.value.total = data.data.total;
    //     }
        
    //   } catch (error) {
    //     notification.error({
    //       message: "Error",
    //       description: error.message,
    //     });
        
    //   }
    // })
</script>
<style>
.badge-green {
  background-color: #1ec997;
  /* color: white; */
  /* padding: 2px;
  border-radius: 3px; */
  /* size */
  font-size: 12px;
}
</style>
