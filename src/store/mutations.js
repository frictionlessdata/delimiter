import cloneDeep from 'lodash/cloneDeep'

export default {
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
  SET_FILE (state, { location, sha, data, serialisation }) {
    const { origin, repo, branch, path } = location
    state.file.location.origin = origin
    state.file.location.repo = repo
    state.file.location.branch = branch
    state.file.location.path = path
    state.file.sha = sha
    state.file.data = data
    state.file.serialisation = serialisation

    // Retain a separate copy of the original data so we can diff
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
}
