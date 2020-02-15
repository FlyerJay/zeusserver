import App from './App'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui'
import Vue from 'vue'
import '../static/js/utils'
import 'element-ui/lib/theme-default/index.css'
import '../static/font/base.less'
import { socket } from './socket'
function getCookie (name) {
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  var arr = document.cookie.match(reg)
  if (arr) { return decodeURI(arr[2]) } else { return null }
}
socket.on('res', (mes) => {
  console.log(mes)
})
var userRole = getCookie('userRole')
const isDemandAuth = userRole && userRole.charAt(4) === '1'
var isStorage = localStorage.getItem('demandAmount')
if (!isStorage) {
  localStorage.setItem('demandAmount', JSON.stringify({
    submit: 0,
    price: 0,
    deal: 0,
    unDeal: 0,
    priced: 0
  }))
}
const isOrderAuth = userRole && userRole.charAt(5) === '1'

// 获取通知权限，如果用户同意了通知，则可以直接使用系统通知
Notification.requestPermission(function (permission) {
})

// 展示通知
function showNotice (title, message) {
  if (Notification.permission === 'granted') {
    var notification = new Notification(title, {
      body: message,
      icon: 'https://www.kxzeus.com/favicon.ico'
    })
  } else {
    Vue.prototype.$notify.info({
      title: title,
      message: message
    })
  }
}

socket.on('update', ({demand}) => { // 接收需求变更通知
  console.log(`有新消息送达${JSON.stringify(demand)}`)
  var demandAmount = localStorage.getItem('demandAmount')
  if (demandAmount) {
    demandAmount = JSON.parse(demandAmount)
    var newDemand = {}
    for (var item in demand) {
      if (demand[item] <= demandAmount[item]) {
        demandAmount[item] = demand[item] || demandAmount[item]
        newDemand[item] = 0
      } else {
        newDemand[item] = demand[item] - demandAmount[item]
        demandAmount[item] = demandAmount[item]
        if (item === 'submit' && isOrderAuth) {
          !(function (newDemand, item) {
            setTimeout(() => {
              showNotice('新需求', `有${newDemand[item]}条新提交的需求`)
              Vue.prototype.$notify.info({
                title: '新需求',
                message: `有${newDemand[item]}条新提交的需求`
              })
            }, 0)
          }(newDemand, item))
        }
        if (item === 'price' && isDemandAuth) {
          !(function (newDemand, item) {
            setTimeout(() => {
              showNotice('需求报价', `有${newDemand[item]}待反馈需求`)
              Vue.prototype.$notify.info({
                title: '需求报价',
                message: `有${newDemand[item]}待反馈需求`
              })
            }, 0)
          }(newDemand, item))
        }
        if (item === 'priced' && isDemandAuth) {
          !(function (newDemand, item) {
            setTimeout(() => {
              showNotice('需求报价', `有${newDemand[item]}已报价需求`)
              Vue.prototype.$notify.info({
                title: '需求报价',
                message: `有${newDemand[item]}已报价需求`
              })
            }, 0)
          }(newDemand, item))
        }
        if (item === 'unDeal' && isOrderAuth) {
          !(function (newDemand, item) {
            setTimeout(() => {
              showNotice('需求交易结果', `有${newDemand[item]}条需求交易失败`)
              Vue.prototype.$notify.info({
                title: '需求交易结果',
                message: `有${newDemand[item]}条需求交易失败`
              })
            }, 0)
          }(newDemand, item))
        }
        if (item === 'deal' && isOrderAuth) {
          !(function (newDemand, item) {
            setTimeout(() => {
              showNotice('需求交易结果', `有${newDemand[item]}条需求交易成功`)
              Vue.prototype.$notify.info({
                title: '需求交易结果',
                message: `有${newDemand[item]}条需求交易成功`
              })
            }, 0)
          }(newDemand, item))
        }
      }
    }
    if (!isOrderAuth) {
      newDemand.submit = 0
      newDemand.deal = 0
      newDemand.unDeal = 0
    }
    if (!demandAmount) {
      newDemand.price = 0
      newDemand.priced = 0
    }
    localStorage.setItem('demandAmount', JSON.stringify(demandAmount))
    store.dispatch('UPDATE_DEMAND', newDemand)
  } else {
    localStorage.setItem('demandAmount', JSON.stringify(demand))
  }
})
Vue.config.productionTip = false
Vue.prototype.socket = socket

Vue.prototype.getCookie = getCookie

Vue.prototype.global = new Vue({})

// axios全局绑定到Vue.prototype（目前用webpack.ProvidePlugin插件代替）
// Object.defineProperty(Vue.prototype, '$axios', { value: axios })

Vue.use(ElementUI)

new Vue({
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')
