<template>
  <Main>
    <sdPageHeader title="Received Nets at Drop Point">
      <sdButton class="btn-add_new" size="default" key="1" type="success">
        <router-link to="/crud/axios-view">View All</router-link>
      </sdButton>
    </sdPageHeader>
    <a-row :gutter="15">
      <a-col :xs="24">
        <RecordFormWrapper>
          <sdCards headless>
            <a-row justify="center">
              <a-col :xl="10" :md="16" :xs="24">
                <BasicFormWrapper>
                  <a-form
                    class="add-record-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <!-- <a-form-item name="campaign_id" label="Campaign Name">
                      <a-select
                        size="large"
                        name="basic-select"
                        class="sDash_fullwidth-select"
                        placeholder="Select Post"
                        v-model:value="formState.campaign_id"
                      >
                        <a-select-option
                          v-for="campaign in campaigns"
                          :value="campaign.id"
                          :key="campaign.id"
                          >{{ campaign.name }}</a-select-option
                        >
                      </a-select> -->
                    <!-- </a-form-item> -->
                    <!-- <a-form-item name="bale_size" label="Bale Size">
                      <a-input
                        v-model:value="formState.bale_size"
                        placeholder="Enter bale size"
                        type="number"
                      >
                      </a-input>
                    </a-form-item> -->
                    <a-form-item name="bale_size" label="Bale Size">
                      <a-select
                        v-model:value="formState.bale_size"
                        placeholder="Select Bale Size"
                      >
                        <a-select-option value="40">40</a-select-option>
                        <a-select-option value="50">50</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item name="no_of_bales" label="Number of Bales">
                      <a-input
                        v-model:value="formState.no_of_bales"
                        placeholder="Enter number of bales"
                        type="number"
                      />
                    </a-form-item>

                    <a-form-item name="no_of_pieces" label="Number of Loose Pieces">
                      <a-input
                        v-model:value="formState.no_of_pieces"
                        placeholder="Enter number of pieces"
                        type="number"
                        @change="validateNoOfPieces"
                      />
                    </a-form-item>
                    <!-- <a-form-item name="delivery_note" label="Delivery Note No.">
                      <a-input
                        v-model:value="formState.delivery_note"
                        placeholder="Delivery Note No."
                      />
                    </a-form-item> -->

                    <a-form-item name="delivery_note" label="Delivery Note No.">
                      <a-select
                        placeholder="Select Delivery Note No"
                        v-model:value="formState.delivery_note"
                        v-if="!loading"
                        show-search
                        option-filter-prop="label"
                      >
                        <a-select-option
                          v-for="note in delivery_notes"
                          :key="note"
                          :value="note"
                          :label="note"
                        >
                          {{ note }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>

                    <!-- <a-form-item name="date_received" label="Date Received">
                      <a-date-picker
                        :style="{ width: '100%' }"
                        v-model:value="formState.date_received"
                        :format="dateFormat"
                      />
                    </a-form-item> -->
                    <a-form-item name="received_from" label="Received From">
                      <a-select
                        v-model:value="formState.received_from"
                        v-if="!loading"
                        placeholder="Select Received From"
                      >
                        <a-select-option value="KEMSA">KEMSA</a-select-option>
                        <a-select-option value="MEDS">MEDS</a-select-option>
                      </a-select>
                    </a-form-item>

                    <!-- <a-form-item name="received_by" label="Received By">
                      <a-select
                        v-model:value="formState.received_by"
                        v-if="!loading"
                        placeholder="Select Received By"
                      >
                        <a-select-option
                          v-for="user in users"
                          :key="user.id"
                          v-model:value="user.id"
                        >
                          {{ user.first_name }}
                          {{ user.last_name }} - {{ user.id_no }}
                        </a-select-option>
                      </a-select>
                    </a-form-item> -->

                    <div class="record-form-actions text-right">
                      <sdButton size="default" htmlType="Save" type="success">
                        {{ isLoading ? "Loading..." : "Submit" }}
                      </sdButton>
                    </div>
                  </a-form>
                </BasicFormWrapper>
              </a-col>
            </a-row>
          </sdCards>
        </RecordFormWrapper>
      </a-col>
    </a-row>
  </Main>
</template>
<script>
import { RecordFormWrapper } from "../style";
import { Main, BasicFormWrapper } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
// import axios from "axios";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const dateFormat = "YYYY-MM-DD";

const AddNew = defineComponent({
  name: "AddNew",
  components: { RecordFormWrapper, Main, BasicFormWrapper },
  data() {
    const { state } = useStore();
    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");
    const API_URL = `${process.env.VUE_APP_BASE_URL}/net_deliveries_drop_of_points`;
    const router = useRouter();
    const { query } = useRoute();
    const delivery_notes = ref([]);
    // const drop_off_point_id = query.id;
    const parameters = { query };
    const drop_off_point_id = parameters.query.id;

    const formState = reactive({
      // campaign_id: "",
      bale_size: "",
      no_of_bales: "",
      no_of_pieces: "",
      delivery_note: "",
      received_from: "",
      received_by: "",
    });

    const { villages, loading, isFacility, users, campaigns } = reactive({
      villages: [],
      loading: true,
      isFacility: false,
      users: [],
      campaigns: [],
    });

    //counties
    const getVillages = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/villages/list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      console.log(data);
      this.villages = data.data;
      this.loading = false;
    };

    //users
    // const getUsers = async () => {
    //   const response = await fetch(`${process.env.VUE_APP_BASE_URL}/users`, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       ...authHeader(),
    //     },
    //   });
    //   const data = await response.json();
    //   this.users = data.data;
    // };
    const getCampaigns = async () => {
      const response = await fetch(
        `${process.env.VUE_APP_BASE_URL}/campaign_all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        }
      );
      const data = await response.json();
      console.log(data.data);
      this.campaigns = data.data;
    };

    const fetchDeliveryNotes = async () => {
      try {
        await fetch(`${process.env.VUE_APP_BASE_URL}/delivery notes`, {
          method: "GET",
          headers: authHeader(),
        })
          .then((response) => response.json())
          .then((data) => {
            delivery_notes.value = data.data;
            console.log(delivery_notes.value);
          })
          .catch((error) => {
            notification.error({
              message: "Error",
              description: `${error}`,
            });
            // isModalOpen.value = false;
          });
      } catch (error) {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      }
    };

    onMounted(() => {
      // getUsers();
      getVillages();
      getCampaigns();
      drop_off_point_id;
      fetchDeliveryNotes();
    });
    // console.log(drop_off_point_id)
    const handleSubmit = (values) => {
      console.log(values);
      values = {
        campaign_id: 1,
        drop_off_point_id: drop_off_point_id,
        bale_size: values.bale_size,
        no_of_bales: values.no_of_bales,
        no_of_pieces: values.no_of_pieces,
        delivery_note: values.delivery_note,
        date_received: new Date().toISOString().substr(0, 10),
        received_from: values.received_from,
      };
      console.log(JSON.stringify(values));
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then(({ status, data }) => {
          console.log(data);
          if (status == true) {
            router.push("/nets/drop-off");
            notification["success"]({
              message: "Nets Received",
              description: "Nets have been successfully delivered",
              duration: 5.5,
            });
          }
          else{
            notification["error"]({
              message: "Unauthorized Action",
              description: "Only Drop-off Supervisors to Receive",
              duration: 5.5,
            })
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    return {
      isLoading,
      loading,
      apiUrl,
      isFileLoading,
      isFacility,
      handleSubmit,
      dateFormat,
      formState,
      join,
      villages,
      campaigns,
      users,
      delivery_notes,
    };
  },
});

export default AddNew;
</script>
