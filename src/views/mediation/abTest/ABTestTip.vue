<template>
  <div class="abSetUpBox">
    <span class="abSetUpLearnMore" v-if="learnMore">
      Laern more<span class="iconfont" style="margin-left: 4px;">&#xe605;</span>
    </span>
    <div class="abSetUpImg">
      <img src="/mediation/abSetUpImg.svg" alt="">
    </div>
    <div class="abSetUpContent">
      <p class="c_t">A/B Test</p>
      <p class="c_c">A/B testing can help you learn the revenue performance of different mediation rule<br/> for the same group of people. You can refer to the following strategy differences to<br /> create an A/B test: </p>
      <p class="c_i">1. Select different instances.</p>
      <p class="c_i">2. Select different ad network.</p>
      <p class="c_i">3. Use different sorting methods for mediation rule.</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ABTestTip',
    props: {
      learnMore: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang='less' scoped>
  @box_w: 778px;
  .abSetUpBox {
    width: @box_w;
    height: 240px;
    margin: 16px 0 46px;
    display: flex;
    position: relative;
    background: #FFFFFF;
    border: 1px solid #EEEEEE;
    box-sizing: border-box;
    border-radius: 4px;
    .abSetUpImg {
      width: 240px;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .abSetUpContent {
      width: @box_w - 240px;
      height: 100%;
      .c_t {
        margin: 26px 0 0;
        font-family: Arial;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
        color: #666666;
      }
      .c_c {
        width: @box_w - 240px - 24px;
        margin: 8px 0 24px;
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: #666666;
        word-break: break-all;
        word-wrap: break-word;
      }
      .c_i {
        margin: 0;
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        color: #666666;
      }
    }
    .abSetUpLearnMore {
      position: absolute;
      bottom: -31px;
      right: 0px;
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      color: #1A7DF1;
      cursor: pointer;
      .iconfont {
        font-size: 12px;
      }
    }
  }
</style>
