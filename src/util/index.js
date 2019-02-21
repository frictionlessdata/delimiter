import { stringify } from 'query-string'

export function encode (content) {
  return window.btoa(window.unescape(window.encodeURIComponent(content)))
}

export function decode (content) {
  return window.decodeURIComponent(window.escape(window.atob(content)))
}

// Note: returns string starting with '/'
export function simplifyGithubUrl (githubUrl) {
  const urlParts = new URL(githubUrl)
  const { hostname, pathname } = urlParts
  if (hostname === 'github.com') {
    return pathname.replace('/blob', '')
  } else if (hostname === 'raw.githubusercontent.com') {
    return pathname
  } else {
    return '/'
  }
}

export function constructLoginUrl () {
  const githubUrl = 'https://github.com/login/oauth/authorize'
  const params = {
    client_id: process.env.VUE_APP_GITHUB_CLIENT_ID,
    redirect_uri: window.location.href,
    scope: 'public_repo'
  }
  return `${githubUrl}?${stringify(params)}`
}
