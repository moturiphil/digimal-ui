<template>
  <TaskListWrap class="mb-30">
    <div class="sDash_tasklist-wrap">
      <div class="sDash_tasklist-head">
        <h2 class="sDash_task-list-title">Task Lists</h2>
      </div>
      <div class="sDash_tasklist-body">
        <ul v-if="task.length > 0" class="sDash_tasks">
          <li v-for="(item, i) in task" class="sDash_tasks-item" :key="i">
            <div class="sDash_tasks-item__content">
              <div class="sDash_tasks-item__title">
                <a-checkbox
                  :checked="!!item.completed"
                  @change="() => dispatch('onCompleteUpdate', { data: task, id: item.id })"
                >
                  {{ item.title }}
                </a-checkbox>
              </div>
              <div class="sDash_tasks-item__text">
                <p>{{ item.description }}</p>
              </div>
            </div>

            <div class="sDash_tasks-item__action">
              <a
                to="#"
                :class="`${item.favourite ? 'task-favourite active' : 'task-favourite'}`"
                @click="() => dispatch('onStarUpdate', { data: task, id: item.id })"
              >
                <sdFeatherIcons type="star" size="14" />
              </a>
              <sdDropdown>
                <template #overlay>
                  <a to="#" @click="() => showModal(item.id, item)">
                    <sdFeatherIcons type="edit" size="14" />
                    <span>Edit</span>
                  </a>
                  <a to="#" @click="() => handleTaskDelete(item.id)">
                    <sdFeatherIcons type="trash-2" size="14" />
                    <span>Delete</span>
                  </a>
                </template>
                <a to="#">
                  <sdFeatherIcons type="more-vertical" size="18" />
                </a>
              </sdDropdown>
            </div>
          </li>
        </ul>

        <div v-else class="sDash_empty-task">
          <span>Sorry !! No Task Found :(</span>
        </div>
      </div>
    </div>
    <sdModal
      title="Edit Task"
      class="sDash_addTask-modal"
      type="primary"
      :visible="visible"
      :footer="null"
      :onCancel="handleCancel"
    >
      <div class="sDash_addTask-modal-inner">
        <BasicFormWrapper>
          <a-form name="add-task" :model="formState" @finish="onEditHandle">
            <a-form-item name="title">
              <a-input v-model:value="formState.title" placeholder="Title" />
            </a-form-item>

            <a-form-item name="description">
              <a-textarea :rows="4" v-model:value="formState.description" placeholder="Add Description" />
            </a-form-item>
            <a-form-item hidden="true" name="favourite">
              <a-input v-model:value="formState.favourite" />
            </a-form-item>
            <a-form-item hidden="true" name="completed">
              <a-input v-model:value="formState.completed" />
            </a-form-item>

            <div class="sDash-modal-actions">
              <sdButton size="small" type="white" key="cancel" outlined @click="handleCancel"> Cancel </sdButton>
              <sdButton htmlType="submit" size="small" type="primary" key="submit"> Submit </sdButton>
            </div>
          </a-form>
        </BasicFormWrapper>
      </div>
    </sdModal>
  </TaskListWrap>
</template>
<script>
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { BasicFormWrapper } from '../../../styled';
import { TaskListWrap } from '../style';

const All = {
  name: 'All',
  components: { BasicFormWrapper, TaskListWrap },
  setup() {
    const { state, dispatch } = useStore();
    const task = computed(() => state.task.data.sort((a, b) => b.id - a.id));
    const visible = ref(false);
    const taskEditId = ref('');
    const editableItem = ref({});

    let formState = reactive({
      title: '',
      description: '',
      favourite: '',
      completed: '',
      id: '',
    });

    const showModal = (id, item) => {
      console.log(item);
      taskEditId.value = id;
      visible.value = true;
      editableItem.value = item;
      formState.title = item.title;
      formState.description = item.description;
      formState.favourite = item.favourite;
      formState.completed = item.completed;
      formState.id = id;
    };

    const handleCancel = () => {
      visible.value = false;
    };

    const handleTaskDelete = (id) => {
      const value = task.value.filter((item) => item.id !== id);
      dispatch('ontaskDelete', value);
    };

    const onEditHandle = (data) => {
      const updatedData = task.value.map((item) => {
        if (item.id === formState.id) {
          // eslint-disable-next-line no-param-reassign
          item = data;
          return item;
        }
        return item;
      });

      visible.value = false;
      dispatch('ontaskEdit', updatedData);
    };

    return {
      task,
      visible,
      taskEditId,
      editableItem,
      showModal,
      handleCancel,
      handleTaskDelete,
      onEditHandle,
      dispatch,
      formState,
    };
  },
};

export default All;
</script>
