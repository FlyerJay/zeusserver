const state = {
  verify: {},
  userRoleInfo: {},
  operateInfo: {},
  messageList: {},
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
