import Styled from 'vue3-styled-components';

/**
 * Shared shell for the M&E pages.
 *
 * Keeps the campaign palette (green: #15693c / #1f9254) and the page classes
 * used by every M&E screen, so each page only carries its own scoped rules.
 */
const MePageWrapper = Styled.div`
    min-height: 100vh;
    background: #fafbfb;
    padding: 24px 28px 48px;

    .me-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 12px;
        margin-bottom: 18px;
    }
    .me-stat {
        background: #fff;
        border: 1px solid #eef2f5;
        border-radius: 12px;
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .me-stat-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #7a8a82;
        font-weight: 600;
    }
    .me-stat-value {
        font-size: 24px;
        font-weight: 800;
        line-height: 1.1;
        color: #1d2226;
    }
    .me-stat-sub {
        font-size: 11px;
        color: #8a9399;
    }

    .me-card {
        background: #fff;
        border: 1px solid #eef2f5;
        border-radius: 14px;
        padding: 18px 20px;
        box-shadow: 0 1px 2px rgba(20, 60, 38, 0.03);
        margin-bottom: 14px;
    }
    .me-card-title {
        font-size: 14px;
        font-weight: 700;
        color: #1d2226;
        margin: 0 0 4px;
    }

    .me-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
    }
    .me-search {
        max-width: 320px;
    }
    .me-filter {
        min-width: 170px;
    }
    .me-result-count {
        font-size: 12px;
        color: #7a8a82;
        margin-left: auto;
    }

    .me-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 32px;
        padding: 0 14px;
        border-radius: 999px;
        background: #fff;
        color: #15693c;
        font-size: 12px;
        font-weight: 600;
        border: 1px solid #c9e6d3;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        text-decoration: none;
    }
    .me-btn:hover:not(:disabled) {
        background: #eafff5;
        border-color: #1f9254;
        color: #15693c;
    }
    .me-btn.is-primary {
        background: #15693c;
        border-color: #15693c;
        color: #fff;
    }
    .me-btn.is-primary:hover:not(:disabled) {
        background: #1f9254;
        border-color: #1f9254;
        color: #fff;
    }
    .me-btn.is-danger {
        color: #c0392b;
        border-color: #f3c2bd;
    }
    .me-btn.is-danger:hover:not(:disabled) {
        background: #fff1f1;
        border-color: #c0392b;
    }
    .me-btn:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }

    .me-tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }
    .me-empty {
        text-align: center;
        padding: 40px 20px;
        color: #7a8a82;
        background: #fff;
        border: 1px dashed #dfe7e2;
        border-radius: 14px;
    }
    .me-empty h3 {
        font-size: 15px;
        font-weight: 700;
        color: #1d2226;
        margin: 0 0 6px;
    }
    .me-muted {
        color: #7a8a82;
        font-size: 12.5px;
    }
    .me-error {
        color: #c0392b;
        font-size: 12px;
        font-weight: 500;
        margin: 4px 0 0;
    }
    .me-section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
    }
    .me-question {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px dashed #eef2f5;
    }
    .me-question:last-child {
        border-bottom: 0;
    }
    .me-question-text {
        flex: 1;
        font-size: 13px;
        color: #1d2226;
        line-height: 1.45;
    }
    .me-question-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }
    .me-inline-form {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-top: 10px;
    }
    .me-inline-form .ant-input {
        max-width: 420px;
    }

    @media (max-width: 600px) {
        padding: 16px;
        .me-search,
        .me-filter {
            width: 100%;
            max-width: none;
        }
        .me-result-count {
            margin-left: 0;
        }
    }
`;

export { MePageWrapper };
