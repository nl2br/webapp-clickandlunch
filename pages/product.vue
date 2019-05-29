<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-card class="px-4 py-3 mb-4">
          <v-layout xs12>
            <v-flex xs8>
              <h1>Product list</h1>
            </v-flex>
            <v-flex xs4 class="text-xs-right">
              <v-btn color="info" @click="visible = !visible">
                New product
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <transition name="slide-fade">
          <v-card v-show="visible" class="mb-4">
            <v-card-text>
              <v-form
                id="formCreateProduct"
                ref="form"
                enctype="multipart/form-data"
                @submit.prevent="formSubmit"
              >
                <v-alert v-if="errors.length" :value="true" type="error">
                  <p v-for="(error, index) in errors" :key="index" class="my-0">
                    {{ error }}
                  </p>
                </v-alert>
                <v-layout row wrap>
                  <v-layout xs12>
                    <v-flex xs8>
                      <h2>Product list</h2>
                    </v-flex>
                    <v-flex xs4 class="text-xs-right">
                      <v-btn flat color="info" @click="visible = !visible">
                        close
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12 md4>
                    <v-flex
                      v-if="photo !== ''"
                      :class="{ 'mr-4': $vuetify.breakpoint.mdAndUp }"
                    >
                      <v-img :src="photo" height="300" class="mb-4"></v-img>
                    </v-flex>
                    <v-flex
                      v-else
                      :class="{ 'mr-4': $vuetify.breakpoint.mdAndUp }"
                    >
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
                        <p v-if="isSaving">
                          Uploading {{ fileCount }} files...
                        </p>
                      </div>
                    </v-flex>
                  </v-flex>
                  <v-flex xs12 md8>
                    <v-text-field
                      ref="name"
                      v-model="formAddProduct.name"
                      name="name"
                      label="Name"
                      :rules="[rules.required]"
                      type="text"
                      required
                    ></v-text-field>
                    <v-textarea
                      ref="description"
                      v-model="formAddProduct.description"
                      name="description"
                      label="Description"
                      :rules="[rules.required]"
                      type="text"
                      required
                      counter="500"
                    ></v-textarea>
                    <v-select
                      ref="type"
                      v-model="formAddProduct.type"
                      :items="type"
                      :rules="[rules.required]"
                      label="Type of product"
                      required
                    ></v-select>
                    <v-select
                      v-show="formAddProduct.type === 'MENU'"
                      ref="listProducts"
                      v-model="formAddProduct.listProducts"
                      :items="productsList"
                      label="Choose products for your menu"
                      multiple
                      item-value="id"
                      item-text="name"
                    ></v-select>
                    <v-text-field
                      ref="price"
                      v-model="formAddProduct.price"
                      name="price"
                      label="Price"
                      :rules="[rules.required, rules.price]"
                      type="text"
                      required
                    ></v-text-field>
                    <v-btn
                      type="submit"
                      color="success"
                      form="formCreateProduct"
                      block
                      :loading="loading"
                      :disabled="loading"
                      @click="loader = 'loading'"
                    >
                      Create my product
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </transition>
      </v-flex>
    </v-layout>
    <v-flex xs12>
      <template v-if="productsList.length > 0">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Filter the list"
          single-line
          hide-details
          class="mb-3"
          clearable
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="productsList"
          class="elevation-1"
          :expand="expand"
          :search="search"
          hide-actions
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td>{{ props.item.productType }}</td>
              <td>
                <v-img
                  :src="
                    props.item.Photos.length ? props.item.Photos[0].url : ''
                  "
                  width="50"
                  height="50"
                  class="my-1"
                ></v-img>
              </td>
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.price }}</td>
              <td class="text-xs-right">
                <v-btn
                  v-if="props.item.products && props.item.products.length"
                  class="info"
                  @click="props.expanded = !props.expanded"
                >
                  details
                </v-btn>
              </td>
            </tr>
          </template>
          <template v-slot:expand="props">
            <tr
              v-for="product in props.item.products"
              :key="product.id + '-menu'"
              class="grey lighten-4"
            >
              <td>{{ product.name }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.productType }}</td>
            </tr>
          </template>
          <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning">
              Your search for "{{ search }}" found no results.
            </v-alert>
          </template>
        </v-data-table>
      </template>
    </v-flex>
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
export default {
  data() {
    return {
      productCreated: false,
      productsList: [],
      formHasErrors: false,
      errors: [],
      rules: {
        required: value => !!value || 'Required.',
        number: v =>
          Number(v) ? true : false || 'Number only, or use . instead of ,',
        price: v =>
          /^[0-9]+([.,][0-9]{2})?$/.test(v)
            ? true
            : false || 'Number only like this 9.90'
      },
      photo: '',
      formAddProduct: {
        name: '',
        description: '',
        price: '',
        type: '',
        listProducts: []
      },
      type: ['STARTER', 'DISH', 'DESSERT', 'DRINK', 'OTHER', 'MENU'],
      imageToUpload: null,
      snackbar: {
        visible: false,
        message: null,
        timeout: 3000,
        color: ''
      },
      visible: false,
      loader: null,
      loading: false,
      isInitial: true,
      isSaving: false,
      headers: [
        { text: 'Type', value: 'productType' },
        {
          text: 'Photo',
          value: 'Photos',
          sortable: false
        },
        { text: 'Name', value: 'name' },
        { text: 'Price', value: 'price' },
        { text: '', value: 'products', sortable: false }
      ],
      expand: false,
      search: ''
    }
  },
  watch: {
    productCreated: async function() {
      this.productsList = await this.$store.dispatch(
        'product/getProductsList',
        this.$store.state.shop.shop.id
      )
      this.productCreated = false
    }
  },
  mounted: async function() {
    await this.getProductsList()
  },
  methods: {
    /**
     * Search the list of products in store
     * if not in store send a request to the API
     */
    async getProductsList() {
      this.productsList = this.$store.state.product.products
      if (this.productsList.length === 0) {
        this.productsList = await this.$store.dispatch(
          'product/getProductsList',
          this.$store.state.shop.shop.id
        )
      }
    },
    // TODO: if no product open the form by default
    // TODO: if no product cant select menu in dropdown
    // TODO: if product in list is menu, add "details" link to show products
    async formSubmit() {
      this.loading = true
      // find errors
      this.formHasErrors = false
      this.errors = []

      // create the formData
      const formData = new FormData()

      Object.keys(this.formAddProduct).forEach(f => {
        console.log('TCL: formSubmit -> f', f)
        console.log(
          'TCL: formSubmit -> this.formAddProduct[f]',
          !this.formAddProduct[f]
        )
        if (!this.formAddProduct[f]) {
          this.formHasErrors = true
          this.loading = false
          this.errors.push(`Error on ${f}`)
        }
        this.$refs[f].validate(true)
      })
      console.log(
        'TCL: formSubmit -> this.$data.formAddProduct',
        this.$data.formAddProduct
      )
      // call api for creating the shop
      if (!this.formHasErrors) {
        formData.append('name', this.$data.formAddProduct.name)
        formData.append(
          'description',
          this.$data.formAddProduct.description.trim()
        )
        formData.append('productType', this.$data.formAddProduct.type)
        formData.append('price', this.$data.formAddProduct.price)

        if (this.imageToUpload) {
          formData.append('file', this.imageToUpload)
        }

        if (this.formAddProduct.listProducts.length) {
          formData.append('listProducts', this.formAddProduct.listProducts)
        }
        console.log(
          'TCL: formSubmit -> this.$store.state.shop.shop.id',
          this.$store.state.shop.shop.id
        )
        console.log(
          'TCL: formSubmit -> this.formAddProduct.listProducts',
          this.formAddProduct.listProducts
        )
        if (!this.formHasErrors) {
          // API call
          const ressource = this.formAddProduct.listProducts.length
            ? 'createMenu'
            : 'create'
          try {
            const res = await this.$store.dispatch(`product/${ressource}`, {
              shopId: this.$store.state.shop.shop.id,
              product: formData
            })
            if (res.status && res.status !== 201) {
              this.errors.push(res.message)
              this.formHasErrors = true
              this.loading = false
              return
            }
          } catch (error) {
            console.log(error)
            return
          }

          // reset the form
          this.$refs.form.reset()
          this.imageToUpload = null
          this.isInitial = true
          this.errors = []
          this.formHasErrors = false
          // show the successfull snack message
          this.snackbar.message = 'Product is saved !'
          this.snackbar.color = 'success'
          this.snackbar.visible = true
          this.loading = false
          this.productCreated = true
          // hide the form
          this.visible = false
        }
      }
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
    }
  }
}
</script>

<style>
/* Les animations d'entrée (« enter ») et de sortie (« leave »)  */
/* peuvent utiliser différentes fonctions de durée et de temps.  */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}
</style>
