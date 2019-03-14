<template>
  <div id="app">
    <NavBar
      :is-file-loaded="isFileLoaded"
      :file-location="fileLocation"
      :user="user"
      @logout="resetUser" />
    <router-view />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import NavBar from '@/components/NavBar'

export default {
  components: {
    NavBar
  },
  computed: mapState({
    isFileLoaded: (state) => !!state.file.data,
    fileLocation: (state) => state.file.location,
    authCode: (state) => state.route.query.code,
    user: (state) => state.user
  }),
  async created () {
    if (this.authCode) {
      const loadingIndicator = this.$loading.open()
      try {
        await this.finishLogin(this.authCode)
      } catch (err) {
        this.$snackbar.open({
          type: 'is-danger',
          message: 'Login failed'
        })
        console.error('yikes', err)
      } finally {
        loadingIndicator.close()
      }
    }
  },
  methods: {
    ...mapActions([
      'finishLogin'
    ]),
    ...mapMutations({
      resetUser: 'RESET_USER'
    })
  }
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
