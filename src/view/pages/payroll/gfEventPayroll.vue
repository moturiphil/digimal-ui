<template>
  <Main>
    <SearchResultWrapper>
      <sdPageHeader ghost title="Global Fund Event Payroll">
        <template #buttons> </template>
      </sdPageHeader>
    </SearchResultWrapper>
    <div style="background-color: #ececec; padding: 20px">
      <a-row :gutter="16">
        <a-col :span="6">
          <a href="/gf/events/all-payrolls">
            <a-card
              title="All Payroll"
              style="width: 300px"
              class="card-button"
            >
              <p>All Digimal payroll</p>
            </a-card>
          </a>
        </a-col>
        <a-col :span="6">
          <a href="gf/events/payroll-validation">
            <a-card
              title="Payrolls pending Validation"
              style="width: 300px"
              class="card-button"
            >
              <p>Digimal payroll pending validations</p>
            </a-card>
          </a>
        </a-col>
        <a-col :span="6">
          <a href="gf/events/payroll-approval">
            <a-card
              title="Payrolls pending Approval"
              style="width: 300px"
              class="card-button"
            >
              <p>Digimal payroll pending approval</p>
            </a-card>
          </a>
        </a-col>
        <a-col :span="6">
          <a href="gf/events/payroll-pending-payments">
            <a-card
              title="Payrolls pending Payments"
              style="width: 300px"
              class="card-button"
            >
              <p>Digimal payroll pending payments</p>
            </a-card>
          </a>
        </a-col>
      </a-row>
      <br />
      <br />
      <a-row :gutter="16">
        <a-col :span="6">
          <a href="/gf/events/payroll-payments">
            <a-card
              title="Payrolls Paid"
              style="width: 300px"
              class="card-button"
            >
              <p>Digimal paid payrolls</p>
            </a-card>
          </a>
        </a-col>
      </a-row>
    </div>
  </Main>
</template>

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import { ref, watchEffect } from "vue";
import axios from "@/Axiosconfig";
import { notification } from "ant-design-vue";

const dataSource = ref([]);
const searchItem = ref("");
const eventspayroll = ref([]);

watchEffect(async () => {
  const query = searchItem.value.toLowerCase();
  try {
    if (!query) {
      dataSource.value = eventspayroll.value;
      return dataSource.value;
    }
    if (query.length > 3) {
      const response = await axios.get(`event_pay_roll_summary?query=${query}`);

      const data = await response.data;
      const events = [];
      data.data.forEach((item) => {
        if (item.funding_source === 1) {
          events.push(item);
        }
      });
      dataSource.value = events;
      console.log(dataSource.value);
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
</script>
<style scoped>
.badge-green {
  background-color: #1ec997;
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
.card-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
  background-color: #1ec997;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.card-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
