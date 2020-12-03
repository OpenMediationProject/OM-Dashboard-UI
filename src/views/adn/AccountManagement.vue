<template>
  <div class="adnedit">
    <OmPageAction :confirm="false" :canEdit="true"/>
    <a-form :form="form" :hideRequiredMark="true">
      <a-card :bordered="false" class="ant-card-table-default">
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
        >
          <span slot="appIcons" class="row-edit" slot-scope="text,record" :style="record.status===0 || record.status === 2 ? 'opacity: 0.3;' : null">
            <img style="width: 20px;margin: 2px;" v-for="(vv) in text" :src="vv" :key="vv"/>
            <span v-if="!text.length || text[0]===''">--</span>
          </span>
          <span slot="className" class="row-edit" slot-scope="text, record">
            <ad-network
              style="max-width:120px;"
              v-if="!record.createNew"
              :className="text"
              :id="record.id"
              :status="record.status===0 || record.status === 2 ? 0:1"
            />
            <ADNSelect @change="adnChange" :name="'adnId'" style="max-width: 190px;" :defaultValue="record.adnId" v-else/>
          </span>
          <span slot="currency" class="row-edit" slot-scope="text, record">
            <span v-if="!record.editStatus" :style="record.status===0 || record.status === 2 ? 'opacity: 0.3;' : null" >{{ text }}</span>
            <CurrencySelect :status="record.status" :edit="true" :defaultValue="record.currency" v-else/>
          </span>
          <span slot="reportapiStatus" slot-scope="text, record">
            <span :style="record.status===0 || record.status === 2 ? 'opacity: 0.3;' : null" >
              <span v-if="record.createNew" style="color:#18A81E;">
                --
              </span>
              <span v-else-if="record.status===1" style="color:#18A81E;">
                Active
              </span>
              <span v-else-if="record.status===0 || record.status===4">
                OFF
              </span>
              <span v-else-if="record.status===2" style="color: #D5432F;">
                <a-tooltip placement="bottom" :mouseEnterDelay="0.4" :mouseLeaveDelay="0.4">
                  <span slot="title">Exception Reason
                    <p style="margin-top: 8px;background-color: #F5F5F5; padding: 8px;">{{ record.reason }}</p></span>
                  Exception <img style="margin-top:-2px;" src="/icon/error.svg"/>
                </a-tooltip>
              </span>
              <span v-else-if="record.status===-1" style="color: #D5432F;">
                Verifying
              </span>
            </span>
          </span>
          <span slot="status" slot-scope="text, record">
            <template>
              <span v-if="canEdit && !record.editStatus">
                <a @click="handleEdit(record)">Edit</a>
                <span v-if="record.status!==-1">
                  <a @click="handleStatusEdit(record)" v-if="text===0 || text=== 2"><a-divider type="vertical" />{{ 'Enable' }}</a>
                  <a @click="handleStatusEdit(record)" v-else><a-divider type="vertical" />{{ 'Disable' }}</a>
                </span>
                <a-popconfirm v-if="record.status!==-1" title="Are you really sure？" okText="Yes" cancelText="No" @confirm="remove(record)">
                  <a-divider type="vertical" />
                  <a>Remove</a>
                </a-popconfirm>
                <span>
                  <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                </span>
              </span>
              <span v-else-if="canEdit && record.editStatus">
                <a @click="saveAccount(record)">Save</a>
                <a-divider type="vertical" />
                <a @click="cancel(record)">Cancel</a>
                <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
              </span>
              <span v-else>
                <span>
                  <a @click="handleOpen(record)">Details</a>
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
            <AccountEdit
              :currency-form="false"
              @authSuccess="authSuccess"
              style="margin-top:24px;"
              v-if="record.expandStatus"
              :adnAppId="record.adnId"
              :create="record.createNew"
              :accountId="record.id"
              :record="record"
              :authType="record.authType"
              :edit="record.editStatus"
              :form="form"
              :id="currentAdn" />
          </p>
        </a-table>
      </a-card>
      <div style="height:16px;"></div>
    </a-form>
  </div>
</template>

<script>
import { accountList, accountDelete, accountUpdate, accountCreate } from '@/api/account'
import AdNetwork from '@/components/Mediation/AdNetwork'
import AccountEdit from './AccountEdit'
import ADNSelect from './ADNSelect'
import CurrencySelect from '@/components/om/CurrencySelect'
import OmPageAction from '@/components/OmPageAction'

import { mapState } from 'vuex'

