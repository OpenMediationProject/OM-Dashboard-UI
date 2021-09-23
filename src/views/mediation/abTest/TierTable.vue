<template>
  <div class="tierTable">
    <div class="table_v">
      <div class="tr_tv">
        <div class="th_bl" style="width: 35%">
          <div
            v-for="(item, index) in columns.filter(v => v.location === 'l')"
            :key="`thl_${type}_${index}`"
            :style="`text-align:${ item.textAlign }; width:${ item.width };`"
          >{{ item.title }}</div>
        </div>
        <div class="th_bm sc_bm" :style="`width: ${ showDragIcon ? '56%' : '65%' }; margin-left: 35%; margin-right: 11%`">
          <div class="th_bm_box">
            <div
              v-for="(item, index) in columns.filter(v => v.location === 'm')"
              :key="`thr_${type}_${index}`"
              :style="`text-align:${ item.textAlign }; width:${ item.width };`
              ">{{ item.title }}</div>
          </div>
        </div>
        <div class="th_br" style="width: 9%" v-if="showDragIcon">
          <div></div>
        </div>
      </div>
      <draggable
        v-model="dataSources_inner"
        animation="300"
        group="site"
        @end="endDrag"
        :disabled="dragAble"
      >
        <div class="tr_cv" v-for="(item, trdex) in dataSources_inner" :key="`tr_${type}_${trdex}`">
          <div class="td_bl" style="width: 35%">
            <div
              v-for="(v, i) in columns.filter(v => v.location === 'l')"
              :key="`tdl_${type}_${i}`"
              :style="`text-align:${ v.textAlign }; width:${ v.width }; ${ type.indexOf('B') > -1 || !type || abTestStatus === 1 ? '' : 'opacity: 0.4;'}`"
            >
              <slot :name="v.id" :record="Object.assign(item, dataSourcesType === 1 ? {} : { TierIndex: (trdex + 1) })" :itemIndex="itemIndex" v-if="v.show"></slot>
            </div>
          </div>
          <div class="td_bm sc_bm" :style="`width: ${ showDragIcon ? '56%' : '65%' }; margin-left: 35%; margin-right: 11%`">
            <div class="td_bm_box">
              <div
                v-for="(v, i) in columns.filter(v => v.location === 'm')"
                :key="`tdr_${type}_${i}`"
                :style="`text-align:${ v.textAlign }; width:${ v.width };`"
              >
                <slot :name="v.id" :record="Object.assign(item, dataSourcesType === 1 ? {} : { TierIndex: (trdex + 1) })" :itemIndex="itemIndex" :autoManual="autoManual"></slot>
              </div>
            </div>
          </div>
          <div class="td_br" style="width: 9%" v-if="showDragIcon">
            <div>
              <img style="width: 16px; height: 16px;" src="/icon/Drag.svg" alt="">
            </div>
          </div>
        </div>
      </draggable>
      <div class="expandBox" @click="toggleExpand" v-if="type === 'waterfall_B' && abTestStatus === 0">{{ disabledSources.length }} {{ $t('mediation.disabledInstance') }}<span class="iconfont">{{ expandFlag ? '&#xe61c;' : '&#xe620;' }}</span></div>
      <div class="tr_cv" v-for="(item, index) in disabledSources" :key="`tr_${type}_${index}`" v-if="expandFlag && type === 'waterfall_B'" style="opacity: 0.3;">
        <div class="td_bl" style="width: 35%">
          <div
            v-for="(v, i) in columns.filter(v => v.location === 'l')"
            :key="`tdl_${type}_${i}`"
            :style="`text-align:${ v.textAlign }; width:${ v.width }; ${ type.indexOf('B') > -1 ? '' : 'opacity: 0.4;'}`"
          >
            <slot :name="v.id" :record="item" :itemIndex="itemIndex" v-if="v.show"></slot>
          </div>
        </div>
        <div class="td_bm sc_bm" :style="`width: '65%'; margin-left: 35%;`">
          <div class="td_bm_box">
            <div
              v-for="(v, i) in columns.filter(v => v.location === 'm')"
              :key="`tdr_${type}_${i}`"
              :style="`text-align:${ v.textAlign }; width:${ v.width };`"
            >
              <slot :name="v.id" :record="item" :itemIndex="itemIndex"></slot>
            </div>
          </div>
        </div>
        <!-- <div class="td_br" style="width: 9%" v-if="type === 'waterfall_B'">
          <div>
            <img style="width: 16px; height: 16px;" src="/icon/Drag.svg" alt="">
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'TierTable',
  components: {
    draggable
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    dataSources: {
      type: Array,
      default () {
        return []
      }
    },
    itemIndex: {
      type: Number,
      default: 1
    },
    disabledSources: {
      type: Array,
      default () {
        return []
      }
    },
    autoManual: {
      type: String,
      default: 'manual'
    },
    dataSourcesType: {
      type: Number,
      default: 0
    },
    filterSources: {
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
  computed: {
    showDragIcon: function () {
      return this.type === 'waterfall_B' && this.autoManual === 'manual' && this.abTestStatus === 0
    },
    dragAble: function () {
      return this.type !== 'waterfall_B' || this.dataSourcesType === 1 || this.abTestStatus === 1
    }
  },
  watch: {
    dataSources: {
      handler (datas) {
        this.initShowData(datas)
      },
      deep: true
    },
    filterSources: {
       handler () {
         this.filterDatas(true)
       }
    },
    dataSources_inner: {
      handler () {
        this.$emit('calculateTotal')
      }
    }
  },
  data () {
    return {
      dataSources_inner: [],
      expandFlag: false
    }
  },
  mounted () {
    this.initShowData(this.dataSources)
  },
  methods: {
    initShowData (datas) {
      if (this.type.indexOf('bidding') === -1 && this.dataSourcesType === 1) {
        this.dataSources_inner = this.resetAndRemainOrder()
      } else {
        this.dataSources_inner = JSON.parse(JSON.stringify(datas))
      }
      if (this.type.indexOf('bidding') === -1) {
        this.filterDatas(false)
      }
      this.setScroll()
    },
    filterDatas (flag) {
      if (flag) {
        // 内部数据重置，但是要保留排序
        // this.dataSources_inner = JSON.parse(JSON.stringify(this.dataSources))
        this.dataSources_inner = this.resetAndRemainOrder()
      }
      if (this.dataSourcesType === 1) {
        // 过滤数据
        this.dataSources_inner = this.dataSources_inner.filter(v => this.filterSources.find(t => v.id === t.id))
        // 合并统计数据
        this.dataSources_inner.map(v => {
          this.filterSources.forEach(e => {
            if (e.id === v.id) {
              Object.assign(v, e)
            }
          })
        })
        if (flag) this.setScroll()
      }
    },
    resetAndRemainOrder () {
      const originData = JSON.parse(JSON.stringify(this.dataSources))
      // this.dataSources_inner.forEach(v => {
      //   originData.map(e => {
      //     if (e.id === v.id && v.TierIndex) {
      //       e.TierIndex = v.TierIndex
      //     }
      //   })
      // })
      let num = 1
      originData.forEach(v => {
        if (v.priority) {
          v.TierIndex = num
          num++
        }
      })
      return originData
    },
    endDrag () {
      this.$emit('changeDataSources')
    },
    setScroll () {
      this.$nextTick(function () {
        this.$emit('setScroll')
      })
    },
    toggleExpand () {
      this.expandFlag = !this.expandFlag
      this.setScroll()
    }
  }
}
</script>

<style lang="less" scoped>
  .tierTable{
    width: 100%;
  }
  .table_v{
    position: relative;
    width: 100%;
    // margin-top: 20px;
    // background: chartreuse;
    border: 1px solid #EEEEEE;
    .tr_tv {
      position: relative;
      width: 100%;
      height: 60px;
      .th_bl {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: #FFFFFF;
        box-shadow: 4px 0 8px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        & > div {
          font-family: Arial;
          font-style: normal;
          font-weight: bold;
          font-size: 14px;
          line-height: 18px;
          color: #333333;
        }
      }
      .th_bm {
        height: 100%;
        height: 60px;
        overflow-x: auto;
        background: #FFFFFF;
        &::-webkit-scrollbar {display:none}
        .th_bm_box {
          width: 800px;
          height: 100%;
          display: flex;
          align-items: center;
          & > div {
            font-family: Arial;
            font-style: normal;
            font-weight: bold;
            font-size: 14px;
            line-height: 18px;
            color: #333333;
          }
        }
      }
      .th_br {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        background: #FFFFFF;
        box-shadow: -4px 0 8px -3px rgba(0, 0, 0, 0.1);
      }
    }
    .tr_cv {
      position: relative;
      width: 100%;
      height: 60px;
      .td_bl {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: #FFFFFF;
        border-top: 1px solid #EEEEEE;
        box-shadow: 4px 0 8px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        & > div {
          height: 100%;
        }
      }
      .td_bm {
        height: 100%;
        overflow-x: auto;
        background: #FFFFFF;
        border-top: 1px solid #EEEEEE;
        &::-webkit-scrollbar {display:none}
        .td_bm_box {
          width: 800px;
          display: flex;
          height: 100%;
          align-items: center;
          & > div {
            font-family: Arial;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 18px;
            color: #333333;
          }
        }
      }
      .td_br {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        background: #FFFFFF;
        border-top: 1px solid #EEEEEE;
        box-shadow: -4px 0 8px -3px rgba(0, 0, 0, 0.1);
        & > div {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  .expandBox {
    width: 100%;
    height: 32px;
    border-top: 1px solid #EEEEEE;
    border-bottom: 1px solid #EEEEEE;
    text-align: center;
    line-height: 32px;
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #1A7DF1;
    cursor: pointer;
    .iconfont {
      font-size: 12px;
      margin-left: 4px;
    }
  }
</style>
