<template>
  <div class="waterfallPane">
    <div class="waterfallHeader">
      <span>
        <span class="iconfont">&#xe61b;</span>
      </span>
      <span>Waterfall Instance</span>
    </div>
    <TierTable
      :columns="abTestStatus === 0 ? columns1 : columns2"
      :dataSources="dataTotal"
    >
      <template v-slot:total>
        <div class="tier_total">
          <span>Total</span>
        </div>
      </template>
      <template v-slot:requests="{ record }">
        <div class="tier_requests">
          <span>{{ record.requests }}</span>
        </div>
      </template>
      <template v-slot:fillRate="{ record }">
        <div class="tier_requests">
          <span>{{ record.fillRate }}</span>
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
    <WaterfallTable
      :ref="`table_${type}`"
      :dataSources="dataSources"
      :type="type"
      :dataSourcesType="dataSourcesType"
      :newSources="newSources"
      :abTestStatus="abTestStatus"
      @setScroll="() => $emit('setScroll')"
      @calculateTotal="calculateTotal"
    />
  </div>
</template>

<script>
import WaterfallTable from './WaterfallTable'
import TierTable from './TierTable'
import { formatData as f } from '../modules/utils'

export default {
  components: {
    WaterfallTable,
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
    newSources: {
      type: Array,
      default () {
        return []
      }
    },
    abTestStatus: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      columns1: [
        {
          id: 'total',
          title: '',
          textAlign: 'left',
          width: '100%',
          location: 'l',
          show: true
        },
        {
          id: 'requests',
          title: 'Requests',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'fillRate',
          title: 'Fill Rate',
          textAlign: 'center',
          width: '16%',
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
          width: '20%',
          location: 'm'
        }
      ],
      columns2: [
        {
          id: 'total',
          title: '',
          textAlign: 'left',
          width: '100%',
          location: 'l',
          show: true
        },
        {
          id: 'requests',
          title: 'Requests',
          textAlign: 'center',
          width: '19%',
          location: 'm'
        },
        {
          id: 'fillRate',
          title: 'Fill Rate',
          textAlign: 'center',
          width: '19%',
          location: 'm'
        },
        {
          id: 'impressions',
          title: 'Impressions',
          textAlign: 'center',
          width: '19%',
          location: 'm'
        },
        {
          id: 'eCPM',
          title: 'eCPM',
          textAlign: 'center',
          width: '24%',
          location: 'm'
        }
      ],
      dataTotal: [
        {
          requests: '--',
          fillRate: '--',
          impressions: '--',
          ecpm: '--'
        }
      ],
      tempObj: {}
    }
  },
  methods: {
    getSubData () {
      return this.$refs[`table_${this.type}`].getSubData()
    },
    calculateTotal () {
      const _that = this
      this.$nextTick(function () {
        _that.tempObj = {
          requests: 0,
          instanceFilledLatest: 0,
          instanceRequestLatest: 0,
          impressions: 0,
          ecpm: 0
        }
        const data = this.$refs[`table_${this.type}`].getShowTierData()
        if (data && data.length) {
          data.forEach(v => {
            _that.tempObj.requests += v.instanceRequestLatest
            _that.tempObj.instanceFilledLatest += v.instanceFilledLatest
            _that.tempObj.instanceRequestLatest += v.instanceRequestLatest
            _that.tempObj.impressions += v.mediationImprLatest
            _that.tempObj.ecpm += v.ecpm
          })
          _that.dataTotal[0].requests = f(_that.tempObj.requests)
          _that.dataTotal[0].fillRate = _that.tempObj.instanceRequestLatest > 0 ? f(_that.tempObj.instanceFilledLatest / _that.tempObj.instanceRequestLatest, '0.00 %') : '0.00 %'
          _that.dataTotal[0].impressions = f(_that.tempObj.impressions)
          _that.dataTotal[0].ecpm = f(_that.tempObj.ecpm, '$ 0.00a')
        } else {
          _that.dataTotal[0].requests = '--'
          _that.dataTotal[0].fillRate = '--'
          _that.dataTotal[0].impressions = '--'
          _that.dataTotal[0].ecpm = '--'
        }
      }, 0)
    }
  }
}
</script>

<style lang='less' scoped>
  @waterfall-color: #49ACF0;
  .waterfallPane {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-left: 4px solid @waterfall-color;
    margin-top: 16px;
    .waterfallHeader {
      width: 100%;
      height: 26px;
      display: flex;
      & > span:nth-of-type(1) {
        width: 38px;
        height: 26px;
        border-radius: 0px 16px 16px 0px;
        background: @waterfall-color;
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
        color: @waterfall-color;
      }
    }
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
