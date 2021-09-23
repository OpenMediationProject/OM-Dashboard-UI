<template>
  <div class="abTestChart">
    <div class="perforBox">
      <p>What is your A/B groups breakdown on Performance Data?</p>
      <div class="content">
        <ABTestChartSelect type="Perfor" :dataOptions="perforOptions" @setChartData="setChartData"/>
        <ABTestChartCard :cardData="cardDataPerfor"/>
        <ABTestChartGraph type="Perfor" :chartData="chartDataPerfor" :yFormat="dataFormatPerfor"/>
      </div>
    </div>
    <div class="userBox">
      <p>What is your A/B groups breakdown on User Data?</p>
      <div class="content">
        <ABTestChartSelect type="User" :dataOptions="userOptions" @setChartData="setChartData"/>
        <ABTestChartCard :cardData="cardDataUser"/>
        <ABTestChartGraph type="User" :chartData="chartDataUser" :yFormat="dataFormatUser"/>
      </div>
    </div>
  </div>
</template>

<script>
import ABTestChartSelect from './ABTestChartSelect'
import ABTestChartCard from './ABTestChartCard'
import ABTestChartGraph from './ABTestChartGraph'
import { getReportList } from '@/api/report'
import { formatData as f } from '../modules/utils'
import { calcuStartDate } from '@/utils/util'

