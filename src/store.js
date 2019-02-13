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
    fileData: null,
    fileDataOriginal: null,
    fileSerialisation: null,
    fileDiff: null
  },
  mutations: {
    SET_FILE_DATA (state, data) {
      state.fileData = data
      state.fileDataOriginal = cloneDeep(data)
    },
    SET_FILE_SERIALISATION (state, parseMeta) {
      state.fileSerialisation = parseMeta
    },
    SET_FILE_DIFF (state, diff) {
      state.fileDiff = diff
    },
    RESET_FILE (state) {
      state.fileData = null
      state.fileDataOriginal = null
      state.fileSerialisation = null
      state.fileDiff = null
    }
  },
  actions: {
    async getFileData ({ dispatch }, fileLocation) {
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
      // const oldTable = new daff.TableView(state.fileData)
      // const newTable = new daff.TableView(newFileData)

      const flags = new daff.CompareFlags()
      const alignment = daff.compareTables(state.fileDataOriginal, state.fileData).align()
      const highlighter = new daff.TableDiff(alignment, flags)

      const diffTable = new daff.TableView([])
      highlighter.hilite(diffTable)
      commit('SET_FILE_DIFF', diffTable)
    }
  }
})
