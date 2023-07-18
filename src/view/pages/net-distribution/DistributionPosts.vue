<template>
  <RecordViewWrapper>
    <sdPageHeader title="Distribution Posts">
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
            placeholder="Search by name/code/supervisor"
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
                  :pagination="{ pageSize: 10, showSizeChanger: true }"
                  :dataSource="results"
                  :columns="columns"
                >
                <template #activities="{ record }">
                    <td :style="{ 'margin-left': '3px' }">
                      <div class="table-actions">
                        <sdButton>
                          <router-link
                            :to="{
                              path: `/assign-worker`,
                              query: { id: record.id },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="pen-tool" size="16" />
                            &nbsp;&nbsp; Assign Post Workers
                          </router-link>
                        </sdButton>
                        <sdButton>
                          <!-- <router-link
                            :to="{
                              path: `/inform-hh/${record.id}`,
                              query: { id: record.event_code },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="send" size="16" />
                            &nbsp;&nbsp; Inform HH Net Collection
                          </router-link> -->
                          <sdFeatherIcons type="send" size="16" />
                          &nbsp;&nbsp; Inform HH Net Collection
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
import { Main, TableWrapper } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, defineComponent } from "vue";
// import axios from "axios";
import authHeader from "../../../services/auth-header";

const columns = [
  {
    title: "Distribution Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Distribution Post",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Distribution Post Code",
    dataIndex: "post_code",
    key: "post_code",
  },
  {
    title: "Supervisor Name",
    dataIndex: "post_supervisor_user_id",
    key: "post_supervisor_user_id",
  },
  {
    title: "",
    dataIndex: "",
    key: "activities",
    slots: { customRender: "activities" },
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
    const searchItem = ref("");

    //   const api_url = UserService;
    //   console.log(api_url);

    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/posts_data`,
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

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    const results = computed(() => {
         const query = searchItem.value.toLowerCase();
         const regex = new RegExp(query, 'i');
         if(!query){
          
            return dataSource.value;
         }else{

           return dataSource.value.filter((event) =>{
              return (
              regex.test(event.name) ||
              regex.test(event.post_code) ||
              regex.test(event.post_supervisor_user_id) 
              );
            }
           );
         }
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      results,
      searchItem,
      columns,
    };
  },
});

export default DragAndDropTable;
</script>
