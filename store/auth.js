import api from '~/api'
import Cookies from 'js-cookie'
import { setAuthToken, resetAuthToken, getAuthToken } from '~/utils/auth'

export const state = () => ({
  token: null,
  user: null,
  status: null
})

// mutation handler functions must be synchronous
export const mutations = {
  AUTH_SUCCESS: (state, token) => {
    state.status = 'success'
    state.token = token
  },
  AUTH_ERROR: (state, error) => {
    state.status = 'error : ' + error
    state.token = null
  },
  AUTH_LOGOUT: state => {
    state.status = 'logged out'
    state.token = null
    state.user = null
  },
  SET_USER: (state, data) => {
    state.user = data
  }
}

export const actions = {
  async fetch({ commit }) {
    console.log('fetch')
    try {
      const res = await api.auth.me()
      commit('AUTH_SUCCESS', getAuthToken())
      console.log('TCL: fetch -> getAuthToken()', getAuthToken())
      commit('SET_USER', res.data.result)
      return res
    } catch (err) {
      commit('AUTH_LOGOUT')
      return err
    }
  },
  async login({ commit }, user) {
    try {
      const res = await api.auth.login(user)
      console.log('TCL: login -> res', res.data)
      setAuthToken(res.data.token)
      Cookies.set('x-auth-token', res.data.token, { expires: 7 })
      commit('AUTH_SUCCESS', res.data.token)
      commit('SET_USER', res.data.user)
      return res.data.user
    } catch (error) {
      Cookies.set('token', null)
      commit('AUTH_ERROR', error.response.data.message)
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
  },
  loginAfterCreate({ commit }, user) {
    console.log('TCL: loginAfterCreate -> user', user)
    const token = getAuthToken()
    Cookies.set('x-auth-token', token, { expires: 7 })
    commit('AUTH_SUCCESS', token)
    commit('SET_USER', user)
    return Promise.resolve()
  },
  logout({ commit }) {
    resetAuthToken()
    Cookies.remove('x-auth-token')
    commit('AUTH_LOGOUT')
    return Promise.resolve()
  }
}

export const getters = {
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status
}
