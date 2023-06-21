<template>
  <div>
    <sdPageHeader ghost title="Activity Payroll" />
    <Main>
      <sdButton class="btn-import" type="success" @click="handleVerify(id)">
        Pay
      </sdButton>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu">
            </div>
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
                                  <sdButton type="check" size="16">
                                    &nbsp;&nbsp;
                                    <!-- <span class="badge badge-green"
                                            >&nbsp;&nbsp; Payroll Details</span
                                          > -->
                                    <router-link
                                      :to="{
                                        path: `/activity/breakdown/${record.id}`,
                                        query: { id: record.id },
                                      }"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                    >
                                      &nbsp;&nbsp;
                                      <span class="badge badge-green"
                                        >&nbsp;&nbsp; Breakdown</span
                                      >
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
import { notification } from "ant-design-vue";

// const households = ref([]);

const columns = [
  {
    title: "Name",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "user_id",
    key: "id",
  },
  {
    title: "Activity",
    dataIndex: "activity_payroll_id",
    key: "id",
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "id",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "id",
  },
  // {
  //   title: "Village",
  //   dataIndex: "location_id",
  //   key: "id_no",
  // },
  // {
  //   title: "CHV",
  //   dataIndex: "chw_id",
  //   key: "id_no",
  // },h
  // {
  //   title: "Timestamp",
  //   dataIndex: "created_at",
  //   key: "id_no",
  // },
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
    // handleChange(value) {
    //   this.activeClass = value;
    // },
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
    const API_URL = `${process.env.VUE_APP_BASE_URL}/activity_payroll_list?payroll_id=${query.id}`;

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

    //send a request to the data to pay for activity from the pay buttons
    const handleVerify = () => {
      axios
        .get(
          `${process.env.VUE_APP_BASE_URL}/pay_activity_clients?activity_payroll_summary_id=${query.id}`,
          {
            headers: authHeader(),
          }
        )
        .then((response) => {
          console.log(response.data);
          if (response.data) {
            notification["success"]({
              message: "Transaction Processing",
              description: `Transaction is being processed. Please wait for completion before checking the transaction details page`,
              duration: 11,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    // handleChange(tab) {
    //   if (tab === 'all') {
    //     filteredData.value = dataSource.value;
    //   } else if (tab === 'approved') {
    //     filteredData.value = dataSource.value.filter(item => item.isVerified === 1);
    //   } else if (tab === 'outliers') {
    //     filteredData.value = dataSource.value.filter(item => item.hh_size > 5);
    //   }
    // }

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
      handleVerify,
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
</style>
