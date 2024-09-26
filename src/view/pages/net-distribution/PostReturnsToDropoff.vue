<template>
  <!-- Return nets modal -->
  <a-modal
    title="Reverse Logistics Return Nets"
    :visible="returnsModalOpen"
    @cancel="handleReturnsCancel"
    width="50%"
    footer=""
  >
    <BasicFormWrapper>
      <a-form
        class="add-transfer-form"
        :style="{ width: '100%' }"
        layout="vertical"
        name="addnew"
        :model="returns_formState"
        @finish="handleReturns"
      >
        <a-form-item name="to_drop_off" label="To Drop Off Point">
          <a-select
            placeholder="Select Drop Off Point "
            v-model:value="returns_formState.to_drop_off_point_id"
          >
            <a-select-option
              v-for="dp in dropoffpoints"
              :key="dp.id"
              v-model:value="dp.id"
            >
              {{ dp.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="no_of_nets" label="Number of nets">
          <a-input
            v-model:value="returns_formState.number_of_nets"
            placeholder="Number of nets"
            type="number"
          />
        </a-form-item>
        <a-form-item name="date_returned" label="Date Returned">
          <a-date-picker
            :style="{ width: '100%' }"
            v-model:value="returns_formState.date_returned"
            :format="dateFormat"
          />
        </a-form-item>
        <a-form-item name="delivery_note_number" label="S11 No">
          <a-input
            :style="{ width: '100%' }"
            v-model:value="returns_formState.delivery_note_number"
            type="number"
          />
        </a-form-item>
        <a-form-item name="return_reason" label="Reason For Return">
          <a-textarea
            :style="{ width: '100%' }"
            v-model:value="returns_formState.return_reason"
            placeholder="Enter return reson here..."
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
        <div class="record-form-actions text-right">
          <sdButton size="default" htmlType="Save" type="success">
            {{ isLoading ? "Loading..." : "Submit" }}
          </sdButton>
        </div>
      </a-form>
    </BasicFormWrapper>
  </a-modal>
  <!-- end of return nets modal -->
</template>
<script setup>
// const postReturnsModalOpen = ref(false);
console.log("I'm here");
</script>
