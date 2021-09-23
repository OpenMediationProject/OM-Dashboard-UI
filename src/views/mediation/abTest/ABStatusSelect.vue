<template>
  <div class="abStatusSelect">
    <a-select
      :defaultValue="abTestHistoryReports.length ? abTestHistoryReports[abTestHistoryReports.length - 1].name : ''"
      @change="handleChange"
      :dropdownMatchSelectWidth="false">
      <a-icon slot="suffixIcon" type="down" />
      <a-select-option :value="item.id" v-for="(item, index) in abTestHistoryReports" :key="`${Math.random()}_${index}`">
        {{ item.name }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
export default {
  name: 'ADNSelect',
  data () {
    return {
      dataOptions: []
    }
  },
  props: {
    abTestHistoryReports: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleChange (v) {
      this.$emit('setData', { id: v })
    },
    changeWidth (len) {
      this.width = Math.ceil(140 / 11 * len) + 'px'
    }
  }
}
</script>
<style lang='less' scoped>
@import '~ant-design-vue/dist/antd.less';
@bidding-color: #B28BD9;
.selectBox {
  position: relative;
}
.iconfont {
  color: @bidding-color!important;
}
.iconSelect {
  position: absolute;
  left: 100px;
  top: 50%;
  transform: translateY(-50%);
}
.iconOption {
  position: absolute;
  left: 180px;
  top: 50%;
  transform: translateY(-50%);
}
.AdnSelect{
  width: 140px;
  height: 32px;
  background: #E0F6FF;
}
/deep/ .ant-select-selection {
  // width: 140px;
  height: 32px;
  background: #E0F6FF;
  border-radius: 16px;
  border: 0;
  color: #1A7DF1;
  // margin: 12px 0;
}
/deep/ .ant-select-selection__placeholder, /deep/ .ant-select-selection-selected-value{
  font-family: Arial;
  font-style: normal;
  font-weight: normal;
  color: #1A7DF1;
  font-size: 18px;
  margin-right: 8px;
  margin-left: 8px;
}
/deep/ .ant-select-arrow .ant-select-arrow-icon {
  color: #1A7DF1;
}
/deep/ .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active  {
  box-shadow: none!important;
}
</style>
