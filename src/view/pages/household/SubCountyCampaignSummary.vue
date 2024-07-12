<template>
    <RecordViewWrapper>
      <sdPageHeader ghost :title="`${sub_county_name} Sub County Campaign Summary`">
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
              <!-- :rowSelection="rowSelection" -->
              <div v-else>
                <TableWrapper class="table-data-view table-responsive">
                  <a-table
                    :pagination="{ pageSize: 50, showSizeChanger: true }"
                    :dataSource="results"
                    :columns="columns"
                  >
                    <!-- <template #units="{ record }">
                      <td>
                        <div class="table-actions">
                          <sdButton size="extra-small" type="success">
                            <router-link
                              :to="{
                                path: `/org-units/sub-counties/${record.org_id}`,
                                query: { name: record.name }
                              }"
                              class="btn-icon"
                              type="info"
                              shape="circle"
                            >
                              &nbsp;&nbsp; View Sub Counties Summaries
                            </router-link>
                          </sdButton>
                        </div>
                      </td>
                    </template> -->
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
  import { useRoute } from "vue-router";
  
  const columns = [
    {
      title: "Sub County Name",
      dataIndex: "name",
      key: "id",
    },
    {
      title: "Registered User",
      dataIndex: "registered_users",
      key: "id",
    },
    {
      title: "Registered Households",
      dataIndex: "registered_house_holds",
      key: "id",
    },
    {
      title: "Household Served",
      dataIndex: "households_served",
      key: "id",
    },
    {
      title: "Nets Required",
      dataIndex: "nets_required",
      key: "id",
    },
    {
      title: "Nets Delivered",
      dataIndex: "nets_delivered",
      key: "id",
    },
    {
      title: "All HH Members",
      dataIndex: "all_hh_members",
      key: "id",
    },
    {
      title: "Population Served",
      dataIndex: "population_served",
      key: "id",
    },
    {
      title: "Events",
      dataIndex: "events",
      key: "id",
    },
    {
      title: "Activities",
      dataIndex: "activities",
      key: "id",
    },
    {
      title: "% Nets distributed",
      dataIndex: "percent_nets_distributed",
      key: "id",
    },
    {
      title: "% Household Served",
      dataIndex: "percent_households_served",
      key: "id",
    },
    {
      title: "% Population Served",
      dataIndex: "percent_population_served",
      key: "id",
    },
    {
      title: "",
      dataIndex: "",
      key: "units",
      slots: { customRender: "units" },
    },
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
      const searchItem = ref("");
      const { query, params } = useRoute();

      console.log(query);

      const sub_county_name = query.name;
      const sub_county_org_id = params.id;
  
      onMounted(async () => {
        try {
          const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/get_all_stats_summaries?org_id=${sub_county_org_id}`,
            {
              method: "GET",
              headers: authHeader(),
            }
          );
          const data = await response.json();
          console.log(data);
          dataSource.value = data;
          console.log(dataSource.value);
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
        const regex = new RegExp(query, "i");
        if (!query) {
          return dataSource.value;
        } else {
          return dataSource.value.filter((event) => {
            return regex.test(event.name);
          });
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
        sub_county_name,
      };
    },
  });
  
  export default DragAndDropTable;
  </script>
  