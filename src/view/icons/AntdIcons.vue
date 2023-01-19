<template>
  <div>
    <sdPageHeader title="Antd Icons">
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
        <a-col :sm="24" :xs="24">
          <IconWrapper>
            <sdCards title="Simply beautiful open source icons">
              <AntdIcon />
            </sdCards>
          </IconWrapper>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import AntdIcon from '../../components/icons/AntdIcons';
import { IconWrapper } from './IconStyled';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AntdIcons',
  components: {
    Main,
    AntdIcon,
    IconWrapper,
  },
});
</script>
