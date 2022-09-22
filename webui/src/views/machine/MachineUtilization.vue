<template>
  <div class="p-2 overflow-hidden h-full" style="background: #ebeef3">
    <el-row class="enter-y h-full" :gutter="6">
      <el-col class="h-full" :span="4">
        <el-card class="h-full" header="设备组/机台">
          <el-input v-model="filterText" placeholder="Filter keyword" />
          <el-tree
            ref="treeRef"
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            highlight-current
            :filter-node-method="filterNode"
            current-node-key="CBC-01"
            @node-click="handleMachineChange"
          />
        </el-card>
      </el-col>
      <el-col style="display: flex" class="h-full flex-col" :span="20">
        <el-card class="mb-2">
          <vxe-form
            ref="xWaterUseForm"
            title-width="80px"
            :loading="loading"
            :data="form"
            @submit="queryData"
          >
            <vxe-form-item
              span="5"
              title="采集时间段"
              field="startTime"
              title-overflow="ellipsis"
            >
              <template #default>
                <vxe-input
                  v-model="form.startTime"
                  placeholder="时间选择"
                  type="datetime"
                  :editable="false"
                />
              </template>
            </vxe-form-item>
            <vxe-form-item
              span="5"
              title="~"
              title-width="25px"
              field="endTime"
              title-overflow="ellipsis"
            >
              <template #default>
                <vxe-input
                  v-model="form.endTime"
                  placeholder="时间选择"
                  type="datetime"
                  :editable="false"
                />
              </template>
            </vxe-form-item>
            <vxe-form-item span="4">
              <template #default>
                <vxe-button
                  type="submit"
                  status="primary"
                  size="small"
                >查询</vxe-button>
                <vxe-button
                  type="reset"
                  v-if="false"
                  size="small"
                >重置</vxe-button>
              </template>
            </vxe-form-item>
          </vxe-form>
        </el-card>
        <el-card v-if="loading" style="flex: 1; color: #426cb9" class="flex items-center justify-center">
          <div>
            <YIcon class="loading" icon="yiconloading" color="#426cb9" :size="25" />
            加载中....
          </div>
        </el-card>
        <el-row v-show="!loading" class="mb-2" :gutter="6">
          <el-col :span="6">
            <InfoCard
              icon="yicontanhao"
              color="#ff942f"
              bgColor="#ffead6"
              title="未清除的报警"
              label1="Serious"
              label2="Warning"
              :num1="machineInfo.sc"
              :num2="machineInfo.wc"
              class="mb-2"
              style="height: 120px; background: linear-gradient(135deg,#ffffff,#ffaf63);"
            ></InfoCard>
            <el-card header="设备实时信息">
              <div class="h-50">
                <el-descriptions
                  :column="1"
                  :size="size"
                >
                  <el-descriptions-item label="设备名称" label-class-name="font-bold inline-block w-20">{{ machineInfo.name }}</el-descriptions-item>
                  <el-descriptions-item label="设备编号" label-class-name="font-bold inline-block w-20">{{ machineInfo.code }}</el-descriptions-item>
                  <el-descriptions-item label="设备状态" label-class-name="font-bold inline-block w-20">
                    <el-tag size="small">RUN</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="当前工单" label-class-name="font-bold inline-block w-20">{{ machineInfo.workOrder }}</el-descriptions-item>
                  <el-descriptions-item label="物料号" label-class-name="font-bold inline-block w-20">{{ machineInfo.material }}</el-descriptions-item>
                  <el-descriptions-item label="最新事件" label-class-name="font-bold inline-block w-20">{{ machineInfo.event }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>
          </el-col>
          <el-col :span="9">
            <el-card header="设备稼动图表">
              <BarChart
                v-if="!loading"
                class="h-82"
                :xAxis="chartData.xAxis"
                :yAxis="chartData.yAxis"
                :series="chartData.series"
              />
            </el-card>
          </el-col>
          <el-col :span="9">
            <el-card header="设备状态甘特图">
              <div class="h-82" id="MacStateDuration"></div>
            </el-card>
          </el-col>
        </el-row>
        <el-card v-if="!loading" class="flex-1" :body-style="{ height: '100%' }">
          <DataTable
            title="设备操作记录"
            :showToolbar="true"
            :columns="tableData.columns"
            :data="tableData.datasource"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getCurrentTime } from '@/utils/utils'
