<template>
  <a-spin :spinning="loading" class="chart-card">
    <ve-line
      :judge-width="true"
      :height="height"
      :resizeable="true"
      :title="{ text: title, left: 5, top: 5, textStyle: { color: '#333333', fontWeight: 'bold', fontSize: 18, lineHeight: 24 } }"
      :legend="{ top: 5, right: 5 }"
      :data="chartData"
      :grid="{ top: 60, bottom: 10 }"
      :settings="chartSettings"
      :loading="loading">
    </ve-line>
  </a-spin>
</template>

<script>
import 'echarts/lib/component/title'
import VeLine from 'v-charts/lib/line.common'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'
numerify.register('currency', numerifyCurrency)

export default {
  name: 'OmChartLine',
  components: {
    VeLine
  },
  props: {
    title: {
      type: String,
      required: true
    },
    height: {
      type: [String, Number],
      default: '248px'
    },
    loading: {
      type: Boolean,
      default: false
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
    yFormat: {
      type: String,
      default: '0,0.00a'
    },
    groupBy: {
      type: [String, Function],
      required: true
    }
  },
  methods: {
    getColumnValue (d, x) {
      if (x instanceof Function) {
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
      const v = {}
      // group by (x,g), sum(y)
      data.forEach(d => {
        const xv = this.getColumnValue(d, x)
        const gv = this.getColumnValue(d, g)
        const yv = this.getColumnValue(d, y)
        if (!v[xv]) v[xv] = {}
        if (!v[xv][gv]) v[xv][gv] = 0
        v[xv][d[g]] += yv
      })

      const col = {}
      let rows = []
      Object.keys(v).forEach(a => {
        const row = {}
        row.x = a
        Object.keys(v[a]).forEach(b => {
          const val = v[a][b]
          if (!isNaN(val)) {
            col[b] = true
            row[b] = val
          }
        })
        rows.push(row)
      })
      rows = rows.sort((a, b) => {
        if (a.x === b.x) {
          return 0
        } else if (a.x > b.x) {
          return 1
        } else {
          return -1
        }
      })
      const columns = [ 'x', ...Object.keys(col) ]
      return { columns, rows }
    }
  },
  data () {
    return {
      chartSettings: {
        yAxisType: [ this.yFormat ]
      }
    }
  },
  computed: {
    chartData () {
      return this.buildChartData(this.data, this.xColumn, this.groupBy, this.yColumn)
    }
  }
}
</script>

<style type="less" scoped>
  .chart-card {
    border: 1px solid #EEEEEE;
    box-sizing: border-box;
    border-radius: 4px;
  }

</style>
