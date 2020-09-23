import { Line } from '@antv/g2plot'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
numerify.register('currency', numerifyCurrency)

export default {
  name: 'OmReportChartG2',
  props: {
    title: {
      type: String,
      required: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      required: false
    },
    data: {
      type: Array,
      required: true
    },
    legend: {
      type: Object,
      required: false
    },
    padding: {
      type: [Object, String],
      required: false
    },
    xTickCount: {
      type: Number,
      default: 3
    },
    xColumn: {
      type: [String, Function],
      default: 'day'
    },
    yColumn: {
      type: [String, Function],
      required: true
    },
    yAlias: String,
    yFormat: {
      type: String,
      default: '0,0.0'
    },
    groupBy: {
      type: [String, Function],
      required: false
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    data (val, old) {
      this.buildChart()
    },
    yColumn () {
      this.buildChart()
    }
  },
  render (h) {
    const children = [h('div', { class: 'g2chart' })]
    if (this.title) {
      children.unshift(h('div', {
        attrs: { style: 'color: #333333; font-weight: bold; font-size: 18px; line-height: 24px; padding: 24px 0 8px 24px' }
      }, [this.title]))
    }
    return h('a-spin', {
      attrs: { style: 'border: 1px solid #EEEEEE; box-sizing: border-box; border-radius: 4px' },
      props: { spinning: this.loading }
    }, children)
  },
  destroyed () {
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  },
  methods: {
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
        if (this.groupBy) {
          return { 'x': xv, 'g': String(gv), 'y': yv }
        } else {
          return { 'x': xv, 'y': yv }
        }
      })
    },
    buildChart () {
      const chartData = this.buildChartData(this.data || [], this.xColumn, this.groupBy, this.yColumn)
      const axisCommon = {
        title: { visible: false },
        label: { style: { fontSize: 14, fill: '#BDBDBD' } },
        grid: { style: { stroke: '#F5F5F5' } },
        tickLine: { style: { stroke: '#BDBDBD' } },
        line: { style: { stroke: '#EEEEEE' } }
      }
      const opts = {
        data: chartData,
        forceFit: true,
        smooth: true,
        xField: 'x',
        yField: 'y',
        // point: { //显示数据点
        //   visible: true
        // },
        xAxis: { tickCount: this.xTickCount, ...axisCommon },
        yAxis: {
          formatter: v => numerify(v, this.yFormat),
          label: { style: { fontSize: 14, fill: '#BDBDBD' } }
        },
        meta: {
          y: { alias: this.yAlias || this.title || 'Value' }
        },
        legend: { marker: 'circle', offsetX: 0 },
        padding: [40, 46, 30, 70]
      }
      if (this.groupBy) {
        opts['seriesField'] = 'g'
      }
      for (const prop of ['height', 'legend', 'padding']) {
        if (this[prop]) {
          opts[prop] = this[prop]
        }
      }
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
      this.chart = new Line(this.$el.querySelector('.g2chart'), opts)
      this.chart.render()
    }
  }
}
