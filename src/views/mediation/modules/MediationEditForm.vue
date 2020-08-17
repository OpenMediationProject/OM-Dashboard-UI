<template>
  <a-card class="card-noline om-card-style" title="Basic Information" :bordered="false" >
    <om-form
      :form="form"
      :max-length="40"
      label="Name"
      field="name"
      :msg="this.$msg('mediation.name_empty')"
      :tip="this.$msg('mediation.rule_name_tip')"
    />
    <om-form label="Optimized Type" field="autoOpt" :tip="this.$msg('mediation.optimized_type_tip')">
      <a-select @change="optChange" placeholder="Manual" v-decorator="['autoOpt']" >
        <a-select-option :value="0">Manual</a-select-option>
        <a-select-option :value="1">Auto</a-select-option>
      </a-select>
    </om-form>
    <om-form label="Regions" field="regions" :tip="this.$msg('mediation.regions_tip')" >
      <RegionsSelect @change="regionsSelectedId" :defaultSelected="countris" size="default" />
    </om-form>
    <a-form-item style="margin-bottom: -16px;">
      <om-form label="Channel" field="channel" :fill="false" :showTip="false">
        <a-input-group style="width:100%" compact>
          <a-select v-decorator="['channelBow', {initialValue: 0}]">
            <a-select-option :value="0">include</a-select-option>
            <a-select-option :value="1">exclude</a-select-option>
          </a-select>
          <a-select allowClear v-decorator="['channel']" mode="tags" style="width: 73%">
          </a-select>
        </a-input-group>
      </om-form>
    </a-form-item>
    <a-divider><img v-if="visible" @click="handleVisible" src="/assets/lineUp.svg"><img @click="handleVisible" v-else src="/assets/lineDown.svg"></a-divider>
    <span v-show="visible">
      <om-form label="Frequency" field="frequency" :fill="false" :tip="$msg('mediation.frequency_tip')" >
        <a-input-number
          ref="iap-min"
          style="width:100%"
          type="number"
          :min="0"
          :max="500"
          v-decorator="['frequency']"/>
      </om-form>
      <om-form label="IAP(USD)" field="iapMin" :tip="$msg('mediation.iap_tip')" :fill="false">
        <a-form-item style="margin-bottom: -16px;display:inline-block" :validate-status="iapstatus" :help="iapstatus==='error'?'illegal range':''">
          <a-input-group compact>
            <a-input-number
              :min="0"
              :max="9999"
              ref="iapmin"
              @change="handleCheckIapMin"
              v-decorator="['iapMin']"
              style=" width: 100px; text-align: center"
              placeholder="Minimum" />
            <a-input
              style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
              placeholder="~"
              disabled
            />
            <a-input-number
              ref="iapmax"
              :min="0"
              @change="handleCheckIapMax"
              :max="9999"
              v-decorator="['iapMax']"
              style="width: 100px; text-align: center; border-left: 0"
              placeholder="Maximum" />
            <AdtTip style="margin-top:4px;" :tip="$msg('mediation.iap_error')" />
          </a-input-group>
        </a-form-item>
      </om-form>
      <om-form label="Gender" field="gender" :tip="$msg('mediation.gender_tip')" :fill="false">
        <a-checkbox-group v-model="selectedGender"@change="genderChance">
          <a-checkbox :value="0">Male</a-checkbox>
          <a-checkbox :value="1">Female</a-checkbox>
        </a-checkbox-group>
      </om-form>
      <om-form label="Age" field="ageMin" :tip="this.$msg('mediation.age_tip')" :fill="false">
        <a-form-item style="margin-bottom: -16px;display:inline-block" :validate-status="status" :help="status==='error'?'illegal range':''">
          <a-input-group compact>
            <a-input-number
              :min="0"
              :max="200"
              ref="agemin"
              @change="handleCheckAgeMin"
              v-decorator="['ageMin']"
              style=" width: 100px; text-align: center"
              placeholder="Minimum" />
            <a-input
              style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
              placeholder="~"
              disabled
            />
            <a-input-number
              ref="agemax"
              :min="0"
              @change="handleCheckAgeMax"
              :max="200"
              v-decorator="['ageMax']"
              style="width: 100px; text-align: center; border-left: 0"
              placeholder="Maximum" />
            <AdtTip style="margin-top:4px;" :tip="$msg('mediation.age_error')" />
          </a-input-group>
        </a-form-item>
      </om-form>
      <om-form label="Connection Type" field="conType" :fill="false" :tip="this.$msg('mediation.contype_tip')" >
        <a-checkbox-group style="margin-top:8px;" v-model="selectedContype" @change="contypeChance">
          <a-checkbox :value="0">Wifi</a-checkbox>
          <a-checkbox :value="1">2G</a-checkbox>
          <a-checkbox :value="2">3G</a-checkbox>
          <a-checkbox :value="3">4G</a-checkbox>
        </a-checkbox-group>
      </om-form>
      <om-form label="Model Type" field="modelType" :fill="false" :tip="this.$msg('mediation.model_type_tip')" >
        <a-checkbox-group v-model="selectedModelType" @change="modelTypeChance">
          <a-checkbox :value="0">Phone</a-checkbox>
          <a-checkbox :value="1">Pad</a-checkbox>
          <a-checkbox :value="2">TV</a-checkbox>
        </a-checkbox-group>
      </om-form>
      <a-form-item>
        <om-form label="Device Brand" field="brand" :tip="this.$msg('mediation.brand_tip')" :fill="false">
          <a-input-group style="width:100%" compact>
            <a-select v-decorator="['brandType', {initialValue: 'include'}]">
              <a-select-option value="include">include</a-select-option>
              <a-select-option value="exclude">exclude</a-select-option>
            </a-select>
            <a-select
              style="width: 73%"
              @search="selectBrand"
              :filterOption="false"
              :notFoundContent="fetching ? undefined : null"
              v-decorator="['brandList']"
              mode="multiple">
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in deviceBrandData" :key="d.value">{{ d.text }}</a-select-option>
            </a-select>
          </a-input-group>
        </om-form>
      </a-form-item>
      <a-form-item>
        <om-form label="Device Model" field="model" :tip="this.$msg('mediation.model_tip')" :fill="false">
          <a-input-group style="width:100%" compact>
            <a-select v-decorator="['modelType', {initialValue: 'include'}]" >
              <a-select-option value="include">include</a-select-option>
              <a-select-option value="exclude">exclude</a-select-option>
            </a-select>
            <a-select
              style="width: 73%"
              @search="selectModel"
              :filterOption="false"
              :notFoundContent="fetching ? undefined : null"
              v-decorator="['modelList']"
              mode="multiple">
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in deviceModelData" :key="d.value">{{ d.text }}</a-select-option>
            </a-select>
          </a-input-group>
        </om-form>
      </a-form-item>
    </span>
  </a-card>
