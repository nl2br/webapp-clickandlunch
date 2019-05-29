import api from '~/api'

export const state = () => ({
  products: []
})

// mutation handler functions must be synchronous
export const mutations = {
  ADD_PRODUCT: (state, data) => {
    state.products.push(data)
  },
  SET_PRODUCTS: (state, data) => {
    state.products = data
  }
}

export const actions = {
  /**
   * Add the product to the DB and the store
   * @param {Object} context
   * @param {Object} shop
   */
  async create({ commit }, data) {
    let res
    try {
      res = await api.product.create(data)
      console.log('TCL: create -> res', res)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    commit('ADD_PRODUCT', res.data)
    return res.data
  },
  /**
   * Add the product menu to the DB and the store
   * @param {Object} context
   * @param {Object} shop
   */
  async createMenu({ commit }, data) {
    let res
    try {
      res = await api.product.createMenu(data)
      console.log('TCL: create -> res', res)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    commit('ADD_PRODUCT', res.data)
    return res.data
  },
  async getProductsList({ commit }, shopId) {
    let res
    try {
      res = await api.product.getProductList(shopId)
      console.log('TCL: create -> res', res)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    commit('SET_PRODUCTS', res.data)
    return res.data
  }
}

export const getters = {}
