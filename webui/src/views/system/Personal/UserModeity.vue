<template>
  <el-dialog v-model="isShow" title="修改密码" size="25%">
    <el-form ref="formRef" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="user.userName" disabled></el-input>
      </el-form-item>
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="user.oldPassword" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password"  show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitForm">保存</el-button>
        <el-button type="danger" size="mini">关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import { updatePwd } from '@/api/server'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export default defineComponent({
  emits: ['modify'],
  setup() {
    const store = useStore()
    const router = useRouter()
    const isShow = ref(false)
    const formRef = ref()
    const user = reactive({
      userName: store.state.user.userInfo.userName,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const rules = reactive({
      oldPassword: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
      newPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
      confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
    })
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.user.confirmPassword !== '') {
          this.$refs.user.validateField('confirmPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.user.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    function submitForm() {
      formRef.value.validate((valid) => {
        if (valid) {
          try {
            const users = {
              ...user
            }
            updatePwd(users).then((res) => {
              if (res && res['code'] === 200) {
                ElMessage.success(res['msg'])
              } else {
                ElMessage.error(res['msg'])
              }
              hide()
            })
          } catch (err) {
            console.error(err)
          }
          // 执行通过校验以后的操作；
          return true
        }
        return false
      })
    }
    function show() {
      isShow.value = true
    }
    function hide() {
      isShow.value = false
    }

    return {
      store,
      user,
      rules,
      show,
      hide,
      router,
      isShow,
      formRef,
      submitForm
    }
  }
})
</script>
