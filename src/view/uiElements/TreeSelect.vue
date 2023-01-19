<template>
  <div>
    <sdPageHeader title="Tree Select">
      <template v-slot:buttons>
        <div class="page-header-actions">
          <sdCalendarButton />
          <sdExportButton />
          <sdShareButton />
          <sdButton size="small" type="primary">
            <sdFeatherIcons type="plus" size="14" />
            Add New
          </sdButton>
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <a-row :gutter="25">
        <a-col :md="12" :sm="24" :xs="24">
          <sdCards title="Basic">
            <a-tree-select
              v-model:value="value"
              show-search
              :style="{ width: '100%' }"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="Please select"
              allow-clear
              tree-default-expand-all
              class="ant-tree-select"
            >
              <a-tree-select-node value="parent 1" title="parent 1">
                <a-tree-select-node value="parent 1-0" title="parent 1-0">
                  <a-tree-select-node value="leaf1" title="my leaf" />
                  <a-tree-select-node value="leaf2" title="your leaf" />
                </a-tree-select-node>
                <a-tree-select-node value="parent 1-1" title="parent 1-1">
                  <a-tree-select-node value="sss">
                    <template #title><b style="color: #08c">sss</b></template>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select-node>
            </a-tree-select>
          </sdCards>
          <sdCards title="Generate from tree data">
            <a-tree-select
              class="ant-tree-select"
              v-model:value="value"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData2"
              placeholder="Please select"
              tree-default-expand-all
            >
              <template #title="{ key, value }">
                <span style="color: #08c" v-if="key === '0-0-1'">Child Node1 {{ value }}</span>
              </template>
            </a-tree-select>
          </sdCards>
          <sdCards title="Asynchronous loading">
            <a-tree-select
              class="ant-tree-select"
              v-model:value="value"
              tree-data-simple-mode
              :style="{ width: '100%' }"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="Please select"
              :load-data="onLoadData"
            />
          </sdCards>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <sdCards title="Multiple Selection">
            <a-tree-select
              class="ant-tree-select"
              show-search
              :style="{ width: '100%' }"
              v-model:value="value2"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="Please select"
              allow-clear
              multiple
              tree-default-expand-all
            >
              <a-tree-select-node value="parent 1" title="parent 1">
                <a-tree-select-node value="parent 1-0" title="parent 1-0">
                  <a-tree-select-node value="leaf1" title="my leaf" />
                  <a-tree-select-node value="leaf2" title="your leaf" />
                </a-tree-select-node>
                <a-tree-select-node value="parent 1-1" title="parent 1-1">
                  <a-tree-select-node value="sss">
                    <template #title><b style="color: #08c">sss</b></template>
                  </a-tree-select-node>
                </a-tree-select-node>
              </a-tree-select-node>
            </a-tree-select>
          </sdCards>
          <sdCards title="Checkable">
            <a-tree-select
              class="ant-tree-select"
              v-model:value="value3"
              :style="{ width: '100%' }"
              :tree-data="treeData3"
              tree-checkable
              allow-clear
              :show-checked-strategy="SHOW_PARENT"
              search-placeholder="Please select"
            />
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { ref, watch, defineComponent } from 'vue';
import { TreeSelect } from 'ant-design-vue';
import { Main } from '../styled';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const treeData3 = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
        disabled: true,
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];
const treeData2 = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        value: '0-0-1',
        key: '0-0-1',
        slots: {
          title: 'title',
        },
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
  },
];
export default defineComponent({
  name: 'TreeSelect',
  components: {
    Main,
  },
  setup() {
    const value = ref();
    const value2 = ref([]);
    const value3 = ref(['0-0-0']);
    const treeData = ref([
      {
        id: 1,
        pId: 0,
        value: '1',
        title: 'Expand to load',
      },
      {
        id: 2,
        pId: 0,
        value: '2',
        title: 'Expand to load',
      },
      {
        id: 3,
        pId: 0,
        value: '3',
        title: 'Tree Node',
        isLeaf: true,
      },
    ]);
    const genTreeNode = (parentId, isLeaf = false) => {
      const random = Math.random().toString(36).substring(2, 6);
      return {
        id: random,
        pId: parentId,
        value: random,
        title: isLeaf ? 'Tree Node' : 'Expand to load',
        isLeaf,
      };
    };

    const onLoadData = (treeNode) => {
      console.log(treeNode);
      return new Promise((resolve) => {
        const { id } = treeNode.dataRef;
        setTimeout(() => {
          treeData.value = treeData.value.concat([genTreeNode(id, false), genTreeNode(id, true)]);
          resolve();
        }, 300);
      });
    };
    watch(value, () => {
      //console.log(value.value);
    });
    return {
      value,
      value2,
      value3,
      treeData,
      treeData3,
      treeData2,
      SHOW_PARENT,
      genTreeNode,
      onLoadData,
    };
  },
});
</script>
