import api from '~/api'
import Cookies from 'js-cookie'
import { setAuthToken, resetAuthToken, getAuthToken } from '~/utils/auth'

export const state = () => ({
  token: null,
  user: null,
  status: null,
  wizardStep: null
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
  },
  SET_WIZARD_STEP: (state, data) => {
    state.wizardStep = data
  }
}

export const actions = {
  async fetch({ commit }) {
    console.log('fetch')
    try {
      const res = await api.auth.me()
      commit('AUTH_SUCCESS', getAuthToken())
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
      console.log('TCL: login -> res', res)
      setAuthToken(res.data.token)
      Cookies.set('token', res.data.token, { expires: 1 })
      commit('AUTH_SUCCESS', res.data.token)
      commit('SET_USER', res.data.user)
      if (Cookies.get('wizardStep')) {
        commit('SET_WIZARD_STEP', Cookies.get('wizardStep'))
      }
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
  loginAfterCreate({ commit }, data) {
    console.log('TCL: loginAfterCreate -> user', data)
    Cookies.set('token', data.token, { expires: 1 })
    Cookies.set('wizardStep', 1, { expires: 7 })
    commit('AUTH_SUCCESS', data.token)
    commit('SET_USER', data.user)
    commit('SET_WIZARD_STEP', 1)
    return Promise.resolve()
  },
  logout({ commit }) {
    resetAuthToken()
    Cookies.remove('token')
    commit('AUTH_LOGOUT')
    return Promise.resolve()
  }
}

export const getters = {
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status,
  wizardStep: state => state.wizardStep
}
