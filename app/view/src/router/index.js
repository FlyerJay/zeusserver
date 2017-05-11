import Router from 'vue-router'
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
import Cart from '../components/order/Cart'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/order',
      component: Order
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
      redirect: '/order/search',
      children: [{
          path: 'search',
          component: Search
        },
        {
          path: 'cart',
          component: Cart
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
      redirect: '/supplier/info',
      children: [{
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
      redirect: '/manager/review',
      children: [{
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
})