<template>
  <RecordViewWrapper>
    <sdPageHeader title="Distribution Posts Order Summary">
      <template #subTitle></template>
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="24" />
          </span>
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <sdButton
        class="btn-import"
        type="success"
        @click="exportParticipants"
        size="extra-small"
        v-if="isSubCounty"
      >
        Download Order Summary &nbsp; &nbsp;
        <sdFeatherIcons type="download-cloud" size="extra-small" />
      </sdButton>
      <br />
      <br />
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
                  :pagination="false"
                  :dataSource="dataSourceWithDiscrepancies"
                  :columns="columns"
                  :rowClassName="
                    (record) => (record.hasDiscrepancy ? 'discrepancy-row' : '')
                  "
                >
                  <template #bodyCell="{ text, record, column }">
                    <span
                      :class="{
                        discrepancy:
                          column.dataIndex === 'ordered' &&
                          record.hasDiscrepancy,
                        'received-discrepancy':
                          column.dataIndex === 'delivered' &&
                          record.issueMismatch,
                      }"
                    >
                      {{ text }}
                    </span>
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
import { computed, onMounted, ref, watch } from "vue";
import axios from "@/Axiosconfig";
import { notification } from "ant-design-vue";
// import dayjs from "dayjs";
//const dateFormat = "YYYY-MM-DD";
const columns = [
  {
    title: "Post Name",
    dataIndex: "post_name",
    key: "id",
  },
  {
    title: "Ordered",
    dataIndex: "ordered",
    key: "id",
  },
  {
    title: "Issued",
    dataIndex: "issued",
    key: "id",
  },
  {
    title: "Received",
    dataIndex: "delivered",
    key: "id",
  },
];
const {
  state,
  //dispatch
} = useStore();
//const crud = computed(() => state.crud.data);
const isLoading = computed(() => state.crud.loading);
//const selectedRowKeys = ref([]);
const dataSource = ref([]);
const searchItem = ref("");
var currentPage = ref(1);
var pageSize = ref(100);
var datatotal = ref(0);
const access_level = ref({});
const filterAccessList = ref([]);
const isSubCounty = ref(false);
const countries = ref([{ value: "HfVjCurKxh2", label: "Kenya" }]);
const counties = ref(null);
const subcounties = ref(null);
const wards = ref(null);
const county = ref("Select County");
const subcounty = ref("Select Subcounty");
const org_ids = ref([]);
// const isSecurityModalOpen = ref(false);

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
  "sANMZ3lpqGs", //vihiga
  "XWALbfAPa6n", //west pokot
  "kphDeKClFch", //turkana
  "mThvosEflAU", //trans nzoia
  "kqJ83J2D72s", //naraok
  // 'Eey8fT4Im3y',//marsabit
  "vvOK1BxTbet", //baringo
  "Ulj33KBau7V", // kirinyaga
]);

onMounted(async () => {
  ///alert()
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    updateFilters();
  }
});
//handle pagination
const onPageChange = async (page) => {
  console.log(page);
  currentPage.value = page;
  try {
    const response = await axios.get(
      `post_order_summary?page=${page}&per_page=${pageSize.value}`
    );
    dataSource.value = response.data.data;
    datatotal.value = response.data.pagination.total; // Ensure this points to the correct total count property
    console.log(datatotal.value);
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

const getallDropOffPoints = async () => {
  try {
    const response = await axios.get(
      `post_order_summary?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}`
    );
    const data = await response.data;
    dataSource.value = data.data;
    datatotal.value = response.data.pagination.total; // Ensure this points to the correct total count property
    console.log(datatotal.value);
  } catch (error) {
    console.error(error);
  }
};

const updateFilters = () => {
  if (access_level.value.level.id == 1) {
    filterAccessList.value = ["county", "subcounty"];
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
    filterAccessList.value = ["county", "subcounty"];
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
    filterAccessList.value = ["subcounty"];
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
  let org = org_ids.value.filter((x) => x.org_id === org_id).map((e) => e.id);
  let parent_id = org[0] || 9;
  fetchChildData(parent_id, org_id, org_level);
};
const fetchChildData = async (location_id, org_id, org_level) => {
  let fetchUrl = `get_sub_counties_list`;
  let masterListUrl = `post_order_summary?page=${currentPage.value}&per_page=${pageSize.value}&query=${searchItem.value}`;
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
        isSubCounty.value = true;
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

const dataSourceWithDiscrepancies = computed(() => {
  return dataSource.value.map((item) => ({
    ...item,
    hasDiscrepancy: item.ordered !== item.issued,
    issueMismatch: item.issued !== item.delivered,
  }));
});

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

console.log(datatotal.value);
</script>
<style>
.discrepancy-row {
  background-color: #ffe6e6; /* Light red background for rows with discrepancies */
}

.received-discrepancy {
  background-color: #ffec99; /* Dark yellow background for cells with discrepancies in the Received column */
}
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
