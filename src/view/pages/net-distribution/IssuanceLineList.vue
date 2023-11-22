<template>
    <RecordViewWrapper>
      <sdPageHeader title="Issuance Linelist">
        <template #subTitle>
          <sdButton class="btn-add_new" size="default" type="success"> </sdButton>
        </template>
        <template #buttons>
          <div class="search-box">
            <span class="search-icon">
              <sdFeatherIcons type="search" size="14" />
            </span>
            <a-input
              v-model:value="searchItem"
              type="text"
              name="dataSource"
              placeholder="Search by name"
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
                  <a-table
                    :pagination="{ pageSize: 25, showSizeChanger: true }"
                    :dataSource="results"
                    :columns="columns"
                  >
                  <template #status="{ record }">
                    <td :style="{ 'margin-left': '3px' }">
                    <div class="table-actions">
                        <span v-if="record.status == 1" class="badge badge-green">Received</span>
                        <span v-else-if="record.status == 2" class="badge badge-warning">Cancelled</span>
                        <span v-else class="badge badge-red">Pending</span>
                    </div>
                    </td>
                </template>
                   <!-- <template #action="{  }">
                    <td>
                      <div class="table-actions">
                        <sdButton 
                        type="success" 
                        size="extra-small" 
                        >
                        </sdButton>
                        </div>
                      </td>
                    </template> -->
                </a-table>
  
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
      title: "Drop-off Point",
      dataIndex: "drop_off_point_name",
      key: "id",
    },
    {
      title: "Quantity Issued",
      dataIndex: "quantity_issued",
      key: "id",
    },
    {
      title: "Issue Date",
      dataIndex: "issue_date",
      key: "id",
    },
    {
      title: "Status",
      dataIndex: "status",
      slots: { customRender: "status" },
      key: "id",
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
      const searchItem = ref("");
  
  
      onMounted(async () => {
        try {
          const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/linelist_net_issuance_to_post`,
            {
              method: "GET",
              headers: authHeader(),
            }
          );
          const data = await response.json();
          console.log(data)
          dataSource.value = data.data;
        } catch (error) {
          console.error(error);
        }
      });
      const results = computed(() => {
        const query = searchItem.value.toLowerCase();
        const regex = new RegExp(query, "i");
        if (!query) {
          return dataSource.value;
        } else {
          return dataSource.value.filter((post) => {
            return regex.test(post.drop_off_point_name);
          });
        }
      });
  
  
      return {
        crud,
        isLoading,
        selectedRowKeys,
        dataSource,
        searchItem,
        columns,
        results
      };
    },
  });
  
  export default DragAndDropTable;
  </script>
  <style scoped>
  .badge-green {
    background-color: #1ec997;
    color: white;
    /* padding: 2px;
      border-radius: 3px; */
    /* size */
    font-size: 12px;
  }
  .badge-warning {
    background-color: #f7b924;
    /* color: white; */
    /* padding: 2px;
      border-radius: 3px; */
    /* size */
    font-size: 12px;
  }
  .badge-red {
    background-color: #f0506e;
    color: white;
    /* padding: 2px;
      border-radius: 3px; */
    /* size */
    font-size: 12px;
  }
  .title-success {
    color: green;
  }
  </style>