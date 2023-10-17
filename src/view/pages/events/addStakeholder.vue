<template>
  <Main>
    <sdPageHeader title="Add Stakeholder">
      <sdButton class="btn-add_new" size="default" key="1" type="success">
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
                    <a-form-item name="First Name" label="First Name">
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
                    <a-form-item name="Middle Name" label="Middle Name">
                      <a-input
                        v-model:value="formState.middle_name"
                        placeholder="Input Middle Name"
                        @blur="validate('middle_name')"
                        @keypress="validate('middle_name')"
                      />
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.middle_name"
                      >
                        {{ errors.middle_name }}
                      </p>
                    </a-form-item>
                    <a-form-item name="Last Name" label="Last Name">
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
                    <a-form-item name="ID No" label="ID No">
                      <a-input
                        v-model:value="formState.id_no"
                        placeholder="Input ID No"
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
                    <a-form-item name="Phone No" label="Phone No">
                      <a-input
                        v-model:value="formState.phone_no"
                        placeholder="254..."
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
                    <a-form-item label="Organization">
                      <a-select
                        v-model:value="formState.organization"
                        v-if="!loading"
                        placeholder="Select Organization"
                        show-search
                        option-filter-prop="label"
                        @blur="validate('organization')"
                        @keypress="validate('organization')"
                        v-on:change="getRoles($event)"
                      >
                        <a-select-option
                          v-for="organization in organizations"
                          :key="organization.id"
                          :value="organization.id"
                          :label="`${organization.name} `"
                        >
                          {{ organization.name }} -
                          {{ organization.description }}
                        </a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.organization"
                      >
                        {{ errors.organization }}
                      </p>
                    </a-form-item>
                    <a-form-item label="Role">
                      <a-select
                        v-model:value="formState.role"
                        v-if="!loading"
                        placeholder="Select Role"
                        show-search
                        option-filter-prop="label"
                        @blur="validate('role')"
                        @keypress="validate('role')"
                      >
                        <a-select-option
                          v-for="role in roles"
                          :key="role.id"
                          :value="role.id"
                          :label="`${role.name}`"
                        >
                          {{ role.name }}
                        </a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.organization"
                      >
                        {{ errors.organization }}
                      </p>
                    </a-form-item>
                    <a-form-item name="Gender" label="Gender">
                      <a-select
                        v-model:value="formState.gender"
                        v-if="!loading"
                        placeholder="Select Gender"
                        @blur="validate('gender')"
                        @keypress="validate('gender')"
                        show-search
                        option-filter-prop="label"
                      >
                        <a-select-option
                          v-for="g in gender"
                          :key="g.id"
                          :value="g.id"
                          :label="`${g.name}`"
                        >
                          {{ g.name }}
                        </a-select-option>
                      </a-select>
                      <p
                        class="errors"
                        style="color: red"
                        v-if="!!errors.gender"
                      >
                        {{ errors.gender }}
                      </p>
                    </a-form-item>
                    <a-form-item
                      name="otp"
                      label="Stakeholder OTP"
                      v-if="stakeholder_otp"
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
                        v-if="!stakeholder_otp"
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
                        v-if="stakeholder_otp"
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
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";
import * as Yup from "yup";
import store from "../../../vuex/store";

