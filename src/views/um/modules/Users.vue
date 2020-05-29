<!-- User Management Users tab -->
<template>
  <a-form :form="form" class="ummange" :hideRequiredMark="true" autocomplete="off">
    <a-row type="flex" justify="start">
      <AppSelectSimple />
      <a-form-item>
        <a-input size="default" placeholder="Email" autocomplete="off" style="width:200px;margin-left:8px;" v-decorator="['email']"/>
      </a-form-item>
      <RoleSelect style="margin-left: 8px" />
      <a-form-item>
        <a-button size="default" type="primary" style="margin-left:8px;width:100px;" ghost @click="searchTable">Apply</a-button>
      </a-form-item>
      <a-form-item v-if="canAdd" style="position:absolute; right:0;">
        <span class="table-page-search-submitButtons" >
          <a-button type="primary" size="default" :disabled="this.curExpandedRowKeys.length>0" @click="handleAddUser()">Add User</a-button>
        </span>
      </a-form-item>
    </a-row>
    <div style="background-color:#ffffff;">
      <a-table
        ref="table"
        rowKey="key"
        fixed="true"
        class="ant-card-table-default"
        :dataSource="data"
        :scroll="{ y: scroll }"
        :expandedRowKeys="curExpandedRowKeys"
        :columns="columns"
        :expandIconAsCell="false"
        :expandIconColumnIndex="-1"
        :pagination="false"
      >
        <span slot="status" slot-scope="text, record">
          <template>
            <div>
              <div v-if="record.expandStatus">
                <a herf="#" @click="handleUserSave(record)">Save</a>
                <a-divider type="vertical" />
                <a herf="#" v-if="record.roleId!==1 && record.roleId!==20 && currentUserRole===20" @click="handleAddUserApp(record)">Add App</a>
                <a-divider v-if="record.roleId!==1 && record.roleId!==20 && currentUserRole===20" type="vertical" />
                <a herf="#" @click="handleUserCancel(record)">Cancel</a>
                <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
              </div>
              <div v-else-if="record.createPassword">
                <a herf="#" @click="setPassword(record)">Save</a>
                <a-divider type="vertical" />
                <a herf="#" @click="handleUserCancel(record)">Cancel</a>
              </div>
              <div v-else>
                <div v-if="record.id === currentUserId === 1 && canEdit"> <!-- System Administrator -->
                  <a herf="#" @click="handlePassword(record)">Password</a>
                </div>
                <div v-else-if="record.id === currentUserId && canEdit">
                  <a herf="#" @click="handlePassword(record)">Password</a>
                </div>
                <div v-else-if="record.id === currentUserId && !canEdit">
                  <a herf="#" @click="handlePassword(record)">Password</a>
                </div>
                <div v-else-if="currentUserRole === 1">
                  <a herf="#" v-if="record.id !== 1" @click="handleUserEdit(record)">Edit</a>
                  <a-divider v-if="record.id !== 1" type="vertical" />
                  <a herf="#" v-if="record.id !== 1" @click="handlePassword(record)">Password</a>
                  <a-divider v-if="record.id !== 1" type="vertical" />
                  <a herf="#" v-if="record.id !== 1" @click="handelUserStatusUpdate(record)">{{ text===0?'Enable' : 'Disable' }}</a>
                  <a-divider v-if="record.id !== 1" type="vertical" />
                  <a-popconfirm v-if="record.id !== 1" title="Are you really sure？" okText="Yes" cancelText="No" @confirm="handleDelete(record)">
                    <a herf="#">Remove</a>
                  </a-popconfirm>
                  <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                </div>
                <div v-else>
                  <a herf="#" v-if="(!record.isPublisherOwner || currentUserId === 1) && canEdit" @click="handleUserEdit(record)">Edit</a>
                  <a-divider v-if="(!record.isPublisherOwner || currentUserId === 1) && canEdit" type="vertical" />
                  <a herf="#" v-if="!record.isPublisherOwner || currentUserId === 1 || record.id===currentUserId" @click="handlePassword(record)">Password</a>
                  <a-divider v-if="(!record.isPublisherOwner || currentUserId === 1) && canEdit" type="vertical" />
                  <a herf="#" v-if="(!record.isPublisherOwner || currentUserId === 1) && canEdit" @click="handelUserStatusUpdate(record)">{{ text===0?'Enable' : 'Disable' }}</a>
                  <a-divider v-if="(!record.isPublisherOwner || currentUserId === 1) && canEdit && record.id!== currentUserId" type="vertical" />
                  <a-popconfirm v-if="(!record.isPublisherOwner || currentUserId === 1) && canEdit && record.id!== currentUserId" title="Are you really sure？" okText="Yes" cancelText="No" @confirm="handleDelete(record)">
                    <a herf="#">Remove</a>
                  </a-popconfirm>
                  <span v-if="(!record.isPublisherOwner || currentUserId === 1) && canEdit">
                    <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                    <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                  </span>
                </div>
              </div>
            </div>
          </template>
        </span>
        <span slot="email" slot-scope="text, record">
          <template>
            <a-form-item v-if="record.expandStatus && canEdit">
              <a-input
                style="width:200px"
                placeholder="email"
                @input="selectEmail(record)"
                v-decorator="[record.id + 'email',{initialValue: record.email,rules: [{ required: true, message: 'Email can not be empty.' }, {
                  pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message: 'Incorrect mailbox format',
                }]}]"
              />
            </a-form-item>
            <span v-else :style="record.status===0 ? 'opacity: 0.3;' : null" >{{ text }}</span>
          </template>
        </span>
        <span slot="publisherName" slot-scope="text, record">
          <template>
            <a-form-item v-if="record.expandStatus && canEdit && record.roleId!==1">
              <OrgSelectSimple
                @change="orgChange(record)"
                :name="record.id + 'orgId'"
                :value="record.publisherId"
                :userId="record.id"
              />
            </a-form-item>
            <span v-else :style="record.status===0 ? 'opacity: 0.3;' : null">{{ text || '--' }}</span>
          </template>
        </span>
        <span slot="roleName" slot-scope="text, record">
          <template>
            <a-form-item v-if="record.expandStatus && canEdit && record.roleEdit">
              <RoleSelect
                @change="roleChange($event, record)"
                :name="record.id+'roleId'"
                :value="record.roleId"
              />
            </a-form-item>
            <span v-else :style="record.status===0 ? 'opacity: 0.3;' : null">{{ text }}</span>
          </template>
        </span>
        <a-table
          :ref="index+'table'"
          slot="expandedRowRender"
          slot-scope="record, index"
          rowKey="id"
          :columns="innerColumns"
          :dataSource="record.publisherApps"
          :pagination="false"
          v-show="record.roleId!==1 && record.roleId!==20"
          v-if="!record.createPassword"
        >
          <span slot="appName" slot-scope="text, item">
            <AppSelectSimple
              v-if="item.createNew"
              :name="item.id+'appId'"
              :userId="record.id"
              :publisherId="record.publisherId"
            />
            <om-app-info
              v-else
              :icon="item.icon"
              :app-name="item.appName"
              :app-id="item.appId"
              :plat="item.plat"
            />
          </span>
          <span slot="operation" slot-scope="text, item" v-if="record.expandStatus">
            <template>
              <div v-if="canEdit && currentUserRole===20">
                <a-popconfirm title="Are you really sure？" okText="Yes" cancelText="No" @confirm="handelAppDelete(item,record)">
                  <a herf="#">Remove</a>
                </a-popconfirm>
              </div>
            </template>
          </span>
        </a-table>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0 auto;text-align:center" v-else>
          <a-form-item
            :colon="false"
            label="New Password"
            style="margin-bottom: 16px;display: inline-flex;margin-left:53px;">
            <a-input
              type="password"
              style="width:300px;"
              autocomplete="new-password"
              v-decorator="[record.id+'password1',{initialValue: '',rules: [{ required: true, message: 'Password can not be empty.' }]}]"/>
          </a-form-item>
          <br>
          <a-form-item
            style="margin-bottom: 16px;display: inline-flex;"
            type="password"
            label="Confirm New Password"
            :colon="false">
            <a-input
              type="password"
              style="width:300px;"
              v-decorator="[record.id+'password2',{initialValue: '',rules: [{ required: true, message: 'Password can not be empty.' },{validator: compareToFirstPassword}]}]"/>
          </a-form-item>
        </p>
      </a-table>
    </div>
  </a-form>
