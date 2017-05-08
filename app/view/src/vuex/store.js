import Vuex from 'vuex'
import common from './modules/common'
import supplier from './modules/supplier'


Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    common,
    supplier
  }
})
