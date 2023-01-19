<template>
  <EmailNav>
    <ul>
      <li>
        <router-link :to="`${path}inbox`" click="toggleCollapsed">
          <sdFeatherIcons type="inbox" size="18" />
          <span class="nav-text">
            <span>Inbox</span>
            <span class="badge badge-primary">3</span>
          </span>
        </router-link>
      </li>
      <li>
        <router-link :to="`${path}starred`" click="toggleCollapsed">
          <sdFeatherIcons type="star" size="18" />
          <span class="nav-text">
            <span>Starred</span>
          </span>
        </router-link>
      </li>
      <li>
        <router-link :to="`${path}sent`" click="toggleCollapsed">
          <sdFeatherIcons type="send" size="18" />
          <span class="nav-text">
            <span>Sent</span>
          </span>
        </router-link>
      </li>
      <li>
        <router-link :to="`${path}drafts`" click="toggleCollapsed">
          <sdFeatherIcons type="edit" size="18" />
          <span class="nav-text">
            <span>Drafts</span>
          </span>
          <span class="badge badge-primary">12</span>
        </router-link>
      </li>
      <li>
        <router-link :to="`${path}spam`" click="toggleCollapsed">
          <sdFeatherIcons type="alert-octagon" size="18" />
          <span class="nav-text">
            <span>Spam</span>
          </span>
        </router-link>
      </li>
      <li>
        <router-link :to="`${path}trash`" click="toggleCollapsed">
          <sdFeatherIcons type="trash-2" size="18" />
          <span class="nav-text">
            <span>Trash</span>
          </span>
        </router-link>
      </li>
    </ul>
    <div class="nav-labels">
      <p>Labels</p>
      <ul>
        <li v-for="label in labels" :key="label">
          <a to="#"> <sdFeatherIcons type="list" size="18" /> {{ label }} </a>
        </li>

        <li class="add-label-btn" @click="addNewLabels" role="menuitem">
          <router-link @click="addNewLabels" to="#">
            <sdFeatherIcons type="plus" size="18" /> Add New Label
          </router-link>

          <div v-if="addNewDisplay" class="add-label">
            <form @submit="handelChange">
              <sdHeading as="h3">Add New Label</sdHeading>
              <a-input
                @change="onLabelChange"
                v-model:value="newLabel"
                :name="newLabel"
                type="text"
                placeholder="Enter label name"
              />
              <div class="btn-group">
                <sdButton size="default" @click="handelChange" type="primary"> Add Label </sdButton>
                <sdButton @click="cancelAddNewLabels" type="default"> Cancel </sdButton>
              </div>
            </form>
          </div>
        </li>
      </ul>
    </div>
  </EmailNav>
</template>
<script>
import { EmailNav } from './style';
import { ref, defineComponent } from 'vue';
import VueTypes from 'vue-types';

const EmailNavbar = defineComponent({
  name: 'EmailNavbar',
  components: { EmailNav },
  props: { path: VueTypes.string, toggleCollapsed: VueTypes.func },
  setup() {
    const labels = ref(['personal', 'social', 'promotions']);
    const newLabel = ref('');
    const addNewDisplay = ref(false);

    const addNewLabels = (e) => {
      e.preventDefault();
      addNewDisplay.value = true;
    };

    const cancelAddNewLabels = (e) => {
      e.preventDefault();
      e.stopPropagation();
      addNewDisplay.value = false;
    };

    const handelChange = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (newLabel.value !== '') {
        labels.value = [...labels.value, newLabel.value];
        newLabel.value = '';
      } else {
        alert('Please Give a label...');
      }
    };

    const onLabelChange = (e) => {
      newLabel.value = e.target.value;
    };

    return {
      labels,
      newLabel,
      addNewDisplay,
      addNewLabels,
      cancelAddNewLabels,
      handelChange,
      onLabelChange,
    };
  },
});

export default EmailNavbar;
</script>
