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
        <v-spacer></v-spacer>
        <LanguageSwitcher />
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            prepend-icon="person"
            name="email"
            label="Email"
            type="text"
            :rules="loginRules"
            required
            @change="checkEmpty($event, 'login')"
          ></v-text-field>
          <v-text-field
            id="password"
            v-model="password"
            prepend-icon="lock"
            name="password"
            label="Password"
            type="password"
            :rules="emailRules"
            required
            @change="checkEmpty($event, 'email')"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="verifyLogin">Login</v-btn>
      </v-card-actions>
    </v-card>
    <v-flex class="mt-5 text-xs-center">
      <strong>{{ $t('login.noaccount') }}</strong>
      <nuxt-link to="/register">{{ $t('login.noaccountlink') }}</nuxt-link>
    </v-flex>
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'
import { testMixin } from '../mixins/testMixin'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

export default {
  components: {
    LanguageSwitcher
  },
  mixins: [testMixin],
  data() {
    return {
      email: 'natleb7@gmail.com',
      password: 'password',
      rulesLogin: [v => !!v || 'Login is required'],
      rulesEmail: [
        v => !!v || 'Email is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  layout: 'login',
  computed: {
    ...mapGetters({ isLoggedIn: 'auth/isLoggedIn' })
  },
  watch: {},
  created: function() {},
  methods: {
    async verifyLogin() {
      const user = {
        email: this.email,
        password: this.password
      }
      try {
        const res = await this.$store.dispatch('auth/login', user)
        console.log('TCL: verifyLogin -> res', res)
        if (this.isLoggedIn) {
          this.$router.push({
            path: '/'
          })
        }
      } catch (error) {
        console.log('TCL: verifyLogin -> error', error)
      }
    },
    checkEmpty(value, field) {
      if (!value.trim()) {
        this.user[field] = this.currentGator[field]
      }
    }
  }
}
</script>

<style></style>
