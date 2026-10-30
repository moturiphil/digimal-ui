<template>
  <header class="me-pageheader">
    <div class="me-pageheader-text">
      <span class="me-pageheader-icon">
        <sdFeatherIcons :type="icon" size="18" />
      </span>
      <div>
        <h2 class="me-pageheader-title">{{ title }}</h2>
        <p v-if="subtitle" class="me-pageheader-sub">{{ subtitle }}</p>
      </div>
    </div>
    <div class="me-pageheader-actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  icon: { type: String, default: 'clipboard' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
});
</script>

<style scoped>
.me-pageheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding: 8px 4px 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid #eef2f5;
}
.me-pageheader-text {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.me-pageheader-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eafff5;
  border: 1px solid #c9e6d3;
  color: #15693c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.me-pageheader-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1d2226;
  letter-spacing: 0.2px;
  line-height: 1.2;
}
.me-pageheader-sub {
  margin: 3px 0 0;
  font-size: 12px;
  color: #7a8a82;
  max-width: 720px;
  line-height: 1.5;
}
.me-pageheader-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
