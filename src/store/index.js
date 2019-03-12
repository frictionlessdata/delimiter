import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      authToken: null,
      username: null,
      avatarUrl: null
    },
    file: {
      location: {
        owner: null,
        repo: null,
        branch: null,
        path: null
      },
      sha: null,
      data: null,
      originalData: null,
      serialisation: null,
      diff: null,
      hasWritePermission: null
    }
  },
  plugins: [
    createPersistedState({
      paths: ['file', 'user'],
      storage: window.sessionStorage
    })
  ],
  mutations,
  actions
})
