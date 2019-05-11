import axios from 'axios'
import { baseURL } from '~/config'
import cookies from 'js-cookie'
import { setAuthToken, resetAuthToken } from '~/utils/auth'

// define the base url for axios
axios.defaults.baseURL = baseURL

// create the cookie with the token
const token = cookies.get('x-auth-token')

// add the token to the header x-acces-token with axios
token ? setAuthToken(token) : resetAuthToken()
