<template>
  <div class="p-2 overflow-hidden h-full" style="background: #ebeef3">
    <el-row class="h-full enter-y" :gutter="6">
      <el-col class="h-full overflow-hidden" :span="4">
        <el-card header="条件查询" class="mb-2 h-full" :body-style="{ height: '100%', overflow: 'auto' }">
          <vxe-form
            ref="xWaterUseForm"
            title-width="100px"
            :loading="loading"
            :data="form"
            :rules="formRules"
            @submit="handlerSubmit"
            @reset="handlerReset"
          >
          <vxe-form-item :span="24" title="站点分组" field="flow">
            <query-select
              ref="xLine"
              v-model="form.flow"
              :options="flowOptions"
              :option-config="{ label: changeUL('process_flow_name'), value: changeUL('process_flow_name') }"
              :display-first-default="displayFirst"
              :multiple="true"
              @change="handlerLineChange"
            />
          </vxe-form-item>
          <vxe-form-item :span="24" title="站点" field="operation">
            <template #default>
              <search-select
                style="width: 100%"
                ref="xOperation"
                v-model="form.operation"
                :options="operationOptions"
                :option-config="{ label: 'description', value: 'name' }"
                @change="handlerOperationChange"
              />
            </template>
          </vxe-form-item>
          <vxe-form-item :span="24" title="设备" field="operation">
            <template #default>
              <search-select
                style="width: 100%"
                ref="xMachine"
                v-model="form.machine"
                :options="machineOptions"
                :option-config="{ label: 'description', value: 'name' }"
              />
            </template>
          </vxe-form-item>
          <vxe-form-item :span="24" title="Lot ID" field="lot" :item-render="{}">
            <template #default>
              <vxe-input v-model="form.lot" placeholder="请输入" type="text" clearable />
            </template>
          </vxe-form-item>
          <vxe-form-item :span="24" title="Product ID" field="product" :item-render="{}">
            <template #default>
              <vxe-input clearable v-model="form.product" placeholder="请输入" type="text"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :span="24" title="机种" field="spec">
            <query-select
              ref="xSpec"
              v-model="form.spec"
              :isRemote="true"
              method="post"
              :params="{ sql_name: 'getAllProductSpec' }"
              :option-config="{ label: 'name', value: 'value' }"
              @changed="handleSpecChanged"
            />
          </vxe-form-item>
          <vxe-form-item :span="24" title="工单" field="wo">
            <search-select
              style="width: 100%"
              ref="xWO"
              v-model="form.wo"
              :options="woOptions"
              :option-config="{ label: changeUL('NAME'), value: changeUL('NAME') }"
            />
          </vxe-form-item>
          <vxe-form-item :span="24" title="载具" field="lot" :item-render="{}">
            <template #default>
              <vxe-input v-model="form.carrier" placeholder="请输入" type="text" clearable />
            </template>
          </vxe-form-item>
          <vxe-form-item span="24">
            <template #default>
              <vxe-button size="small" type="submit" status="primary">查询</vxe-button>
              <vxe-button size="small" type="reset">重置</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
        </el-card>
      </el-col>
      <el-col class="h-full" :span="20">
        <div class="h-full flex flex-col">
          <el-row class="mb-2" :gutter="6">
            <el-col :span="12">
              <el-card header="WIP 站点分布">
                <BarChart
                  class="h-85"
                  :xAxis="operationWIPXAxis"
                  :series="operationWIPSeries"
                />
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card header="各产品规格占比">
                <PieChart
                  class="h-85"
                  :data="PieDatasource"
                />
              </el-card>
            </el-col>
          </el-row>
          <el-card class="flex-1" :body-style="{ height: 'calc(100% - 45px)' }">
            <template #header>
              <div class="flex justify-between items-center">
                <span>产品列表</span>
                <div>
                  <el-checkbox v-model="checked1" label="滞留产品" size="large" />
                  <el-checkbox v-model="checked2" label="锁定产品" size="large" @change="handleHoldCheckChange" />
                </div>
              </div>
            </template>
            <DataTable
              :columns="tableConfig.columns"
              :data="tableConfig.productDatasource"
            />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import SearchSelect from '@/components/SearchSelect'
