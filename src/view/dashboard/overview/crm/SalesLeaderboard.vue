<template>
  <div class="full-width-table">
    <sdCards title="Sales Leaderboard" bodypadding="0px">
      <template #button>
        <div class="card-nav">
          <ul>
            <li :class="products === 'today' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeProducts(e, 'today')" to="#"> Today </router-link>
            </li>
            <li :class="products === 'week' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeProducts(e, 'week')" to="#"> Week </router-link>
            </li>
            <li :class="products === 'month' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeProducts(e, 'month')" to="#"> Month </router-link>
            </li>
            <li :class="products === 'year' ? 'active' : 'deactivate'">
              <router-link @click="(e) => handleActiveChangeProducts(e, 'year')" to="#"> Year </router-link>
            </li>
          </ul>
        </div>
      </template>
      <div class="table-bordered leaderboard-table table-responsive">
        <a-table :columns="sellingColumns" :dataSource="[...sellingData]" :pagination="false" />
      </div>
    </sdCards>
  </div>
</template>
<script>
import { computed, onMounted, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';

const sellingColumns = [
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Deals',
    dataIndex: 'deals',
    key: 'deals',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
];
const SalesLeaderBoard = defineComponent({
  name: 'SalesLeaderBoard',
  components: {},
  setup() {
    const { state, dispatch } = useStore();
    const topSaleState = computed(() => state.chartContent.topSaleData);
    const products = ref('year');
    onMounted(() => dispatch('topSaleGetData'));

    const sellingData = computed(() =>
      topSaleState.value
        ? topSaleState.value.map((value) => {
            const { key, name, sold, revenue } = value;
            return {
              key,
              name,
              deals: sold,
              amount: revenue,
            };
          })
        : [],
    );

    const handleActiveChangeProducts = (event, value) => {
      event.preventDefault();
      products.value = value;
      dispatch('topSaleFilterData', value);
    };
    return {
      products,
      topSaleState,
      handleActiveChangeProducts,
      sellingData,
      sellingColumns,
    };
  },
});

export default SalesLeaderBoard;
</script>
