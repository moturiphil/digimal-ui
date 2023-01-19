<template>
  <LocationMapWrapper>
    <div class="full-width-table">
      <sdCards more title="Top Countries by Revenue">
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
        <div class="location-map d-flex justify-content-center">
          <WorldMap />
        </div>
        <div class="location-table theme-2">
          <a-table :columns="locationColumns" :dataSource="locationData" :pagination="false" :showHeader="false" />
        </div>
      </sdCards>
    </div>
  </LocationMapWrapper>
</template>
<script>
import { LocationMapWrapper } from '../../style';
import WorldMap from '@/components/utilities/VectorMap.vue';
import { defineComponent } from 'vue';
const locationColumns = [
  {
    title: '',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '',
    dataIndex: 'revenue',
    key: 'revenue',
  },
];
const locationData = [
  {
    key: '1',
    location: 'United States',
    revenue: '$536',
  },
  {
    key: '2',
    location: 'United Kingdom',
    revenue: '$748',
  },
  {
    key: '3',
    location: 'Canada',
    revenue: '$415',
  },
  {
    key: '4',
    location: 'China',
    revenue: '$963',
  },
];
const TopCountriesRevenue = defineComponent({
  name: 'TopCountriesRevenue',
  components: { LocationMapWrapper, WorldMap },

  setup() {
    return {
      locationColumns,
      locationData,
      options: {
        width: 233.91,
        height: 115.49,
        zoom: true,
        hideAntarctic: true,
        landsColor: '#E3E6EF',
        landsBorder: '#fff',
      },
    };
  },
});

export default TopCountriesRevenue;
</script>
