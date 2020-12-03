<template>
  <div class="adnedit">
    <om-alert v-if="showAlert && canEdit" @click="alertClick" :message="alertInstance" />
    <a-alert
      v-if="useUnity"
      message="Update your Unity credentials"
      type="warning"
      show-icon
    >
      <div slot="description" style="padding-right:48px;">
        To continue receiving ad performance data for Unity in AdTiming, you will need to migrate to the new Monetization Stats API Key & add Organization core ID in API Key Management. <br>
        <ul style="list-style:disc;margin-left: -16px;">
          <li>You can retrieve the Monetization Stats API key from Unity Ads' Operate Dashboard. Select Ads Data Export > API Access on the left navigation bar, then copy the API key from the Monetization Stats API Access section, or click Create API key if none exists.</li>
          <li> The Organization core ID can be retrieved from the Settings tab of the Unity Ads' Operate Dashboard.</li>
        </ul>
      </div>
    </a-alert>
    <a-form :form="form" :hideRequiredMark="true">
      <a-row type="flex" justify="start" style="height: 8px;margin-top: 8px;">
        <a-form-item style="position:absolute; right:16px;">
          <a-button style="margin-left: 16px;" type="primary" size="default" ghost @click="editAccount">API Key Management</a-button>
        </a-form-item>
      </a-row>
      <a-card :bordered="false" class="ant-card-table-default" style="margin-top:40px;margin-bottom:16px;">
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
          <span slot="className" slot-scope="text, record">
            <ad-network
              style="max-width:120px;"
              :className="text"
              :id="record.id"
              :status="record.status"
            />
          </span>
          <span slot="accountStatus" slot-scope="text, record">
            <span :style="record.status===0 ? 'opacity: 0.3;' : null" >
              <span v-if="record.id === 0">
                --
              </span>
              <span v-else-if="record.status === 0 || text===0 || text===4 || !text">
                OFF
              </span>
              <span v-else-if="text===1" style="color:#18A81E;">
                Active
              </span>
              <span v-else-if="text===2" style="color:#D5432F;">
                <a-tooltip placement="bottom" :mouseEnterDelay="0.4" :mouseLeaveDelay="0.4">
                  <span slot="title">Exception Reason
                    <p style="margin-top: 8px;background-color: #F5F5F5; padding: 8px;">{{ record.reason }}</p></span>
                  Exception <img style="margin-top:-2px;" src="/icon/error.svg"/>
                </a-tooltip>
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
                <a v-if="record.id!== 19" :disabled="curExpandedRowKeys.length>0" @click="handleEdit(record)">Edit</a>
                <span v-if="record.adNetworkAppId || record.id === 19">
                  <a-divider v-if="record.id !== 19" type="vertical" />
                  <span>
                    <a :disabled="curExpandedRowKeys.length>0" @click="handleStatusEdit(record)" v-if="text===0">Enable</a>
                    <a :disabled="curExpandedRowKeys.length>0" @click="handleStatusEdit(record)" v-else>Disable</a>
                  </span>
                </span>
                <span v-if="record.adNetworkAppId && record.id !== 19">
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
                  <a @click="handleOpen(record)">Details</a>
                  <span>
                    <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                    <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                  </span>
                </span>
              </span>
            </template>
          </span>
          <div
            slot="expandedRowRender"
            slot-scope="record"
            rowKey="id"
          >
            <AdnAppEdit
              @authSuccess="authSuccess"
              style="margin-top:24px;"
              :form="form"
              v-if="record.expandStatus"
              :edit="record.editStatus"
              :id="record.id"
              :accounts="record.accounts"
              @accountType="accountType"
              @accountSelect="accountSelect"
              :record="record.adNetworkApp" />
          </div>
        </a-table>
      </a-card>
    </a-form>
  </div>
</template>

<script>
import { adNetworkList, adNetworkAppStatusUpdate, adNetworkAppUpdate, adNetworkAppCreate } from '@/api/mediation'
import { accountCreate, accountList } from '@/api/account'
import { placementGet } from '@/api/publisher'
import { OmAlert } from '@/components'
import AdNetwork from '@/components/Mediation/AdNetwork'
import AdType from '@/views/mediation/modules/AdType'
import { mapState } from 'vuex'
import AdnAppEdit from '@/views/adn/AdnAppEdit'

