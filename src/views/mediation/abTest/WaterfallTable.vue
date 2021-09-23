<template>
  <div class="waterfallTable">
    <div class="waterfallBox" v-for="(item, index) in 3" :key="`wfBox_${type}_${index}`">
      <ManualSelect
        :tierIndex="item"
        :autoManual="(function (item) {
          if (item === 1) {
            return autoManual_1
          } else if (item === 2) {
            return autoManual_2
          } else {
            return autoManual_3
          }
        })(item)"
        :disabled="type.indexOf('A') > -1 || abTestStatus === 1"
        @changeManualToAuto="changeManualToAuto"
        @changeAutoToManual="changeAutoToManual"
      />
      <TierTable
        :ref="`Tier_${type}_${item}`"
        :type="type"
        :columns="abTestStatus === 0 ? columns1 : columns2"
        :dataSources="(function (item) {
          if (item === 1) {
            return dataSources_tier_1
          } else if (item === 2) {
            return dataSources_tier_2
          } else {
            return dataSources_tier_3
          }
        })(item)"
        :disabledSources="dataSources_tier_d"
        :filterSources="dataSources_filter"
        :dataSourcesType="dataSourcesType"
        :itemIndex="item"
        :autoManual="(function (item) {
          if (item === 1) {
            return autoManual_1
          } else if (item === 2) {
            return autoManual_2
          } else {
            return autoManual_3
          }
        })(item)"
        :abTestStatus="abTestStatus"
        @setScroll="() => $emit('setScroll')"
        @calculateTotal="() => $emit('calculateTotal')"
        @changeDataSources="changeDataSources"
      >
        <template v-slot:status="{ record, itemIndex }">
          <div class="tier_status">
            <a-switch :checked="record.priority > 0" :disabled="type.indexOf('A') > -1" @click="handelStatusUpdate(record, itemIndex)">
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
          </div>
        </template>
        <template v-slot:fillRate="{ record }">
          <div class="tier_requests">
            <span>{{ f(record.fillRate, '0.00 %') }}</span>
          </div>
        </template>
        <template v-slot:impressions="{ record }">
          <div class="tier_requests">
            <span>{{ f(record.mediationImprLatest) }}</span>
          </div>
        </template>
        <template v-slot:eCPM="{ record }">
          <div class="tier_requests">
            <span>{{ '$ ' + f(record.ecpm,'0,0.00') }}</span>
          </div>
        </template>
        <template v-slot:manualECPM="{ record }">
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
        <template v-slot:priority="{ record, itemIndex, autoManual }">
          <div class="tier_priority" v-if="record.priority && autoManual === 'manual'">
            <span v-if="record.editPriority">
              <a-input-number
                style="width: 50px;"
                :value="inputTemp"
                :id="`editPriority_${type}_${record.id}`"
                @blur="(v) => checkPriority(v, record, itemIndex)"
                @pressEnter="() => record.editPriority = false"
              />
            </span>
            <span v-else>{{ record.TierIndex }}</span>
            <span class="iconfont tiericon" @click="toggleEditPriority(record)">{{ record.editPriority ? '&#xe61e;' : '&#xe60c;' }}</span>
          </div>
          <div style="color: #ccc" v-else> -- </div>
        </template>
      </TierTable>
    </div>
  </div>
</template>

<script>
import ManualSelect from './ManualSelect'
import TierTable from './TierTable'
import { getAdnNameById as getAdnNameByIdUtil, showRegionsformat, swapArray2, zIndexTop, formatData } from '../modules/utils'
import WaterfallTableInner from '../modules/WaterfallTableInner'

