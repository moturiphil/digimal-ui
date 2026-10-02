<template>
  <div class="event-detail-page">
    <Main>
      <header class="ev-detail-header">
        <div class="ev-detail-heading">
          <div class="ev-detail-back">
            <sdButton size="small" class="pill-btn" @click="goBack">
              <sdFeatherIcons type="arrow-left" size="13" /> Back
            </sdButton>
          </div>
          <h2 class="ev-detail-title">{{ event_name }}</h2>
          <div class="ev-detail-chips">
            <span class="ev-chip ev-chip-code">{{ event_code }}</span>
            <span class="ev-status-badge" :class="statusBadgeClass">
              <span class="dot"></span> {{ eventStatusLabel }}
            </span>
            <span class="ev-status-badge payroll" :class="payrollBadgeClass">
              <sdFeatherIcons type="dollar-sign" size="12" /> {{ payrollLabel }}
            </span>
            <span
              v-if="lsoMissing"
              class="ev-status-badge is-idle"
              title="An LSO/LPO is required for payroll submission"
            >
              <sdFeatherIcons type="alert-circle" size="12" /> LSO/LPO Missing
            </span>
          </div>
        </div>
      </header>

      <!--
        LSO/LPO notice: shown ONLY to the event host when the event has no
        LSO/LPO attached. Payroll submission is blocked in that state; the
        host must upload / link the LSO/LPO for the event vendor first.
      -->
      <a-alert
        v-if="isEventHost && lsoMissing && isPayrollPending"
        type="warning"
        show-icon
        class="ev-lso-alert"
      >
        <template #message>LSO/LPO required for payroll submission</template>
        <template #description>
          <p class="ev-lso-desc">
            This event does not yet have an LSO/LPO attached. Please upload
            the LSO/LPO for this event's vendor. Payroll submission remains
            disabled until the LSO/LPO is linked.
          </p>
          <div class="ev-lso-actions">
            <sdButton
              type="warning"
              size="extra-small"
              @click="openLsoUploadModal"
            >
              <sdFeatherIcons type="upload-cloud" size="13" />&nbsp; Upload / Link LSO/LPO
            </sdButton>
          </div>
        </template>
      </a-alert>

      <div class="ev-detail-toolbar">
        <!-- Event lifecycle actions -->
        <div class="ev-toolbar-section">
          <span class="ev-toolbar-label">
            <sdFeatherIcons type="zap" size="13" /> Workflow
          </span>
          <div class="ev-toolbar-group">
          <sdButton
            class="btn-import"
            type="light"
            outlined
            size="extra-small"
            @click="openTrainersModal"
          >
            <sdFeatherIcons type="users" size="14" /> &nbsp; View Trainers
          </sdButton>
          <sdButton
            v-if="canRegisterParticipants"
            class="btn-import"
            type="light"
            outlined
            size="extra-small"
            @click="openRegisterModal"
          >
            <sdFeatherIcons type="user-plus" size="14" /> &nbsp; Register Participant
          </sdButton>
          <sdButton
            v-if="submitPayrollVisible"
            class="btn-import"
            type="primary"
            size="extra-small"
            :disabled="!canSubmitEvent"
            @click="openSubmitModal"
          >
            <sdFeatherIcons type="send" size="14" /> &nbsp; Submit for Payroll
          </sdButton>
          <span
            v-if="
              (!submitPayrollVisible || !canSubmitEvent) && isPayrollPending
            "
            class="ev-workflow-hint"
          >
            <template v-if="lsoMissing">
              An LSO/LPO must be attached to this event before it can be
              submitted for payroll.
            </template>
            <template v-else>
              Start and close the event each day on the list page. Submit for
              payroll unlocks after the final day's closure.
            </template>
          </span>
          </div>
        </div>

        <!-- Management actions -->
        <div class="ev-toolbar-section">
          <span class="ev-toolbar-label">
            <sdFeatherIcons type="settings" size="13" /> Manage
          </span>
          <div class="ev-toolbar-group">
          <sdButton
            v-if="
              isApprovedGenerator &&
              event_payroll_status !== 'Generated' &&
              event_payroll_status !== 'Paid'
            "
            class="btn-import"
            type="success"
            size="extra-small"
            @click="generatePayroll"
            :disabled="isGenerating || !canGeneratePayroll"
          >
            {{
              isLoading
                ? "Loading..."
                : isGenerating
                ? "Processing ..."
                : "Generate Payroll"
            }}
          </sdButton>
          <span
            v-if="
              isApprovedGenerator &&
              !canGeneratePayroll &&
              event_payroll_status !== 'Generated' &&
              event_payroll_status !== 'Paid'
            "
            class="ev-workflow-hint"
          >
            Payroll generation unlocks once the event host submits the closed
            event for payroll.
          </span>
          <sdButton
            v-if="
              isApprovedGenerator &&
              (event_payroll_status == 'Generated' ||
                event_payroll_status == 'Paid')
            "
            class="btn-import"
            type="warning"
            size="extra-small"
            @click="reGeneratePayroll"
            :disabled="isGenerating"
          >
            {{
              isLoading
                ? "Loading..."
                : isGenerating
                ? "Processing ..."
                : "Re-Generate Payroll"
            }}
          </sdButton>
          <sdButton
            class="btn-import"
            type="success"
            @click="exportParticipants"
            size="extra-small"
          >
            {{
              isLoading
                ? "Downloading..."
                : isDownloading
                ? "Processing..."
                : "Download List"
            }}
            &nbsp;
            <sdFeatherIcons type="download-cloud" size="extra-small" />
          </sdButton>
          <sdButton
            class="btn-import"
            type="warning"
            @click="openCadreModal()"
            size="extra-small"
          >
            Participation Summary &nbsp;
            <sdFeatherIcons type="users" size="extra-small" />
          </sdButton>
          <sdButton
            v-if="event_list_id == 29"
            class="btn-import"
            type="warning"
            size="extra-small"
          >
            <router-link
              :to="{
                path: `/event/post-security-summary`,
                query: { event_location_id: event_location_id },
              }"
            >
              Post Security Summary
            </router-link>
          </sdButton>
          <sdButton
            class="btn-import"
            type="warning"
            @click="openMatrixModal()"
            size="extra-small"
          >
            Event Matrix &nbsp;
            <sdFeatherIcons type="award" size="extra-small" />
          </sdButton>
          <sdButton
            v-if="!isNationalEvent"
            class="btn-import"
            type="success"
            @click="openBudgetLinkModal"
            size="extra-small"
          >
            <sdFeatherIcons type="link" size="13" />
            &nbsp;
            {{
              !liveEvent.budget_category_id
                ? "Link Budget"
                : canRelinkBudget
                  ? "Re-link Budget"
                  : "View Budget Link"
            }}
          </sdButton>
          <sdButton
            v-if="canViewBudgetParams && !isNationalEvent"
            class="btn-import"
            type="success"
            @click="openBudgetParamsModal"
            size="extra-small"
          >
            <sdFeatherIcons type="bar-chart" size="13" />
            &nbsp; View Budget Parameters
          </sdButton>
          <sdButton
            class="btn-import"
            type="warning"
            @click="openModal()"
            size="extra-small"
          >
            Archive Event &nbsp;
            <sdFeatherIcons type="archive" size="extra-small" />
          </sdButton>
          </div>
        </div>
      </div>

      <SearchResultWrapper>
        <a-row :gutter="25">
          <a-col :xs="24">
            <div class="ev-participant-bar">
              <a-tabs
                v-model:activeKey="activeClass"
                class="ev-participant-tabs"
              >
                <a-tab-pane key="all">
                  <template #tab>
                    <span class="ev-tab-label">
                      <sdFeatherIcons type="users" size="14" /> All Participants
                      <span class="ev-tab-count">{{ recordCount }}</span>
                    </span>
                  </template>
                </a-tab-pane>
                <a-tab-pane key="confirmed">
                  <template #tab>
                    <span class="ev-tab-label">
                      <sdFeatherIcons type="check-circle" size="14" /> Confirmed
                      <span class="ev-tab-count confirmed">{{
                        confirmedCount
                      }}</span>
                    </span>
                  </template>
                </a-tab-pane>
                <a-tab-pane key="pending">
                  <template #tab>
                    <span class="ev-tab-label">
                      <sdFeatherIcons type="clock" size="14" /> Pending
                      <span class="ev-tab-count pending">{{
                        pendingCount
                      }}</span>
                    </span>
                  </template>
                </a-tab-pane>
              </a-tabs>
              <div
                class="ev-view-toggle"
                role="group"
                aria-label="Toggle participants view"
              >
                <button
                  type="button"
                  class="ev-toggle-btn"
                  :class="{ active: viewMode === 'cards' }"
                  @click="viewMode = 'cards'"
                >
                  <sdFeatherIcons type="grid" size="14" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  class="ev-toggle-btn"
                  :class="{ active: viewMode === 'table' }"
                  @click="viewMode = 'table'"
                >
                  <sdFeatherIcons type="list" size="14" />
                  <span>Table</span>
                </button>
              </div>
              <div class="ev-table-search">
                <span class="search-icon">
                  <sdFeatherIcons type="search" size="14" />
                </span>
                <a-input
                  v-model:value="searchItem"
                  type="text"
                  name="dataSource"
                  placeholder="Search participant by name, phone, role…"
                  allow-clear
                />
              </div>
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
                        <!-- Table view (desktop / user selected) -->
                        <div v-if="viewMode === 'table'">
                        <TableWrapper
                          class="table-data-view table-responsive ev-table-shell"
                          v-show="activeClass === 'all'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                            <template #participants="{ record }">
                              <td>
                                <div class="table-actions">
                                  <sdButton
                                    size="extra-small"
                                    type="success"
                                    :disabled="isStarting"
                                    @click="assignFacilitator(record)"
                                    v-if="record.is_facilitator == false"
                                  >
                                    <span>Assign Facilitator </span>
                                  </sdButton>
                                  &nbsp;&nbsp;
                                  <sdButton
                                    size="extra-small"
                                    type="warning"
                                    :disabled="isStarting"
                                    @click="deassignFacilitator(record)"
                                    v-if="record.is_facilitator == true"
                                  >
                                    <span> De-assign Facilitator </span>
                                  </sdButton>
                                  &nbsp; &nbsp;
                                  <sdButton
                                    size="extra-small"
                                    type="danger"
                                    @click="voidParticipant(record)"
                                    v-if="isEventHost"
                                  >
                                    Void Participant
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive ev-table-shell"
                          v-show="activeClass === 'confirmed'"
                        >
                          <a-table
                            :pagination="{
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                          >
                          </a-table>
                        </TableWrapper>

                        <TableWrapper
                          class="table-data-view table-responsive ev-table-shell"
                          v-show="activeClass === 'pending'"
                        >
                          <!--
                            Host-driven attendance confirmation has been
                            disabled. Attendance is now self-confirmed by
                            participants (SMS OTP / registration code) only.
                            The pending list stays read-only; the host can
                            resend the confirmation code but cannot mark a
                            participant present on their behalf.
                          -->
                          <div class="ev-validate-bar is-notice">
                            <span class="ev-validate-hint">
                              <sdFeatherIcons type="info" size="14" />
                              &nbsp; Attendance is confirmed by the host & 
                              facilitators via SMS confirmation sent to the 
                              participants the host cannot confirm attendance 
                              of the participants without the participants dialing. 
                            </span>
                          </div>
                          <a-table
                            :pagination="{
                              pageSize: 100,
                              showSizeChanger: true,
                            }"
                            :dataSource="filteredData"
                            :columns="columns"
                            :row-key="(record) => record.id"
                          >
                            <template #participants="{ record }">
                              <td>
                                <div class="table-actions">
                                  <a-tag
                                    v-if="pendingAutoValidated"
                                    color="success"
                                  >
                                    Auto-validated
                                  </a-tag>
                                  <sdButton
                                    type="warning"
                                    size="extra-small"
                                    v-if="canResendConfirmation"
                                    @click="resendConfirmation(record.id)"
                                  >
                                    Resend Confirmation
                                  </sdButton>
                                </div>
                              </td>
                            </template>
                          </a-table>
                        </TableWrapper>
                        </div>

                        <!-- Card view (default on mobile / user selectable on
                             desktop). Mirrors the participant tables: one card
                             per participant, grouped by the active tab. -->
                        <div v-else class="ev-participant-cards">
                          <!-- All participants -->
                          <div v-show="activeClass === 'all'" class="ev-card-list">
                            <article
                              v-for="record in filteredData"
                              :key="record.id"
                              class="ev-card"
                            >
                              <div class="ev-card-head">
                                <div class="ev-card-title">{{ record.fullName }}</div>
                                <span class="ev-card-code">{{ record.phone_no }}</span>
                              </div>
                              <div class="ev-card-meta">
                                <div>
                                  <span class="lbl">Phone</span>
                                  <span class="val">{{ record.phone_no || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Location</span>
                                  <span class="val">{{ record.location_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Level</span>
                                  <span class="val">{{ record.level_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Organization</span>
                                  <span class="val">{{ record.org_types_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Role</span>
                                  <span class="val">{{ record.role_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Attendance Days</span>
                                  <span class="val">{{ record.no_of_days ?? "—" }}</span>
                                </div>
                              </div>
                              <div class="ev-card-actions">
                                <sdButton
                                  v-if="record.is_facilitator == false"
                                  size="extra-small"
                                  type="success"
                                  :disabled="isStarting"
                                  @click="assignFacilitator(record)"
                                >
                                  Assign Facilitator
                                </sdButton>
                                <sdButton
                                  v-if="record.is_facilitator == true"
                                  size="extra-small"
                                  type="warning"
                                  :disabled="isStarting"
                                  @click="deassignFacilitator(record)"
                                >
                                  De-assign Facilitator
                                </sdButton>
                                <sdButton
                                  v-if="isEventHost"
                                  size="extra-small"
                                  type="danger"
                                  @click="voidParticipant(record)"
                                >
                                  Void Participant
                                </sdButton>
                              </div>
                            </article>
                          </div>
                          <!-- Confirmed participants -->
                          <div v-show="activeClass === 'confirmed'" class="ev-card-list">
                            <article
                              v-for="record in filteredData"
                              :key="record.id"
                              class="ev-card"
                            >
                              <div class="ev-card-head">
                                <div class="ev-card-title">{{ record.fullName }}</div>
                                <span class="ev-card-code">{{ record.phone_no }}</span>
                              </div>
                              <div class="ev-card-meta">
                                <div>
                                  <span class="lbl">Phone</span>
                                  <span class="val">{{ record.phone_no || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Location</span>
                                  <span class="val">{{ record.location_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Level</span>
                                  <span class="val">{{ record.level_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Organization</span>
                                  <span class="val">{{ record.org_types_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Role</span>
                                  <span class="val">{{ record.role_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Attendance Days</span>
                                  <span class="val">{{ record.no_of_days ?? "—" }}</span>
                                </div>
                              </div>
                            </article>
                          </div>
                          <!-- Pending participants -->
                          <div v-show="activeClass === 'pending'" class="ev-card-list">
                            <div class="ev-validate-bar is-notice">
                              <span class="ev-validate-hint">
                                <sdFeatherIcons type="info" size="14" />
                                &nbsp; Attendance is confirmed by participants
                                themselves via their SMS confirmation code —
                                the host cannot confirm attendance on their
                                behalf. Use "Resend Confirmation" to re-send a
                                participant's code if needed.
                              </span>
                            </div>
                            <article
                              v-for="record in filteredData"
                              :key="record.id"
                              class="ev-card"
                            >
                              <div class="ev-card-head">
                                <div class="ev-card-title">{{ record.fullName }}</div>
                                <span class="ev-card-code">{{ record.phone_no }}</span>
                              </div>
                              <div class="ev-card-meta">
                                <div>
                                  <span class="lbl">Phone</span>
                                  <span class="val">{{ record.phone_no || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Location</span>
                                  <span class="val">{{ record.location_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Level</span>
                                  <span class="val">{{ record.level_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Organization</span>
                                  <span class="val">{{ record.org_types_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Role</span>
                                  <span class="val">{{ record.role_id || "—" }}</span>
                                </div>
                                <div>
                                  <span class="lbl">Attendance Days</span>
                                  <span class="val">{{ record.no_of_days ?? "—" }}</span>
                                </div>
                              </div>
                              <div class="ev-card-actions">
                                <a-tag v-if="pendingAutoValidated" color="success">
                                  Auto-validated
                                </a-tag>
                                <sdButton
                                  type="warning"
                                  size="extra-small"
                                  v-if="canResendConfirmation"
                                  @click="resendConfirmation(record.id)"
                                >
                                  Resend Confirmation
                                </sdButton>
                              </div>
                            </article>
                          </div>
                        </div>
                      </div>
                      <!-- Void Participants Modal — lists the participant's
                           confirmed days so the host can pick exactly which
                           days to void instead of wiping the whole
                           participation. Every confirmed day starts SELECTED;
                           the host DESELECTS the days to void. -->
                      <a-modal
                        title="Void Participant"
                        :visible="isModalOpen"
                        @cancel="handleCancel"
                        width="38%"
                      >
                        <p v-if="voidParticipantName">
                          Confirmed days for
                          <strong>{{ voidParticipantName }}</strong>. All
                          confirmed days are selected —
                          <strong>uncheck the days you want to void</strong>.
                        </p>

                        <div v-if="loadingDays" class="ev-void-loading">
                          <a-spin size="small" />
                          <span>&nbsp;Loading confirmed days…</span>
                        </div>

                        <div v-else>
                          <p v-if="!confirmedDays.length" class="ev-void-empty">
                            This participant has no confirmed days to void.
                          </p>

                          <template v-else>
                            <a-checkbox-group
                              v-model:value="selectedDayIds"
                              style="width: 100%"
                            >
                              <div
                                v-for="day in confirmedDays"
                                :key="day.id"
                                class="ev-void-day"
                              >
                                <a-checkbox :value="day.id">
                                  Day {{ day.day }} —
                                  {{ day.registration_date }}
                                </a-checkbox>
                              </div>
                            </a-checkbox-group>

                            <p class="ev-void-summary">
                              {{ confirmedDays.length - selectedDayIds.length }}
                              of {{ confirmedDays.length }} confirmed day(s)
                              will be voided.
                            </p>

                            <a-form
                              class="add-record-form"
                              :style="{ width: '100%' }"
                              layout="vertical"
                              name="voidparticipant"
                              :model="formState"
                            >
                              <a-form-item
                                name="reason_for_voiding"
                                label="Reason"
                              >
                                <a-textarea
                                  v-model:value="formState.reason_for_voiding"
                                  placeholder="State reason for voiding..."
                                  :rows="4"
                                />
                              </a-form-item>
                            </a-form>
                          </template>
                        </div>

                        <template #footer>
                          <a-button
                            key="cancel"
                            type="warning"
                            @click="handleCancel"
                          >
                            Cancel
                          </a-button>
                          <a-button
                            key="confirm"
                            type="danger"
                            :loading="voidSubmitting"
                            :disabled="
                              loadingDays ||
                              !confirmedDays.length ||
                              confirmedDays.length === selectedDayIds.length
                            "
                            @click="handleVoid"
                          >
                            Confirm
                          </a-button>
                        </template>
                      </a-modal>
                      <!-- End void participant modal -->

                      <!-- Archive Event Modal -->
                      <a-modal
                        title="Archive Event"
                        :visible="isArchiveModalOpen"
                        @cancel="handleCancelArchive"
                        width="20%"
                      >
                        <p>
                          Are you sure you want to archive event? <br />
                          <br />
                          By confirming this, the event will not be available to
                          users.
                        </p>
                        <template #footer>
                          <a-button
                            key="cancel"
                            type="warning"
                            @click="handleCancelArchive"
                          >
                            Cancel
                          </a-button>
                          <a-button
                            key="confirm"
                            type="danger"
                            @click="handleArchiveEvent"
                          >
                            Confirm
                          </a-button>
                        </template>
                      </a-modal>
                      <!-- End Archive Event modal -->

                      <!-- Event Matrix Modal -->
                      <a-modal
                        title="Payroll Event Matrix"
                        :visible="isMatrixModalOpen"
                        @cancel="handleCancelMatrix"
                        width="60%"
                        :footer="null"
                      >
                        <sdCards headless>
                          <div class="result-list-content">
                            <a-row :gutter="15">
                              <a-col class="w-100" :md="24">
                                <sdCards headless>
                                  <sdHeader>
                                    <b>
                                      <span class="ai-playback-shuffle"></span
                                      >Payable Organizations
                                    </b>
                                  </sdHeader>
                                  <br />
                                  <br />
                                  <div>
                                    <sdButton
                                      class="spaced-button"
                                      size="extra-small"
                                      type="success"
                                      outlined
                                      v-for="org in org_matrixes"
                                      :key="org.id"
                                    >
                                      {{ org.org_id }}
                                    </sdButton>
                                  </div>
                                  <br />
                                  <div v-if="isLoading" class="spin">
                                    <a-spin />
                                  </div>
                                  <div v-else>
                                    <TableWrapper
                                      class="table-data-view table-responsive"
                                      v-show="activeClass === 'all'"
                                    >
                                      <a-table
                                        :dataSource="event_matrixes"
                                        :columns="matrix_column"
                                      >
                                      </a-table>
                                    </TableWrapper>
                                  </div>
                                </sdCards>
                              </a-col>
                            </a-row>
                          </div>
                        </sdCards>
                      </a-modal>

                      <!-- End Event Matrix modal -->

                      <!-- Cadre Modal -->
                      <a-modal
                        title="Participation Summary"
                        :visible="isCadreModalOpen"
                        @cancel="handleCancelCadre"
                        width="40%"
                        :footer="null"
                      >
                        <sdCards headless>
                          <div class="result-list-content">
                            <a-row :gutter="15">
                              <a-col class="w-100" :md="24">
                                <sdCards headless>
                                  <div>
                                    <ul class="cadre-list">
                                      <li
                                        v-for="cadre in cadres"
                                        :key="cadre.role_id"
                                        class="cadre-list-item"
                                      >
                                        {{ cadre.role_id }} -
                                        <b>{{ cadre.count }}</b>
                                        <span
                                          v-if="
                                            cadre.dayshift || cadre.nightshift
                                          "
                                        >
                                          (Dayshift -
                                          <b> {{ cadre.dayshift }}</b> &
                                          Nightshift -
                                          <b>{{ cadre.nightshift }} </b>)
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                  <br />
                                </sdCards>
                              </a-col>
                            </a-row>
                          </div>
                        </sdCards>
                      </a-modal>

                      <!-- End Cadre Modal -->

                      <!-- Assign & Deassign Modals -->
                      <a-modal
                        title="Assign Facilitator"
                        :visible="isAssignModal"
                        @ok="handleAssign"
                        @cancel="handleAssignCancel"
                        class="title-success"
                      >
                        <div>
                          <p>
                            Please confirm that you want to assign
                            {{ participant.first_name }}
                            {{ participant.last_name }},
                            {{ participant.id_no }} of
                            {{ participant.location_id }} as facilitator to
                            <br />
                            Event: {{ event_name }}
                          </p>
                        </div>
                      </a-modal>

                      <a-modal
                        title="De-assign Facilitator"
                        :visible="deassignModal"
                        @ok="handleDeassign"
                        @cancel="handleDeassignCancel"
                        class="title-success"
                      >
                        <div>
                          <p>
                            Please confirm that you want to de-assign
                            {{ participant.first_name }}
                            {{ participant.last_name }},
                            {{ participant.id_no }} of
                            {{ participant.location_id }} as facilitator to
                            <br />
                            Event: {{ event_name }}
                          </p>
                        </div>
                      </a-modal>
                      <!--  End of assign & Deassign Modals  -->
                    </sdCards>
                  </a-col>
                </a-row>
              </div>
            </sdCards>
          </a-col>
        </a-row>
      </SearchResultWrapper>

      <!-- Submit for payroll workflow -->
      <EventSubmitPayrollModal
        v-model:visible="isSubmitModalOpen"
        :event="liveEvent"
        @submitted="onEventSubmitted"
      />

      <!--
        Register participant modal (host / facilitator).

        The host/facilitator enters the participant's registration code and the
        API confirms that registration (the backend verifies the caller is the
        event host or a facilitator). This modal deliberately does NOT close
        itself: the mask click and the Esc key are disabled, the default
        OK/Cancel footer is removed, and a successful registration only clears
        the input — so a batch of participants can be registered in one go. It
        closes only when the user clicks Close (or the header ✕).
      -->
      <a-modal
        title="Register Participant"
        :visible="isRegisterModalOpen"
        :footer="null"
        :mask-closable="false"
        :keyboard="false"
        @cancel="closeRegisterModal"
        class="title-success"
        width="480px"
      >
        <div class="ev-register-modal">
          <p class="ev-register-hint">
            Enter the participant's registration code to confirm their
            attendance for{{ event_name }}
          </p>
          <a-input
            v-model:value="registrationCode"
            placeholder="Registration code"
            allow-clear
            :disabled="registering"
            @pressEnter="confirmRegistration"
          />
          <p
            v-if="registerFeedback"
            class="ev-register-feedback"
            :class="`is-${registerFeedbackType}`"
          >
            {{ registerFeedback }}
          </p>
          <div class="ev-register-actions">
            <sdButton
              size="small"
              type="light"
              outlined
              :disabled="registering"
              @click="closeRegisterModal"
            >
              Close
            </sdButton>
            <sdButton
              type="primary"
              size="small"
              :disabled="!registrationCode || registering"
              @click="confirmRegistration"
            >
              <sdFeatherIcons type="check" size="13" />&nbsp;
              {{ registering ? "Registering…" : "Register Participant" }}
            </sdButton>
          </div>
        </div>
      </a-modal>

      <!-- Event trainers modal -->
      <a-modal
        title="Event Trainers"
        :visible="isTrainersModalOpen"
        :footer="null"
        @cancel="closeTrainersModal"
        class="title-success"
      >
        <div>
          <h4><b><u>Event Host</u></b></h4>
          <p>{{ trainers_host || "—" }}</p>
          <h4><b><u>Event Facilitators</u></b></h4>
          <br />
          <ul>
            <li v-for="f in trainers_facilitators" :key="f">{{ f }}</li>
            <li v-if="!trainers_facilitators.length">—</li>
          </ul>
        </div>
      </a-modal>

      <!-- LSO/LPO upload/link modal (host only) -->
      <a-modal
        :visible="isLsoModalOpen"
        title="Upload / Link LSO/LPO"
        :footer="null"
        :mask-closable="false"
        @cancel="closeLsoUploadModal"
        class="title-success"
      >
        <div class="ev-lso-modal">
          <p class="ev-lso-modal-hint">
            Select the open LSO/LPO covering this event's vendor. This will
            link the LSO/LPO to the event so payroll submission can proceed.
          </p>
          <a-form layout="vertical">
            <a-form-item label="Open LSO/LPO">
              <a-select
                v-model:value="lsoUpload.vendor_lso_id"
                placeholder="Select an open LSO/LPO"
                allow-clear
                show-search
                option-filter-prop="label"
                :loading="lsoUpload.loadingList"
                style="width: 100%"
              >
                <a-select-option
                  v-for="lso in lsoUpload.openLsos"
                  :key="lso.id"
                  :value="lso.id"
                  :label="`${lso.lso_number || 'LSO'} — ${lso.vendor?.name || 'Vendor'}`"
                >
                  <strong>{{ lso.lso_number || "LSO" }}</strong>
                  <span> — {{ lso.vendor?.name || "Vendor" }}</span>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
          <div class="ev-lso-modal-actions">
            <sdButton size="small" type="light" outlined @click="closeLsoUploadModal">
              Cancel
            </sdButton>
            <sdButton
              type="primary"
              size="small"
              :disabled="!lsoUpload.vendor_lso_id || lsoUpload.saving"
              @click="submitLsoLink"
            >
              <sdFeatherIcons type="link" size="13" />&nbsp;
              {{ lsoUpload.saving ? "Linking…" : "Link LSO/LPO" }}
            </sdButton>
          </div>
        </div>
      </a-modal>

      <!-- Budget template linking -->
      <BudgetTemplateLinkModal
        v-model:visible="isBudgetLinkModalOpen"
        target-type="event"
        :target-id="plainquery.id"
        :target-name="event_name"
        :current-link="eventBudgetLink"
        :allow-relink="canRelinkBudget"
        @linked="onBudgetLinked"
      />

      <!-- Budget category parameters (read-only, after linking) -->
      <BudgetCategoryParametersModal
        v-if="budgetParamsModalState"
        v-model:visible="isBudgetParamsModalOpen"
        :budget-id="budgetParamsModalState.budget_id"
        :category-id="budgetParamsModalState.category_id"
        :category-name="budgetParamsModalState.name"
        :target-name="event_name"
      />
    </Main>
  </div>
</template>

<script setup>
import { Main } from "../../styled";
import { SearchResultWrapper } from "./style";
import { computed, onMounted, ref, reactive } from "vue";
import authHeader from "../../../services/auth-header";
import axios from "@/Axiosconfig";
import { useStore } from "vuex";
import { Modal } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import store from "../../../vuex/store";
import { decrypt } from "@/cryptoHelper";
import { notification } from "ant-design-vue";
import EventSubmitPayrollModal from "./components/EventSubmitPayrollModal.vue";
import BudgetTemplateLinkModal from "../../../components/budget/BudgetTemplateLinkModal.vue";
import BudgetCategoryParametersModal from "./components/BudgetCategoryParametersModal.vue";

const columns = [
  {
    title: "Participant Name",
    dataIndex: "fullName",
    key: "id",
  },
  {
    title: "Participant Phone",
    dataIndex: "phone_no",
    key: "id",
  },
  {
    title: "Location",
    dataIndex: "location_id",
    key: "id",
  },
  {
    title: "Level",
    dataIndex: "level_id",
    key: "id",
  },
  {
    title: "Organization",
    dataIndex: "org_types_id",
    key: "id",
  },
  {
    title: "Role",
    dataIndex: "role_id",
    key: "id",
  },
  {
    title: "Attendance Days",
    dataIndex: "no_of_days",
    key: "id",
  },
  {
    title: "Action",
    dataIndex: "",
    key: "participants",
    slots: { customRender: "participants" },
  },
];

const matrix_column = [
  {
    title: "Matrix",
    dataIndex: "pay_matrix_id",
    key: "id",
  },
  {
    title: "Rate",
    dataIndex: "rate",
    key: "id",
  },
];

const recordCount = computed(() => dataSource.value.length);
const confirmedCount = computed(() => confirmed.value.length);
const pendingCount = computed(() => pending.value.length);
// When today's confirmed participants equal the total registered, the pending
// participants are treated as automatically validated (display state only — no
// backend confirmation is triggered for the remaining pending rows).
const pendingAutoValidated = computed(
  () => recordCount.value > 0 && confirmedCount.value === recordCount.value
);
const { query } = useRoute();
const plainquery = decrypt(decodeURIComponent(query.encryptedData));
const event_name = plainquery.name;
const event_list_id = plainquery.event_list_id;
const event_location_id = plainquery.location;
const event_code = plainquery.event_code;
const event_payroll_status = plainquery.payroll_status;
const router = useRouter();

// Back to the events list. Uses the browser history when arriving via in-app
// navigation; falls back to the Events list page on a hard refresh.
const goBack = () => {
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push({ name: "event-view" });
  }
};
const { state } = useStore();
const isLoading = ref(true);
const dataSource = ref([]);
const confirmed = ref([]);
const pending = ref([]);
const activeClass = ref("all");
const isGenerating = computed(() => state.isGenerating);
const isModalOpen = ref(false);
const isArchiveModalOpen = ref(false);
const isMatrixModalOpen = ref(false);
const isCadreModalOpen = ref(false);
const participant_id = ref("");

// ── Void participant (per confirmed day) ──
// When the host opens the void modal we fetch the participant's confirmed days
// (event_registrations rows). Every day starts SELECTED — the host DESELECTS
// the days they want to void and submits.
const voidParticipantName = ref("");
const confirmedDays = ref([]);
const selectedDayIds = ref([]);
const loadingDays = ref(false);
const voidSubmitting = ref(false);
// Guards against double-firing the resend action for the same participant.
const resendingId = ref(null);

const API_URL = `events/${plainquery.event_code}/participants`;
const genetatePayrollURL = `${process.env.VUE_APP_BASE_URL}/generate_events_pay_roll?status=1&event_code=${event_code}`;
const reGenetatePayrollURL = `${process.env.VUE_APP_BASE_URL}/regenerate_event_payroll?status=1&event_code=${event_code}`;
const export_participants_url = `${process.env.VUE_APP_BASE_URL}/event_participants_export?event_code=${plainquery.event_code}`;
const event_matrix = `${process.env.VUE_APP_BASE_URL}/view_event_matrix?event_list_id=${plainquery.event_list_id}`;
const orgs_matrix = `${process.env.VUE_APP_BASE_URL}/view_event_org_matrix?event_list_id=${plainquery.event_list_id}`;
const cadres_url = `${process.env.VUE_APP_BASE_URL}/get_event-registration_role_counts/${plainquery.id}`;
const event_matrixes = ref([]);
const org_matrixes = ref([]);
const cadres = ref([]);
const isAssignModal = ref(false);
const deassignModal = ref(false);
const participant = ref("");
const id_user = ref("");
const searchItem = ref("");

// Cards/Table view toggle for the participants list — mirrors the events &
// activities list pages (cards by default on narrow/mobile screens, table on
// desktop where the columns fit; the user can switch either way).
const viewMode = ref(
  typeof window !== "undefined" && window.innerWidth <= 991 ? "cards" : "table"
);
const isDownloading = ref(false);

// ── Event lifecycle (submit for payroll / generate payroll) ──
const liveEvent = ref({
  id: plainquery.id,
  name: event_name,
  event_code: event_code,
  status: plainquery.status,
  start_date: plainquery.start_date,
  payroll_status: event_payroll_status,
  payroll_submitted: plainquery.payroll_submitted,
});
// Kept only to disable the facilitator assign/de-assign buttons while a
// background mutation is in flight.
const isStarting = ref(false);
const isSubmitModalOpen = ref(false);
// Flips true once `fetchLiveEvent()` has resolved with the authoritative
// event payload (which is when we finally know `vendor_lso_id` /
// `has_lso_attached`). Any UI that depends on those fields — the missing
// LSO badge, the host-only LSO alert, workflow hints — must wait for this
// flag before rendering to avoid an initial false-positive flicker.
const liveEventLoaded = ref(false);

// ── Event trainers ──
const isTrainersModalOpen = ref(false);
const trainers_host = ref("");
const trainers_facilitators = ref([]);

// ── LSO/LPO gating (host-only notice) ──
// True when the current session user is the event host (the person who
// created / was assigned as the event facilitator with `isTrainer = null`).
const currentUserId = (() => {
  try {
    const u = JSON.parse(sessionStorage.getItem("user"));
    return u?.user?.id ?? null;
  } catch (e) {
    return null;
  }
})();
const isEventHost = computed(
  () =>
    currentUserId != null &&
    Number(currentUserId) === Number(plainquery.event_host_id)
);
// True when the event does not have an LSO/LPO attached yet. The backend's
// `events/{id}/show` endpoint returns `vendor_lso_id` and `has_lso_attached`;
// we only trust those values *after* the live payload has been loaded to
// avoid a false-positive flash while the request is in flight (the URL
// payload doesn't include the LSO fields, so relying on it up-front would
// briefly show the "LSO/LPO Missing" chip and host alert before hiding
// them again once the real data arrives).
const lsoMissing = computed(() => {
  if (!liveEventLoaded.value) return false;
  const live = liveEvent.value || {};
  if (live.has_lso_attached === false) return true;
  if (live.has_lso_attached === true) return false;
  return !live.vendor_lso_id;
});

// LSO/LPO upload/link modal state
const isLsoModalOpen = ref(false);
const lsoUpload = reactive({
  vendor_lso_id: null,
  openLsos: [],
  loadingList: false,
  saving: false,
});

// ── Budget template linking ──
const isNationalEvent = computed(() => !!liveEvent.value?.is_national);
const isBudgetLinkModalOpen = ref(false);
const openBudgetLinkModal = () => {
  isBudgetLinkModalOpen.value = true;
};
const eventBudgetLink = computed(() => ({
  campaign_budget_id: liveEvent.value?.campaign_budget_id ?? null,
  budget_category_id: liveEvent.value?.budget_category_id ?? null,
  budget_category_name: liveEvent.value?.budget_category_name ?? null,
}));
const onBudgetLinked = async () => {
  // Refresh the live event so the UI reflects the newly linked template AND so
  // the budget params modal is driven by the authoritative stored pair (from
  // Event::format()) rather than the raw link response.
  await fetchLiveEvent();
  const b = eventBudgetLink.value;
  if (b?.campaign_budget_id && b?.budget_category_id) {
    budgetParamsModalState.value = {
      budget_id: b.campaign_budget_id,
      category_id: b.budget_category_id,
      name: b.budget_category_name || null,
    };
    isBudgetParamsModalOpen.value = true;
  }
};

// Only super admin / accountant may re-link to a different budget template.
// Mirrors BudgetDeductionService::canRelinkBudget() (super-admin set 1,53,63,
// 64,59,4 + the Accountant role — id 65 used across the payroll screens).
const canRelinkBudget = computed(() => {
  const u = JSON.parse(sessionStorage.getItem("user"));
  const rid = Number(u?.user?.role_id);
  return [1, 53, 63, 64, 59, 4, 65].includes(rid);
});

// ── Budget category parameters (read-only) ──
const isBudgetParamsModalOpen = ref(false);
const budgetParamsModalState = ref(null);
// Host, admin, accountant, super admin (and the other generator/privileged
// roles used across the app) may view the linked template's parameters.
const canViewBudgetParams = computed(() => {
  if (!eventBudgetLink.value.campaign_budget_id || !eventBudgetLink.value.budget_category_id) {
    return false;
  }
  if (isEventHost.value) return true;
  const u = JSON.parse(sessionStorage.getItem("user"));
  return [1, 53, 63, 64, 59, 4].includes(Number(u?.user?.role_id));
});
const openBudgetParamsModal = () => {
  const b = eventBudgetLink.value;
  if (!b.campaign_budget_id || !b.budget_category_id) return;
  budgetParamsModalState.value = {
    budget_id: b.campaign_budget_id,
    category_id: b.budget_category_id,
    name: b.budget_category_name || null,
  };
  isBudgetParamsModalOpen.value = true;
};

const openLsoUploadModal = async () => {
  lsoUpload.vendor_lso_id = null;
  isLsoModalOpen.value = true;
  lsoUpload.loadingList = true;
  try {
    const res = await axios.get(`open_vendor_lsos`, { headers: authHeader() });
    lsoUpload.openLsos = res.data?.data || [];
  } catch (e) {
    lsoUpload.openLsos = [];
    notification.error({
      message: "Error",
      description:
        e?.response?.data?.message ||
        "Could not load the list of open LSO/LPOs.",
    });
  } finally {
    lsoUpload.loadingList = false;
  }
};

const closeLsoUploadModal = () => {
  isLsoModalOpen.value = false;
};

const submitLsoLink = async () => {
  if (!lsoUpload.vendor_lso_id) return;
  lsoUpload.saving = true;
  try {
    const fd = new FormData();
    fd.append("upload_type", "lso");
    fd.append("vendor_lso_id", lsoUpload.vendor_lso_id);
    await axios.post(
      `create_vendor_upload/event/${plainquery.id}`,
      fd,
      { headers: authHeader() }
    );
    notification.success({
      message: "LSO/LPO linked",
      description:
        "The LSO/LPO has been attached to this event. You can now submit the event for payroll.",
    });
    isLsoModalOpen.value = false;
    // Refresh the live event so the notice/badge and the Submit button
    // reflect the newly linked LSO/LPO.
    await fetchLiveEvent();
  } catch (e) {
    notification.error({
      message: "Could not link LSO/LPO",
      description:
        e?.response?.data?.message ||
        "Please try again, or contact support if the problem persists.",
    });
  } finally {
    lsoUpload.saving = false;
  }
};

const isPayrollPending = computed(
  () => (liveEvent.value.payroll_status || event_payroll_status) === "Pending"
);
// Submission is gated by the backend: the event must be closed on (or after)
// its final scheduled day. The list page drives the daily start/close cycle.
const canSubmitEvent = computed(
  () => !!liveEvent.value.can_submit_payroll && isPayrollPending.value
);

// The "Submit for Payroll" button is always available to the event host and to
// privileged (super-admin/admin) roles — they just see it disabled until the
// backend's conditions are met (`canSubmitEvent`). Previously the button was
// hidden entirely before those conditions were true, which made it appear
// "missing" for hosts and super admins.
const submitPayrollVisible = computed(() => {
  if (isEventHost.value) return true;
  const u = JSON.parse(sessionStorage.getItem("user"));
  const rid = Number(u?.user?.role_id);
  // 1 = Super Admin (RoleSeeder), 53/63/64/59/4 = admin / approved-generator
  // roles used across the app.
  return [1, 53, 63, 64, 59, 4].includes(rid);
});

// Who may register/confirm participants on this event. The backend exposes the
// authoritative flag (`can_register_participants` = the caller is the event host
// or one of its facilitators) on the live event payload; fall back to the host
// check while it loads or when an older payload lacks the flag.
const canRegisterParticipants = computed(
  () =>
    liveEvent.value.can_register_participants === true || isEventHost.value
);

// Who may re-send a participant's confirmation code: the event host, any
// facilitator of the event, or a super admin. `canRegisterParticipants` is the
// backend flag that is true for the host OR a facilitator, so it already covers
// the first two; super admins are matched by role id (1 = Super Admin,
// 53 = config('roles.super_admin_role_id')).
const isSuperAdmin = computed(() => {
  try {
    const u = JSON.parse(sessionStorage.getItem("user"));
    const rid = Number(u?.user?.role_id);
    return rid === 1 || rid === 53;
  } catch (e) {
    return false;
  }
});
const canResendConfirmation = computed(
  () => canRegisterParticipants.value || isSuperAdmin.value
);

// Payroll generation only unlocks once the event host has submitted the closed
// event for payroll. The backend exposes this as `can_generate_payroll`
// (event closed AND submitted), with `payroll_submitted` as a fallback.
const canGeneratePayroll = computed(
  () =>
    !!(liveEvent.value.can_generate_payroll ?? liveEvent.value.payroll_submitted)
);

// ── Presentation helpers for the detail header ──
const eventStatusLabel = computed(() => {
  if (liveEvent.value.status) return "Active";
  if (liveEvent.value.start_date) return "Closed";
  return "Not Started";
});
const statusBadgeClass = computed(() => {
  if (liveEvent.value.status) return "is-active";
  if (liveEvent.value.start_date) return "is-closed";
  return "is-idle";
});
const payrollLabel = computed(() => {
  const status = liveEvent.value.payroll_status || event_payroll_status;
  if (status === "Generated") return "Payroll Generated";
  if (status === "Paid") return "Payroll Paid";
  return "Payroll Pending";
});
const payrollBadgeClass = computed(() => {
  const status = liveEvent.value.payroll_status || event_payroll_status;
  if (status === "Generated") return "is-generated";
  if (status === "Paid") return "is-paid";
  return "is-pending";
});

const fetchLiveEvent = async () => {
  try {
    const response = await axios.get(`events/${plainquery.id}/show`, {
      headers: authHeader(),
    });
    if (response.data && response.data.data) {
      liveEvent.value = response.data.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    // Mark the live event as loaded even if the request failed so the UI
    // doesn't stay pinned to a loading state indefinitely. On failure we
    // simply keep whatever `liveEvent` was seeded with from the URL.
    liveEventLoaded.value = true;
  }
};

const openSubmitModal = () => {
  isSubmitModalOpen.value = true;
};
const onEventSubmitted = () => {
  setTimeout(() => location.reload(), 1500);
};

const openTrainersModal = async () => {
  trainers_host.value = "";
  trainers_facilitators.value = [];
  isTrainersModalOpen.value = true;
  try {
    const response = await axios.get(`event/${event_code}/facilitators`, {
      headers: authHeader(),
    });
    const details = response.data.data;
    trainers_host.value = details.event_host;
    trainers_facilitators.value = details.event_facilitators || [];
  } catch (error) {
    console.error(error);
  }
};
const closeTrainersModal = () => {
  isTrainersModalOpen.value = false;
};

// ── Register participant (host / facilitator) ──
// Mirrors the Register modal on the events list page: the host or facilitator
// enters a participant's registration code and the API confirms that
// registration. The backend re-checks that the caller is the event host or a
// facilitator of this event, so the UI is not the security boundary here.
const isRegisterModalOpen = ref(false);
const registrationCode = ref("");
const registering = ref(false);
const registerFeedback = ref("");
const registerFeedbackType = ref("info");

const openRegisterModal = () => {
  registrationCode.value = "";
  registerFeedback.value = "";
  isRegisterModalOpen.value = true;
};

// Manual close only. The modal is opened with `:mask-closable="false"` and
// `:keyboard="false"` so an accidental click / Esc cannot dismiss it mid-batch.
const closeRegisterModal = () => {
  isRegisterModalOpen.value = false;
};

const confirmRegistration = async () => {
  const code = String(registrationCode.value || "").trim();
  if (!code) return;

  registering.value = true;
  registerFeedback.value = "";

  try {
    const response = await axios.get(
      `event/${event_code}/participant/${code}/assign`,
      { headers: authHeader() }
    );

    if (response.status === 200) {
      registerFeedbackType.value = "success";
      registerFeedback.value =
        response.data.message || "Participant registered successfully.";
      notification.success({
        message: "Participant registered",
        description: response.data.message,
      });
      // Refresh the participant lists so the new confirmation shows up.
      getEventParticipants();
    } else if (response.status === 208) {
      registerFeedbackType.value = "info";
      registerFeedback.value =
        response.data.message || "This registration is already confirmed.";
      notification.info({
        message: "Info",
        description: response.data.message,
      });
    }

    // Keep the modal open for the next participant; just clear the field.
    registrationCode.value = "";
  } catch (error) {
    registerFeedbackType.value = "error";
    registerFeedback.value =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to register this participant.";
    notification.error({
      message: "Registration failed",
      description: registerFeedback.value,
    });
  } finally {
    registering.value = false;
  }
};

const formState = reactive({
  reason_for_voiding: "",
});

const level_id = ref("");
const role_id = ref("");
const rt = useRouter();

onMounted(async () => {
  isLoading.value = true;
  // Essential first paint only: participant table data + the live event
  // payload (header badges / LSO + payroll gating). Modal-only data
  // (event matrix, org matrix, cadre summary, trainers, LSO list) is fetched
  // on demand when the corresponding modal is opened — see openMatrixModal,
  // openCadreModal, openTrainersModal and openLsoUploadModal.
  getEventParticipants();
  fetchLiveEvent();
});

const getEventParticipants = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_URL, {
      headers: authHeader(),
    });

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      return {
        ...record,
        fullName,
      };
    });

    dataSource.value = updatedData;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
  try {
    const response = await axios.get(API_URL + "?status=1", {
      headers: authHeader(),
    });
    console.log(API_URL + "?status=1");

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      return {
        ...record,
        fullName,
      };
    });
    confirmed.value = updatedData;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
  try {
    const response = await axios.get(API_URL + "?status=0", {
      headers: authHeader(),
    });
    console.log(API_URL + "?status=0");
    console.log(response.data.data);

    const updatedData = response.data.data.map((record) => {
      let fullName = `${record.first_name} ${record.last_name}`;
      return {
        ...record,
        fullName,
      };
    });

    pending.value = updatedData;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    rt.push({ path: "/auth/login" });
  } else {
    level_id.value = user.user.level_id;
    role_id.value = user.user.role_id;
  }
};

const generatePayroll = async () => {
  store.commit("setIsGenerating", true);

  try {
    const response = await axios.get(genetatePayrollURL, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    console.log(response);

    if (response.status === 200) {
      store.commit("setIsGenerating", false);
      Modal.success({
        title: "Success",
        content: "Payroll Generated Successfully",
      });
      await new Promise((resolve) => setTimeout(resolve, 4000));
      location.reload();
    } else {
      handleErrorResponse(response);
    }
  } catch (error) {
    console.error(error);
    handleErrorResponse(error);
  }
};

const reGeneratePayroll = async () => {
  store.commit("setIsGenerating", true);

  try {
    const response = await axios.get(reGenetatePayrollURL, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    console.log(response);

    if (response.status === 200) {
      store.commit("setIsGenerating", false);
      Modal.success({
        title: "Success",
        content: "Payroll Generated Successfully",
      });
      await new Promise((resolve) => setTimeout(resolve, 4000));
      location.reload();
    } else {
      handleErrorResponse(response);
    }
  } catch (error) {
    console.error(error);
    handleErrorResponse(error);
  }
};

// ── Host attendance validation (pending tab) ──
// The host-driven attendance-confirmation feature has been removed:
// attendance can only be confirmed by the participant themselves via the
// SMS registration/OTP code. The template no longer exposes any UI that
// posts to the (now-disabled) `validate_participants` endpoint. The
// pending list stays visible; the host can still resend a confirmation
// code (see `resendConfirmation` below).

// Resend a participant's confirmation code. Allowed for the event host,
// facilitators and super admins; the backend caps resends at 3 per participant
// within 5 hours and answers 429 once the cap is reached.
const resendConfirmation = async (id) => {
  if (resendingId.value) return;
  resendingId.value = id;

  const url = `${process.env.VUE_APP_BASE_URL}/resend_event_registration_code/${plainquery.id}/${id}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    const { success, data } = await response.json();
    if (success === true) {
      notification.success({
        message: "Success",
        description: data,
      });
    } else {
      notification.warning({
        message:
          response.status === 429 ? "Resend limit reached" : "Could not resend",
        description: data,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    notification.error({
      message: "Error",
      description: `${error}`,
    });
  } finally {
    resendingId.value = null;
  }
};

// Open the void modal for a participant and load their confirmed days. Every
// confirmed day starts SELECTED; the host deselects the ones to void.
const voidParticipant = async (record) => {
  participant_id.value = record.id;
  voidParticipantName.value = record.fullName || "";
  formState.reason_for_voiding = "";
  confirmedDays.value = [];
  selectedDayIds.value = [];
  isModalOpen.value = true;

  loadingDays.value = true;
  try {
    const response = await axios.get(
      `event_participant_confirmed_days/${plainquery.id}/${record.id}`,
      { headers: authHeader() }
    );
    const days = response.data?.data || [];
    confirmedDays.value = days;
    // All confirmed days are pre-selected (they stay confirmed on submit).
    selectedDayIds.value = days.map((d) => d.id);
  } catch (error) {
    notification.error({
      message: "Could not load confirmed days",
      description:
        error?.response?.data?.message ||
        "Please try again, or contact support if the problem persists.",
    });
  } finally {
    loadingDays.value = false;
  }
};

const handleCancel = () => {
  isModalOpen.value = false;
};

// Void only the days the host deselected — everything left selected stays
// confirmed.
const handleVoid = async () => {
  if (!confirmedDays.value.length) {
    notification.info({
      message: "Nothing to void",
      description: "This participant has no confirmed days to void.",
    });
    return;
  }

  const daysToVoid = confirmedDays.value
    .filter((day) => !selectedDayIds.value.includes(day.id))
    .map((day) => day.id);

  if (!daysToVoid.length) {
    notification.info({
      message: "No days to void",
      description: "Uncheck at least one confirmed day to void it, or cancel.",
    });
    return;
  }

  if (!formState.reason_for_voiding || !formState.reason_for_voiding.trim()) {
    notification.warning({
      message: "Reason required",
      description: "Please state a reason for voiding.",
    });
    return;
  }

  voidSubmitting.value = true;
  try {
    const data = {
      event_id: plainquery.id,
      user_id: participant_id.value,
      reason_for_voiding: formState.reason_for_voiding,
      registration_ids: daysToVoid,
    };

    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/void_event_participant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      }
    );
    const { success, message } = await response.json();

    if (success === true) {
      notification.success({
        message: "Participant days voided successfully",
        description: message,
      });
      isModalOpen.value = false;
      // Refresh the participant lists so the voided days / attendance update.
      getEventParticipants();
    } else {
      notification.error({
        message: "Participant voiding not successful",
        description: message,
      });
    }
  } catch (error) {
    notification.error({
      message: "Could not submit!",
      description: "An error has occurred. Please try again later.",
    });
    console.error("Error:", error);
  } finally {
    voidSubmitting.value = false;
  }
};

const handleArchiveEvent = async () => {
  try {
    const response = await fetch(
      `${process.env.VUE_APP_BASE_URL}/event/archive?id=${plainquery.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      }
    );
    const data = await response.json();
    console.log(data);

    if (data.success === true) {
      notification.success({
        message: "Success!",
        description: data.data,
      });
      isArchiveModalOpen.value = true;
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      router.back();
    } else {
      notification.error({
        message: "Error!",
        description: data.data,
      });
      isArchiveModalOpen.value = false;
      router.back();
    }
  } catch (error) {
    console.error(error);
  }
};

const handleErrorResponse = (error) => {
  store.commit("setIsGenerating", false);

  // Surface the backend's specific message (e.g. payroll gating: the event must
  // be closed and submitted for payroll before generation is allowed).
  const data = error?.response?.data;
  const statusCode = error?.response?.status;
  const message = data?.message;

  if (statusCode === 422 && message) {
    Modal.warning({
      title: "Payroll not available yet",
      content: message,
    });
    return; // do not reload — let the host act on the message
  }

  if (statusCode === 401 && message) {
    Modal.error({
      title: "Not allowed",
      content: message,
    });
    return;
  }

  Modal.error({
    title: "Error",
    content: message || "Something went wrong, contact admin",
  });
  setTimeout(() => location.reload(), 4000);
};
const openModal = () => {
  console.log("archive modal");
  isArchiveModalOpen.value = true;
};

const handleCancelArchive = () => {
  isArchiveModalOpen.value = false;
};

const openMatrixModal = () => {
  // Matrix + org-matrix are modal-only data — fetch them now that the modal
  // is being opened instead of at page load.
  getEventMatrix();
  getOrgMatrix();
  isMatrixModalOpen.value = true;
};

const handleCancelMatrix = () => {
  isMatrixModalOpen.value = false;
};

const openCadreModal = () => {
  // Cadre/participation summary is modal-only data — fetched on open.
  getTraineCadres();
  isCadreModalOpen.value = true;
};

const handleCancelCadre = () => {
  isCadreModalOpen.value = false;
};

const getEventMatrix = () => {
  axios
    .get(event_matrix, {
      headers: authHeader(),
    })
    .then((response) => {
      event_matrixes.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

const getOrgMatrix = () => {
  axios
    .get(orgs_matrix, {
      headers: authHeader(),
    })
    .then((response) => {
      org_matrixes.value = response.data.data;
      console.log(org_matrixes.value);
    })
    .catch((error) => {
      console.error(error);
    });
};

const getTraineCadres = () => {
  axios
    .get(cadres_url, {
      headers: authHeader(),
    })
    .then((response) => {
      cadres.value = response.data.data;
      console.log(cadres.value);
    })
    .catch((error) => {
      console.error(error);
    });
};

const exportParticipants = async () => {
  isDownloading.value = true;
  try {
    const response = await fetch(export_participants_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch export data");
    }

    const fileBlob = await response.blob();
    const fileName = "Event Participants.xlsx";
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([fileBlob]));
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error(error);
  } finally {
    isDownloading.value = false;
  }
};

const assignFacilitator = (user) => {
  isAssignModal.value = true;
  console.log(user.first_name);
  participant.value = user;
  id_user.value = user.id;
};

const handleAssignCancel = () => {
  isAssignModal.value = false;
};

const deassignFacilitator = (user) => {
  deassignModal.value = true;
  participant.value = user;
  id_user.value = user.id;
};

const handleDeassignCancel = () => {
  deassignModal.value = false;
};

const handleAssign = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/assign_facilitator/${plainquery.id}/${id_user.value}`,
      null,
      {
        headers: authHeader(),
      }
    );

    isAssignModal.value = false;
    console.log(response);
    if (response.data.success == true) {
      notification.success({
        message: "Success",
        description: response.data.data,
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      location.reload();
    } else if (response.data.success == false) {
      notification.warning({
        message: "Info",
        description: response.data.message,
      });
    }
  } catch (e) {
    notification.error({
      message: "Error!",
      description: e.toString(),
    });
    console.log(e);
  }
};

const handleDeassign = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_BASE_URL}/de_assign_facilitator/${plainquery.id}/${id_user.value}`,
      null,
      {
        headers: authHeader(),
      }
    );

    isAssignModal.value = false;
    console.log(response);
    if (response.data.success == true) {
      notification.success({
        message: "Success",
        description: response.data.data,
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
      location.reload();
    } else if (response.data.success == false) {
      notification.warning({
        message: "Info",
        description: response.data.message,
      });
    }
  } catch (e) {
    notification.error({
      message: "Error!",
      description: e.toString(),
    });
    console.log(e);
  }
};

const filteredData = computed(() => {
  let list;
  if (activeClass.value === "confirmed") {
    list = confirmed.value;
  } else if (activeClass.value === "pending") {
    list = pending.value;
  } else {
    list = dataSource.value;
  }

  const term = searchItem.value ? searchItem.value.toLowerCase() : "";
  if (!term) return list;

  return list.filter((item) => {
    const fields = [
      item.fullName,
      item.phone_no,
      item.location_id,
      item.level_id,
      item.org_types_id,
      item.role_id,
    ];
    return fields.some((f) =>
      String(f ?? "").toLowerCase().includes(term)
    );
  });
});

const user = JSON.parse(sessionStorage.getItem("user"));
console.log(event_list_id);

const isApprovedGenerator = computed(() => {
  if (
    user.user.role_id === 1 ||
    user.user.role_id === 53 ||
    user.user.role_id === 63 ||
    user.user.role_id === 64 ||
    user.user.role_id === 59 ||
    user.user.role_id === 4
  ) {
    return true;
  } else {
    return false;
  }
});

console.log( isApprovedGenerator.value && event_payroll_status == 'Generated' || event_payroll_status == 'Paid');


computed(() => {
  if (user.user.org_types_id === 10) {
    return true;
  } else {
    return false;
  }
});
</script>

<style>
.search-box {
  width: 100%; /* Adjust the width as needed, e.g., 100%, 300px, etc. */
  max-width: 400px; /* Optionally, set a maximum width */
  margin: 0 auto; /* Optional: Center align the search box */
}
.button-container {
  text-align: center;
}

.button-container sdButton {
  margin: 5px;
}

/* ───────── Event detail header ───────── */
.event-detail-page {
  padding: 16px 12px 0;
}
.ev-detail-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.ev-detail-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.ev-detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #1b3b2a;
  margin: 0;
  line-height: 1.25;
}
.ev-detail-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.ev-workflow-hint {
  font-size: 12px;
  color: #7d8c84;
  max-width: 520px;
  line-height: 1.4;
}
.ev-lso-alert {
  margin: 10px 0 16px;
  border-radius: 10px;
}
.ev-lso-alert .ev-lso-desc {
  margin: 0 0 10px;
  font-size: 12.5px;
  line-height: 1.55;
  color: #6b5010;
}
.ev-lso-alert .ev-lso-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.ev-lso-modal {
  padding: 4px 0;
}
.ev-lso-modal .ev-lso-modal-hint {
  font-size: 12.5px;
  color: #5f6c64;
  margin-bottom: 12px;
  line-height: 1.5;
}
.ev-lso-modal .ev-lso-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eef3f1;
  padding-top: 14px;
  margin-top: 4px;
}
.ev-participant-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.ev-validate-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  padding: 10px 14px;
  border: 1px solid #cfeadb;
  border-radius: 10px;
  background: #f3fbf6;
}
.ev-validate-bar.is-notice {
  border-color: #cfe0ea;
  background: #f2f7fb;
}
.ev-validate-bar.is-notice .ev-validate-hint {
  display: flex;
  align-items: center;
  color: #365b7a;
  font-weight: 500;
}
.ev-validate-hint {
  font-size: 12px;
  color: #5c6f64;
}
.ev-validate-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ev-table-search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 1 300px;
  min-width: 220px;
}
.ev-table-search .search-icon {
  position: absolute;
  left: 14px;
  z-index: 1;
  display: flex;
  color: #6fae8b;
}
.ev-table-search :deep(.ant-input-affix-wrapper),
.ev-table-search .ant-input-affix-wrapper {
  border-radius: 22px;
  border: 1px solid #cfeadb;
  background: #fff;
  padding-left: 38px;
  height: 40px;
  width: 100%;
}
.ev-table-search input {
  border: 0;
  background: transparent;
}

/* ───────── Event hero summary (legacy) ───────── */
.ev-hero {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: flex-start;
  justify-content: space-between;
  background: linear-gradient(120deg, #f1fbf5 0%, #f9fffb 45%, #eef9f2 100%);
  border: 1px solid #d9f0e2;
  border-radius: 16px;
  padding: 20px 22px;
  margin-bottom: 16px;
  box-shadow: 0 6px 18px rgba(28, 122, 72, 0.07);
}
.ev-hero-main {
  flex: 1 1 420px;
  min-width: 0;
}
.ev-hero-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.ev-hero-title {
  font-size: 22px;
  font-weight: 700;
  color: #1b3b2a;
  margin: 0;
  line-height: 1.25;
}
.ev-chip {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  border-radius: 12px;
  padding: 3px 12px;
  letter-spacing: 0.02em;
}
.ev-chip-code {
  background: #e6f4ed;
  color: #15693c;
  border: 1px solid #bfe4cd;
}
.ev-chip-gf {
  background: #daf4e4;
  color: #15693c;
  border: 1px solid #9ad8b4;
}
.ev-chip-pmi {
  background: #e0ecff;
  color: #1d4ed8;
  border: 1px solid #b3ccff;
}
.ev-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.ev-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  padding: 4px 12px;
  border: 1px solid transparent;
}
.ev-status-badge .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.ev-status-badge.is-active {
  color: #15693c;
  background: #e3f7ec;
  border-color: #9ad8b4;
}
.ev-status-badge.is-idle {
  color: #8a6d1b;
  background: #fdf6e3;
  border-color: #ecd9a0;
}
.ev-status-badge.is-closed {
  color: #9b2c2c;
  background: #fdecec;
  border-color: #f3b5b5;
}
.ev-status-badge.payroll.is-pending {
  color: #6b7280;
  background: #f3f4f6;
  border-color: #d8dce2;
}
.ev-status-badge.payroll.is-generated {
  color: #1d4ed8;
  background: #e6efff;
  border-color: #b3ccff;
}
.ev-status-badge.payroll.is-paid {
  color: #15693c;
  background: #e3f7ec;
  border-color: #9ad8b4;
}
.ev-status-badge.submitted {
  color: #15693c;
  background: #f3fcf6;
  border-color: #cdead9;
}
.ev-meta {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px 18px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.ev-meta li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  color: #2f6746;
}
.ev-meta li svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: #4a9d6f;
}
.ev-meta .meta-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.ev-meta .lbl {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #7d9488;
  font-weight: 600;
}
.ev-meta .val {
  font-size: 13.5px;
  font-weight: 600;
  color: #243831;
  word-break: break-word;
}
.ev-hero-search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 1 320px;
  min-width: 240px;
}
.ev-hero-search .search-icon {
  position: absolute;
  left: 14px;
  z-index: 1;
  display: flex;
  color: #6fae8b;
}
.ev-hero-search :deep(.ant-input-affix-wrapper),
.ev-hero-search .ant-input-affix-wrapper {
  border-radius: 22px;
  border: 1px solid #cfeadb;
  background: #fff;
  padding-left: 38px;
  height: 42px;
  width: 100%;
}
.ev-hero-search input {
  border: 0;
  background: transparent;
}

/* ───────── Quick stats ───────── */
.ev-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}
.ev-stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #e6eef0;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 3px 10px rgba(20, 60, 40, 0.05);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.ev-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(20, 60, 40, 0.1);
}
.ev-stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: #fff;
}
.ev-stat-card.all .ev-stat-icon {
  background: linear-gradient(135deg, #2f9e6b, #1c7a48);
}
.ev-stat-card.confirmed .ev-stat-icon {
  background: linear-gradient(135deg, #34c38f, #18a06f);
}
.ev-stat-card.pending .ev-stat-icon {
  background: linear-gradient(135deg, #f1b44c, #e08e0b);
}
.ev-stat-card.posts .ev-stat-icon {
  background: linear-gradient(135deg, #4f8cff, #1d4ed8);
}
.ev-stat-body {
  display: flex;
  flex-direction: column;
}
.ev-stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1b3b2a;
  line-height: 1.1;
}
.ev-stat-label {
  font-size: 12px;
  color: #7d9488;
  font-weight: 600;
}

/* ── Reorganised action toolbar ── */
.ev-detail-toolbar {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 18px;
  background: #fff;
  border: 1px solid #e6eef0;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 3px 10px rgba(20, 60, 40, 0.04);
}
.ev-toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ev-toolbar-section:not(:last-child) {
  padding-bottom: 14px;
  border-bottom: 1px dashed #e1efe6;
}
.ev-toolbar-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: #8a9d93;
}
.ev-toolbar-label svg {
  color: #4a9d6f;
}
.ev-toolbar-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.ev-toolbar-group .btn-import {
  margin: 0;
}
.ev-toolbar-group .btn-import a {
  color: inherit;
}

/* ── Participant tables (same look & feel as the Events list page) ── */
.ev-table-shell {
  :deep(.ant-table) {
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }
  :deep(.ant-table-thead > tr > th) {
    background: #f4fbf6;
    color: #2f6746;
    font-weight: 700;
    border-bottom: 1px solid #e1efe6;
  }
  :deep(.ant-table-tbody > tr > td) {
    border-bottom: 1px solid #f0f7f3;
  }
  :deep(.ant-table-tbody > tr:hover > td) {
    background: #f5fbf7;
  }
  :deep(.table-actions) {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
}

/* ── Participant tabs ── */
.ev-participant-tabs .ev-tab-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.ev-participant-tabs .ev-tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 7px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  background: #eef3f0;
  color: #2f6746;
}
.ev-participant-tabs .ev-tab-count.confirmed {
  background: #e3f7ec;
  color: #15693c;
}
.ev-participant-tabs .ev-tab-count.pending {
  background: #fdf6e3;
  color: #a9802a;
}

.cadre-list {
  list-style-type: none;
  padding: 0;
}

.cadre-list-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
}

@media (min-width: 769px) {
  .button-container {
    text-align: left;
    display: inline-block;
  }

  .button-container sdButton {
    margin: 5px;
  }
}
@media (max-width: 768px) {
  .button-container sdButton {
    margin: 5px 0;
    padding: 5px;
  }
  .ev-toolbar-group {
    justify-content: flex-start;
  }
  .ev-hero {
    padding: 16px;
  }
  .ev-hero-title {
    font-size: 19px;
  }
  .ev-hero-search {
    flex: 1 1 100%;
  }
}
/* ── Cards / Table view toggle (participants) — mirrors the Events list page ── */
.ev-view-toggle {
  display: inline-flex;
  background: #f0f7f3;
  border: 1px solid #d9f0e2;
  border-radius: 22px;
  padding: 3px;
  gap: 2px;
}
.ev-view-toggle .ev-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  color: #5f7268;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 18px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.ev-view-toggle .ev-toggle-btn.active {
  background: #fff;
  color: #15693c;
  box-shadow: 0 2px 6px rgba(28, 122, 72, 0.12);
}

/* ── Participant cards view ── */
.ev-participant-cards .ev-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px;
}
.ev-participant-cards .ev-card {
  background: #fff;
  border: 1px solid #e1efe6;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(28, 122, 72, 0.05);
}
.ev-participant-cards .ev-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}
.ev-participant-cards .ev-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #15693c;
  line-height: 1.3;
}
.ev-participant-cards .ev-card-code {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  color: #2f6746;
  background: #daf4e4;
  border: 1px solid #9ad8b4;
  border-radius: 12px;
  padding: 2px 10px;
}
.ev-participant-cards .ev-card-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
  margin-bottom: 14px;
}
.ev-participant-cards .ev-card-meta > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ev-participant-cards .ev-card-meta .lbl {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #7a8a82;
  font-weight: 600;
}
.ev-participant-cards .ev-card-meta .val {
  font-size: 13px;
  font-weight: 600;
  color: #2f3a35;
  word-break: break-word;
}
.ev-participant-cards .ev-card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed #e1efe6;
}
.ev-participant-cards .ev-card-actions .ant-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Participant bar: keep the toggle from stretching */
.ev-participant-bar .ev-view-toggle {
  flex: 0 0 auto;
}

@media (max-width: 575px) {
  .ev-participant-bar .ev-view-toggle {
    flex: 1 1 100%;
    width: 100%;
    justify-content: center;
  }
  .ev-participant-cards .ev-card-meta {
    grid-template-columns: 1fr;
  }
  .ev-participant-cards .ev-card-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .ev-participant-cards .ev-card-actions .ant-btn {
    width: 100%;
  }
}
/* ── Back button (event details) ── */
.ev-detail-back {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.event-detail-page .pill-btn {
  background: #fff !important;
  border: 1px solid #e1e6ec !important;
  color: #4d5661 !important;
  border-radius: 999px !important;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.event-detail-page .pill-btn:hover,
.event-detail-page .pill-btn:focus {
  border-color: #9ad8b4 !important;
  color: #15693c !important;
}

/* ── Register participant modal (host / facilitator) ── */
.ev-register-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ev-register-modal .ev-register-hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #4d5661;
}
.ev-register-modal .ev-register-feedback {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 10px;
  border-radius: 8px;
}
.ev-register-modal .ev-register-feedback.is-success {
  background: #f3fcf6;
  border: 1px solid #cdead9;
  color: #15693c;
}
.ev-register-modal .ev-register-feedback.is-info {
  background: #f4f8ff;
  border: 1px solid #cfe0ff;
  color: #1d4ed8;
}
.ev-register-modal .ev-register-feedback.is-error {
  background: #fff4f4;
  border: 1px solid #ffd4d4;
  color: #b42318;
}
.ev-register-modal .ev-register-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
}

/* ── Void participant modal (per confirmed day) ── */
.ev-void-loading {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 0;
  color: #4d5661;
  font-size: 13px;
}
.ev-void-empty {
  margin: 4px 0 0;
  font-size: 13px;
  color: #7d8c84;
}
.ev-void-day {
  padding: 6px 10px;
  border: 1px solid #e1e6ec;
  border-radius: 8px;
  margin-bottom: 6px;
  background: #fff;
}
.ev-void-summary {
  margin: 10px 0 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: #b42318;
}
</style>
