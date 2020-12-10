<!-- Instance select component the props defaultValue is the default checked  -->
<template>
  <a-select
    showSearch
    :style="{ width: width, marginTop: '4px' }"
    placeholder="Instance"
    size="default"
    :allowClear="allowClear"
    :disabled="disabled"
    :mode="mode"
    :showArrow="!allowClear"
    optionLabelProp="title"
    :dropdownMatchSelectWidth="false"
    v-model="initValue"
    :filterOption="instanceFilterOption"
    @change="handleChange">
    <a-select-option v-for="instance in data" :key="instance.id" :title="instance.name">
      <div style="display: inline-block;vertical-align: middle;">
        <div style="color:#333333;font-size: 14px;">
          <ellipsis :length="30">{{ instance.name }}</ellipsis>
        </div>
        <div style="color:#999999;font-size: 12px;">
          <ellipsis :length="50">{{ instance.placementKey }}</ellipsis>
        </div>
      </div>
      <p style="display:none">{{ instance.placementKey + ' ' + instance.name }}</p>
    </a-select-option>
  </a-select>
</template>

<script>
import { Ellipsis } from '@/components'
import { instancesSelectList } from '@/api/mediation'
import { mapState } from 'vuex'

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
    allowClear: {
      type: Boolean,
      default: true
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
      type: Boolean,
      default: false
    },
    adnAppId: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    adnIds: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      data: [],
      initValue: this.defaultValue
    }
  },
  computed: mapState({
    searchPlacement: state => state.publisher.searchPlacement
  }),
  methods: {
    handleChange (value, option) {
      this.initValue = value
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
        if (this.adnIds && this.adnIds.length) {
          params.adnIds = this.adnIds.join(',')
        }
        instancesSelectList(params).then(res => {
          if (res.code === 0) {
            if (this.hb) {
              res.data = res.data.filter(row => {
                return !row.headbidding
              })
            }
            this.data = res.data
          }
        })
      }
    },
    resetOptions () {
      const { searchApp: pubAppId } = this.$store.state.publisher
      const params = { pubAppId, placementId: this.placementId }
      if (this.adnIds && this.adnIds.length) {
        params.adNetworkIds = this.adnIds.join(',')
      }
      instancesSelectList(params).then(res => {
        if (res.code === 0) {
          if (this.hb) {
            res.data = res.data.filter(row => {
              return !row.headbidding
            })
          }
          this.data = res.data
        }
      })
    },
    upload () {
      const { searchApp: pubAppId } = this.$store.state.publisher
      const params = { pubAppId, placementId: this.placementId }
      if (this.adnAppId !== null) {
        params.adNetworkAppId = this.adnAppId
      }
      instancesSelectList(params).then(res => {
        if (res.code === 0) {
          if (this.hb) {
            res.data = res.data.filter(row => {
              return !row.headbidding
            })
          }
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
    },
    adnIds (val) {
      this.initValue = []
      this.resetOptions()
    },
    searchPlacement (val) {
      this.resetOptions()
    }
  }
}
</script>

<style type="less" scoped>
</style>
