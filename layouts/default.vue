<template>
  <div id="app">
    <v-app id="inspire">
      <!-- LEFT MENU -->
      <v-navigation-drawer
        v-model="drawer"
        fixed
        :floating="false"
        :clipped="$vuetify.breakpoint.mdAndUp"
        :mini-variant="true"
        app
      >
        <v-list dense>
          <template v-for="item in items">
            <v-list-tile :key="item.text">
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
      <v-toolbar
        color="blue darken-3"
        dark
        app
        :clipped-left="$vuetify.breakpoint.mdAndUp"
      >
        <v-toolbar-side-icon
          v-if="!$vuetify.breakpoint.mdAndUp"
          @click.native="drawer = !drawer"
        ></v-toolbar-side-icon>
        <v-toolbar-title class="mr-5 align-center">
          <v-icon>forum</v-icon>

          <span class="title">Click&Lunch</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>notifications</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- CONTENT -->
      <v-content>
        <v-container fluid fill-height>
          <v-layout justify-center align-center>
            <nuxt />
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      items: [
        { icon: 'contacts', text: 'Contacts' },
        { icon: 'history', text: 'Frequently contacted' },
        { icon: 'content_copy', text: 'Duplicates' },
        { icon: 'settings', text: 'Settings' },
        { icon: 'chat_bubble', text: 'Send feedback' },
        { icon: 'help', text: 'Help' },
        { icon: 'phonelink', text: 'App downloads' },
        { icon: 'keyboard', text: 'Go to the old version' }
      ]
    }
  }
}
</script>
