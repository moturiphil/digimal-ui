<template>
  <BasicFormWrapper>
    <AddEventWrap>
      <a-form :model="formState" :style="{ width: '100%' }" name="addNewEvent" @finish="handleSubmit">
        <a-form-item v-bind="formItemLayout" label="Title" name="title">
          <a-input v-model:value="formState.title" placeholder="Weekly report meeting" />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" name="type" label="Event Type">
          <a-radio-group v-model:value="formState.type">
            <a-radio value="event">Event</a-radio>
            <a-radio value="reminder">Reminder</a-radio>
            <a-radio value="task">Task</a-radio>
          </a-radio-group>
        </a-form-item>
        <div class="ant-form-item">
          <a-row>
            <a-col :sm="4" :xs="24">
              <span class="label">Start:</span>
            </a-col>
            <a-col :sm="20" :xs="24">
              <div class="date-time-picker d-flex">
                <a-row :gutter="15">
                  <a-col :sm="12">
                    <a-date-picker v-model:value="startDate" />
                  </a-col>
                  <a-col :sm="12">
                    <a-time-picker v-model:value="startTime" />
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="ant-form-item">
          <a-row>
            <a-col :sm="4" :xs="24">
              <span class="label">End:</span>
            </a-col>
            <a-col :sm="20" :xs="24">
              <div class="date-time-picker d-flex">
                <a-row :gutter="15">
                  <a-col :sm="12">
                    <a-date-picker v-model:value="endDate" />
                  </a-col>
                  <a-col :sm="12">
                    <a-time-picker v-model:value="endTime" />
                  </a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </div>

        <a-form-item v-bind="formItemLayout" class="event-desc" name="description" label="Description">
          <a-textarea v-model:value="formState.description" placeholder="Write Your Description" />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" name="label" label="Label">
          <a-select v-model:value="formState.label" :style="{ width: '100%' }">
            <a-select-option value="primary">
              <span>
                <span class="bullet primary"></span>
                Primary
              </span>
            </a-select-option>
            <a-select-option value="secondary">
              <span>
                <span class="bullet secondary" />
                Secondary
              </span>
            </a-select-option>
            <a-select-option value="success">
              <span>
                <span class="bullet success" />
                success
              </span>
            </a-select-option>
            <a-select-option value="warning">
              <span>
                <span class="bullet warning" />
                Warning
              </span>
            </a-select-option>
            <a-select-option value="info">
              <span>
                <span class="bullet info" />
                Info
              </span>
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <div class="add-event-footer text-right">
            <sdButton
              class="ant-btn ant-btn-white"
              @click="
                () => {
                  return form.resetFields();
                }
              "
            >
              Reset
            </sdButton>
            <sdButton htmlType="submit" class="btn-save" type="primary"> Save </sdButton>
          </div>
        </a-form-item>
      </a-form>
    </AddEventWrap>
  </BasicFormWrapper>
</template>
<script>
import dayjs from 'dayjs';
import PropTypes from 'vue-types';
import { AddEventWrap } from '../Style';
import { BasicFormWrapper } from '../../../styled';
import { reactive, toRefs, ref, defineComponent } from 'vue';

const dateFormat = 'YYYY/MM/DD';

const AddNewEvent = defineComponent({
  name: 'AddNewEvent',
  props: {
    onHandleAddEvent: PropTypes.func,
  },
  components: { AddEventWrap, BasicFormWrapper },
  setup(props) {
    const { onHandleAddEvent } = toRefs(props);
    const startDate = ref(dayjs());
    const endDate = ref(dayjs());
    const startTime = ref('');
    const endTime = ref('');

    const formItemLayout = reactive({
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    });

    const formState = reactive({
      title: '',
      description: '',
      type: 'event',
      label: 'primary',
    });

    const handleSubmit = (values) => {
      onHandleAddEvent.value({
        title: values.title,
        description: values.description,
        date: [dayjs(startDate.value).format('MM/DD/YYYY'), dayjs(endDate.value).format('MM/DD/YYYY')],
        time: [startTime.value.format('HH:mm a'), endTime.value.format('HH:mm a')],
        type: values.type,
        label: values.label,
      });
    };

    return {
      startDate,
      endDate,
      startTime,
      endTime,
      formItemLayout,
      handleSubmit,
      formState,
      dateFormat,
      dayjs,
    };
  },
});

export default AddNewEvent;
</script>
