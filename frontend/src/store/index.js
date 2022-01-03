import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    userInfo: {},
  },
  mutations: {
    USER_LOGIN(state, userInfo) {
      state.isLoggedIn = true,
      state.userInfo = userInfo
    }
  },
  actions: {
    logIn({ commit }, userInfo) {
      commit('USER_LOGIN', userInfo)
    }
  },
  modules: {
  }
})
