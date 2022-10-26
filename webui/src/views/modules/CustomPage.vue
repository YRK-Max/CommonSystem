<template>
    <div
        class="p-2 h-full overflow-hidden flex"
        style="background: #ebeef3"
    >
        <div class="h-full overflow-auto bg-white" style="width: calc(100% - 306px); margin-right: 6px;">
            <grid-layout
                :layout.sync="layout"
                :col-num="12"
                :row-height="30"
                :is-draggable="true"
                :is-resizable="true"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[10, 10]"
                :use-css-transforms="true"
            >

                <grid-item
                    class="p-1"
                    v-for="item in layout"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    :key="item.i"
                >
                  <el-card class="h-full w-full" body-style="height: 100%">
                    <component :is="getComponentID(item.type)"></component>
                  </el-card>
                </grid-item>
            </grid-layout>
        </div>
        <div class="bg-white p-2" style="width: 300px">
            <el-button @click="handlePrintData">查看</el-button>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
import YIcon from '@/components/YIcon.vue'
import LineChart from '@/components/charts/LineChart.vue'
import DataTable from '@/components/DataTable.vue'
import Empty from '@/components/Empty.vue'

export default defineComponent({
  components: {
    GridLayout,
    GridItem,
    YIcon
  },
  setup() {
    const layout = [
      {
        'x': 0,
        'y': 3,
        'w': 6,
        'h': 11,
        'i': '0',
        'moved': false,
        'type': 'chart'
      },
      {
        'x': 0,
        'y': 0,
        'w': 12,
        'h': 3,
        'i': '1',
        'moved': false
      },
      {
        'x': 0,
        'y': 14,
        'w': 12,
        'h': 10,
        'i': '2',
        'moved': false,
        'type': 'table'
      },
      {
        'x': 6,
        'y': 3,
        'w': 6,
        'h': 11,
        'i': '3',
        'moved': false,
        'type': 'chart'
      }
    ]
    const componentId = LineChart

    const handlePrintData = () => {
      console.log(layout)
    }

    const getIconStrByType = (type) => {
      switch (type) {
        case 'chart': return 'yiconchart-bar'
        case 'table': return 'yicontable'
        case 'params': return 'yiconlight-component-control-doublecondition'
        default: return 'yicontihuanNULLzhi'
      }
    }

    const getComponentID = (type) => {
      switch (type) {
        case 'chart': return LineChart
        case 'table': return DataTable
        default: return Empty
      }
    }

    return {
      layout,
      componentId,
      handlePrintData,
      getIconStrByType,
      getComponentID
    }
  }
})
</script>
<style lang="scss" scoped>
.vue-grid-item:not(.vue-grid-placeholder) {
    border: 1px solid rgb(121, 121, 121);
    border-radius: 3px;
}
.vue-grid-item .resizing {
    opacity: 0.9;
}
.vue-grid-item .static {
    background: #cce;
}
.vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
}
</style>
