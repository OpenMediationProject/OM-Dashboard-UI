<template>
  <div>
    <a-form :form="form" style="text-align: center;">
      <a-row type="flex" justify="start" style="height: 50px;margin-top: 7px;margin-bottom: 5px;margin-left: 16px">
        <ad-network
          :className="this.adName"
        />
      </a-row>
      <a-table
        ref="table"
        class="ant-card-table-default"
        rowKey="id"
        fixed="true"
        :dataSource="data"
        :scroll="{ y: 345 }"
        :columns="columns"
        :pagination="false"
      >
        <span slot="adType" slot-scope="text, record">
          <a-tag :style="record.status===0 ? 'opacity: 0.3;' : null">{{ text | typeFilter }}</a-tag>
        </span>
        <span slot="status" slot-scope="text, record">
          <template>
            <div v-if="!record.expandStatus">
              <a herf="#" @click="handleSuccess(record)">Success</a>
              <a-divider type="vertical" />
              <a herf="#" @click="handleFail(record)">Fail</a>
            </div>
            <div v-else>
              <span v-if="record.resultStatus" style="color: green " >Success</span>
              <span v-if="!record.resultStatus" style="color: red " >Fail</span>
            </div>
          </template>
        </span>
      </a-table>
    </a-form>
    <div class="button-div">
      <a-button type="primary" style="bottom: -40px;width: 168px;" @click="goStep1()">OK</a-button>
    </div>
  </div>
</template>

<script>
import { AdNetworkPlacements, updateDevAppTestResult } from '@/api/sdk'
import AdNetwork from '@/components/Mediation/AdNetwork'

const adTypeMap = {
  0: {
    adType: 0,
    text: 'Banner'
  },
  1: {
    adType: 0,
    text: 'Native'
  },
  2: {
    adType: 0,
    text: 'Rewarded Video'
  },
  3: {
    adType: 0,
    text: 'Interstitial'
  }
}

export default {
  name: 'Step2',
  components: {
    AdNetwork
  },
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      loading: false,
      adnId: this.$parent.$parent.adnId,
      adName: this.$parent.$parent.adName,
      pubAppId: this.$store.state.publisher.searchApp,
      timer: 0,
      data: [],
      num: 0,
      resultNum: 1,
      columns: [
        {
          title: 'Placement',
          dataIndex: 'placementName',
          width: '33%',
          scopedSlots: { customRender: 'placementName' }
        },
        {
          title: 'Type',
          dataIndex: 'adType',
          width: '33%',
          scopedSlots: { customRender: 'adType' }
        },
        {
          title: 'Operations',
          dataIndex: 'status',
          width: '33%',
          scopedSlots: { customRender: 'status' }
        }
      ]
    }
  },
  mounted () {
    const params = {}
    params.pubAppId = this.pubAppId
    params.adnId = this.adnId
    AdNetworkPlacements(params).then(res => {
      this.data = res.data
    })
  },
  filters: {
    typeFilter (type) {
      return adTypeMap[type].text
    }
  },
  methods: {
    nextStep () {
      const that = this
      const { form: { validateFields } } = this
      that.loading = true
      validateFields((err, values) => {
        if (!err) {
          that.loading = false
          that.$emit('nextStep', values)
        } else {
          that.loading = false
        }
      })
    },
    prevStep () {
      this.$emit('prevStep')
    },
    handleSuccess (record) {
      const newData = [...this.data]
      const target = newData.filter(item => record.placementId === item.placementId)[0]
      if (target) {
        target['expandStatus'] = true
        target['resultStatus'] = true
      }
      this.form.setFieldsValue({ curExpandedRowData: target })
      this.data = newData
      this.num++
    },
    handleFail (record) {
      const newData = [...this.data]
      const target = newData.filter(item => record.placementId === item.placementId)[0]
      if (target) {
        target['expandStatus'] = true
        target['resultStatus'] = false
      }
      this.form.setFieldsValue({ curExpandedRowData: target })
      this.data = newData
      this.num++
    },
    goStep1 () {
      if (this.num < this.data.length) {
        this.$message.error('Please set all results')
        return false
      }
      for (let i = 0; i < this.data.length; i++) {
        if (!this.data[i]['resultStatus']) {
          this.resultNum = 0
        }
      }
      const params = {}
      params.devResult = this.resultNum
      params.devAppId = this.data[0]['devAppId']
      updateDevAppTestResult(params).then(res => {
        if (res.code === 0) {
          this.prevStep()
        }
      })
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }
.button-div {
  text-align: center;
  bottom: 0;
  z-index: 100;
  position: fixed;
  width: 80%;
  height: 100px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 32.36%, #ffffff 100%);
}
</style>
