<template>
  <v-flex xs12 sm8 md4>
    <v-card class="elevation-12">
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{ $t('register.title') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <LanguageSwitcher />
      </v-toolbar>
      <v-form id="form-register-user" @submit.prevent="formSubmit">
        <v-card-text>
          <v-text-field
            v-model="email"
            name="email"
            label="Email"
            type="text"
            counter
            required
          ></v-text-field>
          <v-text-field
            id="password"
            v-model="password"
            name="password"
            label="Password"
            type="password"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="primary" form="form-register-user">
            Create my account
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <v-flex class="mt-5 text-xs-center">
      <strong>{{ $t('register.account') }}</strong>
      <nuxt-link to="/login">{{ $t('register.accountlink') }}</nuxt-link>
    </v-flex>
  </v-flex>
</template>

<script>
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

class FormErrors {
  constructor() {
    this.errors = {}
  }
  has(field) {
    return this.errors.hasOwnProperty(field)
  }
  any() {
    return Object.keys(this.errors).length > 0
  }
  get(field) {
    if (this.errors[field]) {
      return this.errors[field]
    }
  }
  record(errors) {
    this.errors = errors
  }
  clear(field) {
    delete this.errors[field]
  }
  reset() {
    this.errors = {}
  }
}

class FormRules {
  email() {
    return [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ]
  }
}

export default {
  components: {
    LanguageSwitcher
  },
  data() {
    return {
      email: '',
      password: '',
      errors: new FormErrors(),
      rules: new FormRules()
    }
  },
  layout: 'login',
  computed: {},
  watch: {},
  methods: {
    async formSubmit() {
      // const { email, password } = this.$data
      //       firstname: req.body.firstname,
      // lastname: req.body.lastname,
      // phoneNumber: req.body.phoneNumber,
      // email: req.body.email,
      // password: hashPassword,
      // role: req.body.role
      try {
        const res = await this.$store.dispatch('vendor/create', {
          firstname: 'nathan',
          lastname: 'lebreton',
          phoneNumber: '0663457812',
          email: 'a@pdaddffgfddzsdde.fr',
          password: 'password',
          role: 'VENDOR'
        })
        console.log('TCL: verifyLogin -> res', res)

        if (this.isLoggedIn) {
          this.$router.push({
            path: '/'
          })
        }
      } catch (error) {
        console.log('TCL: verifyLogin -> error', error)
      }
      // this.errors.reset()
      // const { email, password } = this.$data
      // if (!email) this.errors.push('Email is required')
      // if (!password) this.errors.push('Email is required')
      // console.log('TCL: formSubmit -> this.errors', this.errors)
    }
  }
}
</script>
