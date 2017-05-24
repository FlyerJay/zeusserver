const state = {
  topMenuData: [],
  userInfo: {
    comId: '',
    userId: ''
  },
  mainRoute: ''
}


const mutations = {
  UPDATE_FORM(state, key, val) {
    state[key] = val
  }
}

export default {
  state,
  mutations
}
