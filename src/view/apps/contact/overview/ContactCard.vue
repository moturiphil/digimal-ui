<template>
  <ContactCardWrapper>
    <div class="contact-card">
      <figure>
        <img :src="require(`@/${user.img}`)" alt="" />
        <figcaption>
          <h3>{{ user.name }}</h3>
          <span>{{ user.designation }}</span>
        </figcaption>
      </figure>
      <div class="user-info">
        <ul>
          <li>
            <sdFeatherIcons type="phone" size="16" />
            {{ user.phone }}
          </li>
          <li>
            <sdFeatherIcons type="mail" size="16" />
            {{ user.email }}
          </li>
          <li>
            <sdFeatherIcons type="map-pin" size="16" />
            {{ user.company }}
          </li>
        </ul>
      </div>
    </div>
    <sdDropdown class="wide-dropdwon" :action="['click']">
      <template #overlay>
        <a @click="() => showEditModal(user, id)" to="#">
          <span>Edit</span>
        </a>
        <a @click="() => onHandleDelete(id)" to="#">
          <span>Delete</span>
        </a>
      </template>
      <sdButton class="btn-icon" type="light" to="#" shape="circle">
        <sdFeatherIcons type="more-horizontal" size="18" />
      </sdButton>
    </sdDropdown>
  </ContactCardWrapper>
</template>
<script>
import { computed, toRefs, defineComponent } from 'vue';
import PropTypes from 'vue-types';
import { useStore } from 'vuex';
import { ContactCardWrapper } from '../style';

const ContactCard = defineComponent({
  name: 'ContactCard',
  components: { ContactCardWrapper },
  props: {
    user: PropTypes.object,
    showEditModal: PropTypes.func,
  },
  setup(props) {
    const { user } = toRefs(props);
    const { state, dispatch } = useStore();
    const users = computed(() => state.contact.data);

    const onHandleDelete = () => {
      const newUsers = users.value;
      const value = newUsers.filter((item) => item.id !== user.value.id);
      dispatch('contactDeleteData', value);
    };

    return {
      onHandleDelete,
      users,
    };
  },
});

export default ContactCard;
</script>
