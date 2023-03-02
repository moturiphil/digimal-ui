<template>
  <ProjectDetailsWrapper>
    <sdPageHeader v-if="project">
      <template #title
        ><div key="1" class="project-header">
          <sdHeading as="h2">{{ project[0].title }}</sdHeading>
          <!-- <sdButton type="success" size="small">
            <sdFeatherIcons type="plus" size="14" /> <span>Add Event User</span>
          </sdButton> -->
          <!-- <sdButton class="btn-markComplete" :outlined="true" type="light" size="small">
              <sdFeatherIcons type="check" size="14" /> <span>Mark as Complete</span>
            </sdButton> -->
        </div></template
      >
      <!-- <template #buttons>
          <div :key="1" class="project-action">
            <a :key="1" to="#" class="project-edit">
              <sdFeatherIcons type="edit-3" size="14" />
              Edit
            </a>
            <a :key="2" to="#" class="project-remove">
              <sdFeatherIcons type="trash-2" size="14" />
              Remove
            </a>
          </div>
        </template> -->
    </sdPageHeader>
    <Main>
      <div v-if="!project" class="spin">
        <a-spin />
      </div>
      <a-row v-else :gutter="25">
        <a-col :xxl="6" :xl="8" :md="24" :xs="24">
          <!-- <div class="project-progress">
              <h3>Progress</h3>
              <a-progress :percent="65" :stroke-width="5" status="active" />
            </div> -->
          <sdCards headless>
            <div class="state-single">
              <div class="color-primary">
                <a to="#">
                  <sdFeatherIcons type="list" size="25" />
                </a>
              </div>
              <div>
                <sdHeading as="h5">47</sdHeading>
                <p>Event Participants</p>
              </div>
            </div>
            <div class="state-single">
              <div class="color-secondary">
                <a to="#">
                  <sdFeatherIcons type="pie-chart" size="25" />
                </a>
              </div>
              <div>
                <sdHeading as="h5">34</sdHeading>
                <p>Event Facilitators</p>
              </div>
            </div>
            <div class="state-single">
              <div class="color-success">
                <a to="#">
                  <sdFeatherIcons type="layout" size="25" />
                </a>
              </div>
              <div>
                <sdHeading as="h5">$27,500</sdHeading>
                <p>Spendings</p>
              </div>
            </div>
            <div class="state-single">
              <div class="color-warning">
                <a to="#">
                  <sdFeatherIcons type="edit" size="25" />
                </a>
              </div>
              <div>
                <sdHeading as="h5">Four Points</sdHeading>
                <p>Event Location</p>
              </div>
            </div>
            <div class="state-single">
              <div class="color-warning">
                <a to="#">
                  <sdFeatherIcons type="map" size="25" />
                </a>
              </div>
              <div>
                <sdHeading as="h5">4</sdHeading>
                <p>Event Facilitators</p>
              </div>
            </div>
          </sdCards>
        </a-col>
        <!-- <a-col :xxl="12" :xl="16" :md="24" :xs="24">
            <div class="about-project-wrapper">
              <sdCards title="About Project">
                <div class="about-content">
                  <p>{{ project[0].content }}</p>
                </div>
                <div class="about-project">
                  <div>
                    <span>Project Owner</span>
                    <p>Peter Jackson</p>
                  </div>
                  <div>
                    <span>Budget</span>
                    <p>$56,700</p>
                  </div>
                  <div>
                    <span>Start Date</span>
                    <p class="color-primary">28 Dec 2019</p>
                  </div>
                  <div>
                    <span>Deadline</span>
                    <p class="color-danger">18 Mar 2021</p>
                  </div>
                </div>
              </sdCards>
            </div>
          </a-col> -->
        <a-col :xxl="18" :xl="16" :md="24" :xs="24">
          <sdCards title="Event List Table"> <EventCampaignTable /></sdCards>
        </a-col>
        <!-- <a-col :xxl="6" :xl="8" :md="24" :xs="24">
          <div class="project-users-wrapper">
            <sdCards title="Users">
              <template #button>
                <sdButton
                  class="btn-addUser"
                  outlined
                  type="white"
                  size="small"
                >
                  <sdFeatherIcons type="user-plus" size="14" />
                  <span>Event Participants</span>
                </sdButton>
              </template>
              <div class="project-users">
                <div class="porject-user-single">
                  <div>
                    <img :src="require(`@/static/img/users/1.png`)" alt="" />
                  </div>
                  <div>
                    <sdHeading as="h5">Meyri Carles</sdHeading>
                    <p>Web Developer</p>
                  </div>
                </div>
                <div class="porject-user-single">
                  <div>
                    <img :src="require(`@/static/img/users/3.png`)" alt="" />
                  </div>
                  <div>
                    <sdHeading as="h5">Tuhin Molla</sdHeading>
                    <p>Project Manager</p>
                  </div>
                </div>
                <div class="porject-user-single">
                  <div>
                    <img :src="require(`@/static/img/users/9.jpg`)" alt="" />
                  </div>
                  <div>
                    <sdHeading as="h5">Billal Hossain</sdHeading>
                    <p>App Developer</p>
                  </div>
                </div>
                <div class="porject-user-single">
                  <div>
                    <img :src="require(`@/static/img/users/4.png`)" alt="" />
                  </div>
                  <div>
                    <sdHeading as="h5">Khalid Hasan</sdHeading>
                    <p>App Developer</p>
                  </div>
                </div>
                <div class="porject-user-single">
                  <div>
                    <img :src="require(`@/static/img/users/5.png`)" alt="" />
                  </div>
                  <div>
                    <sdHeading as="h5">Meyri Carles</sdHeading>
                    <p>Ui Designer</p>
                  </div>
                </div>
              </div>
            </sdCards>
          </div>
        </a-col> -->
        <!-- <a-col :xxl="8" :xs="24">
            <FileListCard />
          </a-col> -->
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
import EventCampaignTable from "../campaigns/CampaignTable/EventCampaign.vue";

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
