<!-- SDK Testing page router '/sdk/integration' -->
<template>
  <a-tabs class="mytabs" :tabBarStyle="{ backgroundColor: '#F7F7F7', marginLeft: '10px'}" defaultActiveKey="1">
    <a-tab-pane tab="Testing" key="1">
      <Integration/>
    </a-tab-pane>
    <a-tab-pane tab="Devices" key="2" forceRender>
      <devices />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import Integration from './modules/Integration'
import devices from './modules/Devices'

export default {
  name: 'SDK',
  components: {
    Integration,
    devices
  },
  data () {
    return {
      form: this.$form.createForm(this),
      loadding: false,
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
