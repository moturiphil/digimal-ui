<template>
  <div class="activity-summary-inner">
    <br />
    <sdHeading class="summary-total" as="h4">
      <span class="activity">Activity : </span>
      <span class="amount">{{ activity }}</span>
    </sdHeading>
    <br />
    <sdHeading class="summary-total" as="h4">
      <span class="activity">Perdiem : </span>
      <span class="amount">{{ perdiem }}</span>
    </sdHeading>
    <br />
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
import axios from "axios";
import authHeader from "../../../services/auth-header";

export default {
  name: "ActivitySummary",
  data() {
    return {
      data: [],
      activity: "",
      perdiem: 0,
      promoCode: "",
      formState: {
        layout: "horizontal",
      },
      current: 0,
    };
  },
  methods: {
    submitPromo(e) {
      e.preventDefault();
    },
    onSubmit() {
      this.$emit("submit", this.data);
    },
  },
  mounted() {
    const API_URL = `${process.env.VUE_APP_BASE_URL}/payroll_detail?payroll_list_id=1`;

    axios
      .get(API_URL, {
        headers: authHeader(),
      })
      .then((response) => {
        this.data = response.data.data;

        const activityElement = document.querySelector(
          ".activity:nth-of-type(1) + .amount"
        );
        activityElement.textContent = this.data[0].item;

        this.perdiem = this.data.reduce((total, item) => {
          if (item.item === "Perdiem for National Officers - Cities") {
            return total + item.amount;
          } else {
            return total;
          }
        }, 0);

        const perdiemElement = document.querySelector(
          ".activity:nth-of-type(2) + .amount"
        );
        perdiemElement.textContent = this.perdiem;
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>
