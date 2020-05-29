<template>
  <a-form-item>
    <a-select
      v-if="initValue"
      showSearch
      :disabled="!edit"
      :size="size"
      v-decorator="[name, {initialValue: initValue, rules: [{ required: true, message: 'Currenct can not be empty.' }]}]"
      @change="handleChange">
      <a-select-option v-for="o in optionList" :key="o" :title="o">
        {{ o }}
      </a-select-option>
    </a-select>
    <a-select
      v-else
      showSearch
      :size="size"
      :disabled="!edit"
      optionLabelProp="title"
      v-decorator="[name, {rules: [{ required: true, message: 'currency can not be empty.' }]}]"
      @change="handleChange">
      <a-select-option v-for="o in optionList" :key="o" :title="o">
        {{ o }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<script>
import { currencyList } from '@/api/publisher'
export default {
  name: 'CurrencySelect',
  props: {
    size: {
      type: String,
      default: 'default'
    },
    name: {
      type: String,
      default: 'currency'
    },
    defaultValue: {
      type: String,
      default: null
    },
    status: {
      type: Number,
      default: 1
    },
    edit: {
      type: Boolean,
      defalut: true
    }
  },
  data () {
    return {
      initValue: this.defaultValue,
      optionList: []
    }
  },
  created () {
    currencyList().then(res => {
      this.optionList = res.data
    })
  },
  methods: {
    handleChange (value, option) {
      this.$emit('change', this.optionList.find(item => { return item === value }))
    }
  }
}
</script>
