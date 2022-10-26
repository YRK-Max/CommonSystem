<template>
    <div class="p-2 h-full overflow-hidden">
      <el-row class="h-full enter-y" :gutter="6">
        <el-col :span="4">
          <el-card header="区域" class="h-full">
              <el-input v-model="filterText" placeholder="区域查询">
                <template #prepend>
                  <y-icon icon="yiconfenxiang" />
                </template>
              </el-input>
              <el-tree
                ref="treeRef"
                class="filter-tree mt-2"
                default-expand-all
                highlight-current
                :expand-on-click-node="false"
                :data="treeData"
                :filter-node-method="filterNode"
                @node-click="handleDeptNodeClick"
              />
          </el-card>
        </el-col>
        <el-col :span="20">
          <div class="h-full w-full flex flex-col">
            <el-card>
                <el-form :inline="true" size="middle">
                    <el-form-item label="时间范围">
                        <el-date-picker
                            v-model="dateRange"
                            type="daterange"
                            range-separator="To"
                            start-placeholder="Start date"
                            end-placeholder="End date"
                            :size="size"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button
                        color="#426cb9"
                        @click="handleQuery"
                        >
                        <template #icon>
                            <y-icon icon="yiconfenxiang" :size="15" />
                        </template>
                        查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card class="mt-2 flex-1" body-style="height: calc(100% - 40px)">
                <template #header>
                    <div class="flex justify-between">
                        <h1>用户列表</h1>
                        <div>
                            <el-button size="small" type="primary" color="#426cb9" @click="handleDelUser">
                                <template #icon>
                                    <YIcon icon="yiconexcel" size="13" />
                                </template>
                                导出
                            </el-button>
                        </div>
                    </div>
                </template>
                <DataTable
                    :columns="columns"
                    :datasource="datasource"
                ></DataTable>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </template>

<script>
import { defineComponent, reactive, ref, watch } from '@vue/runtime-core'
import YIcon from '@/components/YIcon.vue'
import DataTable from '@/components/DataTable.vue'

export default defineComponent({
  components: { YIcon, DataTable },
  // eslint-disable-next-line no-unused-vars
  setup(props) {
    const queryParams = reactive({
      pageNum: 1,
      pageSize: 10,
      userName: undefined,
      phonenumber: undefined
    })
    const datasource = reactive([
      { AreaName: 'TAP 作业区', price: '1.01', amount: 0, topPointConsume: 0, topConsume: 0, pinConsume: 0, bottomConsume: 0, totalConsume: 0, totalAmount: 0 },
      { AreaName: 'Bonding 设备组', price: '1.01', amount: 0, topPointConsume: 0, topConsume: 0, pinConsume: 0, bottomConsume: 0, totalConsume: 0, totalAmount: 0 },
      { AreaName: 'AOI', price: '1.01', amount: 0, topPointConsume: 0, topConsume: 0, pinConsume: 0, bottomConsume: 0, totalConsume: 0, totalAmount: 0 }
    ])
    const dataTotal = ref(0)
    const ids = []
    const treeData = reactive(
      [
        {
          'value': 100,
          'label': '重庆工厂',
          'children': [
            {
              'value': 101,
              'label': '背光产线',
              'children': [
                {
                  'value': 103,
                  'label': '前段一车间'
                },
                {
                  'value': 104,
                  'label': '前段二车间'
                },
                {
                  'value': 105,
                  'label': '打包车间'
                },
                {
                  'value': 106,
                  'label': '后段车间'
                },
                {
                  'value': 107,
                  'label': 'OQC 区域'
                }
              ]
            },
            {
              'value': 102,
              'label': 'LCM 产线',
              'children': [
                {
                  'value': 108,
                  'label': '前段车间'
                },
                {
                  'value': 109,
                  'label': '后段车间'
                }
              ]
            }
          ]
        }
      ]
    )
    const dateRange = ref('')
    const filterText = ref('')
    const treeRef = ref()
    const UserEditModalRef = ref()
    const columns = [
      { title: '回路名称', field: 'AreaName', sortable: true, showOverflow: true },
      { title: '尖',
        children: [
          { title: '电量', field: 'topPointConsume' },
          { title: '单价', field: 'price' },
          { title: '金额', field: 'amount' }
        ]
      },
      { title: '峰',
        children: [
          { title: '电量', field: 'topConsume' },
          { title: '单价', field: 'price' },
          { title: '金额', field: 'amount' }
        ]
      },
      { title: '平',
        children: [
          { title: '电量', field: 'pinConsume' },
          { title: '单价', field: 'price' },
          { title: '金额', field: 'amount' }
        ]
      },
      { title: '谷',
        children: [
          { title: '电量', field: 'bottomConsume' },
          { title: '单价', field: 'price' },
          { title: '金额', field: 'amount' }
        ]
      },
      { title: '合计',
        children: [
          { title: '电量(kW-h)', field: 'totalConsume' },
          { title: '金额(元)', field: 'totalAmount' }
        ]
      }
    ]

    function handleSizeChange(val) {
      queryParams.pageSize = val
    }

    function handleCurrentPageChange(val) {
      queryParams.currentPage = val
    }

    function handleDelUser() {
    }

    function filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }

    function handleAddUserShow() {
      UserEditModalRef.value.show()
    }

    function handleAddUser() {
    }

    function handleModifyUserShow(row) {
      UserEditModalRef.value.show(row, true)
    }

    function handleModifyUser() {
    }

    function handleSelectionChange(val) {
      ids.length = 0
      for (let i = 0; i < val.length; i++) {
        ids.push(val[i]['userId'])
      }
    }

    function handleDeptNodeClick(data) {
      queryParams['deptId'] = data.value
      queryParams.currentPage = 1
      handleQuery()
    }

    function handleQuery() {
    }

    watch(filterText, (val) => {
      treeRef.value.filter(val)
    })

    return {
      datasource,
      dataTotal,
      treeData,
      dateRange,
      filterText,
      treeRef,
      UserEditModalRef,
      queryParams,
      columns,
      handleSizeChange,
      handleCurrentPageChange,
      handleDelUser,
      filterNode,
      handleAddUserShow,
      handleAddUser,
      handleModifyUserShow,
      handleModifyUser,
      handleSelectionChange,
      handleDeptNodeClick,
      handleQuery
    }
  }
})
</script>

  <style lang="scss" scoped>
  .tableClass :deep(th) {
    background: #f0f0f0 !important;
  }
  </style>

