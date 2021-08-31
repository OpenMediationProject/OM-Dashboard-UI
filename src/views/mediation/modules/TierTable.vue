<template>
  <div class="tierTable">
    <div class="tier_head_box" v-if="showSelect">
      <div class="head_select_box" :style="guideRlNum === 3 ? `position: relative; z-index: 1003;`: ``">
        <span>{{ $t('mediation.Tier') + itemIndex + $t('mediation.TierC') }}</span>
        <a-select
          :value="selectVal"
          :style="this.$i18n.locale === 'zhCN' ? 'width: 80px' : selectVal === 'auto' ? 'width: 80px' : 'width: 120px'"
          :dropdownMatchSelectWidth="false"
          :dropdownMenuStyle="{ width: '105px', margin: '0' }"
          @change="handleChange"
        >
          <!-- <a-select :value="selectVal" :style="this.$i18n.locale === 'zhCN' ? 'width: 80px' : selectVal === 'auto' ? 'width: 60px' : 'width: 120px'" @change="handleChange"> -->
          <a-icon slot="suffixIcon" type="down" />
          <a-select-option value="manual">
            {{ $t('mediation.manual') }}
          </a-select-option>
          <a-select-option value="auto">
            {{ $t('mediation.auto') }}
          </a-select-option>
        </a-select>
      </div>
      <div class="head_tip_box">{{ dataSources_inner.length + ' ' + $t('mediation.enabledInstances') }}<span v-if="dataSources_inner.length > 1">{{ $t('mediation.s') }}</span></div>
    </div>
    <table style="width:100%;">
      <thead>
        <tr class="thead_tr">
          <th class="td_th" v-for="(column, thdex) in columns" :key="'th_' + thdex" :style="`width:` + column.width + `;height:47px;text-align:` + column.textAlign +`;padding-left:` + column.marginLeft + `;`">
            {{ hideColumns_inner.includes(column.id) ? '' : column.title }}
          </th>
        </tr>
      </thead>
    </table>
    <table style="width:100%;" v-if="dragFalg_inner">
      <draggable
        v-model="dataSources_inner"
        group="site"
        tag="tbody"
        animation="300"
        @end="dragEnd"
        @update="dragUpdate"
        handle=".sortcell">
        <tr class="tbody_tr sortcell" v-for="(dataSource, trdex) in dataSources_inner" :key="'tr_' + trdex">
          <td class="td_tr" v-for="(column, tddex) in columns" :key="'tr_' + trdex + '_td_' + tddex" :style="`width:` + column.width + `;height:63px;`">
            <slot :name="column.id" :record="Object.assign(dataSource, { TierIndex: (trdex + 1), itemIndex: itemIndex })" v-if="!hideColumns_inner.includes(column.id)"></slot>
          </td>
        </tr>
      </draggable>
    </table>
    <table style="width:100%;" v-else>
      <tr class="tbody_tr2 sortcell" v-for="(dataSource, trdex) in dataSources_inner" :key="'tr_' + trdex">
        <td class="td_tr" v-for="(column, tddex) in columns" :key="'tr_' + trdex + '_td_' + tddex" :style="`width:` + column.width + `;height:63px;`">
          <slot :name="column.id" :record="Object.assign(dataSource, { itemIndex: itemIndex })" v-if="!hideColumns_inner.includes(column.id)"></slot>
        </td>
      </tr>
    </table>
    <div class="addInstance" v-if="dataSources_inner.length === 0 && disabledSources_inner.length && !expandFlag">
      <div class="addInstance_content" @click="toggleExpand"><span class="iconfont" style="margin-right: 8px;">&#xe609;</span>{{ $t('mediation.enabledInstance') }}</div>
    </div>
    <div class="expandBox" @click="toggleExpand" v-if="(dataSources_inner.length || expandFlag) && disabledSources_inner.length">{{ disabledSources_inner.length }} {{ $t('mediation.disabledInstance') }}<span v-if="disabledSources_inner.length > 1">{{ $t('mediation.s') }}</span> <span class="iconfont">{{ expandFlag ? '&#xe61c;' : '&#xe620;' }}</span></div>
    <table style="width:100%;" v-if="expandFlag">
      <tr class="tbody_tr2" v-for="(dataSource, trdex) in disabledSources_inner" :key="'dis_tr_' + trdex">
        <td class="td_tr" v-for="(column, tddex) in columns" :key="'dis_tr_' + trdex + '_td_' + tddex" :style="`width:` + column.width + `;height:63px; ${ column.id === 'status' ? '' : 'opacity: 0.3;'}`">
          <slot :name="column.id" :record="Object.assign(dataSource, { TierIndex: (trdex + 1 + dataSources_inner.length), itemIndex: itemIndex })" v-if="!hideColumns_inner.includes(column.id)"></slot>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { swapArray, zIndexTop } from './utils'

