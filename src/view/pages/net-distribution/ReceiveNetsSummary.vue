<template>
  <div>
    <sdPageHeader ghost :title="`Nets Summary at ${post_name}`" />
    <Main>
      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="search-filter-menu">
              <ul>
                <li>
                  <a
                    :class="
                      activeTransaction === 'receive' ? 'active' : 'deactivate'
                    "
                    @click="handleTransactions('receive')"
                    href="#"
                  >
                    Received Nets
                  </a>
                </li>
                <li>
                  <a
                    :class="
                      activeTransaction === 'transfer' ? 'active' : 'deactivate'
                    "
                    @click="handleTransactions('transfer')"
                    href="#"
                  >
                    Nets Transfer
                  </a>
                </li>
                <li>
                  <a
                    :class="
                      activeTransaction === 'return' ? 'active' : 'deactivate'
                    "
                    @click="handleTransactions('return')"
                    href="#"
                  >
                    Return Nets to Drop Off Point
                  </a>
                </li>
                <li>
                  <sdButton
                    class="btn-import"
                    type="warning"
                    @click="openTransferModal()"
                    size="extra-small"
                  >
                    Transfer Households
                  </sdButton>
                </li>
              </ul>
            </div>
            <div class="search-filter-menu">
              <ul>
                <li>
                  <a
                    :class="
                      activeClass === 'do_point' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('do_point')"
                    :hidden="activeTransaction !== 'receive'"
                  >
                    Received from DropOff Point
                  </a>
                </li>
                <li>
                  <a
                    :class="
                      activeClass === 'warehouse' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('warehouse')"
                    :hidden="activeTransaction !== 'receive'"
                  >
                    Received from Warehouse
                  </a>
                </li>
                <li>
                  <a
                    :class="
                      activeClass === 'do_post_summary'
                        ? 'active'
                        : 'deactivate'
                    "
                    @click="handleChange('do_post_summary')"
                    :hidden="activeTransaction !== 'receive'"
                  >
                    Post Summary
                  </a>
                </li>
                <li>
                  <a
                    :class="
                      activeClass === 'do_post_worker_summary'
                        ? 'active'
                        : 'deactivate'
                    "
                    @click="handleChange('do_post_worker_summary')"
                    :hidden="activeTransaction !== 'receive'"
                  >
                    Post Worker Summary
                  </a>
                </li>
              </ul>
              <ul>
                <li>
                  <a
                    :class="
                      activeClass === 'transfer_ins' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('transfer_ins')"
                    :hidden="activeTransaction !== 'transfer'"
                  >
                    Transfer In's
                  </a>
                </li>
                <li>
                  <a
                    :class="
                      activeClass === 'transfer_outs' ? 'active' : 'deactivate'
                    "
                    @click="handleChange('transfer_outs')"
                    :hidden="activeTransaction !== 'transfer'"
                  >
                    Transfer Out's
                  </a>
                </li>
                <li>
                  <sdButton
                    size="extra-small"
                    type="warning"
                    @click="openmodal"
                    :hidden="activeTransaction !== 'transfer'"
                  >
                    <sdFeatherIcons type="plus" size="14" /> &nbsp; New Transfer
                  </sdButton>
                </li>
              </ul>
              <ul>
                <li v-if="is_pmi_county===true">
                  <a
                    :class="activeClass === 'return' ? 'active' : 'deactivate'"
                    @click="openReturnsModal()"
                    :hidden="activeTransaction !== 'return'"
                    type="warning"
                  >
                    Return to Dropoff Point
                  </a>
                </li>
                <li v-if="is_pmi_county===false">
                  <a
                    :class="activeClass === 'return' ? 'active' : 'deactivate'"
                    @click="openreverseLogisticsModal()"
                    :hidden="activeTransaction !== 'return'"
                    type="warning"
                  >
                    Return to Dropoff Point
                  </a>
                </li>
              </ul>
            </div>
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

                      <div v-else>
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'do_point'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="fromDropoffpoint"
                            :columns="do_columns"
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
                        &nbsp;&nbsp;

                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'warehouse'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="fromWarehouse"
                            :columns="columns"
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

                        <!-- Net TransfersIn table -->
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'transfer_ins'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 50,
                              showSizeChanger: true,
                            }"
                            :dataSource="transferIns"
                            :columns="transferscolumns"
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
                        <!-- end of Net Transfers table -->

                        <!-- Net TransfersOut table -->
                        <TableWrapper
                          class="table-data-view table-responsive"
                          v-show="activeClass === 'transfer_outs'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 40,
                              showSizeChanger: true,
                            }"
                            :dataSource="transferOuts"
                            :columns="transferscolumns"
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
                        <!-- end of Net TransfersOut table -->

                        <!-- Dropoff Returns -->
                        <DropOffReturns
                          :post_id="query.id"
                          v-if="activeClass === 'return'"
                        />

                        <!-- End of Dropoff Returns -->

                        <!--Distribution Post Summary-->
                        <DistributionPostWorkerSummary
                          :post_id="query.id"
                          v-if="activeClass === 'do_post_worker_summary'"
                        />
                        <!-- end of returns table -->

                        <!--Distribution Post Summary-->
                        <DistributionPostSummary
                          :post_id="query.id"
                          v-if="activeClass === 'do_post_summary'"
                        />
                        <!--End Distribution Post Summary-->
                        <!--Distribution Post Summary-->
                        <DistributionPostWorkerSummary
                          :post_id="query.id"
                          v-if="activeClass === 'do_post_worker_summary'"
                        />
                        <!--End Distribution Post Summary-->

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
      </SearchResultWrapper>
    </Main>
  </div>
</template>

<script setup>
import { Main, BasicFormWrapper } from "../../styled";
import { SearchResultWrapper } from "./../style";
import { onMounted, ref, reactive } from "vue";
import DistributionPostSummary from "@/view/pages/net-distribution/DistributionPostSummary";
import DistributionPostWorkerSummary from "./DistributionPostWorkerSummary.vue";
import DropOffReturns from "./DropOffReturns.vue";
import authHeader from "../../../services/auth-header";
import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import axios from "@/Axiosconfig";

const dateFormat = "YYYY-MM-DD";
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
const activeTransaction = ref("receive");
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
    : tab === "return"
    ? handleChange("return") //openReturnsModal()
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

  variance.value = data.number_of_nets - post_balance.value;

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
  } else {
    is_variance.value = true;

    if (
      is_variance.value &&
      data.variance_reasons[0].qty !== null &&
      data.variance_reasons[0].reason !== null
    ) {
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
.badge-green {
  background-color: #1ec997;
  color: white;
  /* padding: 2px;
      border-radius: 3px; */
  /* size */
  font-size: 12px;
}
.badge-warning {
  background-color: #f7b924;
  color: white;
  /* padding: 2px;
      border-radius: 3px; */
  /* size */
  font-size: 12px;
}
.badge-red {
  background-color: #f0506e;
  color: white;
  /* padding: 2px;
      border-radius: 3px; */
  /* size */
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
