<template>
  <a-form>
    <div class="editable-cell">
      <div v-if="editable" class="editable-cell-input-wrapper">
        <a-input-number
          style="width:60px;"
          :min="1"
          :max="100"
          :value="value"
          @change="handleChange"
          @pressEnter="check" /><a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
          />
      </div>
      <div v-else class="editable-cell-text-wrapper">
        {{ value || ' ' }}
        <a-icon type="edit" class="editable-cell-icon" @click="edit" />
      </div>
    </div>
  </a-form>
</template>
<script>
export default {
  props: {
    text: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      value: this.text,
      editable: false
    }
  },
  created () {
    if (!this.text) {
      this.editable = true
    }
  },
  methods: {
    handleChange (e) {
      this.value = e
    },
    check () {
      if (!this.value) {
        this.$message.error(`Please input scence name`)
        return false
      }
      this.editable = false
      this.$emit('change', this.value)
    },
    edit () {
      this.editable = true
    }
  },
  watch: {
    text (val) {
      this.value = val
    }
  }
}
</script>
<style scoped>
.editable-cell {
    position: relative;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 24px;
    margin-left: 16px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 16px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }
</style>
