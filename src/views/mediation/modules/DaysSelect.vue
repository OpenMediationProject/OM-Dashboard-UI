<template>
  <div>
    <a-select :value="selectedKey" style="width: 160px" @change="handleChange">
      <a-icon slot="suffixIcon" type="calendar" />
      <a-select-option v-for="option in options" :key="option.key" :value="option.key">
        {{ option.value }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>

export default {
  data () {
    return {
      options: [
        {
          key: 1,
          value: this.$t('mediation.Yesterday')
        },
        {
          key: 3,
          value: this.$t('mediation.Last_3_days')
        },
        {
          key: 7,
          value: this.$t('mediation.Last_7_days')
        },
        {
          key: 14,
          value: this.$t('mediation.Last_14_days')
        },
        {
          key: 30,
          value: this.$t('mediation.Last_30_days')
        }
      ],
      selectedKey: 1
    }
  },
  props: {
    defaultValue: {
      type: Number,
      default: null
    }
  },
  methods: {
    handleChange (v) {
      this.selectedKey = v
      this.$emit('change', v)
    }
  }
}

</script>

<style lang='less' scoped>
</style>