// testing app

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const isSubmitting = computed(() => state.isSubmitting);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");
    const stakeholder_otp = ref(false);

    const router = useRouter();

    const API_URL = `${process.env.VUE_APP_BASE_URL}`;

    const organization_url = `${process.env.VUE_APP_BASE_URL}/organizations`;

    const trainer_url = `${process.env.VUE_APP_BASE_URL}/users`;

    const events_url = `${process.env.VUE_APP_BASE_URL}/events_list`;

    const { gender, organizations, loading, counties, roles, events_list } =
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
      });

    const fetchEvents = async () => {
      const response = await fetch(events_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.events_list = data.data;
      console.log(this.events_list);
      this.loading = false;
    };

    const fetchFacilitators = async () => {
      const response = await fetch(organization_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.organizations = data.data;
      console.log(data.data);
      this.loading = false;
    };
    const fetchTrainer = async () => {
      const response = await fetch(trainer_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      const data = await response.json();
      this.facilitators = data.data;
      // console.log(data.data);
      this.loading = false;
    };

    const getCounties = async () => {
      const response = await fetch(`${process.env.VUE_APP_BASE_URL}/counties`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });

      const data = await response.json();
      this.counties = data.map((county) => ({
        ...county,
        // org_id: county.org_id,
      }));
      this.loading = false;
    };
    onMounted(() => {
      getCounties();
      fetchTrainer();
      fetchFacilitators();
      fetchEvents();
    });

    // function handleChange(request, response, value) {
    //   console.log(value);
    //   // getRoles(value);
    // }
    const getRoles = async (org_id) => {
      console.log(org_id);
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/get_roles_given_the_org?organization_id=${org_id}`,
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
      this.roles = data.data;
    };

    getRoles();

    const user = JSON.parse(sessionStorage.getItem("user"));

    const user_level_id = user.user.level_id;

    const isLevelOne = user_level_id === 1;

    console.log(isLevelOne);

    const formState = reactive({
      gender: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      id_no: null,
      phone_no: null,
      role: null,
      organization: [],
      otp: null,
    });

    const regex =
      /^254((1|7)(?:(?:[12945][0-9])|(?:0[0-8])|(9[0-2]))[0-9]{6})$/;

    const ArticleSchema = Yup.object().shape({
      first_name: Yup.string().required("First Name is required"),
      middle_name: Yup.string().required("Middle Name is required"),
      last_name: Yup.string().required("Last Name is required"),
      organization: Yup.string().required("Organization is required"),
      role: Yup.string().required("Role is required"),
      id_no: Yup.string().required("ID No is required"),
      phone_no: Yup.string()
        .matches(regex, "Invalid Safaricom phone number")
        .required("Phone No is required"),
      gender: Yup.string().required("Gender is required"),
    });

    const validate = (field) => {
      ArticleSchema.validateAt(field, formState)
        .then(() => (this.errors[field] = ""))
        .catch((err) => {
          this.errors[err.path] = err.message;
        });
    };

    const data = {
      first_name: formState.first_name,
      middle_name: formState.middle_name,
      last_name: formState.last_name,
      id_no: formState.id_no,
      phone_no: formState.phone_no,
      organization: formState.organization,
      role: formState.role,
      gender: formState.gender,
      otp: formState.otp,
    };

    sessionStorage.setItem("stakeholder", JSON.stringify(data));

    const handleSubmit = () => {
      const data = {
        first_name: formState.first_name,
        middle_name: formState.middle_name,
        last_name: formState.last_name,
        id_no: formState.id_no,
        phone_no: formState.phone_no,
        organization: formState.organization,
        role: formState.role,
        gender: formState.gender,
        otp: formState.otp,
      };

      sessionStorage.setItem("stakeholder", JSON.stringify(data));
      store.commit("setIsSubmitting", true);
      const sendotp = {
        first_name: formState.first_name,
        last_name: formState.last_name,
        phone_no: formState.phone_no,
      };
      console.log(JSON.stringify(sendotp));

      if (!this.stakeholder_otp) {
        ArticleSchema.validate(this.formState, { abortEarly: false })
          .then(() => {
            fetch(`${API_URL}/stakeholder/get_otp`, {
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
                  this.stakeholder_otp = true;

                  const stakeholder_data =
                    sessionStorage.getItem("stakeholder");

                  console.log(stakeholder_data);

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
              description: "An error has occured. Please try again later.",
            });
            err.inner.forEach((e) => {
              this.errors[e.path] = e.message;
            });
          });
      } else {
        console.log(data);
        fetch(`${API_URL}/stakeholder/create`, {
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
              router.push("/masterlist");
              notification["success"]({
                message: "Stakeholder Created",
                description: message,
                duration: 5.5,
              });
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
      organizations,
      loading,
      counties,
      // handleChange,
      events_list,
      validate,
      isLevelOne,
      getRoles,
      stakeholder_otp,
      roles,
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

export default AddNew;
</script>
