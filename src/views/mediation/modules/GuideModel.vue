<template>
  <div>
    <a-tooltip v-if="type === 1" :style="`position: absolute;top: ${ top };left: ${ left };`" :visible="visible" :placement="placement" overlayClassName="my-tooltip">
      <template slot="title">
        <div style="font-weight: bold;font-size: 16px;position: relative; width: 392px;padding-bottom: 16px;">{{ guideTitle }} <img src="/close.svg" @click="closeGuide" style="right: 24px;top: 24px;float: right;padding-top: 4px;"></div>
        <span>{{ guideContent }}</span>
        <div class="boxBt" style="display: flex;height: 32px;justify-content: space-between; align-items: flex-end;margin: 24px 0 8px 0">
          <a class="box_right" :href="linkUrl" target="_blank" style="color: #FFFFFF;">{{ $t('mediation.readMore') }}<span class="iconfull iconfont" style="margin-left: 4px;">&#xe605;</span></a>
          <div class="box_left">
            <a-button type="primary" style="border: 1px solid #FFFFFF;border-radius: 4px;background: #3DADFF;margin-right: 16px;" @click="laterGuide">{{ $t('page.overview.Later') }}</a-button>
            <a-button style="color: #3DADFF;border: 1px solid rgb(255, 255, 255);" @click="nextGuideNum">{{ $t('comm.start') }}</a-button>
          </div>
        </div>
      </template>
    </a-tooltip>
    <a-tooltip v-if="type === 2" :style="`position: absolute;top: ${ top };left: ${ left };`" :visible="visible" :placement="placement" overlayClassName="my-tooltip">
      <template slot="title">
        <div style="width: 704px; height: 180px; display: flex; justify-content: space-between;">
          <div class="boxImg" style="width: 320px; height: 180px; margin-right: 24px;">
            <img style="width: 100%;" :src="guideImg">
          </div>
          <div class="boxContent" style="flex: 1; position: relative;">
            <div class="box_head" style="width: 100%; height: 24px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: Source Han Sans HW SC; font-style: normal; font-weight: bold; font-size: 16px; color: #FFFFFF;">{{ guideTitle }}</span>
              <img src="/close.svg" @click="closeGuide" style="width: 12px; height: 12px;"/>
            </div>
            <div class="box_text" style="width: 100%; margin-top: 16px;font-family: Arial;font-style: normal;font-weight: normal;font-size: 14px;color: #FFFFFF;">{{ guideContent }}</div>
            <div class="box_bt" style="position: absolute; top: 148px; left: 0px; width: 100%; display: flex; justify-content: flex-end;">
              <div>
                <img src="/tip/left.svg" type="primary" style="border-radius: 4px;margin-right: 8px;" @click="preGuideNum" />
                <span :style="`margin-right: ${ currentNum === totalNum ? '40px' : '0px' };`">{{ currentNum }} / {{ totalNum }}</span>
                <img v-if="currentNum !== totalNum" src="/tip/right.svg" style="color: #3DADFF;margin-left: 8px;" @click="nextGuideNum" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </a-tooltip>
    <a-tooltip v-if="type === 3" :style="`position: absolute;top: ${ top };left: ${ left };`" :visible="visible" :placement="placement" overlayClassName="my-tooltip">
      <template slot="title">
        <div style="width: 360px; height: 160px; display: flex; justify-content: space-between;">
          <div class="boxContent" style="flex: 1; position: relative;">
            <div class="box_head" style="width: 100%; height: 24px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: Source Han Sans HW SC; font-style: normal; font-weight: bold; font-size: 16px; color: #FFFFFF;">{{ guideTitle }}</span>
              <img src="/close.svg" @click="closeGuide" style="width: 12px; height: 12px;"/>
            </div>
            <div class="box_text" style="width: 100%; margin-top: 16px;font-family: Arial;font-style: normal;font-weight: normal;font-size: 14px;color: #FFFFFF;">{{ guideContent }}</div>
            <div class="box_bt" style="position: absolute; top: 128px; left: 0px; width: 100%; display: flex; justify-content: flex-end;">
              <div>
                <img src="/tip/left.svg" type="primary" style="border-radius: 4px;margin-right: 8px;" @click="preGuideNum" />
                <span :style="`margin-right: ${ currentNum === totalNum ? '40px' : '0px' };`">{{ currentNum }} / {{ totalNum }}</span>
                <img v-if="currentNum !== totalNum" src="/tip/right.svg" style="color: #3DADFF;margin-left: 8px;" @click="nextGuideNum" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </a-tooltip>
  </div>
</template>

<script>

export default {
  name: 'Mask',
  props: {
    placement: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '0'
    },
    left: {
      type: String,
      default: '0'
    },
    type: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    totalNum: {
      type: Number,
      default: 3
    },
    currentNum: {
      type: Number,
      default: 1
    },
    guideTitle: {
      type: String,
      default: ''
    },
    guideContent: {
      type: String,
      default: ''
    },
    linkUrl: {
      type: String,
      default: 'javascript:;'
    },
    guideImg: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // visible: false
    }
  },
  methods: {
    preGuideNum () {
      this.$emit('preGuideNum')
    },
    nextGuideNum () {
      this.$emit('nextGuideNum')
    },
    closeGuide () {
      this.$emit('closeGuide')
    },
    laterGuide () {
      this.$emit('laterGuide')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
