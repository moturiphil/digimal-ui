<template>
  <div>
    <sdPageHeader title="Dropdown">
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
            <sdCards title="Basic Dropdown">
              <sdDropdown placement="bottomLeft">
                <a to="#">Hover me</a>
              </sdDropdown>
            </sdCards>
            <sdCards title="Event menu">
              <sdDropdown :action="['hover']" placement="bottomLeft">
                <a to="#">hover me </a>
              </sdDropdown>
              <sdDropdown :action="['click']" placement="bottom">
                <a to="#">click </a>
              </sdDropdown>
            </sdCards>
          </a-col>
          <a-col :md="12" :xs="24">
            <sdCards title="Placement">
              <sdDropdown placement="bottomLeft">
                <sdButton class="btn-outlined" size="small" :outlined="true" type="light"> Bottom Left </sdButton>
              </sdDropdown>
              <sdDropdown placement="bottom">
                <sdButton class="btn-outlined" size="small" :outlined="true" type="light"> Bottom Center </sdButton>
              </sdDropdown>
              <sdDropdown placement="bottomRight">
                <sdButton class="btn-outlined" size="small" :outlined="true" type="light"> Bottom Right </sdButton>
              </sdDropdown>
              <br />
              <sdDropdown placement="topLeft">
                <sdButton class="btn-outlined" size="small" :outlined="true" type="light"> Top Left </sdButton>
              </sdDropdown>
              <sdDropdown placement="top">
                <sdButton class="btn-outlined" size="small" :outlined="true" type="light"> Top Center </sdButton>
              </sdDropdown>
              <sdDropdown placement="topRight">
                <sdButton class="btn-outlined" size="small" :outlined="true" type="light"> Top Right </sdButton>
              </sdDropdown>
            </sdCards>
            <sdCards title="Button with dropdown menu">
              <DropdownIconStyleWrapper>
                <sdButton @click="handleButtonClick" class="btn-outlined" size="default" :outlined="true" type="light">
                  <span>Bottom Left Click</span>

                  <sdDropdown placement="bottomLeft" :action="['click']">
                    <a to="#">
                      <sdFeatherIcons type="more-horizontal" />
                    </a>
                  </sdDropdown>
                </sdButton>
                <sdButton class="btn-outlined" :outlined="true" type="light">
                  <span>Top Left hover</span>

                  <sdDropdown placement="topLeft">
                    <a to="#">
                      <sdFeatherIcons type="more-horizontal" />
                    </a>
                  </sdDropdown>
                </sdButton>
                <sdButton @click="handleButtonClick" class="btn-outlined" size="default" :outlined="true" type="light">
                  <span>Bottom Right hover</span>

                  <sdDropdown placement="bottomRight" :action="['hover']">
                    <a to="#">
                      <sdFeatherIcons type="user" />
                    </a>
                  </sdDropdown>
                </sdButton>
                <sdButton class="btn-outlined" :outlined="true" type="light">
                  <span>Top Right hover</span>

                  <sdDropdown placement="topRight">
                    <a to="#">
                      <sdFeatherIcons type="more-horizontal" />
                    </a>
                  </sdDropdown>
                </sdButton>
                <sdButton class="btn-outlined" :outlined="true" type="error">
                  <a-tooltip title="tooltip" key="leftButton"> Tooltip </a-tooltip>
                  <sdDropdown placement="bottomLeft" size="small">
                    <a to="#">
                      <sdFeatherIcons type="more-horizontal" />
                    </a>
                  </sdDropdown>
                </sdButton>
                <sdButton class="btn-outlined" :outlined="true" type="warning">
                  <span>Warning</span>
                  <sdDropdown placement="bottomLeft" size="small">
                    <a to="#">
                      <sdFeatherIcons type="more-horizontal" />
                    </a>
                  </sdDropdown>
                </sdButton>
                <sdButton class="btn-outlined" :outlined="true" type="light">
                  <span>Info</span>
                  <sdDropdown placement="bottomLeft" size="small">
                    <a to="#">
                      <sdFeatherIcons type="download" />
                    </a>
                  </sdDropdown>
                </sdButton>
              </DropdownIconStyleWrapper>
            </sdCards>
          </a-col>
        </a-row>
      </Main>
    </DropdownStyle>
  </div>
</template>

<script>
import { Main } from '../styled';
import { DropdownStyle, DropdownIconStyleWrapper } from './ui-elements-styled';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Dropdown',
  components: {
    Main,
    DropdownStyle,
    DropdownIconStyleWrapper,
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
