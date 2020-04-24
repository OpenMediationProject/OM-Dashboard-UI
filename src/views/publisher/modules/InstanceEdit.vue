<!-- Instances tab -->
<template>
  <a-form :form="form" :hideRequiredMark="true">
    <div class="adnedit">
      <a-row type="flex" justify="start" style="height: 44px;margin-top: 7px;">
        <om-instance-select ref="insselect" :placementId="id" style="margin-left:8px;"/>
        <a-form-item>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" style="margin-right:8px;margin-left:8px;" ghost @click="listSearch">Apply</a-button>
          </span>
        </a-form-item>
        <a-form-item v-action:edit style="position:absolute; right:24px;">
          <span class="table-page-search-submitButtons" >
            <a-button type="primary" ghost @click="instanceAdd">Add Instance</a-button>
          </span>
        </a-form-item>
      </a-row>
      <a-card :bordered="false" style="padding-left:8px;padding-right:24px;">
        <a-table
          class="ant-card-table-default-noshadow"
          style="margin-top:8px;"
          ref="table"
          rowKey="id"
          :scroll="{ y: scroll }"
          :dataSource="data"
          :loading="loading"
          :expandedRowKeys="curExpandedRowKeys"
          :columns="columns"
          :expandIconAsCell="false"
          :expandIconColumnIndex="-1"
          :pagination="false"
        >
          <p slot="expandedRowRender" class="expand-row" slot-scope="record" :rowKey="record.id" style="margin: 0">
            <CreateNetWorkApp v-if="currentAdn && record.editStatus" style="margin-top:24px;" :id="currentAdn.id" />
            <a-divider v-if="currentAdn && record.editStatus"></a-divider>
            <a-form-item
              label="Header Bidding"
              :colon="false"
              style="margin-bottom: 0px;"
              :labelCol="{lg: { span: 8 }, sm: { span: 8 }}"
              :wrapperCol="{lg: { span: 8 }, sm: { span: 8 } }">
              <a-checkbox
                :disabled="!record.editStatus"
                size="small"
                :defaultChecked="record.hbStatus? true: false"
                v-decorator="[record.id+'hbStatus']"
              />
            </a-form-item>
            <a-form-item
              label="Frequency Cap"
              :colon="false"
              style="margin-bottom: 0px;"
              :labelCol="{lg: { span: 8 }, sm: { span: 8 }}"
              :wrapperCol="{lg: { span: 8 }, sm: { span: 8 } }">
              Limit to <a-input-number
                type="number"
                size="small"
                :min="0"
                :disabled="!record.editStatus"
                :max="9999"
                style="width:66px;"
                v-decorator="[record.id+'frequencyCap',{initialValue: record.frequencyCap}]"/> impressions per
              <a-input-number
                type="number"
                size="small"
                :disabled="!record.editStatus"
                :min="1"
                :max="24"
                style="width:50px;"
                v-decorator="[record.id+'frequencyUnit',{initialValue: record.frequencyUnit}]"/> hour(s)
            </a-form-item>
            <a-form-item
              style="margin-bottom: 0px;"
              label="Pacing"
              :colon="false"
              :labelCol="{lg: { span: 8 }, sm: { span: 8 }}"
              :wrapperCol="{lg: { span: 8 }, sm: { span: 8 } }">
              Show a maximun ad 1ad per <a-input-number
                type="number"
                :disabled="!record.editStatus"
                size="small"
                :min="0"
                :max="1440"
                style="width:66px;"
                v-decorator="[record.id+'frequencyInterval',{initialValue: record.frequencyInterval}]"/> minute(s)
            </a-form-item>
            <a-form-item
              style="margin-bottom: 0px;"
              label="Device Brand"
              :colon="false"
              :labelCol="{lg: { span: 8 }, sm: { span: 8 }}"
              :wrapperCol="{lg: { span: 8 }, sm: { span: 8 } }">
              <a-input-group compact style="margin-top:6px;">
                <a-select :disabled="!record.editStatus" v-decorator="[record.id+'brandType',{initialValue: record.brandType || 'include'}]" style="width: 100px" >
                  <a-select-option value="include">include</a-select-option>
                  <a-select-option value="exclude">exclude</a-select-option>
                </a-select>
                <a-select
                  :disabled="!record.editStatus"
                  style="width: 300px"
                  :value="value"
                  @search="selectBrand"
                  @change="handleChange"
                  :filterOption="false"
                  :notFoundContent="fetching ? undefined : null"
                  v-decorator="[record.id+'brandList',{initialValue: record.brandList}]"
                  mode="multiple">
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in deviceData" :key="d.value">{{ d.text }}</a-select-option>
                </a-select>
              </a-input-group>
            </a-form-item>
            <a-form-item
              style="margin-bottom: 0px;"
              label="Device Model"
              :colon="false"
              :labelCol="{lg: { span: 8 }, sm: { span: 8 }}"
              :wrapperCol="{lg: { span: 8 }, sm: { span: 8 } }">
              <a-input-group compact style="margin-top:6px;">
                <a-select :disabled="!record.editStatus" v-decorator="[record.id+'modelType',{initialValue: record.modelType || 'include'}]" style="width: 100px" >
                  <a-select-option value="include">include</a-select-option>
                  <a-select-option value="exclude">exclude</a-select-option>
                </a-select>
                <a-select
                  style="width: 300px"
                  :value="value"
                  @search="selectModel"
                  :disabled="!record.editStatus"
                  @change="handleChange"
                  :filterOption="false"
                  :notFoundContent="fetching ? undefined : null"
                  v-decorator="[record.id+'modelList',{initialValue: record.modelList}]"
                  mode="multiple">
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in deviceData" :key="d.value">{{ d.text }}</a-select-option>
                </a-select>
              </a-input-group>
            </a-form-item>
          </p>
          <span slot="status" slot-scope="text, record">
            <template>
              <div v-if="record.editStatus">
                <a herf="#" @click="handleInstanceSave(record)">Save</a>
                <a-divider type="vertical" />
                <a herf="#" @click="handleInstanceCancel(record)">Cancel</a>
                <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
              </div>
              <div v-else>
                <a herf="#" @click="handleEdit(record)">Edit</a>
                <a-divider type="vertical" />
                <a herf="#" @click="handelInstanceStatusUpdate(record)">{{ text===0?'Enable' : 'Disable' }}</a>
                <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
              </div>
            </template>
          </span>
          <span slot="className" class="row-edit" slot-scope="text, record">
            <ad-network
              v-if="!record.editStatus"
              style="max-width:120px;"
              :className="text"
              :id="record.adnId"
              :status="record.status"
            />
            <ADNSelect @change="adnChange" :name="record.id+'adnId'" :defaultValue="record.adnId" v-else/>
          </span>
          <span class="row-edit" slot="placementKey" slot-scope="text, record">
            <span :style="record.status===0 ? 'opacity: 0.3;' : null">
              <a-form-item size="small" v-if="record.editStatus">
                <a-input :placeholder="placementColumnName" style="line-height:0;margin-top:0px;" v-decorator="[record.id+'placementKey',{initialValue: record.placementKey, rules: [{ required: true, message: placementColumnName + ' can not be empty.' }, {validator: checkPlacementKey}]}]"/>
              </a-form-item>
              <span v-else :title="record.id"><ellipsis :length="30" tooltip>{{ text }}</ellipsis></span>
            </span>
          </span>
          <span class="row-edit" slot="name" slot-scope="text, record">
            <span :style="record.status===0 ? 'opacity: 0.3;' : null">
              <a-form-item size="small" v-if="record.editStatus">
                <a-input placeholder="Instance name" maxlength="40" style="line-height:0;margin-top:0px;" v-decorator="[record.id+'name',{initialValue: record.name, rules: [{ required: true, message: 'Instance Name can not be empty.' }]}]"/>
              </a-form-item>
              <span v-else class="hb-bottom">
                <om-text :text="text" />
                <a-button
                  v-if="record.hbStatus"
                  type="danger"
                  style="width: 100px;
                    font-size: 12px;
                    margin-left: 10px;
                    height: 25px;"
                  ghost>Header bidding</a-button>
              </span>
            </span>
          </span>
        </a-table>

        <div style="height:24px;background:#FFFFFF">
        </div>
      </a-card>
    </div>
  </a-form>
