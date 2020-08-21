<template>
  <div class="adn-app-create">
    <div v-if="id===1">
      <!-- AdTiming -->
      <om-form
        :form="form"
        label="App Key"
        :msg="$msg('appsettings.app_key')"
        :edit="canEdit"
        field="adnAppKey"
      />
    </div>
    <div v-else-if="id===2">
      <!-- AdMob -->
      <om-form
        :form="form"
        label="App ID"
        :msg="$msg('appsettings.app_id')"
        :edit="canEdit"
        field="adnAppKey"
        :tip="$msg('appsettings.admob_app_id_tip')" />
    </div>
    <div v-else-if="id===3">
      <!-- facebook -->
      <om-form
        :form="form"
        label="App ID"
        :msg="$msg('appsettings.app_id')"
        :edit="canEdit"
        field="adnAppKey"
        :tip="$msg('appsettings.facebook_app_id_tip')" />
      <om-form
        :form="form"
        label="System User Access Token"
        :msg="$msg('appsettings.system_user_access_token')"
        :edit="canEdit"
        field="refreshToken"
        :tip="$msg('appsettings.facebook_system_user_access_token_tip')" />
    </div>
    <div v-else-if="id===4">
      <!-- UnityAds -->
      <om-form
        :form="form"
        label="Game ID"
        :msg="$msg('appsettings.game_id')"
        :edit="canEdit"
        field="adnAppKey"
        :tip="$msg('appsettings.unity_game_id_tip')" />
    </div>
    <div v-else-if="id===5">
      <!-- Vungle -->
      <om-form
        :form="form"
        label="App ID"
        :msg="$msg('appsettings.app_id')"
        :edit="canEdit"
        field="adnAppKey"
        :tip="$msg('appsettings.vungle_app_id_tip')" />
    </div>
    <div v-else-if="id===6">
      <!-- TencentAds -->
      <om-form
        :form="form"
        label="APP ID"
        :msg="$msg('appsettings.app_id')"
        :edit="canEdit"
        field="adnAppKey"
        :tip="$msg('appsettings.gdt_app_id_tip')" />
    </div>
    <div v-else-if="id===7">
      <!-- AdColony -->
      <om-form
        :form="form"
        label="APP ID"
        :msg="$msg('appsettings.app_id')"
        :edit="canEdit"
        field="adnAppKey"
        :tip="$msg('appsettings.adcolony_app_id_tip')" />
    </div>
    <div v-else-if="id===8">
      <!-- AppLovin -->
      <om-form
        :form="form"
        label="SDK Key"
        :msg="$msg('appsettings.sdk_key')"
        :edit="canEdit"
        field="adnAppKey"
        :tip="$msg('appsettings.applovin_sdk_key_tip')" />
    </div>
    <div v-else-if="id===9">
      <!-- Mopub -->
    </div>
    <div v-else-if="id===11">
      <!-- Tapjoy -->
      <om-form
        :form="form"
        label="SDK Key"
        :msg="$msg('appsettings.sdk_key')"
        :edit="canEdit"
        field="adnAppKey"
        :tip="$msg('appsettings.tapjoy_sdk_key_tip')" />
    </div>
    <div v-else-if="id===12">
      <!-- Chartboost -->
      <om-form
        :form="form"
        label="App ID"
        :msg="$msg('appsettings.app_id')"
        :edit="canEdit"
        field="cb_left"
        :tip="$msg('appsettings.chartboost_app_id_tip')" />
      <om-form
        :form="form"
        label="App Signature"
        :msg="$msg('appsettings.app_signature')"
        :edit="canEdit"
        field="cb_right"
        :tip="$msg('appsettings.chartboost_app_signature_tip')" />
    </div>
    <div v-else-if="id===13">
      <!-- Pangle -->
      <om-form
        :form="form"
        label="App ID"
        :msg="$msg('appsettings.app_id')"
        :tip="$msg('appsettings.pangle_app_id_tip')"
        :edit="canEdit"
        field="adnAppKey"
      />
    </div>
    <div v-else-if="id===14">
      <!-- Mintegral -->
      <om-form
        :form="form"
        label="App ID"
        :msg="$msg('appsettings.app_id')"
        :tip="$msg('appsettings.mintegral_app_id_tip')"
        :edit="canEdit"
        field="cb_left"
      />
      <om-form
        :form="form"
        label="App Key"
        :msg="$msg('appsettings.app_key')"
        :tip="$msg('appsettings.mintegral_app_key_tip')"
        :edit="canEdit"
        field="cb_right"
      />
    </div>
    <div v-else-if="id===15">
      <!-- IronSource -->
      <om-form
        :form="form"
        label="App Key"
        :msg="$msg('appsettings.app_key')"
        :edit="canEdit"
        field="adnAppKey"
        :tip="$msg('appsettings.ironsource_app_key_tip')" />
    </div>
    <div v-else-if="id===16">
      <!-- MyTarget -->
    </div>
    <div v-else-if="id===17">
      <!-- Helium ChartboostBid -->
      <om-form
        :form="form"
        label="App ID"
        :msg="$msg('appsettings.app_id')"
        :edit="canEdit"
        field="cb_left"
        :tip="$msg('appsettings.chartboost_app_id_tip')" />
      <om-form
        :form="form"
        label="App Signature"
        :msg="$msg('appsettings.app_signature')"
        :edit="canEdit"
        field="cb_right"
        :tip="$msg('appsettings.chartboost_app_signature_tip')" />
    </div>
    <div v-else-if="id===18">
      <!-- xiaomi -->
      <om-form
        :form="form"
        label="App ID"
        :msg="$msg('appsettings.app_id')"
        :edit="canEdit"
        field="cb_left" />
      <om-form
        :form="form"
        label="App Secret"
        :edit="canEdit"
        field="cb_right" />
    </div>
    <div v-else-if="id===30">
      <!-- Fyber -->
      <om-form
        :form="form"
        label="App ID"
        :msg="$msg('appsettings.app_id')"
        :edit="canEdit"
        field="adnAppKey"
      />
    </div>
    <div v-if="![ 3, 6 ].includes(id)">
      <a-tabs @change="changeAccountType" :default-active-key="activeKey" size="small" :tabBarGutter="8" type="card">
        <span slot="tabBarExtraContent">
          <img style="margin-right:4px;" src="/assets/Vector.svg"> Ad Network API key
        </span>
        <a-tab-pane key="1" tab="New API key" :disabled="!edit">
          <div v-if="createNew">
            <AccountEdit
              @authSuccess="authSuccess"
              :form="form"
              :reselect="createTag"
              style="margin-top:16px;"
              :create="true"
              @selectAccount="reSelectAcount"
              :edit="canEdit"
              :authType="1"
              :id="id" />
          </div>
        </a-tab-pane>
        <a-tab-pane style="margin-bottom: 16px" key="2" tab="Existing API key" :disabled="accounts.length===0">
          <AccountSelect
            style=""
            :form="form"
            :record="record"
            :create="true"
            :options="accounts"
            @action="newAccount"
            @accountSelect="accountChange"
            :edit="canEdit"
            :authType="1"
            :id="id"/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import omForm from '@/components/OmForm'
