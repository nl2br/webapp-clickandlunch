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
            <v-list-tile :key="item.text" router :to="item.link">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
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
      <v-toolbar color="blue darken-3" dark app clipped-left>
        <v-toolbar-side-icon
          v-if="!$vuetify.breakpoint.smAndUp"
          @click.native="drawer = !drawer"
        ></v-toolbar-side-icon>
        <v-toolbar-title class="mr-5 align-center">
          <v-icon>forum</v-icon>

          <nuxt-link to="/" class="logo-link">
            <span class="title">ClickAndLunch</span>
          </nuxt-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>notifications</v-icon>
        </v-btn>
        <v-btn icon @click="logout">
          <v-icon>power_settings_new</v-icon>
        </v-btn>
      </v-toolbar>

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
        { icon: 'home', text: 'Home', link: '/' },
        { icon: 'contacts', text: 'Shop', link: '/shop' }
        // { icon: 'history', text: 'Frequently contacted' },
        // { icon: 'content_copy', text: 'Duplicates' },
        // { icon: 'settings', text: 'Settings' },
        // { icon: 'chat_bubble', text: 'Send feedback' },
        // { icon: 'help', text: 'Help' },
        // { icon: 'phonelink', text: 'App downloads' },
        // { icon: 'keyboard', text: 'Go to the old version' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn'
    })
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout').then(() => {
        console.log('dispatch ok')
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.logo-link
  text-decoration none
  color white
</style>
