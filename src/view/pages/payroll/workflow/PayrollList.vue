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

                            <template #paid="{ record }">
                              <a-checkbox
                                :checked="isPaid(record)"
                                :disabled="
                                  isPaid(record) ||
                                  markingPaidId === record.id
                                "
                                @change="showMarkPaidModal(record)"
                              >
                                Paid
                              </a-checkbox>
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

    <!-- Direct approval for funding sources that do not use the ERP. -->
    <a-modal
      v-if="!erpSync"
      :visible="approvalModalVisible"
      :title="`Approve ${fundingName} Payroll`"
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
        :description="
          bankDownload
            ? 'The approved payroll is paid from the bank upload. The approver and validator can download it from the Approved Payrolls page.'
            : 'The payroll is approved directly and paid through its normal payment workflow.'
        "
      />
    </a-modal>

    <!-- GOK payrolls are settled from the bank upload. Ticking the checkbox on
         the Approved Payrolls screen records the payment against the payroll. -->
    <a-modal
      :visible="markPaidModalVisible"
      title="Confirm Payroll Payment"
      :confirm-loading="markingPaid"
      ok-text="Mark as Paid"
      @ok="actionMarkPaid"
      @cancel="markPaidModalVisible = false"
    >
      <p>
        Confirm that payroll
        <b>{{ markPaidPayroll ? markPaidPayroll.name : "" }}</b> has been paid
        from the bank upload?
      </p>
      <a-alert
        type="info"
        show-icon
        message="This records the payment against the approved payroll."
        description="Payment mode: BANK. You will be recorded as the user who marked the payroll as paid."
      />
    </a-modal>

    <!-- GF payrolls are synced to the ERP before they can be approved. -->
    <PayrollErpSyncModal
      v-if="erpSync"
      v-model:visible="syncModalVisible"
      :payroll-id="syncPayrollId"
      :payroll-type="payrollType"
      @synced="onSynced"
      @approve="onApprove"
    />

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
import PayrollErpSyncModal from "../../../../components/payroll/PayrollErpSyncModal.vue";

// eslint-disable-next-line no-undef -- Vue compiler macro in <script setup>
const props = defineProps({
  mode: { type: String, default: "all-payrolls" },
  payrollType: { type: String, default: "event" },
  fundingId: { type: Number, default: 3 },
  fundingName: { type: String, default: "GOK" },
  erpSync: { type: Boolean, default: false },
  bankDownload: { type: Boolean, default: false },
});

const BASE_URL = process.env.VUE_APP_BASE_URL;

const isActivity = computed(() => props.payrollType === "activity");
const typeLabel = computed(() => (isActivity.value ? "Activity" : "Event"));
const nameField = computed(() => (isActivity.value ? "activity_id" : "event_id"));

const config = computed(() => {
  const base = `${props.fundingName} ${typeLabel.value}`;

  if (props.mode === "payroll-validation") {
    return {
      title: `${base} Payrolls Pending Validation`,
      filter: "&is_validated=0",
      notice:
        "Payrolls waiting to be validated. Once validated, they move to the approval queue.",
    };
  }

  if (props.mode === "payroll-approval") {
    return {
      title: `${base} Payrolls Pending Approval`,
      filter: "&is_approved=0",
      notice: props.erpSync
        ? "Approval requires every participant to be synced to the ERP first."
        : "Approval is recorded directly. No ERP sync is started for this funding source.",
    };
  }

  if (props.mode === "payroll-downloads") {
    return {
      title: `Approved ${base} Payrolls`,
      filter: "&is_approved=1",
      notice:
        "Download the approved bank upload. GOK payrolls are never synced to the ERP.",
    };
  }

  return {
    title: `${base} Payrolls`,
    filter: "",
    notice: props.bankDownload
      ? "Approved payrolls are paid from a bank upload. GOK payrolls are never synced to the ERP."
      : "Every payroll and its current validation, approval and payment status.",
  };
});

const isValidationMode = computed(() => props.mode === "payroll-validation");
const isApprovalMode = computed(() => props.mode === "payroll-approval");
const isDownloadsMode = computed(() => props.mode === "payroll-downloads");
const isAllMode = computed(
  () =>
    !["payroll-validation", "payroll-approval", "payroll-downloads"].includes(
      props.mode
    )
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
const syncModalVisible = ref(false);
const syncPayrollId = ref(null);
const voidModalVisible = ref(false);
const voidPayroll = ref(null);
const voiding = ref(false);
const markPaidModalVisible = ref(false);
const markPaidPayroll = ref(null);
const markingPaidId = ref(null);
let searchTimer = null;

const pageTitle = computed(() => config.value.title);
const showWorkflowNotice = computed(() => true);
const workflowNoticeTitle = "Payroll workflow";
const workflowNoticeDescription = computed(() => config.value.notice);
const markingPaid = computed(() => markingPaidId.value !== null);

// A GOK payroll is paid once the bank upload has been settled. The checkbox is
// disabled afterwards so the original payer cannot be overwritten.
const isPaid = (record) => Number(record.payment_status) === 1;

const actionColumn = {
  title: "",
  dataIndex: "",
  fixed: "right",
  width: 300,
  key: "payroll",
  slots: { customRender: "payroll" },
};

const columns = computed(() => {
  const name = {
    title: "Name",
    dataIndex: nameField.value,
    key: nameField.value,
  };
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
  const status = {
    title: props.bankDownload ? "Status" : "Payment",
    dataIndex: "payment_label",
    key: "payment_status",
  };
  const paidBy = {
    title: "Paid By",
    dataIndex: "paid_by",
    key: "paid_by",
  };
  const paid = {
    title: "Paid",
    key: "paid",
    slots: { customRender: "paid" },
  };
  const paymentMode = {
    title: "Payment Mode",
    dataIndex: "payment_mode_label",
    key: "payment_mode",
  };
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
    return [
      name,
      validated,
      validator,
      approved,
      approver,
      approvalTime,
      paidBy,
      paid,
      paymentMode,
      amount,
      actionColumn,
    ];
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
    payment_label: props.bankDownload
      ? Number(item.payment_status) === 1
        ? "Paid"
        : Number(item.approval_status) === 1
        ? "Ready for Bank Upload"
        : "Awaiting Approval"
      : Number(item.payment_status) === 1
      ? "Paid"
      : "Not Paid",
    payment_mode_label: item.payment_mode || "—",
  }));

