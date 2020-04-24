<!-- Instance select component the props defaultValue is the default checked  -->
<template>
  <a-form-item laout="inline">
    <a-select
      showSearch
      :style="{ width: width }"
      placeholder="Instance"
      size="default"
      :disabled="disabled"
      :mode="mode"
      :showArrow="false"
      allowClear
      optionLabelProp="title"
      v-decorator="[modelName, {initialValue: initValue}]"
      :filterOption="instanceFilterOption"
      @change="handleChange">
      <a-select-option v-for="instance in data" :key="instance.id" :title="instance.name">
        <div style="display: inline-block;vertical-align: middle;">
          <div style="color:#333333;font-size: 14px;">
            <ellipsis :length="20">{{ instance.name }}</ellipsis>
          </div>
          <div style="color:#999999;font-size: 12px;">
            <ellipsis :length="26">{{ instance.placementKey }}</ellipsis>
          </div>
        </div>
        <p style="display:none">{{ instance.placementKey + ' ' + instance.name }}</p>
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { Ellipsis } from '../../components'
import { instancesSelectList } from '../../api/mediation'

export default {
  name: 'OmInstanceSelect',
  components: {
    Ellipsis
  },
  props: {
    modelName: {
      type: String,
      default: 'instanceId'
    },
    width: {
      type: String,
      default: '220px'
    },
    mode: {
      type: String,
      default: 'default'
    },
    defaultValue: {
      type: Array,
      default () {
        return []
      }
    },
    placementId: {
      type: Number,
      default: null
    },
    hb: {
      type: Number,
      default: null
    },
    adnAppId: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: [],
      initValue: this.defaultValue
    }
  },
  methods: {
    handleChange (value, option) {
      this.$emit('change', value)
      this.$emit('instanceSelecteChange', value)
    },
    instanceFilterOption (input, option) {
      return (option.componentOptions.children[1].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    },
    setOptions () {
      const { searchApp: pubAppId } = this.$store.state.publisher
      if (!this.data || this.data.length === 0) {
        const params = { pubAppId, placementId: this.placementId }
        if (this.adnAppId !== null) {
          params.adNetworkAppId = this.adnAppId
        }
        if (this.hb !== null) {
          params.headBid = this.hb
        }
        instancesSelectList(params).then(res => {
          if (res.code === 0) {
            this.data = res.data
          }
        })
      }
    },
    upload () {
      const { searchApp: pubAppId } = this.$store.state.publisher
      const params = { pubAppId, placementId: this.placementId }
      if (this.adnAppId !== null) {
        params.adNetworkAppId = this.adnAppId
      }
      instancesSelectList(params).then(res => {
        if (res.code === 0) {
          this.data = res.data
        }
      })
    }
  },
  created () {
    this.setOptions()
  },
  watch: {
    hb (val) {
      this.setOptions()
    }
  }
}
</script>

<style type="less" scoped>
</style>
