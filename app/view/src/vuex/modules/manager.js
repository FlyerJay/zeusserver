const state = {
  specList:[],
  memberList:[],
  operateList:[],
  demandList:[]
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
