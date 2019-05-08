<template>
  <v-container>
    <h1>Dashboard</h1>
    <v-btn color="primary" flat @click="$store.dispatch('auth/fetch')">
      Check Me
    </v-btn>
  </v-container>
</template>

<script>
export default {}
</script>

<style></style>
