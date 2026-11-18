<template>
  <div>
    <sdPageHeader ghost :title="title" />
    <Main>
      <a-alert
        type="info"
        show-icon
        :message="noticeTitle"
        :description="noticeDescription"
        style="margin-bottom: 20px"
      />

      <div v-if="matrixPath && isAdmin" style="margin-bottom: 20px">
        <router-link :to="matrixPath">
          <sdButton type="success">
            <sdFeatherIcons size="small" class="icon-color-white" />
            {{ matrixLabel }}
          </sdButton>
        </router-link>
      </div>

      <a-row :gutter="[16, 16]">
        <a-col
          v-for="card in cards"
          :key="card.path"
          :xs="24"
          :sm="12"
          :lg="6"
        >
          <router-link :to="card.path" class="payroll-card-link">
            <a-card :title="card.title" size="small" class="payroll-card">
              <p>{{ card.description }}</p>
            </a-card>
          </router-link>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Main } from "../../../styled";

// eslint-disable-next-line no-undef -- Vue compiler macro in <script setup>
const props = defineProps({
  title: { type: String, required: true },
  fundingName: { type: String, required: true },
  payrollType: { type: String, default: "event" },
  basePath: { type: String, required: true },
  showPaymentCards: { type: Boolean, default: false },
  pendingPaymentRoles: { type: Array, default: () => [1, 53, 65] },
  showDownloadCard: { type: Boolean, default: false },
  matrixPath: { type: String, default: "" },
  matrixLabel: { type: String, default: "Payroll Matrix" },
  notice: { type: String, default: "" },
  extraCards: { type: Array, default: () => [] },
});

const sessionUser = JSON.parse(sessionStorage.getItem("user") || "null");
const roleId = ref(sessionUser?.user?.role_id ?? null);

const isAdmin = computed(() => Number(roleId.value) === 53);

const canViewPendingPayments = computed(() => {
  if (!props.showPaymentCards) {
    return false;
  }

  return props.pendingPaymentRoles.includes(Number(roleId.value));
});

const payrollLabel = computed(() =>
  props.payrollType === "activity" ? "activity payrolls" : "event payrolls"
);

const noticeTitle = computed(
  () => `${props.fundingName} ${props.payrollType} payroll workflow`
);

const noticeDescription = computed(() => {
  if (props.notice) {
    return props.notice;
  }

  if (props.fundingName === "GOK") {
    return "Validate and approve GOK payrolls here. Approved payrolls are paid from a bank upload and are never synced to the ERP.";
  }

  return `Validate and approve ${payrollLabel.value}. Payment screens remain available from the cards below.`;
});

const cards = computed(() => {
  const items = [
    {
      title: "All Payroll",
      path: `${props.basePath}/all-payrolls`,
      description: `Every ${props.fundingName} ${payrollLabel.value.replace(" payrolls", "")} payroll and its current status.`,
    },
    {
      title: "Payrolls Pending Validation",
      path: `${props.basePath}/payroll-validation`,
      description: "Payrolls waiting to be validated.",
    },
    {
      title: "Payrolls Pending Approval",
      path: `${props.basePath}/payroll-approval`,
      description: "Validated payrolls waiting for approval.",
    },
  ];

  if (props.showDownloadCard) {
    items.push({
      title: "Approved Payrolls",
      path: `${props.basePath}/payroll-downloads`,
      description: "Download the approved bank upload for payment.",
    });
  }

  if (props.showPaymentCards) {
    if (canViewPendingPayments.value) {
      items.push({
        title: "Payrolls Pending Payments",
        path: `${props.basePath}/payroll-pending-payments`,
        description: "Approved payrolls awaiting payment.",
      });
    }

    items.push({
      title: "Payrolls Paid",
      path: `${props.basePath}/payroll-payments`,
      description: "Payrolls that have already been paid.",
    });
  }

  return [...items, ...props.extraCards];
});
</script>

<style scoped>
.payroll-card-link {
  display: block;
  height: 100%;
}

.payroll-card {
  height: 100%;
  border-radius: 8px;
  border-top: 4px solid #1ec997;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.payroll-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

.payroll-card p {
  color: #595959;
  margin-bottom: 0;
}

.icon-color-white {
  color: white;
}
</style>
