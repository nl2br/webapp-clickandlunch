export const state = () => ({
  locales: ['en', 'fr'],
  locale: 'en'
})

export const mutations = {
  increment(state) {
    state.counter++
  },
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  }
}
