<template>
  <sdPageHeader title="Task">
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
      <a-col :xl="5" :lg="6" :md="7" :xs="24">
        <template v-if="responsive > 767">
          <SidebarWrap class="mb-30">
            <div class="sDash_taskApp-sidebar">
              <sdButton
                class="sDash_btn-add"
                size="large"
                type="primary"
                raised
                @click="showModal"
              >
                <sdFeatherIcons type="plus" size="16" />
                Add Task
              </sdButton>
              <ul class="sDash_taskApp-sidebar__nav">
                <li class="sDash_taskApp-sidebar__nav--item">
                  <router-link
                    class="sDash_taskApp-sidebar__nav--link"
                    :to="`${path}/all`"
                  >
                    <span class="nav-item-icon">
                      <sdFeatherIcons type="edit" size="16" />
                    </span>
                    <span class="nav-item-text">All</span>
                  </router-link>
                </li>
                <li class="sDash_taskApp-sidebar__nav--item">
                  <router-link
                    class="sDash_taskApp-sidebar__nav--link"
                    :to="`${path}/favorites`"
                  >
                    <span class="nav-item-icon">
                      <sdFeatherIcons type="star" size="16" />
                    </span>
                    <span class="nav-item-text">Favorite</span>
                  </router-link>
                </li>
                <li class="sDash_taskApp-sidebar__nav--item">
                  <router-link
                    class="sDash_taskApp-sidebar__nav--link"
                    :to="`${path}/completed`"
                  >
                    <span class="nav-item-icon">
                      <sdFeatherIcons type="check" size="16" />
                    </span>
                    <span class="nav-item-text">Completed</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </SidebarWrap>
          <sdModal
            title="Add Task"
            class="sDash_addTask-modal"
            :type="modalType"
            :visible="visible"
            :footer="null"
            :onCancel="handleCancel"
          >
            <div class="sDash_addTask-modal-inner">
              <BasicFormWrapper>
                <a-form
                  :model="formState"
                  name="add-task"
                  @finish="handleAddTask"
                  :layout="formState.layout"
                >
                  <a-form-item name="title">
                    <a-input
                      v-model:value="formState.title"
                      placeholder="Title"
                    />
                  </a-form-item>

                  <a-form-item name="description">
                    <a-textarea
                      v-model:value="formState.description"
                      :rows="4"
                      placeholder="Add Description"
                    />
                  </a-form-item>
                  <div class="sDash-modal-actions">
                    <sdButton
                      size="small"
                      type="light"
                      key="cancel"
                      outlined
                      @click="handleCancel"
                    >
                      Cancel
                    </sdButton>
                    <sdButton
                      htmlType="submit"
                      size="small"
                      type="primary"
                      key="submit"
                    >
                      Add Task
                    </sdButton>
                  </div>
                </a-form>
              </BasicFormWrapper>
            </div>
          </sdModal>
        </template>

        <FixedSidebar v-else :class="collapsed ? 'show' : 'hide'">
          <a to="#" type="link" class="trigger-close" @click="toggleCollapsed">
            <sdFeatherIcons type="x" />
          </a>
          <SidebarWrap class="mb-30">
            <div class="sDash_taskApp-sidebar">
              <sdButton
                class="sDash_btn-add"
                size="large"
                type="primary"
                raised
                @click="showModal"
              >
                <sdFeatherIcons type="plus" size="16" />
                Add Task
              </sdButton>
              <ul class="sDash_taskApp-sidebar__nav">
                <li class="sDash_taskApp-sidebar__nav--item">
                  <router-link
                    class="sDash_taskApp-sidebar__nav--link"
                    :to="`${path}/all`"
                  >
                    <span class="nav-item-icon">
                      <sdFeatherIcons type="edit" size="16" />
                    </span>
                    <span class="nav-item-text">All</span>
                  </router-link>
                </li>
                <li class="sDash_taskApp-sidebar__nav--item">
                  <router-link
                    class="sDash_taskApp-sidebar__nav--link"
                    :to="`${path}/favorites`"
                  >
                    <span class="nav-item-icon">
                      <sdFeatherIcons type="star" size="16" />
                    </span>
                    <span class="nav-item-text">Favorite</span>
                  </router-link>
                </li>
                <li class="sDash_taskApp-sidebar__nav--item">
                  <router-link
                    class="sDash_taskApp-sidebar__nav--link"
                    :to="`${path}/completed`"
                  >
                    <span class="nav-item-icon">
                      <sdFeatherIcons type="check" size="16" />
                    </span>
                    <span class="nav-item-text">Completed</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </SidebarWrap>
        </FixedSidebar>
      </a-col>
      <a-col :xl="19" :lg="18" :md="17" :xs="24">
        <div
          v-if="responsive <= 767"
          class="sidebar-trier-wrap text-center mb-30"
        >
          <sdButton
            type="link"
            class="sidebar-trigger"
            :style="{ marginTop: 0 }"
            @click="toggleCollapsed"
          >
            <sdFeatherIcons :type="collapsed ? 'align-left' : 'align-right'" />
          </sdButton>
        </div>

        <router-view name="child"></router-view>
      </a-col>
    </a-row>
    <span
      role="button"
      tabIndex="0"
      :class="collapsed ? 'overlay-dark show' : 'overlay-dark'"
      @click="toggleCollapsed"
    />
  </Main>
</template>
<script>
import { FixedSidebar, SidebarWrap } from "./style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { computed, watchEffect, ref, reactive, defineComponent } from "vue";
import { useRoute } from "vue-router";

const Task = defineComponent({
  name: "Task",
  components: { FixedSidebar, SidebarWrap, Main, BasicFormWrapper },
  setup() {
    const { state, dispatch } = useStore();
    const taskData = computed(() => state.task.data);
    const responsive = ref(0);
    const collapsed = ref(false);
    const visible = ref(false);
    const modalType = ref("primary");
    const { matched } = useRoute();
    const { path } = matched[1];

    const showModal = () => {
      visible.value = true;
      collapsed.value = false;
    };
    const handleCancel = () => {
      visible.value = false;
    };

    const formState = reactive({
      title: "",
      description: "",
      layout: "vertical",
    });

    const handleAddTask = (values) => {
      handleCancel();
      const arrayData = [];
      taskData.value.map((data) => {
        return arrayData.push(data.id);
      });
      const max = Math.max(...arrayData);
      dispatch("taskAddData", [
        ...taskData.value,
        {
          ...values,
          id: max + 1,
          favourite: false,
          completed: false,
        },
      ]);
    };

    watchEffect(() => {
      function updateSize() {
        const width = window.innerWidth;
        responsive.value = width;
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      // return () => window.removeEventListener('resize', updateSize);
    });

    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
    };

    return {
      taskData,
      responsive,
      collapsed,
      visible,
      modalType,
      showModal,
      handleCancel,
      handleAddTask,
      toggleCollapsed,
      formState,
      path,
    };
  },
});

export default Task;
</script>
