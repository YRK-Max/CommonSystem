import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { getToken } from './token'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 50 * 1000
})

// 请求拦截器配置
service.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

// 响应拦截器配置
service.interceptors.response.use(response => {
  const data = response.data

  if (response.status !== 200 || data.code !== 200) {
    let message = data['msg'] || 'UnKown Error.'
    let type = 'error'

    switch (data.code) {
      case 401:
        message = '登录已过期，请重新登录'
        type = 'warning'
        store.dispatch('user/logout')
        router.push('/login')
        break
    }
    ElNotification({
      title: type,
      message: message,
      type: type
    })
    return Promise.reject(new Error(data['msg'] || 'Error'))
  } else {
    return data
  }
})

export default service
