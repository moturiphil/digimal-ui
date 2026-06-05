<template>
  <Main>
    <sdPageHeader :title="`Daily Stock Balances — ${post_name}`">
      <br />
      <template #subTitle>
        <sdButton
          class="btn-add_new"
          size="extra-small"
          type="primary"
          @click="openCaptureModal('opening')"
        >
          Capture Opening
        </sdButton>
        &nbsp;
        <sdButton
          class="btn-add_new"
          size="extra-small"
          type="success"
          @click="openCaptureModal('closing')"
        >
          Capture Closing
        </sdButton>
      </template>
    </sdPageHeader>
    <a-row :gutter="15">
      <a-col class="w-100" :md="24">
        <!-- Distribution readiness banner -->
        <a-alert
          v-if="canDistribute !== null"
          :type="canDistribute ? 'success' : 'warning'"
          :message="
            canDistribute
              ? 'Distribution is allowed today — opening balance is in place.'
              : 'Distribution is blocked: capture today\'s opening (and the previous day\'s closing) first.'
          "
          show-icon
          style="margin-bottom: 15px"
        />

        <sdCards headless>
          <div v-if="isLoading" class="spin">
            <a-spin />
          </div>
          <div v-else>
            <TableWrapper class="table-data-view table-responsive">
              <a-table
                :pagination="{ pageSize: 50 }"
                :dataSource="dataSource"
                :columns="columns"
              >
                <template #status="{ record }">
                  <td>
                    <a-tag :color="statusColor(record.status)">
                      {{ record.status }}
                    </a-tag>
                  </td>
                </template>
              </a-table>
            </TableWrapper>
          </div>

          <!-- Capture modal -->
          <a-modal
            :title="`Capture ${captureType} Balance`"
            :visible="isCaptureModalOpen"
            @cancel="handleCancel"
            width="50%"
            footer=""
          >
            <BasicFormWrapper>
              <a-form
                class="add-record-form"
                :style="{ width: '100%' }"
                layout="vertical"
                :model="formState"
                @finish="handleSubmit"
              >
                <a-form-item name="balance_date" label="Balance Date">
                  <a-input
                    v-model:value="formState.balance_date"
                    type="date"
                  />
                  <p class="errors" style="color: red" v-if="!!errors.balance_date">
                    {{ errors.balance_date }}
                  </p>
                </a-form-item>

                <a-form-item name="bales" label="Unopened Bales">
                  <a-input
                    v-model:value="formState.bales"
                    placeholder="Number of full bales"
                    type="number"
                    min="0"
                  />
                  <p class="errors" style="color: red" v-if="!!errors.bales">
                    {{ errors.bales }}
                  </p>
                </a-form-item>

                <a-form-item name="loose_pieces" label="Loose Nets (pieces)">
                  <a-input
                    v-model:value="formState.loose_pieces"
                    placeholder="Loose nets not in a bale"
                    type="number"
                    min="0"
                  />
                  <p class="errors" style="color: red" v-if="!!errors.loose_pieces">
                    {{ errors.loose_pieces }}
                  </p>
                </a-form-item>

                <a-form-item name="nets_per_bale" label="Nets per Bale">
                  <a-select v-model:value="formState.nets_per_bale">
                    <a-select-option :value="50">50</a-select-option>
                    <a-select-option :value="40">40</a-select-option>
                  </a-select>
                </a-form-item>

                <a-alert
                  type="info"
                  :message="`Physical total: ${physicalTotal} nets`"
                  style="margin-bottom: 12px"
                />

                <a-form-item name="variance_notes" label="Variance Notes (optional)">
                  <a-textarea
                    v-model:value="formState.variance_notes"
                    placeholder="Explain any difference from the expected stock"
                    :rows="3"
                  />
                </a-form-item>

                <div class="record-form-actions text-right">
                  <sdButton
                    size="default"
                    htmlType="submit"
                    type="success"
                    :disabled="isDisabled"
                  >
                    {{ isLoading ? "Loading..." : "Submit" }}
                  </sdButton>
                </div>
              </a-form>
            </BasicFormWrapper>
          </a-modal>
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

