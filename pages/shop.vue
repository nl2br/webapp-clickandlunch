<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card class="px-4 py-3 mb-4">
          <v-layout xs12>
            <v-flex xs12>
              <h1>{{ txtPageTitle }}</h1>
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
          <v-flex v-if="photo !== ''">
            <v-img
              :src="photo"
              height="300"
              class="grey lighten-2 mb-4"
            ></v-img>
          </v-flex>
          <v-flex v-else>
            <div class="dropbox">
              <input
                ref="file"
                type="file"
                name="imageToUpload"
                :disabled="isSaving"
                accept="image/*"
                class="input-file"
                @change="handleFileUpload($event.target.files)"
              />

              <p v-if="isInitial">
                Drag your file here to begin
                <br />
                or click to browse
              </p>
              <p v-else>File {{ imageToUpload.name }} is loaded</p>
              <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
            </div>
          </v-flex>

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
          <v-btn
            type="submit"
            color="info"
            form="form-create-shop"
            block
            :loading="loading"
            :disabled="loading"
            @click="loader = 'loading'"
          >
            {{ txtSubmitButton }}
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      top
      :timeout="snackbar.timeout"
    >
      {{ snackbar.message }}
      <v-btn dark flat @click="snackbar.visible = false">
        Fermer
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loader: null,
      loading: false,
      txtPageTitle: 'Create your restaurant',
      txtSubmitButton: 'Create my restaurant',
      photo: '',
      formInput: {
        name: '',
        address: '',
        city: '',
        phoneNumber: '',
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
      imageToUpload: null,
      snackbar: {
        visible: false,
        message: null,
        timeout: 3000,
        color: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      hasShop: 'shop/hasShop',
      getInfosShop: 'shop/getInfosShop'
    })
  },
  /**
   * Switch between creation or modification form
   * @function mounted
   */
  mounted: function() {
    this.txtPageTitle = this.hasShop
      ? 'Modify your restaurant'
      : this.txtPageTitle
    this.txtSubmitButton = this.hasShop
      ? 'Modify my restaurant'
      : this.txtSubmitButton
    if (
      this.getInfosShop &&
      typeof this.getInfosShop !== 'undefined' &&
      this.getInfosShop.Photos &&
      typeof this.getInfosShop.Photos !== 'undefined' &&
      this.getInfosShop.Photos.length
    ) {
      this.photo = this.getInfosShop.Photos[0].url
    }
    this.formInput = {
      name: this.hasShop ? this.getInfosShop.name : '',
      address: this.hasShop ? this.getInfosShop.address : '',
      city: this.hasShop ? this.getInfosShop.city : '',
      phoneNumber: this.hasShop ? this.getInfosShop.phoneNumber : '',
      postalCode: this.hasShop ? this.getInfosShop.postalCode : '',
      siret: this.hasShop ? this.getInfosShop.siret : '',
      email: this.hasShop ? this.getInfosShop.email : ''
    }
  },
  methods: {
    async formSubmit() {
      this.hasShop ? await this.modifyShop() : await this.addShop()
    },
    async addShop() {
      this.loading = true
      // find errors
      this.formHasErrors = false
      this.errors = []

      // create the formData
      const formData = new FormData()

      Object.keys(this.formInput).forEach(f => {
        if (!this.formInput[f]) {
          this.formHasErrors = true
          this.loading = false
          this.errors.push(`Error on ${f}`)
        }
        this.$refs[f].validate(true)
      })

      // call api for creating the shop
      if (!this.formHasErrors) {
        formData.append('name', this.$data.formInput.name)
        formData.append('address', this.$data.formInput.address)
        formData.append('city', this.$data.formInput.city)
        formData.append('postalCode', this.$data.formInput.postalCode)
        formData.append('siret', this.$data.formInput.siret)
        formData.append('siren', this.$data.formInput.siret.substring(0, 9))
        formData.append('phoneNumber', this.$data.formInput.phoneNumber)
        formData.append('email', this.$data.formInput.email)

        // api call for retrieve lat and lon of the address
        let position
        try {
          position = await axios.get(
            `https://nominatim.openstreetmap.org/search?street=${
              this.$data.formInput.address
            }&city=${this.$data.formInput.city}&postalcode=${
              this.$data.formInput.postalCode
            }&format=json`
          )
        } catch (error) {
          // call to api doens't work, cant have location, cant save
          console.log('error on api nominatim call : ', error)
        }

        if (!position.data[0]) {
          // address doenst exist, send error
          this.errors.push(
            "Can't retrieve your address, please verify your address"
          )
          this.formHasErrors = true
          this.loading = false
        }

        if (!this.formHasErrors) {
          formData.append('longitude', position.data[0].lon)
          formData.append('latitude', position.data[0].lat)
        }

        if (this.imageToUpload) {
          formData.append('file', this.imageToUpload)
        }

        if (!this.formHasErrors) {
          // API call
          try {
            const res = await this.$store.dispatch('shop/create', formData)
            if (res.status && res.status !== 201) {
              this.errors.push(res.message)
              this.formHasErrors = true
              this.loading = false
              return
            }
          } catch (error) {
            console.log(error)
          }
          this.errors = []
          this.formHasErrors = false
          this.snackbar.message = 'Restaurant is saved !'
          this.snackbar.color = 'success'
          this.snackbar.visible = true
          this.loading = false
          this.reloadForm()
        }
      }
    },
    modifyShop() {
      this.snackbar.message = 'Not implemented yet, sorry for the inconvinient'
      this.snackbar.color = 'info'
      this.snackbar.visible = true
    },
    /**
     *
     * @param {string} path
     * @param {Object} file
     */
    handleFileUpload(fileList) {
      if (fileList.length) {
        this.formHasErrors = false
        const maxUpload = 2000000
        this.imageToUpload = fileList[0]

        // add verification on format and size
        // verify the file format
        if (this.imageToUpload.type.match(/.(jpg|jpeg|png)$/i) === null) {
          this.errors.push(
            'error on file format, photo is not a jpg, jpeg or png'
          )
          this.formHasErrors = true
        }

        // verify the file size, 2mo max
        if (this.imageToUpload.size > maxUpload) {
          this.errors.push('error on file size exceced the 1.5 mo authorized')
          this.formHasErrors = true
        }

        if (this.formHasErrors) {
          this.imageToUpload = null
          this.isInitial = true
        } else {
          this.isInitial = false
          this.errors = []
        }
      }
    },
    reloadForm() {
      this.txtPageTitle = 'Modify your restaurant'
      this.txtSubmitButton = 'Modify my restaurant'
      if (
        this.getInfosShop.Photos &&
        typeof this.getInfosShop.Photos !== 'undefined' &&
        this.getInfosShop.Photos.length
      ) {
        this.photo = this.getInfosShop.Photos[0].url
      }
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
