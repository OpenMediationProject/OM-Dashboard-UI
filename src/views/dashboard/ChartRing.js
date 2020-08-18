import { Ring } from '@antv/g2plot'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
numerify.register('currency', numerifyCurrency)

export default {
  name: 'OmChartPie',
  props: {
    title: String,
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
      default: '0,0.00a'
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    data () {
      this.buildChart()
    }
  },
  render (h) {
    return h('a-spin', {
      style: {
        borderRadius: '4px'
      },
      props: {
        spinning: this.loading
      }
    }, [h('div', { class: 'g2chart' })])
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
     * @param {String} y y-column
     */
    buildChartData (data, x, y) {
      const map = {}
      let total = 0
      const list = data.map(d => {
        const xv = this.getColumnValue(d, x)
        const yv = this.getColumnValue(d, y)
        map[xv] = yv
        total += yv
        return { 'x': xv, 'y': yv }
      }).sort((a, b) => {
        const len = a.x.length - b.x.length
        if (len === 0) { // len:0 is normal country
          return b.y - a.y
        }
        return len
      })
      return { list, map, total }
    },
    buildChart () {
      const { list, map, total } = this.buildChartData(this.data, this.xColumn, this.yColumn)
      if (this.chart) {
        this.chart.changeData(list)
        this.chart.repaint()
      } else {
        const hide = { visible: false }
        const opts = {
          data: list,
          title: { text: this.title, visible: true, style: { color: '#333333', fontWeight: 'bold' } },
          forceFit: true,
          radius: 1,
          innerRadius: 0.4,
          colorField: 'x',
          angleField: 'y',
          legend: hide,
          label: {
            type: 'inner',
            formatter (text, item) {
              return `${item._origin.x}: ${numerify(item._origin.y, '$0,0a')}`
            }
          },
          tooltip: {
            htmlContent (x) {
              return `<div>${x} ${numerify(map[x] / total, '0.0%')}</div>`
            }
          },
          statistic: [hide]
        }
        if (this.height > 0) {
          opts.height = this.height
        }
        this.chart = new Ring(this.$el.querySelector('.g2chart'), opts)
        this.chart.render()
      }
    }
  }
}
