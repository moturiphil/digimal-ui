<template>
  <sdPageHeader title="Finance Dashboard">
    <template v-slot:buttons>
      <div class="page-header-actions">
        <sdCalendarButton />
        <sdExportButton />
        <sdShareButton />
        <sdButton size="small" type="primary">
          <sdFeatherIcons type="plus" size="14" />
          Add New
        </sdButton>
      </div>
    </template>
  </sdPageHeader>
  <Main>
    <a-row :gutter="25">
      <a-col :xxl="12" :xs="24">
        <Suspense>
          <template #default>
            <CardGroup />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :xxl="12" :xs="24">
        <Suspense>
          <template #default>
            <CashFlow />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <a-col :md="24">
        <Suspense>
          <template #default>
            <IncomeAndExpenses />
          </template>
          <template #fallback>
            <sdCards headless>
              <a-skeleton active />
            </sdCards>
          </template>
        </Suspense>
      </a-col>
      <Suspense>
        <template #default>
          <AccountGroup />
        </template>
        <template #fallback>
          <sdCards headless>
            <a-skeleton active />
          </sdCards>
        </template>
      </Suspense>
    </a-row>
  </Main>
</template>
<script>
import { Main } from '../styled';
import { defineAsyncComponent } from 'vue';

const CardGroup = defineAsyncComponent(() => import('./overview/business/CardGroup'));
const CashFlow = defineAsyncComponent(() => import('./overview/business/CashFlow'));
const IncomeAndExpenses = defineAsyncComponent(() => import('./overview/business/IncomeAndExpenses'));
const AccountGroup = defineAsyncComponent(() => import('./overview/business/AccountGroup'));

const Business = {
  name: 'Business',
  components: {
    Main,
    CardGroup,
    CashFlow,
    IncomeAndExpenses,
    AccountGroup,
  },
};

export default Business;
</script>
