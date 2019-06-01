import api from '~/api'

export const state = () => ({
  orders: []
})

// mutation handler functions must be synchronous
export const mutations = {
  ADD_ORDER: (state, data) => {
    state.orders.push(data)
  },
  SET_ORDERS: (state, data) => {
    // TODO: récupérer la liste des orders, puis filtrer sur la date
  },
  UPDATE_ORDER: (state, data) => {
    // TODO: modifer l'état d'une commande
  }
}

export const actions = {
  /**
   * Modify the state of an order
   * @param {Object} context
   * @param {Object} shop
   */
  async modify({ commit }, data) {
    let res
    try {
      res = await api.order.modify(data)
      console.log('TCL: create -> res', res)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    commit('UPDATE_ORDER', res.data)
    return res.data
  },

  async getOrdersList({ commit }, shopId) {
    let res
    try {
      res = await api.order.getOrdersList(shopId)
      console.log('TCL: create -> res', res)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    commit('SET_ORDERS', res.data)
    return res.data
  },
  addOrder({ commit }, data) {
    commit('ADD_ORDER', data)
  }
}

export const getters = {}