const listUrl = (query = "") => {
  const listEndpoint = isActivity.value
    ? "all_activity_payrolls"
    : "all_event_payrolls";
  let url = `${BASE_URL}/${listEndpoint}?funding_id=${props.fundingId}&page=${currentPage.value}&per_page=${pageSize.value}${config.value.filter}`;

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
      description: error.message || "Unable to load payrolls.",
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

const detailsLink = (record) => {
  if (isActivity.value) {
    return {
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
        funding_id: props.fundingId,
        funding_source: props.fundingName,
      },
    };
  }

  return {
    path: `/payroll/event-view/${record.id}`,
    query: {
      id: record.id,
      name: record.name,
      duration: record.duration,
      venue: record.venue,
      date: record.start_date,
      validate_status: record.validated_label,
      approval_status: record.approved_label,
      payment_status: record.payment_label,
      event_id: record.id_event,
      funding_id: props.fundingId,
      funding_source: props.fundingName,
    },
  };
};

// On the All Payrolls screen the bank upload is only exposed once the payroll
// has been approved. Non-bank funding sources do not show this action.
const canDownload = (record) =>
  props.bankDownload &&
  (isAllMode.value || isDownloadsMode.value) &&
  Number(record.approval_status) === 1;

const handleValidation = async (record) => {
  try {
    const endpoint = isActivity.value
      ? "payroll_validation"
      : "event_payroll_validation";
    const response = await fetch(
      `${BASE_URL}/${endpoint}?payroll_id=${record.id}`,
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

  if (props.erpSync) {
    syncPayrollId.value = payroll.id;
    syncModalVisible.value = true;
    return;
  }

  approvalModalVisible.value = true;
};

const approvePayroll = async () => {
  const endpoint = isActivity.value
    ? "payroll_approval"
    : "event_payroll_approval";
  const response = await fetch(
    `${BASE_URL}/${endpoint}?payroll_id=${approvalPayroll.value.id}`,
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

const onSynced = (progress) => {
  fetchPayrolls();

  if (progress && progress.all_synced === false) {
    notification.warning({
      message: "Partial sync",
      description:
        "Some records are not synced yet. Sync the remaining records before approving.",
    });
  }
};

const onApprove = async () => {
  await actionApprovePayroll();
  syncModalVisible.value = false;
};

watch(syncModalVisible, (visible) => {
  if (!visible) {
    fetchPayrolls();
  }
});

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
        description: props.erpSync
          ? "The payroll was approved and synced to the ERP."
          : props.bankDownload
          ? "The payroll was approved without an ERP sync. Download the bank upload from the Approved Payrolls page."
          : "The payroll was approved without an ERP sync.",
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
    const endpoint = isActivity.value
      ? "void_activity_payroll_summaries"
      : "void_events_payroll_summaries";
    const { data } = await axios.post(
      `${BASE_URL}/${endpoint}/${voidPayroll.value.id}`,
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

const showMarkPaidModal = (record) => {
  if (isPaid(record)) {
    return;
  }

  markPaidPayroll.value = record;
  markPaidModalVisible.value = true;
};

// Record the GOK bank payment against the approved payroll. The backend sets
// payment_status, paid_by and payment_mode (BANK).
const actionMarkPaid = async () => {
  if (!markPaidPayroll.value) {
    return;
  }

  const payrollId = markPaidPayroll.value.id;
  markingPaidId.value = payrollId;

  try {
    const endpoint = isActivity.value
      ? "activity_payroll_mark_paid"
      : "event_payroll_mark_paid";
    const { data } = await axios.post(
      `${BASE_URL}/${endpoint}`,
      { payroll_id: payrollId },
      { headers: authHeader() }
    );

    if (data.success === true) {
      notification.success({
        message: "Payroll marked as paid",
        description: data.message,
      });
      markPaidModalVisible.value = false;
      fetchPayrolls();
    } else {
      notification.error({
        message: "Unable to mark payroll as paid",
        description: data.message,
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description:
        (error.response && error.response.data && error.response.data.message) ||
        error.message,
    });
  } finally {
    markingPaidId.value = null;
  }
};

const handleDownload = async (record) => {
  if (downloadingIds.value.includes(record.id)) {
    return;
  }

  downloadingIds.value = [...downloadingIds.value, record.id];

  try {
    const downloadEndpoint = isActivity.value
      ? "activity_payroll_list_download"
      : "event_pay_roll_list_download";
    const idParam = isActivity.value
      ? "activity_payroll_id"
      : "event_payroll_id";
    const response = await fetch(
      `${BASE_URL}/${downloadEndpoint}?${idParam}=${record.id}`,
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
      `gok_${props.payrollType}_payroll_${record.id}_bank_upload.txt`
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


