<template>
  <div class="ts-border">
    <a-card :bordered="false" :style="style">
      <a-steps class="steps" :current="currentTab" style="max-width: 600px;margin-top:40px;margin-left: 23%;text-align:center;" >
        <a-step title="Select Ad Network"/>
        <a-step title="Submit your Ad records"/>
      </a-steps>
      <div class="content">
        <step1 v-if="currentTab === 0" @nextStep="nextStep" @prevStep="prevStep"/>
        <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>
      </div>
    </a-card>
  </div>
</template>

<script>
import step1 from './Step1'
import step2 from './Step2'
import { devAppGet } from '@/api/sdk'

export default {
  name: 'Step1',
  components: {
    step1,
    step2
  },
  created () {
    this.style = 'height:' + (window.innerHeight - 140) + 'px'
    devAppGet({ pubAppId: this.$store.state.publisher.searchApp }).then(res => {
      if (res.data) {
        this.adnId = res.data.mediationId
        this.adName = res.data.className
        this.devAppId = res.data.id
        this.currentTab = 1
      }
    })
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
      adnId: null,
      adName: '',
      params: {},
      visible: false,
      currentTab: 0,
      style: 'height:500px'
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
.ts-border{
  margin-top: 4px;
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 16px;
  -webkit-box-shadow: 0px 4px 10px rgba(221, 224, 228, 0.3), 0px 0px 4px rgba(221, 224, 228, 0.3);
  box-shadow: 0px 4px 10px rgba(221, 224, 228, 0.3), 0px 0px 4px rgba(221, 224, 228, 0.3);
  border-radius: 2px;
}

</style>
