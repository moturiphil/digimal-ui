<template>
    <!-- Wrapper component for the record view -->
    <RecordViewWrapper>
      <sdPageHeader title="MassNet Activities" />
  
      <!-- Main content area -->
      <Main>
        <!-- Rows for search and table -->
        <a-row :gutter="16" class="search-row"></a-row>
        <a-row :gutter="15">
          <!-- Table column with activity data -->
          <a-col class="w-100" :md="24">
            <!-- Display loading spinner while data is being fetched -->
            <sdCards headless>
              <div v-if="isLoading" class="spin">
                <a-spin />
              </div>
  
              <!-- Table displaying activity data when not loading -->
              <div v-else>
                <TableWrapper class="table-data-view table-responsive">
                  <!-- Activity data table -->
                  <a-table
                    :pagination="{ pageSize: 100, showSizeChanger: true }"
                    :dataSource="dataSource"
                    :columns="columns"
                  >
                    <!-- Custom template for activity column -->
                    <template #activity="{ record }">
                      <td>
                        <!-- Buttons for viewing confirmed and pending participants -->
                        <div class="table-actions">
                          <!-- Button for viewing confirmed participants -->
                          <sdButton size="extra-small" type="success">
                            <router-link
                              :to="{
                                path: `/activity/details/${record.id}`,
                                query: {
                                  id: record.id,
                                  name: record.name,
                                  code: record.activity_code,
                                  created_by: record.created_by,
                                },
                              }"
                              class="btn-icon"
                              type="info"
                              shape="circle"
                            >
                              Activity Details
                            </router-link>
                          </sdButton>
                        </div>
                      </td>
                    </template>
                  </a-table>
                </TableWrapper>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </Main>
    </RecordViewWrapper>
  </template>
  
  <script>
  // Import necessary modules and components
  import { RecordViewWrapper } from "../style";
  import { Main } from "../../styled";
  // import { useStore } from "vuex";
  import { computed, onMounted, ref, reactive, defineComponent } from "vue";
  import authHeader from "../../../services/auth-header";
  
  const columns = [
    {
      title: "Actvity Name",
      dataIndex: "name",
      key: "id",
    },
    {
      title: "Actvity Code",
      dataIndex: "activity_code",
      key: "id",
    },
    {
      title: "Activity Start Date",
      dataIndex: "start_date",
      key: "id",
    },
    {
      title: "Number of Officers",
      dataIndex: "number_of_officers",
      key: "id",
    },
    {
      title: "Number of Days",
      dataIndex: "number_of_days",
      key: "id",
    },
    {
      title: "County",
      dataIndex: "county_id",
      key: "id",
    },
    {
      title: "Sub County",
      dataIndex: "sub_county_id",
      key: "id",
    },
    {
      title: "",
      dataIndex: "",
      fixed: 'right',
      width: 20,
      key: "activity",
      slots: { customRender: "activity" },
    },
  ];
  
  // Define the Vue component
  const ActivityTable = defineComponent({
    name: "ViewPage", // Component name
    components: { RecordViewWrapper, Main }, // Components used in the template
  
    // Component setup function
    setup() {
      const isLoading = ref(false);
      const selectedRowKeys = ref([]);
      const dataSource = ref([]);
      const searchItem = ref("");
  
  
      // Fetch activity data from the API endpoint on component mount
      onMounted(async () => {
        try {
          const response = await fetch(
            `${process.env.VUE_APP_BASE_URL}/activity`,
            {
              method: "GET",
              headers: authHeader(),
            }
          );
          const data = await response.json();
  
          console.log(data);
  
          // Format the data before assigning it to dataSource
          dataSource.value = data.data.map((item) => {
            const countyName = item.county_id[0].name;
            const subCountyName =
              item.sub_county_id.length > 0
                ? item.sub_county_id.map((subCounty) => subCounty.name).join(", ")
                : "N/A";
  
            return {
              ...item,
              county_id: countyName,
              sub_county_id: subCountyName,
            };
          });
          console.log(dataSource.value);
        } catch (error) {
          console.error(error);
        }
      });
  
      // Reactive form state for search input
      const formState = reactive({
        searchItem: "",
      });
  
      // Computed property for filtered search results
      const results = computed(() => {
        const query = searchItem.value.toLowerCase();
        const regex = new RegExp(query, "i");
        if (!query) {
          return dataSource.value;
        } else {
          return dataSource.value.filter((user) => {
            return (
              regex.test(user.first_name) ||
              regex.test(user.last_name) ||
              regex.test(user.role_id)
            );
          });
        }
      });
  
      // Return relevant data, methods, and computed properties
      return {
        isLoading,
        selectedRowKeys,
        dataSource,
        columns,
        formState,
        results,
        searchItem,
      };
    },
  });
  
  // Export the component as default
  export default ActivityTable;
  </script>
  