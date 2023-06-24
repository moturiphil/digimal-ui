<template>
  <ProjectDetailsWrapper>
    <sdPageHeader :title="`${event_name} Event`"></sdPageHeader>
    <Main>
      <sdButton class="btn-import" type="success" @click="generatePayroll">
        Generate Payroll
      </sdButton>
      <br />
      <br />
      <div v-if="!project" class="spin">
        <a-spin />
      </div>
      <a-row v-else :gutter="25">
        <a-col :xxl="6" :xl="8" :md="24" :xs="24">
          <div class="project-progress">
            <h3>Progress</h3>
            <a-progress :percent="65" :stroke-width="5" status="active" />
          </div>
          <sdCards headless>
            <div class="state-single">
              <div class="color-success">
                <a to="#">
                  <sdFeatherIcons type="list" size="25" />
                </a>
              </div>
              <div>
                <sdHeading as="h5">47</sdHeading>
                <p>Total Participants</p>
              </div>
            </div>
            <div class="state-single">
              <div class="color-secondary">
                <a to="#">
                  <sdFeatherIcons type="pie-chart" size="25" />
                </a>
              </div>
              <div>
                <sdHeading as="h5">13</sdHeading>
                <p>Confirmed participants</p>
              </div>
            </div>
            <div class="state-single">
              <div class="color-warning">
                <a to="#">
                  <sdFeatherIcons type="clock" size="25" />
                </a>
              </div>
              <div>
                <sdHeading as="h5">250</sdHeading>
                <p>Pending Participants</p>
              </div>
            </div>
            <div class="state-single">
              <div class="color-success">
                <a to="#">
                  <sdFeatherIcons type="layout" size="25" />
                </a>
              </div>
              <div>
                <sdHeading as="h5">Ksh 27,500</sdHeading>
                <p>Amount Payable</p>
              </div>
            </div>
          </sdCards>
        </a-col>
        <a-col :xxl="9" :lg="9" :xs="24">
          <div class="project-users-wrapper">
            <sdCards title="Confirmed Participants">
              <template #button>
                <sdButton>
                  <router-link
                    :to="{
                      path: `/event/view/${event_id}?id=${event_code}`,
                      query: { id: event_code },
                    }"
                    class="btn-icon"
                    type="info"
                    shape="circle"
                  >
                    <sdFeatherIcons type="check" size="16" />
                    &nbsp;&nbsp; Confirmed Participants
                  </router-link>
                </sdButton>
              </template>
            </sdCards>
          </div>
        </a-col>
        <a-col :xxl="9" :lg="9" :xs="24">
          <div class="project-users-wrapper">
            <sdCards title="Pending Participants">
              <template #button>
                <sdButton>
                  <router-link
                    :to="{
                      path: `/event/pending-confirmation/${event_id}?id=${event_code}`,
                      query: { id: event_code },
                    }"
                    class="btn-icon"
                    type="info"
                    shape="circle"
                  >
                    <sdFeatherIcons type="pause" size="16" />
                    &nbsp;&nbsp; Pending Participants
                  </router-link>
                </sdButton>
              </template>
            </sdCards>
          </div>
        </a-col>
      </a-row>
    </Main>
  </ProjectDetailsWrapper>
</template>
<script>
import { ProjectDetailsWrapper } from "./overview/style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { reactive, computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { Modal } from "ant-design-vue";
import authHeader from "../../../services/auth-header";

const ProjectDetails = defineComponent({
  name: "ProjectDetails",
  components: { ProjectDetailsWrapper, Main },

  data() {
    const { state } = useStore();

    const project = computed(() => state.project.singData);
    const { params, matched, query } = useRoute();
    const { title, content } = computed(() => state.project.singData[0]);
    // generate_events_pay_roll?status=1&event_code=M718363
    const API_URL = `${process.env.VUE_APP_BASE_URL}/generate_events_pay_roll?status=1&event_code=${query.event_code}`;
    // const API_URL = `${process.env.VUE_APP_BASE_URL}/generateEventParticipantCSV?event=${query.id}`;

    console.log(API_URL);
    // console.log(query.name);
    const event_name = query.name;
    const event_id = query.id;
    const event_code = query.event_code;
    console.log(event_id);
    const { facilitators } = reactive({ facilitators: [] });

    // onMounted(() => {
    //   dispatch("eventCampaignData", parseInt(params.id, 10));
    // });
    const generatePayroll = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });
        console.log(response.status == 200);
        if (response.status == 200) {
          Modal.success({
            title: "Success",
            content: "Payroll Generated Successfully",
          });
        } else {
          Modal.error({
            title: "Error",
            content:
              "Something went wrong, ensure you have assigned payroll matrix to the event",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      title,
      content,
      project,
      params,
      matched,
      event_name,
      facilitators,
      generatePayroll,
      event_id,
      event_code,
    };
  },
});

export default ProjectDetails;
</script>
<style>
.page-header-actions {
  float: right;
}
</style>
