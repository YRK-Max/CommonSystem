<template>
  <div
    class="p-2 h-full"
    style="background: #ebeef3"
  >
    <el-row class="h-full">
      <el-col class="h-full overflow-y-hidden" :span="24">
        <el-card class="mb-2 enter-y">
            <vxe-form
            ref="xWaterUseForm"
            title-width="100px"
            :loading="loading"
            :data="form"
            :rules="formRules"
            @submit="handlerSubmit"
            @reset="handleReset"
          >
            <vxe-form-item span="5" title="开始时间" field="startTime" :item-render="{}" title-overflow="ellipsis">
              <template #default>
                <vxe-input v-model="form.startTime" placeholder="时间选择" type="datetime" clearable transfer />
              </template>
            </vxe-form-item>
            <vxe-form-item span="5" title="结束时间" field="endTime" :item-render="{}" title-overflow="ellipsis">
              <template #default>
                <vxe-input v-model="form.endTime" placeholder="时间选择" type="datetime" clearable transfer></vxe-input>
              </template>
            </vxe-form-item>
            <vxe-form-item span="5" title="站点" field="operation" :item-render="{}" title-overflow="ellipsis">
              <template #default>
                <search-select
                  style="width: 100%"
                  ref="xOperation"
                  v-model="form.operation"
                  :options="operationOptions"
                  :option-config="{ label: changeUL('DESCRIPTION'), value: changeUL('NAME') }"
                  @change="handlerOperationChange"
                />
              </template>
            </vxe-form-item>
            <vxe-form-item :span="5" title="设备" field="machine">
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
            <vxe-form-item span="5" title="产品ID" field="product" :item-render="{}" title-overflow="ellipsis" folding>
              <template #default>
                <vxe-input v-model="form.product" placeholder="请输入产品ID" type="text" clearable></vxe-input>
              </template>
            </vxe-form-item>
            <vxe-form-item span="5" title="Lot ID" field="product" :item-render="{}" title-overflow="ellipsis" folding>
              <template #default>
                <vxe-input v-model="form.lot" placeholder="请输入Lot ID" type="text" clearable></vxe-input>
              </template>
            </vxe-form-item>
            <vxe-form-item span="5" title="用户" field="user" folding>
              <search-select
                style="width: 100%"
                ref="xUser"
                v-model="form.user"
                :options="userOptions"
                :option-config="{ label: changeUL('NAME'), value: changeUL('USERNAME') }"
              />
            </vxe-form-item>
            <vxe-form-item :span="5" title="工单" field="wo" folding>
              <search-select
                style="width: 100%"
                ref="xWO"
                v-model="form.wo"
                :options="woOptions"
                :option-config="{ label: changeUL('NAME'), value: changeUL('NAME') }"
              />
            </vxe-form-item>
            <vxe-form-item span="5" title="载具 ID" field="carrier" :item-render="{}" title-overflow="ellipsis" folding>
              <template #default>
                <vxe-input v-model="form.carrier" placeholder="请输入载具 ID" type="text" clearable></vxe-input>
              </template>
            </vxe-form-item>
            <vxe-form-item span="4" collapse-node>
              <template #default>
                <vxe-button size="small" type="submit" status="primary">查询</vxe-button>
                <vxe-button size="small" type="reset">重置</vxe-button>
              </template>
            </vxe-form-item>
          </vxe-form>
        </el-card>
        <el-card class="enter-y" style="height: calc(100% - 80px)" header="产品列表" :body-style="{ height: 'calc(100% - 45px)' }">
          <DataTable
            :showToolbar="true"
            :columns="tableConfig.columns"
            :data="tableConfig.datasource"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import DataTable from '@/components/DataTable.vue'
import SearchSelect from '@/components/SearchSelect'
import { getCurrentTime } from '@/utils/utils'
import { executeSQL } from '@/api/server'
import { ElMessage } from 'element-plus'

