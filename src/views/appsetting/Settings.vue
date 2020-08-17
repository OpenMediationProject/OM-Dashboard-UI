<template>
  <div>
    <a-tabs class="mytabs" :defaultActiveKey="activeKey" @change="tabChange">
      <a-tab-pane tab="App Info" key="1">
        <AppInfo />
      </a-tab-pane>
    </a-tabs>
  </div>

</template>

<script>
import AppInfo from './AppInfo'

export default {
  name: 'AppSettings',
  components: {
    AppInfo
  },
  data () {
    return {
      activeKey: this.$route.query.key || '1'
    }
  },
  created () {
  },
  methods: {
    tabChange (val) {
      this.activeKey = val
    }
  }
}
</script>

<style type="less" scoped>
  .ant-card {
    background-color: #F7F7F7
  }
  .mytabs >>> .ant-tabs-nav-wrap {
    margin-left:8px;
  }
</style>
