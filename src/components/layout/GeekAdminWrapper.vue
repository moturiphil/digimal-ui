<template>
  <div class="geek-admin-wrapper">
    <!-- Terminal-style Header -->
    <div class="terminal-header">
      <div class="terminal-controls">
        <span class="control-dot red"></span>
        <span class="control-dot yellow"></span>
        <span class="control-dot green"></span>
      </div>
      <div class="terminal-title">
        <a-icon type="code" class="terminal-icon" />
        <span class="terminal-text">{{ title }}</span>
        <span class="cursor-blink">_</span>
      </div>
      <div class="terminal-status">
        <span class="status-indicator"></span>
        <span class="status-text">SYSTEM ONLINE</span>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="geek-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "GeekAdminWrapper",
  props: {
    title: {
      type: String,
      default: "Admin Panel",
    },
  },
});
</script>

<style scoped>
/* Base Container */
.geek-admin-wrapper {
  min-height: 100vh;
  background: #f5f5f5;
  background-image: 
    linear-gradient(rgba(0, 100, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 100, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  color: #1a1a1a;
  font-family: 'Courier New', monospace;
}

/* Terminal Header */
.terminal-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  border-bottom: 3px solid #2563eb;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.terminal-controls {
  display: flex;
  gap: 8px;
}

.control-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-dot.red {
  background: #ff5f56;
  box-shadow: 0 0 10px #ff5f56;
}

.control-dot.yellow {
  background: #ffbd2e;
  box-shadow: 0 0 10px #ffbd2e;
}

.control-dot.green {
  background: #27c93f;
  box-shadow: 0 0 10px #27c93f;
}

.control-dot:hover {
  transform: scale(1.2);
}

.terminal-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.terminal-icon {
  font-size: 24px;
  color: #60a5fa;
}

.cursor-blink {
  animation: blink 1s step-end infinite;
  color: #60a5fa;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.terminal-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* Content Area */
.geek-content {
  padding: 24px;
  background: #f5f5f5;
}

/* Force white/light background on all child elements */
.geek-admin-wrapper :deep(*) {
  background-color: transparent;
}

.geek-admin-wrapper :deep(div),
.geek-admin-wrapper :deep(section) {
  background: transparent;
}

/* Global Geek Styles for Child Components */
.geek-admin-wrapper :deep(.ant-page-header) {
  background: #ffffff !important;
  border: 2px solid #2563eb;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.15);
}

.geek-admin-wrapper :deep(.ant-page-header-content) {
  background: #ffffff !important;
}

.geek-admin-wrapper :deep(.ant-page-header-heading) {
  background: #ffffff !important;
}

.geek-admin-wrapper :deep(.ant-page-header-heading-title) {
  color: #1e3a8a !important;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
  text-shadow: none;
}

/* Override any sdPageHeader styles */
.geek-admin-wrapper :deep(.sdPageHeader),
.geek-admin-wrapper :deep([class*="PageHeader"]) {
  background: #ffffff !important;
}

.geek-admin-wrapper :deep(.search-box) {
  background: transparent !important;
}

.geek-admin-wrapper :deep(.ant-input) {
  background: #ffffff !important;
  border: 2px solid #e5e7eb;
  color: #1f2937;
  border-radius: 6px;
}

.geek-admin-wrapper :deep(.ant-input::placeholder) {
  color: #9ca3af;
}

.geek-admin-wrapper :deep(.ant-input:hover),
.geek-admin-wrapper :deep(.ant-input:focus) {
  border-color: #2563eb;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.2);
}

.geek-admin-wrapper :deep(.ant-card) {
  background: #ffffff !important;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.geek-admin-wrapper :deep(.ant-card-body) {
  background: #ffffff !important;
}

.geek-admin-wrapper :deep(.ant-card-head) {
  background: #f9fafb !important;
  border-bottom: 2px solid #e5e7eb;
  color: #1f2937;
}

/* Override Main and wrapper components */
.geek-admin-wrapper :deep(main),
.geek-admin-wrapper :deep(.main-wrapper),
.geek-admin-wrapper :deep([class*="Main"]),
.geek-admin-wrapper :deep([class*="Wrapper"]) {
  background: #f5f5f5 !important;
}

.geek-admin-wrapper :deep(.ant-row) {
  background: transparent !important;
}

.geek-admin-wrapper :deep(.ant-col) {
  background: transparent !important;
}

.geek-admin-wrapper :deep(.ant-spin) {
  color: #2563eb;
}

.geek-admin-wrapper :deep(.ant-spin-dot-item) {
  background: #2563eb;
}

.geek-admin-wrapper :deep(.ant-table) {
  background: #0a0a0a !important;
  color: #00ff41;
}

.geek-admin-wrapper :deep(.ant-table-wrapper) {
  background: #0a0a0a !important;
}

.geek-admin-wrapper :deep(.ant-table-container) {
  background: #0a0a0a !important;
}

.geek-admin-wrapper :deep(.ant-table-content) {
  background: #0a0a0a !important;
}

.geek-admin-wrapper :deep(.table-responsive),
.geek-admin-wrapper :deep(.table-data-view),
.geek-admin-wrapper :deep([class*="TableWrapper"]),
.geek-admin-wrapper :deep([class*="Table"]) {
  background: #ffffff !important;
}

.geek-admin-wrapper :deep(.ant-table-thead > tr > th) {
  background: #f9fafb !important;
  border-bottom: 2px solid #e5e7eb;
  color: #1f2937 !important;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 11px;
}

.geek-admin-wrapper :deep(.ant-table-tbody > tr) {
  background: #ffffff !important;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.geek-admin-wrapper :deep(.ant-table-tbody > tr:hover) {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%) !important;
  border-left: 3px solid #2563eb;
}

.geek-admin-wrapper :deep(.ant-table-tbody > tr > td) {
  background: transparent !important;
  color: #1f2937 !important;
  border-bottom: 1px solid #e5e7eb;
}

.geek-admin-wrapper :deep(.ant-pagination) {
  margin-top: 24px;
}

.geek-admin-wrapper :deep(.ant-pagination-item) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.geek-admin-wrapper :deep(.ant-pagination-item a) {
  color: #1f2937;
}

.geek-admin-wrapper :deep(.ant-pagination-item:hover) {
  border-color: #2563eb;
  background: #eff6ff;
}

.geek-admin-wrapper :deep(.ant-pagination-item-active) {
  background: #2563eb;
  border-color: #2563eb;
}

.geek-admin-wrapper :deep(.ant-pagination-item-active a) {
  color: #ffffff;
}

.geek-admin-wrapper :deep(.ant-pagination-prev),
.geek-admin-wrapper :deep(.ant-pagination-next),
.geek-admin-wrapper :deep(.ant-pagination-jump-prev),
.geek-admin-wrapper :deep(.ant-pagination-jump-next) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.geek-admin-wrapper :deep(.ant-pagination-prev .ant-pagination-item-link),
.geek-admin-wrapper :deep(.ant-pagination-next .ant-pagination-item-link) {
  background: #ffffff;
  color: #1f2937;
  border: none;
}

.geek-admin-wrapper :deep(.ant-select-dropdown) {
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.geek-admin-wrapper :deep(.ant-select-item) {
  background: #ffffff;
  color: #1f2937;
}

.geek-admin-wrapper :deep(.ant-select-item-option-selected) {
  background: #eff6ff;
  color: #2563eb;
}

.geek-admin-wrapper :deep(.ant-select-item-option-active) {
  background: #f9fafb;
}

.geek-admin-wrapper :deep(.ant-btn-success),
.geek-admin-wrapper :deep(.btn-success) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: #ffffff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.geek-admin-wrapper :deep(.ant-btn-success:hover),
.geek-admin-wrapper :deep(.btn-success:hover) {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
  color: #ffffff;
}

.geek-admin-wrapper :deep(.ant-btn-warning),
.geek-admin-wrapper :deep(.btn-warning) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  color: #ffffff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.geek-admin-wrapper :deep(.ant-btn-warning:hover),
.geek-admin-wrapper :deep(.btn-warning:hover) {
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
  color: #ffffff;
}

.geek-admin-wrapper :deep(.ant-modal-content) {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
}

.geek-admin-wrapper :deep(.ant-modal-header) {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.geek-admin-wrapper :deep(.ant-modal-title) {
  color: #1f2937;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.geek-admin-wrapper :deep(.ant-modal-body) {
  background: #ffffff;
  color: #1f2937;
}

.geek-admin-wrapper :deep(.ant-modal-footer) {
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

.geek-admin-wrapper :deep(.ant-modal-close-x) {
  color: #1f2937;
}

/* Responsive Design */
@media (max-width: 992px) {
  .terminal-title {
    font-size: 16px;
  }

  .terminal-text {
    display: none;
  }
}

@media (max-width: 768px) {
  .geek-content {
    padding: 16px 12px;
  }

  .terminal-header {
    padding: 12px 16px;
  }

  .terminal-status {
    display: none;
  }
}
</style>
