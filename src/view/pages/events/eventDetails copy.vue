<template>
  <ProjectDetailsWrapper>
    <sdPageHeader :title="`${event_name} Event - ${event_code}`"></sdPageHeader>
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
        <a-col :xxl="12" :lg="12" :xs="16">
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
        <a-col :xxl="12" :lg="12" :xs="16">
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
<script setup>
import { ProjectDetailsWrapper } from "./overview/style";
import { Main } from "../../styled";
// import { useStore } from "vuex";
import { reactive, defineComponent } from "vue";
import { useRoute } from "vue-router";
import { Modal } from "ant-design-vue";
import authHeader from "../../../services/auth-header";

const ProjectDetails = defineComponent({
  name: "ProjectDetails",
  components: { ProjectDetailsWrapper, Main },

  data() {
    const { params, matched, query } = useRoute();
    const API_URL = `${process.env.VUE_APP_BASE_URL}/generate_events_pay_roll?status=1&event_code=${query.event_code}`;

    console.log(API_URL);
    // console.log(query.name);
    const event_name = query.name;
    const event_id = query.id;
    const event_code = query.event_code;
    console.log(event_id);
    const { facilitators } = reactive({ facilitators: [] });
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
