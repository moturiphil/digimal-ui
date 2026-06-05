<template>
  <RecordViewWrapper>
    <Main>
      <BudgetPageWrapper class="minimal-dashboard rns-page">
        <!-- Page heading + primary tabs -->
        <header class="page-heading">
          <div class="ph-left">
            <p class="pd-sub">{{ todayLabel }}</p>
          </div>
          <nav class="ph-actions" aria-label="Inventory sections">
<button
  v-for="tab in primaryTabs"
  :key="tab.key"
  type="button"
  class="nav-item"
  :class="{ active: activeTransaction === tab.key }"
  @click="handleTransactions(tab.key)"
>
  {{ tab.label }}
</button>
          </nav>
        </header>

        <!-- Secondary navigation / context actions -->
        <section
          v-if="['receive', 'transfer'].includes(activeTransaction)"
          class="panel sub-nav-panel"
        >
          <div class="sub-nav">
            <template v-if="activeTransaction === 'receive'">
              <a
                v-for="sub in receiveSubTabs"
                :key="sub.key"
                class="pill"
                :class="{ active: activeClass === sub.key }"
                @click="handleChange(sub.key)"
              >
                {{ sub.label }}
              </a>
            </template>
            <template v-else-if="activeTransaction === 'transfer'">
              <a
                v-for="sub in transferSubTabs"
                :key="sub.key"
                class="pill"
                :class="{ active: activeClass === sub.key }"
                @click="handleChange(sub.key)"
              >
                {{ sub.label }}
              </a>
            </template>
          </div>
          <div class="sub-actions">
            <sdButton
              v-if="activeTransaction === 'receive'"
              type="warning"
              size="extra-small"
              @click="openTransferModal()"
            >
              <sdFeatherIcons type="repeat" size="14" /> &nbsp;Transfer
              Households
            </sdButton>
            <sdButton
              v-if="activeTransaction === 'transfer' && activeClass !== 'return'"
              type="warning"
              size="extra-small"
              @click="openmodal"
            >
              <sdFeatherIcons type="plus" size="14" /> &nbsp;New Transfer
            </sdButton>
            <sdButton
              v-if="
                activeTransaction === 'transfer' &&
                activeClass === 'return' &&
                is_pmi_county === true
              "
              type="warning"
              size="extra-small"
              @click="openReturnsModal()"
            >
              <sdFeatherIcons type="corner-up-left" size="14" /> &nbsp;Return to
              Dropoff Point
            </sdButton>
            <sdButton
              v-if="
                activeTransaction === 'transfer' &&
                activeClass === 'return' &&
                is_pmi_county === false
              "
              type="warning"
              size="extra-small"
              @click="openreverseLogisticsModal()"
            >
              <sdFeatherIcons type="corner-up-left" size="14" /> &nbsp;Return to
              Dropoff Point
            </sdButton>
          </div>
        </section>

        <!-- Embedded post management sections (moved from Distribution Posts) -->
        <section v-if="activeTransaction === 'dashboard'" class="embed-section">
          <PostDashboard />
        </section>
        <section v-if="activeTransaction === 'bale'" class="embed-section">
          <BaleVerification />
        </section>
        <section v-if="activeTransaction === 'workers'" class="embed-section">
          <ViewWorker />
        </section>
        <section v-if="activeTransaction === 'balances'" class="embed-section">
          <PostDailyBalance />
        </section>
        <section v-if="activeTransaction === 'closure'" class="embed-section">
          <PostClosureReport />
        </section>
        <section v-if="activeTransaction === 'log'" class="embed-section">
          <PostStockLog />
        </section>

        <a-row
          v-if="['receive', 'transfer'].includes(activeTransaction)"
          :gutter="25"
        >
          <a-col :xs="24">
            <sdCards headless>
              <div class="result-list-content">
                <a-row :gutter="15">
                  <a-col class="w-100" :md="24">
                    <sdCards headless>
                      <div v-if="isLoading" class="spin">
                        <a-spin />
                      </div>

                      <div v-else>
                        <TableWrapper
                          class="table-data-view table-responsive rns-table"
                          v-show="activeClass === 'do_point'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="fromDropoffpoint"
                            :columns="do_columns"
                            size="middle"
                          >
                            <template #action="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  &nbsp;&nbsp;
                                  <sdButton
                                    @click="
                                      openReceiveModal(
                                        `receive`,
                                        record.distribution_id
                                      )
                                    "
                                    type="success"
                                    :disabled="record.status === 1"
                                    size="extra-small"
                                    >Receive</sdButton
                                  >
                                  &nbsp;&nbsp;
                                  <sdButton
                                    @click="
                                      openUpdateReceiveModal(
                                        record.distribution_id
                                      )
                                    "
                                    type="warning"
                                    :disabled="record.status === 0"
                                    size="extra-small"
                                    >Update Receive Date</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        <!-- Mobile cards: Received from DropOff Point -->
                        <div
                          v-show="activeClass === 'do_point'"
                          class="rns-cards"
                        >
<article
  v-for="record in fromDropoffpoint"
  :key="record.distribution_id"
  class="rns-card"
>
                            <div class="rns-card-head">
                              <span class="rns-card-title">{{
                                record.drop_off_point_name || "—"
                              }}</span>
                              <span class="rns-chip">{{
                                record.quantity_issued
                              }} nets</span>
                            </div>
                            <div class="rns-card-grid">
                              <div>
                                <span class="lbl">Date of Issue</span>
                                <span class="val">{{ record.issue_date || "—" }}</span>
                              </div>
                              <div>
                                <span class="lbl">Issued By</span>
                                <span class="val">{{ record.issued_by || "—" }}</span>
                              </div>
                              <div>
                                <span class="lbl">Date Received</span>
                                <span class="val">{{ record.date_received || "—" }}</span>
                              </div>
                            </div>
                            <div class="rns-card-actions">
                              <sdButton
                                @click="
                                  openReceiveModal(
                                    `receive`,
                                    record.distribution_id
                                  )
                                "
                                type="success"
                                :disabled="record.status === 1"
                                size="extra-small"
                                >Receive</sdButton
                              >
                              <sdButton
                                @click="
                                  openUpdateReceiveModal(record.distribution_id)
                                "
                                type="warning"
                                :disabled="record.status === 0"
                                size="extra-small"
                                >Update Receive Date</sdButton
                              >
                            </div>
                          </article>
                          <div v-if="!fromDropoffpoint.length" class="rns-empty">
                            No records found.
                          </div>
                        </div>
                        &nbsp;&nbsp;

                        <TableWrapper
                          class="table-data-view table-responsive rns-table"
                          v-show="activeClass === 'warehouse'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="fromWarehouse"
                            :columns="columns"
                            size="middle"
                          >
                            <template #action="{}">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton type="success" size="extra-small"
                                    >Cancel</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        <!-- Mobile cards: Received from Warehouse -->
                        <div
                          v-show="activeClass === 'warehouse'"
                          class="rns-cards"
                        >
                          <article
                            v-for="(record, i) in fromWarehouse"
                            :key="i"
                            class="rns-card"
                          >
                            <div class="rns-card-head">
                              <span class="rns-card-title">{{
                                record.from_post_name || "—"
                              }}
                                <small>→ {{ record.to_post_name || "—" }}</small>
                              </span>
                              <span class="rns-chip">{{
                                record.number_of_nets
                              }} nets</span>
                            </div>
                            <div class="rns-card-grid">
                              <div>
                                <span class="lbl">Date of Transfer</span>
                                <span class="val">{{ record.date_issued || "—" }}</span>
                              </div>
                              <div>
                                <span class="lbl">Issued By</span>
                                <span class="val">{{ record.issued_by || "—" }}</span>
                              </div>
                            </div>
