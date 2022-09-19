<template>
    <div
      :id="id"
      class="h-full w-full"
    />
  </template>
<script>
import { chartResizeListen } from '@/utils/utils'
import * as echarts from 'echarts'
import { defineComponent, nextTick } from 'vue'
import { uuid } from 'vue-uuid'

export default defineComponent({
  props: {
    name: {
      type: String,
      default: () => { return 'Pie Name' }
    },
    data: {
      type: Array,
      default: () => {
        return [
          { value: 1048, name: 'Baidu' },
          { value: 335, name: 'Direct' },
          { value: 310, name: 'Email' },
          { value: 251, name: 'Google' }
        ]
      }
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.id))
    this.initChart()
  },
  watch: {
    data: {
      handler() {
        this.initChart()
      },
      deep: true
    }
  },
  setup(props) {
    const id = uuid.v1()
    const chart = null

    async function initChart() {
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '1%',
          width: '70%',
          type: 'scroll',
          left: 'left'
        },
        top: '15%',
        series: [
          {
            name: props.name,
            type: 'pie',
            radius: ['40%', '70%'],
            labelLine: {
              length: 30
            },
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              alignTo: 'labelLine',
              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: props.data
          }
        ]
      }
      await nextTick()
      this.chart.setOption(option)
      chartResizeListen(this, this.chart, this.id)
    }

    return {
      id,
      chart,
      initChart
    }
  }
})
</script>

