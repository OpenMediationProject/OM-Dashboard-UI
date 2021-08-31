<template>
  <div class="addCard">
    <div class="undo" v-if="undoShow">
      <a-alert
        class="undoInfo"
        closable
        showIcon
      >
        <span slot="message" style="display: flex;">
          <span style="font-size: 14px;color: #666666; margin-right: 6px;">{{ GLOBAL.getAdnName(undoAdnId) }}{{ $t('mediation.undo_tip') }} </span>
          <span style="display: flex; color: #1A7DF1; cursor: pointer;" @click="onUndo"><span>{{ $t('mediation.undoBtn') }}</span><span class="iconfont undoIcon" style="margin-left: 4px; padding-top: 1px;">&#xe622;</span></span>
        </span>
        <span slot="closeText" @click="() => undoShow = false"><span class="iconfont undoClose">&#xe61f;</span></span>
      </a-alert>
    </div>
    <a-card class="cardBox" :title="$t('mediation.AddInstance')" :bordered="false">
      <div class="card-body">
        <add-instance-item
          v-for="item in items"
          :key="item.id"
          :ref="`insItem${item.id}`"
          :item="item"
          :items="items"
          :isNeedGroupLevel="isNeedGroupLevel"
          @checkUnitIdIsRepeat="checkUnitIdIsRepeat"
          @deleteItem="deleteAddItem"
          @adnSelectChange="adnSelectChange"
          :errorTextStatus="errorTextStatus && item.id === items[0].id"
        ></add-instance-item>
      </div>
      <div class="card-footer">
        <a-button type="primary" @click="saveNewInstances" class="saveBtn cardBtn" style="margin-right: 24px;">{{ $t('comm.save') }}</a-button>
        <a-popconfirm
          :title="$t('mediation.md_20_tip')"
          :ok-text="$t('tips.Yes')"
          :cancel-text="$t('tips.No')"
          placement="topRight"
          @confirm="() => $emit('addInstancesCancel')"
        >
          <a-icon slot="icon" type="exclamation-circle" style="color: red" />
          <a-button type="primary" class="cancelBtn cardBtn" ghost>{{ $t('comm.cancel') }}</a-button>
        </a-popconfirm>
      </div>
    </a-card>
  </div>
</template>

<script>
import { createInstances } from '@/api/mediation'
import AddInstanceItem from './AddInstanceItem'
import { checkInterfaceRepeatAction } from './utils'

