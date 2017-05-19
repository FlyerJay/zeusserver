const state = {
  stockList: [],//库存表单
  cartList: [],
  demandList:[],
  orderList:[],
  ordAddress:[]  //到岸目的地
}


const mutations = {
  UPDATE_ORDERFORM(state, key, val) {
    state[key] = val
  }
}

export default {
  state,
  mutations
}
