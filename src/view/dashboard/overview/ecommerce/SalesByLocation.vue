<template>
  <LocationMapWrapper>
    <div class="full-width-table">
      <sdCards title="Sales By Location" bodypadding="0px">
        <template #button>
          <div class="card-nav">
            <ul>
              <li :class="locations === 'today' ? 'active' : 'deactivate'">
                <router-link @click="(e) => handleActiveChangeLocation(e, 'today')" to="#"> Today </router-link>
              </li>
              <li :class="locations === 'week' ? 'active' : 'deactivate'">
                <router-link @click="(e) => handleActiveChangeLocation(e, 'week')" to="#"> Week </router-link>
              </li>
              <li :class="locations === 'month' ? 'active' : 'deactivate'">
                <router-link @click="(e) => handleActiveChangeLocation(e, 'month')" to="#"> Month </router-link>
              </li>
              <li :class="locations === 'year' ? 'active' : 'deactivate'">
                <router-link @click="(e) => handleActiveChangeLocation(e, 'year')" to="#"> Year </router-link>
              </li>
            </ul>
          </div>
        </template>
        <div class="location-map d-flex justify-content-center">
          <WorldMap />
        </div>
        <div class="location-table">
          <a-table :columns="sellingColumns" :dataSource="sellingData" :pagination="false" />
        </div>
      </sdCards>
    </div>
  </LocationMapWrapper>
</template>
<script>
import { computed, onMounted, ref, defineComponent } from 'vue';
import { LocationMapWrapper } from '../../style';
import WorldMap from '@/components/utilities/VectorMap.vue';
import { useStore } from 'vuex';

const sellingColumns = [
  {
    title: 'Top Location',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'Order',
    dataIndex: 'order',
    key: 'order',
  },
  {
    title: 'Revenue',
    dataIndex: 'revenue',
    key: 'revenue',
  },
];

const SalesByLocation = defineComponent({
  name: 'SalesByLocation',
  components: { LocationMapWrapper, WorldMap },
  setup() {
    const { state, dispatch } = useStore();
    const topLocationState = computed(() => state.chartContent.locationData);
    const locations = ref('year');

    const handleActiveChangeLocation = (event, value) => {
      event.preventDefault();
      locations.value = value;
      dispatch('topLocationFilterData', value);
    };

    const sellingData = computed(() =>
      topLocationState.value
        ? topLocationState.value.map((value) => {
            const { key, location, order, revenue } = value;
            return {
              key,
              location,
              order,
              revenue,
            };
          })
        : [],
    );

    onMounted(() => dispatch('topLocationGetData'));

    return {
      topLocationState,
      handleActiveChangeLocation,
      sellingColumns,
      sellingData,
      locations,

      options: {
        width: 492,
        height: 180,
        zoom: true,
        hideAntarctic: true,
        landsColor: '#E3E6EF',
        landsBorder: '#E3E6EF',
      },
    };
  },
});

export default SalesByLocation;
</script>