import QuerySelect from '@/components/QuerySelect'
import { executeSQL } from '@/api/server'
import { ElMessage } from 'element-plus'
import { getObjArrayFieldToArray } from '@/utils/utils'
export default defineComponent({
  components: { DataTable, BarChart, PieChart, SearchSelect, QuerySelect },
  setup() {
    const form = reactive({
      lot: '',
      product: '',
      product_flag: '',
      spec: '',
      operation: '',
      machine: '',
      wo: '',
      carrier: ''
    })

    const formRules = {}

    const tableConfig = reactive({
      columns: [
        { title: '产品ID', field: changeUL('name'), align: 'center', sortable: true, width: '150' },
        { title: '所在站点', field: changeUL('process_operation_name'), align: 'center', width: '100' },
        { title: '站点描述', field: changeUL('description'), align: 'center', width: '100' },
        { title: '所在设备', field: changeUL('machine_name'), align: 'center', width: '100' },
        { title: '所属载具', field: changeUL('carrier_name'), align: 'center', width: '150' },
        { title: '所属Lot', field: changeUL('lot_name'), align: 'center', width: '150' },
        { title: '所属工单', field: changeUL('product_request_name'), align: 'center', width: '200' },
        { title: '产品规格', field: changeUL('product_spec_name'), align: 'center', width: '200' },
        { title: '工艺状态', field: changeUL('process_state'), align: 'center', width: '200' },
        { title: '锁定状态', field: changeUL('hold_state'), align: 'center', width: '200' },
        { title: '等级', field: changeUL('grade'), align: 'center', width: '150' },
        { title: '不良Code', field: changeUL('bad_code'), align: 'center', width: '150' },
        { title: '是否返工', field: changeUL('rework_state'), align: 'center', width: '150' },
        { title: '操作事件', field: changeUL('last_event_name'), align: 'center', width: '150' },
        { title: '操作用户', field: changeUL('last_event_user'), align: 'center', width: '200' },
        { title: '操作时间', field: changeUL('last_event_time'), align: 'center', sortable: true, width: '200' }
      ],
      productDatasource: [],
      sourceData: []
    })

    const xOperation = ref()
    const xMachine = ref()

    const flowOptions = reactive({ options: [] })
    const operationOptions = reactive({ options: [] })
    const machineOptions = reactive({ options: [] })
    const woOptions = reactive({ options: [] })
    const operationWIPXAxis = reactive([])
    const operationWIPSeries = reactive([])
    const PieDatasource = reactive([])
    const loading = ref(false)

    function changeUL(data) {
      return data.toLocaleLowerCase()
    }

    function initData() {
      executeSQL({ sql_name: 'getFlowOperations' }).then((res) => {
        if (res && res['code'] === 200) {
          flowOptions['options'] = res['data']
          if (flowOptions['options'].length > 0) {
            const first = flowOptions['options'][0]
            operationOptions['options'] = JSON.parse(first['operations'])
          }
        } else {
          ElMessage.error(res['msg'])
        }
      })

      executeSQL({ sql_name: 'getAllProductRequest' }).then((res) => {
        if (res && res['code'] === 200) {
          woOptions['options'] = res['data']
          woOptions['source'] = res['data']
        } else {
          ElMessage.error(res['msg'])
        }
      })
    }

    function handlerLineChange(source) {
      xOperation.value.clear()
      const data = source['value']
      operationOptions['options'] = []
      const list = flowOptions['options'].filter((l) => {
        return data.indexOf(l[changeUL('process_flow_name')]) > -1
      })
      for (let i = 0; i < list.length; i++) {
        operationOptions['options'].push(...JSON.parse(list[i][changeUL('operations')]))
      }
    }

    function handlerOperationChange(data) {
      xMachine.value.clear()
      executeSQL({ sql_name: 'getMachineByOperation', operation: data }).then((res) => {
        if (res && res['code'] === 200) {
          machineOptions['options'] = res['data']
        } else {
          ElMessage.error(res['msg'])
        }
      })
    }

    async function handlerSubmit() {
      operationWIPXAxis.length = 0
      operationWIPSeries.length = 0
      PieDatasource.length = 0

      const params = { ...form }
      let product_str = ''
      let flow_str = ''
      const label = '当前产品数量'
      const products = params['product'].split(' ')
      for (let i = 0; i < products.length; i++) {
        const product = products[i]
        if (i > 0) {
          product_str += "'"
        }
        product_str += product
        if (i < products.length - 1) {
          product_str += "',"
        }
      }
      if (form.flow) {
        const flows = form.flow
        for (let i = 0; i < flows.length; i++) {
          const flow = flows[i]
          if (i > 0) {
            flow_str += "'"
          }
          flow_str += flow
          if (i < flows.length - 1) {
            flow_str += "',"
          }
        }
      }
      params['product'] = product_str
      params['flow'] = flow_str
      if (product_str !== '') {
        params['product_flag'] = 'Y'
      } else {
        params['product_flag'] = ''
      }
      if (flow_str !== '') {
        params['flow_flag'] = 'Y'
      } else {
        params['flow_flag'] = ''
      }
      loading.value = true

      params['sql_name'] = 'getWIPOperationCount'

      const line_res = await executeSQL(params)
      operationWIPXAxis.push(...getObjArrayFieldToArray(line_res['data'], changeUL('name')))
      operationWIPSeries.push(
        {
          name: label,
          type: 'bar',
          data: getObjArrayFieldToArray(line_res['data'], changeUL('value')),
          showLabel: true,
          barMaxWidth: 20,
          itemStyle: {
            normal: {
              barBorderRadius: [8, 8, 0, 0]
            }
          }
        }
      )

      params['sql_name'] = 'getWIPSpecRateByParams'
      const pie_res = await executeSQL(params)
      PieDatasource.push(...pie_res['data'])

      params['sql_name'] = 'getWIPInfoByParams'
      const table_res = await executeSQL(params)
      tableConfig.productDatasource = table_res['data']
      tableConfig.sourceData = table_res['data']

      loading.value = false
    }

    function handleHoldCheckChange(data) {
      if (data) {
        tableConfig.productDatasource = tableConfig.sourceData.filter((d) => { return d['hold_state'] === 'Hold' })
      } else {
        tableConfig.productDatasource = tableConfig.sourceData
      }
    }

    initData()

    return {
      form,
      formRules,
      flowOptions,
      operationOptions,
      machineOptions,
      woOptions,
      xOperation,
      xMachine,
      operationWIPXAxis,
      operationWIPSeries,
      PieDatasource,
      tableConfig,
      loading,
      changeUL,
      handlerLineChange,
      handlerOperationChange,
      handlerSubmit,
      handleHoldCheckChange
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
