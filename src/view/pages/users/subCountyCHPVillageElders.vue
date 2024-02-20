<template>
  <RecordViewWrapper>
    <!-- sub_county_name  -->
    <sdPageHeader title="Villages">
      <template #buttons>
        <div class="search-box">
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name or role"
          />
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="16" class="search-row"> </a-row>
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
                  :dataSource="results"
                  :columns="columns"
                >
                  <template #units="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/org-units/chp/${record.id}`,
                              query: { id: record.id },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            View CHP & VE
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          type="success"
                          size="extra-small"
                          @click="openModal(record.id)"
                        >
                          Assign Post
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/village-hh/${record.id}`,
                              query: {
                                id: record.id,
                              },
                            }"
                          >
                            View Households
                          </router-link>
                        </sdButton>
                      </div>
                    </td>
                  </template>
                </a-table>
              </TableWrapper>
            </div>
            <!-- Assign post -->
            <a-modal
              title="Assign Post"
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
                  <a-form-item name="Post" label="Select Post">
                    <a-select
                      v-model:value="formState.post_id"
                      show-search
                      option-filter-prop="label"
                      placeholder="Select one"
                      @search="handleSupervisorSearch"
                    >
                      <!-- :label="`${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`" -->
                      <a-select-option
                        v-for="post in posts"
                        :key="post.id"
                        :value="post.id"
                      >
                        {{ post.name }}
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
            <!-- End of assign post -->
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
import { useRoute } from "vue-router";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
// import { Switch } from "ant-design-vue";

const columns = [
  {
    title: "Village Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Village Code",
    dataIndex: "code",
    key: "id",
  },
  {
    title: "No of Households",
    dataIndex: "no_of_registered_hh",
    key: "id",
  },
  {
    title: "CHP(s)",
    dataIndex: "no_of_chp_registered",
    key: "id",
  },
  {
    title: "VE(s)",
    dataIndex: "no_of_chp_registered",
    key: "id",
  },
  {
    title: "Village Post",
    dataIndex: "village_post",
    key: "id",
  },
  {
    title: "Post Supervisor",
    dataIndex: "post_supervisor",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "units",
    slots: { customRender: "units" },
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
    const searchItem = ref("");
    const { query } = useRoute();
    const posts = ref([]);
    const village_id = ref("");

    const sub_county_name = query.name;

    const location_id = query.id;
    const isModalOpen = ref(false);

    const openModal = async (id) => {
      isModalOpen.value = true;
      village_id.value = id;

      try {
        console.log(village_id.value);
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/sublocation_posts?village_id=${village_id.value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
          }
        );

        if (!response.ok) {
          // Handle error if the response status is not OK
          console.error(`Error: ${response.statusText}`);
          return;
        }

        const data = await response.json();
        console.log(data);

        // Assuming posts is an array, you may need to adjust accordingly
        posts.value = data.data;


        // this.loading = false;
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error
      }
    };

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    console.log(query);

    // const getPosts = async () => {
    //   const response = await fetch(
    //     `${process.env.VUE_APP_BASE_URL}/sublocation_posts?village_id=${village_id.value}`,
    //     {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         ...authHeader(),
    //       },
    //     }
    //   );
    //   const data = await response.json();
    //   console.log(data);
    //   posts.value = data.post_name;
    //   // this.posts = data.map((post) => ({
    //   //   ...post,
    //   // }));
    //   // this.loading = false;
    // };

    // getPosts();

    const handleSubmit = async () => {
      try {
        const data = {
          post_id: formState.post_id,
          village_id: village_id.value,
        };

        console.log(data);

        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/assign_village_post`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(), // Include authentication headers from authHeader()
            },
            body: JSON.stringify(data),
          }
        );

        console.log(response);

        const { success, data: responseData, status } = await response.json();

        if (success) {
          notification.success({
            message: "Success",
            description: responseData,
          });
          isModalOpen.value = false;
          setTimeout(function () {
            window.location.reload();
          }, 3000);
        } else {
          notification.error({
            message: "Error",
            description: `${status}`,
          });
        }
        isModalOpen.value = false;
      } catch (error) {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      }
    };

    onMounted(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_BASE_URL}/sub_county_villages?subcounty_id=${location_id}`,
          {
            method: "GET",
            headers: authHeader(),
          }
        );
        const data = await response.json();

        dataSource.value = data.data;
      } catch (error) {
        console.error(error);
      }
    });

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

    const formState = reactive({
      searchItem: "",
    });

    const onSelectChange = (selectedRowKey) => {
      selectedRowKeys.value = selectedRowKey;
    };

    const results = computed(() => {
      const query = searchItem.value.toLowerCase();
      const regex = new RegExp(query, "i");
      if (!query) {
        return dataSource.value;
      } else {
        return dataSource.value.filter((user) => {
          return regex.test(user.name);
        });
      }
    });

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

    return {
      crud,
      isLoading,
      selectedRowKeys,
      handleDelete,
      rowSelection,
      onSelectChange,
      dataSource,
      columns,
      formState,
      isDeactivated: false,
      results,
      searchItem,
      sub_county_name,
      openModal,
      isModalOpen,
      handleCancel,
      handleSubmit,
      posts,
      // toggleUserStatus /*, deactivate user */,
    };
  },
});

export default DragAndDropTable;
</script>