import { defineComponent, ref, reactive, watch } from 'vue'
import DataTable from '@/components/DataTable.vue'
import YIcon from '@/components/YIcon.vue'
import BarChart from '@/components/charts/BarChart.vue'
import InfoCard from '@/components/InfoCard.vue'
import * as echarts from 'echarts'
import msData from '@/assets/files/macState.json'
import { formatDate } from '@/utils/utils'
export default defineComponent({
  setup() {
    const loading = ref(false)
    const form = reactive({
      startTime: getCurrentTime('date', -7, 'day'),
      endTime: getCurrentTime('date')
    })
    const filterText = ref('')
    const treeRef = ref()
    const defaultProps = {
      children: 'children',
      label: 'label'
    }
    const treeData = reactive([
      {
        id: 'Cu Line',
        label: 'Cu Line',
        children: [
          {
            id: 'CBC-01',
            label: '铜线去膜机台01 [CBC-01]'
          },
          {
            id: 'CFCMP-01',
            label: '铜线精抛机台01[CFCMP-01]'
          },
          {
            id: 3,
            label: '铜线绿光目检机台01[CGI-01]'
          },
          {
            id: 4,
            label: '铜线打包机台01[CP-01]'
          },
          {
            id: 5,
            label: '铜线清洗机台01[CSC-01]'
          },
          {
            id: 6,
            label: '铜线粗抛机台01[CSCMP-01]'
          }
        ]
      },
      {
        id: 'Non Cu Line',
        label: 'Non Cu Line',
        children: [
          {
            id: 'CBC-01',
            label: '非铜线去膜机台01[FBC-01]'
          },
          {
            id: 'CFCMP-01',
            label: '非铜线精抛机台01[FFCMP-01]'
          },
          {
            id: 3,
            label: '非铜线FQC01[FFQC-01]'
          },
          {
            id: 4,
            label: '非铜线绿光目检机台01[FGI-01]'
          },
          {
            id: 5,
            label: '非铜线打包机台01[FP-01]'
          },
          {
            id: 6,
            label: '非铜线清洗机台01[FSC-01]'
          }
        ]
      }
    ])
    const tableData = reactive({
      columns: [
        { title: 'MACHINE_NAME', field: changeUL('MACHINE_NAME'), align: 'center', sortable: true, width: 150 },
        { title: 'AREA NAME', field: changeUL('MACHINE_NAME'), align: 'center', sortable: true, width: 150 },
        { title: 'FACTORY', field: changeUL('SET_TIME'), align: 'center', sortable: true, width: 150 },
        { title: 'STATE', field: changeUL('ALARM_STATE'), align: 'center', width: 150 },
        { title: 'GROUP_NAME', field: changeUL('CLEAR_TIME'), align: 'center', width: 150 },
        { title: 'MATERIAL', field: changeUL('CLEAR_USER'), align: 'center', width: 150 },
        { title: 'PRODUCT_REQUEST_NAME', field: changeUL('ALARM_TEXT'), align: 'center', width: 300 },
        { title: 'EVENT_NAME', field: changeUL('ALARM_CODE'), align: 'center', width: 150 },
        { title: 'EVENT_USER', field: changeUL('ALARM_LEVEL'), align: 'center', width: 150 },
        { title: 'EVENT_TIME', field: changeUL('UNIT_NAME'), align: 'center', width: 150 }
      ],
      datasource: []
    })
    const chartData = reactive({
      xAxis: [],
      yAxis: [
        {
          type: 'value',
          name: '小时',
          min: 0,
          max: 30,
          axisLabel: {
            formatter: '{value} h'
          }
        },
        {
          type: 'value',
          name: '稼动率',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value} %'
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: []
    })
    const machineInfo = reactive({})

    watch(filterText, (val) => {
      treeRef.value.filter(val)
    })

    const handleMachineChange = (data) => {
      if (data['children'] === undefined) {
        loading.value = true
        machineInfo.name = data['label']
        machineInfo.code = data['id']
        machineInfo.workOrder = '无'
        machineInfo.material = '无'
        machineInfo.event = 'ChangeState'
        machineInfo.sc = 0
        machineInfo.wc = 5
        chartData.xAxis = ['2022-09-15', '2022-09-16', '2022-09-17', '2022-09-18', '2022-09-19', '2022-09-20', '2022-09-21', '2022-09-22']
        chartData.series = [
          {
            name: '稼动率',
            data: [88, 77.6, 95.89, 94.8, 89.56, 88.65, 90.68, 96.35],
            type: 'line',
            yAxisIndex: 1,
            barMaxWidth: 30
          },
          {
            name: 'RUN',
            data: [12, 8.68, 15.68, 14.9, 10.5, 11, 10.65, 15.45],
            type: 'bar',
            color: '#b8e994',
            barMaxWidth: 30,
            stack: 'duration'
          },
          {
            name: 'IDLE',
            data: [5.68, 4.89, 5.6, 5.4, 3.8, 2.89, 2.35, 4.55],
            type: 'bar',
            color: '#feca57',
            barMaxWidth: 30,
            stack: 'duration'
          },
          {
            name: 'STOP',
            data: [3.4, 0, 0, 0, 5, 0, 1, 4],
            type: 'bar',
            color: '#9c88ff',
            barMaxWidth: 30,
            stack: 'duration'
          },
          {
            name: 'DOWN',
            data: [2.92, 10.43, 2.72, 3.5, 2, 10.11, 3, 0],
            type: 'bar',
            color: '#ff6b6b',
            barMaxWidth: 30,
            stack: 'duration'
          },
          {
            name: 'PM',
            data: [0, 0, 0, 0.2, 2.7, 0, 7, 0],
            type: 'bar',
            color: '#54a0ff',
            barMaxWidth: 30,
            stack: 'duration'
          }
        ]
        initChart()
        setTimeout(() => {
          loading.value = false
        }, 500)
      }
    }

    const filterNode = (value, data) => {
      if (!value) return true
      return data.label.includes(value)
    }

    function changeUL(data) {
      return data.toLocaleLowerCase()
    }

    const initChart = () => {
      let startTime = null
      const categories = ['1MMAI01-AI01', '1MMAI02-AI01', '1MMAS01-AS01', '1MMAS02-AS01']
      const types = [
        { name: 'Trouble', color: '#ff5e5e' },
        { name: 'Run', color: '#94ec8a' },
        { name: 'Idle', color: '#fffb83' },
        { name: 'Maintenance', color: '#6ca8ff' },
        { name: 'Stop', color: '#9e3da5' },
        { name: 'NP', color: '#ffc800' },
        { name: 'JobChange', color: '#ffd29e' }
      ]
      const macStateSource = msData['result']
      const chartsData = []
      const dom = document.getElementById('MacStateDuration')
      echarts.init(dom).dispose()
      const chart = echarts.init(dom)
      chart.clear()
      if (macStateSource.length > 0) {
        startTime = macStateSource[0]['TIMEKEY']
        macStateSource.forEach(mac => {
          const typeItem = types.filter(type => {
            return type['name'] === (mac['OLD_MACHINE_STATE_NAME'] === 'ETC' ? 'NP' : mac['OLD_MACHINE_STATE_NAME'])
          })[0]
          chartsData.push({
            name: typeItem.name,
            value: [categories.indexOf(mac['NAME']), mac['TIMEKEY'], mac['LEAD_TIMEKEY'], mac['LEAD_TIMEKEY'] - mac['TIMEKEY']],
            itemStyle: {
              normal: {
                color: typeItem.color
              }
            }
          })
        })
      }
      function renderItem(params, api) {
        const categoryIndex = api.value(0)
        const start = api.coord([api.value(1), categoryIndex])
        const end = api.coord([api.value(2), categoryIndex])
        const height = api.size([0, 1])[1] * 0.6
        const rectShape = echarts.graphic.clipRectByRect(
          {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          }
        )
        return (
          rectShape && {
            type: 'rect',
            transition: ['shape'],
            shape: rectShape,
            style: api.style()
          }
        )
      }

      const optionData = {
        tooltip: {
          formatter: function(params) {
            return params.marker + params.name + ': ' + (params.value[3] / 60 / 1000 / 60).toFixed(2) + ' 小时<br/>' +
                formatDate(params.value[1], 'yyyy-MM-dd hh:mm:ss') +
                ' ~ ' +
                formatDate(params.value[2], 'yyyy-MM-dd hh:mm:ss')
          }
        },
        legend: { // 图例
          width: '80%',
          type: 'scroll',
          data: [
            { name: 'Run', itemStyle: { color: '#94ec8a' }},
            { name: 'Idle', itemStyle: { color: '#fffb83' }},
            { name: 'Stop', itemStyle: { color: '#9e3da5' }},
            { name: 'Maintenance(PM)', itemStyle: { color: '#4889fc' }},
            { name: 'Trouble', itemStyle: { color: '#ff6565' }},
            { name: 'NP', itemStyle: { color: '#ffc800' }},
            { name: 'JobChange', itemStyle: { color: '#ffd29e' }}
          ],
          left: '50px',
          selectedMode: false, // 图例设为不可点击,
          textStyle: {
            color: '#000000',
            fontSize: 14
          }
        },
        dataZoom: [
          {
            type: 'slider',
            filterMode: 'weakFilter',
            showDataShadow: false,
            labelFormatter: ''
          },
          {
            type: 'inside',
            filterMode: 'weakFilter'
          }
        ],
        xAxis: {
          min: startTime,
          scale: true,
          axisLabel: {
            formatter: function(val) {
              return formatDate(val, 'yyyy-MM-dd hh:mm:ss')
            }
          }
        },
        yAxis: {
          data: categories
        },
        series: [
          { name: 'Run', type: 'bar', data: [], barMaxWidth: 10 },
          { name: 'Idle', type: 'bar', data: [], barMaxWidth: 10 },
          { name: 'Stop', type: 'bar', data: [], barMaxWidth: 10 },
          { name: 'Maintenance(PM)', type: 'bar', data: [], barMaxWidth: 10 },
          { name: 'Trouble', type: 'bar', data: [], barMaxWidth: 10 },
          { name: 'NP', type: 'bar', data: [], barMaxWidth: 10 },
          { name: 'JobChange', type: 'bar', data: [], barMaxWidth: 10 },
          {
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
              opacity: 1
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: chartsData
          }
        ]
      }
      chart.setOption(optionData)
      console.log('加载完成')
    }

    return {
      loading,
      form,
      defaultProps,
      treeData,
      filterText,
      treeRef,
      tableData,
      chartData,
      machineInfo,
      handleMachineChange,
      filterNode
    }
  },
  components: { DataTable, YIcon, BarChart, InfoCard }
})
</script>
<style lang="scss" scoped>
.filter-tree :deep(.el-tree-node__label) {
width: 100%;
text-overflow: ellipsis;
overflow: hidden;
}
.loading{
animation:load 1.1s infinite linear;
}
@keyframes load{
from{
  transform: rotate(0deg);
}
to{
  transform: rotate(360deg);
}
}
</style>
