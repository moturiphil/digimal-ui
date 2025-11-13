<template>
  <GeekAdminWrapper title="Transaction Details Reports">
  <div>
    <sdPageHeader ghost title="Transaction Details Reports">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by user, event or ip address..."
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
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template #actions="{ record }">
                              <td>
                                <div class="table-actions">
                                  &nbsp;&nbsp;
                                  <sdButton
                                    type="warning"
                                    size="extra-small"
                                    @click="
                                      syncTransaction(
                                        record.originator_conversation_id
                                      )
                                    "
                                  >
                                    Sync Transaction
                                  </sdButton>
                                  &nbsp;&nbsp;
                                </div>
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
  </GeekAdminWrapper>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./../style";
import GeekAdminWrapper from "../../../components/layout/GeekAdminWrapper.vue";
import { computed, onMounted, ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "id",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "id",
  },
  {
    title: "Phone No",
    dataIndex: "phone_no",
    key: "id",
  },
  {
    title: "ID No",
    dataIndex: "id_no",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "id",
  },
  {
    title: "Originator Conversation",
    dataIndex: "originator_conversation_id",
    key: "id",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "actions",
    slots: { customRender: "actions" },
  },
];
export default defineComponent({
  name: "HouseHold Validation",
  components: {
    Main,
    SearchResultWrapper,
    GeekAdminWrapper,
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

    const API_URL = `${process.env.VUE_APP_BASE_URL}/sync_transactions`;

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
          console.log(response.data.data);
          dataSource.value = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    const syncTransaction = async (originator) => {
      console.log(originator);
      const GF = "gf";
      axios
        .get(
          `${process.env.VUE_APP_BASE_URL}/payment/status/${GF}/${originator}`,
          {
            headers: authHeader(),
          }
        )
        .then((response) => {
          console.log(response.data.ResponseCode);
          if (response.data.ResponseCode == "0") {
          notification.success({
            message: "Success",
            description: "Transaction synched successfully",
          });
        } else {
          notification.error({
            message: "Error",
            description: `errorMessage": "Bad Request"`,
          });
        }
        })
        .catch((error) => {
          notification.error({
            message: `Error!`,
            description: `${error}`,
          });
        });
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      searchItem,
      columns,
      handleChange,
      activeClass,
      syncTransaction,
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
