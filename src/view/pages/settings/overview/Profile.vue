<template>
  <sdCards>
    <template v-slot:title>
      <div class="setting-card-title">
        <sdHeading as="h4">Edit Profile</sdHeading>
        <span>Set Up Your Personal Information</span>
      </div>
    </template>
    <a-row type="flex" justify="center">
      <a-col :xl="12" :lg="16" :xs="24">
        <BasicFormWrapper>
          <a-form :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed" layout="vertical">
            <a-form-Item label="Name">
              <a-input v-model:value="formState.name" />
            </a-form-Item>
            <a-form-item label="Phone Number">
              <a-input v-model:value="formState.phone" />
            </a-form-item>
            <a-form-item label="Role">
              <a-select v-model:value="formState.role" style="width: 100%">
                <a-select-option value="">Please Select</a-select-option>
                <a-select-option value="dhaka">Program Head</a-select-option>
                <a-select-option value="mymensingh">Program Officer</a-select-option>
                <a-select-option value="khulna">County CHRIO</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Organization">
              <a-input v-model:value="formState.organization" />
            </a-form-item>
            <a-form-item label="Website">
              <a-input v-model:value="formState.website" />
            </a-form-item>
            <a-form-item label="User Bio">
              <a-textarea v-model:value="formState.userBio" :rows="3" />
            </a-form-item>
            <div class="setting-form-actions">
              <sdButton size="default" htmlType="submit" type="success"> Update Profile </sdButton>
              &nbsp; &nbsp;
              <sdButton size="default" @click="handleCancel" type="light"> Cancel </sdButton>
            </div>
          </a-form>
        </BasicFormWrapper>
      </a-col>
    </a-row>
  </sdCards>
</template>
<script>
import { BasicFormWrapper } from '../../../styled';
import { defineComponent, reactive } from 'vue';

const Profile = defineComponent({
  name: 'Profile',
  components: { BasicFormWrapper },

  setup() {
    const formState = reactive({
      name: 'Duran Clayton',
      phone: '0711473829',
      role: '',
      organization: 'Kinga Malaria',
      website: 'https://www.pmi.gov/where-we-work/kenya/',
      userBio:
        'Program Head',
    });

    const handleFinish = (values) => {
      this.values = { ...values, tags: this.tags };
      console.log(values, formState);
    };

    const handleFinishFailed = (errors) => {
      console.log(errors);
    };

    return {
      formState,
      handleFinish,
      handleFinishFailed,
    };
  },

  data() {
    return {
      // tags: ['UI/UX', 'Branding', 'Product Design', 'Web Design'],
      values: null,
      inputVisible: false,
      inputValue: '',
    };
  },

  methods: {
    handleCancel(e) {
      e.preventDefault();
      //form.resetFields();
    },
    handleClose(removedTag) {
      const tags = this.tags.filter((tag) => tag !== removedTag);
      console.log(tags);
      this.tags = tags;
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(function () {
        this.$refs.input.focus();
      });
    },

    handleInputChange(e) {
      this.inputValue = e.target.value;
    },

    handleInputConfirm() {
      const inputValue = this.inputValue;
      let tags = this.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      console.log(tags);
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: '',
      });
    },
  },
});

export default Profile;
</script>
