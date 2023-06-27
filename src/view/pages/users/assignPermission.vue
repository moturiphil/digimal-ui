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
                    <a-form-item name="role" label="Role Name">
                      <a-select
                        placeholder="Select"
                        v-model:value="formState.role_id"
                        v-if="!loading"
                      >
                        <a-select-option
                          v-for="role in roles"
                          :key="role.id"
                          :value="role.id"
                        >
                          {{ role.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <!-- <a-form-item label="CHVs">
                      <a-select
                        mode="multiple"
                        v-model:value="formState.chv_id"
                        v-if="!loading"
                        placeholder="Select facilitators"
                      >
                        <a-select-option
                          v-for="chv in chvs"
                          :key="chv.id"
                          :value="chv.id"
                        >
                          {{ chv.first_name }}
                          {{ chv.last_name }} - {{ chv.phone_no }}
                        </a-select-option>
                      </a-select>
                    </a-form-item> -->

                    <a-form-item label="Permission">

                      <a-transfer
                        :dataSource="permissions"
                        showSearch
                        v-model="targetKeys"
                        :targetKeys="targetKeys"
                        :render="item=>item.title"
                        :filterOption="filterOption"  
                        @change="handleChange"
                        :listStyle="{
                          width: '500px',
                          height: '500px'
                        }"
                      >
                      </a-transfer>


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
import { Transfer } from 'ant-design-vue';
import authHeader from "../../../services/auth-header";
import {  toRaw } from 'vue';
import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";



const AssignPermissions = defineComponent({
  name: "CreateRole",
  components: { RecordFormWrapper, Main, BasicFormWrapper, 'a-transfer': Transfer },

  data() {
    const { state } = useStore();
    const API_URL = `${process.env.VUE_APP_BASE_URL}/assignPermissionsToRole/`;

    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");
    const permissions = ref([])
    const roles = ref([]);
    // const router = useRouter();
    const { query, params } = useRoute();

    const parameters = { query };
    // const chv_url = `${process.env.VUE_APP_BASE_URL}/get_user_given_the_role?role=chv`;

    const post_id = parameters.query.id;
    console.log(post_id, parameters, params);

    const { campaigns,  loading } = reactive({
      campaigns: "",
      loading: true,
    });

    const handleSubmit = () => {
      const data = {
        role_id: formState.role_id,
        permission_ids: toRaw(formState.permission_ids)
        // formState.permission_ids
      };
       const rawObjectOrArray = toRaw(formState.permission_ids)

      console.log(rawObjectOrArray, data);
     console.log(JSON.stringify(data));

      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      }).then((res)=>res.json())
      .then((response) => {
        console.log(response);
        if (response.message) {
            // router.push("event-view");
              notification["success"]({
                message: response.message,
                // description: "Users successfully assigned to a campaign",
                duration: 10.5,
              });
            }
            // output notification for each user
            else if (response.error) {
              // for (var i = 0; i < occupied_users.length; i++) {
                notification["error"]({
                  message: response.error,
                  // description: `User ${occupied_users[i].user} already assigned to a campaign`,
                  duration: 10.5,
                });
              }
            
      });


      // console.log(formState.permission_ids,data, );

    };

    const formState = reactive({
      role_id:"",
      permission_ids:[]
    });

    // onMounted(() => {
    //   fetchPermissions();
    //   fetchRoles();
    //   // fetchPerm()
    // });
    console.log(`${process.env.VUE_APP_BASE_URL}/permissionsList`)

    const fetchPermissions = async() =>{
      try {
        const perm = []
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/permissionsList`, {
          method: "GET",
          headers: authHeader(),
        });
        // console.log( await response.json());
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
          const element ={
            key: i,
            title: data[i],
          }
          perm.push(element);
        }
        permissions.value = perm
      } catch (error) {
        console.error(error);
      }
    } 
    fetchPermissions();

    const fetchRoles =async()=>{
      try {
        const rls =[]
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/roles`, {
          method: "GET",
          headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        }, 
        });
        const data = await response.json();
        console.log(data);
        for (let i = 1; i < data.length; i++) {
          const element ={
            id: i,
            name: data[i].name,
            orgtype_id: data[i].orgtype_id,
          }
          rls.push(element);
        }
        // console.log(rls)
        this.roles = rls;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    }
    fetchRoles();

    const fetchCHV = async () => {
      // const response = await fetch(chv_url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     ...authHeader(),
      //   }, 
      // });
      // const data = await response.json();
      // this.chvs = data.data;
      // // console.log(data.data);
      // this.loading = false;
    };
    fetchCHV();

    const handleChange=(targetKeys)=> {
      console.log(targetKeys);
      this.targetKeys = targetKeys;
      this.formState.permission_ids = targetKeys;
    }

    function filterOption(inputValue, option) {
      return option.title.indexOf(inputValue) > -1;
    }

    

    return {
      isLoading,
      apiUrl,
      isFileLoading,
      join,
      handleSubmit,
      handleChange,
      formState,
      campaigns,
      roles,
      loading,
      filterOption,
      permissions,
      targetKeys: [],
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

export default AssignPermissions;
</script>
