<template>
  <div class="ABTestChartGraph">
    <div style="width: 98%;" :id="`linechart${type}`"></div>
  </div>
</template>

<script>
import { Line } from '@antv/g2plot'
import { formatData as f } from '../modules/utils'

export default {
  name: 'ABTestChartGraph',
  data () {
    return {
      linePlot: null
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    chartData: {
      type: Array,
      default: () => []
    },
    yFormat: {
      type: String,
      default: '0,0'
    }
  },
  watch: {
    chartData: {
      handler (data) {
        this.showGraph(data)
      }
    }
  },
  methods: {
    initGraph (data) {
      this.linePlot = new Line(`linechart${this.type}`, {
        forceFit: true,
        height: 320,
        data: data,
        xField: 'date',
        yField: 'value',
        seriesField: 'category',
        color: ['#0FCCAA', '#F87E49'],
        legend: {
          visible: false,
          reversed: false
        },
        xAxis: {
          tickCount: 5
        },
        yAxis: {
          formatter: v => f(v, this.yFormat)
        }
      })
      this.linePlot.render()
    },
    showGraph (data) {
      if (!data.length) return
      if (!this.linePlot) {
        this.initGraph(data)
      } else {
        this.linePlot.destroy()
        this.initGraph(data)
        // this.linePlot.changeData(data)
      }
    }
  }
}
</script>

<style lang='less' scoped>
  .ABTestChartGraph {
    width: 100%;
  }
</style>
