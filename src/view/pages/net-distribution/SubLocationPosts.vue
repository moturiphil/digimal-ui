<template>
  <div>
    <sdPageHeader :title="` ${sublocation_name} Posts`" />
    <Main>
      <sdButton type="success" size="small" @click="openModal()">
        Assign Post
      </sdButton>
      <br />
      <br />
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
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="false"
                            :dataSource="dataSource"
                            :columns="columns"
                          >
                            <template #matrix="{ record }">
                              <td>
                                <div class="table-actions">
                                  <sdButton
                                    size="extra-small"
                                    type="danger"
                                    :disabled="isStarting"
                                    @click="removeMatrix(record.id)"
                                    v-if="!record.status"
                                  >
                                    <span>
                                      <sdFeatherIcons
                                        type="trash"
                                        size="small"
                                      />
                                      &nbsp;&nbsp; Remove Post
                                    </span>
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                          <a-pagination
                          :current="currentPage"
                          :total="total"
                          :pageSize="pageSize"
                          :showSizeChanger="true"
                          :pagination="true"
                          @change="onPageChange($event)"
                        />
                        </TableWrapper>
                      </div>
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
            </sdCards>
          </a-col>
        </a-row>
        <!-- Assign post modal -->
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
              <a-form-item name="Posts" label="Select Post">
                <a-select
                  v-model:value="formState.post_id"
                  show-search
                  option-filter-prop="label"
                  placeholder="Select one"
                  mode="multiple"
                >
                  <a-select-option
                    v-for="post in posts"
                    :key="post.id"
                    :value="post.id"
                    :label="`${post.name}`"
                  >
                    {{ post.name }},
                    {{ post.post_code }}
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
        <!-- End of assign post modal -->
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import { computed, onMounted, ref, reactive } from "vue";
// import worker from "../../../services/worker";
import axios from '@/Axiosconfig';
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { notification } from "ant-design-vue";

// const households = ref([]);

const columns = [
  {
    title: "Distribution Post",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "County",
    dataIndex: "distribution_county",
    key: "id",
  },
  {
    title: "Sub-County",
    dataIndex: "distribution_sub_county",
    key: "id",
  },
  {
    title: "Post Code",
    dataIndex: "post_code",
    key: "id",
  },
  {
    title: "Post Supervisor",
    dataIndex: "post_supervisor_user_id",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "matrix",
    slots: { customRender: "matrix" },
  },
];

const currentPage = ref(1);
const pageSize = ref(100);
const total = ref(0)

  // const visible=ref(false)
  // confirmLoading=ref(false)
  const { state } = useStore();
  //const crud = computed(() => state.crud.data);
  const isLoading = computed(() => state.crud.loading);
  // const selectedRowKeys = ref([]);
  const dataSource = ref([]);
  // const orgTypeAssigned = ref([]);
  const activeClass = ref("all");

    const { params, query } = useRoute();

    console.log({ query, params });
    const matrix_id = query.id;
    console.log(matrix_id);
    const sublocation_name = query.name;
    const sublocation_id = query.id;
    const isModalOpen = ref(false);
    const posts = ref([]);

    console.log(query)

    // const handleChange = (tab) => {
    //   activeClass.value = tab;
    // };
    onMounted(() => {//sub_location_posts?sub_location_org_id=${query.org_id}
    getSublocationPosts();      
    });
    const onPageChange = async (page) => {
        currentPage.value = page;
        getSublocationPosts();
        // console.log(newPage);
      };

      const getSublocationPosts=()=>{
        axios
        .get(`sub_location_posts?sub_location_id=${query.org_id}`)
        .then((response) => {
          dataSource.value = response.data.data;
          console.log(dataSource.value);
        }).then(()=>{
          postList();
        })
        .catch((error) => {
          console.error(error);
        });

      }

    const postList = async () => {//posts_data
      try {
        const response = await axios.get(`get_location_posts/sub_location_id=${query.org_id}`);
        const data = await response.data;
        console.log(data);
        // Modify the structure of each supervisor to include a 'label' property
        posts.value = data.data.map((post) => ({
          ...post,
          label: `${post.name},`,
          //    ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`,
        }));
      } catch (error) {
        console.error(error);
      }
    };


    const removeMatrix = async (id) => {
      const removeMatrixUrl = `delete_event_matrix?matrix_id=${id}`;
      console.log(id);
      try {
        const response = await axios.delete(removeMatrixUrl);

        console.log(response.data);

        if (response.data.success) {
          notification.success({
            message: "Success",
            description: response.data.message,
          });

          await new Promise((resolve) => {
            setTimeout(resolve, 1500); // Wait for 1.5 seconds (adjust the time as needed)
          });

          location.reload();
        } else {
          notification.error({
            message: "Error",
            description: response.data.message,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    // const removeOrgType = async (id) => {
    //   const removeOrgTypeUrl = `delete_event_orgtype_matrix?matrix_id=${id}`;
    //   console.log(id);
    //   try {
    //     const response = await axios.delete(removeOrgTypeUrl);

    //     console.log(response.data);

    //     if (response.data.success) {
    //       notification.success({
    //         message: "Success",
    //         description: response.data.message,
    //       });

    //       await new Promise((resolve) => {
    //         setTimeout(resolve, 1500); // Wait for 1.5 seconds (adjust the time as needed)
    //       });

    //       location.reload();
    //     } else {
    //       notification.error({
    //         message: "Error",
    //         description: response.data.message,
    //       });
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    const openModal = (id) => {
      isModalOpen.value = true;
      console.log(id);
      console.log(isModalOpen.value);
    };

    const handleCancel = () => {
      isModalOpen.value = false;
    };

    const handleSubmit = async () => {
      try {
        const data = {
          post_ids: formState.post_id,
          sublocation_ids: [sublocation_id],
        };
        console.log(data);
        await axios.post(`map_post_to_sublocation`,data)
          .then((response) => response.data)
          .then(({ success, message }) => {
            if (success == true) {
              notification.success({
                message: "Success",
                description: message,
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

    const formState = reactive({
      searchItem: "",
    });

</script>
