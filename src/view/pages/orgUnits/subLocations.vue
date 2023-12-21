<template>
  <RecordViewWrapper>
    <sdPageHeader title="Sub Locations">
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name"
          /></div
      ></template>
    </sdPageHeader>
    <Main>
      <sdButton class="btn-import" type="success" v-if="isAdmin">
        <router-link
          :to="{
            path: `/org-units/import-orgunit/${params.id}`,
            query: { orgtype: 'sub-location' },
          }"
          class="btn-icon"
          type="info"
          shape="circle"
        >
          &nbsp;&nbsp; Import Sub locations
        </router-link>
      </sdButton>
      <br />
      <br />
      <br />
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
              <TableWrapper class="table-data-view table-responsive">
                <a-table
                  :pagination="{ pageSize: 10, showSizeChanger: true }"
                  :dataSource="results"
                  :columns="columns"
                >
                  <template #units="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/sub-location/posts/${record.org_id}`,
                              query: {
                                name: record.name,
                                id: record.id,
                                org_id: record.org_id
                              },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            &nbsp;&nbsp; View Posts
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          type="success"
                          size="extra-small"
                          @click="openModal(record.id)"
                        >
                          Assign Supervisor
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/org-units/villages/${record.org_id}`,
                              query: {
                                name: record.name,
                              },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            &nbsp;&nbsp; View Villages
                          </router-link>
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
            <!-- Assign supervisor -->
            <a-modal
              title="Assign Supervisor"
              :visible="isModalOpen"
              @cancel="handleCancel"
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
                  <a-form-item name="Supervisors" label="Select Supervisor">
                    <a-select
                     v-model:value="formState.user_id"
                      show-search
                      option-filter-prop="label"
                      placeholder="Select one"
                      :filter-option="filterOption"
                      @search="handleSearch"
                    >
                      <a-select-option
                        v-for="user in supervisors"
                        :key="user.id"
                        :value="user.id"
                        :label="`${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`"
                      >
                        {{ user.first_name }} {{ user.last_name }}
                        {{ user.other_name }} - {{ user.id_no }},{{
                          user.role_id
                        }}, {{ user.location_id }}
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
            <!-- End of assign supervisor -->
          </sdCards>
        </a-col>
      </a-row>
      <a-col :xs="24">
        <DragAndDropTable />
      </a-col>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, reactive } from "vue";
// import axios from "axios";
import { useRoute } from "vue-router";
import { hasRole } from "../../../services/user-role";
import { notification } from "ant-design-vue";
import axios from '@/Axiosconfig'

const columns = [
  //   {
  //     title: "Id",
  //     dataIndex: "id",
  //     key: "id",
  //   },
  {
    title: "Sub Location Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Sub Location Code",
    dataIndex: "code",
    key: "name",
  },
  {
    title: "Org ID",
    dataIndex: "org_id",
    key: "org_id",
  },
  {
    title: "Supervisor",
    dataIndex: "supervisor",
    key: "supervisor",
  },
  {
    title: "",
    dataIndex: "",
    key: "units",
    slots: { customRender: "units" },
  },
];

const adminRoles = [53];
const { state,
  //dispatch
} = useStore();
    //const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    // const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const { params, query } = useRoute();
    const searchItem = ref("");
    const isModalOpen = ref(false);
    const supervisors = ref([]);


    console.log({ query, params });
    console.log(query.id);

onMounted(async () => {
  getSubcountyList();
});

const handleSearch = (value) => {
  console.log(value)
 searchItem.value = value;
  supervisorList();
};

const getSubcountyList = async () => {
  try {
    const response = await axios.get(`get_sub_counties_list?parent_id=${params.id}`);
    const data = await response.data;
    console.log(data);
    dataSource.value = data.message;
    console.log(dataSource.value);
  } catch (error) {
    console.error(error);
  }
}

    const formState = reactive({
      post_id: "",
      user_id: "",
      searchItem:"",
    });

const openModal = (id) => {
      supervisorList();
      isModalOpen.value = true;
      formState.sublocation_id = id;
      console.log(isModalOpen.value);
};

const supervisorList = async () => {
  try {
    const response = await axios.get(`cha_users?query=${searchItem.value}`);
    const data = await response.data;

    // Modify the structure of each supervisor to include a 'label' property
    supervisors.value = data.data.map((user) => ({
      ...user,
      label: `${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`,
    }));
  } catch (error) {
    console.error(error);
  }
};

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    const handleSubmit = async () => {
      try {
        const data = {
          sublocation_id: formState.sublocation_id,
          user_id: formState.user_id,
        };
        console.log(data);
        await axios.post(`sublocation_supervisor/assign`,data)
          .then((response) => response.data)
          .then(({ status, message }) => {
            if (status == "Success") {
              notification.success({
                message: "Success",
                description: "SubLocation Assigned Supervisor Successfully",
              });
              isModalOpen.value = false;
              setTimeout(function () {
                location.reload();
              }, 3000);
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

    // const handleDelete = (id) => {
    //   const confirm = window.confirm("Are you sure delete this?");
    //   if (confirm) {
    //     dispatch("axiosDataDelete", {
    //       id,
    //       getData: () => {
    //         dispatch("axiosCrudGetData");
    //       },
    //     });
    //   }
    //   return false;
    // };

    // const onSelectChange = (selectedRowKey) => {
    //   selectedRowKeys.value = selectedRowKey;
    // };

    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: onSelectChange,
    // };

    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      const regex = new RegExp(query, "i");
      if (!query) {
        return dataSource.value;
      } else {
        return dataSource.value.filter((event) => {
          return regex.test(event.name);
        });
      }
    });

const isAdmin = hasRole(adminRoles);

</script>
