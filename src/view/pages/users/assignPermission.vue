<template>
  <Main>
    <sdPageHeader ghost :title="`Assign Permissions to ${role_name}`" />
    <a-row :gutter="15">
      <a-col :xs="24">
        <RecordFormWrapper>
          <sdCards headless>
            <a-row justify="center">
              <a-col :xl="20" :md="20" :xs="24">
                <BasicFormWrapper>
                  <a-form
                    class="add-record-form"
                    :style="{ width: '100%' }"
                    layout="vertical"
                    name="addnew"
                    :model="formState"
                    @finish="handleSubmit"
                  >
                    <a-form-item label="Permissions">
                      <a-transfer
                        :dataSource="permissions"
                        showSearch
                        v-model="targetKeys"
                        :targetKeys="targetKeys"
                        :render="(item) => item.title"
                        :filterOption="filterOption"
                        @change="handleChange"
                        :listStyle="{
                          width: '500px',
                          height: '500px',
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
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
import { Transfer } from 'ant-design-vue';
import authHeader from "../../../services/auth-header";
import { toRaw } from "vue";
import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";

const AssignPermissions = defineComponent({
  name: "CreateRole",
  components: {
    RecordFormWrapper,
    Main,
    BasicFormWrapper,
    "a-transfer": Transfer,
  },

  data() {
    const { params, query } = useRoute();

    const { state } = useStore();
    const API_URL = `${process.env.VUE_APP_BASE_URL}/assignPermissionsToRole/`;
    const isLoading = computed(() => state.crud.loading);
    const apiUrl = computed(() => state.crud.url);
    const isFileLoading = computed(() => state.crud.fileLoading);
    const join = ref("");
    const permissions = ref([]);
    const roles = ref([]);
    const user_perm = []
    const role_id = params.id;
    const role_name = query.name;
    const perm_url = `${process.env.VUE_APP_BASE_URL}/roles_permissions_mapping?role_id=${role_id}`;

    const { campaigns, loading } = reactive({
      campaigns: "",
      loading: true,
    });

    const handleSubmit = async() => {
      const data = {
        role_id: role_id,
        permission_ids: toRaw(formState.permission_ids)
      };
      try {
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
          body: JSON.stringify(data),
        })
        .then((res)=>res.json())
        .then((response) => {
          if (response.message) {
                notification["success"]({
                  message: response.message,
                  duration: 10.5,
                });
              }
              else if (response.error) {
                  notification["error"]({
                    message: response.error,
                    duration: 10.5,
                  });
                }
              
        });
        
      } catch (error) {
        notification["error"]({
          message: "Error",
          description: `Error: ${error}`,
        });
      }
    };

    const formState = reactive({
      role_id: "",
      permission_ids: [],
    });
    onMounted(()=>{
      fetchPermissions();
      fetchRoles();
      fetchRolePerm();
    })

    const fetchPermissions = async () => {
      try {
        const perm = []
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/permissionsList`, {
          method: "GET",
          headers: authHeader(),
        });

        const data = await response.json();
        const permissions_data = data.data;
        for (let i = 0; i < permissions_data.length; i++) {
          const element = {
            key: permissions_data[i].id,
            title: permissions_data[i].name,
          };
          perm.push(element);
        }
        permissions.value = perm
      } catch (error) {
        notification["error"]({
          message: "Error",
          description: `Error: ${error}`,
        });
      }
    } 

    const fetchRoles = async () => {
      try {
        const rls = [];
        const response = await fetch(`${process.env.VUE_APP_BASE_URL}/roles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          },
        });
        const data = await response.json();
        for (let i = 1; i < data.length; i++) {
          const element = {
            id: i,
            name: data[i].name,
            orgtype_id: data[i].orgtype_id,
          };
          rls.push(element);
        }
        this.roles = rls;
        this.loading = false;
      } catch (error) {
        notification["error"]({
          message: "Error",
          description: `Error: ${error}`,
        });
      }
    }

    const fetchRolePerm = async () => {
      try {
        
        const response = await fetch(perm_url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader(),
          }, 
        });
        const data = await response.json();
        data.roles['permissions'].forEach((element) => {
            user_perm.push(element.id);
        });
        this.targetKeys = user_perm;
      } catch (error) {
        notification["error"]({
          message: "Error",
          description: `Error: ${error}`,
        });
      }
    };

    const handleChange=(targetKeys)=> {
      this.targetKeys = targetKeys;
      this.formState.permission_ids = targetKeys;
    };

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
      role_name,
    };
  },
});

export default AssignPermissions;
</script>
