<!-- User Management page router '/um/user-manage' -->
<template>
  <a-tabs :tabBarStyle="{ backgroundColor: '#F7F7F7', marginLeft: '8px'}">
    <a-tab-pane v-if="orgs" tab="Organization" key="1">
      <Organizations />
    </a-tab-pane>
    <a-tab-pane v-if="apps" tab="Apps" key="2" forceRender>
      <Apps style="margin-top:16px;"/>
    </a-tab-pane>
    <a-tab-pane v-if="users" tab="Users" key="3" forceRender>
      <Users style="margin-top:16px;"/>
    </a-tab-pane>
    <a-tab-pane v-if="roles" tab="Roles" key="4" forceRender>
      <div style="background-color:#ffffff;">
        <Roles style="margin-top:32px;"/>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import Apps from './modules/Apps'
import Organizations from './modules/Organizations'
import Users from './modules/Users'
import Roles from './modules/Roles'

export default {
  name: 'UserManage',
  components: {
    Apps,
    Organizations,
    Users,
    Roles
  },
  data () {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      apps: this.$auth('um_apps.query'),
      users: this.$auth('um_users.query'),
      roles: this.$auth('um_roles.query'),
      orgs: this.$auth('um_orgs.query')
    }
  }
}
</script>

<style type="less" scoped>
.ant-card {
  background-color: #F7F7F7
}
</style>
