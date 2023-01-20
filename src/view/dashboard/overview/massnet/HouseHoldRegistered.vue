<template>
  <div class="full-width-table">
    <sdCards title="HouseHold Registered Per County" bodypadding="0px">
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
      <RecentDealsWrapper>
        <div class="table-bordered recent-deals-table table-responsive">
          <a-table :columns="sellingColumns" :dataSource="sellingData" :pagination="false" :showHeader="false" />
        </div>
      </RecentDealsWrapper>
    </sdCards>
  </div>
</template>
<script>
import { computed, onMounted, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { RecentDealsWrapper } from '../../style';

const sellingColumns = [
  {
    title: '',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '',
    dataIndex: 'amount',
    key: 'amount',
  },
];

const RecentDeals = defineComponent({
  name: 'RecentDeals',
  components: { RecentDealsWrapper },
  setup() {
    const { state, dispatch } = useStore();
    const products = ref('year');
    const recentDealState = computed(() => state.chartContent.recentDealData);
    onMounted(() => dispatch('recentDealGetData'));

    const handleActiveChangeProducts = (event, value) => {
      event.preventDefault();
      products.value = value;
      dispatch('recentDealFilterData', value);
    };

    const sellingData = computed(() =>
      recentDealState.value
        ? recentDealState.value.map((value) => {
            const { key, name, date, price, img } = value;
            return {
              key,
              name: (
                <div class="dealing-author">
                  <img src={require(`../../../../${img}`)} alt="" />
                  <div class="dealing-author-info">
                    <h4>{name}</h4>
                    <p>{date}</p>
                  </div>
                </div>
              ),
              amount: <span class="deal-amount">{price}</span>,
            };
          })
        : [],
    );

    return {
      recentDealState,
      products,
      handleActiveChangeProducts,
      sellingColumns,
      sellingData,
    };
  },
});

export default RecentDeals;
</script>
