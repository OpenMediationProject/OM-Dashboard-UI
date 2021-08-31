<template>
  <div class="itemContainer">
    <div class="item-head">
      <span class="text">{{ $t('mediation.md_16_tip') }}</span>
      <adn-select
        ref="adnselect"
        name="insAdnId"
        :showArrow="false"
        :pubAppId="parseInt(searchApp)"
        mode="none"
        @change="adnFilterChange"
        size="default"
        style="margin-left:8px; display:inline-block; margin-right:8px;"/>
      <span class="iconfont" @click="deleteItem" v-if="this.item.adnId != -1">&#xe61f;</span>
    </div>
    <p class="errorTip1" v-if="errorTextStatus && item.adnId === -1">{{ $t('mediation.addInstance_tip_1') }}</p>
    <div class="table" v-if="item.adnId !== -1">
      <a-table
        rowKey="showId"
        style="border: 1px solid #EEEEEE; border-radius: 2px;"
        :data-source="data"
        :columns="columns"
        :expandedRowKeys="rowKeys"
        :expandIconAsCell="false"
        :expandIconColumnIndex="-1"
        :pagination="false"
        :rowClassName="rowClassNameChange"
      >
        <!-- 展开行 -->
        <div slot="expandedRowRender" class="bt-expand-row" slot-scope="record" :rowKey="record.showId" style="margin: 0">
          <span class="iconfont" @click="expandPutAway(record)">&#xe61c;</span>
          <a-form-model-item>
            <waterfall-table-inner
              :ref="`manualEcpmTable_${item.id}_${record.showId}`"
              :recordF="recordF"
              @editECPM="d => changeManualECPM(d, record)"
            >
            </waterfall-table-inner>
          </a-form-model-item>
        </div>
        <!-- 状态: bindding or waterfall -->
        <span slot="hbStatus" class="row-edit" slot-scope="record">
          <a-checkbox :disabled="showBiddingFlag || ![0, 2, 14, 17, 23, 24, 25].includes(record.adnId)" :checked="record.hbStatus === 1" @change="onStatusChange(record)"></a-checkbox>
        </span>
        <!-- Instance Name -->
        <span slot="insName" class="row-edit" slot-scope="record">
          <a-form-model-item :class="record.nameVarified.error ? 'inputError' : ''">
            <div class="insNameBox">
              <a-input v-model="record.name" :placeholder="$t('mediation.instanceName')" @blur="v => varifiedForm('name', record)"></a-input>
              <div class="iconfont iconSelect" v-if="record.hbStatus === 1">&#xe61a;</div>
            </div>
            <p class="inputTip" v-if="record.nameVarified.error">{{ record.nameVarified.text }}</p>
          </a-form-model-item>
        </span>
        <!-- Unit ID -->
        <span slot="unitId" class="row-edit" slot-scope="record">
          <a-form-model-item :class="record.placementKeyVarified.error ? 'inputError' : 'inputNormal'" style="width: 280px;">
            <a-input v-model="record.placementKey" :placeholder="$t('mediation.unitID')" @blur="v => varifiedForm('placementKey', record)"></a-input>
            <p class="inputTip" v-if="record.placementKeyVarified.error">{{ record.placementKeyVarified.text }}</p>
            <p class="inputTip" v-if="!record.placementKeyVarified.error && record.hbStatus === 1">{{ $t('mediation.md_19_tip') }}</p>
          </a-form-model-item>
        </span>
        <!-- Manual eCPM -->
        <span slot="manual" class="row-edit row-manual" slot-scope="record" v-if="!rowKeys.includes(record.showId) && record.hbStatus === 0">
          <div v-if="record.instanceCountries.length > 1" class="multiple">
            <span @click="addManualeCPM(record)">{{ $t('mediation.Multiple') }}</span>
          </div>
          <div v-else-if="record.instanceCountries.length === 1" class="single">
            <span class="ecpm" @click="addManualeCPM(record)">{{ '$' + record.instanceCountries[0].manualEcpm }}</span>
            <span class="text">{{ showRegionsformatInner(record.instanceCountries[0].country) }}</span>
          </div>
          <div v-else>
            <div class="manualBtn" @click="addManualeCPM(record)">
              <span class="iconfont" style="margin-right: 8px; color: #1A7DF1;">&#xe609;</span>
              <span class="text">{{ $t('mediation.addManualECPMS') }}</span>
            </div>
            <!-- <div class="manualTip"></div> -->
            <a-popover :arrowPointAtCenter="true" placement="bottomRight" trigger="hover" class="manualTip">
              <template slot="content">
                <div class="tipHead" style="margin-top: 4px;">{{ $t('mediation.manualECPMS') }}</div>
                <div class="tipBody">{{ $t('mediation.md_12_tip') }}</div>
                <div class="tipFoot" style="margin-bottom: 4px;">
                  <div><img src="/icon/imgMediation.svg"></div>
                  <div><span>{{ $t('mediation.note') }}:</span> {{ $t('mediation.md_13_tip') }}</div>
                </div>
              </template>
              <span><img src="/icon/info.svg"></span>
            </a-popover>
          </div>
        </span>
        <!-- Target Tier -->
        <span slot="targetTier" class="row-edit" slot-scope="record" v-if="record.hbStatus === 0">
          <a-select default-value="1" style="width: 100%;" @change="(v) => handleTargetTierChange(v, record)">
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
          </a-select>
        </span>
        <!-- 删除按钮 -->
        <span slot="delete" class="row-edit" slot-scope="record">
          <img class="deleteImg" src="/icon/Button-Delete.svg" @click="deleteRow(record)"/>
        </span>
      </a-table>
    </div>
    <div v-if="item.adnId !== -1" class="addIns" @click="addIns"><span class="iconfont" style="margin-right: 8px;color: #1A7DF1;">&#xe609;</span><span class="text">{{ $t('mediation.AddInstance') }}</span></div>
    <p class="errorTip1" style="margin-top: 8px" v-if="errorTextStatus && item.adnId !== -1">{{ $t('mediation.addInstance_tip_2') }}</p>
  </div>
