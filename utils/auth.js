import axios from 'axios'
export function setAuthToken(token) {
  axios.defaults.headers.common['x-access-token'] = token
}
export function getAuthToken() {
  return axios.defaults.headers.common['x-access-token']
}
export function resetAuthToken() {
  delete axios.defaults.headers.common['x-access-token']
}
