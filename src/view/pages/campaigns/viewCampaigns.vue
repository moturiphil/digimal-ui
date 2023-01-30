<template>
  <RecordViewWrapper>
    <sdPageHeader title="MassNet Campaigns">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success">
          <router-link to="/campaigns/create">
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
                />
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </RecordViewWrapper>
</template>
<script>
import { RecordViewWrapper } from "./style";
import { Main, TableWrapper } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import axios from "axios";
import authHeader from "../../../services/auth-header";

const columns = [
  {
    title: "Campaign Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Campaign Start Date",
    dataIndex: "Start Date",
    key: "start_date",
  },
  {
    title: "Campaign End Date",
    dataIndex: "company",
    key: "company",
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
    // console.log(localStorage.getItem("user"));
    // const apiToken =

    // onMounted(() => {
    //   dispatch('axiosCrudGetData');
    // });

    // const dataSource = computed(() => []);

    const dataSource = ref([]);
    // onMounted(() => {
    //   axios
    //     .get("http://localhost:8000/api/campaign_all", {
    //       headers: authHeader(),
    //     })
    //     .then((response) => {
    //       console.log(response.data.data);
    //       dataSource.value = response.data.data;
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // });

    onMounted(() => {
      axios
        .get("http://localhost:8000/api/campaign_all", {
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
