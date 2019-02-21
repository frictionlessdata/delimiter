import Vue from 'vue'
import Vuex from 'vuex'
import Octokit from '@octokit/rest'
import Papa from 'papaparse'
import daff from 'daff/lib/core'
import cloneDeep from 'lodash/cloneDeep'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'
import omit from 'lodash/omit'

import router from './router'
import { encode, decode } from '@/util'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    user: {
      authToken: null,
      username: null,
      avatarUrl: null
    },
    file: {
      location: {
        origin: null,
        repo: null,
        branch: null,
        path: null
      },
      sha: null,
      data: null,
      originalData: null,
      serialisation: null,
      diff: null
    }
  },
  plugins: [
    createPersistedState({
      paths: ['file', 'user'],
      storage: window.sessionStorage
    })
  ],
  mutations: {
    SET_USER_AUTH_TOKEN (state, authToken) {
      state.user.authToken = authToken
    },
    SET_USER_INFO (state, { username, avatarUrl }) {
      state.user.username = username
      state.user.avatarUrl = avatarUrl
    },
    RESET_USER (state) {
      state.user.authToken = null
      state.user.username = null
      state.user.avatarUrl = null
    },
    SET_FILE_SHA (state, sha) {
      state.file.sha = sha
    },
    SET_FILE_LOCATION (state, { origin, repo, branch, path }) {
      state.file.location.origin = origin
      state.file.location.repo = repo
      state.file.location.branch = branch
      state.file.location.path = path
    },
    SET_FILE_DATA_AND_ORIGINAL (state, data) {
      state.file.data = data
      state.file.originalData = cloneDeep(data)
    },
    // Since handsontable mutates its data directly, flux-style data flow isn't
    // really possible. But we do this to at least tell vuex it was updated, so
    // that vuex-persistedstate works.
    SIMULATE_FILE_DATA_UPDATE (state) {
      state.file.data = state.file.data // eslint-disable-line
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
    async finishLogin ({ commit, dispatch, state }, authCode) {
      const url = `${process.env.VUE_APP_GATEKEEPER_HOST}/authenticate/${authCode}`
      const response = await axios.get(url)
      const token = response.data.token
      commit('SET_USER_AUTH_TOKEN', token)

      const queryWithoutCode = omit(state.route.query, 'code')
      router.replace({ query: queryWithoutCode })

      dispatch('getUser')
    },
    async getUser ({ commit, state }) {
      const token = state.user.authToken
      const octokit = new Octokit({ auth: `token ${token}` })
      const response = await octokit.users.getAuthenticated()
      const userInfo = {
        username: response.data.login,
        avatarUrl: response.data.avatar_url
      }
      commit('SET_USER_INFO', userInfo)
    },
    async getFileData ({ commit, dispatch }, fileLocation) {
      commit('RESET_FILE')
      commit('SET_FILE_LOCATION', fileLocation)
      const fileContents = await dispatch('getFileContents', fileLocation)
      await dispatch('parseFileData', fileContents)
    },
    async getFileContents ({ commit, dispatch }, { origin, repo, branch, path }) {
      const octokit = new Octokit()
      const response = await octokit.repos.getContents({
        owner: origin,
        repo,
        ref: branch,
        path,
        headers: {
          'If-None-Match': '' // don't use cache
        }
      })
      commit('SET_FILE_SHA', response.data.sha)
      // uncommon for an action to return something, but necessary b/c of parent action
      return decode(response.data.content)
    },
    async parseFileData ({ commit }, contents) {
      const result = await Papa.parse(contents)
      commit('SET_FILE_DATA_AND_ORIGINAL', result.data)
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
    },
    async save ({ state, commit }, message) {
      const { origin: owner, repo, branch, path } = state.file.location
      const sha = state.file.sha

      const serialisationOpts = {
        delimiter: state.file.serialisation.delimiter,
        newline: state.file.serialisation.linebreak // not sure why Papaparse uses different property names
      }
      const csv = Papa.unparse(state.file.data, serialisationOpts)
      const content = encode(csv)

      const token = state.user.authToken
      const octokit = new Octokit({ auth: `token ${token}` })

      const result = await octokit.repos.updateFile({ owner, repo, branch, path, message, sha, content })
      commit('RESET_FILE') // flush the changes
      return result
    }
  }
})
