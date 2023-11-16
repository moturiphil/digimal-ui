<template>
  <Main>
    <sdPageHeader ghost :title="`Assign Posts to ${dropoff_name} Drop Off`" />
    <a-row :gutter="15">
      <a-col :xs="24">
        <RecordFormWrapper>
          <sdCards headless>
            <a-row justify="center">
              <a-col :xl="20" :md="20" :xs="24">
                <BasicFormWrapper>
                  <a-form
                    class="add-record-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <a-form-item label="Distribution Posts">
                      <a-transfer
                        :dataSource="distribution_posts"
                        showSearch
                        v-model="targetKeys"
                        :targetKeys="targetKeys"
                        :render="(item) => item.title"
                        :filterOption="filterOption"
                        @change="handleChange"
                        :listStyle="{
                          width: '500px',
                          height: '500px',
                        }"
                      >
                      </a-transfer>
                    </a-form-item>
                    <div class="record-form-actions text-right">
                      <sdButton size="default" htmlType="Save" type="success">
                        {{ isLoading ? "Loading..." : "Submit" }}
                      </sdButton>
                    </div>
                  </a-form>
                </BasicFormWrapper>
              </a-col>
            </a-row>
          </sdCards>
        </RecordFormWrapper>
      </a-col>
    </a-row>
  </Main>
</template>

<script>
import { RecordFormWrapper } from "../style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
import { Transfer } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
import { toRaw } from "vue";
import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "CreateRole",
  components: {
    RecordFormWrapper,
    Main,
    BasicFormWrapper,
    "a-transfer": Transfer,
  },

  setup() {
    const { query } = useRoute();
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const distribution_posts = ref([]);
    const targetKeys = ref([]);
    const drop_off_point_id = query.id;
    const dropoff_name = query.name;
    const posts_url = `${process.env.VUE_APP_BASE_URL}/sub_county_posts?drop_off_point_id=${drop_off_point_id}`;
    const drop_off_posts_url = `${process.env.VUE_APP_BASE_URL}/posts_dropoff?drop_off_point_id=${drop_off_point_id}`;

    const formState = reactive({
      drop_off_id: "",
      post_ids: [],
    });

    onMounted(async () => {
      await fetchPosts();
      await fetchDropoffPosts();
      // Initialize targetKeys to an empty array
      targetKeys.value = [];
      // Update targetKeys with the assigned post keys
      targetKeys.value = formState.post_ids;
    });

    const fetchPosts = async () => {
      try {
        const posts = [];
        const response = await fetch(posts_url, {
          method: "GET",
          headers: authHeader(),
        });

        const data = await response.json();
        const posts_data = data.data;

        for (let i = 0; i < posts_data.length; i++) {
          const element = {
            key: posts_data[i].id,
            title: posts_data[i].name,
          };
          posts.push(element);
        }

        distribution_posts.value = posts;
      } catch (error) {
        notification.error({
          message: "Error",
          description: `Error: ${error}`,
        });
      }
    };

    const fetchDropoffPosts = async () => {
      try {
        const assignedPosts = [];
        const response = await fetch(drop_off_posts_url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });

        const data = await response.json();

        console.log(data.data);

        if (data.data) {
          const posts_data = data.data;
          for (let i = 0; i < posts_data.length; i++) {
            const element = {
              key: posts_data[i].id,
              title: posts_data[i].name,
            };
            assignedPosts.push(element);
          }
          targetKeys.value = assignedPosts.map((post) => post.key);
          formState.post_ids = targetKeys.value;
        } else {
          console.error("Data or data.name is undefined:", data);
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: `Error: ${error}`,
        });
      }
    };

    const handleSubmit = async () => {
      const data = {
        drop_off_point_id: drop_off_point_id,
        post_ids: toRaw(formState.post_ids),
      };
      try {
        await fetch(`${process.env.VUE_APP_BASE_URL}/dropoff/assingpost`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.message) {
              notification["success"]({
                message: response.message,
                duration: 10.5,
              });
            } else if (response.error) {
              notification["error"]({
                message: response.error,
                duration: 10.5,
              });
            }
          });
      } catch (error) {
        notification.error({
          message: "Error",
          description: `Error: ${error}`,
        });
      }
    };

    const handleChange = (newTargetKeys) => {
      targetKeys.value = newTargetKeys;
      formState.post_ids = newTargetKeys;
    };

    const filterOption = (inputValue, option) => {
      return option.title.indexOf(inputValue) > -1;
    };


    return {
      isLoading,
      distribution_posts,
      formState,
      targetKeys,
      dropoff_name,
      handleSubmit,
      handleChange,
      filterOption,
    };
  },
});
</script>
