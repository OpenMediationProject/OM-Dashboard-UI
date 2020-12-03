<template>
  <a-tabs class="mytabs" :defaultActiveKey="parseInt(this.$route.query.type) || 1">
    <a-tab-pane tab="User Activity" :key="1">
      <UserActivity/>
      <div style="height:16px; width:100%"></div>
    </a-tab-pane>
    <a-tab-pane tab="Lifetime Value" :key="2">
      <LTV/>
      <div style="height:16px; width:100%"></div>
    </a-tab-pane>
    <a-tab-pane tab="Retention" :key="3">
      <Retention/>
      <div style="height:16px; width:100%"></div>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import Performance from './Performance'
import ReportBuilder from './ReportBuilder'
import UserActivity from './UserActivity'
import LTV from './LTV'
import Retention from './Retention'
import { mapState } from 'vuex'
import AddApp from '@/views/guidance/AddApp'

export default {
  name: 'ReportUA',
  components: {
    Performance,
    ReportBuilder,
    UserActivity,
    LTV,
    Retention,
    AddApp
  },
  data () {
    const id = this.$store.state.publisher.currentOrgId
    return {
      id,
      canAddApp: this.$auth('pubapp.add'),
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      token: ''
    }
  },
  computed: mapState({
    hasapp: state => state.user.hasapp
  }),
  created () {
  },
  methods: {
    copy (text) {
      this.$copyText(this.token).then(function (e) {
      }, function (e) {
      })
      this.$message.success(this.$msg('appsettings.copied_success'), 1)
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
