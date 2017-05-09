const state = {
  supList: [],
  supAddress: []
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
