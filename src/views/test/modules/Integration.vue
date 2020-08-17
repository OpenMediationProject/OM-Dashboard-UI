<template>
  <a-spin :spinning="spinning" size="large">
    <a-form :form="form" :hideRequiredMark="true" style="margin-top:16px;text-align: center;margin-bottom: 16px;">
      <a-alert
        v-if="visible"
        message="Notice"
        style="text-align: left;margin-bottom: 16px;"
        type="info"
        showIcon
      >
        <span slot="description">
          Please notice that the Testing ONLY applies to devices that have been added to the Device list.<br>
          It may take 2-3 mins to make testing configuration effective. In the meantime, you need to kill your app in the background and reopen it.
        </span>
      </a-alert>
      <div style="background-color:#ffffff;margin-bottom:64px;">
        <a-table
          ref="table"
          class="ant-card-table-default"
          rowKey="className"
          fixed="true"
          :dataSource="data"
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
                <a herf="#" @click="handleUnselect(record)">End</a>
              </div>
              <div v-else>
                <a herf="#" @click="handleSelect(record)">Start</a>
              </div>
            </span>
          </span>
          <span slot="lastTesting" slot-scope="text, record" :style="!record.selected ? 'opacity: 0.3;' : null">
            <span v-if="record.lastTesting" >{{ format(text) }}</span>
            <span v-else >{{ '--' }}</span>
          </span>
          <span slot="endDate" slot-scope="text, record" :style="!record.selected ? 'opacity: 0.3;' : null">
            <span v-if="record.selected" >
              <a-statistic-countdown
                title=""
                :valueStyle="{fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)'}"
                :value="record.countdown"
                format="HH:mm:ss"
                @finish="handleUnselect(record)"
                style="margin-right: 50px"
              />
            </span>
            <span v-else >{{ '--' }}</span>
          </span>
        </a-table>
      </div>
    </a-form>
  </a-spin>
</template>

<script>
import { adNetWorkList, createDevApp, devAppGet, updateDevAppTestResult } from '@/api/sdk'
import AdNetwork from '@/components/Mediation/AdNetwork'
import moment from 'moment'

export default {
  name: 'Step1',
  components: {
    AdNetwork
  },
  data () {
    return {
      form: this.$form.createForm(this),
      showInfo: true,
      loading: false,
      plat: 0,
      data: [],
      spinning: true,
      moment,
      visible: false,
      curExpandedRowKeys: [],
      curExpandedRowData: {},
      pubAppId: this.$store.state.publisher.searchApp,
      statusArray: ['Fail', 'Success'],
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
          title: 'Countdown',
          dataIndex: 'devResult',
          width: '25%',
          scopedSlots: { customRender: 'endDate' }
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
    this.init()
  },
  methods: {
    format (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    init () {
      const params = {}
      params.pubAppId = this.pubAppId
      adNetWorkList(params).then(res => {
        if (res.data) {
          devAppGet({ pubAppId: this.$store.state.publisher.searchApp }).then(rv => {
            if (rv.data) {
              this.visible = true
              res.data.forEach(item => {
                if (item.adnId === rv.data.adnId) {
                  item.selected = true
                } else {
                  item.selected = false
                }
                if (item.lastTesting) {
                  item.lastTesting = moment(moment.utc(item.lastTesting)).local()
                  item.countdown = moment(item.lastTesting).add(1, 'hours')
                } else {
                  item.countdown = moment().add(1, 'hours')
                }
              })
            }
          })
          res.data.forEach(item => {
            item.selected = false
            if (!item.countdown) {
              item.countdown = moment().add(1, 'hours')
            }
          })
          this.data = res.data
        }
      }).finally(() => {
        this.spinning = false
      })
    },
    handleSelect (record) {
      for (const item of this.data) {
        if (item.adnId === record.adnId) {
          item.selected = true
        } else {
          if (item.selected) {
            this.handleUnselect(item)
          }
        }
      }
      const item = {}
      const that = this
      item.pubAppId = this.pubAppId
      item.adnId = record.adnId
      createDevApp(item).then(res => {
        that.init()
      })
    },
    handleUnselect (record) {
      this.visible = false
      record.selected = false
      const params = {}
      params.devResult = 1
      params.devAppId = record.dveAppId
      params.status = 0
      updateDevAppTestResult(params)
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
