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
    xAxis: {
      type: Array,
      default: () => { return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }
    },
    series: {
      type: Array,
      default: () => {
        return [
          {
            name: 'clone1',
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'bar',
            barMaxWidth: 20,
            itemStyle: {
              normal: {
                barBorderRadius: [8, 8, 0, 0]
              }
            }
          }
        ]
      }
    },
    yAxis: {
      type: Array,
      default: () => {
        return [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.id))
    this.initChart()
  },
  watch: {
    series: {
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
        grid: {
          show: true,
          top: '19%',
          left: '8%',
          right: '6%',
          bottom: '16%'
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {}
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: '3%'
        },
        xAxis: {
          type: 'category',
          data: props.xAxis,
          axisLabel: {
            // interval: this.axisLabelInterval,
            rotate: 38,
            textStyle: {
              color: '#666666'
            },
            margin: 10
          }
        },
        yAxis: props.yAxis,
        series: props.series
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

