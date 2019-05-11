import axios from 'axios'

export function setAuthToken(token) {
  axios.defaults.headers.common['x-auth-token'] = token
}
export function getAuthToken() {
  console.log(
    'TCL: getAuthToken -> axios.defaults.headers',
    axios.defaults.headers
  )
  return axios.defaults.headers.common['x-auth-token']
}
export function resetAuthToken() {
  delete axios.defaults.headers.common['x-auth-token']
}
