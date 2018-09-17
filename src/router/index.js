import Vue from 'vue'
import Router from 'vue-router'

// 导入 登录组件
// import Login from '@/components/Login'
const Login = () => import(/* webpackChunkName: "login" */ '@/components/Login')

// 导入 后台主页组件
// import Home from '@/components/home/Home'
const Home = () => import(/* webpackChunkName: "home" */ '@/components/home/Home')
// 导入 欢迎组件
// import Welcome from '@/components/home/Welcome'
const Welcome = () => import(/* webpackChunkName: "home" */ '@/components/home/Welcome')

// 导入 用户列表组件
// import UserList from '@/components/user/User'
const UserList = () => import(/* webpackChunkName: "user_power" */ '@/components/user/User')
// 导入 权限列表组件
// import Rights from '@/components/power/Rights'
const Rights = () => import(/* webpackChunkName: "user_power" */ '@/components/power/Rights')
// 导入 角色列表组件
// import Roles from '@/components/power/Roles'
const Roles = () => import(/* webpackChunkName: "user_power" */ '@/components/power/Roles')

// 导入 商品分类组件
// import Cate from '@/components/goods/Cate'
const Cate = () => import(/* webpackChunkName: "cate_params_order" */ '@/components/goods/Cate')
// 导入 商品参数组件
// import Params from '@/components/goods/Params'
const Params = () => import(/* webpackChunkName: "cate_params_order" */ '@/components/goods/Params')
// 导入 订单列表组件
// import Order from '@/components/order/Order'
const Order = () => import(/* webpackChunkName: "cate_params_order" */ '@/components/order/Order')

// 导入 报表组件
// import Report from '@/components/report/Report'
const Report = () => import(/* webpackChunkName: "report_goods" */ '@/components/report/Report')
// 导入 商品列表组件
// import GoodsList from '@/components/goods/GoodsList'
const GoodsList = () => import(/* webpackChunkName: "report_goods" */ '@/components/goods/GoodsList')
// 导入 商品添加组件
// import GoodsAdd from '@/components/goods/Add'
const GoodsAdd = () => import(/* webpackChunkName: "report_goods" */ '@/components/goods/Add')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: UserList },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report },
        { path: '/goods', redirect: '/goods/list' },
        { path: '/goods/list', component: GoodsList },
        { path: '/goods/add', component: GoodsAdd, name: 'goodsadd' }
      ]
    }
  ]
})

// 为路由对象，添加 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取到 保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
