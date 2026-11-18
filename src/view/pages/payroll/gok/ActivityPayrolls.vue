<template>
  <div>
    <sdPageHeader ghost :title="pageTitle">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by payroll details..."
          />
        </div>
      </template>
    </sdPageHeader>

    <Main>
      <a-alert
        v-if="showWorkflowNotice"
        type="info"
        show-icon
        :message="workflowNoticeTitle"
        :description="workflowNoticeDescription"
        style="margin-bottom: 16px"
      />

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
                            :pagination="false"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton size="extra-small" type="success">
                                    <router-link
                                      :to="detailsLink(record)"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                    >
                                      Payroll Details
                                    </router-link>
                                  </sdButton>

                                  <template v-if="isValidationMode">
                                    &nbsp;&nbsp;
                                    <sdButton
                                      type="success"
                                      size="extra-small"
                                      @click="handleValidation(record)"
                                      >Validate</sdButton
                                    >
                                  </template>

                                  <template v-if="isApprovalMode">
                                    &nbsp;&nbsp;
                                    <sdButton
                                      type="success"
                                      size="extra-small"
                                      @click="showApprovalModal(record)"
                                      >Approve</sdButton
                                    >
                                  </template>

                                  <template v-if="canDownload(record)">
                                    &nbsp;&nbsp;
                                    <sdButton
                                      type="primary"
                                      size="extra-small"
                                      :disabled="downloadingIds.includes(record.id)"
                                      @click="handleDownload(record)"
                                    >
                                      {{
                                        downloadingIds.includes(record.id)
                                          ? "Downloading..."
                                          : "Download Bank Upload"
                                      }}
                                    </sdButton>
                                  </template>

                                  <template
                                    v-if="isValidationMode || isApprovalMode"
                                  >
                                    &nbsp;&nbsp;
                                    <sdButton
                                      size="extra-small"
                                      type="warning"
                                      @click="showVoidModal(record)"
                                    >
                                      <span>Void</span>
                                    </sdButton>
                                  </template>
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

    <!-- Approval is direct for GOK: no ERP sync modal. -->
    <a-modal
      :visible="approvalModalVisible"
      title="Approve GOK Payroll"
      :confirm-loading="approving"
      ok-text="Approve Payroll"
      @ok="actionApprovePayroll"
      @cancel="approvalModalVisible = false"
    >
      <p>
        Approve payroll
        <b>{{ approvalPayroll ? approvalPayroll.name : "" }}</b>?
      </p>
      <a-alert
        type="warning"
        show-icon
        message="No ERP sync will be performed."
        description="The approved payroll is paid from the bank upload. The approver and validator can download it from the Approved Payrolls page."
      />
    </a-modal>

    <!-- Void confirmation, matching the GF workflow. -->
    <a-modal
      :visible="voidModalVisible"
      title="Confirm Void Payroll"
      :confirm-loading="voiding"
      @ok="actionVoidPayroll"
      @cancel="voidModalVisible = false"
    >
      <template #footer>
        <a-button key="back" @click="voidModalVisible = false"
          >No, Take me back!</a-button
        >
        <a-button
          key="submit"
          style="background: orange; color: aliceblue"
          :loading="voiding"
          @click="actionVoidPayroll"
          >Yes, Void it!</a-button
        >
      </template>
      <h4>
        Are you sure you want to void Payroll, Amount
        <b>KShs.{{ voidPayroll ? voidPayroll.total_amount : 0 }}</b>
      </h4>
    </a-modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import { notification } from "ant-design-vue";
import authHeader from "../../../../services/auth-header";
import { Main } from "../../../styled";
import { SearchResultWrapper } from "../../style";

// eslint-disable-next-line no-undef -- Vue compiler macro in <script setup>
const props = defineProps({
  mode: { type: String, default: "all-payrolls" },
});

const BASE_URL = process.env.VUE_APP_BASE_URL;
const FUNDING_ID = 3;
const GOK_DOWNLOAD_URL = `${BASE_URL}/activity_payroll_list_download`;

const MODE_CONFIG = {
  "all-payrolls": {
    title: "GOK Activity Payrolls",
    filter: "",
    description: "Every GOK activity payroll and its current status.",
    notice:
      "Approved GOK payrolls are paid from a bank upload. The approved bank upload is available from the actions column, and GOK payrolls are never synced to the ERP.",
  },
  "payroll-validation": {
    title: "GOK Activity Payrolls Pending Validation",
    filter: "&is_validated=0",
    description: "GOK activity payrolls waiting to be validated.",
    notice:
      "Validation follows the same GF workflow. Once validated, the payroll moves to the approval queue.",
  },
  "payroll-approval": {
    title: "GOK Activity Payrolls Pending Approval",
    filter: "&is_approved=0",
    description: "Validated GOK activity payrolls waiting for approval.",
    notice:
      "Approval is recorded directly. No ERP sync is started for GOK payrolls.",
  },
  "payroll-downloads": {
    title: "Approved GOK Activity Payrolls",
    filter: "&is_approved=1",
    description: "Approved GOK activity payrolls ready for bank upload.",
    notice:
      "The approver and validator can download the approved bank upload for payment.",
  },
};

