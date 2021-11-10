<template>
  <div class="waterfallPane" style="position:relative;">
    <div class="card_head" id="waterfall_card">
      <div class="card_head_box">
        <span class="card_head_icon wf_head_icon"><span class="iconfont">&#xe61b;</span></span>
        <span class="card_head_title wf_head_title">{{ $t('mediation.WaterfallInstance') }}</span>
      </div>
    </div>
    <GuideModel
      :visible="guideRlNum === 3"
      :totalNum="3"
      :currentNum="3"
      :type="2"
      placement="rightTop"
      top="32px"
      left="155px"
      :guideTitle="$t('mediation.guide_t11_tip')"
      :guideContent="$t('mediation.guide_c11_tip')"
      :guideImg="$i18n.locale === 'zhCN' ? '/mediation/zh/tier.webp' : '/mediation/en/tier.webp'"
      @preGuideNum="() => this.$emit('preGuideNum')"
      @nextGuideNum="() => this.$emit('nextGuideNum')"
      @closeGuide="() => this.$emit('closeGuide')"/>
    <TierTable
      :ref="`Tier${item}`"
      :columns="columns"
      :dataSources="(function (item) {
        if (item === 1) {
          return dataSources_tier_1
        } else if (item === 2) {
          return dataSources_tier_2
        } else {
          return dataSources_tier_3
        }
      })(item)"
      :hideColumns="hideColumns"
      :expandData="dataSources_tier_d"
      :itemIndex="item"
      :showSelect="true"
      :dragFalg="dragFalg"
      v-for="item in 3"
      :key="`tier_item_` + item"
      :initAuto="initAuto"
      :guideRlNum="guideRlNum"
      @changeInitAuto="changeInitAuto"
      :waterfallStatus="waterfallRefresh_inner"
      @addEndableInstance="addEndableInstance"
      @clearOtherExpand="clearOtherExpand"
      @checkTierIsAuto="checkTierIsAuto">
      <template v-slot:status="{ record }">
        <div class="tier_status">
          <a-switch :checked="record.priority > 0" @change="handelStatusUpdate(record)">
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
      <template v-slot:requests="{ record }">
        <div class="tier_requests">
          <span>{{ f(record.instanceRequestLatest) }}</span>
          <span :style="record.reqGrowth === '--' ? '' : record.instanceRequestLatest > record.instanceRequestSecondLatest ? 'color: #18921D;' : 'color: #D5432F;'">{{ record.reqGrowth }}</span>
        </div>
      </template>
      <template v-slot:fillRate="{ record }">
        <div class="tier_requests">
          <span>{{ f(record.fillRate, '0.00 %') }}</span>
          <span :style="record.fillGrowth === '--' ? '' : record.fillRate >= record.fillRate2 ? 'color: #18921D;' : 'color: #D5432F;'">{{ record.fillGrowth }}</span>
        </div>
      </template>
      <template v-slot:impressions="{ record }">
        <div class="tier_requests">
          <span>{{ f(record.mediationImprLatest) }}</span>
          <span :style="record.impressionGrowth === '--' ? '' : record.mediationImprLatest > record.mediationImprSecondLatest ? 'color: #18921D;' : 'color: #D5432F;'">{{ record.impressionGrowth }}</span>
        </div>
      </template>
      <template v-slot:ecpm="{ record }">
        <div class="tier_requests">
          <span>{{ '$ ' + f(record.ecpm,'0,0.00') }}</span>
          <span :style="record.ecpmGrowth === '--' ? '' : record.ecpm >= record.ecpm2 ? 'color: #18921D;' : 'color: #D5432F;'">{{ record.ecpmGrowth }}</span>
        </div>
      </template>
      <template v-slot:manualEcpm="{ record }">
        <div v-if="record.instanceCountries && record.instanceCountries.length === 1">
          <a-popover trigger="hover" placement="bottomRight" :arrowPointAtCenter="true">
            <template slot="content">
              <WaterfallTableInner
                :recordF="Object.assign(record, { ecpmSatus: true })"/>
            </template>
            <div class="tier_countries">
              <span>{{ '$' + record.instanceCountries[0].manualEcpm }}</span>
              <span>{{ showRegionsformatInner(record.instanceCountries[0].country) }}</span>
            </div>
          </a-popover>
        </div>
        <div class="tier_countries_multiple" v-else-if="record.instanceCountries && record.instanceCountries.length > 1">
          <a-popover trigger="hover" placement="bottomRight" :arrowPointAtCenter="true">
            <template slot="content">
              <WaterfallTableInner
                :recordF="Object.assign(record, { ecpmSatus: true })"/>
            </template>
            <span>{{ $t('mediation.Multiple') }}</span>
          </a-popover>
        </div>
        <div style="color: #ccc" v-if="!record.instanceCountries || record.instanceCountries.length === 0"> -- </div>
      </template>
      <template v-slot:priority="{ record }">
        <div class="tier_priority" v-if="record.priority">
          <span v-if="record.editPriority">
            <a-input-number
              style="width: 50px;"
              :value="inputTemp"
              :id="'editPriority_' + record.id"
              @blur="(v) => checkPriority(v, record)"
              @pressEnter="() => record.editPriority = false"
            />
          </span>
          <span v-else>{{ record.TierIndex }}</span>
          <span class="iconfont tiericon" @click="toggleEditPriority(record)">{{ record.editPriority ? '&#xe61e;' : '&#xe60c;' }}</span>
        </div>
        <div style="color: #ccc" v-else> -- </div>
      </template>
      <template v-slot:dragBtn="{ record }">
        <div v-if="record.priority" style="cursor: move;"><img src="/icon/Drag.svg"></div>
      </template>
    </TierTable>
  </div>
