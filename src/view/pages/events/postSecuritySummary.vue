<template>
  <div>
    <sdPageHeader ghost title="Post Security Summary">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by user, event, or IP address..."
          />
        </div>
      </template>
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
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="dataSource"
                            :columns="tableColumns"
                          >
                            <template #bodyCell="{ column, record }">
                              <td>
                                <div v-if="column.key === 'securities'">
                                  <ul>
                                    <li
                                      v-for="(
                                        security, secIndex
                                      ) in record.securities"
                                      :key="secIndex"
                                    >
                                      <strong>{{ secIndex + 1 }}.</strong>
                                      <!-- Auto-incrementing number -->
                                      &nbsp;
                                      <strong>Name:</strong>
                                      {{ security.firstname }}
                                      {{ security.lastname }}
                                      <br />
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong
                                        >Phone No:</strong
                                      >
                                      {{ security.phone }} ||
                                      <strong>ID No:</strong>
                                      {{ security.id_number }} ||
                                      <strong>Shift:</strong>
                                      {{ security.shift }}
                                    </li>
                                  </ul>
                                </div>
                                <div v-else>{{ record[column.dataIndex] }}</div>
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
import { useRoute } from "vue-router";

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
    const { query } = useRoute();

    const location = query.event_location_id;

    const API_URL = `${process.env.VUE_APP_BASE_URL}/get_post_security?subcounty_id=${location}`;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    const tableColumns = [
      {
        title: "Post Name",
        dataIndex: "post_name",
        key: "post_name",
      },
      {
        title: "Securities",
        dataIndex: "securities",
        key: "securities",
      },
    ];

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

    // watchEffect(async () => {
    //   const query = searchItem.value.toLowerCase();
    //   try {
    //     if (!query) {
    //       dataSource.value = security.value;
    //       return dataSource.value;
    //     }
    //     if (query.length > 3) {
    //       const response = await fetch(`${API_URL}/search?query=${query}`, {
    //         method: "GET",
    //         headers: authHeader(),
    //       });
    //       const data = await response.json();
    //       dataSource.value = data.data.map((item) => ({
    //         ...item,
    //         old_values: item.old_values,
    //         new_values: item.new_values,
    //       }));
    //     }
    //   } catch (error) {
    //     notification.error({
    //       message: "Error",
    //       description: error.message,
    //     });
    //   }
    // });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      searchItem,
      tableColumns,
      handleChange,
      activeClass,
    };
  },
});
</script>

<style>
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}

.card-wrapper {
  margin-bottom: 20px;
}

.post-card {
  background-color: #f9f9f9;
  border-radius: 4px;
}

.security-card {
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
}
</style>
