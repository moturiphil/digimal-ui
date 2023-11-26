<template>
    <div>
      <sdPageHeader ghost :title="`Manage Inventory at ${drop_off_name}`" />
      <Main>
        <div class="button-container">
          <sdButton class="button-container"  size="extra-small" type="success">
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
              @click="handleChange('post_orders')"
              href="#"
              size="extra-small" type="success"
            >
              Orders List
            </sdButton>
              
        </div>
        <br>
        <br>
  
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
                              <h3> <u>Returned Nets</u></h3>
                            </template>
                              <template #action="{ record }">
                                <td :style="{ 'margin-left': '4px' }">
                                  <div class="table-actions">
                                    &nbsp;&nbsp;
                                    <sdButton
                                      @click="openReceiveModal(record.id)"
                                      type="success"
                                      :disabled = "record.status == 1"
                                      size="extra-small">Receive</sdButton>
                                  </div>
                                </td>
                              </template>
                            </a-table>
                          </TableWrapper>
                          &nbsp;&nbsp;

                          <!-- post orders -->
                          <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'post_orders'"
                        >
                            <sdButton
                              class="button-container"
                              style="float: right; margin-bottom: 10px;"
                              :class="activeClass === 'post_orders' ? 'active' : 'deactivate'"
                              @click="openGO()"
                              href="#"
                              size="extra-small" type="warning"
                            >
                              Generate New Order
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
                          </a-table>
                        </TableWrapper>

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


                            <!-- Issue modal -->
                            <a-modal
                              title="Issue Nets"
                              :visible="isModalOpen"
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
                                      <a-select-option value="40">40</a-select-option>
                                      <a-select-option value="50">50</a-select-option>
                                    </a-select>
                                  </a-form-item>
                                  <a-form-item name="no_of_bales" label="Number of bales">
                                    <a-input
                                      v-model:value="formState.number_of_bales"
                                      placeholder="Number of bales"
                                      type="number"
                                    />
                                  </a-form-item>
                                  <a-form-item name="no_of_pieces" label="Number of Loose Pieces">
                                    <a-input
                                      v-model:value="formState.no_of_pieces"
                                      placeholder="Enter number of pieces"
                                      type="number"
                                      @change="validateNoOfPieces"
                                    />
                                  </a-form-item>

                                  <a-form-item name="S11 Serial Number" label="S11 Serial Number">
                                    <a-input
                                      v-model:value="formState.delivery_note_number"
                                      placeholder="S11 Serial Number"
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
                                  <a-form-item name="check" label="Generate for all posts?">
                                    <a-checkbox
                                     v-model:checked="checked"
                                     @change="clearSelected(checked)"
                                     >For all</a-checkbox>
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
                                      <a-select-option value="1">KEMSA</a-select-option>
                                      <a-select-option value="2">MEDS</a-select-option>
                                    </a-select>
                                  </a-form-item>
                                  <a-form-item name="product_code" label="Product Code">
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

                                  <a-form-item name="product_name" label="Product Name">
                                    <a-input
                                      v-model:value="newOrder.product_name"
                                      placeholder="Product Name"
                                      :disabled="true"
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
                            <!-- end generate orders -->
                        
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
  import { Main, BasicFormWrapper } from "../../styled";
  import { SearchResultWrapper } from "./../style";
  import { onMounted, ref, reactive, defineComponent } from "vue";
  import authHeader from "../../../services/auth-header";
  // import { useStore } from "vuex";
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
    }
  
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
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "id",
    //   slots: { customRender: "action" },
    // }
  
  ];

  export default defineComponent({
    name: "Payroll",
    components: {
      Main,
      SearchResultWrapper,
      BasicFormWrapper,
    },
    setup() {
      // const { state } = useStore();
      // const crud = computed(() => state.crud.data);
      // const isLoading = computed(() => state.crud.loading);
      // const selectedRowKeys = ref([]);
      const dataSource = ref([]);
      const activeClass = ref("nets_returned");
      const postdata = ref([]);
      const returnedNets = ref([]);
      const postOrders = ref([]);
      const dropoffPosts=ref([]);
      const productList = ref([]);
      const { query } = useRoute();
      const isOpen = ref(false);
      const drop_off_name = query.name;
      const drop_off_id = query.id;
      const drop_off_campaign = query.campaign_id
      const checked = ref(false);
  
      const handleOk = async () => isModalOpen.value = false;     
      const handleCancelReceive = () => isOpen.value = false;
      const handleChange = (tab) => activeClass.value = tab;
      const isModalOpen = ref(false);
      const isModalOpen_GO = ref(false);
      const openmodal = () => isModalOpen.value = true;
      const formState = reactive({
        date_received:"",
        returned_id: "",
      });
      const newOrder = reactive({
        checked:checked,
        post_id: [],
        order_type: "REGULAR",
        source: "",
        product_code: "",
        product_name: "",
      });

      const openReceiveModal = (id) => {
        formState.returned_id = id;
        isOpen.value = true;
      };

      const openModal = (id) => {
        isModalOpen.value = true;
        formState.drop_off_point_id = id;
      };
      
      const openGO = () =>  isModalOpen_GO.value = true;
      const handleCancelGO = () => isModalOpen_GO.value = false;
  
      const fetchPosts = async()=>{
        try {
           await fetch(`${process.env.VUE_APP_BASE_URL}/posts_data`,
            {
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
            description: `${error}`
          });
        }
      }
      
      const fetchReturnedNets = async()=>{
        try {
          await fetch(`${process.env.VUE_APP_BASE_URL}/returned_nets_list/${query.id}`,
          {
            method: "GET",
            headers: authHeader(),
          })
          .then((response) => response.json())
          .then(({success, data}) => {
            if(success){
              returnedNets.value = data;
            }else{
              notification.error({
                message: "Error",
                description: `${data}`
              });
            }
          })
          .catch((error)=>{
            notification.error({
              message: "Error",
              description: `${error}`
            });
            isModalOpen.value = false;
          })
        } catch (error) {
          notification.error({
            message: "Error",
            description: `${error}`
          });
        }
      }

      const fetchPostOrders = ()=>{
        const dropoffid ={
          "drop_off_point_id":drop_off_id
        }
        try {
          fetch(`${process.env.VUE_APP_BASE_URL}/per_droppoff_point_post_orders`,
          {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                ...
               authHeader()
              },
            body: JSON.stringify(dropoffid),
          })
          .then((response) => response.json())
          .then(({success, data}) => {
            if(success){
              postOrders.value = data;
            }else{
              notification.error({
                message: "Error",
                description: `${data}`
              });
            }
          })
          .catch((error)=>{
            notification.error({
              message: "Error",
              description: `${error}`
            });
            isModalOpen.value = false;
          })
        } catch (error) {
          notification.error({
            message: "Error",
            description: `${error}`
          });
        }
      }

      const fetchdropoffPosts = ()=>{
        const dropoffid ={
          "drop_off_point_id":drop_off_id
        }
        try {
          fetch(`${process.env.VUE_APP_BASE_URL}/posts_dropoff`,
          {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                ...
               authHeader()
              },
            body: JSON.stringify(dropoffid),
          })
          .then((response) => response.json())
          .then(({success, data}) => {
            if(success){
              dropoffPosts.value = data;
            }else{
              notification.error({
                message: "Error",
                description: `${data}`
              });
            }
          })
          .catch((error)=>{
            notification.error({
              message: "Error",
              description: `${error}`
            });
            isModalOpen.value = false;
          })
        } catch (error) {
          notification.error({
            message: "Error",
            description: `${error}`
          });
        }
      }

      const receiveNets = async()=>{ 
        const data = {
          date_received: dayjs(formState.date_received).format("YYYY-MM-DD"),
        };
  
        try {
          fetch(`${process.env.VUE_APP_BASE_URL}/receive_nets_from_post/${formState.returned_id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeader(),
              },
              body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then(({success,message}) => {
              if(success){
                notification.success({
                  message: "Success",
                  description: `Received successfully`
                });
              }else{
                notification.error({
                  message: "Error",
                  description: `${message}`
                });
              }
              isOpen.value = false;
             window.location.reload();
            }).catch((error)=>{
              notification.error({
                message: "Error",
                description: `${error}`
              });
              isOpen.value = false;
            });
  
        } catch (error) {
          notification.error({
            message: "Error",
            description: `${error}`
          });
        }
      }

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
                isModalOpen.value = false;
              } else {
                notification.error({
                  message: "Error",
                  description: `${message}`,
                });
              }
              isModalOpen.value = false;
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

      const getProductList = ()=>{
        try {
          fetch(`${process.env.VUE_APP_BASE_URL}/product_code_list`,
          {
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
            description: `${error}`
          });
        }
      }

      const handleProductChange = (value)=>{
        const product = productList.value.find((product) => product.item_code === value);
        newOrder.product_name = product.item_name;
      }

      const clearSelected = (checked) => {
        if (checked){
          newOrder.post_id = [];
        }
        // selectedRowKeys.value = [];
      };

      const generateOrders =()=>{

        const data = {
          for_all_posts: newOrder.checked,
          order_type: newOrder.order_type,
          target_fulfiller_source: newOrder.source,
          product_code: newOrder.product_code,
          product_name: newOrder.product_name,
        };
        // newOrder.checked ? data.post_id = newOrder.post_id : data.drop_off_point_id = drop_off_id
        if (!newOrder.checked){
          data.post_id = newOrder.post_id;
        }else{
          data.drop_off_point_id = drop_off_id;
        }

        // console.log(JSON.stringify( data));
        try {
          fetch(
            `${process.env.VUE_APP_BASE_URL}/create_post_orders`,
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
      }
  
      onMounted(() => {
        fetchPosts();
        fetchReturnedNets();
        fetchPostOrders();
        fetchdropoffPosts();
        getProductList();

      });
      return {
        handleIssue,
        drop_off_name,
        drop_off_id,
        drop_off_campaign,
        dropoffPosts,
        productList,
        receiveNets,
        handleCancelReceive,
        generateOrders,
        handleProductChange,
        clearSelected,
        dateFormat,
        openReceiveModal,
        openGO,
        isModalOpen_GO,
        newOrder,
        isOpen,
        returnedNets,
        postdata,
        dataSource,
        checked,
        columns,
        postOrdersColumns,
        formState,
        postOrders,
        handleChange,
        handleCancelGO,
        activeClass,
        isModalOpen,
        openmodal,
        openModal,
        handleOk,
      };
    },
  });
  </script>
  <style scoped>
  .badge-green {
    background-color: #1ec997;
    /* color: white; */
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
    justify-content: center;
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
  