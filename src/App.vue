<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'

export default {
  components: {
    NavBar
  }
}
</script>

<style lang="sass">
@import "~bulma/sass/utilities/initial-variables"

$orange: #EB6619
$grey-darker: #262626
$primary: $orange
$family-sans-serif: "Raleway", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"

@import "~bulma"
@import "~buefy/src/scss/buefy"
</style>
