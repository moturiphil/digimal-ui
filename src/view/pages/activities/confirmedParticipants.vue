<template>
  <ProjectDetailsWrapper>
    <sdPageHeader v-if="project">
      <template #title
        ><div key="1" class="project-header">
          <sdHeading as="h2">ActivityParticipants</sdHeading>
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <sdButton
        class="btn-import"
        type="success"
        @click="exportActivityParticipants"
      >
        Export Participants
      </sdButton>
      &nbsp;&nbsp;
      <sdButton class="btn-import" type="success" @click="generatePayroll">
        Generate Payroll
      </sdButton>
      <div v-if="!project" class="spin">
        <a-spin />
      </div>
      <a-row v-else :gutter="25">
        <a-col :xxl="24" :xl="12" :md="24" :xs="24">
          <sdCards headless> </sdCards>
        </a-col>
        <a-col :xxl="24" :xl="24" :md="24" :xs="24">
          <sdCards title="ActivityParticipants">
            <ActivityConfirmedParticipants
          /></sdCards>
        </a-col>
      </a-row>
    </Main>
  </ProjectDetailsWrapper>
</template>
<script>
import { ProjectDetailsWrapper } from "./overview/style";
import { Main } from "../../styled";
import { useStore } from "vuex";

import { reactive, computed, onMounted, defineComponent } from "vue";
import { Modal } from "ant-design-vue";
import { useRoute } from "vue-router";
import ActivityConfirmedParticipants from "./activityConfirmedParticipants.vue";
import authHeader from "../../../services/auth-header";

const ProjectDetails = defineComponent({
  name: "ProjectDetails",
  components: { ProjectDetailsWrapper, Main, ActivityConfirmedParticipants},
// V390117
  data() {
    const { state, dispatch } = useStore();

    const project = computed(() => state.project.singData);
    const { params, matched, query } = useRoute();
    const { title, content } = computed(() => state.project.singData[0]);
    const API_URL = `${process.env.VUE_APP_BASE_URL}/generateEventParticipantCSV?event=${query.id}`;

    const genetatePayrollURL = `${process.env.VUE_APP_BASE_URL}/generate_pay_roll?activity_code=${query.code}&confirmed=1`;

    console.log(query.code);
    const { facilitators } = reactive({ facilitators: [] });

    const columns = [
      {
        title: "Name",
        dataIndex: "first_name",
        render: function (text, record) {
          return (
            "<span>" + record.first_name + " " + record.last_name + "</span>"
          );
        },
      },
      {
        title: "Phone Number",
        dataIndex: "phone_no",
        key: "phone_no",
      },
      {
        title: "ID Number",
        dataIndex: "id_no",
        key: "id_no",
      },
    ];
    onMounted(() => {
      dispatch("eventCampaignData", parseInt(params.id, 10));
    });
    const exportActivityParticipants = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch export data");
        }

        const fileBlob = await response.blob();
        const fileName = "event_participants.csv";
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([fileBlob]));
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error(error);
      }
    };

    const generatePayroll = async () => {
      try {
        const response = await fetch(genetatePayrollURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });
        console.log(response);
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
      columns,
      project,
      params,
      matched,
      facilitators,
      generatePayroll,
      exportActivityParticipants,
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
