<template>
  <div>
    <sdPageHeader title="FontAwesome Icons">
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
              <FontAwesomeIcon />
            </sdCards>
          </IconWrapper>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import FontAwesomeIcon from '../../components/icons/FaIcons';
import { IconWrapper } from './IconStyled';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FontAwesome',
  components: {
    Main,
    FontAwesomeIcon,
    IconWrapper,
  },
});
</script>
