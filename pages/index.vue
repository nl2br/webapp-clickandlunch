<template>
  <v-container grid-list-md text-xs-center>
    <v-flex xs12>
      <h1>Welcome !</h1>
    </v-flex>
    <v-layout xs12 row wrap>
      <v-flex xs12 sm4>
        <v-card v-if="!hasShop" class="step">
          <v-card-text>
            <span class="step-number mt-2 mb-1">
              1
            </span>
            <p>Create your restaurant</p>
            <v-btn class="info" to="/shop" nuxt>
              GO !
            </v-btn>
          </v-card-text>
        </v-card>
        <v-card v-else class="step">
          <v-card-text>
            <span class="mt-2 mb-1">
              <v-icon color="success">check_circle</v-icon>
            </span>
            <p>Create your restaurant</p>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4>
        <v-card v-if="!hasProduct" class="step">
          <v-card-text>
            <span class="step-number mt-2 mb-1">2</span>
            <p>
              Create yours products
            </p>
            <v-btn class="info" :disabled="!hasShop" to="/product" nuxt>
              GO !
            </v-btn>
          </v-card-text>
        </v-card>
        <v-card v-else class="step">
          <v-card-text>
            <span class="mt-2 mb-1">
              <v-icon color="success">check_circle</v-icon>
            </span>
            <p>Create yours products</p>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4>
        <v-card class="step">
          <v-card-text>
            <span class="step-number mt-2 mb-1">3</span>
            <p>
              Order management
            </p>
            <v-btn class="info" :disabled="!hasProduct" to="/realtime">
              GO !
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      userInfos: 'auth/userInfos',
      hasProduct: 'product/hasProduct',
      hasShop: 'shop/hasShop'
    })
  },
  watch: {},
  methods: {}
}
</script>

<style>
.step {
  height: 150px;
}
.step .step-number {
  background: #1976d2;
  border-radius: 0.8em;
  -moz-border-radius: 0.8em;
  -webkit-border-radius: 0.8em;
  color: #ffffff;
  display: inline-block;
  font-weight: bold;
  line-height: 1.6em;
  margin-right: 5px;
  text-align: center;
  width: 1.6em;
}

.nuxt-link {
  color: white;
  text-decoration: none;
  width: 100%;
  height: 100%;
}
</style>
