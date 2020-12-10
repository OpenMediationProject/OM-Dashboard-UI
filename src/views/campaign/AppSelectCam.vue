<template>
  <div style="display: inline-block;width: 80%">
    <a-select
      placeholder="Apps"
      :size="size"
      style="width: 100%;"
      v-model="initValue"
      @change="handleChange"
      :dropdownMatchSelectWidth="false">
      <a-select-option v-for="o in appList" :key="o.appId" :title="o.appName">
        <p style="display:none;">{{ o.appName + '-' + o.id + '-' + o.appId }}</p>
        <div class="selected-app-small">
          <img style="width:16px;height:16px;" :src="o.icon || GLOBAL.platIcon(o.plat)">
          <div style="display: inline-block;vertical-align: middle;margin-left: 4px;">
            <div style="color:#333333;font-size: 12px;line-height: 14px;">
              <ellipsis :tooltip="false" :length="26">{{ o.appName }}</ellipsis>
            </div>
          </div>
        </div>
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { Ellipsis } from '../../components'
import { appSelectList } from '../../api/publisher'

export default {
  name: 'AppSelectCam',
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
    size: {
      type: String,
      default: 'default'
    }
  },
  components: {
    Ellipsis
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
    }
  },
  async created () {
    const _this = this
    try {
      const res = await appSelectList()
      _this.appList = res.data
      if (!this.initValue) {
        this.initValue = _this.appList[0].appId
        this.$emit('change', _this.appList[0].appId)
      }
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
