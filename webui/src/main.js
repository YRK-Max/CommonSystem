import '@/style/index.scss'
// 引入组件库 Element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
// 引入windicss
import 'windi.css'
import App from './App.vue'
// 引入图标库
import './assets/iconfont/iconfont.css'
// 引入 splitpanes 的样式库
import 'splitpanes/dist/splitpanes.css'
// 国际化
import VueI18n from './locales'
// permission.js 主要处理页面跳转，权限检查相关工作
import './permission'
import router from './router'
import store from './store'
// vxe-table
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

// vue-grid-layout
import VueGridLayout from 'vue-grid-layout'

const app = createApp(App)
app.use(VueI18n)
app.use(ElementPlus)
app.use(router)
app.use(store)
app.use(VXETable)
app.use(VueGridLayout)
app.mount('#app')
