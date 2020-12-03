<template>
  <a-form-model ref="form" :model="form" :rules="rules" :hideRequiredMark="true">
    <OmPageAction :has-change="hasChange" @save="placementSave" :canEdit="canEdit"/>
    <div v-if="spinning"></div>
    <div v-else>
      <a-card v-if="[0,1].includes(placementType)" class="card-noline om-card-style" style="padding-bottom: 16px;padding-top:24px;background:#FFFFFF; margin-top:8px;" title="" :bordered="false">
        <om-form-model
          label="Fan out"
          :edit="canEdit"
          field="fanOut"
          :showTip="false" >
          <a-radio-group :disabled="!canEdit" v-model="form.fanOut">
            <a-radio :value="1">
              ON
            </a-radio>
            <a-radio :value="0">
              OFF
            </a-radio>
          </a-radio-group>
        </om-form-model>
        <om-form-model label="Batch Size" field="batchSize">
          <a-input-number
            style="width:100%"
            ref="iap-min"
            type="number"
            :min="1"
            :max="5"
            v-model="form.batchSize"/>
        </om-form-model>
        <om-form-model label="Preload Timeout(s)" field="preloadTimeout" >
          <a-input-number
            style="width:100%"
            ref="iap-min"
            type="number"
            :min="1"
            :max="120"
            v-model="form.preloadTimeout"/>
        </om-form-model>
      </a-card>
      <a-card v-else class="card-noline om-card-style" style="padding-bottom: 16px;padding-top:24px;background:#FFFFFF; margin-top:8px;" title="" :bordered="false">
        <om-form-model label="Pool Size" field="inventoryCount">
          <a-input-number
            style="width:100%"
            type="number"
            :min="2"
            :max="20"
            v-model="form.inventoryCount"/>
        </om-form-model>
        <om-form-model label="Preload Timeout(s)" field="preloadTimeout" >
          <a-input-number
            style="width:100%"
            ref="iap-min"
            type="number"
            :min="1"
            :max="120"
            v-model="form.preloadTimeout"/>
        </om-form-model>
        <om-form-model label="Inventory Interval" field="inventoryInterval" >
          <a-input-number
            style="width:100%"
            ref="iap-min"
            type="number"
            :min="30"
            v-model="form.inventoryInterval"/>
        </om-form-model>
        <om-form-model label="Max Concurrency" field="batchSize">
          <a-input-number
            style="width:100%"
            type="number"
            :min="1"
            v-model="form.batchSize"/>
        </om-form-model>
      </a-card>
    </div>
  </a-form-model>
</template>

<script>
import { placementGet, placementUpdate } from '@/api/publisher'
import OmFormModel from '@/components/OmFormModel'
import OmText from '@/components/om/Text'
import OmPageAction from '@/components/OmPageAction'

import { mapState } from 'vuex'

export default {
  name: 'MediationSettings',
  components: {
    OmFormModel,
    OmText,
    OmPageAction
  },
  data () {
    return {
      form: {
        fanOut: 1,
        batchSize: undefined,
        preloadTimeout: undefined,
        inventoryInterval: undefined,
        inventoryCount: undefined
      },
      rules: {
        batchSize: [
          { required: true, message: 'Pool Size can not be empty.', trigger: 'change' }
        ],
        preloadTimeout: [
          { required: true, message: 'Pool Size can not be empty.', trigger: 'change' }
        ],
        iventoryInterval: [
          { required: true, message: 'Inventory Interval can not be empty.', trigger: 'change' }
        ]
      },
      canEdit: this.$auth('mediation.edit'),
      id: this.$route.params.id,
      spinning: true,
      placementType: null,
      oldData: {}
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
    hasChange () {
      const temp = { ...this.form }
      const { batchSize, preloadTimeout, inventoryCount, fanOut, inventoryInterval } = { ...this.oldData }
      try {
        if (temp.preloadTimeout !== preloadTimeout) {
          return true
        }
        if ([0, 1].includes(this.placementType)) {
          if (temp.fanOut !== fanOut) {
            return true
          }
          if (temp.batchSize && temp.batchSize !== batchSize) {
            return true
          }
        } else {
          if (temp.inventoryCount !== inventoryCount) {
            return true
          }
          if (temp.inventoryInterval !== inventoryInterval) {
            return true
          }
          if (temp.batchSize && temp.batchSize !== batchSize) {
            return true
          }
        }
      } catch (e) {
        return true
      }
      return false
    },
    placementSave () {
      this.$refs.form.validate((b) => {
        if (b) {
          const values = { ...this.form }
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
          this.oldData = JSON.parse(JSON.stringify(res.data))
          this.form = Object.assign(this.form, res.data)
          this.spinning = false
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
