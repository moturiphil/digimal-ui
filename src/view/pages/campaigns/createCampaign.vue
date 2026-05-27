<template>
  <div class="cmp-create-wrapper">
    <Main>
      <!-- Page header -->
      <div class="cmp-pageheader">
        <div class="cmp-pageheader-text">
          <span class="cmp-pageheader-icon">
            <sdFeatherIcons type="plus-circle" size="18" />
          </span>
          <div>
            <h2 class="cmp-pageheader-title">Create Campaign</h2>
            <!-- <p class="cmp-pageheader-sub">
              Set up a new campaign with its schedule. You can review or edit
              it later from the campaigns list.
            </p> -->
          </div>
        </div>
        <router-link to="/campaigns/view-campaign" class="cmp-ghost-btn">
          <sdFeatherIcons type="arrow-left" size="14" />
          <span>Back to campaigns</span>
        </router-link>
      </div>

      <!-- Form card -->
      <div class="form-card">
        <header class="form-card-head">
          <h3 class="form-card-title">Campaign details</h3>
          <p class="form-card-sub">
            Provide a clear name and the dates the campaign will run.
          </p>
        </header>

        <a-form
          class="cmp-form"
          layout="vertical"
          :model="formState"
          @finish="handleSubmit"
        >
          <a-form-item name="name" label="Campaign name" class="cmp-field">
            <a-input
              v-model:value="formState.name"
              size="large"
              placeholder="e.g. National Mass Net Distribution 2026"
              @blur="validate('name')"
            />
            <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
          </a-form-item>

          <div class="cmp-field-grid">
            <a-form-item name="startDate" label="Start date" class="cmp-field">
              <a-date-picker
                v-model:value="formState.startDate"
                size="large"
                :style="{ width: '100%' }"
                :format="dateFormat"
                :disabled-date="disabledStartDate"
                placeholder="Select start date"
                @change="onStartChange"
                @blur="validate('startDate')"
              />
              <p v-if="errors.startDate" class="field-error">
                {{ errors.startDate }}
              </p>
            </a-form-item>

            <a-form-item name="endDate" label="End date" class="cmp-field">
              <a-date-picker
                v-model:value="formState.endDate"
                size="large"
                :style="{ width: '100%' }"
                :format="dateFormat"
                :disabled-date="disabledEndDate"
                placeholder="Select end date"
                @blur="validate('endDate')"
              />
              <p v-if="errors.endDate" class="field-error">
                {{ errors.endDate }}
              </p>
            </a-form-item>
          </div>

          <!-- Summary chip -->
          <div v-if="summary" class="cmp-summary">
            <sdFeatherIcons type="calendar" size="14" class="summary-icon" />
            <span class="summary-text">
              Runs for
              <strong>{{ summary.days }} {{ summary.days === 1 ? 'day' : 'days' }}</strong>
              · {{ summary.start }} → {{ summary.end }}
            </span>
          </div>

          <div class="form-actions">
            <router-link to="/campaigns/view-campaign" class="cmp-cancel-btn">
              Cancel
            </router-link>
            <button
              type="submit"
              class="cmp-primary-btn"
              :disabled="isSubmitting"
            >
              <sdFeatherIcons
                v-if="!isSubmitting"
                type="check"
                size="14"
              />
              <span>{{ isSubmitting ? 'Saving…' : 'Create campaign' }}</span>
            </button>
          </div>
        </a-form>
      </div>
    </Main>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { Main } from '../../styled';
import authHeader from '../../../services/auth-header';

const dateFormat = 'YYYY-MM-DD';
const router = useRouter();
const API_URL = `${process.env.VUE_APP_BASE_URL}/createCampaign`;

const isSubmitting = ref(false);

const formState = reactive({
  name: '',
  startDate: null,
  endDate: null,
});

const errors = reactive({
  name: '',
  startDate: '',
  endDate: '',
});

const ArticleSchema = Yup.object().shape({
  name: Yup.string().trim().required('Campaign name is required'),
  startDate: Yup.mixed().required('Start date is required'),
  endDate: Yup.mixed()
    .required('End date is required')
    .test(
      'after-start',
      'End date must be on or after the start date',
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return dayjs(value).isSame(startDate, 'day') ||
          dayjs(value).isAfter(startDate, 'day');
      },
    ),
});

const validate = (field) => {
  ArticleSchema.validateAt(field, formState)
    .then(() => {
      errors[field] = '';
    })
    .catch((err) => {
      errors[err.path] = err.message;
    });
};

const disabledStartDate = (current) => {
  return current && current < dayjs().startOf('day');
};

const disabledEndDate = (current) => {
  if (!current) return false;
  if (formState.startDate) {
    return current < dayjs(formState.startDate).startOf('day');
  }
  return current < dayjs().startOf('day');
};

const onStartChange = () => {
  if (
    formState.startDate &&
    formState.endDate &&
    dayjs(formState.endDate).isBefore(formState.startDate, 'day')
  ) {
    formState.endDate = null;
  }
  validate('startDate');
};

const summary = computed(() => {
  if (!formState.startDate || !formState.endDate) return null;
  const start = dayjs(formState.startDate);
  const end = dayjs(formState.endDate);
  if (!start.isValid() || !end.isValid() || end.isBefore(start, 'day')) {
    return null;
  }
  return {
    days: end.diff(start, 'day') + 1,
    start: start.format('DD MMM YYYY'),
    end: end.format('DD MMM YYYY'),
  };
});

