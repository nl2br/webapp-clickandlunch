// import cookieparser from 'cookieparser'
// import { setAuthToken, resetAuthToken } from '~/utils/auth'

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
  // nuxtServerInit({ commit, dispatch }, { req }) {
  //   const cookie = cookieparser.parse(req.headers.cookie || '')
  //   if (cookie.hasOwnProperty('x-access-token')) {
  //     setAuthToken(cookie['x-access-token'])
  //     dispatch('auth/fetch')
  //   } else {
  //     resetAuthToken()
  //     dispatch('auth/logout')
  //   }
  // }
}
export const getters = {}