</template>
<script>
import { mapState } from 'vuex'
import omForm from '@/components/OmForm'
import RegionsSelect from '@/components/om/RegionsSelect'
import { modelSearch, brandSearch } from '@/api/publisher'
import AdtTip from '@/components/AdtTip'

export default {
  components: {
    'om-form': omForm,
    RegionsSelect,
    AdtTip
  },
  props: {
    id: {
      type: Number,
      required: false,
      default: 0
    },
    conType: {
      type: Array,
      required: false,
      default: null
    },
    modelType: {
      type: Array,
      required: false,
      default: null
    },
    regions: {
      type: Array,
      required: false,
      default: null
    },
    autoOpt: {
      type: Number,
      required: false,
      default: 0
    },
    form: {
      type: Object,
      default: null
    },
    gender: {
      type: Array,
      required: false,
      default: null
    }
  },
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      visible: false,
      countris: this.regions,
      deviceBrandData: [],
      deviceModelData: [],
      lastFetchId: 0,
      opt: this.autoOpt,
      fetching: false,
      status: 'success',
      value: [],
      iapstatus: 'success',
      selectedContype: this.conType,
      selectedModelType: this.modelType,
      selectedGender: this.gender
    }
  },
  name: 'MediationEditForm',
  computed: mapState({
    searchApp: state => state.publisher.searchApp
  }),
  watch: {
    conType (val) {
      this.selectedContype = val
    },
    gender (val) {
      this.selectedGender = val
    },
    modelType (val) {
      this.selectedModelType = val
    },
    regions (val) {
      this.countris = val
    }
  },
  methods: {
    optChange (value) {
      this.opt = value
      this.$emit('optChange', value)
    },
    handleCheckIapMin (value) {
      if (!value) {
        this.iapstatus = 'success'
        return
      }
      if (isNaN(value)) {
        this.iapstatus = 'success'
      } else {
        const n = Number(value)
        if (n < 0) {
          this.iapstatus = 'success'
          return
        }
        const max = Number(this.$refs.iapmax.value)
        if (isNaN(max) || (max === 0 && n === 0)) {
          this.iapstatus = 'success'
          return
        }
        if (max && n < max) {
          this.iapstatus = 'success'
        } else {
          this.iapstatus = 'error'
        }
      }
    },
    handleCheckIapMax (value) {
      if (!value) {
        this.iapstatus = 'success'
        return
      }
      if (isNaN(value)) {
        this.iapstatus = 'success'
      } else {
        const n = Number(value)
        const min = Number(this.$refs.iapmin.value)
        if (isNaN(min) || (min === 0 && n === 0)) {
          this.iapstatus = 'success'
          return
        }
        if (min && n < min) {
          this.iapstatus = 'error'
        } else {
          this.iapstatus = 'success'
        }
      }
    },
    handleCheckAgeMin (value) {
      if (!value) {
        this.status = 'success'
        return
      }
      if (isNaN(value)) {
        this.status = 'success'
      } else {
        const n = Number(value)
        if (n < 0) {
          this.status = 'success'
          return
        }
        const max = Number(this.$refs.agemax.value)
        if (isNaN(max) || (max === 0 && n === 0)) {
          this.status = 'success'
          return
        }
        if (max && n < max) {
          this.status = 'success'
        } else {
          this.status = 'error'
        }
      }
    },
    handleCheckAgeMax (value) {
      if (!value) {
        this.status = 'success'
        return
      }
      if (isNaN(value)) {
        this.status = 'success'
      } else {
        const n = Number(value)
        const min = Number(this.$refs.agemin.value)
        if (isNaN(min) || (min === 0 && n === 0)) {
          this.status = 'success'
          return
        }
        if (min && n < min) {
          this.status = 'error'
        } else {
          this.status = 'success'
        }
      }
    },
    handleVisible () {
      this.visible = !this.visible
    },
    contypeChance (e) {
      this.$emit('selectedContype', this.selectedContype)
    },
    modelTypeChance (e) {
      this.$emit('selectedModelType', this.selectedModelType)
    },
    genderChance (e) {
      this.$emit('selectedGender', this.selectedGender)
    },
    regionsSelectedId (value) {
      this.$emit('change', value)
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

        this.deviceBrandData = data
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

        this.deviceModelData = data
        this.fetching = false
      })
    },
    init () {
      const that = this
      setTimeout(function () {
        if (document.getElementById('channel')) {
          const dom = document.getElementById('channel').querySelectorAll('.ant-select-search__field')[0]
          dom.addEventListener('paste', function (e) {
            dom.blur()
            for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
              var item = e.clipboardData.items[i]
              if (item.kind === 'string') {
                item.getAsString(function (str) {
                  let list = str.split('\n')
                  list = list.filter(item => {
                    return item.trim() !== ''
                  })
                  let old = that.form.getFieldsValue().channel
                  if (old && old.length) {
                    list.forEach(element => {
                      if (!old.includes(element)) {
                        old.push(element)
                      }
                    })
                  } else {
                    old = list
                  }
                  that.form.setFieldsValue({ 'channel': old })
                })
              }
            }
          }, false)
        }
      }, 1000)
    }
  },
  created () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
img {
    margin-top: 8px;
}
.tip {
  position: absolute;
  margin-left: 8px;
}
.ant-form-item {
  margin-bottom: 12px;
}
</style>
