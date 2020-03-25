<!-- Organization select component the props value is the default checked -->
<template>
  <div v-if="this.$route.name==='MediationEdit' || this.$route.name==='MediationDetails'" class="placement-info">
    <div style="display: inline-block;">
      <div style="color:#333333;font-size: 14px;margin-bottom:5px;">
        <ellipsis :length="20" tooltip>{{ searchPlacementName }}</ellipsis>
      </div>
      <div style="color:#999999;font-size: 12px;">
        <span v-if="searchPlacementType===0">Banner</span>
        <span v-if="searchPlacementType===1">Native</span>
        <span v-if="searchPlacementType===2">RewardedVideo</span>
        <span v-if="searchPlacementType===3">Interstitial</span>
        <a-divider type="vertical" />
        <span style="margin-left:-2px;">{{ searchPlacement }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Ellipsis } from '@/components'
import { mapState } from 'vuex'

export default {
  name: 'PageHeaderPlacement',
  components: {
    Ellipsis
  },
  computed: mapState({
    searchPlacement: state => state.publisher.searchPlacement,
    searchPlacementName: state => state.publisher.searchPlacementName,
    searchPlacementType: state => state.publisher.searchPlacementType
  })
}
</script>

<style type="less" scoped>
  .plcament-select >>> .ant-select-selection--single {
    height: 50px;
  }
  .plcament-select >>> .ant-select-selection__rendered {
    line-height: 20px;
  }
  .plcament-select >>> .ant-select-selection-selected-value {
    margin-top: 5px;
  }
  .placement-info {
    display: inline-block;
    position: absolute;
    right: 40px;
    vertical-align: middle;
    margin-left: 10px;
    width: 200px;
    margin-top: 0px;
    line-height: 1;
    box-sizing: border-box;
  }
</style>
