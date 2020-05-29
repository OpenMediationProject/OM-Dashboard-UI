<template>
  <div>
    <a-form :form="form" :hideRequiredMark="true" style="margin-top:84px;text-align: center;padding-left: 16px;padding-right: 16px">
      <div style="background-color:#ffffff;margin-bottom:64px;">
        <a-table
          ref="table"
          class="ant-card-table-default"
          rowKey="id"
          fixed="true"
          :dataSource="data"
          :scroll="{ y: scroll }"
          :columns="columns"
          :pagination="false"
        >
          <span slot="className" slot-scope="text, record">
            <ad-network
              :status="record.selected?1:0"
              :className="text"
            />
          </span>
          <span slot="status" slot-scope="text, record">
            <span>
              <div v-if="record.selected">
                <a herf="#" @click="handleUnselect(record)">Unselect</a>
              </div>
              <div v-else>
                <a herf="#" @click="handleSelect(record)">Select</a>
              </div>
            </span>
          </span>
          <span slot="lastTesting" slot-scope="text, record" :style="!record.selected ? 'opacity: 0.3;' : null">
            <span v-if="record.lastTesting" >{{ text }}</span>
            <span v-else >{{ '--' }}</span>
          </span>
          <span slot="devResult" slot-scope="text,record" :style="!record.selected ? 'opacity: 0.3;' : null">
            <span v-if="record.devResult==='UnKnow'" >{{ '--' }}</span>
            <div v-else :style="!record.selected ? 'opacity: 0.3;' : null">
              <span v-if="record.devResult==='Fail'" style="color: red " >{{ text }}</span>
              <span v-if="record.devResult==='Success'" style="color: green " >{{ text }}</span>
            </div>
          </span>
        </a-table>
      </div>
    </a-form>
    <div class="button-div" v-action:add>
      <a-button type="primary" style="bottom: 16px;width: 168px;left: 50%;position: fixed;bottom: 16px;" @click="nextStep()">Start</a-button>
    </div>
  </div>
</template>

<script>
import { adNetWorkList, createDevApp } from '@/api/sdk'
import AdNetwork from '@/components/Mediation/AdNetwork'

export default {
  name: 'Step1',
  components: {
    AdNetwork
  },
  data () {
    return {
      labelCol: { lg: { span: 5 }, sm: { span: 5 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      showInfo: true,
      loading: false,
      plat: 0,
      scroll: 500,
      data: [],
      curExpandedRowKeys: [],
      curExpandedRowData: {},
      pubAppId: this.$store.state.publisher.searchApp,
      statusArray: ['Fail', 'Success'],
      selectData: [],
      columns: [
        {
          title: 'Ad Network',
          dataIndex: 'className',
          width: '25%',
          scopedSlots: { customRender: 'className' }
        },
        {
          title: 'Last Testing',
          dataIndex: 'lastTesting',
          width: '25%',
          scopedSlots: { customRender: 'lastTesting' }
        },
        {
          title: 'Status',
          dataIndex: 'devResult',
          width: '25%',
          scopedSlots: { customRender: 'devResult' }
        },
        {
          title: 'Operations',
          dataIndex: 'status',
          width: '25%',
          scopedSlots: { customRender: 'status' }
        }
      ]
    }
  },
  mounted () {
    const params = {}
    this.scroll = window.innerHeight - 400
    params.pubAppId = this.pubAppId
    adNetWorkList(params).then(res => {
      if (res.data) {
        res.data.forEach(item => { item.selected = false })
        this.data = res.data
      }
    })
  },
  methods: {
    nextStep () {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i]['selected']) {
          this.selectData.push(this.data[i])
        }
      }
      if (this.selectData.length < 1) {
        this.$message.error('Please select one Ad NetWork ')
        return false
      }
      const item = {}
      const that = this
      item.pubAppId = this.pubAppId
      item.adnId = this.selectData[0].adnId
      createDevApp(item).then(res => {
        if (res.code === 0) {
          that.selectData[0].dveAppId = res.data.id
        }
      })
      if (this.selectData.length < 1) {
        this.$message.error('Please select one Ad NetWork ')
      } else {
        this.$emit('nextStep', this.selectData)
      }
    },
    handleSelect (record) {
      for (const item of this.data) {
        if (item.adnId === record.adnId) {
          item.selected = true
        } else {
          item.selected = false
        }
      }
    },
    handleUnselect (record) {
      record.selected = false
    }
  }
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;
  color: rgba(0,0,0,.45);

  h3 {
    margin: 0 0 12px;
    color: rgba(0,0,0,.45);
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    color: rgba(0,0,0,.45);
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
  .ant-col-19 {
    width: 500px;
  }
}
.button-div {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 32.36%, #ffffff 100%);
}
.ds-bottom{
  margin-top: 4px;
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 16px;
  -webkit-box-shadow: 0px 4px 10px rgba(221, 224, 228, 0.3), 0px 0px 4px rgba(221, 224, 228, 0.3);
  box-shadow: 0px 4px 10px rgba(221, 224, 228, 0.3), 0px 0px 4px rgba(221, 224, 228, 0.3);
  border-radius: 2px;
}
</style>
