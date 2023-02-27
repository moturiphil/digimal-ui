<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Campaigns">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success">
          <router-link to="/campaigns/create-campaign">
            <sdFeatherIcons type="plus" size="14" /> Start New
            Campaign</router-link
          >
        </sdButton>
      </template>
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span></div
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
                  <template #actions="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton
                        >
                          <router-link
                            :to="`/campaigns/${record.id}`"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="edit" size="16" />
                            &nbsp;&nbsp; View
                          </router-link>

                          <!-- <sdFeatherIcons type="edit" size="16" /> -->
                          <!-- &nbsp;&nbsp; View -->
                        </sdButton>
                        <sdButton
                          class="btn-icon"
                          type="info"
                          :to="`/campaigns/${record.id}/edit`"
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
      <a-col :xs="24">
        <DragAndDropTable />
      </a-col>
    </Main>
  </RecordViewWrapper>
</template>
<script>
import { RecordViewWrapper } from "./style";
import { Main, TableWrapper } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
// import axios from "axios";
import authHeader from "../../../services/auth-header";
// import { useRouter } from "vue-router";
// import DragAndDropTable from '../../../view/table/DragTable.vue';

const columns = [
  {
    title: "Campaign Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Campaign Start Date",
    dataIndex: "start_date",
    key: "id",
  },
  {
    title: "Campaign End Date",
    dataIndex: "end_date",
    key: "id",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
    slots: { customRender: "actions" },
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
    // const { state, dispatch } = useStore();
    // const router = useRouter();

    // if (!state.auth.isAuthenticated) {
    //   router.push({ name: "login" });
    // }  const API_URL = process.env.API_URL;

    console.log(authHeader());

    onMounted(async () => {
      try {
        const response = await fetch("http://localhost:8000/api/campaign_all", {
          method: "GET",
          headers: authHeader(),
        });
        const data = await response.json();
        dataSource.value = data.data;
      } catch (error) {
        console.error(error);
      }
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
  beforeRouteEnter(to, from, next) {
    if (!localStorage.getItem("user")) {
      next("/auth/login");
    } else {
      next();
    }
  },
});

export default ViewPage;
</script>
