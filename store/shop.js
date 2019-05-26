import api from '~/api'

export const state = () => ({
  shop: null
})

// mutation handler functions must be synchronous
export const mutations = {
  SET_SHOP: (state, data) => {
    state.shop = data
  }
}

export const actions = {
  /**
   * Add the shop to the DB and the store
   * add shopId to the vendor in DB
   * @param {Object} context
   * @param {Object} shop
   */
  async create({ commit, dispatch }, shop) {
    // add shop to DB
    let res
    try {
      res = await api.shop.create(shop)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    // add shop to the store
    commit('SET_SHOP', res.data)

    console.log('TCL: create -> res.data', res.data)
    // add shopId to the vendor in DB
    dispatch('vendor/modify', res.data, { root: true })

    // TODO: add shopId to the vendor in Store

    return res.data
  },
  /**
   * Find the shop of a vendor, if he created one
   * add it to the store
   * @param {Object} context
   * @param {Object} user
   */
  async findShop({ commit, rootState }, data) {
    let vendor
    try {
      vendor = await api.vendor.get(data.user.id)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    if (vendor.data.shopId) {
      let shop
      try {
        shop = await api.shop.get(vendor.data.shopId)
      } catch (error) {
        return {
          status: error.response.status,
          message: error.response.data.message
        }
      }
      // add shop to the store
      commit('SET_SHOP', shop.data)
    }
  }
}

export const getters = {
  hasShop: state => !!state.shop,
  getInfosShop: state => state.shop
}
