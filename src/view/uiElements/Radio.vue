<template>
  <div>
    <sdPageHeader title="Radio">
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
        <a-col :md="12" :xs="24">
          <sdCards title="Basic">
            <a-radio>Radio</a-radio>
          </sdCards>
          <sdCards title="Disabled">
            <a-radio :default-checked="false" :disabled="true"> Disabled </a-radio>
            <br />
            <a-radio default-checked :disabled="true"> Disabled </a-radio>
          </sdCards>
          <sdCards title="Vertical Radio">
            <a-radio-group v-model="value" @change="onChange">
              <a-radio :style="radioStyle" :value="1"> Option A </a-radio>
              <a-radio :style="radioStyle" :value="2"> Option B </a-radio>
              <a-radio :style="radioStyle" :value="3"> Option C </a-radio>
              <a-radio :style="radioStyle" :value="4">
                Others..
                <a-input v-if="value === 4" :style="{ width: 100, marginLeft: 10 }" />
              </a-radio>
            </a-radio-group>
          </sdCards>
          <sdCards title="Radio Size">
            <div>
              <a-radio-group default-value="a" size="large">
                <a-radio-button value="a"> Hangzhou </a-radio-button>
                <a-radio-button value="b"> Shanghai </a-radio-button>
                <a-radio-button value="c"> Beijing </a-radio-button>
                <a-radio-button value="d"> Chengdu </a-radio-button>
              </a-radio-group>
            </div>
            <div :style="{ marginTop: '16px' }">
              <a-radio-group default-value="a">
                <a-radio-button value="a"> Hangzhou </a-radio-button>
                <a-radio-button value="b"> Shanghai </a-radio-button>
                <a-radio-button value="c"> Beijing </a-radio-button>
                <a-radio-button value="d"> Chengdu </a-radio-button>
              </a-radio-group>
            </div>
            <div :style="{ marginTop: '16px' }">
              <a-radio-group default-value="a" size="small">
                <a-radio-button value="a"> Hangzhou </a-radio-button>
                <a-radio-button value="b"> Shanghai </a-radio-button>
                <a-radio-button value="c"> Beijing </a-radio-button>
                <a-radio-button value="d"> Chengdu </a-radio-button>
              </a-radio-group>
            </div>
          </sdCards>
        </a-col>
        <a-col :md="12" :xs="24">
          <sdCards title="Radio Style">
            <div>
              <a-radio-group v-model="value" @change="onChange">
                <a-radio-button value="a"> Hangzhou </a-radio-button>
                <a-radio-button value="b"> Shanghai </a-radio-button>
                <a-radio-button value="c"> Beijing </a-radio-button>
                <a-radio-button value="d"> Chengdu </a-radio-button>
              </a-radio-group>
            </div>
            <div :style="{ marginTop: '16px' }">
              <a-radio-group default-value="a" @change="onChange">
                <a-radio-button value="a"> Hangzhou </a-radio-button>
                <a-radio-button value="b" disabled> Shanghai </a-radio-button>
                <a-radio-button value="c"> Beijing </a-radio-button>
                <a-radio-button value="d"> Chengdu </a-radio-button>
              </a-radio-group>
            </div>
            <div :style="{ marginTop: '16px' }">
              <a-radio-group disabled default-value="a" @change="onChange">
                <a-radio-button value="a"> Hangzhou </a-radio-button>
                <a-radio-button value="b"> Shanghai </a-radio-button>
                <a-radio-button value="c"> Beijing </a-radio-button>
                <a-radio-button value="d"> Chengdu </a-radio-button>
              </a-radio-group>
            </div>
          </sdCards>
          <sdCards title="Horizontal Radio">
            <a-radio-group v-model="value" @change="onChange">
              <a-radio :value="1"> A </a-radio>
              <a-radio :value="2"> B </a-radio>
              <a-radio :value="3"> C </a-radio>
              <a-radio :value="4"> D </a-radio>
            </a-radio-group>
          </sdCards>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from '../styled';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Radio',
  components: {
    Main,
  },
  data() {
    return {
      value: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
    };
  },
  methods: {
    onChange(e) {
      console.log('radio checked', e.target.value);
    },
  },
});
</script>