</template>

<script>
import OmFormModel from '@/components/OmFormModel'
import Tip from '@/views/report/Tip.vue'
import AdnSelect from './AdnSelect'
import WaterfallTableInner from './WaterfallTableInner'
import { mapState } from 'vuex'
import { initFormRuleObj, varifiedForm as varifiedFormUtils, showRegionsformat } from './utils'

export default {
  components: {
    AdnSelect,
    OmFormModel,
    Tip,
    WaterfallTableInner
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp,
    searchPlacement: state => state.publisher.searchPlacement
  }),
  props: {
    items: {
      type: Array,
      required: true,
      default: null
    },
    item: {
      type: Object,
      required: true,
      default: null
    },
    isNeedGroupLevel: {
      type: Boolean,
      default: false
    },
    errorTextStatus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      num: 0,
      dataOrigin: {
        showId: -1,
        name: '',
        hbStatus: 0, // 1:bidding, 0:waterfall
        adnId: 0, //
        frequencyCap: 0,
        status: 1,
        frequencyUnit: 1,
        frequencyInterval: 0,
        brandType: 'include',
        brandList: [],
        modelType: 'include',
        modelList: [],
        createNew: true,
        adnAppId: 0, //
        expandStatus: false,
        editStatus: false,
        placementKey: '',
        placementId: 0, //
        brandWhitelist: '',
        brandBlacklist: '',
        modelWhitelist: '',
        modelBlacklist: '',
        pubAppId: 0, //
        instanceCountries: [],
        groupLevel: 1
      },
      data: [],
      columns: [],
      columns1: [
        {
          title: this.$t('mediation.inAppBidding'),
          width: '13%',
          scopedSlots: { customRender: 'hbStatus' }
        },
        {
          title: this.$t('mediation.instanceName'),
          width: '26%',
          scopedSlots: { customRender: 'insName' }
        },
        {
          title: this.$t('mediation.unitID'),
          width: '30%',
          scopedSlots: { customRender: 'unitId' }
        },
        {
          title: this.$t('mediation.manualECPMS'),
          width: '26%',
          scopedSlots: { customRender: 'manual' }
        },
        {
          dataIndex: 'showId',
          width: '5%',
          scopedSlots: { customRender: 'delete' }
        }
      ],
      columns2: [
        {
          title: this.$t('mediation.inAppBidding'),
          width: '13%',
          scopedSlots: { customRender: 'hbStatus' }
        },
        {
          title: this.$t('mediation.instanceName'),
          width: '23%',
          scopedSlots: { customRender: 'insName' }
        },
        {
          title: this.$t('mediation.unitID'),
          width: '25%',
          scopedSlots: { customRender: 'unitId' }
        },
        {
          title: this.$t('mediation.manualECPMS'),
          width: '26%',
          scopedSlots: { customRender: 'manual' }
        },
        {
          title: this.$t('mediation.TargetTier'),
          width: '10%',
          scopedSlots: { customRender: 'targetTier' }
        },
        {
          dataIndex: 'showId',
          width: '5%',
          scopedSlots: { customRender: 'delete' }
        }
      ],
      rowKeys: [],
      recordF: {
        editStatus: true,
        waterfallType: 'add'
      },
      // recordF: {},
      showBiddingFlag: false,
      disResObjs: {},
      disResList: []
    }
  },
  created () {
    if (this.isNeedGroupLevel) {
      this.columns = this.columns2
    } else {
      this.columns = this.columns1
    }
  },
  methods: {
    rowClassNameChange (record) {
      if (this.rowKeys.length && record && record.id === this.rowKeys[0] && record.hbStatus === 1) {
        return 'om-edit-row om-bidding'
      } else if (this.rowKeys.length && record && record.id === this.rowKeys[0] && record.hbStatus === 0) {
        return 'om-edit-row om-waterfall'
      } else if (record && record.hbStatus === 0) {
        return 'normal om-waterfall'
      } else {
        return 'normal om-bidding'
      }
    },
    setUndoedData (undoData, undoAdnId) {
      this.data = JSON.parse(JSON.stringify(undoData))
      this.$refs.adnselect.setAdnId(undoAdnId)
      if (this.data && this.data.length) {
        this.num = this.data[this.data.length - 1].showId + 2
      }
    },
    getAdnId () {
      return this.$refs.adnselect.getAdnId()
    },
    showRegionsformatInner (v) {
      return showRegionsformat(v)
    },
    deleteItem () {
      this.$emit('deleteItem', this.item)
    },
    expandPutAway (record) {
      this.rowKeys = this.rowKeys.filter(v => v !== record.showId)
      // record.instanceCountries = []
    },
    adnFilterChange ({ adNetworkAppId, id: adnId }, showBiddingFlag) {
      this.showBiddingFlag = showBiddingFlag
      if (showBiddingFlag) {
        this.data.map(v => {
          v.hbStatus = 1
          this.expandPutAway(v)
        })
      } else {
        this.data.map(v => {
          v.hbStatus = 0
        })
      }
      this.$emit('adnSelectChange', this.item, adnId)
      this.changeDataAdn(adNetworkAppId, adnId)
    },
    changeDataAdn (adNetworkAppId, adnId) {
      this.dataOrigin.adnAppId = adNetworkAppId
      this.dataOrigin.adnId = adnId
      this.data.map(v => {
        v.adnId = adnId
        v.adnAppId = adNetworkAppId
      })
    },
    onStatusChange (record) {
      record.hbStatus = record.hbStatus ? 0 : 1
      if (record.hbStatus === 1) {
        this.expandPutAway(record)
      }
    },
    deleteRow (showId) {
      this.data = this.data.filter(v => v.showId !== showId)
    },
    addManualeCPM ({ showId }) {
      this.rowKeys.push(showId)
    },
    addIns () {
      this.data.push(Object.assign({}, this.dataOrigin, {
        addShowId: this.item.id,
        hbStatus: this.showBiddingFlag ? 1 : 0,
        placementId: this.searchPlacement,
        pubAppId: this.searchApp,
        showId: this.num++,
        nameVarified: initFormRuleObj(this.$t('mediation.md_9_tip')),
        placementKeyVarified: initFormRuleObj(this.$t('mediation.md_10_tip'))
      }))
    },
    varifiedForm (name, record) {
      varifiedFormUtils(name, record)
      // if (name === 'placementKey') {
      //   checkInterfaceRepeatAction(record).then(() => {
      //     this.$emit('checkUnitIdIsRepeat')
      //   })
      // }
      this.$emit('checkUnitIdIsRepeat')
    },
    clearRepeatCode () {
      this.data.map(v => {
        if (v.placementKeyVarified.code === 1) {
          v.placementKeyVarified = initFormRuleObj(this.$t('mediation.md_10_tip'))
        }
      })
    },
    varifiedFormAll () {
      let result = true
      this.data.forEach(v => {
        if (!varifiedFormUtils('name', v)) {
          result = false
        }
        if (!varifiedFormUtils('placementKey', v)) {
          result = false
        }
      })
      return result
    },
    varifiedUnitId (id, obj) {
      this.data.map(v => {
        if (v.showId === id) {
          v.placementKeyVarified = obj
        }
      })
    },
    changeManualECPM (d, record) {
      const tempArr = []
      d.forEach(v => {
        if (v.eCPM != null && v.eCPM !== '' && v.regions.length > 0) {
          tempArr.push({
            country: v.regions.join(','),
            manualEcpm: v.eCPM
          })
        }
      })
      // record.instanceCountries = tempArr
      this.$set(record, 'instanceCountries', tempArr)
    },
    checkRegionsEcpm () {
      let result = true
      try {
        this.data.forEach(v => {
          if (!this.$refs[`manualEcpmTable_${this.item.id}_${v.showId}`].checkRegionsEcpm()) {
            result = false
            this.addManualeCPM(v)
          }
        })
      } catch (e) {
        console.log('dont find ref')
      }
      return result
    },
    handleTargetTierChange (v, record) {
      record.groupLevel = Number(v)
    }
  }
}

