<template>
  <div>
    <sdPageHeader title="Rate">
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
          <sdCards title="Basic">
            <a-rate v-model="value" />
          </sdCards>
          <sdCards title="Half Star">
            <a-rate :default-value="2.5" allow-half />
          </sdCards>
          <sdCards title="Show copywriting">
            <span>
              <a-rate v-model:value="value" :tooltips="desc" />
              <span class="ant-rate-text">{{ desc[value - 1] }}</span>
            </span>
          </sdCards>
        </a-col>
        <a-col :md="12" :xs="24">
          <sdCards title="Read Only">
            <a-rate :default-value="2" disabled />
          </sdCards>
          <sdCards title="Clear Start">
            <a-rate :default-value="3" />
            <span class="ant-rate-text">allowClear: true</span>
            <br />
            <a-rate :allow-clear="false" :default-value="3" />
            <span class="ant-rate-text">allowClear: false</span>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Rate',
  components: {
    Main,
  },
  data() {
    return {
      value: 2,
      desc: ['terrible', 'bad', 'normal', 'good', 'wonderful'],
    };
  },
  methods: {},
});
</script>
