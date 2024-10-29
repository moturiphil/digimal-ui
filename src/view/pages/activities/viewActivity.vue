<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Activities" />
    <!-- Main content area -->
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
                <!-- Activity data table -->
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
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import {
  onMounted,
  ref,
  watch,
} from "vue";
import axios from "@/Axiosconfig";

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

var currentPage = ref(1);
var pageSize = ref(100);
var datatotal = ref(0);
const isLoading = ref(true);
const dataSource = ref([]);
const searchItem = ref("");
const location_id = ref("");

onMounted(async () => {
  isLoading.value = true;
  fetchActivities();
});

const onPageChange = async (page) => {
  currentPage.value = page;
  try {
    fetchActivities();
  } catch (error) {
    console.error(error);
  }
};
watch(
  () => searchItem.value,
  (newValue) => {
    searchItem.value = newValue;
    fetchActivities();
  }
);

const fetchActivities = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      `activity?per_page=${pageSize.value}&page=${currentPage.value}&query=${searchItem.value}&location_id=${location_id.value}`
    );
    const data = await response.data;
    datatotal.value = response.data.pagination.total;
    dataSource.value = data.data.map((item) => {
      const countyName =
        item.county_id.length > 0
          ? item.county_id.map((County) => County.name).join(", ")
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
