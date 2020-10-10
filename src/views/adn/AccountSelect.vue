<template>
  <a-row :gutter="8" style="text-align: center;color: #999999;">
    <a-row style="margin-bottom: 8px;">Select An Existing API Key</a-row>
    <a-row v-for="(item, index) in options" :key="item.id">
      <a-col :span="4"></a-col>
      <a-col :span="16" style="text-align: center;">
        <div @click="change(item.id)" v-if="![4,9,11,12,13,14,15,17,30].includes(id)" class="account-info-box" :style="edit? 'cursor: pointer;': 'opacity: 0.5;'">
          <a-row :gutter="8" style="text-align: left">
            <a-col :span="18">
              <div class="account-title">{{ accountMap[id].t1 }}</div>
              <div class="account-value">{{ item[accountMap[id].v1] }}</div>
            </a-col>
            <a-col :span="6">
              <a v-if="index===0 && curAccountId" @click="editAccount" style="position: absolute;top: -40px;right: -10px;"><img src="/icon/Edit.svg"> Edit API Key</a>
              <img v-if="item.id===curAccountId" src="/icon/account-select.svg" style="border-radius: 4px;float: right;position: absolute;right: -12px;top: -16px;">
              <img style="position: absolute;" src="/icon/account_line.svg">
              <div style="padding-left:16px;"><span style="color: #333333">Currency</span> {{ item.currency }}</div>
              <div class="account-apps" style="text-align: left;padding-left: 14px;">
                <img v-for="(vv, i) in item.appIcons" :src="vv?vv:''" :style="i>1?'display: none;': null" :key="vv"/>
                <a-tooltip placement="bottom">
                  <span v-if="item.appIcons.length>2" class="icon-size" >+{{ item.appIcons.length-2 }}</span>
                  <div slot="title" class="account-apps">
                    Apps<br>
                    <img v-for="(vv) in item.appIcons" :src="vv?vv:''" :key="vv"/>
                  </div>
                </a-tooltip>
                <span v-if="!item.appIcons">--</span>
              </div>
            </a-col>
          </a-row>
        </div>
        <div @click="change(item.id)" v-else class="account-info-box2" :style="edit? 'cursor: pointer;': 'opacity: 0.5;'">
          <a-row :gutter="8" style="text-align: left">
            <a-col :span="11">
              <div class="account-title">{{ accountMap[id].t1 }}</div>
              <div class="account-value">{{ item[accountMap[id].v1] }}</div>
            </a-col>
            <a-col :span="9">
              <div class="account-title">{{ accountMap[id].t2 }}</div>
              <div class="account-value">{{ item[accountMap[id].v2] }}</div>
            </a-col>
            <a-col :span="4">
              <a v-if="index===0 && curAccountId" @click="editAccount" style="position: absolute;top: -40px;right: -10px;"><img src="/icon/Edit.svg"> Edit API Key</a>
              <img v-if="item.id===curAccountId" src="/icon/account-select.svg" style="border-radius: 4px;float: right;position: absolute;right: -12px;top: -16px;">
              <img style="position: absolute;" src="/icon/account_line.svg">
              <div style="padding-left:16px;"><span style="color: #333333">Currency</span> {{ item.currency }}</div>
              <div class="account-apps" style="text-align: left;padding-left: 14px;">
                <img
                  v-for="(vv, ind) in item.appIcons"
                  :src="vv?vv:''"
                  :style="ind>1?'display: none;': null"
                  :key="vv"/>
                <a-tooltip placement="bottom">
                  <span v-if="item.appIcons.length>2" class="icon-size">+{{ item.appIcons.length-2 }}</span>
                  <div slot="title" class="account-apps">
                    Apps<br>
                    <img v-for="(vv) in item.appIcons" :src="vv?vv:''" :key="vv"/>
                  </div>
                </a-tooltip>
                <span v-if="!item.appIcons">--</span>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="4"></a-col>
    </a-row>
  </a-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AccountSelect',
  props: {
    id: {
      type: Number,
      default: 0
    },
    edit: {
      type: Boolean,
      default: true
    },
    create: {
      type: Boolean,
      default: false
    },
    authType: {
      type: Number,
      default: 1
    },
    options: {
      type: Array,
      default: null
    },
    record: {
      type: Object,
      default: null
    },
    form: {
      type: Object,
      default: null
    }
  },
  data () {
    const accountMap = {
      1: { t1: 'API Token', v1: 'adnAppToken' },
      2: { t1: 'Publisher ID', v1: 'userId' },
      4: { t1: 'Monetization Stats API key', v1: 'adnApiKey', t2: 'Organization core ID', v2: 'userId' },
      5: { t1: 'Reporting API Key', v1: 'adnApiKey' },
      7: { t1: 'Read-Only API Key', v1: 'adnAppToken' },
      8: { t1: 'Report Key', v1: 'adnApiKey' },
      9: { t1: 'API Key', v1: 'adnAppId', t2: 'Inventory Report ID', v2: 'adnApiKey' },
      11: { t1: 'Publisher Reporting API Key', v1: 'adnAppToken', t2: 'Ad Reporting API Key', v2: 'adnApiKey' },
      12: { t1: 'User ID', v1: 'userId', t2: 'User Signature', v2: 'userSignature' },
      13: { t1: 'User ID', v1: 'userId', t2: 'Security-Key', v2: 'userSignature' },
      14: { t1: 'Report API SKey', v1: 'adnApiKey', t2: 'Report API Secret', v2: 'userSignature' },
      15: { t1: 'User Name', v1: 'userId', t2: 'Secret Key', v2: 'userSignature' },
      17: { t1: 'User ID', v1: 'userId', t2: 'User Signature', v2: 'userSignature' },
      18: { t1: 'App Token', v1: 'adnAppToken' },
      30: { t1: 'Publisher ID', v1: 'userId', t2: 'Consumer Key', v2: 'adnApiKey' }
    }
    return {
      accountMap,
      accountId: this.id,
      optionList: {},
      curAccountId: this.record.reportAccountId
    }
  },
  mounted () {
    if (this.curAccountId) {
      this.$emit('accountSelect', this.curAccountId)
    }
  },
  computed: mapState({
  }),
  methods: {
    change (v) {
      if (this.edit) {
        this.curAccountId = v
        this.$emit('accountSelect', this.curAccountId)
      }
    },
    editAccount () {
      this.$router.push({
        path: '/adn/account',
        query: { id: this.curAccountId }
      })
    }
  }
}
</script>
<style>
  .account-info-box2 {
    background-color: white;
    width: 724px;
    height:84px;
    margin: 0 auto;
    margin-top: 16px;
    padding: 16px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.06), 0 0 6px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
  }
  .account-info-box {
    background-color: white;
    width: 508px;
    height:84px;
    margin: 0 auto;
    margin-top: 16px;
    padding: 16px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.06), 0 0 6px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
  }
  .account-apps {
    max-width: 120px;
  }
  .account-apps img {
    height:26px;margin:2px;
  }
  .icon-size {
    height: 22px;
    width: 22px;
    margin: 2px;
    text-align: center;
    background: #999999;
    border-radius: 4px;
    font-size: 12px;
    padding: 4px 6px 5px 7px;
    color: white;
  }
  .account-title {
    color: #333333;line-height: 16px;
  }
  .account-value {
    line-height: 16px;font-size: 12px;overflow-wrap: break-word;white-space: normal;margin-top: 4px;
  }
  .account-icons {
    height: 22px;width: 22px;margin: 2px;text-align: center;background: #999999;border-radius: 4px;font-size: 12px;padding: 4px 6px 5px 7px;color: white;
  }
</style>
