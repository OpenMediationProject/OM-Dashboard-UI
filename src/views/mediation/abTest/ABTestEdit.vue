<template>
  <div class="abTestEdit">
    <BasicInfo
      :appId="appId"
      :placementId="placementId"
      :ruleId="ruleId"
      :abTestStatus="abTestStatus"
      @segmentSave="segmentSave"/>
    <ABTablePane
      ref="abTablePane"
      :appId="appId"
      :placementId="placementId"
      :ruleId="ruleId"
      :abTestStatus="abTestStatus"
      :recordUpper="recordUpper"/>
  </div>
</template>

<script>
import ABTablePane from './ABTablePane'
import BasicInfo from './BasicInfo'

import { segmentUpdateWithInstance } from '@/api/mediation'

export default {
  components: {
    ABTablePane,
    BasicInfo
  },
  data () {
    return {
      appId: this.$route.params.pubAppId,
      placementId: this.$route.params.placementId,
      ruleId: this.$route.params.ruleId,
      abTestStatus: this.$route.params.abTestStatus,
      recordUpper: this.$route.params.recordUpper
    }
  },
  methods: {
    segmentSave (params, flag = false) {
      const subData = this.$refs.abTablePane.getSubData()
      // subData.biddingData.forEach(v => {
      //   console.log(v.abTest, v.name)
      // })
      // console.log('=======================AB Test===================')
      // subData.waterfallData.forEach(v => {
      //    console.log(v.abTest, v.autoSwitch, v.name, v.groupLevel)
      // })
      params.headerbidding = subData.biddingData
      params.instances = subData.waterfallData
      // if (!flag) return
      segmentUpdateWithInstance(params).then(res => {
        if (res.code === 0) {
          this.ruleId = res.data.id
          this.$router.push({
            name: 'Mediation',
            query: {
              type: '2'
            }
          })
          this.$message.success(this.$t('mediation.create_success'))
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
</style>
