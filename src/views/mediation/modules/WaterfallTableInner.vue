<template>
  <div>
    <div class="manual_head_card">
      <div class="card_left">
        <p class="p-t">Manual eCPM is used for eCPM estimation during the cold start period of the Mediation Rule.</p>
        <div class="tip">
          <p class="p-d"><img src="/icon/mediation/info.svg" />We recommend configuring it according to the eCPM Floor set by Instance on 3rd-party ad network.</p>
        </div>
      </div>
      <div class="card_right">
        <img src="/icon/mediation/mecpm.svg" />
      </div>
    </div>
    <div class="manual_table_card" v-if="!recordF.ecpmSatus">
      <a-table
        class="table"
        style="border: 1px solid #D8D8D8; border-radius: 2px;background: #FFFFFF;"
        :columns="columns"
        :data-source="data"
        :pagination="false">
        <!-- 地区 -->
        <span slot="regions" class="row-edit" slot-scope="record">
          <div :class="record.regionsVarified.error ? 'inputError' : ''">
            <regions-select
              :disabled="!recordF.editStatus"
              mode="multiple"
              :default-selected="record.regions"
              :disabledList="disResList"
              @change="(v) => eCPMChangeRegions(v, record)"
              :maxTagCount="6"
              style="width: 100%"
            />
            <p class="inputTip" v-if="record.regionsVarified.error">{{ record.regionsVarified.text }}</p>
          </div>
        </span>
        <!-- Manual eCPM -->
        <span slot="eCPM" class="row-edit" slot-scope="record">
          <div :class="record.eCPMVarified.error ? 'inputError' : ''">
            <a-input
              prefix="$"
              :disabled="!recordF.editStatus"
              v-model="record.eCPM"
              @change="(v) => eCPMChangeNum(v, record)"
            />
            <p class="inputTip" v-if="record.eCPMVarified.error">{{ record.eCPMVarified.text }}</p>
          </div>
        </span>
        <!-- 删除按钮 -->
        <span slot="delete" class="row-edit" slot-scope="record" v-if="recordF.editStatus">
          <img class="deleteImg" src="/icon/Button-Delete.svg" @click="deleteRow(record)"/>
        </span>
      </a-table>
      <a-button
        v-if="recordF.editStatus"
        type="dashed"
        @click="addRow"
        class="addRow"
        :class="!recordF.editStatus? 'addRow-disabled': ''">
        <span class="iconfont" style="margin-right: 8px;">&#xe609;</span>Add Manual eCPM
      </a-button>
    </div>
    <div v-else>
      <a-table
        class="table"
        style="border: 1px solid #D8D8D8; border-radius: 2px;"
        :columns="columns"
        :data-source="data"
        :pagination="false">
        <!-- 地区 -->
        <span slot="regions" class="row-edit row-region" slot-scope="record">
          <span class="regionSpan" v-for="(region, index) in record.regions" :key="`${region}${index}`">
            {{ region }}
          </span>
        </span>
        <!-- Manual eCPM -->
        <span slot="eCPM" class="row-edit" slot-scope="record">
          <span>{{ '$' + record.eCPM }}</span>
        </span>
        <!-- 删除按钮 -->
        <span slot="delete" class="row-edit" slot-scope="record" v-if="recordF.editStatus">
          <img class="deleteImg" src="/icon/Button-Delete.svg" @click="deleteRow(record)"/>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import RegionsSelect from '@/components/om/RegionsSelect.vue'
import { initFormRuleObj, varifiedForm as varifiedFormUtils, clearRepeatArr } from './utils'

