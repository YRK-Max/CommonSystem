<template>
  <div class="Profile">
    <el-row>
      <el-col :offset="1" :span="22">
        <div class="grid-content bg-purple-dark">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <el-button class="button" type="text" @click="handleBack">返回</el-button>
                <span>个人设置</span>
                <div></div>
              </div>
            </template>
            <el-tabs :tab-position="tabPosition">
              <el-tab-pane label="基本信息">
                <div class="set-title">
                  <span>基本信息</span>
                </div>
                <div class="set-info">
                  <div class="form-info">
                    <el-form label-width="100px" class="demo-ruleForm" :data="settingForm">
                      <el-form-item label=" 用户 ID :"> {{settingForm.userId}}</el-form-item>
                      <el-form-item label=" 用户姓名 :">{{settingForm.userName}}</el-form-item>
                      <el-form-item label="用户昵称 :"> {{settingForm.nickName}} </el-form-item>
                      <el-form-item label="所属部门 :"> {{settingForm.deptName}} </el-form-item>
                      <el-form-item label="手机号码: "> {{settingForm.phonenumber}}</el-form-item>
                      <el-form-item label="用户邮箱 :"> {{settingForm.email}} </el-form-item>
                      <el-form-item>
                        <el-button type="primary" :loading="updateLoading" @click="BaseSettingShow">更新基本信息</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div class="avatar">
                    <div class="preview">
                      <span>头像</span>
                      <img :src="avatarUrl" />
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="安全设置">
                <div class="set-title">
                  <span>安全设置</span>
                </div>
                <div class="secure-item">
                  <div class="secure-info">
                    <span class="secure-key">账户密码</span>
                    <span class="secure-value">当前密码强度：强</span>
                  </div>
                  <el-button type="primary" @click="ModifyPawShow">修改 </el-button>
                </div>
                <div class="secure-item">
                  <div class="secure-info">
                    <span class="secure-key">密保手机</span>
                    <span class="secure-value">已绑定手机：138****2234</span>
                  </div>
                  <el-button type="primary" >修改 </el-button>
                </div>
                <div class="secure-item">
                  <div class="secure-info">
                    <span class="secure-key">绑定邮箱</span>
                    <span class="secure-value">已绑定邮箱：geek****@outlook.com</span>
                  </div>
                  <el-button type="primary">修改 </el-button>
                </div>
              </el-tab-pane>
              <el-tab-pane label="新消息通知">
                <div class="set-title">
                  <span>新消息通知</span>
                </div>
                <div class="secure-item">
                  <div class="secure-info">
                    <span class="secure-key">账户密码</span>
                    <span class="secure-value">用户信息将以系统内部渠道通知</span>
                  </div>
                  <el-tooltip :content="'是否开启用户信息: '" placement="top">
                    <el-switch v-model="userSwitch"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="true"
                      :inactive-value="false"> </el-switch>
                  </el-tooltip>
                </div>
                <div class="secure-item">
                  <div class="secure-info">
                    <span class="secure-key">系统消息</span>
                    <span class="secure-value">系统消息将以系统内部渠道通知</span>
                  </div>
                  <el-tooltip :content="'是否开启系统消息: '" placement="top">
                    <el-switch v-model="sysSwitch"
                     active-color="#13ce66"
                      inactive-color="#ff4949"
                       :active-value="true"
                      :inactive-value="false"> </el-switch>
                  </el-tooltip>
                </div>
                <div class="secure-item">
                  <div class="secure-info">
                    <span class="secure-key">代办任务</span>
                    <span class="secure-value">代办任务将以系统内部渠道通知</span>
                  </div>
                  <el-tooltip :content="'是否开启代办任务消息: '" placement="top">
                    <el-switch v-model="taskSwitch"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                             :active-value="true"
                      :inactive-value="false"> </el-switch>
                  </el-tooltip>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
  <user-modeity ref="UserModeity" @modify="handleUserModeity" />
  <base-setting ref="BaseSetting" @modify="handleBaseSetting" />
</template>
<script >
import { defineComponent, reactive, ref, toRefs, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import UserModeity from './Personal/UserModeity.vue'
import BaseSetting from './Personal/BaseSetting.vue'
export default defineComponent({
  name: 'Profile',
  components: { UserModeity, BaseSetting },
  setup() {
    const handleBack = () => {
      router.go(-1)
    }
    const tabPosition = ref('left')
    const store = useStore()
    const router = useRouter()
    const settingForm = reactive({
      userId: store.state.user.userInfo.userId,
      userName: store.state.user.userInfo.userName,
      email: store.state.user.userInfo.email,
      nickName: store.state.user.userInfo.nickName,
      phonenumber: store.state.user.userInfo.phonenumber,
      deptName: store.state.user.userInfo.dept.deptName
    })
    const updateLoading = ref(false)
    const imageUrl = ref()
    const avatarUrl = computed(() => { return store.state.user.userInfo.avatarUrl || require('@/assets/images/avatar.jpg') })
    const UserModeity = ref()
    const BaseSetting = ref()
    const noticeSwitch = reactive({
      userSwitch: false,
      sysSwitch: true,
      taskSwitch: true
    })
    const queryParams = reactive({
      userName: store.state.user.userInfo.userId
    })
    function ModifyPawShow() {
      UserModeity.value.show(true)
    }
    function BaseSettingShow() {
      BaseSetting.value.show(true)
    }

    function handleUserModeity() {
      UserModeity.value.hide()
    }
    function handleBaseSetting() {
      BaseSetting.value.hide()
    }

    return {
      store,
      tabPosition,
      avatarUrl,
      ...toRefs(noticeSwitch),
      settingForm,
      imageUrl,
      updateLoading,
      UserModeity,
      BaseSetting,
      queryParams,
      handleBack,
      ModifyPawShow,
      BaseSettingShow,
      handleUserModeity,
      handleBaseSetting
    }
  }
})
</script>

<style  scoped>
.Profile {
  margin-top: 20px;
}

.demo-ruleForm {
  text-align: left;
}

.set-title {
  text-align: left;
}

.secure-item {
  width: 100%;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.secure-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.secure-key {
  margin-bottom: 4px;
  color: rgba(0, 0, 0, .85);
  font-size: 14px;
  line-height: 1.6;
}

.secure-value {
  color: rgba(0, 0, 0, .45);
  font-size: 14px;
  line-height: 1.6;
}

.opera-btn {
  cursor: pointer;
}

.set-info {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
}

.avatar {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
}

.preview {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-right: 20px;
}

img {
  width: 174px;
  height: 174px;
  border-radius: 50%;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.info {
  text-align: left;
  padding-left: 20px;
  margin-bottom: 20px;
  font-size: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}
</style>
