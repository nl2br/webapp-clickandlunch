import axios from 'axios'

export const state = () => ({
  // token: localStorage.getItem('token') || null,
  token: null,
  status: null
})

export const mutations = {
  AUTH_REQUEST: state => {
    state.status = 'loading'
  },
  AUTH_SUCCESS: (state, token) => {
    state.status = 'success'
    state.token = token
  },
  AUTH_ERROR: state => {
    state.status = 'error'
  },
  AUTH_LOGOUT: (state, token) => {
    state.status = 'logged out'
    state.token = null
  }
}

export const actions = {
  async login({ commit, dispatch }, payload) {
    commit('AUTH_REQUEST')
    const user = {
      email: payload.email,
      password: payload.password
    }
    try {
      const res = await axios.post(
        process.env.localApiUrl + '/auth/login',
        user
      )
      const token = res.data.token
      if (process.client) {
        localStorage.setItem('token', token) // store the token in localstorage
      }
      axios.defaults.headers.common.Authorization = token
      commit('AUTH_SUCCESS', token)
    } catch (err) {
      commit('AUTH_ERROR', err)
      if (process.client) {
        localStorage.removeItem('token')
      }
      console.log('TCL: verifyLogin -> error', err)
    }
  },
  logout({ commit, dispatch }) {
    commit('AUTH_LOGOUT')
    if (process.client) {
      localStorage.removeItem('token') // clear your user's token from localstorage
    }
    delete axios.defaults.headers.common.Authorization // remove the axios default header
  }
}

export const getters = {
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status
}
