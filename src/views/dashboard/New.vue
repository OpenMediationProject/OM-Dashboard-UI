<template>
  <div class="bc" :style="{height: height}">
    <div class="bc-left">
      <div class="bc-title">{{ title }}</div>
      <div class="bc-value">{{ value }}</div>
      <div :class="['bc-compare', upDown ]">
        <span>{{ growthValue }}</span>
        <span style="margin-left: 6px">({{ growthRate }})</span>
      </div>
    </div>
    <div class="bc-right">
      <div class="g2chart" :style="{height: height}"></div>
    </div>
  </div>
</template>

<script>
import { Line } from '@antv/g2plot'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
import numerifyPercent from 'numerify/lib/plugins/percent.es'

numerify.register('currency', numerifyCurrency)
numerify.register('percent', numerifyPercent)

export default {
  name: 'OmDashboardBottomChart',
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    sum: {
      type: Object,
      required: true
    },
    yColumn: {
      type: [String, Function],
      required: true
    },
    yFormat: {
      type: String,
      default: '0,0.00a'
    },
    dateRange: {
      type: Number,
      default: 14
    }
  },
  data () {
    return {
      chart: null,
      height: 80,
      value: '',
      growthValue: 0,
      growthRate: 0,
      upDown: ''
    }
  },
  watch: {
    data (val, old) {
      this.buildChart()
    },
    sum () {
      this.calcValue()
    }
  },
  mounted () {
    this.calcValue()
    this.buildChart()
  },
  destroyed () {
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  },
  methods: {
    numerify,
    calcValue () {
      const y = this.sum[this.yColumn]
      if (!y || y.length < 2) {
        return
      }
      // eslint-disable-next-line prefer-const
      let [ current, last ] = y
      current = isNaN(current) ? 0 : current
      last = isNaN(last) ? 0 : last
      const v = current - last
      this.upDown = v < 0 ? 'down' : 'up'
      this.value = numerify(current, this.yFormat)
      this.growthValue = numerify(v, this.yFormat)
      if (this.growthValue === '0$.000') {
        this.growthValue = '$0.000'
      }
      if (last > 0) {
        this.growthRate = numerify(current / (last || 1) - 1, '+0,0.00a%')
      } else {
        // this.growthRate = numerify(current / (last || 1), '+0,0.00a%')
        this.growthRate = '--'
      }
    },
    getColumnValue (d, x) {
      if (x === undefined) {
        return undefined
      } else if (x instanceof Function) {
        return x.call(d, d)
      } else {
        return d[x]
      }
    },
    /**
     * build echart data
     * @param {Array} data from response
     * @param {String} x x-column
     * @param {String} g groupBy
     * @param {String} y y-column
     */
    buildChartData (data, x, g, y) {
      return data.map(d => {
        const xv = this.getColumnValue(d, x)
        const gv = this.getColumnValue(d, g)
        const yv = this.getColumnValue(d, y)
        return { 'x': xv, 'g': gv, 'y': yv }
      })
    },
    buildChart () {
      if (!this.data) {
        return
      }
      const chartData = this.buildChartData(this.data, 'x', 'g', this.yColumn)
      if (this.chart) {
        this.chart.changeData(chartData)
        this.chart.repaint()
      } else {
        const hide = { visible: false }
        const opts = {
          data: chartData,
          forceFit: true,
          smooth: true,
          height: this.height,
          padding: [0, 0, 8, 0],
          tooltip: hide,
          legend: hide,
          xAxis: { line: hide, tickLine: hide, label: hide },
          yAxis: { grid: hide, label: hide },
          xField: 'x',
          yField: 'y',
          seriesField: 'g',
          color: [ '#C7E7FF', '#3DADFF' ]
        }
        this.chart = new Line(this.$el.querySelector('.g2chart'), opts)
        this.chart.render()
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .bc {
    margin-top: 16px;
    width: 100%;
    display: inline-flex;
    position: relative;
    box-sizing: border-box;

    .bc-left {
      width: 128px;
      min-width: 128px;
      margin-right: 8px;
      display: block;

      .bc-title {
        font-size: 14px;
        line-height: 16px;
        color: #BDBDBD;
      }
      .bc-value {
        font-size: 28px;
        line-height: 32px;
        margin: 4px 0;
        color: #666666;
      }
      .bc-compare {
        font-size: 14px;
        line-height: 16px;
        display: inline-flex;
      }
      .bc-compare.up {
        color: #18921D;
      }
      .bc-compare.down {
        color: #D5432F;
      }
    }

    .bc-right {
      width: 100%;
      box-sizing: border-box;
      display: block;
    }
  }
</style>
