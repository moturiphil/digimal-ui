<template>
  <div>
    <sdPageHeader ghost title="Global Fund Activity Payroll">
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
            placeholder="Search by Activity Code..."
          />
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <router-link v-bind:to="'activity-payroll-matrix'">
        <sdButton type="success">
          <sdFeatherIcons size="extra-small" class="icon-color-white" />
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
                                </div>
                                <!---modals-->
                                <a-modal
                                  layout="inline"
                                  :visible="openVoidModal"
                                  title="Confirm Void Payroll"
                                  @ok="actionVoidPayroll"
                                  @cancel="handleVoidCancel"
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
                                      :loading="loading"
                                      @click="actionVoidPayroll"
                                      >Yes, Void it!</a-button
                                    >
                                  </template>
                                  <h4>
                                    Are you sure you want to void Payroll,Amount
                                    <b>KShs.{{ voidPayroll.total_amount }}</b>
                                  </h4>
                                </a-modal>
                              </td>
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  <sdButton
                                    size="extra-small"
                                    type="success"
                                    @click="handleVerify(record.id)"
                                  >
                                    &nbsp;&nbsp;
                                    <router-link
                                      :to="{
                                        path: `/payroll/view/${record.id}`,
                                        query: {
                                          id: record.id,
                                          activity: record.activity_id,
                                          county: record.county,
                                          sub_county: record.sub_county,
                                          no_of_days: record.no_of_days,
                                          start_date: record.start_date,
                                          status: record.status,
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
                                  <a-modal
                                    title="Payment OTP"
                                    :visible="isModalOpen"
                                    @ok="handleOk(recordId, inputValue)"
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
                              <tr>
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
                                          path: `/payroll/view/${record.id}`,
                                          query: {
                                            id: record.id,
                                            activity: record.activity_id,
                                            county: record.county,
                                            sub_county: record.sub_county,
                                            no_of_days: record.no_of_days,
                                            start_date: record.start_date,
                                            status: record.status,
                                            approval_status:
                                              record.approval_status,
                                            payment_status:
                                              record.payment_status,
                                          },
                                        }"
                                        class="btn-icon"
                                        type="info"
                                        shape="circle"
                                      >
                                        &nbsp;&nbsp;
                                        <span
                                          >&nbsp;&nbsp; Payroll Details</span
                                        >
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
                              </tr>
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
                              <tr>
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
                                          path: `/payroll/view/${record.id}`,
                                          query: {
                                            id: record.id,
                                            activity: record.activity_id,
                                            county: record.county,
                                            sub_county: record.sub_county,
                                            no_of_days: record.no_of_days,
                                            start_date: record.start_date,
                                            status: record.status,
                                            approval_status:
                                              record.approval_status,
                                            payment_status:
                                              record.payment_status,
                                          },
                                        }"
                                        class="btn-icon"
                                        type="info"
                                        shape="circle"
                                      >
                                        &nbsp;&nbsp;
                                        <span
                                          >&nbsp;&nbsp; Payroll Details</span
                                        >
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
                              </tr>
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
                              <tr>
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
                                          path: `/payroll/view/${record.id}`,
                                          query: {
                                            id: record.id,
                                            activity: record.activity_id,
                                            county: record.county,
                                            sub_county: record.sub_county,
                                            no_of_days: record.no_of_days,
                                            start_date: record.start_date,
                                            status: record.status,
                                            approval_status:
                                              record.approval_status,
                                            payment_status:
                                              record.payment_status,
                                          },
                                        }"
                                        class="btn-icon"
                                        type="info"
                                        shape="circle"
                                      >
                                        &nbsp;&nbsp;
                                        <span
                                          >&nbsp;&nbsp; Payroll Details</span
                                        >
                                      </router-link>
                                    </sdButton>
                                    &nbsp;&nbsp;
                                    <sdButton
                                      type="success"
                                      size="small"
                                      @click="handlePay(record.id)"
                                      >Pay Activity</sdButton
                                    >
                                  </div>
                                </td>
                              </tr>
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

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import {
  computed,
  ref,
  //reactive,
  watchEffect,
} from "vue";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import { DeleteRowOutlined } from "@ant-design/icons-vue";
import store from "../../../vuex/store";
import authHeader from "../../../services/auth-header";

const { state } = useStore();
const isLoading = ref(true);
const dataSource = ref([]);
const activeClass = ref("all");
const recordId = ref(null);
const searchItem = ref("");
const activitypayroll = ref([]);
const openVoidModal = ref(false);
const voidPayroll = ref(null);
const isDisabled = ref(true);
const countdown = ref(60);
const showGeneratedByColumn = ref(false);

