<template>
  <!-- Wrapper component for the record view -->
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Activities" />

    <!-- Main content area -->
    <Main>
      <div class="search-box">
        <span class="search-icon">
          <!-- Increase the size of the search icon by setting the 'font-size' property -->
          <sdFeatherIcons type="search" size="24" />
        </span>
        <a-input
          v-model:value="searchItem"
          type="text"
          name="dataSource"
          placeholder="Search by name code, venue or location"
          style="font-size: 15px; width: 100%; max-width: 300px; height: 2.5rem"
        />
      </div>
      <!-- Rows for search and table -->
      <a-row :gutter="16" class="search-row"></a-row>
      <a-row :gutter="15">
        <!-- Table column with activity data -->
        <a-col class="w-100" :md="24">
          <!-- Display loading spinner while data is being fetched -->
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <!-- Table displaying activity data when not loading -->
            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <a-row class="" :gutter="3">
                  <a-space>
                    <a-col
                      :xxl="28"
                      :xl="28"
                      :md="28"
                      :sm="28"
                      v-if="allowedLevels.includes('county')"
                    >
                      <a-select
                        v-model:value="county"
                        show-search
                        placeholder="Select County"
                        style="width: 100%"
                        :options="counties"
                        :filter-option="filterOption"
                        @change="handleChange($event, 'county')"
                      ></a-select>
                    </a-col>
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :md="24"
                      :sm="24"
                      v-if="allowedLevels.includes('subcounty')"
                    >
                      <a-select
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
                        v-model:value="activity"
                        show-search
                        placeholder="Select an Activity"
                        style="width: 100%"
                        :options="activities"
                        :filter-option="filterOption"
                        @change="handleChange($event, 'activity')"
                      ></a-select>
                    </a-col>
                  </a-space>
                </a-row>
                <!-- Activity data table -->
                <a-table :pagination="false" :dataSource="dataSource" :columns="columns">
                  <!-- Custom template for activity column -->
                  <template #activity="{ record }">
                    <td>
                      <!-- Buttons for viewing confirmed and pending participants -->
                      <div class="table-actions">
                        <!-- Button for viewing confirmed participants -->
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/activity/details/${record.id}`,
                              query: {
                                id: record.id,
                                name: record.name,
                                code: record.activity_code,
                                created_by: record.created_by,
                              },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            Activity Details
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
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
// Import necessary modules and components
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
// import { useStore } from "vuex";
import {
  //computed,
  onMounted,
  ref,
  watch,
  //reactive,
} from "vue";
import axios from "@/Axiosconfig";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "Actvity Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Actvity Code",
    dataIndex: "activity_code",
    key: "id",
  },
  {
    title: "Activity Start Date",
    dataIndex: "start_date",
    key: "id",
  },
  {
    title: "Number of Officers",
    dataIndex: "number_of_officers",
    key: "id",
  },
  {
    title: "Number of Days",
    dataIndex: "number_of_days",
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
    title: "",
    dataIndex: "",
    fixed: "right",
    width: 20,
    key: "activity",
    slots: { customRender: "activity" },
  },
];

// Component setup function
const isLoading = ref(false);
//const selectedRowKeys = ref([]);
const dataSource = ref([]);
const searchItem = ref("");
var currentPage = ref(1);
var pageSize = ref(100);
var datatotal = ref(0);
const counties = ref(null);
const subcounties = ref(null);
const activities = ref([]);
const allowedLevels = ref([]);
const access_level = ref(null);
const org_ids = ref([]);
// Fetch activity data from the API endpoint on component mount
onMounted(async () => {
  const user = sessionStorage.getItem("user");
  const user_object = JSON.parse(user);
  if (user_object != null) {
    access_level.value = user_object.user;
    await updateFilters();
  }
  fetchGFActivities();
});
const updateFilters = async () => {
  // access_level.value.level.id = 3
  // access_level.value.location.org_id = 'BzFBYZhF5fx'
  // access_level.value.location.name = 'Kabondo Kasipul Sub County'
  if (access_level.value.level.id == 1) {
    allowedLevels.value = ["county", "subcounty"];
    await fetchCounties();
  } else if (access_level.value.level.id == 2) {
    allowedLevels.value = ["county", "subcounty"];
    counties.value = [
      {
        value: access_level.value.location.id,
        label: access_level.value.location.name,
      },
    ];
  }
};
const handleChange = async (org_id, org_level) => {
  //fetch child data
  let org = await org_ids.value.filter((x) => x.org_id === org_id).map((e) => e.id);
  let parent_id = org[0] || 9;
  await fetchChildData(parent_id, org_id, org_level);
};
const fetchChildData = async (parent_id, org_id, org_level) => {
  currentPage.value = 1;
  let fetchUrl = `get_sub_counties_list`;
  let masterUrl = `gf_activities?per_page=${pageSize.value}&page=${currentPage.value}`;
  if (org_level == "county") {
    //get subcounties
    fetchUrl += `?parent_id=${org_id}`;
    //get county activities
    masterUrl += `&county=${parent_id}`;
  } else if (org_level == "subcounty") {
    //get subcounty activities
    fetchUrl += `?parent_id=${org_id}`;
    masterUrl += `&sub_county=${parent_id}`;
  } else if (org_level == "activity") {
    //get activities
    masterUrl += `&activity_list=${org_id}`;
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
          ...data.map((x) => ({ org_id: x.org_id, id: x.id })),
        ];
      }
    })
    .then(async () => {
      try {
        const response = await axios.get(masterUrl);
        const data = await response.data;
        datatotal.value = response.data.pagination.total;
        activities.value = data.data.map((x) => ({
          value: x.activity_list_id,
          label: x.name,
        }));
        // Format the data before assigning it to dataSource
        dataSource.value = data.data.map((item) => {
          const countyName =
            item.county_id.length > 0
              ? item.county_id.map((county) => county.name).join(",")
              : "N/A";
          const subCountyName =
            item.sub_county_id.length > 0
              ? item.sub_county_id.map((subCounty) => subCounty.name).join(", ")
              : "N/A";
          return {
            ...item,
            county_id: countyName,
            sub_county_id: subCountyName,
          };
        });
        console.log(dataSource.value);
      } catch (error) {
        console.error(error);
      }
    })
    .catch((error) => {
      notification.error({
        message: `Error!`,
        description: `${error}`,
      });
    });
};
const fetchCounties = async () => {
  await axios
    .get("counties/")
    .then((response) => {
      counties.value = response.data.map((x) => ({
        value: x.org_id,
        label: x.name,
      }));
      org_ids.value = [
        ...org_ids.value,
        ...response.data.map((x) => ({ org_id: x.org_id, id: x.id })),
      ];
      // console.log(counties.value)
    })
    .catch((error) => {
      notification.error({
        message: `Error!`,
        description: `${error}`,
      });
    });
};
const onPageChange = async (page) => {
  currentPage.value = page;
  try {
    fetchGFActivities();
  } catch (error) {
    console.error(error);
  }
};
// search events
watch(
  () => searchItem.value,
  (newValue) => {
    searchItem.value = newValue;
    fetchGFActivities();
  }
);

const fetchGFActivities = async () => {
  try {
    const response = await axios.get(
      `gf_activities?per_page=${pageSize.value}&page=${currentPage.value}&query=${searchItem.value}`
    );
    const data = await response.data;
    datatotal.value = response.data.pagination.total;
    activities.value = data.data.map((x) => ({
      value: x.activity_list_id,
      label: x.name,
    }));
    // Format the data before assigning it to dataSource
    dataSource.value = data.data.map((item) => {
      const countyName =
        item.county_id.length > 0
          ? item.county_id.map((county) => county.name).join(",")
          : "N/A";
      const subCountyName =
        item.sub_county_id.length > 0
          ? item.sub_county_id.map((subCounty) => subCounty.name).join(", ")
          : "N/A";
      return {
        ...item,
        county_id: countyName,
        sub_county_id: subCountyName,
      };
    });
  } catch (error) {
    console.error(error);
  }
};

// // Reactive form state for search input
// const formState = reactive({
//   searchItem: "",
// });

// // Computed property for filtered search results
// const results = computed(() => {
//   const query = searchItem.value.toLowerCase();
//   const regex = new RegExp(query, "i");
//   if (!query) {
//     return dataSource.value;
//   } else {
//     return dataSource.value.filter((user) => {
//       return (
//         regex.test(user.first_name) ||
//         regex.test(user.last_name) ||
//         regex.test(user.role_id)
//       );
//     });
//   }
// });
</script>
<style scoped>
.search-box {
  position: fixed;
  align-items: end;
  justify-content: end;
  top: 10%;
  left: 70%;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .search-box {
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
  }
}
</style>
