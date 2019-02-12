import Vue from 'vue'
import Vuex from 'vuex'
import Octokit from '@octokit/rest'
import Papa from 'papaparse'

import { decode } from '@/util'

Vue.use(Vuex)

const octokit = new Octokit()

export default new Vuex.Store({
  state: {
    fileContents: null
  },
  mutations: {
    SET_FILE_CONTENTS (state, data) {
      state.fileContents = data
    }
  },
  actions: {
    async getFileContents ({ commit, dispatch }, { origin, repo, branch, path }) {
      const response = await octokit.repos.getContents({
        owner: origin,
        repo,
        ref: branch,
        path
      })
      const contents = decode(response.data.content)
      const data = await dispatch('parseCsv', contents)
      commit('SET_FILE_CONTENTS', data)
    },
    async parseCsv ({ commit }, contents) {
      const result = await Papa.parse(contents)
      return result.data
    }
  }
})
