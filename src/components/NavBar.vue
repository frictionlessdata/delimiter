<template>
  <nav
    class="navbar is-dark"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link
        class="navbar-item"
        to="/">
        Delimiter
      </router-link>

      <a
        role="button"
        class="navbar-burger burger"
        :class="{ 'is-active': isNavBarExpanded }"
        aria-label="menu"
        aria-expanded="false"
        @click="isNavBarExpanded = !isNavBarExpanded">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div
      class="navbar-menu"
      :class="{ 'is-active': isNavBarExpanded }">
      <div class="navbar-start">
        <router-link
          to="/"
          class="navbar-item">
          Home
        </router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <p class="control">
            <router-link
              v-if="isFileLoaded"
              :to="saveLink"
              class="button">
              <span class="icon">
                <font-awesome-icon icon="save" />
              </span>
              <span>Save</span>
            </router-link>
          </p>
        </div>
        <div
          v-if="isLoggedIn"
          class="navbar-item has-dropdown"
          :class="{'is-active': isDropdownExpanded}">
          <a
            class="navbar-link"
            @click="isDropdownExpanded = !isDropdownExpanded">
            {{ user.username }}
          </a>
          <div class="navbar-dropdown is-right">
            <a
              class="navbar-item"
              @click.prevent="$emit('logout')">
              Logout
            </a>
          </div>
        </div>
        <a
          v-else
          :href="loginLink"
          class="navbar-item">
          Login
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { stringify } from 'query-string'

export default {
  props: {
    isFileLoaded: {
      type: Boolean,
      default: false
    },
    fileLocation: {
      type: Object,
      default: () => ({})
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isNavBarExpanded: false,
      isDropdownExpanded: false
    }
  },
  computed: {
    isLoggedIn () {
      return !!this.user.authToken
    },
    saveLink () {
      const { origin, repo, branch, path } = this.fileLocation
      return `/compare/${origin}/${repo}/${branch}/${path}`
    },
    loginLink () {
      const githubUrl = 'https://github.com/login/oauth/authorize'
      const params = {
        client_id: process.env.VUE_APP_GITHUB_CLIENT_ID,
        redirect_uri: window.location.href,
        scope: 'public_repo'
      }
      return `${githubUrl}?${stringify(params)}`
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
