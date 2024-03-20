<template>
  <RecordViewWrapper>
    <sdPageHeader title="Drop Off Points">
      <template #subTitle></template>
        <template #buttons>
          <div class="search-box">
            <span class="search-icon">
              <!-- Increase the size of the search icon by setting the 'font-size' property -->
              <sdFeatherIcons type="search" size="24" />
            </span>
            <a-input
              v-model:value="searchItem"
              type="text"
              name="dataSource"
              placeholder="Search by name"
              style="font-size: 15px; width: 100%; max-width: 300px; height: 2.5rem"
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
                  </a-space>
                </a-row>
                <a-divider></a-divider>
                <a-table
                :pagination="false" :dataSource="dataSource" :columns="columns"
                >
                  <template #point="{ record }">
                    <td>
                      <div class="table-actions">
                        &nbsp;&nbsp;
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/manage-dropoff-inventory`,
                              query: {
                                id: record.id,
                                name: record.name,
                                campaign_id: record.campaign_id,
                                county: record.county,
                              },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            Manage Inventory
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          class="button-container"
                          size="extra-small"
                          type="success"
                          @click="openModal(record.id)"
                        >
                          Assign Drop-off Manager
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
              </TableWrapper>
            </div>
            <a-modal
              title="Issue Nets"
              :visible="isModalOpen"
              @cancel="handleCancelReceive"
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
                  @finish="handleAssign"
                >
                  <a-form-item
                    name="drop_off_manager"
                    label="Assign Drop Off Manager"
                  >
                    <a-select
                      placeholder="Assign Drop Off Manager"
                      v-model:value="formState.drop_off_manager"
                      v-if="!loading"
                      show-search
                      option-filter-prop="label"
                    >
                      <a-select-option
                        v-for="worker in users"
                        :key="worker.id"
                        v-model:value="worker.id"
                        :label="`${worker.first_name} ${worker.last_name} -${worker.role_id} `"
                      >
                        {{ worker.first_name }}
                        {{ worker.last_name }} - {{ worker.id_no }},
                        {{ worker.role_id }}, {{ worker.location_id }}
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
            <!-- End of Issue modal -->
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
import { computed, onMounted, ref, reactive,watch } from "vue";
import axios from "@/Axiosconfig";  
import { notification } from "ant-design-vue";
// import dayjs from "dayjs";
//const dateFormat = "YYYY-MM-DD";
const columns = [
  {
    title: "Drop off Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "County",
    dataIndex: "county_id",
    key: "id",
  },
  {
    title: "Sub County",
    dataIndex: "sub_county_id",
    key: "id",
  },
  {
    title: "Drop off Manager",
    dataIndex: "drop_off_manager",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "point",
    slots: { customRender: "point" },
  },
];
const { state,
    //dispatch
    } = useStore();
//const crud = computed(() => state.crud.data);
const isLoading = computed(() => state.crud.loading);
//const selectedRowKeys = ref([]);
const dataSource = ref([]);
const isModalOpen = ref(false);
const users = ref("");
const searchItem = ref("");
var currentPage = ref(1);
var pageSize = ref(100);
var datatotal = ref(0);
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
  "nK0A12Q7MvS", //homa bay
  "sPkRcDvhGWA", //kisii
  "uepLTG8wGWJ", //nyamira
  "tAbBVBbueqD", //kisumu
  "u4t9H8XyU9P", //siaya
  "fVra3Pwta0Q", //migori
  'Tvf1zgVZ0K4',//busia
  'NjWSbQTwys4',//lamu
  'nrI2khZx3d0',//kilifi
  'JsH2bnvNt2d',//tana river
  'N7YETT3A9r1',//kwale
  'QyGNX2DpR4h',//taita taveta
  "wsBsC6gjHvn", // mombasa
  'KGHhQ5GLd4k',//
  'BjC1xL40gHo',//kakamega
  'sANMZ3lpqGs',//vihiga
  'XWALbfAPa6n',//west pokot
  'kphDeKClFch',//turkana
  'mThvosEflAU',//trans nzoia
  'kqJ83J2D72s',//naraok
  'Eey8fT4Im3y',//marsabit
  'vvOK1BxTbet',//baringo
  'Ulj33KBau7V',
]);

const formState = reactive({
  post_id: "",
  drop_off_point_id: "",
  bale_size: "",
  number_of_bales: "",
  no_of_pieces: "",
  issue_date: "",
  delivery_note_number: "",
  drop_off_manager: "",
});
onMounted(async () => {
  ///alert()
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    //filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    updateFilters();
    // console.log(JSON.stringify(access_level.value.location));
  }
  
});
//handle pagination
const onPageChange = async (page) => {
  currentPage.value = page;
  try {
    const response = await axios.get(`get_all_drop_off_points?page=${page}&per_page=${pageSize.value}`);
    dataSource.value = response.data.data;
    datatotal.value = response.data.pagination.total;
  } catch (error) {
    console.error(error);
  }
};
// search dropoff points
watch(
  () => searchItem.value,
  (newValue) => {
    searchItem.value = newValue;
    getallDropOffPoints();
  }
);
const getallDropOffPoints = async()=>{
  try {
    const response = await axios.get(`get_all_drop_off_points?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}`);
    const data = await response.data;
    dataSource.value = data.data;
    console.log(dataSource.value);
  } catch (error) {
    console.error(error);
  }
};

const updateFilters = () => {
  // access_level.value.level.level_name = 'national'
  // access_level.value.location.id = 1
  // access_level.value.location.org_id = 'HfVjCurKxh2'
  // access_level.value.location.name = 'Kenya'

  if (access_level.value.level.id == 1) {
    filterAccessList.value = [
      "county",
      "subcounty"
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
      "subcounty"
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
    filterAccessList.value = [
      "subcounty",
    ];
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
  getallDropOffPoints();
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
  let fetchUrl = `get_sub_counties_list`;
  let masterListUrl = `get_all_drop_off_points?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}`;
  if (org_level == "county") {
    //get subcounties
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&county_id=${location_id}`;
    //clear fields
    subcounty.value = "Select SubCounty";
  } else if (org_level == "subcounty") {
    //get wards
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&subcounty_id=${location_id}`;
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
      await axios.get(`${masterListUrl}`).then((response) => {
        // console.log(response.data.data)
        let data = response.data.data;
        dataSource.value = data;
        // paginationOptions.value.total = response.data.data.length;
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

const openModal = (id) => {
  isModalOpen.value = true;
  formState.drop_off_point_id = id;
};

//users
const getManagers = async () => {
  const response = await axios.get(`get_drop_off_manager`);
  const data = await response.data;
  users.value = data.data;
  console.log(users.value);
};

getManagers();

const handleAssign = async () => {
  try {
    const data = {
      user_id: formState.drop_off_manager,
      drop_off_point_id: formState.drop_off_point_id,
    };

    console.log(JSON.stringify(data));
    await axios.post(`assign_dropoff_manager`,data)
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
  const handleCancelReceive = () => {
    isModalOpen.value = false;
  };
  // const onSelectChange = (selectedRowKey) => {
  //   selectedRowKeys.value = selectedRowKey;
  // };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };
  console.log(users);
</script>
<style>
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
