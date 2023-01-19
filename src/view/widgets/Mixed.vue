<template>
  <div>
    <sdPageHeader title="Widgets Mixed">
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
      <MixedCardWrap>
        <a-row :gutter="25">
          <a-col :lg="8" :md="12" :sm="12" :xs="24">
            <sdCards headless>
              <Ordersummary :subtotal="1200" />
            </sdCards>
          </a-col>
          <a-col :xxl="16" :xl="24">
            <CardGroup />
          </a-col>
          <a-col :xxl="8" :xs="24">
            <SocialMediaOverview />
          </a-col>

          <a-col :xxl="8" :md="12" :xs="24">
            <SalesByLocation />
          </a-col>

          <a-col :xxl="8" :md="12" :xs="24">
            <DailyOverview />
          </a-col>
        </a-row>
      </MixedCardWrap>
    </Main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { Main } from '../styled';
import SocialMediaOverview from '../dashboard/overview/index/SocialMediaOverview';
import CardGroup from '../dashboard/overview/business/CardGroup';
import DailyOverview from '../dashboard/overview/performance/DailyOverview';
import SalesByLocation from '../dashboard/overview/ecommerce/SalesByLocation';
import Ordersummary from '../apps/ecommerce/overview/Ordersummary';
import { MixedCardWrap } from './Style';
export default defineComponent({
  name: 'WidgetMixed',
  components: {
    Main,
    SocialMediaOverview,
    CardGroup,
    DailyOverview,
    SalesByLocation,
    Ordersummary,
    MixedCardWrap,
  },
  setup() {
    return {};
  },
});
</script>