const config = computed(
  () => MODE_CONFIG[props.mode] || MODE_CONFIG["all-payrolls"]
);
const isValidationMode = computed(() => props.mode === "payroll-validation");
const isApprovalMode = computed(() => props.mode === "payroll-approval");
const isDownloadsMode = computed(() => props.mode === "payroll-downloads");
const isAllMode = computed(
  () => !MODE_CONFIG[props.mode] || props.mode === "all-payrolls"
);

const isLoading = ref(true);
const dataSource = ref([]);
const currentPage = ref(1);
const pageSize = ref(100);
const datatotal = ref(0);
const activeClass = ref("all");
const searchItem = ref("");
const downloadingIds = ref([]);
const approvalModalVisible = ref(false);
const approvalPayroll = ref(null);
const approving = ref(false);
const voidModalVisible = ref(false);
const voidPayroll = ref(null);
const voiding = ref(false);
let searchTimer = null;

const pageTitle = computed(() => config.value.title);
const showWorkflowNotice = computed(() => true);
const workflowNoticeTitle = "GOK payrolls are paid by bank upload";
const workflowNoticeDescription = computed(() => config.value.notice);

const actionColumn = {
  title: "",
  dataIndex: "",
  fixed: "right",
  width: 300,
  key: "payroll",
  slots: { customRender: "payroll" },
};

const columns = computed(() => {
  const name = { title: "Name", dataIndex: "activity_id", key: "activity_id" };
  const generatedBy = {
    title: "Generated By",
    dataIndex: "generated_by",
    key: "generated_by",
  };
  const validated = { title: "Validated", dataIndex: "validated_label", key: "validated" };
  const validator = { title: "Validator", dataIndex: "validated_by", key: "validator" };
  const validationTime = {
    title: "Validation Time",
    dataIndex: "validation_date",
    key: "validation_date",
  };
  const approved = { title: "Approved", dataIndex: "approved_label", key: "approved" };
  const approver = { title: "Approver", dataIndex: "approved_by", key: "approver" };
  const approvalTime = {
    title: "Approval Time",
    dataIndex: "approval_time",
    key: "approval_time",
  };
  const status = { title: "Status", dataIndex: "payment_label", key: "payment_status" };
  const amount = {
    title: "Amount Generated",
    dataIndex: "total_amount",
    key: "total_amount",
  };

  if (isValidationMode.value) {
    return [name, generatedBy, validated, approved, status, amount, actionColumn];
  }

  if (isApprovalMode.value) {
    return [name, validator, validationTime, approved, status, amount, actionColumn];
  }

  if (isDownloadsMode.value) {
    return [name, validated, validator, approved, approver, approvalTime, amount, actionColumn];
  }

  return [name, generatedBy, validated, validator, approved, approver, amount, actionColumn];
});
const normalise = (items) =>
  (items || []).map((item) => ({
    ...item,
    old_values: item.old_values,
    new_values: item.new_values,
    validated_label: Number(item.status) === 1 ? "Validated" : "Not Validated",
    approved_label:
      Number(item.approval_status) === 1 ? "Approved" : "Not Approved",
    payment_label:
      Number(item.approval_status) === 1
        ? "Ready for Bank Upload"
        : "Awaiting Approval",
  }));

const listUrl = (query = "") => {
  let url = `${BASE_URL}/all_activity_payrolls?funding_id=${FUNDING_ID}&page=${currentPage.value}&per_page=${pageSize.value}${config.value.filter}`;

  if (query) {
    url += `&query=${encodeURIComponent(query)}`;
  }

  return url;
};

const fetchPayrolls = async (query = "") => {
  isLoading.value = true;

  try {
    const response = await axios.get(listUrl(query), {
      headers: authHeader(),
    });
    const items = Array.isArray(response.data.data) ? response.data.data : [];

    dataSource.value = normalise(items);
    datatotal.value = response.data.pagination
      ? response.data.pagination.total
      : items.length;
  } catch (error) {
    dataSource.value = [];
    datatotal.value = 0;
    notification.error({
      message: "Error",
      description: error.message || "Unable to load GOK payrolls.",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPayrolls();
});

watch(
  () => props.mode,
  () => {
    currentPage.value = 1;
    searchItem.value = "";
    fetchPayrolls();
  }
);

watch(searchItem, (value) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const query = value.trim().toLowerCase();
    fetchPayrolls(query.length > 3 ? query : "");
  }, 350);
});

