<template>
  <Main>
    <sdPageHeader title="Supervisor Review — Flagged Stock" />
    <a-row :gutter="15">
      <a-col class="w-100" :md="24">
        <sdCards title="Flagged Closing Balances">
          <div v-if="isLoadingBalances" class="spin">
            <a-spin />
          </div>
          <TableWrapper v-else class="table-data-view table-responsive">
            <a-table
              :pagination="{ pageSize: 25 }"
              :dataSource="balances"
              :columns="balanceColumns"
            >
              <template #variance="{ record }">
                <td>
                  <span :style="{ color: record.variance_total_nets === 0 ? 'green' : 'red' }">
                    {{ record.variance_total_nets }}
                  </span>
                </td>
              </template>
              <template #action="{ record }">
                <td>
                  <div class="table-actions">
                    <sdButton size="extra-small" type="success" @click="openReview('balance', record)">
                      Review
                    </sdButton>
                  </div>
                </td>
              </template>
            </a-table>
          </TableWrapper>
        </sdCards>

        <sdCards title="Flagged Closure Reports">
          <div v-if="isLoadingClosures" class="spin">
            <a-spin />
          </div>
          <TableWrapper v-else class="table-data-view table-responsive">
            <a-table
              :pagination="{ pageSize: 25 }"
              :dataSource="closures"
              :columns="closureColumns"
            >
              <template #variance="{ record }">
                <td>
                  <span :style="{ color: record.variance_total_nets === 0 ? 'green' : 'red' }">
                    {{ record.variance_total_nets }}
                  </span>
                </td>
              </template>
              <template #action="{ record }">
                <td>
                  <div class="table-actions">
                    <sdButton size="extra-small" type="success" @click="openReview('closure', record)">
                      Review
                    </sdButton>
                  </div>
                </td>
              </template>
            </a-table>
          </TableWrapper>
        </sdCards>

        <!-- Review modal -->
        <a-modal
          :title="`Review ${reviewKind === 'balance' ? 'Closing Balance' : 'Closure Report'}`"
          :visible="isReviewModalOpen"
          @cancel="handleCancel"
          width="50%"
          footer=""
        >
          <div v-if="selected">
            <p><strong>Post:</strong> {{ selected.post_name }} ({{ selected.post_code }})</p>
            <p v-if="reviewKind === 'balance'"><strong>Date:</strong> {{ selected.balance_date }}</p>
            <p><strong>Physical Total:</strong> {{ reviewKind === 'balance' ? selected.total_nets : selected.physical_total_nets }} nets</p>
            <p><strong>Expected Total:</strong> {{ selected.expected_total_nets }} nets</p>
            <p>
              <strong>Variance:</strong>
              <span :style="{ color: selected.variance_total_nets === 0 ? 'green' : 'red' }">
                {{ selected.variance_total_nets }}
              </span>
            </p>
            <p v-if="selected.variance_notes"><strong>Captured notes:</strong> {{ selected.variance_notes }}</p>
            <p v-if="selected.resolution_notes"><strong>Resolution notes:</strong> {{ selected.resolution_notes }}</p>

            <BasicFormWrapper>
              <a-form layout="vertical">
                <a-form-item label="Decision">
                  <a-select v-model:value="decision">
                    <a-select-option value="approved">Approve</a-select-option>
                    <a-select-option value="flagged">Reject (keep flagged)</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="Reviewer Notes">
                  <a-textarea v-model:value="reviewerNotes" :rows="3" />
                </a-form-item>
                <div class="text-right">
                  <sdButton type="success" :disabled="isDisabled" @click="submitReview">
                    Submit Decision
                  </sdButton>
                </div>
              </a-form>
            </BasicFormWrapper>
          </div>
        </a-modal>
      </a-col>
    </a-row>
  </Main>
</template>

<script>
import { Main } from "../../styled";
import { useStore } from "vuex";
import { ref, defineComponent, computed, onMounted } from "vue";
import { notification } from "ant-design-vue";
import authHeader from "../../../services/auth-header";
import store from "../../../vuex/store";