<div class="rns-card-actions">
  <sdButton type="success" size="extra-small" @click="cancelTransfer(record.id)">Cancel</sdButton>
</div>
                          </article>
                          <div v-if="!fromWarehouse.length" class="rns-empty">
                            No records found.
                          </div>
                        </div>

                        <!-- Net TransfersIn table -->
                        <TableWrapper
                          class="table-data-view table-responsive rns-table"
                          v-show="activeClass === 'transfer_ins'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="transferIns"
                            :columns="transferscolumns"
                            size="middle"
                          >
                            <template #status="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <span
                                    v-if="record.status == 1"
                                    class="badge badge-green"
                                    >Received</span
                                  >
                                  <span
                                    v-else-if="record.status == 2"
                                    class="badge badge-warning"
                                    >Cancelled</span
                                  >
                                  <span v-else class="badge badge-red"
                                    >Pending</span
                                  >
                                </div>
                              </td>
                            </template>
                            <template #action="{ record }">
                              <td :style="{ 'margin-left': '4px' }">
                                <div class="table-actions">
                                  &nbsp;&nbsp;
                                  <sdButton
                                    @click="
                                      openReceiveModal(`transfers`, record.id)
                                    "
                                    type="success"
                                    :disabled="
                                      record.status == 1 || record.status == 2
                                    "
                                    size="extra-small"
                                    >Receive</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        <!-- Mobile cards: Transfer In's -->
                        <div
                          v-show="activeClass === 'transfer_ins'"
                          class="rns-cards"
                        >
                          <article
                            v-for="(record, i) in transferIns"
                            :key="i"
                            class="rns-card"
                          >
                            <div class="rns-card-head">
                              <span class="rns-card-title">{{
                                record.from_post_name || "—"
                              }}
                                <small>→ {{ record.to_post_name || "—" }}</small>
                              </span>
                              <span
                                class="badge"
                                :class="
                                  record.status == 1
                                    ? 'badge-green'
                                    : record.status == 2
                                    ? 'badge-warning'
                                    : 'badge-red'
                                "
                                >{{
                                  record.status == 1
                                    ? "Received"
                                    : record.status == 2
                                    ? "Cancelled"
                                    : "Pending"
                                }}</span
                              >
                            </div>
                            <div class="rns-card-grid">
                              <div>
                                <span class="lbl">Number of Nets</span>
                                <span class="val">{{ record.number_of_nets }}</span>
                              </div>
                              <div>
                                <span class="lbl">Date of Transfer</span>
                                <span class="val">{{ record.date_issued || "—" }}</span>
                              </div>
                              <div>
                                <span class="lbl">Issued By</span>
                                <span class="val">{{ record.issued_by || "—" }}</span>
                              </div>
                            </div>
                            <div class="rns-card-actions">
                              <sdButton
                                @click="openReceiveModal(`transfers`, record.id)"
                                type="success"
                                :disabled="
                                  record.status == 1 || record.status == 2
                                "
                                size="extra-small"
                                >Receive</sdButton
                              >
                            </div>
                          </article>
                          <div v-if="!transferIns.length" class="rns-empty">
                            No records found.
                          </div>
                        </div>
                        <!-- end of Net Transfers table -->

                        <!-- Net TransfersOut table -->
                        <TableWrapper
                          class="table-data-view table-responsive rns-table"
                          v-show="activeClass === 'transfer_outs'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="transferOuts"
                            :columns="transferscolumns"
                            size="middle"
                          >
                            <template #status="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <span
                                    v-if="record.status == 1"
                                    class="badge badge-green"
                                    >Received</span
                                  >
                                  <span
                                    v-else-if="record.status == 2"
                                    class="badge badge-warning"
                                    >Cancelled</span
                                  >
                                  <span v-else class="badge badge-red"
                                    >Pending</span
                                  >
                                </div>
                              </td>
                            </template>
                            <template #action="{ record }">
                              <td :style="{ 'margin-left': '3px' }">
                                <div class="table-actions">
                                  <sdButton
                                    type="success"
                                    :disabled="
                                      record.status == 1 || record.status == 2
                                    "
                                    @click="cancelTransfer(record.id)"
                                    size="extra-small"
                                    >Cancel</sdButton
                                  >
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        <!-- Mobile cards: Transfer Out's -->
                        <div
                          v-show="activeClass === 'transfer_outs'"
                          class="rns-cards"
                        >
                          <article
                            v-for="(record, i) in transferOuts"
                            :key="i"
                            class="rns-card"
                          >
                            <div class="rns-card-head">
                              <span class="rns-card-title">{{
                                record.from_post_name || "—"
                              }}
                                <small>→ {{ record.to_post_name || "—" }}</small>
                              </span>
                              <span
                                class="badge"
                                :class="
                                  record.status == 1
                                    ? 'badge-green'
                                    : record.status == 2
                                    ? 'badge-warning'
                                    : 'badge-red'
                                "
                                >{{
                                  record.status == 1
                                    ? "Received"
                                    : record.status == 2
                                    ? "Cancelled"
                                    : "Pending"
                                }}</span
                              >
                            </div>
                            <div class="rns-card-grid">
                              <div>
                                <span class="lbl">Number of Nets</span>
                                <span class="val">{{ record.number_of_nets }}</span>
                              </div>
                              <div>
                                <span class="lbl">Date of Transfer</span>
                                <span class="val">{{ record.date_issued || "—" }}</span>
                              </div>
                              <div>
                                <span class="lbl">Issued By</span>
                                <span class="val">{{ record.issued_by || "—" }}</span>
                              </div>
                            </div>
                            <div class="rns-card-actions">
                              <sdButton
                                type="success"
                                :disabled="
                                  record.status == 1 || record.status == 2
                                "
                                @click="cancelTransfer(record.id)"
                                size="extra-small"
                                >Cancel</sdButton
                              >
                            </div>
                          </article>
                          <div v-if="!transferOuts.length" class="rns-empty">
                            No records found.
                          </div>
                        </div>
                        <!-- end of Net TransfersOut table -->

                        <!-- Dropoff Returns -->
                        <DropOffReturns
                          :post_id="query.id"
                          v-if="activeClass === 'return'"
                        />

                        <!-- End of Dropoff Returns -->

                        <!-- Transfer modal -->
                        <a-modal
                          title="New Transfer"
                          :visible="isModalOpen"
                          @cancel="handleCancel"
                          width="50%"
                          footer=""
                        >
                          <BasicFormWrapper>
                            <a-form
                              class="add-transfer-form"
                              :style="{ width: '100%' }"
                              layout="vertical"
                              name="addnew"
                              :model="trans_formState"
                              @finish="handleTransfer"
                            >
                              <a-form-item
                                name="from_post_id"
                                label="From Post"
                              >
                                <a-select
                                  placeholder="Select  Post "
                                  v-model:value="trans_formState.from_post_id"
                                  disabled
                                >
                                  <a-select-option
                                    v-for="post in postdata"
                                    :key="post.id"
                                    v-model:value="post.id"
                                  >
                                    {{ post.name }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>
                              <a-form-item name="to_post" label="To Post">
                                <a-select
                                  v-model:value="trans_formState.to_post_id"
                                  show-search
                                  option-filter-prop="label"
                                  placeholder="Select post"
                                  @search="handlePostSearch"
                                >
                                  <a-select-option
                                    v-for="post in posts"
                                    :key="post.id"
                                    v-model:value="post.id"
                                    :label="`${post.name} ${post.post_code}`"
                                  >
                                    {{ post.name }} {{ post.post_code }} -
                                    {{ post.distribution_county }},
                                    {{ post.distribution_sub_county }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>
                              <a-form-item
                                name="no_of_nets"
                                label="Number of nets"
                              >
                                <a-input
                                  v-model:value="trans_formState.number_of_nets"
                                  placeholder="Number of nets"
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item
                                name="delivery_note_number"
                                label="S11 Serial No"
                              >
                                <a-input
                                  v-model:value="
                                    trans_formState.delivery_note_number
                                  "
                                  placeholder="S11 No"
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item name="comment" label="Comment">
                                <a-input
                                  v-model:value="trans_formState.comment"
                                  placeholder="Comment"
                                />
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
                        </a-modal>
                        <!-- End of Transfer modal -->

                        <!-- receive nets modal -->
                        <a-modal
                          title="Receive Nets"
                          :visible="isOpen"
                          @cancel="handleCancelReceive"
                          width="50%"
                          footer=""
                        >
                          <BasicFormWrapper>
                            <a-form
                              class="add-transfer-form"
                              :style="{ width: '100%' }"
                              layout="vertical"
                              name="addnew"
                              :model="formState"
                              @finish="receiveNets"
                            >
                              <a-form-item name="bale_size" label="Bale Size">
                                <a-select
                                  v-model:value="formState.bale_size"
                                  placeholder="Select Bale Size"
                                >
                                  <a-select-option value="40"
                                    >40</a-select-option
                                  >
                                  <a-select-option value="50"
                                    >50</a-select-option
                                  >
                                </a-select>
                              </a-form-item>
                              <a-form-item
                                name="no_of_bales"
                                label="Number of bales"
                              >
                                <a-input
                                  v-model:value="formState.number_of_bales"
                                  placeholder="Number of bales"
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item
                                name="no_of_pieces"
                                label="Number of Loose Pieces"
                              >
                                <a-input
                                  v-model:value="formState.no_of_pieces"
                                  placeholder="Enter number of pieces"
                                  type="number"
                                  @change="validateNoOfPieces"
                                />
                              </a-form-item>
                              <a-form-item
                                name="date_received"
                                label="Date Received"
                              >
                                <a-date-picker
                                  :style="{ width: '100%' }"
                                  v-model:value="formState.date_received"
                                  :format="dateFormat"
                                  :disabledDate="disabledDate"
                                />
                              </a-form-item>

                              <a-form-item name="comment" label="Comment">
                                <a-input
                                  v-model:value="formState.comment"
                                  placeholder="Comment"
                                />
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
                        </a-modal>
                        <!-- end of receive modal -->

                        <!-- reverse logistics modal -->
                        <PostReturnsToDropoffVue />
                        <!-- end of return logistics modal -->

                        <!-- Return nets modal -->
                        <a-modal
                          title="Return Nets"
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
                              <a-form-item
                                name="to_drop_off"
                                label="To Drop Off Point"
                              >
                                <a-select
                                  placeholder="Select Drop Off Point "
                                  v-model:value="
                                    returns_formState.to_drop_off_point_id
                                  "
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
                              <a-form-item
                                name="no_of_nets"
                                label="Number of nets"
                              >
                                <a-input
                                  v-model:value="
                                    returns_formState.number_of_nets
                                  "
                                  placeholder="Number of nets"
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item
                                name="date_returned"
                                label="Date Returned"
                              >
                                <a-date-picker
                                  :style="{ width: '100%' }"
                                  v-model:value="
                                    returns_formState.date_returned
                                  "
                                  :format="dateFormat"
                                />
                              </a-form-item>
                              <a-form-item
                                name="delivery_note_number"
                                label="S11 No"
                              >
                                <a-input
                                  :style="{ width: '100%' }"
                                  v-model:value="
                                    returns_formState.delivery_note_number
                                  "
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item
                                name="return_reason"
                                label="Reason For Return"
                              >
                                <a-textarea
                                  :style="{ width: '100%' }"
                                  v-model:value="
                                    returns_formState.return_reason
                                  "
                                  placeholder="Enter return reson here..."
                                  :auto-size="{ minRows: 2, maxRows: 5 }"
                                />
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
                        </a-modal>
                        <!-- end of return nets modal -->

                        <!-- Reverse logistic modal -->
                        <a-modal
                          title="Return Nets - Reverse Logistics"
                          :visible="reverseLogisticsModalOpen"
                          @cancel="handleCancelReverseLogistic"
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
                              @finish="handleReverseLogistics"
                            >
                              <a-form-item
                                name="to_drop_off"
                                label="Drop Off Point to Return"
                                v-if="is_variance == false"
                                :rules="[
                                  {
                                    required: false,
                                    message:
                                      'Please select the Drop off point to be returned to',
                                  },
                                ]"
                              >
                                <a-select
                                  placeholder="Select Drop Off Point to Return"
                                  v-model:value="
                                    returns_formState.to_drop_off_point_id
                                  "
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
                              <a-form-item
                                name="no_of_nets"
                                label="Total Number of nets to be Returned"
                                v-if="is_variance == false"
                                :rules="[
                                  {
                                    required: false,
                                    message:
                                      'Enter total number of nets to be returned',
                                  },
                                ]"
                              >
                                <a-input
                                  v-model:value="
                                    returns_formState.number_of_nets
                                  "
                                  placeholder="Total No of Nets to be Returned"
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item
                                name="date_returned"
                                label="Date Returned"
                                v-if="is_variance == false"
                                :rules="[
                                  {
                                    required: false,
                                    message:
                                      'Please select the date of returns',
                                  },
                                ]"
                              >
                                <a-date-picker
                                  :style="{ width: '100%' }"
                                  v-model:value="
                                    returns_formState.date_returned
                                  "
                                  :format="dateFormat"
                                  :disabledDate="disabledLogisticDate"
                                />
                              </a-form-item>
                              <!-- <a-checkbox v-model:checked="checked">Are there nets that were damaged</a-checkbox> -->
                              <a-form-item
                                name="damages_check"
                                label="Are any of the nets returned damaged?"
                                v-if="is_variance == false"
                                :rules="[
                                  {
                                    required: false,
                                    message:
                                      'Please confirm if there were any damaged nets',
                                  },
                                ]"
                              >
                                <!-- <a-radio-group v-model="damagesCheck"> -->
                                <a-radio v-model:checked="checked">Yes</a-radio>
                                <a-radio v-if="checked != true">No</a-radio>
                                <!-- </a-radio-group> -->
                              </a-form-item>

                              <a-form-item
                                v-if="checked == true && is_variance == false"
                                name="no_of_damages"
                                label="Number of Damaged Nets"
                                :rules="[
                                  {
                                    required: false,
                                    message:
                                      'Please enter the number of damaged nets.',
                                  },
                                ]"
                              >
                                <a-input
                                  v-model:value="
                                    returns_formState.number_of_damages
                                  "
                                  placeholder="Number of Damaged Nets"
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item
                                name="damage_details"
                                label="Reason For Damage"
                                v-if="checked == true && is_variance == false"
                              >
                                <a-textarea
                                  :style="{ width: '100%' }"
                                  v-model:value="
                                    returns_formState.damage_details
                                  "
                                  placeholder="Enter return reson here..."
                                  :auto-size="{ minRows: 2, maxRows: 5 }"
                                />
                              </a-form-item>
                              <a-form-item
                                name="delivery_note_number"
                                label="S11 No"
                                v-if="is_variance == false"
                                :rules="[
                                  {
                                    required: false,
                                    message:
                                      'Please enter the S11 Serial Number',
                                  },
                                ]"
                              >
                                <a-input
                                  :style="{ width: '100%' }"
                                  v-model:value="
                                    returns_formState.delivery_note_number
                                  "
                                  type="number"
                                />
                              </a-form-item>
                              <a-form-item
                                name="return_reason"
                                label="Reason For Return"
                                v-if="is_variance == false"
                                :rules="[
                                  {
                                    required: true,
                                    message: 'Please state reason for return',
                                  },
                                ]"
                              >
                                <a-textarea
                                  :style="{ width: '100%' }"
                                  v-model:value="
                                    returns_formState.return_reason
                                  "
                                  placeholder="Enter return reson here..."
                                  :auto-size="{ minRows: 2, maxRows: 5 }"
                                />
                              </a-form-item>

                              <!-- <a-typography-title v-if="is_variance"></a-typography-title> -->
                              <h2
                                style="
                                  color: red;
                                  font-family: Gowun Batang, serif;
                                  font-weight: 400;
                                  font-style: normal;
                                "
                                v-if="is_variance"
                              >
                                <u>{{ variance }}</u> Nets are not Accounted
                                for, please give reasons
                              </h2>

                              <br />
                              <br />
                              <a-form-item
                                name="variance_reasons"
                                label="State quantity & reasons below"
                                v-if="is_variance"
                              >
                                <div
                                  v-for="(
                                    item, index
                                  ) in returns_formState.variance_reasons"
                                  :key="index"
                                  style="margin-bottom: 8px"
                                >
                                  <a-tag closable @close="removeReason(index)">
                                    {{ item.qty }} - {{ item.reason }}
                                  </a-tag>
                                </div>

                                <div
                                  v-for="(input, index) in inputFields"
                                  :key="index"
                                  style="
                                    display: flex;
                                    align-items: center;
                                    margin-bottom: 8px;
                                  "
                                >
                                  <!-- Input for Quantity -->
                                  <a-input-number
                                    v-model:value="input.qty"
                                    placeholder="Enter quantity"
                                    style="width: 20%; margin-right: 8px"
                                  />

                                  <!-- Input for Reason -->
                                  <a-input
                                    v-model:value="input.reason"
                                    placeholder="Enter a reason"
                                    style="width: 80%; margin-right: 8px"
                                  />

                                  <a-button
                                    type="warning"
                                    size="extra-small"
                                    @click="removeInput(index)"
                                  >
                                    Remove
                                  </a-button>
                                </div>

                                <a-button
                                  type="success"
                                  size="small"
                                  @click="addInput"
                                >
                                  Add Another Reason
                                </a-button>
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
                        </a-modal>
                        <!-- end of reverse logistics modal -->

                        <!-- Transfer HH Modal -->

                        <a-modal
                          title="Transfer Households"
                          :visible="isTransferModalOpen"
                          @cancel="handleCancelTransfer"
                          width="30%"
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
                              <p>
                                Please note that all unserved households within
                                {{ post_name }} will be moved to the selected
                                post.
                              </p>
                              <a-form-item name="Post">
                                <a-select
                                  v-model:value="formState.transfer_post"
                                  show-search
                                  option-filter-prop="label"
                                  placeholder="Select one"
                                  @search="handlePostSearch"
                                >
                                  <a-select-option
                                    v-for="post in posts"
                                    :key="post.id"
                                    v-model:value="post.id"
                                    :label="`${post.name} ${post.post_code}`"
                                  >
                                    {{ post.name }} {{ post.post_code }} -
                                    {{ post.distribution_county }},
                                    {{ post.distribution_sub_county }}
                                  </a-select-option>
                                </a-select>
                              </a-form-item>
                              <div class="record-form-actions text-right">
                                <sdButton
                                  size="extra-small"
                                  htmlType="Save"
                                  type="success"
                                >
                                  {{ isLoading ? "Loading..." : "Submit" }}
                                </sdButton>
                              </div>
                            </a-form>
                          </BasicFormWrapper>
                        </a-modal>
                        <!-- End of Transfer hh modal -->

                        <!-- Update Receive Date Modal -->
                        <a-modal
                          title="Update Receive Date"
                          :visible="isUpdateModalOpen"
                          @cancel="handleCancelUpdate"
                          width="30%"
                          footer=""
                        >
                          <BasicFormWrapper>
                            <a-form
                              class="add-transfer-form"
                              :style="{ width: '100%' }"
                              layout="vertical"
                              name="addnew"
                              :model="update_formState"
                              @finish="handleUpdateReceiveDate"
                            >
                              <a-form-item
                                name="date_received"
                                label="Date Received"
                              >
                                <a-date-picker
                                  :style="{ width: '100%' }"
                                  v-model:value="update_formState.date_received"
                                  :format="dateFormat"
                                />
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
                        </a-modal>
                        <!-- End of Transfer modal -->

                        <!-- Discrepancy modal -->
                        <a-modal
                          title="Nets Quantity Discrepancy"
                          :visible="isDiscrepancyModal"
                          @cancel="handleCancelDiscrepancy"
                          width="40%"
                        >
                          <p>
                            Are you sure you want to receive Nets with
                            discrepancy?
                          </p>

                          <p>
                            You have a difference of
                            <strong> {{ discrepancy }} </strong> nets.
                          </p>

                          <a-form
                            class="add-record-form"
                            :style="{ width: '100%' }"
                            layout="vertical"
                            name="addactivity"
                            :model="formState"
                          >
                            <a-form-item
                              name="reason_for_descrepancy"
                              label="Reason"
                            >
                              <a-textarea
                                v-model:value="formState.reason_for_discrepancy"
                                placeholder="State reason for discrepancy..."
                                :rows="4"
                              />
                            </a-form-item>
                          </a-form>
                          <template #footer>
                            <a-button
                              key="cancel"
                              type="warning"
                              @click="handleCancelDiscrepancy"
                            >
                              Cancel
                            </a-button>
                            <a-button
                              key="confirm"
                              type="danger"
                              @click="confirmDiscrepancyCallback"
                            >
                              Confirm
                            </a-button>
                          </template>
                        </a-modal>
                        <!-- End of Discrepancy modal -->
                      </div>
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </BudgetPageWrapper>
    </Main>
  </RecordViewWrapper>
