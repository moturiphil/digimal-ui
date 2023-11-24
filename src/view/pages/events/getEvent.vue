<template>
    <RecordViewWrapper>
      <sdPageHeader title="MassNet Events">
        <template #subTitle>
          <sdButton class="btn-add_new" size="default" type="success">
            <router-link to="/events/event-create">
              <sdFeatherIcons type="plus" size="14" /> Event Info</router-link
            >
          </sdButton>
        </template>
        <template #buttons>
          <div class="search-box">
            <span class="search-icon">
              <sdFeatherIcons type="search" size="14" />
            </span>
            <a-input
              @change="onHandleSearch"
              v-model:value.trim="formState.searchItem"
              type="text"
              name="dataSource"
              placeholder="Search Here"
            /></div
        ></template>
      </sdPageHeader>
      <Main>
        <a-row :gutter="15">
          <a-col class="w-100" :md="24">
            <sdCards headless>
              <div v-if="isLoading" class="spin">
                <a-spin />
              </div>

              <div v-else>
                <TableWrapper class="table-data-view table-responsive">
                  <a-row class="" style="float:end;" :gutter="5">
                    <a-space>
                    <a-col v-if="filterAccessList.includes('country')" :xxl="3" :xl="6" :md="12" :sm="24">
                      <a-select v-model:value="country" show-search placeholder="Select Country" style="width: 200px"
                        :options="countries" :filter-option="filterOption" @change="handleChange($event, 'country')"></a-select>
                    </a-col>
                    <a-col v-if="filterAccessList.includes('county')" :xxl="3" :xl="6" :md="12" :sm="24">
                      <a-select v-model:value="county" show-search placeholder="Select County" style="width: 200px"
                        :options="counties" :filter-option="filterOption" @change="handleChange($event, 'county')"></a-select>
                    </a-col>
                    <a-col v-if="filterAccessList.includes('subcounty')">
                      <a-select v-model:value="subcounty" show-search placeholder="Select Sub County" style="width: 200px"
                        :options="subcounties" :filter-option="filterOption" @change="handleChange($event, 'subcounty')"></a-select>
                    </a-col>
                    <a-col v-if="filterAccessList.includes('ward')" :xxl="3" :xl="6" :md="12" :sm="24">
                      <a-select v-model:value="ward" show-search placeholder="Select Ward" style="width: 200px" :options="wards"
                        :filter-option="filterOption" @change="handleChange($event, 'ward')"></a-select>
                    </a-col>
                    </a-space>
                  </a-row>
                  <br/>
                  <a-row style="float:end;" :gutter="5">
                    <a-space>
                    <a-col v-if="filterAccessList.includes('location')" :xxl="3" :xl="6" :md="12" :sm="24">
                      <a-select v-model:value="location" show-search placeholder="Select Location" style="width: 200px"
                        :options="locations" :filter-option="filterOption" @change="handleChange($event, 'location')"></a-select>
                    </a-col>
                    <a-col v-if="filterAccessList.includes('sublocation')" :xxl="3" :xl="6" :md="12" :sm="24">
                      <a-select v-model:value="sublocation" show-search placeholder="Select Sub Location" style="width: 200px"
                        :options="sublocations" :filter-option="filterOption"
                        @change="handleChange($event, 'sublocation')" ></a-select>
                    </a-col>
                    <a-col v-if="filterAccessList.includes('village')" :xxl="3" :xl="6" :md="12" :sm="24">
                        <a-select v-model:value="village" show-search placeholder="Select a Post" style="width: 200px"
                          :options="villages" :filter-option="filterOption"
                          @change="handleChange($event, 'village')" ></a-select>
                      </a-col>
                    </a-space>
                  </a-row>
                  <a-divider></a-divider>
                  <a-table
                    :rowSelection="rowSelection"
                    :pagination="{ pageSize: 10, showSizeChanger: true }"
                    :dataSource="dataSource"
                    :columns="columns"
                  >
                    <template #events="{}">
                      <td>
                        <div class="table-actions">
                          <sdButton
                          >
                            <router-link
                              :to="`/event/show/${record.id}`"
                              class="btn-icon"
                              type="info"
                              shape="circle"
                            >
                              <sdFeatherIcons type="eye" size="16" />
                              &nbsp;&nbsp; View
                            </router-link>
                            <!-- <sdFeatherIcons type="edit" size="16" /> -->
                            <!-- &nbsp;&nbsp; View -->
                          </sdButton>
                          <sdButton
                            @click="showSuccessModal"
                            size="small"
                            type="success"
                          >
                            <sdFeatherIcons type="user-plus" size="17" />
                            &nbsp;&nbsp; Register
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
  import axios from "axios";
  import authHeader from "../../../services/auth-header";
  import { RecordViewWrapper } from "./style";
  import { Main, TableWrapper } from "../../styled";
  import { useStore } from "vuex";
  import { computed, onMounted, ref, reactive, defineComponent } from "vue";
  import { useRouter } from "vue-router";
  import { Modal } from "ant-design-vue";
  import { notification } from "ant-design-vue";

  const router = useRouter();

  const columns = [
    {
      title: "Participant Name",
      dataIndex: "name",
      key: "id",
    },
    {
      title: "Participant Phone",
      dataIndex: "event_code",
      key: "id",
    },
    {
      title: "Organization",
      dataIndex: "user_id",
      key: "id",
    },
    {
      title: "Role",
      dataIndex: "campaign_id",
      key: "id",
    },
    {
      title: "",
      dataIndex: "",
      key: "events",
      slots: { customRender: "events" },
    },
  ];

  //Drill down filters
  const access_level = ref({})
  const filterAccessList = ref([])
  //org levels
  const countries = ref([{ value: { id: 1, org_id: 'HfVjCurKxh2' }, label: "Kenya" }])
  const counties = ref(null)
  const subcounties = ref(null)
  const wards = ref(null)
  const locations = ref(null)
  const sublocations = ref(null)
  const villages = ref(null)


  const org_ids = ref([])


  onMounted(async () => {
    if (sessionStorage.getItem("user") != null) {
      access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
      this.updateFilters()
      console.log(JSON.stringify(access_level.value.location));
    }
  });

  const ViewPage = defineComponent({
    name: "ViewPage",
    components: { RecordViewWrapper, Main, TableWrapper },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        modalType: "primary",
        colorVisible: false,
      };
    },
    methods: {
      showModal() {
        this.visible = true;
      },
      showSuccessModal() {
        Modal.success({
          title: "Event Registration",
          content: (
            <div>
              <p>Enter Registration Code to Register</p>
              <Input v-model={this.eventCode} placeholder="Enter Registration code" />
            </div>
          ),
          okText: "Register",
          onOk: async () => {
            try {
              // Validate the event code
              const { data } = await axios.get(
                `${process.env.VUE_APP_BASE_URL}/events/all?event_code=${this.eventCode}`,
                { headers: authHeader() }
              );
              console.log(data);
              if (!data || data.length === 0) {
                throw new Error("Invalid event code");
              }

              // Navigate to the event registration page
              // const participantId = 2; // Change this to the participant's ID
              // get the event registration code when user clicks to register pae

              const eventReg = '';
              const response = await axios.post(
                `${process.env.VUE_APP_BASE_URL}/event/${data[0].id}/participant/${eventReg}/assign`,
                { headers: authHeader() }
              );
              if (response.status !== 200) {
                throw new Error("Failed to Register Participant to event");
              }
              else {
                console.log('Participant Registered');
              }

              // Show success message
              Modal.success({
                title: "Success",
                content: "You have been registered for the event",
              });
            } catch (error) {
              Modal.error({
                title: "Error",
                content: error.message,
              });
            }
          },
          style: {
            float: "center",
            display: "grid",
            placeContent: "center",
          },
        });
      },
      handleOk() {
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.colorVisible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      handleCancel() {
        this.visible = false;
        this.colorVisible = false;
      },
      changeType(type) {
        this.modalType = type;
      },
      success() {
        Modal.success({
          title: "This is a success message",
          // JSX support
          content: (
            <div>
              <p>some messages...some messages...</p>
              <p>some messages...some messages...</p>
            </div>
          ),
        });
      },
      error() {
        Modal.error({
          title: "This is an error message",
          content: "some messages...some messages...",
        });
      },
      warning() {
        Modal.warning({
          title: "This is a warning message",
          content: "some messages...some messages...",
        });
      },
    },
    setup() {
      const { state, dispatch } = useStore();
      const crud = computed(() => state.crud.data);
      const isLoading = computed(() => state.crud.loading);
      const selectedRowKeys = ref([]);
      const dataSource = ref([]);
      const eventCode = ref("");
      const API_URL = `events/all`;

    onMounted(async () => {
        if (sessionStorage.getItem("user") != null) {
          access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
          filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
          updateFilters()
          console.log(JSON.stringify(access_level.value.location));
        }
      });
      const updateFilters = () => {
        // access_level.value.level.level_name = 'national'
        // access_level.value.location.id = 1
        // access_level.value.location.org_id = 'HfVjCurKxh2'
        // access_level.value.location.name = 'Kenya'

        if (access_level.value.level.level_name.toLowerCase() == 'national') {
          filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
          countries.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
          org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
          fetchCounties()
        } else if (access_level.value.level.level_name.toLowerCase() == 'county') {
          filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
          counties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
          org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
        } else if (access_level.value.level.level_name.toLowerCase() == 'subcounty') {
          filterAccessList.value = ['subcounty', 'ward', 'location', 'sublocation', 'village']
          subcounties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
          org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
        } else if (access_level.value.level.level_name.toLowerCase() == 'ward') {
          filterAccessList.value = ['ward', 'location', 'sublocation', 'village']
          wards.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
          org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
        } else if (access_level.value.level.level_name.toLowerCase() == 'location') {
          filterAccessList.value = ['location', 'sublocation', 'village']
          locations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
          org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
        } else if (access_level.value.level.level_name.toLowerCase() == 'sublocation') {
          filterAccessList.value = ['sublocation', 'village']
          sublocations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
          org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
        } else {
          filterAccessList.value = ['village']
          villages.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
          org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
        }
        fetchEvents()
      }
      const handleChange = async (org_id, org_level) => {
        //fetch child data
        let org = org_ids.value.filter(x => x.org_id === org_id).map(e => e.id)
        console.log(org)
        let parent_id = org[0] || 1
        console.log(parent_id)
        console.log(org_level)
        fetchChildData(parent_id, org_id, org_level)
      };
      const fetchChildData = async (location_id, org_id, org_level) => {
        let fetchUrl = `get_sub_counties_list`
        let masterListUrl = API_URL
        if (org_level == 'country') {//get counties
          fetchUrl += `?parent_id=${org_id}`
          masterListUrl += `?location_id=${location_id}`
        } else if (org_level == 'county') {//get subcounties
          fetchUrl += `?parent_id=${org_id}`
          masterListUrl += `?location_id=${location_id}`
        } else if (org_level == 'subcounty') {//get wards
          fetchUrl += `?parent_id=${org_id}`
          masterListUrl += `?location_id=${location_id}`
        } else if (org_level == 'ward') {//get locatios
          fetchUrl += `?parent_id=${org_id}`
          masterListUrl += `?location_id=${location_id}`
        } else if (org_level == 'location') {//get sub locatios
          fetchUrl += `?parent_id=${org_id}`
          masterListUrl += `?location_id=${location_id}`
        } else if (org_level == 'sublocation') {//get sublocations stats
          fetchUrl += `?parent_id=${org_id}`
          masterListUrl += `?location_id=${location_id}`
        } else if (org_level == 'village') {
          masterListUrl += `?location_id=${location_id}`
        }
        await axios.get(`${fetchUrl}`)
          .then(response => {
            let data = response.data.message;
            if (org_level == 'country') {//get counties
              counties.value = data.map(x => ({
                value: x.org_id,
                label: x.name
              }));
              org_ids.value = data.map(x => ({
                org_id: x.org_id,
                id: x.id
              }));
              counties.value.splice(0, 1)
            } else if (org_level == 'county') {//get subcounties
              subcounties.value = data.map(x => ({
                value: x.org_id,
                label: x.name
              }));
              org_ids.value = data.map(x => ({
                org_id: x.org_id,
                id: x.id
              }));
            } else if (org_level == 'subcounty') {//get wards
              wards.value = data.map(x => ({
                value: x.org_id,
                label: x.name
              }));
              org_ids.value = data.map(x => ({
                org_id: x.org_id,
                id: x.id
              }));
            } else if (org_level == 'ward') {//get locations
              locations.value = data.map(x => ({
                value: x.org_id,
                label: x.name
              }));
              org_ids.value = data.map(x => ({
                org_id: x.org_id,
                id: x.id
              }));
            } else if (org_level == 'location') {//get sublocations
              sublocations.value = data.map(x => ({
                value: x.org_id,
                label: x.name
              }));
              org_ids.value = data.map(x => ({
                org_id: x.org_id,
                id: x.id
              }));
            } else if (org_level == 'sublocation') {//get villages
              villages.value = data.map(x => ({
                value: x.org_id,
                label: x.name
              }));
              org_ids.value = data.map(x => ({
                org_id: x.org_id,
                id: x.id
              }));
            }
          }).then(async () => {
            await axios.get(`${masterListUrl}`)
              .then(response => {
                console.log(response.data)
                let data = response.data;
                const updatedData = data.data.map((record) => {
                  let fullName = `${record.first_name} ${record.middle_name} ${record.last_name}`;
                  let status = record.status == 1 ? "validated" : "Not Validated";
                  return {
                    ...record,
                    fullName,
                    status,
                  };
                });
                dataSource.value = updatedData;
              })
          }).catch(error => {
            notification.error({
              message: `Error!`,
              description: `${error}`,
            });
          });
      }
      const fetchCounties = async () => {
        axios.get('counties/')
          .then(response => {
            counties.value = response.data.map(x => ({
              value: x.org_id,
              label: x.name
            })).filter(e => e.value == 'nK0A12Q7MvS');
          }).catch(error => {
            notification.error({
              message: `Error!`,
              description: `${error}`,
            });
          })
      }
      const filterOption = (input, option) => {
        return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };
      const fetchEvents = () => {
      axios
          .get(API_URL)
          .then((response) => {
            console.log(response.data.data);
            dataSource.value = response.data.data;
          })
          .catch((error) => {
            console.error(error);
          });
    }
      async () => {
        try {
          // Validate the event code
          const { data } = await axios.get(
            `${API_URL}?event_code=${eventCode.value}`
          );
          if (!data || data.length === 0) {
            throw new Error("Invalid event code");
          }

          // Navigate to the event registration page
          const eventId = data[0].id;
          router.push(`/event/register/${eventId}`);
        } catch (error) {
          console.error(error);
        }
      };

      const handleDelete = (id) => {
        const confirm = window.confirm("Are you sure delete this?");
        if (confirm) {
          dispatch("axiosDataDelete", {
            id,
            getData: () => {
              dispatch("axiosCrudGetData");
            },
          });
        }
        return false;
      };

      const formState = reactive({
        searchItem: "",
      });

      const onSelectChange = (selectedRowKey) => {
        selectedRowKeys.value = selectedRowKey;
      };

      const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
      };

      return {
        crud,
        isLoading,
        selectedRowKeys,
        handleDelete,
        rowSelection,
        onSelectChange,
        dataSource,
        columns,
        formState,
        //drill down
        handleChange,
        updateFilters,
        filterOption,
        fetchEvents,
      };
    },
  });

  export default ViewPage;
  </script>
