<template>
  <sdPageHeader
    class="header-boxed"
    title="ACTIVITY PARTICIPATION CONFIRMATION"
  >
  </sdPageHeader>
  <Main class="grid-boxed">
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
import SvgConverter from "@/components/utilities/SvgConverter.vue";
import { notification } from "ant-design-vue";


import authHeader from "../../services/auth-header";

const Sales = {
  name: "Sales",
  components: {
    Main,
    CardBarChart2,
    OverviewSalesCard,
    SvgConverter,
  },
  data() {
    // let url = this.currentUrl.replace("/auth/activity-confirm?", "act_part_cfm?");
    // console.log(url);
    // const confirm_response = fetch(`${process.env.VUE_APP_BASE_URL}/${url}`, {
    //   method: "GET",
    //   headers: authHeader(),
    // });
    // confirm_response.then((res) => {
    //   console.log(res);
    //   return res.json();
    // });
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
    this.currentUrl = this.$route.fullPath;
    let newUrl = this.currentUrl.replace(
      "/auth/activity-confirm?",
      "act_part?"
    );
    // console.log(this.currentUrl);

    const response = fetch(`${process.env.VUE_APP_BASE_URL}/${newUrl}`, {
      method: "GET",
      headers: authHeader(),
    });
    console.log(newUrl);

    response
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data); // This should log the "id" property from the response data
        this.participant_name = data.user_id;
        this.activity_name = data.activity_id;
        this.activity_date = data.activity_date;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    confirm() {
      let newUrl = this.currentUrl.replace(
        "/auth/activity-confirm?",
        "act_part_cfm?"
      );
      console.log(newUrl);
      const confirm_response = fetch(`${process.env.VUE_APP_BASE_URL}/${newUrl}`, {
        method: "GET",
        headers: authHeader(),
      });
      // console.log(confirm_response);
      confirm_response.then((res) => {
        console.log(res);
        // return res.json();
        if (res.status == 200) {
          notification.success({
            message: "Success",
            description: "Activity Participation Confirmed",
          });
          this.$router.push("/");
        } else {
          notification.error({
            message: "Error",
            description: "Activity Participation Not Confirmed",
          });
        }
      });
    },
  },
};

export default Sales;
</script>