</template>

<script>
import { userList, userAppDelete, userAppCreate, userUpdate, userCreate, userDelete, userGetEmail, passwordUpdate } from '@/api/usermanage'
import OmAppInfo from '@/components/om/AppInfo'
import AppSelectSimple from './AppSelectSimple'
import RoleSelect from '@/components/om/RoleSelect'
import OrgSelectSimple from '@/components/om/OrgSelectSimple'
import md5 from 'md5'

export default {
  name: 'UmUsers',
  components: {
    OmAppInfo,
    AppSelectSimple,
    RoleSelect,
    OrgSelectSimple
  },
  data () {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      name: '',
      currentUserId: this.$store.state.user.info.id,
      currentUserRole: this.$store.state.user.info.roleId,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      canAdd: this.$auth('um_users.add'),
      canEdit: this.$auth('um_users.edit'),
      number: -1,
      data: [],
      value: [],
      userCount: -100,
      appCount: -200,
      scroll: 500,
      columns: [
        {
          title: 'Email',
          dataIndex: 'email',
          width: '20%',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: 'Organizations',
          dataIndex: 'publisherName',
          width: '20%',
          scopedSlots: { customRender: 'publisherName' }
        },
        {
          title: 'Role',
          dataIndex: 'roleName',
          width: '20%',
          scopedSlots: { customRender: 'roleName' }
        },
        {
          title: 'Operations',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ],
      innerColumns: [
        {
          title: '',
          width: '20%'
        },
        { title: 'App', dataIndex: 'appName', width: '30%', key: 'appName', scopedSlots: { customRender: 'appName' } },
        {
          title: 'Operations',
          dataIndex: 'operation',
          key: 'operation',
          width: '30%',
          scopedSlots: { customRender: 'operation' }
        },
        {
          title: '',
          width: '20%'
        }
      ],
      tempObj: {}
    }
  },
  mounted () {
    this.scroll = window.innerHeight - 294
    this.searchTable()
  },
  methods: {
    searchTable () {
      const { form: { validateFields } } = this
      const params = {}
      if (validateFields) {
        validateFields((err, values) => {
          if (!err) {
            params.email = values['email']
            params.pubAppId = values['pubAppId']
            params.roleId = values['roleId']
            userList(params).then(res => {
              if (res.code === 0) {
                res.data.forEach(item => {
                  item.key = this.number
                  item.roleEdit = true
                  this.number--
                })
                this.arraySort(res.data)
                this.data = res.data
              }
            })
          }
        })
      }
    },
    // Clear app associations when switching organizations
    orgChange (record) {
      if (this.tempObj[record.id]) {
        record.publisherApps = this.tempObj[record.id]
      } else {
        this.tempObj[record.id] = [ ...record.publisherApps ]
        record.publisherApps.splice(0, record.publisherApps.length)
      }
    },
    roleChange (e, record) {
      record.roleId = e
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue(rule.field.replace('password2', 'password1'))) {
        callback(new Error('Two passwords that you enter is inconsistent!'))
      } else {
        callback()
      }
    },
    setPassword (record) {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          const params = { id: record.id }
          const password = values[record.id + 'password1']
          params.password = md5(password)
          passwordUpdate(params).then(res => {
            if (res.code === 0) {
              this.$message.success(`update success`)
              record.expandStatus = false
              record.createPassword = false
              this.handleOpen(record)
              this.searchTable()
            }
          })
        }
      })
    },
    handleUserSave (record) {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          const item = { ...record }
          const params = {}
          item.roleId = values[record.id + 'roleId']
          params.userId = record.id
          item.publisherId = values[record.id + 'orgId']
          if (record.createNew) {
            item.email = values[record.id + 'email']
            userCreate(item).then(res => {
              if (res.code === 0) {
                this.$message.success(`create User success`)
                this.handleOpen(item)
                record.expandStatus = false
                for (const app of record.publisherApps) {
                  const p = {}
                  p.userId = res.data.id
                  p.pubAppId = values[app.id + 'appId']
                  userAppCreate(p).then(res => {
                    app.createNew = false
                  })
                }
                this.searchTable()
              } else {
                this.$message.error(`create user error`)
              }
            })
          } else {
            userUpdate(item).then(res => {
              if (res.code === 0) {
                for (const app of record.publisherApps) {
                  if (app.createNew) {
                    const p = {}
                    p.userId = record.id
                    p.pubAppId = values[app.id + 'appId']
                    userAppCreate(p).then(res => {
                      app.createNew = false
                    })
                  }
                }
                this.$message.success(`update user success`)
                record.expandStatus = false
                this.handleOpen(item)
                this.searchTable()
              }
            })
          }
        }
      })
    },
    handleUserEdit (record) {
      record.editStatus = true
      record.createPassword = false
      this.handleOpen(record, true)
    },
    handleOpen (record, edit) {
      if (edit) {
        if (record.expandStatus) {
          return
        }
      }
      record['expandStatus'] = !record['expandStatus']
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(record.key)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
        } else {
          this.curExpandedRowKeys.push(record.key)
        }
      } else {
        this.curExpandedRowKeys.push(record.key)
      }
    },
    handlePassword (record) {
      record.createPassword = true
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(record.key)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
        } else {
          this.curExpandedRowKeys.push(record.key)
        }
      } else {
        this.curExpandedRowKeys.push(record.key)
      }
    },
    handleDelete (record) {
      const params = {}
      params.userId = record.id
      params.roleId = record.roleId
      params.publisherId = record.publisherId
      userDelete(params).then(res => {
        if (res.code === 0) {
          this.$message.success(`remove user success`)
          this.data.splice(this.data.findIndex(i => i.id === record.id), 1)
        } else {
          this.$message.error(`remove user error`)
        }
      })
    },
    handleUserCancel (record) {
      const newData = [...this.data]
      this.currentExpandedStatOpen = !this.currentExpandedStatOpen
      const chanceRow = newData.filter(item => record.key === item.key)[0]
      chanceRow['expandStatus'] = false
      chanceRow['editStatus'] = false
      chanceRow['createPassword'] = false
      this.data = newData
      this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
      if (record.createNew) {
        this.data.shift()
      }
    },
    handleAddUser () {
      const newItem = {
        publisherId: null,
        id: this.userCount,
        key: this.userCount,
        email: '',
        expandStatus: false,
        organizations: '',
        roleId: null,
        roleEdit: true,
        createNew: true,
        publisherApps: []
      }
      this.userCount--
      this.data.unshift(newItem)
      this.handleOpen(newItem)
    },
    handleAddUserApp (record) {
      const newItem = {
        id: this.appCount,
        appId: null,
        createNew: true
      }
      this.appCount--
      record.publisherApps.unshift(newItem)
    },
    handelAppDelete (item, record) {
      if (item.createNew) {
        record.publisherApps.splice(record.publisherApps.findIndex(i => i.id === item.id), 1)
        return
      }
      const params = { userId: record.id, pubAppId: item.id }
      userAppDelete(params)
        .then(res => {
          if (res.code === 0) {
            this.$message.success(`delete success`)
            record.publisherApps.splice(record.publisherApps.findIndex(i => i.id === item.id), 1)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    handelUserStatusUpdate (record) {
      const status = record.status === 0 ? 1 : 0
      userUpdate({ id: record.id, status })
        .then(res => {
          if (res.code === 0) {
            record.status = status
            this.arraySort(this.data)
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
    selectEmail (record) {
      const { form: { validateFields } } = this
      const params = {}
      if (validateFields) {
        validateFields((err, values) => {
          if (!err) {
            params.email = values[record.id + 'email']
            userGetEmail(params).then(res => {
              if (res.code === 0 && res.data) {
                record.roleName = res.data.roleName
                record.roleEdit = false
              } else {
                record.roleName = ''
                record.roleEdit = true
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style type="less" scoped>
  .ummange >>> .ant-form-item {
    margin-bottom: 4px;
  }
</style>
