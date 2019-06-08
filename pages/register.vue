<template>
  <v-flex xs12 sm8 md4>
    <v-card class="elevation-12">
      <v-toolbar>
        <v-toolbar-title>{{ $t('register.title') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <LanguageSwitcher />
      </v-toolbar>
      <v-form id="form-register-user" @submit.prevent="formSubmit">
        <v-card-text>
          <v-alert v-if="errors.length" :value="true" type="error">
            <p v-for="(error, index) in errors" :key="index" class="my-0">
              {{ error }}
            </p>
          </v-alert>
          <v-text-field
            ref="firstname"
            v-model="formInput.firstname"
            name="firstname"
            label="Firstname"
            :rules="[rules.required]"
            type="text"
            required
          ></v-text-field>
          <v-text-field
            ref="lastname"
            v-model="formInput.lastname"
            name="lastname"
            label="Lastname"
            :rules="[rules.required]"
            type="text"
            required
          ></v-text-field>
          <v-text-field
            ref="phoneNumber"
            v-model="formInput.phoneNumber"
            name="phoneNumber"
            label="Phone number"
            :rules="[rules.required]"
            type="text"
            required
            counter="10"
          ></v-text-field>
          <v-text-field
            ref="siret"
            v-model="formInput.siret"
            name="siret"
            label="Siret"
            :rules="[rules.required, rules.siret, rules.number]"
            type="text"
            required
            counter="14"
          ></v-text-field>
          <p class="mt-5 mb-0">Information for login :</p>
          <v-text-field
            ref="email"
            v-model="formInput.email"
            name="email"
            label="Email"
            :rules="[rules.required, rules.email]"
            type="text"
            required
          ></v-text-field>
          <v-text-field
            id="password"
            ref="password"
            v-model="formInput.password"
            name="password"
            label="Password"
            :rules="[rules.required]"
            type="password"
            required
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="info"
            form="form-register-user"
            block
            :loading="loading"
            :disabled="loading"
            @click="loader = 'loading'"
          >
            Create my account
          </v-btn>
        </v-card-text>
      </v-form>
    </v-card>
    <v-flex class="mt-5 text-xs-center">
      <strong>{{ $t('register.account') }}</strong>
      <nuxt-link to="/login">{{ $t('register.accountlink') }}</nuxt-link>
    </v-flex>
  </v-flex>
</template>

<script>
import { mapGetters } from 'vuex'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

// class FormErrors {
//   constructor() {
//     this.errors = {}
//   }
//   has(field) {
//     return this.errors.hasOwnProperty(field)
//   }
//   any() {
//     return Object.keys(this.errors).length > 0
//   }
//   get(field) {
//     if (this.errors[field]) {
//       return this.errors[field]
//     }
//   }
//   record(errors) {
//     this.errors = errors
//   }
//   clear(field) {
//     delete this.errors[field]
//   }
//   reset() {
//     this.errors = {}
//   }
// }

export default {
  components: {
    LanguageSwitcher
  },
  data() {
    return {
      formInput: {
        firstname: '',
        lastname: '',
        phoneNumber: '',
        siret: '',
        email: '',
        password: ''
      },
      formHasErrors: false,
      errors: [],
      // errors: new FormErrors(),
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        siret: v => (v && v.length === 14) || 'Siret must be 14 numbers',
        number: v => (Number(v) ? true : false || 'Number only')
      },
      loader: null,
      loading: false
    }
  },
  layout: 'login',
  computed: {
    ...mapGetters({ isLoggedIn: 'auth/isLoggedIn' })
  },
  watch: {},
  created() {
    if (this.isLoggedIn) {
      this.$router.push({
        path: '/'
      })
    }
  },
  methods: {
    /**
     * @method formSubmit
     * Verify all inputs and send POST user request to the API
     */
    async formSubmit() {
      this.loading = true
      // reset
      this.formHasErrors = false
      this.errors = []

      // find if input are empty and use the validate function of vuetify
      Object.keys(this.formInput).forEach(f => {
        if (!this.formInput[f]) {
          this.formHasErrors = true
          this.loading = false
          this.errors.push(`Error on ${f}`)
        }
        this.$refs[f].validate(true)
      })

      // call api for creating the user
      if (!this.formHasErrors) {
        const vendor = {
          firstname: this.$data.formInput.firstname,
          lastname: this.$data.formInput.lastname,
          phoneNumber: this.$data.formInput.phoneNumber,
          email: this.$data.formInput.email,
          password: this.$data.formInput.password,
          role: 'VENDOR'
        }
        try {
          const res = await this.$store.dispatch('vendor/create', vendor)
          if (res.status && res.status !== 201) {
            this.errors = res.message.split('\n')
            this.formHasErrors = true
            this.loading = false
          }
        } catch (error) {
          console.log(error)
        }

        // the dispatch create the user and logged the user
        if (this.isLoggedIn) {
          this.$router.push({
            path: '/'
          })
        }
      }
    }
  }
}
</script>
