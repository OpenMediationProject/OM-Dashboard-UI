<template>
  <div class="abTablePane">
    <OmFocus v-if="addModel" />
    <AddInstance
      v-if="addModel"
      :isNeedGroupLevel="true"
      @addInstancesCancel="()=> this.addModel = false"
      @refreshData="afterAddInstances"
    />
    <a-form :form="form" :hideRequiredMark="true" class="filterBar">
      <a-row type="flex" justify="start" style="height: 44px;margin-top:12px;position: relative;">
        <OmAdNetworkSelect
          name="adnetworkSelect"
          :pubAppId="appId"
          @change="adnChange"
          size="default"
          width="180px"
          style="margin-left:24px;margin-right:8px; display:inline-block; "/>
        <OmInstanceSelect
          name="instanceSelect"
          @change="insSelectChange"
          :adnIds="adnIds"
          :hb="true"
          :allowClear="true"
          width="180px"
          modelName="instanceId"
          :placementId="this.placementId"/>
        <a-form-item>
          <RegionsSelect
            :defaultSelected="resionDefaultArrs"
            @change="regoinsSelectedId"
            size="default"
            style="margin-left: 8px;margin-top:2px;width:180px;"/>
        </a-form-item>
        <a-form-item>
          <DaysSelect
            ref="daySelect"
            style="margin-left: 8px;"
            @change="daysSelectedId"
            size="default"/>
        </a-form-item>
        <div :style="`position: absolute; right: 24px; top: 4px;`" v-if="abTestStatus === 0">
          <a-button type="primary" ghost @click="instanceAdd"><span class="iconfont" style="margin-right: 4px;">&#xe609;</span>{{ $t('mediation.AddInstance') }}</a-button>
        </div>
      </a-row>
    </a-form>
    <a-card class="card-noline om-card-style panelBox" :bordered="false" v-if="abTestStatus === 1">
      <div slot="title">A/B Test: In-app Bidding Test <a-divider type="vertical" /> <span class="cardPanelTime"> Tested {{ abTablePanelInfo.lastNum }} days ({{ abTablePanelInfo.startDate }} ~ {{ abTablePanelInfo.endDate }}）</span></div>
      <ABTestReport
        :record="recordUpper"
        :showSelect="false"
        :adnIds="adnIds"
        :instanceSelected="instanceIds.join(',')"
        :regions="regionsTier"
        :daysSelected="daysSelected"
        @changePanelTime="(obj) => abTablePanelInfo = obj"
        @stopedABTest="stopedABTest" />
      <a-divider style="height: 1px;" />
      <div class="viewMore" @click="() => reportViewMore = !reportViewMore">View more data<span class="iconfont">{{ reportViewMore ? '&#xe603;' : '&#xe602;' }}</span></div>
      <ABTestChart
        v-if="reportViewMore"
        :ruleId="ruleId"
        :adnIds="adnIds"
        :instanceSelected="instanceIds.join(',')"
        :regions="regionsTier"
        :daysSelected="daysSelected"
        :abTablePanelInfo="abTablePanelInfo"/>
    </a-card>
    <p v-else class="abTable-del">The data of the current page is the historical data of the instance of the mediation rule, which is only used as a reference for configuring the A/B test.</p>
    <div class="abTableContainer">
      <!-- A 组 -->
      <div class="container containerA">
        <div class="conHeader">
          <span><img src="/abtest/A.svg"></span>
          <span>Control Group: 50% </span>
        </div>
        <div class="conBody">
          <BiddingPane
            ref="bidding_A"
            :dataSources="dataSources_bidding_A"
            :abTestStatus="abTestStatus"
            type="bidding_A"
            @setScroll="setScroll"
          />
          <WaterfallPane
            ref="waterfall_A"
            :dataSources="dataSources_waterfall_A"
            :abTestStatus="abTestStatus"
            type="waterfall_A"
            @setScroll="setScroll"
          />
        </div>
      </div>
      <!-- B 组 -->
      <div class="container containerB">
        <div class="conHeader">
          <span><img src="/abtest/B.svg"></span>
          <span>Test Group: 50%</span>
        </div>
        <div class="conBody">
          <BiddingPane
            ref="bidding_B"
            :dataSources="dataSources_bidding_B"
            :dataSourcesType="dataSourcesType"
            :abTestStatus="abTestStatus"
            type="bidding_B"
            @setScroll="setScroll"
          />
          <WaterfallPane
            ref="waterfall_B"
            :dataSources="dataSources_waterfall_B"
            :dataSourcesType="dataSourcesType"
            :newSources="dataSources_addWaterfall_B"
            :abTestStatus="abTestStatus"
            type="waterfall_B"
            @setScroll="setScroll"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BiddingPane from './BiddingPane'
import WaterfallPane from './WaterfallPane'

import { mediationRuleInstanceList } from '@/api/mediation'
import OmAdNetworkSelect from '@/components/om/AdNetworkSelect'
import OmInstanceSelect from '../modules/InstanceSelect'
import RegionsSelect from '@/components/om/RegionsSelect'
import DaysSelect from '../modules/DaysSelect'
import AddInstance from '../modules/AddInstances'
import OmFocus from '@/components/OmFocus'
import ABTestReport from './ABTestReport'
import ABTestChart from './ABTestChart'

export default {
  name: 'ABTablePane',
  components: {
    BiddingPane,
    WaterfallPane,
    OmAdNetworkSelect,
    OmInstanceSelect,
    DaysSelect,
    RegionsSelect,
    AddInstance,
    OmFocus,
    ABTestReport,
    ABTestChart
  },
  props: {
    appId: {
      type: Number,
      default: 0
    },
    placementId: {
      type: Number,
      default: 0
    },
    ruleId: {
      type: Number,
      default: 0
    },
    abTestStatus: {
      type: Number,
      default: 0
    },
    recordUpper: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      scrollLeft: 0,
      // appId: this.$route.params.pubAppId,
      // placementId: this.$route.params.placementId,
      // ruleId: this.$route.params.ruleId,
      adnIds: [],
      instanceIds: [],
      resionDefaultArrs: null,
      regionsTier: [],
      daysSelected: 1,
      dataSources_bidding_A: [],
      dataSources_bidding_A_copy: [],
      dataSources_bidding_B: [],
      dataSources_addBidding_B: [],
      dataSources_waterfall_A: [],
      dataSources_waterfall_A_copy: [],
      dataSources_waterfall_B: [],
      dataSources_addWaterfall_B: [],
      dataSourcesType: -1,
      form: this.$form.createForm(this),
      addModel: false,
      reportViewMore: false,
      abTablePanelInfo: {}
    }
  },
  mounted () {
    this.setScroll()
    this.search(false)
  },
  methods: {
    setScroll () {
      const _that = this
      const tddoms = document.getElementsByClassName('sc_bm')
      try {
        for (let i = 0; i < tddoms.length; i++) {
          tddoms[i].scrollLeft = _that.scrollLeft
        }
        for (let i = 0; i < tddoms.length; i++) {
          (function (i) {
            tddoms[i].onscroll = function () {
              _that.scrollLeft = tddoms[i].scrollLeft
              for (let j = 0; j < tddoms.length; j++) {
                if (i !== j) {
                  tddoms[j].scrollLeft = tddoms[i].scrollLeft
                }
              }
            }
          })(i)
        }
      } catch (e) {}
    },
    search (flag) {
      const params = { ruleId: this.ruleId, pubAppId: this.appId, placementId: this.placementId, adNetworkIds: '', lastDays: this.daysSelected }
      if ((this.adnIds && this.adnIds.length) || (this.instanceIds && this.instanceIds.length)) {
        params.adNetworkIds = this.adnIds ? this.adnIds.join(',') : ''
        params.instanceId = this.instanceIds && this.instanceIds.length ? this.instanceIds.join(',') : ''
        this.dataSourcesType = 1
      } else {
        if (this.dataSourcesType === -1) {
          this.dataSourcesType = 0
        } else {
          this.dataSourcesType = 2
        }
      }
      const tempCountries = JSON.parse(JSON.stringify(this.regionsTier))
      if (this.regionsTier && this.regionsTier.indexOf('ALL') > -1) {
        tempCountries.splice(tempCountries.indexOf('ALL'), 1)
        tempCountries.push('00')
      }
      if (tempCountries.length) {
        params.countries = tempCountries.join(',')
      }
      const biddingATemp = []
      const biddingBTemp = []
      const waterfallATemp = []
      const waterfallBTemp = []
      mediationRuleInstanceList(params).then(res => {
        if (!res.code) {
          res.data.forEach(row => {
            this.setRowData(row)
            if (!row.priority) {
              row.priority = 0
            }
            if (row.hbStatus === 1) {
              if (row.abTest === 1) {
                biddingATemp.push(row)
              } else if (row.abTest === 2) {
                biddingBTemp.push(row)
              } else {
                biddingATemp.push(JSON.parse(JSON.stringify(row)))
                biddingBTemp.push(JSON.parse(JSON.stringify(row)))
              }
            } else {
              row.editPriority = false
              if (row.abTest === 1) {
                waterfallATemp.push(row)
              } else if (row.abTest === 2) {
                waterfallBTemp.push(row)
              } else {
                waterfallATemp.push(JSON.parse(JSON.stringify(row)))
                waterfallBTemp.push(JSON.parse(JSON.stringify(row)))
              }
            }
          })
          this.dataSources_bidding_A = biddingATemp
          this.dataSources_bidding_B = biddingBTemp
          this.dataSources_waterfall_A = waterfallATemp
          this.dataSources_waterfall_B = waterfallBTemp
          if (!flag) {
            this.dataSources_bidding_A_copy = JSON.parse(JSON.stringify(biddingATemp))
            this.dataSources_waterfall_A_copy = JSON.parse(JSON.stringify(waterfallATemp))
          }
        }
      })
    },
    setRowData (row) {
      // row.bidRequestLatest = Math.floor(Math.random() * (1 - 100) + 100)
      // row.instanceRequestLatest = Math.floor(Math.random() * (1 - 100) + 100)
      // waterfall
      row.fillRate = row.instanceFilledLatest > 0 ? row.instanceFilledLatest / row.instanceRequestLatest : 0
      row.ecpm = row.costLatest > 0 ? row.costLatest * 1000 / row.apiImprLatest : 0
      // bidding
      row.bidRate = row.bidRequestLatest > 0 ? row.bidResponseLatest / row.bidRequestLatest : 0
      row.winRate = row.bidResponseLatest > 0 ? row.bidWinLatest / row.bidResponseLatest : 0
      row.bidEcpm = row.bidImpressionLatest > 0 ? row.bidWinPriceLatest / row.bidImpressionLatest : 0
    },
    adnChange (val) {
      this.adnIds = val
      this.instanceIds = []
      this.search(true)
    },
    insSelectChange (val) {
      this.instanceIds = [val]
      this.search()
    },
    regoinsSelectedId (val) {
      this.regionsTier = val
      this.search(true)
    },
    daysSelectedId (val) {
      this.daysSelected = val
      this.search(true)
    },
    instanceAdd () {
      this.addModel = true
    },
    afterAddInstances (datas) {
      if (!datas || !datas.length) return
      const dataSourcesBiddingTemp = []
      const dataSourcesWaterfallTemp = []
      this.form.resetFields(['adnetworkSelect'])
      this.form.resetFields(['instanceSelect'])
      this.adnIds = []
      this.instanceIds = []
      this.dataSourcesType = 0
      this.$nextTick(function () {
        datas.forEach(row => {
          this.setRowData(row)
          row.priority = 1
          if (row.hbStatus === 1) {
            dataSourcesBiddingTemp.push(row)
          } else {
            row.editPriority = false
            dataSourcesWaterfallTemp.push(row)
          }
        })
        if (dataSourcesBiddingTemp.length) {
          dataSourcesBiddingTemp.forEach(v => {
            this.dataSources_bidding_B.push(v)
          })
        }
        if (dataSourcesWaterfallTemp.length) {
          this.dataSources_addWaterfall_B = dataSourcesWaterfallTemp
        }
      })
    },
    getSubData () {
      let biddingData = []
      let waterfallData = []
      this.dataSources_bidding_A_copy.forEach(v => {
        v.abTest = 1
      })
      biddingData = biddingData.concat(JSON.parse(JSON.stringify(this.dataSources_bidding_A_copy)))
      biddingData = biddingData.concat(JSON.parse(JSON.stringify(this.$refs.bidding_B.getSubData())))
      biddingData.map(v => {
        if (v.abTest === 2) {
          v.placementRuleInstanceId = -1
        }
      })
      this.dataSources_waterfall_A_copy.forEach(v => {
        v.abTest = 1
      })
      waterfallData = waterfallData.concat(JSON.parse(JSON.stringify(this.dataSources_waterfall_A_copy)))
      waterfallData = waterfallData.concat(JSON.parse(JSON.stringify(this.$refs.waterfall_B.getSubData())))
      waterfallData.map(v => {
        if (v.abTest === 2) {
          v.placementRuleInstanceId = -1
        }
      })
      return {
        biddingData: biddingData,
        waterfallData: waterfallData
      }
    },
    stopedABTest () {
      this.$router.push({
        name: 'MediationList',
        query: {
          type: '2'
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
  @AColor: #F87E49;
  @BColor: #0FCCAA;
  @bidding-color: #B28BD9;
  @waterfall-color: #49ACF0;
  .abTable-del {
    width: 100%;
    text-align: center;
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    padding: 0;
    margin: 16px auto;
  }
  .abTableContainer {
    width: 100%;
    // background: chartreuse;
    display: flex;
    .container {
      width: 49.5%;
      position: relative;
      border-radius: 8px 8px 0 0;
      .conHeader {
        display: flex;
        height: 64px;
        border-radius: 4px;
        & > span:nth-of-type(1) {
          margin-top: 8px;
          margin-left: 24px;
          width: 20px;
          height: 20px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        & > span:nth-of-type(2) {
          margin-top: 8px;
          margin-left: 8px;
          font-family: Arial;
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 20px;
          color: #FFFFFF;
        }
      }
      .conBody {
        width: 100%;
        background: #FFFFFF;
        border-radius: 16px 16px 0px 0px;
        position: relative;
        z-index: 1;
        margin-top: -28px;
        display: flex;
        flex-direction: column;
        padding: 24px 0 0 24px;
      }
    }
    .containerA {
      margin-right: 1%;
      border: 1px solid @AColor;
      .conHeader {
        background: @AColor;
      }
    }
    .containerB {
      border: 1px solid @BColor;
      .conHeader {
        background: @BColor;
      }
    }
  }
  .filterBar {
    background: #FFFFFF;
    height: 64px;
    overflow: hidden;
    margin-top: 32px;
  }
  .panelBox {
    margin: 24px 0;
    /deep/ .ant-card-body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .viewMore {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #1A7DF1;
    cursor: pointer;
    .iconfont {
      font-size: 12px;
      color: #1A7DF1;
      margin-left: 4px;
    }
  }
  .cardPanelTime {
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: #999999;
  }
</style>
