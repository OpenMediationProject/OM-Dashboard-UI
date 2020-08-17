<template>
  <div style="width: 100%; text-align: center;margin-top: 48px;">
    <img src="/icon/get-started.svg">
    <div class="get-start">
      <div style="font-size: 16px;color:#333333;margin-bottom: 8px;font-weight: bold;">Ready to Take off?</div>
      <p>Making money from your apps just got easier:Introduce your appps to Adtiming, create some placements(containers
        for your ads), plug them into your code, and watch your earnings grow! For more info, visit the help center for
        iOS or Andriod.</p>
      <a-button v-if="edit" type="primary" style="margin-top: 16px;" @click="addApp">Get Started</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddApp',
  components: {},
  data () {
    return {}
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    addApp () {
      this.$router.push({
        path: '/publisher/app/add',
        query: { type: 'Add' }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .get-start {
    text-align: left;
    padding: 24px;
    margin: 0 auto;
    background: white;
    width: 1072px;
    height: 190px;
    box-shadow: 0px 4px 10px rgba(221, 224, 228, 0.3), 0px 0px 4px rgba(221, 224, 228, 0.3);
    border-radius: 2px;
  }
</style>
