<template>
  <div class="p-2 h-full overflow-hidden">
    <el-row class="h-full enter-y" :gutter="6">
      <el-col :span="4">
        <el-card header="部门" class="h-full">
            <el-input v-model="filterText" placeholder="部门筛选">
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
        <el-card class="h-full">
          <template #header>
              <div class="flex justify-between">
                  <h1>用户列表</h1>
                  <div>
                      <el-button size="small" type="primary" color="#426cb9" @click="handleAddUserShow">
                          <template #icon>
                              <YIcon icon="yiconjia" size="12" />
                          </template>
                          添加
                      </el-button>
                      <el-button size="small" type="primary" color="#c12c1f" @click="handleDelUser">
                          <template #icon>
                              <YIcon icon="yiconlajitong" size="13" />
                          </template>
                          删除
                      </el-button>
                  </div>
              </div>
          </template>
          <el-form :inline="true" size="middle">
            <el-form-item label="用户名称">
              <el-input v-model="queryParams.userName" />
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="queryParams.phonenumber" />
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
          <el-table
            class="tableClass"
            :data="datasource"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="userId" label="用户 ID" show-overflow-tooltip />
            <el-table-column prop="userName" label="用户名称" show-overflow-tooltip />
            <el-table-column prop="nickName" label="用户昵称" show-overflow-tooltip />
            <el-table-column prop="deptName" label="所属部门" show-overflow-tooltip>
              <template #default="scope">
                <label>{{ scope.row.dept.deptName }}</label>
              </template>
            </el-table-column>
            <el-table-column prop="phonenumber" label="手机号" show-overflow-tooltip />
            <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
            <el-table-column fixed="right" label="操作" width="220">
              <template #default="scope">
                <el-button
                  v-if="!scope.row.admin"
                  link
                  type="primary"
                  @click="handleModifyUserShow(scope.row)"
                >
                  <template #icon>
                    <y-icon icon="yiconeditor" :size="12" />
                  </template>
                  修改
                </el-button>
                <el-button
                  v-if="!scope.row.admin"
                  link
                  type="primary"
                  @click="handleDelUser(scope.row)"
                >
                  <template #icon>
                    <y-icon icon="yiconlajitong" :size="12" />
                  </template>
                  删除
                </el-button>
                <el-dropdown
                  v-if="!scope.row.admin"
                  style="margin: 2px 0 2px 12px"
                >
                  <el-button
                    link
                    type="primary"
                  >
                    <template #icon>
                      <y-icon icon="yicongengduo" :size="12" />
                    </template>
                    更多
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-item @click="handleResetPwd(scope.row)">
                      <y-icon icon="yiconquanxianyuechi" />
                      重置密码
                    </el-dropdown-item>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="mt-4 float-right"
            small
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataTotal"
            :page-sizes="[10, 20, 50, 100]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageChange"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
  <user-edit-modal
    ref="UserEditModalRef"
    @add="handleAddUser"
    @modify="handleModifyUser"
  />
</template>

<script>
import { defineComponent, reactive, ref, watch } from '@vue/runtime-core'
import { addUser, delUser, getDeptTreeList, getUserList, resetPwd, updateUser } from '@/api/server'
import YIcon from '@/components/YIcon.vue'
import UserEditModal from './modals/UserEditModal.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: { YIcon, UserEditModal },
  // eslint-disable-next-line no-unused-vars
  setup(props) {
    const queryParams = reactive({
      pageNum: 1,
      pageSize: 10,
      userName: undefined,
      phonenumber: undefined
    })
    const datasource = reactive([])
    const dataTotal = ref(0)
    const ids = []
    const treeData = reactive([])
    const filterText = ref('')
    const treeRef = ref()
    const UserEditModalRef = ref()

    function getList() {
      getUserList(queryParams).then((res) => {
        if (res && res.code === 200) {
          datasource.length = 0
          datasource.push(...res['rows'])
          dataTotal.value = res['total']
        }
      })
    }

    getDeptTreeList().then(res => {
      if (res && res.code === 200) {
        treeData.push(...res['data'])
      }
    })

    function handleSizeChange(val) {
      queryParams.pageSize = val
    }

    function handleCurrentPageChange(val) {
      queryParams.currentPage = val
    }

    function handleDelUser(row) {
      ElMessageBox.confirm(
        '确认删除？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const userIds = row.userId || ids
        delUser(userIds).then(res => {
          if (res && res['code'] === 200) {
            ElMessage.success(res['msg'])
            getList()
          }
        })
      })
    }

    function filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }

    function handleAddUserShow() {
      UserEditModalRef.value.show()
    }

    function handleAddUser(user) {
      addUser(user).then(res => {
        if (res && res['code'] === 200) {
          ElMessage.success(res['msg'])
          UserEditModalRef.value.hide()
          handleQuery()
        } else {
          ElMessage.error(res['msg'])
        }
      })
    }

    function handleModifyUserShow(row) {
      UserEditModalRef.value.show(row, true)
    }

    function handleModifyUser(user) {
      updateUser(user).then(res => {
        if (res && res['code'] === 200) {
          ElMessage.success(res['msg'])
          UserEditModalRef.value.hide()
          getList()
        } else {
          ElMessage.error(res['msg'])
        }
      })
    }

    function handleSelectionChange(val) {
      ids.length = 0
      for (let i = 0; i < val.length; i++) {
        ids.push(val[i]['userId'])
      }
    }

    function handleResetPwd(user) {
      ElMessageBox.confirm(
        '确认重置？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        user.password = '123456'
        resetPwd(user).then(res => {
          if (res && res['code'] === 200) {
            ElMessage.success(res['msg'])
          } else {
            ElMessage.error(res['msg'])
          }
        })
      })
    }

    function handleDeptNodeClick(data) {
      queryParams['deptId'] = data.value
      queryParams.currentPage = 1
      handleQuery()
    }

    function handleQuery() {
      queryParams.currentPage = 1
      getList()
    }

    watch(filterText, (val) => {
      treeRef.value.filter(val)
    })

    getList()

    return {
      datasource,
      dataTotal,
      treeData,
      filterText,
      treeRef,
      UserEditModalRef,
      queryParams,
      handleSizeChange,
      handleCurrentPageChange,
      handleDelUser,
      filterNode,
      handleAddUserShow,
      handleAddUser,
      handleModifyUserShow,
      handleModifyUser,
      handleSelectionChange,
      handleResetPwd,
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
