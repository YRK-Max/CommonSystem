<template>
  <el-drawer
    v-model="isShow"
    title="编辑用户"
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
      <el-form-item v-if="isEdit" label="用户 ID" prop="userId">
        <el-input v-model="form.userId" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="form.userName" :disabled="isEdit" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="form.nickName" />
      </el-form-item>
      <el-form-item label="归属部门" prop="deptId">
        <el-tree-select
          v-model="form.deptId"
          style="width: 100%"
          check-strictly
          default-expand-all
          placeholder="请选择部门"
          :data="deptTreeList"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input v-model="form.phonenumber"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="用户性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户角色" prop="roleIds">
        <el-select
          v-model="form.roleIds"
          class="w-full"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="Select"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          maxlength="30"
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
import { getDeptTreeList, getRoleSelectOptions, getUserById } from '@/api/server'
import { defineComponent, reactive, ref } from '@vue/runtime-core'

export default defineComponent({
  emits: ['add', 'modify'],
  // eslint-disable-next-line no-unused-vars
  setup(props, context) {
    const addMenuForm = ref()
    const isShow = ref(false)
    const isEdit = ref(false)
    const form = reactive({
      userName: '',
      password: '123456',
      nickName: '',
      deptId: '',
      phonenumber: '',
      email: '',
      sex: '0',
      roleIds: [],
      remark: ''
    })
    const rules = reactive({
      userName: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
      deptId: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
      nickName: [{ required: true, message: '此项不能为空', trigger: 'blur' }]
    })
    const deptTreeList = reactive([])
    const roleOptions = reactive([])

    // 初始化区
    getDeptTreeList().then((res) => {
      if (res && res['code'] === 200) {
        deptTreeList.push(...res['data'])
      }
    })

    getRoleSelectOptions().then((res) => {
      if (res && res['code'] === 200) {
        roleOptions.push(...res['data'])
      }
    })

    // 函数区
    function show(userInfo = null, editFlag = false) {
      isShow.value = true
      isEdit.value = editFlag
      if (userInfo && editFlag) {
        getUserById(userInfo.userId).then(res => {
          if (res && res['code'] === 200) {
            const userDetailInfo = res['data']
            this.form.userId = userDetailInfo.userId
            this.form.password = userDetailInfo.password
            this.form.userName = userDetailInfo.userName
            this.form.nickName = userDetailInfo.nickName
            this.form.deptId = userDetailInfo.deptId
            this.form.phonenumber = userDetailInfo.phonenumber
            this.form.email = userDetailInfo.email
            this.form.sex = userDetailInfo.sex
            this.form.remark = userDetailInfo.remark
            this.form.roleIds = res['roleIds']
          }
        })
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
      addMenuForm,
      form,
      isShow,
      isEdit,
      deptTreeList,
      rules,
      roleOptions,
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
