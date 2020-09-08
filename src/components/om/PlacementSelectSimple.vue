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
      :maxTagTextLength="7"
      :maxTagPlaceholder="(h,vm) => '+' + (vm.value.length - 1)"
      allowClear
      :showArrow="false"
      optionLabelProp="title"
      :filterOption="filterOption"
      :dropdownMatchSelectWidth="false"
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
    pubAppIds: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      initValue: this.defaultValue,
      plcList: {}
    }
  },
  watch: {
    pubAppIds (val) {
      this.resetOptions()
    },
    defaultValue (v) {
      this.initValue = v
      this.$emit('change', v)
    }
  },
  methods: {
    resetOptions () {
      const that = this
      if (this.pubAppIds && this.pubAppIds.length) {
        placementSelectList({ pubAppIds: this.pubAppIds.join(',') }).then(res => {
          this.plcList = res.data
          if (that.initValue && that.initValue.length) {
            const newArray = res.data.map(obj => { return obj.id })
            that.initValue = that.initValue.filter(item => {
              return newArray.includes(item)
            })
            that.form.setFieldsValue({ placementId: that.initValue })
          }
        })
      } else {
        placementSelectList().then(res => {
          this.plcList = res.data
        })
      }
    },
    handleChange (value) {
      this.initValue = value
      this.$emit('change', value)
    },
    filterOption (input, option) {
      return (option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }
  },
  created () {
    try {
      const params = {}
      if (this.pubAppIds && this.pubAppIds.length) {
        params.pubAppIds = this.pubAppIds.join(',')
      }
      placementSelectList(params).then(res => {
        if (res.data) {
          this.plcList = res.data
        }
      })
    } catch (e) {
      console.log('load placement list error', e)
    }
  }
}
</script>
