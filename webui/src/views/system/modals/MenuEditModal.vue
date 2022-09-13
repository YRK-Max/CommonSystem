<template>
  <el-drawer
    v-model="isShow"
    title="添加菜单"
    size="25%"
  >
    <el-form
      ref="addMenuForm"
      :model="form"
      class="ml-3 mr-3"
      label-position="left"
      :label-width="100"
      :rules="rules"
    >
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="form.menuType" :disabled="isSubMenu">
          <el-radio label="M">一级菜单</el-radio>
          <el-radio label="C">子菜单</el-radio>
          <el-radio label="F">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.menuType != 'M'" label="上级菜单" prop="parentMenu">
        <el-tree-select
          v-model="form.parentId"
          style="width: 100%"
          check-strictly
          default-expand-all
          placeholder="请选择父节点"
          :data="menuTreeList"
          :disabled="isSubMenu"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="form.menuName"></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" prop="perms">
        <el-input v-model="form.perms"></el-input>
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item label="路由组件" prop="component">
        <el-input v-model="form.component"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <div class="flex w-full">
          <el-input v-model="form.icon"></el-input>
          <el-popover placement="bottom-start" :width="400" trigger="click">
            <template #reference>
              <div class="border-gray-200 w-13 border-solid border-1 bg-gray-100">
                <y-icon :icon="form.icon" />
              </div>
            </template>
              <el-row>
                <el-col
                  v-for="icon in glyphs"
                  :key="icon.icon_id"
                  :span="3"
                >
                  <y-icon
                    :icon="css_prefix_text + icon.font_class"
                    @click="handleSelectIcon(css_prefix_text + icon.font_class)"
                  />
                </el-col>
              </el-row>
          </el-popover>
        </div>
      </el-form-item>
      <el-form-item label="显示排序" prop="orderNum">
        <el-input-number v-model="form.orderNum" />
      </el-form-item>
      <el-form-item label="是否隐藏">
        <el-radio-group v-model="form.visible" prop="visible">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否缓存" prop="isCache">
        <el-radio-group v-model="form.isCache">
          <el-radio label="0">是</el-radio>
          <el-radio label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button>取消</el-button>
      <el-button type='primary' @click="submitForm">{{ isEdit?"修改":"新增" }}</el-button>
    </template>
  </el-drawer>
</template>

<script>
import { getMenuTreeList } from '@/api/server'
import YIcon from '@/components/YIcon.vue'
import { getUUIDNum } from '@/utils/utils'
import { defineComponent, reactive, ref } from '@vue/runtime-core'
import iconJson from '@/assets/iconfont/iconfont.json'

export default defineComponent({
  components: { YIcon },
  emits: ['add', 'modify'],
  // eslint-disable-next-line no-unused-vars
  setup(props, context) {
    const css_prefix_text = iconJson.css_prefix_text
    const glyphs = iconJson.glyphs
    const addMenuForm = ref()
    const isShow = ref(false)
    const isEdit = ref(false)
    const isSubMenu = ref(false)
    const form = reactive({
      menuId: parseInt(getUUIDNum()),
      menuType: 'M',
      parentId: '',
      menuName: '',
      perms: '',
      path: '',
      component: '',
      icon: '#',
      orderNum: 1,
      isCache: '0',
      visible: '0',
      status: '0'
    })
    const rules = reactive({
      menuName: [{ required: true, message: '菜单名不能为空', trigger: 'blur' }],
      path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
      component: [{ required: true, message: '组件名不能为空', trigger: 'blur' }]
    })
    const menuTreeList = reactive([])

    // 初始化区
    getMenuTreeList().then((res) => {
      menuTreeList.push(...res.data)
    })

    // 函数区
    function show(menuInfo = null, editFlag = false, subMenu = false) {
      isShow.value = true
      isEdit.value = editFlag
      isSubMenu.value = subMenu
      if (menuInfo && !subMenu) {
        this.form.menuId = menuInfo.menuId
        this.form.menuType = menuInfo.menuType
        this.form.parentId = menuInfo.parentId
        this.form.menuName = menuInfo.menuName
        this.form.perms = menuInfo.perms
        this.form.path = menuInfo.path
        this.form.component = menuInfo.component
        this.form.icon = menuInfo.icon
        this.form.orderNum = menuInfo.orderNum
        this.form.visible = menuInfo.visible
        this.form.status = menuInfo.status
      }

      if (menuInfo && subMenu) {
        this.form.menuType = 'C'
        this.form.parentId = menuInfo.menuId
      }
    }

    function hide() {
      isShow.value = false
    }

    function handleSelectIcon(iconClass) {
      this.form.icon = iconClass
    }

    function submitForm() {
      addMenuForm.value.validate((valid, fields) => {
        if (valid) {
          isEdit.value ? context.emit('modify', form) : context.emit('add', form)
        } else {
          console.log('error submit!', fields)
        }
      })
    }

    return {
      css_prefix_text,
      glyphs,
      addMenuForm,
      form,
      isShow,
      isEdit,
      isSubMenu,
      menuTreeList,
      rules,
      show,
      hide,
      submitForm,
      handleSelectIcon
    }
  }
})
</script>

<style>

</style>
