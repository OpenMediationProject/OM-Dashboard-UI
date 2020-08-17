<template>
  <a-form :form="form" :hideRequiredMark="true">
    <a v-if="canEdit" @click="placementSave" style="position: absolute;right: 50px;top: 80px;"><img width="24px" src="/icon/save.svg" /></a>
    <a-card v-if="[0,1].includes(placementType)" class="card-noline om-card-style" style="padding-bottom: 16px;padding-top:24px;background:#FFFFFF; margin-top:8px;" title="" :bordered="false">
      <om-form
        :form="form"
        label="Fan out"
        :edit="canEdit"
        field="fanOut"
        :showTip="false" >
        <a-radio-group :disabled="!canEdit" v-decorator="['fanOut']" :default-value="1">
          <a-radio :value="1">
            ON
          </a-radio>
          <a-radio :value="0">
            OFF
          </a-radio>
        </a-radio-group>
      </om-form>
      <om-form :form="form" label="Batch Size" field="batchSize" tip="Batch Size">
        <a-input-number
          style="width:100%"
          ref="iap-min"
          type="number"
          :min="1"
          :max="5"
          v-decorator="['batchSize', { rules: [{ required: true, message: 'Pool Size can not be empty.'}] }]"/>
      </om-form>
      <om-form :form="form" label="Preload Timeout(s)" field="preloadTimeout" tip="Preload Timeout(s)" >
        <a-input-number
          style="width:100%"
          ref="iap-min"
          type="number"
          :min="1"
          :max="120"
          v-decorator="['preloadTimeout', { rules: [{ required: true, message: 'Pool Size can not be empty.'}] }]"/>
      </om-form>
    </a-card>
    <a-card v-else class="card-noline om-card-style" style="padding-bottom: 16px;padding-top:24px;background:#FFFFFF; margin-top:8px;" title="" :bordered="false">
      <om-form :form="form" label="Pool Size" field="inventoryCount" tip="Pool Size">
        <a-input-number
          style="width:100%"
          type="number"
          :min="2"
          :max="20"
          v-decorator="['inventoryCount', { rules: [{ required: true, message: 'Pool Size can not be empty.'}] }]"/>
      </om-form>
      <om-form :form="form" label="Preload Timeout(s)" field="preloadTimeout" tip="Preload Timeout(s)" >
        <a-input-number
          style="width:100%"
          ref="iap-min"
          type="number"
          :min="1"
          :max="120"
          v-decorator="['preloadTimeout', { rules: [{ required: true, message: 'Pool Size can not be empty.'}] }]"/>
      </om-form>
      <om-form :form="form" label="Inventory Interval" field="iventoryInterval" tip="Inventory Interval" >
        <a-input-number
          style="width:100%"
          ref="iap-min"
          type="number"
          :min="30"
          v-decorator="['inventoryInterval', { rules: [{ required: true, message: 'Inventory Interval can not be empty.'}] }]"/>
      </om-form>
      <om-form :form="form" label="Max Concurrency" field="batchSize" tip="Max Concurrency">
        <a-input-number
          style="width:100%"
          type="number"
          :min="1"
          v-decorator="['batchSize', { rules: [{ required: true, message: 'Max Concurrency can not be empty.'}] }]"/>
      </om-form>
    </a-card>
  </a-form>
</template>

<script>
import { placementGet, placementUpdate } from '@/api/publisher'
import OmForm from '@/components/OmForm'
import OmText from '@/components/om/Text'
import pick from 'lodash.pick'

import { mapState } from 'vuex'

export default {
  name: 'MediationSettings',
  components: {
    OmForm,
    OmText
  },
  data () {
    return {
      form: this.$form.createForm(this),
      canEdit: this.$auth('mediation.edit'),
      id: this.$route.params.id,
      spinning: true,
      placementType: null
    }
  },
  computed: mapState({
    searchPlacement: state => state.publisher.searchPlacement
  }),
  watch: {
    searchPlacement () {
      this.placementInfo()
    }
  },
  created () {
    this.placementInfo()
  },
  methods: {
    placementSave () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          values.id = this.searchPlacement
          placementUpdate(values).then(res => {
            if (res.code === 0) {
              this.$message.success(this.$msg('placement.update_success'))
              this.$router.push({
                name: 'MediationList',
                query: {
                  type: '2'
                }
              })
            }
          })
        }
      })
    },
    placementInfo () {
      placementGet({ placementId: this.searchPlacement }).then(res => {
        if (res.code === 0) {
          this.placementType = res.data.adType
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.data, ['batchSize', 'preloadTimeout', 'inventoryCount', 'fanOut', 'inventoryInterval', 'maxConcurrency']))
          })
        }
      }).finally(() => {
        this.spinning = false
      })
    }
  }
}
</script>

<style type="less" scoped>
</style>
