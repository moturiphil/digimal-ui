<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Payroll Matrixes">
      <template #subTitle>
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
                  :pagination="{ pageSize: 50, showSizeChanger: true }"
                  :dataSource="dataSource"
                  :columns="columns"
                >
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
import { RecordViewWrapper } from "./Style";
import { Main, TableWrapper } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import { useRouter } from "vue-router";
// import axios from "axios";

const router = useRouter();

const columns = [
  {
    title: "Formula Name",
    dataIndex: "formula_name",
    key: "id",
  },
  {
    title: "Job Groups",
    dataIndex: "job_groups",
    key: "id",
  },
  {
    title: "Level",
    dataIndex: "level_id",
    key: "id",
  },
  {
    title: "Location Type",
    dataIndex: "location_type",
    key: "id",
  },
  {
    title: "Rate",
    dataIndex: "rate",
    key: "id",
  },
];

const ViewPage = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main, TableWrapper },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
    };
  },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const eventCode = ref("");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/list_pay_matrix`;

    console.log(API_URL);

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

<style>
.badge-green {
  background-color: #1ec997;
  color: white;
  padding: 4px;
  border-radius: 3px;
}
</style>