export default {
  components: {
    ManualSelect,
    TierTable,
    WaterfallTableInner
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
  watch: {
    dataSources: {
      handler (datas) {
        if (this.dataSourcesType === 0) {
          this.initData(datas)
        } else if (this.dataSourcesType === 1) {
          this.dataSources_filter = JSON.parse(JSON.stringify(datas))
          this.clearProperty(this.dataSources_filter)
          this.filterDisabled()
        } else if (this.dataSourcesType === 2) {
          this.dataSources_filter = JSON.parse(JSON.stringify(datas))
          this.clearProperty(this.dataSources_filter)
          this.filterDisabled()
          this.filterAbled()
        } else {}
      }
    },
    newSources: {
      handler (datas) {
        datas.forEach(v => {
          this[`dataSources_tier_${v.groupLevel}`].push(v)
        })
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
        },
        {
          id: 'manualECPM',
          title: 'Manual eCPM',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'priority',
          title: '	Priority',
          textAlign: 'center',
          width: '16%',
          location: 'm'
        },
        {
          id: 'dragBtn',
          textAlign: 'left',
          width: '3%',
          location: 'r',
          show: true
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
        },
        {
          id: 'manualECPM',
          title: 'Manual eCPM',
          textAlign: 'center',
          width: '19%',
          location: 'm'
        }
      ],
      dataSources_tier_1: [],
      dataSources_tier_2: [],
      dataSources_tier_3: [],
      dataSources_tier_d: [],
      dataSources_tier_d_copy: [],
      inputTemp: '',
      autoManual_1: 'manual',
      autoManual_2: 'manual',
      autoManual_3: 'manual',
      dataSources_filter: []
    }
  },
  methods: {
    f (v, f) {
      return formatData(v, f)
    },
    initData (datas) {
      for (let i = 1; i <= 3; i++) {
        this[`dataSources_tier_${i}`] = datas.filter(v => {
          return v.priority && v.priority > 0 && v.groupLevel === i
        })
        this.sortByPriority(this[`dataSources_tier_${i}`])
        this[`autoManual_${i}`] = this.getAutoOrManual(i)
      }
      this.dataSources_tier_d = datas.filter(v => {
        return v.priority === null || v.priority === undefined || v.priority === 0
      })
    },
    sortByPriority (datas) {
      datas.sort((a, b) => {
        return a.priority - b.priority
      })
    },
    filterDisabled () {
      if (this.dataSourcesType === 1) {
        // 总结，如果数据进行共享，那么一旦进行数据数目变动，就得进行备份处理；如果子组件进行了数据过滤，但是父组件数据没有发生变动，则可以通过父组件向子组件进行数据注入。
        this.dataSources_tier_d_copy = JSON.parse(JSON.stringify(this.dataSources_tier_d))
        this.dataSources_tier_d = this.dataSources_tier_d.filter(v => this.dataSources_filter.find(t => v.id === t.id))
        this.setTierData(this.dataSources_filter, 'd', 'filterData')
      } else if (this.dataSourcesType === 2) {
        if (this.dataSources_tier_d_copy.length) {
          this.setTierData(JSON.parse(JSON.stringify(this.dataSources_tier_d_copy)), 'd', 'replace')
          this.dataSources_tier_d_copy = []
        }
        this.setTierData(this.dataSources_filter, 'd', 'filterData')
      } else {}
    },
    filterAbled () {
      for (let i = 1; i <= 3; i++) {
        this.setTierData(this.dataSources_filter, i, 'filterData')
      }
    },
    clearProperty (datas) {
      datas.map(v => {
        delete v.priority
        delete v.groupLevel
      })
    },
    handelStatusUpdate (record, itemIndex) {
      try {
        record.priority = record.priority > 0 ? 0 : 1
        if (record.priority) {
          this.setTierData(record, 'd', 'remove')
          this.setTierData(record, itemIndex, 'push')
          this.setTierData([], itemIndex, 'editAutoSwitch')
        } else {
          this.setTierData(record, 'd', 'push')
          this.setTierData(record, itemIndex, 'remove')
        }
      } catch (e) {
        console.log(e)
      }
    },
    setTierData (data, index, type) {
      // 数据变动后，Table里面的数据将会进行监听，Table中的inner datas将会重新赋值
      switch (type) {
        case 'push':
          this[`dataSources_tier_${index}`].push(data)
          if (index === 'd' && this.dataSourcesType === 1) {
            this.dataSources_tier_d_copy.push(data)
          }
          break
        case 'replace':
          this[`dataSources_tier_${index}`] = data
          break
        case 'remove':
          this[`dataSources_tier_${index}`] = this[`dataSources_tier_${index}`].filter(v => v.id !== data.id)
          if (index === 'd' && this.dataSourcesType === 1) {
            this.dataSources_tier_d_copy = this.dataSources_tier_d_copy.filter(v => v.id !== data.id)
          }
          break
        case 'sortByRequest':
          this[`dataSources_tier_${index}`].sort((a, b) => {
            return b.instanceRequestLatest - a.instanceRequestLatest
          })
          break
        case 'exchangeOrder':
          this.exchangeOrder(this[`dataSources_tier_${index}`], data[0], data[1])
          break
        case 'filterData':
          this[`dataSources_tier_${index}`].map(v => {
            data.forEach(e => {
              if (e.id === v.id) {
                Object.assign(v, e)
              }
            })
          })
          break
        case 'editAutoSwitch':
          console.log(this[`autoManual_${index}`])
          if (this[`autoManual_${index}`] === 'auto') {
            this[`dataSources_tier_${index}`].map(v => {
              v.autoSwitch = 1
            })
            this.autoOrder(index)
          } else {
            this[`dataSources_tier_${index}`].map(v => {
              v.autoSwitch = 0
            })
          }
          break
        default:
          break
      }
    },
    getTierData (index) {
      return this.$refs[`Tier_${this.type}_${index}`][0].dataSources_inner
    },
    getShowTierData () {
      let arr = []
      for (let i = 1; i <= 3; i++) {
        arr = arr.concat(this.getTierData(i))
      }
      // console.log(arr, this.type)
      return arr
    },
    autoOrder (i) {
      if (this[`autoManual_${i}`] === 'auto') {
        this.setTierData([], i, 'sortByRequest')
      }
    },
    changeDataSources () {
      for (let i = 1; i <= 3; i++) {
        this.setTierData(this.getTierData(i), i, 'replace')
        this.setTierData([], i, 'editAutoSwitch')
      }
      this.$nextTick(function () {
        this.$emit('setScroll')
      })
    },
    getAdnNameById (v) {
      return getAdnNameByIdUtil(v)
    },
    showRegionsformatInner (v) {
      return showRegionsformat(v)
    },
    checkPriority (v, record, itemIndex) {
      record.editPriority = false
      this.inputTemp = ''
      const val = document.getElementById(`editPriority_${this.type}_${record.id}`).value
      if (!val || val === '0') {
        return
      }
      this.exchangeTierVal(val - 1, record.TierIndex - 1, itemIndex)
      this.$message.success(this.$t('mediation.md_18_tip'))
    },
    exchangeTierVal (index1, index2, item) {
      this.setTierData([index1, index2], item, 'exchangeOrder')
    },
    exchangeOrder (datas, index1, index2) {
      if (index1 >= datas.length) {
        zIndexTop(datas, index2, datas.length)
      } else if (index1 !== index2) {
        swapArray2(datas, index2, index1, this.$set)
      }
    },
    toggleEditPriority (record) {
      if (!record.editPriority) {
        record.editPriority = true
        this.inputTemp = record.TierIndex
        this.$nextTick(() => {
          document.getElementById(`editPriority_${this.type}_${record.id}`).focus()
        })
      }
    },
    changeManualToAuto (index) {
      this[`autoManual_${index}`] = 'auto'
      this.setTierData([], index, 'editAutoSwitch')
      this.setTierData([], index, 'sortByRequest')
    },
    changeAutoToManual (index) {
      this[`autoManual_${index}`] = 'manual'
      this.setTierData([], index, 'editAutoSwitch')
    },
    getAutoOrManual (index) {
      return this[`dataSources_tier_${index}`][0] ? (this[`dataSources_tier_${index}`][0].autoSwitch === 1 ? 'auto' : 'manual') : 'manual'
    },
    getSubData () {
      let subData = []
      for (let i = 1; i <= 3; i++) {
        this[`dataSources_tier_${i}`].forEach(v => {
          v.groupLevel = i
        })
        subData = subData.concat(this[`dataSources_tier_${i}`])
      }
      if (this.dataSourcesType === 1) {
        subData = subData.concat(this.dataSources_tier_d_copy)
      } else {
        subData = subData.concat(this.dataSources_tier_d)
      }
      this.setSubAbtest(subData, 2)
      return subData
    },
    setSubAbtest (data, num) {
      data.map(v => {
        v.abTest = num
      })
    }
  }
}
</script>
<style lang='less' scoped>
  .waterfallTable {}
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
