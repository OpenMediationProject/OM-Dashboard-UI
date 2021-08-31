<template>
  <div class="biddingPane">
    <div class="card_head">
      <div class="card_head_box">
        <span class="card_head_icon"><span class="iconfont">&#xe61a;</span></span>
        <span class="card_head_title">{{ $t('mediation.InAppBiddingInstance') }}</span>
      </div>
      <span class="card_head_select">{{ dataSources_inner.filter(v => v.priority === 1).length }} {{ $t('mediation.enabledInstances') }}<span v-if="dataSources_inner.filter(v => v.priority === 1).length > 1">{{ $t('mediation.s') }}</span></span>
    </div>
    <TierTable
      ref="tierTable"
      :columns="columns"
      :dataSources="dataSources_inner"
      :showSelect="false"
      :dragFalg="false">
      <template v-slot:status="{ record }">
        <div class="tier_status">
          <a-switch :checked="record.priority === 1" @click="handelStatusUpdate(record)">
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
          <span :style="record.bidRequestGrowth === '--' ? '' : record.bidRequestLatest > record.bidRequestSecondLatest ? 'color: #18921D;' : 'color: #D5432F;'">{{ record.bidRequestGrowth }}</span>
        </div>
      </template>
      <template v-slot:bidRate="{ record }">
        <div class="tier_requests">
          <span>{{ f(record.bidRate, '0.00 %') }}</span>
          <span :style="record.bidRateGrowth === '--' ? '' : record.bidRate > record.bidRate2 ? 'color: #18921D;' : 'color: #D5432F;'">{{ record.bidRateGrowth }}</span>
        </div>
      </template>
      <template v-slot:win="{ record }">
        <div class="tier_requests">
          <span>{{ f(record.bidWinLatest) }}</span>
          <span :style="record.bidWinGrowth === '--' ? '' : record.bidWinLatest > record.bidWinSecondLatest ? 'color: #18921D;' : 'color: #D5432F;'">{{ record.bidWinGrowth }}</span>
        </div>
      </template>
      <template v-slot:winRate="{ record }">
        <div class="tier_requests">
          <span>{{ f(record.winRate, '0.00 %') }}</span>
          <span :style="record.winRateGrowth === '--' ? '' : record.winRate > record.winRate2 ? 'color: #18921D;' : 'color: #D5432F;'">{{ record.winRateGrowth }}</span>
        </div>
      </template>
      <template v-slot:impressions="{ record }">
        <div class="tier_requests">
          <span>{{ f(record.bidImpressionLatest) }}</span>
          <span :style="record.bidImpressionGrowth === '--' ? '' : record.bidImpressionLatest > record.bidImpressionSecondLatest ? 'color: #18921D;' : 'color: #D5432F;'">{{ record.bidImpressionGrowth }}</span>
        </div>
      </template>
      <template v-slot:eCPM="{ record }">
        <div class="tier_requests">
          <span>{{ '$ ' + f(record.bidEcpm,'0,0.00') }}</span>
          <span :style="record.bidEcpmGrowth === '--' ? '' : record.bidEcpm > record.bidEcpm2 ? 'color: #18921D;' : 'color: #D5432F;'">{{ record.bidEcpmGrowth }}</span>
        </div>
      </template>
    </TierTable>
  </div>
</template>

<script>
import TierTable from './TierTable'
import numerify from 'numerify'
import { getAdnNameById as getAdnNameByIdUtil } from './utils'