const onPageChange = (page) => {
  currentPage.value = page;
  const query = searchItem.value.trim().toLowerCase();
  fetchPayrolls(query.length > 3 ? query : "");
};

const detailsLink = (record) => ({
  path: `/payroll/view/${record.id}`,
  query: {
    id: record.id,
    activity: record.activity_id,
    county: record.county,
    sub_county: record.sub_county,
    no_of_days: record.no_of_days,
    start_date: record.start_date,
    validate_status: record.validated_label,
    approval_status: record.approved_label,
    payment_status: record.payment_label,
    funding_id: FUNDING_ID,
    funding_source: "GOK",
  },
});

// On the All Payrolls screen the bank upload is only exposed once the payroll
// has been approved. The Approved Payrolls screen shows the same approved set.
const canDownload = (record) =>
  (isAllMode.value || isDownloadsMode.value) &&
  Number(record.approval_status) === 1;

const handleValidation = async (record) => {
  try {
    const response = await fetch(
      `${BASE_URL}/payroll_validation?payroll_id=${record.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    );
    const data = await response.json();

    if (data.success === true) {
      notification.success({
        message: "Success",
        description: data.message,
      });
      fetchPayrolls();
    } else {
      notification.error({
        message: "Validation failed",
        description: data.message,
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: error.message,
    });
  }
};

const showApprovalModal = (payroll) => {
  approvalPayroll.value = payroll;
  approvalModalVisible.value = true;
};

const approvePayroll = async () => {
  const response = await fetch(
    `${process.env.VUE_APP_BASE_URL}/payroll_approval?payroll_id=${approvalPayroll.value.id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    }
  );

  return response.json();
};

const actionApprovePayroll = async () => {
  if (!approvalPayroll.value) {
    return;
  }

  approving.value = true;

  try {
    const data = await approvePayroll();

    if (data.success === true) {
      notification.success({
        message: "Payroll approved",
        description:
          "The payroll was approved without an ERP sync. Download the bank upload from the Approved Payrolls page.",
      });
      approvalModalVisible.value = false;
      fetchPayrolls();
    } else {
      notification.error({
        message: "Approval failed",
        description: data.message,
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: error.message,
    });
  } finally {
    approving.value = false;
  }
};

const showVoidModal = (payroll) => {
  voidPayroll.value = payroll;
  voidModalVisible.value = true;
};

const actionVoidPayroll = async () => {
  if (!voidPayroll.value) {
    return;
  }

  voiding.value = true;

  try {
    const { data } = await axios.post(
      `${BASE_URL}/void_activity_payroll_summaries/${voidPayroll.value.id}`,
      null,
      { headers: authHeader() }
    );

    if (data.success) {
      notification.success({
        message: "Payroll voided",
        description: data.message,
      });
      voidModalVisible.value = false;
      fetchPayrolls();
    } else {
      notification.warning({
        message: "Unable to void payroll",
        description: data.message,
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: error.message,
    });
  } finally {
    voiding.value = false;
  }
};

const handleDownload = async (record) => {
  if (downloadingIds.value.includes(record.id)) {
    return;
  }

  downloadingIds.value = [...downloadingIds.value, record.id];

  try {
    const response = await fetch(
      `${GOK_DOWNLOAD_URL}?activity_payroll_id=${record.id}`,
      { headers: authHeader() }
    );

    if (!response.ok) {
      let message = "Unable to download the approved bank upload.";

      try {
        const payload = await response.json();
        if (payload.message) {
          message = payload.message;
        }
      } catch (parseError) {
        // The server returned a non-JSON error; keep the generic message.
      }

      throw new Error(message);
    }

    const fileBlob = await response.blob();
    const fileUrl = window.URL.createObjectURL(fileBlob);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.setAttribute(
      "download",
      `gok_activity_payroll_${record.id}_bank_upload.txt`
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(fileUrl);

    notification.success({
      message: "Download ready",
      description: "The approved GOK bank upload has been downloaded.",
    });
  } catch (error) {
    notification.error({
      message: "Download failed",
      description: error.message,
    });
  } finally {
    downloadingIds.value = downloadingIds.value.filter(
      (id) => id !== record.id
    );
  }
};
</script>

<style scoped>
.table-actions {
  white-space: nowrap;
}
</style>


