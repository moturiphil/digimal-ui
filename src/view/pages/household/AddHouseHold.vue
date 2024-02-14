<template>
  <Main>
    <sdPageHeader ghost :title="`Add Household to ${chp_village}`" /> 

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
                    name="addhh"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <!-- 
                     *Enter the phone number e.g. 07... 
                     *Enter the ID Number of the household head: 
                     *Confirm the ID Number of the household head:

                     *********************************
                     *ERROR RES **********************
                     *ID number mismatch. Please *****
                     *ensure the ID number is valid.**
                     *********************************


                     *Enter firstname of household head: 
                     *Enter middlename of household head (NOT MANDATORY)
                     *Enter lastname of household head: 
                     *Enter number of household members: 

                     Select Closest Distribution post for household
                -->
                    <a-form-item
                      name="Phone No"
                      label="Enter the phone number of the household head"
                    >
                      <a-input
                        v-model:value="formState.phone_no"
                        placeholder="e.g. 07..."
                        type="number"
                        @blur="validate('phone_no')"
                        @keypress="validate('phone_no')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.phone_no"
                      >
                        {{ errors.phone_no }}
                      </p>
                    </a-form-item>

                    <a-form-item
                      name="ID No"
                      label="Enter the ID Number of the household head"
                    >
                      <a-input
                        v-model:value="formState.id_no"
                        placeholder="6-8 digits"
                        type="number"
                        @blur="validate('id_no')"
                        @keypress="validate('id_no')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.id_no"
                      >
                        {{ errors.id_no }}
                      </p>
                    </a-form-item>

                    <!-- Confirm the ID Number of the household head -->
                    <a-form-item
                      name="ID No"
                      label="Confirm the ID Number of the household head"
                    >
                      <a-input
                        v-model:value="formState.confirm_id_no"
                        placeholder="6-8 digits"
                        type="number"
                        @blur="validate('confirm_id_no')"
                        @keypress="validate('confirm_id_no')"
                        @paste="onPaste"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.confirm_id_no"
                      >
                        {{ errors.confirm_id_no }}
                      </p>
                    </a-form-item>

                    <a-form-item
                      name="First Name"
                      label="Enter first name of household head:"
                    >
                      <a-input
                        v-model:value="formState.first_name"
                        placeholder="Input First Name"
                        @blur="validate('first_name')"
                        @keypress="validate('first_name')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.first_name"
                      >
                        {{ errors.first_name }}
                      </p>
                    </a-form-item>
                    <a-form-item
                      name="Middle Name"
                      label="Enter middle name of household head:"
                    >
                      <a-input
                        v-model:value="formState.middle_name"
                        placeholder="Input Middle Name"
                        @blur="validate('middle_name')"
                        @keypress="validate('middle_name')"
                      />
                    </a-form-item>
                    <a-form-item
                      name="Last Name"
                      label="Enter last name of household head:"
                    >
                      <a-input
                        v-model:value="formState.last_name"
                        placeholder="Input Last Name"
                        @blur="validate('last_name')"
                        @keypress="validate('last_name')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.last_name"
                      >
                        {{ errors.last_name }}
                      </p>
                    </a-form-item>

                    <!-- Enter number of household members: -->
                    <a-form-item
                      name="ID No"
                      label="Enter number of household members:"
                    >
                      <a-input
                        v-model:value="formState.members"
                        placeholder="Household members"
                        type="number"
                        @blur="validate('members')"
                        @keypress="validate('members')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.members"
                      >
                        {{ errors.members }}
                      </p>
                    </a-form-item>

                    <!-- <a-form-item name="campaign_id" label="Distribution Post">
                      <a-select
                        v-model:value="formState.post"
                        v-if="!loading"
                        placeholder="Select Post for Household"
                        @blur="validate('post_id')"
                        @keypress="validate('post_id')"
                        show-search
                        option-filter-prop="label"
                      >
                        <a-select-option
                          v-for="post in posts"
                          :key="post.id"
                          :value="post.id"
                          :label="`${post.name}`"
                        >
                          {{ post.name }}
                        </a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.post"
                      >
                        {{ errors.post }}
                      </p>
                    </a-form-item> -->

                    <a-form-item
                      name="otp"
                      label="Household OTP"
                      v-if="household_otp"
                    >
                      <a-input
                        v-model:value="formState.otp"
                        placeholder="OTP."
                        type="number"
                      />
                    </a-form-item>
                    <div class="record-form-actions text-right">
                      <!-- <sdButton
                          size="default"
                          htmlType="Save"
                          type="success"
                          :disabled="isSubmitting"
                        >
                          {{
                            isLoading
                              ? "Loading..."
                              : isSubmitting
                              ? "Processing ..."
                              : "Verify OTP"
                          }}
                        </sdButton> -->
                      <sdButton
                        size="default"
                        htmlType="Save"
                        type="success"
                        :disabled="isSubmitting"
                        @click="handleButtonClick"
                        v-if="!household_otp"
                      >
                        {{
                          isLoading
                            ? "Loading..."
                            : isSubmitting
                              ? "Processing ..."
                              : "Verify OTP"
                        }}
                      </sdButton>
                      <sdButton
                        size="default"
                        htmlType="Save"
                        type="success"
                        :disabled="isSubmitting"
                        @click="handleButtonClick"
                        v-if="household_otp"
                      >
                        {{
                          isLoading
                            ? "Loading..."
                            : isSubmitting
                              ? "Processing ..."
                              : "Submit"
                        }}
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
import { RecordFormWrapper } from "./style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed } from "vue";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
// import { useRouter } from "vue-router";
import * as Yup from "yup";
import store from "../../../vuex/store";