import AccountEdit from '@/views/adn/AccountEdit'
import CurrencySelect from '@/components/om/CurrencySelect'
import AccountSelect from './AccountSelect'

export default {
  components: {
    omForm,
    AccountEdit,
    CurrencySelect,
    AccountSelect
  },
  data () {
    return {
      labelCol: { lg: { span: 8 }, sm: { span: 8 } },
      wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
      canEdit: this.edit,
      createTag: false,
      createNew: false,
      activeKey: '1',
      account: !!((this.record && this.record.reportAccountId > 0))
    }
  },
  name: 'AdnAppEdit',
  props: {
    id: {
      type: Number,
      required: true
    },
    edit: {
      type: Boolean,
      default: true
    },
    record: {
      type: Object,
      default: () => { return {} }
    },
    accounts: {
      type: Array,
      default: null
    },
    form: {
      type: Object,
      default: null
    }
  },
  computed: mapState({
    searchApp: state => state.publisher.searchApp
  }),
  watch: {
    edit (val) {
      this.canEdit = val
    }
  },
  created () {
    if (this.accounts && this.accounts.length) {
      this.createNew = false
      this.activeKey = '2'
    } else {
      this.createNew = true
    }
    this.$emit('accountType', this.activeKey)
  },
  methods: {
    changeAccountType (val) {
      if (val === '2') {
        this.reSelectAcount()
      } else {
        this.newAccount()
      }
      this.$emit('accountType', val)
      this.activeKey = val
    },
    reSelectAcount () {
      this.createTag = false
      this.createNew = false
      this.form.resetFields(['userSignature', 'adnApiKey', 'userId'])
    },
    newAccount () {
      this.createTag = true
      this.createNew = true
      this.form.resetFields(['userSignature', 'adnApiKey', 'userId'])
    },
    accountChange (v) {
      this.$emit('accountSelect', v)
    },
    authSuccess (accountId) {
      this.$emit('authSuccess', accountId)
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
        callback(new Error(this.$msg('account.account_name')))
      } else {
        callback()
      }
    }
  }
}
</script>
<style type="less" scoped>
  img {
    margin-left:6px;margin-top:-5px;
  }
  .tip {
    position: absolute;
    top: 1px;
    margin-left: 8px;
  }
  .ant-form-item {
    margin-bottom: 12px;
  }
  .adn-app-create >>> .ant-tabs-top-content {
    margin-top: -16px;
    margin-left: -16px;
    margin-bottom: -16px;
    padding: 16px;
    width: 102%;
    background-color: #F5F5F5;
  }
  .adn-app-create >>> .ant-tabs-nav-scroll{    padding-left: 33.3%;
  }
  .adn-app-create >>> .ant-tabs-nav {
    font-size: 14px;
    font-weight: 400;
    font-style: normal;
  }
  .adn-app-create >>> .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    border: none;
    background: #F5F5F5 !important;
    border-color: #F5F5F5;
    border-bottom: 1px solid #fff;
  }
  .adn-app-create >>> .ant-tabs-extra-content {
    position: absolute;
    right: 67.3%;
    color: #333333;
  }
  .adn-app-create >>> .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    background: #E5E7EA;
    border: none;
  }
  .adn-app-create >>> .ant-tabs-nav .ant-tabs-tab {
    font-weight: normal;
  }
</style>
