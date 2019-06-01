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
              <v-flex v-if="newOrder.length" xs12 class="restrict">
                <v-card
                  v-for="order in sortable(newOrder)"
                  :key="order.id"
                  class="mb-2"
                  :class="
                    `${progressBarColor(
                      updateProgressBar(order.date, order.recoveryTime)
                    )} lighten-5`
                  "
                >
                  <v-card-text>
                    <p class="mb-1">{{ order.orderNumber }}</p>
                    <v-divider></v-divider>
                    <p class="mb-0 mt-1">
                      Recovery time : {{ order.recoveryTime }}
                    </p>
                    <p class="mb-1 mt-0">
                      Time left: {{ timeLeft(order.recoveryTime, order.id) }}
                    </p>
                    <v-progress-linear
                      class="mt-1 mb-2"
                      :color="
                        progressBarColor(
                          updateProgressBar(order.date, order.recoveryTime)
                        )
                      "
                      height="15"
                      :value="
                        `${updateProgressBar(order.date, order.recoveryTime)}`
                      "
                    ></v-progress-linear>
                    <v-divider></v-divider>
                    <ul class="mt-2">
                      <li
                        v-for="product in order.OrderDetails"
                        :key="
                          Math.floor(Math.random() * (1000 - 1) + 1) +
                            '-' +
                            product.id
                        "
                      >
                        {{ product.quantity }} x {{ product.Product.name }}
                      </li>
                    </ul>
                  </v-card-text>
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
              <v-flex xs12 class="restrict"></v-flex>
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
              <v-flex xs12 class="restrict"></v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-btn fab dark color="info" class="fly-button">
      <v-icon dark @click="dialog = !dialog">phone_iphone</v-icon>
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
import { mapGetters } from 'vuex'
import io from 'socket.io-client'
import { baseURL } from '~/config'
let socket = null

export default {
  data() {
    return {
      newOrder: [],
      dialog: false,
      fakeRecoveryTime: null,
      fakeProductsList: [],
      fakeOrderProducts: [],
      snackbar: {
        visible: false,
        message: null,
        timeout: 3000,
        color: ''
      },
      progress: 0,
      ordersTimer: [],
      now: new Date()
    }
  },
  computed: {
    ...mapGetters({
      getProduct: 'product/getProduct',
      getOrders: 'order/getOrders'
    })
  },
  created() {
    // "now" update every second
    // the varible "now" is now reactive
    // so if we use "now" in a method, the changes will be reactive
    setInterval(() => (this.now = new Date()), 1000)
    console.log('TCL: created -> created', this.now)
  },
  /**
   * Create the connection with the server througth socketio
   */
  beforeMount() {
    // connect to the socket
    socket = io(baseURL + '/clickandlunch', { path: '/calsocketio' })
    // create the relation between the shop ID and the socket ID
    socket.emit('register', this.$store.state.shop.shop.id)
    // when server send a message, catch it
    socket.on('message', message => {
      console.log('Le serveur a un message pour vous : ', message)
    })

    // when the server send an order, catch it
    socket.on('order', data => {
      this.$store.dispatch('order/addOrder', data)
      // this.newOrder.push(data)
      // launch success message
      this.snackbar.message = 'New order receiving !'
      this.snackbar.color = 'success'
      this.snackbar.visible = true
      this.loading = false
      this.productCreated = true
    })

    // catch socketio error
    socket.on('socket error', function(err) {
      console.log('error socket', err)
    })
  },
  mounted: async function() {
    await this.getProductsList()
    this.getOrdersList()
  },
  methods: {
    /**
     * Sort the orders on their recovery time
     * @params {Array}
     * @return {Array} return sorted list of orders
     */
    sortable(arr) {
      return arr.slice().sort((a, b) => {
        return (
          this.transformEndTimeToEndDate(a.recoveryTime).getTime() -
          this.transformEndTimeToEndDate(b.recoveryTime).getTime()
        )
      })
    },
    timeLeft(end, orderId) {
      let time
      const endDate = this.transformEndTimeToEndDate(end)
      const seconds = Math.floor(
        (endDate.getTime() - this.now.getTime()) / 1000
      )
      console.log('TCL: timeLeft -> seconds', seconds)
      if (seconds > 0) {
        time = new Date(seconds * 1000).toISOString().substr(11, 8)
      } else {
        time = 'late'
      }
      return time
    },
    transformEndTimeToEndDate(end) {
      const today = new Date()
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        end.substring(0, 2),
        end.substring(3),
        0
      )
    },
    updateProgressBar(start, end) {
      console.log('TCL: updateProgressBar -> end', end)
      console.log('TCL: updateProgressBar -> start', start)
      const endTime = this.transformEndTimeToEndDate(end)
      console.log('TCL: updateProgressBar -> endTime', endTime)
      console.log('TCL: updateProgressBar -> this.now', this.now)

      const interval = Math.floor(
        ((this.now.getTime() - Date.parse(start)) /
          (endTime.getTime() - Date.parse(start))) *
          100
      )
      return interval
    },
    progressBarColor(percent) {
      let color
      if (percent <= 50) {
        color = 'light-blue'
      }
      if (percent > 50 && percent <= 75) {
        color = 'amber'
      }
      if (percent > 75) {
        color = 'deep-orange'
      }
      return color
    },
    getOrdersList() {
      this.newOrder = this.getOrders
    },
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
      try {
        await axios.post(
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
      this.dialog = !this.dialog
    }
  }
}
</script>

<style scoped>
.column {
  /* border: 1px solid grey; */
  padding: 10px;
  background-color: white;
  margin: 0 0px;
}
.resultContainer {
  height: calc(100vh - 110px);
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
.restrict {
  overflow-y: auto;
  height: calc(100vh - 190px);
}
</style>
