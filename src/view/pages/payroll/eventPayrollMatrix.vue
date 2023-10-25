<template>
  <div>
    <sdPageHeader ghost title="Event Payroll Matrix - Assignment" />
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
                                  <sdButton type="success" size="extra-small">
                                    &nbsp;&nbsp;
                                    <router-link
                                      :to="{
                                        path: `/event/matrix/${record.id}`,
                                        query: {
                                          id: record.id,
                                          name: record.name,
                                        },
                                      }"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                      @click="showModal = true"
                                    >
                                      &nbsp;&nbsp;
                                      <span class=""
                                        >&nbsp;&nbsp; Assign Matrix</span
                                      >
                                    </router-link>
                                  </sdButton> 

                                  &nbsp;&nbsp;

                                  <sdButton
                                    size="extra-small"
                                    type="success"
                                  >
                                    <router-link
                                      :to="{
                                        path: `/event/view-matrix/${record.id}`,
                                        query: {
                                          id: record.id,
                                          name: record.name,
                                        },
                                      }"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                    >
                                      <sdFeatherIcons type="eye" size="16" />
                                      &nbsp;&nbsp; View Matrix
                                    </router-link>
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

const columns = [
  {
    title: "Event",
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
  name: "Event Payroll",
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
    submit() {
      // Handle the submission of selected items
      console.log(this.selectedItems);
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

    const API_URL = `${process.env.VUE_APP_BASE_URL}/event_list_payroll_assignment`;

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

