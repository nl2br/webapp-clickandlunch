/**
 * All api routes definition
 */

import axios from 'axios'

export default {
  auth: {
    me: () => axios.get('auth/me'),
    login: data => axios.post('/auth/login', data)
  },
  vendor: {
    create: data => axios.post('/vendors', data),
    modify: data =>
      axios.put('/vendors/' + data.vendorId, { shopId: data.shopId }),
    get: data => axios.get('/vendors/' + data)
  },
  shop: {
    create: data =>
      axios.post('/shops', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    get: data => axios.get(`/shops/${data}`)
  },
  product: {
    create: data =>
      axios.post(`/products/shops/${data.shopId}`, data.product, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    createMenu: data =>
      axios.post(`/products/menus/shops/${data.shopId}`, data.product, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    get: data => axios.get(`/product/${data}`),
    getProductList: data => axios.get(`/shops/${data}/products`)
  },
  order: {
    get: data => axios.get('/orders/' + data),
    getOrders: data => axios.get('/orders/shops/' + data),
    changeState: data =>
      axios.put('/orders/' + data.orderId, { state: data.state })
  }
}