// import axios from "@/Axiosconfig";

// testing app

const AddNewHH = defineComponent({
  name: "AddHH",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const isSubmitting = computed(() => state.isSubmitting);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");
    const household_otp = ref(false);

    // const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}`;

    const { gender,  loading, counties, events_list, posts } =
      reactive({
        gender: [
          { id: "M", name: "Male" },
          { id: "F", name: "Female" },
        ],
        loading: true,
        organizations: [],
        counties: [],
        sub_county_id: "",
        events_list: [],
        roles: "",
        posts: [],
      });

    const user = JSON.parse(sessionStorage.getItem("user"));

    const user_level_id = user.user.level_id;

    const isLevelOne = user_level_id === 1;

    console.log(user);
    const chp = user.user;

    const chp_name = chp.first_name + " " + chp.last_name;

    const chp_village = chp.location.name;

    const chp_village_id = chp.location.id;


    const formState = reactive({
      gender: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      id_no: null,
      phone_no: null,
      members: null,
      otp: null,
    });

    const regex = /^(07|01)\d{8}$/;

    const ArticleSchema = Yup.object().shape({
      first_name: Yup.string().required("First Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      id_no: Yup.string().required("ID No is required"),
      confirm_id_no: Yup.string()
        .oneOf([Yup.ref("id_no"), null], "ID numbers must match")
        .required("Confirm ID No is required"),
      phone_no: Yup.string()
        .matches(regex, "Invalid Phone Number")
        .required("Phone No is required"),
      members: Yup.number()
        .required("Members are required")
        .min(1, "Members must be greater than 0")
        .max(19, "Members must be less than 20"),
    });

    const validate = async (field) => {
      try {
        await ArticleSchema.validateAt(field, formState);
        this.errors[field] = "";
      } catch (err) {
        this.errors[err.path] = err.message;
      }
    };

    // const chw = sessionStorage.getItem("user", JSON.stringify(user));

    // console.log(chw);

    const data = {
      first_name: formState.first_name,
      middle_name: formState.middle_name,
      last_name: formState.last_name,
      id_no: formState.id_no,
      phone_no: formState.phone_no,
      otp: formState.otp,
      hh_size: formState.members,
      village_id: chp_village_id,
    };

    sessionStorage.setItem("household", JSON.stringify(data));

    const handleSubmit = () => {
      const data = {
        otp: formState.otp,
        first_name: formState.first_name,
        middle_name: formState.middle_name,
        last_name: formState.last_name,
        phone_no: formState.phone_no,
        id_no: formState.id_no,
        hh_size: formState.members,
        village_id: chp_village_id,
      };

      sessionStorage.setItem("household", JSON.stringify(data));
      store.commit("setIsSubmitting", true);
      const sendotp = {
        firstname: formState.first_name,
        lastname: formState.last_name,
        phone_no: formState.phone_no,
      };
      console.log(JSON.stringify(sendotp));

      if (!this.household_otp) {
        ArticleSchema.validate(this.formState, { abortEarly: false })
          .then(() => {
            fetch(`${API_URL}/web_hh_otp`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeader(),
              },
              body: JSON.stringify(sendotp),
            })
              .then((response) => response.json())
              .then(({ success, message }) => {
                console.log(message);
                if (success == true) {
                  notification["success"]({
                    message: "Success",
                    description: message,
                    duration: 5.5,
                  });
                  this.household_otp = true;

                  // const household_data = sessionStorage.getItem("household");

                  // console.log(household_data);

                  fetch(`${API_URL}/create_household`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...authHeader(),
                    },
                    body: JSON.stringify(data),
                  })
                    .then((response) => response.json())
                    .then(({ success, message }) => {
                      console.log(message);
                      if (success == true) {
                        store.commit("setIsSubmitting", false);
                        notification["success"]({
                          message: "Household Created, pending OTP Validation",
                          description: message,
                          duration: 5.5,
                        });
                        // location.reload();
                      }
                      // show error message from the api response
                      else {
                        store.commit("setIsSubmitting", false);
                        notification["error"]({
                          message: "Error!",
                          description: message,
                          duration: 5.5,
                        });
                      }
                    })
                    .catch((error) => {
                      store.commit("setIsSubmitting", false);
                      notification["error"]({
                        message: "Error!",
                        description: `${error}`,
                        duration: 5.5,
                      });
                    });

                  store.commit("setIsSubmitting", false);
                }
                // show error message from the api response
                else {
                  notification["error"]({
                    message: "Error!",
                    description: message,
                    duration: 5.5,
                  });
                }
              })
              .catch((error) => {
                store.commit("setIsSubmitting", false);
                notification["error"]({
                  message: "Error!",
                  description: `${error}`,
                  duration: 5.5,
                });
              });
          })
          .catch((err) => {
            store.commit("setIsSubmitting", false);
            notification.error({
              message: "Could not submit!",
              description: "An error has occured. Fill the necessary fields.",
            });
            err.inner.forEach((e) => {
              this.errors[e.path] = e.message;
            });
          });
      } else {
        console.log(data);
        fetch(`${API_URL}/create_household`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then(({ success, message }) => {
            console.log(message);
            if (success == true) {
              store.commit("setIsSubmitting", false);
              notification["success"]({
                message: "Household Created",
                description: message,
                duration: 5.5,
              });
              // location.reload();
            }
            // show error message from the api response
            else {
              store.commit("setIsSubmitting", false);
              notification["error"]({
                message: "Error!",
                description: message,
                duration: 5.5,
              });
            }
          })
          .catch((error) => {
            store.commit("setIsSubmitting", false);
            notification["error"]({
              message: "Error!",
              description: `${error}`,
              duration: 5.5,
            });
          });
      }
    };

    return {
      isLoading,
      isSubmitting,
      apiUrl,
      isFileLoading,
      join,
      handleSubmit,
      formState,
      gender,
      chp_name,
      chp_village,
      loading,
      counties,
      // handleChange,
      events_list,
      validate,
      isLevelOne,
      household_otp,
      posts,
      errors: {
        gender: null,
        name: null,
        county_id: "",
        location_type: null,
        facilitator_id: "",
        organization: null,
        no_of_days: null,
        venue: "",
      },
    };
  },
});

export default AddNewHH;
</script>
