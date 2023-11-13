<template>
  <RecordViewWrapper>
    <sdPageHeader title="Nets Received">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success"> </sdButton>
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
                <a-table
                  :pagination="{ pageSize: 100, showSizeChanger: true }"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                 <template #action="{ record }">
                  <td>
                    <div class="table-actions">
                      <sdButton 
                      type="success" 
                      size="extra-small" 
                      @click="goToBaleVerification(record.post_id, record.post_name, record.delivery_note_number, record.date_received, record.received_from, record.received_by )"
                      >
                      Bale Verification
                      </sdButton>
                      </div>
                    </td>
                  </template>
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
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import { useRouter } from "vue-router";
import authHeader from "../../../services/auth-header";

const columns = [
  {
    title: "Distribution Post",
    dataIndex: "post_name",
    key: "post_id",
  },
  {
    title: "No of Nets",
    dataIndex: "number_of_nets",
    key: "id",
  },
  {
    title: "Date Received",
    dataIndex: "date_received",
    key: "date_received",
  },
  {
    title: "Delivery Note Number",
    dataIndex: "delivery_note_number",
    key: "delivery_note_number",
  },
  {
    title: "Received From",
    dataIndex: "received_from",
    key: "received_from",
  },
  {
    title: "Received By",
    dataIndex: "received_by",
    key: "received_by",
  },
  // {
  //   title: "Action",
  //   dataIndex: "action",  
  //   key: "action",
  //   slots: { customRender: "action" },
  // },
  
];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const router = useRouter();



    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/net_deliveries`,
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
    // (record.post_id, record.post_name, record.delivery_note_number, record.date_received, record.received_from, record.received_by )
    const goToBaleVerification = (id, name, delivery_no, date_received,received_from, received_by ) => {
      router.push({
        path: `/nets/verify-post-nets`,
        query: { id: id, name: name,  delivery_no, date_received, received_from, received_by },
      });
    };

    return {
      goToBaleVerification,
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
