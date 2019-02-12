<template>
  <nav
    class="navbar is-dark"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link
        class="navbar-item"
        to="/">
        Delimeter
      </router-link>

      <a
        role="button"
        class="navbar-burger burger"
        :class="{ 'is-active': isExpanded }"
        aria-label="menu"
        aria-expanded="false"
        @click="isExpanded = !isExpanded">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div
      class="navbar-menu"
      :class="{ 'is-active': isExpanded }">
      <div class="navbar-start">
        <router-link
          to="/"
          class="navbar-item">
          Home
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {
      isExpanded: false
    }
  }
}
</script>

<style lang="sass">
.navbar-brand .navbar-item
  font-weight: bold
  font-size: 150%
  text-transform: uppercase
</style>
