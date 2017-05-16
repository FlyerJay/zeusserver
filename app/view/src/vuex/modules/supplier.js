const state = {
  supList: [],
  supAddress: [],
  priceList:[],
  inventoryList:[]
}

const mutations = {
  UPDATE_SUPFORM(state, key, val) {
    state[key] = val
  }
}

export default {
  state,
  mutations
}
