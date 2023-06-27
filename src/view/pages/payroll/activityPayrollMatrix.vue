<template>
  <div>
    <sdPageHeader ghost title=" Activity Payroll Matrix - Assignment" />
    <Main>
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
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  <sdButton
                                    @click="viewMatrix()"
                                    size="small"
                                    type="success"
                                  >
                                    &nbsp;&nbsp;
                                    <router-link
                                      :to="{
                                        path: `/activity/matrix/${record.id}`,
                                        query: {
                                          id: record.id,
                                          name: record.name,
                                        },
                                      }"
                                      type="info"
                                      shape="circle"
                                      @click="showModal = true"
                                      >
                                      <span class=""
                                        >&nbsp;&nbsp; Assign Matrix</span
                                      >
                                    </router-link>
                                  </sdButton>

                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                  <sdButton
                                    @click="viewMatrix()"
                                    size="small"
                                    type="success"
                                  >
                                    <sdFeatherIcons type="eye" size="large" />
                                    &nbsp;&nbsp;
                                    <span class=""
                                      >&nbsp;&nbsp; View Matrix</span
                                    >
                                  </sdButton>

                                  <!-- Modal -->
                                  <div class="modal" v-if="showModal">
                                    <div class="modal-content">
                                      <h2>Select Items</h2>
                                      <div>
                                        <label
                                          v-for="item in items"
                                          :key="item.id"
                                        >
                                          <input
                                            type="checkbox"
                                            v-model="selectedItems"
                                            :value="item.id"
                                          />
                                          {{ item.name }}
                                        </label>
                                      </div>
                                      <button @click="submit">Submit</button>
                                    </div>
                                    <div
                                      class="modal-overlay"
                                      @click="showModal = false"
                                    ></div>
                                  </div>

                                  <!-- end modal -->
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
</template>

<script>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
// import { useRoute } from "vue-router";

// const households = ref([]);

const columns = [
  {
    title: "Activity",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "No of Days",
    dataIndex: "no_of_days",
    key: "id",
  },
  {
    title: "No of Officers",
    dataIndex: "no_of_officers",
    key: "id",
  },
  {
    title: "",
    dataIndex: "Assign Matrix",
    key: "payroll",
    slots: { customRender: "payroll" },
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
      showModal: false,
      items: [
        // Define your list of items here
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
      ],
      selectedItems: [],
    };
  },
  methods: {
    async viewMatrix() {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/payment_op`,
          {
            payroll_summary_id: 1,
            payment_type: "Activity Matrix",
          },
          { headers: authHeader() }
        );

        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
    handleSearch(searchText) {
      const data = this.searchData.filter((item) =>
        item.title.toUpperCase().startsWith(searchText.toUpperCase())
      );
      this.notData = data;
    },
    // handleChange(value) {
    //   this.activeClass = value;
    // },
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
    },
    searchData() {
      return this.$store.state.headerSearch.data;
    },
    submit() {
      // Handle the submission of selected items
      console.log(this.selectedItems);
      // You can perform further actions here, such as sending the selected items to a server
      // or updating the component's state
      this.showModal = false; // Close the modal after submission if needed
    },
  },
  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const activeClass = ref("all");

    const API_URL = `${process.env.VUE_APP_BASE_URL}/activity_list`;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          dataSource.value = response.data.data;
          console.log(dataSource.value);
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
      // exportHouseHoldData,
      handleChange,
      activeClass,
    };
  },
  // computed: {
  // },
});
</script>
<style>
.badge-green {
  background-color: #1ec997;
  /* color: white; */
  /* padding: 2px;
    border-radius: 3px; */
  /* size */
  font-size: 12px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 1rem;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