export default {
  components: {
    RegionsSelect
  },
  props: {
    recordF: {
      type: Object,
      required: true,
      default: null
    }
  },
  data () {
    return {
      columns: [
        {
          title: 'Regions',
          width: '70%',
          scopedSlots: { customRender: 'regions' }
        },
        {
          title: 'Manual eCPM',
          width: '25%',
          scopedSlots: { customRender: 'eCPM' }
        },
        {
          dataIndex: 'id',
          width: '5%',
          scopedSlots: { customRender: 'delete' }
        }
      ],
      data: [],
      num: 0,
      disResObjs: {},
      disResList: []
    }
  },
  watch: {
    'recordF.editStatus': {
      handler: function (v) {
        this.data = []
        this.init()
      }
    }
  },
  mounted () {
    if (this.recordF && this.recordF.waterfallType === 'add') {
      this.data = this.initOriginData()
    } else {
      this.data = []
    }
    this.init()
  },
  methods: {
    initOriginData () {
      return [{
        id: 0,
        regions: [],
        eCPM: undefined,
        regionsVarified: initFormRuleObj('Please enter Regions!'),
        eCPMVarified: initFormRuleObj('Please enter Manual eCPM!')
      }]
    },
    init () {
      if (this.recordF && this.recordF.instanceCountries && this.recordF.instanceCountries.length > 0) {
        this.initData(this.recordF.instanceCountries)
        if (this.data && this.data.length) {
          this.data.forEach(v => {
            this.editDisRegList(v)
          })
        }
      }
    },
    initData (mEcpmArr) {
      this.data = []
      this.resetNum()
      this.clearDisInfo()
      mEcpmArr.forEach(v => {
        this.addRowInit(v.country.split(','), v.manualEcpm)
      })
    },
    manualChangeData (record) {
      if (record && record.instanceCountries && record.instanceCountries.length > 0) {
        this.initData(record.instanceCountries)
      } else {
        this.data = this.initOriginData()
      }
    },
    deleteRow (id) {
      this.data = this.data.filter(v => {
        return v.id !== id
      })
      this.editDisRegList({ id: id, regions: [] })
      this.editECPM()
    },
    addRow () {
      this.data.push({
        id: ++this.num,
        regions: [],
        eCPM: undefined,
        regionsVarified: initFormRuleObj('Please enter Regions!'),
        eCPMVarified: initFormRuleObj('Please enter Manual eCPM!')
      })
    },
    addRowInit (regions = [], eCPM) {
      this.data.push({
        id: ++this.num,
        regions: regions,
        eCPM: eCPM,
        regionsVarified: initFormRuleObj('Please enter Regions!'),
        eCPMVarified: initFormRuleObj('Please enter Manual eCPM!')
      })
    },
    varifiedForm (name, record) {
      varifiedFormUtils(name, record)
    },
    eCPMChangeRegions (v, record) {
      record.regions = v
      this.editDisRegList(record)
      this.editECPM()
    },
    clearDisInfo () {
      this.disResObjs = {}
      this.disResList = []
    },
    editDisRegList (v) {
      this.disResObjs[v.id] = v.regions
      let tempArr = []
      if (this.disResObjs) {
        for (const key in this.disResObjs) {
          tempArr = tempArr.concat(this.disResObjs[key])
        }
      }
      this.disResList = clearRepeatArr(tempArr)
    },
    eCPMChangeNum (v, record) {
      if (!/^\d+\.?\d{0,2}$/.test(record.eCPM)) {
        if (record.eCPM) {
          record.eCPM = record.eCPM.replace(/[^\d.]/g, '')
          record.eCPM = record.eCPM.substring(0, record.eCPM.indexOf('.') + 3)
        }
      } else {
        this.editECPM()
      }
    },
    editECPM () {
      this.$emit('editECPM', this.data)
    },
    checkRegionsEcpm () {
      let result = true
      this.data.forEach(v => {
        if (v.eCPM != null && v.eCPM !== '' && v.regions.length === 0) {
          result = false
          v.regionsVarified.error = true
        } else {
          v.regionsVarified.error = false
        }
        if ((v.eCPM === null || v.eCPM === '' || v.eCPM === undefined) && v.regions.length > 0) {
          result = false
          v.eCPMVarified.error = true
        } else {
          v.eCPMVarified.error = false
        }
      })
      return result
    },
    resetNum () {
      this.num = 0
    }
  }
}

</script>

<style lang='less' scoped>
@import '~ant-design-vue/dist/antd.less';
.manual_head_card {
  @mhc_w: 776px;
  width: @mhc_w;
  height: 96px;
  background: #ffffff;
  padding: 16px;
  margin-bottom: 8px;
  .card_left {
    width: 592px;
    height: 64px;
    float: left;
    .p-t{
      font-size: 14px;
      line-height: 18px;
      width: 592px;
      height: 18px;
      color: #666666;
      font-family: Arial;
      font-style: normal;
      font-weight: normal;
    }
    .tip{
      width: 592px;
      height: 32px;
      margin-top: 8px;
      background: #E0F6FF;
      border-radius: 4px;
      padding: 8px;
      .p-d{
        font-size: 12px;
        line-height: 14px;
        color: #757F8A;
        margin: 0;
        font-family: Arial;
        font-style: normal;
        font-weight: normal;
        img {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }
  }
  .card_right {
    width: 136px;
    height: 64px;
    float: left;
    margin-left: 16px;
  }
}
.table {
  width: 776px;
  /deep/ .ant-table-placeholder {
    display: none!important;
  }
  /deep/ .ant-table-thead > tr > th {
    background: #FFFFFF!important;
  }
  .inputError {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 10px;
    /deep/ .ant-input, /deep/ .ant-input:hover, /deep/ .ant-input:focus{
      border-color: #f5222d!important;
      box-shadow: none!important;
    }
    .inputTip {
      position: relative;
      font-size: 12px;
      color: #f5222d;
      margin: 0;
    }
  }
  .regionSpan {
    height: 26px;
    border-radius: 16px;
    padding: 4px 8px;
    background: #EFF0F1;
    float: left;
    font-family: Arial;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    color: #333333;
  }
}
.deleteImg {
  cursor: pointer;
}
.addRow {
  margin-top: 8px;
  color: #1A7DF1!important;
}
.addRow.addRow-disabled{
  color: #D8D8D8!important;
  &:hover {
    border-color: #D8D8D8!important;
  }
  .iconfont {
    color: #D8D8D8!important;
  }
}
</style>
