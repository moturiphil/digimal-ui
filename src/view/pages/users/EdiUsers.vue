<template>
  <a-form :model="formState" autocomplete="off" @finish="handleSubmit">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="First Name"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input
            v-model:value="formState.first_name"
            placeholder="First Name"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Last Name"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input v-model:value="formState.last_name" placeholder="Last Name"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Middle Name"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input
            v-model:value="formState.middle_name"
            placeholder="Middle Name"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="ID No" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-input v-model:value="formState.id_no" placeholder="Id No"></a-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item
          label="Location"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input
            v-model:value="formState.location_id"
            placeholder="Location"
            :disabled="true"
          ></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Organisation"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input
            v-model:value="formState.org_types_id"
            placeholder="Organisation"
            :disabled="true"
          ></a-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="Phone" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-input v-model:value="formState.phone_no" placeholder="Phone"></a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="Role" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-input
            v-model:value="formState.role_id"
            placeholder="Role"
            :disabled="true"
          ></a-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
      <a-button
        style="background: rgb(61, 166, 92); color: aliceblue"
        html-type="submit"
        @click="editUser"
        >Submit</a-button
      >
    </a-form-item>
  </a-form>
</template>
<script setup>
import { onMounted, defineProps, reactive, defineEmits } from "vue";
import { notification } from "ant-design-vue";
import axios from "@/Axiosconfig";
const emit = defineEmits(["close-editmodal"]);
onMounted(() => {});
const props = defineProps({
  formFields: Object,
});
const formState = reactive(props.formFields);
console.log(props.formFields);
const editUser = async () => {
  const data = {
    id: formState.id,
    first_name: formState.first_name,
    middle_name: formState.middle_name,
    last_name: formState.last_name,
    location_id: formState.location_id,
    org_types_id: formState.org_types_id,
    role_id: formState.role_id,
    id_no: formState.id_no,
    phone_no: formState.phone_no,
  };
  await axios
    .post(`update_user_details/${formState.id}/`, data)
    .then(async (response) => {
      notification.success({
        message: `Success!`,
        description: `${response.data.message}`,
      });
      await axios
        .post(`update_user_id_no/${formState.id}/${props.formFields.id_no}/`, {
          id: formState.id,
          id_no: formState.id_no,
        })
        .then((res) => {
          emit("close-editmodal", false);
          notification.success({
            message: `Success!`,
            description: `${res.data.message}`,
          });
        });
    })
    .catch((e) => {
      notification.error({
        message: `User Update Error!`,
        description: `${e}`,
      });
      console.log(e);
    });
};
</script>

<style>
/* You can style the toggle switch as needed */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #1ec997;
}

input:focus + .slider {
  box-shadow: 0 0 1px #1ec997;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
