<template>
  <div>
    <sdPageHeader title="PageHeader">
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
        <a-col :md="24" :xs="24">
          <sdCards title="Basic Header">
            <PageHeaderWrapper>
              <sdPageHeader bgColor="#fff" title="Title" subTitle="This is a subtitle" />
            </PageHeaderWrapper>
          </sdCards>
        </a-col>
        <a-col :md="24" :xs="24">
          <sdCards title="Custom header">
            <PageHeaderWrapper>
              <sdPageHeader title="Title">
                <template v-slot:buttons>
                  <div class="page-header-actions">
                    <sdCalendarButton />
                    <sdExportButton />
                    <sdShareButton />
                    <sdButton size="small" type="primary">
                      <sdFeatherIcons type="plus" size="14" />
                      <span>Add New</span>
                    </sdButton>
                  </div>
                </template>
              </sdPageHeader>
            </PageHeaderWrapper>
          </sdCards>
        </a-col>
        <a-col :md="24" :xs="24">
          <sdCards title="Breadcrumb header">
            <PageHeaderWrapper>
              <sdPageHeader bgColor="#fff" title="Title" :breadcrumb="{ routes }" subTitle="This is a subtitle" />
            </PageHeaderWrapper>
          </sdCards>
        </a-col>
        <a-col :md="24" :xs="24">
          <sdCards title="Extra Content header">
            <PageHeaderWrapper>
              <sdPageHeader :breadcrumb="{ routes }" bgColor="#fff" title="Title" subTitle="This is a subtitle">
                <template v-slot:buttons>
                  <a-space>
                    <sdButton size="small" class="btn-outlined" type="light" :outlined="true"> Operation </sdButton>
                    <sdButton size="small" class="btn-outlined" type="light" :outlined="true"> Operation </sdButton>
                    <sdButton size="small" type="primary" :outlined="true"> Primary </sdButton>
                  </a-space>
                </template>
              </sdPageHeader>
            </PageHeaderWrapper>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main, PageHeaderWrapper } from '../styled';
import { defineComponent } from 'vue';
const routes = [
  {
    path: 'index',
    breadcrumbName: 'First-level Menu',
  },
  {
    path: 'first',
    breadcrumbName: 'Second-level Menu',
  },
  {
    path: 'second',
    breadcrumbName: 'Third-level Menu',
  },
];

export default defineComponent({
  name: 'PageHeader',
  components: {
    Main,
    PageHeaderWrapper,
  },
  data() {
    return {
      routes,
    };
  },
  methods: {},
});
</script>
