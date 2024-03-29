<!-- Regions select component  the props defaultSelected is the default value with tree select  -->
<template>
  <a-tree-select
    style="width: 100%"
    :show-search="true"
    :value="value"
    :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
    placeholder="Region"
    allowClear
    :size="size"
    :disabled="disabled"
    :multiple="true"
    :showArrow="false"
    :treeCheckable="true"
    :treeData="treeData"
    treeNodeLabelProp="value"
    :filterTreeNode="filterTreeNode"
    :maxTagCount="maxTagCount"
    :maxTagPlaceholder="v => '+' + v.length"
    v-decorator="['regions']"
    treeDefaultExpandAll
    @change="onChange">
  </a-tree-select>
</template>

<script>
import { mapState } from 'vuex'
import { regionList } from '@/api/mediation'

export default {
  name: 'OmRegionsSelect',
  data () {
    return {
      treeExpandedKeys: [],
      value: this.defaultSelected,
      treeData: []
    }
  },
  props: {
    size: {
      type: String,
      default: 'default'
    },
    defaultSelected: {
      type: Array,
      default: null
    },
    maxTagCount: {
      type: Number,
      default: 2
    },
    disabled: {
      type: Boolean,
      default: false
    },
    ignoreApp: {
      type: Boolean,
      default: false
    },
    disabledList: {
      type: Array,
      default: null
    }
  },
  created () {
    if (this.value && this.value.indexOf('00') > -1) {
      this.value.splice(this.value.indexOf('00'), 1)
      this.value.push('ALL')
    }
    this.updateRegions(this.selectedPubAppId)
  },
  computed: mapState({
    selectedPubAppId: state => state.publisher.searchApp
  }),
  watch: {
    selectedPubAppId (pubAppId) {
      this.updateRegions(pubAppId)
    },
    defaultSelected (val) {
      this.value = val
    },
    disabledList: {
      handler: function (val) {
        if (!this.defaultSelected || !this.defaultSelected.length) {
          this.setDisTreeData(val)
        } else if (val && val.length > 0) {
          this.setDisTreeData(val.filter(v => !this.defaultSelected.includes(v)))
        }
      }
    }
  },
  methods: {
    // All and other mutually exclusive
    onChange (val) {
      if (!this.value) {
        this.value = val
        this.$emit('change', val)
        return
      }
      if (!this.value.includes('ALL') && val.includes('ALL')) {
        this.value = ['ALL']
        this.$emit('change', ['ALL'])
      } else if (this.value.includes('ALL') && val.length > 1) {
        val.splice(val.findIndex(item => item === 'ALL'), 1)
        this.value = val
        this.$emit('change', val)
      } else {
        this.value = val
        this.$emit('change', val)
      }
    },
    buildNode (a) {
      return {
        key: a.a2,
        title: a.a2 + ' - ' + a.name,
        value: a.a2,
        disabled: false,
        text: [a.a2, a.a3, a.name].join(' ').toLowerCase()
      }
    },
    updateRegions (pubAppId) {
      const ps = { pubAppId }
      if (this.ignoreApp) {
        delete ps.pubAppId
      } else if (!pubAppId) {
        return
      }
      regionList(ps)
        .then(res => {
          const { top, all } = res.data
          const topMap = {}
          const tierGroup = {}
          top.forEach(a => {
            topMap[a.a2] = true
          })
          all.forEach(a => {
            if (!topMap[a.a2]) {
              if (!tierGroup[a.tier]) {
                tierGroup[a.tier] = []
              }
              tierGroup[a.tier].push(this.buildNode(a))
            }
          })
          const data = [{ title: 'ALL', disabled: false, key: 'ALL', value: 'ALL' }]
          data.push({
            title: 'TOP5',
            key: 'TOP5',
            value: 'TOP5',
            disabled: false,
            children: top.map(this.buildNode)
          })
          Object.keys(tierGroup).sort().forEach(tier => {
            data.push({
              title: 'Tier' + tier,
              key: tier,
              value: tier,
              disabled: false,
              children: tierGroup[tier]
            })
          })
          this.treeData = data
          if (this.disabledList !== null) {
            this.setDisTreeData(this.disabledList)
          }
        })
    },
    setDisTreeData (disArr) {
      if (this.treeData && this.treeData.length > 0) {
        this.treeData.forEach(v => {
          let disFlag = false
          if (v.key === 'ALL' && disArr.includes(v.key)) {
            disFlag = true
          }
          if (v.children && v.children.length) {
            v.children.forEach(c => {
              if (disArr.includes(c.key)) {
                c.disabled = true
                disFlag = true
              } else {
                c.disabled = false
              }
            })
          }
          v.disabled = disFlag
        })
      }
    },
    filterTreeNode (input, option) {
      const text = option.componentOptions.propsData.dataRef.text
      return text && text.indexOf(input.toLowerCase()) > -1
    }
  }
}
</script>
