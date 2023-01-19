<template>
  <OverviewCard>
    <div class="d-flex align-items-center justify-content-between overview-head">
      <sdHeading as="h4">Daily Overview</sdHeading>
      <sdDropdown>
        <sdButton type="default"> Export <sdFeatherIcons type="chevron-down" size="14" /> </sdButton>
      </sdDropdown>
    </div>
    <div class="overview-box">
      <sdCards headless>
        <div class="d-flex align-items-center justify-content-between">
          <div class="overview-box-single">
            <sdHeading as="h2" class="color-primary"> 5,461 </sdHeading>
            <p>Users Today</p>
          </div>
          <div class="overview-box-single text-right">
            <sdHeading as="h2">8,085</sdHeading>
            <p>Expected Users</p>
          </div>
        </div>

        <a-progress :percent="70" :showInfo="false" class="progress-primary" />

        <p>
          <span class="growth-upward">
            <sdFeatherIcons type="arrow-up" size="14" />
            25% <span>Since yesterday</span>
          </span>
          <span class="overview-box-percentage" :style="{ float: !rtl ? 'right' : 'left' }"> 70% </span>
        </p>
      </sdCards>
    </div>

    <div class="overview-box">
      <sdCards headless>
        <div class="d-flex align-items-center justify-content-between">
          <div class="overview-box-single">
            <sdHeading as="h2" class="color-info"> 140 </sdHeading>
            <p>Goals Today</p>
          </div>
          <div class="overview-box-single text-right">
            <sdHeading as="h2">120</sdHeading>
            <p>Expected Goals</p>
          </div>
        </div>
        <a-progress :percent="70" :showInfo="false" />
        <p>
          <span class="growth-downward">
            <sdFeatherIcons type="arrow-down" size="14" />
            25% <span>Since yesterday</span>
          </span>
          <span class="overview-box-percentage" :style="{ float: !rtl ? 'right' : 'left' }"> 70% </span>
        </p>
      </sdCards>
    </div>
  </OverviewCard>
</template>
<script>
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { OverviewCard } from '../../style';

const DailyOverview = defineComponent({
  name: 'DailyOverview',
  components: { OverviewCard },
  setup() {
    const store = useStore();
    const rtl = computed(() => store.state.themeLayout.rtl);
    return {
      rtl,
    };
  },
});

export default DailyOverview;
</script>