const handleSubmit = async () => {
  try {
    await ArticleSchema.validate(formState, { abortEarly: false });
    Object.keys(errors).forEach((k) => (errors[k] = ''));
  } catch (err) {
    if (err.inner) {
      err.inner.forEach((e) => {
        errors[e.path] = e.message;
      });
    }
    return;
  }

  const payload = {
    name: formState.name.trim(),
    start_date: dayjs(formState.startDate).format('YYYY-MM-DD'),
    end_date: dayjs(formState.endDate).format('YYYY-MM-DD'),
  };

  isSubmitting.value = true;
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data.success) {
      notification.success({
        message: 'Campaign created',
        description: 'The campaign was created successfully.',
        duration: 4.5,
      });
      router.push('/campaigns/view-campaign');
    } else {
      notification.error({
        message: 'Could not create campaign',
        description: data.message || 'Please review the form and try again.',
      });
    }
  } catch (error) {
    console.error('Create campaign error:', error);
    notification.error({
      message: 'Could not submit',
      description: 'An error occurred. Please try again later.',
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* ─── Wrapper ──────────────────────────────────────────── */
.cmp-create-wrapper {
  min-height: 100vh;
  background: #fafbfb;
  padding: 24px 28px 48px;
}

/* ─── Page header (matches campaigns list) ─────────────── */
.cmp-pageheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  padding: 8px 4px 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid #eef2f5;
}
.cmp-pageheader-text {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.cmp-pageheader-icon {
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
.cmp-pageheader-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1d2226;
  letter-spacing: 0.2px;
  line-height: 1.2;
}
.cmp-pageheader-sub {
  margin: 3px 0 0;
  font-size: 12px;
  color: #7a8a82;
  max-width: 640px;
  line-height: 1.5;
}

.cmp-ghost-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  background: #fff;
  color: #15693c !important;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #c9e6d3;
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.cmp-ghost-btn:hover {
  background: #eafff5;
  border-color: #1f9254;
}

/* ─── Form card ────────────────────────────────────────── */
.form-card {
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #eef2f5;
  border-radius: 14px;
  padding: 24px 28px 22px;
  box-shadow: 0 1px 2px rgba(20, 60, 38, 0.03);
  position: relative;
  overflow: hidden;
}
.form-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, #15693c, #1f9254, #36b16f);
}
.form-card-head {
  padding-bottom: 14px;
  margin-bottom: 6px;
  border-bottom: 1px dashed #eef2f5;
}
.form-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #1d2226;
  margin: 0;
  letter-spacing: 0.2px;
}
.form-card-sub {
  font-size: 12px;
  color: #7a8a82;
  margin: 4px 0 0;
}

/* ─── Form fields ──────────────────────────────────────── */
.cmp-form {
  width: 100%;
}
.cmp-field {
  margin-bottom: 16px;
}
.cmp-field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.field-error {
  margin: 4px 0 0;
  font-size: 12px;
  color: #c0392b;
  font-weight: 500;
}

:deep(.cmp-form .ant-form-item-label > label) {
  font-size: 12px;
  font-weight: 600;
  color: #4a5560;
  letter-spacing: 0.2px;
}
:deep(.cmp-form .ant-input),
:deep(.cmp-form .ant-picker) {
  border-radius: 8px;
  border-color: #e6ecef;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
:deep(.cmp-form .ant-input:hover),
:deep(.cmp-form .ant-picker:hover) {
  border-color: #c9e6d3;
}
:deep(.cmp-form .ant-input:focus),
:deep(.cmp-form .ant-input-focused),
:deep(.cmp-form .ant-picker-focused) {
  border-color: #1f9254;
  box-shadow: 0 0 0 3px rgba(31, 146, 84, 0.12);
}

/* ─── Summary chip ─────────────────────────────────────── */
.cmp-summary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #eafff5;
  border: 1px solid #c9e6d3;
  color: #15693c;
  font-size: 12.5px;
  font-weight: 600;
  margin: 2px 0 18px;
}
.cmp-summary .summary-icon {
  color: #1f9254;
}
.cmp-summary strong {
  font-weight: 700;
  color: #15693c;
}

/* ─── Form actions ─────────────────────────────────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding-top: 14px;
  margin-top: 6px;
  border-top: 1px dashed #eef2f5;
}

.cmp-cancel-btn {
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 16px;
  border-radius: 999px;
  background: #fff;
  color: #4a5560 !important;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #e6ecef;
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.cmp-cancel-btn:hover {
  background: #f5f6f8;
  border-color: #cfd6db;
}

.cmp-primary-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #15693c 0%, #1f9254 60%, #36b16f 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(20, 60, 38, 0.18);
  transition: filter 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease,
    opacity 0.15s ease;
}
.cmp-primary-btn:hover:not(:disabled),
.cmp-primary-btn:focus:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(20, 60, 38, 0.26);
}
.cmp-primary-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* ─── Responsive ──────────────────────────────────────── */
@media (max-width: 600px) {
  .cmp-create-wrapper {
    padding: 16px;
  }
  .form-card {
    padding: 20px;
  }
  .cmp-field-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .form-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }
  .cmp-cancel-btn,
  .cmp-primary-btn {
    justify-content: center;
  }
}
</style>
