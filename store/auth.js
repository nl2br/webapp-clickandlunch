import api from '~/api'
import Cookies from 'js-cookie'
import { setAuthToken, resetAuthToken } from '~/utils/auth'

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
      commit('AUTH_SUCCESS', res.data.result)
      return res
    } catch (err) {
      commit('AUTH_LOGOUT')
      return err
    }
  },
  async login({ commit, dispatch }, user) {
    try {
      const res = await api.auth.login(user)
      console.log('TCL: login -> res', res)
      setAuthToken(res.data.token)
      Cookies.set('x-access-token', res.data.token, { expires: 7 })
      commit('AUTH_SUCCESS', res.data.token)
      commit('SET_USER', res.data.user)
      return res.data.user
    } catch (err) {
      console.log('TCL: login -> err', err)
      Cookies.set('token', null)
      commit('AUTH_ERROR', err)
      return err
    }
  },
  logout({ commit }) {
    resetAuthToken()
    Cookies.remove('x-access-token')
    commit('AUTH_LOGOUT')
    return Promise.resolve()
  }
}

export const getters = {
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status
}
