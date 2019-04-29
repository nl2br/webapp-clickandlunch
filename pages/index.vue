<template>
  <v-flex xs12 sm8 md4>
    <v-card class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{ $t('login.title') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="login"
            prepend-icon="person"
            name="login"
            label="Login"
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
import axios from 'axios'

export default {
  data() {
    return {
      login: '',
      password: ''
    }
  },
  methods: {
    async verifyLogin() {
      // const user = {
      //   email: this.email,
      //   password: this.password
      // }
      console.log('TCL: verifyLogin -> localApiUrl', process.env.localApiUrl)
      try {
        const res = await axios.get(process.env.localApiUrl + '/shops/p/1')
        console.log('TCL: verifyLogin -> res', res)
      } catch (error) {
        console.log('TCL: verifyLogin -> error', error)
      }

      // this.$router.push({
      //   // path: '/auth/login'
      //   path: '/dashboard'
      // })
    }
  },
  layout: 'login'
}
</script>
