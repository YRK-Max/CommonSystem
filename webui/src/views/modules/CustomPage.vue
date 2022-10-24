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
                    <div style="height: 20px;" class="flex justify-end">
                        <div class="bg-red-500 flex justify-center items-center" style="height: 22px; width: 22px; border-radius: 6px;">
                            <y-icon icon="yiconlajitong" color="white" :size="15" />
                        </div>
                    </div>
                    <div style="height: calc(100% - 20px)" class="flex justify-center items-center">
                        <y-icon :icon="getIconStrByType(item.type)" :size="30" />
                    </div>
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
export default defineComponent({
  components: {
    GridLayout,
    GridItem,
    YIcon
  },
  setup() {
    const layout = [
      { 'x': 0, 'y': 0, 'w': 6, 'h': 11, 'i': '0', 'moved': false, 'type': 'chart' },
      { 'x': 2, 'y': 11, 'w': 2, 'h': 4, 'i': '1', 'moved': false },
      { 'x': 4, 'y': 11, 'w': 2, 'h': 5, 'i': '2', 'moved': false },
      { 'x': 6, 'y': 0, 'w': 6, 'h': 11, 'i': '3', 'moved': false, 'type': 'chart' }
    ]

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

    return {
      layout,
      handlePrintData,
      getIconStrByType
    }
  }
})
</script>
<style lang="scss" scoped>
.vue-grid-item:not(.vue-grid-placeholder) {
    background: rgb(238, 238, 238);
    border: 1px solid black;
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
