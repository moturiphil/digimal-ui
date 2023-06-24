<template>
  <div class="activity-summary-inner">
    <br />
    <div v-for="item in data" :key="item.id">
      <sdHeading class="summary-total" as="h4">
        <!-- <span class="activity">{{ item.item }} : </span> -->
        <span class="activity">{{ item.item }} : </span>
        <span class="amount">{{ item.amount }}</span>
      </sdHeading>
      <br />
    </div>
    <br />
    <a-form
      :layout="formState.layout"
      :model="formState"
      :onFinish="submitPromo"
    >
      <div class="promo-apply-form">
        <a-form-item name="promoCode" label="Comments">
          <a-input v-model:value="promoCode" placeholder="Comment" />
        </a-form-item>
        <a-form-item>
          <sdButton htmlType="submit" size="default" type="success" outlined>
            Approve
          </sdButton>
          &nbsp;&nbsp;
          <sdButton htmlType="submit" size="default" type="danger" outlined>
            Decline
          </sdButton>
        </a-form-item>
      </div>
    </a-form>
    <sdButton
      v-if="current === 3"
      @click="onSubmit"
      class="btn-proceed"
      type="secondary"
      size="large"
    >
      <a to="#">Place Order</a>
    </sdButton>
  </div>
</template>

<script>
import authHeader from "../../../services/auth-header";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  data() {
    return {
      data: [],
      formState: {
        layout: "vertical",
      },
      promoCode: "",
      current: 1,
    };
  },
  mounted() {
    const { params, query } = useRoute();
    console.log({ params, query });
    const API_URL = `${process.env.VUE_APP_BASE_URL}/activity_payroll_detail?payroll_list_id=${query.id}`;
    axios
      .get(API_URL, {
        headers: authHeader(),
      })
      .then((response) => {
        this.data = response.data.data;
        console.log(this.data);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  methods: {
    submitPromo() {},
    onSubmit() {},
  },
};
</script>
