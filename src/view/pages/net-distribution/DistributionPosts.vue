<template>
  <RecordViewWrapper>
    <sdPageHeader title="Distribution Posts">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success"> </sdButton>
      </template>
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name/code/supervisor"
          />
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <a-row class="" :gutter="5">
                  <a-space>
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
                        v-if="filterAccessList.includes('sublocation')"
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
                <a-divider></a-divider>
                <a-table :pagination="false" :dataSource="dataSource" :columns="columns">
                  <template #activities="{ record }">
                    <td>
                      <div class="table-actions">
                        &nbsp;&nbsp;
                        <sdButton type="success" size="extra-small">
                          <router-link
                            :to="{
                              // path: `/nets/receive-post-nets`,
                              path: `/nets/receive-nets-summary`,
                              query: { id: record.id, name: record.name },
                            }"
                            class="btn-icon"
                            type="success"
                            shape="circle"
                          >
                            <!-- <sdFeatherIcons type="mail" size="16" /> -->
                            &nbsp;&nbsp; Manage Inventory
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton type="success" size="extra-small">
                          <router-link
                            :to="{
                              path: `/view-worker`,
                              query: { id: record.id },
                            }"
                            class="btn-icon"
                            type="success"
                            shape="circle"
                          >
                            View Post Workers
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          type="success"
                          size="extra-small"
                          @click="openModal(record.id)"
                        >
                          Assign Supervisor
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton type="success" size="extra-small">
                          <router-link
                            :to="{
                              path: `/nets/verify-post-nets`,
                              query: { id: record.id, name: record.name },
                            }"
                            class="btn-icon"
                            type="success"
                            shape="circle"
                          >
                            Bale Verification
                          </router-link>
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
                <a-pagination
                  :current="current"
                  :total="datatotal"
                  :pageSize="pageSize"
                  :showSizeChanger="true"
                  :pagination="true"
                  @change="onPageChange($event)"
                />
              </TableWrapper>
            </div>
            <!-- Assign supervisor -->
            <a-modal
              title="Assign Supervisor"
              :visible="isModalOpen"
              @cancel="handleCancel"
              width="50%"
              footer=""
            >
              <BasicFormWrapper>
                <a-form
                  class="add-record-form"
                  :style="{ width: '100%' }"
                  layout="vertical"
                  name="addnew"
                  :model="formState"
                  @finish="handleSubmit"
                >
                  <a-form-item name="Supervisors" label="Select Supervisor">
                    <a-select
                      v-model:value="formState.user_id"
                      show-search
                      option-filter-prop="label"
                      placeholder="Select one"
                      @search="handleSupervisorSearch"
                    >
                      <a-select-option
                        v-for="user in supervisors"
                        :key="user.id"
                        :value="user.id"
                        :label="`${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`"
                      >
                        {{ user.first_name }} {{ user.last_name }} {{ user.other_name }} -
                        {{ user.id_no }},{{ user.role_id }}, {{ user.location_id }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <div class="record-form-actions text-right">
                    <sdButton size="default" htmlType="Save" type="success">
                      {{ isLoading ? "Loading..." : "Submit" }}
                    </sdButton>
                  </div>
                </a-form>
              </BasicFormWrapper>
            </a-modal>
            <!-- End of assign supervisor -->
          </sdCards>
        </a-col>
      </a-row>
      <a-col :xs="24">
        <DragAndDropTable />
      </a-col>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, watch } from "vue";
import { notification } from "ant-design-vue";
import axios from "@/Axiosconfig";

const columns = [
  // {
  //   title: "Distribution Id",
  //   dataIndex: "id",
  //   key: "id",
  // },
  {
    title: "Distribution Post",
    dataIndex: "name",
    key: "",
  },
  {
    title: "Sub County",
    dataIndex: "distribution_sub_county",
    key: "",
  },
  {
    title: "Location",
    dataIndex: "distribution_location_id",
    key: "",
  },
  {
    title: "Distribution Post Code", // distribution_sublocation_id
    dataIndex: "post_code",
    key: "post_code",
  },
  {
    title: "Supervisor Name",
    dataIndex: "post_supervisor_user_id",
    key: "post_supervisor_user_id",
  },
  {
    title: "",
    dataIndex: "",
    // fixed: 'right',
    // width: 20,
    key: "activities",
    slots: { customRender: "activities" },
  },
];

