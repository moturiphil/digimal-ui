<template>
  <div class="activity-summary-inner">
    <br />
    <div v-for="item in data" :key="item.id">
      <sdHeading class="summary-total" as="h4">
        <span class="activity">{{ item.item }} : </span>
        <span class="amount">{{ item.amount }}</span>
        &nbsp; &nbsp;
        <sdButton type="danger" size="extra-small" @click="removeMatrix(item)">
          Remove matrix
        </sdButton>
      </sdHeading>
      <br />
    </div>
    <br />
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
          @submit.prevent="handleSubmit"
        >
          <p>
            Are you sure you want to remove this matrix from this activity
            participant's payroll?
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
const API_URL = `${process.env.VUE_APP_BASE_URL}/activity_payroll_detail?payroll_list_id=${query.id}`;
const data = ref([]);
const isModalOpen = ref(false);
const payroll_detail_id = ref(null);
const payroll_list_id = ref(null);
const isLoading = ref(false);

axios
  .get(API_URL, {
    headers: authHeader(),
  })
  .then((response) => {
    console.log(response);
    data.value = response.data.data;
    console.log(this.data);
  })
  .catch((error) => {
    console.error(error);
  });

const handleCancel = () => {
  isModalOpen.value = false;
};

const removeMatrix = (record) => {
  console.log(record);
  isModalOpen.value = true;
  payroll_detail_id.value = record.id;
  payroll_list_id.value = record.activity_payrollist_id;
};

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    // Handle your async operation here, e.g., axios request
    console.log("Submitting");

    const requestData = {
      payroll_detail_id: payroll_detail_id.value,
      payroll_list_id: payroll_list_id.value,
    };
    console.log(requestData);

    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/remove_activity_participant_allowance`,
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
    const { success, data } = responseData;

    if (success == true) {
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

    // Close the modal if submission was successful
    isModalOpen.value = false;
  } catch (error) {
    console.error("Submission failed", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
