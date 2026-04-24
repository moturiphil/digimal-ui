import Styled from 'vue3-styled-components';

const RecordViewWrapper = Styled.div`
  .btn-add_new {
    ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 10px;
    a {
      display: flex;
      align-items: center;
      svg, img, i {
        ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 6px;
      }
    }
  }
  .search-box {
    position: relative;
    input {
      border: 1px solid #e3e6ef;
      height: 40px;
      min-width: 260px;
      padding: 0 20px;
      border-radius: 8px;
      transition: border-color 0.2s;
      &:focus { outline: none; border-color: #5F63F2; box-shadow: 0 0 0 2px rgba(95,99,242,0.1); }
    }
  }
`;

/* ─────────────────────────────────────────────
   Stat Card  –  accent-colour variants via class
   ───────────────────────────────────────────── */
const StatCard = Styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 22px 24px 18px;
  box-shadow: 0 2px 12px rgba(39,43,65,0.07);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover { box-shadow: 0 6px 20px rgba(39,43,65,0.12); transform: translateY(-2px); }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    border-radius: 12px 12px 0 0;
    background: #e3e6ef;
  }
  &.primary::before  { background: linear-gradient(90deg, #5F63F2, #8b8ff8); }
  &.success::before  { background: linear-gradient(90deg, #20C997, #36ddb3); }
  &.warning::before  { background: linear-gradient(90deg, #FA8B0C, #fbb040); }
  &.danger::before   { background: linear-gradient(90deg, #FF4D4F, #ff7a7c); }
  &.info::before     { background: linear-gradient(90deg, #2C99FF, #5db8ff); }
  &.purple::before   { background: linear-gradient(90deg, #9254de, #b37feb); }

  .stat-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    margin-bottom: 14px;
    background: #f5f6ff;
  }
  &.primary .stat-icon  { background: #ebebff; color: #5F63F2; }
  &.success .stat-icon  { background: #e3faf3; color: #20C997; }
  &.warning .stat-icon  { background: #fff4e0; color: #FA8B0C; }
  &.danger  .stat-icon  { background: #fff1f1; color: #FF4D4F; }
  &.info    .stat-icon  { background: #e5f3ff; color: #2C99FF; }
  &.purple  .stat-icon  { background: #f3ebff; color: #9254de; }

  .stat-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #adb5c9;
    margin-bottom: 6px;
  }
  .stat-value {
    font-size: 30px;
    font-weight: 800;
    line-height: 1;
    color: #272B41;
    margin-bottom: 6px;
  }
  &.primary .stat-value { color: #5F63F2; }
  &.success .stat-value { color: #20C997; }
  &.warning .stat-value { color: #FA8B0C; }
  &.danger  .stat-value { color: #FF4D4F; }
  &.info    .stat-value { color: #2C99FF; }
  &.purple  .stat-value { color: #9254de; }

  .stat-sub {
    font-size: 12px;
    color: #adb5c9;
  }
  .stat-footer {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid #f0f2f5;
    font-size: 12px;
    color: #9299b8;
    display: flex; align-items: center; gap: 6px;
    .up   { color: #20C997; }
    .down { color: #FF4D4F; }
  }
`;

/* ─────────────────────────────────────────────
   Programme summary mini-card
   ───────────────────────────────────────────── */
const MiniStatCard = Styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 10px rgba(39,43,65,0.06);
  display: flex; align-items: center; gap: 16px;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 5px 18px rgba(39,43,65,0.10); }

  .mini-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .mini-body {
    flex: 1;
    .mini-value { font-size: 20px; font-weight: 800; color: #272B41; line-height: 1.1; }
    .mini-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: #adb5c9; margin-top: 3px; }
  }
`;

/* ─────────────────────────────────────────────
   Status badge  (span with :status prop)
   ───────────────────────────────────────────── */
const StatusBadge = Styled('span', ['status'])`
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  &::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }
  background: ${({ status }) =>
    status === 'approved'  ? '#eafff5' :
    status === 'submitted' ? '#e5f3ff' :
    status === 'generated' ? '#f3ebff' :
    status === 'referred'  ? '#fff4e5' :
    status === 'pending'   ? '#f5f6fb' : '#f5f6fb'};
  color: ${({ status }) =>
    status === 'approved'  ? '#20C997' :
    status === 'submitted' ? '#2C99FF' :
    status === 'generated' ? '#9254de' :
    status === 'referred'  ? '#FA8B0C' :
    status === 'pending'   ? '#9299b8' : '#9299b8'};
`;

/* ─────────────────────────────────────────────
   Budget status timeline / stepper area
   ───────────────────────────────────────────── */
const StatusTimeline = Styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 24px;
  overflow-x: auto;
  padding: 20px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(39,43,65,0.07);

  .step {
    display: flex; flex-direction: column; align-items: center;
    flex: 1; min-width: 80px;
    position: relative;
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 17px; left: calc(50% + 18px);
      right: calc(-50% + 18px);
      height: 2px;
      background: #e3e6ef;
      z-index: 0;
    }
    &.done:not(:last-child)::after   { background: #5F63F2; }
    &.active:not(:last-child)::after { background: linear-gradient(90deg, #5F63F2, #e3e6ef); }
  }
  .step-dot {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: #f0f2f5;
    border: 2px solid #e3e6ef;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    position: relative; z-index: 1;
    margin-bottom: 8px;
    transition: all 0.2s;
  }
  .step.done   .step-dot { background: #5F63F2; border-color: #5F63F2; color: #fff; }
  .step.active .step-dot { background: #fff; border-color: #5F63F2; color: #5F63F2; box-shadow: 0 0 0 4px rgba(95,99,242,0.15); }
  .step.warn   .step-dot { background: #fff; border-color: #FA8B0C; color: #FA8B0C; box-shadow: 0 0 0 4px rgba(250,139,12,0.15); }
  .step-label {
    font-size: 11px; font-weight: 600; text-align: center;
    color: #adb5c9; text-transform: uppercase; letter-spacing: 0.4px;
  }
  .step.done   .step-label { color: #5F63F2; }
  .step.active .step-label { color: #272B41; }
  .step.warn   .step-label { color: #FA8B0C; }
`;

/* ─────────────────────────────────────────────
   Action toolbar card
   ───────────────────────────────────────────── */
const ActionBar = Styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(39,43,65,0.07);
  margin-bottom: 20px;

  .action-bar-left  { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .action-bar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
`;

/* ─────────────────────────────────────────────
   Page-level wrapper with utility classes
   ───────────────────────────────────────────── */
const BudgetPageWrapper = Styled.div`
  .tool-bar {
    background: #eef3fb;
    padding: 10px 16px;
    border-radius: 4px;
    margin-bottom: 14px;
    .tool-bar-title {
      color: #2f6dcf;
      font-size: 13px;
      font-weight: 600;
    }
  }
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

  .budget-hero {
    background: linear-gradient(90deg, #0f9d58 0%, #27b36a 45%, #41c87b 100%);
    color: #fff;
    box-shadow: 0 12px 26px rgba(15,157,88,0.28);
    margin-bottom: 18px;
    border: 1px solid rgba(255,255,255,0.18);

    .hero-copy {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 3px;
    }
    .hero-eyebrow {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 700;
      opacity: 0.9;
    }
    .hero-title {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      line-height: 1.2;
    }
    .hero-subtitle {
      font-size: 13px;
      color: rgba(255,255,255,0.9);
    }
    .hero-actions {
      gap: 12px;
    }
    .hero-pill {
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.45);
      background: rgba(255,255,255,0.22);
      color: #fff !important;
      padding: 4px 12px;
      font-weight: 600;
    }
    .hero-pill span,
    .hero-pill .ant-tag-text {
      color: #fff !important;
    }
  }

  /* stat grid */
  .budget-stat-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 18px;
    margin-bottom: 24px;
  }
  .budget-mini-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .budget-mini-row-elegant {
    margin-top: 0;
  }

  .bp-mini {
    position: relative;
    overflow: hidden;
    border: 1px solid #eef0f9;
    box-shadow: 0 8px 20px rgba(39,43,65,0.08);
    transition: transform 0.2s, box-shadow 0.2s;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0.9;
      pointer-events: none;
      background: linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 100%);
    }
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 26px rgba(39,43,65,0.13);
    }

    .mini-icon, .mini-body {
      position: relative;
      z-index: 1;
    }

    .mini-label {
      color: #7f85a1;
      font-size: 10px;
      letter-spacing: 0.6px;
    }
    .mini-value-text {
      font-size: 14px;
      line-height: 1.35;
      font-weight: 700;
    }

    &.primary {
      background: linear-gradient(145deg, #ffffff 10%, #eef0ff 100%);
      .mini-icon { background: #e8eaff; color: #5F63F2; }
    }
    &.success {
      background: linear-gradient(145deg, #ffffff 10%, #eafbf4 100%);
      .mini-icon { background: #dcf7ec; color: #20C997; }
    }
    &.warning {
      background: linear-gradient(145deg, #ffffff 10%, #fff5e6 100%);
      .mini-icon { background: #fff0d8; color: #FA8B0C; }
    }
    &.info {
      background: linear-gradient(145deg, #ffffff 10%, #eaf4ff 100%);
      .mini-icon { background: #deefff; color: #2C99FF; }
    }
  }

  .budget-filter-bar {
    margin-top: 2px;
    margin-bottom: 16px;
    border: 1px solid #d9f0e2;
    box-shadow: 0 8px 18px rgba(28,122,72,0.10);
    background: linear-gradient(90deg, #f3fcf6 0%, #f9fffb 100%);

    .bp-search {
      width: 340px;
      max-width: 100%;
    }
    .bp-select {
      width: 190px;
      max-width: 100%;
    }
    .result-counter {
      font-size: 13px;
      color: #4d8a63;
      font-weight: 600;
    }
  }

  .bp-table-shell {
    border-radius: 14px;
    padding: 10px;
    background: linear-gradient(90deg, #f1fbf5 0%, #f8fff9 45%, #f4fcf6 100%);
    border: 1px solid #d9f0e2;

    .ant-table {
      border-radius: 10px;
      overflow: hidden;
      background: #fff;
    }
    .ant-table-thead > tr > th {
      background: #f4fbf6;
      color: #2f6746;
      font-weight: 700;
    }
    .ant-table-tbody > tr:hover > td {
      background: #f5fbf7;
    }
  }

  .bp-key-tag {
    border-radius: 14px;
    padding: 2px 10px;
    font-weight: 600;
    border: 1px solid #9ad8b4;
    background: linear-gradient(90deg, #daf4e4 0%, #e8fbef 100%);
    color: #15693c !important;
  }
  .bp-key-tag span,
  .bp-key-tag .ant-tag-text {
    color: #15693c !important;
  }

  .bp-money {
    color: #1f6b40;
    font-weight: 800;
    letter-spacing: 0.2px;
  }

  /* section heading */
  .section-title {
    font-size: 15px;
    font-weight: 700;
    color: #272B41;
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }

  /* computed parameters list */
  .computed-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f5f6fb;
    &:last-child { border-bottom: none; }
    .label { color: #5a5f7d; font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .value { font-weight: 700; color: #272B41; font-size: 14px; }
  }
  .computed-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 24px;
  }

  /* referral feedback banner */
  .referral-box {
    background: linear-gradient(135deg, #fff8e6 0%, #fffbf2 100%);
    border: 1px solid #ffd591;
    border-left: 4px solid #FA8B0C;
    border-radius: 10px;
    padding: 16px 20px;
    margin-bottom: 20px;
    display: flex; gap: 12px;
    .ref-icon  { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
    .ref-body  { flex: 1; }
    .ref-title { font-weight: 700; color: #FA8B0C; margin-bottom: 4px; font-size: 14px; }
    .ref-note  { color: #5a5f7d; font-size: 13px; line-height: 1.5; }
  }

  /* empty state */
  .empty-state {
    text-align: center; padding: 72px 0;
    .empty-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.3; }
    .empty-title { font-size: 18px; font-weight: 700; color: #272B41; margin-bottom: 8px; }
    .empty-desc { font-size: 13px; color: #9299b8; max-width: 360px; margin: 0 auto 24px; line-height: 1.6; }
  }

  /* summary items */
  .summary-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 8px;
    background: #f9fafb;
    &:last-child { margin-bottom: 0; }
    .si-label { font-size: 13px; color: #5a5f7d; display: flex; align-items: center; gap: 8px; }
    .si-value { font-size: 14px; font-weight: 700; color: #272B41; }
  }

  /* filter toolbar */
  .filter-bar {
    display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
    margin-bottom: 16px;
  }

  /* grand total bar */
  .grand-total-bar {
    background: linear-gradient(135deg, #5F63F2 0%, #8b8ff8 100%);
    color: #fff;
    border-radius: 10px;
    padding: 16px 24px;
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 16px;
    .gt-label { font-size: 14px; font-weight: 600; opacity: 0.9; }
    .gt-value { font-size: 26px; font-weight: 800; }
  }

  /* tag cloud */
  .tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0; }

  /* inline action icon buttons */
  .action-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s;
    color: #5a5f7d; font-size: 15px;
    &:hover { background: #f0f2f5; color: #5F63F2; }
    &.danger:hover  { background: #fff1f1; color: #FF4D4F; }
    &.success:hover { background: #e3faf3; color: #20C997; }
  }
`;

export { RecordViewWrapper, StatCard, MiniStatCard, StatusBadge, StatusTimeline, ActionBar, BudgetPageWrapper };
