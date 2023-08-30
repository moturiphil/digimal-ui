<template>
    <div>
      <sdPageHeader ghost title="Nets Received Summary" />
      <Main>
  
        <SearchResultWrapper>
          <a-row :gutter="25">
            <a-col :xs="24">
              <sdButton
                size="extra-small"
                type="success"
                @click="openmodal"
                :hidden="activeTransaction !== 'transfer'"
              >
                <sdFeatherIcons type="plus" size="16" /> 
                New Transfer
              </sdButton>
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
                      :class="
                        activeClass === 'warehouse' ? 'active' : 'deactivate'
                      "
                      @click="handleChange('warehouse')"
                      href="#"
                      :hidden="activeTransaction !== 'receive'"
                    >
                      Received from Warehouse
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
                    :class="
                      activeClass === 'transfer_outs' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('transfer_outs')"
                    href="#"
                    :hidden="activeTransaction !== 'transfer'"
                  >
                    Transfer Out's
                  </a>
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
                                      @click="openReceiveModal(`receive`,record.distribution_id)"
                                      type="success"
                                      :disabled="record.status === 1"
                                      size="extra-small">Receive</sdButton>
                                  </div>
                                </td>
                              </template>
                            </a-table>
                          </TableWrapper>
                          &nbsp;&nbsp;
                          <!-- Transfer modal -->
                          <!-- <a-modal
                            title="New Transfer"
                            :visible="isModalOpen"
                            @cancel="handleCancel"
                            width="50%"
                          >
                            <BasicFormWrapper>
                              <a-form
                              class="add-transfer-form"
                              :style="{ width: '100%' }"
                              layout="vertical"
                              name="addnew"
                              :model="formState"
                              @finish="handleTransfer"
                              >
                              <a-form-item name="from_post_id" label="From Post">
                                <a-select
                                  placeholder="Select  Post "
                                  v-model:value="formState.from_post_id"
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
                                  v-model:value="formState.to_post_id"
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
                                    v-model:value="formState.number_of_nets"
                                    placeholder="Number of nets"
                                    type="number"
                                  />
                                </a-form-item>
                                <a-form-item name="comment" label="Comment">
                                  <a-input
                                    v-model:value="formState.comment"
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
                          </a-modal> -->
                          <!-- End of Transfer modal -->
  
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
                              <template #action="{  }">
                                <td :style="{ 'margin-left': '3px' }">
                                  <div class="table-actions">
                                    <sdButton
                                      type="success"
                                      size="extra-small">Cancel</sdButton>
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
                            <template #action="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  &nbsp;&nbsp;
                                  <sdButton
                                    @click="openReceiveModal(`transfers`,record.id)"
                                    type="success"
                                    :disabled = "record.status == 1"
                                    size="extra-small">Receive</sdButton>
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
                            <template #action="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton
                                    type="success"
                                    :disabled = "record.status == 1"
                                    size="extra-small">Cancel</sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                          <!-- end of Net TransfersOut table -->

                           <!-- Transfer modal -->
                            <a-modal
                              title="New Transfer"
                              :visible="isModalOpen"
                              @cancel="handleCancel"
                              width="50%"
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

  const do_columns= [
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
        }
  ]
  
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
    }
  
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
      const activeClass = ref("do_point");
      const activeTransaction = ref("receive");
      const transaction_type = ref("");
      const postdata = ref([]);
      const fromWarehouse = ref([]);
      const fromDropoffpoint = ref([]);
      const transferIns = ref([]);
      const transferOuts = ref([]);
      const { query } = useRoute();
      const isOpen = ref(false);
      const post_id= query.id;
      const isModalOpen = ref(false);
  
      const handleChange = (tab) => {
        activeClass.value = tab;
      };
      
      const handleTransactions = (tab) => {
        activeTransaction.value = tab;
        tab === "receive" ? handleChange("do_point") : handleChange("transfer_ins");
        // openmodal();
      };
  
      const openmodal = () => {
        isModalOpen.value = true;
      };
  
      const openReceiveModal = (type, id) => {
        type === "receive" ?  (formState.distribution_id = id, transaction_type.value = "receive"): (trans_formState.transfer_id=id, transaction_type.value ="transfers");
        isOpen.value = true;
      };
  
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
      
      const formState = reactive({
        date_received:"",
        distribution_id:"",
      });
      const trans_formState = reactive({
      from_post_id: Number(query.id),
      to_post_id: "",
      number_of_nets: "",
      comment: "",
      date_received:"",
      transfer_id: "",
    });
  
      const handleTransfer =  ()=>{
        const data = {
          from_post_id: trans_formState.from_post_id,
          to_post_id: trans_formState.to_post_id,
          number_of_nets: trans_formState.number_of_nets,
          comment: trans_formState.comment,
        };
        try {
            fetch(`${process.env.VUE_APP_BASE_URL}/transfer-nets`,
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
                  description: `${message}`
                });
              }else{
                notification.error({
                  message: "Error",
                  description: `${message}`
                });
              }
            }).catch((error)=>{
              console.log(error)
              notification.error({
                message: "Error",
                description: `${error}`
              });
            });
        } catch (error) {
          notification.error({
            message: "Error",
            description: `${error}`
          });
        }
      }

      const receiveNets = async()=>{
      const data = {
        transfer_id: trans_formState.transfer_id,
        date_received: dayjs(formState.date_received).format("YYYY-MM-DD"),
        status: 1
      };
      const rec_data = {
          date_received: dayjs(formState.date_received).format("YYYY-MM-DD"),
      };
      const payload = transaction_type.value === "transfers" ? data : rec_data;
      const url = transaction_type.value === "transfers" ? "receive_nets_from_post" : `receive_nets_from_dropoff_point/${formState.distribution_id }/${post_id}`

      try {
        fetch(`${process.env.VUE_APP_BASE_URL}/${url}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
            body: JSON.stringify(payload),
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
            isModalOpen.value = false;
           window.location.reload();
          }).catch((error)=>{
            notification.error({
              message: "Error",
              description: `${error}`
            });
            isModalOpen.value = false;
          });

      } catch (error) {
        notification.error({
          message: "Error",
          description: `${error}`
        });
      }

    }

    //   const receiveFromWarehouse = async()=>{
    //     try {
    //       await fetch(`${process.env.VUE_APP_BASE_URL}/post_supplies_list/${post_id}/2`,
    //       {
    //         method: "GET",
    //         headers: authHeader(),
    //       })
    //       .then((response) => response.json())
    //       .then(({success, data}) => {
    //         console.log(data.length);
    //         if(success){
    //             data.length > 0 ? fromWarehouse.value = data: fromWarehouse.value = [];
    //         }else{
    //           notification.error({
    //             message: "Error",
    //             description: `${data.message}`
    //           });
    //         }
    //       });
    //     } catch (error) {
    //         console.log(error)
    //       notification.error({
    //         message: "Error",
    //         description: `${error}`
    //       });
    //     }
    //   }
  
      const receiveFromDropOff = async()=>{
        try {
          await fetch(`${process.env.VUE_APP_BASE_URL}/post_supplies_list/${post_id}/1`,
          {
            method: "GET",
            headers: authHeader(),
          })
          .then((response) => response.json())
          .then(({success, data}) => {
            if(success){
                data.length > 0 ? fromDropoffpoint.value = data: fromDropoffpoint.value = [];
            }else{
              notification.error({
                message: "Error",
                description: `${data.message}`
              });
            }
          });
        } catch (error) {
            console.log(error)
          notification.error({
            message: "Error",
            description: `${error}`
          });
        }
      }

      const fetchTransferOuts = async()=>{
      try {
        await fetch(`${process.env.VUE_APP_BASE_URL}/post_nets_transfer_list/${query.id}/1`,
        {
          method: "GET",
          headers: authHeader(),
        })
        .then((response) => response.json())
        .then(({success, data}) => {
          if(success){
          transferOuts.value = data;
          }else{
            notification.error({
              message: "Error",
              description: `${data.message}`
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

    const fetchTransferIns = async()=>{
      try {
        await fetch(`${process.env.VUE_APP_BASE_URL}/post_nets_transfer_list/${query.id}/2`,
        {
          method: "GET",
          headers: authHeader(),
        })
        .then((response) => response.json())
        .then(({success, data}) => {
          if(success){
            transferIns.value = data;
          }else{
            notification.error({
              message: "Error",
              description: `${data.message}`
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
  
      const handleOk = async () => {
        isModalOpen.value = false;
      };
  
      const handleCancel = () => {
        isModalOpen.value = false;
      };
     
      const handleCancelReceive = () => {
        isOpen.value = false;
      };
  
      // const receiveNets__ = async()=>{
      //   const data = {
      //     date_received: dayjs(formState.date_received).format("YYYY-MM-DD"),
      //   };
  
      //   try {
      //     fetch(`${process.env.VUE_APP_BASE_URL}/receive_nets_from_dropoff_point/${formState.distribution_id }/${post_id}`,
      //       {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json",
      //           ...authHeader(),
      //         },
      //         body: JSON.stringify(data),
      //       })
      //       .then((response) => response.json())
      //       .then(({success,message}) => {
      //         if(success){
      //           notification.success({
      //             message: "Success",
      //             description: `Received successfully`
      //           });
      //         }else{
      //           notification.error({
      //             message: "Error",
      //             description: `${message}`
      //           });
      //         }
      //         isOpen.value = false;
      //       }).catch((error)=>{
      //         console.log(error)
      //         notification.error({
      //           message: "Error",
      //           description: `${error}`
      //         });
      //         isOpen.value = false;
      //       });
  
      //   } catch (error) {
      //     notification.error({
      //       message: "Error",
      //       description: `${error}`
      //     });
      //     isOpen.value = false;
      //   }
  
      // }
  
      onMounted(() => {
        fetchPosts();
        // receiveFromWarehouse();
        receiveFromDropOff();
        fetchTransferIns();
        fetchTransferOuts();
      });
      return {
        activeTransaction,
        handleTransactions,
        transferscolumns,
        do_columns,
        receiveNets,
        handleCancelReceive,
        dateFormat,
        openReceiveModal,
        isOpen,
        handleTransfer,
        fromWarehouse,
        fromDropoffpoint,
        transferOuts,
        transferIns,
        postdata,
        dataSource,
        columns,
        formState,
        trans_formState,
        handleChange,
        activeClass,
        isModalOpen,
        openmodal,
        handleOk,
        handleCancel,
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
  </style>
  <style>
  .full-modal {
    .ant-modal {
      max-width: 50%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    ;
      
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
  