<template>
    <div class="p-2 overflow-hidden h-full" style="background: #ebeef3">
      <el-row class="enter-y h-full" :gutter="6">
        <el-col class="h-full" :span="4">
          <el-card class="h-full" header="查询条件">
            <vxe-form
              ref="xWaterUseForm"
              title-width="80px"
              :loading="loading"
              :data="form"
              @submit="queryData"
            >
            <vxe-form-item
                span="24"
                title="startTime"
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
                span="24"
                title="endTime"
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
              <vxe-form-item
                span="24"
                title="Min (%)"
                title-overflow="ellipsis"
              >
                <template #default>
                    <vxe-input v-model="form.min" placeholder="数值类型" type="number"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item
                span="24"
                title="Max (%)"
                title-overflow="ellipsis"
              >
                <template #default>
                    <vxe-input v-model="form.max" placeholder="数值类型" type="number"></vxe-input> %
                </template>
              </vxe-form-item>
              <vxe-form-item span="24">
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
        </el-col>
        <el-col style="display: flex" class="h-full flex-col" :span="20">
          <el-card v-if="loading" style="flex: 1; color: #426cb9" class="flex items-center justify-center">
            <div>
              <YIcon class="loading" icon="yiconloading" color="#426cb9" :size="25" />
              加载中....
            </div>
          </el-card>
          <el-row v-if="!loading" class="mb-2" :gutter="6">
            <el-col :span="24">
              <el-card header="Tack TIme">
                <BarChart
                  class="h-82"
                  :xAxis="chartData.xAxis"
                  :yAxis="chartData.yAxis"
                  :series="chartData.series"
                />
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
import { defineComponent, ref, reactive, watch } from 'vue'
import DataTable from '@/components/DataTable.vue'
import YIcon from '@/components/YIcon.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { getCurrentTime } from '@/utils/utils'
export default defineComponent({
  setup() {
    const loading = ref(false)
    const form = reactive({
      startTime: getCurrentTime('date', -7, 'day'),
      endTime: getCurrentTime('date'),
      min: 20,
      max: 80
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
        { title: 'Operation Name', field: changeUL('MACHINE_NAME'), align: 'center', sortable: true, width: 150 },
        { title: 'Operation Desc', field: changeUL('MACHINE_NAME'), align: 'center', sortable: true, width: 150 },
        { title: 'EQP Name', field: changeUL('SET_TIME'), align: 'center', sortable: true, width: 150 },
        { title: 'Product Spec Name', field: changeUL('ALARM_STATE'), align: 'center', width: 150 },
        { title: 'GROUP_NAME', field: changeUL('CLEAR_TIME'), align: 'center', width: 150 },
        { title: '2022M07', field: changeUL('CLEAR_USER'), align: 'center', width: 150,
          children: [
            { title: 'GLS_QTY', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 },
            { title: 'TACK_TIME', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 }
          ]
        },
        { title: '2022M08', field: changeUL('CLEAR_USER'), align: 'center',
          children: [
            { title: 'GLS_QTY', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 },
            { title: 'TACK_TIME', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 }
          ]
        },
        { title: '2022M09', field: changeUL('CLEAR_USER'), align: 'center',
          children: [
            { title: 'GLS_QTY', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 },
            { title: 'TACK_TIME', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 }
          ]
        },
        { title: '20220915', field: changeUL('CLEAR_USER'), align: 'center',
          children: [
            { title: 'GLS_QTY', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 },
            { title: 'TACK_TIME', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 }
          ]
        },
        { title: '20220916', field: changeUL('CLEAR_USER'), align: 'center',
          children: [
            { title: 'GLS_QTY', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 },
            { title: 'TACK_TIME', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 }
          ]
        },
        { title: '20220917', field: changeUL('CLEAR_USER'), align: 'center',
          children: [
            { title: 'GLS_QTY', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 },
            { title: 'TACK_TIME', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 }
          ]
        },
        { title: '20220918', field: changeUL('CLEAR_USER'), align: 'center',
          children: [
            { title: 'GLS_QTY', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 },
            { title: 'TACK_TIME', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 }
          ]
        },
        { title: '20220919', field: changeUL('CLEAR_USER'), align: 'center',
          children: [
            { title: 'GLS_QTY', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 },
            { title: 'TACK_TIME', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 }
          ]
        },
        { title: '20220920', field: changeUL('CLEAR_USER'), align: 'center',
          children: [
            { title: 'GLS_QTY', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 },
            { title: 'TACK_TIME', field: changeUL('ALARM_TEXT'), align: 'center', width: 100 }
          ]
        }
      ],
      datasource: []
    })
    const chartData = reactive({
      xAxis: [],
      yAxis: [
        {
          type: 'value',
          name: 'Glass Count',
          min: 0,
          max: 50000,
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: 'Tack Time',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value}'
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
  components: { DataTable, YIcon, BarChart }
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

