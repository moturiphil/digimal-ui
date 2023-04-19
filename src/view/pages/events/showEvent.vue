<template>
  <ProjectDetailsWrapper>
    <sdPageHeader v-if="project">
      <template #title
        ><div key="1" class="project-header">
          <sdHeading as="h2">Event Participants</sdHeading>
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <sdButton class="btn-import" type="success" @click="exportEventParticipants">
        Export Participants
      </sdButton>
      <div v-if="!project" class="spin">
        <a-spin />
      </div>
      <a-row v-else :gutter="25">
        <a-col :xxl="24" :xl="12" :md="24" :xs="24">
          <sdCards headless> </sdCards>
        </a-col>
        <a-col :xxl="24" :xl="24" :md="24" :xs="24">
          <sdCards title="Event Participants"> <EventCampaignTable /></sdCards>
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

import { reactive, computed, onMounted, defineComponent } from "vue";

import { useRoute } from "vue-router";
import EventCampaignTable from "../campaigns/CampaignTable/EventCampaign.vue";
import { Modal, Table } from "ant-design-vue";
import authHeader from "../../../services/auth-header";

const ProjectDetails = defineComponent({
  name: "ProjectDetails",
  components: { ProjectDetailsWrapper, Main, EventCampaignTable },

  data() {
    const { state, dispatch } = useStore();

    const project = computed(() => state.project.singData);
    const { params, matched, query } = useRoute();
    const { title, content } = computed(() => state.project.singData[0]);
    const API_URL = `${process.env.VUE_APP_BASE_URL}/generateEventParticipantCSV?event=${query.id}`;

    console.log(query.id);
    const { facilitators } = reactive({ facilitators: [] });

    const columns = [
      {
        title: "Name",
        dataIndex: "first_name",
        // key: 'first_name',
        render: (text, record) => (
          <span>
            {record.first_name} {record.last_name}
          </span>
        ),
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


    const getfacilitators = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/event/${query.event_code}/facilitators`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      this.facilitators = data.data;
      Modal.info({
        title: "Facilitators",
        content: (
          <div>
            <Table dataSource={data.data} columns={columns} />
          </div>
        ),
        onOk() {},
      });
    };
    onMounted(() => {
      dispatch("eventCampaignData", parseInt(params.id, 10));
    });
    const exportEventParticipants = async () => {
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

    return {
      title,
      content,
      project,
      params,
      matched,
      facilitators,
      getfacilitators,
      exportEventParticipants,
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
