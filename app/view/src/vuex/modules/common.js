const state = {
  topMenuData: [],
  userInfo: {
    comId: '01',
    userId: 'flyer',
    roleInfo:'001001'
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
