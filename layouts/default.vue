<template>
  <div id="app">
    <v-app id="inspire">
      <!-- LEFT MENU -->
      <v-navigation-drawer
        v-model="drawer"
        fixed
        clipped
        :permanent="$vuetify.breakpoint.smAndUp"
        :mini-variant="$vuetify.breakpoint.smAndUp"
        app
      >
        <v-list>
          <template v-for="item in items">
            <v-list-tile
              v-if="show(item.text)"
              :key="item.text"
              router
              :to="item.link"
            >
              <v-list-tile-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">{{ item.icon }}</v-icon>
                  </template>
                  <span>{{ item.text }}</span>
                </v-tooltip>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-navigation-drawer>

      <!-- TOP TOOLBAR -->
      <no-ssr>
        <v-toolbar color="white" light app clipped-left height="60" fill-height>
          <v-toolbar-side-icon
            v-if="!$vuetify.breakpoint.smAndUp"
            @click.native="drawer = !drawer"
          ></v-toolbar-side-icon>
          <v-btn icon>
            <nuxt-link to="/" class="logo-link">
              <v-img src="logo.png" width="35" aspect-ratio="1" />
            </nuxt-link>
          </v-btn>
          <v-toolbar-title class="mr-5 justify-center">
            <nuxt-link to="/" class="logo-link">
              <span class="title">
                ClickAndLunch
              </span>
            </nuxt-link>
          </v-toolbar-title>

          <v-spacer></v-spacer>
          <!-- <v-btn icon>
            <v-icon>notifications</v-icon>
          </v-btn> -->
          <v-btn icon @click="logout">
            <v-icon>power_settings_new</v-icon>
          </v-btn>
        </v-toolbar>
      </no-ssr>
      <!-- CONTENT -->
      <v-content>
        <v-container fluid>
          <v-layout>
            <nuxt />
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      drawer: true,
      items: [
        { icon: 'dashboard', text: 'Dashboard', link: '/' },
        { icon: 'store', text: 'Restaurant', link: '/shop' },
        {
          icon: 'format_list_bulleted',
          text: 'Products',
          link: '/product'
        },
        {
          icon: 'timelapse',
          text: 'Real time orders',
          link: '/realtime'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      hasProduct: 'product/hasProduct',
      hasShop: 'shop/hasShop'
    })
  },
  watch: {},
  methods: {
    logout() {
      this.$store.dispatch('auth/logout').then(() => {
        console.log('dispatch ok')
        this.$router.push('/login')
      })
    },
    show(item) {
      switch (item) {
        case 'Products':
          return this.hasShop
        case 'Real time orders':
          return this.hasProduct
        default:
          return true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.logo-link
  text-decoration none
  color black
</style>