</template>

<script>
import { adNetworkAppCreate, getInstance, instancesUpdate, instancesCreate, instancesStatusUpdate, adNetworkInstancesList, instancesSelectList } from '@/api/mediation'
import Placement from '@/components/om/Placement'
import { modelSearch, brandSearch } from '@/api/publisher'
import OmInstanceSelect from '@/components/om/InstanceSelect'
import { Ellipsis } from '@/components'
import OmText from '@/components/om/Text'
import AdNetwork from '@/components/Mediation/AdNetwork'
import ADNSelect from './ADNSelect'
import CreateNetWorkApp from '../../mediation/modules/CreateNetworkApp'

export default {
  name: 'InstanceEdit',
  components: {
    Placement,
    Ellipsis,
    OmInstanceSelect,
    OmText,
    AdNetwork,
    ADNSelect,
    CreateNetWorkApp
  },
  data () {
    const canEdit = this.$auth('adn.edit')
    const columns = [
      {
        title: 'Ad Network',
        dataIndex: 'className',
        width: '20%',
        scopedSlots: { customRender: 'className' }
      },
      {
        title: 'Instance Name',
        dataIndex: 'name',
        width: '30%',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: 'Unit ID',
        dataIndex: 'placementKey',
        width: '30%',
        scopedSlots: { customRender: 'placementKey' }
      },
      {
        title: 'Operations',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
      }
    ]
    if (!canEdit) {
      columns.pop()
    }
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      form: this.$form.createForm(this),
      searchOption: {},
      currentAdn: null,
      tempAdn: null,
      currentAdnAppId: null,
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      placementColumnName: 'Placement ID',
      id: parseInt(this.$route.query.placementId),
      instanceSelectOption: [],
      data: [],
      value: [],
      scroll: 200,
      loading: false,
      deviceData: [],
      lastFetchId: 0,
      fetching: false,
      count: -100,
      columns: columns,
      pubAppId: this.$store.state.publisher.searchApp
    }
  },
  mounted () {
    this.scroll = window.innerHeight - 350
    if (this.id) {
      this.listSearch()
      instancesSelectList({ placementId: this.id, pubAppId: this.pubAppId }).then(res => {
        if (res.code === 0) {
          this.instanceSelectOption = res.data
        }
      })
    }
  },
  watch: {
    tempAdn (value) {
      let v = ''
      switch (value) {
        case 2:
        case 12:
        case 13:
        case 14:
          v = 'Unit ID'
          break
        case 5:
          v = 'Reference ID'
          break
        case 7:
        case 8:
          v = 'Zone ID'
          break
        case 9:
          v = 'Ad Unit ID'
          break
        case 11:
          v = 'Placement Name'
          break
        default:
          v = 'Placement ID'
          break
      }
      this.placementColumnName = v
    }
  },
  methods: {
    adnChange (val) {
      if (!val) {
        this.tempAdn = null
        this.form.resetFields()
        this.currentAdn = null
        this.currentAdnAppId = null
        return
      }
      this.tempAdn = val.id
      if (!val.adNetworkAppId) {
        this.currentAdn = val
      } else {
        this.currentAdnAppId = val.adNetworkAppId
        this.form.resetFields()
        this.currentAdn = null
      }
    },
    handleOpen (record) {
      this.currentAdnAppId = null
      record['expandStatus'] = !record['expandStatus']
      this.currentExpandedStatOpen = !this.currentExpandedStatOpen
      if (this.curExpandedRowKeys.length > 0) {
        const index = this.curExpandedRowKeys.indexOf(record.id)
        if (index > -1) {
          this.curExpandedRowKeys.splice(index, 1)
          record.editStatus = false
          this.currentAdnAppId = null
          this.currentAdn = null
        } else {
          this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
          this.data.forEach(item => {
            if (item.id !== record.id) {
              item.expandStatus = false
              item.editStatus = false
            }
          })
          this.tempAdn = record.adnId
          this.curExpandedRowKeys.push(record.id)
        }
      } else {
        this.tempAdn = record.adnId
        this.curExpandedRowKeys.push(record.id)
      }
    },
    handleEdit (record) {
      record.editStatus = true
      if (!record.expandStatus) {
        this.handleOpen(record)
      }
    },
    checkPlacementKey (rule, value, callback) {
      if (!value) return
      const id = parseInt(rule.field.replace('placementKey', ''))
      let flag = true
      this.data.forEach(ins => {
        if (ins.placementKey === value && ins.id === id && !ins.createNew) {
          callback()
          flag = false
        }
      })
      if (!flag) {
        return
      }
      getInstance({ placementKey: value }).then(res => {
        if (res.data && res.data.length) {
          callback(new Error('This ' + this.placementColumnName + ' already exits.'))
        } else {
          callback()
        }
      })
    },
    handleInstanceSave (record) {
      const { form: { validateFields } } = this
      const that = this
      validateFields((err, values) => {
        if (!err) {
          const item = { ...record }
          item.name = values[record.id + 'name']
          item.adnId = values[record.id + 'adnId']
          item.placementKey = values[record.id + 'placementKey']
          item.hbStatus = values[record.id + 'hbStatus'] || 0
          item.frequencyCap = values[record.id + 'frequencyCap']
          item.frequencyInterval = values[record.id + 'frequencyInterval']
          item.frequencyUnit = values[record.id + 'frequencyUnit']
          item.brandWhitelist = values[record.id + 'brandType'] === 'include' && values[record.id + 'brandList'] ? values[record.id + 'brandList'].join(',') : ''
          item.brandBlacklist = values[record.id + 'brandType'] === 'exclude' && values[record.id + 'brandList'] ? values[record.id + 'brandList'].join(',') : ''
          item.modelWhitelist = values[record.id + 'modelType'] === 'include' && values[record.id + 'modelList'] ? values[record.id + 'modelList'].join(',') : ''
          item.modelBlacklist = values[record.id + 'modelType'] === 'exclude' && values[record.id + 'modelList'] ? values[record.id + 'modelList'].join(',') : ''
          item.hbStatus = values[record.id + 'hbStatus'] ? 1 : 0
          values.adnId = item.adnId
          values.pubAppId = that.$store.state.publisher.searchApp
          if (record.createNew) {
            item.adnAppId = record.adnAppId
            item.pubAppId = values.pubAppId
            if (!record.adnAppId && this.currentAdn) {
              adNetworkAppCreate(values).then(res => {
                if (res.code === 0) {
                  record.adnAppId = res.data.id
                  item.adnAppId = record.adnAppId
                  instancesCreate(item).then(res => {
                    if (res.code === 0) {
                      record = Object.assign(record, res.data)
                      record.expandStatus = false
                      this.currentAdn = null
                      this.handleOpen(item)
                      this.listSearch()
                      this.$refs.insselect.upload()
                      this.$message.success(`create instance success`)
                    } else {
                      this.$message.error(`create instance error`)
                    }
                  })
                } else {
                  this.$message.error(`create adnetwork app error`)
                }
              })
            } else {
              item.adnAppId = this.currentAdnAppId
              instancesCreate(item).then(res => {
                if (res.code === 0) {
                  record = Object.assign(record, res.data)
                  record.expandStatus = false
                  record.createNew = false
                  this.handleOpen(item)
                  this.listSearch()
                  this.$refs.insselect.upload()
                  this.$message.success(`create instance success`)
                } else {
                  this.$message.error(`create instance error`)
                }
              })
            }
          } else {
            if (this.currentAdn) {
              adNetworkAppCreate(values).then(res => {
                if (res.code === 0) {
                  record.adnAppId = res.data.id
                  item.adnAppId = record.adnAppId
                  instancesUpdate(item).then(res => {
                    if (res.code === 0) {
                      record = Object.assign(record, item)
                      this.currentAdn = null
                      this.handleOpen(record)
                      this.listSearch()
                      this.$message.success(`update instance success`)
                    } else {
                      this.$message.error(`update instance error`)
                    }
                  })
                } else {
                  this.$message.error(`create adnetwork app error`)
                }
              })
            } else {
              instancesUpdate(item).then(res => {
                if (res.code === 0) {
                  record = Object.assign(record, item)
                  this.handleOpen(record)
                  this.listSearch()
                  this.$message.success(`update instance success`)
                } else {
                  this.$message.error(`update instance error`)
                }
              })
            }
          }
        }
      })
    },
    handelInstanceStatusUpdate (record) {
      if (record.id) {
        const status = (record.status === 0) ? 1 : 0
        instancesStatusUpdate({ status: status, instanceId: record.id }).then(res => {
          if (res.code === 0) {
            record.status = status
            this.listSearch()
            this.$message.success(`update instance success`)
          } else {
            this.$message.error(`update instance error`)
          }
        })
      }
    },
    instanceAdd () {
      this.data.forEach(item => {
        item.expandStatus = false
        item.editStatus = false
      })
      this.curExpandedRowKeys.splice(0, this.curExpandedRowKeys.length)
      this.currentAdn = null
      const newItem = {
        id: this.count,
        name: '',
        hbStatus: 0,
        adnId: null,
        frequencyCap: 0,
        status: 0,
        frequencyUnit: 1,
        frequencyInterval: 0,
        brandType: 'include',
        brandList: [],
        modelType: 'include',
        modelList: [],
        createNew: true,
        adnAppId: null,
        expandStatus: false,
        editStatus: true,
        placementKey: '',
        placementId: this.id
      }
      this.data.unshift(newItem)
      this.handleOpen(newItem)
      this.count = this.count - 1
      this.$vnode.elm.querySelectorAll('.ant-table-body').forEach(node => {
        node.scrollTop = 0
      })
    },
    handleInstanceCancel (record, key) {
      if (record.createNew) {
        this.data.splice(this.data.findIndex(item => item.id === record.id), 1)
      }
      this.handleOpen(record)
    },
    handleChange (value) {
      Object.assign(this, {
        value,
        deviceData: [],
        fetching: false
      })
    },
    selectBrand (value) {
      this.deviceData = []
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.fetching = true
      brandSearch({ brand: value }).then(res => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        const data = Object.keys(res.data).map(key => ({
          text: `${key}`,
          value: key
        }))

        this.deviceData = data
        this.fetching = false
      })
    },
    selectModel (value) {
      this.deviceData = []
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.fetching = true
      modelSearch({ model: value }).then(res => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        const data = Object.keys(res.data).map(key => ({
          text: `${key}`,
          value: key
        }))

        this.deviceData = data
        this.fetching = false
      })
    },
    listSearch () {
      this.loading = true
      const params = { pubAppId: this.pubAppId, placementId: this.id }
      adNetworkInstancesList(Object.assign(params, this.form.getFieldsValue(['instanceId'])))
        .then(res => {
          if (res.code === 0) {
            this.arraySort(res.data)
            res.data.forEach(item => {
              if (item.instances) {
                item.instances.forEach(ins => {
                  ins.hbStatus = ins.hbStatus !== 0
                  ins.editStatus = false
                  ins.expandStatus = false
                })
              }
            })
            this.data = res.data[0].instances
          }
        }).finally(() => {
          this.loading = false
        })
    },
    arraySort (list) {
      for (const p of list) {
        p.instances = p.instances.sort((a, b) => {
          if (a.status === b.status) {
            return b.createTime - a.createTime
          } else {
            return b.status - a.status
          }
        })
      }
    },
    placementFilterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
        option.componentOptions.children[1].children[0].text.indexOf(input) >= 0
      )
    },
    selectPlacementChange (value) {
      this.searchOption.placementId = value
    },
    instanceFilterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
        option.componentOptions.children[1].children[0].text.indexOf(input) >= 0
      )
    },
    selectInstanceChange (value) {
      this.searchOption.instanceId = value
    }
  }
}
</script>

<style type="less" scoped>
.hb-bottom >>> .ant-btn {
  padding: 0 0;
}
.adnedit >>> .ant-card-head-title {
  margin-left: -8px;
  margin-top: -6px;
}
.adnedit >>> .ant-card-head {
  height: 48px;
}
.adnedit >>> .ant-form-item {
  margin-bottom: 0;
}
.expand-row >>> .ant-divider {
  height: 1px;
  margin-top: -16px;
}
.adnedit >>> .ant-form-explain, .ant-form-extra {
  line-height: 1.5;
  margin-bottom: -20px;
}
</style>
