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
                        <!-- <sdButton @click="visible = true">
                          <router-link
                            :to="`/event/register/${record.id}`"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            <sdFeatherIcons type="edit-3" size="16" />
                            &nbsp;&nbsp; Register
                          </router-link>
                        </sdButton> -->
                        <!-- <sdButton
                          @click="showColorModal()"
                          size="small"
                          type="success"
                        >
                          Success
                        </sdButton> -->
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
import { computed, defineComponent, onMounted, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import authHeader from "../../../../../src/services/auth-header";
import axios from "axios";
import { useStore } from "vuex";

const columns = [
  {
    title: "Participant Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Participant Phone",
    dataIndex: "event_code",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "venue",
    key: "id",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "events",
    slots: { customRender: "events" },
    width: "90px",
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

    const API_URL = `${process.env.VUE_APP_BASE_URL}/campaign`;

    const route = useRoute();
    const campaignId = reactive({
      value: route.params.id,
    });

    watch(campaignId, async (newCampaignId) => {
      try {
        const response = await axios.get(`${API_URL}/${newCampaignId}/events`, {
          headers: authHeader(),
        });
        console.log(response);
        dataSource.value = response.data.data;
      } catch (error) {
        console.error(error);
      }
    });

    onMounted(async () => {
      try {
        const response = await axios.get(`${API_URL}/${campaignId.value}/events`, {
          headers: authHeader(),
        });
        console.log(response);
        // if (response.data.data.)
        // check if response.data.data.[id].status is 0 or 1 set the value of status to active or inactive

        if (response.data.data.length > 0) {
          response.data.data.forEach((element) => {
            if (element.status === 0) {
              element.status = "Inactive";
            } else if (element.status === 1) {
              element.status = "Active";
            }
          });
        }


        dataSource.value = response.data.data;
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