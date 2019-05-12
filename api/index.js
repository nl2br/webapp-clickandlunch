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
    create: data => axios.post('/vendors', data)
  },
  shop: {
    create: data => axios.post('/shops', data)
  }
}