</template>

<script>
import TierTable from './TierTable'
import numerify from 'numerify'
import { swapArray2, zIndexTop, getAdnNameById as getAdnNameByIdUtil, showRegionsformat, getElementToPageTop } from './utils'
import WaterfallTableInner from './WaterfallTableInner'
import GuideModel from './GuideModel'

numerify('1', '0,0')
export default {
  name: 'WaterfallPane',
  components: {
    TierTable,
    WaterfallTableInner,
    GuideModel
  },
  props: {
    dataSources: {
      type: Array,
      default () {
        return []
      }
    },
    waterfallRefresh: {
      type: Number,
      default: 0
    },
    initAuto: {
      type: Boolean,
      default: false
    },
    regionsTier: {
      type: Array,
      default () {
        return []
      }
    },
    guideRlNum: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      hideColumns: [
        'manualEcpm', 'priority'
      ],
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
          id: 'requests',
          title: this.$t('tableHead.requests'),
          textAlign: 'left',
          width: this.$i18n.locale === 'zhCN' ? '10%' : '11%'
        },
        {
          id: 'fillRate',
          title: this.$t('tableHead.fillRate'),
          textAlign: 'left',
          width: this.$i18n.locale === 'zhCN' ? '9%' : '11%'
        },
        {
          id: 'impressions',
          title: this.$t('tableHead.impressions'),
          textAlign: 'left',
          width: this.$i18n.locale === 'zhCN' ? '9%' : '11%'
        },
        {
          id: 'ecpm',
          title: this.$t('tableHead.eCPM'),
          textAlign: 'left',
          width: this.$i18n.locale === 'zhCN' ? '12%' : '11%'
        },
        {
          id: 'manualEcpm',
          title: this.$t('mediation.manualECPMS'),
          textAlign: 'left',
          width: this.$i18n.locale === 'zhCN' ? '15%' : '11%'
        },
        {
          id: 'priority',
          title: this.$t('mediation.priority'),
          textAlign: 'left',
          width: '8%'
        },
        {
          id: 'dragBtn',
          textAlign: 'left',
          width: '3%'
        }
      ],
      dataSources_tier_1: [],
      dataSources_tier_2: [],
      dataSources_tier_3: [],
      dataSources_tier_d: [],
      dataSources_tier_remain_1: [],
      dataSources_tier_remain_2: [],
      dataSources_tier_remain_3: [],
      dataSources_tier_remain_d: [],
      dataSources_inner: this.dataSources,
      dragFalg: true,
      waterfallRefresh_inner: 0,
      inputTemp: '',
      initAutoWF: this.initAuto,
      regionsTierWf: this.regionsTier
    }
  },
  created () {
    this.initData(this.dataSources_inner)
  },
  watch: {
    dataSources (v) {
      if (this.waterfallRefresh_inner === 1) {
        this.filterRemainData(v)
        this.filterData(v)
      } else if (this.waterfallRefresh_inner === 0) {
        this.dataSources_inner = v
        this.initData(v)
      } else {
        this.filterData(v)
      }
    },
    waterfallRefresh (v) {
      this.waterfallRefresh_inner = v
      if (v === 2) {
        this.dragFalg = true
        this.useRemainData()
      } else if (v === 1) {
        this.dragFalg = false
        this.setRemainData()
      } else {
        this.dragFalg = true
      }
    },
    regionsTier (v) {
      this.regionsTierWf = v
    },
    guideRlNum (v) {
      if (v === 3) {
        document.documentElement.scrollTop = getElementToPageTop(document.getElementById('waterfall_card')) - 500
      }
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
    showRegionsformatInner (v) {
      return showRegionsformat(v)
    },
    getAdnNameById (v) {
      return getAdnNameByIdUtil(v)
    },
    initData (datas) {
      this.dataSources_tier_1 = datas.filter(v => {
        return v.priority && v.priority > 0 && v.groupLevel === 1 && !v.newItem
      })
      this.sortByPriority(this.dataSources_tier_1)
      this.dataSources_tier_2 = datas.filter(v => {
        return v.priority && v.priority > 0 && v.groupLevel === 2 && !v.newItem
      })
      this.sortByPriority(this.dataSources_tier_2)
      this.dataSources_tier_3 = datas.filter(v => {
        return v.priority && v.priority > 0 && v.groupLevel === 3 && !v.newItem
      })
      this.sortByPriority(this.dataSources_tier_3)
      this.dataSources_tier_d = datas.filter(v => {
        return v.priority === null || v.priority === undefined || v.priority === 0
      })
      this.notSortInitData(datas)
    },
    sortByPriority (datas) {
      datas.sort((a, b) => {
        return a.priority - b.priority
      })
    },
    notSortInitData (datas) {
      datas.forEach(v => {
        if (v.groupLevel === 1 && v.newItem) {
          this.dataSources_tier_1.push(v)
        }
      })
      datas.forEach(v => {
        if (v.groupLevel === 2 && v.newItem) {
          this.dataSources_tier_2.push(v)
        }
      })
      datas.forEach(v => {
        if (v.groupLevel === 3 && v.newItem) {
          this.dataSources_tier_3.push(v)
        }
      })
    },
    handelStatusUpdate (record) {
      try {
        record.priority = record.priority > 0 ? 0 : 1
        // setTimeout(() => {
        //   if (record.priority > 0) { // 打开状态ed
        //     this.$refs[`Tier${record.itemIndex}`][0].setInnerShowData(record)
        //     this.dataSources_tier_d = this.dataSources_tier_d.filter(v => {
        //       return v.id !== record.id
        //     })
        //     if (this.waterfallRefresh_inner === 1) {
        //       Object.assign(record, { TierIndex: this['dataSources_tier_remain_' + record.itemIndex].length + 1 })
        //       this['dataSources_tier_remain_' + record.itemIndex].push(record)
        //       this.dataSources_tier_remain_d = this.dataSources_tier_remain_d.filter(v => {
        //         return v.id !== record.id
        //       })
        //     }
        //   } else { // 关闭状态ed
        //     this.dataSources_tier_d.unshift(record)
        //     this.$refs[`Tier${record.itemIndex}`][0].removeInnerShowData(record)
        //     if (this.waterfallRefresh_inner === 1) {
        //       this.dataSources_tier_remain_d.unshift(record)
        //       this['dataSources_tier_remain_' + record.itemIndex] = this['dataSources_tier_remain_' + record.itemIndex].filter(v => {
        //         return v.id !== record.id
        //       })
        //       this['dataSources_tier_remain_' + record.itemIndex].map((v, i) => {
        //         v.TierIndex = i + 1
        //       })
        //       this.reFilterRemainData(this.getTierDataPure(record.itemIndex), record.itemIndex)
        //     }
        //   }
        // }, 500)
        if (record.priority > 0) { // 打开状态ed
          this.$refs[`Tier${record.itemIndex}`][0].setInnerShowData(record)
          this.dataSources_tier_d = this.dataSources_tier_d.filter(v => {
            return v.id !== record.id
          })
          if (this.waterfallRefresh_inner === 1) {
            Object.assign(record, { TierIndex: this['dataSources_tier_remain_' + record.itemIndex].length + 1 })
            this['dataSources_tier_remain_' + record.itemIndex].push(record)
            this.dataSources_tier_remain_d = this.dataSources_tier_remain_d.filter(v => {
              return v.id !== record.id
            })
          }
        } else { // 关闭状态ed
          this.dataSources_tier_d.unshift(record)
          this.$refs[`Tier${record.itemIndex}`][0].removeInnerShowData(record)
          if (this.waterfallRefresh_inner === 1) {
            this.dataSources_tier_remain_d.unshift(record)
            this['dataSources_tier_remain_' + record.itemIndex] = this['dataSources_tier_remain_' + record.itemIndex].filter(v => {
              return v.id !== record.id
            })
            this['dataSources_tier_remain_' + record.itemIndex].map((v, i) => {
              v.TierIndex = i + 1
            })
            this.reFilterRemainData(this.getTierDataPure(record.itemIndex), record.itemIndex)
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    filterData (datas) {
      if (this.regionsTier && this.regionsTier.length) {
        this.filterRegion(datas, this.regionsTier)
      }
      this.clearProperty(datas)
      this.filterTierData(datas, 1)
      this.filterTierData(datas, 2)
      this.filterTierData(datas, 3)
      this.dataSources_tier_d.forEach(d => {
        Object.assign(d, datas.find(item => item.id === d.id))
      })
    },
    clearProperty (datas) {
      datas.map(v => {
        delete v.priority
        delete v.groupLevel
      })
    },
    filterRegion (datas, regions) {
      if (regions.includes('ALL')) return
      datas.map(v => {
        if (v.instanceCountries && v.instanceCountries.length) {
          v.instanceCountries.map(c => {
            c.country = c.country.split(',').filter(j => {
              return regions.includes(j)
            }).join(',')
          })
          v.instanceCountries = v.instanceCountries.filter(c => {
            return !!c.country
          })
        }
      })
    },
    reFilterRemainData (datas, item) {
      let dataSourcesTierTemp = this.getNoCacheObj(this['dataSources_tier_remain_' + item])
      dataSourcesTierTemp = this.filterInnerData(dataSourcesTierTemp, datas)
      this.setTierData(dataSourcesTierTemp, item)
    },
    filterRemainData (datas) {
      // 仅对遗留数据进行过滤，不进行修改操作
      let dataSourcesTierTemp1 = this.getNoCacheObj(this.dataSources_tier_remain_1)
      let dataSourcesTierTemp2 = this.getNoCacheObj(this.dataSources_tier_remain_2)
      let dataSourcesTierTemp3 = this.getNoCacheObj(this.dataSources_tier_remain_3)
      let dataSourcesTierTempd = this.getNoCacheObj(this.dataSources_tier_remain_d)
      dataSourcesTierTemp1 = this.filterInnerData(dataSourcesTierTemp1, datas)
      dataSourcesTierTemp2 = this.filterInnerData(dataSourcesTierTemp2, datas)
      dataSourcesTierTemp3 = this.filterInnerData(dataSourcesTierTemp3, datas)
      dataSourcesTierTempd = this.filterInnerData(dataSourcesTierTempd, datas)
      this.setTierData(dataSourcesTierTemp1, 1)
      this.setTierData(dataSourcesTierTemp2, 2)
      this.setTierData(dataSourcesTierTemp3, 3)
      this.dataSources_tier_d = dataSourcesTierTempd
    },
    setRemainData () {
      this.dataSources_tier_remain_1 = this.getNoCacheObj(this.getTierData(1))
      this.dataSources_tier_remain_2 = this.getNoCacheObj(this.getTierData(2))
      this.dataSources_tier_remain_3 = this.getNoCacheObj(this.getTierData(3))
      this.dataSources_tier_remain_d = this.getNoCacheObj(this.dataSources_tier_d)
    },
    useRemainData () {
      this.setTierData(this.getNoCacheObj(this.dataSources_tier_remain_1), 1)
      this.setTierData(this.getNoCacheObj(this.dataSources_tier_remain_2), 2)
      this.setTierData(this.getNoCacheObj(this.dataSources_tier_remain_3), 3)
      this.dataSources_tier_d = this.getNoCacheObj(this.dataSources_tier_remain_d)
    },
    getTierRemainData (item) {
      const result = this['dataSources_tier_remain_' + item]
      result.map(v => {
        v.priority = v.TierIndex
      })
      return result
    },
    getTierData (item) {
      const result = this.$refs[`Tier${item}`][0].dataSources_inner
      const selectVal = this.$refs[`Tier${item}`][0].selectVal
      result.map(v => {
        v.groupLevel = v.itemIndex
        v.priority = v.TierIndex
        // auto: 1 ; manual: 0
        v.autoSwitch = selectVal === 'auto' ? 1 : 0
      })
      return result
    },
    getTierDataPure (item) {
      return this.$refs[`Tier${item}`][0].dataSources_inner
    },
    setTierData (datas, item) {
      this.$refs[`Tier${item}`][0].initShowData(datas)
    },
    filterTierData (datas, item) {
      this.$refs[`Tier${item}`][0].filterTierData(datas)
    },
    getNoCacheObj (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    filterInnerData (tempArrs, datas) {
      return tempArrs.filter(d => datas.some(item => item.id === d.id))
    },
    toggleEditPriority (record) {
      if (!record.editPriority) {
        // this.$set(record, 'editPriority', true) // 这种方式不合理 会导致watch出现
        record.editPriority = true
        this.inputTemp = record.TierIndex
        this.$nextTick(() => {
          document.getElementById('editPriority_' + record.id).focus()
        })
      }
    },
    checkPriority (v, record) {
      record.editPriority = false
      this.inputTemp = ''
      const val = document.getElementById('editPriority_' + record.id).value
      if (!val || val === '0') {
        return
      }
      if (this.waterfallRefresh_inner === 1) {
        this.exchangeRemainVal(val - 1, record.TierIndex - 1, this['dataSources_tier_remain_' + record.itemIndex], record)
        this.reFilterRemainData(this.getTierDataPure(record.itemIndex), record.itemIndex)
      } else {
        this.exchangeTierVal(val - 1, record.TierIndex - 1, record.itemIndex)
      }
      this.$message.success(this.$t('mediation.md_18_tip'))
    },
    exchangeRemainVal (index1, index2, datas, record) {
      if (index1 >= datas.length) {
        // record.TierIndex = datas.length
        zIndexTop(datas, index2, datas.length)
      } else if (index1 !== index2) {
        // record.TierIndex = index1 + 1
        swapArray2(datas, index2, index1, this.$set)
      }
    },
    exchangeTierVal (index1, index2, item) {
      this.$refs[`Tier${item}`][0].exchangeOrder(index1, index2)
    },
    changeInitAuto (v) {
      this.initAutoWF = v
    },
    addEndableInstance () {
      this.$emit('addEndableInstance')
    },
    clearOtherExpand (itemIndex) {
      let arrTemp = [1, 2, 3]
      arrTemp = arrTemp.filter(v => v !== itemIndex)
      arrTemp.forEach(v => {
        this.$refs[`Tier${v}`][0].changeExpand(false)
      })
    },
    checkTierIsAuto () {
      [1, 2, 3].forEach(v => {
        this.$refs[`Tier${v}`][0].isAuto()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/dist/antd.less';
@waterfall-color: #49ACF0;
.waterfallPane{
  width: calc(~'100% - 48px');
  margin: 0 24px;
  border-left: 4px solid @waterfall-color;
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
      background: @waterfall-color;
      .iconfont{
        color: #ffffff!important;
        font-size: 14px!important;
        margin-left: 16px;
      }
    }
    .card_head_title {
      font-size: 14px;
      margin-left: 4px;
      color: @waterfall-color;
    }
  }
  .card_head_select {
   margin-right: 16px;
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
.tier_countries {
  width: 100%;
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
.tier_countries_multiple {
  color: #1A7DF1;
}
.tiericon {
  cursor: pointer;
  color: #CCCCCC!important;
  margin-left: 10px;
  &:hover {
    color: #333333!important;
  }
}
</style>