// const isStarting = ref(false)
var currentPage = ref(1);
var pageSize = ref(100);
var datatotal = ref(0);
const distributionStatus = ref({});
// const posts = ref([])
const { state } = useStore();
// const crud = computed(() => state.crud.data);
const isLoading = computed(() => state.crud.loading);
// const selectedRowKeys = ref([]);
const dataSource = ref([]);
const supervisors = ref([]);
const searchItem = ref("");
const searchsupervisorItem = ref("");
const isModalOpen = ref(false);

//org levels
const access_level = ref({});
const filterAccessList = ref([]);
const countries = ref([{ value: "HfVjCurKxh2", label: "Kenya" }]);
const counties = ref(null);
const subcounties = ref(null);
const wards = ref(null);
const locations = ref(null);
const sublocations = ref(null);
const country = ref("Select Country");
const county = ref("Select County");
const sublocation = ref("Select Sublocation");
const subcounty = ref("Select Subcounty");
const location = ref("Select Location");
const ward = ref("Select Ward");
const org_ids = ref([]);

const currentCounties = ref([
  "nK0A12Q7MvS", //homa bay
  "sPkRcDvhGWA", //kisii
  "uepLTG8wGWJ", //nyamira
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
]);
//   const api_url = UserService;
//   console.log(api_url);
onMounted(async () => {
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    //filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    updateFilters();
    // console.log(JSON.stringify(access_level.value.location));
  }
});
const onPageChange = async (page) => {
  currentPage.value = page;
  fetchDistributionsPosts();
};
watch(
  () => searchItem.value,
  (newValue) => {
    currentPage.value = 1;
    searchItem.value = newValue;
    fetchDistributionsPosts();
  }
);
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
      "village",
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
      "village",
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
    filterAccessList.value = ["subcounty", "ward", "location", "sublocation", "village"];
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
    filterAccessList.value = ["ward", "location", "sublocation", "village"];
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
    filterAccessList.value = ["location", "sublocation", "village"];
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
    filterAccessList.value = ["sublocation", "village"];
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
  fetchDistributionsPosts();
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
  currentPage.value = 1;
  let fetchUrl = `get_sub_counties_list`;
  let masterListUrl = `posts_data?per_page=${pageSize.value}&page=${currentPage.value}`;
  if (org_level == "country") {
    //get counties
    fetchUrl += `?parent_id=${org_id}`;
    //masterListUrl += `&location=${location_id}`
    //clear fields
    county.value = "Select County";
    subcounty.value = "Select SubCounty";
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "county") {
    //get subcounties
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&county=${location_id}`;
    //clear fields
    subcounty.value = "Select SubCounty";
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "subcounty") {
    //get wards
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&sub_county=${location_id}`;
    //clear fields
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "ward") {
    //get locatios
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&ward=${location_id}`;
    //clear fields
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "location") {
    //get sub locatios
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location=${location_id}`;
    //clear fields
    sublocation.value = "Select Sub Location";
  } else if (org_level == "sublocation") {
    //get sublocations stats
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&sublocation=${location_id}`;
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
                !org_ids.value.some((existingItem) => existingItem.id === newItem.id)
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
                !org_ids.value.some((existingItem) => existingItem.id === newItem.id)
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
                !org_ids.value.some((existingItem) => existingItem.id === newItem.id)
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
                !org_ids.value.some((existingItem) => existingItem.id === newItem.id)
            ),
        ];
      }
    })
    .then(async () => {
      await axios.get(`${masterListUrl}`).then((response) => {
        // console.log(response.data.data)
        let data = response.data.data;
        dataSource.value = data;
        // paginationOptions.value.total = response.data.data.length;
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
      // console.log(counties.value)
    })
    .catch((error) => {
      notification.error({
        message: `Error!`,
        description: `${error}`,
      });
    });
};
const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const supervisorList = async () => {
  try {
    const response = await axios.get(`users?query=${searchsupervisorItem.value}`);
    const data = await response.data;

    // Modify the structure of each supervisor to include a 'label' property
    supervisors.value = data.data.map((user) => ({
      ...user,
      label: `${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`,
    }));
  } catch (error) {
    console.error(error);
  }
};
supervisorList();

const handleSupervisorSearch = (value) => {
  console.log(value);
  searchsupervisorItem.value = value;
  supervisorList();
};

const fetchDistributionsPosts = async () => {
  try {
    const response = await axios.get(
      `posts_data?per_page=${pageSize.value}&page=${currentPage.value}&query=${searchItem.value}`
    );
    const data = await response.data;
    dataSource.value = data.data;
    datatotal.value = data.pagination.total;
    // console.log(dataSource.value);
    distributionStatus.value = {};
    console.log(distributionStatus.value);
    for (const post of dataSource.value) {
      distributionStatus.value[post.id] = post.status;
      console.log(post.status);
    }
  } catch (error) {
    console.error(error);
  }
};

const formState = reactive({
  post_id: "",
  user_id: "",
});

const openModal = (id) => {
  isModalOpen.value = true;
  formState.post_id = id;
  console.log(isModalOpen.value);
};

const handleCancel = () => {
  isModalOpen.value = false;
};

// const handleDelete = (id) => {
//   const confirm = window.confirm("Are you sure delete this?");
//   if (confirm) {
//     dispatch("axiosDataDelete", {
//       id,
//       getData: () => {
//         dispatch("axiosCrudGetData");
//       },
//     });
//   }
//   return false;
// };

// const notifyHH = async (id) => {
//   console.log(id);
//   try {
//     const response = await axios.post(`notify_households?post_id=${id}`,{});
//     const data = await response.data;
//     console.log(data);
//     if (data.success == true) {
//       notification.success({
//         message: "Success",
//         description: data.message,
//       });
//       window.location.reload();
//     } else {
//       notification.error({
//         message: "Error",
//         description: data.message,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

const handleSubmit = async () => {
  try {
    const data = {
      post_id: formState.post_id,
      user_id: formState.user_id,
    };
    console.log(data);
    await axios
      .post(`assign_post_supervisor`, data)
      .then((response) => response.data)
      .then(({ status, data }) => {
        if (status == true) {
          notification.success({
            message: "Success",
            description: data,
          });
          isModalOpen.value = false;
          setTimeout(function () {
            window.location.reload();
          }, 3000);
        } else {
          notification.error({
            message: "Error",
            description: `${status}`,
          });
        }
        isModalOpen.value = false;
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

// const onSelectChange = (selectedRowKey) => {
//   selectedRowKeys.value = selectedRowKey;
// };

// const rowSelection = {
//   selectedRowKeys,
//   onChange: onSelectChange,
// };

// const startDistribution = async (id) => {
//   try {
//     isStarting.value = true;
//     console.log(id);
//     const response = await axios.get(`start_distribution/${id}`);
//     const data = await response.data;
//     console.log(data);
//     if (data.status === true) {
//       // this.eventStatus[id] = true;
//       // localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
//       notification.success({
//         message: "Distribution Started",
//         description: data.message,
//       });
//       await new Promise((resolve) => {
//         setTimeout(resolve, 2000); // Wait for 2 seconds (adjust the time as needed)
//       });
//       window.location.reload();
//     } else {
//       // this.eventStatus[id] = false;
//       // localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
//       notification.error({
//         message: "Distribution Not Started",
//         description: data.message,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//   } finally {
//     isStarting.value = false;
//   }
// }

// const closeDistribution = async (id) => {
//   try {
//     isStarting.value = true;
//     const response = await axios.get(`close_distribution/${id}`);
//     const data = await response.data;
//     console.log("******************************************");
//     console.log("******************************************");
//     console.log(data);
//     if (data.status === true) {
//       // this.eventStatus[id] = true;
//       // localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
//       // notify the user
//       notification.success({
//         message: "Distribution Closed",
//         description: "Event has been closed successfully",
//       });
//       await new Promise((resolve) => {
//         setTimeout(resolve, 2000); // Wait for 2 seconds (adjust the time as needed)
//       });
//       window.location.reload();
//     } else {
//       this.eventStatus[id] = false;
//       localStorage.setItem("eventStatus", JSON.stringify(this.eventStatus));
//       notification.error({
//         message: "Event Not Closed",
//         description: "Only event host or facilitator can close event",
//       });
//       // await new Promise((resolve) => {
//       // setTimeout(resolve, 2000); // Wait for 2 seconds (adjust the time as needed)
//       // });
//     }
//     // location.reload();
//   } catch (error) {
//     console.error(error);
//   } finally {
//     this.isStarting = true;
//   }
// }
</script>
