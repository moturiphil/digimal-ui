<template>
  <Main>
    <SearchResultWrapper>
      <sdPageHeader ghost title="Global Fund Activity Payroll">
        <template #buttons> </template>
      </sdPageHeader>
    </SearchResultWrapper>
    <div>
      <router-link v-bind:to="'event-payroll-matrix'">
        <sdButton type="success" v-if="isAdmin">
          Activity Payroll Matrix
        </sdButton>
      </router-link>
    </div>
    <br />
    <br />
    <div style="background-color: #ececec; padding: 20px">
      <a-row :gutter="16">
        <a-col :span="6">
          <a href="/gf/activities/all-payrolls">
            <a-card
              title="All Payroll"
              style="width: 300px"
              class="card-button spaced-card"
            >
              <p>All Digimal Payroll</p>
            </a-card>
          </a>
        </a-col>
        <a-col :span="6">
          <a href="gf/activities/payroll-validation">
            <a-card
              title="Payrolls Pending Validation"
              style="width: 300px"
              class="card-button spaced-card"
            >
              <p>Digimal Payrolls Pending Validations</p>
            </a-card>
          </a>
        </a-col>
        <a-col :span="6">
          <a href="gf/activities/payroll-approval">
            <a-card
              title="Payrolls Pending Approval"
              style="width: 300px"
              class="card-button spaced-card"
            >
              <p>Digimal Payroll Pending Approval</p>
            </a-card>
          </a>
        </a-col>
        <a-col :span="6" v-if="isAIEHolder">
          <a href="gf/activities/payroll-pending-payments">
            <a-card
              title="Payrolls Pending Payments"
              style="width: 300px"
              class="card-button spaced-card"
            >
              <p>Digimal Payroll Pending Payments</p>
            </a-card>
          </a>
        </a-col>
        <a-col :span="6">
          <a href="/gf/activities/payroll-payments">
            <a-card
              title="Payrolls Paid"
              style="width: 300px"
              class="card-button spaced-card"
            >
              <p>Digimal Paid Payrolls</p>
            </a-card>
          </a>
        </a-col>
      </a-row>
    </div>
  </Main>
</template>

<script setup>
import { Main } from "../../../../styled";
import { SearchResultWrapper } from "../../../style";
import { ref, computed } from "vue";

const role_id = ref("");
const user = JSON.parse(sessionStorage.getItem("user"));

role_id.value = user.user.role_id;

const isAIEHolder = computed(() => {
  return role_id.value === 1 || role_id.value === 53;
});

const isAdmin = computed(() => {
  return role_id.value === 53;
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

.spaced-card {
  margin-bottom: 24px; /* Adjust as needed */
}
</style>
