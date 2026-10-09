<template>
  <div>
    <sdPageHeader ghost title="GF Activities Payroll Pending Payment">
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
              <b>Utility Balance: {{ balance }}</b>
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
                            :pagination="false"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton size="extra-small" type="success">
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
                                      <span> Payroll Details</span>
                                    </router-link>
                                  </sdButton>
                                  &nbsp;&nbsp;
                                  <sdButton
                                    type="success"
                                    size="extra-small"
                                    @click="handlePay(record.id)"
                                    >Pay Activity</sdButton
                                  >
                                  &nbsp;&nbsp;
                                  <sdButton
                                    type="primary"
                                    size="extra-small"
                                    :disabled="syncing"
                                    @click="handleSync(record.id)"
                                    >Sync to ERP</sdButton
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
                          <br />
                          <br />
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
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script setup>
import { Main } from "../../../../styled";
import { SearchResultWrapper } from "../../../style";
import { computed, onMounted, ref, watchEffect } from "vue";
import authHeader from "../../../../../services/auth-header";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import store from "../../../../../vuex/store";

const columns = [
  {
    title: "Name",
    dataIndex: "activity_id",
    key: "id",
  },
  {
    title: "Validator",
    dataIndex: "validated_by",
    key: "id",
  },
  {
    title: "Validated Time",
    dataIndex: "validation_date",
    key: "id",
  },
  {
    title: "Approver",
    dataIndex: "approved_by",
    key: "id",
  },
  {
    title: "Approval Time",
    dataIndex: "approval_time",
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
    title: "ERP Sync",
    dataIndex: "sync_status",
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
var currentPage = ref(1);
var pageSize = ref(100);
var datatotal = ref(0);
const { state } = useStore();
const isLoading = ref(true);
const dataSource = ref([]);
const activeClass = ref("all");
const searchItem = ref("");
const recordId = ref(null);
const isModalOpen = ref(false);
const isPaying = computed(() => state.isPaying);
const isDisabled = ref(true);
const countdown = ref(60);
const balance = ref(0);
const syncing = ref(false);

onMounted(() => {
  isLoading.value = true;
  fetchPayrolls();
  fetchBalance();
});

const fetchPayrolls = () => {
  isLoading.value = true;
  const API_URL = `${process.env.VUE_APP_BASE_URL}/all_activity_payrolls?funding_id=1&is_paid=0&page=${currentPage.value}&per_page=${pageSize.value}`;

  axios
    .get(API_URL, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response.data.data);
      datatotal.value = response.data.pagination.total;
      dataSource.value = response.data.data.map((item) => ({
        ...item,
        old_values: item.old_values,
        new_values: item.new_values,
      }));
      dataSource.value.forEach((item) => {
        item.status = item.status === 1 ? "Validated" : "Not Validated";
        item.payment_status = item.payment_status === 1 ? "Paid" : "Not Paid";
        item.approval_status =
          item.approval_status === 1 ? "Approved" : "Not Approved";

        const total = item.total_participants || 0;
        const synced = item.synced_participants || 0;
        const failed = item.failed_sync_participants || 0;
        item.sync_status =
          failed > 0
            ? `${synced}/${total} synced, ${failed} failed`
            : synced > 0
            ? `${synced}/${total} synced`
            : "Not Synced";
      });
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const onPageChange = async (page) => {
  console.log(page);
  currentPage.value = page;
  try {
    fetchPayrolls();
  } catch (error) {
    console.error(error);
  }
};

watchEffect(async () => {
  const API_URL = `${process.env.VUE_APP_BASE_URL}/all_activity_payrolls?funding_id=1&is_paid=0&page=${currentPage.value}&per_page=${pageSize.value}`;
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
  countdownTimer();
  recordId.value = id;

  try {
    fetch(
      `${process.env.VUE_APP_BASE_URL}/payment_otp?payroll_summary_id=${id}&payment_type=Activity`,
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

const handleOk = async (id, inputValue) => {
  store.commit("setIsPaying", true);
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/pay_activity_clients?activity_payroll_summary_id=${recordId.value}&otp=${inputValue}`
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
        .post(`payroll_payment`, {
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
  }
  isModalOpen.value = false;
};

const handleCancel = () => {
  isModalOpen.value = false;
};

// Push an approved activity payroll to the external ERP
const handleSync = async (id) => {
  syncing.value = true;
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_BASE_URL}/activity_payroll_sync`,
      { payroll_id: id },
      { headers: authHeader() }
    );

    if (response.data.success === true) {
      notification.success({
        message: "Success!",
        description: response.data.message,
      });
      setTimeout(() => location.reload(), 2000);
    } else {
      notification.error({
        message: "Sync Failed",
        description: response.data.message,
      });
    }
  } catch (error) {
    notification.error({
      message: "Error!",
      description:
        error?.response?.data?.message || "Failed to sync payroll to the ERP",
    });
  } finally {
    syncing.value = false;
  }
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

// fetch MPESA balance
const fetchBalance = () => {
  const API_URL = `${process.env.VUE_APP_BASE_URL}/float/mpesa/balance`;

  axios
    .get(API_URL, {
      headers: authHeader(),
    })
    .then((response) => {
      console.log(response);
      const formattedBalance = new Intl.NumberFormat().format(response.data.data.utility_balance);
      console.log(formattedBalance); // Outputs: 528,020.51
      balance.value = formattedBalance
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};
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
