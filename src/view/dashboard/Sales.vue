<template>
  <sdPageHeader class="header-boxed" title="Sales Dashboard">
    <template v-slot:buttons>
      <div class="page-header-actions">
        <sdCalendarButton />
        <sdExportButton />
        <sdShareButton />
        <sdButton size="small" type="primary">
          <sdFeatherIcons type="plus" size="14" />
          Add New
        </sdButton>
      </div>
    </template>
  </sdPageHeader>
  <Main class="grid-boxed">
    <a-row :gutter="25">
      <a-col :lg="8" :xs="24">
        <sdCards headless>
          <OverviewSalesCard>
            <div class="icon-box box-primary">
              <SvgConverter :src="require('@/static/img/icon/New Customer.svg')" />
            </div>
            <div class="card-chunk">
              <CardBarChart2>
                <h2>7,461</h2>
                <span>New Customer</span>
                <p>
                  <span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                  <span>Since last week</span>
                </p>
              </CardBarChart2>
            </div>
          </OverviewSalesCard>
        </sdCards>

        <sdCards headless>
          <OverviewSalesCard>
            <div class="icon-box box-secondary">
              <SvgConverter :src="require('../../static/img/icon/SalesRevenue.svg')" />
            </div>
            <div class="card-chunk">
              <CardBarChart2>
                <h2>$28,947</h2>
                <span>Sales Revenue</span>
                <p>
                  <span class="growth-downward"> <sdFeatherIcons type="arrow-down" /> 25% </span>
                  <span>Since last week</span>
                </p>
              </CardBarChart2>
            </div>
          </OverviewSalesCard>
        </sdCards>
        <sdCards headless>
          <OverviewSalesCard>
            <div class="icon-box box-success">
              <SvgConverter :src="require('../../static/img/icon/Profit.svg')" />
            </div>
            <div class="card-chunk">
              <CardBarChart2>
                <h2>$3,241</h2>
                <span>Profit</span>
                <p>
                  <span class="growth-upward"> <sdFeatherIcons type="arrow-up" /> 25% </span>
                  <span>Since last week</span>
                </p>
              </CardBarChart2>
            </div>
          </OverviewSalesCard>
        </sdCards>
      </a-col>
      <a-col :lg="16" :xs="24">
        <Suspense>
          <template #default>
            <AverageSalesRevenue :chartHeights="95" />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :lg="8" :xs="24">
        <Suspense>
          <template #default>
            <SalesTarget />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :lg="8" :xs="24">
        <Suspense>
          <template #default>
            <SalesGrowth />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :lg="8" :xs="24">
        <Suspense>
          <template #default>
            <TopCountriesRevenue />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :lg="12" :xs="24">
        <Suspense>
          <template #default>
            <TopSellingProduct />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :lg="12" :xs="24">
        <Suspense>
          <template #default>
            <RecentOrder />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import { CardBarChart2, OverviewSalesCard } from './style';
import { Main } from '../styled';
import { defineAsyncComponent } from 'vue';
import SvgConverter from '@/components/utilities/SvgConverter.vue';

const AverageSalesRevenue = defineAsyncComponent(() => import('./overview/sales/AverageSalesRevenue'));
const SalesGrowth = defineAsyncComponent(() => import('./overview/sales/SalesGrowth'));
const SalesTarget = defineAsyncComponent(() => import('./overview/sales/SalesTarget'));
const TopSellingProduct = defineAsyncComponent(() => import('./overview/sales/TopSellingProduct'));
const TopCountriesRevenue = defineAsyncComponent(() => import('./overview/sales/TopCountriesRevenue'));
const RecentOrder = defineAsyncComponent(() => import('./overview/sales/RecentOrder'));

const Sales = {
  name: 'Sales',
  components: {
    Main,
    CardBarChart2,
    OverviewSalesCard,
    AverageSalesRevenue,
    SalesTarget,
    TopSellingProduct,
    SalesGrowth,
    RecentOrder,
    TopCountriesRevenue,
    SvgConverter,
  },
};

export default Sales;
</script>
