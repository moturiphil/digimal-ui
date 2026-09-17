<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard dp-posts-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> Distribution Posts
            </h3>
            <p class="ph-subtitle">
              Manage post inventory, supervisors &amp; net distribution
            </p>
          </div>
        </header>

        <!-- Filter panel -->
        <section class="panel filter-panel">
          <div class="filter-grid">
            <a-select
              v-if="filterAccessList.includes('country')"
              v-model:value="country"
              show-search
              placeholder="Select Country"
              :options="countries"
              :filter-option="filterOption"
              @change="handleChange($event, 'country')"
            ></a-select>
            <a-select
              v-if="filterAccessList.includes('county')"
              v-model:value="county"
              show-search
              placeholder="Select County"
              :options="counties"
              :filter-option="filterOption"
              @change="handleChange($event, 'county')"
            ></a-select>
            <a-select
              v-if="filterAccessList.includes('subcounty')"
              v-model:value="subcounty"
              show-search
              placeholder="Select Sub County"
              :options="subcounties"
              :filter-option="filterOption"
              @change="handleChange($event, 'subcounty')"
            ></a-select>
            <a-select
              v-if="filterAccessList.includes('ward')"
              v-model:value="ward"
              show-search
              placeholder="Select Ward"
              :options="wards"
              :filter-option="filterOption"
              @change="handleChange($event, 'ward')"
            ></a-select>
            <a-select
              v-if="filterAccessList.includes('location')"
              v-model:value="location"
              show-search
              placeholder="Select Location"
              :options="locations"
              :filter-option="filterOption"
              @change="handleChange($event, 'location')"
            ></a-select>
            <a-select
              v-if="filterAccessList.includes('sublocation')"
              v-model:value="sublocation"
              show-search
              placeholder="Select Sub Location"
              :options="sublocations"
              :filter-option="filterOption"
              @change="handleChange($event, 'sublocation')"
            ></a-select>
          </div>

          <div class="dp-search">
            <span class="search-icon">
              <sdFeatherIcons type="search" size="14" />
            </span>
            <a-input
              v-model:value="searchItem"
              type="text"
              name="dataSource"
              placeholder="Search distribution post"
              allow-clear
            />
          </div>
        </section>

        <!-- Posts list -->
        <section class="panel posts-panel">
          <div v-if="isLoading" class="dp-loading">
            <a-spin />
          </div>

          <div v-else>
            <!-- Desktop / tablet table -->
            <TableWrapper class="table-data-view table-responsive dp-table-shell">
              <a-table
                :pagination="false"
                :dataSource="dataSource"
                :columns="columns"
                row-key="id"
                size="middle"
              >
                <template #activities="{ record }">
                  <td>
                    <div class="dp-row-actions">
                      <sdButton type="success" size="extra-small">
                        <router-link
                          :to="{
                            path: `/nets/receive-nets-summary`,
                            query: {
                              id: record.id,
                              name: record.name,
                              funding: record.is_pmi_county,
                            },
                          }"
                          class="btn-icon"
                        >
                          <sdFeatherIcons type="package" size="14" />
                          &nbsp;Manage Inventory
                        </router-link>
                      </sdButton>
                      <sdButton
                        type="light"
                        size="extra-small"
                        outlined
                        @click="openModal(record.id)"
                      >
                        <sdFeatherIcons type="user-check" size="14" />
                        &nbsp;Assign Supervisor
                      </sdButton>
                    </div>
                  </td>
                </template>
              </a-table>
            </TableWrapper>

            <!-- Mobile card list -->
            <div class="dp-card-list">
              <article
                v-for="record in dataSource"
                :key="record.id"
                class="dp-card"
              >
                <div class="dp-card-head">
                  <div class="dp-card-title">{{ record.name }}</div>
                  <span class="dp-card-code">{{ record.post_code }}</span>
                </div>
                <div class="dp-card-meta">
                  <div>
                    <span class="lbl">Sub County</span>
                    <span class="val">{{ record.distribution_sub_county || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Location</span>
                    <span class="val">{{ record.distribution_location_id || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Supervisor</span>
                    <span class="val">{{ record.post_supervisor_user_id || "Unassigned" }}</span>
                  </div>
                </div>
                <div class="dp-card-actions">
                  <sdButton type="success" size="extra-small">
                    <router-link
                      :to="{
                        path: `/nets/receive-nets-summary`,
                        query: {
                          id: record.id,
                          name: record.name,
                          funding: record.is_pmi_county,
                        },
                      }"
                      class="btn-icon"
                    >
                      <sdFeatherIcons type="package" size="14" />
                      &nbsp;Manage Inventory
                    </router-link>
                  </sdButton>
                  <sdButton
                    type="light"
                    size="extra-small"
                    outlined
                    @click="openModal(record.id)"
                  >
                    <sdFeatherIcons type="user-check" size="14" />
                    &nbsp;Assign Supervisor
                  </sdButton>
                </div>
              </article>
              <div v-if="!dataSource.length" class="dp-empty">
                No distribution posts found.
              </div>
            </div>

            <div class="dp-pagination">
              <a-pagination
                :current="currentPage"
                :total="datatotal"
                :pageSize="pageSize"
                :showSizeChanger="true"
                @change="onPageChange($event)"
              />
            </div>
          </div>
        </section>

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
                        {{ user.first_name }} {{ user.last_name }}
                        {{ user.other_name }} - {{ user.id_no }},{{
                          user.role_id
                        }}, {{ user.location_id }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                  <div class="record-form-actions text-right">
                    <sdButton size="small" htmlType="Save" type="success">
                      {{ isLoading ? "Loading..." : "Submit" }}
                    </sdButton>
                  </div>
                </a-form>
              </BasicFormWrapper>
            </a-modal>
        <!-- End of assign supervisor -->
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";
import { Main } from "../../styled";
import { onMounted, ref, reactive, watch } from "vue";
import { notification } from "ant-design-vue";
import axios from "@/Axiosconfig";

const columns = [
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
    key: "activities",
    slots: { customRender: "activities" },
  },
];

var currentPage = ref(1);
var pageSize = ref(100);
var datatotal = ref(0);
const distributionStatus = ref({});
const isLoading = ref(true);
const dataSource = ref([]);
const supervisors = ref([]);
const searchItem = ref("");
const searchsupervisorItem = ref("");
const isModalOpen = ref(false);
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
//   const api_url = UserService;
//   console.log(api_url);
onMounted(async () => {
  isLoading.value = true;
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    updateFilters();
  }
});
const onPageChange = async (page) => {
  console.log(page);
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
    filterAccessList.value = [
      "subcounty",
      "ward",
      "location",
      "sublocation",
      "village",
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
  let org = org_ids.value.filter((x) => x.org_id === org_id).map((e) => e.id);
  let parent_id = org[0] || 9;
  fetchChildData(parent_id, org_id, org_level);
};
const fetchChildData = async (loctn_id, org_id, org_level) => {
  currentPage.value = 1;
  location_id.value = loctn_id;
  let fetchUrl = `get_sub_counties_list`;
  let masterListUrl = `posts_data?per_page=${pageSize.value}&page=${currentPage.value}`;
  if (org_level == "county") {
    //get subcounties
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&county=${location_id.value}`;
    //clear fields
    subcounty.value = "Select SubCounty";
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "subcounty") {
    //get wards
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&sub_county=${location_id.value}`;
    //clear fields
    ward.value = " Select Ward";
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "ward") {
    //get locatios
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&ward=${location_id.value}`;
    //clear fields
    location.value = "Select Location";
    sublocation.value = "Select Sub Location";
  } else if (org_level == "location") {
    //get sub locatios
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&location=${location_id.value}`;
    //clear fields
    sublocation.value = "Select Sub Location";
  } else if (org_level == "sublocation") {
    //get sublocations stats
    fetchUrl += `?parent_id=${org_id}`;
    masterListUrl += `&sublocation=${location_id.value}`;
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
    const response = await axios.get(
      `users?query=${searchsupervisorItem.value}`
    );
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
  isLoading.value = true;
  try {
    const response = await axios.get(
      `posts_data?per_page=${pageSize.value}&page=${currentPage.value}&query=${searchItem.value}&location_id=${location_id.value}`
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
  } finally {
    isLoading.value = false;
  }
};

const formState = reactive({
  post_id: "",
  user_id: "",
});

const openModal = (id) => {
  isModalOpen.value = true;
  formState.post_id = id;
};

const handleCancel = () => {
  isModalOpen.value = false;
};

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
</script>

<style lang="less" scoped>
.dp-posts-page {
  /* heading search box */
  .dp-search {
    position: relative;
    display: flex;
    align-items: center;
    width: 320px;
    max-width: 100%;
    .search-icon {
      position: absolute;
      left: 14px;
      color: #9ab8a8;
      display: flex;
      z-index: 1;
    }
    :deep(input) {
      height: 100%;
      width: 100%;
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    :deep(.ant-input-affix-wrapper) {
      display: flex;
      align-items: center;
      border-radius: 22px;
      border: 1px solid #d9f0e2;
      background: #f7fdf9;
      padding: 0 16px 0 36px;
      height: 40px;
      width: 100%;
      max-width: 100%;
    }
  }

  .panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 12px;
    padding: 16px 18px;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }

  /* Filter panel: filters on the left, search pinned to the right */
  .filter-panel {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
  .filter-panel .dp-search {
    flex: 0 0 auto;
    margin-left: auto;
  }

  /* filter grid */
  .filter-grid {
    flex: 1 1 0;
    min-width: 240px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 10px;
    :deep(.ant-select) {
      width: 100%;
    }
  }

  .posts-panel {
    padding: 10px;
  }

  .dp-loading {
    display: flex;
    justify-content: center;
    padding: 48px 0;
  }

  /* table */
  .dp-table-shell {
    :deep(.ant-table) {
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
    }
    :deep(.ant-table-thead > tr > th) {
      background: #f4fbf6;
      color: #2f6746;
      font-weight: 700;
      border-bottom: 1px solid #e1efe6;
    }
    :deep(.ant-table-tbody > tr > td) {
      border-bottom: 1px solid #f0f7f3;
    }
    :deep(.ant-table-tbody > tr:hover > td) {
      background: #f5fbf7;
    }
  }

  .dp-row-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    :deep(.btn-icon) {
      display: inline-flex;
      align-items: center;
      color: inherit;
    }
  }

  /* mobile card list — hidden on desktop */
  .dp-card-list {
    display: none;
    flex-direction: column;
    gap: 12px;
    padding: 4px;
  }

  .dp-card {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
  }

  .dp-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  .dp-card-title {
    font-size: 15px;
    font-weight: 700;
    color: #15693c;
    line-height: 1.3;
  }

  .dp-card-code {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 700;
    color: #2f6746;
    background: #daf4e4;
    border: 1px solid #9ad8b4;
    border-radius: 12px;
    padding: 2px 10px;
  }

  .dp-card-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 12px;
    margin-bottom: 14px;
    > div {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .lbl {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #7a8a82;
      font-weight: 600;
    }
    .val {
      font-size: 13px;
      font-weight: 600;
      color: #2f3a35;
    }
  }

  .dp-card-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    :deep(.ant-btn) {
      width: 100%;
      justify-content: center;
    }
    :deep(.btn-icon) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: inherit;
    }
  }

  .dp-empty {
    text-align: center;
    padding: 40px 0;
    color: #7a8a82;
    font-size: 13px;
  }

  .dp-pagination {
    display: flex;
    justify-content: flex-end;
    padding: 14px 8px 6px;
  }

  /* ───────── Mobile-first: switch to cards on small screens ───────── */
  @media (max-width: 991px) {
    .dp-table-shell {
      display: none;
    }
    .dp-card-list {
      display: flex;
    }
    .dp-pagination {
      justify-content: center;
    }
  }

  @media (max-width: 575px) {
    .dp-search {
      width: 100%;
    }
    .filter-grid {
      grid-template-columns: 1fr 1fr;
    }
    .dp-card-meta {
      grid-template-columns: 1fr;
    }
  }
}
</style>
