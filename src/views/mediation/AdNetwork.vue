<!-- AdNetwork list page router '/mediation/adn/list' -->
<template>
  <div class="adnedit">
    <a-form :form="form" :hideRequiredMark="true">
      <a-card :bordered="false" class="ant-card-table-default" style="margin-top:48px;">
        <a-table
          ref="table"
          size="default"
          rowKey="id"
          :loading="loading"
          :columns="columns"
          :dataSource="data"
          :expandIconAsCell="false"
          :expandIconColumnIndex="-1"
          :expandedRowKeys="curExpandedRowKeys"
          :pagination="false"
          :scroll="{ y: scroll }"
        >
          <span slot="className" slot-scope="text, record">
            <ad-network
              style="max-width:120px;"
              :className="text"
              :id="record.id"
              :status="record.status"
            />
          </span>
          <span slot="reportapiStatus" slot-scope="text, record">
            <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
              <span v-if="text==='Running'" style="color:#18A81E;">
                {{ record.status===0? 'OFF' :text }}
              </span>
              <span v-else-if="text==='Delayed'" style="color:#FCA600;">
                {{ record.status===0? 'OFF' :text }}
              </span>
              <span v-else>
                {{ record.status===0? 'OFF' :text }}
              </span>
            </span>
          </span>
          <span slot="adTypes" slot-scope="text, record">
            <ad-type :status="record.status" :adTypes="text"/>
          </span>
          <span slot="instanceSize" slot-scope="text, record">
            <span :style="record.status===0 ? 'opacity: 0.3;' : null" >{{ text }}</span>
          </span>
          <span slot="status" slot-scope="text, record">
            <template>
              <span v-if="canEdit && !record.editStatus">
                <a @click="handleEdit(record)">Edit</a>
                <span v-if="record.adNetworkAppId && record.instanceSize > 0">
                  <a herf="#" @click="handleStatusEdit(record)" v-if="text===0 && record.instanceSize > 0"><a-divider v-if="record.adNetworkAppId" type="vertical" />{{ 'Enable' }}</a>
                  <a herf="#" @click="handleStatusEdit(record)" v-else><a-divider v-if="record.adNetworkAppId" type="vertical" />{{ 'Disable' }}</a>
                </span>
                <span v-if="record.adNetworkAppId">
                  <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                </span>
              </span>
              <span v-else-if="canEdit && record.editStatus">
                <a herf="#" @click="saveAdNetworkApp(record)">Save</a>
                <a-divider type="vertical" />
                <a herf="#" @click="cancel(record)">Cancel</a>
                <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
              </span>
              <span v-else>
                <span v-if="record.adNetworkAppId">
                  <a herf="#" @click="handleOpen(record)">Details</a>
                  <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                </span>
              </span>
            </template>
          </span>
          <p
            slot="expandedRowRender"
            slot-scope="record"
            rowKey="id"
          >
            <CreateNetWorkApp style="margin-top:24px;" v-if="record.expandStatus" :edit="record.editStatus" :id="record.id" />
            <a-form-item style="margin-bottom:16px;" v-action:edit :wrapperCol="{span: 10, offset: 10}">
              <a-button type="primary" @click="grantToken(record)" v-if="record.id === 2 && record.adNetworkAppId > 0 && record.editStatus">Token Grant</a-button>
            </a-form-item>
          </p>
        </a-table>
      </a-card>
    </a-form>
  </div>
</template>

<script>
import { adNetworkList, adNetworkAppStatusUpdate, admobGrantToken, adNetworkAppUpdate, adNetworkAppCreate } from '@/api/mediation'
import AdNetwork from '@/components/Mediation/AdNetwork'
import AdType from './modules/AdType'
import CreateNetWorkApp from './modules/CreateNetworkApp'

import { mapState } from 'vuex'

