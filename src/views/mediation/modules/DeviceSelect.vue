<template>
  <span>
    <a-input-group v-if="type==='brand'" compact>
      <a-select defaultValue="include" @change="brandTypeChange" v-decorator="['brandType']" style="width:100px;">
        <a-select-option value="include">include</a-select-option>
        <a-select-option value="exclude">exclude</a-select-option>
      </a-select>
      <a-select
        style="width:300px;"
        :value="value"
        @search="selectBrand"
        @change="handleChangeBrand"
        :filterOption="false"
        :notFoundContent="fetching ? undefined : null"
        v-decorator="['brandList']"
        mode="multiple">
        <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        <a-select-option v-for="d in deviceData" :key="d.value">{{ d.text }}</a-select-option>
      </a-select>
    </a-input-group>
    <a-input-group v-else compact>
      <a-select defaultValue="include" @change="modelTypeChange" v-decorator="['modelType']" style="width: 100px" >
        <a-select-option value="include">include</a-select-option>
        <a-select-option value="exclude">exclude</a-select-option>
      </a-select>
      <a-select
        style="width: 300px"
        :value="value"
        @search="selectModel"
        @change="handleChangeModel"
        :filterOption="false"
        :notFoundContent="fetching ? undefined : null"
        v-decorator="['modelList']"
        mode="multiple">
        <a-spin v-if="fetching" slot="notFoundContent" size="small" />
        <a-select-option v-for="d in deviceData" :key="d.value">{{ d.text }}</a-select-option>
      </a-select>
    </a-input-group>
  </span>
</template>
<script>
import { mapState } from 'vuex'
import OmForm from '@/components/OmForm'
import RegionsSelect from '@/components/om/RegionsSelect'
import { modelSearch, brandSearch } from '@/api/publisher'

export default {
  components: {
    OmForm,
    RegionsSelect
  },
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      deviceData: [],
      lastFetchId: 0,
      fetching: false,
      value: []
    }
  },
  name: 'DeviceSelect',
  props: {
    type: {
      type: String,
      required: false,
      default: 'brand'
    },
    defaultBrandList: {
      type: Array,
      required: false,
      default: null
    },
    defaultModelList: {
      type: Array,
      required: false,
      default: null
    },
    defaultBrandType: {
      type: String,
      required: false,
      default: 'include'
    },
    defaultModelType: {
      type: String,
      required: false,
      default: 'include'
    }
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp
  }),
  methods: {
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
    handleChangeBrand (value) {
      this.$emit('brandChange', value)
      Object.assign(this, {
        value,
        deviceData: [],
        fetching: false
      })
    },
    brandTypeChange (val) {
      this.$$emit('brandTypeChange', val)
    },
    modelTypeChange (val) {
      this.$$emit('modelTypeChange', val)
    },
    handleChangeModel (value) {
      this.$emit('modelChange', value)
      Object.assign(this, {
        value,
        deviceData: [],
        fetching: false
      })
    }
  }
}
</script>
<style lang="less" scoped>
img {
margin-left:6px;margin-top:-5px;
}
.tip {
  position: absolute;
  margin-left: 8px;
}
.ant-form-item {
  margin-bottom: 12px;
}
</style>
