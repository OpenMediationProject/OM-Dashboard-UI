<template>
  <div class="abTesting">
    <a-modal
      :visible="verityModal"
      @cancel="() => this.verityModal = false"
    >
      <div slot="footer" style="height: 38px">
        <a-button type="primary" style="float: right;margin-right: 0px;" @click="() => this.verityModal = false">Cancel</a-button>
        <a-button type="primary" style="float: right;margin-right: 16px;" ghost @click="stopABTest(verifyStopType)">{{ verifyStopType === 'A' ? 'Keep Group A' : 'Apply Group B' }}</a-button>
      </div>
      <div class="modalBox">
        <p class="modalTitle">{{ verifyStopType === 'A' ? 'Keep Group A' : 'Apply Group B' }}</p>
        <p class="modalDetail" v-if="verifyStopType === 'A'">This will stop the test and apply Group A to 100% of the user traffic in the mediation rule. </p>
        <p class="modalDetail" v-else>This will stop the test and apply Group B to 100% of the user traffic in the mediation rule.</p>
        <div class="modalImg">
          <img v-if="verifyStopType === 'A'" src="/icon/continuewithA.gif">
          <img v-else src="/icon/continuewithB.gif">
        </div>
      </div>
    </a-modal>
    <div class="abTestSelect" v-if="showSelect">
      <ABStatusSelect
        :abTestHistoryReports="record.abTestHistoryReports"
        @setData="setData"/>
      <span>Tested {{ panelInfo.lastNum }} days ({{ panelInfo.startDate }} ~ {{ panelInfo.endDate }}）</span>
    </div>
    <div class="dataPanel">
      <div class="dataBox">
        <span class="title">
          eCPM Difference
          <a-tooltip placement="right" :mouseEnterDelay="0.4">
            <span slot="title" v-html="111"></span>
            <a class="tip"><img src="/icon/info.svg" ></a>
          </a-tooltip>
        </span>
        <span class="num" :style="`${abTestPanelData.revenueStatus === 1 ? '': (abTestPanelData.revenueStatus === 0 ? 'color: #D5432F;' : 'color: #18921D;' )}`">{{ abTestPanelData.revenueStatus === 2 ? '+' : '' }}{{ abTestPanelData.revenueDifNum }}</span>
        <span class="rate" :style="`${abTestPanelData.revenueStatus === 1 ? '': (abTestPanelData.revenueStatus === 0 ? 'color: #D5432F;' : 'color: #18921D;' )}`">{{ abTestPanelData.revenueStatus === 2 ? '+' : '' }}{{ abTestPanelData.revenueDifRate }} more than Group A</span>
      </div>
      <div class="dataBox">
        <span class="title">
          Revenue Difference
          <a-tooltip placement="right" :mouseEnterDelay="0.4">
            <span slot="title" v-html="111"></span>
            <a class="tip"><img src="/icon/info.svg" ></a>
          </a-tooltip>
        </span>
        <span class="num" :style="`${abTestPanelData.ecpmStatus === 1 ? '': (abTestPanelData.ecpmStatus === 0 ? 'color: #D5432F;' : 'color: #18921D;' )}`">{{ abTestPanelData.ecpmStatus === 2 ? '+' : '' }}{{ abTestPanelData.ecpmDifNum }}</span>
        <span class="rate" :style="`${abTestPanelData.ecpmStatus === 1 ? '': (abTestPanelData.ecpmStatus === 0 ? 'color: #D5432F;' : 'color: #18921D;' )}`">{{ abTestPanelData.ecpmStatus === 2 ? '+' : '' }}{{ abTestPanelData.ecpmDifRate }} more than Group A</span>
      </div>
    </div>
    <div class="dataTable">
      <a-table
        class="table"
        :columns="showOpera ? abTestColumns2 : abTestColumns1"
        :data-source="abTestData"
        :pagination="false"
      >
        <span slot="group" slot-scope="group" class="abTestGroup">
          <span>{{ group.type }}</span>
          <span>{{ group.name }}</span>
        </span>
        <span slot="operation" slot-scope="group" class="abTestOperation">
          <span class="operaA" v-if="group.type === 'A'" @click="verifyStopABTest(group.type)">Keep Group A</span>
          <span class="operaB" v-else @click="verifyStopABTest(group.type)">Apply Group B</span>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
  import ABStatusSelect from './ABStatusSelect'
  import { getABTestReport, stopABTest } from '@/api/mediation'
  import numerify from 'numerify'
  import numerifyCurrency from 'numerify/lib/plugins/currency.es'

  numerify.register('currency', numerifyCurrency)

  export default {
    name: 'ABTestReport',
    components: {
      ABStatusSelect
    },
    props: {
      record: {
        type: Object,
        default: null
      },
      showSelect: {
        type: Boolean,
        default: true
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
      }
    },
    watch: {
      adnIds: {
        handler () {
          this.getReportData({ id: this.record.abTestHistoryReports[0].id })
        }
      },
      instanceSelected: {
        handler () {
          this.getReportData({ id: this.record.abTestHistoryReports[0].id })
        }
      },
      regions: {
        handler () {
          this.getReportData({ id: this.record.abTestHistoryReports[0].id })
        }
      },
      daysSelected: {
        handler () {
          this.getReportData({ id: this.record.abTestHistoryReports[0].id })
        }
      }
    },
    mounted () {
      if (this.record && this.record.abTestHistoryReports && this.record.abTestHistoryReports.length) {
        this.record.abTestHistoryReports = this.record.abTestHistoryReports.reverse()
        this.setData({ id: this.record.abTestHistoryReports[0].id })
        this.topId = this.record.abTestHistoryReports[0].id
      }
    },
    data () {
      return {
        metrics: {
          revenue: '$ 0,0.00a',
          ecpm: '$ 0.00a',
          fillRate: '0,0.00a%',
          impression: '0,0.[00]a',
          fills: '0,0.[00]a'
        },
        abTestColumns1: [
          {
            title: 'Group',
            dataIndex: 'group',
            key: 'group',
            scopedSlots: { customRender: 'group' }
          },
          {
            title: 'User Allocation',
            dataIndex: 'userAllocation',
            key: 'userAllocation'
          },
          {
            title: 'Fill Rate',
            dataIndex: 'fillRate',
            key: 'fillRate'
          },
          {
            title: 'Fills',
            dataIndex: 'fills',
            key: 'fills'
          },
          {
            title: 'Impressions',
            dataIndex: 'impression',
            key: 'impression'
          },
          {
            title: 'eCPM',
            dataIndex: 'ecpm',
            key: 'ecpm'
          },
          {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue'
          }
        ],
        abTestColumns2: [
          {
            title: 'Group',
            dataIndex: 'group',
            key: 'group',
            scopedSlots: { customRender: 'group' }
          },
          {
            title: 'User Allocation',
            dataIndex: 'userAllocation',
            key: 'userAllocation'
          },
          {
            title: 'Fill Rate',
            dataIndex: 'fillRate',
            key: 'fillRate'
          },
          {
            title: 'Fills',
            dataIndex: 'fills',
            key: 'fills'
          },
          {
            title: 'Impressions',
            dataIndex: 'impression',
            key: 'impression'
          },
          {
            title: 'eCPM',
            dataIndex: 'ecpm',
            key: 'ecpm'
          },
          {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue'
          },
          {
            title: 'Operation',
            dataIndex: 'group',
            key: 'operation',
            scopedSlots: { customRender: 'operation' }
          }
        ],
        abTestData: [
          {
            key: '1',
            group: {
              type: 'A',
              name: 'Control Group'
            },
            userAllocation: '50%',
            fillRate: '--',
            fills: '--',
            impression: '--',
            ecpm: '--',
            revenue: '--'
          },
          {
            key: '2',
            group: {
              type: 'B',
              name: 'Test Group'
            },
            userAllocation: '50%',
            fillRate: '--',
            fills: '--',
            impression: '--',
            ecpm: '--',
            revenue: '--'
          }
        ],
        abTestDataOrigin: [
          {
            key: '1',
            group: {
              type: 'A',
              name: 'Control Group'
            },
            userAllocation: '50%',
            fillRate: '--',
            fills: '--',
            impression: '--',
            ecpm: '--',
            revenue: '--'
          },
          {
            key: '2',
            group: {
              type: 'B',
              name: 'Test Group'
            },
            userAllocation: '50%',
            fillRate: '--',
            fills: '--',
            impression: '--',
            ecpm: '--',
            revenue: '--'
          }
        ],
        abTestPanelData: {
          revenueDifNum: '$ 0.00',
          revenueDifRate: '0.00%',
          revenueStatus: 1,
          ecpmDifNum: '$ 0.00',
          ecpmDifRate: '0.00%',
          ecpmStatus: 1
        },
        abTestPanelDataOrigin: {
          revenueDifNum: '$ 0.00',
          revenueDifRate: '0.00%',
          revenueStatus: 1,
          ecpmDifNum: '$ 0.00',
          ecpmDifRate: '0.00%',
          ecpmStatus: 1
        },
        panelInfo: {
          startDate: '',
          endDate: '',
          lastNum: '',
          currentDate: ''
        },
        topId: -1,
        showOpera: false,
        verityModal: false,
        verifyStopType: 'A',
        reportPs: {
          id: -1,
          instanceId: null,
          adNetworkIds: null,
          placementId: null,
          lastDays: 0,
          countries: null
        }
      }
    },
    methods: {
      setData (ps) {
        this.getReportData(ps)
        this.setPanelData(ps)
      },
      getReportData (ps) {
        getABTestReport(this.getSendPs(ps)).then(res => {
          if (res.code === 0 && res.data && res.data.length) {
            let r1 = 0
            let r2 = 0
            let e1 = 0
            let e2 = 0
            res.data.forEach(v => {
              if (v.abt === 1) {
                this.setTableData(0, v)
                r1 = v.revenue
                e1 = v.ecpm
              } else {
                this.setTableData(1, v)
                r2 = v.revenue
                e2 = v.ecpm
              }
            })
            this.abTestPanelData.revenueDifNum = numerify(r2 - r1, '$ 0,0.00a')
            this.abTestPanelData.revenueDifRate = numerify((r2 - r1) / r1, '0,0.00a%')
            this.abTestPanelData.revenueStatus = r2 === r1 ? 1 : (r2 - r1 > 0 ? 2 : 0)
            this.abTestPanelData.ecpmDifNum = numerify(e2 - e1, '$ 0,0.00a')
            this.abTestPanelData.ecpmDifRate = numerify((e2 - e1) / e1, '0,0.00a%')
            this.abTestPanelData.ecpmStatus = e2 === e1 ? 1 : (e2 - e1 > 0 ? 2 : 0)
          } else {
            this.abTestData = JSON.parse(JSON.stringify(this.abTestDataOrigin))
            this.abTestPanelData = JSON.parse(JSON.stringify(this.abTestPanelDataOrigin))
          }
          if (ps.id === this.topId && this.record.abTest === 1) {
            this.showOpera = true
          } else {
            this.showOpera = false
          }
        })
      },
      getSendPs (ps) {
        const sendPs = {}
        const tempPs = JSON.parse(JSON.stringify(this.reportPs))
        if (this.adnIds && this.adnIds.length) {
          tempPs.adNetworkIds = this.adnIds.join(',')
        }
        if (this.instanceSelected) {
          tempPs.instanceId = this.instanceSelected
        }
        if (this.regions && this.regions.length) {
          tempPs.countries = this.regions
          tempPs.countries = tempPs.countries.map(v => {
            if (v === 'ALL') {
              return '00'
            }
            return v
          })
          tempPs.countries = tempPs.countries.join(',')
        }
        if (this.daysSelected) {
          tempPs.lastDays = this.daysSelected
        }
        Object.assign(tempPs, ps)
        for (const key in tempPs) {
          if (tempPs[key]) {
            sendPs[key] = tempPs[key]
          }
        }
        return sendPs
      },
      setTableData (i, v) {
        for (const key in this.metrics) {
          this.abTestData[i][key] = numerify(v[key], this.metrics[key])
        }
      },
      setPanelData ({ id }) {
        const tempObj = this.record.abTestHistoryReports.filter(v => v.id === id)[0]
        if (tempObj.status === 1) {
          this.panelInfo.endDate = 'Today'
        } else {
          this.panelInfo.endDate = this.changeDate(tempObj.endTime)
        }
        this.panelInfo.startDate = this.changeDate(tempObj.createTime)
        this.panelInfo.lastNum = this.getLastNum(tempObj.createTime, tempObj.endTime)
        this.panelInfo.currentDate = tempObj.endTime
        this.$emit('changePanelTime', this.panelInfo)
      },
      changeDate (timestamp) {
        const date = new Date()
        date.setTime(timestamp)
        let m = date.getMonth() + 1
        let d = date.getDate()
        if (m < 10) {
          m = '0' + m
        }
        if (d < 10) {
          d = '0' + d
        }
        return date.getFullYear() + '-' + m + '-' + d
      },
      getLastNum (startTime, endTime) {
        return Math.floor(Math.abs((endTime - startTime)) / (1000 * 60 * 60 * 24))
      },
      verifyStopABTest (type) {
        this.verifyStopType = type
        this.verityModal = true
      },
      stopABTest (type) {
        const params = { ruleId: this.record.id, abTest: type === 'A' ? 1 : 2 }
        stopABTest(params).then(res => {
          if (res.code === 0) {
            this.$emit('stopedABTest')
          }
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  @AColor: #F87E49;
  @BColor: #0FCCAA;
  .abTesting {
    width: 1024px;
    display: flex;
    flex-direction: column;
    margin: 16px 0;
    .abTestSelect {
      width: 100%;
      height: 32px;
      display: flex;
      align-items: center;
      & > span {
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        color: #999999;
        margin-left: 10px;
      }
    }
    .dataPanel {
      width: 100%;
      height: 62px;
      margin-top: 32px;
      display: flex;
      .dataBox {
        width: 185px;
        height: 100%;
        display: flex;
        flex-direction: column;
        .title {
          font-family: Arial;
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          line-height: 14px;
          color: #999999;
        }
        .num {
          font-family: Arial;
          font-style: normal;
          font-weight: bold;
          font-size: 22px;
          line-height: 26px;
          margin-top: 4px;
          // color: #18921D;
          color: #999999;
        }
        .rate {
          font-family: Arial;
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          line-height: 14px;
          margin-top: 4px;
          // color: #18921D;
          color: #999999;
        }
      }
    }
    .dataTable {
      margin-top: 16px;
      .table {
        border: 1px solid #EEEEEE;
        box-sizing: border-box;
        border-radius: 2px;
        /deep/ .ant-table-tbody .ant-table-row:nth-of-type(1) td:nth-of-type(1){
          border-left: 4px solid #F87E49;
        }
        /deep/ .ant-table-tbody .ant-table-row:nth-of-type(2) td:nth-of-type(1){
        border-left: 4px solid #0FCCAA;
        }
      }
      .abTestGroup {
        display: flex;
        flex-direction: column;
        & > span:nth-of-type(2) {
          // border-left: 4px solid #F87E49;
          // border-left: 4px solid #0FCCAA;
          font-family: Arial;
          font-style: normal;
          font-weight: normal;
          font-size: 12px;
          line-height: 14px;
          color: #999999;
          margin-top: 4px;
        }
      }
    }
  }
  .abTestOperation {
    width: 100%;
    height: 65px;
    position: absolute;
    top: 0;
    right: 0;
    & > span{
      width: 100%;
      height: 100%;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      cursor: pointer;
    }
    .operaA {
      background: @AColor;
    }
    .operaB {
      background: @BColor;
    }
  }
  /deep/ .ant-table-row td {
    position: relative;
  }
  /deep/ .ant-modal-footer {
    border: 0!important;
  }
  .modalBox {
    width: 100%;
    // background: lightpink;
    margin-top: 18px;
    .modalTitle {
      margin: 0;
      padding: 0;
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 28px;
      color: #333333;
      text-align: center;
    }
    .modalDetail {
      margin: 16px 0 32px;
      padding: 0;
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 18px;
      color: #666666;
    }
    .modalImg {
      text-align: center;
    }
  }
</style>
