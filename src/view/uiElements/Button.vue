<template>
  <div>
    <sdPageHeader title="Buttons">
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
    <Main class="button-example">
      <a-row :gutter="25">
        <a-col :md="12">
          <sdCards title="Basic" size="default">
            <sdButton size="default" type="primary"> Primary </sdButton>
            <sdButton size="default" type="secondary"> Secondary </sdButton>
            <sdButton size="default" type="success"> Success </sdButton>
            <sdButton size="default" type="info"> Info </sdButton>
            <sdButton size="default" type="warning"> Warning </sdButton>
            <sdButton size="default" type="danger"> Danger </sdButton>
            <sdButton size="default" type="link"> Link </sdButton>
            <sdButton size="default" type="dark"> Dark </sdButton>
            <sdButton size="default" type="light"> Light </sdButton>
            <sdButton size="default" type="white"> White </sdButton>
          </sdCards>
          <sdCards title="Light Color" size="default">
            <sdButton size="default" :transparented="true" type="primary"> Primary </sdButton>
            <sdButton size="default" :transparented="true" type="secondary"> Secondary </sdButton>
            <sdButton size="default" :transparented="true" type="success"> Success </sdButton>
            <sdButton size="default" :transparented="true" type="info"> Info </sdButton>
            <sdButton size="default" :transparented="true" type="warning"> Warning </sdButton>
            <sdButton size="default" :transparented="true" type="danger"> Danger </sdButton>
            <sdButton size="default" :transparented="true" type="dark"> Dark </sdButton>
            <sdButton class="btn-transparent" size="default" :transparented="true" type="light"> Light </sdButton>
          </sdCards>
          <sdCards title="Rounded" size="default">
            <sdButton size="default" shape="circle" type="primary"> Primary </sdButton>
            <sdButton size="default" shape="circle" type="secondary"> Secondary </sdButton>
            <sdButton size="default" shape="circle" type="success"> Success </sdButton>
            <sdButton size="default" shape="circle" type="info"> Info </sdButton>
            <sdButton size="default" shape="circle" type="warning"> Warning </sdButton>
            <sdButton size="default" shape="circle" type="danger"> Danger </sdButton>
            <sdButton size="default" shape="circle" type="dark"> Dark </sdButton>
            <sdButton size="default" shape="circle" type="light"> Light </sdButton>
            <sdButton size="default" shape="circle" type="white"> White </sdButton>
          </sdCards>
          <sdCards title="Icon" size="default">
            <sdButton size="default" type="primary">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" transparented type="primary">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" outlined type="primary">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" type="white">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" type="light">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" raised type="white">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton class="btn-icon" size="default" type="primary">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
            <sdButton class="btn-icon" size="default" outlined type="primary">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
            <sdButton class="btn-icon" size="default" type="light">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
            <sdButton class="btn-icon btn-outlined" size="default" :outlined="true" type="light">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
          </sdCards>
          <sdCards title="Size" size="default">
            <a-row>
              <ButtonSizeWrapper>
                <sdButton size="large" type="primary"> Large Button </sdButton>
                <sdButton size="default" type="secondary"> Default </sdButton>
                <sdButton size="small" type="success"> Small </sdButton>
              </ButtonSizeWrapper>
            </a-row>
          </sdCards>

          <sdCards title="Multiple Buttons" size="default">
            <sdButton size="default" type="primary"> Primary </sdButton>

            <sdButton size="default" type="secondary"> Secondary </sdButton>

            <sdDropdown :action="['click']" placement="bottomLeft">
              <BtnWithIcon>
                <sdButton size="default" :outlined="true" type="white">
                  Actions
                  <sdFeatherIcons type="chevron-down" />
                </sdButton>
              </BtnWithIcon>
            </sdDropdown>
          </sdCards>

          <sdCards title="Group Button" size="default">
            <ButtonsGroupWrapper>
              <div class="button-group-single">
                <h4>Basic</h4>
                <a-row>
                  <sdBtnGroup>
                    <sdButton size="small" type="primary"> Today </sdButton>
                    <sdButton size="small" rise type="white" class="btn-outlined"> Week </sdButton>
                    <sdButton size="small" rise type="white" class="btn-outlined"> Month </sdButton>
                    <sdButton size="small" rise type="white" class="btn-outlined"> Year </sdButton>
                  </sdBtnGroup>
                  <sdBtnGroup>
                    <sdButton size="small" :outlined="true" type="white"> Cancel </sdButton>
                    <sdButton size="small" :outlined="true" type="white"> Ok </sdButton>
                  </sdBtnGroup>
                  <sdBtnGroup>
                    <sdButton size="small" type="light"> Left </sdButton>
                    <sdButton size="small" type="light"> Middle </sdButton>
                    <sdButton size="small" type="light"> Right </sdButton>
                  </sdBtnGroup>
                </a-row>
              </div>

              <div class="button-group-single">
                <h4>With Icon</h4>
                <a-row>
                  <BtnWithIcon>
                    <sdBtnGroup>
                      <sdButton size="small" type="primary" class="active">
                        <sdFeatherIcons type="chevron-left" />
                        Go Back
                      </sdButton>
                      <sdButton size="small" type="primary">
                        Go Forward
                        <sdFeatherIcons type="chevron-right" />
                      </sdButton>
                    </sdBtnGroup>
                  </BtnWithIcon>
                </a-row>
              </div>
            </ButtonsGroupWrapper>
          </sdCards>

          <sdCards title="Block" size="default">
            <BlockButtonsWrapper>
              <sdButton size="large" type="primary" block> Large Button </sdButton>
              <sdButton size="default" type="secondary" block> Default </sdButton>
              <sdButton size="small" type="success" block> Small </sdButton>
            </BlockButtonsWrapper>
          </sdCards>
        </a-col>
        <a-col :md="12">
          <sdCards title="Outline" size="default">
            <sdButton size="default" :outlined="true" type="primary"> Primary </sdButton>
            <sdButton size="default" :outlined="true" type="secondary"> Secondary </sdButton>
            <sdButton size="default" :outlined="true" type="success"> Success </sdButton>
            <sdButton size="default" :outlined="true" type="info"> Info </sdButton>
            <sdButton size="default" :outlined="true" type="warning"> Warning </sdButton>
            <sdButton size="default" :outlined="true" type="danger"> Danger </sdButton>
            <sdButton size="default" :outlined="true" type="dark"> Dark </sdButton>
            <sdButton class="btn-outlined" size="default" :outlined="true" type="light"> Light </sdButton>
            <sdButton size="default" :outlined="true" type="dashed"> Dashed </sdButton>
          </sdCards>

          <sdCards title="Raised" size="default">
            <sdButton size="default" :raised="true" type="primary"> Primary </sdButton>
            <sdButton size="default" :raised="true" type="secondary"> Secondary </sdButton>
            <sdButton size="default" :raised="true" type="success"> Success </sdButton>
            <sdButton size="default" :raised="true" type="info"> Info </sdButton>
            <sdButton size="default" :raised="true" type="warning"> Warning </sdButton>
            <sdButton size="default" :raised="true" type="danger"> Danger </sdButton>
            <sdButton size="default" :raised="true" type="dark"> Dark </sdButton>
            <sdButton size="default" :raised="true" type="white"> White </sdButton>
          </sdCards>

          <sdCards title="Rounded Outline" size="default">
            <sdButton size="default" :outlined="true" shape="circle" type="primary"> Primary </sdButton>
            <sdButton size="default" :outlined="true" shape="circle" type="secondary"> Secondary </sdButton>
            <sdButton size="default" :outlined="true" shape="circle" type="success"> Success </sdButton>
            <sdButton size="default" :outlined="true" shape="circle" type="info"> Info </sdButton>
            <sdButton size="default" :outlined="true" shape="circle" type="warning"> Warning </sdButton>
            <sdButton size="default" :outlined="true" shape="circle" type="danger"> Danger </sdButton>
            <sdButton size="default" :outlined="true" shape="circle" type="dark"> Dark </sdButton>
            <sdButton class="btn-outlined" size="default" :outlined="true" shape="circle" type="light">
              Light
            </sdButton>
            <sdButton size="default" :outlined="true" shape="circle" type="dashed"> Dashed </sdButton>
          </sdCards>

          <sdCards title="Rounded with Icon" size="default">
            <sdButton size="default" shape="circle" type="primary">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" shape="circle" :transparented="true" type="primary">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" shape="circle" :outlined="true" type="primary">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton class="btn-outlined" size="default" shape="circle" :outlined="true" type="light">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" shape="circle" type="light">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" shape="circle" :raised="true" type="white">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton class="btn-icon" size="default" shape="round" type="primary">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
            <sdButton class="btn-icon" size="default" :outlined="true" shape="round" type="primary">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
            <sdButton class="btn-icon btn-outlined" size="default" :outlined="true" shape="round" type="light">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
            <sdButton class="btn-icon" size="default" shape="round" type="light">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
          </sdCards>

          <sdCards title="Disabled" size="default">
            <a-row>
              <sdButton size="default" type="primary"> Primary </sdButton>
              <sdButton size="default" type="primary" disabled> Primary(Disabled) </sdButton>
            </a-row>
            <a-row>
              <sdButton size="default" :outlined="true" type="white"> Default </sdButton>
              <sdButton size="default" :outlined="true" type="white" disabled> Default(Disabled) </sdButton>
            </a-row>
          </sdCards>

          <sdCards title="Loading" size="default">
            <sdButton size="default" shape="circle" type="primary">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" shape="circle" :transparented="true" type="primary">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" shape="circle" :outlined="true" type="primary">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" shape="circle" :outlined="true" type="white">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" shape="circle" type="light">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton size="default" shape="circle" :raised="true" type="white">
              <sdFeatherIcons type="layers" size="14" /> <span>Default</span>
            </sdButton>
            <sdButton class="btn-icon" size="default" shape="round" type="primary">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
            <sdButton class="btn-icon" size="default" :outlined="true" shape="round" type="primary">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
            <sdButton class="btn-icon btn-outlined" size="default" :outlined="true" shape="round" type="light">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
            <sdButton class="btn-icon" size="default" shape="round" type="light">
              <sdFeatherIcons type="layers" size="14" />
            </sdButton>
          </sdCards>

          <sdCards
            :bodyStyle="{
              backgroundImage: `linear-gradient(90deg, ${theme['primary-color']}, ${theme['secondary-color']})`,
              borderRadius: `0 0 10px 10px`,
            }"
            title="Ghost"
            size="default"
          >
            <sdButton size="default" type="primary" :ghost="true"> Primary </sdButton>
            <sdButton size="default" type="secondary" :ghost="true"> Secondary </sdButton>
            <sdButton size="default" type="success" :ghost="true"> Default </sdButton>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main, ButtonsGroupWrapper, BlockButtonsWrapper, ButtonSizeWrapper, BtnWithIcon } from '../styled';
import config from '../../config/config';
import { defineComponent } from 'vue';

const { theme } = config;

export default defineComponent({
  name: 'Buttons',
  components: {
    Main,
    ButtonsGroupWrapper,
    BlockButtonsWrapper,
    ButtonSizeWrapper,
    BtnWithIcon,
  },
  data() {
    return {
      theme,
    };
  },
});
</script>
