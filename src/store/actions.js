import Octokit from '@octokit/rest'
import Papa from 'papaparse'
import daff from 'daff/lib/core'
import axios from 'axios'
import omit from 'lodash/omit'

import router from '@/router'
import { encode, decode } from '@/util'

const GATEKEEPER_HOST = process.env.VUE_APP_GATEKEEPER_HOST

export default {
  async finishLogin ({ commit, state }, authCode) {
    const authToken = await fetchAuthToken(authCode)
    commit('SET_USER_AUTH_TOKEN', authToken)

    const userInfo = await fetchUserInfo(authToken)
    commit('SET_USER_INFO', userInfo)

    // Remove ?code from URL query
    const urlQueryWithoutCode = omit(state.route.query, 'code')
    router.replace({ query: urlQueryWithoutCode })
  },
  async fetchAndParseFile ({ commit }, fileLocation) {
    commit('RESET_FILE') // TODO: Investigate whether this should be called from the view instead
    const file = await fetchFile(fileLocation)
    const { data, meta: serialisation } = await parseFile(file.data.decodedContent)
    commit('SET_FILE', {
      location: fileLocation,
      sha: file.data.sha,
      data,
      serialisation
    })
  },
  createDiff ({ state, commit }) {
    const flags = new daff.CompareFlags()
    const alignment = daff.compareTables(state.file.originalData, state.file.data).align()
    const highlighter = new daff.TableDiff(alignment, flags)

    const diffTable = new daff.TableView([])
    highlighter.hilite(diffTable)
    commit('SET_FILE_DIFF', diffTable)
  },
  async saveFile ({ state, commit }, message) {
    const { owner, repo, branch, path } = state.file.location
    const sha = state.file.sha
    const authToken = state.user.authToken

    const csv = toCsv(state.file.data, state.file.serialisation)
    const content = encode(csv)
    const octokit = new Octokit({ auth: `token ${authToken}` })
    const result = await octokit.repos.updateFile({ owner, repo, branch, path, message, sha, content })
    commit('RESET_FILE') // force a refetch to refresh originalData
    return result // allows view to display link to commit
  }
}

export async function fetchAuthToken (authCode) {
  const url = `${GATEKEEPER_HOST}/authenticate/${authCode}`
  const response = await axios.get(url)
  return response.data.token
}

export async function fetchUserInfo (authToken) {
  const octokit = new Octokit({ auth: `token ${authToken}` })
  const response = await octokit.users.getAuthenticated()
  const userInfo = {
    username: response.data.login,
    avatarUrl: response.data.avatar_url
  }
  return userInfo
}

export async function fetchFile ({ owner, repo, branch, path }) {
  const disableCache = { 'If-None-Match': '' } // See octokit/rest.js#890
  const octokit = new Octokit()
  const response = await octokit.repos.getContents({
    owner,
    repo,
    ref: branch,
    path,
    headers: {
      ...disableCache
    }
  })
  response.data.decodedContent = decode(response.data.content)
  return response
}

export function parseFile (decodedContent) {
  return Papa.parse(decodedContent, { skipEmptyLines: true })
}

export function toCsv (data, meta) {
  const opts = {
    delimiter: meta.delimiter,
    newline: meta.linebreak // not sure why PapaParse uses different prop names
  }
  return Papa.unparse(data, opts)
}
