import Vue from 'vue'
import Router from 'vue-router'
//登录页面
import Login from '../components/Login'
//主页面
import Home from '../components/Home'
//供应商
import Supplier from '../components/supplier/supplier'
import Info from '../components/supplier/info'
import Price from '../components/supplier/price'
import Stock from '../components/supplier/stock'
//管理员后台
import Manager from '../components/manager/manager'
import Member from '../components/manager/member'
import Operate from '../components/manager/operate'
import Review from '../components/manager/review'
//订单
import Order from '../components/order/order'
import Detail from '../components/order/detail'
import Search from '../components/order/search'
import Shop from '../components/order/shop'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/order',
          name: 'order',
          component: Order,
          children: [
            {
              path: 'search',
              component: Search
            },
            {
              path: 'shop',
              component: Shop
            },
            {
              path: 'detail',
              component: Detail
            }
          ]
        },
        {
          path: '/supplier',
          name: 'supplier',
          component: Supplier,
          children: [
            {
              path: 'info',
              component: Info
            },
            {
              path: 'price',
              component: Price
            },
            {
              path: 'stock',
              component: Stock
            }
          ]
        },
        {
          path: '/manager',
          name: 'Manager',
          component: Manager,
          children: [
            {
              path: 'member',
              component: Member
            },
            {
              path: 'operate',
              component: Operate
            },
            {
              path: 'review',
              component: Review
            }
          ]
        }
      ]
    }
  ]
})
