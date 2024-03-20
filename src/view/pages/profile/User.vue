<template>
  <Main>
    <sdPageHeader title="My Profile">
      <template v-slot:buttons> </template>
    </sdPageHeader>
    <div class="profile-container">
      <div
        style="background-color: #ececec; padding: 20px"
        class="profile-card"
      >
        <a-row :gutter="24">
          <a-col :span="24">
            <a-card title="User Information" :bordered="false">
              <p>card content</p>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <div class="tables-container">
        <div class="top-table">
          <h2>Activity Payments</h2>
          <table>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="bottom-table">
          <h2>Event Payments</h2>
          <table>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </Main>
</template>

<script>
import { useRoute } from "vue-router";

const MyProfile = {
  name: "MyProfile",
  setup() {
    const { matched } = useRoute();
    const { path } = matched[1];

    // Replace with your actual user data fetching logic
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
    };

    return {
      path,
      userData,
    };
  },
};

export default MyProfile;
</script>

<style>
.profile-container {
  display: flex;
  flex-wrap: wrap;
}

.profile-card {
  padding: 1rem;
  width: 25%; /* Adjusted width */
  flex-shrink: 0; /* Prevents shrinking on smaller screens */
}

.tables-container {
  padding: 1rem;
  width: 75%; /* Adjusted width */
  flex-shrink: 0; /* Prevents shrinking on smaller screens */
}

.top-table,
.bottom-table {
  margin-bottom: 1rem;
}

table {
  width: 100%; /* Adjusted width to fill the container */
  border-collapse: collapse;
}

th,
td {
  padding: 0.5rem;
  border: 1px solid #ddd;
}

/* Media query for smaller screens */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }

  .profile-card,
  .tables-container {
    width: 100%; /* Take up full width on smaller screens */
  }
}
</style>
