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
                  <template #events="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton id="register-btn">
                          <router-link
                            :to="`/event/register/${record.id}`"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="edit-3" size="16" />
                            &nbsp;&nbsp; Register
                          </router-link>
                        </sdButton>
                        <sdButton>
                          <sdFeatherIcons type="eye" size="16" />
                          &nbsp;&nbsp; View
                        </sdButton>
                        <sdButton
                          class="btn-icon"
                          type="info"
                          :to="`/events/${record.id}/edit`"
                          shape="circle"
                        >
                          <sdFeatherIcons type="edit" size="16" />
                          &nbsp;&nbsp; Edit
                        </sdButton>
                        <sdButton
                          class="btn-icon"
                          type="danger"
                          @click="handleDelete(record.id)"
                          shape="circle"
                        >
                          <sdFeatherIcons type="trash-2" size="16" />
                          &nbsp;&nbsp; Delete
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
      <template>
        <div class="modal">
          <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Register for Event</h2>
            <p>Modal content goes here.</p>
          </div>
        </div>
      </template>
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

//   "id": 1,
//             "name": "Event Alanna",
//             "event_code": "NLKyzDJUNp",
//             "start_date": "2006-06-09",
//             "end_date": "1990-06-18",
//             "user_id": 1,
//             "campaign_id": 1,
//             "venue": "Venue Vickie",
//             "location_id": 1,
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
    title: "Actions",
    dataIndex: "",
    key: "events",
    slots: { customRender: "events" },
  },
];

const ViewPage = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main, TableWrapper },
  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);

    const API_URL = "http://localhost:8000/api/events/all";
    // const apiURL = process.env.VUE_APP_API_URL;

    // console.log(apiURL);

    // get api_url from the .env file
    // console.log(API_URL);

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