export default {
  name: 'ABTestChart',
  components: {
    ABTestChartSelect,
    ABTestChartCard,
    ABTestChartGraph
  },
  props: {
    ruleId: {
      type: Number,
      default: 0
    },
    adnIds: {
      type: Array,
      default: () => []
    },
    instanceSelected: {
      type: String,
      default: ''
    },
    regions: {
      type: Array,
      default: () => []
    },
    daysSelected: {
      type: Number,
      default: 1
    },
    abTablePanelInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      chartDataPerfor: [],
      chartDataUser: [],
      cardDataPerfor: {},
      cardDataUser: {},
      perforOptions: [
        {
          id: 'cost',
          name: 'Revenue',
          format: '$ 0,0.00'
        },
        {
          id: 'ecpm',
          name: 'eCPM',
          format: '$ 0,0.00'
        },
        {
          id: 'request',
          name: 'Requests',
          format: '0,0'
        },
        {
          id: 'filled',
          name: 'Fills',
          format: '0,0'
        },
        {
          id: 'fillRate',
          name: 'Fillrate',
          format: '0.00 %'
        },
        {
          id: 'sdkImpr',
          name: 'Impressions',
          format: '0,0'
        }
      ],
      userOptions: [
        {
          id: 'dau',
          name: 'DAU',
          format: '0,0'
        },
        {
          id: 'imprDau',
          name: 'Impressions/DAU',
          format: '0.00'
        },
        {
          id: 'deu',
          name: 'DEU',
          format: '0,0'
        },
        {
          id: 'imprDeu',
          name: 'Impressions/DEU',
          format: '0.00'
        },
        {
          id: 'engagementRate',
          name: 'Engagement',
          format: '0.00 %'
        }
      ],
      graphParams: {
        instanceId: [],
        adnId: [],
        country: [],
        dateBegin: '',
        dateEnd: '',
        adType: [],
        appVersion: [],
        dimension: ['day', 'abt'],
        osVersion: '',
        placementId: [],
        pubAppId: [],
        sdkVersion: [],
        type: [],
        abt: [1, 2],
        ruleId: []
      },
      format: {},
      perforSID: 'cost',
      userSID: 'dau',
      reportDataPerfor: [],
      reportDataUser: [],
      dataFormatPerfor: '0,0',
      dataFormatUser: '0,0'
    }
  },
  mounted () {
    this.graphParams.ruleId.push(this.ruleId)
    this.setSupportedMetrics()
    this.getReportData()
  },
  watch: {
    adnIds: {
      handler () {
        this.getReportData()
      }
    },
    instanceSelected: {
      handler () {
        this.getReportData()
      }
    },
    regions: {
      handler () {
        this.getReportData()
      }
    },
    daysSelected: {
      handler () {
        this.getReportData()
      }
    }
  },
  methods: {
    getReportData () {
      this.fillFilterPs()
      this.graphParams.type = ['lr', 'api']
      getReportList(this.graphParams).then(res => {
        if (!res.code && res.data && res.data.length) {
          this.reportDataPerfor = res.data.sort((a, b) => a.day > b.day ? 0 : 1)
          this.setChartData(this.perforSID, 'Perfor')
        }
      })
      this.graphParams.type = ['lr', 'dau']
      getReportList(this.graphParams).then(res => {
        if (!res.code && res.data && res.data.length) {
          this.reportDataUser = res.data.sort((a, b) => a.day > b.day ? 0 : 1)
          this.setChartData(this.userSID, 'User')
        }
      })
    },
    fillFilterPs () {
      if (this.adnIds && this.adnIds.length) {
        this.graphParams.adnId = this.adnIds
      } else {
        this.graphParams.adnId = []
      }
      if (this.instanceSelected) {
        this.graphParams.instanceId = [this.instanceSelected]
      } else {
        this.graphParams.instanceId = []
      }
      if (this.regions && this.regions.length) {
        let countries = JSON.parse(JSON.stringify(this.regions))
        countries = countries.map(v => {
          if (v === 'ALL') {
            return '00'
          }
          return v
        })
        this.graphParams.country = countries
      } else {
        this.graphParams.country = []
      }
      if (this.daysSelected) {
        const startDate = calcuStartDate(this.getTempEndDate(), this.daysSelected)
        this.graphParams.dateBegin = startDate
        this.graphParams.dateEnd = calcuStartDate(this.getTempEndDate(), 1)
      } else {
        this.graphParams.dateBegin = calcuStartDate(this.getTempEndDate(), 1)
        this.graphParams.dateEnd = calcuStartDate(this.getTempEndDate(), 1)
      }
    },
    getTempEndDate () {
      return this.abTablePanelInfo.currentDate ? new Date(this.abTablePanelInfo.currentDate) : new Date()
    },
    setSupportedMetrics () {
      this.perforOptions.forEach(v => {
        this.format[v.id] = v.format
      })
      this.userOptions.forEach(v => {
        this.format[v.id] = v.format
      })
    },
    setChartData (sid, type) {
      const tempArr = []
      this[`reportData${type}`].forEach(v => {
        let valTemp = 0
        switch (sid) {
          case 'ecpm':
            valTemp = v.impr ? v.cost * 1000 / v.impr : 0
            break
          case 'fillRate':
            valTemp = v.request ? v.filled / v.request : 0
            break
          case 'engagementRate':
            valTemp = v.dau ? v.deu / v.dau : 0
            break
          default:
            valTemp = v[sid]
            break
        }
        tempArr.push({
          date: v.day,
          value: valTemp, // f(valTemp, this.format[sid])
          category: v.abt === 1 ? 'A' : 'B'
        })
      })
      this[`dataFormat${type}`] = this.format[sid]
      this[`chartData${type}`] = tempArr
      this[`cardData${type}`] = this.setCardData(sid, type)
    },
    setCardData (sid, type) {
      let aT = 0
      let aTN = 0 // 分子
      let aTD = 0 // 分母
      let bT = 0
      let bTN = 0 // 分子
      let bTD = 0 // 分母
      let diffNum = 0
      let diffRate = 0
      this[`reportData${type}`].forEach(v => {
        if (v.abt === 1) {
          switch (sid) {
            case 'ecpm':
              aTN += v.cost * 1000
              aTD += v.impr
              break
            case 'fillRate':
              aTN += v.filled
              aTD += v.request
              break
            case 'engagementRate':
              aTN += v.deu
              aTD += v.dau
              break
            default:
              aT += v[sid]
              break
          }
        } else {
          switch (sid) {
            case 'ecpm':
              bTN += v.cost * 1000
              bTD += v.impr
              break
            case 'fillRate':
              bTN += v.filled
              bTD += v.request
              break
            case 'engagementRate':
              bTN += v.deu
              bTD += v.dau
              break
            default:
              bT += v[sid]
              break
          }
        }
      })
      if (['ecpm', 'fillRate', 'engagementRate'].includes(sid)) {
        aT = aTD ? aTN / aTD : 0
        bT = bTD ? bTN / bTD : 0
      }
      diffNum = bT - aT
      diffRate = aT ? (bT - aT) / aT : 0
      return {
        aData: f(aT, this.format[sid]),
        bData: f(bT, this.format[sid]),
        diffNum: f(diffNum, this.format[sid]),
        diffRate: f(diffRate, '0.00 %')
      }
    }
  }
}
</script>

<style lang='less' scoped>
  @AColor: #F87E49;
  @BColor: #0FCCAA;
  .abTestChart {
    width: 100%;
    padding: 24px;
    height: 560px;
    background: #FBFBFB;
    display: flex;
    & > div {
      // flex-grow: 1;
      width: 49.8%;
      height: 100%;
      // background: chartreuse;
      & > p {
        margin: 0;
        padding: 0;
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 18px;
        color: #999999;
        margin-bottom: 8px;
      }
      .content {
        width: 100%;
        height: 484px;
        background: #FFFFFF;
        display: flex;
        flex-direction: column;
      }
    }
    .perforBox {
      margin-right: 16px;
    }
  }
</style>
