<template>
  <div class="manualSelect">
    <div class="head_select_box">
      <span>Tier {{ tierIndex }}</span>
      <a-select
        :value="selectVal"
        style="width: 120px"
        :dropdownMatchSelectWidth="false"
        :dropdownMenuStyle="{ width: '120px', margin: '0' }"
        :disabled="disabled"
        @change="handleChange"
      >
        <a-icon slot="suffixIcon" type="down" />
        <a-select-option value="manual">
          {{ $t('mediation.manual') }}
        </a-select-option>
        <a-select-option value="auto">
          {{ $t('mediation.auto') }}
        </a-select-option>
      </a-select>
    </div>
    <div class="head_tip_box">3 enabled instances</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectVal: 'manual'
    }
  },
  props: {
    tierIndex: {
      type: Number,
      default: 1
    },
    autoManual: {
      type: String,
      default: 'manual'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    autoManual (val) {
      this.selectVal = val
    }
  },
  methods: {
    handleChange (v) {
      this.selectVal = v
      if (v === 'auto') {
        this.$emit('changeManualToAuto', this.tierIndex)
      } else {
        this.$emit('changeAutoToManual', this.tierIndex)
      }
    }
  }
}
</script>
<style lang='less' scoped>
  /deep/ .ant-select-selection {
    // width: 100px;
    height: 32px;
    background: #E0F6FF;
    border-radius: 16px;
    border: 0;
    color: #1A7DF1;
  }
  /deep/ .ant-select-selection__placeholder, /deep/ .ant-select-selection-selected-value {
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    color: #1A7DF1;
    font-size: 18px;
  //   line-height: 32px;
  }
  /deep/ .ant-select-focused .ant-select-selection, /deep/  .ant-select-selection:active, /deep/  .ant-select-selection:focus {
    border-color: none!important;
    box-shadow: none!important;
  }
  /deep/ .ant-select-arrow .ant-select-arrow-icon {
    color: #1A7DF1;
  }
  .manualSelect {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    .head_select_box {
      width: 182px;
      height: 32px;
      background: #E0F6FF;
      border-radius: 0px 16px 16px 0px;
      display: flex;
      align-items: center;
      & > span {
        width: 46px;
        margin-left: 16px;
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        color: #333333;
      }
    }
    .head_tip_box {
      margin-right: 8px;
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      color: #BDBDBD;
    }
  }
</style>
