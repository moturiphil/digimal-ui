<template>
  <div>
    <sdPageHeader ghost title="Payroll" />
    <Main>
      <sdButton class="btn-import" type="success" @click="HouseHoldData">
        Export Payroll Data
      </sdButton>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu">
              <ul>
                <li>
                  <a
                    :class="activeClass === 'all' ? 'active' : 'deactivate'"
                    @click="handleChange('all')"
                    href="#"
                  >
                    Pending validation
                  </a>
                </li>
                <li>
                  <a
                    :class="
                      activeClass === 'approved' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('approved')"
                    href="#"
                  >
                    Pending Approval
                  </a>
                </li>
                <li>
                  <a
                    :class="
                      activeClass === 'outliers' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('outliers')"
                    href="#"
                  >
                    Pending Payment
                  </a>
                </li>
                <li>
                  <a
                    :class="activeClass === 'paid' ? 'active' : 'deactivate'"
                    @click="handleChange('paid')"
                    href="#"
                  >
                    Paid
                  </a>
                </li>
              </ul>
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
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  <sdButton
                                    type="check"
                                    size="16"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <!-- <span class="badge badge-green"
                                          >&nbsp;&nbsp; Payroll Details</span
                                        > -->
                                    <router-link
                                      :to="{
                                        path: `/payroll/view/${record.id}`,
                                        query: { id: record.id },
                                      }"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                    >
                                      &nbsp;&nbsp; <span class="badge badge-green"
                                          >&nbsp;&nbsp; Payroll Details</span
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
import { notification } from "ant-design-vue";
// import { useRoute } from "vue-router";


// const households = ref([]);

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Activity",
    dataIndex: "activity_id",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Amount",
    dataIndex: "total_amount",
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

    const API_URL = `${process.env.VUE_APP_BASE_URL}/payroll_summary`;

    // const households_url = `${process.env.VUE_APP_BASE_URL}/generateHHCSV`;

    // const exportHouseHoldData = async () => {
    //   try {
    //     const response = await fetch(households_url, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         ...authHeader(),
    //       },
    //     });

    //     if (!response.ok) {
    //       throw new Error("Failed to fetch export data");
    //     }

    //     const fileBlob = await response.blob();
    //     const fileName = "households.csv";
    //     const link = document.createElement("a");
    //     link.href = window.URL.createObjectURL(new Blob([fileBlob]));
    //     link.setAttribute("download", fileName);
    //     document.body.appendChild(link);
    //     link.click();
    //     link.parentNode.removeChild(link);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

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
    const handleVerify = (record) => {
      console.log(record);
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/verify_house_hold/${record}`, {
          headers: authHeader(),
        })
        .then(({ status }) => {
          console.log(status);
          if (status == 200) {
            location.reload();
            notification["success"]({
              message: "HouseHold Verified",
              description: `HouseHold has been verified successfully`,
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          // handle error
          console.log(error);
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
  background-color: #1EC997;
  color: white;
  padding: 4px;
  margin-bottom: 18px;
  border-radius: 3px;
}
</style>