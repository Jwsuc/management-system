import Vue from 'vue'
import App from './App'
import router from './router'
// 导入 element-ui
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// 按需导入 Element-UI 组件
import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Card,
  Steps,
  Step,
  Cascader,
  Container,
  Header,
  Aside,
  Main,
  MessageBox,
  Message
} from 'element-ui'
// 导入字体图标样式表
import './assets/fonts/iconfont.css'
// 导入全局的样式表
import './assets/css/global.css'
// 导入 axios
import axios from 'axios'
// 导入树形table
import treeTable from 'vue-table-with-tree-grid'
// 导入 nprogress 相关的JS和CSS
import NProgress from 'nprogress'
// 由于 nprogress 的样式表，已经在 index.html 首页中通过CND的形式引入了，所以，不需要再重复打包了！
// import 'nprogress/nprogress.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 把富文本编辑器，注册为全局的组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false
// 安装element-ui
// Vue.use(ElementUI)
// 注册按需导入的element-ui组件
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
// 把 treeTable 注册为全局组件
Vue.component('tree-table', treeTable)
// 设置请求根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 配置axios
Vue.prototype.$http = axios

// 为 axios 的请求拦截器，添加处理函数
// 今后，只要使用 axios 发起了Ajax请求，必然会先调用 通过拦截器指定的回调函数
axios.interceptors.request.use(config => {
  // 展示进度条
  NProgress.start()
  // config 形参，就是当前请求的相关参数
  // console.log(config)
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 响应拦截器
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})

// 定义全局格式化时间的过滤器
Vue.filter('dateFormat', originVal => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
