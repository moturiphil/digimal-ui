<template>
  <div class="full-width-table">
    <sdCards title="Recent Orders" bodypadding="0px" more>
      <template #more>
        <router-link to="#">
          <span>2 years</span>
        </router-link>
        <router-link to="#">
          <span>3 years</span>
        </router-link>
        <router-link to="#">
          <span>4 years</span>
        </router-link>
      </template>
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
      <div class="table-bordered top-seller-table table-recent-orders table-responsive">
        <a-table :columns="sellingColumns" :dataSource="sellingData" :pagination="false" />
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
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Sold',
    dataIndex: 'sold',
    key: 'sold',
  },
  {
    title: 'Revenue',
    dataIndex: 'revenue',
    key: 'revenue',
  },
];

const RecentOrder = defineComponent({
  name: 'RecentOrder',
  setup() {
    const { state, dispatch } = useStore();
    const topSaleState = computed(() => state.chartContent.topSaleData);
    const products = ref('year');

    onMounted(() => dispatch('topSaleGetData'));
    const handleActiveChangeProducts = (event, value) => {
      event.preventDefault();
      products.value = value;

      dispatch('topSaleFilterData', value);
    };

    const sellingData = computed(() =>
      topSaleState.value
        ? topSaleState.value.map((value) => {
            const { key, name, price, sold, revenue } = value;
            return {
              key,
              name,
              price,
              sold,
              revenue,
            };
          })
        : [],
    );

    return {
      sellingData,
      products,
      handleActiveChangeProducts,
      topSaleState,
      sellingColumns,
    };
  },
});

export default RecentOrder;
</script>
