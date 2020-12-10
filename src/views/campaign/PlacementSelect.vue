<!-- Placement select component, the props defaultValue is the default checked -->
<template>
  <a-select
    showSearch
    :style="{width: width}"
    placeholder="Placement"
    :disabled="visible"
    v-model="selected"
    :filterOption="filterOption"
    optionLabelProp="title"
    :dropdownMatchSelectWidth="false"
    @change="handleChange">
    <a-select-option v-for="o in this.plcList" :key="o.id" :disabled="disabledIds.includes(o.id)" :title="o.name">
      <p style="display:none;">{{ o.name + '-' + o.id }}</p>
      <om-placement-info :id="o.id"/>
    </a-select-option>
  </a-select>
</template>

<script>
import { Ellipsis } from '../../components'
import { placementSelectList } from '../../api/publisher'
import OmPlacementInfo from './PlacementInfo'

export default {
  name: 'PlacementSelect',
  components: {
    Ellipsis,
    OmPlacementInfo
  },
  props: {
    width: {
      type: String,
      default: '220px'
    },
    name: {
      type: String,
      default: 'placementId'
    },
    pubAppId: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selecteds: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      plcList: {},
      visible: this.disabled,
      selected: undefined,
      disabledIds: this.selecteds || []
    }
  },
  watch: {
    pubAppId (val) {
      this.resetOptions()
    },
    defaultValue (v) {
      this.selected = v
      this.$emit('change', v)
    },
    selecteds (v) {
      this.disabledIds = v
    }
  },
  methods: {
    resetOptions () {
      this.selected = undefined
      this.$emit('change', undefined)
      if (this.pubAppId) {
        this.visible = false
        placementSelectList({ pubAppIds: this.pubAppId }).then(res => {
          this.plcList = res.data
        })
      } else {
        this.visible = true
        return false
      }
    },
    handleChange (value) {
      this.selected = value
      this.$emit('change', value)
    },
    filterOption (input, option) {
      return (option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }
  },
  created () {
    try {
      const params = {}
      if (this.pubAppId) {
        params.pubAppIds = this.pubAppId
        placementSelectList(params).then(res => {
          if (res.data) {
            this.plcList = res.data
          }
        })
      } else {
        this.visible = true
      }
    } catch (e) {
      console.log('load placement list error', e)
    }
  }
}
</script>
