<template>
  <div class="p-2 h-full overflow-hidden">
    <el-row class="h-full enter-y" :gutter="6">
      <el-col :span="4">
        <el-card header="产品规格/机种" class="h-full"   >
           <el-input v-model="filterText" placeholder="Filter keyword">
           </el-input>
           <el-tree
             ref="treeRef"
             class="filter-tree"
             default-expand-all
             highlight-current
             :load="loadNode"
             :expand-on-click-node="false"
             :data="treeData"
             :filter-node-method="filterNode"
             @node-click="handleMachineNodeClick"
           />
       </el-card>
      </el-col>
      <el-col :span="20">
        <el-card class="mb-2 enter-y">
            <vxe-form
           ref="xWaterUseForm"
           title-width="100px"
           :loading="loading"
           :data="form"
           @submit="handlerSubmit"
         >
         <vxe-form-item span= "2" title="采集时间..."  title-overflow="ellipsis" ></vxe-form-item>
           <vxe-form-item span="5"  field="startTime" :item-render="{}" title-overflow="ellipsis">
             <template #default>
               <vxe-input   v-model="form.startTime" placeholder="时间选择" type="datetime" clearable transfer />
             </template>
           </vxe-form-item>
           <vxe-form-item span= "1" title="~"  title-overflow="ellipsis" ></vxe-form-item>
           <vxe-form-item span="5"    field="endTime" :item-render="{}" title-overflow="ellipsis">
             <template #default>
               <vxe-input v-model="form.endTime"   placeholder="时间选择" type="datetime" clearable transfer></vxe-input>
             </template>
           </vxe-form-item>
           <vxe-form-item span="4" >
             <template #default>
               <vxe-button size="small" type="submit" status="primary"  @click="handleQuery">查询</vxe-button>
             </template>
           </vxe-form-item>
              </vxe-form>
            </el-card>

          <el-card class="h-full"  header="Alarm历史表"   :body-style="{ height: '100%' }">
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
import { defineComponent, reactive, ref, watch } from 'vue'
import DataTable from '@/components/DataTable.vue'
import { getCurrentTime } from '@/utils/utils'
import { executeSQL } from '@/api/server'
import { ElMessage } from 'element-plus'

export default defineComponent({
  components: { DataTable },
  setup() {
    const form = reactive({
      startTime: getCurrentTime('date', -7, 'day') + ' 08:30:00',
      endTime: getCurrentTime('date') + ' 08:30:00',
      name: undefined,
      unit: undefined

    })
    const queryParams = reactive({
      name: undefined,
      unit: undefined
    })
    const treeData = reactive([])
    const machinegroup = reactive([])
    const filterText = ref('')
    const treeRef = ref()
    const loading = ref(false)
    watch(filterText, (val) => {
      treeRef.value.filter(val)
    })

    function filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }

    function getMachineList() {
      executeSQL({ sql_name: 'getRtmMachineList' }).then((res) => {
        if (res && res['code'] === 200) {
          const tempData = res['data']
          const parentArr = [...new Set(tempData.map(item => item.machine))]
          parentArr.forEach(item => {
            const tempItem = {
              label: item,
              children: [...tempData.filter(i => i.machine === item).map(i => {
                return { label: i.description + '[' + i.unit + ']', machine: i.unit }
              })]
            }
            treeData.push(tempItem)
          })
        } else {
          ElMessage.error(res['msg'])
        }
      })
    }
    getMachineList()

    const tableConfig = reactive({
      columns: [
        { title: 'ALARM_ID', field: changeUL('ALARM_ID'), align: 'center', sortable: true, width: 150, showOverflow: true },
        { title: 'MACHINE_NAME', field: changeUL('MACHINE_NAME'), align: 'center', sortable: true, width: 150, showOverflow: true },
        { title: 'SET_TIME', field: changeUL('SET_TIME'), align: 'center', sortable: true, width: 150, showOverflow: true },
        { title: 'ALARM_STATE', field: changeUL('ALARM_STATE'), align: 'center', sortable: true, width: 150, showOverflow: true },
        { title: 'CLEAR_TIME', field: changeUL('CLEAR_TIME'), align: 'center', width: 150, showOverflow: true },
        { title: 'CLEAR_USER', field: changeUL('CLEAR_USER'), align: 'center', width: 150, showOverflow: true },
        { title: 'ALARM_TEXT', field: changeUL('ALARM_TEXT'), align: 'center', width: 150, showOverflow: true },
        { title: 'ALARM_CODE', field: changeUL('ALARM_CODE'), align: 'center', width: 150, showOverflow: true },
        { title: 'ALARM_LEVEL', field: changeUL('ALARM_LEVEL'), align: 'center', width: 150 },
        { title: 'UNIT_NAME', field: changeUL('UNIT_NAME'), align: 'center', width: 150 }

      ],
      datasource: []
    })

    function changeUL(data) {
      return data.toLocaleLowerCase()
    }

    async function handleMachineNodeClick(data) {
      loading.value = true
      queryParams['sql_name'] = 'getMacAlarmList'
      queryParams['unit'] = data.machine
      const res = await executeSQL(queryParams)
      tableConfig.datasource = res['data']
      loading.value = false
      machinegroup.value = data.machine
    }

    async function handleQuery() {
      loading.value = true
      const params = JSON.parse(JSON.stringify(form))
      params['sql_name'] = 'getMacAlarmParams'
      params['unit'] = machinegroup.value
      const res = await executeSQL(params)
      tableConfig.datasource = res['data']
      loading.value = false
    }
    return {
      treeData,
      filterText,
      treeRef,
      filterNode,
      getMachineList,
      form,
      machinegroup,
      tableConfig,
      changeUL,
      handleMachineNodeClick,
      handleQuery,
      loading
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
