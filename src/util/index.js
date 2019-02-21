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
