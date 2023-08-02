<template>
  <Main>
    <sdPageHeader title="Receive Nets">
      <sdButton class="btn-add_new" size="default" key="1" type="sucess">
        <router-link to="/crud/axios-view">View All</router-link>
      </sdButton>
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
                    <a-form-item name="post_id" label="Post Name">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select Post"
                        v-model:value="formState.post_id"
                        @blur="validate('post_id')"
                        @keypress="validate('post_id')"
                      >
                        <a-select-option
                          v-for="post in posts"
                          :value="post.id"
                          :key="post.id"
                          >{{ post.name }}</a-select-option
                        >
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.post_id"
                      >
                        {{ errors.post_id }}
                      </p>
                    </a-form-item>
                    <a-form-item name="bale_size" label="Bale Size">
                      <a-input
                        v-model:value="formState.bale_size"
                        placeholder="Enter bale size"
                        type="number"
                        @blur="validate('bale_size')"
                        @keypress="validate('bale_size')"
                      >
                      </a-input>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.bale_size"
                      >
                        {{ errors.bale_size }}
                      </p>
                    </a-form-item>
                    <a-form-item name="number_of_nets" label="Number of Bales">
                      <a-input
                        v-model:value="formState.number_of_nets"
                        placeholder="Enter number of bales"
                        type="number"
                        @blur="validate('number_of_nets')"
                        @keypress="validate('number_of_nets')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.number_of_nets"
                      >
                        {{ errors.number_of_nets }}
                      </p>
                    </a-form-item>
                    <a-form-item name="nets_remaining" label="Nets remaining">
                      <a-input
                        v-model:value="formState.nets_remaining"
                        placeholder="Enter number of nets remaining"
                        type="number"
                        @blur="validate('nets_remaining')"
                        @keypress="validate('nets_remaining')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.nets_remaining"
                      >
                        {{ errors.nets_remaining }}
                      </p>
                    </a-form-item>
                    <a-form-item name="delivery_no" label="Delivery Note No.">
                      <a-input
                        v-model:value="formState.delivery_no"
                        placeholder="Delivery Note No."
                        @blur="validate('delivery_no')"
                        @keypress="validate('delivery_no')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.delivery_no"
                      >
                        {{ errors.delivery_no }}
                      </p>
                    </a-form-item>
                    <a-form-item name="date_received" label="Date Received">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.date_received"
                        :format="dateFormat"
                        @blur="validate('date_received')"
                        @keypress="validate('date_received')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.date_received"
                      >
                        {{ errors.date_received }}
                      </p>
                    </a-form-item>
                    <a-form-item name="received_from" label="Received From">
                      <a-select
                        v-model:value="formState.received_from"
                        v-if="!loading"
                        placeholder="Select Received By"
                        @blur="validate('received_from')"
                        @keypress="validate('received_from')"
                      >
                        <a-select-option value="KEMSA">KEMSA</a-select-option>
                        <a-select-option value="MEDS">MEDS</a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.received_from"
                      >
                        {{ errors.received_from }}
                      </p>
                    </a-form-item>

                    <a-form-item name="received_by" label="Received By">
                      <a-select
                        v-model:value="formState.received_by"
                        v-if="!loading"
                        placeholder="Select Received By"
                        @blur="validate('received_by')"
                        @keypress="validate('received_by')"
                      >
                        <a-select-option
                          v-for="user in users"
                          :key="user.id"
                          v-model:value="user.id"
                        >
                          {{ user.first_name }}
                          {{ user.last_name }} - {{ user.id_no }}
                        </a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.received_by"
                      >
                        {{ errors.received_by }}
                      </p>
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
    const API_URL = `${process.env.VUE_APP_BASE_URL}/net_deliveries`;
    const router = useRouter();

    const formState = reactive({
      post_id: "",
      number_of_nets: 0,
      date_received: "",
      received_from: "",
      received_by: "",
      delivery_no: "",
      nets_remaining: "",
    });

    const { villages, loading, isFacility, users, posts } = reactive({
      villages: [],
      loading: true,
      isFacility: false,
      users: [],
      posts: [],
    });

    const ArticleSchema = Yup.object().shape({
      post_id: Yup.string().required("Name is required"),
      number_of_nets: Yup.number().required("Bale size is required"),
      bale_size: Yup.number().required("Bale size is required"),
      date_received: Yup.string().required("Date received is required"),
      received_from: Yup.string().required("Received from is required"),
      received_by: Yup.string().required("Received by is required"),
      delivery_no: Yup.string().required("Delivery no is required"),
      nets_remaining: Yup.number().required(
        "Number of nets remaining is required"
      ),
    });

    const validate = (field) => {
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
    const handleSubmit = () => {
      console.log("jhjkkjgkjgkghghghjjh");
      const values = {
        post_id: formState.post_id,
        no_of_bales: formState.number_of_nets,
        bale_size: formState.number_of_nets,
        date_received: formState.date_received,
        received_from: formState.received_from,
        received_by: formState.received_by,
        delivery_note_number: formState.delivery_no,
        nets_remaining: formState.nets_remaining,
      };

      ArticleSchema.validate(this.formState, { abortEarly: false })
        .then(() => {
          this.error = {};

          fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeader(),
            },
            body: JSON.stringify(values),
          })
            .then((response) => response.json())
            .then(({ success, data }) => {
              console.log(data);
              if (success) {
                router.push("delivered");
                notification["success"]({
                  message: "Nets Received",
                  description: "Nets have been successfully delivered",
                  duration: 5.5,
                });
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        })
        .catch((err) => {
          err.inner.forEach((e) => {
            this.errors[e.path] = e.message;
          });
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
      join,
      validate,
      errors: {
        post_id: "",
        number_of_nets: "",
        date_received: "",
        received_from: "",
        received_by: "",
        delivery_no: "",
        bale_size: "",
        nets_remaining: "",
      },
      villages,
      posts,
      users,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (!sessionStorage.getItem("user")) {
      next("/auth/login");
    } else {
      next();
    }
  },
});

export default AddNew;
</script>
