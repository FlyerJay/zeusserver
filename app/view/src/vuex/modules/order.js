const state = {
  topMenuData: [],
  userInfo: {
    comId: '01'
  }
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
