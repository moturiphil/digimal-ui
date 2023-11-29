<template>
  <RecordViewWrapper>
    <sdPageHeader title="Masterlists">
      <template #buttons>
        <a-row :gutter="5">
          <a-col :xxl="3" :xl="3" :md="3" :sm="3">
            <div class="search-box">
            <a-input
              style="border: 1px solid #151414; padding: 8px; border-radius: 5px; align-items: center; justify-items: center;"
              v-model:value="searchItem"
              type="text"
              name="dataSource"
              placeholder="Search by name, level, location or organization,..."
            />
          </div>
          </a-col>
        </a-row>
      </template>
    </sdPageHeader>
    <!-- sdPageBody -->
    <Main>
      <a-row :gutter="5" class="">
        <a-col :xxl="3" :xl="6" :md="12" :sm="24">
        <a-upload>
          <a-button style="background:#26D07C;color:aliceblue">
            <UploadOutlined />
          <router-link
                  :to="{
                    path: `/users/import`,
                  }"
                  class="btn-icon"
                  type="secondary"
                  shape="circle"
                >Import Master List
                </router-link>
          </a-button>
        </a-upload>
        </a-col>
        <a-space></a-space>
        <a-col :xxl="3" :xl="6" :md="12" :sm="24">
          <a-button type="info" class="btn-icon" @click="validateMasterlist" style="background:#26D07C;color:aliceblue">Validate Masterlist</a-button>
        </a-col>
        <a-space></a-space>
        <a-col :xxl="3" :xl="6" :md="12" :sm="24">
          <a-upload>
            <a-button style="background:#26D07C;color:aliceblue">
              <UploadOutlined />
            <router-link
                    :to="{
                      path: `/uploads`,
                    }"
                    class="btn-icon"
                    type="info"
                    shape="circle"
                  >Uploads
                  </router-link>
            </a-button>
          </a-upload>
        </a-col>
        <!-- <a-col :xs="24" :sm="24" :md="12">
          <sdAutoComplete
            @onSearch="handleSearch"
            placeholder="Search registered users"
            :style="{ width: '80%', marginRight: '80px', height: '40px' }"
          />
        </a-col> -->
      </a-row>
      <br />
      <br />
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
                  :pagination="{ pageSize: 100, showSizeChanger: true }"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <template #action="{ record }">
                    <td>
                      <div class="table-actions">
                        <a-button
                          @click="handleDeletion(record.id)"
                          type="danger"
                        >
                          <sdFeatherIcons type="x-circle" />
                          &nbsp; Delete Record
                      </a-button>
                      </div>
                    </td>
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
import {computed,onMounted,ref,watchEffect} from "vue";
import { notification } from "ant-design-vue";
import { UploadOutlined } from '@ant-design/icons-vue';
import axios from '@/Axiosconfig';


const { state } = useStore();
const isLoading = computed(() => state.crud.loading);
const dataSource = ref([]);
const masterlist_validation_url = `mpesa-list-export`;
const columns = [
  {
    title: "Name",
    dataIndex: "fullName",
    key: "id",
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "organization",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "id",
  },
  {
    title: "Phone Number",
    dataIndex: "phone_no",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "action",
    slots: { customRender: "action" },
  },
];
const searchItem = ref("");

//Drill down filters
const access_level = ref({})
const filterAccessList = ref([])
//org levels
const countries = ref([{ value: {id:1,org_id:'HfVjCurKxh2'}, label: "Kenya" }])
const counties = ref(null)
const subcounties = ref(null)
const wards = ref(null)
const locations = ref(null)
const sublocations = ref(null)
const villages = ref(null)
const country = ref("Select Country")
const county = ref("Select County")
const sublocation = ref("Select Sublocation")
const subcounty = ref("Select Subcounty")
const location = ref("Select Location")
const ward = ref("Select Ward")
const village = ref("Select a Post")


const org_ids=ref([])


onMounted(async () => {
  if (sessionStorage.getItem("user") != null) {
    access_level.value = JSON.parse(sessionStorage.getItem("user")).user;
    updateFilters()
    console.log(JSON.stringify(access_level.value.location));
  }
});

