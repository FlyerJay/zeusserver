const state = {
  topMenuData: [],
  userInfo: {
<<<<<<< HEAD
    comId: '01',
    userId: 'flyer',
    roleInfo:'001001'
=======
    comId: '',
    userId: ''
>>>>>>> b95378ee0282ec92256b72d072cd21741b2875bb
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
