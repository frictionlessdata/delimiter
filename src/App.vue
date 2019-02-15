<template>
  <div id="app">
    <NavBar
      :is-file-loaded="isFileLoaded"
      :file-location="fileLocation"
      :is-logged-in="isLoggedIn" />
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import NavBar from '@/components/NavBar'

export default {
  components: {
    NavBar
  },
  computed: mapState({
    isFileLoaded: (state) => !!state.file.data,
    fileLocation: (state) => state.file.location,
    authCode: (state) => state.route.query.code,
    isLoggedIn: (state) => !!state.authToken
  }),
  created () {
    if (this.authCode) {
      this.finishLogin(this.authCode)
    }
  },
  methods: mapActions([
    'finishLogin'
  ])
}
</script>

<style lang="sass">
@import "~bulma/sass/utilities/initial-variables"

$orange: #EB6619
$grey-darker: #262626
$primary: $orange
$family-primary: "Raleway", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
$navbar-breakpoint: 0

@import "~bulma"
@import "~buefy/src/scss/buefy"
</style>