export default {
  name: 'TierTable',
  components: {
    draggable
  },
  data () {
    return {
      dataSources_inner: [],
      disabledSources_inner: [],
      hideColumns_inner: [],
      selectVal: 'manual',
      expandFlag: false,
      dragFalg_inner: this.dragFalg,
      waterfallStatus_inner: this.waterfallStatus
    }
  },
  watch: {
    dataSources: {
      handler (v) {
        this.initShowData(v)
      }
    },
    expandData: {
      handler (v) {
        this.initHideData(v)
      },
      deep: false
    },
    dataSources_inner: {
      handler (nv, ov) {
        if (nv.length > ov.length) {
          nv.map(v => {
            v.groupLevel = this.itemIndex
          })
        }
      },
      deep: false
    },
    dragFalg (v) {
      this.dragFalg_inner = v
    },
    waterfallStatus (v) {
      this.waterfallStatus_inner = v
    }
  },
  props: {
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
    expandData: {
      type: Array,
      default () {
        return []
      }
    },
    hideColumns: {
      type: Array,
      default () {
        return []
      }
    },
    textAlign: {
      type: String,
      default: 'center'
    },
    itemIndex: {
      type: Number,
      default: 1
    },
    showSelect: {
      type: Boolean,
      default: false
    },
    dragFalg: {
      type: Boolean,
      default: false
    },
    initAuto: {
      type: Boolean,
      default: false
    },
    waterfallStatus: {
      type: Number,
      default: 0
    },
    marginLeft: {
      type: String,
      default: '0px'
    },
    guideRlNum: {
      type: Number,
      default: 0
    }
  },
  created () {
    if (!this.initAuto) {
      this.selectVal = 'auto'
      this.hideColumns_inner = this.hideColumns
    }
    this.initShowData(this.dataSources)
    this.initHideData(this.expandData)
  },
  methods: {
    initShowData (datas) {
      if (this.initAuto && this.dataSources && this.dataSources.length && this.waterfallStatus_inner === 0) {
        this.$nextTick(() => {
          this.handleChange(this.dataSources[0].autoSwitch === 1 ? 'auto' : 'manual')
        })
      }
      this.dataSources_inner = JSON.parse(JSON.stringify(datas))
      this.isInsAuto()
    },
    setInnerShowData (data) {
      this.dataSources_inner.push(data)
      this.isInsAuto()
    },
    removeInnerShowData (data) {
      this.dataSources_inner = this.dataSources_inner.filter(v => {
        return v.id !== data.id
      })
    },
    filterTierData (datas) {
      this.dataSources_inner.map(d => {
        Object.assign(d, datas.find(item => item.id === d.id))
      })
    },
    initHideData (datas) {
      this.disabledSources_inner = datas
    },
    handleChange (v) {
      this.selectVal = v
      if (v === 'auto') {
        this.hideColumns_inner = this.hideColumns
        this.sortByRequest(this.dataSources_inner)
      } else {
        this.hideColumns_inner = []
        this.$emit('changeInitAuto', true)
      }
    },
    isInsAuto () {
      this.isAuto()
    },
    dragEnd () {
      this.$emit('checkTierIsAuto')
      this.isAuto()
    },
    isAuto () {
      if (this.selectVal === 'auto') {
        this.sortByRequest(this.dataSources_inner)
      }
    },
    dragUpdate () {
      // this.$emit('checkTierIsAuto')
      this.$message.success(this.$t('mediation.md_18_tip'))
    },
    sortByRequest (datas) {
      datas.sort((a, b) => {
        return b.instanceRequestLatest - a.instanceRequestLatest
      })
    },
    sortByPriority () {
      this.dataSources_inner.sort((a, b) => {
        return b.priority - a.priority
      })
    },
    filterInnerData (dr) {
      dr.forEach(v => {
        this.dataSources_inner.forEach(f => {
          if (v.id === f.id) {
            f.priority = v.priority
          }
        })
      })
    },
    toggleExpand () {
      this.expandFlag = !this.expandFlag
      if (this.expandFlag) {
        this.$emit('clearOtherExpand', this.itemIndex)
      }
    },
    changeExpand (v) {
      this.expandFlag = v
    },
    exchangeOrder (index1, index2) {
      if (index1 >= this.dataSources_inner.length) {
        zIndexTop(this.dataSources_inner, index2, this.dataSources_inner.length)
      } else if (index1 !== index2) {
        swapArray(this.dataSources_inner, index1, index2)
      }
    },
    addEndableInstance () {
      this.$emit('addEndableInstance')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/dist/antd.less';
/deep/ .ant-select-selection {
  // width: 100px;
  height: 32px;
  background: #E0F6FF;
  border-radius: 16px;
  border: 0;
  color: #1A7DF1;
}
/deep/ .ant-select-selection__placeholder, /deep/ .ant-select-selection-selected-value {
  font-family: Arial;
  font-style: normal;
  font-weight: normal;
  color: #1A7DF1;
  font-size: 18px;
//   line-height: 32px;
}
/deep/ .ant-select-focused .ant-select-selection, /deep/  .ant-select-selection:active, /deep/  .ant-select-selection:focus {
  border-color: none!important;
  box-shadow: none!important;
}
.tierTable {
  margin-bottom: 16px;
}
.tier_head_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .head_select_box {
    width: 160px;
    height: 32px;
    background: #E0F6FF;
    border-radius: 0px 16px 16px 0px;
    display: flex;
    align-items: center;
    & > span {
      margin-left: 16px;
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      color: #333333;
    }
  }
  .head_tip_box {
    margin-right: 8px;
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: #BDBDBD;
  }
}
.td_th {
  font-family: Arial;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
}
.thead_tr {
  border: 1px solid #EEEEEE;
  border-left: 0px;
}
.tbody_tr {
  width: 100%;
  border-bottom: 1px solid #EEEEEE;
  border-right: 1px solid #EEEEEE;
  cursor: move;
  background:#FFFFFF;
}
.tbody_tr_chosen {
  background:#F9F9FA!important;
  opacity: 1!important;
}
.tbody_tr2 {
  width: 100%;
  border-bottom: 1px solid #EEEEEE;
  border-right: 1px solid #EEEEEE;
}
.expandBox {
  width: 100%;
  height: 32px;
  border-bottom: 1px solid #EEEEEE;
  border-right: 1px solid #EEEEEE;
  text-align: center;
  line-height: 32px;
  font-family: Arial;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: #1A7DF1;
  cursor: pointer;
}
.addInstance {
  width: 100%;
  height: 64px;
  background: #FBFBFB;
  border-bottom: 1px solid #EEEEEE;
  border-right: 1px solid #EEEEEE;
  display: flex;
  justify-content: center;
  align-items: center;
  .addInstance_content {
    width: calc(100% - 400px);
    height: 32px;
    background: #FFFFFF;
    border: 1px dashed #D8D8D8;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    color: #1A7DF1;
    cursor: pointer;
    &:hover{
      background: @item-hover-bg;
    }
  }
}
.v-enter,
.v-leave-to {
    opacity: 0;
    transform: translateX(200px);
}
.v-enter-active,
.v-leave-active {
    transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}
/deep/ .ant-select-arrow .ant-select-arrow-icon {
  color: #1A7DF1;
}
</style>
