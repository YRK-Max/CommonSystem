<template>
  <div class="p-2 h-full overflow-hidden">
      <el-row class="h-full" :gutter="6">
          <el-col class="h-full" :span="24">
              <el-card class="h-full enter-y" :body-style="{ padding: '10px', height: 'calc(100% - 50px)' }">
                  <template #header>
                      <div class="flex justify-between">
                          <h1>角色列表</h1>
                          <div>
                              <el-button size="small" @click="getList">
                                  <template #icon>
                                      <YIcon icon="yiconshuaxin" :size="12" />
                                  </template>
                                  刷新
                              </el-button>
                              <el-button size="small" type="primary" color="#426cb9" @click="handleRoleModalShow(false, undefined)">
                                  <template #icon>
                                      <YIcon icon="yiconjia" :size="12" />
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
                      :showToolbar="true"
                  >
                    <template #operation="{ row }">
                      <el-button v-if="row['roleKey'] !== 'admin'" type="primary" size="small" link @click="handleRoleModalShow(true, row)">编辑</el-button>
                      <el-button v-if="row['roleKey'] !== 'admin'" type="primary" size="small" link @click="handleDelRole(row)">删除</el-button>
                    </template>
                  </DataTable>
              </el-card>
          </el-col>
      </el-row>
      <RoleEditModal ref="roleEditModal" @add="handleAddRole" @modify="handleEditRole" />
  </div>
</template>
<script>
import DataTable from '@/components/DataTable.vue'
import { defineComponent, reactive, ref } from 'vue'
import YIcon from '@/components/YIcon.vue'
import { addRole, updateRole, getRole, getRoleList, delRole } from '@/api/server.js'
import RoleEditModal from './modals/RoleEditModal.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default defineComponent({
  components: {
    DataTable,
    YIcon,
    RoleEditModal
  },
  setup() {
    const queryParams = reactive({
      pageNum: 1,
      pageSize: 10,
      roleName: undefined,
      roleKey: undefined,
      status: undefined
    })
    const tableConfig = reactive({
      columns: [
        { type: 'seq', width: 40 },
        { type: 'checkbox', width: 40 },
        { field: 'roleId', title: '角色编号', sortable: true, filterMultiple: true },
        { field: 'roleName', title: '角色名称' },
        { field: 'roleKey', title: '权限字符', showOverflow: true, showHeaderOverflow: true },
        { field: 'roleSort', title: '显示顺序', showOverflow: true },
        { field: 'status', title: '状态', showOverflow: true },
        { field: 'createTime', title: '创建时间', showOverflow: true },
        { field: 'operation', title: '操作', showOverflow: true, slots: { default: 'operation' }}
      ],
      data: [],
      total: 0
    })
    const roleEditModal = ref(null)

    function getList() {
      getRoleList(queryParams).then(res => {
        if (res && res.code === 200) {
          tableConfig.data = res['rows']
          tableConfig.total = res['total']
        }
      })
    }

    function handleRoleModalShow(isEdit = false, row = undefined) {
      if (isEdit) {
        getRole(row.roleId).then(res => {
          if (res && res['code'] === 200) {
            roleEditModal.value.show(res['data'], true)
          }
        })
      } else {
        roleEditModal.value.show()
      }
    }

    function handleAddRole(data) {
      addRole(data).then(res => {
        if (res && res['code'] === 200) {
          ElMessage.success(res['msg'])
          roleEditModal.value.hide()
          getList()
        } else {
          ElMessage.error(res['msg'])
        }
      })
    }

    function handleEditRole(data) {
      updateRole(data).then(res => {
        if (res && res['code'] === 200) {
          ElMessage.success(res['msg'])
          roleEditModal.value.hide()
          getList()
        } else {
          ElMessage.error(res['msg'])
        }
      })
    }

    function handleDelRole(row) {
      ElMessageBox.confirm(
        '确认删除？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const roleIds = row.roleId
        delRole(roleIds).then(res => {
          if (res && res['code'] === 200) {
            ElMessage.success(res['msg'])
            getList()
          }
        })
      })
    }

    getList()

    return {
      tableConfig,
      roleEditModal,
      handleRoleModalShow,
      handleAddRole,
      handleEditRole,
      handleDelRole,
      getList
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
