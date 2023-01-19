<template>
  <UpdatePopup>
    <sdModal
      class="addEvent-modal"
      :footer="null"
      type="primary"
      title="Update Event"
      :visible="visible"
      :onCancel="onCancel"
    >
      <UpdateEvent :onCancel="onCancel" :data="data" />
    </sdModal>

    <sdCards headless>
      <div :class="`headerUpdate ${label}`">
        <h4>{{ title }}</h4>
        <div class="action">
          <a @click="onHandleVisible" to="#">
            <sdFeatherIcons type="edit-3" size="14" />
          </a>
          <a @click="() => onEventDelete(id)" to="#">
            <sdFeatherIcons type="trash-2" size="14" />
          </a>
          <a to="#">
            <sdFeatherIcons type="x" size="14" />
          </a>
        </div>
      </div>
      <div class="bodyUpdate">
        <p class="event-info">
          <sdFeatherIcons type="calendar" size="16" /> <span class="label">Date:</span>
          <strong>{{ dayjs(date[0]).format('dddd, MMMM DD') }}</strong>
        </p>
        <p class="event-info">
          <sdFeatherIcons type="clock" :size="16" /> <span class="label">Time:</span>
          <strong>{{ `${time[0]} - ${time[1]}` }}</strong>
        </p>
        <p class="event-info">
          <img :src="require(`@/static/img/icon/right.svg`)" alt="menu" />
          <span class="desc">{{ description }}</span>
        </p>
      </div>
    </sdCards>
  </UpdatePopup>
</template>
<script>
import dayjs from 'dayjs';
import PropTypes from 'vue-types';
import UpdateEvent from './UpdateEvent';
import { UpdatePopup } from '../Style';
import { ref, toRefs, defineComponent } from 'vue';

const ProjectUpdate = defineComponent({
  name: 'ProjectUpdate',
  components: { UpdatePopup, UpdateEvent },
  props: {
    title: PropTypes.string,
    id: PropTypes.number,
    description: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    onEventDelete: PropTypes.func,
    time: PropTypes.array,
    date: PropTypes.array,
  },
  setup(props) {
    const data = toRefs(props);
    const visible = ref(false);
    const onHandleVisible = () => {
      visible.value = true;
    };
    const onCancel = () => (visible.value = false);

    return {
      data,
      onHandleVisible,
      onCancel,
      dayjs,
      visible,
    };
  },
});

export default ProjectUpdate;
</script>
