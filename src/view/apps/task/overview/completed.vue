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
                <a-checkbox :checked="!!item.completed" @change="() => dispatch(onCompleteUpdate(task, item.id))">
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
        <BasicFormWrapper v-for="(value, i) in task" :key="i">
          <!-- <Form form={form} name="add-task" onFinish={eData => onEditHandle(eData, value.id)}>
                    <Form.Item
                      rules={[{ required: true, message: 'Please add a Title' }]}
                      name="title"
                      initialValue={value.title}
                    >
                      <Input placeholder="Title" />
                    </Form.Item>

                    <Form.Item name="description" initialValue={value.description}>
                      <Input.TextArea rows={4} placeholder="Add Description" />
                    </Form.Item>
                    <Form.Item hidden="true" name="favourite" initialValue={value.favourite}>
                      <Input />
                    </Form.Item>
                    <Form.Item hidden="true" name="completed" initialValue={value.completed}>
                      <Input />
                    </Form.Item>
                    <div class="sDash-modal-actions">
                      <Button size="small" type="white" key="cancel" outlined onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button htmlType="submit" size="small" type="primary" key="submit">
                        Edit
                      </Button>
                    </div>
                  </Form> -->
        </BasicFormWrapper>
      </div>
    </sdModal>
  </TaskListWrap>
</template>
<script>
import { computed, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { BasicFormWrapper } from '../../../styled';
import { TaskListWrap } from '../style';

const Favorite = defineComponent({
  name: 'Favorite',
  components: { BasicFormWrapper, TaskListWrap },
  setup() {
    const { state, dispatch } = useStore();
    const task = computed(() => state.task.data.filter((item) => item.completed).sort((a, b) => b.id - a.id));
    const visible = ref(false);
    const taskEditId = ref('');
    const editableItem = ref({});
    const showModal = (id, item) => {
      taskEditId.value = id;
      visible.value = true;
      editableItem.value = item;
    };

    const handleCancel = () => {
      visible.value = false;
    };

    const handleTaskDelete = (id) => {
      const value = task.value.filter((item) => item.id !== id);
      dispatch('ontaskDelete', value);
    };

    const onEditHandle = (data, id) => {
      const updatedData = task.value.map((item) => {
        if (item.id === id) {
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
    };
  },
});

export default Favorite;
</script>
