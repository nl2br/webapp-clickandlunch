<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card class="px-4 py-3 mb-4">
          <v-layout xs12>
            <v-flex xs12>
              <h1>Your shop</h1>
            </v-flex>
            <!-- <v-flex xs8>
              <h1>Your shop</h1>
            </v-flex>
            <v-flex xs4 class="text-xs-right">
              <v-btn color="info" @click="formSubmit">
                Save
              </v-btn>
            </v-flex> -->
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <v-form
          id="form-create-shop"
          enctype="multipart/form-data"
          @submit.prevent="formSubmit"
        >
          <v-alert v-if="errors.length" :value="true" type="error">
            <p v-for="(error, index) in errors" :key="index" class="my-0">
              {{ error }}
            </p>
          </v-alert>
          <div class="dropbox">
            <input
              type="file"
              name="imageToUpload"
              :disabled="isSaving"
              accept="image/*"
              class="input-file"
              @change="filesChange($event.target.value, $event.target.files)"
            />
            <p v-if="isInitial">
              Drag your file(s) here to begin
              <br />
              or click to browse
            </p>
            <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
          </div>

          <v-text-field
            ref="name"
            v-model="formInput.name"
            name="name"
            label="Name"
            :rules="[rules.required]"
            type="text"
            required
          ></v-text-field>
          <v-text-field
            ref="address"
            v-model="formInput.address"
            name="address"
            label="Address"
            :rules="[rules.required]"
            type="text"
            required
          ></v-text-field>
          <v-layout xs12>
            <v-flex xs8>
              <v-text-field
                ref="city"
                v-model="formInput.city"
                name="city"
                label="City"
                :rules="[rules.required]"
                type="text"
                required
                class="pr-2"
              ></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-text-field
                ref="postalCode"
                v-model="formInput.postalCode"
                name="postalCode"
                label="Postal Code"
                :rules="[rules.required]"
                type="text"
                required
                class="pl-2"
              ></v-text-field>
            </v-flex>
          </v-layout>
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
            ref="email"
            v-model="formInput.email"
            name="email"
            label="Email"
            :rules="[rules.required, rules.email]"
            type="text"
            required
          ></v-text-field>
          <v-text-field
            ref="siret"
            v-model="formInput.siret"
            name="siret"
            label="Siret"
            :rules="[rules.required]"
            type="text"
            required
            counter="14"
          ></v-text-field>
          <v-btn type="submit" color="info" form="form-create-shop" block>
            Create my shop
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
// import { rules } from '../utils/rules'

export default {
  data() {
    return {
      formInput: {
        name: '',
        address: '',
        city: '',
        postalCode: '',
        siret: '',
        email: ''
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
      isInitial: true,
      isSaving: false,
      imageToUpload: null
    }
  },
  methods: {
    async formSubmit() {
      // find errors
      this.formHasErrors = false
      this.errors = []

      Object.keys(this.formInput).forEach(f => {
        if (!this.formInput[f]) {
          this.formHasErrors = true
          this.errors.push(`Error on ${f}`)
        }
        this.$refs[f].validate(true)
      })

      console.log('TCL: formSubmit -> this.formHasErrors', this.formHasErrors)

      // call api for creating the shop
      if (!this.formHasErrors) {
        const shop = {
          name: this.$data.formInput.name,
          address: this.$data.formInput.address,
          city: this.$data.formInput.city,
          postalCode: this.$data.formInput.postalCode,
          siret: this.$data.formInput.siret,
          siren: this.$data.formInput.siret.substring(0, 9),
          phoneNumber: this.$data.formInput.phoneNumber,
          email: this.$data.formInput.email
        }
        console.log('TCL: formSubmit -> shop', shop)

        // api call for retrieve lat and lon of the address
        let position
        try {
          position = await axios.get(
            `https://nominatim.openstreetmap.org/search?street=${
              shop.address
            }&city=${shop.city}&postalcode=${shop.postalCode}&format=json`
          )
          console.log('TCL: formSubmit -> position', position.data[0])
        } catch (error) {
          // call to api doens't work, cant have location, cant save
          console.log('TCL: formSubmit -> error', error)
        }

        if (!position.data[0]) {
          // address doenst exist, send error
          this.errors.push(
            "Can't retrieve your address, please verify your address"
          )
        }

        console.log('TCL: formSubmit -> this.errors', !this.errors)
        if (this.errors.length === 0) {
          Object.assign(shop, {
            longitude: position.data[0].lon,
            latitude: position.data[0].lat
          })

          console.log('TCL: formSubmit -> shop', shop)
        }

        if (this.imageToUpload) {
          Object.assign(shop, {
            file: this.imageToUpload
          })
          console.log('TCL: formSubmit -> shop after fileUpload', shop)
        }

        try {
          const res = await this.$store.dispatch('shop/create', shop)
          console.log('TCL: formSubmit -> res', res)
          if (res.status !== 201) {
            this.errors = res.message
            this.formHasErrors = true
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    filesChange(path, file) {
      console.log('TCL: filesChange -> fileList', file)
      console.log('TCL: filesChange -> path', path)

      this.imageToUpload = path
    }
  }
}
</script>

<style>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
