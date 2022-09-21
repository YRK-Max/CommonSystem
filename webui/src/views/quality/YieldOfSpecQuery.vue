<template>
    <div class="p-2 overflow-hidden h-full">
      <el-row class="enter-y h-full" :gutter="6">
        <el-col class="h-full" :span="4">
          <el-card class="h-full" header="产品规格/机种">
            <el-input v-model="filterText" placeholder="Filter keyword" />
            <el-tree
              ref="treeRef"
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              default-expand-all
              highlight-current
              :filter-node-method="filterNode"
              @node-click="handleSpecChange"
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
              <vxe-form-item :span="5" title="工单类型" field="workOrderType">
                <query-select
                  ref="xWorkOrderType"
                  v-model="form.workOrderType"
                  url="/common/executeSql"
                  method="post"
                  :params="{ sql_name: 'getProductRequestTypeList' }"
                  :option-config="{ label: 'production_type', value: 'production_type' }"
                  @changed="handleParamsChange"
                />
              </vxe-form-item>
              <vxe-form-item :span="5" title="工单" field="workOrder">
                <search-select
                  style="width: 100%"
                  ref="xWorkOrder"
                  v-model="form.workOrder"
                  :options="woOptions"
                  :option-config="{ label: 'name', value: 'name' }"
                />
              </vxe-form-item>
              <vxe-form-item :span="5" title="线别" field="machineGroup" folding>
                <query-select
                  ref="xMachineGroup"
                  v-model="form.machineGroup"
                  url="/common/executeSql"
                  method="post"
                  :params="{ sql_name: 'getMachineGroupList' }"
                  :option-config="{ label: 'description', value: 'name' }"
                />
              </vxe-form-item>
              <vxe-form-item :span="5" title="班别" field="banbie" folding>
                <search-select
                  style="width: 100%"
                  ref="xBanbie"
                  v-model="form.banbie"
                  :options="banbieOptions"
                  :option-config="{ label: 'description', value: 'name' }"
                />
              </vxe-form-item>
              <vxe-form-item span="3" collapse-node>
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
          <el-row v-if="!loading" class="mb-2 h-90" :gutter="6">
            <el-col class="h-full" :span="12">
              <el-card header="Top 不良" class="h-full" :body-style="{ height: 'calc(100% - 45px)' }">
                <BarChart :xAxis="chartData.chart1.xAxis" :series="chartData.chart1.series" />
              </el-card>
            </el-col>
            <el-col class="h-full" :span="12">
              <el-card header="良率趋势" class="h-full" :body-style="{ height: 'calc(100% - 45px)' }">
                <LineChart :xAxis="chartData.chart2.xAxis" :series="chartData.chart2.series" />
              </el-card>
            </el-col>
          </el-row>
          <el-card v-if="!loading" style="flex: 1" :body-style="{ height: '100%' }">
            <DataTable
              class="h-full"
              title="列表"
              :columns="tableData.columns"
              :data="tableData.datasource"
              :showToolbar="true"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>
