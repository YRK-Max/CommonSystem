<template>
  <el-drawer
    v-model="isShow"
    title="编辑角色"
    size="25%"
    @closed="handleClosed"
  >
    <el-form
      ref="addMenuForm"
      :model="form"
      class="ml-3 mr-3"
      label-position="left"
      :label-width="100"
      :rules="rules"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-space fill>
        <el-alert type="info" show-icon :closable="false">
          <p>控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)</p>
        </el-alert>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="form.roleKey"></el-input>
        </el-form-item>
      </el-space>
      <el-form-item label="角色顺序" prop="roleSort">
        <el-input-number v-model="form.roleSort" />
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色权限">
        <div>
          <el-checkbox v-model="menuExpand" label="折叠/展开" @change="handleCheckedTreeExpand($event)" />
          <el-checkbox v-model="menuNodeAll" label="全选/全不选" @change="handleCheckedTreeNodeAll($event)" />
        </div>
        <el-tree
          ref="menuTree"
          class="w-full tree-border"
          show-checkbox
          node-key="value"
          default-expand-all
          :data="menuOptions"
          :check-strictly="!form.menuCheckStrictly"
          :props="defaultProps"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          maxlength="60"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button>取消</el-button>
      <el-button type='primary' @click="submitForm">{{ isEdit?"修改":"新增" }}</el-button>
    </template>
  </el-drawer>
</template>

<script>
import { getMenuTreeList, getRoleMenuTreeselect } from '@/api/server'
import { defineComponent, reactive, ref } from '@vue/runtime-core'
import { getUUIDNum } from '@/utils/utils'

export default defineComponent({
  components: {},
  emits: ['add', 'modify'],
  // eslint-disable-next-line no-unused-vars
  setup(props, context) {
    const addMenuForm = ref()
    const menuTree = ref()
    const isShow = ref(false)
    const isEdit = ref(false)
    const menuExpand = ref(true)
    const menuNodeAll = ref(false)
    const defaultProps = {
      children: 'children',
      label: 'label'
    }
    const form = reactive({
      roleId: parseInt(getUUIDNum()),
      roleName: undefined,
      roleKey: undefined,
      roleSort: 0,
      status: '0',
      menuIds: [],
      menuCheckStrictly: true,
      remark: undefined
    })
    const rules = reactive({
      roleName: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
      roleKey: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
      roleSort: [{ required: true, message: '此项不能为空', trigger: 'blur' }]
    })
    const menuOptions = reactive([])

    // 初始化区
    getMenuTreeList().then((res) => {
      menuOptions.push(...res.data)
    })

    // 函数区
    function show(roleInfo = null, editFlag = false) {
      isShow.value = true
      isEdit.value = editFlag
      if (roleInfo && editFlag) {
        form.roleId = roleInfo.roleId
        form.roleName = roleInfo.roleName
        form.roleKey = roleInfo.roleKey
        form.roleSort = roleInfo.roleSort
        form.status = roleInfo.status
        form.menuIds = roleInfo.menuIds
        form.menuCheckStrictly = roleInfo.menuCheckStrictly
        form.remark = roleInfo.remark
        getRoleMenuTreeselect(form.roleId).then(res => {
          if (res && res['code'] === 200) {
            const checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
              menuTree.value.setChecked(v, true, false)
            })
          }
        })
      }
    }

    function hide() {
      isShow.value = false
    }

    function handleClosed() {
      form.roleId = undefined
      form.roleName = undefined
      form.roleKey = undefined
      form.roleSort = undefined
      form.status = undefined
      form.menuIds = []
      form.menuCheckStrictly = false
      form.remark = ''
      menuTree.value.setCheckedNodes([])
    }

    function getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = menuTree.value.getCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = menuTree.value.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    }

    function submitForm() {
      addMenuForm.value.validate((valid, fields) => {
        if (valid) {
          form.menuIds = getMenuAllCheckedKeys()
          isEdit.value ? context.emit('modify', form) : context.emit('add', form)
        } else {
          console.log('error submit!', fields)
        }
      })
    }

    // 树权限（展开/折叠）
    function handleCheckedTreeExpand(value) {
      const treeList = menuOptions
      for (let i = 0; i < treeList.length; i++) {
        menuTree.value.store.nodesMap[treeList[i].value].expanded = value
      }
    }

    // 树权限（全选/全不选）
    function handleCheckedTreeNodeAll(value) {
      menuTree.value.setCheckedNodes(value ? menuOptions : [])
      console.log(menuTree.value.getCheckedNodes())
    }

    return {
      addMenuForm,
      menuTree,
      form,
      isShow,
      isEdit,
      menuOptions,
      rules,
      menuExpand,
      menuNodeAll,
      defaultProps,
      show,
      hide,
      submitForm,
      handleCheckedTreeExpand,
      handleCheckedTreeNodeAll,
      getMenuAllCheckedKeys,
      handleClosed
    }
  }
})
</script>

<style lang="scss" scoped>
.tree-border {
  margin-top: 5px;
  border: 1px solid #e5e6e7;
  background: #fff none;
  border-radius: 4px;
}
</style>
