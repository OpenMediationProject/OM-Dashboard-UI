<template>
  <div class="ABTestChartNum">
    <div class="groupA group">
      <div class="boxTop">
        <div class="boxIcon"></div>
        <div class="boxTitle">Group A</div>
      </div>
      <div class="boxNum">{{ cardData.aData }}</div>
    </div>
    <div class="groupB group">
      <div class="boxTop">
        <div class="boxIcon"></div>
        <div class="boxTitle">Group B</div>
      </div>
      <div class="boxNum">{{ cardData.bData }}</div>
    </div>
    <div class="difference">
      <div class="diffTop">
        <span style="titleBox">Revenue difference</span>
        <a-tooltip placement="right" :mouseEnterDelay="0.4" style="margin-left: 4px;">
          <span slot="title" v-html="111"></span>
          <a class="tip"><img src="/icon/info.svg" ></a>
        </a-tooltip>
      </div>
      <div class="diffNum">{{ cardData.diffNum }}</div>
      <div class="diffRate">{{ cardData.diffRate }} more than Group A</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ABTestChartNum',
  data () {
    return {
    }
  },
  props: {
    cardData: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang='less' scoped>
  @AColor: #F87E49;
  @BColor: #0FCCAA;
  .ABTestChartNum {
    display: flex;
    width: 100%;
    height: 60px;
    // background: cornflowerblue;
    margin: 16px 0 24px;
    .group {
      width: 140px;
      .boxTop {
        width: 100%;
        height: 14px;
        display: flex;
        align-items: center;
        .boxIcon {
          width: 9px;
          height: 9px;
          border-radius: 9px;
        }
        .boxTitle {
          margin-left: 8px;
          font-family: Arial;
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          color: #BDBDBD;
        }
      }
      .boxNum {
        padding-left: 17px;
        margin-top: 4px;
        font-family: Arial;
        font-style: normal;
        font-weight: bold;
        font-size: 22px;
        color: #333333;
      }
    }
    .groupA {
      margin-left: 24px;
      .boxIcon {
        background: @AColor;
      }
    }
    .groupB {
      .boxIcon {
        background: @BColor;
      }
    }
    .difference {
      width: 160px;
      .diffTop {
        height: 14px;
        display: flex;
        align-items: center;
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        color: #BDBDBD;
        .titleBox {
          height: 14px;
          line-height: 14px;
        }
      }
      .diffNum {
        height: 26px;
        margin-top: 4px;
        display: flex;
        align-items: center;
        font-family: Arial;
        font-style: normal;
        font-weight: bold;
        font-size: 22px;
        color: #18921D;
      }
      .diffRate {
        height: 14px;
        margin-top: 4px;
        display: flex;
        align-items: center;
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        color: #18921D;
      }
    }
  }
</style>
