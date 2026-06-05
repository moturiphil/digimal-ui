<template>
  <Main>
    <sdPageHeader :title="`Final Closure Report — ${post_name}`" />
    <a-row :gutter="15">
      <a-col class="w-100" :md="24">
        <sdCards headless>
          <div v-if="isLoading" class="spin">
            <a-spin />
          </div>
          <div v-else>
            <a-descriptions
              v-if="report"
              bordered
              :column="1"
              style="margin-bottom: 20px"
            >
              <a-descriptions-item label="Status">
                <a-tag :color="statusColor(report.status)">{{ report.status }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Physical Unopened Bales">
                {{ report.physical_unopened_bales }}
              </a-descriptions-item>
              <a-descriptions-item label="Physical Loose Nets">
                {{ report.physical_loose_nets }}
              </a-descriptions-item>
              <a-descriptions-item label="Physical Total Nets">
                {{ report.physical_total_nets }}
              </a-descriptions-item>
              <a-descriptions-item label="System Expected Nets">
                {{ report.expected_total_nets }}
              </a-descriptions-item>
              <a-descriptions-item label="Variance (Physical - Expected)">
                <span :style="{ color: report.variance_total_nets === 0 ? 'green' : 'red' }">
                  {{ report.variance_total_nets }}
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="Reviewer Notes" v-if="report.reviewer_notes">
                {{ report.reviewer_notes }}
              </a-descriptions-item>
            </a-descriptions>

            <a-alert
              v-else
              type="info"
              message="No closure report has been submitted for this post yet."
              show-icon
              style="margin-bottom: 20px"
            />

            <div v-if="!report || report.status !== 'approved'">
              <BasicFormWrapper>
                <a-form layout="vertical" :model="formState" @finish="handleSubmit">
                  <a-row :gutter="15">
                    <a-col :md="8">
                      <a-form-item label="Physical Unopened Bales">
                        <a-input
                          v-model:value="formState.physical_unopened_bales"
                          type="number"
                          min="0"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-item label="Physical Loose Nets">
                        <a-input
                          v-model:value="formState.physical_loose_nets"
                          type="number"
                          min="0"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :md="8">
                      <a-form-item label="Nets per Bale">
                        <a-select v-model:value="formState.nets_per_bale">
                          <a-select-option :value="50">50</a-select-option>
                          <a-select-option :value="40">40</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>

                  <a-alert
                    type="info"
                    :message="`Physical total: ${physicalTotal} nets`"
                    style="margin-bottom: 12px"
                  />

                  <a-form-item label="Resolution Notes (required if variance)">
                    <a-textarea
                      v-model:value="formState.resolution_notes"
                      :rows="3"
                      placeholder="Explain the close-out variance"
                    />
                  </a-form-item>

                  <div class="text-right">
                    <sdButton
                      size="default"
                      htmlType="submit"
                      type="success"
                      :disabled="isDisabled"
                    >
                      {{ isLoading ? "Loading..." : "Submit Closure" }}
                    </sdButton>
                  </div>
                </a-form>
              </BasicFormWrapper>
            </div>
          </div>
        </sdCards>
      </a-col>
    </a-row>
  </Main>
</template>

<script>
import { Main } from "../../styled";
import { useStore } from "vuex";
import { reactive, ref, defineComponent, computed, onMounted } from "vue";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
import { useRoute } from "vue-router";
import store from "../../../vuex/store";

export default defineComponent({
  name: "PostClosureReport",
  components: { Main },
  setup() {
    const { state } = useStore();
    const isLoading = ref(false);
    const isDisabled = computed(() => state.isDisabled);
    const { query } = useRoute();
    const post_id = Number(query.id);
    const post_name = query.name;
    const BASE_URL = process.env.VUE_APP_BASE_URL;

    const report = ref(null);
    const formState = reactive({
      physical_unopened_bales: 0,
      physical_loose_nets: 0,
      nets_per_bale: 50,
      resolution_notes: "",
    });

    const physicalTotal = computed(
      () =>
        Number(formState.physical_unopened_bales || 0) *
          Number(formState.nets_per_bale || 0) +
        Number(formState.physical_loose_nets || 0)
    );

    const statusColor = (status) => {
      switch (status) {
        case "approved":
          return "green";
        case "submitted":
          return "blue";
        case "flagged":
          return "red";
        default:
          return "orange";
      }
    };

    const loadReport = async () => {
      isLoading.value = true;
      try {
        const response = await fetch(`${BASE_URL}/posts/${post_id}/closure`, {
          method: "GET",
          headers: authHeader(),
        });
        const data = await response.json();
        report.value = data.data || null;
        if (report.value) {
          formState.physical_unopened_bales = report.value.physical_unopened_bales;
          formState.physical_loose_nets = report.value.physical_loose_nets;
          formState.nets_per_bale = report.value.nets_per_bale;
          formState.resolution_notes = report.value.resolution_notes || "";
        }
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    const handleSubmit = async () => {
      store.commit("setIsDisabled", true);
      const payload = {
        physical_unopened_bales: Number(formState.physical_unopened_bales),
        physical_loose_nets: Number(formState.physical_loose_nets),
        nets_per_bale: Number(formState.nets_per_bale),
        resolution_notes: formState.resolution_notes || null,
      };

      try {
        const response = await fetch(`${BASE_URL}/posts/${post_id}/closure`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        store.commit("setIsDisabled", false);

        if (data.success) {
          notification.success({
            message: "Closure submitted",
            description: data.message,
            duration: 5,
          });
          await loadReport();
        } else {
          const firstError =
            data.errors && Object.values(data.errors).length
              ? Object.values(data.errors)[0][0]
              : data.message;
          notification.error({
            message: "Submission failed",
            description: firstError,
            duration: 6,
          });
        }
      } catch (error) {
        store.commit("setIsDisabled", false);
        notification.error({ message: "Error", description: error.message });
      }
    };

    onMounted(loadReport);

    return {
      isLoading,
      isDisabled,
      post_name,
      report,
      formState,
      physicalTotal,
      statusColor,
      handleSubmit,
    };
  },
});
</script>
