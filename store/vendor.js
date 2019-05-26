import api from '~/api'

export const state = () => ({
  vendor: null
})

// mutation handler functions must be synchronous
export const mutations = {
  SET_VENDOR: (state, data) => {
    state.vendor = data
  }
}

export const actions = {
  async create({ commit, dispatch }, vendor) {
    let res
    try {
      res = await api.vendor.create(vendor)
      console.log('TCL: create -> res', res)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    const token = res.headers['x-auth-token']
    dispatch(
      'auth/loginAfterCreate',
      { user: res.data, token: token },
      { root: true }
    )
    return res.data
  },
  async modify({ commit, rootState }, data) {
    console.log('TCL: modify -> data', data)
    console.log('TCL: modify -> rootState.user.id', rootState.auth.user.id)
    let res
    try {
      res = await api.vendor.modify({
        vendorId: rootState.auth.user.id,
        shopId: data.id
      })
    } catch (error) {
      console.log('TCL: modify -> error', error)
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    console.log('TCL: modify -> res', res)
    commit('SET_VENDOR', res.data)
  }
}

export const getters = {}
