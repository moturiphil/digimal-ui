<template>
  <div class="task-list-inner table-responsive">
    <a-table :pagination="false" :rowSelection="rowSelection" :dataSource="dataSource" :columns="columns" />
    <div class="tasklist-action">
      <sdButton type="primary" size="large" transparented>
        <sdFeatherIcons type="plus" size="14" /> Add New Task
      </sdButton>
    </div>
  </div>
</template>
<script>
import { TasklistAction } from '../style';
import { ref } from 'vue';

const TaskList = {
  name: 'TaskList',
  components: { TasklistAction },
  setup() {
    const selectedRowKeys = ref([]);
    const selectedRows = ref([]);
    const dataSource = [
      {
        key: '1',
        title: <span class="task-title">Add Images To the gallery</span>,
        component: (
          <TasklistAction>
            <span class="task-created">09:20 AM </span>
            <img class="task-author" style={{ width: '30px' }} src={require('@/static/img/users/1.png')} alt="" />
            <span class="task-move">
              <sdFeatherIcons type="move" size={16} />
            </span>
            <div class="task-action">
              <sdDropdown
                overlay={
                  <>
                    <a to="#">
                      <sdFeatherIcons type="eye" size={14} />
                      View
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="edit" size={14} />
                      Edit
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="trash-2" size={14} />
                      Delete
                    </a>
                  </>
                }
              >
                <a to="#">
                  <sdFeatherIcons type="more-horizontal" size={16} />
                </a>
              </sdDropdown>
            </div>
          </TasklistAction>
        ),
      },
      {
        key: '2',
        title: <span class="task-title">Add Images To the gallery</span>,
        component: (
          <TasklistAction>
            <span class="task-created">09:20 AM </span>
            <img class="task-author" style={{ width: '30px' }} src={require('@/static/img/users/1.png')} alt="" />
            <span class="task-move">
              <sdFeatherIcons type="move" size={16} />
            </span>
            <div class="task-action">
              <sdDropdown
                overlay={
                  <>
                    <a to="#">
                      <sdFeatherIcons type="eye" size={14} />
                      View
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="edit" size={14} />
                      Edit
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="trash-2" size={14} />
                      Delete
                    </a>
                  </>
                }
              >
                <a to="#">
                  <sdFeatherIcons type="more-horizontal" size={16} />
                </a>
              </sdDropdown>
            </div>
          </TasklistAction>
        ),
      },
      {
        key: '3',
        title: <span class="task-title">Add Images To the gallery</span>,
        component: (
          <TasklistAction>
            <span class="task-created">09:20 AM </span>
            <img class="task-author" style={{ width: '30px' }} src={require('@/static/img/users/1.png')} alt="" />
            <span class="task-move">
              <sdFeatherIcons type="move" size={16} />
            </span>
            <div class="task-action">
              <sdDropdown
                overlay={
                  <>
                    <a to="#">
                      <sdFeatherIcons type="eye" size={14} />
                      View
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="edit" size={14} />
                      Edit
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="trash-2" size={14} />
                      Delete
                    </a>
                  </>
                }
              >
                <a to="#">
                  <sdFeatherIcons type="more-horizontal" size={16} />
                </a>
              </sdDropdown>
            </div>
          </TasklistAction>
        ),
      },
      {
        key: '4',
        title: <span class="task-title">Add Images To the gallery</span>,
        component: (
          <TasklistAction>
            <span class="task-created">09:20 AM </span>
            <img class="task-author" style={{ width: '30px' }} src={require('@/static/img/users/1.png')} alt="" />
            <span class="task-move">
              <sdFeatherIcons type="move" size={16} />
            </span>
            <div class="task-action">
              <sdDropdown
                overlay={
                  <>
                    <a to="#">
                      <sdFeatherIcons type="eye" size={14} />
                      View
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="edit" size={14} />
                      Edit
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="trash-2" size={14} />
                      Delete
                    </a>
                  </>
                }
              >
                <a to="#">
                  <sdFeatherIcons type="more-horizontal" size={16} />
                </a>
              </sdDropdown>
            </div>
          </TasklistAction>
        ),
      },
      {
        key: '5',
        title: <span class="task-title">Add Images To the gallery</span>,
        component: (
          <TasklistAction>
            <span class="task-created">09:20 AM </span>
            <img class="task-author" style={{ width: '30px' }} src={require('@/static/img/users/1.png')} alt="" />
            <span class="task-move">
              <sdFeatherIcons type="move" size={16} />
            </span>
            <div class="task-action">
              <sdDropdown
                overlay={
                  <>
                    <a to="#">
                      <sdFeatherIcons type="eye" size={14} />
                      View
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="edit" size={14} />
                      Edit
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="trash-2" size={14} />
                      Delete
                    </a>
                  </>
                }
              >
                <a to="#">
                  <sdFeatherIcons type="more-horizontal" size={16} />
                </a>
              </sdDropdown>
            </div>
          </TasklistAction>
        ),
      },
      {
        key: '6',
        title: <span class="task-title">Add Images To the gallery</span>,
        component: (
          <TasklistAction>
            <span class="task-created">09:20 AM </span>
            <img class="task-author" style={{ width: '30px' }} src={require('@/static/img/users/1.png')} alt="" />
            <span class="task-move">
              <sdFeatherIcons type="move" size={16} />
            </span>
            <div class="task-action">
              <sdDropdown
                overlay={
                  <>
                    <a to="#">
                      <sdFeatherIcons type="eye" size={14} />
                      View
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="edit" size={14} />
                      Edit
                    </a>
                    <a to="#">
                      <sdFeatherIcons type="trash-2" size={14} />
                      Delete
                    </a>
                  </>
                }
              >
                <a to="#">
                  <sdFeatherIcons type="more-horizontal" size={16} />
                </a>
              </sdDropdown>
            </div>
          </TasklistAction>
        ),
      },
    ];
    const columns = [
      {
        dataIndex: 'title',
        key: 'title',
      },
      {
        dataIndex: 'component',
        key: 'component',
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        selectedRowKeys.value = selectedRows;
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return {
      selectedRowKeys,
      selectedRows,
      dataSource,
      columns,
      rowSelection,
    };
  },
};

export default TaskList;
</script>