<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import DataTable from '@/components/DataTable.vue'
import BarChart from '@/components/charts/BarChart.vue'
import SearchSelect from '@/components/SearchSelect'
import QuerySelect from '@/components/QuerySelect'
import { getCurrentTime } from '@/utils/utils'
import { executeSQL } from '@/api/server'
import { ElMessage } from 'element-plus'
import LineChart from '@/components/charts/LineChart.vue'
import YIcon from '@/components/YIcon.vue'
export default defineComponent({
  components: { DataTable, BarChart, SearchSelect, QuerySelect, LineChart, YIcon },
  setup() {
    const loading = ref(false)
    const form = reactive({
      startTime: getCurrentTime('date', -7, 'day'),
      endTime: getCurrentTime('date'),
      spec: '',
      workOrderType: '',
      workOrder: '',
      machineGroup: '',
      banbie: ''
    })
    const banbieOptions = reactive({ options: [] })
    const woOptions = reactive({ options: [], source: [] })
    const tableData = reactive({
      columns: [
        { title: '站点', field: 'description', align: 'center', minWidth: 100 },
        { title: '站点代码', field: 'process_operation_name', align: 'center', sortable: true, minWidth: 100 },
        { title: '正常工序', align: 'center', children: [
          { title: '良品数', field: 'ok_count', align: 'center', minWidth: 100 },
          { title: '不良品数', field: 'ng_count', align: 'center', minWidth: 100 },
          { title: '合计数量', field: 'total_count', align: 'center', minWidth: 100 },
          { title: '良率', field: 'rate', align: 'center', minWidth: 100 }
        ] },
        { title: '重工工序', align: 'center', children: [
          { title: '重工后良品数', field: 'r_ok_count', align: 'center', minWidth: 100 },
          { title: '重工后不良品数', field: 'r_ng_count', align: 'center', minWidth: 100 },
          { title: '重工合计', field: 'r_total_count', align: 'center', minWidth: 100 },
          { title: '重工后良率', field: 'r_rate', align: 'center', minWidth: 100 }
        ] },
        { title: 'WIP', field: 'wip_count', align: 'center', minWidth: 100 }
      ],
      datasource: []
    })
    const filterText = ref('')
    const treeRef = ref()
    const defaultProps = {
      children: 'children',
      label: 'label'
    }

    watch(filterText, (val) => {
      treeRef.value.filter(val)
    })
    const treeData = reactive([
      {
        id: 1,
        label: 'HHQK RECLAIM',
        children: [
          {
            id: 4,
            label: '晶圆'
          },
          {
            id: 4,
            label: 'NonCuNPW Wafer'
          },
          {
            id: 4,
            label: '12inch N Control Wafer Reclaim'
          },
          {
            id: 4,
            label: '12",Non-CU P type Wafer Reclaim HWATSING'
          }
        ]
      }
    ])
    const chartData = reactive({
      chart1: {
        xAxis: [],
        series: [
          {
            name: '数量',
            data: [],
            type: 'bar',
            barMaxWidth: 20,
            itemStyle: {
              normal: {
                barBorderRadius: [8, 8, 0, 0]
              }
            }
          }
        ]
      },
      chart2: {
        xAxis: [],
        series: [
          {
            name: '数量',
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      }
    })
    const currentSpec = ref('')

    // 函数区
    const filterNode = (value, data) => {
      if (!value) return true
      return data.label.includes(value)
    }
    function handleParamsChange() {
      woOptions.options = woOptions.source.filter(data => {
        return (form.spec === '' ? true : data['product_spec_name'] === form.spec) && (form.workOrderType === '' ? true : data['production_type'] === form.workOrderType)
      })
    }
    const handleSpecChange = (data) => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 500)
      currentSpec.value = data['label']
      if (data.label === 'NonCuNPW Wafer') {
        chartData.chart1.xAxis = ['无法修复去报废', '绿光Rework去膜', '绿光Rework粗抛', 'TSI返工', 'Particle返工']
        chartData.chart1.series = [
          {
            name: '数量',
            data: [256, 128, 108, 56, 20],
            type: 'bar',
            barMaxWidth: 20,
            color: '#ff6348',
            itemStyle: {
              normal: {
                barBorderRadius: [8, 8, 0, 0]
              }
            }
          }
        ]
        chartData.chart2.xAxis = ['2022', '', '2022Q2', '2022Q3', '', '202204', '202205', '202206', '202207', '202208', '202209', '', '20220915', '20220916', '20220917', '20220918', '20220919', '20220920', '20220921', '20220922']
        chartData.chart2.series = [
          {
            name: '良率',
            data: [89.6, undefined, 92.35, 93.27, undefined, 86.89, 91.45, 93.12, 89.12, 88.65, 90.21, undefined, 89.58, 84.27, 89.1, 92.12, 91.87, 93.45, 92.54],
            type: 'line',
            markLine: {
              silent: true,
              data: [
                {
                  yAxis: 90
                }
              ]
            }
          }
        ]
        tableData.datasource = [
          { description: 'CBC100.0', process_operation_name: '去膜', ok_count: '235', ng_count: '25', total_count: '260', rate: '90.3%', r_ok_count: '0', r_ng_count: '0', r_total_count: '0', r_rate: '0%', wip_count: '0' },
          { description: 'CNG200.0', process_operation_name: '去膜目检', ok_count: '210', ng_count: '24', total_count: '235', rate: '89.3%', r_ok_count: '0', r_ng_count: '0', r_total_count: '0', r_rate: '0%', wip_count: '0' },
          { description: 'CNG200.1', process_operation_name: '边抛', ok_count: '186', ng_count: '8', total_count: '210', rate: '88.5%', r_ok_count: '0', r_ng_count: '0', r_total_count: '0', r_rate: '0%', wip_count: '0' },
          { description: 'CNG200.2', process_operation_name: '精抛', ok_count: '178', ng_count: '13', total_count: '186', rate: '95.6%', r_ok_count: '0', r_ng_count: '0', r_total_count: '0', r_rate: '0%', wip_count: '0' },
          { description: 'CEPS100.0', process_operation_name: '精抛', ok_count: '178', ng_count: '0', total_count: '178', rate: '100%', r_ok_count: '23', r_ng_count: '3', r_total_count: '26', r_rate: '88.4%', wip_count: '0' },
          { description: 'CFCMP100.0', process_operation_name: '绿光目检', ok_count: '165', ng_count: '7', total_count: '178', rate: '92.6%', r_ok_count: '0', r_ng_count: '0', r_total_count: '0', r_rate: '0%', wip_count: '0' },
          { description: 'CFCMP100.1', process_operation_name: '绿光目检', ok_count: '158', ng_count: '9', total_count: '165', rate: '95.7%', r_ok_count: '0', r_ng_count: '0', r_total_count: '0', r_rate: '0%', wip_count: '0' },
          { description: 'CGI100.1', process_operation_name: '去膜目检', ok_count: '158', ng_count: '0', total_count: '158', rate: '100%', r_ok_count: '0', r_ng_count: '0', r_total_count: '0', r_rate: '0%', wip_count: '0' },
          { description: 'CIQST100.0', process_operation_name: 'IQC检查', ok_count: '158', ng_count: '0', total_count: '158', rate: '100%', r_ok_count: '0', r_ng_count: '0', r_total_count: '0', r_rate: '0%', wip_count: '0' }
        ]
      } else {
        chartData.chart1.xAxis = []
        chartData.chart1.series = []
        chartData.chart2.xAxis = []
        chartData.chart2.series = []
      }
    }
    function queryData() {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 500)
      if (currentSpec.value === 'NonCuNPW Wafer') {
        chartData.chart1.xAxis = ['无法修复去报废', '绿光Rework去膜', '绿光Rework粗抛', 'TSI返工', 'Particle返工']
        chartData.chart1.series = [
          {
            name: '数量',
            data: [256, 128, 108, 56, 20],
            type: 'bar',
            barMaxWidth: 20,
            color: '#ff6348',
            itemStyle: {
              normal: {
                barBorderRadius: [8, 8, 0, 0]
              }
            }
          }
        ]
        chartData.chart2.xAxis = ['2022-09-15', '2022-09-16', '2022-09-17', '2022-09-18', '2022-09-19', '2022-09-20', '2022-09-21', '2022-09-22']
        chartData.chart2.series = [
          {
            name: '数量',
            data: [336, 230, 224, 218, 135, 147, 260, 158],
            type: 'line'
          }
        ]
      } else {
        chartData.chart1.xAxis = []
        chartData.chart1.series = []
        chartData.chart2.xAxis = []
        chartData.chart2.series = []
      }
      // const params = JSON.parse(JSON.stringify(form))
      // params['sql_name'] = 'getYieldOfOperations'
      // executeSQL(params).then(res => {
      //   if (res && res['code'] === 200) {
      //     this.datasource = res['data']
      //   }
      //   loading.value = false
      // })
    }
    function handlerSubmit() {

    }

    // 执行区
    executeSQL({ sql_name: 'getAllProductRequest' }).then((res) => {
      if (res && res['code'] === 200) {
        woOptions['options'] = res['data']
        woOptions['source'] = res['data']
        banbieOptions['options'] = [
          { description: '白班', name: 'W' },
          { description: '夜班', name: 'N' }
        ]
      } else {
        ElMessage.error(res['message'])
      }
    })

    return {
      loading,
      form,
      banbieOptions,
      woOptions,
      tableData,
      treeData,
      filterText,
      treeRef,
      defaultProps,
      chartData,
      filterNode,
      handleParamsChange,
      handleSpecChange,
      queryData,
      handlerSubmit
    }
  }
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
