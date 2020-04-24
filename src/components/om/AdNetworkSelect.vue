<!-- AdNetwork select component  the props defaultValue is the default checked  -->
<template>
  <a-form-item>
    <a-select
      showSearch
      :style="{ width: width }"
      placeholder="AdNetwork"
      :size="size"
      :disabled="disabled"
      :allowClear="true"
      :showArrow="false"
      mode="multiple"
      optionLabelProp="title"
      :maxTagCount="1"
      :maxTagPlaceholder="(h,vm) => '+' + (vm.value.length - 1)"
      v-decorator="[name, {initialValue: initValue}]"
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
import { adNetworkSelectList } from '../../api/mediation'

export default {
  name: 'OmAdNetworkSelect',
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
      type: Array,
      default () {
        return []
      }
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
  methods: {
    handleChange (value, option) {
      this.$emit('change', value)
    },
    async updateSelectList () {
      try {
        const res = await adNetworkSelectList()
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
