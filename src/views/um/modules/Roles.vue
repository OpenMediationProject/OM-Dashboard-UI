<!-- User Management Roles tab -->
<template>
  <a-table
    ref="table"
    rowKey="id"
    class="ant-card-table-default"
    fixed="true"
    :loadding="loadding"
    :dataSource="data"
    :expandedRowKeys="curExpandedRowKeys"
    :columns="columns"
    :scroll="{ y: scroll }"
    :expandIconAsCell="false"
    :expandIconColumnIndex="-1"
    :pagination="false"
  >
    <span slot="status" slot-scope="text, record">
      <a herf="#" v-if="canEdit" @click="handleOpen(record)">Edit</a>
      <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
      <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
    </span>
    <a-table
      class="prem-table"
      slot="expandedRowRender"
      :ref="index+ 'table'"
      slot-scope="record, index"
      rowKey="id"
      fixed="true"
      :dataSource="record.permissions"
      :columns="columnsPage"
      :pagination="false"
    >
      <span slot="actions" slot-scope="text, item">
        <span v-if="canEdit">
          <span :style="text.includes('add')? null: 'opacity: 0.3;'"><a @click="rulePremUpdate('add', item, record.id)">Add</a></span><a-divider type="vertical" />
          <span :style="text.includes('edit')? null: 'opacity: 0.3;'"><a @click="rulePremUpdate('edit', item, record.id)">Edit</a></span><a-divider type="vertical" />
          <span :style="text.includes('view')? null: 'opacity: 0.3;'"><a @click="rulePremUpdate('view', item, record.id)">View</a></span><a-divider type="vertical" />
          <span :style="item.actions.length > 0 ? 'opacity: 0.3;' : null "><a @click="rulePremUpdate('none', item, record.id)">None</a></span>
        </span>
        <span v-else>
          <span :style="text.includes('add')? null: 'opacity: 0.3;'">Add</span><a-divider type="vertical" />
          <span :style="text.includes('edit')? null: 'opacity: 0.3;'">Edit</span><a-divider type="vertical" />
          <span :style="text.includes('view')? null: 'opacity: 0.3;'">View</span><a-divider type="vertical" />
          <span :style="item.actions.length > 0 ? 'opacity: 0.3;' : null ">None</span>
        </span>
      </span>
    </a-table>
  </a-table>
</template>

<script>
import { userRoleList, userRolePermissionDelete, userRolePermissionCreate } from '@/api/usermanage'

export default {
  name: 'Roles',
  components: {
  },
  data () {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 19 }, sm: { span: 19 } },
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      currentStep: 0,
      name: '',
      queryParam: {},
      scroll: 500,
      loadding: false,
      curExpandedRowKeys: [],
      curExpandedRowData: {},
      currentExpandedStatOpen: false,
      canEdit: this.$auth('um_roles.edit'),
      data: [],
      value: [],
      columns: [
        {
          title: 'Role',
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
      columnsPage: [
        {
          title: '',
          width: '25%'
        },
        {
          title: 'Page',
          dataIndex: 'title',
          width: '30%',
          scopedSlots: 'title'
        },
        {
          title: 'Permissions',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' }
        }
      ]
    }
  },
  mounted () {
    this.scroll = window.innerHeight - 294
    this.loadding = true
    userRoleList().then(res => {
      if (res.code === 0) {
        this.data = res.data
      }
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    rulePremUpdate (action, record, ruleId) {
      const index = record.actions.indexOf(action)
      const params = { roleId: ruleId, permissionName: record.name, permissionType: action }
      if (action === 'none') {
        if (!record.actions.length) {
          return false
        }
        userRolePermissionDelete(params).then(res => {
          if (res.code === 0) {
            record.actions.splice(0, record.actions.length)
          }
        })
      } else if (index > -1) {
        if (action === 'view') {
          params.permissionType = 'none'
        }
        userRolePermissionDelete(params).then(res => {
          if (res.code === 0) {
            if (action === 'view') {
              record.actions.splice(0, record.actions.length)
            } else {
              record.actions.splice(index, 1)
            }
          }
        })
      } else {
        userRolePermissionCreate(params).then(res => {
          if (res.code === 0) {
            if (action === 'edit' || action === 'add' && !record.actions.includes('view')) {
              record.actions.push('view')
            }
            record.actions.push(action)
          }
        })
      }
    },
    handleOpen (record) {
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
    handleSceneCancel (record) {
      const newData = [...this.data]
      if (this.curExpandedRowData.id) {
        this.currentExpandedStatOpen = !this.currentExpandedStatOpen
        const chanceRowKey = this.curExpandedRowData.id
        const chanceRow = newData.filter(item => chanceRowKey === item.id)[0]
        chanceRow['expandStatus'] = false
        this.data = newData
        this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
        this.curExpandedRowData = {}
        if (record.createNew) {
          this.data.shift()
        }
      }
    },
    rolePremissionCreate (record) {
      userRolePermissionCreate(record).then(res => {
        if (res.code === 0) {
          record = res.data
        }
      })
    },
    rolePremissionDelete (record) {
      userRolePermissionDelete(record).then(res => {
        if (res.code === 0) {
          record = res.data
        }
      })
    }
  }
}
</script>

<style type="less" scoped>
.prem-table >>> a {
  color:rgba(0, 0, 0, 0.65);
}
</style>
