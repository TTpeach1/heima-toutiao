import Vue from 'vue'
import Vuex from 'vuex'
// import storage from '@/utils/storage'
import { getToken, setToken } from '@/utils'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // user:JSON.parse(localStorage.getItem('USER_TOKEN'))||{}
    // user: storage.get('USER_TOKEN') || {}
    user: getToken() || {}
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      state.user = payload
      // localStorage.setItem('USER_TOKEN', JSON.stringify(payload))
      // storage.set('USER_TOKEN', payload)
      setToken(payload)
    }
  },
  actions: {},
  modules: {}
})
