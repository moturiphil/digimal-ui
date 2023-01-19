<template>
  <SalesTargetWrap>
    <sdCards more title="Monthly Sales Target">
      <template #more>
        <router-link to="#">
          <sdFeatherIcons size="16" type="printer" />
          <span>Printer</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="book-open" />
          <span>PDF</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="file-text" />
          <span>Google Sheets</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="x" />
          <span>Excel (XLSX)</span>
        </router-link>
        <router-link to="#">
          <sdFeatherIcons size="16" type="file" />
          <span>CSV</span>
        </router-link>
      </template>
      <div class="target-progressbar-wrap">
        <HalfProgressBar :percent="80" />
      </div>
      <div class="s-target-list d-flex justify-content-between">
        <div class="s-target-list__item target-revinue">
          <h2>$5,870</h2>
          <p>Revenue</p>
        </div>
        <div class="s-target-list__item">
          <h2>$7,870</h2>
          <p>Target</p>
        </div>
      </div>
    </sdCards>
  </SalesTargetWrap>
</template>
<script>
import { SalesTargetWrap } from '../../style';
import HalfProgressBar from '../../../../components/utilities/progressBar';
import { defineComponent } from 'vue';

const SalesTarget = defineComponent({
  name: 'SalesTarget',
  components: { SalesTargetWrap, HalfProgressBar },
});

export default SalesTarget;
</script>
