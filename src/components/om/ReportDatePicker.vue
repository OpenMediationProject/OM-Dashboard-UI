<template>
  <div style="display: inline;float: right;">
    <a-form-item style="margin-right: 0">
      <a-range-picker
        class="om-date-picker"
        :allowClear="false"
        :disabled-date="disabledDate"
        :ranges="ranges"
        v-decorator="['dateRange']"
        format="YYYY-MM-DD"/>
    </a-form-item>
  </div>
</template>

<script>
import moment from 'moment'

function now () {
  return moment().utc()
}

const _3monthAgo = now().add(-3, 'M').startOf('d')
const today = now().endOf('d')

export default {
  name: 'OmReportDatePicker',
  methods: {
    disabledDate (date) {
      return date && (date < _3monthAgo || date > today)
    }
  },
  data () {
    return {
      ranges: {
        Today: [now().startOf('d'), today],
        'This Week': [now().startOf('W'), today],
        'This Month': [now().startOf('M'), today],
        '7 Days': [now().add(-7, 'd'), today],
        '1Month': [now().add(-1, 'M'), today]
      },
      defaultValue: [now().add(-7, 'd'), today]
    }
  },
  created () {
    this.$options.parent.form.getFieldDecorator('dateRange', {
      initialValue: this.defaultValue
    })
  }
}
</script>
<style type="less" scoped>
  .om-date-picker {
    width: 224px;
  }
  .om-date-picker >>> .ant-calendar-picker-input {
    font-size: 12px;
  }
  .om-date-picker >>> .ant-calendar-range-picker-separator {
    vertical-align: unset;
  }
</style>
