<template>
  <v-flex xs12 sm8 md4>
    <v-layout align-center justify-center row wrap>
      <v-flex xs12 align-center justify-center class="mb-4 text-xs-center">
        <v-img
          src="logo.png"
          aspect-ratio="1"
          width="80"
          heigth="80"
          style="margin:0 auto"
        />
      </v-flex>
      <v-flex xs12>
        <v-card class="elevation-12">
          <v-toolbar>
            <v-toolbar-title>{{ $t('login.title') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <LanguageSwitcher />
          </v-toolbar>
          <v-card-text>
            <v-form id="form-login" @submit.prevent="verifyLogin">
              <v-alert v-if="errors.length" :value="true" type="error">
                <p v-for="(error, index) in errors" :key="index" class="my-0">
                  {{ error }}
                </p>
              </v-alert>
              <v-text-field
                v-model="email"
                prepend-icon="person"
                name="email"
                label="Email"
                type="text"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                id="password"
                v-model="password"
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn
                type="submit"
                color="info"
                block
                form="form-login"
                :loading="loading"
                :disabled="loading"
                @click="loader = 'loading'"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex class="mt-5 text-xs-center">
        <strong>{{ $t('login.noaccount') }}</strong>
        <nuxt-link to="/register">{{ $t('login.noaccountlink') }}</nuxt-link>
      </v-flex>
    </v-layout>
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
      email: '',
      password: '',
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      formHasErrors: false,
      errors: [],
      loader: null,
      loading: false
    }
  },
  layout: 'login',
  computed: {
    ...mapGetters({ isLoggedIn: 'auth/isLoggedIn' })
  },
  watch: {},
  created: function() {
    if (this.isLoggedIn) {
      this.$router.push({
        path: '/'
      })
    }
  },
  methods: {
    async verifyLogin() {
      this.loading = true
      const user = {
        email: this.email,
        password: this.password
      }
      try {
        const res = await this.$store.dispatch('auth/login', user)
        console.log('TCL: verifyLogin -> res', res)
        if (res.status) {
          this.errors = res.message.split('\n')
          this.formHasErrors = true
          this.loading = false
        } else {
          this.errors = []
        }
        if (this.isLoggedIn) {
          this.$router.push({
            path: '/'
          })
        }
      } catch (error) {
        this.loading = false
        console.log(error)
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
