<template>
  <el-dialog v-model="isShow" title="修改个人信息" size="25%">
    <el-form ref="settingFormRef" :model="settingForm" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label=" 用户 ID :">
        <el-input v-model="settingForm.userId" maxlength="10" disabled></el-input>
      </el-form-item>
      <el-form-item label=" 用户姓名 :">
        <el-input v-model="settingForm.userName" maxlength="10" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="settingForm.nickName" placeholder="请输入昵称" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="settingForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phonenumber">
        <el-input v-model="settingForm.phonenumber" placeholder="请输入11位大陆手机号码"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="settingForm.remark" type="textarea" placeholder="备注" maxlength="120"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="updateLoading" @click="submitForm">更新基本信息</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { updateBase } from '@/api/server'
export default defineComponent({
  emits: ['modify'],
  setup() {
    const isShow = ref(false)
    const store = useStore()
    const router = useRouter()
    const settingForm = reactive({
      userId: store.state.user.userInfo.userId,
      userName: store.state.user.userInfo.userName,
      email: store.state.user.userInfo.email,
      nickName: store.state.user.userInfo.nickName,
      remark: '',
      phonenumber: store.state.user.userInfo.phonenumber
    })
    const validatePhone = (rule, value, callback) => {
      const str = new RegExp('^1[3578]\\d{9}$')
      if (!str.test(value)) {
        callback(new Error('手机号码格式错误！'))
      } else {
        callback()
      }
    }
    const rules = reactive({
      phonenumber: [{ validator: validatePhone, trigger: 'blur' }]
    })
    const settingFormRef = ref()
    function show() {
      isShow.value = true
    }
    function hide() {
      isShow.value = false
    }
    function submitForm() {
      settingFormRef.value.validate((valid) => {
        if (valid) {
          try {
            const user = {
              ...settingForm
            }
            updateBase(user).then(res => {
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
    const resetForm = () => {
      settingFormRef.value.resetFields()
    }

    return {
      isShow,
      store,
      router,
      rules,
      settingForm,
      settingFormRef,
      show,
      hide,
      submitForm,
      resetForm
    }
  }
})
</script>
