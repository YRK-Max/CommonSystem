<template>
  <div class="p-2 h-full overflow-hidden">
      <el-row class="h-full" :gutter="6">
          <el-col class="h-full" :span="24">
              <el-card class="h-full enter-y" :body-style="{ padding: '10px', height: 'calc(100% - 50px)' }">
                  <template #header>
                      <div class="flex justify-between">
                          <h1>角色列表</h1>
                          <div>
                              <el-button size="small">
                                  <template #icon>
                                      <YIcon icon="yiconshuaxin" size="12" />
                                  </template>
                                  刷新
                              </el-button>
                              <el-button size="small" type="primary" color="#426cb9">
                                  <template #icon>
                                      <YIcon icon="yiconjia" size="12" />
                                  </template>
                                  添加
                              </el-button>
                          </div>
                      </div>
                  </template>
                  <DataTable
                      :columns="tableConfig.columns"
                      :data="tableConfig.data"
                      :total="tableConfig.total"
                      :showPager="true"
                  >
                    <template #operation="{ row }">
                      <el-button v-if="row['roleKey'] !== 'admin'" type="primary" size="small" link @click="handleEdit(row)">编辑</el-button>
                      <el-button v-if="row['roleKey'] !== 'admin'" type="primary" size="small" link @click="handleEdit(row)">删除</el-button>
                    </template>
                  </DataTable>
              </el-card>
          </el-col>
      </el-row>
  </div>
</template>
<script>
import DataTable from '@/components/DataTable.vue'
import { defineComponent, reactive } from 'vue'
import YIcon from '@/components/YIcon.vue'
import { getRoleList } from '@/api/server.js'
export default defineComponent({
  components: {
    DataTable,
    YIcon
  },
  setup() {
    const queryParams = reactive({
      pageNum: 1,
      pageSize: 10
    })
    const tableConfig = reactive({
      columns: [
        { type: 'seq', width: 40 },
        { type: 'checkbox', width: 40 },
        { field: 'roleId', title: '角色编号', sortable: true, filterMultiple: true },
        { field: 'roleName', title: '角色名称' },
        { field: 'roleKey', title: '权限字符', showOverflow: true, showHeaderOverflow: true },
        { field: 'roleSort', title: '显示顺序', showOverflow: true },
        { status: 'status', title: '状态', showOverflow: true },
        { field: 'createTime', title: '创建时间', showOverflow: true },
        { field: 'operation', title: '操作', showOverflow: true, slots: { default: 'operation' }}
      ],
      data: [],
      total: 0
    })

    function QueryData() {
      getRoleList(queryParams).then(res => {
        if (res && res.code === 200) {
          tableConfig.data = res['rows']
          tableConfig.total = res['total']
        }
      })
    }

    QueryData()

    return {
      tableConfig
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
