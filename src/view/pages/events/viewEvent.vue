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
                  <template #events="{  }">
                    <td>
                      <div class="table-actions">
                        <!-- <sdButton @click="visible = true">
                          <router-link
                            :to="`/event/register/${record.id}`"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="edit-3" size="16" />
                            &nbsp;&nbsp; Register
                          </router-link>
                        </sdButton> -->
                        <!-- <sdButton
                          @click="showColorModal()"
                          size="small"
                          type="success"
                        >
                          Success
                        </sdButton> -->
                        <sdButton
                          @click="showSuccessModal"
                          size="small"
                          type="success"
                        >
                          <sdFeatherIcons type="user-plus" size="17" />
                          &nbsp;&nbsp; Register
                        </sdButton>
                        <!-- <sdButton
                        >
                          <router-link
                            :to="`/event/view/${record.id}`"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="eye" size="16" />
                            &nbsp;&nbsp; View
                          </router-link> -->
                          <!-- <sdFeatherIcons type="edit" size="16" /> -->
                          <!-- &nbsp;&nbsp; View -->
                        <!-- </sdButton> -->
                        <!-- <sdButton
                          class="btn-icon"
                          type="danger"
                          @click="handleDelete(record.id)"
                          shape="circle"
                        >
                          <sdFeatherIcons type="trash-2" size="16" />
                          &nbsp;&nbsp; Delete
                        </sdButton> -->
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
    title: "User_id",
    dataIndex: "user_id",
    key: "id",
  },
  {
    title: "campaign_id",
    dataIndex: "campaign_id",
    key: "id",
  },
  {
    title: "venue",
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
    // registerForEvent(eventCode) {
    //   // Make an API call to check if the event code is valid and register the user for the event
    //   // If the API call is successful, show a success message to the user
    //   // If the API call fails, show an error message to the user

    //   // For demonstration purposes, let's assume the API call is successful and the user is registered for the event
    //   const isEventCodeValid = true;

    //   if (isEventCodeValid) {
    //     this.showSuccessModal();
    //   } else {
    //     this.showErrorModal();
    //   }
    // },
    showModal() {
      this.visible = true;
    },
    showSuccessModal() {
    Modal.info({
      title: "Event Registration",
      content: (
        <div>
          <p>Register With Event Code</p>
          <Input placeholder="Enter event code" />
        </div>
      ),
      okText: "Register",
      style:{
        float:'center',
        display:'grid',
        placeContent:'center'
      },
     
      onOk() {
        console.log("Register");
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
    // const visible = ref(false);
    const eventCode = ref("");
    // props: {
    // visible: {
    //   type: Boolean,
    //   // default: false
    // }

    const API_URL = `${process.env.VUE_APP_BASE_URL}/events/all`;
    // const apiURL = process.env.VUE_APP_API_URL;

    // console.log(apiURL);

    // get api_url from the .env file
    // console.log(API_URL);
    // showColorModal() {
    //   this.colorVisible = true;
    // }
    // handleOk() {
    //   this.confirmLoading = true;
    //   setTimeout(() => {
    //     this.visible = false;
    //     this.colorVisible = false;
    //     this.confirmLoading = false;
    //   }, 2000);
    // }

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

    // const onRegister = () => {
    //   // TODO: Implement registration process
    //   console.log("Registering for event with code:", eventCode.value);
    //   visible.value = false;
    // };

    // Get the register button by its id
    // const registerButton = document.getElementById("register-btn");

    // // Add event listener to the button
    // registerButton.addEventListener("click", () => {
    //   // Get the modal element by its id
    //   const modal = document.getElementById("register-modal");

    //   // Show the modal by adding the 'show' class to it
    //   modal.classList.add("show");

    //   // Add event listener to the close button
    //   const closeButton = modal.querySelector(".close");
    //   closeButton.addEventListener("click", () => {
    //     // Hide the modal by removing the 'show' class from it
    //     modal.classList.remove("show");
    //   });
    // });

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
