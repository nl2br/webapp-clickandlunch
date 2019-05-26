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
    console.log('TCL: state', state)
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
  async fetch({ commit, dispatch }) {
    console.log('fetch')
    try {
      const res = await api.auth.me()
      console.log('TCL: fetch -> res', res)
      commit('AUTH_SUCCESS', getAuthToken())
      commit('SET_USER', res.data.result)
      // see if this user have a store
      await dispatch('shop/findShop', { user: res.data.result }, { root: true })
      return res
    } catch (err) {
      commit('AUTH_LOGOUT')
      return err
    }
  },
  /**
   * Log the user if existing
   * fill the store
   * @param {Object} context
   * @param {Object} data
   */
  async login({ commit, dispatch }, user) {
    try {
      // send to server the login and password to see if it matche
      // send an error if not
      const res = await api.auth.login(user)
      // add token in x-auth-token head property
      setAuthToken(res.data.token)
      // add token to the cookie
      Cookies.set('token', res.data.token, { expires: 1 })
      // add token to the store
      commit('AUTH_SUCCESS', res.data.token)
      // add user info to the store
      commit('SET_USER', res.data.user)
      // see if this user have a store
      await dispatch('shop/findShop', { user: res.data.user }, { root: true })

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
  /**
   * Auto login after a registration
   * @param {Object} context
   * @param {Object} data
   */
  loginAfterCreate({ commit }, data) {
    console.log('TCL: loginAfterCreate -> user', data)
    Cookies.set('token', data.token, { expires: 1 })
    Cookies.set('wizardStep', 1, { expires: 7 })
    // add token in x-auth-token head property
    setAuthToken(data.token)
    commit('AUTH_SUCCESS', data.token)
    commit('SET_USER', data.user)
    commit('SET_WIZARD_STEP', 1)
    return Promise.resolve()
  },
  /**
   * Restting the store and Cookies
   * @param {Object} context
   */
  logout({ commit }) {
    resetAuthToken()
    Cookies.remove('token')
    commit('AUTH_LOGOUT')
    // reset shop store
    commit('shop/SET_SHOP', null, { root: true })
    return Promise.resolve()
  }
}

export const getters = {
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status,
  wizardStep: state => state.wizardStep
}
