<template>
  <Main class="grid-boxed">
    <sdPageHeader
      class="header-boxed"
      title="ACTIVITY PARTICIPATION CONFIRMATION"
    >
    </sdPageHeader>
    <a-row :gutter="25">
      <a-col :lg="24" :xs="24">
        <sdCards headless>
          <OverviewSalesCard>
            <div class="card-chunk">
              <CardBarChart2>
                <h3>
                  <b>
                    Confirm Participation Details
                    <div>
                      <my-script :url="currentUrl"></my-script>
                    </div>
                  </b>
                </h3>
                <br />
                <p>
                  <span class="growth-upward">
                    <sdFeatherIcons type="at-sign"
                  /></span>
                  <span> <b>Participants Name:</b> {{ participant_name }}</span>
                </p>
                <p>
                  <span class="growth-upward">
                    <sdFeatherIcons type="cast"
                  /></span>
                  <span> <b> Activity Name: </b>{{ activity_name }} </span>
                </p>
                <p>
                  <span class="growth-upward">
                    <sdFeatherIcons type="flag" />
                  </span>
                  <span> <b>Confirmation Date:</b> {{ activity_date }} </span>
                </p>
                <br />
                <!-- get button to align to the center -->

                <sdButton
                  class="btn-signin"
                  htmlType="submit"
                  :loading="isLoading"
                  type="success"
                  size="large"
                  @click="confirm"
                >
                  Confirm
                </sdButton>
              </CardBarChart2>
            </div>
          </OverviewSalesCard>
        </sdCards>
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import { CardBarChart2, OverviewSalesCard } from "../dashboard/style";
import { Main } from "../styled";
// import { defineAsyncComponent } from 'vue';
import { notification } from "ant-design-vue";

import authHeader from "../../services/auth-header";
import { confirmErrorMessage } from "../../services/budgetCapacity";

const Sales = {
  name: "Sales",
  components: {
    Main,
    CardBarChart2,
    OverviewSalesCard,
  },
  data() {
    return {
      currentUrl: "",
      newUrl: "",
      participant_name: "",
      activity_name: "",
      activity_date: "",
      activity_location: "",
    };
  },
  mounted() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    this.currentUrl = this.$route.fullPath;
    this.participantUrl = `${window.location.origin}${this.currentUrl}`;
    console.log(this.currentUrl);
    let newUrl = this.participantUrl.replace(
      `${window.location.origin}/auth/activity-confirm?`,
      `${process.env.VUE_APP_BASE_URL}/act_part?`
    );
    console.log(newUrl);
    console.log(user);
    if (user && user.token) {
      // Remove the 'redirectUrl' item from sessionStorage
      sessionStorage.removeItem("redirectUrl");

      console.log(newUrl);
      const response = fetch(newUrl, {
        method: "GET",
        headers: authHeader(),
      });
      console.log(response);

      response
        .then((res) => {
          console.log(res);
          if (!res.ok) {
            throw new Error("Response not OK");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data); // This should log the parsed JSON data
          if (data.success == false) {
            notification.info({
              message: "Info",
              description: data.data,
            });
            this.$router.push("/");
          }
          else {
            this.participant_name = data.first_name + " " + data.last_name + " - " + data.org_types_id;

          }
          // this.participant_name = data.user_id;
          this.activity_name = data.activity_id;
          this.activity_date = data.activity_date;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      sessionStorage.setItem("redirectUrl", this.currentUrl); // Store the currentUrl in sessionStorage
      console.log(sessionStorage.getItem("redirectUrl"));
      this.$router.push("/auth/login");
    }
  },

  methods: {
    confirm() {
      let newUrl = this.currentUrl.replace(
        "/auth/activity-confirm?",
        "act_part_cfm?"
      );
      console.log(newUrl);
      fetch(`${process.env.VUE_APP_BASE_URL}/${newUrl}`, {
        method: "GET",
        headers: authHeader(),
      })
        .then(async (res) => {
          let body = {};
          try {
            body = await res.json();
          } catch (e) {
            body = {};
          }
          console.log(res, body);

          if (res.ok || res.status === 200 || String(body.status) === "true") {
            notification.success({
              message: "Success",
              description:
                body.message ||
                "Your activity participation successfully confirmed.",
            });
            this.$router.push("/");
          } else {
            // 208 = already confirmed; anything else may be a budget-linked
            // rejection (capacity_reached / ineligible_org_type) — map it.
            const message =
              res.status === 208
                ? "This activity participation has already been confirmed. Thank you!"
                : confirmErrorMessage(body, "activity");
            notification.error({
              message: "Error",
              description: message,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          notification.error({
            message: "Error",
            description: "Unable to confirm activity participation. Try again.",
          });
        });
    },
  },
};

export default Sales;
</script>
