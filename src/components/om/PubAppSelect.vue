<!-- Publisher app select component -->
<template>
  <a-form-item>
    <a-select
      placeholder="Apps"
      :size="size"
      :style="{ width: width }"
      :allowClear="true"
      :disabled="disabled"
      mode="multiple"
      :maxTagTextLength="10"
      :showArrow="false"
      :maxTagCount="1"
      :maxTagPlaceholder="(h,vm) => '+' + (vm.value.length - 1)"
      optionLabelProp="title"
      v-decorator="[name, {initialValue: initValue}]"
      :filterOption="filterOption"
      @change="handleChange"
      :dropdownMatchSelectWidth="false">
      <a-select-option v-for="o in appList" :key="o.id" :title="o.appName">
        <p style="display:none;">{{ o.appName + '-' + o.id + '-' + o.appId }}</p>
        <div class="selected-app-small">
          <img style="width:24px;height:24px;" :src="o.icon || (o.plat===0?'/iOS-40.svg':'/Android-40.svg')">
          <div style="display: inline-block;vertical-align: middle;margin-left: 8px;">
            <div style="color:#333333;font-size: 12px;line-height: 14px;">
              <ellipsis :length="26" tooltip>{{ o.appName }}</ellipsis>
            </div>
            <div style="color:#999999;font-size: 10px;line-height: 14px;">
              <img class="plat-icon" v-if="o.plat===1" src="/Android-40.svg"/>
              <img class="plat-icon" v-else src="/iOS-40.svg"/>
              <ellipsis :length="36" tooltip>{{ o.appId }}</ellipsis>
            </div>
          </div>
        </div>
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { Ellipsis } from '../../components'
import { appSelectList } from '../../api/publisher'

export default {
  name: 'OmPubAppSelect',
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
      type: [Number, Array],
      default () {
        return []
      }
    },
    width: {
      type: String,
      default: '220px'
    },
    size: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Ellipsis
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
