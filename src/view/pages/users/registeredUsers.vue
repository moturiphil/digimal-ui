<template>
  <RecordViewWrapper>
    <sdPageHeader title="Registered Users">
      <template #buttons>
        <div class="search-box">
          <a-input
            style="border: 1px solid #151414; padding: 8px; border-radius: 5px; align-items: center; justify-items: center;"
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name"
          />
        </div>
      </template>
    </sdPageHeader>
    <Main>
      <sdButton class="btn-import" type="success" size="small">
        <router-link to="/events/add-stakeholder"> Add Stakeholder</router-link>
      </sdButton>
      &nbsp;&nbsp;

      <sdButton class="btn-import" type="success" size="small">
        <router-link to="/users/add-chp-ve"> Add CHP & VE</router-link>
      </sdButton>
      <br />
      <br />
      <a-row :gutter="16" class="search-row"> </a-row>
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
                  :dataSource="dataSource"
                  :columns="columns"
                  @change="handleTableChange"
                >
                <template #pagination="{ pageSize}">
                  <a-pagination
                    :total="pageSize"
                    v-model:current="current"
                    @change="handlePaginationChange(current)"
                  />
                  </template>
                </a-table>
              </TableWrapper>
            </div>
          </sdCards>
        </a-col>
      </a-row>
      <a-col :xs="24">
        <DragAndDropTable />
      </a-col>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { computed, onMounted, ref, watchEffect } from "vue";
import { notification } from "ant-design-vue";
const columns = [
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "id",
  },
  {
    title: "Middle Name",
    dataIndex: "middle_name",
    key: "id",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "id",
  },
  {
    title: "Level",
    dataIndex: "level_id",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "org_types_id",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "role_id",
    key: "id",
  },
  {
    title: "Phone Number",
    dataIndex: "phone_no",
    key: "id",
  },
  {
    title: "",
    dataIndex: "",
    key: "users",
    slots: { customRender: "users" },
  },
];
import axios from '@/Axiosconfig';
const current = ref(1);
const pageSize = ref(100);

const { state } = useStore();
//const crud = computed(() => state.crud.data);
const isLoading = computed(() => state.crud.loading);
//const selectedRowKeys = ref([]);
const dataSource = ref([]);
const searchItem = ref("");
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
const country = ref("Select Country")
const county = ref("Select County")
const sublocation = ref("Select Sublocation")
const subcounty = ref("Select Subcounty")
const location = ref("Select Location")
const ward = ref("Select Ward")
const villages = ref(null)
const village=ref("Select a Post")
const org_ids = ref([])


onMounted(async () => {
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    updateFilters()
    console.log(JSON.stringify(access_level.value.location));
  }
});

const handlePaginationChange = (newPage) => {
  current.value = newPage;
  console.log(newPage);
  fetchUsers()
};

const updateFilters = () => {
  // access_level.value.level.id = 1
  // access_level.value.location.id = 1
  // access_level.value.location.org_id = 'HfVjCurKxh2'
  // access_level.value.location.name = 'Kenya'

   if (access_level.value.level.id == 1) {
    filterAccessList.value = ['country', 'county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    countries.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
    fetchCounties()
  } else if (access_level.value.level.id == 2) {
    filterAccessList.value = ['county', 'subcounty', 'ward', 'location', 'sublocation', 'village']
    counties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 3) {
    filterAccessList.value = ['subcounty', 'ward', 'location', 'sublocation', 'village']
    subcounties.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 4) {
    filterAccessList.value = ['ward', 'location', 'sublocation', 'village']
    wards.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 5) {
    filterAccessList.value = ['location', 'sublocation', 'village']
    locations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  } else if (access_level.value.level.id == 6) {
    filterAccessList.value = ['sublocation', 'village']
    sublocations.value = [{ value: access_level.value.location.org_id, label: access_level.value.location.name }]
    org_ids.value = [{ id: access_level.value.location.id, org_id: access_level.value.location.org_id }]
  }
  fetchUsers()
}

const handleChange = async (org_id, org_level) => {
  //fetch child data
  let org = org_ids.value.filter(x => x.org_id === org_id).map(e => e.id)
  console.log(org)
  let parent_id = org[0] || 9
  console.log(parent_id)
  console.log(org_level)
  fetchChildData(parent_id, org_id, org_level)
};
const fetchChildData = async (location_id, org_id, org_level) => {
  let fetchUrl = `get_sub_counties_list`
  let masterListUrl = `users?page=${current.value}&per_page=${pageSize.value}`
  if (org_level == 'country') {//get counties
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    county.value = "Select County"
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'county') {//get subcounties
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'subcounty') {//get wards
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'ward') {//get locatios
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'location') {//get sub locatios
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'sublocation') {//get sublocations stats
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `&location=${location_id}`
    //clear fields
    sublocation.value = "Select Sub Location"
    village.value="Select Post"
  } else if (org_level == 'village') {
    masterListUrl += `&location=${location_id}`
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

const fetchUsers = async () => {
  try {
    // Assuming you have an initial page number
    const response = await axios.get(`users?page=${current.value}&per_page=${pageSize.value}`);
    const data = await response.data;
    dataSource.value = data.data;
  } catch (error) {
    console.error(error);
  }
}

watchEffect(async()=>{
  const query = searchItem.value.toLowerCase();
  try {
    if(!query) return dataSource.value;
    if(query.length > 3){
      const response = await axios.get(`users?query=${query}`);
      const data = await response.json();
      dataSource.value = data.data;
    }

  } catch (error) {
    notification.error({
      message: "Error",
      description: error.message,
    });
  }
})

// const rowSelection = {
//   selectedRowKeys,
//   onChange: onSelectChange,
// };

</script>

<style>
/* You can style the toggle switch as needed */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #1ec997;
}

input:focus + .slider {
  box-shadow: 0 0 1px #1ec997;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>