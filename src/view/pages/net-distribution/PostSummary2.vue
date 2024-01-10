<template>
  <RecordViewWrapper>
    <sdPageHeader title="Posts Summary">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success"> </sdButton>
      </template>
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
      <a-row :gutter="15">
        <a-col class="w-100" :md="24">
          <sdCards headless>
            <div v-if="isLoading" class="spin">
              <a-spin />
            </div>

            <div v-else>
                <a-table
                  :pagination="{ pageSize: 100, showSizeChanger: true }"
                  :dataSource="results"
                  :columns="columns"
                >
                 <!-- <template #action="{  }">
                  <td>
                    <div class="table-actions">
                      <sdButton 
                      type="success" 
                      size="extra-small" 
                      >
                      </sdButton>
                      </div>
                    </td>
                  </template> -->
              </a-table>

            </div>
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
import { computed, onMounted, ref, defineComponent } from "vue";
import authHeader from "../../../services/auth-header";

const columns = [
  {
    title: "Distribution Post",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Nets Required",
    dataIndex: "nets_required",
    key: "id",
  },
  {
    title: "Nets Received From Drop-off",
    dataIndex: "nets_received",
    key: "id",
  },
  {
    title: "Nets Received From Post",
    dataIndex: "nets_received_from_other_posts",
    key: "id",
  },
  {
    title: "Nets Transfered to Other Post",
    dataIndex: "nets_transfered_to_other_post",
    key: "id",
  },
  {
    title: "Nets To Drop-Off",
    dataIndex: "nets_sent_to_dropoff",
    key: "id",
  },
  {
    title: "Nets Issued",
    dataIndex: "nets_issued",
    key: "id",
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "id",
  },
  
];

const DragAndDropTable = defineComponent({
  name: "ViewPage",
  components: { RecordViewWrapper, Main },

  setup() {
    const { state } = useStore();
    const crud = computed(() => state.crud.data);
    const isLoading = computed(() => state.crud.loading);
    const selectedRowKeys = ref([]);
    const dataSource = ref([]);
    const searchItem = ref("");


    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/get_post_nets_distribution_summary`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();
        console.log(data.data);
        dataSource.value = data.data;
      } catch (error) {
        console.error(error);
      }
    });
    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      const regex = new RegExp(query, "i");
      if (!query) {
        return dataSource.value;
      } else {
        return dataSource.value.filter((post) => {
          return regex.test(post.name);
        });
      }
    });


    return {
      crud,
      isLoading,
      selectedRowKeys,
      dataSource,
      searchItem,
      columns,
      results
    };
  },
});

export default DragAndDropTable;
</script>
