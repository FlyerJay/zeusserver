const state = {
  stockList: [],
  cartList: []
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
