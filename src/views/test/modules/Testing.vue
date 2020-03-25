<template>
  <a-card :bordered="false" :style="style">
    <a-steps class="steps" :current="currentTab" style="max-width: 600px;margin-top:40px;margin-left: 250px;text-align:center;" >
      <a-step title="Select Ad Network"/>
      <a-step title="Submit your Ad records"/>
    </a-steps>
    <div class="content">
      <step1 v-if="currentTab === 0" @nextStep="nextStep" @prevStep="prevStep"/>
      <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
    </div>
  </a-card>
</template>

<script>
import step1 from './Step1'
import step2 from './Step2'

export default {
  name: 'Step1',
  components: {
    step1,
    step2
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
      form: this.$form.createForm(this),
      plat: 0,
      params: {},
      visible: false,
      currentTab: 0,
      style: 'height:1200px'
    }
  },
  methods: {
    add () {
      this.visible = true
    },
    nextStep (params) {
      if (this.currentTab === 0) {
        this.adnId = params[0].adnId
        this.adName = params[0].className
      }
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
    },
    prevStep () {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    }
  }
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
  .ant-col-19 {
    width: 500px;
  }
}
.button-div {
  text-align: center;
  bottom: 0;
  z-index: 100;
  position: fixed;
  width: 80%;
  height: 100px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 32.36%, #ffffff 100%);
}
</style>
