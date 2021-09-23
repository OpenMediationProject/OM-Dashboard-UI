<template>
  <div class="biddingPane">
    <div class="biddingHeader">
      <span>
        <span class="iconfont">&#xe61a;</span>
      </span>
      <span>In-app Bidding Instance</span>
      <span>3 enabled instances</span>
    </div>
    <div class="biddingBody">
      <TierTable
        :columns="columnsTotal"
        :dataSources="dataTotal"
      >
        <template v-slot:total>
          <div class="tier_total">
            <span>Total</span>
          </div>
        </template>
        <template v-slot:bidRequests="{ record }">
          <div class="tier_requests">
            <span>{{ record.bidRequests }}</span>
          </div>
        </template>
        <template v-slot:bidRate="{ record }">
          <div class="tier_requests">
            <span>{{ record.bidRate }}</span>
          </div>
        </template>
        <template v-slot:win="{ record }">
          <div class="tier_requests">
            <span>{{ record.win }}</span>
          </div>
        </template>
        <template v-slot:winRate="{ record }">
          <div class="tier_requests">
            <span>{{ record.winRate }}</span>
          </div>
        </template>
        <template v-slot:impressions="{ record }">
          <div class="tier_requests">
            <span>{{ record.impressions }}</span>
          </div>
        </template>
        <template v-slot:eCPM="{ record }">
          <div class="tier_requests">
            <span>{{ record.ecpm }}</span>
          </div>
        </template>
      </TierTable>
      <TierTable
        :type="type"
        :columns="abTestStatus === 0 ? columns1 : columns2"
        :dataSources="dataSources_inner"
        :abTestStatus="abTestStatus"
        @calculateTotal="calculateTotal"
        @setScroll="() => $emit('setScroll')"
      >
        <template v-slot:status="{ record }">
          <div class="tier_status">
            <a-switch :checked="record.priority === 1" :disabled="type.indexOf('A') > -1" @click="handelStatusUpdate(record)">
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
          </div>
        </template>
        <template v-slot:instance="{ record }">
          <div class="tier_instance">
            <span>{{ record.name }}</span>
            <span>{{ getAdnNameById(record.adnId) }}</span>
          </div>
        </template>
        <template v-slot:bidRequests="{ record }">
          <div class="tier_requests">
            <span>{{ f(record.bidRequestLatest) }}</span>
          </div>
        </template>
        <template v-slot:bidRate="{ record }">
          <div class="tier_requests">
            <span>{{ f(record.bidRate, '0.00 %') }}</span>
          </div>
        </template>
        <template v-slot:win="{ record }">
          <div class="tier_requests">
            <span>{{ f(record.bidWinLatest) }}</span>
          </div>
        </template>
        <template v-slot:winRate="{ record }">
          <div class="tier_requests">
            <span>{{ f(record.winRate, '0.00 %') }}</span>
          </div>
        </template>
        <template v-slot:impressions="{ record }">
          <div class="tier_requests">
            <span>{{ f(record.bidImpressionLatest) }}</span>
          </div>
        </template>
        <template v-slot:eCPM="{ record }">
          <div class="tier_requests">
            <span>{{ '$ ' + f(record.bidEcpm,'0,0.00') }}</span>
          </div>
        </template>
      </TierTable>
    </div>
  </div>
</template>

<script>
import TierTable from './TierTable.vue'
import { getAdnNameById as getAdnNameByIdUtil, formatData } from '../modules/utils'

