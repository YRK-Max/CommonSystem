<template>
    <vxe-grid
        v-bind="gridOptions"
        :columns="columns"
        :data="datasource"
    >
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

export default defineComponent({
  props: ['columns', 'datasource', 'total', 'loading', 'showPager', 'showToolbar'],
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
        enabled: props.showToolbar || false,
        refresh: false,
        import: true,
        export: true,
        print: false,
        zoom: true,
        custom: true
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
  }
})
</script>
<style lang="scss" scoped>

</style>
