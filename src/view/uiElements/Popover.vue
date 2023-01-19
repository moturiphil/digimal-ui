<template>
  <div>
    <sdPageHeader title="Popover">
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
    <DropdownStyle>
      <Main>
        <a-row :gutter="25">
          <a-col :md="12" :xs="24">
            <sdCards title="Basic Popover">
              <sdPopover placement="bottomLeft">
                <a to="#">Hover me</a>
              </sdPopover>
            </sdCards>
            <sdCards title="Event menu">
              <sdPopover action="hover" placement="bottomLeft">
                <sdButton type="primary" size="small">hover </sdButton>
              </sdPopover>
              <sdPopover action="click" placement="bottom">
                <sdButton type="primary" size="small">click </sdButton>
              </sdPopover>
            </sdCards>
          </a-col>
          <a-col :md="12" :xs="24">
            <sdCards title="Placement">
              <sdPopover placement="bottomLeft">
                <sdButton size="small" type="primary"> Bottom Left </sdButton>
              </sdPopover>
              <sdPopover placement="bottom">
                <sdButton size="small" type="primary"> Bottom Center </sdButton>
              </sdPopover>
              <sdPopover placement="bottomRight">
                <sdButton size="small" type="primary"> Bottom Right </sdButton>
              </sdPopover>
              <br />
              <sdPopover placement="topLeft">
                <sdButton size="small" type="primary"> Top Left </sdButton>
              </sdPopover>
              <sdPopover placement="top">
                <sdButton size="small" type="primary"> Top Center </sdButton>
              </sdPopover>
              <sdPopover placement="topRight">
                <sdButton size="small" type="primary"> Top Right </sdButton>
              </sdPopover>
            </sdCards>
          </a-col>
        </a-row>
      </Main>
    </DropdownStyle>
  </div>
</template>

<script>
import { Main } from '../styled';
import { DropdownStyle } from './ui-elements-styled';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Popover',
  components: {
    Main,
    DropdownStyle,
  },
  data() {
    return {};
  },
  methods: {
    handleButtonClick() {
      // this.$message.info("Click on left button.");
    },
  },
});
</script>
