import Router from 'vue-router'
import Vue from 'vue'

// 需求管理
import DemandIndex from '../components/demand/index'
import DemandManage from '../components/demand/manage'
import DemandStatics from '../components/demand/statics'

// 供应商
import Supplier from '../components/supplier/supplier'
import Daily from '../components/supplier/daily'
import Info from '../components/supplier/info'
import Price from '../components/supplier/price'
import Stock from '../components/supplier/stock'
import PriceChart from '../components/supplier/pricechart'
import Setting from '../components/supplier/setting'

// 管理员后台
import Manager from '../components/manager/manager'
import Member from '../components/manager/member'
import Operate from '../components/manager/operate'
import Review from '../components/manager/review'
import Message from '../components/manager/message'

// 财务
import Finance from '../components/finance/finance'
import Invoice from '../components/finance/invoice'
import Enterprise from '../components/finance/enterprise'

// 订单
import Order from '../components/order/order'
import List from '../components/order/list'
import Search from '../components/order/search'
import Cart from '../components/order/cart'
import Demand from '../components/order/demand'
import DemandView from '../components/order/demandView'
import BatchSearch from '../components/order/batchSearch'

Vue.use(Router)

function getCookie (name) {
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  var arr = document.cookie.match(reg)
  if (arr) { return decodeURI(arr[2]) } else { return null }
}

var comId = getCookie('comId')
// var userRole = getCookie('userRole')
// var financeAuth = userRole.charAt(8)

export default new Router({
  routes: [{
    path: '/',
    redirect: comId === '00' ? '/order' : '/demand',
    component: comId === '00' ? Order : DemandIndex
  },
  {
    path: '/demand',
    name: 'demand',
    component: DemandIndex,
    redirect: '/demand/manage',
    children: [{
      path: 'manage',
      component: DemandManage
    }, {
      path: 'statics',
      component: DemandStatics
    }
    ]
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
      path: 'list',
      component: List
    },
    {
      path: 'demand',
      component: Demand
    },
    {
      path: 'demandview',
      component: DemandView
    },
    {
      path: 'batchsearch',
      component: BatchSearch
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
      path: 'daily',
      component: Daily
    },
    {
      path: 'price',
      component: Price
    },
    {
      path: 'stock',
      component: Stock
    },
    {
      path: 'pricechart',
      component: PriceChart
    },
    {
      path: 'setting',
      component: Setting
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
    },
    {
      path: 'message',
      component: Message
    }]
  },
  {
    path: '/finance',
    name: 'Finance',
    component: Finance,
    redirect: '/finance/invoice',
    children: [{
      path: 'invoice',
      component: Invoice
    },
    {
      path: 'enterprise',
      component: Enterprise
    }]
  }
  ]
})
