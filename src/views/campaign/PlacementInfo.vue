<!-- Show placement info props: id（placement_id）, name(placement_name), type(placement_type) -->
<template>
  <div v-if="placementInfo.id" :style="status?null:'opacity: 0.3;'">
    <img style="width:32px;height:32px;margin-right: 7px;" :src="GLOBAL.typeInfo(placementInfo.adType).icon">
    <div style="display: inline-block;vertical-align: middle;line-height: 1.2;">
      <div class="plc-title">
        <ellipsis :length="40" tooltip>{{ placementInfo.name }}</ellipsis><img v-if="abt===1" style="margin-left:4px;margin-right:4px;" src="/icon/TA.svg"/><img v-if="abt===1" src="/icon/TB.svg"/>
      </div>
      <div class="plc-type">
        <span v-if="!copyId">
          <span>{{ GLOBAL.typeInfo(placementInfo.adType).title }}</span>
          <a-divider type="vertical" />
          <span style="margin-left:-2px;">{{ id }}</span>
        </span>
        <span v-else>
          <span>id: {{ id }}</span>
          <a-tooltip title="Copy">
            <a style="margin-left: 8px;" @click="handleCopy(id)"><img src="/icon/copy-gray.svg" alt="Copy"></a>
          </a-tooltip>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Ellipsis } from '../../components'
import { placementSelectList } from '@/api/publisher'
import { mapState } from 'vuex'

export default {
  name: 'OmPlacementInfo',
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    },
    status: {
      type: Number,
      required: false,
      default: 1
    },
    abt: {
      type: Number,
      default: 0
    },
    copyId: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Ellipsis
  },
  data () {
    return {
      visible: true,
      placementInfo: {}
    }
  },
  computed: mapState({
    placements: state => state.publisher.placements
  }),
  methods: {
    handleCopy (text) {
      this.$copyText(text).then(function (e) {
      }, function (e) {
      })
      this.$message.success('Copied id to the clipboard', 1)
    }
  },
  async created () {
    if (!this.placements || !this.placements.length) {
      const res = await placementSelectList()
      this.$store.commit('UPDATEPLACEMENTS', res.data)
      this.placementInfo = this.placements.find(row => {
        return row.id === this.id
      })
    } else {
      this.placementInfo = this.placements.find(row => {
        return row.id === this.id
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .plc-title {
    color:#333333;font-size: 14px;margin-bottom:4px;
  }
  .plc-type {
    color:#999999;font-size: 12px;text-align: left;
  }
</style>
