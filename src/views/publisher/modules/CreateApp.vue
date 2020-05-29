<!-- Add app router '/publisher/app/add' -->
<template>
  <a-card :bordered="false" :style="style">
    <a-steps class="steps" :current="currentTab" style="max-width: 900px;margin-top:40px;" >
      <a-step title="App ID"/>
      <a-step title="App Name"/>
      <a-step title="Final Check"/>
    </a-steps>
    <div class="content" style="height:100%">
      <step1 v-if="currentTab === 0" @nextStep="nextStep" @platInfo="platInfo" @finalCheck="finalCheck"/>
      <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
      <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish"/>
    </div>
  </a-card>
</template>

<script>
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

export default {
  name: 'CreateApp',
  components: {
    Step1,
    Step2,
    Step3
  },
  created () {
    this.style = 'height:' + (window.innerHeight - 140) + 'px'
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      currentTab: 0,
      params: {},
      publisherId: 0,
      currentStep: 0,
      appInfo: { appId: '' },
      style: 'height:600px'
    }
  },
  methods: {
    nextStep (params) {
      if (this.currentTab === 0) {
        this.appId = params.appId
        this.publisherId = params.orgId
        if (!this.appInfo) {
          this.appInfo = {}
        }
        this.appInfo.appId = params.appId
        this.appInfo.plat = params.plat
        this.appInfo.publisherId = params.orgId
      } else if (this.currentTab === 1) {
        this.appName = params.appName
        this.appInfo.appName = params.appName
      }
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.appInfo.icon) {
        this.currentTab = 0
      } else {
        if (this.currentTab > 0) {
          this.currentTab -= 1
        }
      }
    },
    platInfo (data) {
      this.appId = data.appId
      this.plat = data.plat
      if (!this.appInfo) {
        this.appInfo = {}
      }
      this.appInfo.plat = data.plat
    },
    finalCheck (params) {
      this.appInfo = params
      this.currentTab = 2
    },
    finish () {
      this.currentTab = 0
    }
  }
}
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
  .ant-card{
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 4px;
    border: 4px solid #f5f5f5;
  }
</style>
