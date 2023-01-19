<template>
  <div>
    <sdPageHeader title="Tabs">
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
        <a-col :md="12" :xs="24">
          <Tabs :data="data"></Tabs>
        </a-col>
        <a-col :md="12" :xs="24">
          <Tabs :data="data" color="default"></Tabs>
        </a-col>
      </a-row>
      <a-row :gutter="25">
        <a-col :md="12" :xs="24">
          <Tabs :data="dataIcon" color="#5F63F2"></Tabs>
        </a-col>
        <a-col :md="12" :xs="24">
          <Tabs :data="icon" color="#5F63F2"></Tabs>
        </a-col>
      </a-row>
      <a-row :gutter="25">
        <a-col :md="12" :xs="24">
          <Tabs :data="dataIcon" color="#ffffff"></Tabs>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import Tabs from '../../components/tabs/Tabs';
import tabData from '../../demoData/tab-data.json';
import { defineComponent } from 'vue';

const { data, dataIcon, icon } = tabData;

export default defineComponent({
  name: 'Tab',
  components: {
    Main,
    Tabs,
  },
  setup() {
    return { data, dataIcon, icon };
  },
});
</script>
