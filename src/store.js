import Vue from 'vue'
import Vuex from 'vuex'
import Octokit from '@octokit/rest'
import Papa from 'papaparse'
import daff from 'daff/lib/core'
import cloneDeep from 'lodash/cloneDeep'

import { decode } from '@/util'

Vue.use(Vuex)

const octokit = new Octokit()

export default new Vuex.Store({
  strict: true,
  state: {
    file: {
      location: {
        origin: null,
        repo: null,
        branch: null,
        path: null
      },
      data: null,
      originalData: null,
      serialisation: null,
      diff: null
    }
  },
  mutations: {
    SET_FILE_LOCATION (state, { origin, repo, branch, path }) {
      state.file.location.origin = origin
      state.file.location.repo = repo
      state.file.location.branch = branch
      state.file.location.path = path
    },
    SET_FILE_DATA (state, data) {
      state.file.data = data
      state.file.originalData = cloneDeep(data)
    },
    SET_FILE_SERIALISATION (state, parseMeta) {
      state.file.serialisation = parseMeta
    },
    SET_FILE_DIFF (state, diff) {
      state.file.diff = diff
    },
    RESET_FILE (state) {
      state.file.data = null
      state.file.originalData = null
      state.file.serialisation = null
      state.file.diff = null
      state.file.location.origin = null
      state.file.location.repo = null
      state.file.location.branch = null
      state.file.location.path = null
    }
  },
  actions: {
    async getFileData ({ commit, dispatch }, fileLocation) {
      commit('RESET_FILE')
      commit('SET_FILE_LOCATION', fileLocation)
      const fileContents = await dispatch('getFileContents', fileLocation)
      await dispatch('parseFileData', fileContents)
    },
    async getFileContents ({ commit, dispatch }, { origin, repo, branch, path }) {
      const response = await octokit.repos.getContents({
        owner: origin,
        repo,
        ref: branch,
        path
      })
      // uncommon for an action to return something, but necessary b/c of parent action
      return decode(response.data.content)
    },
    async parseFileData ({ commit }, contents) {
      const result = await Papa.parse(contents)
      commit('SET_FILE_DATA', result.data)
      commit('SET_FILE_SERIALISATION', result.meta)
    },
    createDiff ({ state, commit }) {
      // const oldTable = new daff.TableView(state.file.originalData)
      // const newTable = new daff.TableView(state.file.data)

      const flags = new daff.CompareFlags()
      const alignment = daff.compareTables(state.file.originalData, state.file.data).align()
      const highlighter = new daff.TableDiff(alignment, flags)

      const diffTable = new daff.TableView([])
      highlighter.hilite(diffTable)
      commit('SET_FILE_DIFF', diffTable)
    }
  }
})
