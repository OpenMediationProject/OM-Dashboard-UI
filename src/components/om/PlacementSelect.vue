<!-- Placement select component, update vuex (searchPlacement) and localstorage  -->
<template>
  <a-select
    class="plcament-select"
    style="width: 256px;position: absolute;right: 0;z-index: 100;top: 12px;"
    :dropdownMatchSelectWidth="false"
    @change="handleChange"
    :showArrow="false"
    optionLabelProp="title"
    v-model="selectePlc"
  >
    <a-select-option v-for="plc in plcList" :key="plc.id" :title="plc.name">
      <om-placement-info
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
import OmPlacementInfo from '@/components/om/PlacementInfo'

export default {
  name: 'PlacementSelect',
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
      const localPlacement = localStorage.getItem('searchPlacement')
      placementSelectList({ pubAppId: pubAppId })
        .then(res => {
          if (res.code === 0 && res.data.length) {
            that.plcList = res.data
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
