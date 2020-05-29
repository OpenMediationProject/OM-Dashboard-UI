<template>
  <div class="adnedit">
    <a-form :form="form" :hideRequiredMark="true">
      <a-row :gutter="48">
        <a-col>
          <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden',marginBottom: '8px' } || {} ">
            <a-button
              type="primary"
              :disabled="this.curExpandedRowKeys.length>0"
              v-action:add
              size="default"
              ghost
              @click="create">Add Ad Network Account</a-button>
          </span>
        </a-col>
      </a-row>
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
          <span slot="adnAccountName" slot-scope="text, record">
            <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
              <a-form-item size="small" v-if="record.editStatus">
                <a-input placeholder="Account Name" :maxlength="40" style="margin-top:0px;" v-decorator="['adnAccountName',{initialValue: record.adnAccountName, rules: [{ whitespace: true, required: true, validator: handleCheckName}] }]"/>
              </a-form-item>
              <span v-else :title="record.id">{{ text }}</span>
            </span>
          </span>
          <span slot="className" class="row-edit" slot-scope="text, record">
            <ad-network
              style="max-width:120px;"
              v-if="!record.createNew"
              :className="text"
              :id="record.id"
              :status="record.status"
            />
            <ADNSelect @change="adnChange" :name="'adnId'" style="max-width: 190px;" :defaultValue="record.adnId" v-else/>
          </span>
          <span slot="currency" class="row-edit" slot-scope="text, record">
            <span v-if="!record.editStatus" :style="record.status===0 ? 'opacity: 0.3;' : null" >{{ text }}</span>
            <CurrencySelect :status="record.status" :edit="true" :defaultValue="record.currency" v-else/>
          </span>
          <span slot="reportapiStatus" slot-scope="text, record">
            <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
              <span v-if="record.status===1 && !record.createNew" style="color:#18A81E;">
                Running
              </span>
              <span v-else-if="record.createNew" style="color:#18A81E;">
                --
              </span>
              <span v-else-if="record.status===0">
                OFF
              </span>
              <span v-else>
                Delayed
              </span>
            </span>
          </span>
          <span slot="status" slot-scope="text, record">
            <template>
              <span v-if="canEdit && !record.editStatus">
                <a @click="handleEdit(record)">Edit</a>
                <span>
                  <a herf="#" @click="handleStatusEdit(record)" v-if="text===0"><a-divider type="vertical" />{{ 'Enable' }}</a>
                  <a herf="#" @click="handleStatusEdit(record)" v-else><a-divider type="vertical" />{{ 'Disable' }}</a>
                </span>
                <a-popconfirm title="Are you really sure？" okText="Yes" cancelText="No" @confirm="remove(record)">
                  <a-divider type="vertical" />
                  <a herf="#">Remove</a>
                </a-popconfirm>
                <span>
                  <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                </span>
              </span>
              <span v-else-if="canEdit && record.editStatus">
                <a herf="#" @click="saveAccount(record)">Save</a>
                <a-divider type="vertical" />
                <a herf="#" @click="cancel(record)">Cancel</a>
                <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
              </span>
              <span v-else>
                <span>
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
            <NetworkAppAccount
              @admobAuth="admobAuth"
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
import { accountList, accountDelete, accountUpdate, accountCreate, googleTokenSave } from '@/api/account'
import AdNetwork from '@/components/Mediation/AdNetwork'
import NetworkAppAccount from './NetworkAppAccount'
import ADNSelect from './ADNSelect'
import CurrencySelect from '@/components/om/CurrencySelect'

import { mapState } from 'vuex'

