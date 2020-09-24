const state = {
  topMenuData: [],
  userInfo: {
    comId: '',
    userId: '',
    userRole: ''
  },
  mainRoute: '',
  demand: {},
}


const mutations = {
  UPDATE_FORM(state, key, val) {
    state[key] = val
  },
  UPDATE_DEMAND(state, params){
    state.demand = params;
  },
}

export default {
  state,
  mutations
}
