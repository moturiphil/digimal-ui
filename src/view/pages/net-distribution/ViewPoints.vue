<template>
  <RecordViewWrapper>
    <sdPageHeader title="Drop Off Points">
      <template #subTitle>
        <!-- <sdButton size="extra-small" type="success">
          <router-link
            :to="{
              path: `/import/drop-off-points`,
            }"
          >
            Import dropoff
          </router-link>
        </sdButton> -->
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <a-table
                  :pagination="{ pageSize: 100, showSizeChanger: true }"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <template #point="{ record }">
                    <td>
                      <div class="table-actions">
                        &nbsp;&nbsp;
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/manage-dropoff-inventory`,
                              query: {
                                id: record.id,
                                name: record.name,
                                campaign_id: record.campaign_id,
                                county: record.county,
                              },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            Manage Inventory
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          class="button-container"
                          size="extra-small"
                          type="success"
                          @click="openModal(record.id)"
                        >
                          Assign Drop-off Manager
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
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
                  @finish="handleAssign"
                >
                  <a-form-item
                    name="drop_off_manager"
                    label="Assign Drop Off Manager"
                  >
                    <a-select
                      placeholder="Assign Drop Off Manager"
                      v-model:value="formState.drop_off_manager"
                      v-if="!loading"
                      show-search
                      option-filter-prop="label"
                    >
                      <a-select-option
                        v-for="worker in users"
                        :key="worker.id"
                        v-model:value="worker.id"
                        :label="`${worker.first_name} ${worker.last_name} -${worker.role_id} `"
                      >
                        {{ worker.first_name }}
                        {{ worker.last_name }} - {{ worker.id_no }},
                        {{ worker.role_id }}, {{ worker.location_id }}
                      </a-select-option>
                    </a-select>
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
          </sdCards>
        </a-col>
      </a-row>
      <a-col :xs="24">
        <DragAndDropTable />
      </a-col>
    </Main>
  </RecordViewWrapper>
</template>
<script>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive, defineComponent } from "vue";
// import axios from "axios";  drop_off_manager
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
// import dayjs from "dayjs";
const dateFormat = "YYYY-MM-DD";
const columns = [
  {
    title: "Drop off Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "County",
    dataIndex: "county_id",
    key: "id",
  },
  {
    title: "Sub County",
    dataIndex: "sub_county_id",
    key: "id",
  },
  {
    title: "Drop off Manager",
    dataIndex: "drop_off_manager",
    key: "id",
  },
  {
    title: "Order Status",
    dataIndex: "order_status",
    key: "id",
    customCell: function (text, record) {
      let badgeColor;

      // Check if record is defined and has the order_status property
      if (record && record.order_status) {
        switch (record.order_status) {
          case "pending":
            badgeColor = "orange";
            break;
          case "processing":
            badgeColor = "blue";
            break;
          case "Generated":
            badgeColor = "green";
            break;
          case "Not Generated":
            badgeColor = "red";
            break;
          default:
            badgeColor = "default";
        }
      } else {
        // Handle the case where record or order_status is missing
        badgeColor = "green";
      }

      const badgeElement = document.createElement("span");
      badgeElement.classList.add(`badge-${badgeColor}`);
      badgeElement.textContent = text;

      return badgeElement;
    },
  },
  {
    title: "Action",
    dataIndex: "",
    key: "point",
    slots: { customRender: "point" },
  },
];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },

  setup() {
    const { state, dispatch } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const isModalOpen = ref(false);
    const users = ref("");

    const formState = reactive({
      post_id: "",
      drop_off_point_id: "",
      bale_size: "",
      number_of_bales: "",
      no_of_pieces: "",
      issue_date: "",
      delivery_note_number: "",
      drop_off_manager: "",
    });

    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/get_all_drop_off_points`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        dataSource.value = data.data;
        console.log(dataSource.value);
      } catch (error) {
        console.error(error);
      }
    });

    const openModal = (id) => {
      isModalOpen.value = true;
      formState.drop_off_point_id = id;
    };

    //users
    const getManagers = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/get_drop_off_manager`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      users.value = data.data;
      console.log(users.value);
    };

    getManagers();

    const handleAssign = async () => {
      try {
        const data = {
          user_id: formState.drop_off_manager,
          drop_off_point_id: formState.drop_off_point_id,
        };

        console.log(JSON.stringify(data));
        await fetch(`${process.env.VUE_APP_BASE_URL}/assign_dropoff_manager`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then(({ status, data }) => {
            if (status == true) {
              notification.success({
                message: "Success",
                description: data,
              });
              isModalOpen.value = false;
              setTimeout(function () {
                location.reload();
              }, 3000);
            } else {
              notification.error({
                message: "Error",
                description: `${status}`,
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

    const handleDelete = (id) => {
      const confirm = window.confirm("Are you sure delete this?");
      if (confirm) {
        dispatch("axiosDataDelete", {
          id,
          getData: () => {
            dispatch("axiosCrudGetData");
          },
        });
      }
      return false;
    };

    const handleCancelReceive = () => {
      isModalOpen.value = false;
    };

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };
    console.log(users);

    return {
      handleAssign,
      dateFormat,
      handleCancelReceive,
      openModal,
      isModalOpen,
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      dataSource,
      columns,
      formState,
      users,
    };
  },
});

export default DragAndDropTable;
</script>
<style>
.badge-orange {
  background-color: orange;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-blue {
  background-color: blue;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-green {
  background-color: green;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-red {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}

.badge-default {
  background-color: gray;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}
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
    /* height: calc(70vh); */
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
