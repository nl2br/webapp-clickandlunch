import api from '~/api'

export const state = () => ({})

// mutation handler functions must be synchronous
export const mutations = {}

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
    dispatch('auth/loginAfterCreate', res.data, { root: true })
    return res.data
  }
}

export const getters = {}