export default {
  name: 'OrgAdNetwork',
  components: {
    AdNetwork,
    NetworkAppAccount,
    ADNSelect,
    CurrencySelect
  },
  data () {
    return {
      data: [],
      token: null,
      scroll: 500,
      canEdit: this.$auth('accounts.edit'),
      loading: false,
      currentAdn: 0,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      form: this.$form.createForm(this),
      count: -1,
      columns: [
        {
          title: 'Account Name',
          dataIndex: 'adnAccountName',
          width: '20%',
          scopedSlots: { customRender: 'adnAccountName' }
        },
        {
          title: 'Ad Network',
          dataIndex: 'className',
          width: '20%',
          scopedSlots: { customRender: 'className' }
        },
        {
          title: 'Currency',
          dataIndex: 'currency',
          width: '20%',
          scopedSlots: { customRender: 'currency' }
        },
        {
          title: 'Report API Status',
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
    // searchApp (curVal) {
    //   this.searchTable()
    // }
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
    handleCheckName (rule, value, callback) {
      if (!value) {
        callback(new Error('AccountName can not be empty.'))
      } else {
        if (this.inputLength(value) > 40) {
          callback(new Error('Characters longer than 40'))
        } else {
          callback()
        }
      }
    },
    create () {
      this.data.forEach(item => {
        item.expandStatus = false
        item.editStatus = false
      })
      this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
      const newItem = {
        id: this.count,
        adnAccountName: '',
        adnId: null,
        authType: 1,
        adnAccountId: 0,
        status: 1,
        createNew: true,
        expandStatus: false,
        editStatus: true,
        accountName: ''
      }
      this.data.unshift(newItem)
      this.handleOpen(newItem)
      this.count = this.count - 1
      this.$vnode.elm.querySelectorAll('.ant-table-body').forEach(node => {
        node.scrollTop = 0
      })
    },
    admobAuth () {
      let record = this.data.find(item => item.id === this.curExpandedRowKeys[0])
      const scope = 'https://www.googleapis.com/auth/adsense.readonly https://www.googleapis.com/auth/dfp'
      if (record && record.id > 0) {
        // eslint-disable-next-line no-undef
        gapi.load('auth2', _ => {
          // eslint-disable-next-line no-undef
          const GoogleAuth = gapi.auth2.init({
            client_id: '22744042822-iec4lvvm2vgqkshnom4jrv2opjel3kd5.apps.googleusercontent.com',
            fetch_basic_profile: false,
            scope: scope
          })
          GoogleAuth.grantOfflineAccess({
            scope: scope,
            prompt: 'select_account'
          }).then(resp => {
            if (resp.code) {
              const params = { accountId: record.id, authCode: resp.code }
              googleTokenSave(params).then(res => {
                if (res.code === 0) {
                  this.$emit('authSuccess', record.id)
                  this.$message.success('success')
                }
              })
            }
          })
        })
      } else {
        const { form: { validateFields } } = this
        validateFields((err, values) => {
          if (!err) {
            values.authType = this.aType
            if (record) {
              values.id = record.id
              values.adnAccountId = record.adnAccountId
            } else {
              values.adnAccountId = 0
            }
            values.adnId = 1
            accountCreate(values).then(res => {
              if (res.code === 0) {
                if (record) {
                  record = Object.assign(record, res.data)
                } else {
                  record = res.data
                }
                // eslint-disable-next-line no-undef
                gapi.load('auth2', _ => {
                  // eslint-disable-next-line no-undef
                  const GoogleAuth = gapi.auth2.init({
                    client_id: '22744042822-iec4lvvm2vgqkshnom4jrv2opjel3kd5.apps.googleusercontent.com',
                    fetch_basic_profile: false,
                    scope: scope
                  })
                  GoogleAuth.grantOfflineAccess({
                    scope: scope,
                    prompt: 'select_account'
                  }).then(resp => {
                    if (resp.code) {
                      const params = { accountId: record.id, authCode: encodeURIComponent(resp.code) }
                      googleTokenSave(params).then(res => {
                        if (res.code === 0) {
                          this.$emit('authSuccess', record.id)
                          this.$message.success('success')
                        }
                      })
                    }
                  })
                })
              }
            })
          }
        })
      }
    },
    authSuccess (accountId) {
      const record = this.data.find(item => item.id === accountId)
      this.handleOpen(record)
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
            accountCreate(values).then(res => {
              if (res.code === 0) {
                this.handleOpen(record)
                record = Object.assign(record, res.data)
                this.searchTable()
                this.$message.success(`success`)
              } else {
                this.$message.error(`create error`)
              }
            })
          } else {
            values.adnId = record.adnId
            accountUpdate(values).then(res => {
              if (res.code === 0) {
                record = Object.assign(record, res.data)
                this.handleOpen(record)
                this.searchTable()
                this.$message.success(`success`)
              } else {
                this.$message.error(`update error`)
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
          this.$message.success('Remove success')
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
      accountUpdate({ status: record.status === 0 ? 1 : 0, id: record.id, adnId: record.adnId, adnAccountId: record.adnAccountId })
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
            if (item.authKey) {
              item.authKeyUrl = 'http://publisher.adtiming.com/pubdev/report/callback/google/' + item.authKey
            }
            if (item.adNetworkApp && item.adNetworkApp.adnAppKey && (item.id === 12 || item.id === 15)) {
              const keys = item.adNetworkApp.adnAppKey.split('#')
              if (item.id === 12) {
                if (keys.length === 2) {
                  item.adNetworkApp.cb_left = keys[0]
                  item.adNetworkApp.cb_right = keys[1]
                } else {
                  item.adNetworkApp.cb_left = keys[0]
                }
              } else {
                if (keys.length === 2) {
                  item.adNetworkApp.mt_left = keys[0]
                  item.adNetworkApp.mt_right = keys[1]
                } else {
                  item.adNetworkApp.mt_left = keys[0]
                }
              }
            }
          })
          this.data = res.data
          this.arraySort(this.data)
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