export default defineComponent({
  components: { DataTable, SearchSelect },
  setup() {
    const form = reactive({
      startTime: getCurrentTime('date', -1, 'day') + ' 08:30:00',
      endTime: getCurrentTime('date') + ' 08:30:00',
      lot: '',
      product: '',
      operation: '',
      machine: '',
      user: '',
      carrier: '',
      wo: ''
    })
    const formRules = {
      startTime: [{ required: true }],
      endTime: [{ required: true }]
    }
    const operationOptions = reactive({ options: [] })
    const machineOptions = reactive({ options: [] })
    const woOptions = reactive({ options: [] })
    const userOptions = reactive({ options: [] })
    const loading = ref(false)

    const xMachine = ref()

    const tableConfig = reactive({
      columns: [
        { title: '时间戳', field: changeUL('timekey'), align: 'center', sortable: true, width: 150, showOverflow: true },
        { title: '产品 ID', field: changeUL('name'), align: 'center', sortable: true, width: 150, showOverflow: true },
        { title: 'Lot ID', field: changeUL('lot_name'), align: 'center', sortable: true, width: 150, showOverflow: true },
        { title: '工厂', field: changeUL('factory_name'), align: 'center', sortable: true, width: 150, showOverflow: true },
        { title: '事件名称', field: changeUL('last_event_name'), align: 'center', width: 150, showOverflow: true },
        { title: '事件时间', field: changeUL('last_event_time'), align: 'center', width: 150, showOverflow: true },
        { title: '事件操作员', field: changeUL('last_event_user'), align: 'center', width: 150, showOverflow: true },
        { title: '产品状态', field: changeUL('product_state'), align: 'center', width: 150, showOverflow: true },
        { title: '工艺状态', field: changeUL('process_state'), align: 'center', width: 150 },
        { title: '产品种类', field: changeUL('product_spec_name'), align: 'center', width: 150 },
        { title: '所在站点', field: changeUL('process_operation_name'), align: 'center', width: 150 },
        { title: '所属工单', field: changeUL('product_request_name'), align: 'center', width: 150 },
        { title: '等级', field: changeUL('grade'), align: 'center', width: 150 },
        { title: '不良代码', field: changeUL('fg_code'), align: 'center', width: 150 },
        { title: '不良描述', field: changeUL('defect_description'), align: 'center', width: 150 },
        { title: '创建时间', field: changeUL('create_time'), align: 'center', width: 150 },
        { title: '创建者', field: changeUL('create_user'), align: 'center', width: 150 },
        { title: 'Hold 状态', field: changeUL('hold_state'), align: 'center', width: 150 },
        { title: '入厂时间', field: changeUL('initial_trackin_time'), align: 'center', sortable: true, width: 150 },
        { title: '判定结果', field: changeUL('judge'), align: 'center', width: 150 },
        { title: '返工次数', field: changeUL('rework_count'), align: 'center', width: 150 }
      ],
      datasource: []
    })

    function changeUL(data) {
      return data.toLocaleLowerCase()
    }

    function initData() {
      executeSQL({ sql_name: 'getAllUerList' }).then((res) => {
        if (res && res['code'] === 200) {
          userOptions['options'] = res['data']
        } else {
          ElMessage.error(res['msg'])
        }
      })

      executeSQL({ sql_name: 'getAllOperations' }).then((res) => {
        if (res && res['code'] === 200) {
          operationOptions['options'] = res['data']
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
      loading.value = true
      const params = JSON.parse(JSON.stringify(form))
      let product_str = ''
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
      params['product'] = product_str
      product_str !== '' ? params['product_flag'] = 'Y' : params['product_flag'] = ''

      if (product_str === '' && new Date(form.endTime).getTime() - new Date(form.startTime).getTime() > 1000 * 60 * 60 * 24 * 31) {
        ElMessage.error('查询时间不能超过一个月')
        loading.value = false
        return
      }

      params['sql_name'] = 'getProductRecordsByParams'
      const res = await executeSQL(params)
      tableConfig.datasource = res['data']

      loading.value = false
    }

    initData()

    return {
      form,
      formRules,
      tableConfig,
      operationOptions,
      machineOptions,
      woOptions,
      userOptions,
      xMachine,
      loading,
      changeUL,
      handlerOperationChange,
      handlerSubmit
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
