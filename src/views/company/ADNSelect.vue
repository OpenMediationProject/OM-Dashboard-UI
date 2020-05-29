<template>
  <a-form-item>
    <a-select
      v-if="initValue>=0"
      showSearch
      :style="{ width: width }"
      placeholder="AdNetwork"
      :size="size"
      :disabled="disabled"
      optionLabelProp="title"
      v-decorator="[name, {initialValue: initValue, rules: [{ required: true, message: 'Ad Network can not be empty.' }]}]"
      @change="handleChange">
      <a-select-option v-for="adn in optionList" :key="adn.id" :title="adn.className">
        <div class="selected-app-small">
          <img style="height:24px;" :src="'/logo/'+adn.className + '.svg'">
        </div>
      </a-select-option>
    </a-select>
    <a-select
      v-else
      showSearch
      :style="{ width: width }"
      placeholder="AdNetwork"
      :size="size"
      :disabled="disabled"
      optionLabelProp="title"
      v-decorator="[name, {rules: [{ required: true, message: 'Ad Network can not be empty.' }]}]"
      @change="handleChange">
      <a-select-option v-for="adn in optionList" :key="adn.id" :title="adn.className">
        <div class="selected-app-small">
          <img style="height:24px;" :src="'/logo/'+adn.className + '.svg'">
        </div>
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { adNetworkSelectList } from '@/api/mediation'
import { mapState } from 'vuex'
export default {
  name: 'ADNSelect',
  props: {
    width: {
      type: String,
      default: '200px'
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
    }
  },
  data () {
    return {
      initValue: this.defaultValue,
      optionList: {}
    }
  },
  computed: mapState({
    isNgp: state => state.user.info.isNgp
  }),
  methods: {
    handleChange (value, option) {
      this.$emit('change', this.optionList.find(item => { return item.id === value }))
    },
    async updateSelectList () {
      try {
        const res = await adNetworkSelectList({ pubAppId: this.$store.state.publisher.searchApp })
        res.data.forEach(item => {
          if (item.className === 'Buad') {
            item.className = 'Pangle'
          }
        })
        this.optionList = res.data.filter(item => { return ![3, 6].includes(item.id) })
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
