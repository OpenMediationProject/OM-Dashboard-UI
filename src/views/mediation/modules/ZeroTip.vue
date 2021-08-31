<template>
  <a-alert
    class="allZeroWarning"
    :style="`${ 'width: '+ width +';' } margin: 0 auto;${ !top ? '' : 'margin-top:' + top + ';'} ${ !bottom ? '' : 'margin-bottom:' + bottom + ';'}`"
    banner
    closable
    showIcon
    type="error"
  >
    <span slot="message">
      <span style="font-size: 14px;color: #666666;">{{ $t('mediation.allZero_tip') }} </span>
      <a style="font-size: 14px;color: #1A7DF1;" target="_blank" :href="$i18n.locale === 'zhCN' ? 'link：https://support.openmediation.com/hc/zh-cn/categories/360001950234-SDK%E9%9B%86%E6%88%90' : 'https://support.openmediation.com/hc/en-us/categories/360001950234-SDK-Integration'">{{ $t('mediation.readMore') }}<span class="iconfont" style="margin-left: 6px;">&#xe605;</span></a>
    </span>
    <span slot="icon" style="margin-bottom: 10px;"><a-icon type="warning" theme="filled" /></span>
    <span slot="closeText"><span class="iconfont zeroClose">&#xe61f;</span></span>
  </a-alert>
</template>

<script>
export default {
  name: 'ZeroTip',
  props: {
    top: {
      type: String,
      default: ''
    },
    bottom: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '882px'
    }
  }
}
</script>

<style lang="less" scoped>
.allZeroWarning /deep/ .ant-alert-icon {
  top: 8px!important;
}
.zeroClose {
  color: #BDBDBD!important;
}
</style>
