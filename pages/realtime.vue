<template>
  <v-container fluid pa-0>
    <v-flex xs12 class="resultContainer">
      <v-layout justify-space-around row fill-height>
        <v-flex xs4 class="column" elevation-1>
          <v-container grid-list-md pa-0>
            <v-layout row wrap>
              <v-flex xs12 class="title">
                <p>
                  Waiting
                  <br />
                  orders
                </p>
              </v-flex>
              <v-flex v-if="pendingOrders.length" xs12 class="restrict">
                <v-card
                  v-for="order in sortable(pendingOrders)"
                  :key="order.id"
                  class="mb-2"
                  :class="
                    `${progressBarColor(
                      progressPercent(order.date, order.recoveryTime)
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
                          progressPercent(order.date, order.recoveryTime)
                        )
                      "
                      height="15"
                      :value="
                        `${progressPercent(order.date, order.recoveryTime)}`
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
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          flat
                          icon
                          color="error"
                          small
                          class="fly-button-refuse"
                          v-on="on"
                        >
                          <v-icon dark @click="refuseOrder(order.id)">
                            highlight_off
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Refuse order</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          flat
                          icon
                          dark
                          color="success"
                          small
                          class="fly-button-accept"
                          v-on="on"
                        >
                          <v-icon dark @click="acceptOrder(order)">
                            check_circle_outline
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Accept order</span>
                    </v-tooltip>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex v-else style="position:relative">
                <v-icon class="icon-column rotate" color="grey lighten-2">
                  hourglass_empty
                </v-icon>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs4 class="column" elevation-1>
          <v-container grid-list-md pa-0>
            <v-flex xs12 class="title">
              <p>
                Orders
                <br />
                in progress
              </p>
            </v-flex>
            <v-layout row wrap>
              <v-flex v-if="inProgressOrders.length" xs12 class="restrict">
                <v-card
                  v-for="order in sortable(inProgressOrders)"
                  :key="order.id"
                  class="mb-2"
                  :class="
                    `${progressBarColor(
                      progressPercent(order.date, order.recoveryTime)
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
                          progressPercent(order.date, order.recoveryTime)
                        )
                      "
                      height="15"
                      :value="
                        `${progressPercent(order.date, order.recoveryTime)}`
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
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          flat
                          icon
                          dark
                          color="success"
                          small
                          class="fly-button-accept"
                          v-on="on"
                        >
                          <v-icon dark @click="completeOrder(order)">
                            check_circle_outline
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Order is ready for delevery</span>
                    </v-tooltip>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex v-else style="position:relative">
                <v-icon class="icon-column " color="grey lighten-2">
                  local_dining
                </v-icon>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs4 class="column" elevation-1>
          <v-container grid-list-md pa-0>
            <v-flex xs12 class="title">
              <p>
                Completed
                <br />
                orders
              </p>
            </v-flex>
            <v-layout row wrap>
              <v-flex v-if="completedOrders.length" xs12 class="restrict">
                <v-card
                  v-for="order in sortable(completedOrders)"
                  :key="order.id"
                  class="mb-2"
                >
                  <v-card-text>
                    <p class="mb-1">{{ order.orderNumber }}</p>
                    <v-divider></v-divider>
                    <p class="mb-0 mt-1">
                      Recovery time : {{ order.recoveryTime }}
                    </p>
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
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          flat
                          icon
                          dark
                          color="success"
                          small
                          class="fly-button-accept"
                          v-on="on"
                        >
                          <v-icon dark @click="deliveredOrder(order.id)">
                            face
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>The customer gets his order</span>
                    </v-tooltip>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex v-else style="position:relative">
                <v-icon class="icon-column " color="grey lighten-2">
                  face
                </v-icon>
              </v-flex>
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
            placeholder="12:30"
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
import { mapGetters, mapState } from 'vuex'

import io from 'socket.io-client'
import { baseURL } from '~/config'
let socket = null

export default {
  data() {
    return {
      pendingOrders: [],
      inProgressOrders: [],
      completedOrders: [],
      dialog: false,
      fakeRecoveryTime: '',
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
      getPendingOrders: 'order/getPendingOrders',
      getInProgressOrders: 'order/getInProgressOrders',
      getCompletedOrders: 'order/getCompletedOrders'
    }),
    ...mapState({
      pendingOrdersState: state => state.order.pendingOrders,
      inProgressOrdersState: state => state.order.inProgressOrders,
      completedOrdersState: state => state.order.completedOrders
    })
  },
  watch: {
    pendingOrdersState: function(oldValue, newValue) {
      this.pendingOrders = this.getPendingOrders
    },
    inProgressOrdersState: function(oldValue, newValue) {
      this.inProgressOrders = this.getInProgressOrders
    },
    completedOrdersState: function(oldValue, newValue) {
      this.completedOrders = this.getCompletedOrders
    }
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
    this.getPendingOrdersList()
    this.getInProgressOrdersList()
    this.getCompletedOrdersList()
  },
  methods: {
    getPendingOrdersList() {
      this.pendingOrders = this.getPendingOrders
    },
    getInProgressOrdersList() {
      this.inProgressOrders = this.getInProgressOrders
    },
    getCompletedOrdersList() {
      this.completedOrders = this.getCompletedOrders
    },
    /**
     * Change the status of the order to FINISHED
     */
    async completeOrder(order) {
      await this.$store.dispatch('order/completed', order)
    },
    /**
     * Remove the order from the state
     */
    refuseOrder(orderId) {
      this.$store.dispatch('order/remove', orderId)
    },
    /**
     * Remove the order from the state
     */
    deliveredOrder(orderId) {
      this.$store.dispatch('order/removeCompleted', orderId)
    },
    /**
     * Change the status of the order to INPROGRESS
     */
    async acceptOrder(order) {
      await this.$store.dispatch('order/accept', order)
    },
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
    progressPercent(start, end) {
      const endTime = this.transformEndTimeToEndDate(end)
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
  display: block;
  height: 50px;
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
.fly-button-accept {
  position: absolute;
  top: 3px;
  right: 0px;
}
.fly-button-refuse {
  position: absolute;
  top: 3px;
  right: 40px;
}
.restrict {
  overflow-y: auto;
  height: calc(100vh - 190px);
}

.icon-column {
  /* position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  margin: -60px 0 0 -60px; */
  position: absolute;
  top: 50px;
  left: 46%;
}
.rotate {
  -webkit-animation: spin 4s linear infinite;
  -moz-animation: spin 4s linear infinite;
  animation: spin 4s linear infinite;
}
@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
