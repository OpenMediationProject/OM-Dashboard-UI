<template>
  <div>
    <om-form-model
      :label="$t('placements.frequencyCap')"
      :colon="false"
      :fill="false"
      :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
      style="margin-bottom: 0;">
      {{ $t('placements.limitto') }} <a-input-number
        type="number"
        size="small"
        :min="0"
        :disabled="!record.editStatus"
        :max="9999"
        style="width:66px;"
        v-model="instanceInfo_inner.frequencyCap"/> {{ $t('placements.impressionsPer') }}
      <a-input-number
        type="number"
        size="small"
        :disabled="!record.editStatus"
        :min="1"
        :max="24"
        style="width:50px;"
        v-model="instanceInfo_inner.frequencyUnit"/> {{ $t('placements.hours') }}
    </om-form-model>
    <om-form-model
      style="margin-bottom: 0;"
      :label="$t('placements.Pacing')"
      :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
      :fill="false"
      :colon="false">
      {{ $t('placements.show_a_tip') }}<a-input-number
        type="number"
        :disabled="!record.editStatus"
        size="small"
        :min="0"
        :max="1440"
        style="width:66px;"
        v-model="instanceInfo_inner.frequencyInterval"/> {{ $t('placements.minutes') }}
    </om-form-model>
    <om-form-model
      style="margin-bottom: 0;"
      :label="$t('placements.deviceBrand')"
      :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
      :fill="false"
      :colon="false">
      <a-input-group compact style="margin-top:6px;">
        <a-select :disabled="!record.editStatus" v-model="instanceInfo_inner.brandType" style="width: 100px" >
          <a-select-option value="include">{{ $t('placements.include') }}</a-select-option>
          <a-select-option value="exclude">{{ $t('placements.exclude') }}</a-select-option>
        </a-select>
        <a-select
          :disabled="!record.editStatus"
          style="width: 300px"
          @search="selectBrand"
          @change="handleChange"
          :filterOption="false"
          :notFoundContent="fetching ? undefined : null"
          v-model="instanceInfo_inner.brandList"
          mode="multiple">
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="d in deviceData" :key="d.value">{{ d.text }}</a-select-option>
        </a-select>
      </a-input-group>
    </om-form-model>
    <om-form-model
      style="margin-bottom: 32px;"
      :label="$t('placements.deviceModel')"
      :labelCol="{ lg: { span: 6 }, sm: { span: 6 } }"
      :colon="false"
      :fill="false">
      <a-input-group compact style="margin-top:6px;">
        <a-select :disabled="!record.editStatus" v-model="instanceInfo_inner.modelType" style="width: 100px" >
          <a-select-option value="include">{{ $t('placements.include') }}</a-select-option>
          <a-select-option value="exclude">{{ $t('placements.exclude') }}</a-select-option>
        </a-select>
        <a-select
          style="width: 300px"
          @search="selectModel"
          :disabled="!record.editStatus"
          @change="handleChange"
          :filterOption="false"
          :notFoundContent="fetching ? undefined : null"
          v-model="instanceInfo_inner.modelList"
          mode="multiple">
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="d in deviceData" :key="d.value">{{ d.text }}</a-select-option>
        </a-select>
      </a-input-group>
    </om-form-model>
  </div>
</template>

<script>
import OmFormModel from '@/components/OmFormModel'
import { modelSearch, brandSearch } from '@/api/publisher'

export default {
  components: {
    OmFormModel
  },
  props: {
    instanceInfo: {
      type: Object,
      required: true,
      default: null
    },
    record: {
      type: Object,
      required: true,
      default: null
    }
  },
  data () {
    return {
      deviceData: [],
      lastFetchId: 0,
      fetching: false,
      instanceInfo_inner: this.instanceInfo
    }
  },
  watch: {
    instanceInfo_inner () {
      this.$emit('instanceInfoChange', this.instanceInfo_inner)
    }
  },
  methods: {
    handleChange () {},
    selectBrand (value) {
      this.deviceData = []
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.fetching = true
      brandSearch({ brand: value }).then(res => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        this.deviceData = Object.keys(res.data).map(key => ({
          text: `${key}`,
          value: key
        }))
        this.fetching = false
      })
    },
    selectModel (value) {
      this.deviceData = []
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.fetching = true
      modelSearch({ model: value }).then(res => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        this.deviceData = Object.keys(res.data).map(key => ({
          text: `${key}`,
          value: key
        }))
        this.fetching = false
      })
    }
  }
}

</script>

<style lang='less' scoped>
</style>
