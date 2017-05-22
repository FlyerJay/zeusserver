const state = {
  supInfo: {},
  supAddress: [],
  priceList:[],
  inventoryList:[],
  depriceList:[],
  freightList:[]

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
