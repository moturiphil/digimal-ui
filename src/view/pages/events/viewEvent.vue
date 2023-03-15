<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Events">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success">
          <router-link to="/events/event-create">
            <sdFeatherIcons type="plus" size="14" /> Start New
            Event</router-link
          >
        </sdButton>
      </template>
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            @change="onHandleSearch"
            v-model:value.trim="formState.searchItem"
            type="text"
            name="dataSource"
            placeholder="Search Here"
          /></div
      ></template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <a-table
                  :rowSelection="rowSelection"
                  :pagination="{ pageSize: 10, showSizeChanger: true }"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <template #events="{}">
                    <td>
                      <div class="table-actions">
                        <sdButton
                          @click="showSuccessModal"
                          size="small"
                          type="success"
                        >
                          <sdFeatherIcons type="user-plus" size="17" />
                          &nbsp;&nbsp; Register
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </RecordViewWrapper>
</template>
<script>
import axios from "axios";
import authHeader from "../../../services/auth-header";
import { RecordViewWrapper } from "./style";
import { Main, TableWrapper } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { Modal } from "ant-design-vue";

const router = useRouter();

const columns = [
  {
    title: "Event Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "User Id",
    dataIndex: "user_id",
    key: "id",
  },
  {
    title: "Campaign Id",
    dataIndex: "campaign_id",
    key: "id",
  },
  {
    title: "Venue",
    dataIndex: "venue",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "events",
    slots: { customRender: "events" },
  },
];

const ViewPage = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main, TableWrapper },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      modalType: "primary",
      colorVisible: false,
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    // showSuccessModal() {
    //   Modal.success({
    //     title: "Event Registration",
    //     content: (
    //       <div>
    //         <p>Register With Event Code</p>
    //         <Input placeholder="Enter event code" />
    //       </div>
    //     ),
    //     okText: "Register",
    //     onOk() {
    //       console.log("Register for event");
    //     },
    //     style: {
    //       float: "center",
    //       display: "grid",
    //       placeContent: "center",
    //     },
    //   });
    // },
    showSuccessModal() {
      Modal.success({
        title: "Event Registration",
        content: (
          <div>
            <p>Register With Event Code</p>
            <Input v-model={this.eventCode} placeholder="Enter event code" />
          </div>
        ),
        okText: "Register",
        onOk: async () => {
          try {
            // Validate the event code
            const { data } = await axios.get(
              `${process.env.VUE_APP_BASE_URL}/events/all?event_code=${this.eventCode}`
            );
            if (!data || data.length === 0) {
              throw new Error("Invalid event code");
            }

            // Navigate to the event registration page
            // const participantId = 2; // Change this to the participant's ID
            const participantId = 2;
            const response = await axios.post(
              `${process.env.VUE_APP_BASE_URL}/event/${data[0].id}/participant/${participantId}/assign`
            );
            if (response.status !== 200) {
              throw new Error("Failed to assign participant to event");
            }

            // Show success message
            Modal.success({
              title: "Success",
              content: "You have been registered for the event",
            });
          } catch (error) {
            Modal.error({
              title: "Error",
              content: error.message,
            });
          }
        },
        style: {
          float: "center",
          display: "grid",
          placeContent: "center",
        },
      });
    },

    handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.colorVisible = false;
        this.confirmLoading = false;
      }, 2000);
    },
    handleCancel() {
      this.visible = false;
      this.colorVisible = false;
    },
    changeType(type) {
      this.modalType = type;
    },
    // info() {
    //   //const h = this.$createElement;
    //   Modal.info({
    //     title: 'This is a notification message',
    //     content: h('div', {}, [h('p', 'some messages...some messages...'), h('p', 'some messages...some messages...')]),
    //     onOk() {
    //       console.log('ok');
    //     },
    //   });
    // },
    success() {
      Modal.success({
        title: "This is a success message",
        // JSX support
        content: (
          <div>
            <p>some messages...some messages...</p>
            <p>some messages...some messages...</p>
          </div>
        ),
      });
    },

    error() {
      Modal.error({
        title: "This is an error message",
        content: "some messages...some messages...",
      });
    },

    warning() {
      Modal.warning({
        title: "This is a warning message",
        content: "some messages...some messages...",
      });
    },
  },
  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const eventCode = ref("");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/events/all`;

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data);
          dataSource.value = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    async () => {
      try {
        // Validate the event code
        const { data } = await axios.get(
          `${API_URL}?event_code=${eventCode.value}`
        );
        if (!data || data.length === 0) {
          throw new Error("Invalid event code");
        }

        // Navigate to the event registration page
        const eventId = data[0].id;
        router.push(`/event/register/${eventId}`);
      } catch (error) {
        console.error(error);
        // Modal.error({
        //   title: "Registration failed",
        //   content: "Invalid event code",
        // });
      }
    };

    const handleDelete = (id) => {
      const confirm = window.confirm("Are you sure delete this?");
      if (confirm) {
        dispatch("axiosDataDelete", {
          id,
          getData: () => {
            dispatch("axiosCrudGetData");
          },
        });
      }
      return false;
    };

    const formState = reactive({
      searchItem: "",
    });

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      dataSource,
      columns,
      formState,
    };
  },
});

export default ViewPage;
</script>