export default {
  name: 'TableList',
  components: {
    AdNetwork,
    AdType,
    CreateNetWorkApp
  },
  data () {
    return {
      data: [],
      scroll: 500,
      canEdit: this.$auth('adn.edit'),
      loading: false,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      form: this.$form.createForm(this),
      columns: [
        {
          title: 'Ad Network',
          dataIndex: 'className',
          // fixed: 'left',
          width: '15%',
          scopedSlots: { customRender: 'className' }
        },
        {
          title: 'Ad Units Supported',
          dataIndex: 'adTypes',
          width: '35%',
          scopedSlots: { customRender: 'adTypes' }
        },
        {
          title: 'Report API Status',
          dataIndex: 'reportapiStatus',
          width: '15%',
          scopedSlots: { customRender: 'reportapiStatus' }
        },
        {
          title: 'Instances',
          width: '10%',
          align: 'center',
          dataIndex: 'instanceSize',
          scopedSlots: { customRender: 'instanceSize' }
        },
        {
          title: 'Operations',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ]
    }
  },
  created () {
    this.scroll = window.innerHeight - 196
    if (this.searchApp) {
      this.searchTable()
    }
  },
  computed: mapState({
    visible: state => state.publisher.searchAppVisible,
    searchApp: state => state.publisher.searchApp
  }),
  watch: {
    searchApp (curVal) {
      this.searchTable()
    }
  },
  methods: {
    saveAdNetworkApp (record) {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          if (record.adNetworkAppId) {
            values.id = record.adNetworkAppId
            adNetworkAppUpdate(values).then(res => {
              if (res.code === 0) {
                this.handleOpen(record)
                this.searchTable()
                this.$message.success(`update success`)
              } else {
                this.$message.error(`update error`)
              }
            })
          } else {
            values.adnId = record.id
            values.pubAppId = this.$store.state.publisher.searchApp
            adNetworkAppCreate(values).then(res => {
              if (res.code === 0) {
                this.handleOpen(record)
                this.searchTable()
                record.adNetworkAppId = res.data.id
                this.$message.success(`create success`)
              } else {
                this.$message.error(`create error`)
              }
            })
          }
        }
      })
    },
    cancel (record) {
      this.handleOpen(record)
    },
    grantToken (record) {
      const params = { adnAppId: record.adNetworkAppId }
      admobGrantToken(params).then(res => {
        if (res.code === 0 && res.data) {
          window.open(res.data, 'newwindow', 'width=800, height=600')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleEdit (record) {
      if (!record.expandStatus) {
        this.form.resetFields()
      }
      record.editStatus = true
      if (!record.expandStatus) {
        this.handleOpen(record)
      }
    },
    handleOpen (record) {
      this.form.resetFields()
      const that = this
      record.expandStatus = !record.expandStatus
      this.currentExpandedStatOpen = !this.currentExpandedStatOpen
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(record.id)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
          record.editStatus = false
        } else {
          this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
          this.data.forEach(item => {
            if (item.id !== record.id) {
              item.expandStatus = false
              item.editStatus = false
            }
          })
          setTimeout(function () {
            that.curExpandedRowKeys.push(record.id)
            if (record.adNetworkAppId) {
              setTimeout(function () { that.form.setFieldsValue(record.adNetworkApp) }, 1)
            }
          }, 1)
        }
      } else {
        this.curExpandedRowKeys.push(record.id)
        if (record.adNetworkAppId) {
          setTimeout(function () { that.form.setFieldsValue(record.adNetworkApp) }, 1)
        }
      }
    },
    handleStatusEdit (record) {
      adNetworkAppStatusUpdate({ status: record.status === 0 ? 1 : 0, adNetworkAppId: record.adNetworkAppId })
        .then(res => {
          if (res.code === 0) {
            Object.assign(record, { status: record.status === 0 ? 1 : 0 })
            this.searchTable()
            this.$message.success(`update success`)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    searchTable () {
      this.loading = true
      adNetworkList({ pubAppId: this.searchApp })
        .then(res => {
          res.data.forEach(item => {
            item.editStatus = false
            item.expandStatus = false
          })
          this.data = res.data
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style type="less" scoped>
  .search {
    margin-right: 16px;
  }
  .disable-row {
    opacity: 0.3;
  }
  .adnedit >>> .ant-card-head-title {
    margin-left: -8px;
    margin-top: -6px;
  }
  .adnedit >>> .ant-card-head {
    height: 48px;
  }
  .adnedit >>> .tip {
    margin-top: 8px;
  }
  .adnedit >>> .ant-form-item {
    margin-bottom: 0;
  }
  .adnedit >>> .ant-form-explain, .ant-form-extra {
    line-height: 1.5;
    margin-bottom: -20px;
  }
</style>