const columns = [
  { title: "Date", dataIndex: "date", key: "date" },
  { title: "Status", dataIndex: "status", key: "status", slots: { customRender: "status" } },
  { title: "Opening Nets", dataIndex: "opening_total", key: "opening_total" },
  { title: "Closing Nets", dataIndex: "closing_total", key: "closing_total" },
  { title: "Nets Distributed", dataIndex: "nets_distributed", key: "nets_distributed" },
  { title: "Closing Variance (nets)", dataIndex: "closing_variance", key: "closing_variance" },
];

export default defineComponent({
  name: "PostDailyBalance",
  components: { Main },
  setup() {
    const { state } = useStore();
    const isLoading = ref(false);
    const isDisabled = computed(() => state.isDisabled);
    const { query } = useRoute();
    const post_id = Number(query.id);
    const post_name = query.name;
    const BASE_URL = process.env.VUE_APP_BASE_URL;

    const dataSource = ref([]);
    const canDistribute = ref(null);
    const isCaptureModalOpen = ref(false);
    const captureType = ref("opening");

    const today = new Date().toISOString().slice(0, 10);
    const formState = reactive({
      balance_date: today,
      bales: 0,
      loose_pieces: 0,
      nets_per_bale: 50,
      variance_notes: "",
    });

    const errors = reactive({
      balance_date: "",
      bales: "",
      loose_pieces: "",
    });

    const physicalTotal = computed(
      () =>
        Number(formState.bales || 0) * Number(formState.nets_per_bale || 0) +
        Number(formState.loose_pieces || 0)
    );

    const statusColor = (status) => {
      switch (status) {
        case "complete":
          return "green";
        case "pending_closing":
          return "orange";
        case "missing_opening":
          return "red";
        default:
          return "blue";
      }
    };

    const loadSummary = async () => {
      isLoading.value = true;
      try {
        const response = await fetch(
          `${BASE_URL}/posts/${post_id}/balance-summary`,
          { method: "GET", headers: authHeader() }
        );
        const data = await response.json();
        const rows = (data.data || []).map((d) => ({
          date: d.date,
          status: d.status,
          opening_total: d.opening ? d.opening.total_nets : "-",
          closing_total: d.closing ? d.closing.total_nets : "-",
          nets_distributed:
            d.nets_distributed !== null && d.nets_distributed !== undefined
              ? d.nets_distributed
              : "-",
          closing_variance: d.closing ? d.closing.variance_total_nets : "-",
        }));
        dataSource.value = rows;
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    const loadCanDistribute = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/posts/${post_id}/can-distribute?date=${today}`,
          { method: "GET", headers: authHeader() }
        );
        const data = await response.json();
        canDistribute.value = !!data.can_distribute;
      } catch (error) {
        console.error(error);
      }
    };

    const openCaptureModal = (type) => {
      captureType.value = type;
      isCaptureModalOpen.value = true;
    };
    const handleCancel = () => (isCaptureModalOpen.value = false);

    const handleSubmit = async () => {
      errors.balance_date = formState.balance_date ? "" : "Date is required";
      if (errors.balance_date) return;

      store.commit("setIsDisabled", true);
      const payload = {
        type: captureType.value,
        balance_date: formState.balance_date,
        bales: Number(formState.bales),
        loose_pieces: Number(formState.loose_pieces),
        nets_per_bale: Number(formState.nets_per_bale),
        variance_notes: formState.variance_notes || null,
      };

      try {
        const response = await fetch(`${BASE_URL}/posts/${post_id}/balances`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        store.commit("setIsDisabled", false);

        if (data.success) {
          notification.success({
            message: "Balance captured",
            description: data.message,
            duration: 5,
          });
          isCaptureModalOpen.value = false;
          await loadSummary();
          await loadCanDistribute();
        } else {
          const firstError =
            data.errors && Object.values(data.errors).length
              ? Object.values(data.errors)[0][0]
              : data.message;
          notification.error({
            message: "Capture failed",
            description: firstError,
            duration: 6,
          });
        }
      } catch (error) {
        store.commit("setIsDisabled", false);
        notification.error({ message: "Error", description: error.message });
      }
    };

    onMounted(async () => {
      await loadSummary();
      await loadCanDistribute();
    });

    return {
      isLoading,
      isDisabled,
      post_name,
      columns,
      dataSource,
      canDistribute,
      isCaptureModalOpen,
      captureType,
      formState,
      errors,
      physicalTotal,
      statusColor,
      openCaptureModal,
      handleCancel,
      handleSubmit,
    };
  },
});
</script>
