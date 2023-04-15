<template>
  <sdPageHeader class="header-boxed" title="Activity Participation Confirmation">
  </sdPageHeader>
  <Main class="grid-boxed">
    <a-row :gutter="25">
      <a-col :lg="24" :xs="24">
        <sdCards headless>
          <OverviewSalesCard>
            <div class="card-chunk">
              <CardBarChart2>
                <h2>Confirm Participation Details</h2>
                <span>Activity Name:</span>
                <p>
                  <!-- <span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span> -->
                  <span>Activity Code:</span>
                  <span>Activity Location:</span>
                </p>
              </CardBarChart2>
            </div>
          </OverviewSalesCard>
        </sdCards>
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import { CardBarChart2, OverviewSalesCard } from './style';
import { Main } from '../styled';
// import { defineAsyncComponent } from 'vue';
import SvgConverter from '@/components/utilities/SvgConverter.vue';

// const AverageSalesRevenue = defineAsyncComponent(() => import('./overview/sales/AverageSalesRevenue'));
// const SalesGrowth = defineAsyncComponent(() => import('./overview/sales/SalesGrowth'));
// const SalesTarget = defineAsyncComponent(() => import('./overview/sales/SalesTarget'));
// const TopSellingProduct = defineAsyncComponent(() => import('./overview/sales/TopSellingProduct'));
// const TopCountriesRevenue = defineAsyncComponent(() => import('./overview/sales/TopCountriesRevenue'));
// const RecentOrder = defineAsyncComponent(() => import('./overview/sales/RecentOrder'));

const Sales = {
  name: 'Sales',
  components: {
    Main,
    CardBarChart2,
    OverviewSalesCard,
    // AverageSalesRevenue,
    // SalesTarget,
    // TopSellingProduct,
    // SalesGrowth,
    // RecentOrder,
    // TopCountriesRevenue,
    SvgConverter,
  },
};

export default Sales;
</script>
