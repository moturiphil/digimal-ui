<template>
  <div>
    <sdPageHeader :title="`${event_name} Event`"></sdPageHeader>
    <Main>
      <p class="detail-info">
          <b>Location:</b> {{ ` ${venue}` }} ||  <b>Start Date:</b> {{ `${date}` }} ||
          <b>Duration:</b> {{ `${duration} days` }}
      </p>
      <sdButton
        class="btn-import"
        type="success"
        @click="exportPayrollList"
        size="small"
      >
        Download List &nbsp; &nbsp;
        <sdFeatherIcons type="download-cloud" size="extra-small" />
      </sdButton>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu"></div>
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
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  <sdButton size="extra-small" type="success">
                                    <router-link
                                      :to="{
                                        path: `/event/breakdown/${record.id}`,
                                        query: { id: record.id },
                                      }"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                    >
                                      &nbsp;&nbsp; Breakdown
                                    </router-link>
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'approved'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'outliers'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton
                                    type="check"
                                    size="16"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <span class="badge badge-green"
                                      >&nbsp;&nbsp; Verify</span
                                    >
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'paid'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton
                                    type="check"
                                    size="16"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <span class="badge badge-green"
                                      >&nbsp;&nbsp; Verify</span
                                    >
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                      </div>
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
// import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";

// const households = ref([]);

const columns = [
  {
    title: "Name",
    dataIndex: "user_id",
    key: "id",
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "organization",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "id",
  },
  {
    title: "Job Group",
    dataIndex: "job_group",
    key: "id",
  },
  {
    title: "Attendance Days",
    dataIndex: "no_of_days",
    key: "id",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "payroll",
    slots: { customRender: "payroll" },
  },
];
export default defineComponent({
  name: "HouseHold Validation",
  components: {
    Main,
    SearchResultWrapper,
  },
  data() {
    return {
      notData: this.searchData,
      current: 0,
      pageSize: 0,
      visible: false,
      confirmLoading: false,
      modalType: "primary",
      colorVisible: false,
      payroll: [],
    };
  },
  methods: {
    handleSearch(searchText) {
      const data = this.searchData.filter((item) =>
        item.title.toUpperCase().startsWith(searchText.toUpperCase())
      );
      this.notData = data;
    },
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
    },
    searchData() {
      return this.$store.state.headerSearch.data;
    },
  },
  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("all");

    const { params, query } = useRoute();
    console.log({ params, query });

    console.log(query.id);
    const event_name = query.name;
    const duration = query.duration;
    const venue = query.venue;
    const date = query.date;
    console.log(event_name);
    console.log(query.id);
    const API_URL = `${process.env.VUE_APP_BASE_URL}/event_pay_roll_list?event_payroll_id=${query.id}`;
    const export_pay_list_url = `${process.env.VUE_APP_BASE_URL}/event_pay_export?id=${query.id}`;

    const filteredData = computed(() => {
      if (activeClass.value === "approved") {
        console.log(dataSource.value);
        return dataSource.value.filter((item) => item.isVerified === 1);
      } else if (activeClass.value === "outliers") {
        return dataSource.value.filter((item) => item.isVerified === 0);
      } else {
        return dataSource.value;
      }
    });
    const exportPayrollList = async () => {
      try {
        const response = await fetch(export_pay_list_url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch export data");
        }

        const fileBlob = await response.blob();
        const fileName = "Event Participants.xlsx";
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([fileBlob]));
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error(error);
      }
    };

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          dataSource.value = response.data.data;
          // households.value = response.data.data;
          console.log(dataSource.value);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const formState = reactive({
      searchItem: "",
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      columns,
      formState,
      // exportHouseHoldData,
      filteredData,
      handleChange,
      activeClass,
      event_name,
      duration,
      venue,
      date,
      exportPayrollList,
    };
  },
  // computed: {
  // },
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

<style>
.badge-green {
  background-color: #1ec997;
  color: white;
  padding: 4px;
  margin-bottom: 18px;
  border-radius: 3px;
}
sdPageHeader {
  margin-bottom: 10px; /* Adjust the value as needed to control the vertical spacing */
}
</style>
