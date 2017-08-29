import App from './App'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui'
import '../static/js/utils'
import 'element-ui/lib/theme-default/index.css'
import '../static/font/iconfont.css'
import '../static/font/base.less'
import { socket, demandSocket } from './socket';
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
      return decodeURI(arr[2]);
  else
      return null;
}
socket.on('res',( mes ) => {
  console.log(mes);
})
var userRole = getCookie('userRole');
const isDemandAuth = userRole && userRole.charAt(4) == '1';
const isOrderAuth = userRole && userRole.charAt(5) == '1';
socket.on('update',( {demand} ) => {//接收需求变更通知
  console.log(`有新消息送达${JSON.stringify(demand)}`);
  var demandAmount = localStorage.getItem('demandAmount');
  if(demandAmount){
    demandAmount = JSON.parse(demandAmount);
    var newDemand = {};
    for(var item in demand){
      if(demand[item] <= demandAmount[item]) {
        demandAmount[item] = demand[item] || demandAmount[item];
        newDemand[item] = 0;
      }else{ 
        newDemand[item] = demand[item] - demandAmount[item];
        demandAmount[item] = demandAmount[item];
        if(item == 'submit' && isDemandAuth){
          !function(newDemand,item){
            setTimeout(()=>{
              Vue.prototype.$notify.info({
                title: '新需求',
                message: `有${newDemand[item]}条新提交的需求`,
              });
            },0)
          }(newDemand,item)
        }
        if(item == 'price' && isOrderAuth){
          !function(newDemand,item){
            setTimeout(()=>{
              Vue.prototype.$notify.info({
                title: '需求报价',
                message: `有${newDemand[item]}条需求报价`,
              });
            },0)
          }(newDemand,item)
        }
        if(item == 'unDeal' && isDemandAuth){
          !function(newDemand,item){
            setTimeout(()=>{
              Vue.prototype.$notify.info({
                title: '需求交易结果',
                message: `有${newDemand[item]}条去求交易失败`,
              });
            },0)
          }(newDemand,item)
        }
        if(item == 'deal' && isDemandAuth){
          !function(newDemand,item){
            setTimeout(()=>{
              Vue.prototype.$notify.info({
                title: '需求交易结果',
                message: `有${newDemand[item]}条交易成功`,
              });
            },0)
          }(newDemand,item)
        }
      }
    }
    localStorage.setItem('demandAmount',JSON.stringify(demandAmount));
    store.dispatch('UPDATE_DEMAND',newDemand);
  }else{
    localStorage.setItem('demandAmount',JSON.stringify(demand));
  }
})
Vue.config.productionTip = false;
Vue.prototype.socket = socket;
Vue.prototype.demandSocket = demandSocket;

// axios全局绑定到Vue.prototype（目前用webpack.ProvidePlugin插件代替）
// Object.defineProperty(Vue.prototype, '$axios', { value: axios })

Vue.use(ElementUI)

new Vue({
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')