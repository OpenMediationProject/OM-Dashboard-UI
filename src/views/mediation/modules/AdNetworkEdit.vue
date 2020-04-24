<!-- AdNetworkEdit page router '/mediation/adn/add' -->
<template>
  <a-form :form="form" :hideRequiredMark="true">
    <div class="adnedit">
      <a-card :bordered="false" >
        <span slot="title">
          <TitleIcon :name="adNetworkName" :adTypes="adTypes"/>
        </span>
        <CreateNetWorkApp style="margin-top:24px;" :id="this.id" />
        <a-form-item style="margin-bottom:16px;" v-action:edit :wrapperCol="{span: 11, offset: 11}">
          <a-button type="primary" @click="saveAdNetworkApp" style="margin-right: 50px;">Save</a-button>
          <a-button type="primary" @click="grantToken" :disabled="!canGrant" v-if="showGrant">Token Grant</a-button>
        </a-form-item>
      </a-card>
      <a-card :bordered="false" style="margin-top:6px;">
        <div class="table-page-search-wrapper" style="padding-top:24px;padding-right:24px;margin-bottom: -24px;">
          <a-row type="flex" justify="start">
            <a-form-item style="margin-left:24px; display:inline-block; width:220px;">
              <a-select
                showSearch
                placeholder="Placement"
                @change="selectPlacementChange"
                v-decorator="['placementId']"
                :filterOption="placementFilterOption">
                <span slot="maxTagPlaceholder">+</span>
                <a-select-option v-for="item in this.placementSelectOption" :key="item.id">{{ item.name }}<p style="display:none">{{ item.id }}</p></a-select-option>
              </a-select>
            </a-form-item>
            <om-instance-select :adnAppId="this.adNetworkAppId" style="margin-left:8px;"/>
            <a-form-item>
              <span class="table-page-search-submitButtons">
                <a-button type="primary" style="margin-right:8px;margin-left:8px;" ghost @click="listSearch">Apply</a-button>
                <a-button type="primary" ghost @click="resetSearch">Clear</a-button>
              </span>
            </a-form-item>
          </a-row>
        </div>
      </a-card>
      <a-card :bordered="false" style="padding-left:24px;padding-right:24px;">
        <div v-for="item in list" :key="item.id">
          <div style="padding-top:32px;">
            <a-row>
              <a-col :md="4" :sm="12">
                <Placement :name="item.name" :id="item.id" :type="item.adType"/>
              </a-col>
              <a-col v-action:edit :md="20" :sm="12">
                <span class="table-page-search-submitButtons" style="float:right;margin-top:12px;overflow:hidden;">
                  <a-button type="primary" ghost @click="instanceAdd(item)">Add Instance</a-button>
                </span>
              </a-col>
            </a-row>
          </div>
          <a-table
            class="ant-card-table-default-noshadow"
            style="margin-top:16px;"
            :ref="item.id + 'table'"
            rowKey="id"
            :scroll="{ y: 540 }"
            :dataSource="item.instances"
            :expandedRowKeys="curExpandedRowKeys"
            :columns="columns"
            :expandIconAsCell="false"
            :expandIconColumnIndex="-1"
            :pagination="false"
          >
            <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
              <a-form-item
                label="Header Bidding"
                :colon="false"
                style="margin-bottom: 0px;"
                :labelCol="{lg: { span: 8 }, sm: { span: 8 }}"
                :wrapperCol="{lg: { span: 8 }, sm: { span: 8 } }">
                <a-checkbox
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
                  :max="9999"
                  style="width:66px;"
                  v-decorator="[record.id+'frequencyCap',{initialValue: record.frequencyCap}]"/> impressions per
                <a-input-number
                  type="number"
                  size="small"
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
                  <a-select v-decorator="[record.id+'brandType',{initialValue: record.brandType || 'include'}]" style="width: 100px" >
                    <a-select-option value="include">include</a-select-option>
                    <a-select-option value="exclude">exclude</a-select-option>
                  </a-select>
                  <a-select
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
                  <a-select v-decorator="[record.id+'modelType',{initialValue: record.modelType || 'include'}]" style="width: 100px" >
                    <a-select-option value="include">include</a-select-option>
                    <a-select-option value="exclude">exclude</a-select-option>
                  </a-select>
                  <a-select
                    style="width: 300px"
                    :value="value"
                    @search="selectModel"
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
                <div v-if="record.expandStatus">
                  <a herf="#" @click="handleInstanceSave(record, item.id || record.placementId)">Save</a>
                  <a-divider type="vertical" />
                  <a herf="#" @click="handleInstanceCancel(record, item.id || record.placementId)">Cancel</a>
                  <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                </div>
                <div v-else>
                  <a herf="#" @click="handleOpen(record)">Edit</a>
                  <a-divider type="vertical" />
                  <a herf="#" @click="handelInstanceStatusUpdate(record)">{{ text===0?'Enable' : 'Disable' }}</a>
                  <span style="float:right" v-if="!record.expandStatus" @click="handleOpen(record)" ><img src="/assets/down.svg"/></span>
                  <span style="float:right" v-else @click="handleOpen(record)"><img src="/assets/up.svg"/></span>
                </div>
              </template>
            </span>
            <span class="row-edit" slot="placementKey" slot-scope="text, record">
              <span :style="record.status===0 ? 'opacity: 0.3;' : null">
                <a-form-item size="small" v-if="record.expandStatus">
                  <a-input style="line-height:0;margin-top:0px;" v-decorator="[record.id+'placementKey',{initialValue: record.placementKey, rules: [{ required: true, message: placementColumnName + ' can not be empty.' }, {validator: checkPlacementKey}]}]"/>
                </a-form-item>
                <span v-else :title="record.id"><ellipsis :length="30" tooltip>{{ text }}</ellipsis></span>
              </span>
            </span>
            <span class="row-edit" slot="name" slot-scope="text, record">
              <span :style="record.status===0 ? 'opacity: 0.3;' : null">
                <a-form-item size="small" v-if="record.expandStatus">
                  <a-input maxlength="40" style="line-height:0;margin-top:0px;" v-decorator="[record.id+'name',{initialValue: record.name, rules: [{ required: true, message: 'Instance Name can not be empty.' }]}]"/>
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
        </div>
        <div style="height:24px;background:#FFFFFF">
        </div>
      </a-card>
    </div>
  </a-form>