</template>

<script setup>
import { Main, BasicFormWrapper } from "../../styled";
import { RecordViewWrapper, BudgetPageWrapper } from "../budget/style";
import { onMounted, ref, reactive } from "vue";
import DropOffReturns from "./DropOffReturns.vue";
import BaleVerification from "./BaleVerification.vue";
import ViewWorker from "./ViewWorker.vue";
import PostDailyBalance from "./PostDailyBalance.vue";
import PostClosureReport from "./PostClosureReport.vue";
import PostDashboard from "./PostDashboard.vue";
import PostStockLog from "./PostStockLog.vue";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import axios from "@/Axiosconfig";

const dateFormat = "YYYY-MM-DD";
const primaryTabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "workers", label: "Post Workers" },
  { key: "receive", label: "Received Nets" },
  { key: "transfer", label: "Nets Transfer" },
  { key: "bale", label: "Bale Verification" },
  { key: "balances", label: "Daily Balances" },
  { key: "closure", label: "Closure Report" },
  { key: "log", label: "Log" },
];
const receiveSubTabs = [
  { key: "do_point", label: "Received from DropOff Point" },
  { key: "warehouse", label: "Received from Warehouse" },
];
const transferSubTabs = [
  { key: "transfer_ins", label: "Transfer In's" },
  { key: "transfer_outs", label: "Transfer Out's" },
  { key: "return", label: "Return to Drop Off" },
];
const transferscolumns = [
  {
    title: "From Post",
    dataIndex: "from_post_name",
    key: "id",
  },
  {
    title: "To Post",
    dataIndex: "to_post_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "number_of_nets",
    key: "id",
  },
  {
    title: "Date of Transfer",
    dataIndex: "date_issued",
    key: "id",
  },
  {
    title: "Issued By",
    dataIndex: "issued_by",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
    slots: { customRender: "status" },
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "id",
    slots: { customRender: "action" },
  },
];

