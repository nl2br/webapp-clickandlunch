<template>
  <v-flex xs12 sm8 md4>
    <v-card :color="isLoggedIn ? 'success' : 'warning'" class="mb-4">
      <v-card-text>
        {{ isLoggedIn ? 'User is logged' : 'User has to login' }}
      </v-card-text>
    </v-card>
    <v-card class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{ $t('login.title') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            prepend-icon="person"
            name="email"
            label="Email"
            type="text"
          ></v-text-field>
          <v-text-field
            id="password"
            v-model="password"
            prepend-icon="lock"
            name="password"
            label="Password"
            type="password"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="verifyLogin">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      email: 'natleb7@gmail.com',
      password: 'password'
    }
  },
  layout: 'login',
  computed: {
    ...mapGetters({ isLoggedIn: 'auth/isLoggedIn' })
  },
  watch: {
    process() {
      console.log('TCL: process.client', process.client)
    }
  },
  created: function() {
    console.log('TCL: process.client', process.client)
  },
  methods: {
    async verifyLogin() {
      const user = {
        email: this.email,
        password: this.password
      }
      try {
        await this.$store.dispatch('auth/login', user)
        if (this.isLoggedIn) {
          this.$router.push({
            path: '/'
          })
        }
      } catch (error) {
        console.log('TCL: verifyLogin -> error', error)
      }
    }
  }
}
</script>
