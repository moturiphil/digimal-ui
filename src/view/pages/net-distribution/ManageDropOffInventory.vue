<template>
  <div>
    <sdPageHeader ghost :title="`Manage Inventory at ${drop_off_name}`" />
    <Main>
      <SearchResultWrapper>
        <div class="button-container">
          <sdButton class="button-container" size="extra-small" type="success">
            <router-link
              :to="{
                path: `/receive-nets/`,
                query: {
                  id: drop_off_id,
                  name: drop_off_name,
                  campaign_id: drop_off_campaign_id,
                },
              }"
              class="btn-icon"
              type="info"
              shape="circle"
            >
              Receive Nets
            </router-link>
          </sdButton>
          &nbsp;&nbsp;
          <!-- @click="openModalAll('assignPost')" -->
          <sdButton class="button-container" size="extra-small" type="success">
            <router-link
              :to="{
                path: `/dropoff/assign-posts`,
                query: {
                  id: drop_off_id,
                  name: drop_off_name,
                },
              }"
              class="btn-icon"
              type="info"
              shape="circle"
            >
              Assign Posts
            </router-link>
            <!-- Assign Posts -->
          </sdButton>
          &nbsp;&nbsp;
          <sdButton class="button-container" size="extra-small" type="success">
            <router-link
              :to="{
                path: `/nets/nets-transfer-dropoff`,
                query: {
                  id: drop_off_id,
                },
              }"
              class="btn-icon"
              type="info"
              shape="circle"
            >
              Net Transfers
            </router-link>
          </sdButton>
          &nbsp;&nbsp;
          <sdButton
            class="button-container"
            size="extra-small"
            type="success"
            @click="openModal(drop_off_id)"
          >
            Issue Nets
          </sdButton>
          &nbsp;&nbsp;
          <sdButton class="button-container" size="extra-small" type="success">
            <router-link
              :to="{
                path: `/nets/receive-nets-dropoff`,
                query: {
                  id: drop_off_id,
                  name: drop_off_name,
                },
              }"
              class="btn-icon"
              type="info"
              shape="circle"
            >
              Returned Nets
            </router-link>
          </sdButton>
          &nbsp;&nbsp;

          <sdButton
            class="button-container"
            :class="activeClass === 'post_orders' ? 'active' : 'deactivate'"
            @click="handleTransactions('post_orders')"
            href="#"
            size="extra-small"
            type="success"
          >
            Manage Orders
          </sdButton>
        </div>
        <div class="button-container" style="margin-top: 4px">
          <a-row>
            <a-col class="alert-col">
              <a-alert
                :message="`You have ${generations} Pending Generations`"
                type="warning"
                closable
                @close="onClose"
              />
            </a-col>
            <a-col class="alert-col">
              <a-alert
                :message="`You have ${approvals} Pending Approvals`"
                type="warning"
                closable
                @close="onClose"
              />
            </a-col>
            <a-col class="alert-col">
              <a-alert
                :message="`You have ${deliveries} Pending Deliveries`"
                type="warning"
                closable
                @close="onClose"
              />
            </a-col>
          </a-row>
        </div>
        <div class="search-filter-menu">
          <ul>
            <li>
              <a
                :class="
                  activeClass === 'posts_summary' ? 'active' : 'deactivate'
                "
                @click="handleChange('posts_summary')"
                href="#"
                :hidden="activeTransaction !== 'post_orders'"
              >
                Post Summary
              </a>
            </li>
            <li>
              <a
                :class="activeClass === 'orders' ? 'active' : 'deactivate'"
                @click="handleChange('orders')"
                href="#"
                :hidden="activeTransaction !== 'post_orders'"
              >
                Orders
              </a>
            </li>
            <li>
              <a
                :class="
                  activeClass === 'serviced_orders' ? 'active' : 'deactivate'
                "
                @click="handleChange('serviced_orders')"
                href="#"
                :hidden="activeTransaction !== 'post_orders'"
              >
                Serviced Orders
              </a>
            </li>
          </ul>
        </div>

        <br />
        <br />

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
                          v-show="activeClass === 'nets_returned'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="returnedNets"
                            :columns="columns"
                          >
                            <template v-slot:title>
                              <h3><u>Returned Nets</u></h3>
                            </template>
                            <template #action="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  &nbsp;&nbsp;
                                  <sdButton
                                    @click="openReceiveModal(record.id)"
                                    type="success"
                                    :disabled="
                                      record.status == 1 || record.status == 2
                                    "
                                    size="extra-small"
                                    >Receive</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        &nbsp;&nbsp;

                        <!-- post orders -->
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'orders'"
                        >
                          <sdButton
                            class="button-container"
                            style="float: right; margin-bottom: 10px"
                            :class="
                              activeClass === 'orders' ? 'active' : 'deactivate'
                            "
                            @click="approveOrders()"
                            href="#"
                            size="extra-small"
                            type="warning"
                          >
                            Approve Orders
                          </sdButton>
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="postOrders"
                            :columns="postOrdersColumns"
                          >
                            <!-- <template #action="{record}">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <div v-if="record.status==3">
                                    <sdButton type="success" size="extra-small"
                                      >Verify</sdButton>
                                  </div>
                                  <div v-else-if="record.status==0">
                                    <sdButton type="success" size="extra-small"
                                      >Approve</sdButton>
                                  </div>
                                </div>
                              </td>
                            </template> -->
                            <template #status="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <span
                                    v-if="record.status == 6"
                                    class="badge badge-blue"
                                    >Submitted</span
                                  >
                                  <span
                                    v-else-if="record.status == 5"
                                    class="badge badge-green"
                                    >Approved</span
                                  >
                                  <span
                                    v-else-if="record.status == 0"
                                    class="badge badge-red"
                                    >Pending Approval</span
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        <!-- end post orders -->

                        <!-- post summary -->
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'posts_summary'"
                        >
                          <sdButton
                            class="button-container"
                            style="float: right; margin-bottom: 10px"
                            :class="
                              activeClass === 'orders' ? 'active' : 'deactivate'
                            "
                            @click="openGO()"
                            href="#"
                            size="extra-small"
                            type="warning"
                          >
                            Generate New Order
                          </sdButton>
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="postSummary"
                            :columns="postSummaryCol"
                          >
                            <!-- <template #action="{record}">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <div v-if="record.status==3">
                                    <sdButton type="success" size="extra-small"
                                      >Verify</sdButton>
                                  </div>
                                  <div v-else-if="record.status==0">
                                    <sdButton type="success" size="extra-small"
                                      >Approve</sdButton>
                                  </div>
                                </div>
                              </td>
                            </template> -->
                          </a-table>
                        </TableWrapper>
                        <!-- end of post summary -->

                        <!-- serviced orders -->
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'serviced_orders'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="servicedOrders"
                            :columns="serviceOrdersColumns"
                          ></a-table>
                        </TableWrapper>
                        <!-- end serviced orders -->

                        <!-- Receive nets -->
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
                              <a-form-item
                                name="date_received"
                                label="Date Received"
                              >
                                <a-date-picker
                                  :style="{ width: '100%' }"
                                  v-model:value="formState.date_received"
                                  :format="dateFormat"
                                />
                              </a-form-item>
                              <div class="record-form-actions text-right">
                                <sdButton
                                  size="default"
                                  htmlType="Save"
                                  type="success"
                                >
                                  {{ isLoading ? "Loading..." : "Submit" }}
                                </sdButton>
                              </div>
                            </a-form>
                          </BasicFormWrapper>
                        </a-modal>
                        <!-- End of receive nets -->

                        <!-- Issue modal -->
                        <a-modal
                          title="Issue Nets"
                          :visible="isModalOpen_issuenets"
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
                              @finish="handleIssue"
                            >
                              <a-form-item name="post_id" label="To Post">
                                <a-select
                                  placeholder="Select  Post "
                                  v-model:value="formState.post_id"
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
                              <a-form-item name="bale_size" label="Bale Size">
                                <a-select
                                  v-model:value="formState.bale_size"
                                  placeholder="Select Bale Size"
                                >
                                  <a-select-option value="40"
                                    >40</a-select-option
                                  >
                                  <a-select-option value="50"
                                    >50</a-select-option
                                  >
                                </a-select>
                              </a-form-item>
                              <a-form-item
                                name="no_of_bales"
                                label="Number of bales"
                              >
                                <a-input
                                  v-model:value="formState.number_of_bales"
                                  placeholder="Number of bales"
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item
                                name="no_of_pieces"
                                label="Number of Loose Pieces"
                              >
                                <a-input
                                  v-model:value="formState.no_of_pieces"
                                  placeholder="Enter number of pieces"
                                  type="number"
                                  @change="validateNoOfPieces"
                                />
                              </a-form-item>

                              <a-form-item
                                name="S11 Serial Number"
                                label="S11 Serial Number"
                              >
                                <a-input
                                  v-model:value="formState.delivery_note_number"
                                  placeholder="S11 Serial Number"
                                />
                              </a-form-item>
                              <div class="record-form-actions text-right">
                                <sdButton
                                  size="default"
                                  htmlType="Save"
                                  type="success"
                                >
                                  {{ isLoading ? "Loading..." : "Submit" }}
                                </sdButton>
                              </div>
                            </a-form>
                          </BasicFormWrapper>
                        </a-modal>
                        <!-- End of Issue modal -->

                        <!-- generate orders -->
                        <a-modal
                          title="Generate Orders"
                          :visible="isModalOpen_GO"
                          @cancel="handleCancelGO"
                          width="50%"
                          footer=""
                        >
                          <BasicFormWrapper>
                            <a-form
                              class="add-transfer-form"
                              :style="{ width: '100%' }"
                              layout="vertical"
                              name="addnew"
                              :model="newOrder"
                              @finish="generateOrders"
                            >
                              <a-form-item
                                name="check"
                                label="Generate for all posts?"
                              >
                                <a-checkbox
                                  v-model:checked="checked"
                                  @change="clearSelected(checked)"
                                  >For all</a-checkbox
                                >
                              </a-form-item>
                              <a-form-item name="post_id" label="Post">
                                <a-select
                                  placeholder="Select  Post "
                                  v-model:value="newOrder.post_id"
                                  mode="multiple"
                                  showSearch
                                  allowClear
                                  option-filter-prop="label"
                                  :disabled="checked"
                                >
                                  <a-select-option
                                    v-for="post in dropoffPosts"
                                    :key="post.id"
                                    v-model:value="post.id"
                                    :label="`${post.name} - ${post.code}`"
                                  >
                                    {{ post.name }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>
                              <a-form-item name="order_type" label="Order type">
                                <!-- <a-select
                                      v-model:value="newOrder.order_type"
                                      placeholder="Select Bale Size"
                                    >
                                      <a-select-option value="40">40</a-select-option>
                                      <a-select-option value="50">50</a-select-option>
                                    </a-select> -->
                                <a-input
                                  v-model:value="newOrder.order_type"
                                  placeholder="Order type"
                                  :disabled="true"
                                />
                              </a-form-item>
                              <a-form-item name="source" label="Source">
                                <a-select
                                  v-model:value="newOrder.source"
                                  placeholder="Select Source"
                                >
                                  <a-select-option value="1"
                                    >KEMSA</a-select-option
                                  >
                                  <a-select-option value="2"
                                    >MEDS</a-select-option
                                  >
                                </a-select>
                              </a-form-item>
                              <a-form-item
                                name="product_code"
                                label="Product Code"
                              >
                                <a-select
                                  v-model:value="newOrder.product_code"
                                  placeholder="Select Product"
                                  @change="handleProductChange"
                                >
                                  <a-select-option
                                    v-for="product in productList"
                                    :key="product.id"
                                    v-model:value="product.item_code"
                                  >
                                    {{ product.item_code }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>

                              <a-form-item
                                name="product_name"
                                label="Product Name"
                              >
                                <a-input
                                  v-model:value="newOrder.product_name"
                                  placeholder="Product Name"
                                  :disabled="true"
                                />
                              </a-form-item>
                              <div class="record-form-actions text-right">
                                <sdButton
                                  size="default"
                                  htmlType="Save"
                                  type="success"
                                >
                                  {{ isLoading ? "Loading..." : "Submit" }}
                                </sdButton>
                              </div>
                            </a-form>
                          </BasicFormWrapper>
                        </a-modal>
                        <!-- end generate orders -->

                        <!-- assign posts to dropoff -->
                        <a-modal
                          title="Assign Posts"
                          :visible="isModalOpen_assignPosts"
                          @cancel="closeModalAll('assignPost')"
                          width="50%"
                          footer=""
                        >
                          <BasicFormWrapper>
                            <a-form
                              class="add-record-form"
                              :style="{ width: '100%' }"
                              layout="vertical"
                              name="addnew"
                              :model="formState"
                              @finish="handleSubmit"
                            >
                              <a-form-item label="Distribution Posts">
                                <a-transfer
                                  :dataSource="distribution_posts"
                                  showSearch
                                  :targetKeys="targetKeys"
                                  :render="(item) => item.title"
                                  :filterOption="filterOption"
                                  @change="handleChangeAssignPosts"
                                  :listStyle="{
                                    width: '500px',
                                    height: '500px',
                                  }"
                                >
                                </a-transfer>
                              </a-form-item>
                              <div class="record-form-actions text-right">
                                <sdButton
                                  size="default"
                                  htmlType="Save"
                                  type="success"
                                >
                                  {{ isLoading ? "Loading..." : "Submit" }}
                                </sdButton>
                              </div>
                            </a-form>
                          </BasicFormWrapper>
                        </a-modal>
                        <!-- end of assigndropoff -->

                        <!-- confirmation modal -->
                        <a-modal
                          title="Confirmation"
                          :visible="isModalOpen_confirmation"
                          @cancel="closeModalAll('confirmation')"
                          width="50%"
                          onOk="{approveOrders}"
                          onCancel="{handleCancel}"
                        ></a-modal>
                        <!-- end of confirmation -->
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
import { Main, BasicFormWrapper, TableWrapper } from "../../styled";
import { SearchResultWrapper } from "./../style";
import {
  onMounted,
  ref,
  reactive,
  // createVNode
} from "vue";
import authHeader from "../../../services/auth-header";
//import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
// import { useStore } from "vuex";
//import { Modal } from "ant-design-vue";
import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

const dateFormat = "YYYY-MM-DD";

const columns = [
  {
    title: "From Post",
    dataIndex: "from_post_id_name",
    key: "id",
  },
  {
    title: "To Drop Off Point",
    dataIndex: "to_drop_off_point_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "number_of_nets",
    key: "id",
  },
  {
    title: "Date Returned",
    dataIndex: "date_returned",
    key: "id",
  },
  {
    title: "Returned By",
    dataIndex: "returned_by",
    key: "id",
  },
  // {
  //   title: "Status",
  //   dataIndex: "status",
  //   key: "id",
  // },
  {
    title: "Action",
    dataIndex: "action",
    key: "id",
    slots: { customRender: "action" },
  },
];

const postOrdersColumns = [
  {
    title: "Order Reference",
    dataIndex: "order_reference",
    key: "id",
  },
  {
    title: "Post Name",
    dataIndex: "post",
    key: "id",
  },
  {
    title: "Post Code",
    dataIndex: "post_code",
    key: "id",
  },
  {
    title: "Product Code",
    dataIndex: "product_code",
    key: "id",
  },
  {
    title: "Product Name",
    dataIndex: "product_name",
    key: "id",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "id",
  },
  {
    title: "Date ordered",
    dataIndex: "date_ordered",
    key: "id",
  },
  {
    title: "Ordered By",
    dataIndex: "ordered_by",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
    slots: { customRender: "status" },
  },
  // {
  //   title: "Action",
  //   dataIndex: "action",
  //   key: "id",
  //   slots: { customRender: "action" },
  // }
];

const postSummaryCol = [
  {
    title: "Post Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "No of Households",
    dataIndex: "households",
    key: "id",
  },
  {
    title: "Verified Households",
    dataIndex: "households_verified",
    key: "id",
  },
  {
    title: "Number of nets required",
    dataIndex: "nets_required",
    key: "id",
  },
];

const serviceOrdersColumns = [
  {
    title: "To Post Name",
    dataIndex: "to_post_name",
    key: "id",
  },
  {
    title: "Quantity Issued",
    dataIndex: "quantity_issued",
    key: "id",
  },
  {
    title: "Issue Date",
    dataIndex: "issue_date",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    slots: { customRender: "status" },
    key: "id",
  },
];

//const dataSource = ref([]);
const activeClass = ref("nets_returned");
const activeTransaction = ref("nets_returned");
const deliveries = ref(0);
const generations = ref(0);
const approvals = ref(0);
const postdata = ref([]);
const returnedNets = ref([]);
const postOrders = ref([]);
const dropoffPosts = ref([]);
const productList = ref([]);
const distribution_posts = ref([]);
const servicedOrders = ref([]);
const postSummary = ref([]);
const targetKeys = ref([]);
const { query } = useRoute();
const drop_off_name = query.name;
const drop_off_id = query.id;
// const drop_off_campaign = query.campaign_id;
const checked = ref(false);
// const handleOk = async () => (isModalOpen_issuenets.value = false);
const handleCancelReceive = () => (isOpen.value = false);
const handleChange = (tab) => (activeClass.value = tab);
const isOpen = ref(false);
const isModalOpen_issuenets = ref(false); //issue modal form
const isModalOpen_GO = ref(false); //generate order modal form
const isModalOpen_assignPosts = ref(false); //assignpost modal form
const isModalOpen_receiveNets = ref(false); //receive nets modal form
const isModalOpen_confirmation = ref(false); //confirmation modal form
// const openmodal = () => (isModalOpen_issuenets.value = true);
const distributionposts_url = `${process.env.VUE_APP_BASE_URL}/sub_county_posts?drop_off_point_id=${drop_off_id}`;
const drop_off_posts_url = `${process.env.VUE_APP_BASE_URL}/posts_dropoff`;

const formState = reactive({
  date_received: "",
  returned_id: "",
});
const newOrder = reactive({
  checked: checked,
  post_id: [],
  order_type: "REGULAR",
  source: "",
  product_code: "",
  product_name: "",
});

const onClose = (e) => {
  console.log(e, "I was closed.");
};

const handleTransactions = (tab) => {
  activeTransaction.value = tab;
  tab === "post_orders"
    ? handleChange("posts_summary")
    : // : tab === "transfer"
      //   ? handleChange("transfer_ins")
      //   : tab === "return"
      //     ? openReturnsModal()
      null;
};

const openReceiveModal = (id) => {
  formState.returned_id = id;
  isOpen.value = true;
};

const openModal = (id) => {
  isModalOpen_issuenets.value = true;
  formState.drop_off_point_id = id;
};

const openGO = () => (isModalOpen_GO.value = true);
const handleCancelGO = () => (isModalOpen_GO.value = false);

// const openModalAll = (type) => {
//   switch (type) {
//     case "assignPost":
//       isModalOpen_assignPosts.value = true;
//       break;
//     case "generateOrder":
//       isModalOpen_GO.value = true;
//       break;
//     case "issueNets":
//       isModalOpen_issuenets.value = true;
//       break;
//     case "receiveNets":
//       isModalOpen_receiveNets.value = true;
//       break;
//     case "confirmation":
//       isModalOpen_confirmation.value = true;
//       break;

//     default:
//       break;
//   }
// };
const closeModalAll = (type) => {
  switch (type) {
    case "assignPost":
      isModalOpen_assignPosts.value = false;
      break;
    case "generateOrder":
      isModalOpen_GO.value = false;
      break;
    case "issueNets":
      isModalOpen_issuenets.value = false;
      break;
    case "receiveNets":
      isModalOpen_receiveNets.value = false;
      break;
    case "confirmation":
      isModalOpen_confirmation.value = false;
      break;

    default:
      isModalOpen_assignPosts.value = false;
      isModalOpen_confirmation.value = false;
      isModalOpen_GO.value = false;
      isModalOpen_receiveNets.value = false;

      break;
  }
};

// const confirm = () => {
//   Modal.confirm({
//     title: "Confirm",
//     icon: createVNode(ExclamationCircleOutlined),
//     content: "Are you sure you want to approve all orders?",
//     okText: "OK",
//     cancelText: "Cancel",
//   });
// };

const approveOrders = async () => {
  const data = {
    drop_off_point_id: drop_off_id,
  };
  try {
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/approve_orders_per_drop_off_point`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `${data}`,
          });
        } else {
          notification.info({
            message: "Info",
            description: `${data}`,
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
const handleChangeAssignPosts = (newTargetKeys) => {
  targetKeys.value = newTargetKeys; // Update directly
  formState.post_ids = newTargetKeys;
};
const filterOption = (inputValue, option) => {
  return option.title.indexOf(inputValue) > -1;
};
const fetchDropoffPosts = async () => {
  const dropoffid = {
    drop_off_point_id: drop_off_id,
  };
  try {
    const assignedPosts = [];
    const response = await fetch(drop_off_posts_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(dropoffid),
    });

    const data = await response.json();

    console.log(data.data);

    if (data.data) {
      const posts_data = data.data;
      for (let i = 0; i < posts_data.length; i++) {
        const element = {
          key: posts_data[i].distribution_post_id,
          title: posts_data[i].name,
        };
        assignedPosts.push(element);
      }
      targetKeys.value = assignedPosts.map((post) => post.key); // Update directly
      console.log(targetKeys.value);
    } else {
      console.error("Data or data.name is undefined:", data);
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: `Error: ${error}`,
    });
  }
};

const fetchDistributionPosts = async () => {
  try {
    const posts = [];
    const response = await fetch(distributionposts_url, {
      method: "GET",
      headers: authHeader(),
    });

    const data = await response.json();
    const posts_data = data.data;

    for (let i = 0; i < posts_data.length; i++) {
      const element = {
        key: posts_data[i].id,
        title: posts_data[i].name,
      };
      posts.push(element);
    }

    distribution_posts.value = posts;
  } catch (error) {
    notification.error({
      message: "Error",
      description: `Error: ${error}`,
    });
  }
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

const fetchReturnedNets = async () => {
  try {
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/returned_nets_list/${query.id}`,
      {
        method: "GET",
        headers: authHeader(),
      }
    )
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          returnedNets.value = data;
        } else {
          notification.warning({
            message: "Info",
            description: `${data}`,
          });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen_issuenets.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const fetchPostOrders = () => {
  const dropoffid = {
    drop_off_point_id: drop_off_id,
  };
  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/per_droppoff_point_post_orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(dropoffid),
    })
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          postOrders.value = data;
        } else {
          notification.info({
            message: "Info",
            description: `${data}`,
          });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen_issuenets.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

// const fetchPostSummary = ()=>{
//   const dropoffid ={
//     "drop_off_point_id":drop_off_id
//   }
//   try {
//     fetch(`${process.env.VUE_APP_BASE_URL}/drop_off_point_posts_summary`,
//     {
//       method: "POST",
//       headers:{
//           "Content-Type": "application/json",
//           ...
//          authHeader()
//         },
//       body: JSON.stringify(dropoffid),
//     })
//     .then((response) => response.json())
//     .then(({success, data}) => {
//       if(success){
//         postSummary.value = data;
//       }else{
//         notification.info({
//           message: "Info",
//           description: `${data}`
//         });
//       }
//     })
//     .catch((error)=>{
//       notification.error({
//         message: "Error",
//         description: `${error}`
//       });
//       isModalOpen_issuenets.value = false;
//     })
//   } catch (error) {
//     notification.error({
//       message: "Error",
//       description: `${error}`
//     });
//   }
// }

const fetchPostSummary = () => {
  const dropoffid = {
    drop_off_point_id: drop_off_id,
  };
  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/drop_off_point_posts_summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(dropoffid),
    })
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          postSummary.value = data;
        } else {
          notification.info({
            message: "Info",
            description: `${data}`,
          });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen_issuenets.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const fetchdropoffPosts = () => {
  const dropoffid = {
    drop_off_point_id: drop_off_id,
  };
  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/posts_dropoff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(dropoffid),
    })
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          dropoffPosts.value = data;
        } else {
          notification.error({
            message: "Error",
            description: `${data}`,
          });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen_issuenets.value = false;
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
    date_received: dayjs(formState.date_received).format("YYYY-MM-DD"),
  };

  try {
    fetch(
      `${process.env.VUE_APP_BASE_URL}/receive_nets_from_post/${formState.returned_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `Received successfully`,
          });
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        isOpen.value = false;
        window.location.reload();
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isOpen.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const handleIssue = async () => {
  try {
    const data = {
      post_id: formState.post_id,
      drop_off_point_id: formState.drop_off_point_id,
      bale_size: formState.bale_size,
      number_of_bales: formState.number_of_bales,
      number_of_pieces: formState.no_of_pieces,
      issue_date: new Date().toISOString().substr(0, 10),
      delivery_note_number: formState.delivery_note_number,
    };

    console.log(JSON.stringify(data));
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/issue_nets_from_drop_off_to_post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `Issued successfully`,
          });
          isModalOpen_issuenets.value = false;
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        isModalOpen_issuenets.value = false;
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

const getProductList = () => {
  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/product_code_list`, {
      method: "GET",
      headers: authHeader(),
    })
      .then((response) => response.json())
      .then((data) => {
        productList.value = data.data;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const handleProductChange = (value) => {
  const product = productList.value.find(
    (product) => product.item_code === value
  );
  newOrder.product_name = product.item_name;
};

const clearSelected = (checked) => {
  if (checked) {
    newOrder.post_id = [];
  }
  // selectedRowKeys.value = [];
};

const generateOrders = () => {
  const data = {
    for_all_posts: newOrder.checked,
    order_type: newOrder.order_type,
    target_fulfiller_source: newOrder.source,
    product_code: newOrder.product_code,
    product_name: newOrder.product_name,
  };
  // newOrder.checked ? data.post_id = newOrder.post_id : data.drop_off_point_id = drop_off_id
  if (!newOrder.checked) {
    data.post_id = newOrder.post_id;
  } else {
    data.drop_off_point_id = drop_off_id;
  }

  // console.log(JSON.stringify( data));
  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/create_post_orders`, {
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
            description: `Order generated successfully`,
          });
          isModalOpen_GO.value = false;
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        isModalOpen_GO.value = false;
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

// servicedOrders
const fetchServicedOrders = async () => {
  const dropoffid = {
    drop_off_point_id: drop_off_id,
  };
  try {
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/linelist_net_issuance_to_post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(dropoffid),
      }
    )
      .then((response) => response.json())
      .then(({ data }) => {
        // servicedOrders.value = data;
        servicedOrders.value = data.map((serviced_order) => {
          const statusText =
            serviced_order.status === 1 ? "Delivered" : "Received";
          return { ...serviced_order, status: statusText };
        });
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen_issuenets.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

onMounted(() => {
  fetchPosts();
  fetchReturnedNets();
  fetchPostOrders();
  fetchServicedOrders();
  fetchdropoffPosts();
  getProductList();
  fetchDistributionPosts();
  fetchPostSummary();
  fetchDropoffPosts();
});
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
.badge-blue {
  background-color: rgb(0, 140, 255);
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
.full-modal {
  max-width: 50%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}

.full-modal .ant-modal-content {
  display: flex;
  flex-direction: column;
  height: calc(70vh);
}

.full-modal .ant-modal-body {
  flex: 1;
}
.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.alert-col {
  margin: 4px;
}
.custom-button {
  font-size: 1rem;
  margin: 0.5rem; /* Adjust as needed */
}

@media screen and (min-width: 600px) {
  .custom-button {
    /* Additional styles for larger screens */
  }
}
</style>
