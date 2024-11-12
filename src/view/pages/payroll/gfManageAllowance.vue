<template>
  <div>
    <sdPageHeader ghost title="GF Manage Payroll"> </sdPageHeader>
    <Main>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu"></div>
          </a-col>
          <a-col :xs="24">
            <sdCards headless>
              <div class="result-list-content">
                <a-row :gutter="15">
                  <a-col class="w-100" :md="24">
                    <sdCards headless>
                      <div v-if="isLoading" class="spin">
                        <a-spin />
                      </div>
                      <!-- Add Allowance Modal -->
                      <div v-else>
                        <BasicFormWrapper>
                          <a-form
                            class="add-record-form"
                            :style="{ width: '100%' }"
                            layout="vertical"
                            name="addnew"
                            :model="formState"
                            @finish="handleSubmit"
                          >
                            <a-form-item
                              name="allowance"
                              label="Select Allowance"
                            >
                              <a-select
                                v-model:value="formState.allowance"
                                show-search
                                option-filter-prop="label"
                                placeholder="Select an additional allowance"
                              >
                                <a-select-option
                                  v-for="allowance in additional_allowance"
                                  :key="allowance.id"
                                  :value="allowance.id"
                                  :label="`${allowance.formula_name}`"
                                >
                                  {{ allowance.formula_name }}
                                </a-select-option>
                              </a-select>
                            </a-form-item>

                            <a-form-item
                              v-if="formState.allowance === 90"
                              name="no_of_days"
                              label="No of Days"
                            >
                              <a-select
                                v-model:value="formState.no_of_days"
                                show-search
                                option-filter-prop="label"
                                placeholder="Select number of days"
                                :maxTagCount="5"
                                :maxTagPlaceholder="'...and more'"
                              >
                                <a-select-option
                                  v-for="day in [1, 2, 3, 4, 5, 6]"
                                  :key="day"
                                  :value="day"
                                >
                                  {{ day }} day{{ day > 1 ? "s" : "" }}
                                </a-select-option>
                              </a-select>
                            </a-form-item>

                            <a-form-item label="Select Participants">
                              <a-transfer
                                :dataSource="participants"
                                showSearch
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
                              <sdButton
                                size="default"
                                htmlType="Save"
                                type="success"
                              >
                                {{ isLoading ? "Loading..." : "Submit" }}
                              </sdButton>
                            </div>
                          </a-form>
                        </BasicFormWrapper>
                      </div>
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "../style";
import {
  // onMounted,
  ref,
  // watchEffect,
  reactive,
} from "vue";
import authHeader from "../../../services/auth-header";
import axios from "axios";
import { notification } from "ant-design-vue";

const additional_allowance = ref([]);
const participants = ref([]);
const participants_url = `${process.env.VUE_APP_BASE_URL}/event_pay_roll_list?event_payroll_id=702`;
const formState = reactive({
  allowance: "",
  no_of_days: "",
});

const additionalAllowance = () => {
  axios
    .get(`${process.env.VUE_APP_BASE_URL}/additional_payroll_matrix`, {
      headers: authHeader(),
    })
    .then((response) => {
      additional_allowance.value = response.data.data.map((allowance) => ({
        ...allowance,
        label: `${allowance.formula_name} `,
      }));
    })
    .catch((error) => {
      console.error(error);
    });
};
const fetchParticipant = async () => {
  try {
    const posts = [];
    const response = await fetch(participants_url, {
      method: "GET",
      headers: authHeader(),
    });

    const data = await response.json();
    const posts_data = data.data;

    for (let i = 0; i < posts_data.length; i++) {
      const element = {
        key: posts_data[i].id,
        title: posts_data[i].name,
      };
      posts.push(element);
    }

    participants.value = posts;
    console.log("distributions", participants.value);
  } catch (error) {
    notification.error({
      message: "Error",
      description: `Error: ${error}`,
    });
  }
};
additionalAllowance();
fetchParticipant();
</script>
<style>
.badge-green {
  background-color: #1ec997;
  font-size: 12px;
}
</style>

<style>
.badge-green {
  background-color: #1ec997;
  color: white;
  padding: 4px;
  margin-bottom: 18px;
  border-radius: 3px;
}
</style>
