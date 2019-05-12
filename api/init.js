import axios from 'axios'
import { baseURL } from '~/config'
import cookies from 'js-cookie'
import { setAuthToken, resetAuthToken } from '~/utils/auth'

// define the base url for axios
axios.defaults.baseURL = baseURL

// get the token from cookie if exist
const token = cookies.get('token')

// add the token to the header x-acces-token with axios
token ? setAuthToken(token) : resetAuthToken()

axios.interceptors.request.use(
  function(config) {
    // console.log('TCL: config', config)
    return config
  },
  function(err) {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  function(response) {
    // console.log('TCL: response', response)
    return response
  },
  function(err) {
    return Promise.reject(err)
  }
)