export default {
  components: {
    TierTable
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    dataSources: {
      type: Array,
      default () {
        return []
      }
    },
    dataSourcesType: {
      type: Number,
      default: 0
    },
    abTestStatus: {
      type: Number,
      default: 0
    }
  },
  watch: {
    dataSources: {
      handler (datas) {
        if (this.dataSourcesType === 0) {
          this.initData(datas)
        } else if (this.dataSourcesType === 1) {
          this.dataSources_filter = JSON.parse(JSON.stringify(datas))
          this.clearProperty(this.dataSources_filter)
          this.setShowDatas(this.dataSources_filter)
        } else if (this.dataSourcesType === 2) {
          this.dataSources_filter = JSON.parse(JSON.stringify(datas))
          this.clearProperty(this.dataSources_filter)
          this.setShowDatas(this.dataSources_filter)
        } else {}
      }
    }
  },
  data () {
    return {
      columns1: [
        {
          id: 'status',
          title: this.$t('comm.status'),
          textAlign: 'center',
          marginLeft: '16px',
          width: '35%',
          location: 'l',
          show: true
        },
        {
          id: 'instance',
          title: this.$t('mediation.instance'),
          textAlign: 'left',
          width: '55%',
          location: 'l',
          show: true
        },
        {
          id: 'bidRequests',
          title: 'Bid Requests',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'bidRate',
          title: 'Bid Rate',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'win',
          title: 'Win',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'winRate',
          title: 'Win Rate',
          textAlign: 'center',
          width: '20%',
          location: 'm'
        },
        {
          id: 'impressions',
          title: 'Impressions',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'eCPM',
          title: 'eCPM',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'dragBtn',
          textAlign: 'left',
          width: '3%',
          location: 'r',
          show: false
        }
      ],
      columns2: [
        {
          id: 'empty',
          title: '',
          textAlign: 'left',
          width: '10%',
          location: 'l',
          show: true
        },
        {
          id: 'instance',
          title: this.$t('mediation.instance'),
          textAlign: 'left',
          width: '90%',
          location: 'l',
          show: true
        },
        {
          id: 'bidRequests',
          title: 'Bid Requests',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'bidRate',
          title: 'Bid Rate',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'win',
          title: 'Win',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'winRate',
          title: 'Win Rate',
          textAlign: 'center',
          width: '20%',
          location: 'm'
        },
        {
          id: 'impressions',
          title: 'Impressions',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'eCPM',
          title: 'eCPM',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'dragBtn',
          textAlign: 'left',
          width: '3%',
          location: 'r',
          show: false
        }
      ],
      columnsTotal: [
        {
          id: 'total',
          title: '',
          textAlign: 'left',
          width: '100%',
          location: 'l',
          show: true
        },
        {
          id: 'bidRequests',
          title: 'Bid Requests',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'bidRate',
          title: 'Bid Rate',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'win',
          title: 'Win',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'winRate',
          title: 'Win Rate',
          textAlign: 'center',
          width: '20%',
          location: 'm'
        },
        {
          id: 'impressions',
          title: 'Impressions',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'eCPM',
          title: 'eCPM',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        }
      ],
      dataTotal: [
        {
          bidRequests: '--',
          bidRate: '--',
          win: '--',
          winRate: '--',
          impressions: '--',
          ecpm: '--'
        }
      ],
      tempObj: {},
      dataSources_inner: [],
      dataSources_filter: [],
      dataSources_copy: []
    }
  },
  methods: {
    f (v, f) {
      return formatData(v, f)
    },
    initData (datas) {
      if (this.abTestStatus) {
        this.dataSources_inner = JSON.parse(JSON.stringify(datas.filter(v => v.priority)))
      } else {
        this.dataSources_inner = JSON.parse(JSON.stringify(datas))
      }
      this.sortDatas(this.dataSources_inner)
    },
    handelStatusUpdate (record) {
      if (!record.priority) {
        if (this.dataSources_inner.find(row => { return row.adnId === record.adnId && row.priority > 0 })) {
          this.$message.error(this.$t('mediation.already_existed_hb'))
          return false
        }
      }
      record.priority = record.priority > 0 ? 0 : 1
      // 内层数据属于断层数据，需要进行再注入，目的是为了保存修改操作使用同一个Datas
      this.dataSources_inner.map(v => {
        if (v.id === record.id) {
          v.priority = record.priority
        }
      })
      this.sortDatas(this.dataSources_inner)
      if (this.dataSourcesType === 1) {
        this.dataSources_copy.map(v => {
          if (v.id === record.id) {
            v.priority = record.priority
          }
        })
        this.sortDatas(this.dataSources_copy)
      }
    },
    sortDatas (datas) {
      datas.sort((a, b) => {
        return b.priority - a.priority
      })
    },
    getAdnNameById (v) {
      return getAdnNameByIdUtil(v)
    },
    clearProperty (datas) {
      datas.map(v => {
        delete v.priority
        delete v.groupLevel
      })
    },
    setShowDatas (filterDatas) {
      if (this.dataSourcesType === 1) {
        // 先保存
        this.dataSources_copy = JSON.parse(JSON.stringify(this.dataSources_inner))
        // 再选择是否显示与隐藏
        this.dataSources_inner = this.dataSources_inner.filter(v => filterDatas.find(t => v.id === t.id))
        // 数据进行合并
        this.filterDatas(filterDatas)
      } else if (this.dataSourcesType === 2) {
        // 数据状态由1转2
        if (this.dataSources_copy.length) {
          // 获取保存值
          this.dataSources_inner = JSON.parse(JSON.stringify(this.dataSources_copy))
        }
        // 数据状态由1转2，或者由0转2;数据进行合并
        this.filterDatas(filterDatas)
      } else {}
    },
    filterDatas (filterData) {
      this.dataSources_inner.map(v => {
        filterData.forEach(e => {
          if (e.id === v.id) {
            Object.assign(v, e)
          }
        })
      })
    },
    getSubData () {
      let subData = []
      if (this.dataSourcesType === 1) {
        subData = this.dataSources_copy
      } else {
        subData = this.dataSources_inner
      }
      this.setSubAbtest(subData, 2)
      return subData
    },
    setSubAbtest (data, num) {
      data.map(v => {
        v.abTest = num
      })
    },
    calculateTotal () {
      const _that = this
      this.$nextTick(function () {
        _that.tempObj = {
          bidRequests: 0,
          bidResponseLatest: 0,
          bidRequestLatest: 0,
          win: 0,
          bidWinLatest: 0,
          impressions: 0,
          bidWinPriceLatest: 0,
          bidImpressionLatest: 0
        }
        const data = _that.dataSources_inner.filter(v => v.priority === 1)
        if (data && data.length) {
          data.forEach(v => {
            _that.tempObj.bidRequests += v.bidRequestLatest
            _that.tempObj.bidResponseLatest += v.bidResponseLatest
            _that.tempObj.bidRequestLatest += v.bidRequestLatest
            _that.tempObj.win += v.bidWinLatest
            _that.tempObj.bidWinLatest += v.bidWinLatest
            _that.tempObj.impressions += v.bidImpressionLatest
            _that.tempObj.ecpm += v.bidEcpm
          })
          _that.dataTotal[0].bidRequests = _that.f(_that.tempObj.bidRequests)
          _that.dataTotal[0].bidRate = _that.tempObj.bidRequestLatest > 0 ? _that.f(_that.tempObj.bidResponseLatest / _that.tempObj.bidRequestLatest, '0.00 %') : '0.00 %'
          _that.dataTotal[0].win = _that.f(_that.tempObj.win)
          _that.dataTotal[0].winRate = _that.tempObj.bidResponseLatest > 0 ? _that.f(_that.tempObj.bidWinLatest / _that.tempObj.bidResponseLatest, '0.00 %') : '0.00 %'
          _that.dataTotal[0].impressions = _that.f(_that.tempObj.impressions)
          _that.dataTotal[0].ecpm = _that.tempObj.bidImpressionLatest > 0 ? _that.f(_that.tempObj.bidWinPriceLatest / _that.tempObj.bidImpressionLatest, '$ 0.00a') : '$ 0.00'
        } else {
          _that.dataTotal[0].bidRequests = '--'
          _that.dataTotal[0].bidRate = '--'
          _that.dataTotal[0].win = '--'
          _that.dataTotal[0].winRate = '--'
          _that.dataTotal[0].impressions = '--'
          _that.dataTotal[0].ecpm = '--'
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
  @bidding-color: #B28BD9;
  .biddingPane {
    width: 100%;
    border-left: 4px solid @bidding-color;
    .biddingHeader {
      width: 100%;
      height: 26px;
      display: flex;
      align-items: center;
      position: relative;
      & > span:nth-of-type(1) {
        width: 38px;
        height: 26px;
        border-radius: 0px 16px 16px 0px;
        background: @bidding-color;
        position: relative;
        .iconfont {
          position: absolute;
          color: #FFFFFF!important;
          width: 14px;
          height: 14px;
          top: 2px;
          left: 12.5px;
        }
      }
      & > span:nth-of-type(2) {
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        margin-left: 4px;
        color: @bidding-color;
      }
      & > span:nth-of-type(3) {
        position: absolute;
        right: 8px;
        top: 5px;
        height: 26px;
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        color: #BDBDBD;
      }
    }
  }
  .tier_status {
    width: 100%;
    height: 100%;
    display: flex;
    margin-left: 8px;
    align-items: center;
  }
  .tier_instance {
    display:flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    & > span:nth-of-type(1) {
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 18px;
      color: #333333;
      margin-bottom: 4px;
    }
    & > span:nth-of-type(2) {
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: #999999;
    }
  }
  .tier_requests {
    display:flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }
  .tier_total {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    & > span {
      margin-right: 8px;
      color: #333333;
    }
  }
</style>
