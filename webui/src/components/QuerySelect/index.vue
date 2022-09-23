<template>
  <vxe-select
    v-model="model"
    placeholder="请选择"
    clearable
    :multiple="multiple"
    :transfer="true"
    style="width: 100%"
    @clear="handleClear"
  >
    <vxe-option
      v-for="option in optionsList"
      :key="option[optionConfig.value]"
      :value="option[optionConfig.value]"
      :label="option[optionConfig.label]"
    />
  </vxe-select>
</template>

<script>
import { executeSQL } from '@/api/server'

export default {
  name: 'QuerySelect',
  model: {
    prop: 'model',
    event: 'changed'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['optionConfig', 'isRemote', 'params', 'options', 'method', 'displayFirstDefault', 'multiple'],
  data() {
    return {
      optionsList: [],
      model: '',
      params_real: {}
    }
  },
  watch: {
    'params': {
      // eslint-disable-next-line no-unused-vars
      handler(n, o) {
        this.params_real = n
        this.queryResult()
      },
      deep: true
    },
    'options': {
      // eslint-disable-next-line no-unused-vars
      handler(n, o) {
        this.optionsList = n['options']
        if (this.displayFirstDefault && this.optionsList.length > 0) {
          this.model = this.optionsList[0][this.optionConfig.value]
        }
      },
      deep: true
    }
  },
  mounted() {
    this.params_real = this.params
    this.queryResult()
  },
  methods: {
    queryResult() {
      const that = this
      if (this.isRemote) {
        executeSQL(this.params_real).then(res => {
          if (res && res['code'] === 200) {
            that.optionsList = res.data
          } else {
            that.optionsList = []
          }
        })
      } else {
        this.optionsList = this.options
      }
    },
    handleChange(val) {
      if (val['value']) {
        this.$emit('changed', val['value'])
        this.$emit('change', val['value'])
      }
    },
    handleClear() {
      this.$emit('changed', '')
      this.$emit('change', '')
    },
    clear() {
      this.model = ''
      this.optionsList = []
      this.queryResult()
    }
  }
}
</script>

<style scoped>

</style>
