<!-- Regions select component  the props defaultSelected is the default value with tree select  -->
<template>
  <a-select
    showSearch
    :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
    :showArrow="required"
    :allowClear="!required"
    :mode="mode"
    placeholder="Region"
    :disabled="!edit"
    optionLabelProp="value"
    :filterOption="filterOption"
    @change="onChange"
    v-model="value">
    <a-select-option v-for="item in data" :disabled="disabledIds.includes(item.key)" :key="item.key">
      <p style="display:none;">{{ item.text }}</p>
      {{ item.title }}
    </a-select-option>
  </a-select>
</template>

<script>
import { mapState } from 'vuex'
import { regionList } from '@/api/mediation'

export default {
  name: 'OmRegionsSelect',
  data () {
    return {
      value: this.selected && this.selected.length > 0 ? this.selected : this.defaultSelected,
      data: [],
      disabledIds: this.selecteds || []
    }
  },
  props: {
    defaultSelected: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: null
    },
    name: {
      type: String,
      default: 'country'
    },
    required: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String,
      default: 'null'
    },
    edit: {
      type: Boolean,
      default: true
    },
    selecteds: {
      type: Array,
      default () {
        return []
      }
    }
  },
  created () {
    this.updateRegions(this.selectedPubAppId)
  },
  computed: mapState({
    selectedPubAppId: state => state.publisher.searchApp
  }),
  watch: {
    selectedPubAppId (pubAppId) {
      this.updateRegions(pubAppId)
    },
    defaultSelected (val) {
      this.value = val
    },
    selected (val) {
      this.value = val
    }
  },
  methods: {
    onChange (val) {
      this.value = val
      this.$emit('change', val)
    },
    buildNode (a) {
      return { key: a.a2, title: a.a2 + ' - ' + a.name, value: a.a2, text: [a.a2, a.a3, a.name].join(' ').toLowerCase() }
    },
    updateRegions () {
      const params = {}
      params[new Date().getTime()] = 1
      regionList(params)
        .then(res => {
          const { top, all } = res.data
          const list = []
          top.forEach(item => {
            list.push(this.buildNode(item))
          })
          all.forEach(item => {
            list.push(this.buildNode(item))
          })
          this.data = list
        })
    },
    filterOption (input, option) {
      return (option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }
  }
}
</script>
