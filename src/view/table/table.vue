<template>
  <div>
    <sdPageHeader title="Tables"> </sdPageHeader>
    <Main>
      <a-row :gutter="15">
        <a-col :xs="24">
          <sdCards title="Basic Usage">
            <BasicTable />
          </sdCards>
        </a-col>
        <a-col :xs="24">
          <SocialTrafficMetrics />
        </a-col>
        <a-col :xs="24">
          <TrafficChannel />
        </a-col>
        <a-col :xs="24">
          <TopLandingPages />
        </a-col>
        <a-col :sm="12" :xs="24">
          <TopSellingProduct />
        </a-col>
        <a-col :sm="12" :xs="24">
          <RevenueGenerated />
        </a-col>

        <a-col :xs="24">
          <DragAndDropTable />
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import BasicTable from './overview/BasicTable';
import SocialTrafficMetrics from '../../view/dashboard/overview/index/SocialTrafficMetrics';
import TrafficChannel from '../../view/dashboard/overview/performance/TrafficChannel';
import TopLandingPages from '../../view/dashboard/overview/performance/TopLandingPages';
import TopSellingProduct from '../../view/dashboard/overview/ecommerce/TopSellingProduct';
import RevenueGenerated from '../../view/dashboard/overview/ecommerce/RevenueGenerated';
import DragAndDropTable from '../table/DragTable';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Tables',
  components: {
    Main,
    BasicTable,
    SocialTrafficMetrics,
    TrafficChannel,
    TopLandingPages,
    TopSellingProduct,
    RevenueGenerated,
    DragAndDropTable,
  },
});
</script>
