<template>
  <div>
    <sdPageHeader ghost title="Audit Logs">
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name/village/chw"
          /></div
      ></template>
    </sdPageHeader>
    <Main>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu"></div>
          </a-col>
          <a-col :xs="24">
            <sdCards headless>
              <div class="result-list-content">
                <a-row :gutter="15">
                  <a-col class="w-100" :md="24">
                    <sdCards headless>
                      <div v-if="isLoading" class="spin">
                        <a-spin />
                      </div>

                      <div v-else>
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="results"
                            :columns="columns"
                          >
                            <template>
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions"></div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                      </div>
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { computed, onMounted, ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";

const columns = [
  {
    title: "User",
    dataIndex: "user_id",
    key: "id",
  },
  {
    title: "Event",
    dataIndex: "event",
    key: "id",
  },
  {
    title: "Auditable Type",
    dataIndex: "auditable_type",
    key: "id",
  },
  {
    title: "Old Values",
    dataIndex: "old_values",
    key: "id",
  },
  {
    title: "New Values",
    dataIndex: "new_values",
    key: "id",
  },
  // {
  //   title: "User Agent",
  //   dataIndex: "user_agent",
  //   key: "",
  // },
  {
    title: "IP Address",
    dataIndex: "ip_address",
    key: "",
  },
  // {
  //   title: "Created At",
  //   dataIndex: "created_at",
  //   key: "",
  // },
  {
    title: "Update At",
    dataIndex: "updated_at",
    key: "",
  },
];
export default defineComponent({
  name: "HouseHold Validation",
  components: {
    Main,
    SearchResultWrapper,
  },
  data() {
    return {
      notData: this.searchData,
      current: 0,
      pageSize: 0,
      visible: false,
      confirmLoading: false,
      modalType: "primary",
      colorVisible: false,
      payroll: [],
    };
  },
  methods: {
    handleSearch(searchText) {
      const data = this.searchData.filter((item) =>
        item.title.toUpperCase().startsWith(searchText.toUpperCase())
      );
      this.notData = data;
    },
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
    },
    searchData() {
      return this.$store.state.headerSearch.data;
    },
  },
  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("all");
    const searchItem = ref("");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/logs`;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    // const tableData = ref([]);

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data)
          dataSource.value = response.data.data;
          // console.log(dataSource.value);
          dataSource.value = response.data.data.map((item) => ({
            ...item,
            old_values: item.old_values,
            new_values: item.new_values,
          }));
          console.log(dataSource.value);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const results = computed(() => {
         const query = searchItem.value.toLowerCase();
         const regex = new RegExp(query, 'i');
         if(!query){
          
            return dataSource.value;
         }else{

           return dataSource.value.filter((event) =>{
              return (
              regex.test(event.event) ||
              regex.test(event.user_id)
              );
            }
           );
         }
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      results,
      searchItem,
      columns,
      handleChange,
      activeClass,
      // handleVerify,
    };
  },
});
</script>
<style>
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}
</style>

<style>
.badge-green {
  background-color: #1ec997;
  color: white;
  padding: 4px;
  margin-bottom: 18px;
  border-radius: 3px;
}
</style>
