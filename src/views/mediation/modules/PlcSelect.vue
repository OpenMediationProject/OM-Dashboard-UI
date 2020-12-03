<template>
  <a-select
    class="plc-select"
    style="width: 320px;z-index: 100;"
    :dropdownMatchSelectWidth="false"
    @change="handleChange"
    v-model="selectePlc"
  >
    <a-select-option v-for="plc in plcList" :key="plc.id" :title="plc.name">
      <om-placement-info
        :abt="plc.abTestModel"
        :type="plc.adType"
        :name="plc.name"
        :id="plc.id"
      />
    </a-select-option>
  </a-select>
</template>

<script>
import { Ellipsis } from '@/components'
import { placementSelectList } from '@/api/publisher'
import { mapState } from 'vuex'
import OmPlacementInfo from './PlacementInfo'

export default {
  name: 'PlcSelect',
  components: {
    Ellipsis,
    OmPlacementInfo
  },
  data () {
    return {
      plcList: {},
      selectePlc: ''
    }
  },
  methods: {
    handleChange (value, option) {
      const target = this.plcList.find(item => item.id === value)
      if (target) {
        this.$store.commit('SET_PLACEMENT', target)
      }
    },
    updateSelectList (pubAppId) {
      if (!pubAppId) {
        return
      }
      const that = this
      placementSelectList({ pubAppId: pubAppId })
        .then(res => {
          if (res.code === 0 && res.data.length) {
            that.plcList = res.data.filter(row => row.adType !== 5)
            const localPlacement = localStorage.getItem('searchPlacement')
            if (localPlacement) {
              const target = res.data.find(item => item.id === parseInt(localPlacement))
              if (target) {
                that.selectePlc = parseInt(localPlacement)
                that.$store.commit('SET_PLACEMENT', target)
              } else {
                that.selectePlc = that.plcList[0].id
                that.$store.commit('SET_PLACEMENT', that.plcList[0])
              }
            } else {
              that.selectePlc = that.plcList[0].id
              that.$store.commit('SET_PLACEMENT', that.plcList[0])
            }
          } else {
            that.selectePlc = null
            that.$store.commit('SET_PLACEMENT')
          }
        })
    }
  },
  created () {
    this.updateSelectList(this.searchApp)
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp,
    searchPlacement: state => state.publisher.searchPlacement,
    searchPlacementName: state => state.publisher.searchPlacementName,
    searchPlacementType: state => state.publisher.searchPlacementType
  }),
  watch: {
    searchApp (curVal) {
      this.updateSelectList(curVal)
    }
  }
}
</script>
<style scoped>
  .plc-select >>> .ant-select-selection {
    height:56px;
    padding-top: 2px;
  }
  .plc-select >>> .plc-title {
    margin-bottom: -8px;
    font-size: 16px;
    font-weight: 500;
  }
  .plc-select >>> .plc-icon {
    position: absolute; left: 4px; top: 8px;
  }
</style>
