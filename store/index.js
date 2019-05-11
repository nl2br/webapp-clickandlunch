import cookieparser from 'cookieparser'
import { setAuthToken, resetAuthToken } from '~/utils/auth'

export const state = () => ({
  locales: ['en', 'fr'],
  locale: 'en'
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  }
}

export const actions = {
  nuxtServerInit({ commit, dispatch }, { req }) {
    return new Promise((resolve, reject) => {
      console.log('TCL: nuxtServerInit -> nuxtServerInit')
      const cookie = cookieparser.parse(req.headers.cookie || '')
      if (cookie.hasOwnProperty('x-auth-token')) {
        setAuthToken(cookie['x-auth-token'])
        dispatch('auth/fetch')
          .then(() => {
            resolve(true)
          })
          .catch(err => {
            console.log('Provided token is invalid:', err)
            resetAuthToken()
            dispatch('auth/logout')
            resolve(false)
          })
      } else {
        resetAuthToken()
        dispatch('auth/logout')
        resolve(false)
      }
    })
  }
}
export const getters = {}
