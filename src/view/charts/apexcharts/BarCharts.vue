<template>
  <div>
    <sdPageHeader title="Bar Charts">
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
    <Main>
      <a-row :gutter="25">
        <a-col :md="12" :sm="24" :xs="24">
          <sdCards title="Basic Bar Chart">
            <basic />
          </sdCards>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <sdCards title="Reverse Bar Chart">
            <reverse />
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../../styled';
import Basic from '../../../components/apexcharts/bar-charts/BasicBar';
import Reverse from '../../../components/apexcharts/bar-charts/ReversedBar';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'BarCharts',
  components: {
    Main,
    Basic,
    Reverse,
  },
});
</script>
