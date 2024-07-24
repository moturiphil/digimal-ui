<template>
  <div class="">
    <SearchResultWrapper>
      <sdPageHeader ghost title="Event Payroll">
        <template #buttons>
          <div class="search-box">
            <a-input
              style="
                border: 1px solid #151414;
                padding: 8px;
                border-radius: 5px;
                align-items: center;
                justify-items: center;
              "
              v-model:value="searchItem"
              type="text"
              name="dataSource"
              placeholder="Search by name"
            />
          </div>
        </template>
      </sdPageHeader>
      <Main>
        <!-- <sdButton class="btn-import" type="success" @click="HouseHoldData">
          Export Payroll Data
        </sdButton>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
        <router-link v-bind:to="'event-payroll-matrix'">
          <sdButton type="success" v-if="isAdmin">
            <sdFeatherIcons size="small" class="icon-color-white" />
            Payroll Matrix
          </sdButton>
        </router-link>
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
                              <td
                                :style="{ 'margin-left': '3px' }"
                                v-show="record.payment_status === 'Not Paid'"
                              >
                                <div class="table-actions">
                                  <sdButton
                                    size="extra-small"
                                    type="warning"
                                    @click="showVoidModal(record)"
                                  >
                                    <DeleteRowOutlined />
                                    <span>&nbsp;&nbsp;Void</span>
                                  </sdButton>
                                  <!---modals-->
                                  <a-modal
                                    :visible="openVoidModal"
                                    title="Confirm Void Payroll"
                                    @ok="actionVoidPayroll"
                                    @cancel="handleVoidCancel"
                                    width="20%"
                                  >
                                    <template #footer>
                                      <a-button
                                        key="back"
                                        @click="handleVoidCancel"
                                        >No, Take me back!</a-button
                                      >
                                      <a-button
                                        key="submit"
                                        style="
                                          background: orange;
                                          color: aliceblue;
                                        "
                                        @click="actionVoidPayroll"
                                        >Yes, Void it!</a-button
                                      >
                                    </template>
                                    <h4>
                                      Are you sure you want to void
                                      Payroll,Amount
                                      <b>KShs.{{ voidPayroll.total_amount }}</b>
                                    </h4>
                                  </a-modal>
                                </div>
                              </td>
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  <sdButton
                                    size="etra-small"
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
                                        >Cancel Payment</a-button
                                      >
                                    </template>
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
      </Main>
    </SearchResultWrapper>
  </div>
</template>

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import { computed, onMounted, ref, watchEffect } from "vue";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import store from "../../../vuex/store";
import { DeleteRowOutlined } from "@ant-design/icons-vue";
import authHeader from "../../../services/auth-header";


const columns = [
  {
    title: "Name",
    dataIndex: "event_id",
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
    fixed: "right",
    width: 20,
    key: "payroll",
    slots: { customRender: "payroll" },
  },
];

const { state } = useStore();
const isLoading = computed(() => state.crud.loading);
const dataSource = ref([]);
// const payload = ref([]);
const activeClass = ref("all");
const recordId = ref(null);
const isPaying = computed(() => state.isPaying);
const API_URL = `${process.env.VUE_APP_BASE_URL}/event_pay_roll_summary`;
const isModalOpen = ref(false);
const inputValue = ref("");
const role_id = ref("");
const searchItem = ref("");
const user = JSON.parse(sessionStorage.getItem("user"));
const pmiEventPayroll = ref([]);
const openVoidModal = ref(false);
const voidPayroll = ref(null);
const isDisabled = ref(true);
const countdown = ref(60);


const showVoidModal = (record) => {
  voidPayroll.value = record;
  openVoidModal.value = true;
};
const handleVoidCancel = () => {
  openVoidModal.value = false;
};
const actionVoidPayroll = async () => {
  await axios
    .post(`void_events_payroll_summaries/${voidPayroll.value.id}`)
    .then((response) => {
      openVoidModal.value = false;
      console.log(response);
      if (response.data.success == true) {
        notification.success({
          message: "Success",
          description: response.data.message,
        });
      } else if (response.data.success == false) {
        notification.warning({
          message: "Info",
          description: response.data.message,
        });
      }
    })
    .catch((e) => {
      notification.error({
        message: "Error!",
        description: e.toString(),
      });
      console.log(e);
    });
};

