const state = {
  specList:[],
  userRoleInfo:{},
  operateList:[]
}

const mutations = {
  UPDATE_MANAGERFORM(state, key,val  ) {
    state[key] = val
  }
}

export default {
  state,
  mutations
}