</script>

<style lang='less' scoped>
@import '~ant-design-vue/dist/antd.less';
@bidding-color: #B28BD9;
@waterfall-color: #49ACF0;
// @conWidth: 1064px;
@conWidth: 1264px;
.itemContainer {
  background: #FBFBFB;
  width: @conWidth;
  margin-top: 24px;
  margin-left: 24px;
  padding: 0 16px 8px;
}
.item-head {
  width: @conWidth;
  height: 56px;
  display: flex;
  align-items: center;
  .text {
    width: 178px;
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 24px;
    color: #333333;
  }
  .iconfont {
    margin-left: 800px;
    font-size: 16px!important;
    color: #333333!important;
    cursor: pointer;
  }
}
/deep/ .ant-table-thead > tr > th {
  background: #F5F5F5!important;
}
.table {
  .inputError {
    /deep/ .ant-input, /deep/ .ant-input:hover, /deep/ .ant-input:focus{
      border-color: #f5222d!important;
      box-shadow: none!important;
    }
    .inputTip {
      position: relative;
      top: 10px;
      font-size: 12px;
      color: #f5222d;
    }
  }
  .inputNormal {
    .inputTip {
      position: relative;
      top: 10px;
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      color: #999999;
    }
  }
  /deep/ .ant-table-placeholder {
    display: none!important;
  }
  /deep/ .om-bidding td:nth-of-type(1), /deep/ .om-bidding + .ant-table-expanded-row > td:nth-of-type(1) {
    border-left: 4px solid @bidding-color;
  }
  /deep/ .om-waterfall td:nth-of-type(1), /deep/ .om-waterfall + .ant-table-expanded-row > td:nth-of-type(1) {
    border-left: 4px solid @waterfall-color;
  }
  .bt-expand-row {
    position: relative;
    /deep/ .ant-form-item-control {
      padding-top: 24px;
      display: flex;
      justify-content: center;
    }
    .iconfont {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      color: #BDBDBD!important;
      z-index: 1008;
      cursor: pointer;
      &:hover {
        color: #1A7DF1!important;
      }
    }
  }
  .row-edit {
    display: flex;
    align-items: center;
    /deep/ .ant-form-item {
      margin-bottom: 0;
    }
  }
  .row-edit.row-manual {
    & > div {
      // width: 170px;
      height: 32px;
      position: relative;
      .manualTip {
        position: absolute;
        top: 50%;
        right: -20px;
        transform: translateY(-50%);
      }
    }
    & > .multiple {
      width: 92px;
      cursor: pointer;
      color: #1A7DF1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    & > .single {
      width: 92px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      .ecpm {
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 18px;
        color: #1A7DF1;
        cursor: pointer;
      }
      .text {
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 14px;
        color: #999999;
      }
    }
  }
  .manualBtn {
    // width: 170px;
    height: 32px;
    padding: 0 16px;
    border: 1px dashed #D8D8D8;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: #FFFFFF;
    &:hover {
      border-color: #1A7DF1;
    }
    .text {
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 18px;
      color: #1A7DF1;
    }
  }
}
.addIns {
  // width: 1032px;
  width: @conWidth - 32px;
  height: 48px;
  border: 1px dashed #D8D8D8;
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #FFFFFF;
  margin-top: 8px;
  &:hover {
    border-color: #1A7DF1;
  }
  .text {
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    color: #1A7DF1;
  }
}
.deleteImg {
  cursor: pointer;
}
.tipHead {
  margin-top: 4px;
  // margin-left: 8px;
  font-family: Arial;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: #333333;
}
.tipBody {
  // margin-left: 8px;
  // margin-right: 8px;
  margin-top: 24px;
  width: 360px;
  height: 36px;
  font-family: Arial;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
  color: #666666;
}
.tipFoot {
  // margin-left: 8px;
  // margin-right: 8px;
  margin-top: 16px;
  width: 368px;
  height: 44px;
  display: flex;
  padding: 8px;
  background: @item-hover-bg;
  border-radius: 4px;
  & > div:nth-of-type(1) {
    width: 16px;
    height: 16px;
  }
  & > div:nth-of-type(2) {
    font-family: Arial;
    font-style: normal;
    font-size: 12px;
    line-height: 14px;
    color: #757F8A;
    margin-left: 8px;
    & > span {
      font-weight: bold;
    }
  }
}
/deep/ .ant-popover.ant-popover-placement-bottomRight{
  left: 877px!important;
}
.errorTip1 {
  font-family: Arial;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  color: #CF181A;
}
.iconSelect {
  color: @bidding-color!important;
  margin-left: 8px;
}
.insNameBox {
  display: flex;
  align-items: center;
}
/deep/ .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active {
  box-shadow: none!important;
}
</style>
