<template>
  <div class="abTestChartSelect">
    <a-select
      :defaultValue="dataOptions.length ? dataOptions[0].name : ''"
      @change="handleChange"
      :dropdownMatchSelectWidth="false">
      <a-icon slot="suffixIcon" type="down" />
      <a-select-option :value="item.id" v-for="(item, index) in dataOptions" :key="`${Math.random()}_${index}`">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <div class="group">by Group</div>
  </div>
</template>

<script>
export default {
  name: 'ABTestChartSelect',
  data () {
    return {
    }
  },
  props: {
    dataOptions: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleChange (sid) {
      this.$emit('setChartData', sid, this.type)
    },
    changeWidth (len) {
      this.width = Math.ceil(140 / 11 * len) + 'px'
    }
  }
}
</script>
<style lang='less' scoped>
.abTestChartSelect {
  display: flex;
  margin-top: 16px;
}
.group {
  width: 91px;
  height: 32px;
  background: #E0F6FF;
  border-radius: 0 16px 16px 0;
  font-family: Arial;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  color: #333333;
  line-height: 32px;
}
/deep/ .ant-select-selection {
  // width: 140px;
  height: 32px;
  background: #E0F6FF;
  // border-radius: 16px;
  border-radius: 0;
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
