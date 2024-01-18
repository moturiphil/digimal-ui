<template>
  <div>
    <sdPageHeader ghost :title="`Nets Summary at ${post_name}`" />
    <Main>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu">
              <ul>
                <li>
                  <a
                    :class="activeTransaction === 'receive' ? 'active' : 'deactivate'"
                    @click="handleTransactions('receive')"
                    href="#"
                  >
                    Received Nets
                  </a>
                </li>
                <li>
                  <a
                    :class="activeTransaction === 'transfer' ? 'active' : 'deactivate'"
                    @click="handleTransactions('transfer')"
                    href="#"
                  >
                    Nets Transfer
                  </a>
                </li>
                <li>
                  <a
                    :class="activeTransaction === 'return' ? 'active' : 'deactivate'"
                    @click="handleTransactions('return')"
                    href="#"
                  >
                    Return Nets to Drop Off Point
                  </a>
                </li>
              </ul>
            </div>
            <div class="search-filter-menu">
              <ul>
                <li>
                  <a
                    :class="activeClass === 'do_point' ? 'active' : 'deactivate'"
                    @click="handleChange('do_point')"
                    href="#"
                    :hidden="activeTransaction !== 'receive'"
                  >
                    Received from DropOff Point
                  </a>
                </li>
                <li>
                  <a
                    :class="activeClass === 'warehouse' ? 'active' : 'deactivate'"
                    @click="handleChange('warehouse')"
                    href="#"
                    :hidden="activeTransaction !== 'receive'"
                  >
                    Received from Warehouse
                  </a>
                </li>
                <li>
                  <a
                    :class="activeClass === 'do_post_summary' ? 'active' : 'deactivate'"
                    @click="handleChange('do_post_summary')"
                    href="#"
                    :hidden="activeTransaction !== 'receive'"
                  >
                    Post Summary
                  </a>
                </li>
                <li>
                  <a
                    :class="activeClass === 'transfer_ins' ? 'active' : 'deactivate'"
                    @click="handleChange('transfer_ins')"
                    href="#"
                    :hidden="activeTransaction !== 'transfer'"
                  >
                    Transfer In's
                  </a>
                </li>
                <li>
                  <a
                    :class="activeClass === 'transfer_outs' ? 'active' : 'deactivate'"
                    @click="handleChange('transfer_outs')"
                    href="#"
                    :hidden="activeTransaction !== 'transfer'"
                  >
                    Transfer Out's
                  </a>
                </li>
                <li>
                  <sdButton
                    size="extra-small"
                    type="warning"
                    @click="openmodal"
                    :hidden="activeTransaction !== 'transfer'"
                  >
                    <sdFeatherIcons type="plus" size="14" /> &nbsp; New Transfer
                  </sdButton>
                </li>
              </ul>
            </div>
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
                          v-show="activeClass === 'do_point'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="fromDropoffpoint"
                            :columns="do_columns"
                          >
                            <template #action="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  &nbsp;&nbsp;
                                  <sdButton
                                    @click="
                                      openReceiveModal(`receive`, record.distribution_id)
                                    "
                                    type="success"
                                    :disabled="record.status === 1"
                                    size="extra-small"
                                    >Receive</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        &nbsp;&nbsp;

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'warehouse'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="fromWarehouse"
                            :columns="columns"
                          >
                            <template #action="{}">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton type="success" size="extra-small"
                                    >Cancel</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <!-- Net TransfersIn table -->
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'transfer_ins'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="transferIns"
                            :columns="transferscolumns"
                          >
                            <template #status="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <span
                                    v-if="record.status == 1"
                                    class="badge badge-green"
                                    >Received</span
                                  >
                                  <span
                                    v-else-if="record.status == 2"
                                    class="badge badge-warning"
                                    >Cancelled</span
                                  >
                                  <span v-else class="badge badge-red">Pending</span>
                                </div>
                              </td>
                            </template>
                            <template #action="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  &nbsp;&nbsp;
                                  <sdButton
                                    @click="openReceiveModal(`transfers`, record.id)"
                                    type="success"
                                    :disabled="record.status == 1 || record.status == 2"
                                    size="extra-small"
                                    >Receive</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        <!-- end of Net Transfers table -->

                        <!-- Net TransfersOut table -->
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'transfer_outs'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="transferOuts"
                            :columns="transferscolumns"
                          >
                            <template #status="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <span
                                    v-if="record.status == 1"
                                    class="badge badge-green"
                                    >Received</span
                                  >
                                  <span
                                    v-else-if="record.status == 2"
                                    class="badge badge-warning"
                                    >Cancelled</span
                                  >
                                  <span v-else class="badge badge-red">Pending</span>
                                </div>
                              </td>
                            </template>
                            <template #action="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton
                                    type="success"
                                    :disabled="record.status == 1 || record.status == 2"
                                    @click="cancelTransfer(record.id)"
                                    size="extra-small"
                                    >Cancel</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        <!-- end of Net TransfersOut table -->

                        <!--Distribution Post Summary-->
                        <DistributionPostSummary
                          :post_id="query.id"
                          v-if="activeClass === 'do_post_summary'"
                        />
                        <!--End Distribution Post Summary-->

                        <!-- Transfer modal -->
                        <a-modal
                          title="New Transfer"
                          :visible="isModalOpen"
                          @cancel="handleCancel"
                          width="50%"
                          footer=""
                        >
                          <BasicFormWrapper>
                            <a-form
                              class="add-transfer-form"
                              :style="{ width: '100%' }"
                              layout="vertical"
                              name="addnew"
                              :model="trans_formState"
                              @finish="handleTransfer"
                            >
                              <a-form-item name="from_post_id" label="From Post">
                                <a-select
                                  placeholder="Select  Post "
                                  v-model:value="trans_formState.from_post_id"
                                  disabled
                                >
                                  <a-select-option
                                    v-for="post in postdata"
                                    :key="post.id"
                                    v-model:value="post.id"
                                  >
                                    {{ post.name }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>
                              <a-form-item name="to_post" label="To Post">
                                <a-select
                                  placeholder="Select  Post "
                                  v-model:value="trans_formState.to_post_id"
                                >
                                  <a-select-option
                                    v-for="post in postdata"
                                    :key="post.id"
                                    v-model:value="post.id"
                                  >
                                    {{ post.name }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>
                              <a-form-item name="no_of_nets" label="Number of nets">
                                <a-input
                                  v-model:value="trans_formState.number_of_nets"
                                  placeholder="Number of nets"
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item name="delivery_note_number" label="S11 No">
                                <a-input
                                  v-model:value="trans_formState.delivery_note_number"
                                  placeholder="S11 No"
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item name="comment" label="Comment">
                                <a-input
                                  v-model:value="trans_formState.comment"
                                  placeholder="Comment"
                                />
                              </a-form-item>
                              <div class="record-form-actions text-right">
                                <sdButton size="default" htmlType="Save" type="success">
                                  {{ isLoading ? "Loading..." : "Submit" }}
                                </sdButton>
                              </div>
                            </a-form>
                          </BasicFormWrapper>
                        </a-modal>
                        <!-- End of Transfer modal -->

                        <!-- receive nets modal -->
                        <a-modal
                          title="Receive Nets"
                          :visible="isOpen"
                          @cancel="handleCancelReceive"
                          width="50%"
                          footer=""
                        >
                          <BasicFormWrapper>
                            <a-form
                              class="add-transfer-form"
                              :style="{ width: '100%' }"
                              layout="vertical"
                              name="addnew"
                              :model="formState"
                              @finish="receiveNets"
                            >
                              <a-form-item name="date_received" label="Date Received">
                                <a-date-picker
                                  :style="{ width: '100%' }"
                                  v-model:value="formState.date_received"
                                  :format="dateFormat"
                                />
                              </a-form-item>
                              <div class="record-form-actions text-right">
                                <sdButton size="default" htmlType="Save" type="success">
                                  {{ isLoading ? "Loading..." : "Submit" }}
                                </sdButton>
                              </div>
                            </a-form>
                          </BasicFormWrapper>
                        </a-modal>
                        <!-- end of receive modal -->

                        <!-- Return nets modal -->
                        <a-modal
                          title="Return Nets"
                          :visible="returnsModalOpen"
                          @cancel="handleReturnsCancel"
                          width="50%"
                          footer=""
                        >
                          <BasicFormWrapper>
                            <a-form
                              class="add-transfer-form"
                              :style="{ width: '100%' }"
                              layout="vertical"
                              name="addnew"
                              :model="returns_formState"
                              @finish="handleReturns"
                            >
                              <a-form-item name="to_drop_off" label="To Drop Off Point">
                                <a-select
                                  placeholder="Select Drop Off Point "
                                  v-model:value="returns_formState.to_drop_off_point_id"
                                >
                                  <a-select-option
                                    v-for="dp in dropoffpoints"
                                    :key="dp.id"
                                    v-model:value="dp.id"
                                  >
                                    {{ dp.name }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>
                              <a-form-item name="no_of_nets" label="Number of nets">
                                <a-input
                                  v-model:value="returns_formState.number_of_nets"
                                  placeholder="Number of nets"
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item name="date_returned" label="Date Returned">
                                <a-date-picker
                                  :style="{ width: '100%' }"
                                  v-model:value="returns_formState.date_returned"
                                  :format="dateFormat"
                                />
                              </a-form-item>
                              <a-form-item name="delivery_note_number" label="S11 No">
                                <a-input
                                  :style="{ width: '100%' }"
                                  v-model:value="returns_formState.delivery_note_number"
                                  type="number"
                                />
                              </a-form-item>
                              <div class="record-form-actions text-right">
                                <sdButton size="default" htmlType="Save" type="success">
                                  {{ isLoading ? "Loading..." : "Submit" }}
                                </sdButton>
                              </div>
                            </a-form>
                          </BasicFormWrapper>
                        </a-modal>
                        <!-- end of return nets modal -->
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

<script setup>
import { Main, BasicFormWrapper } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { onMounted, ref, reactive } from "vue";
import DistributionPostSummary from "@/view/pages/net-distribution/DistributionPostSummary";
import authHeader from "../../../services/auth-header";
// import { useStore } from "vuex";
import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

const dateFormat = "YYYY-MM-DD";
const transferscolumns = [
  {
    title: "From Post",
    dataIndex: "from_post_name",
    key: "id",
  },
  {
    title: "To Post",
    dataIndex: "to_post_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "number_of_nets",
    key: "id",
  },
  {
    title: "Date of Transfer",
    dataIndex: "date_issued",
    key: "id",
  },
  {
    title: "Issued By",
    dataIndex: "issued_by",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
    slots: { customRender: "status" },
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "id",
    slots: { customRender: "action" },
  },
];

const do_columns = [
  {
    title: "Drop Off Point",
    dataIndex: "drop_off_point_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "quantity_issued",
    key: "id",
  },
  {
    title: "Date of Issue",
    dataIndex: "issue_date",
    key: "id",
  },
  {
    title: "Issued By",
    dataIndex: "issued_by",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "id",
    slots: { customRender: "action" },
  },
];

const columns = [
  {
    title: "From Post",
    dataIndex: "from_post_name",
    key: "id",
  },
  {
    title: "To Post",
    dataIndex: "to_post_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "number_of_nets",
    key: "id",
  },
  {
    title: "Date of Transfer",
    dataIndex: "date_issued",
    key: "id",
  },
  {
    title: "Issued By",
    dataIndex: "issued_by",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "id",
    slots: { customRender: "action" },
  },
];
// const { state } = useStore();
// const crud = computed(() => state.crud.data);
// const isLoading = computed(() => state.crud.loading);
// const selectedRowKeys = ref([]);
const activeClass = ref("do_point");
const activeTransaction = ref("receive");
const transaction_type = ref("");
const postdata = ref([]);
const dropoffpoints = ref([]);
const fromWarehouse = ref([]);
const fromDropoffpoint = ref([]);
const transferIns = ref([]);
const transferOuts = ref([]);
const { query } = useRoute();
const isOpen = ref(false);
const post_id = query.id;
const isModalOpen = ref(false);
const returnsModalOpen = ref(false);
const post_name = query.name;

const formState = reactive({
  date_received: "",
  distribution_id: "",
});

const trans_formState = reactive({
  from_post_id: Number(query.id),
  to_post_id: "",
  number_of_nets: "",
  comment: "",
  date_received: "",
  transfer_id: "",
});

const returns_formState = reactive({
  from_post_id: Number(query.id),
  to_drop_off_point_id: "",
  number_of_nets: "",
  date_returned: "",
});

onMounted(() => {
  fetchPosts();
  // receiveFromWarehouse();
  fetchDropoff();
  receiveFromDropOff();
  fetchTransferIns();
  fetchTransferOuts();
});
const handleChange = (tab) => (activeClass.value = tab);
const openmodal = () => (isModalOpen.value = true);
const openReturnsModal = () => (returnsModalOpen.value = true);
const handleCancel = () => (isModalOpen.value = false);
const handleCancelReceive = () => (isOpen.value = false);
const handleReturnsCancel = () => (returnsModalOpen.value = false);

const handleTransactions = (tab) => {
  activeTransaction.value = tab;
  tab === "receive"
    ? handleChange("do_point")
    : tab === "transfer"
    ? handleChange("transfer_ins")
    : tab === "return"
    ? openReturnsModal()
    : null;
};

const openReceiveModal = (type, id) => {
  type === "receive"
    ? ((formState.distribution_id = id), (transaction_type.value = "receive"))
    : ((trans_formState.transfer_id = id), (transaction_type.value = "transfers"));
  isOpen.value = true;
};

const fetchPosts = async () => {
  try {
    await fetch(`${process.env.VUE_APP_BASE_URL}/posts_data`, {
      method: "GET",
      headers: authHeader(),
    })
      .then((response) => response.json())
      .then((data) => {
        postdata.value = data.data;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const fetchDropoff = async () => {
  try {
    await fetch(`${process.env.VUE_APP_BASE_URL}/get_all_drop_off_points`, {
      method: "GET",
      headers: authHeader(),
    })
      .then((response) => response.json())
      .then((data) => {
        dropoffpoints.value = data.data;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const handleTransfer = () => {
  const data = {
    from_post_id: trans_formState.from_post_id,
    to_post_id: trans_formState.to_post_id,
    number_of_nets: trans_formState.number_of_nets,
    delivery_note_number: trans_formState.delivery_note_number,
    comment: trans_formState.comment,
  };
  console.log(JSON.stringify(data));
  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/transfer-nets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `${message}`,
          });
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        isModalOpen.value = false;
        trans_formState.to_post_id = "";
        trans_formState.number_of_nets = "";
        trans_formState.comment = "";
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const handleReturns = () => {
  const data = {
    from_post_id: returns_formState.from_post_id,
    to_drop_off_point_id: returns_formState.to_drop_off_point_id,
    number_of_nets: returns_formState.number_of_nets,
    date_returned: dayjs(returns_formState.date_returned).format("YYYY-MM-DD"),
    delivery_note_number: returns_formState.delivery_note_number,
  };
  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/return_nets_to_drop_off_point`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `Successfully returned nets to drop off point`,
          });
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        returnsModalOpen.value = false;

        returns_formState.to_drop_off_point_id = "";
        returns_formState.number_of_nets = "";
        returns_formState.date_returned = "";
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const receiveNets = async () => {
  const data = {
    transfer_id: trans_formState.transfer_id,
    date_received: dayjs(formState.date_received).format("YYYY-MM-DD"),
    status: 1,
  };
  const rec_data = {
    date_received: dayjs(formState.date_received).format("YYYY-MM-DD"),
  };
  const payload =
    transaction_type.value === "transfers"
      ? data
      : transaction_type.value === "receive"
      ? rec_data
      : null;
  const url =
    transaction_type.value === "transfers"
      ? "receive_nets_from_post"
      : transaction_type.value === "receive"
      ? `receive_nets_from_dropoff_point/${formState.distribution_id}/${post_id}`
      : null;

  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then(({ success }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `Received successfully`,
          });
        } else {
          notification.error({
            message: "Error",
            description: "Only post supervisor can receive nets, contact SCMCC.",
          });
        }
        isModalOpen.value = false;
        //  window.location.reload();
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const receiveFromDropOff = async () => {
  try {
    await fetch(`${process.env.VUE_APP_BASE_URL}/post_supplies_list/${post_id}/1`, {
      method: "GET",
      headers: authHeader(),
    })
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          data.length > 0
            ? (fromDropoffpoint.value = data)
            : (fromDropoffpoint.value = []);
        } else {
          notification.error({
            message: "Error",
            description: `${data.message}`,
          });
        }
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const fetchTransferOuts = async () => {
  try {
    await fetch(`${process.env.VUE_APP_BASE_URL}/post_nets_transfer_list/${query.id}/1`, {
      method: "GET",
      headers: authHeader(),
    })
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          transferOuts.value = data;
        } else {
          notification.error({
            message: "Error",
            description: `${data.message}`,
          });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const fetchTransferIns = async () => {
  try {
    await fetch(`${process.env.VUE_APP_BASE_URL}/post_nets_transfer_list/${query.id}/2`, {
      method: "GET",
      headers: authHeader(),
    })
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          transferIns.value = data;
        } else {
          notification.error({
            message: "Error",
            description: `${data.message}`,
          });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const cancelTransfer = async (id) => {
  try {
    await fetch(`${process.env.VUE_APP_BASE_URL}/cancel_post_net_transfer/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: null,
    })
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `${message}`,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};
</script>
<style scoped>
.badge-green {
  background-color: #1ec997;
  color: white;
  /* padding: 2px;
      border-radius: 3px; */
  /* size */
  font-size: 12px;
}
.badge-warning {
  background-color: #f7b924;
  color: white;
  /* padding: 2px;
      border-radius: 3px; */
  /* size */
  font-size: 12px;
}
.badge-red {
  background-color: #f0506e;
  color: white;
  /* padding: 2px;
      border-radius: 3px; */
  /* size */
  font-size: 12px;
}
.title-success {
  color: green;
}
</style>
<style scoped>
.icon-color-white {
  color: white;
}
</style>
<style>
.full-modal {
  .ant-modal {
    max-width: 50%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(70vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
