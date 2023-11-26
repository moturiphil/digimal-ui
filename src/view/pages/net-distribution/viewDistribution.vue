<template>
  <div>
    <sdPageHeader ghost title="Nets Distributions" />

    <Main>
      <!-- <sdButton class="btn-import" type="success" @click="exportHouseHoldData">
          Export HouseHolds Data
        </sdButton> -->
      <sdButton
        class="button-container"
        size="extra-small"
        type="success"
        @click="openModal()"
      >
        Start Distribution
      </sdButton>
      <br />
      <br />
      <br />
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24"> </a-col>
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
                        >
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
                            </a-space>
                          </a-row>
                          <a-divider></a-divider>
                          <a-table
                            :pagination="false"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                          </a-table>
                          <br />
                          <br />
                          <a-pagination
                            :current="current"
                            :total="total"
                            :pageSize="pageSize"
                            :showSizeChanger="true"
                            :pagination="true"
                            @change="onPageChange($event)"
                          />
                        </TableWrapper>
                      </div>
                      <!-- Distribution modal -->
                      <a-modal
                        title="Start Distribution"
                        :visible="isModalOpen"
                        @cancel="handleCancel"
                        width="50%"
                        footer=""
                      >
                        <BasicFormWrapper>
                          <a-form
                            class="add-transfer-form"
                            :style="{ width: '100%' }"
                            layout="vertical"
                            name="addnew"
                            :model="formState"
                            @finish="handleStartDistribution"
                          >
                            <a-form-item
                              name="start_date"
                              label="Start Date"
                            >
                              <a-date-picker
                                :style="{ width: '100%' }"
                                v-model:value="formState.start_date"
                                :format="dateFormat"
                              />
                            </a-form-item>

                            <a-form-item
                              name="end_date"
                              label="end_date"
                            >
                              <a-date-picker
                                :style="{ width: '100%' }"
                                v-model:value="formState.end_date"
                                :format="dateFormat"
                              />
                            </a-form-item>
                            <div class="record-form-actions text-right">
                              <sdButton
                                size="default"
                                htmlType="Save"
                                type="success"
                              >
                                {{ isLoading ? "Loading..." : "Submit" }}
                              </sdButton>
                            </div>
                          </a-form>
                        </BasicFormWrapper>
                      </a-modal>
                      <!-- End of modal -->
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
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import { computed, onMounted, ref, reactive, defineProps } from "vue";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import dayjs from "dayjs";

const columns = ref([
  {
    title: "Household Name",
    dataIndex: "house_hold_name",
    key: "id",
  },
  {
    title: "Distribution Post",
    dataIndex: "post",
    key: "id",
  },
  {
    title: "No of Nets",
    dataIndex: "no_of_nets",
    key: "id",
  },
  {
    title: "Issued By",
    dataIndex: "chw",
    key: "id",
  },
  {
    title: "Issued Date",
    dataIndex: "issue_date",
    key: "id",
  },
]);

var current = ref(1);
var pageSize = ref(50);
var total=ref(0)
var visible=ref(false)
var colorVisible=ref(false)
const { state } = useStore();
var isLoading = computed(() => state.crud.loading);
const dataSource = ref([]);
const activeClass = ref("all");
const isModalOpen = ref(false);
const total_households = ref(0);
const API_URL = `distribution_details/all?page=${current.value}&pageSize=${pageSize.value}`;

//const households_url = `generateHHCSV`;
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
// const villages = ref(null)
const country = ref("Select Country")
const county = ref("Select County")
const sublocation = ref("Select Sublocation")
const subcounty = ref("Select Subcounty")
const location = ref("Select Location")
const ward = ref("Select Ward")
// const village = ref("Select a Post")
const org_ids = ref([])
// const selectedCounties = ref([
//   "Homa Bay County",
//   "Kisii County",
//   "Nyamira County",
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
//])
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
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    //filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    updateFilters()
    console.log(JSON.stringify(access_level.value.location));
  }
});

const updateFilters = () => {
  // access_level.value.level.level_name = 'national'
  // access_level.value.location.id = 1
  // access_level.value.location.org_id = 'HfVjCurKxh2'
  // access_level.value.location.name = 'Kenya'

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
  } else if (access_level.value.level.id ==4) {
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
  fetchDistributions()
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
  let masterListUrl = API_URL
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
        org_ids.value = data.map(x => ({ org_id: x.org_id, id: x.id }))
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
        org_ids.value = [...org_ids.value, ...data.map(x => ({ org_id: x.org_id, id: x.id }))];
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
          dataSource.value=data;
          // paginationOptions.value.total = response.data.data.length;
          total.value = response.data.data.total;
          total_households.value= response.data.data.total;
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
const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};


const fetchDistributions = () => {
  axios
    .get(API_URL)
    .then((response) => {
      console.log(response.data.data.data);
      dataSource.value = response.data.data.data;
      // paginationOptions.value.total = response.data.data.length;
      total.value = parseInt(response.data.data.total);
      total_households.value  = response.data.data.total;
    })
    .catch((error) => {
      console.error(error);
    });
}
const handleCancel=()=>{
  isModalOpen.value = false;
  visible.value = false;
  colorVisible.value = false;
}

const onPageChange = async (page) => {
       current.value=page
        try {
          const response = await axios.get(`distribution_details/all?page=${page}&pageSize=${pageSize.value}`);
          dataSource.value = response.data.data.data;
          total.value = response.data.data.total;
        } catch (error) {
          console.error(error);
        }
      }

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
    // };

    const openModal = () => {
      isModalOpen.value = true;
    };

    const handleStartDistribution = async () => {
      const data = {
        start_date: dayjs(formState.start_date).format("YYYY-MM-DD"),
        end_date: dayjs(formState.end_date).format("YYYY-MM-DD"),
      };

      console.log(JSON.stringify(data));

      try {
        axios.post(`subcounty/start/distribution`,JSON.stringify(data))
          .then((response) => response.data)
          .then(({ success, data }) => {
            if (success) {
              notification.success({
                message: "Success",
                description: `Distribution Started successfully`,
              });
            } else {
              notification.error({
                message: "Error",
                description: `${data}`,
              });
            }
            isModalOpen.value = false;
            //  window.location.reload();
          })
          .catch((error) => {
            notification.error({
              message: "Error",
              description: `${error}`,
            });
            isModalOpen.value = false;
          });
      } catch (error) {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      }
    };

const formState = reactive({
  searchItem: "",
});
defineProps({
  recordId: Number,
  hh_size: Number,
});
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
