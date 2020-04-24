<template>
  <a-card class="card-noline" title="Basic Information" :bordered="false" >
    <om-form :maxlength="40" label="Name" field="name" tip="Segment Name" :showTip="false"/>
    <om-form label="Optimize Type" field="autoOpt" tip="Optimize Type" :showTip="false">
      <a-select @change="optChange" placeholder="Manual" v-decorator="['autoOpt',{rules: [{ required: true, message: 'Optimize Type can not be empty.'}] }]" >
        <a-select-option :value="0">Manual</a-select-option>
        <a-select-option :value="1">Auto</a-select-option>
      </a-select>
    </om-form>
    <om-form label="Regions" field="regions" tip="Regions" :showTip="false" >
      <RegionsSelect @change="regionsSelectedId" :defaultSelected="countris" size="default" />
    </om-form>
    <om-form label="Frequency" field="frequency" tip="Frequency" :fill="false" :showTip="false" >
      <a-input-number
        ref="iap-min"
        style="width:100%"
        type="number"
        :min="0"
        :max="500"
        v-decorator="['frequency']"/>
    </om-form>
    <om-form label="IAP(USD)" field="iapMin" tip="IAP(USD)" :fill="false" :showTip="false">
      <a-input-number
        style="width:100px;"
        ref="iapmin"
        :max="9999"
        :min="0"
        v-decorator="['iapMin', {rules: [{ validator: handleCheckIapMin }]}]"/> -
      <a-input-number
        ref="iapmax"
        :max="9999"
        :min="0"
        style="width:100px;"
        v-decorator="['iapMax', {rules: [{ validator: handleCheckIapMax }]}]"/>
    </om-form>
    <a-divider><img v-if="visible" @click="handleVisible" src="/assets/lineUp.svg"><img @click="handleVisible" v-else src="/assets/lineDown.svg"></a-divider>
    <span v-show="visible">
      <om-form label="Interest" field="interest" tip="Interest" :fill="false" :showTip="false">
        <a-select mode="multiple" v-decorator="['interest']" placeholder="Tags">
          <a-select-option
            v-for="item in interestsOption"
            :key="item.id"
          >{{ item.text }}</a-select-option>
        </a-select>
      </om-form>
      <om-form label="Connection Type" field="conType" tip="Connection Type" :fill="false" :showTip="false">
        <a-checkbox-group v-model="selectedContype" :defaultValue="conType" @change="contypeChance">
          <a-checkbox :value="0">Wifi</a-checkbox>
          <a-checkbox :value="1">2G</a-checkbox>
          <a-checkbox :value="2">3G</a-checkbox>
          <a-checkbox :value="3">4G</a-checkbox>
        </a-checkbox-group>
      </om-form>
      <a-form-item>
        <om-form label="Device Brand" field="brand" tip="Device Brand" :fill="false" :showTip="false">
          <a-input-group style="width:100%" compact>
            <a-select v-decorator="['brandType', {initialValue: 'include'}]">
              <a-select-option value="include">include</a-select-option>
              <a-select-option value="exclude">exclude</a-select-option>
            </a-select>
            <a-select
              style="width: 73%"
              :value="value"
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
        <om-form label="Device Model" field="model" tip="Device Model" :fill="false" :showTip="false">
          <a-input-group style="width:100%" compact>
            <a-select defaultValue="include" v-decorator="['modelType', {initialValue: 'include'}]" >
              <a-select-option value="include">include</a-select-option>
              <a-select-option value="exclude">exclude</a-select-option>
            </a-select>
            <a-select
              style="width: 73%"
              :value="value"
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
import DeviceSelect from './DeviceSelect'
import { modelSearch, brandSearch } from '@/api/publisher'

