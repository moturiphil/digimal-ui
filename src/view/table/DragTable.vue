<template>
  <DragDropStyle>
    <sdCards title="Drag & Drop">
      <TableWrapper class="table-responsive">
        <div class="ant-table-content">
          <table style="width: 100%">
            <draggable v-model="dragAbleData" tag="tbody" group="people" handle=".handle" item-key="name">
              <template #item="{ element }">
                <tr>
                  <td style="width: 30px">
                    <sdFeatherIcons classes="handle" :style="{ cursor: 'pointer', color: '#999' }" type="move" />
                  </td>
                  <td scope="row">
                    <div class="user-info">
                      <figure><img :style="{ width: '40px' }" :src="require(`@/${element.img}`)" alt="" /></figure>
                      <figcaption>
                        <sdHeading class="user-name" as="h6">
                          {{ element.name }}
                        </sdHeading>
                      </figcaption>
                    </div>
                  </td>
                  <td><span class="drag_email">john@gmail.com</span></td>
                  <td><span class="drag_company">Business Development</span></td>
                  <td>
                    <span class="drag_designation">{{ element.designation }}</span>
                  </td>
                  <td><span class="drag_join-date">January 20, 2021</span></td>
                  <td>
                    <div class="table-actions">
                      <sdButton class="btn-icon" type="info" to="#" shape="circle">
                        <sdFeatherIcons type="edit" size="16" />
                      </sdButton>
                      <sdButton class="btn-icon" type="danger" to="#" shape="circle">
                        <sdFeatherIcons type="trash-2" size="16" />
                      </sdButton>
                    </div>
                  </td>
                </tr>
              </template>
            </draggable>
          </table>
        </div>
      </TableWrapper>
    </sdCards>
  </DragDropStyle>
</template>
<script>
import { computed, ref, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { TableWrapper, DragDropStyle } from '../styled';
import draggable from 'vuedraggable';

const DragAndDropTable = defineComponent({
  name: 'DragAndDropTable',
  components: { TableWrapper, DragDropStyle, draggable },
  setup() {
    const { state } = useStore();
    const users = computed(() => state.users.data);
    const dragAbleData = ref(users.value);

    return {
      users,
      dragAbleData,
    };
  },
});

export default DragAndDropTable;
</script>
