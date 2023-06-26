<template>
  <Main>
    <sdPageHeader title="Create Role">
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
                    <a-form-item name="name" label="Role Name">
                      <a-input
                        v-model:value="formState.name"
                        placeholder="Role Name"
                      />
                    </a-form-item>

                    <a-form-item label="Permission">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.chv_id"
                        v-if="!loading"
                        placeholder="Select Permissions"
                      >
                        <!-- <a-select-option
                          v-for="chv in chvs"
                          :key="chv.id"
                          :value="chv.id"
                        >
                          {{ chv.first_name }}
                          {{ chv.last_name }} - {{ chv.phone_no }}
                        </a-select-option> -->
                      </a-select>
                    </a-form-item>

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
import { reactive, ref, defineComponent, computed } from "vue";
// import axios from "axios";
// import authHeader from "../../../services/auth-header";
// import { notification } from "ant-design-vue";
// import { useRouter } from "vue-router";

// testing app

const CreateRole = defineComponent({
  name: "CreateRole",
  components: { RecordFormWrapper, Main, BasicFormWrapper },

  data() {
    const { state } = useStore();

    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");

    // const router = useRouter();



    // const facilitator_url = `${process.env.VUE_APP_BASE_URL}/users`;


    const { campaigns, chvs, loading } = reactive({
      campaigns: "",
      loading: true,
      chvs: [],
    });

    const handleSubmit = () => {
      const data = {
        campaign_id: formState.campaign_id,
        user_ids: formState.chv_id,
      };

      console.log(JSON.stringify(data));

            // for (var i = 0; i < occupied_users.length; i++) {
            //   notification["success"]({
            //     message: message,
            //     description: `User ${occupied_users[i].user} already assigned to a campaign`,
            //     duration: 10.5,
            //   });
            // }
            // notification["success"]({
            //   message: message,
            //   description: `Users ${occupied_users} already assigned to a campaign`,
            //   duration: 5.5,
            // });

    };

    const formState = reactive({
      campaign_id: null,
      user_id: [],
    });

    // console.log(formState);

    return {
      isLoading,
      apiUrl,
      isFileLoading,
      join,
      handleSubmit,
      formState,
      campaigns,
      chvs,
      loading,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (!sessionStorage.getItem("user")) {
      next("/auth/login");
    } else {
      next();
    }
  },
});

export default CreateRole;
</script>
