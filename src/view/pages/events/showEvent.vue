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
              <!-- <div class="state-single">
                <div class="color-primary">
                  <a to="#">
                    <sdFeatherIcons type="list" size="25" />
                  </a>
                </div>
                <div>
                  <sdHeading as="h5">47</sdHeading>
                  <p>Event Participants</p>
                </div>
              </div> -->
              <div class="state-single">
                <div class="color-secondary">
                  <a to="#" @click="getfacilitators">
                    <sdFeatherIcons type="pie-chart" size="25" />
                  </a>
                </div>
                <div>
                  <sdHeading as="h5">3</sdHeading>
                  <p>Event Facilitators</p>
                </div>
              </div>
              <!-- <div class="state-single">
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
              </div> -->
            </sdCards>
          </a-col>
          <a-col :xxl="24" :xl="16" :md="24" :xs="24">
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
  import { Modal } from "ant-design-vue"; 
  import authHeader from "../../../services/auth-header";


  
  const ProjectDetails = defineComponent({
    name: "ProjectDetails",
    components: { ProjectDetailsWrapper, Main, EventCampaignTable },

    data() {
      const { state, dispatch } = useStore();

      const project = computed(() => state.project.singData);
      const { params, matched, query } = useRoute();
      const { title, content } = computed(() => state.project.singData[0]);

  console.log({query, params});
      const { facilitators} = reactive({facilitators: []  });

      // const columns = [
      // {
      //   title: 'Name',
      //   dataIndex: 'name',
      //   key: 'name',
      // },
      // {
      //   title: 'Phone Number',
      //   dataIndex: 'phone_no',
      //   key: 'phone_no',
      // },
      // {
      //   title: 'ID Number',
      //   dataIndex: 'id_no',
      //   key: 'id_no',
      // },]
      
      const getfacilitators = async () => {
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/event/${query.event_code}/facilitators`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });
        const data = await response.json();
        this.facilitators = data.data;
        Modal.info({
          title: 'Facilitators',
          content: (
            <div>
              {data.data.map((facilitator, index) => (
                <p>{index + 1} {facilitator.first_name}  {facilitator.last_name} - {facilitator.phone_no} - {facilitator.id_no}</p>
              ))
              }

              {/* <template>
              <a-table
                :columns="columns"
                :row-key="record => record.login.uuid"
                :data-source="dataSource"
                :pagination="pagination"
                :loading="loading"
                @change="handleTableChange"
              >
                <template #bodyCell="{ column, text }">
                  <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
                </template>
              </a-table>
            </template> */}

            </div>
          ),
          onOk() {},
        });
        
        // this.loading = false;
      };
      // const getfacilitatorsfacilitators=()=>{
      //   Modal.info({
      //     title: 'Facilitators',
      //     content: (
      //       <div>
      //         {facilitators.map((facilitator) => (
      //           <p>{facilitator.first_name}</p>
      //         ))
      //         }
      //       </div>
      //     ),
      //     onOk() {},
      //   });
      // }
      onMounted(() =>{
       dispatch("eventCampaignData", parseInt(params.id, 10))
      }
       );

  
      return {
        title,
        content,
        project,
        params,
        matched,
        facilitators,
        getfacilitators
      };
    },
  });
  
  export default ProjectDetails;
  </script>
  