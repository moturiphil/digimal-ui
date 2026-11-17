<template>
  <div>
    <sdPageHeader ghost title="GOK Event Payroll" />
    <Main>
      <a-alert
        type="info"
        show-icon
        message="GOK payrolls follow the GF validation and approval workflow."
        description="Once approved they are NOT synced to the ERP. The approver and validator can download the approved bank upload from All Payroll or from Approved Payrolls."
        style="margin-bottom: 20px"
      />

      <a-row :gutter="[16, 16]">
        <a-col
          v-for="card in cards"
          :key="card.path"
          :xs="24"
          :sm="12"
          :lg="6"
        >
          <router-link :to="card.path" class="gok-payroll-card-link">
            <a-card :title="card.title" size="small" class="gok-payroll-card">
              <p>{{ card.description }}</p>
            </a-card>
          </router-link>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script setup>
import { Main } from "../../../styled";

const cards = [
  {
    title: "All Payroll",
    path: "/gok/events/all-payrolls",
    description: "Every GOK event payroll and its current status.",
  },
  {
    title: "Payrolls Pending Validation",
    path: "/gok/events/payroll-validation",
    description: "GOK payrolls waiting to be validated.",
  },
  {
    title: "Payrolls Pending Approval",
    path: "/gok/events/payroll-approval",
    description: "Validated GOK payrolls waiting for approval.",
  },
  {
    title: "Approved Payrolls",
    path: "/gok/events/payroll-downloads",
    description: "Download the approved payroll bank upload.",
  },
];
</script>

<style scoped>
.gok-payroll-card-link {
  display: block;
  height: 100%;
}

.gok-payroll-card {
  height: 100%;
  border-radius: 8px;
  border-top: 4px solid #1ec997;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.gok-payroll-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

.gok-payroll-card p {
  color: #595959;
  margin-bottom: 0;
}
</style>
