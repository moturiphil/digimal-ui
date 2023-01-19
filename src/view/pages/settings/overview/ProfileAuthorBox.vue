<template>
  <sdCards headless>
    <div class="author-info">
      <figure>
        <img :src="require('../../../../static/img/users/1.png')" alt="" />
        <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
          <a to="#">
            <sdFeatherIcons type="camera" size="16" />
          </a>
        </a-upload>
      </figure>
      <figcaption>
        <div class="info">
          <sdHeading as="h4">Duran Clayton</sdHeading>
          <p>UI/UX Designer</p>
        </div>
      </figcaption>
    </div>
    <nav class="settings-menmulist">
      <ul>
        <li>
          <router-link :to="{ name: 'set-profile' }">
            <sdFeatherIcons type="user" size="14" />
            Edit Profile
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'set-account' }">
            <sdFeatherIcons type="settings" size="14" />
            Account Settings
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'set-password' }">
            <sdFeatherIcons type="key" size="14" />
            Change Password
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'set-social' }">
            <sdFeatherIcons type="users" size="14" />
            Social Profile
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'set-notification' }">
            <sdFeatherIcons type="bell" size="14" /> Notification
          </router-link>
        </li>
      </ul>
    </nav>
  </sdCards>
</template>
<script>
export default {
  name: 'AuthorBox',
  components: {},
};
</script>
