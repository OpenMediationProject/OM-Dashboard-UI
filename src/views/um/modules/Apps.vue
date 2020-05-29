<!-- User Management Apps tab -->
<template>
  <a-form class="ummange" :form="form" :hideRequiredMark="true">
    <a-row type="flex" justify="start">
      <AppSelectSimple />
      <a-form-item>
        <a-input size="default" placeholder="Email" style="width:240px;margin-left:8px;" v-decorator="['email']"/>
      </a-form-item>
      <a-form-item>
        <a-button size="default" type="primary" style="margin-left:8px;margin-top:3px;width:100px;" ghost @click="search">Apply</a-button>
      </a-form-item>
    </a-row>
    <div style="background-color:#ffffff">
      <a-table
        ref="table"
        rowKey="id"
        fixed="true"
        class="ant-card-table-default"
        :loadding="loadding"
        :dataSource="data"
        :scroll="{ y: scroll }"
        :expandedRowKeys="curExpandedRowKeys"
        :columns="columns"
        :expandIconAsCell="false"
        :expandIconColumnIndex="-1"
        :pagination="false"
      >
        <span slot="name" slot-scope="text, record">
          <om-app-info
            :icon="record.icon"
            :app-name="record.appName"
            :app-id="record.appId"
            :plat="record.plat"
          />
        </span>
        <span slot="status" slot-scope="text, record">
          <a v-if="canEdit" herf="#" @click="handleAddUser(record)">Add User</a>
          <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
          <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
        </span>
        <a-table
          slot="expandedRowRender"
          :ref="index+ 'table'"
          slot-scope="record, index"
          rowKey="id"
          fixed="true"
          :dataSource="record.users"
          :columns="columnsUser"
          :pagination="false"
        >
          <span slot="option" slot-scope="text, item">
            <span v-if="item.createNew">
              <UserSelect :name="item.id+'userId'" :value="item.userId" :publisherId="record.publisherId"/>
            </span>
            <span v-else>{{ item.email }}</span>
          </span>
          <span slot="actions" slot-scope="text, item">
            {{ item.roleName }}
          </span>
          <span v-if="canEdit" slot="status" slot-scope="text, item">
            <span v-if="item.createNew" ><a herf="#" @click="addAppSave(item, record)">Save</a><a-divider type="vertical" /></span>
            <a-popconfirm title="Are you really sure？" okText="Yes" cancelText="No" @confirm="removeUser(item, record)">
              <a>Remove</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-table>
    </div>
  </a-form>
</template>

<script>
import { userAppDelete, userAppCreate, userAppList } from '@/api/usermanage'
import AppSelectSimple from './AppSelectSimple'
import OmAppInfo from '@/components/om/AppInfo'
import UserSelect from '@/components/om/UserSelect'

export default {
  name: 'UmApps',
  components: {
    AppSelectSimple,
    OmAppInfo,
    UserSelect
  },
  data () {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      canEdit: this.$auth('um_apps.edit'),
      name: '',
      count: -100,
      loadding: false,
      scroll: 500,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      data: [],
      columns: [
        {
          title: 'App',
          dataIndex: 'name',
          width: '80%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Operations',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ],
      columnsUser: [
        {
          title: '',
          width: '20%'
        },
        {
          title: 'User',
          dataIndex: 'title',
          width: '30%',
          scopedSlots: { customRender: 'option' }
        },
        {
          title: 'Role',
          width: '30%',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' }
        },
        {
          title: '',
          dataIndex: 'id',
          width: '15%',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '',
          dataIndex: 'pid'
        }
      ]
    }
  },
  mounted () {
    this.scroll = window.innerHeight - 294
    this.search()
  },
  methods: {
    search () {
      this.loadding = true
      let params = { userId: this.$store.state.user.info.id }
      params = Object.assign(params, this.form.getFieldsValue(['pubAppId', 'email']))
      userAppList(params).then(res => {
        if (res.code === 0) {
          this.data = res.data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    removeUser (item, record) {
      if (item.createNew) {
        record.users.splice(record.users.findIndex(i => i.id === item.id), 1)
      } else {
        const params = { pubAppId: record.id, userId: item.id }
        userAppDelete(params).then(res => {
          if (res.code === 0) {
            record.users.splice(record.users.findIndex(i => i.id === item.id), 1)
          }
        })
      }
    },
    addAppSave (item, record) {
      const params = { pubAppId: record.id }
      const itemForm = this.form.getFieldsValue([item.id + 'userId'])
      params.userId = itemForm[item.id + 'userId']
      if (record.users.findIndex(i => i.id === params.userId) > 0) {
        this.$message.error('User already exists')
        return false
      }
      userAppCreate(params).then(res => {
        if (res.code === 0) {
          item.id = res.data.userId
          item.createNew = false
          Object.assign(item, res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleOpen (record, edit) {
      if (edit) {
        if (record.expandStatus) {
          return
        }
      }
      record['expandStatus'] = !record['expandStatus']
      this.currentExpandedStatOpen = !this.currentExpandedStatOpen
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(record.id)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
        } else {
          this.curExpandedRowKeys.push(record.id)
        }
      } else {
        this.curExpandedRowKeys.push(record.id)
      }
    },
    handleAddUser (record) {
      this.handleOpen(record, 'edit')
      const newItem = {
        id: this.count,
        name: '',
        hbStatus: 0,
        createNew: true
      }
      this.count--
      record.users.unshift(newItem)
    }
  }
}
</script>

<style type="less" scoped>
  .ummange >>> .ant-form-item {
    margin-bottom: 4px;
  }
</style>
