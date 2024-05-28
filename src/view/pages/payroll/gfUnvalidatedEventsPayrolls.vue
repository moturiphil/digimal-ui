<template>
  <div>
    <sdPageHeader ghost title="GF Event Unvalidated Payroll">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by payroll details..."
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
                            <template #payroll="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton size="extra-small" type="success">
                                    &nbsp;&nbsp;
                                    <router-link
                                      :to="{
                                        path: `/payroll/event-view/${record.id}`,
                                        query: {
                                          id: record.id,
                                          name: record.name,
                                          duration: record.duration,
                                          venue: record.venue,
                                          date: record.start_date,
                                          validate_status: record.status,
                                          approval_status:
                                            record.approval_status,
                                          payment_status: record.payment_status,
                                        },
                                      }"
                                      class="btn-icon"
                                      type="info"
                                      shape="circle"
                                    >
                                      Payroll Details
                                    </router-link>
                                  </sdButton>
                                  &nbsp;&nbsp;
                                  <sdButton
                                    type="success"
                                    size="extra-small"
                                    @click="handleValidation(record.id)"
                                    >Validate</sdButton
                                  >
                                  &nbsp;&nbsp;
                                  <sdButton
                                    size="extra-small"
                                    type="warning"
                                    @click="showVoidModal(record)"
                                  >
                                    <span>Void</span>
                                  </sdButton>
                                </div>
                              </td>

                              <!---modals-->
                              <a-modal
                                layout="inline"
                                :visible="openVoidModal"
                                title="Confirm Void Payroll"
                                @ok="actionVoidPayroll"
                                @cancel="handleVoidCancel"
                              >
                                <template #footer>
                                  <a-button key="back" @click="handleVoidCancel"
                                    >No, Take me back!</a-button
                                  >
                                  <a-button
                                    key="submit"
                                    style="background: orange; color: aliceblue"
                                    :loading="loading"
                                    @click="actionVoidPayroll"
                                    >Yes, Void it!</a-button
                                  >
                                </template>
                                <h4>
                                  Are you sure you want to void Payroll,Amount
                                  <b>KShs.{{ voidPayroll.total_amount }}</b>
                                </h4>
                              </a-modal>
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
import { computed, onMounted, ref, defineComponent, watchEffect } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { useStore } from "vuex";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "Name",
    dataIndex: "event_id",
    key: "id",
  },
  {
    title: "Validated",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Validator",
    dataIndex: "validated_by",
    key: "id",
  },
  {
    title: "Approved",
    dataIndex: "approval_status",
    key: "id",
  },
  {
    title: "Approver",
    dataIndex: "approved_by",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "payment_status",
    key: "id",
  },
  {
    title: "Amount Generated",
    dataIndex: "total_amount",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    fixed: "right",
    width: 20,
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
    const openVoidModal = ref(false);
    const voidPayroll = ref(null);

    const API_URL = `${process.env.VUE_APP_BASE_URL}/all_event_payrolls?funding_id=1&is_validated=0`;

    const handleChange = (tab) => {
      activeClass.value = tab;
    };

    const showVoidModal = (record) => {
      console.log(record);
      voidPayroll.value = record;
      openVoidModal.value = true;
    };

    const handleVoidCancel = () => {
      openVoidModal.value = false;
    };

    const actionVoidPayroll = async () => {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/void_events_payroll_summaries/${voidPayroll.value.id}`,
          null,
          {
            headers: authHeader(),
          }
        );

        openVoidModal.value = false;
        if (response.data.success == true) {
          notification.success({
            message: "Success",
            description: response.data.message,
          });
          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
          location.reload();
        } else if (response.data.success == false) {
          notification.warning({
            message: "Info",
            description: response.data.message,
          });
        }
      } catch (e) {
        notification.error({
          message: "Error!",
          description: e.toString(),
        });
        console.log(e);
      }
    };

    onMounted(() => {
      axios
        .get(API_URL, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data.data);
          dataSource.value = response.data.data.map((item) => ({
            ...item,
            old_values: item.old_values,
            new_values: item.new_values,
          }));
          dataSource.value.forEach((item) => {
            item.status = item.status === 1 ? "Validated" : "Not Validated";
            item.payment_status =
              item.payment_status === 1 ? "Paid" : "Not Paid";
            item.approval_status =
              item.approval_status === 1 ? "Approved" : "Not Approved";
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });

    watchEffect(async () => {
      const query = searchItem.value.toLowerCase();
      try {
        if (!query) {
          return dataSource.value;
        }
        if (query.length > 3) {
          const response = await fetch(`${API_URL}&query=${query}`, {
            method: "GET",
            headers: authHeader(),
          });
          const data = await response.json();
          dataSource.value = data.data.map((item) => ({
            ...item,
            old_values: item.old_values,
            new_values: item.new_values,
          }));
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message,
        });
      }
    });

    const handleValidation = (id) => {
      try {
        fetch(
          `${process.env.VUE_APP_BASE_URL}/event_payroll_validation?payroll_id=${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.success === true) {
              notification.success({
                message: "Success!",
                description: data.message,
              });
              setTimeout(() => {}, 2000);
            } else {
              notification.error({
                message: "Error!",
                description: data.message,
              });
            }
          });
      } catch (error) {
        console.log(error);
      }
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
      handleValidation,
      showVoidModal,
      handleVoidCancel,
      actionVoidPayroll,
      openVoidModal,
      voidPayroll,
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
