<template>
  <v-container fluid pa-0>
    <v-flex xs12 class="resultContainer">
      <v-layout justify-space-around row fill-height>
        <v-flex xs4 class="column" elevation-1>
          <v-container grid-list-md pa-0>
            <v-layout row wrap>
              <v-flex xs12 class="title">
                <p>
                  Commandes
                  <br />
                  en attentes
                </p>
              </v-flex>
              <v-flex xs12>
                <v-card>
                  <v-card-text>test</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12>
                <v-card>
                  <v-card-text>test</v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs4 class="column" elevation-1>
          <v-container grid-list-md pa-0>
            <v-flex xs12 class="title">
              <p>
                Commandes
                <br />
                en préparation
              </p>
            </v-flex>
            <v-layout row wrap>
              <v-flex xs12></v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs4 class="column" elevation-1>
          <v-container grid-list-md pa-0>
            <v-flex xs12 class="title">
              <p>
                Commandes
                <br />
                terminées
              </p>
            </v-flex>
            <v-layout row wrap>
              <v-flex xs12></v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-btn fab dark color="info" class="fly-button">
      <v-icon dark @click="dialog = !dialog">add</v-icon>
    </v-btn>
    <!-- v-dialog -->
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <v-card>
        <v-card-title>Select products for fake order</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            ref="fakeRecoveryTime"
            v-model="fakeRecoveryTime"
            name="fakeRecoveryTime"
            label="Recovery Time"
            type="text"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-flex
            v-for="fakeProduct in fakeProductsList"
            :key="fakeProduct.id"
            xs12
            ma-0
            pa-0
          >
            <v-checkbox
              v-model="fakeOrderProducts"
              :value="fakeProduct.id"
              :label="fakeProduct.name"
              type="checkbox"
              hide-details
            ></v-checkbox>
          </v-flex>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="dialog = !dialog">
            Close
          </v-btn>
          <v-btn color="blue darken-1" flat @click="sendFakeOrder">
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
export default {
  data() {
    return {
      dialog: false,
      fakeProductsList: [],
      fakeOrderProducts: [],
      snackbar: {
        visible: false,
        message: null,
        timeout: 3000,
        color: ''
      }
    }
  },
  computed: {
    /**
     * Create the fake order time to time now +2 minutes
     */
    fakeRecoveryTime: function() {
      const d = new Date()
      return `${d
        .getHours()
        .toString()
        .padStart(2, '0')}:${new Date(d.getTime() + 2 * 60000)
        .getMinutes()
        .toString()
        .padStart(2, '0')}`
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
      this.fakeProductsList = this.$store.state.product.products
      if (this.fakeProductsList.length === 0) {
        this.fakeProductsList = await this.$store.dispatch(
          'product/getProductsList',
          this.$store.state.shop.shop.id
        )
      }
    },
    /**
     * Send a fake order
     */
    async sendFakeOrder() {
      let res
      try {
        res = await axios.post(
          `orders/shops/${this.$store.state.shop.shop.id}/customers/1`,
          {
            recoveryTime: this.fakeRecoveryTime,
            products: this.fakeOrderProducts.map(item => {
              return { id: item, quantity: 1 }
            })
          }
        )
      } catch (error) {
        console.log(error.response.status, error.response.data.message)
        // show the unsuccess snack message
        this.snackbar.message = 'Fake order not send !'
        this.snackbar.color = 'error'
        this.snackbar.visible = true
        this.loading = false
        this.productCreated = true
        return
      }
      console.log('TCL: fakeOrder -> res', res.data)
      this.dialog = !this.dialog
      // show the successfull snack message
      this.snackbar.message = 'Fake order is send !'
      this.snackbar.color = 'success'
      this.snackbar.visible = true
      this.loading = false
      this.productCreated = true
    }
  }
}
</script>

<style scoped>
.column {
  /* border: 1px solid grey; */
  padding: 10px;
  background-color: white;
  margin: 0 5px;
}
.resultContainer {
  height: calc(100vh - 80px);
}
.title {
  margin: 10px 0;
}
.title p {
  text-align: center;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}
.fly-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
