<template>
  <RecordViewWrapper class="legacy-platform-page">
    <sdPageHeader title="Warehouses">
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="24" />
          </span>
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name or code"
            style="
              font-size: 15px;
              width: 100%;
              max-width: 300px;
              height: 2.5rem;
            "
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
                  :pagination="false"
                  :dataSource="dataSource"
                  :columns="columns"
                  rowKey="id"
                >
                  <template #order_status="{ text }">
                    <span :class="statusBadgeClass(text)">{{ text }}</span>
                  </template>
                </a-table>
                <a-empty
                  v-if="!dataSource.length"
                  description="No warehouses found for the active campaign."
                />
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
import { onMounted, ref, watch } from "vue";
import axios from "@/Axiosconfig";
import { notification } from "ant-design-vue";

// Warehouses are drop-off points flagged `is_warehouse` (see
// database/migrations/2026_10_16_000003_add_kemsa_flags_to_drop_off_points.php),
// so this page consumes GET /get_all_drop_off_points with ?is_warehouse=1 and
// renders the same `DropOffPoints::formatForOperatingCampaign` payload the
// drop-off list uses.
const columns = [
  {
    title: "Warehouse Name",
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
    title: "Warehouse Code",
    dataIndex: "drop_off_code",
    key: "id",
  },
  {
    title: "Warehouse Manager",
    dataIndex: "drop_off_manager",
    key: "id",
  },
  {
    title: "Building Campaign",
    dataIndex: "building_campaign",
    key: "id",
  },
  {
    title: "Operating Campaign",
    dataIndex: "campaign_id",
    key: "id",
  },
  {
    title: "Order Status",
    dataIndex: "order_status",
    key: "order_status",
    slots: { customRender: "order_status" },
  },
];

const isLoading = ref(true);
const dataSource = ref([]);
const searchItem = ref("");
const currentPage = ref(1);
const pageSize = ref(100);
const datatotal = ref(0);
const filterAccessList = ref([]);
const counties = ref([]);
const subcounties = ref([]);
const county = ref("Select County");
const subcounty = ref("Select Subcounty");
const selectedCountyId = ref("");
const selectedSubcountyId = ref("");
const org_ids = ref([]);

const filterOption = (input, option) =>
  String(option.label || "")
    .toLowerCase()
    .indexOf(input.toLowerCase()) >= 0;

const statusBadgeClass = (text) => {
  switch (text) {
    case "Generated":
      return "badge-green";
    case "Not Generated":
      return "badge-red";
    case "pending":
      return "badge-orange";
    case "processing":
      return "badge-blue";
    default:
      return "badge-default";
  }
};
// The list requires an operating campaign (or an explicit campaign_id) and the
// API paginates 100 rows per page.
const buildParams = () => {
  const params = {
    is_warehouse: 1,
    page: currentPage.value,
    per_page: pageSize.value,
  };
  if (searchItem.value) {
    params.query = searchItem.value;
  }
  if (selectedCountyId.value) {
    params.county_id = selectedCountyId.value;
  }
  if (selectedSubcountyId.value) {
    params.subcounty_id = selectedSubcountyId.value;
  }
  return params;
};

const fetchWarehouses = async () => {
  isLoading.value = true;
  try {
    const { data } = await axios.get("get_all_drop_off_points", {
      params: buildParams(),
    });
    dataSource.value = data.data || [];
    datatotal.value = data.pagination
      ? data.pagination.total
      : dataSource.value.length;
  } catch (error) {
    // 404 → the API reports an empty list ("No Drop off points found.").
    // 422 → no campaign is active (DropOffStockService::resolveReadCampaignId).
    const status = error?.response?.status;
    if (status !== 404) {
      notification.error({
        message: "Error",
        description:
          error?.response?.data?.message || "Unable to load warehouses.",
      });
    }
    dataSource.value = [];
    datatotal.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const fetchCounties = async () => {
  try {
    const { data } = await axios.get("counties/");
    counties.value = data.map((x) => ({ value: x.org_id, label: x.name }));
    org_ids.value = data.map((x) => ({ org_id: x.org_id, id: x.id }));
  } catch (error) {
    console.error(error);
  }
};

const fetchSubCounties = async (parentOrgId) => {
  try {
    const { data } = await axios.get(
      `get_sub_counties_list?parent_id=${parentOrgId}`
    );
    const rows = data.message || [];
    subcounties.value = rows.map((x) => ({ value: x.org_id, label: x.name }));
    org_ids.value = [
      ...org_ids.value,
      ...rows.map((x) => ({ org_id: x.org_id, id: x.id })),
    ];
  } catch (error) {
    console.error(error);
  }
};

const handleChange = async (org_id, org_level) => {
  const location_id = org_ids.value
    .filter((x) => x.org_id === org_id)
    .map((e) => e.id)[0];
  if (org_level === "county") {
    selectedCountyId.value = location_id || "";
    selectedSubcountyId.value = "";
    subcounty.value = "Select Subcounty";
    subcounties.value = [];
    await fetchSubCounties(org_id);
  } else if (org_level === "subcounty") {
    selectedSubcountyId.value = location_id || "";
  }
  currentPage.value = 1;
  fetchWarehouses();
};

const onPageChange = (page) => {
  currentPage.value = page;
  fetchWarehouses();
};

// Filter visibility mirrors the drop-off list: national users filter by county
// and sub-county, county users by their own county, sub-county users by their
// own sub-county. The API scopes the result the same way (levels 1/2/3).
const updateFilters = () => {
  const session = JSON.parse(sessionStorage.getItem("user") || "{}");
  const user = session.user || {};
  const level = user.level && user.level.id ? user.level.id : user.level_id;
  const location = user.location || {};

  if (level == 1) {
    filterAccessList.value = ["county", "subcounty"];
    fetchCounties();
  } else if (level == 2) {
    filterAccessList.value = ["county", "subcounty"];
    counties.value = [{ value: location.org_id, label: location.name }];
    org_ids.value = [{ org_id: location.org_id, id: location.id }];
  } else if (level == 3) {
    filterAccessList.value = ["subcounty"];
    subcounties.value = [{ value: location.org_id, label: location.name }];
    org_ids.value = [{ org_id: location.org_id, id: location.id }];
  }
};

watch(
  () => searchItem.value,
  () => {
    currentPage.value = 1;
    fetchWarehouses();
  }
);

onMounted(() => {
  updateFilters();
  fetchWarehouses();
});
</script>
<style>
.badge-orange {
  background-color: orange;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-blue {
  background-color: blue;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-green {
  background-color: green;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-red {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-default {
  background-color: gray;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}
</style>
