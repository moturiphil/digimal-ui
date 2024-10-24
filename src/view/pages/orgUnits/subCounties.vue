<template>
  <RecordViewWrapper>
    <sdPageHeader ghost :title="`${county_name} Sub Counties`">
      <template #subTitle>
        <sdButton class="btn-add_new" size="default" type="success"> </sdButton>
      </template>
      <template #buttons>
        <div class="search-box">
          <span class="search-icon">
            <sdFeatherIcons type="search" size="14" />
          </span>
          <a-input
            v-model:value="searchItem"
            type="text"
            name="dataSource"
            placeholder="Search by name"
          />
        </div>
      </template>
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
                <a-table
                  :pagination="{ pageSize: 10, showSizeChanger: true }"
                  :dataSource="dataSource"
                  :columns="columns"
                >
                  <template #units="{ record }">
                    <td>
                      <div class="table-actions">
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/org-units/wards/${record.org_id}`,
                              query: { name: record.name },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            View Wards
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton size="extra-small" type="success">
                          <router-link
                            :to="{
                              path: `/sub-county-units/chp-ve/${record.org_id}`,
                              query: {
                                name: record.name,
                                id: record.id,
                              },
                            }"
                            class="btn-icon"
                            type="info"
                            shape="circle"
                          >
                            View Villages
                          </router-link>
                        </sdButton>
                        &nbsp;&nbsp;
                        <sdButton
                          @click="handleDistributionDates()"
                          size="extra-small"
                          type="warning"
                        >
                          &nbsp; Start Distribution
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
      <!-- start Distribution Modal -->
      <a-modal
        title="Start SubCounty Distribution"
        :visible="isModalOpen"
        @cancel="handleCancel"
        width="25%"
        footer=""
      >
        <BasicFormWrapper>
          <a-form
            class="add-record-form"
            :style="{ width: '100%' }"
            layout="vertical"
            name="addnew"
            :model="formState"
            @finish="handleSubmit"
          >
            <a-form-item name="start_date" label="Distribution Start Date">
              <a-date-picker
                :style="{ width: '100%' }"
                v-model:value="formState.start_date"
                :format="dateFormat"
                :disabledDate="disabledStartDate"
              />
            </a-form-item>
            <a-form-item name="end_date" label="Distribution End Date">
              <a-date-picker
                :style="{ width: '100%' }"
                v-model:value="formState.end_date"
                :format="dateFormat"
                :disabledDate="disabledEndDate"
              />
            </a-form-item>
            <div class="record-form-actions text-right">
              <sdButton size="small" htmlType="Save" type="success">
                {{ isLoading ? "Loading..." : "Submit" }}
              </sdButton>
            </div>
          </a-form>
        </BasicFormWrapper>
      </a-modal>
      <!-- start Distribution Modal -->
      <a-col :xs="24">
        <DragAndDropTable />
      </a-col>
    </Main>
  </RecordViewWrapper>
</template>
<script setup>
import { RecordViewWrapper } from "../style";
import { Main } from "../../styled";
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";

const columns = [
  {
    title: "Sub County Name",
    dataIndex: "name",
    key: "id",
  },
  {
    title: "Sub County Code",
    dataIndex: "code",
    key: "name",
  },
  {
    title: "Org ID",
    dataIndex: "org_id",
    key: "org_id",
  },
  {
    title: "",
    dataIndex: "",
    key: "units",
    slots: { customRender: "units" },
  },
];
const dataSource = ref([]);
const { params, query } = useRoute();
const searchItem = ref("");
const county_name = query.name;
let isModalOpen = ref(false);

onMounted(async () => {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/get_sub_counties_list?parent_id=${params.id}`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );
    const data = await response.json();
    dataSource.value = data.message;
    console.log(dataSource.value);
  } catch (error) {
    console.error(error);
  }
});

const handleDistributionDates = () => {
  isModalOpen.value = true;
};
const formState = reactive({
  start_date: "",
  end_date: "",
});

const handleSubmit = async () => {
  console.log('handling submit form');
  try {
    const data = {
      start_date: formState.start_date,
      end_date: formState.end_date,
    };
    console.log(data);

    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}subcounty/start/distribution`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    const { status, data: responseData } = result;

    if (status === true) {
      notification.success({
        message: "Success",
        description: responseData,
      });
      isModalOpen.value = false;
      setTimeout(function () {
        window.location.reload();
      }, 3000);
    } else {
      notification.error({
        message: "Error",
        description: `${status}`,
      });
      isModalOpen.value = false;
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};
const handleCancel = () => {
  isModalOpen.value = false;
};
</script>