export default {
  components: {
    'om-form': omForm,
    RegionsSelect,
    DeviceSelect
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
    regions: {
      type: Array,
      required: false,
      default: null
    },
    autoOpt: {
      type: Number,
      required: false,
      default: 0
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
      value: [],
      selectedContype: this.conType,
      interestsOption: [
        {
          'id': 'american_football',
          'text': 'American Football'
        },
        {
          'id': 'anti-virus',
          'text': 'Anti-virus'
        },
        {
          'id': 'audio_books',
          'text': 'Audio Books'
        },
        {
          'id': 'automobiles',
          'text': 'Automobiles'
        },
        {
          'id': 'auto_racing',
          'text': 'Auto Racing'
        },
        {
          'id': 'baking',
          'text': 'Baking'
        },
        {
          'id': 'banking',
          'text': 'Banking'
        },
        {
          'id': 'baseball',
          'text': 'Baseball'
        },
        {
          'id': 'basketball',
          'text': 'Basketball'
        },
        {
          'id': 'beauty',
          'text': 'Beauty'
        },
        {
          'id': 'books',
          'text': 'Books'
        },
        {
          'id': 'business',
          'text': 'Business'
        },
        {
          'id': 'car_owner',
          'text': 'Car owner'
        },
        {
          'id': 'celebrities',
          'text': 'Celebrities'
        },
        {
          'id': 'cinema',
          'text': 'Cinema'
        },
        {
          'id': 'comics',
          'text': 'Comics'
        },
        {
          'id': 'commuting',
          'text': 'Commuting'
        },
        {
          'id': 'computers_technology',
          'text': 'Computers & Technology'
        },
        {
          'id': 'concert',
          'text': 'Concert'
        },
        {
          'id': 'cooking',
          'text': 'Cooking'
        },
        {
          'id': 'cosmetics',
          'text': 'Cosmetics'
        },
        {
          'id': 'coupon',
          'text': 'Coupon'
        },
        {
          'id': 'cricket',
          'text': 'Cricket'
        },
        {
          'id': 'dating',
          'text': 'Dating'
        },
        {
          'id': 'dieting_weight_loss',
          'text': 'Dieting & Weight Loss'
        },
        {
          'id': 'dogs',
          'text': 'Dogs'
        },
        {
          'id': 'education',
          'text': 'Education'
        },
        {
          'id': 'entertainment',
          'text': 'Entertainment'
        },
        {
          'id': 'fashion',
          'text': 'Fashion'
        },
        {
          'id': 'finance',
          'text': 'Finance'
        },
        {
          'id': 'fitness',
          'text': 'Fitness'
        },
        {
          'id': 'flight_search',
          'text': 'Flight search'
        },
        {
          'id': 'food_beverages',
          'text': 'Food & Beverages'
        },
        {
          'id': 'food_delivery',
          'text': 'Food Delivery'
        },
        {
          'id': 'gadgets',
          'text': 'Gadgets'
        },
        {
          'id': 'gastronomy',
          'text': 'Gastronomy'
        },
        {
          'id': 'golf',
          'text': 'Golf'
        },
        {
          'id': 'hair',
          'text': 'Hair'
        },
        {
          'id': 'healthy_living',
          'text': 'Healthy living'
        },
        {
          'id': 'hiphop',
          'text': 'HipHop'
        },
        {
          'id': 'hotel_search',
          'text': 'Hotel search'
        },
        {
          'id': 'in_a_relationship',
          'text': 'In a Relationship'
        },
        {
          'id': 'job_market',
          'text': 'Job Market'
        },
        {
          'id': 'jokes',
          'text': 'Jokes'
        },
        {
          'id': 'language_learning',
          'text': 'Language learning'
        },
        {
          'id': 'literature',
          'text': 'Literature'
        },
        {
          'id': 'manga',
          'text': 'Manga'
        },
        {
          'id': 'medical',
          'text': 'Medical'
        },
        {
          'id': 'meditation',
          'text': 'Meditation'
        },
        {
          'id': 'movies',
          'text': 'Movies'
        },
        {
          'id': 'music',
          'text': 'Music'
        },
        {
          'id': 'news',
          'text': 'News'
        },
        {
          'id': 'news_politics',
          'text': 'News & Politics'
        },
        {
          'id': 'parenting',
          'text': 'Parenting'
        },
        {
          'id': 'personal_finance',
          'text': 'Personal Finance'
        },
        {
          'id': 'photography',
          'text': 'Photography'
        },
        {
          'id': 'podcast',
          'text': 'Podcast'
        },
        {
          'id': 'pregnancy',
          'text': 'Pregnancy'
        },
        {
          'id': 'productivity',
          'text': 'Productivity'
        },
        {
          'id': 'radio_listening',
          'text': 'Radio listening'
        },
        {
          'id': 'real_estate',
          'text': 'Real Estate'
        },
        {
          'id': 'relaxation',
          'text': 'Relaxation'
        },
        {
          'id': 'restaurant',
          'text': 'Restaurant'
        },
        {
          'id': 'rock',
          'text': 'Rock'
        },
        {
          'id': 'running',
          'text': 'Running'
        },
        {
          'id': 'shopping',
          'text': 'Shopping'
        },
        {
          'id': 'soccer',
          'text': 'Soccer'
        },
        {
          'id': 'sports_entertainment',
          'text': 'Sports entertainment'
        },
        {
          'id': 'sports_recreation',
          'text': 'Sports & Recreation'
        },
        {
          'id': 'stock_market',
          'text': 'Stock market'
        },
        {
          'id': 'taxi',
          'text': 'Taxi'
        },
        {
          'id': 'television',
          'text': 'Television'
        },
        {
          'id': 'travel',
          'text': 'Travel'
        },
        {
          'id': 'value_shopper',
          'text': 'Value Shopper'
        },
        {
          'id': 'weightlifting',
          'text': 'Weightlifting'
        },
        {
          'id': 'yoga',
          'text': 'Yoga'
        }
      ]
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
    regions (val) {
      this.countris = val
    }
  },
  methods: {
    optChange (value) {
      this.opt = value
      this.$emit('optChange', value)
    },
    handleCheckIapMin (rule, value, callback) {
      if (!value) {
        callback()
      }
      if (isNaN(value)) {
        callback(new Error('Illegal number'))
      } else {
        const n = Number(value)
        if (n < 0) {
          callback(new Error('Illegal number'))
        }
        const max = Number(this.$refs.iapmax.value)
        if (isNaN(max) || (max === 0 && n === 0)) {
          callback()
          return
        }
        if (max && n < max) {
          const form = this.$options.parent.form
          if (form.getFieldError('iapMax')) {
            setTimeout(_ => form.validateFields(['iapMax']), 100)
          }
          callback()
        } else {
          callback(new Error('Illegal number'))
        }
      }
    },
    handleCheckIapMax (rule, value, callback) {
      if (!value) {
        callback()
      }
      if (isNaN(value)) {
        callback(new Error('Illegal number'))
      } else {
        const n = Number(value)
        if (n < 0) {
          callback(new Error('Illegal number'))
        }
        const min = Number(this.$refs.iapmin.value)
        if (isNaN(min) || (min === 0 && n === 0)) {
          callback()
          return
        }
        const form = this.$options.parent.form
        if (min && n > min && n <= 9999) {
          if (form.getFieldError('iapMin')) {
            setTimeout(_ => form.validateFields(['iapMin']), 100)
          }
          callback()
        } else {
          if (min) {
            form.setFieldsValue({ iapMax: min + 1 })
            if (form.getFieldError('iapMin')) {
              setTimeout(_ => form.validateFields(['iapMin']), 100)
            }
            callback()
          }
        }
      }
    },
    handleVisible () {
      this.visible = !this.visible
    },
    contypeChance (e) {
      this.$emit('selectedContype', this.selectedContype)
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
    }
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
