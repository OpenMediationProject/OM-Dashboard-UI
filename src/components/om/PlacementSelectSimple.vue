<!-- Placement select component, the props defaultValue is the default checked -->
<template>
  <a-form-item>
    <a-select
      showSearch
      :style="{width: width}"
      placeholder="Placement"
      mode="multiple"
      :disabled="disabled"
      :maxTagCount="1"
      :showArrow="false"
      :maxTagTextLength="10"
      :maxTagPlaceholder="(h,vm) => '+' + (vm.value.length - 1)"
      allowClear
      optionLabelProp="title"
      :filterOption="filterOption"
      @change="handleChange"
      v-decorator="[name, {initialValue: initValue}]">
      <a-select-option v-for="o in this.plcList" :key="o.id" :title="o.name">
        <p style="display:none;">{{ o.name + '-' + o.id }}</p>
        <om-placement-info
          :type="o.adType"
          :name="o.name"
          :id="o.id"
        />
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { Ellipsis } from '../../components'
import { placementSelectList } from '../../api/publisher'
import OmPlacementInfo from '../../components/om/PlacementInfo'

export default {
  name: 'OmPlacementSelectSimple',
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
    defaultValue: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      initValue: this.defaultValue,
      plcList: {}
    }
  },
  methods: {
    handleChange (value) {
      this.$emit('change', value)
    },
    filterOption (input, option) {
      return (option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }
  },
  async created () {
    try {
      const res = await placementSelectList()
      this.plcList = res.data
    } catch (e) {
      console.log('load placement list error', e)
    }
  }
}
</script>
