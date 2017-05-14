import App from './App'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui'
import '../static/js/utils'
import 'element-ui/lib/theme-default/index.css'

Vue.config.productionTip = false

// axios全局绑定到Vue.prototype（目前用webpack.ProvidePlugin插件代替）
// Object.defineProperty(Vue.prototype, '$axios', { value: axios })

Vue.use(ElementUI)

new Vue({
  router: router,
  store,
  render: h => h(App)
}).$mount('#app')