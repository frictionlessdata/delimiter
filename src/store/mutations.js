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
    const { owner, repo, branch, path } = location
    state.file.location.owner = owner
    state.file.location.repo = repo
    state.file.location.branch = branch
    state.file.location.path = path
    state.file.sha = sha
    state.file.data = data
    state.file.serialisation = serialisation

    // Retain a separate copy of the original data so we can diff
    state.file.originalData = cloneDeep(data)
  },
  SET_FILE_DATA (state, newData) {
    state.file.data = newData
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
    state.file.location.owner = null
    state.file.location.repo = null
    state.file.location.branch = null
    state.file.location.path = null
  }
}
