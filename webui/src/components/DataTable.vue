<template>
    <vxe-grid
        v-bind="gridOptions"
        :columns="columns"
        :data="datasource"
    >
      <template #toolbar_buttons>
        <YIcon icon="yiconmore" style="marginLeft: 5px" />
        <label :style="{ marginLeft: '5px' }">{{ title }}</label>
        <slot name="header-buttons" />
      </template>
      <template #operation="{ row }">
        <slot name="operation" v-bind="{row}"></slot>
      </template>
      <template #pager>
        <vxe-pager
          v-show="showPager"
          background
          :layouts="['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total']"
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          :total="total"
          @page-change="handlePageChange"
        >
        </vxe-pager>
      </template>
    </vxe-grid>
</template>
<script>
import { defineComponent, reactive } from 'vue'
import YIcon from './YIcon.vue'

export default defineComponent({
  props: ['columns', 'datasource', 'total', 'loading', 'showPager', 'showToolbar', 'title'],
  // eslint-disable-next-line no-unused-vars
  setup(props, context) {
    const tablePage = reactive({
      currentPage: 1,
      pageSize: 10
    })
    const gridOptions = reactive({
      border: true,
      height: 'auto',
      size: 'mini',
      stripe: true,
      loading: false,
      columnConfig: {
        resizable: true,
        showHeaderOverflow: true
      },
      rowConfig: {
        isHover: true,
        isCurrent: true
      },
      printConfig: {},
      toolbarConfig: {
        custom: true,
        slots: {
          buttons: 'toolbar_buttons'
        },
        enabled: props.showToolbar || false,
        refresh: false,
        import: false,
        export: true,
        print: false,
        zoom: true
      },
      importConfig: {
        remote: true,
        types: ['xlsx', 'csv', 'xls'],
        modes: ['insert'],
        // 自定义服务端导入
        importMethod({ file }) {
          const formBody = new FormData()
          formBody.append('file', file)
        }
      }
    })
    function handlePageChange() {
    }
    return {
      tablePage,
      gridOptions,
      handlePageChange
    }
  },
  components: { YIcon }
})
</script>
<style lang="scss" scoped>

</style>
