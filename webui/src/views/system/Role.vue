<template>
  <div class="p-2">
    <el-form class="enter-y" inline>
      <el-form-item label="角色名称">
        <el-input />
      </el-form-item>
      <el-form-item label="权限字符">
        <el-input />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          color="#426cb9"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      row-key="menuId"
      class="menuTableClass enter-y"
      :data="datasource"
      :default-expand-all="isExpand"
     >
      <el-table-column prop="menuName" label="菜单名称" show-overflow-tooltip />
      <el-table-column prop="icon" label="图标" show-overflow-tooltip />
      <el-table-column prop="perms" label="权限" show-overflow-tooltip />
      <el-table-column prop="path" label="路径" show-overflow-tooltip />
    </el-table>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from '@vue/runtime-core'

export default defineComponent({
  setup() {
    const datasource = reactive([])
    const isExpand = ref(true)

    return {
      datasource,
      isExpand
    }
  }
})
</script>

<style lang="scss" scoped>
.menuTableClass :deep(th) {
  background: #f0f0f0 !important;
}
</style>