const do_columns = [
  {
    title: "Drop Off Point",
    dataIndex: "drop_off_point_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "quantity_issued",
    key: "id",
  },
  {
    title: "Date of Issue",
    dataIndex: "issue_date",
    key: "id",
  },
  {
    title: "Issued By",
    dataIndex: "issued_by",
    key: "id",
  },
  {
    title: "Date Received",
    dataIndex: "date_received",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "id",
    slots: { customRender: "action" },
  },
];

const columns = [
  {
    title: "From Post",
    dataIndex: "from_post_name",
    key: "id",
  },
  {
    title: "To Post",
    dataIndex: "to_post_name",
    key: "id",
  },
  {
    title: "Number of Nets",
    dataIndex: "number_of_nets",
    key: "id",
  },
  {
    title: "Date of Transfer",
    dataIndex: "date_issued",
    key: "id",
  },
  {
    title: "Issued By",
    dataIndex: "issued_by",
    key: "id",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "id",
    slots: { customRender: "action" },
  },
];

const activeClass = ref("do_point");
const activeTransaction = ref("dashboard");
const transaction_type = ref("");
const postdata = ref([]);
const dropoffpoints = ref([]);
const fromWarehouse = ref([]);
const fromDropoffpoint = ref([]);
const transferIns = ref([]);
const transferOuts = ref([]);
const { query } = useRoute();
const isOpen = ref(false);
const isDiscrepancyModal = ref(false);
const post_id = query.id;
const isModalOpen = ref(false);
const isUpdateModalOpen = ref(false); // trans_formState
const returnsModalOpen = ref(false);
const reverseLogisticsModalOpen = ref(false);
const post_name = query.name;
const searchItem = ref("");
const isTransferModalOpen = ref(false);
const posts = ref([]);
const deliveries = ref(null);
const discrepancy = ref(null);
const distribution_id = ref(null);
const post_balance = ref(null);
const is_variance = ref(false);
const is_pmi_county = query.funding ? false : true;
console.log(query.funding);
console.log(is_pmi_county);

