<template>
  <div v-if="isTaskLoading">loading</div>
  <div v-else :class="taskId === id ? 'sDash_kanvan-task__editable' : ''">
    <h4 class="sDash_kanvan-task__title">
      <a @click="() => showModal(data)" href="#">
        {{ title }}
      </a>
      <a href="#" class="btn-edit" @click="() => onBackShadow(id)">
        <sdFeatherIcons type="edit-2" size="12" />
      </a>
    </h4>
    <div class="sDash_kanvan-task__edit" draggable="false">
      <div class="sDash_kanvan-task__edit--left">
        <a-input @pressEnter="() => onTaskTitleUpdate(value, id)" @change="onTaskTitleChange" v-model:value="value" />
        <sdButton
          @click="() => onTaskTitleUpdate(value, id)"
          class="edit-kanban-task"
          htmlType="submit"
          size="small"
          type="primary"
        >
          Save
        </sdButton>
      </div>
      <div class="sDash_kanvan-task__edit--right">
        <a href="#" class="btn-delete" @click="(e) => onTaskTitleDelete(e, id)">
          <sdFeatherIcons type="trash-2" size="12" />
          <span>Delete Task</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, toRefs, ref, defineComponent } from 'vue';
import propTypes from 'vue-types';
import { useStore } from 'vuex';

const KanbanBoardItem = defineComponent({
  name: 'KanbanBoardItem',
  props: {
    data: propTypes.object,
    showModal: propTypes.func,
    onBackShadow: propTypes.func,
    taskId: propTypes.string,
    onTaskTitleUpdate: propTypes.func,
    onTaskTitleDelete: propTypes.func,
  },
  setup(props) {
    const { state } = useStore();
    const isTaskLoading = computed(() => state.KanbanBoard.tsLoading);
    const { data } = toRefs(props);
    const { title, id } = toRefs(data.value);
    const value = ref(title.value);

    const onTaskTitleChange = (e) => {
      value.value = e.target.value;
    };

    return {
      onTaskTitleChange,
      isTaskLoading,
      title,
      id,
      value,
    };
  },
});

export default KanbanBoardItem;
</script>
