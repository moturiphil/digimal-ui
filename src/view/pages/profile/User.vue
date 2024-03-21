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
              <p><b>Name:</b> {{ userData.name }}</p>
              <p><b>ID No:</b> {{ userData.id_no }}</p>
              <p><b>Phone No:</b> {{ userData.phone_no }}</p>
              <p><b>Job Group:</b> {{ userData.job_group }}</p>
              <p><b>Location:</b> {{ userData.location }}</p>
              <p><b>Organization:</b> {{ userData.organization }}</p>
              <p><b>Role:</b> {{ userData.role }}</p>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <div class="tables-container">
        <div
          class="top-table"
          v-if="activity_dataSource && activity_dataSource.length > 0"
        >
          <h2>Activity Payments</h2>
          <TableWrapper class="table-data-view table-responsive">
            <a-table
              :pagination="{
                pageSize: 10,
                showSizeChanger: true,
              }"
              :dataSource="activity_dataSource"
              :columns="activity_columns"
            >
              <template>
                <td :style="{ 'margin-left': '4px' }">
                  <div class="table-actions"></div>
                </td>
              </template>
            </a-table>
          </TableWrapper>
        </div>

        <div class="bottom-table" v-if="dataSource && dataSource.length > 0">
          <h2>Event Payments</h2>
          <TableWrapper class="table-data-view table-responsive">
            <a-table
              :pagination="{
                pageSize: 10,
                showSizeChanger: true,
              }"
              :dataSource="dataSource"
              :columns="columns"
            >
              <template>
                <td :style="{ 'margin-left': '4px' }">
                  <div class="table-actions"></div>
                </td>
              </template>
            </a-table>
          </TableWrapper>
        </div>
      </div>
    </div>
  </Main>
</template>

<script>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import axios from "axios";
import authHeader from "../../../services/auth-header";

const columns = [
  {
    title: "Event Name",
    dataIndex: "event_name",
    key: "id",
  },
  {
    title: "Event Code",
    dataIndex: "event_code",
    key: "id",
  },
  {
    title: "Venue",
    dataIndex: "venue",
    key: "id",
  },
  {
    title: "Days Confirmed",
    dataIndex: "days_confirmed",
    key: "id",
  },
  {
    title: "Payment Date",
    dataIndex: "amount_paid",
    key: "",
  },
  {
    title: "Payment Date",
    dataIndex: "payment_date",
    key: "",
  },
];
const activity_columns = [
  {
    title: "Activity Name",
    dataIndex: "activity_name",
    key: "id",
  },
  {
    title: "Activity Code",
    dataIndex: "activity_code",
    key: "id",
  },
  {
    title: "Days Confirmed",
    dataIndex: "days_confirmed",
    key: "id",
  },
  {
    title: "Payment Date",
    dataIndex: "amount_paid",
    key: "",
  },
  {
    title: "Payment Date",
    dataIndex: "payment_date",
    key: "",
  },
];

const MyProfile = {
  name: "MyProfile",
  setup() {
    const { matched } = useRoute();
    const { path } = matched[1];
    const dataSource = ref([]);
    const activity_dataSource = ref([]);

    const user = JSON.parse(sessionStorage.getItem("user"));
    let userData = null;

    if (!user) {
      console.error("User data not found in sessionStorage");
    } else {
      console.log(user.user.first_name + " " + user.user.last_name);
      userData = {
        name: user.user.first_name + " " + user.user.last_name,
        id_no: user.user.id_no,
        job_group: user.user.job_group ? user.user.job_group : " ",
        phone_no: user.user.phone_no,
        location: user.user.location.name,
        organization: user.user.org_type ? user.user.org_type.name : "N/A",
        role: user.user.role ? user.user.role.name : "N/A",
      };
    }

    console.log(userData); // Now you can access userData here

    const API_URL = `${process.env.VUE_APP_BASE_URL}/my_event_payments`;
    const ACTIVITY_API_URL = `${process.env.VUE_APP_BASE_URL}/my_activities_payments`;

    const fetchData = (url, dataSource) => {
      axios
        .get(url, {
          headers: authHeader(),
        })
        .then((response) => {
          console.log(response.data);
          dataSource.value = response.data.data;
        })
        .catch((error) => {
          console.error(error);
          return "Failed to fetch data. Please try again later.";
        });
    };

    onMounted(() => {
      fetchData(API_URL, dataSource);
      fetchData(ACTIVITY_API_URL, activity_dataSource);
    });

    console.log(userData);

    return {
      path,
      userData,
      columns,
      activity_columns,
      dataSource,
      activity_dataSource,
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
