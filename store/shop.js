import api from '~/api'

export const state = () => ({
  store: ''
})

// mutation handler functions must be synchronous
export const mutations = {
  SET_SHOP: (state, data) => {
    state.shop = data
  }
}

export const actions = {
  async create({ commit, dispatch }, shop) {
    let res
    try {
      res = await api.shop.create(shop)
      console.log('TCL: create -> res', res)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    commit('SET_SHOP', res.data)
    return res.data
  }
}

export const getters = {}
