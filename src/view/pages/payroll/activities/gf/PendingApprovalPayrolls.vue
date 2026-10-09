<template>
  <div>
    <sdPageHeader ghost title="GF Activities Payrolls Pending Approval ">
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
                            :dataSource="dataSource"
                            :columns="columns"
                            :pagination="false"
                          >
                            <template #syncBadge="{ record }">
                              <span v-if="record.sync_status === 1" class="badge-green"
                                >Synced</span
                              >
                              <span
                                v-else-if="record.sync_status === 2"
                                class="badge-orange"
                                >Partial / Failed</span
                              >
                              <span v-else class="badge-grey">Not Synced</span>
                            </template>
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
                                      <span>Payroll Details</span>
                                    </router-link>
                                  </sdButton>
                                  &nbsp;&nbsp;
                                  <sdButton
                                    type="success"
                                    size="extra-small"
                                    @click="handleApproval(record)"
                                    >Approve</sdButton
                                  >
                                  &nbsp;&nbsp;
                                  <sdButton
                                    size="extra-small"
                                    type="warning"
                                    @click="showVoidModal(record)"
                                  >
                                    <span>Void</span>
                                  </sdButton>
                                </div>
                              </td>

                              <!---void payroll modals-->
                              <a-modal
                                layout="inline"
                                :visible="openVoidModal"
                                title="Confirm Void Payroll"
                                @ok="actionVoidPayroll"
                                @cancel="handleVoidCancel"
                              >
                                <template #footer>
                                  <a-button key="back" @click="handleVoidCancel"
                                    >No, Take me back!</a-button
                                  >
                                  <a-button
                                    key="submit"
                                    style="background: orange; color: aliceblue"
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
                              <!-- end of void payroll modal -->
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
    <PayrollErpSyncModal
      v-model:visible="syncModalVisible"
      :payroll-id="syncPayrollId"
      payroll-type="activity"
      primary-label="Sync & Approve"
      @synced="onSynced"
    />
  </div>
</template>

<script setup>
import { Main } from "../../../../styled";
import { SearchResultWrapper } from "../../../style";
import { onMounted, ref, watch, watchEffect } from "vue";
import authHeader from "../../../../../services/auth-header";
import axios from "axios";
import { notification } from "ant-design-vue";
import PayrollErpSyncModal from "../../../../../components/payroll/PayrollErpSyncModal.vue";

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
    title: "Validation Time",
    dataIndex: "validation_date",
    key: "id",
  },
  {
    title: "Approved",
    dataIndex: "approval_status",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "payment_status",
    key: "id",
  },
  {
    title: "Amount Generated",
    dataIndex: "total_amount",
    key: "id",
  },
  {
    title: "ERP Sync",
    dataIndex: "sync_status",
    key: "syncBadge",
    slots: { customRender: "syncBadge" },
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
const isLoading = ref(true);
const dataSource = ref([]);
const activeClass = ref("all");
const searchItem = ref("");
const voidPayroll = ref(null);
const openVoidModal = ref(false);
const syncModalVisible = ref(false);
const syncPayrollId = ref(null);

onMounted(() => {
  isLoading.value = true;
  fetchPayrolls();
});

const fetchPayrolls = () => {
  isLoading.value = true;
  const API_URL = `${process.env.VUE_APP_BASE_URL}/all_activity_payrolls?funding_id=1&is_approved=0&page=${currentPage.value}&per_page=${pageSize.value}`;
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
      });
      console.log(dataSource.value);
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
  const API_URL = `${process.env.VUE_APP_BASE_URL}/all_activity_payrolls?funding_id=1&is_approved=0&page=${currentPage.value}&per_page=${pageSize.value}`;
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

// Refresh the list (and sync badges) once the sync modal closes.
watch(syncModalVisible, (isVisible) => {
  if (!isVisible) {
    fetchPayrolls();
  }
});

// "Approve" opens the summary + ERP sync modal. The payroll is only approved
// once the ERP sync has completed (sync first, then approve).
const handleApproval = (record) => {
  syncPayrollId.value = record.id;
  syncModalVisible.value = true;
};

const approvePayroll = () => {
  return fetch(
    `${process.env.VUE_APP_BASE_URL}/payroll_approval?payroll_id=${syncPayrollId.value}`,
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
      if (data.success === true) {
        notification.success({
          message: "Success!",
          description: data.message,
        });
      } else {
        notification.error({
          message: "Error!",
          description: data.message,
        });
      }
    })
    .catch((error) => {
      notification.error({ message: "Error!", description: error.message });
    });
};

// The ERP sync has completed — approve the payroll and close the modal.
const onSynced = async () => {
  await approvePayroll();
  syncModalVisible.value = false;
};

const showVoidModal = (record) => {
  console.log(record);
  voidPayroll.value = record;
  openVoidModal.value = true;
};

//void payroll
const actionVoidPayroll = async () => {
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_BASE_URL}/void_activity_payroll_summaries/${voidPayroll.value.id}`,
      null,
      {
        headers: authHeader(),
      }
    );

    openVoidModal.value = false;
    if (response.data.success == true) {
      notification.success({
        message: "Success",
        description: response.data.message,
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      location.reload();
    } else if (response.data.success == false) {
      notification.warning({
        message: "Info",
        description: response.data.message,
      });
    }
  } catch (e) {
    notification.error({
      message: "Error!",
      description: e.toString(),
    });
    console.log(e);
  }
};

const handleVoidCancel = () => {
  openVoidModal.value = false;
};
</script>
<style>
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}
.badge-orange {
  background-color: #faad14;
  color: #fff;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
}
.badge-grey {
  background-color: #bfbfbf;
  color: #fff;
  padding: 2px 8px;
  border-radius: 3px;
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
