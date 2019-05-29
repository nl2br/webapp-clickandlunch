import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package'

// if (process.env.NODE_ENV !== 'production') require('dotenv').config()
require('dotenv').config()

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/assets/style/app.styl', '~/assets/style/main.css'],

  router: {
    middleware: ['i18n', 'auth']
  },
  generate: {
    routes: ['/', '/login', '/fr', '/fr/login']
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/vuetify', '~/plugins/i18n.js', '~/api/init.js'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/axios'
    // '@nuxtjs/auth'
    '@nuxtjs/dotenv'
  ],
  // auth: {
  //   redirect: {
  //     login: '/',
  //     logout: '/',
  //     callback: '/',
  //     home: '/dashboard'
  //   },
  //   strategies: {
  //     local: {
  //       endpoints: {
  //         login: { url: '/auth/login', method: 'post', propertyName: 'token' },
  //         logout: false,
  //         user: { url: '/auth/me', method: 'get', propertyName: 'data' }
  //       },
  //       // tokenRequired: true,
  //       tokenType: 'x-auth-token'
  //     }
  //   },
  //   cookie: false
  // },
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  env: {
    localApiUrl: process.env.LOCAL_API_URL,
    apiUrl: process.env.API_URL,
    nodeEnv: process.env.NODE_ENV
  }
}
