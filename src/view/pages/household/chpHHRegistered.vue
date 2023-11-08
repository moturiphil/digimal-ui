<template>
  <div>
    <sdPageHeader ghost title="Registered Households" />

    <Main>
      <!-- <sdButton class="btn-import" type="success" @click="exportHouseHoldData">
        Export HouseHolds Data
      </sdButton> -->
      <SearchResultWrapper>
        <a-row :gutter="25">
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
                            :pagination="paginationOptions"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                          </a-table>
                        </TableWrapper>
                      </div>
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
              <!-- <a-pagination
                  show-size-changer
                  :default-current="3"
                  :total="40"
                  @showSizeChange="onShowSizeChange"
                /> -->
            </sdCards>
            <a-modal
              title="HouseHold Size Validation"
              :visible="isModalOpen"
              @ok="handleOk(recordId, inputValue)"
              @cancel="handleCancel"
              class="title-success"
            >
              <div>
                <h4>HouseHold Size Verification</h4>
                <p>HH Size: {{ inputValue }}</p>
                <input type="number" v-model="inputValue" />
              </div>
            </a-modal>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { useRoute } from "vue-router";


// const households = ref([]);

const columns = [
  {
    title: "First name",
    dataIndex: "first_name",
    key: "id_no",
  },
  {
    title: "Last name",
    dataIndex: "last_name",
    key: "id_no",
  },
  {
    title: "Phone number",
    dataIndex: "phone_no",
    key: "id_no",
  },
  {
    title: "Household size",
    dataIndex: "hh_size",
    key: "id_no",
  },
  {
    title: "Village",
    dataIndex: "location_id",
    key: "id_no",
  },
  {
    title: "CHP",
    dataIndex: "chw_id",
    key: "id_no",
  },
  {
    title: "CHP Phone Number",
    dataIndex: "chw_phone_no",
    key: "id_no",
  },
  {
    title: "Timestamp",
    dataIndex: "created_at_time",
    key: "id_no",
  },
  {
    title: "",
    dataIndex: "",
    key: "households",
    slots: { customRender: "households" },
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
      households: [],
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
    handleCancel() {
      this.isModalOpen = false;
      this.visible = false;
      this.colorVisible = false;
    },
  },
  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("all");
    const isModalOpen = ref(false);
    const inputValue = ref("");
    const household_id = ref("");
    const searchItem = ref("");

    const paginationOptions = ref({
      pageSize: 100, // Number of items per page
      showSizeChanger: true, // Show the page size changer
      current: 1, // Current page number
      total: 0, // Total number of items (will be updated after fetching data)
    });


    const { query } = useRoute();


    const API_URL = `${process.env.VUE_APP_BASE_URL}/chw_households?chp_id=${query.id}`;

    console.log(query.id);


    const handleChange = (tab) => {
      activeClass.value = tab;
    };

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

    const formState = reactive({
      searchItem: "",
    });

    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      columns,
      formState,
      handleChange,
      activeClass,
      isModalOpen,
      inputValue,
      household_id,
      searchItem,
      paginationOptions,
    };
  },
  props: {
    recordId: Number,
    hh_size: Number,
  },
});
</script>
