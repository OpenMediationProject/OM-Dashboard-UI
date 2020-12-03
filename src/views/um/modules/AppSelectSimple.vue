<template>
  <a-form-item>
    <a-select
      placeholder="App"
      size="default"
      style="width:240px;"
      allowClear
      :showArrow="false"
      :dropdownMatchSelectWidth="false"
      v-decorator="[name]">
      <a-select-option v-for="appInfo in appList" :key="appInfo.id">
        <div class="selected-app-small">
          <img style="width:24px;height:24px;" :src="appInfo.icon? appInfo.icon: GLOBAL.platIcon(appInfo.plat)">
          <div style="display: inline-block;vertical-align: middle;margin-left: 8px;">
            <div style="color:#333333;font-size: 12px;line-height: 14px;">
              <ellipsis :length="26">{{ appInfo.appName }}</ellipsis>
            </div>
            <div style="color:#999999;font-size: 10px;line-height: 14px;">
              <img class="plat-icon" :src="GLOBAL.platIcon(appInfo.plat)"/>
              <ellipsis :length="30">{{ appInfo.appId }}</ellipsis>
            </div>
          </div>
        </div>
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { Ellipsis } from '@/components'
import { appSelectList } from '@/api/publisher'

export default {
  name: 'AppSelectSimple',
  props: {
    name: {
      type: String,
      required: false,
      default: 'pubAppId'
    },
    userId: {
      type: Number,
      default: null
    },
    publisherId: {
      type: Number,
      default: null
    }
  },
  components: {
    Ellipsis
  },
  data () {
    return {
      appList: {},
      selected: ''
    }
  },
  watch: {
    userId (val) {
      this.search()
    },
    publisherId (val) {
      this.search()
    }
  },
  methods: {
    search () {
      const params = { userId: this.userId, status: 1, publisherId: this.publisherId }
      appSelectList(params)
        .then(res => {
          this.appList = res.data
        })
    }
  },
  created () {
    this.search()
  }
}
</script>

<style lang="less" scoped>
  .plat-icon {
    width: 10px;
    height: 10px;
    margin-right: 2px;
    margin-top: -3px;
  }
</style>
