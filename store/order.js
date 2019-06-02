import api from '~/api'

export const state = () => ({
  pendingOrders: [],
  inProgressOrders: [],
  completedOrders: []
})

// mutation handler functions must be synchronous
export const mutations = {
  ADD_ORDER: (state, data) => {
    state.pendingOrders.push(data)
  },
  ADD_INPROGRESS_ORDER: (state, data) => {
    console.log('TCL: data', data)
    state.inProgressOrders.push(data)
  },
  ADD_COMPLETED_ORDER: (state, data) => {
    console.log('TCL: data', data)
    state.completedOrders.push(data)
  },
  REMOVE_PENDING_ORDER: (state, id) => {
    state.pendingOrders = state.pendingOrders.filter(item => item.id !== id)
  },
  REMOVE_COMPLETED_ORDER: (state, id) => {
    state.completedOrders = state.completedOrders.filter(item => item.id !== id)
  },
  REMOVE_INPROGRESS_ORDER: (state, id) => {
    console.log('TCL: id', id)
    state.inProgressOrders = state.inProgressOrders.filter(
      item => item.id !== id
    )
  },
  SET_PENDING_ORDERS: (state, data) => {
    state.pendingOrders = data
  },
  SET_INPROGRESS_ORDERS: (state, data) => {
    state.inProgressOrders = data
  },
  SET_COMPLETED_ORDERS: (state, data) => {
    state.completedOrders = data
  }
}

export const actions = {
  remove({ commit }, data) {
    commit('REMOVE_PENDING_ORDER', data)
  },
  removeCompleted({ commit }, data) {
    commit('REMOVE_COMPLETED_ORDER', data)
  },
  addOrder({ commit }, data) {
    commit('ADD_ORDER', data)
  },
  /**
   * Change the state of an order, pending to inprogress
   * @param {Object} context
   * @param {Object} orderId
   */
  async accept({ commit }, order) {
    // change the state of the order in DB
    let res
    try {
      const data = {
        orderId: order.id,
        state: 'INPROGRESS'
      }
      res = await api.order.changeState(data)
      console.log('TCL: create -> res', res)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    // add the order in the inprogress
    commit('ADD_INPROGRESS_ORDER', order)
    // remove the order of the pending
    commit('REMOVE_PENDING_ORDER', order.id)
  },
  /**
   * Change the state of an order, inprogress to FINISHED
   * @param {Object} context
   * @param {Object} orderId
   */
  async completed({ commit }, order) {
    // change the state of the order in DB
    let res
    try {
      const data = {
        orderId: order.id,
        state: 'FINISHED'
      }
      res = await api.order.changeState(data)
      console.log('TCL: create -> res', res)
    } catch (error) {
      return {
        status: error.response.status,
        message: error.response.data.message
      }
    }
    // add the order in the inprogress
    commit('ADD_COMPLETED_ORDER', order)
    // remove the order of the pending
    commit('REMOVE_INPROGRESS_ORDER', order.id)
  }
}

export const getters = {
  getPendingOrders: state => state.pendingOrders,
  getInProgressOrders: state => state.inProgressOrders,
  getCompletedOrders: state => state.completedOrders
}
