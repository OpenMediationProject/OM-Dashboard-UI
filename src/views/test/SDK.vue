<!-- SDK Intergration page router '/sdk/intergration' -->
<template>
  <a-tabs class="mytabs" :tabBarStyle="{ backgroundColor: '#F7F7F7', marginLeft: '10px', marginTop: '-12px'}" defaultActiveKey="1">
    <a-tab-pane tab="Testing" key="1">
      <testing style="margin-top:16px;padding-left:16px;padding-right:16px;"/>
    </a-tab-pane>
    <a-tab-pane tab="Devices" key="2" forceRender>
      <devices />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import testing from './modules/Testing'
import devices from './modules/Devices'

export default {
  name: 'SDK',
  components: {
    testing,
    devices
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loadding: false,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      data: [],
      columns: [
      ]
    }
  },
  mounted () {
  },
  methods: {
    search () {
      this.loadding = true
    },
    resetSearch () {
    }
  }
}
</script>

<style type="less" scoped>
</style>
