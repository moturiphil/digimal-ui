import Styled from 'vue3-styled-components';

/* Re-export shared design primitives from the budget module so the
   procurement pages share the same look-and-feel. */
export {
  RecordViewWrapper,
  StatusBadge,
  ActionBar,
  BudgetPageWrapper,
} from '../budget/style';

/*
  Procurement page wrapper – mirrors the compact `bp-min` panel design
  used in `Budgeting.vue` and `CountyBudgeting.vue` (green accent,
  minimal panels, pill buttons, subtle minimal-table). Apply
  `class="bp-min"` on the wrapper for the same look as the budget pages.
*/
export const ProcurementPageWrapper = Styled.div`
  /* ── Header ── */
  .bp-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .bp-title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #1f2437;
    display: flex;
    align-items: center;
    gap: 8px;
    .bp-icon { color: #15693c; font-size: 16px; }
  }
  .bp-sub {
    margin: 2px 0 0;
    font-size: 12px;
    color: #7a8a82;
  }
  .bp-head-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .stage-tag {
    background: #eef3fb;
    color: #2f6dcf;
    border: 1px solid #d7e3f5;
    border-radius: 12px;
    padding: 2px 12px;
    font-size: 11px;
    font-weight: 600;
  }
  .stage-tag.green {
    background: #eafff5;
    color: #15693c;
    border-color: #c9e6d3;
  }
  .stage-tag.warn {
    background: #fff8eb;
    color: #b35a00;
    border-color: #f3c97c;
  }

  /* ── Breadcrumb ── */
  .bp-crumb {
    margin-bottom: 8px;
    font-size: 12px;
    .crumb-link {
      color: #15693c;
      cursor: pointer;
      font-weight: 600;
      &:hover { text-decoration: underline; }
    }
    .crumb-sep { color: #b8c2c8; margin: 0 6px; }
    .crumb-here { color: #1f2437; font-weight: 700; }
  }

  /* ── Summary bar ── */
  .bp-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px 14px;
    margin-bottom: 12px;
    background: #fff;
    border: 1px solid #e6ecef;
    border-radius: 10px;
  }
  .bp-totals {
    display: flex;
    gap: 22px;
    flex-wrap: wrap;
    > div {
      display: flex;
      flex-direction: column;
      .lbl {
        font-size: 10px;
        color: #9aa6ad;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        font-weight: 600;
      }
      strong {
        font-size: 13px;
        color: #15693c;
        font-weight: 800;
        &.warn { color: #d97706; }
        &.danger { color: #c43d3d; }
        &.muted { color: #4d5661; }
      }
    }
  }
  .bp-tools {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    .bp-search { width: 200px; }
    .bp-select { width: 160px; }
  }

  /* ── Page heading (platform theme — matches the events/budget pages) ── */
  .page-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin: 4px 2px 18px;
    .ph-left { min-width: 0; }
    .ph-title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1f2437;
      display: flex;
      align-items: center;
      gap: 8px;
      .ph-icon { color: #1f2437; font-size: 18px; }
    }
    .ph-subtitle {
      margin: 4px 0 0;
      font-size: 12px;
      color: #8a90a6;
    }
    .ph-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
  }

  /* ── Panel base ── */
  .panel {
    background: #fff;
    border: 1px solid #e6ecef;
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 6px rgba(28,122,72,0.04);
  }
  .panel.center {
    text-align: center;
    padding: 24px 0;
    color: #7a8a82;
    font-size: 12px;
    a { color: #15693c; font-weight: 600; margin-left: 4px; }
  }
  .panel.center.small { padding: 14px 0; }
  .panel.center.muted { color: #9aa6ad; }
  .panel.flush { padding: 0; overflow: hidden; }

  .panel-title {
    font-size: 13px;
    font-weight: 700;
    color: #2f6746;
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    .pt-count {
      font-size: 10px;
      letter-spacing: 0.3px;
      background: #eafff5;
      color: #15693c;
      padding: 1px 8px;
      border-radius: 10px;
      font-weight: 700;
    }
  }

  /* ── Pill buttons (Budgeting style) ── */
  .pill-btn {
    background: #fff !important;
    border: 1px solid #e1e6ec !important;
    color: #4d5661 !important;
    border-radius: 6px;
    font-weight: 600;
    &:hover, &:focus {
      border-color: #9ad8b4 !important;
      color: #15693c !important;
    }
    &.is-primary {
      background: #1f9254 !important;
      border-color: #1f9254 !important;
      color: #fff !important;
      &:hover, &:focus {
        background: #167a45 !important;
        border-color: #167a45 !important;
        color: #fff !important;
      }
    }
    &.is-danger:hover {
      border-color: #ffa39e !important;
      color: #c43d3d !important;
    }
  }

  /* ── Filter row (inline, no card) ── */
  .filter-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
    .result-counter {
      font-size: 12px;
      color: #4d8a63;
      font-weight: 600;
      margin-left: auto;
    }
  }

  /* ── Vendor list table ── */
  .vendor-link {
    font-weight: 700;
    color: #1f2437;
    cursor: pointer;
    &:hover { color: #15693c; }
  }
  .vendor-meta {
    font-size: 11px;
    color: #8a90a6;
    margin-top: 2px;
  }
  .muted { font-size: 12px; color: #8a90a6; }
  .expired { color: #c43d3d; font-weight: 700; }

  /* ── Inline action icons ── */
  .action-icon {
    width: 28px; height: 28px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center; justify-content: center;
    cursor: pointer;
    color: #5a6470;
    transition: background 0.15s, color 0.15s;
    &:hover { background: #f0f5f2; color: #15693c; }
    &.danger:hover { background: #fff1f1; color: #c43d3d; }
    &.success:hover { background: #eafff5; color: #1f9254; }
    & + .action-icon { margin-left: 2px; }
  }

  /* ── Minimal table (matches activity-table look) ── */
  :deep(.minimal-table) {
    .ant-table {
      background: #fff;
    }
    .ant-table-thead > tr > th {
      background: #fff;
      border-bottom: 1px solid #eaf0ee;
      color: #8a9399;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .ant-table-tbody > tr > td {
      font-size: 12px;
      color: #2f3742;
      border-bottom: 1px solid #f1f5f3;
    }
    .ant-table-tbody > tr:hover > td { background: #fafcfb; }
  }

  /* ── Status / category chips ── */
  .v-chip {
    display: inline-block;
    background: #eef3fb;
    color: #2f6dcf;
    border: 1px solid #d7e3f5;
    border-radius: 10px;
    padding: 1px 9px;
    font-size: 11px;
    font-weight: 600;
    line-height: 18px;
    &.green { background: #eafff5; color: #15693c; border-color: #c9e6d3; }
    &.purple { background: #f3ebff; color: #6f3fcc; border-color: #d8c5f5; }
    &.warn { background: #fff4e0; color: #b35a00; border-color: #f3c97c; }
    &.muted { background: #f0f2f5; color: #7a8a82; border-color: #e1e6ec; }
  }

  /* ── Vendor detail info grid ── */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px 24px;
  }
  .info-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px 0;
    border-bottom: 1px solid #f3f5f4;
    &:last-child { border-bottom: none; }
    .info-label {
      font-size: 10px;
      color: #9aa6ad;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      font-weight: 600;
    }
    .info-value {
      font-size: 13px;
      color: #1f2437;
      font-weight: 600;
      word-break: break-word;
    }
    &.danger .info-value { color: #c43d3d; }
    &.warn .info-value { color: #b35a00; }
  }

  /* ── Tabs (slim, green ink-bar) ── */
  .vendor-tabs :deep(.ant-tabs-nav) {
    margin: 0 0 10px;
    &::before { border-bottom-color: #eaf0ee; }
  }
  .vendor-tabs :deep(.ant-tabs-tab) {
    font-weight: 600;
    color: #5a6470;
    font-size: 13px;
    padding: 8px 14px;
  }
  .vendor-tabs :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: #15693c !important;
  }
  .vendor-tabs :deep(.ant-tabs-ink-bar) {
    background: #1f9254;
  }
  .vendor-tabs :deep(.ant-tabs-tab .ant-tag) {
    margin-left: 6px;
    background: #eafff5;
    color: #15693c;
    border-color: #c9e6d3;
    border-radius: 8px;
    font-size: 10px;
    line-height: 16px;
    padding: 0 6px;
  }

  /* ── LSO list (compact rows, not heavy cards) ── */
  .lso-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .lso-row {
    display: grid;
    grid-template-columns: minmax(140px, 1fr) minmax(160px, 1.2fr) minmax(180px, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: #fff;
    border: 1px solid #e6ecef;
    border-radius: 8px;
    transition: border-color 0.15s, box-shadow 0.15s;
    &:hover {
      border-color: #c9e6d3;
      box-shadow: 0 4px 10px rgba(28,122,72,0.08);
    }
    &.is-expired {
      border-color: #ffd1d1;
      background: #fff8f8;
    }
    .lso-number {
      font-weight: 700;
      color: #1f2437;
      font-size: 13px;
      .lso-status {
        margin-left: 6px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        padding: 1px 7px;
        border-radius: 8px;
        background: #eafff5;
        color: #15693c;
        border: 1px solid #c9e6d3;
      }
      &.is-expired .lso-status {
        background: #fff1f1;
        color: #c43d3d;
        border-color: #ffd1d1;
      }
    }
    .lso-service {
      font-size: 12px;
      color: #2f6746;
      font-weight: 600;
    }
    .lso-dates {
      font-size: 11px;
      color: #5a6470;
      .ld-row { display: flex; gap: 6px; }
      .ld-label { color: #9aa6ad; min-width: 48px; }
      .ld-value { color: #2f3742; font-weight: 600; }
      .expired-pill {
        margin-left: 4px;
        background: #fff1f1;
        color: #c43d3d;
        font-size: 10px;
        padding: 0 6px;
        border-radius: 8px;
        font-weight: 700;
      }
    }
    .lso-actions {
      display: flex;
      gap: 4px;
    }
  }
  .lso-notes-line {
    grid-column: 1 / -1;
    font-size: 11px;
    color: #5a6470;
    padding: 6px 8px;
    background: #f9faf8;
    border-radius: 6px;
    margin-top: -2px;
  }

  /* ── Empty state ── */
  .empty-state {
    text-align: center;
    padding: 40px 16px;
    color: #9aa6ad;
    .empty-icon { font-size: 38px; opacity: 0.4; margin-bottom: 8px; }
    .empty-title { font-size: 14px; font-weight: 700; color: #4d5661; margin-bottom: 4px; }
    .empty-desc { font-size: 12px; max-width: 320px; margin: 0 auto 12px; line-height: 1.5; }
  }

  /* ── Action row at bottom ── */
  .action-row {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 14px;
    background: #fff;
    border: 1px solid #e6ecef;
    border-radius: 10px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
`;
