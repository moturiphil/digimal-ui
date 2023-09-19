<template>
  <ProjectDetailsWrapper>
    <sdPageHeader v-if="project">
      <template #title
        ><div key="1" class="project-header">
          <sdHeading as="h2">{{ project[0].title }}</sdHeading>
        </div></template
      >
    </sdPageHeader>
    <Main>
      <div v-if="!project" class="spin">
        <a-spin />
      </div>
      <a-row v-else :gutter="25">
        <a-col :xxl="6" :xl="8" :md="24" :xs="24">
          <sdCards headless>
          </sdCards>
        </a-col>
        <a-col :xxl="18" :xl="24" :md="24" :xs="24">
          <sdCards title="Event List Table"> <EventCampaignTable /></sdCards>
        </a-col>
      </a-row>
    </Main>
  </ProjectDetailsWrapper>
</template>
<script>
import { ProjectDetailsWrapper } from "./overview/style";
// import FileListCard from './overview/FileListCard';
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, defineComponent } from "vue";
import { useRoute } from "vue-router";
import EventCampaignTable from "../campaigns/CampaignTable/CampaignInfo.vue";

const ProjectDetails = defineComponent({
  name: "ProjectDetails",
  components: { ProjectDetailsWrapper, Main, EventCampaignTable },
  setup() {
    const { state, dispatch } = useStore();
    const project = computed(() => state.project.singData);
    const { params, matched } = useRoute();
    const { title, content } = computed(() => state.project.singData[0]);

    onMounted(() => dispatch("eventCampaignData", parseInt(params.id, 10)));

    return {
      title,
      content,
      project,
      params,
      matched,
    };
  },
});

export default ProjectDetails;
</script>