numerify('1', '0,0')
export default {
  name: 'BiddingPane',
  components: {
    TierTable
  },
  props: {
    dataSources: {
      type: Array,
      default () {
        return []
      }
    },
    dataPrepared: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dataSources (v) {
      if (this.$refs.tierTable.dataSources_inner && this.$refs.tierTable.dataSources_inner.length) {
        v.forEach(a => {
          this.$refs.tierTable.dataSources_inner.forEach(b => {
            if (a.id === b.id) {
              a.priority = b.priority
            }
          })
        })
      }
      this.dataSources_inner = JSON.parse(JSON.stringify(v))
      this.$nextTick(() => {
        this.filterData()
        this.sortDatas()
      })
    }
  },
  data () {
    return {
      columns: [
        {
          id: 'status',
          title: this.$t('comm.status'),
          textAlign: 'left',
          marginLeft: '16px',
          width: '10%'
        },
        {
          id: 'instance',
          title: this.$t('mediation.instance'),
          textAlign: 'left',
          width: '24%'
        },
        {
          id: 'bidRequests',
          title: this.$t('mediation.bidRequests'),
          textAlign: 'left',
          width: this.$i18n.locale === 'zhCN' ? '10%' : '11%'
        },
        {
          id: 'bidRate',
          title: this.$t('mediation.bidRate'),
          textAlign: 'left',
         width: this.$i18n.locale === 'zhCN' ? '9%' : '11%'
        },
        {
          id: 'win',
          title: this.$t('mediation.win'),
          textAlign: 'left',
          width: this.$i18n.locale === 'zhCN' ? '9%' : '11%'
        },
        {
          id: 'winRate',
          title: this.$t('mediation.winRate'),
          textAlign: 'left',
          width: this.$i18n.locale === 'zhCN' ? '12%' : '11%'
        },
        {
          id: 'impressions',
          title: this.$t('tableHead.impressions'),
          textAlign: 'left',
          width: this.$i18n.locale === 'zhCN' ? '12%' : '10%'
        },
        {
          id: 'eCPM',
          title: this.$t('tableHead.eCPM2'),
          textAlign: 'left',
          width: '13%'
        }
      ],
      dataSources_inner: JSON.parse(JSON.stringify(this.dataSources)),
      dataSources_remain: JSON.parse(JSON.stringify(this.dataSources))
    }
  },
  methods: {
    f (v, f) {
      if (!v) {
        v = 0
      }
      if (!f) {
        f = '0,0'
      }
      return numerify(v, f)
    },
    getAdnNameById (v) {
      return getAdnNameByIdUtil(v)
    },
    handelStatusUpdate (record) {
      if (!record.priority) {
        if (this.getTierData().find(row => { return row.adnId === record.adnId && row.priority > 0 })) {
          this.$message.error(this.$t('mediation.already_existed_hb'))
          return false
        }
      }
      record.priority = record.priority === 0 ? 1 : 0
      // setTimeout(() => {
      //   this.sortDatas()
      //   this.updateRemainData(record)
      // }, 500)
      this.sortDatas()
      this.updateRemainData(record)
    },
    sortDatas () {
      this.$refs.tierTable.sortByPriority()
    },
    updateRemainData (record) {
      this.dataSources_remain.map(v => {
        if (v.id === record.id) {
          v.priority = record.priority
        }
      })
      this.dataSources_remain.sort((a, b) => {
        return b.priority - a.priority
      })
    },
    filterData (flag, arr) {
      if (flag) {
        this.$refs.tierTable.filterInnerData(arr)
      } else {
        this.$refs.tierTable.filterInnerData(this.dataSources_remain)
      }
    },
    getTierData () {
      return this.$refs.tierTable.dataSources_inner
    }
  }
}
</script>

<style lang="less" scoped>
@bidding-color: #B28BD9;
.biddingPane{
  width: calc(~'100% - 48px');
  margin: 0 24px;
  border-left: 4px solid @bidding-color;
}
.card_head {
  width: 100%;
  height: 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .card_head_box {
    display: flex;
    align-items: center;
    .card_head_icon {
      width: 38px;
      height: 26px;
      border-radius: 0px 16px 16px 0px;
      display: flex;
      align-items: center;
      background: @bidding-color;
      .iconfont{
        color: #ffffff!important;
        font-size: 14px!important;
        margin-left: 16px;
      }
    }
    .card_head_title {
      font-size: 14px;
      margin-left: 4px;
      color: @bidding-color;
    }
  }
  .card_head_select {
    margin-right: 8px;
    font-size: 12px;
    color: #BDBDBD;
  }
}
.tier_status {
  width: 100%;
  height: 100%;
  display: flex;
  margin-left: 16px;
  align-items: center;
}
.tier_instance {
  display:flex;
  flex-direction: column;
  justify-content: center;
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
    color: #ccc;
  }
}
</style>
