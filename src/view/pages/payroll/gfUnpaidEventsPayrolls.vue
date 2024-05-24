<template>
  <div>
    <sdPageHeader ghost title="GF Event Unpaid Payroll">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by payroll details..."
          /></div
      ></template>
    </sdPageHeader>
    <Main>
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
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton size="small" type="success">
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
                                          validate_status: record.status,
                                          approval_status:
                                            record.approval_status,
                                          payment_status: record.payment_status,
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
                                  &nbsp;&nbsp;
                                  <a-modal
                                    title="Payment OTP"
                                    :visible="isModalOpen"
                                    @cancel="handleCancel"
                                    class="title-success"
                                  >
                                    <div>
                                      <p>Enter payment OTP</p>
                                      <input
                                        type="number"
                                        v-model="inputValue"
                                      />
                                      <br />
                                      <br />
                                      <sdButton
                                        type="success"
                                        size="extra-small"
                                        @click="resendOTP()"
                                        :disabled="isDisabled"
                                      >
                                        Resend OTP
                                        {{
                                          countdown > 0
                                            ? "(" + countdown + "s)"
                                            : ""
                                        }}
                                      </sdButton>
                                    </div>
                                    <template v-slot:footer>
                                      <a-button
                                        @click="handleOk(recordId, inputValue)"
                                        type="success"
                                        :disabled="isPaying"
                                        >{{
                                          isLoading
                                            ? "Loading..."
                                            : isPaying
                                            ? "Processing Payment..."
                                            : "Pay"
                                        }}</a-button
                                      >
                                      <a-button
                                        @click="handleCancel()"
                                        type="danger"
                                        >Close</a-button
                                      >
                                    </template>
                                  </a-modal>
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
import { SearchResultWrapper } from "../style";
import { computed, onMounted, ref, defineComponent, watchEffect } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import store from "../../../vuex/store";

const columns = [
  {
    title: "Name",
    dataIndex: "event_id",
    key: "id",
  },
  {
    title: "Validated",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Validator",
    dataIndex: "validated_by",
    key: "id",
  },
  {
    title: "Approved",
    dataIndex: "approval_status",
    key: "id",
  },
  {
    title: "Approver",
    dataIndex: "approved_by",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "payment_status",
    key: "id",
  },
  {
    title: "Payroll Amount",
    dataIndex: "total_amount",
    key: "id",
  },
  {
    title: "Total Paid",
    dataIndex: "amount_transacted",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    fixed: "right",
    width: 20,
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
    const searchItem = ref("");
    const recordId = ref(null);
    const API_URL = `${process.env.VUE_APP_BASE_URL}/all_event_payrolls?funding_id=1&is_paid=0`;
    const isModalOpen = ref(false);
    const isPaying = computed(() => state.isPaying);
    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    const isDisabled = ref(true);
    const countdown = ref(60);

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data);
          dataSource.value = response.data.data.map((item) => ({
            ...item,
            old_values: item.old_values,
            new_values: item.new_values,
          }));
          dataSource.value.forEach((item) => {
            item.status = item.status === 1 ? "Validated" : "Not Validated";
            item.payment_status =
              item.payment_status === 1 ? "Paid" : "Not Paid";
            item.approval_status =
              item.approval_status === 1 ? "Approved" : "Not Approved";
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });

    watchEffect(async () => {
      const query = searchItem.value.toLowerCase();
      try {
        if (!query) {
          return dataSource.value;
        }
        if (query.length > 3) {
          const response = await fetch(`${API_URL}&query=${query}`, {
            method: "GET",
            headers: authHeader(),
          });
          const data = await response.json();
          dataSource.value = data.data.map((item) => ({
            ...item,
            old_values: item.old_values,
            new_values: item.new_values,
          }));
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message,
        });
      }
    });

    // handle payment
    const handlePay = (id) => {
      isModalOpen.value = true;
      countdownTimer()
      recordId.value = id;

      try {
        fetch(
          `${process.env.VUE_APP_BASE_URL}/payment_otp?payroll_summary_id=${id}&payment_type=Event`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.success === true) {
              notification.success({
                message: "Success!",
                description: data.message,
              });
              setTimeout(() => {}, 2000);
            } else {
              notification.error({
                message: "Error!",
                description: data.message,
              });
            }
          });
      } catch (error) {
        console.log(error);
      }
    };

    const resendOTP = () => {

      try {
        fetch(
          `${process.env.VUE_APP_BASE_URL}/payment_otp?payroll_summary_id=${recordId.value}&payment_type=Event`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            countdownTimer()
            if (data.success === true) {
              notification.success({
                message: "Success!",
                description: data.message,
              });
              setTimeout(() => {}, 2000);
            } else {
              notification.error({
                message: "Error!",
                description: data.message,
              });
            }
          });
      } catch (error) {
        console.log(error);
      }
    };

    const handleOk = async (id, inputValue) => {
      store.commit("setIsPaying", true);
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/pay_event_clients?event_payroll_summary_id=${recordId.value}&otp=${inputValue}`
        );
        if (response.status == 200) {
          store.commit("setIsPaying", true);
          notification.success({
            message: "Success",
            description: "Payment processed successful",
          });
          setTimeout(function () {
            location.reload();
          }, 3000);

          axios
            .post(`event_payroll_payment`, {
              payroll_id: recordId.value,
            })
            .then((responsePromise) => {
              return responsePromise.data;
            })
            .then((data) => {
              if (data.success == true) {
                notification.success({
                  message: "Success",
                  description:
                    "Payment Approved Successfully, Enter OTP to complete payment",
                });
              }
            });
        }
      } catch (error) {
        store.commit("setIsPaying", true);
        notification.error({
          message: "Error",
          description: "Payment failed",
        });
        // setTimeout(function () {
        //   location.reload();
        // }, 3000);
      }
      isModalOpen.value = false;
    };

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    const startCountdown = () => {
      console.log('starting countdown');
      let timerId;
      countdown.value = 60;
      isDisabled.value = true;

      const updateCountdown = () => {
        countdown.value--;
        console.log(countdown.value);
        if (countdown.value <= 0) {
          clearInterval(timerId);
          isDisabled.value = false;
        }
      };

      timerId = setInterval(updateCountdown, 1000);

      updateCountdown();
    };

    const countdownTimer = () => {
      isDisabled.value = true;
      countdown.value = 60;
      startCountdown();
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      searchItem,
      columns,
      handleChange,
      activeClass,
      handlePay,
      handleOk,
      isModalOpen,
      handleCancel,
      isDisabled,
      countdown,
      countdownTimer,
      resendOTP,
      isPaying,
    };
  },
});
</script>
<style>
.badge-green {
  background-color: #1ec997;
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
