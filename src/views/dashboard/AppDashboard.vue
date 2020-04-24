<!-- Overview and app dashboard page route ['/overview/dashboard','/app/dashboard'] -->
<template>
  <div style="margin-top:8px">
    <a-spin :spinning="headLoading">
      <div class="head-revenue-row">
        <div class="head-revenue-col" v-for="(v, key) in headRevenueData" :key="key">
          <div class="revenue">{{ v }}</div>
          <div class="range">{{ key }}</div>
        </div>
      </div>
    </a-spin>

    <div class="ds-middle">
      <om-chart-line
        class="left"
        style="border: none"
        :data="middleLineData"
        :height="350"
        :legend="{ offsetY: 16, marker: 'circle' }"
        padding="auto"
        :xTickCount="7"
        x-column="day"
        y-column="cost"
        y-format="$0,0"
        group-by="country" />
      <om-chart-ring
        class="right"
        title="Revenue by Regions"
        :data="middlePieData"
        :height="350"
        x-column="country"
        y-column="cost"
        y-format="$0,0" />
    </div>
    <div class="ds-bottom">
      <a-select
        style="margin-bottom: 16px"
        :value="bottom.dateRange"
        @change="handleRangeChange">
        <a-select-option :key="14">Last 7 days vs Previous 7 days</a-select-option>
        <a-select-option :key="56">Last 28 days vs Previous 28 days</a-select-option>
      </a-select>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-spin :spinning="bottom.loading" class="ds-bottom-card">
            <div class="title">Performance</div>
            <a-row :gutter="32">
              <a-col :span="12">
                <om-ds-bottom-chart :data="bottom.chartData" :sum="bottom.sumData" title="Revenue" y-column="cost" y-format="$0,0.00a" />
              </a-col>
              <a-col :span="12">
                <om-ds-bottom-chart :data="bottom.chartData" :sum="bottom.sumData" title="Requests" y-column="request" />
              </a-col>
            </a-row>
            <a-row :gutter="32">
              <a-col :span="12">
                <om-ds-bottom-chart :data="bottom.chartData" :sum="bottom.sumData" title="Impressions" y-column="impr" />
              </a-col>
              <a-col :span="12">
                <om-ds-bottom-chart :data="bottom.chartData" :sum="bottom.sumData" title="Fill Rate" y-column="fillRate" y-format="0,0.00a%" />
              </a-col>
            </a-row>
            <a-row :gutter="32">
              <a-col :span="12">
                <om-ds-bottom-chart :data="bottom.chartData" :sum="bottom.sumData" title="eCPM" y-column="ecpm" y-format="$0.00a"/>
              </a-col>
              <a-col :span="12"></a-col>
            </a-row>
          </a-spin>
        </a-col>
        <a-col :span="12">
          <a-spin :spinning="bottom.loading" class="ds-bottom-card">
            <div class="title">User Activity</div>
            <a-row :gutter="32">
              <a-col :span="12">
                <om-ds-bottom-chart :data="bottom.chartData" :sum="bottom.sumData" title="DAU" y-column="dau" />
              </a-col>
              <a-col :span="12">
                <om-ds-bottom-chart :data="bottom.chartData" :sum="bottom.sumData" title="ARPDAU" y-column="arpDau" y-format="$0.000"/>
              </a-col>
            </a-row>
            <a-row :gutter="32">
              <a-col :span="12">
                <om-ds-bottom-chart :data="bottom.chartData" :sum="bottom.sumData" title="DEU" y-column="deu" />
              </a-col>
              <a-col :span="12">
                <om-ds-bottom-chart :data="bottom.chartData" :sum="bottom.sumData" title="ARPDEU" y-column="arpDeu" y-format="$0.000"/>
              </a-col>
            </a-row>
            <a-row :gutter="32">
              <a-col :span="12">
                <om-ds-bottom-chart :data="bottom.chartData" :sum="bottom.sumData" title="Engagement Rate" y-column="engagementRate" y-format="0,0.00%" />
              </a-col>
              <a-col :span="12"></a-col>
            </a-row>
          </a-spin>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import PageView from '../../layouts/PageView'
