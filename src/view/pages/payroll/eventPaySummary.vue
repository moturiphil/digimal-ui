<template>
  <div class="activity-summary-inner">
    <div v-for="item in data" :key="item.id" class="summary-item">
      <sdHeading class="summary-total" as="h4">
        <span class="activity">{{ item.item }} : </span>
        <span class="amount">{{ item.amount }}</span>
      </sdHeading>
    </div>
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
    const API_URL = `${process.env.VUE_APP_BASE_URL}/event_pay_roll_details?event_payrollist_id=${query.id}`;
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

/* .activity-summary-inner {
  
} */

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
