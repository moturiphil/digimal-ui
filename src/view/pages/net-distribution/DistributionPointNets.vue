<template>
    <RecordViewWrapper>
      <sdPageHeader title="Nets Summary At Distribution Point">
        <template #subTitle>
          <sdButton class="btn-add_new" size="default" type="success">
          </sdButton>
        </template>
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
                    :pagination="{ pageSize: 10, showSizeChanger: true }"
                    :dataSource="dataSource"
                    :columns="columns"
                  />
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
  import { Main, TableWrapper } from "../../styled";
  import { useStore } from "vuex";
  import { computed, onMounted, ref, reactive, defineComponent } from "vue";
  // import axios from "axios";
  import authHeader from "../../../services/auth-header";
  
  const columns = [
  {
      title: "Distribution Point",
      dataIndex: "drop_off_point_id",
      key: "id",
    },
    {
      title: "County",
      dataIndex: "drop_off_point_county",
      key: "id",
    },
    {
      title: "Sub County",
      dataIndex: "drop_off_point_sub_county",
      key: "id",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "id",
    },
  ];
  
  
  const DragAndDropTable = defineComponent({
    name: "ViewPage",
    components: { RecordViewWrapper, Main, TableWrapper },
  
    setup() {
      const { state, dispatch } = useStore();
      const crud = computed(() => state.crud.data);
      const isLoading = computed(() => state.crud.loading);
      const selectedRowKeys = ref([]);
      const dataSource = ref([]);
  
      console.log(authHeader());
  
      //   const api_url = UserService;
      //   console.log(api_url);
  
      // onMounted(async () => {
      //   try {
      //     const response = await fetch(
      //       `${process.env.VUE_APP_BASE_URL}/net_deliveries_drop_of_points`,
      //       {
      //         method: "GET",
      //         headers: authHeader(),
      //       }
      //     );
      //     console.log(response);
      //     const data = await response.json();
      //     dataSource.value = data.data;
      //     console.log(data.data);
      //   } catch (error) {
      //     console.error(error);
      //   }
      // });

      onMounted(async () => {
        try {
          const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/drop_of_points_stock_status`,
            {
              method: "GET",
              headers: authHeader(),
            }
          );
          console.log(response);
          const data = await response.json();
          dataSource.value = data.data;
          console.log(data.data);
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
  });
  
  export default DragAndDropTable;
  </script>
  