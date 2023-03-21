<template>
  <UserTableStyleWrapper>
    <TableWrapper class="table-responsive">
      <a-table
        :rowSelection="rowSelection"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :dataSource="dataSource"
        :columns="columns"
      >
      <template #events="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton
                          @click="showSuccessModal"
                          size="small"
                          type="success"
                        >
                          <sdFeatherIcons type="edit-3" size="16" />
                          &nbsp;&nbsp; Enroll Participants
                        </sdButton>
                        <sdButton
                        >
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
import { UserTableStyleWrapper } from "../style";
import { TableWrapper } from "../../../styled";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import authHeader from "../../../../../src/services/auth-header";
import axios from "axios";
import { useStore } from "vuex";

const columns = [
  {
    title: "Participant Name",
    dataIndex: "first_name",
    key: "id",
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

    // const route = useRoute();
    // const campaignId = reactive({
    //   value: route.params.id,
    // });

    const { query } = useRoute();

    console.log(query.id);

    // watch(campaignId, async () => {
    //   try {
    //     const response = await axios.get(`${API_URL}/events/${query.id}/participants`, {
    //       headers: authHeader(),
    //     });
    //     console.log(response);
    //     dataSource.value = response.data.data;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // });

    onMounted(async () => {
      try {
        // localStorage.getItem("eventCode");
        // console.log(localStorage.getItem("eventCode"));

        const response = await axios.get(`${API_URL}/events/${query.id}/participants`, {
          headers: authHeader(),
        });
        console.log(response.data.data);
        // get participants full names
        for (let i = 0; i < response.data.data.length; i++) {
          const full_name = response.data.data[i].first_name + " " + response.data.data[i].last_name;
          response.data.data.push(full_name);
          // console.log(full_name);
        }
        // const full_name = response.data.data.first_name + " " + response.data.data.last_name;
        // console.log(full_name);

        dataSource.value = response.data.data;
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