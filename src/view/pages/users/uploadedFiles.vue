<template>
    <RecordViewWrapper>
      <sdPageHeader title="Uploads">
        <template id="buttons"></template>
      </sdPageHeader>
    
      <Main>
        <a-row :gutter="16" class="search-row"> </a-row>
        <br />
        <br />
        <a-row :gutter="15">
          <a-col class="w-100" :md="24">
            <sdCards headless>
              <div v-if="isLoading" class="spin">
                <a-spin />
              </div>
  
              <div v-else>
                <TableWrapper class="table-data-view table-responsive">
                  <a-table
                    :pagination="{ pageSize: 100, showSizeChanger: true }"
                    :dataSource="dataSource"
                    :columns="columns"
                  >
                    <template #action="{ record }">
                      <td>
                        <div class="table-actions">
                          <sdButton
                            size="small"
                            type="success"
                          >
                            <sdFeatherIcons type="eye" size="small" /> 
                            <router-link
                              :to="{
                                path: `/approve_masterlist/${record.id}`,
                                query: { status: record.status, file_name: record.name },
                              }"
                              class="btn-icon router_link"
                              type="info"
                              shape="circle"

                            > View
                          </router-link>
                            &nbsp; 
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
  import { RecordViewWrapper } from "../style";
  import { Main } from "../../styled";
  import { useStore } from "vuex";
  import { computed, onMounted, ref, defineComponent } from "vue";
  import authHeader from "../../../services/auth-header";
  
  const columns = [
        {
        title: "File Name",
        dataIndex: "name",
        key: "id",
        },
        {
        title: "Uploaded By",
        dataIndex: "uploaded_by",
        key: "id",
        },
        {
        title: "Approved By",
        dataIndex: "approved_by",
        key: "id",
        },
        {
        title: "Created At",
        dataIndex: "created_at",
        key: "id",
        },
        {
        title: "Status",
        dataIndex: "status",
        key: "id",
        },
        {
        title: "Action",
        dataIndex: "action",
        slots: { customRender: "action" },
        }
  ];
  
  const DragAndDropTable = defineComponent({
    name: "ViewPage",
    components: { RecordViewWrapper, Main },
  
    setup() {
      const { state } = useStore();
      const crud = computed(() => state.crud.data);
      const isLoading = computed(() => state.crud.loading);
      const selectedRowKeys = ref([]);
      const dataSource = ref([]);
        
      onMounted(async () => {
        try {
          const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/master_list_uploads`,
            {
              method: "GET",
              headers: authHeader(),
            }
          );
          const data = await response.json();
          dataSource.value = data.data;
        } catch (error) {
          console.error(error);
        }
      });
  
      return {
        crud,
        isLoading,
        selectedRowKeys,
        dataSource,
        columns,
      };
    },
  });
  
  export default DragAndDropTable;
  </script>
  
  <style>
  .search-row {
    display: flex;
    align-items: center;
  }
  .router_link {
    color: #fff;
  }
  .router_link:hover {
    color: #fff;
  }
  </style>
  