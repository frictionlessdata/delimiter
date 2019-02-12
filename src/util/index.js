export function encode (content) {
  return window.btoa(window.unescape(window.encodeURIComponent(content)))
}

export function decode (content) {
  return window.decodeURIComponent(window.escape(window.atob(content)))
}