export default {
  name: 'AdNetworkIndex',
  components: {
    AdnAppEdit,
    AdNetwork,
    AdType,
    OmAlert
  },
  data () {
    const id = this.$store.state.publisher.currentOrgId
    return {
      id,
      data: [],
      accountTab: '1',
      curAccountId: null,
      scroll: 500,
      canEdit: this.$auth('app_settings.edit'),
      loading: false,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      form: this.$form.createForm(this),
      showAlert: false,
      alertInstance: {
        title: 'Your Ad Network is Ready.',
        content: 'Next steps：Setup an Instance to Monitize',
        button: 'Setup Instance'
      },
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
          dataIndex: 'accountStatus',
          width: '20%',
          scopedSlots: { customRender: 'accountStatus' }
        },
        {
          title: 'Instances',
          width: '14%',
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
    searchApp: state => state.publisher.searchApp,
    isNgp: state => state.user.info.isNgp,
    useUnity: state => state.publisher.useUnity
  }),
  watch: {
    searchApp (curVal) {
      this.searchTable()
    }
  },
  methods: {
    alertClick () {
      localStorage.setItem('isnew_plc', this.$route.query.newplc)
      placementGet({ placementId: this.$route.query.newplc })
        .then(res => {
          if (res.data) {
            this.$store.commit('SET_PLACEMENT', res.data)
            this.$router.push({
              path: '/mediation/mediation/list',
              query: { newplc: this.$route.query.newplc }
            })
          }
        })
    },
    editAccount () {
      this.$router.push({ path: '/adn/account' })
    },
    accountType (v) {
      this.accountTab = v
    },
    accountSelect (v) {
      this.curAccountId = v
    },
    authSuccess (accountId) {
      const record = this.data.find(item => item.id === 2)
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          values.adnId = 2
          if (record.id === 2 && !values.adnAppId) {
            values.authType = 1
          } else {
            values.authType = 2
          }
          values.reportAccountId = accountId
          if (record.adNetworkAppId) {
            values.id = record.adNetworkAppId
            adNetworkAppUpdate(values).then(res => {
              if (res.code === 0) {
                this.handleOpen(record)
                this.searchTable()
                this.$message.success(this.$msg('appsettings.update_success'))
              }
            })
          } else {
            values.adnId = record.id
            values.pubAppId = this.$store.state.publisher.searchApp
            values.status = 1
            adNetworkAppCreate(values).then(res => {
              if (res.code === 0) {
                this.handleOpen(record)
                record.adNetworkAppId = res.data.id
                this.searchTable()
                if (this.$route.query.newplc) {
                  this.showAlert = true
                  document.documentElement.scrollTop = 0
                }
                this.$message.success(this.$msg('appsettings.create_success'))
              }
            })
          }
        }
      })
    },
    saveAdNetworkApp (record) {
      const { form: { validateFields } } = this
      const _this = this
      validateFields(async (err, values) => {
        if (!err) {
          if ([12, 14, 17, 18].includes(record.id) && values['cb_left']) {
            values.adnAppKey = values['cb_left'].trim() + '#' + values['cb_right'].trim()
          }
          if (_this.accountTab === '2' && ![3, 6].includes(record.id) && !_this.curAccountId) {
            this.$notification.warning({
              message: 'Error',
              description: 'Please Select An API Key.'
            })
            return false
          }
          if (_this.accountTab === '2') {
            values.reportAccountId = _this.curAccountId
          }
          if (!values.reportAccountId && ![3, 6].includes(record.id)) {
            values.adnId = record.id
            if (record.id === 2 && !values.adnAppId) {
              values.authType = 1
            } else {
              values.authType = 2
            }
            values.adnAccountId = 0
            if (values.adnId === 2 && values.authType === 1 && !values.userId) {
              this.$message.error('Please Sign in with Google first')
              return false
            }
            const accountRes = await accountCreate(values)
            if (accountRes.data) {
              values.reportAccountId = accountRes.data.id
            }
          }
          values.adnId = record.id
          if (values.adnAppKey) {
            values.adnAppKey = values.adnAppKey.trim()
          }
          if (values.refreshToken) {
            values.refreshToken = values.refreshToken.trim()
          }
          if (record.adNetworkAppId) {
            values.id = record.adNetworkAppId
            values.status = 1
            adNetworkAppUpdate(values).then(res => {
              if (res.code === 0) {
                this.handleOpen(record)
                this.searchTable()
                if (this.$route.query.newplc) {
                  this.showAlert = true
                  document.documentElement.scrollTop = 0
                }
                this.$message.success(this.$msg('appsettings.update_success'))
              }
            })
          } else {
            values.adnId = record.id
            values.pubAppId = this.$store.state.publisher.searchApp
            values.status = 1
            adNetworkAppCreate(values).then(res => {
              if (res.code === 0) {
                this.handleOpen(record)
                record.adNetworkAppId = res.data.id
                this.searchTable()
                if (this.$route.query.newplc) {
                  this.showAlert = true
                  document.documentElement.scrollTop = 0
                }
                this.$message.success(this.$msg('appsettings.create_success'))
              }
            })
          }
        }
      })
    },
    cancel (record) {
      this.handleOpen(record)
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
      adNetworkAppStatusUpdate({ status: record.status === 0 ? 1 : 0, adNetworkAppId: record.adNetworkAppId, adnId: record.id, pubAppId: this.searchApp })
        .then(res => {
          if (res.code === 0) {
            Object.assign(record, { status: record.status === 0 ? 1 : 0 })
            this.searchTable()
            this.$message.success(this.$msg('appsettings.update_success'))
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    searchTable () {
      this.loading = true
      const _this = this
      adNetworkList({ pubAppId: this.searchApp })
        .then(res => {
          if (res.data) {
            res.data.forEach(item => {
              item.editStatus = false
              item.expandStatus = false
              if (item.adNetworkApp && item.adNetworkApp.reportAccountId === 0) {
                item.adNetworkApp.reportAccountId = null
              }
              if (item.adNetworkApp && item.adNetworkApp.adnAppKey && [12, 14, 17, 18].includes(item.id)) {
                const keys = item.adNetworkApp.adnAppKey.split('#')
                if ([12, 14, 17, 18].includes(item.id)) {
                  if (keys.length === 2) {
                    item.adNetworkApp.cb_left = keys[0]
                    item.adNetworkApp.cb_right = keys[1]
                  } else {
                    item.adNetworkApp.cb_left = keys[0]
                  }
                }
              }
            })
            this.data = res.data
            this.$store.commit('SET_USEUNITY', false)
            if (_this.$store.state.user.info.userType === 0) {
              const temp = res.data.filter(row => row.status === 1 && row.id === 4 && row.adNetworkAppId > 0)
              if (temp.length === 0) {
                return
              }
              // check Unity
              accountList()
                .then(r => {
                  r.data.filter(item => {
                    return item.adnId === 4
                  }).forEach(row => {
                    if (!row.userId) {
                      this.$store.commit('SET_USEUNITY', true)
                    }
                  })
                })
            }
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
  .adnedit >>> .ant-divider {
    height: 1px;
  }
  .adnedit >>> .ant-table-expanded-row td {
    padding: 16px 16px 0 16px;
  }
</style>
