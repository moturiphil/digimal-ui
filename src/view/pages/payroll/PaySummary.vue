<template>
  <sdCards
    :bodyStyle="{
      backgroundColor: '#F8F9FB',
      borderRadius: '20px',
    }"
    headless
  >
    <div class="card-container">
      <sdCards
        v-for="(card, index) in cardData"
        :key="index"
        :bodyStyle="{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
        }"
        headless
      >
        <div class="order-summary-inner">
          <br />
          <sdHeading class="summary-total" as="h4">
            <span class="summary-total-label">Activity : </span>
            <span class="summary-total-amount">{{ card.activity }}</span>
          </sdHeading>
          <br />
          <sdHeading class="summary-total" as="h4">
            <span class="summary-total-label">Perdiem : </span>
            <span class="summary-total-amount">{{ card.perdiem }}</span>
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
                <sdButton
                  htmlType="submit"
                  size="default"
                  type="success"
                  outlined
                >
                  Approve
                </sdButton>
                &nbsp;&nbsp;
                <sdButton
                  htmlType="submit"
                  size="default"
                  type="danger"
                  outlined
                >
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
      </sdCards>
    </div>
  </sdCards>
</template>
<script>
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRefs,
  defineComponent,
} from "vue";
import { useStore } from "vuex";
import authHeader from "../../../services/auth-header";
import axios from "axios";

const PaySummary = defineComponent({
  name: "PaySummary",
  props: ["subtotal"],
  data() {
    return {
      cardData: [
        { activity: "Activity 1", perdiem: "$50" },
        { activity: "Activity 2", perdiem: "$75" },
        { activity: "Activity 3", perdiem: "$100" },
      ],
      promoCode: "",
    };
  },
  setup() {
    const { state } = useStore();
    const rtl = computed(() => state.themeLayout.rtlData);
    const dataSource = ref([]);
    const coupon = ref(0);
    const promo = ref(0);
    const current = ref(0);
    const submitPromo = (values) => {
      promo.value = values;
    };
    const API_URL = `${process.env.VUE_APP_BASE_URL}/payroll_detail?payroll_list_id=1`;

    const formState = reactive({
      couponType: "",
      promoCode: "",
      layout: "horizontal",
    });

    const onSubmit = () => {
      document.querySelectorAll("button span").forEach((item) => {
        if (item.innerHTML === "Done") {
          item.click();
        }
      });
    };
    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          dataSource.value = response.data.data;
          // households.value = response.data.data;
          console.log(dataSource.value);
        })
        .catch((error) => {
          console.error(error);
        });
    });
    return {
      onSubmit,
      submitPromo,
      current,
      coupon,
      rtl,
      formState,
      ...toRefs(formState),
    };
  },
});

export default PaySummary;
</script>
<style>
.card-container {
  display: block;
}

</style>
