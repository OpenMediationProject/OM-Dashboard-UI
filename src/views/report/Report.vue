<!-- Report page router '/report/main' -->
<template>
  <a-tabs class="mytabs" defaultActiveKey="1">
    <a-tab-pane tab="Performance" key="1">
      <Performance />
      <div style="height:16px; width:100%"></div>
    </a-tab-pane>
    <a-tab-pane tab="User Activity" key="2">
      <UserActivity/>
    </a-tab-pane>
    <a-tab-pane tab="Reporting Builder" key="3">
      <ReportBuilder/>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import Performance from './Performance'
import ReportBuilder from './ReportBuilder'
import UserActivity from './UserActivity'

export default {
  name: 'UserManage',
  components: {
    Performance,
    ReportBuilder,
    UserActivity
  },
  data () {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } }
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