import { getDashboardHeadRevenues, getDashboardRegionsRevenues, getReportList } from '../../api/report'
import OmChartLine from '../report/ChartCardG2.js'
import OmChartRing from './ChartRing.js'
import OmDsBottomChart from './BottomChart'
import { mapState } from 'vuex'
import numerify from 'numerify'
import numerifyCurrency from 'numerify/lib/plugins/currency.es'

numerify.register('currency', numerifyCurrency)

export default {
  name: 'OmAppDashboard',
  components: {
    PageView,
    OmChartLine,
    OmChartRing,
    OmDsBottomChart
  },
  data () {
    const metrics = [ 'cost', 'request', 'filled', 'impr', 'dau', 'deu' ]
    return {
      headLoading: false,
      middleLoading: false,
      headRevenueData: {},
      middleLineData: [],
      middlePieData: [],
      bottom: {
        loading: false,
        dateRange: 14,
        chartData: [],
        sumData: {},
        metrics
      }
    }
  },
  computed: mapState({
    pubAppId (state) {
      return this.$route.path === '/overview/dashboard' ? 0 : state.publisher.searchApp
    }
  }),
  created () {
    this.reloadAllData()
  },
  beforeRouteUpdate (to, from, next) {
    this.reloadAllData()
    next()
  },
  methods: {
    handleRangeChange (val) {
      this.bottom.dateRange = val
      this.loadBottomData()
    },
    reloadAllData () {
      this.loadHeadData()
      this.loadMiddleData()
      this.loadBottomData()
    },
    loadHeadData () {
      this.middleLoading = true
      const ps = {}
      if (this.pubAppId > 0) {
        ps.pubAppId = this.pubAppId
      }
      getDashboardHeadRevenues(ps)
        .then(res => {
          if (!res.code) {
            const { yesterdayRevenue, lastSevenDayRevenue, currentMonthRevenue, lastMonthRevenue } = res.data
            const format = '$0,0'
            this.headRevenueData = {
              'Yesterday': numerify(yesterdayRevenue, format),
              'Last 7 days': numerify(lastSevenDayRevenue, format),
              'This month so far': numerify(currentMonthRevenue, format),
              'Last month': numerify(lastMonthRevenue, format)
            }
          }
        })
        .finally(_ => {
          this.middleLoading = false
        })
    },
    loadMiddleData () {
      this.headLoading = true
      const ps = {}
      if (this.pubAppId > 0) {
        ps.pubAppId = this.pubAppId
      }
      getDashboardRegionsRevenues(ps)
        .then(res => {
          if (!res.code) {
            const middleLineData = []
            const sumData = {}
            res.data.forEach(row => {
              if (row.country !== 'OTHER') {
                middleLineData.push(row)
              }
              if (sumData[row.country] === undefined) {
                sumData[row.country] = row.cost
              } else {
                sumData[row.country] += row.cost
              }
            })
            this.middleLineData = middleLineData
            this.middlePieData = Object.keys(sumData).map(country => {
              return { country, cost: sumData[country] }
            })
          }
        })
        .finally(_ => {
          this.headLoading = false
        })
    },
    loadBottomData () {
      const dfmt = 'YYYY-MM-DD'
      const tmp = moment().utc().add(1, 'd')
      const dayX = {} // map date to x
      for (let j = 0; j < 2; j++) {
        // [ currentPeriod = 0, lastPeriod = 1 ]
        const g = String(j)
        for (let i = this.bottom.dateRange / 2; i > 0; --i) {
          dayX[tmp.add(-1, 'd').format(dfmt)] = { x: i, g }
        }
      }
      const ps = {}
      ps.dateBegin = moment().utc().add(-this.bottom.dateRange, 'd').format(dfmt)
      ps.dateEnd = moment().utc().format(dfmt)
      ps.type = ['lr', 'api', 'dau']
      ps.dimension = ['day']
      if (this.pubAppId > 0) {
        ps.pubAppId = [this.pubAppId]
      }
      this.bottom.loading = true
      getReportList(ps)
        .then(res => {
          if (res.code > 0) {
            return
          }
          const defaultRow = {
            fillRate: 0,
            ecpm: 0,
            arpDau: 0,
            arpDeu: 0,
            engagementRate: 0
          }
          const sumData = {}
          for (const m of this.bottom.metrics) {
            sumData[m] = [0, 0] // [ currentPeriod, lastPeriod ]
            defaultRow[m] = 0
          }
          const missedDays = { ...dayX }
          const list = res.data.map(row => {
            const xg = dayX[row.day]
            if (!xg) {
              return null
            }
            delete missedDays[row.day]
            const { x, g } = xg
            row.x = x
            row.g = g
            row.impr = row.apiImpr
            row.request = row.waterfallRequest
            row.filled = row.waterfallFilled
            row.fillRate = row.ecpm = row.arpDau = row.arpDeu = row.engagementRate = 0
            if (row.request > 0) {
              row.fillRate = row.filled / row.request
            }
            if (row.impr > 0) {
              row.ecpm = row.cost * 1000 / row.impr
            }
            if (row.dau > 0) {
              row.arpDau = row.cost / row.dau
              row.engagementRate = row.deu / row.dau
            }
            if (row.deu > 0) {
              row.arpDeu = row.cost / row.deu
            }
            for (const m of this.bottom.metrics) {
              if (!isNaN(row[m])) {
                sumData[m][g] += row[m]
              }
            }
            return row
          }).filter(row => !!row)
          // fill day data if missed
          for (const day of Object.keys(missedDays)) {
            const { x, g } = dayX[day]
            list.push({ x, g, ...defaultRow })
          }
          // fill sum rates
          sumData.fillRate = [
            sumData.filled[0] / sumData.request[0],
            sumData.filled[1] / sumData.request[1]
          ]
          sumData.ecpm = [
            sumData.cost[0] * 1000 / sumData.impr[0],
            sumData.cost[1] * 1000 / sumData.impr[1]
          ]
          sumData.arpDau = [
            sumData.cost[0] / sumData.dau[0],
            sumData.cost[1] / sumData.dau[1]
          ]
          sumData.arpDeu = [
            sumData.cost[0] / sumData.deu[0],
            sumData.cost[1] / sumData.deu[1]
          ]
          sumData.engagementRate = [
            sumData.deu[0] / sumData.dau[0],
            sumData.deu[1] / sumData.dau[1]
          ]
          this.bottom.chartData = list.sort((a, b) => b.g - a.g)
          this.bottom.sumData = sumData
        })
        .finally(_ => {
          this.bottom.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .head-revenue-row {
    background-color: white;
    height: 104px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 0 rgba(221, 224, 228, 0.3), 0 0 4px rgba(221, 224, 228, 0.3);
    border-radius: 4px;

    .head-revenue-col {
      margin-left: 24px;
      width: 25%;

      .revenue {
        font-size: 32px;
        color: #333333;
      }
      .range {
        font-size: 14px;
        color: #999999;
      }
    }
  }

  .ds-middle {
    margin-top: 8px;
    display: inline-flex;
    height: 350px;
    width: 100%;
    position: relative;

    .left, .right {
      background-color: white;
      height: 350px;
    }
    .left {
      margin-right: 8px;
      width: 100%;
    }
    .right {
      width: 280px;
      right: 0;
    }
  }

  .ds-bottom {
    margin-top: 2px;
    margin-bottom: 16px;
    background-color: white;
    padding: 16px;
    box-shadow: 0 0 0 rgba(221, 224, 228, 0.3), 0 0 4px rgba(221, 224, 228, 0.3);
    border-radius: 4px;

    .ds-bottom-card {
      border: 1px solid #EEEEEE;
      box-sizing: border-box;
      border-radius: 4px;
      padding: 24px;

      .title {
        font-weight: bold;
        font-size: 18px;
        line-height: 24px;
        color: #333333;
      }
    }
  }

</style>
