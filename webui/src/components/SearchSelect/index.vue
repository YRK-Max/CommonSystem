<template>
  <vxe-pulldown :transfer="true" ref="xDown">
    <template #default>
      <vxe-input v-model="model"
        clearable
        suffix-icon="vxe-icon--caret-bottom"
        placeholder="请搜索"
                        @focus="handleFocus"
        @keyup="handleKeyUp"
        @clear="handleClear"
        @suffix-click="handleFocus"
      />
    </template>
    <template #dropdown>
      <div class="dropdown-class">
        <div class="list-item" v-for="item in displaySource" :key="item[optionConfig.value]" @click="handleSelect(item)">
          <i class="fa fa-user-o"></i>
          <span>{{ item[optionConfig.label] }}</span>
        </div>
      </div>
    </template>
  </vxe-pulldown>
</template>

<script>
export default {
  name: 'SearchSelect',
  model: {
    prop: 'model',
    event: 'changed'
  },
  props: {
    options: {
      type: Object,
      default: () => ({ options: [] })
    },
    optionConfig: {
      type: Object,
      default: () => ({ label: 'label', value: 'value' })
    }
  },
  data() {
    return {
      model: '',
      datasource: [],
      displaySource: []
    }
  },
  watch: {
    'options': {
      // eslint-disable-next-line no-unused-vars
      handler(n, o) {
        this.datasource = n['options']
        this.displaySource = this.datasource
      },
      deep: true
    }
  },
  methods: {
    handleFocus() {
      this.$refs.xDown.showPanel()
    },
    handleKeyUp() {
      const { model } = this
      this.displaySource = model ? this.datasource.filter(item => item[this.optionConfig.label].indexOf(model) > -1) : this.datasource
    },
    handleSelect(item) {
      this.model = item[this.optionConfig.label]
      this.$emit('changed', item[this.optionConfig.value])
      this.$emit('change', item[this.optionConfig.value])
      this.$refs.xDown.hidePanel()
    },
    handleClear() {
      this.$emit('changed', '')
      this.$emit('change', '')
      this.displaySource = this.datasource
    },
    clear() {
      this.$emit('changed', '')
      this.$emit('change', '')
      this.displaySource = []
      this.model = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-class {
  height: 200px;
  overflow: auto;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
}
.list-item {
  padding: 3px 0 3px 8px;
}
.list-item:hover {
  background-color: #f5f7fa;
}
</style>