const showVoidModal = (record) => {
  voidPayroll.value = record;
  openVoidModal.value = true;
};
const handleVoidCancel = () => {
  openVoidModal.value = false;
};
const isPaying = computed(() => state.isPaying);
const actionVoidPayroll = async () => {
  await axios
    .get(`void_activity_payroll_summaries/${voidPayroll.value.id}`)
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

const columns = computed(() => {
  return [
    {
      title: "Activity",
      dataIndex: "activity_id",
      key: "activity_id",
    },
    showGeneratedByColumn.value && {
      title: "Generated By",
      dataIndex: "generated_by",
      key: "generated_by",
    },
    {
      title: "Validated",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Validator",
      dataIndex: "validated_by",
      key: "validated_by",
    },
    {
      title: "Approved",
      dataIndex: "approval_status",
      key: "approval_status",
    },
    {
      title: "Approver",
      dataIndex: "approved_by",
      key: "approved_by",
    },
    {
      title: "Paid",
      dataIndex: "payment_status",
      key: "payment_status",
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      key: "total_amount",
    },
    {
      title: "",
      dataIndex: "",
      fixed: "right",
      width: 20,
      key: "payroll",
      slots: { customRender: "payroll" },
    },
  ].filter(Boolean);
});

const API_URL = `activity_payroll_summary`;
const filter = (data) => {
  switch (activeClass.value) {
    case "all":
      return data;

    case "not_validated":
      return data.filter((item) => item.status === "Not Validated");

    case "not_approved":
      return data.filter(
        (item) => item.status === "Validated" && item.approval_status === 0
      );

    case "pending_approval":
      return data.filter(
        (item) =>
          item.approval_status === "Not Approved" && item.status === "Validated"
      );

    case "pending_payment":
      return data.filter(
        (item) =>
          item.approval_status === "Approved" &&
          item.payment_status === "Not Paid"
      );

    case "paid":
      return data.filter(
        (item) =>
          item.payment_status === "Paid" &&
          item.approval_status === "Approved" &&
          item.status === "Validated"
      );

    default:
      return data;
  }
};

const filteredData = computed(() => {
  return filter(dataSource.value);
});

const handleChange = (tab) => {
  activeClass.value = tab;
};

const isModalOpen = ref(false);
const inputValue = ref("");

const handlePay = (id) => {
  isModalOpen.value = true;
  countdownTimer();
  recordId.value = id;
  try {
    axios
      .post(`payment_otp`, {
        payroll_summary_id: id,
        payment_type: "Activity",
      })
      .then((responsePromise) => {
        return responsePromise.data;
      })
      .then((data) => {
        console.log(data);
        if (data.success == true) {
          notification.success({
            message: "Success",
            description: data.message,
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

const handleValidation = (id) => {
  try {
    axios
      .post(`payroll_validation`, {
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
            description: data.message,
          });
        } else {
          notification.error({
            message: "Error",
            description: data.message,
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

const handleApproval = (id) => {
  try {
    axios
      .post(`payroll_approval`, {
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
            description: data.message,
          });
        } else {
          notification.error({
            message: "Error",
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
      `pay_activity_clients?activity_payroll_summary_id=${recordId.value}&otp=${inputValue}`
    );
    console.log(response);
    if (response.status == 200) {
      store.commit("setIsPaying", true);
      notification.success({
        message: "Success",
        description: "Payment processed successful",
      });
    }
    axios
      .post(`payroll_payment`, {
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
            description: data.message,
          });
        }
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Payment failed",
    });
  }
  isModalOpen.value = false;
};

const countdownTimer = () => {
  isDisabled.value = true;
  countdown.value = 60;
  startCountdown();
};

const startCountdown = () => {
  let timerId;
  countdown.value = 60;
  isDisabled.value = true;

  const updateCountdown = () => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timerId);
      isDisabled.value = false;
    }
  };

  timerId = setInterval(updateCountdown, 1000);

  updateCountdown();
};

const getActivityPayroll = () => {
  isLoading.value = true;
  axios
    .get(API_URL)
    .then((response) => {
      let payload = response.data.data;
      console.log(payload);

      const filteredItems = [];
      payload.forEach((item) => {
        console.log(item.funding_source);
        if (item.funding_source === 1) {
          filteredItems.push(item);
        }
      });

      activitypayroll.value = filteredItems;
      // transform approval status to boolean
      activitypayroll.value.forEach((item) => {
        item.status = item.status === 1 ? "Validated" : "Not Validated";
        item.payment_status = item.payment_status === 1 ? "Paid" : "Not Paid";
        item.approval_status =
          item.approval_status === 1 ? "Approved" : "Not Approved";
        if (item.status === "Not Validated") {
          showGeneratedByColumn.value = true;
        }
      });
      dataSource.value = activitypayroll.value;
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

getActivityPayroll();

const resendOTP = () => {
  try {
    fetch(
      `${process.env.VUE_APP_BASE_URL}/payment_otp?payroll_summary_id=${recordId.value}&payment_type=Activity`,
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

watchEffect(async () => {
  const querysearch = searchItem.value.toLowerCase();
  try {
    if (!querysearch) {
      dataSource.value = activitypayroll.value;
      return dataSource.value;
    }
    if (querysearch.length > 3) {
      const response = await axios.get(
        `activity_payroll_summary?query=${querysearch}`
      );
      const data = await response.data;
      console.log(data);
      const filteredItems = [];
      data.data.forEach((item) => {
        if (item.funding_source === 1) {
          filteredItems.push(item);
        }
      });

      dataSource.value = filteredItems;
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

// const level_id = ref("");
const role_id = ref("");
// const admin_role_id = ref("");

const user = JSON.parse(sessionStorage.getItem("user"));

role_id.value = user.user.role_id;

const isValidator = computed(() => {
  return role_id.value === 63 || role_id.value === 53 || role_id.value === 4;
});

const isApprover = computed(() => {
  return role_id.value === 64 || role_id.value === 53 || role_id.value === 59;
});

const isAdminAccountant = computed(() => {
  return role_id.value === 65 || role_id.value === 53 || role_id.value === 1;
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
.title-success {
  color: green;
}
</style>
<style scoped>
.icon-color-white {
  color: white;
}
</style>
