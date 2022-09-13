<template>
  <div class="p-2">
    <div class="m-2 enter-y">
      <el-button
        color="#426cb9"
        type="primary"
        plain
        @click="handleAddMenuShow"
      >
        <template #icon>
          <y-icon icon="yiconjia" :size="13" />
        </template>
        新增菜单
      </el-button>
      <el-button
        @click="handleExpand"
      >
        <template #icon>
          <y-icon icon="yiconlist" :size="13" />
        </template>
        展开/折叠
      </el-button>
    </div>
    <el-table
      v-if="refreshTable"
      row-key="menuId"
      class="menuTableClass enter-y"
      :data="datasource"
      :default-expand-all="isExpand"
     >
      <el-table-column prop="menuName" label="菜单名称" show-overflow-tooltip />
      <el-table-column prop="icon" label="图标" show-overflow-tooltip />
      <el-table-column prop="perms" label="权限" show-overflow-tooltip />
      <el-table-column prop="path" label="路径" show-overflow-tooltip />
      <el-table-column prop="component" label="Component" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag
            :type="scope.row.status === '0' ? 'success' : 'danger'"
            disable-transitions
            >{{ scope.row.status === '0' ? '正常' : '停用' }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" />
      <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            link
            size="small"
            @click="handleModifyMenuShow(scope.row)"
          >
            修改
          </el-button>
          <el-button
            type="primary"
            link
            size="small"
            @click="handleAddSubMenuShow(scope.row)"
          >
            新增下级
          </el-button>
          <el-button
            type="primary"
            link
            size="small"
            @click="handleDelMenu(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <menu-edit-modal
    ref="MenuEditModalRef"
    @add="handleAddMenu"
    @modify="handleModifyMenu"
  />
</template>

<script>
import { addMenu, delMenu, getMenuList, updateMenu } from '@/api/server'
import YIcon from '@/components/YIcon.vue'
import { handleTree } from '@/utils/utils'
import { defineComponent, nextTick, reactive, ref } from '@vue/runtime-core'
import { ElMessage, ElMessageBox } from 'element-plus'
import MenuEditModal from './modals/MenuEditModal.vue'

export default defineComponent({
  components: { YIcon, MenuEditModal },
  name: 'Menu',
  setup() {
    let datasource
    const isExpand = ref(false)
    const refreshTable = ref(true)
    const MenuEditModalRef = ref(null)

    initMenuList()

    function initMenuList() {
      datasource = reactive([])
      getMenuList().then(res => {
        if (res && res['data']) {
          const treeData = handleTree(res['data'], 'menuId')
          datasource.push(...treeData)
        } else {
          ElMessage.error('数据获取失败')
        }
      })
    }

    function handleModifyMenuShow(row) {
      MenuEditModalRef.value.show(row, true)
    }

    function handleDelMenu(row) {
      ElMessageBox.confirm(
        '确认删除?',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          delMenu(row.menuId).then(res => {
            if (res && res.code === 200) {
              ElMessage.success('删除成功')
              initMenuList()
            } else {
              ElMessage.error(res.msg)
            }
          })
            .catch(errRes => {
              ElMessage.error(errRes.msg)
            })
        })
    }

    function handleAddMenuShow() {
      MenuEditModalRef.value.show()
    }

    function handleAddSubMenuShow(row) {
      MenuEditModalRef.value.show(row, false, true)
    }

    function handleAddMenu(menu) {
      addMenu(menu).then((res) => {
        if (res && res.code === 200) {
          ElMessage.success(res.msg)
          MenuEditModalRef.value.hide()
          initMenuList()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    function handleModifyMenu(menu) {
      updateMenu(menu).then((res) => {
        if (res && res.code === 200) {
          ElMessage.success(res.msg)
          MenuEditModalRef.value.hide()
          initMenuList()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    function handleExpand() {
      refreshTable.value = false
      isExpand.value = !isExpand.value
      nextTick().then(() => {
        refreshTable.value = true
      })
    }

    return {
      datasource,
      isExpand,
      refreshTable,
      handleDelMenu,
      handleExpand,
      handleModifyMenu,
      handleModifyMenuShow,
      handleAddMenu,
      handleAddMenuShow,
      handleAddSubMenuShow,
      MenuEditModalRef
    }
  }
})
</script>

<style lang="scss" scoped>
.menuTableClass :deep(th) {
  background: #f0f0f0 !important;
}
</style>