const updateFilters = () => {
  // access_level.value.level.level_name = 'national'
  // access_level.value.location.id = 1
  // access_level.value.location.org_id ='HfVjCurKxh2'
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
  updateMasterList()
}
const handleChange = async (org_id, org_level) => {
  //fetch child data
  let org = org_ids.value.filter(x => x.org_id === org_id).map(e => e.id)
  console.log(org)
  let parent_id=org[0] || 1
  console.log(parent_id)
  console.log(org_level)
  fetchChildData(parent_id,org_id,org_level)
};
const fetchChildData = async (location_id,org_id, org_level) => {
  let fetchUrl = `get_sub_counties_list`
  let masterListUrl = `masterlist_list`
  if (org_level == 'country') {//get counties
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `?location=${location_id}`
    //clear fields
    county.value = "Select County"
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'county') {//get subcounties
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `?location=${location_id}`
    //clear fields
    subcounty.value = "Select SubCounty"
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'subcounty') {//get wards
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `?location=${location_id}`
    //clear fields
    ward.value = " Select Ward"
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'ward') {//get locatios
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `?location=${location_id}`
    //clear fields
    location.value = "Select Location"
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'location') {//get sub locatios
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `?location=${location_id}`
    //clear fields
    sublocation.value = "Select Sub Location"
  } else if (org_level == 'sublocation') {//get sublocations stats
    fetchUrl += `?parent_id=${org_id}`
    masterListUrl += `?location=${location_id}`
  } else if(org_level == 'village'){
    masterListUrl += `?location=${location_id}`
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
        org_ids.value = [
          ...org_ids.value,
          ...data
            .map(x => ({ org_id: x.org_id, id: x.id }))
            .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
        ];
      } else if (org_level == 'subcounty') {//get wards
        wards.value = data.map(x => ({
          value:x.org_id,
          label: x.name
        }));
        org_ids.value = [
          ...org_ids.value,
          ...data
            .map(x => ({ org_id: x.org_id, id: x.id }))
            .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
        ];
      } else if (org_level == 'ward') {//get locations
        locations.value = data.map(x => ({
          value:x.org_id,
          label: x.name
        }));
        org_ids.value = [
          ...org_ids.value,
          ...data
            .map(x => ({ org_id: x.org_id, id: x.id }))
            .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
        ];
      } else if (org_level == 'location') {//get sublocations
        sublocations.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = [
          ...org_ids.value,
          ...data
            .map(x => ({ org_id: x.org_id, id: x.id }))
            .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
        ];
      } else if (org_level == 'sublocation') {//get villages
        villages.value = data.map(x => ({
          value: x.org_id,
          label: x.name
        }));
        org_ids.value = [
          ...org_ids.value,
          ...data
            .map(x => ({ org_id: x.org_id, id: x.id }))
            .filter(newItem => !org_ids.value.some(existingItem => existingItem.id === newItem.id))
        ];
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

const updateMasterList=async()=>{
    try {
    const response = await axios.get(`masterlist_list`);
    const data = await response.data;
    const updatedData = data.data.map((record) => {
      let fullName = `${record.first_name} ${record.middle_name} ${record.last_name}`;
      let status = record.status == 1 ? "validated" : "Not Validated";
      // const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      // let created_at = record.created_at.toLocaleDateString('en-US', options);
      return {
        ...record,
        fullName,
        status,
      };
    });
    dataSource.value = updatedData;
  } catch (error) {
    console.error(error);
  }
}
const validateMasterlist = async () => {
  try {
    const response = await axios.get(masterlist_validation_url);
    if (!response.ok) {
      throw new Error("Failed to fetch export data");
    }
    const fileBlob = await response.blob();
    const fileName = "master_list.xlsx";
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([fileBlob]));
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error(error);
  }
};
const handleDeletion = async (id) => {
  try {
    const response = await axios.delete(`delete_record?record_id=${id}`);
    const data = await response.data;
    if (response.success == true) {
      notification.success({
        message: "Success",
        description: data.message,
      });
      window.location.reload();
    } else {
      notification.error({
        message: "Error",
        description: data.message,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
watchEffect(async() => {
  const query = searchItem.value.toLowerCase();

  try {
    if(!query) return dataSource.value;
    if(query.length > 3){

      const response =  await axios.get(`masterlist_list?query=${query}`);
      const data =  await response.data;
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
    }

  } catch (error) {
    notification.error({
      message: "Error",
      description: error.message,
    });
  }
});

</script>

<style>
.search-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
}
.router_link {
  color: #fff;
}
.router_link:hover {
  color: #fff;
}
</style>