const formState = reactive({
  date_received: "",
  distribution_id: "",
});
const trans_formState = reactive({
  from_post_id: Number(query.id),
  to_post_id: "",
  number_of_nets: "",
  comment: "",
  date_received: "",
  transfer_id: "",
});

const returns_formState = reactive({
  from_post_id: Number(query.id),
  to_drop_off_point_id: "",
  number_of_nets: "",
  date_returned: "",
  return_reason: "",
  variance_reasons: [],
  additional_notes: "",
  damage_details: "",
});

const update_formState = reactive({
  date_received: "",
});

const checked = ref(false);
// const damagesCheck = ref(null);
const variance = ref(null);

onMounted(() => {
  fetchPosts();
  // receiveFromWarehouse();
  fetchDropoff();
  receiveFromDropOff();
  fetchTransferIns();
  fetchTransferOuts();
  // fetchReturnedNets();
});
const handleChange = (tab) => (activeClass.value = tab);
const openmodal = () => (isModalOpen.value = true);
const openReturnsModal = () => (returnsModalOpen.value = true);
const openreverseLogisticsModal = () => (
  (reverseLogisticsModalOpen.value = true), fetchDistributionsPostsSummary()
);
const handleCancelReverseLogistic = () =>
  (reverseLogisticsModalOpen.value = false);
