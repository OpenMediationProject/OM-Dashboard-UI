<!-- Publisher app select component -->
<template>
  <a-select
    placeholder="App"
    :size="size"
    :style="{ width: width }"
    :allowClear="clear"
    :disabled="disabled"
    :mode="mode"
    optionLabelProp="title"
    :filterOption="filterOption"
    v-model="initValue"
    :dropdownMatchSelectWidth="false"
    @change="handleChange">
    <a-select-option v-for="o in appList" :key="o.id" :title="o.appName">
      <p style="display:none;">{{ o.appName + '-' + o.id + '-' + o.appId }}</p>
      <app-info :app-id="o.id"/>
    </a-select-option>
  </a-select>
</template>

<script>
import { appSelectList } from '@/api/publisher'
import AppInfo from './AppInfo'

export default {
  name: 'AppSelect',
  props: {
    appId: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'pubAppId'
    },
    defaultValue: {
      type: Number,
      default: undefined
    },
    width: {
      type: String,
      default: '100%'
    },
    size: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'multiple'
    },
    clear: {
      type: Boolean,
      default: true
    }
  },
  components: {
    AppInfo
  },
  watch: {
    defaultValue (v) {
      this.initValue = v
    }
  },
  data () {
    return {
      initValue: this.defaultValue,
      appList: {}
    }
  },
  methods: {
    handleChange (val) {
      this.$emit('change', val)
    },
    filterOption (input, option) {
      return (option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }
  },
  async created () {
    try {
      const res = await appSelectList()
      this.appList = res.data
    } catch (e) {
      console.log('pubAppSelectList error', e)
    }
  }
}
</script>

<style type="less" scoped>
  .plat-icon {
    width: 10px;
    height: 10px;
    margin-right: 2px;
    margin-top: -3px;
  }
</style>
