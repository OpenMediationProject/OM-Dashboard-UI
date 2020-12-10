<template>
  <a-form-item>
    <a-select
      placeholder="Promote App"
      :size="size"
      :style="{ width: width }"
      :allowClear="true"
      :disabled="disabled"
      mode="multiple"
      :maxTagTextLength="7"
      :showArrow="false"
      :maxTagCount="1"
      :maxTagPlaceholder="v => '+' + v.length"
      optionLabelProp="title"
      v-decorator="[name, {initialValue: initValue}]"
      :filterOption="filterOption"
      @change="handleChange"
      :dropdownMatchSelectWidth="false">
      <a-select-option v-for="o in appList" :key="o.appId" :title="o.name">
        <p style="display:none;">{{ o.name + '-' + o.appId }}</p>
        <div class="selected-app-small">
          <img style="width:24px;height:24px;" :src="o.icon || GLOBAL.platIcon(o.plat)">
          <div style="display: inline-block;vertical-align: middle;margin-left: 8px;">
            <div style="color:#333333;font-size: 12px;line-height: 14px;">
              <ellipsis :length="26" tooltip>{{ o.name }}</ellipsis>
            </div>
            <div style="color:#999999;font-size: 10px;line-height: 14px;">
              <img class="plat-icon" :src="GLOBAL.platIcon(o.plat)"/>
              <ellipsis :length="36" tooltip>{{ o.appId }}</ellipsis>
            </div>
          </div>
        </div>
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { promoteAppSelectList } from '@/api/campaign'

export default {
  name: 'PromoteAppSelect',
  props: {
    appId: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'promoteAppId'
    },
    defaultValue: {
      type: Array,
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
      const res = await promoteAppSelectList()
      this.appList = res.data
    } catch (e) {
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