const balanceColumns = [
  { title: "Post", dataIndex: "post_name", key: "post_name" },
  { title: "Date", dataIndex: "balance_date", key: "balance_date" },
  { title: "Physical Nets", dataIndex: "total_nets", key: "total_nets" },
  { title: "Expected Nets", dataIndex: "expected_total_nets", key: "expected_total_nets" },
  { title: "Variance", dataIndex: "variance_total_nets", key: "variance", slots: { customRender: "variance" } },
  { title: "Action", dataIndex: "", key: "action", slots: { customRender: "action" } },
];

const closureColumns = [
  { title: "Post", dataIndex: "post_name", key: "post_name" },
  { title: "Physical Nets", dataIndex: "physical_total_nets", key: "physical_total_nets" },
  { title: "Expected Nets", dataIndex: "expected_total_nets", key: "expected_total_nets" },
  { title: "Variance", dataIndex: "variance_total_nets", key: "variance", slots: { customRender: "variance" } },
  { title: "Action", dataIndex: "", key: "action", slots: { customRender: "action" } },
];

export default defineComponent({
  name: "SupervisorBalanceReview",
  components: { Main },
  setup() {
    const { state } = useStore();
    const isDisabled = computed(() => state.isDisabled);
    const BASE_URL = process.env.VUE_APP_BASE_URL;

    const balances = ref([]);
    const closures = ref([]);
    const isLoadingBalances = ref(false);
    const isLoadingClosures = ref(false);

    const isReviewModalOpen = ref(false);
    const reviewKind = ref("balance");
    const selected = ref(null);
    const decision = ref("approved");
    const reviewerNotes = ref("");

    const loadBalances = async () => {
      isLoadingBalances.value = true;
      try {
        const response = await fetch(`${BASE_URL}/posts/balances/flagged`, {
          method: "GET",
          headers: authHeader(),
        });
        const data = await response.json();
        balances.value = data.data || [];
      } catch (error) {
        notification.error({ message: "Failed to load flagged balances", description: error?.message || String(error) });
      } finally {
        isLoadingBalances.value = false;
      }
    };

    const loadClosures = async () => {
      isLoadingClosures.value = true;
      try {
        const response = await fetch(`${BASE_URL}/posts/closures/flagged`, {
          method: "GET",
          headers: authHeader(),
        });
        const data = await response.json();
        closures.value = data.data || [];
      } catch (error) {
        notification.error({ message: "Failed to load flagged closures", description: error?.message || String(error) });
      } finally {
        isLoadingClosures.value = false;
      }
    };

    const openReview = (kind, record) => {
      reviewKind.value = kind;
      selected.value = record;
      decision.value = "approved";
      reviewerNotes.value = "";
      isReviewModalOpen.value = true;
    };
    const handleCancel = () => (isReviewModalOpen.value = false);

    const submitReview = async () => {
      store.commit("setIsDisabled", true);
      const url =
        reviewKind.value === "balance"
          ? `${BASE_URL}/posts/balances/${selected.value.id}/review`
          : `${BASE_URL}/posts/closures/${selected.value.id}/review`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify({
            decision: decision.value,
            reviewer_notes: reviewerNotes.value || null,
          }),
        });
        const data = await response.json();
        store.commit("setIsDisabled", false);
        if (data.success) {
          notification.success({ message: "Review saved", description: data.message });
          isReviewModalOpen.value = false;
          await loadBalances();
          await loadClosures();
        } else {
          notification.error({ message: "Review failed", description: data.message });
        }
      } catch (error) {
        store.commit("setIsDisabled", false);
        notification.error({ message: "Error", description: error.message });
      }
    };

    onMounted(async () => {
      await loadBalances();
      await loadClosures();
    });

    return {
      isDisabled,
      balances,
      closures,
      isLoadingBalances,
      isLoadingClosures,
      balanceColumns,
      closureColumns,
      isReviewModalOpen,
      reviewKind,
      selected,
      decision,
      reviewerNotes,
      openReview,
      handleCancel,
      submitReview,
    };
  },
});
</script>