export default {
  components: {
    AddInstanceItem
  },
  props: {
    isNeedGroupLevel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: [
        {
          id: 0,
          adnId: -1
        }
      ],
      num: 0,
      errorTextStatus: false,
      undoArr: [],
      undoData: null,
      undoId: -1,
      undoAdnId: 0,
      undoShow: false
    }
  },
  /**
   * 当初设计应该使用Vuex进行整体设计
   */
  methods: {
    // cancelConfirm () {
    //   const _that = this
    //   this.$confirm({
    //     title: this.$t('mediation.md_20_tip'),
    //     okText: this.$t('tips.Yes'),
    //     cancelText: this.$t('tips.No'),
    //     zIndex: 2000,
    //     onOk () {
    //       _that.$emit('addInstancesCancel')
    //     },
    //     onCancel () {}
    //   })
    // },
    adnSelectChange ({ id: arrIndex, adnId: adnIdOld }, adnId) {
      if (adnIdOld === -1) {
        this.items.push({
          id: ++this.num,
          adnId: -1
        })
      }
      this.items.map(v => {
        if (v.id === arrIndex) {
          v.adnId = adnId
        }
      })
    },
    saveNewInstances2 () {
      this.$message.success(this.$t('mediation.md_17_tip'))
      this.$emit('addInstancesCancel')
    },
    saveNewInstances () {
      const _that = this
      if (this.varifiedForm() && this.getSubData().length > 0 && this.items.length > 1) {
        this.checkInterfaceRepeatActionAll().then(() => {
          this.errorTextStatus = false
          const finallyData = this.getFilterBiddingData()
          createInstances(finallyData).then(res => {
            if (res.code === 0) {
              this.$message.success(this.$t('mediation.md_17_tip'))
              setTimeout(() => {
                _that.$emit('refreshData', res.data)
                _that.$emit('addInstancesCancel')
              }, 100)
            }
          }).catch(e => {
            console.log(e)
          })
        })
      } else {
        this.errorTextStatus = true
      }
      if (this.items.length === 1) {
        this.errorTextStatus = true
      }
    },
    getFilterBiddingData () {
      const result = JSON.parse(JSON.stringify(this.getSubData()))
      result.map(v => {
        if (v.hbStatus === 1) {
          v.instanceCountries = []
        }
      })
      return result
    },
    checkInterfaceRepeatActionAll () {
      const tempArr = []
      this.getSubData().forEach(v => {
        tempArr.push(checkInterfaceRepeatAction(v))
      })
      return Promise.all(tempArr)
    },
    getSubData () {
      let subData = []
      this.items.forEach(item => {
        subData = subData.concat(this.$refs[`insItem${item.id}`][0].data)
      })
      return subData
    },
    varifiedForm () {
      let result = true
      this.items.forEach(item => {
        if (!this.$refs[`insItem${item.id}`][0].varifiedFormAll()) {
          result = false
        }
      })
      if (!this.checkUnitIdIsRepeat()) {
        result = false
      }
      if (!this.checkRegionsEcpm()) {
        result = false
      }
      return result
    },
    checkUnitIdIsRepeat () {
      this.clearRepeatCode()
      return this.checkFormRepeatAction()
    },
    checkRegionsEcpm () {
      let result = true
      // this.getSubData.forEach(v)
      this.items.forEach(item => {
        if (item.adnId !== -1 && !this.$refs[`insItem${item.id}`][0].checkRegionsEcpm()) {
          result = false
        }
      })
      return result
    },
    clearRepeatCode () {
      this.items.forEach(item => {
        this.$refs[`insItem${item.id}`][0].clearRepeatCode()
      })
    },
    checkFormRepeatAction () {
      let result = true
      const len = this.getSubData().length
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (
              this.getSubData()[i].placementKey &&
              this.getSubData()[j].placementKey &&
              this.getSubData()[i].placementKey === this.getSubData()[j].placementKey &&
              this.getSubData()[i].adnId === this.getSubData()[j].adnId
            ) {
            result = false
            this.setRepeatObj(this.getSubData()[i].addShowId, this.getSubData()[i].showId, true, this.$t('mediation.md_11_tip'), 1)
            this.setRepeatObj(this.getSubData()[j].addShowId, this.getSubData()[j].showId, true, this.$t('mediation.md_11_tip'), 1)
          }
        }
      }
      return result
    },
    setRepeatObj (addShowId, showId, error, text, code) {
      this.$refs[`insItem${addShowId}`][0].varifiedUnitId(showId, {
        error: error,
        text: text,
        code: code
      })
    },
    deleteAddItem (item) {
      this.saveForUndo(item)
      this.items = this.items.filter(v => {
        return v.id !== item.id
      })
    },
    saveForUndo (item) {
      this.undoArr = JSON.parse(JSON.stringify(this.items))
      this.undoData = this.$refs[`insItem${item.id}`][0].data
      this.undoId = this.$refs[`insItem${item.id}`][0].item.id
      this.undoAdnId = this.$refs[`insItem${item.id}`][0].getAdnId()
      this.undoShow = true
    },
    onUndo () {
      this.undoShow = false
      this.items = JSON.parse(JSON.stringify(this.undoArr))
      this.$nextTick(() => {
        this.$refs[`insItem${this.undoId}`][0].setUndoedData(this.undoData, this.undoAdnId)
      })
    }
  }
}

</script>

<style lang='less' scoped>
.addCard {
  position: fixed;
  left: 50%;
  top: 30px;
  transform: translateX(-50%);
  z-index: 1005;
}
.undo {
  position: absolute;
  top: 12px;
  left: 50%;
  width: 420px;
  height: 36px;
  transform: translateX(-50%);
  // background-color: red;
  z-index: 1005;
}
.cardBox {
  // width: 1112px;
  width: 1312px;
  height: 672px;
  position: relative;
  border-radius: 4px;
  box-shadow: 0px 0px 4px rgba(221, 224, 228, 0.3), 0px 4px 10px rgba(221, 224, 228, 0.3);
  .card-body {
    width: 100%;
    height: 528px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .card-footer {
    width: 100%;
    height: 80px;
    border-top: 1px solid #EEEEEE;
    position: absolute;
    bottom: 0;
    left: 0;
    .cardBtn{
      margin-top: 23px;
    }
    .saveBtn{
      float: right;
      margin-right: 24px;
    }
    .cancelBtn{
      float: right;
      margin-right: 40px;
    }
  }
}
/deep/ .ant-card-head {
  padding: 0;
  border: 0;
}
/deep/ .ant-card-head-title {
  padding: 0;
  font-family: Arial;
  font-style: normal;
  font-weight: normal;
  font-size: 28px;
  line-height: 32px;
  color: #333333;
  margin: 16px 0 0 24px;
}
.undoIcon {
  color: #1A7DF1!important;
}
.undoClose {
  color: #BDBDBD!important;
}
.undoInfo {
  background: #E0F6FF!important;
}
</style>
