<template>
  <Main>
  <sdPageHeader title="Assign Worker">
  </sdPageHeader>
    <a-row :gutter="15">
      <a-col :xs="24">
        <RecordFormWrapper>
          <sdCards headless>
            <a-row justify="center">
              <a-col :xl="10" :md="16" :xs="24">
                <BasicFormWrapper>
                  <a-form
                    class="add-record-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <a-form-item name="received_by" label="Post Workers">
                      <a-select
                        mode="multiple"
                        placeholder="Selected Post workers"
                        v-model:value="formState.received_by"
                        v-if="!loading"
                        show-search
                        option-filter-prop="label"
                        @blur="validate('received_by')"
                        @keypress="validate('received_by')"
                      >
                        <a-select-option
                          v-for="manager in users"
                          :key="manager.id"
                          v-model:value="manager.id"
                          :label="`${manager.first_name} ${manager.last_name} -${manager.role_id} `"
                        >
                          {{ manager.first_name }}
                          {{ manager.last_name }} - {{manager.id_no}},
                          {{ manager.role_id }}, {{manager.location_id}}
                        </a-select-option>
                      </a-select>
                      <p class="errors" style="color: red;" v-if="!!errors.received_by" >{{errors.received_by}}</p>
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
// import axios from "axios";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import * as Yup from "yup";

const dateFormat = "YYYY-MM-DD";

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },
  data() {
    const { state } = useStore();
    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");
    const API_URL = `${process.env.VUE_APP_BASE_URL}/add_post_workers`;
    const router = useRouter();
    const { query } = useRoute();

    const parameters = { query };

    const post_id = parameters.query.id;

    const formState = reactive({
      post_id: "",
      number_of_nets: "",
      date_received: "",
      received_from: "",
      received_by: [],
    });

    const { villages, loading, isFacility, users, posts } = reactive({
      villages: [],
      loading: true,
      isFacility: false,
      users: [],
      posts: [],
    });

    const ArticleSchema = Yup.object().shape({
      received_by: Yup.array().min(1, "At least 1 post worker is required").required(),
     });

     const validate=(field)=> {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };
    //get posts
    const getPosts = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/posts_data`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      console.log(data.data);
      this.posts = data.data;
      // this.posts = data.map((post) => ({
      //   ...post,
      // }));
      this.loading = false;
    };

    //counties
    const getVillages = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/villages/list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      console.log(data);
      this.villages = data.data;
      this.loading = false;
    };

    //users
    const getUsers = async () => {
      const response = await fetch(`${process.env.VUE_APP_BASE_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.users = data.data;
    };

    onMounted(() => {
      getUsers();
      getVillages();
      getPosts();
    });
    // console.log(formState.isFacility)
    const handleSubmit = (values) => {
      values = {
        post_id: values.post_id,
        workers: values.received_by,
      };

      values.post_id = post_id;

      // const workersProxy = values.workers;
      // const workersArray = Object.values(workersProxy); // [2, 4]

      ArticleSchema.validate(this.formState, {abortEarly: false})
      .then(()=>{
        this.errors = {};
        fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then(({ status, data }) => {
          console.log(data);
          if (status) {
            router.push(`/view-worker?id=${post_id}`);
            notification["success"]({
              message: "Post Workers Added",
              description: "Post Workers have been successfully assigner",
              duration: 5.5,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      })
      .catch((err) => {
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        this.errors = errors;
      });
    };

    return {
      isLoading,
      loading,
      apiUrl,
      isFileLoading,
      isFacility,
      handleSubmit,
      dateFormat,
      formState,
      validate,
      errors: {
        received_by: "",
      },
      join,
      villages,
      posts,
      users,
    };
  },
});

export default AddNew;
</script>
