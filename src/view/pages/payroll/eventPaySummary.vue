<template>
  <div class="activity-summary-inner">
    <div v-for="item in data" :key="item.id" class="summary-item">
      <sdHeading class="summary-total" as="h4">
        <span class="activity">{{ item.item }} : </span>
        <span class="amount">{{ item.amount }}</span>
        &nbsp; &nbsp;
        <sdButton type="danger" size="extra-small" @click="removeMatrix(item)">
          Remove matrix
        </sdButton>
      </sdHeading>
    </div>
    <!-- remove matrix modal -->
    <a-modal
      title="Remove participants matrix"
      :visible="isModalOpen"
      @cancel="handleCancel"
      width="30%"
      footer=""
    >
      <BasicFormWrapper>
        <a-form
          class="add-record-form"
          :style="{ width: '100%' }"
          layout="vertical"
          name="addnew"
          :model="formState"
          @finish="handleSubmit"
        >
          <p>
            Are you sure you want to remove this matrix from this participant's
            payroll?
          </p>
          <div class="record-form-actions text-right">
            <sdButton size="small" htmlType="submit" type="danger">
              {{ isLoading ? "Loading..." : "Remove" }}
            </sdButton>
          </div>
        </a-form>
      </BasicFormWrapper>
    </a-modal>
    <!-- end of remove matrix modal -->
  </div>
</template>

<script setup>
import authHeader from "../../../services/auth-header";
import { useRoute } from "vue-router";
import axios from "axios";
import { ref } from "vue";
import { notification } from "ant-design-vue";

const { query } = useRoute();
const API_URL = `${process.env.VUE_APP_BASE_URL}/event_pay_roll_details?event_payrollist_id=${query.id}`;
const data = ref([]);
const isModalOpen = ref(false);
const payroll_detail_id = ref(null);
const payroll_list_id = ref(null);
const isLoading = ref(false);
const formState = ref({}); // Assuming you might have some form state

axios
  .get(API_URL, {
    headers: authHeader(),
  })
  .then((response) => {
    data.value = response.data.data;
    console.log(data.value);
  })
  .catch((error) => {
    console.error(error);
  });

const removeMatrix = (record) => {
  isModalOpen.value = true;
  payroll_detail_id.value = record.id;
  payroll_list_id.value = record.event_payrollist_id;
};

const handleCancel = () => {
  isModalOpen.value = false;
};

const handleSubmit = async () => {
  console.log('submitting');
  isLoading.value = true;
  try {
    const requestData = {
      payroll_detail_id: payroll_detail_id.value,
      payroll_list_id: payroll_list_id.value,
    };
    console.log(requestData);

    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/remove_event_participant_allowance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(requestData),
      }
    );

    const responseData = await response.json();
    const { status, data } = responseData;

    if (status) {
      notification.success({
        message: "Success",
        description: data,
      });
      isModalOpen.value = false;
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      notification.error({
        message: "Error",
        description: `${data}`,
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error.message}`,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.activity-summary-outer {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px; /* Added padding for spacing */
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;
}
.summary-item {
  margin-bottom: 10px; /* Added margin for spacing between items */
}

.summary-total {
  font-size: 1.2em;
  color: #333;
}

.activity {
  font-weight: bold;
}

.amount {
  color: #fa8b0b;
}

.promo-form {
  margin-top: 20px; /* Added margin for spacing above the form */
}

.btn-proceed {
  margin-top: 20px;
}

.btn-proceed a {
  color: #fff;
  text-decoration: none;
}
</style>
