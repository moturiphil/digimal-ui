<template>
    <UserTableStyleWrapper>
      <TableWrapper class="table-responsive">
        <a-table
          :pagination="{ pageSize: 10, showSizeChanger: true }"
          :dataSource="dataSource"
          :columns="columns"
        >
          <template #events="{ record }">
            <td>
              <div class="table-actions">
                <sdButton @click="showSuccessModal" size="small" type="success">
                  <sdFeatherIcons type="edit-3" size="16" />
                  &nbsp;&nbsp; Enroll Participants
                </sdButton>
                <sdButton>
                  <router-link
                    :to="`/event/view/${record.id}`"
                    class="btn-icon"
                    type="info"
                    shape="circle"
                  >
                    <sdFeatherIcons type="eye" size="16" />
                    &nbsp;&nbsp; View
                  </router-link>
                  <!-- <sdFeatherIcons type="edit" size="16" /> -->
                  <!-- &nbsp;&nbsp; View -->
                </sdButton>
                <sdButton
                  class="btn-icon"
                  type="danger"
                  @click="handleDelete(record.id)"
                  shape="circle"
                >
                  <sdFeatherIcons type="trash-2" size="16" />
                  <a href="" title="Delete"></a>
                  <!-- &nbsp;&nbsp; Delete -->
                </sdButton>
              </div>
            </td>
          </template>
        </a-table>
      </TableWrapper>
    </UserTableStyleWrapper>
  </template>
  
  <script>
  import { UserTableStyleWrapper } from "../../../view/pages/campaigns/style";
  import { TableWrapper } from "../../styled";
  import { computed, defineComponent, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import authHeader from "../../../../src/services/auth-header";
  import axios from "axios";
  import { useStore } from "vuex";
  
  const columns = [
    {
      title: "Participant Name",
      dataIndex: "fullName",
      key: "id",
      // render: (text, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Participant Phone",
      dataIndex: "phone_no",
      key: "id",
    },
    {
      title: "Organization",
      dataIndex: "org_types_id",
      key: "id",
    },
    {
      title: "Role",
      dataIndex: "role_id",
      key: "id",
    },
  ];
  
  const EventCampaignTable = defineComponent({
    name: "EventCampaignTable",
    components: { UserTableStyleWrapper, TableWrapper },
    setup() {
      const { state } = useStore();
      const eventData = computed(() => state.crud.data);
  
      const dataSource = ref([]);
      const selectedRowKeys = ref([]);
  
      const API_URL = `${process.env.VUE_APP_BASE_URL}`;
  
      const { query } = useRoute();
  
      console.log(query.id);
  
      onMounted(async () => {
        try {
          const response = await axios.get(
            `${API_URL}/activity_participants?activity_id=${query.code}&confirmed=0`,
            {
              headers: authHeader(),
            }
          );
          console.log(response.data.data);
  
          const updatedData = response.data.data.map((record) => {
            let fullName = `${record.first_name} ${record.last_name}`;
            // fullName = fullName.toUpperCase();
            return {
              ...record,
              fullName,
            };
          });
  
          dataSource.value = response.data.data;
          console.log(updatedData);
          dataSource.value = updatedData;
  
          console.log(dataSource.value);
        } catch (error) {
          console.error(error);
        }
      });
  
      const onSelectChange = (selectedRowKey) => {
        selectedRowKeys.value = selectedRowKey;
      };

      const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
      };
  
      return {
        columns,
        eventData,
        rowSelection,
        dataSource,
        selectedRowKeys,
        onSelectChange,
      };
    },
  });
  
  export default EventCampaignTable;
  </script>
  