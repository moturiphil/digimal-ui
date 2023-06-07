<template>
  <ProjectDetailsWrapper>
    <sdPageHeader v-if="project">
      <template #title
        ><div key="1" class="project-header">
          <sdHeading as="h2">Participants Pending Confirmation</sdHeading>
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <!-- <sdButton class="btn-import" type="success" @click="exportUserData">
          Export Participants
        </sdButton> -->
      <div v-if="!project" class="spin">
        <a-spin />
      </div>
      <a-row v-else :gutter="25">
        <a-col :xxl="24" :xl="12" :md="24" :xs="24">
          <sdCards headless> </sdCards>
        </a-col>
        <a-col :xxl="24" :xl="24" :md="24" :xs="24">
          <sdCards title="Pending Participants">
            <pendingConfirmation
          /></sdCards>
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
import pendingConfirmation from "../campaigns/CampaignTable/pendingConfirmation.vue";
import { Modal } from "ant-design-vue";
import authHeader from "../../../services/auth-header";

const ProjectDetails = defineComponent({
  name: "ProjectDetails",
  components: { ProjectDetailsWrapper, Main, pendingConfirmation },

  data() {
    const { state, dispatch } = useStore();
    const project = computed(() => state.project.singData);
    const { params, matched, query } = useRoute();
    const { title, content } = computed(() => state.project.singData[0]);

    console.log({ query, params });
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

    // const getfacilitators = async () => {
    //   const response = await fetch(`${process.env.VUE_APP_BASE_URL}/event/${query.event_code}/facilitators`, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       ...authHeader(),
    //     },
    //   });
    //   const data = await response.json();
    //   this.facilitators = data.data;
    //   Modal.info({
    //     title: 'Facilitators',
    //     content: (
    //         {/* {data.data.map((facilitator, index) => (
    //           <p>{index + 1} {facilitator.first_name}  {facilitator.last_name} - {facilitator.phone_no} - {facilitator.id_no}</p>
    //         ))
    //         } */}
    //         // <div>
    //         //   <Table dataSource={data.data} columns={columns} />
    //         // </div>

    //     ),
    //     onOk() {},
    //   });

    //   // this.loading = false;
    // };
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
      // Modal.info({
      //   title: "Facilitators",
      //   content: (
      //     <div>
      //       <Table dataSource={data.data} columns={columns} />
      //     </div>
      //   ),
      //   onOk() {},
      // });
      Modal.info({
        title: "Facilitators",
        content: createTable(),
        onOk() {},
      });

      function createTable() {
        const div = document.createElement("div");
        const table = document.createElement("table");
        table.classList.add("ant-table");

        const tbody = document.createElement("tbody");

        for (let i = 0; i < data.data.length; i++) {
          const row = document.createElement("tr");

          for (let j = 0; j < columns.length; j++) {
            const column = columns[j];
            const cell = document.createElement("td");
            cell.textContent = data.data[i][column.dataIndex];
            row.appendChild(cell);
          }

          tbody.appendChild(row);
        }

        table.appendChild(tbody);
        div.appendChild(table);

        return div;
      }
    };
    onMounted(() => {
      dispatch("eventCampaignData", parseInt(params.id, 10));
    });

    return {
      title,
      content,
      project,
      params,
      matched,
      facilitators,
      getfacilitators,
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