const filteredData = computed(() => {
  if (activeClass.value === "all") {
    return dataSource.value;
  } else if (activeClass.value === "not_validated") {
    return dataSource.value.filter((item) => item.status === "Not Validated");
  } else if (activeClass.value === "not_approved") {
    return dataSource.value.filter(
      (item) => item.status === "Validated" && item.approval_status === 0
    );
  } else if (activeClass.value === "pending_approval") {
    return dataSource.value.filter(
      (item) =>
        item.approval_status === "Not Approved" && item.status === "Validated"
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

const handlePay = (id) => {
  isModalOpen.value = true;
  countdownTimer();
  recordId.value = id;
  console.log("recordId", recordId.value);
  try {
    const response = axios
      .post(`payment_otp`, {
        payroll_summary_id: id,
        payment_type: "Event",
      })
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
  } catch (error) {
    console.log(error);
  }
};

const handleValidation = (id) => {
  console.log("handleApprove", id);
  console.log(id);
  try {
    const response = axios
      .post(`event_payroll_validation`, {
        payroll_id: id,
      })
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
          setTimeout(function () {
            location.reload();
          }, 3000);
        } else {
          notification.error({
            message: "Error",
            description: "Payroll Validation Failed",
          });
        }
      });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const handleApproval = (id) => {
  console.log("handleApprove", id);
  console.log(id);
  try {
    const response = axios
      .post(`event_payroll_approval`, {
        payroll_id: id,
      })
      .then((responsePromise) => {
        return responsePromise.data;
      })
      .then((data) => {
        console.log(data);
        if (data.success == true) {
          notification.success({
            message: "Success",
            description: "Payroll Approved Successfully",
          });
          setTimeout(function () {
            location.reload();
          }, 3000);
        } else {
          notification.error({
            message: "Error",
            description: "Payroll Approval Failed",
          });
        }
      });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const handleOk = async (id, inputValue) => {
  console.log(recordId.value);
  store.commit("setIsPaying", true);
  try {
    const response = await axios.get(
      `pay_event_clients?event_payroll_summary_id=${recordId.value}&otp=${inputValue}`
    );
    console.log(response);
    if (response.status == 200) {
      store.commit("setIsPaying", true);
      notification.success({
        message: "Success",
        description: "Payment processed successful",
      });
      setTimeout(function () {
        location.reload();
      }, 3000);
      const approve_pay = axios
        .post(`event_payroll_payment`, {
          payroll_id: recordId.value,
        })
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
    store.commit("setIsPaying", true);
    console.log(error);
    notification.error({
      message: "Error",
      description: "Payment failed",
    });
    setTimeout(function () {
      location.reload();
    }, 3000);
  }
  isModalOpen.value = false;
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
        countdownTimer();
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

const handleCancel = () => {
  isModalOpen.value = false;
};
const startCountdown = () => {
  console.log("starting countdown");
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

onMounted(() => {
  axios
    .get(API_URL)
    .then((response) => {
      let payload = response.data.data;
      console.log(payload);

      const filteredItems = [];
      payload.forEach((item) => {
        console.log(item.funding_source);
        if (item.funding_source === 2) {
          filteredItems.push(item);
        }
      });

      pmiEventPayroll.value = filteredItems;
      pmiEventPayroll.value.forEach((item) => {
        item.status = item.status === 1 ? "Validated" : "Not Validated";
        item.payment_status = item.payment_status === 1 ? "Paid" : "Not Paid";
        item.approval_status =
          item.approval_status === 1 ? "Approved" : "Not Approved";
      });
      dataSource.value = pmiEventPayroll.value;
    })
    .catch((error) => {
      console.error(error);
    });
});

watchEffect(async () => {
  const query = searchItem.value.toLowerCase();
  try {
    if (!query) {
      dataSource.value = pmiEventPayroll.value;
      return dataSource.value;
    }
    // return dataSource.value;
    if (query.length > 3) {
      const response = await axios.get(`event_pay_roll_summary?query=${query}`);

      const data = await response.data;
      const events = [];
      data.data.forEach((item) => {
        if (item.funding_source === 2) {
          events.push(item);
        }
      });
      dataSource.value = events;
      dataSource.value.forEach((item) => {
        item.status = item.status === 1 ? "Validated" : "Not Validated";
        item.payment_status = item.payment_status === 1 ? "Paid" : "Not Paid";
        item.approval_status =
          item.approval_status === 1 ? "Approved" : "Not Approved";
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: error.message,
    });
  }
});

const handleVerify = (record) => {
  console.log(record);
};
role_id.value = user.user.role_id;

console.log(role_id.value);

const isValidator = computed(() => {
  return role_id.value === 63 || role_id.value === 53 || role_id.value === 4;
});

const isApprover = computed(() => {
  return role_id.value === 64 || role_id.value === 53 || role_id.value === 59;
});

const isAdminAccountant = computed(() => {
  return role_id.value === 65 || role_id.value === 53 || role_id.value === 1;
});

const isAdmin = computed(() => {
  return role_id.value === 53;
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
