const state = {
  stockInfo: {},//库存表单
  cartList: [],
  demandInfo: {},
  orderList: [],
  ordAddress: [],  //到岸目的地
  orderDetail: [],
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
