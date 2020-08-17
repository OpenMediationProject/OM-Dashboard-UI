<!-- Report page router '/report/main' -->
<template>
  <a-tabs class="mytabs" :defaultActiveKey="parseInt(this.$route.query.type) || 1">
    <a-tab-pane tab="Performance" :key="1">
      <Performance />
      <div style="height:16px; width:100%"></div>
    </a-tab-pane>
    <a-tab-pane tab="In-app Bidding" :key="2">
      <InApp/>
      <div style="height:16px; width:100%"></div>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import Performance from './Performance'
import InApp from './InApp'

export default {
  name: 'UserManage',
  components: {
    Performance,
    InApp
  },
  data () {
    return {
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
