<template>
    <div class="p-2 overflow-hidden h-full" style="background: #ebeef3">
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
          <el-card v-if="!loading" class="flex-1" :body-style="{ height: '100%' }">
            <DataTable
              title="Alarm 列表"
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
            id: 4,
            label: '铜线绿光目检机台01[CGI-01]'
          },
          {
            id: 4,
            label: '铜线打包机台01[CP-01]'
          },
          {
            id: 4,
            label: '铜线清洗机台01[CSC-01]'
          },
          {
            id: 4,
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
            id: 4,
            label: '非铜线FQC01[FFQC-01]'
          },
          {
            id: 4,
            label: '非铜线绿光目检机台01[FGI-01]'
          },
          {
            id: 4,
            label: '非铜线打包机台01[FP-01]'
          },
          {
            id: 4,
            label: '非铜线清洗机台01[FSC-01]'
          }
        ]
      }
    ])
    const tableData = reactive({
      columns: [
        { title: 'ALARM_ID', field: changeUL('ALARM_ID'), align: 'center', sortable: true, width: 150 },
        { title: 'MACHINE_NAME', field: changeUL('MACHINE_NAME'), align: 'center', sortable: true, width: 150 },
        { title: 'SET_TIME', field: changeUL('SET_TIME'), align: 'center', sortable: true, width: 150 },
        { title: 'ALARM_STATE', field: changeUL('ALARM_STATE'), align: 'center', width: 150 },
        { title: 'CLEAR_TIME', field: changeUL('CLEAR_TIME'), align: 'center', width: 150 },
        { title: 'CLEAR_USER', field: changeUL('CLEAR_USER'), align: 'center', width: 150 },
        { title: 'ALARM_TEXT', field: changeUL('ALARM_TEXT'), align: 'center', width: 300 },
        { title: 'ALARM_CODE', field: changeUL('ALARM_CODE'), align: 'center', width: 150 },
        { title: 'ALARM_LEVEL', field: changeUL('ALARM_LEVEL'), align: 'center', width: 150 },
        { title: 'UNIT_NAME', field: changeUL('UNIT_NAME'), align: 'center', width: 150 }
      ],
      datasource: []
    })

    watch(filterText, (val) => {
      treeRef.value.filter(val)
    })

    const handleMachineChange = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 500)
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
      handleMachineChange,
      filterNode
    }
  },
  components: { DataTable, YIcon }
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
