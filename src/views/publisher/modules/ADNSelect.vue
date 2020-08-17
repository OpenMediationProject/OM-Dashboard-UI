<!-- AdNetwork select component  the props defaultValue is the default checked  -->
<template>
  <a-form-item>
    <a-select
      v-if="initValue>=0"
      showSearch
      :style="{ width: width }"
      placeholder="Ad Network"
      :size="size"
      :disabled="disabled"
      optionLabelProp="title"
      v-decorator="[name, {initialValue: initValue, rules: [{ required: true, message: this.$msg('instance.adn_empty') }]}]"
      @change="handleChange">
      <a-select-option v-for="adn in optionList" :key="adn.id" :disabled="!adn.adNetworkAppId" :title="adn.className">
        <div class="selected-app-small">
          <a-badge :status="adn.adNetworkAppId ? 'success':'default'" /><img style="height:24px;" :src="'/logo/'+adn.className + '.svg'">
        </div>
      </a-select-option>
    </a-select>
    <a-select
      v-else
      :style="{ width: width }"
      placeholder="Ad Network"
      :size="size"
      :disabled="disabled"
      optionLabelProp="title"
      v-decorator="[name, {rules: [{ required: true, message: this.$msg('instance.adn_empty') }]}]"
      @change="handleChange">
      <a-select-option v-for="adn in optionList" :key="adn.id" :disabled="!adn.adNetworkAppId" :title="adn.className">
        <div class="selected-app-small">
          <a-badge :status="adn.adNetworkAppId ? 'success':'default'" /><img style="height:24px;" :src="'/logo/'+adn.className + '.svg'">
        </div>
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { adNetworkSelectList } from '@/api/mediation'
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
    name: {
      type: String,
      default: 'adnId'
    },
    defaultValue: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placementId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      initValue: this.defaultValue,
      optionList: {}
    }
  },
  methods: {
    handleChange (value, option) {
      this.$emit('change', this.optionList.find(item => { return item.id === value }))
    },
    async updateSelectList () {
      try {
        const params = { pubAppId: this.$store.state.publisher.searchApp }
        if (this.placementId) {
          params.placementId = this.placementId
        }
        const res = await adNetworkSelectList(params)
        this.optionList = res.data
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
