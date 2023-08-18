<template>
  <div>
    <sdPageHeader ghost title="Event Payroll" />
    <Main>
      <!-- <sdButton class="btn-import" type="success" @click="HouseHoldData">
        Export Payroll Data
      </sdButton>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
      <router-link v-bind:to="'event-payroll-matrix'">
        <sdButton type="success">
          <sdFeatherIcons size="" class="icon-color-white" />
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
                    All Payroll
                  </a>
                </li>
                <li v-if="isValidator">
                  <a
                    :class="
                      activeClass === 'not_validated' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('not_validated')"
                    href="#"
                  >
                    Pending Validation
                  </a>
                </li>
                <li v-if="isApprover">
                  <a
                    :class="
                      activeClass === 'pending_approval'
                        ? 'active'
                        : 'deactivate'
                    "
                    @click="handleChange('pending_approval')"
                    href="#"
                  >
                    Pending Approval
                  </a>
                </li>
                <li v-if="isAdminAccountant">
                  <a
                    :class="
                      activeClass === 'pending_payment'
                        ? 'active'
                        : 'deactivate'
                    "
                    @click="handleChange('pending_payment')"
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
                                    size="small"
                                    type="success"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <router-link
                                      :to="{
                                        path: `/payroll/event-view/${record.id}`,
                                        query: {
                                          id: record.id,
                                          name: record.name,
                                          duration: record.duration,
                                          venue: record.venue,
                                          date: record.start_date,
                                        },
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
                          v-show="activeClass === 'not_validated'"
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
                                    size="small"
                                    type="success"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <router-link
                                      :to="{
                                        path: `/payroll/event-view/${record.id}`,
                                        query: {
                                          id: record.id,
                                          name: record.name,
                                          duration: record.duration,
                                          venue: record.venue,
                                          date: record.start_date,
                                        },
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

                                  <sdButton
                                    type="success"
                                    size="small"
                                    @click="handleValidation(record.id)"
                                    >Validate</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'pending_approval'"
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
                                    size="small"
                                    type="success"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <router-link
                                      :to="{
                                        path: `/payroll/event-view/${record.id}`,
                                        query: {
                                          id: record.id,
                                          name: record.name,
                                          duration: record.duration,
                                          venue: record.venue,
                                          date: record.start_date,
                                        },
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
                                  <sdButton
                                    type="success"
                                    size="small"
                                    @click="handleApproval(record.id)"
                                    >Approve</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'pending_payment'"
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
                                    size="small"
                                    type="success"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <router-link
                                      :to="{
                                        path: `/payroll/event-view/${record.id}`,
                                        query: {
                                          id: record.id,
                                          name: record.name,
                                          duration: record.duration,
                                          venue: record.venue,
                                          date: record.start_date,
                                        },
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
                                  <sdButton
                                    type="success"
                                    size="small"
                                    @click="handlePay(record.id)"
                                    >Pay Event</sdButton
                                  >
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
                            <template>
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <!-- <sdButton
                                    type="check"
                                    size="16"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <span class="badge badge-green"
                                      >&nbsp;&nbsp; Verify</span
                                    >
                                  </sdButton> -->
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
  // {
  //   title: "Event",
  //   dataIndex: "event_id",
  //   key: "id",
  // },
  {
    title: "Validated",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Approved",
    dataIndex: "approval_status",
    key: "id",
  },
  {
    title: "Paid",
    dataIndex: "payment_status",
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
    const recordId = ref(null);

    const API_URL = `${process.env.VUE_APP_BASE_URL}/event_pay_roll_summary`;

    const filteredData = computed(() => {
      if (activeClass.value === "all") {
        console.log(dataSource.value);
        return dataSource.value;
      } else if (activeClass.value === "not_validated") {
        return dataSource.value.filter(
          (item) => item.status === "Not Validated"
        );
      } else if (activeClass.value === "not_approved") {
        return dataSource.value.filter(
          (item) => item.status === "Validated" && item.approval_status === 0
        );
      } else if (activeClass.value === "pending_approval") {
        return dataSource.value.filter(
          (item) => item.approval_status === "Not Approved" && item.status === "Validated"
        );
      } else if (activeClass.value === "pending_payment") {
        return dataSource.value.filter(
          (item) =>
            item.approval_status === "Approved" &&
            item.payment_status === "Not Paid"
        );
      } else if (activeClass.value === "paid") {
        return dataSource.value.filter(
          (item) =>
            item.payment_status === "Paid" &&
            item.approval_status === "Approved" &&
            item.status === "Validated"
        );
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
              payment_type: "Event",
            },
            { headers: authHeader() }
          )
          .then((responsePromise) => {
            return responsePromise.data;
          })
          .then((data) => {
            console.log(data);
            if (data.success == true) {
              notification.success({
                message: "Success",
                description: "OTP Sent Successfully",
              });
            }
          });

        console.log(response);
        // const parser = new DOMParser();
        // const otp = response.data.OTP;
      } catch (error) {
        console.log(error);
      }
    };

    const handleValidation = (id) => {
      console.log("handleApprove", id);
      console.log(id);
      try {
        const response = axios
          .post(
            `${process.env.VUE_APP_BASE_URL}/event_payroll_validation`,
            {
              payroll_id: id,
            },
            { headers: authHeader() }
          )
          .then((responsePromise) => {
            return responsePromise.data;
          })
          .then((data) => {
            console.log(data);
            if (data.success == true) {
              notification.success({
                message: "Success",
                description: "Payroll Validated Successfully",
              });
            } else {
              notification.error({
                message: "Error",
                description: "Payroll Validation Failed",
              });
            }
          });

        console.log(response);
        // const parser = new DOMParser();
        // const otp = response.data.OTP;
      } catch (error) {
        console.log(error);
      }
    };

    const handleApproval = (id) => {
      console.log("handleApprove", id);
      console.log(id);
      try {
        const response = axios
          .post(
            `${process.env.VUE_APP_BASE_URL}/event_payroll_approval`,
            {
              payroll_id: id,
            },
            { headers: authHeader() }
          )
          .then((responsePromise) => {
            return responsePromise.data;
          })
          .then((data) => {
            console.log(data);
            if (data.success == true) {
              notification.success({
                message: "Success",
                description: "Payroll Validated Successfully",
              });
            } else {
              notification.error({
                message: "Error",
                description: "Payroll Validation Failed",
              });
            }
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
          `${process.env.VUE_APP_BASE_URL}/pay_event_clients?event_payroll_summary_id=${recordId.value}&otp=${inputValue}`,
          { headers: authHeader() }
        );
        console.log(response);
        if (response.status == 200) {
          notification.success({
            message: "Success",
            description: "Payment processed successful",
          });
          const approve_pay = axios
            .post(
              `${process.env.VUE_APP_BASE_URL}/event_payroll_payment`,
              {
                payroll_id: recordId.value,
              },
              { headers: authHeader() }
            )
            .then((responsePromise) => {
              return responsePromise.data;
            })
            .then((data) => {
              console.log(data);
              if (data.success == true) {
                notification.success({
                  message: "Success",
                  description:
                    "Payment Approved Successfully, Enter OTP to complete payment",
                });
              }
            });
          console.log(approve_pay);
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
          console.log('################################')
          console.log(response.data.data);
          dataSource.value = response.data.data;
          dataSource.value.forEach((item) => {
            item.approval_status =
              item.approval_status === 1 ? "Approved" : "Not Approved";
          });
          dataSource.value.forEach((item) => {
            item.status = item.status === 1 ? "Validated" : "Not Validated";
          });
          dataSource.value.forEach((item) => {
            item.payment_status =
              item.payment_status === 1 ? "Paid" : "Not Paid";
          });
          console.log(dataSource.value);
        })
        .catch((error) => {
          console.error(error);
        });
    });
    const handleVerify = (record) => {
      console.log(record);
    };

    // const level_id = ref("");
    const role_id = ref("");
    // const admin_role_id = ref("");

    const user = JSON.parse(sessionStorage.getItem("user"));
    // console.log(user.user[0].role_id);
    role_id.value = user.user.role_id;

    const isValidator = computed(() => {
      return role_id.value === 4 || role_id.value === 1;
    });

    const isApprover = computed(() => {
      return role_id.value === 2 || role_id.value === 1;
    });

    const isAdminAccountant = computed(() => {
      return role_id.value === 1 || role_id.value === 1;
    });

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
      handleValidation,
      handleApproval,
      handleOk,
      handleCancel,
      isValidator,
      isApprover,
      isAdminAccountant,
    };
  },
  // computed: {
  // },
});
</script>
<style scoped>
.badge-green {
  background-color: #1ec997;
  /* color: white; */
  /* padding: 2px;
    border-radius: 3px; */
  /* size */
  font-size: 12px;
}
.title-success {
  color: green;
}
</style>
<style scoped>
.icon-color-white {
  color: white;
}
</style>