<template>
  <v-flex class="languages">
    <div
      v-for="el in locales"
      :key="el"
      class="language"
      :class="{ active: el === locale }"
      @click="switchLanguage(el)"
    >
      <span>{{ el }}</span>
    </div>
  </v-flex>
</template>

<script>
export default {
  computed: {
    locales() {
      return this.$store.state.locales
    },
    locale() {
      return this.$store.state.locale
    }
  },
  methods: {
    switchLanguage(localeCode) {
      document.cookie = `locale=${localeCode}`
      location.reload()
    }
  }
}
</script>

<style>
.language-switcher {
  display: flex;
  padding: 1rem;
}
.languages {
  display: flex;
  justify-content: flex-end;
}

.language {
  padding-left: 0.25rem;
  cursor: pointer;
}
.language.active {
  text-decoration: underline;
}

.language:hover span {
  text-decoration: underline;
}

.language:not(:last-child):after {
  content: '|';
  padding-left: 0.25rem;
}
</style>