const handleCancel = () => (isModalOpen.value = false);
const handleCancelDiscrepancy = () => (isDiscrepancyModal.value = false);
const handleCancelUpdate = () => (isUpdateModalOpen.value = false);
const handleCancelReceive = () => (isOpen.value = false);
const handleReturnsCancel = () => (returnsModalOpen.value = false);

const handleTransactions = (tab) => {
  activeTransaction.value = tab;
  tab === "receive"
    ? handleChange("do_point")
    : tab === "transfer"
    ? handleChange("transfer_ins")
    : null;
};

const disabledDate = (current) => {
  // Can not select days before two weeks ago and today
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  return current && (current > new Date() || current < twoWeeksAgo);
};

const openReceiveModal = (type, id) => {
  type === "receive"
    ? ((formState.distribution_id = id), (transaction_type.value = "receive"))
    : ((trans_formState.transfer_id = id),
      (transaction_type.value = "transfers"));
  isOpen.value = true;
};

const openUpdateReceiveModal = (id) => {
  console.log(id);
  distribution_id.value = id;
  isUpdateModalOpen.value = true;
};

const handlePostSearch = (value) => {
  console.log(value);
  searchItem.value = value;
  fetchTransferPosts();
};

const fetchPosts = async () => {
  try {
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/posts_data?query=${searchItem.value}`,
      {
        method: "GET",
        headers: authHeader(),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        postdata.value = data.data.map((post) => ({
          ...post,
          label: `${post.name} ${post.post_code} - ${post.distribution_county},${post.distribution_sub_county}`,
        }));
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const fetchTransferPosts = async () => {
  try {
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/posts_data?query=${searchItem.value}`,
      {
        method: "GET",
        headers: authHeader(),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        posts.value = data.data.map((post) => ({
          ...post,
          label: `${post.name} ${post.post_code}`,
        }));
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

fetchTransferPosts();

const handleSubmit = async () => {
  try {
    fetch(
      `${process.env.VUE_APP_BASE_URL}/move_households_to_post/${query.id}/${formState.transfer_post}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    )
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `${data}`,
          });
        } else {
          notification.error({
            message: "Error",
            description: `${data}`,
          });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const fetchDropoff = async () => {
  try {
    await fetch(`${process.env.VUE_APP_BASE_URL}/get_all_drop_off_points`, {
      method: "GET",
      headers: authHeader(),
    })
      .then((response) => response.json())
      .then((data) => {
        dropoffpoints.value = data.data;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const handleTransfer = () => {
  console.log("handleTransfers");
  const data = {
    from_post_id: trans_formState.from_post_id,
    to_post_id: trans_formState.to_post_id,
    number_of_nets: trans_formState.number_of_nets,
    delivery_note_number: trans_formState.delivery_note_number,
    comment: trans_formState.comment,
  };
  console.log(JSON.stringify(data));
  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/transfer-nets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `${message}`,
          });
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        isModalOpen.value = false;
        trans_formState.to_post_id = "";
        trans_formState.number_of_nets = "";
        trans_formState.comment = "";
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const handleUpdateReceiveDate = () => {
  const data = {
    date_received: new Date(update_formState.date_received)
      .toISOString()
      .split("T")[0],
    id: distribution_id.value,
  };

  console.log(JSON.stringify(data));
  console.log(data);
  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/update_net_delivery`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `${message}`,
          });
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        isModalOpen.value = false;
        trans_formState.to_post_id = "";
        trans_formState.number_of_nets = "";
        trans_formState.comment = "";
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const handleReturns = () => {
  const data = {
    from_post_id: returns_formState.from_post_id,
    to_drop_off_point_id: returns_formState.to_drop_off_point_id,
    number_of_nets: returns_formState.number_of_nets,
    date_returned: dayjs(returns_formState.date_returned).format("YYYY-MM-DD"),
    delivery_note_number: returns_formState.delivery_note_number,
    return_reason: returns_formState.return_reason,
  };
  try {
    fetch(`${process.env.VUE_APP_BASE_URL}/return_nets_to_drop_off_point`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `Successfully returned nets to drop off point`,
          });
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
        returnsModalOpen.value = false;

        returns_formState.to_drop_off_point_id = "";
        returns_formState.number_of_nets = "";
        returns_formState.date_returned = "";
        returns_formState.return_reason = "";
        // window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const fetchDistributionsPostsSummary = async () => {
  try {
    const response = await axios.get(
      `nets_received_distributed_hh_post?post_id=${post_id}`
    );
    const data = await response.data;
    console.log(data);
    post_balance.value = data.undistributed_nets_balance;
    console.log(post_balance);
  } catch (error) {
    console.error(error);
  }
};

const inputFields = ref([{ qty: null, reason: "" }]);

const addInput = () => {
  // Add a new input field
  inputFields.value.push({ qty: null, reason: "" });
  console.log(inputFields.value);
};

const removeInput = (index) => {
  // Remove the input field at the specified index
  inputFields.value.splice(index, 1);
};

const removeReason = (index) => {
  // Remove the reason tag at the specified index
  returns_formState.value.variance_reasons.splice(index, 1);
};

const disabledLogisticDate = (current) => {
  // Can not select days before two weeks ago and today
  return current && current > new Date();
};

const handleReverseLogistics = () => {
  const variance_reason = Object.entries({ ...inputFields.value }).map(
    ([key, value]) => ({
      id: key,
      ...value,
    })
  );
  const data = {
    from_post_id: returns_formState.from_post_id,
    to_drop_off_point_id: returns_formState.to_drop_off_point_id,
    number_of_nets: returns_formState.number_of_nets,
    date_returned: dayjs(returns_formState.date_returned).format("YYYY-MM-DD"),
    total_nets_damaged: returns_formState.number_of_damages,
    has_damaged: returns_formState.number_of_damages ? true : false,
    damage_details: returns_formState.damage_details,
    return_reason: returns_formState.return_reason,
    delivery_note_number: returns_formState.delivery_note_number,
    variance_reasons: variance_reason,
  };

  console.log(JSON.stringify(data));
  console.log(post_balance.value);

  variance.value = post_balance.value - data.number_of_nets;

  if (variance.value == 0) {
    try {
      fetch(`${process.env.VUE_APP_BASE_URL}/distribution_post_reverse_flow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(({ success, message }) => {
          if (success) {
            notification.success({
              message: "Success",
              description: `Successfully returned nets to drop off point`,
            });
          } else {
            notification.error({
              message: "Error",
              description: `${message}`,
            });
          }
          returnsModalOpen.value = false;

          // window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          notification.error({
            message: "Error",
            description: `${error}`,
          });
        });
    } catch (error) {
      notification.error({
        message: "Error",
        description: `${error}`,
      });
    }
  } else {
    is_variance.value = true;

    if (
      is_variance.value &&
      data.variance_reasons[0].qty !== null &&
      data.variance_reasons[0].reason !== null
    ) {
      // Assuming data.variance_reasons is the array of objects
      let totalReasonQty = data.variance_reasons.reduce((sum, item) => {
        return sum + item.qty;
      }, 0);

      console.log(totalReasonQty); // This will output the sum of the qty values
      console.log(variance.value);

      let remaining_nets = variance.value - totalReasonQty;

      if (totalReasonQty === variance.value) {
        try {
          fetch(
            `${process.env.VUE_APP_BASE_URL}/distribution_post_reverse_flow`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeader(),
              },
              body: JSON.stringify(data),
            }
          )
            .then((response) => response.json())
            .then(({ success, message }) => {
              if (success) {
                notification.success({
                  message: "Success",
                  description: `Successfully returned nets to drop off point`,
                });
              } else {
                notification.error({
                  message: "Error",
                  description: `${message}`,
                });
              }
              returnsModalOpen.value = false;
              window.location.reload();
            })
            .catch((error) => {
              console.log(error);
              notification.error({
                message: "Error",
                description: `${error}`,
              });
            });
        } catch (error) {
          notification.error({
            message: "Error",
            description: `${error}`,
          });
        }
      }
      if (remaining_nets > 0) {
        notification.warning({
          message: "Warning",
          description: `You need to account for ${remaining_nets} more nets`,
        });
      } else if (remaining_nets < 0) {
        notification.warning({
          message: "Warning",
          description: `You have ${Math.abs(
            remaining_nets
          )} extra nets that need to be accounted for`,
        });
      }
    } else {
      notification.warning({
        message: "Warning",
        description: `State Reason for variance to account for the discrepancies in the return to dropoff`,
      });
    }
  }
};

const submitData = async (payload, url) => {
  try {
    console.log(JSON.stringify(payload));
    console.log(JSON.stringify(url));
    const response = await fetch(`${process.env.VUE_APP_BASE_URL}/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });
    const { success, data, message } = await response.json();
    console.log({ success, data, message });
    if (success) {
      notification.success({
        message: "Success",
        description: data,
      });
      window.location.reload();
    } else {
      notification.error({
        message: "Error",
        description: data,
      });
    }
    isModalOpen.value = false;
    //  window.location.reload();
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
    isModalOpen.value = false;
  }
};

const receiveNets = async () => {
  const data = {
    transfer_id: trans_formState.transfer_id,
    date_received: dayjs(formState.date_received).format("YYYY-MM-DD"),
    status: 1,
  };

  const quantity_received =
    Number(formState.number_of_bales) * Number(formState.bale_size) +
    Number(formState.no_of_pieces);

  const rec_data = {
    date_received: dayjs(formState.date_received).format("YYYY-MM-DD"),
    bale_size: formState.bale_size,
    no_of_bales: formState.number_of_bales,
    loose_pieces: formState.no_of_pieces,
    quantity_received: quantity_received,
    receptor_comment: formState.comment,
  };

  const payload =
    transaction_type.value === "transfers"
      ? data
      : transaction_type.value === "receive"
      ? rec_data
      : null;

  const url =
    transaction_type.value === "transfers"
      ? "receive_nets_from_post"
      : transaction_type.value === "receive"
      ? `receive_nets_from_dropoff_point/${formState.distribution_id}/${post_id}`
      : null;
  console.log(url);
  if (url == "receive_nets_from_post") {
    console.log(data);
    try {
      await fetch(`${process.env.VUE_APP_BASE_URL}/receive_nets_from_post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(({ success, message }) => {
          if (success) {
            notification.success({
              message: "Success",
              description: `${message}`,
            });
            window.location.reload();
          } else {
            notification.error({
              message: "Error",
              description: `${message}`,
            });
          }
        });
    } catch (error) {
      notification.error({
        message: "Error",
        description: `${error}`,
      });
    }
  }

  const delivery = deliveries.value.find(
    (d) => d.distribution_id == formState.distribution_id
  );

  if (delivery) {
    if (delivery.quantity_issued !== quantity_received) {
      var difference = quantity_received - delivery.quantity_issued;
      console.log(difference);
      discrepancy.value = difference;
      isOpen.value = false;
      isDiscrepancyModal.value = true;

      // Pass the payload and url to handleConfirmDiscrepancy
      confirmDiscrepancyCallback = () => handleConfirmDiscrepancy(payload, url);
    } else {
      await submitData(payload, url);
    }
  }
};

let confirmDiscrepancyCallback = () => {};

const handleConfirmDiscrepancy = async (payload, url) => {
  isDiscrepancyModal.value = false;
  await submitData(payload, url);
};

const receiveFromDropOff = async () => {
  try {
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/post_supplies_list/${post_id}/1`,
      {
        method: "GET",
        headers: authHeader(),
      }
    )
      .then((response) => response.json())
      .then(({ success, data }) => {
        console.log(data);
        deliveries.value = data;
        if (success) {
          data.length > 0
            ? (fromDropoffpoint.value = data)
            : (fromDropoffpoint.value = []);
        } else {
          notification.error({
            message: "Error",
            description: `${data.message}`,
          });
        }
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const fetchTransferOuts = async () => {
  try {
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/post_nets_transfer_list/${query.id}/1`,
      {
        method: "GET",
        headers: authHeader(),
      }
    )
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          transferOuts.value = data;
        } else {
          notification.error({
            message: "Error",
            description: `${data.message}`,
          });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const fetchTransferIns = async () => {
  try {
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/post_nets_transfer_list/${query.id}/2`,
      {
        method: "GET",
        headers: authHeader(),
      }
    )
      .then((response) => response.json())
      .then(({ success, data }) => {
        if (success) {
          transferIns.value = data;
        } else {
          notification.error({
            message: "Error",
            description: `${data.message}`,
          });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: `${error}`,
        });
        isModalOpen.value = false;
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const cancelTransfer = async (id) => {
  try {
    await fetch(
      `${process.env.VUE_APP_BASE_URL}/cancel_post_net_transfer/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: null,
      }
    )
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (success) {
          notification.success({
            message: "Success",
            description: `${message}`,
          });
          window.location.reload();
        } else {
          notification.error({
            message: "Error",
            description: `${message}`,
          });
        }
      });
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  }
};

const openTransferModal = () => {
  isTransferModalOpen.value = true;
};

const handleCancelTransfer = () => {
  isTransferModalOpen.value = false;
};
</script>
<style scoped>
.rns-page {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;

  .panel {
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px rgba(28, 122, 72, 0.06);
  }

  /* primary tab pills in heading */
  .ph-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .nav-item {
    padding: 7px 14px;
    border-radius: 18px;
    border: 1px solid #d9f0e2;
    background: #ffffff;
    color: #2f6746;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .nav-item:hover {
    border-color: #9ad8b4;
    background: #f3fcf6;
  }
  .nav-item.active {
    background: #daf4e4;
    border-color: #9ad8b4;
    color: #15693c;
  }

  /* secondary sub-nav */
  .sub-nav-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }
  .sub-nav {
    display: flex;
    align-items: center;
    flex: 1 1 auto;
    min-width: 0;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 8px;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }
  .sub-nav > .pill {
    flex: 0 0 auto;
  }
  .pill {
    padding: 6px 14px;
    border-radius: 16px;
    border: 1px solid #e1efe6;
    background: #fff;
    color: #4d7a63;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .pill:hover {
    border-color: #9ad8b4;
    background: #f6fbf8;
  }
  .pill.active {
    background: linear-gradient(90deg, #20c997 0%, #36ddb3 100%);
    border-color: #20c997;
    color: #fff;
  }
  .sub-hint {
    font-size: 12px;
    color: #4d7a63;
    font-weight: 500;
  }
  .sub-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .embed-section {
    margin-bottom: 14px;
  }

  /* keep embedded child pages from adding excessive outer padding */
  .embed-section :deep(.ant-page-header) {
    padding-left: 0;
    padding-right: 0;
  }

  /* tables must never push the page wider than the viewport */
  :deep(.table-responsive),
  :deep(.table-data-view) {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* ───────── Improved desktop / tablet table design ───────── */
  .rns-table {
    :deep(.ant-table) {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e6f2eb;
      box-shadow: 0 4px 14px rgba(28, 122, 72, 0.06);
    }
    :deep(.ant-table-thead > tr > th) {
      background: #f4fbf6;
      color: #2f6746;
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 1px solid #e1efe6;
      padding: 12px 16px;
    }
    :deep(.ant-table-thead > tr > th::before) {
      display: none;
    }
    :deep(.ant-table-tbody > tr > td) {
      border-bottom: 1px solid #f1f7f3;
      padding: 12px 16px;
      color: #3a463f;
      font-size: 13px;
    }
    :deep(.ant-table-tbody > tr:nth-child(even) > td) {
      background: #fbfdfb;
    }
    :deep(.ant-table-tbody > tr:hover > td) {
      background: #f3fbf6;
    }
    :deep(.ant-table-tbody > tr:last-child > td) {
      border-bottom: none;
    }
    .table-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
  }

  /* ───────── Mobile card list (hidden by default) ───────── */
  .rns-cards {
    display: none;
    flex-direction: column;
    gap: 12px;
  }
  .rns-card {
    background: #fff;
    border: 1px solid #e1efe6;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
  }
  .rns-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }
  .rns-card-title {
    font-size: 14px;
    font-weight: 700;
    color: #15693c;
    line-height: 1.3;
    small {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #5a7a68;
      margin-top: 2px;
    }
  }
  .rns-chip {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 700;
    color: #2f6746;
    background: #daf4e4;
    border: 1px solid #9ad8b4;
    border-radius: 12px;
    padding: 2px 10px;
    white-space: nowrap;
  }
  .rns-card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 12px;
    margin-bottom: 14px;
    > div {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .lbl {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #7a8a82;
      font-weight: 600;
    }
    .val {
      font-size: 13px;
      font-weight: 600;
      color: #2f3a35;
      word-break: break-word;
    }
  }
  .rns-card-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    :deep(.ant-btn) {
      width: 100%;
      justify-content: center;
    }
  }
  .rns-empty {
    text-align: center;
    padding: 36px 0;
    color: #7a8a82;
    font-size: 13px;
  }

  @media (max-width: 767px) {
    .ph-actions {
      width: 100%;
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 4px;
      -webkit-overflow-scrolling: touch;
    }
    .sub-nav-panel {
      flex-direction: column;
      align-items: stretch;
    }
    .sub-nav {
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 4px;
      -webkit-overflow-scrolling: touch;
    }
    .sub-actions {
      width: 100%;
    }
    .sub-actions :deep(.ant-btn) {
      width: 100%;
      justify-content: center;
    }

    /* Swap tables for cards */
    .rns-table {
      display: none !important;
    }
    .rns-cards {
      display: flex;
    }

    /* Neutralise Ant row gutter negative margins that overflow the viewport */
    :deep(.ant-row) {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    :deep(.ant-col) {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    /* Trim nested card padding so content fits small screens */
    :deep(.ant-card-body) {
      padding: 12px !important;
    }
  }
}

.badge-green {
  background-color: #1ec997;
  color: white;
  display: inline-block;
  padding: 3px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
}
.badge-warning {
  background-color: #f7b924;
  color: white;
  display: inline-block;
  padding: 3px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
}
.badge-red {
  background-color: #f0506e;
  color: white;
  display: inline-block;
  padding: 3px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
}
.title-success {
  color: green;
}
</style>
<style scoped>
.icon-color-white {
  color: white;
}
</style>
<style>
.full-modal {
  .ant-modal {
    max-width: 50%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(70vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
