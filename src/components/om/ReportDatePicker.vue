<template>
  <div class="ant-row ant-form-item" style="margin-top: -1px;margin-right: 8px;">
    <!--    <div style="position: absolute;font-size: 12px;color: #999999;margin-top: -13px;right:0;">All reports and dates are in UTC</div>-->
    <a-form-item style="margin-right: 0">
      <a-range-picker
        @ok="onOk"
        class="om-date-picker"
        :allowClear="false"
        :disabled-date="disabledDate"
        :ranges="ranges"
        @calendarChange="calendarChange"
        v-decorator="['dateRange']"
        format="YYYY-MM-DD">
        <svg
          viewBox="64 64 896 896"
          data-icon="calendar"
          width="14px"
          style="margin-top:-8px;"
          slot="suffixIcon"
          height="14px"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
          class=""><path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z"></path></svg>
      </a-range-picker>
    </a-form-item>
  </div>
</template>

<script>
import moment from 'moment'

function now () {
  return moment().utc()
}

const today = now().endOf('d')
const min = moment('2018-01-01')

export default {
  name: 'OmReportDatePicker',
  methods: {
    disabledDate (date) {
      if (this.start) {
        return date.diff(this.start, 'days') > this.maxDay || date.diff(this.start, 'days') < -this.maxDay || date > today || date < min
      } else {
        return date && (date > today || date < min)
      }
    },
    onOk () {
      this.$emit('ok')
    },
    calendarChange (val) {
      if (val.length === 1) {
        this.start = val[0]
      } else {
        this.start = null
      }
    }
  },
  props: {
    maxDay: {
      type: Number,
      default: 90
    },
    value: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      start: null,
      days: now().add(-this.maxDay, 'd').startOf('d'),
      ranges: {
        Today: [now().startOf('d'), today],
        'Yesterday': [now().add(-1, 'd'), now().add(-1, 'd')],
        'This Week': [now().startOf('W'), today],
        'This Month': [now().startOf('M'), today],
        '7 Days': [now().add(-7, 'd'), today],
        '1Month': [now().add(-1, 'M'), today]
      },
      defaultValue: this.value || [now().add(-7, 'd'), today]
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
    max-width: 224px;
  }
  .om-date-picker >>> .ant-calendar-picker-input {
    font-size: 12px;
    padding-left:4px;
  }
  .om-date-picker >>> .ant-calendar-range-picker-separator {
    vertical-align: unset;
  }
</style>
