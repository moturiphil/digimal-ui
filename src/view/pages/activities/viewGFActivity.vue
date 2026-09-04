<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Activities" />
    <Main>
      <div class="search-box">
        <span class="search-icon">
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
      <a-row :gutter="16" class="search-row"></a-row>
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

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
                    <a-col
                      :xxl="24"
                      :xl="24"
                      :md="24"
                      :sm="24"
                      style="width: 150%"
                    >
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
                <a-table
                  :pagination="false"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <template #activity="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/activity/details/${record.id}`,
                              query: {
                                id: record.id,
                                name: record.name,
                                code: record.activity_code,
                                created_by: record.created_by,
                                start_date: record.start_date,
                                activity_list_id: record.activity_list_id,
                                campaign_budget_id: record.campaign_budget_id ?? null,
                                budget_category_id: record.budget_category_id ?? null,
                                budget_category_name: record.budget_category_name ?? null,
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
import { useStore } from "vuex";

const store = useStore();
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
    title: "Payroll Status",
    dataIndex: "payroll_status",
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
const isLoading = ref(true);
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
const county_id = ref("");
const sub_county_id = ref("");
const activity_list_id = ref("");

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
  let org = await org_ids.value
    .filter((x) => x.org_id === org_id)
    .map((e) => e.id);
  let parent_id = org[0] || 9;
  await fetchChildData(parent_id, org_id, org_level);
};
const fetchChildData = async (parent_id, org_id, org_level) => {
  currentPage.value = 1;
  let fetchUrl = `get_sub_counties_list`;
  let masterUrl = `gf_activities?per_page=${pageSize.value}&page=${currentPage.value}`;
  county_id.value = store.state.filters.county_id;
  sub_county_id.value = store.state.filters.sub_county_id;
  activity_list_id.value;
  if (org_level == "county") {
    store.dispatch("getCountyId", parent_id);
    county_id.value = store.state.filters.county_id;
    //get subcounties
    fetchUrl += `?parent_id=${org_id}`;
    //get county activities
    masterUrl += `&county=${county_id.value}`;
  } else if (org_level == "subcounty") {
    store.dispatch("getSubCountyId", parent_id);
    sub_county_id.value = store.state.filters.sub_county_id;
    //get subcounty activities
    fetchUrl += `?parent_id=${org_id}`;
    masterUrl += `&sub_county=${sub_county_id.value}`;
  } else if (org_level == "activity") {
    //get activities
    activity_list_id.value = org_id;
    masterUrl += `&county=${county_id.value}&sub_county=${sub_county_id.value}&activity_list=${activity_list_id.value}`;
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

        // Use a Set to track unique activity_list_ids
        const uniqueActivities = new Set();
        activities.value = data.data
          .filter((x) => {
            if (uniqueActivities.has(x.activity_list_id)) {
              return false; // Skip duplicate
            } else {
              uniqueActivities.add(x.activity_list_id);
              return true; // Include unique
            }
          })
          .map((x) => ({
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

        console.log(activities.value);
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
  isLoading.value = true;
  try {
    const response = await axios.get(
      `gf_activities?per_page=${pageSize.value}&page=${currentPage.value}&query=${searchItem.value}&county=${county_id.value}&sub_county=${sub_county_id.value}&activity_list=${activity_list_id.value}`
    );
    const data = await response.data;
    datatotal.value = response.data.pagination.total;

    // Use a Set to track unique activity_list_ids
    const uniqueActivities = new Set();
    activities.value = data.data
      .filter((x) => {
        if (uniqueActivities.has(x.activity_list_id)) {
          return false; // Skip duplicate
        } else {
          uniqueActivities.add(x.activity_list_id);
          return true; // Include unique
        }
      })
      .map((x) => ({
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
  } finally {
    isLoading.value = false;
  }
};
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