export default {
  name: 'AccountManagement',
  components: {
    AdNetwork,
    AccountEdit,
    ADNSelect,
    CurrencySelect,
    OmPageAction
  },
  data () {
    return {
      data: [],
      token: null,
      scroll: 500,
      canEdit: this.$auth('adn.edit'),
      loading: false,
      currentAdn: 0,
      defaultOpenId: this.$route.query.id,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      form: this.$form.createForm(this),
      count: -1,
      columns: [
        {
          title: 'Ad Network',
          dataIndex: 'className',
          width: '20%',
          scopedSlots: { customRender: 'className' }
        },
        {
          title: 'Apps',
          dataIndex: 'appIcons',
          width: '20%',
          scopedSlots: { customRender: 'appIcons' }
        },
        {
          title: 'Currency',
          dataIndex: 'currency',
          width: '20%',
          scopedSlots: { customRender: 'currency' }
        },
        {
          title: 'Status',
          dataIndex: 'reportapiStatus',
          width: '20%',
          scopedSlots: { customRender: 'reportapiStatus' }
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
    this.scroll = window.innerHeight - 268
    this.searchTable()
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
    adnChange (val) {
      this.currentAdn = val.id
    },
    inputLength (value) {
      let len = 0
      for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127 || value.charCodeAt(i) === 94) {
          len += 2
        } else {
          len++
        }
      }
      return len
    },
    authSuccess (accountId) {
      const record = this.data.find(item => item.id === accountId)
      if (this.curExpandedRowKeys.length && this.curExpandedRowKeys[0] < 0) {
        this.curExpandedRowKeys = []
        this.currentExpandedStatOpen = false
        record.editStatus = false
        record.expandStatus = false
      } else {
        this.handleOpen(record)
      }
      this.searchTable()
    },
    saveAccount (record) {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          values.authType = record.authType
          values.id = record.id
          values.adnAccountId = record.adnAccountId
          if (values.adnAppToken) {
            values.adnAppToken = values.adnAppToken.trim()
          }
          if (values.refreshToken) {
            values.refreshToken = values.refreshToken.trim()
          }
          if (values.adnApiKey) {
            values.adnApiKey = values.adnApiKey.trim()
          }
          if (values.userSignature) {
            values.userSignature = values.userSignature.trim()
          }
          if (values.userId) {
            values.userId = values.userId.trim()
          }
          if (record.createNew) {
            if (values.authType === 1 && values.adnId === 2 && !values.userId) {
              this.$message.error('Please Sign in with Google first')
              return false
            }
            accountCreate(values).then(res => {
              if (res.code === 0) {
                this.handleOpen(record)
                record = Object.assign(record, res.data)
                this.searchTable()
                this.$message.success(this.$msg('account.create_success'))
              }
            })
          } else {
            values.adnId = record.adnId
            if (record.status === 2) {
              values.status = 1
            }
            if (values.authType === 1 && record.adnId === 2 && !values.userId) {
              this.$message.error('Please Sign in with Google first')
              return false
            }
            if (record.adnId === 2 && values.authType === 1) {
              values.adnAppToken = record.adnAppToken
            }
            accountUpdate(Object.assign(record, values)).then(res => {
              if (res.code === 0) {
                record = Object.assign(record, res.data)
                this.handleOpen(record)
                this.searchTable()
                this.$message.success(this.$msg('account.update_success'))
              }
            })
          }
        }
      })
    },
    cancel (record) {
      if (record.createNew) {
        this.data.splice(this.data.findIndex(item => item.id === record.id), 1)
      }
      this.handleOpen(record)
    },
    remove (record) {
      accountDelete({ accountId: record.id }).then(res => {
        if (res.code === 0) {
          this.searchTable()
          this.$message.success(this.$msg('account.remove_success'))
        }
      })
    },
    handleEdit (record) {
      if (!record.expandStatus) {
        this.form.resetFields()
      }
      const that = this
      if (record.expandStatus) {
        setTimeout(function () {
          setTimeout(function () { that.form.setFieldsValue(record) }, 1)
        }, 1)
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
          this.currentAdn = 0
          record.editStatus = false
          if (record.createNew) {
            const i = this.data.findIndex(item => item.id === record.id)
            if (i > -1) {
              this.data.splice(this.data.findIndex(item => item.id === record.id), 1)
            }
          }
        } else {
          this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
          this.data.forEach(item => {
            if (item.id !== record.id) {
              item.expandStatus = false
              item.editStatus = false
            }
          })
          this.currentAdn = record.adnId
          setTimeout(function () {
            that.curExpandedRowKeys.push(record.id)
            setTimeout(function () { that.form.setFieldsValue(record) }, 1)
          }, 1)
        }
      } else {
        this.curExpandedRowKeys.push(record.id)
        this.currentAdn = record.adnId
        setTimeout(function () { that.form.setFieldsValue(record) }, 1)
      }
    },
    handleStatusEdit (record) {
      accountUpdate({ status: record.status !== 1 ? 1 : 0, id: record.id, adnId: record.adnId, adnAccountId: record.adnAccountId })
        .then(res => {
          if (res.code === 0) {
            Object.assign(record, { status: record.status === 0 ? 1 : 0 })
            this.searchTable()
            this.$message.success(this.$msg('account.update_success'))
          }
        })
    },
    arraySort (list) {
      list = list.sort((a, b) => {
        if (a.status === b.status) {
          return b.createTime - a.createTime
        } else {
          return b.status - a.status
        }
      })
    },
    searchTable () {
      this.loading = true
      accountList()
        .then(res => {
          res.data.forEach(item => {
            item.editStatus = false
            item.expandStatus = false
          })
          this.data = res.data
          this.arraySort(this.data)
          if (this.defaultOpenId) {
            const o = this.data.find(row => row.id === parseInt(this.defaultOpenId))
            this.handleEdit(o)
          }
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
  .adnedit {
    margin-top: 16px;
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
