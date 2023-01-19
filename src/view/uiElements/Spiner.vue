<template>
  <div>
    <sdPageHeader title="Spin">
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
          <sdCards title="Basic" caption="The simplest use of Spin">
            <a-spin />
          </sdCards>
        </a-col>
        <a-col :md="12" :xs="24">
          <sdCards title="Size" caption="The simplest use of Spin">
            <a-spin size="small" />
            <a-spin />
            <a-spin size="large" />
          </sdCards>
        </a-col>
        <a-col :md="12" :xs="24">
          <sdCards title="Inside a container" caption="The simplest use of Spin">
            <SpinerWraperStyle>
              <a-spin />
            </SpinerWraperStyle>
          </sdCards>
        </a-col>
        <a-col :md="12" :xs="24">
          <sdCards title="Custom Indicator" caption="The simplest use of Spin">
            <SpinerWraperStyle>
              <a-spin indicator="{antIcon}" />
            </SpinerWraperStyle>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import { SpinerWraperStyle } from './ui-elements-styled';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Spiner',
  components: {
    Main,
    SpinerWraperStyle,
  },
});
</script>
