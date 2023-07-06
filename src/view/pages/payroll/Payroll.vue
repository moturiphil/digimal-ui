<template>
  <div>
    <sdPageHeader ghost title="Activity Payroll" />
    <Main>
      <!-- <sdButton class="btn-import" type="success" @click="HouseHoldData">
        Export Payroll Data
      </sdButton>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
      <router-link v-bind:to="'activity-payroll-matrix'">
        <sdButton type="success">
          <sdFeatherIcons size="" />
          Assign Payroll Matrix
        </sdButton>
      </router-link>

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
                                  <!-- <sdButton
                                    type="check"
                                    size="16"
                                    
                                  > -->
                                  <sdButton
                                    size="small"
                                    type="success"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <router-link
                                      :to="{
                                        path: `/payroll/view/${record.id}`,
                                        query: { id: record.id },
                                      }"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                    >
                                      &nbsp;&nbsp;
                                      <span>&nbsp;&nbsp; Payroll Details</span>
                                    </router-link>
                                  </sdButton>
                                  &nbsp;&nbsp;
                                  <!-- <sdButton
                                    @click="handlePay(record.id)"
                                    size="small"
                                    type="success"
                                  >
                                    <sdFeatherIcons
                                      type="dollar-sign"
                                      size="large"
                                    />
                                    &nbsp;&nbsp; Pay
                                  </sdButton> -->
                                  <sdButton
                                    type="success"
                                    size="small"
                                    @click="handlePay(record.id)"
                                    >Pay Activity</sdButton
                                  >
                                  <a-modal
                                    title="Payment OTP"
                                    :visible="isModalOpen"
                                    @ok="handleOk(recordId, inputValue)"
                                    @cancel="handleCancel"
                                    class="title-success"
                                  >
                                    <div>
                                      <p>Payment transaction processing</p>
                                      <input
                                        type="number"
                                        v-model="inputValue"
                                      />
                                    </div>
                                  </a-modal>
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
  {
    title: "",
    dataIndex: "",
    key: "payroll",
    slots: { customRender: "payroll" },
  },
];
export default defineComponent({
  name: "Payroll",
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
    // async handlePay(id) {
    //   console.log("handlePay", id);
    //   try {
    //     const response = await axios.post(
    //       `${process.env.VUE_APP_BASE_URL}/payment_otp`,
    //       {
    //         payroll_summary_id: id,
    //         payment_type: "Activity",
    //       },
    //       { headers: authHeader() }
    //     );

    //     // console.log(response.data.OTP);
    //     // const parser = new DOMParser();
    //     const otp = response.data.OTP;

    //     console.log(otp);

    //     if (response.status === 200) {
    //       const modalContent = `
    //         <div>
    //           <p>Payment transaction processing</p>
    //           <input type="number" v-model="inputValue" />
    //         </div>
    //       `;

    //       Modal.success({
    //         title: "Payment OTP",

    //         content: modalContent,
    //         onOk: async () => {
    //           try {
    //             const response = await axios.get(
    //               `${process.env.VUE_APP_BASE_URL}/pay_activity_clients?activity_payroll_summary_id=${id}&otp=${otp}`,
    //               { headers: authHeader() }
    //             );
    //             console.log(response);
    //             // Handle the response or perform any further actions
    //           } catch (error) {
    //             console.log(error);
    //             // Handle the error or display an error message
    //           }
    //         },
    //       });
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
  },
  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("all");
    const recordId = ref(null);

    const API_URL = `${process.env.VUE_APP_BASE_URL}/activity_payroll_summary`;

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

    const isModalOpen = ref(false);
    const inputValue = ref("");

    // const activity_id = ref("");

    // const payment_otp_id = ref("");

    const handlePay = (id) => {
      isModalOpen.value = true;
      console.log("handlePay", id);
      recordId.value = id;
      console.log("recordId", recordId.value);
      try {
        const response = axios
          .post(
            `${process.env.VUE_APP_BASE_URL}/payment_otp`,
            {
              payroll_summary_id: id,
              payment_type: "Activity",
            },
            { headers: authHeader() }
          )
          .then((responsePromise) => {
            return responsePromise.data;
          })
          .then((data) => {
            console.log(data);
          });

        console.log(response);
        // const parser = new DOMParser();
        // const otp = response.data.OTP;
      } catch (error) {
        console.log(error);
      }
    };

    const handleOk = async (id, inputValue) => {
      console.log(recordId.value);
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/pay_activity_clients?activity_payroll_summary_id=${recordId.value}&otp=${inputValue}`,
          { headers: authHeader() }
        );
        console.log(response);
        if (response.status == 200) {
          notification.success({
            message: "Success",
            description: "Payment processed successful",
          });
        }
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Payment failed",
        });
      }
      isModalOpen.value = false;
    };

    const handleCancel = () => {
      isModalOpen.value = false;
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
      isModalOpen,
      inputValue,
      // showModal,
      handlePay,
      handleOk,
      handleCancel,
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
.title-success {
  color: green;
}
</style>
