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

                <!-- Expected vs physical breakdown -->
                <div class="expected-box" v-if="expectedLoading">
                  <a-spin size="small" /> &nbsp;Loading expected count…
                </div>
                <div class="expected-box" v-else>
                  <div class="exp-row">
                    <span class="exp-label">Your physical count</span>
                    <span class="exp-val">{{ physicalTotal }} nets</span>
                  </div>
                  <div class="exp-row" v-if="expected.has_expected">
                    <span class="exp-label">System expected</span>
                    <span class="exp-val">{{ expected.expected_total }} nets</span>
                  </div>
                  <div class="exp-row" v-if="expected.has_expected">
                    <span class="exp-label">Variance</span>
                    <span
                      class="exp-val"
                      :class="variance < 0 ? 'neg' : variance > 0 ? 'pos' : ''"
                    >
                      {{ variance > 0 ? "+" : "" }}{{ variance }} nets
                      <small v-if="variance !== 0">
                        ({{ variance < 0 ? "shortage" : "surplus" }})
                      </small>
                    </span>
                  </div>
                  <p v-if="expected.is_first_day" class="exp-note">
                    First opening for this post — expected stock is the nets
                    received from the drop-off.
                  </p>
                  <p
                    v-else-if="!expected.has_expected"
                    class="exp-note warn"
                  >
                    Expected stock could not be determined (the previous day's
                    closing may be missing).
                  </p>
                </div>

                <!-- Variance acknowledgement -->
                <a-alert
                  v-if="hasVariance"
                  type="warning"
                  show-icon
                  style="margin-bottom: 12px"
                  :message="`Variance detected: ${variance > 0 ? '+' : ''}${variance} net(s) ${
                    variance < 0 ? 'shortage' : 'surplus'
                  }`"
                  description="Please explain the difference and confirm the physical count before submitting."
                />

                <a-form-item
                  name="variance_notes"
                  :label="hasVariance ? 'Variance Notes (required)' : 'Variance Notes (optional)'"
                >
                  <a-textarea
                    v-model:value="formState.variance_notes"
                    placeholder="Explain any difference from the expected stock"
                    :rows="3"
                  />
                  <p class="errors" style="color: red" v-if="!!errors.variance_notes">
                    {{ errors.variance_notes }}
                  </p>
                </a-form-item>

                <a-form-item v-if="hasVariance" name="variance_confirmed">
                  <a-checkbox v-model:checked="varianceConfirmed">
                    I confirm the physical count is accurate and this variance of
                    <strong>{{ variance > 0 ? "+" : "" }}{{ variance }}</strong>
                    net(s) genuinely exists.
                  </a-checkbox>
                  <p class="errors" style="color: red" v-if="!!errors.variance_confirmed">
                    {{ errors.variance_confirmed }}
                  </p>
                </a-form-item>

                <div class="record-form-actions text-right">
                  <sdButton
                    size="default"
                    htmlType="submit"
                    type="success"
                    :disabled="isDisabled || (hasVariance && !varianceConfirmed)"
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
import { reactive, ref, defineComponent, computed, onMounted, watch } from "vue";
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
      variance_notes: "",
      variance_confirmed: "",
    });

    const physicalTotal = computed(
      () =>
        Number(formState.bales || 0) * Number(formState.nets_per_bale || 0) +
        Number(formState.loose_pieces || 0)
    );

    // System-expected stock for the capture being made (fetched from backend).
    const expected = reactive({
      has_expected: false,
      is_first_day: false,
      expected_total: null,
      expected_bales: null,
      expected_loose: null,
      nets_per_bale: 50,
    });
    const expectedLoading = ref(false);
    const varianceConfirmed = ref(false);

    // Physical − expected (only meaningful when an expectation exists).
    const variance = computed(() =>
      expected.has_expected
        ? physicalTotal.value - Number(expected.expected_total || 0)
        : 0
    );
    const hasVariance = computed(
      () => expected.has_expected && variance.value !== 0
    );

    const fetchExpected = async () => {
      expectedLoading.value = true;
      try {
        const params = new URLSearchParams({
          type: captureType.value,
          date: formState.balance_date,
          nets_per_bale: String(formState.nets_per_bale || 50),
        });
        const response = await fetch(
          `${BASE_URL}/posts/${post_id}/expected-balance?${params.toString()}`,
          { method: "GET", headers: authHeader() }
        );
        const data = await response.json();
        const d = data.data || {};
        expected.has_expected = !!d.has_expected;
        expected.is_first_day = !!d.is_first_day;
        expected.expected_total = d.expected_total;
        expected.expected_bales = d.expected_bales;
        expected.expected_loose = d.expected_loose;
        expected.nets_per_bale = d.nets_per_bale || 50;
      } catch (error) {
        console.error(error);
        expected.has_expected = false;
      } finally {
        expectedLoading.value = false;
      }
    };

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
      varianceConfirmed.value = false;
      errors.variance_notes = "";
      errors.variance_confirmed = "";
      isCaptureModalOpen.value = true;
      fetchExpected();
    };
    const handleCancel = () => (isCaptureModalOpen.value = false);

    // Re-evaluate the expected count whenever the inputs that affect it change.
    watch(
      () => [formState.balance_date, formState.nets_per_bale, captureType.value],
      () => {
        if (isCaptureModalOpen.value) fetchExpected();
      }
    );

    const handleSubmit = async () => {
      errors.balance_date = formState.balance_date ? "" : "Date is required";
      errors.variance_notes = "";
      errors.variance_confirmed = "";
      if (errors.balance_date) return;

      // When a variance exists, notes and explicit confirmation are mandatory.
      if (hasVariance.value) {
        if (!String(formState.variance_notes || "").trim()) {
          errors.variance_notes =
            "Variance notes are required to explain the difference.";
        }
        if (!varianceConfirmed.value) {
          errors.variance_confirmed =
            "Please confirm the variance before submitting.";
        }
        if (errors.variance_notes || errors.variance_confirmed) return;
      }

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
      expected,
      expectedLoading,
      variance,
      hasVariance,
      varianceConfirmed,
      statusColor,
      openCaptureModal,
      handleCancel,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
.expected-box {
  background: #f7f9fc;
  border: 1px solid #e6eaf0;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 14px;
}
.exp-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;
}
.exp-row + .exp-row {
  border-top: 1px dashed #e6eaf0;
}
.exp-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #8a90a6;
  font-weight: 600;
}
.exp-val {
  font-size: 16px;
  font-weight: 700;
  color: #1f2437;
}
.exp-val.neg {
  color: #ff4d4f;
}
.exp-val.pos {
  color: #20c997;
}
.exp-val small {
  font-weight: 600;
  font-size: 11px;
}
.exp-note {
  margin: 8px 0 0;
  font-size: 12px;
  color: #8a90a6;
}
.exp-note.warn {
  color: #fa8c16;
}
</style>