</template>

<script>
import { adNetworkAppCreate, adNetworkAppGet, adNetworkAppUpdate, getInstance, instancesUpdate, instancesCreate, instancesStatusUpdate, adNetworkInstancesList, instancesSelectList, admobGrantToken } from '@/api/mediation'
import CreateNetWorkApp from './CreateNetworkApp'
import Placement from '@/components/om/Placement'
import TitleIcon from './TitleIcon'
import { modelSearch, brandSearch, placementList } from '@/api/publisher'
import OmInstanceSelect from '@/components/om/InstanceSelect'
import { Ellipsis } from '@/components'
import OmText from '@/components/om/Text'

export default {
  name: 'AdNetworkEdit',
  components: {
    CreateNetWorkApp,
    TitleIcon,
    Placement,
    Ellipsis,
    OmInstanceSelect,
    OmText
  },
  data () {
    const canEdit = this.$auth('adn.edit')
    const columns = [
      {
        title: 'Instance Name',
        dataIndex: 'name',
        width: '40%',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: this.placementColumnName,
        dataIndex: 'placementKey',
        width: '40%',
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
    const { id, name, adTypes, adNetworkAppId } = this.$route.params
    const showGrant = id === 2
    const canGrant = adNetworkAppId > 0
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      form: this.$form.createForm(this),
      searchOption: {},
      adNetworkName: name,
      adTypes: adTypes,
      params: {},
      queryParam: {},
      curExpandedRowKeys: [],
      currentExpandedStatOpen: false,
      id: id,
      placementSelectOption: [],
      instanceSelectOption: [],
      adNetworkAppId: adNetworkAppId,
      data: [],
      value: [],
      list: [],
      deviceData: [],
      lastFetchId: 0,
      fetching: false,
      count: -100,
      columns: columns,
      showGrant: showGrant,
      canGrant: canGrant
    }
  },
  mounted () {
    this.list = this.$route.params.list
    if (this.adNetworkAppId) {
      this.arraySort(this.list)
      this.list.forEach(item => {
        if (item.instances) {
          item.instances.forEach(ins => {
            ins.hbStatus = ins.hbStatus !== 0
          })
        }
      })
      adNetworkAppGet({ adNetworkAppId: this.adNetworkAppId })
        .then(res => {
          if (res.code === 0) {
            this.form.setFieldsValue(res.data)
          }
        })
    }
    placementList({ pubAppId: this.$store.state.publisher.searchApp }).then(res => {
      if (res.code === 0) {
        this.placementSelectOption = res.data
      }
    })
    instancesSelectList({ adNetworkId: this.id, placementId: this.$store.state.publisher.searchPlacementId || null, pubAppId: this.$store.state.publisher.searchApp }).then(res => {
      if (res.code === 0) {
        this.instanceSelectOption = res.data
      }
    })
  },
  beforeCreate () {
    this.placementColumnName = 'Placement ID'
    switch (this.$route.params.id) {
      case 2:
      case 12:
      case 13:
      case 14:
        this.placementColumnName = 'Unit ID'
        break
      case 5:
        this.placementColumnName = 'Reference ID'
        break
      case 7:
      case 8:
        this.placementColumnName = 'Zone ID'
        break
      case 9:
        this.placementColumnName = 'Ad Unit ID'
        break
      case 11:
        this.placementColumnName = 'Placement Name'
        break
      default:
        this.placementColumnName = 'Placement ID'
        break
    }
  },
  methods: {
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
    grantToken () {
      if (this.adNetworkAppId) {
        const params = { adnAppId: this.adNetworkAppId }
        admobGrantToken(params).then(res => {
          if (res.code === 0 && res.data) {
            window.open(res.data, 'newwindow', 'width=800, height=600')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    saveAdNetworkApp () {
      const { form: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          if (this.adNetworkAppId) {
            values.id = this.adNetworkAppId
            adNetworkAppUpdate(values).then(res => {
              if (res.code === 0) {
                this.$router.push({
                  name: 'AdnList'
                })
              } else {
                this.$message.error(`create adnetwork app error`)
              }
            })
          } else {
            values.adnId = this.$route.params.id
            values.pubAppId = this.$store.state.publisher.searchApp
            adNetworkAppCreate(values).then(res => {
              if (res.code === 0) {
                this.adNetworkAppId = res.data.id
                this.$message.success(`create adnetworkApp success`)
              } else {
                this.$message.error(`create adnetwork app error`)
              }
            })
          }
        }
      })
    },
    checkPlacementKey (rule, value, callback) {
      if (!value) return
      const id = parseInt(rule.field.replace('placementKey', ''))
      let flag = true
      this.list.forEach(item => {
        item.instances.forEach(ins => {
          if (ins.placementKey === value && ins.id === id && !ins.createNew) {
            callback()
            flag = false
          }
        })
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
    handleInstanceSave (record, key) {
      const { form: { validateFields } } = this
      const that = this
      validateFields((err, values) => {
        if (!err) {
          const item = { ...record }
          item.name = values[record.id + 'name']
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
          if (record.createNew) {
            values.adnId = that.$route.params.id
            values.pubAppId = that.$store.state.publisher.searchApp
            item.adnId = values.adnId
            item.adnAppId = that.adNetworkAppId
            item.pubAppId = values.pubAppId
            if (!this.adNetworkAppId) {
              adNetworkAppCreate(values).then(res => {
                if (res.code === 0) {
                  this.adNetworkAppId = res.data.id
                  item.adnAppId = this.adNetworkAppId
                  instancesCreate(item).then(res => {
                    if (res.code === 0) {
                      record = Object.assign(record, res.data)
                      record.expandStatus = false
                      this.handleOpen(item)
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
              instancesCreate(item).then(res => {
                if (res.code === 0) {
                  record = Object.assign(record, res.data)
                  record.expandStatus = false
                  record.createNew = false
                  this.handleOpen(item)
                  this.$message.success(`create instance success`)
                } else {
                  this.$message.error(`create instance error`)
                }
              })
            }
          } else {
            instancesUpdate(item).then(res => {
              if (res.code === 0) {
                record = Object.assign(record, item)
                this.handleOpen(record)
                this.$message.success(`update instance success`)
              } else {
                this.$message.error(`update instance error`)
              }
            })
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
            // this.arraySort(this.list)
            this.$message.success(`update instance success`)
          } else {
            this.$message.error(`update instance error`)
          }
        })
      }
    },
    instanceAdd (placement, e) {
      const dataSource = [...this.list]
      const target = dataSource.find(item => item.id === placement.id)
      const newItem = {
        id: this.count,
        name: '',
        hbStatus: 0,
        frequencyCap: 0,
        status: 0,
        frequencyUnit: 1,
        frequencyInterval: 0,
        brandType: 'include',
        brandList: [],
        modelType: 'include',
        modelList: [],
        createNew: true,
        expandStatus: true,
        placementKey: '',
        placementId: placement.id
      }
      this.count = this.count - 1
      if (target) {
        target.instances.unshift(newItem)
        this.list = dataSource
        this.currentExpandedStatOpen = true
        if (this.curExpandedRowKeys.length > 0) {
          const index = this.curExpandedRowKeys.indexOf(newItem.id)
          if (index > -1) {
            this.curExpandedRowKeys.splice(index, 1)
          } else {
            this.curExpandedRowKeys.push(newItem.id)
          }
        } else {
          this.curExpandedRowKeys.push(newItem.id)
        }
        this.$vnode.elm.querySelectorAll('.ant-table-body').forEach(node => {
          node.scrollTop = 0
        })
      }
    },
    handleInstanceCancel (record, key) {
      if (record.createNew) {
        const dataSource = [...this.list]
        const target = dataSource.find(item => item.id === key)
        target.instances.splice(target.instances.findIndex(item => item.id === record.id), 1)
        this.list = dataSource
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
      const params = { pubAppId: this.$store.state.publisher.searchApp, adNetworkId: this.$route.params.id }
      adNetworkInstancesList(Object.assign(params, this.form.getFieldsValue(['instanceId', 'placementId'])))
        .then(res => {
          if (res.code === 0) {
            const types = []
            this.adTypes.forEach(item => {
              if (item === 'RewardedVideo') {
                types.push(2)
              } else if (item === 'Native') {
                types.push(1)
              } else if (item === 'Banner') {
                types.push(0)
              } else if (item === 'Interstitial') {
                types.push(3)
              }
            })
            res.data = res.data.filter(item => types.includes(item.adType))
            this.arraySort(res.data)
            this.list = res.data
          }
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
    resetSearch () {
      this.form.resetFields(['placementId', 'instanceId'])
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
.adnedit >>> .ant-form-explain, .ant-form-extra {
  line-height: 1.5;
  margin-bottom: -20px;
}
</style>
