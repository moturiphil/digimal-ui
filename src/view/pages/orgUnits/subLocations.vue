<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard ou-units-page">
        <!-- Page heading -->
        <header class="page-heading">
          <div class="ph-left">
            <h3 class="ph-title">
              <span class="ph-icon">▦</span> {{ location_name }} Sub Locations
            </h3>
            <div class="ou-crumb">
              <span class="crumb-link" @click="goBack">
                <sdFeatherIcons type="arrow-left" size="12" /> Locations
              </span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">{{ location_name }}</span>
              <span class="crumb-sep">/</span>
              <span class="crumb-current">Sub Locations</span>
            </div>
          </div>
          <div class="ph-actions">
            <div class="ou-search">
              <span class="search-icon">
                <sdFeatherIcons type="search" size="14" />
              </span>
              <a-input
                v-model:value="searchItem"
                type="text"
                name="dataSource"
                placeholder="Search by name"
                allow-clear
              />
            </div>
            <div class="ou-view-toggle" role="group" aria-label="Toggle view">
              <button
                type="button"
                class="ou-toggle-btn"
                :class="{ active: viewMode === 'cards' }"
                @click="viewMode = 'cards'"
              >
                <sdFeatherIcons type="grid" size="14" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                class="ou-toggle-btn"
                :class="{ active: viewMode === 'table' }"
                @click="viewMode = 'table'"
              >
                <sdFeatherIcons type="list" size="14" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Summary strip -->
        <section class="panel ou-stats">
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="map-pin" size="16" /></span>
            <div>
              <span class="val">{{ results.length }}</span>
              <span class="lbl">Sub Locations</span>
            </div>
          </div>
          <div class="ou-stat">
            <span class="ic"><sdFeatherIcons type="flag" size="16" /></span>
            <div>
              <span class="val">{{ location_name }}</span>
              <span class="lbl">Parent Location</span>
            </div>
          </div>
        </section>

        <!-- Sub-locations list -->
        <section class="panel ou-list-panel">
          <div v-if="isLoading" class="ou-loading">
            <a-spin />
          </div>

          <div v-else>
            <TableWrapper
              v-if="viewMode === 'table'"
              class="table-data-view table-responsive ou-table-shell"
            >
              <a-table
                :pagination="{ pageSize: 50, showSizeChanger: true }"
                :dataSource="results"
                :columns="columns"
                row-key="org_id"
              >
                <template #units="{ record }">
                  <td>
                    <div class="table-actions">
                      <sdButton
                        size="extra-small"
                        type="primary"
                        class="ou-action-btn"
                      >
                        <router-link
                          :to="{
                            path: `/sub-location/posts/${record.org_id}`,
                            query: {
                              name: record.name,
                              id: record.id,
                              org_id: record.org_id,
                            },
                          }"
                        >
                          <sdFeatherIcons type="eye" size="12" /> View Posts
                        </router-link>
                      </sdButton>
                      <sdButton
                        size="extra-small"
                        type="light"
                        class="ou-action-btn"
                        @click="openModal(record.id)"
                      >
                        Assign Supervisor
                      </sdButton>
                      <sdButton
                        size="extra-small"
                        type="light"
                        class="ou-action-btn"
                        @click="openAssignModal(record.org_id)"
                      >
                        Re-assign
                      </sdButton>
                      <sdButton
                        size="extra-small"
                        type="success"
                        class="ou-action-btn"
                      >
                        <router-link
                          :to="{
                            path: `/org-units/villages/${record.org_id}`,
                            query: {
                              name: record.name,
                            },
                          }"
                        >
                          Villages
                        </router-link>
                      </sdButton>
                    </div>
                  </td>
                </template>
              </a-table>
            </TableWrapper>
            <div v-else class="ou-card-list">
              <article
                v-for="record in results"
                :key="record.org_id"
                class="ou-card"
              >
                <div class="ou-card-head">
                  <div class="ou-card-title">{{ record.name }}</div>
                  <span class="ou-card-code">{{ record.code }}</span>
                </div>
                <div class="ou-card-meta">
                  <div>
                    <span class="lbl">Sub Location Code</span>
                    <span class="val">{{ record.code || "—" }}</span>
                  </div>
                  <div>
                    <span class="lbl">Org ID</span>
                    <span class="val">{{ record.org_id || "—" }}</span>
                  </div>
                </div>
                <div class="ou-card-actions">
                  <sdButton
                    size="extra-small"
                    type="primary"
                    class="ou-action-btn"
                  >
                    <router-link
                      :to="{
                        path: `/org-units/villages/${record.org_id}`,
                        query: { name: record.name },
                      }"
                    >
                      Villages
                    </router-link>
                  </sdButton>
                  <sdButton
                    size="extra-small"
                    type="light"
                    class="ou-action-btn"
                    @click="openModal(record.id)"
                  >
                    Assign Supervisor
                  </sdButton>
                </div>
              </article>
              <div v-if="!results.length" class="ou-empty">
                No sub locations found.
              </div>
            </div>
          </div>
        </section>

        <!-- Assign supervisor modal -->
        <a-modal
          title="Assign Supervisor"
          :visible="isModalOpen"
          @cancel="handleCancel"
          width="50%"
          footer=""
        >
          <BasicFormWrapper>
            <a-form
              class="add-record-form ou-modal-form"
              :style="{ width: '100%' }"
              layout="vertical"
              name="addnew"
              :model="formState"
              @finish="handleSubmit"
            >
              <a-form-item name="Supervisors" label="Select Supervisor">
                <a-select
                  v-model:value="formState.user_id"
                  show-search
                  option-filter-prop="label"
                  placeholder="Select one"
                  :filter-option="filterOption"
                  @search="handleSearch"
                >
                  <a-select-option
                    v-for="user in supervisors"
                    :key="user.id"
                    :value="user.id"
                    :label="`${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`"
                  >
                    {{ user.first_name }} {{ user.last_name }}
                    {{ user.other_name }} - {{ user.id_no }},{{
                      user.role_id
                    }}, {{ user.location_id }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <div class="record-form-actions text-right">
                <sdButton size="default" htmlType="Save" type="success">
                  {{ isLoading ? "Loading..." : "Submit" }}
                </sdButton>
              </div>
            </a-form>
          </BasicFormWrapper>
        </a-modal>
        <!-- End of assign supervisor -->

        <!-- Reassignment Modal -->
        <a-modal
          title="Re-assign Sub Location to Location"
          :visible="isAssignModalOpen"
          @cancel="handleCancelAssign"
          width="25%"
          footer=""
        >
          <BasicFormWrapper>
            <a-form
              class="add-record-form ou-modal-form"
              :style="{ width: '100%' }"
              layout="vertical"
              name="addnew"
              :model="formState"
              @finish="handleAssignSubmit"
            >
              <a-form-item name="location_id" label="Location">
                <a-select
                  size="large"
                  name="basic-select"
                  class="sDash_fullwidth-select"
                  placeholder="Select Location"
                  v-model:value="formState.location_id"
                >
                  <a-select-option
                    v-for="location in remap_parent"
                    :value="location.org_id"
                    :key="location.id"
                  >
                    {{ location.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>

              <div class="record-form-actions text-right">
                <sdButton
                  size="default"
                  htmlType="Save"
                  type="success"
                  :disabled="isSubmitting"
                >
                  {{
                    isLoading
                      ? "Loading..."
                      : isSubmitting
                      ? "Processing ..."
                      : "Assign"
                  }}
                </sdButton>
              </div>
            </a-form>
          </BasicFormWrapper>
        </a-modal>
        <!-- End Reassignment Modal -->
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper } from "../style";
import { BudgetPageWrapper } from "../budget/style";
import { Main, TableWrapper } from "../../styled";
import { computed, onMounted, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { notification } from "ant-design-vue";
import axios from "@/Axiosconfig";
import store from "../../../vuex/store";
import authHeader from "../../../services/auth-header";

const columns = [
  {
    title: "Sub Location Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Sub Location Code",
    dataIndex: "code",
    key: "name",
  },
  {
    title: "Org ID",
    dataIndex: "org_id",
    key: "org_id",
  },
  {
    title: "Supervisor",
    dataIndex: "supervisor",
    key: "supervisor",
  },
  {
    title: "",
    dataIndex: "",
    key: "units",
    slots: { customRender: "units" },
  },
];

const isLoading = ref(true);
const dataSource = ref([]);
const { params, query } = useRoute();
const searchItem = ref("");
const viewMode = ref(
  typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
);
const router = useRouter();
const goBack = () => {
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push({ path: `/org-units/locations/${params.id}` });
  }
};
const isModalOpen = ref(false);
const isAssignModalOpen = ref(false);
const supervisors = ref([]);
const reassig_org = ref("");
const API_URL = `${process.env.VUE_APP_BASE_URL}`;
const remap_parent = ref([]);

const location_name = query.name;

onMounted(async () => {
  isLoading.value = true;
  getSubcountyList();
});

const handleSearch = (value) => {
  console.log(value);
  searchItem.value = value;
  supervisorList();
};

const getSubcountyList = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(
      `get_sub_counties_list?parent_id=${params.id}`
    );
    const data = await response.data;
    console.log(data);
    dataSource.value = data.message;
    console.log(dataSource.value);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const formState = reactive({
  post_id: "",
  user_id: "",
  searchItem: "",
});

const openModal = (id) => {
  supervisorList();
  isModalOpen.value = true;
  formState.sublocation_id = id;
  console.log(isModalOpen.value);
};

const supervisorList = async () => {
  try {
    const response = await axios.get(`cha_users?query=${searchItem.value}`);
    const data = await response.data;

    // Modify the structure of each supervisor to include a 'label' property
    supervisors.value = data.data.map((user) => ({
      ...user,
      label: `${user.first_name} ${user.last_name} ${user.other_name} - ${user.id_no},${user.role_id}, ${user.location_id}`,
    }));
  } catch (error) {
    console.error(error);
  }
};

const handleCancel = () => {
  isAssignModalOpen.value = false;
};

const handleSubmit = async () => {
  try {
    const data = {
      sublocation_id: formState.sublocation_id,
      user_id: formState.user_id,
    };
    console.log(data);
    await axios
      .post(`sublocation_supervisor/assign`, data)
      .then((response) => response.data)
      .then(({ status, message }) => {
        if (status == "Success") {
          notification.success({
            message: "Success",
            description: "SubLocation Assigned Supervisor Successfully",
          });
          isModalOpen.value = false;
          setTimeout(function () {
            location.reload();
          }, 3000);
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        isModalOpen.value = false;
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

// Get Parent children

// Define a function to fetch data
async function fetchParentChildren() {
  console.log(params.id);
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/get_orgunits_siblings/${params.id}`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.data);
    remap_parent.value = data.data;
    return data.data;
  } catch (error) {
    console.error(error);
    // Handle errors as needed
    throw error;
  }
}

fetchParentChildren();

// Assignment Modal

const openAssignModal = (org) => {
  console.log(org);
  reassig_org.value = org;
  isAssignModalOpen.value = true;
};

const handleCancelAssign = () => {
  isAssignModalOpen.value = false;
};

// handle submission for assignment to different org

const handleAssignSubmit = () => {
  const data = {
    org_id: reassig_org.value,
    parent_id: formState.location_id,
  };

  console.log(JSON.stringify(data));

  fetch(`${API_URL}/transfer_org_unit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(({ success, data }) => {
      console.log(data);
      if (success == true) {
        store.commit("setIsSubmitting", false);
        notification["success"]({
          message: "Location mapped successfully",
          description: data,
          duration: 5.5,
        });
        isAssignModalOpen.value = false;
        setTimeout(() => location.reload(), 3000);
      }
      // show error message from the api response
      else {
        store.commit("setIsSubmitting", false);
        notification["error"]({
          message: "Error!",
          description: data,
          duration: 5.5,
        });
        isAssignModalOpen.value = false;
      }
    })
    .catch((error) => {
      store.commit("setIsSubmitting", false);
      notification["error"]({
        message: "Error!",
        description: `${error}`,
        duration: 5.5,
      });
    });
};

const results = computed(() => {
  const query = searchItem.value.toLowerCase();
  const regex = new RegExp(query, "i");
  if (!query) {
    return dataSource.value;
  } else {
    return dataSource.value.filter((event) => {
      return regex.test(event.name);
    });
  }
});

</script>
