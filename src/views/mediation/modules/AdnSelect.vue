<!-- AdNetwork select component  the props defaultValue is the default checked  -->
<template>
  <div class="selectBox">
    <a-select
      :style="{ width: width }"
      :placeholder="$t('adn.AdNetwork')"
      :size="size"
      :disabled="disabled"
      optionLabelProp="title"
      v-model="value"
      @change="handleChange">
      <a-icon slot="suffixIcon" type="down" />
      <a-select-option v-for="adn in optionList" :key="adn.id" :disabled="!adn.adNetworkAppId" :title="adn.className">
        <div class="selected-app-small">
          <a-badge :status="adn.adNetworkAppId ? 'success':'default'" /><img style="height:24px;" :src="biddingIds.includes(adn.id) ? GLOBAL.getAdnIconById(adn.id).iconBidding : GLOBAL.getAdnIconById(adn.id).icon">
        </div>
      </a-select-option>
    </a-select>
    <span v-if="showBiddingIcon" class="iconfont iconSelect">&#xe61a;</span>
  </div>
</template>

<script>
import { adNetworkSelectList } from '@/api/mediation'
import { mapState } from 'vuex'
export default {
  name: 'ADNSelect',
  props: {
    width: {
      type: String,
      default: '220px'
    },
    size: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    adtDisable: {
      type: Boolean,
      default: true
    },
    placementId: {
      type: Number,
      default: null
    },
    hasAdt: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      optionList: {},
      value: undefined,
      biddingIds: [1, 3, 14, 17, 23, 26],
      onlyBiddingIds: [1, 17, 23, 26],
      showBiddingIcon: false,
      onlyShowBiddingIcon: false
    }
  },
  computed: mapState({
    isNgp: state => state.user.info.isNgp,
    searchPlacementType: state => state.publisher.searchPlacementType
  }),
  methods: {
    setAdnId (val) {
      this.value = val
      this.changeIcon(this.value)
    },
    getAdnId () {
      return this.value
    },
    handleChange (value, type) {
      this.changeIcon(value)
      this.$emit('change', this.optionList.find(item => { return item.id === value }), this.onlyShowBiddingIcon)
    },
    changeIcon (value) {
      if (this.biddingIds.includes(value)) {
        this.showBiddingIcon = true
      } else {
        this.showBiddingIcon = false
      }
      if (this.onlyBiddingIds.includes(value)) {
        this.onlyShowBiddingIcon = true
      } else {
        this.onlyShowBiddingIcon = false
      }
    },
    async updateSelectList () {
      try {
        const params = { pubAppId: this.$store.state.publisher.searchApp }
        if (this.placementId) {
          params.placementId = this.placementId
        }
        const res = await adNetworkSelectList(params)
        res.data.forEach(item => {
          if (item.className === 'Buad') {
            item.className = 'Pangle'
          }
          if (item.className === 'Gdt') {
            item.className = 'TencentAds'
          }
          if (item.className === 'ChartboostBid') {
            item.className = 'Helium'
          }
          if (item.className === 'TikTok') {
            item.className = '穿山甲'
          }
          if (item.className === 'TencentAd') {
            item.className = '优量汇'
          }
          if (item.className === 'HyBid') {
            item.className = 'PubNative'
          }
          if (item.className === 'KsAd') {
            item.className = 'KuaiShou'
          }
        })
        this.optionList = res.data.filter(row => row.id !== 18)
        if (this.searchPlacementType === 0) {
          this.optionList = this.optionList.filter(row => row.id !== 15)
        }
      } catch (e) {
        console.log('get adn list error', e)
      }
    }
  },
  created () {
    this.updateSelectList()
  }
}
</script>
<style lang='less' scoped>
@import '~ant-design-vue/dist/antd.less';
@bidding-color: #B28BD9;
.selectBox {
  position: relative;
}
.iconfont {
  color: @bidding-color!important;
}
.iconSelect {
  position: absolute;
  left: 100px;
  top: 50%;
  transform: translateY(-50%);
}
.iconOption {
  position: absolute;
  left: 180px;
  top: 50%;
  transform: translateY(-50%);
}
.AdnSelect{
  width: 140px;
  height: 32px;
  background: #E0F6FF;
}
/deep/ .ant-select-selection {
  width: 140px;
  height: 32px;
  background: #E0F6FF;
  border-radius: 16px;
  border: 0;
  color: #1A7DF1;
  margin: 12px 0;
}
/deep/ .ant-select-selection__placeholder, /deep/ .ant-select-selection-selected-value{
  font-family: Arial;
  font-style: normal;
  font-weight: normal;
  color: #1A7DF1;
  font-size: 18px;
//   line-height: 32px;
}
/deep/ .ant-select-arrow .ant-select-arrow-icon {
  color: #1A7DF1;
}
</style>
